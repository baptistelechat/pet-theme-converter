# 🐾 pet-theme-converter — RFC & Roadmap

> Convertisseur universel de spritesheets de pets animés vers des thèmes compatibles avec les desktop pet apps pour agents IA (Claude Code, Codex CLI, Cursor...).

---

## 🧭 Contexte & Genèse

### L'écosystème Codex Pets

OpenAI a introduit dans son app **Codex Desktop** un système de compagnons animés appelés **pets** — des overlays flottants en pixel art qui réagissent en temps réel à l'état de l'agent (thinking, working, error, sleeping...).

La communauté a rapidement créé **[Petdex](https://petdex.crafter.run/)**, une galerie publique de 190+ pets open-source installables via :

```bash
npx petdex install boba
```

Chaque pet est distribué sous la forme d'une **spritesheet `.webp`** (grille 8×9, cellules 192×208px = 1536×1872px total) accompagnée d'un **`pet.json`** décrivant les états et frames.

Les 9 états standardisés dans l'écosystème Petdex sont :

| Row | État | Frames |
|-----|------|--------|
| 0 | `idle` | 6 |
| 1 | `run right` | 8 |
| 2 | `run left` | 8 |
| 3 | `waving` | 4 |
| 4 | `jumping` | 5 |
| 5 | `failed` | 8 |
| 6 | `waiting` | 6 |
| 7 | `running` | 8 |
| 8 | `review` | 6 |

---

### Le problème identifié

Ces spritesheets sont **exclusivement conçues pour Codex**. Pourtant, des desktop pet apps open-source existent pour **Claude Code** et d'autres agents — et elles ont leur propre système de thèmes custom qui accepte des fichiers APNG/GIF animés.

**Il n'existe aucun pont entre les deux écosystèmes.**

---

## 🗺️ Panorama des desktop pets pour agents IA

| Projet | Stack | Claude Code | Codex | Thèmes custom | OS | Statut |
|--------|-------|:-----------:|:-----:|:-------------:|-----|--------|
| **[Clawd on Desk](https://github.com/rullerzhou-afk/clawd-on-desk)** | Electron + Node | ✅ Full | ✅ | ✅ SVG/GIF/APNG | Win/Mac/Linux | ✅ Actif |
| **[Clyde](https://github.com/QingJ01/Clyde)** | Tauri 2 + Svelte 5 | ✅ Full | ✅ | ✅ SVG | Win/Mac/Linux | ✅ Actif |
| **[claude-pet](https://github.com/IMMINJU/claude-pet)** | Tauri 2 + HTML | ✅ Full | ❌ | ❌ emoji only | Win/Mac/Linux | 🟡 Partiel |
| **[clawd-tank](https://github.com/marciogranzotto/clawd-tank)** | SDL2 + Python | ✅ Full | ❌ | ❌ fixe | macOS only | 🟡 Partiel |

### Pourquoi Clawd on Desk est la cible principale

- **Référencé** dans `awesome-claude-code` (liste officielle communautaire)
- **Le plus riche en features** : 8+ agents supportés, permission bubbles, multi-sessions, DND, i18n
- **Thèmes custom complets** : accepte SVG, GIF, APNG, WebP, PNG
- **Minimum viable** : 1 fichier idle (SVG) + 7 fichiers animés (GIF/APNG)
- **Windows, macOS, Linux** — cross-platform natif
- **Aucune PR existante** sur la compatibilité Petdex ou spritesheet converter ✅

### Clyde comme cible secondaire

Fork de Clawd on Desk, réécrit en **Tauri 2 + Svelte 5 + Rust** — stack plus légère, même système de hooks Claude Code, renderer SVG. Format de thème probablement compatible.

---

## 📐 Format des thèmes Clawd on Desk

### Structure attendue par Clawd on Desk (format natif)

```
themes/
  mon-pet/
    theme.json
    idle.svg              ← format natif Clawd : SVG avec eye tracking
    thinking.apng         ← ou .gif, .webp, .png
    working.apng
    error.apng
    happy.apng
    notification.apng
    sleeping.apng
    waking.apng
```

### Structure générée par pet-theme-converter (notre output)

Notre convertisseur ne génère **que des APNG** (pas de SVG), placés dans un sous-dossier `assets/` :

```
boba/
  theme.json
  assets/
    idle.apng
    thinking.apng
    working.apng
    error.apng
    happy.apng
    notification.apng
    sleeping.apng
    waking.apng
```

> Clawd on Desk accepte les APNG pour tous les états y compris `idle` — le SVG n'est requis que pour activer l'eye tracking natif, feature optionnelle non couverte par ce convertisseur.

### États Clawd on Desk

| État Clawd | Déclencheur agent | Équivalent Petdex | Row |
|-----------|-------------------|-------------------|-----|
| `idle` | Aucune session active | `idle` | 0 |
| `thinking` | `UserPromptSubmit` | `waiting` | 6 |
| `working` | `PreToolUse` | `running` | 7 |
| `error` | `StopFailure` | `failed` | 5 |
| `happy` | `Stop` (succès) | `waving` | 3 |
| `notification` | `Notification` | `review` | 8 |
| `sleeping` | Session inactive | *(idle long)* | 0 |
| `waking` | `SessionStart` | `jumping` | 4 |

> **Note** : `run right` (row 1) et `run left` (row 2) n'ont pas d'équivalent direct dans Clawd. Ils peuvent être fusionnés ou ignorés selon le pet.

---

## 🎯 Stratégie de distribution

### Pourquoi un package npm indépendant

Trois approches ont été envisagées :

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| PR côté Clawd on Desk | Plug & play natif | Dépend du mainteneur, couplé à Clawd |
| PR côté Petdex | Touche tous les users Petdex | Petdex est Codex-first, intérêt incertain |
| **Package npm indépendant** ✅ | 100% autonome, multi-cibles | Besoin de référencer chez les autres |

**La bonne approche :** publier `pet-theme-converter` sur npm, puis faire des **mini PRs de documentation** (2 lignes dans un README) sur chaque marketplace/app cible.

```
1. npm publish pet-theme-converter
2. PR Petdex   → mention dans README
3. PR Clawd    → mention dans docs/guides/
4. PR Clyde    → mention dans README
5. ...
```

Les PRs "ajout d'une ligne de doc" sont acceptées en 24h. Les PRs "ajout de code" peuvent traîner des semaines.

---

## 🏗️ Architecture du convertisseur

### Principe

Le convertisseur est découpé en **deux couches** :

```
[ spritesheet source ]  →  [ Core Converter ]  →  [ Output Adapter ]
  (URL ou chemin local)      (logique pure)         (Clawd, Clyde, ...)
```

Le **Core** est agnostique — il prend une spritesheet, la découpe en frames et assemble des APNGs. Les **Output adapters** sont interchangeables et définissent le format de sortie (structure de dossier, `theme.json`).

Les marketplaces (Petdex, etc.) ne sont **pas dans le code** — elles sont juste documentées dans le README comme sources de spritesheets compatibles.

### Le format intermédiaire `SpriteManifest`

Le Core s'appuie sur un `SpriteManifest` qui décrit la grille. Il est **auto-détecté** depuis le format standard Codex/Petdex (grille 8×9, 192×208px) — pas besoin de le passer manuellement.

```ts
interface SpriteManifest {
  frameWidth: number       // largeur d'une frame en px (défaut : 192)
  frameHeight: number      // hauteur d'une frame en px (défaut : 208)
  cols: number             // colonnes dans la grille (défaut : 8)
  states: {
    [stateName: string]: {
      row: number          // quelle ligne dans la grille
      frameCount: number   // nombre de frames dans cette row
      fps?: number         // vitesse d'animation (défaut : 8)
    }
  }
}
```

### Structure du repo

```
pet-theme-converter/
  src/
    core/
      converter.ts         ← découpe spritesheet → frames → APNG
      types.ts             ← SpriteManifest + interfaces
    adapters/
      output/
        clawd.ts           ← génère theme.json + APNGs pour Clawd on Desk
        clyde.ts           ← (v0.3) génère thème pour Clyde
    cli.ts                 ← point d'entrée CLI
  package.json
  README.md
```

### Dépendances techniques

| Package | Rôle |
|---------|------|
| `sharp` | Décodage `.webp`, découpe des frames |
| `apngasm-bin` | Assemblage des frames en APNG animé |
| `@clack/prompts` | CLI interactif |

### Format de sortie : APNG

Le choix **APNG plutôt que SVG animé** est délibéré :
- La source est un `.webp` (raster) → conversion en SVG ajouterait une couche inutile
- L'APNG est nativement supporté par Clawd on Desk
- Pipeline simple : `webp → frames PNG → APNG`

---

## 🖥️ Interface CLI

Le convertisseur est un **CLI interactif** — tu lances `npx pet-theme-converter` et il te pose 3 questions. Pas de flags à retenir, pas de doc à consulter.

```bash
npx pet-theme-converter

┌ 🐾 pet-theme-converter
│
◇ Source de la spritesheet ? (URL ou chemin local)
│ https://pub-xxx.r2.dev/curated/boba/spritesheet.webp
│
◇ Nom du thème ?
│ boba
│
◇ Mode de sortie ?
│ ● ZIP (installation manuelle)
│ ○ Installer directement sur ce PC
│
◆ Conversion en cours...
│ ✓ Spritesheet téléchargée
│ ✓ 8 états extraits
│ ✓ APNGs générés
│ ✓ theme.json créé
│
└ ✅ boba-clawd-theme.zip prêt !
```

### Détail des modes de sortie

| Mode | Résultat |
|------|----------|
| **ZIP** | `<nom-pet>-clawd-theme.zip` dans le dossier courant, à dézipper dans `themes/` de Clawd |
| **Install direct** | Copie automatiquement dans le répertoire Clawd on Desk de l'OS |

### Chemins d'installation selon l'OS (mode install direct)

| OS | Chemin cible |
|----|-------------|
| Windows | `%APPDATA%\clawd-on-desk\themes\<nom-pet>\` |
| macOS | `~/Library/Application Support/clawd-on-desk/themes/<nom-pet>/` |
| Linux | `~/.config/clawd-on-desk/themes/<nom-pet>/` |

### Dépendance CLI

```bash
# Lib utilisée pour le CLI interactif
@clack/prompts
```

---

## 💡 Vision du projet

- **Un repo npm léger** — tu maintiens juste le convertisseur, pas les apps, pas les marketplaces
- **Tu deviens le pont** entre l'écosystème Codex/Petdex et l'écosystème Claude Code
- **Zéro dépendance** sur les mainteneurs des autres repos pour que ça fonctionne
- **Gros potentiel** — chaque nouvelle marketplace qui émerge, t'as juste un adapter à ajouter

---

## 🗓️ Roadmap

### v0.1 — MVP

- [ ] ✅ Core : découpe spritesheet (URL ou local) → frames → APNG par état
- [ ] ✅ Output adapter : Clawd on Desk (`theme.json` + APNGs)
- [ ] ✅ CLI : `npx pet-theme-converter`
- [ ] ✅ `npm publish`

### v0.2 — Documentation

- [ ] 📝 README principal : usage + sources de spritesheets compatibles (Petdex, etc.)
- [ ] 📝 Guide "Comment ajouter un thème dans Clawd on Desk"
- [ ] 📝 PR Petdex : mention dans leur `README.md`
- [ ] 📝 PR Clawd on Desk : mention dans leur `docs/guides/`

### v0.3 — Extensibilité

- [ ] 🔌 Output adapter : Clyde
- [ ] 📝 PR Clyde : mention dans leur `README.md`
- [ ] 🔌 Support multi-output en une commande : `--output clawd,clyde`
- [ ] 🧪 Tests unitaires sur le core

---

## 📎 Références

| Ressource | URL |
|-----------|-----|
| Petdex gallery | https://petdex.crafter.run |
| Petdex GitHub | https://github.com/crafter-station/petdex |
| Clawd on Desk | https://github.com/rullerzhou-afk/clawd-on-desk |
| Clawd on Desk — guide thèmes | `docs/guides/guide-theme-creation.md` |
| Clyde | https://github.com/QingJ01/Clyde |
| claude-pet | https://github.com/IMMINJU/claude-pet |
| clawd-tank | https://github.com/marciogranzotto/clawd-tank |
| awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code |
| Boba spritesheet | https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/curated/boba/spritesheet.webp |
| Boba pet.json | https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/curated/boba/pet.json |
