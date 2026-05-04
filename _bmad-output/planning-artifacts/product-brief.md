# Product Brief : pet-theme-converter

> Version 1.0 — 2026-05-04

---

## Résumé exécutif

`pet-theme-converter` est un outil CLI open-source qui construit le premier pont entre deux écosystèmes de compagnons animés jusqu'ici incompatibles : les 190+ pets pixel-art de Petdex (conçus pour Codex Desktop d'OpenAI) et les applications desktop pet pour Claude Code et autres agents IA (Clawd on Desk, Clyde...).

En une commande `npx pet-theme-converter`, un développeur convertit n'importe quelle spritesheet `.webp` au format Codex vers un thème APNG installable directement dans son application de compagnon. Ce qui prenait plusieurs heures de découpe manuelle dans Photoshop devient un processus interactif de 30 secondes.

Le projet est distribué sur npm de façon entièrement autonome — il ne dépend d'aucun mainteneur tiers pour fonctionner. Son architecture en Core + Output Adapters le rend extensible : chaque nouvelle app de compagnon IA n'est qu'un adapter à écrire.

---

## Le problème

La galerie **Petdex** regroupe plus de 190 pets pixel-art open-source, créés par la communauté et installables dans Codex Desktop (`npx petdex install <pet>`). Chaque pet est livré sous la forme d'une spritesheet `.webp` (grille 8×9, 192×208px par cellule) accompagnée d'un `pet.json` décrivant 9 états comportementaux.

Pourtant, les applications desktop pet pour Claude Code — **Clawd on Desk** (référencé dans `awesome-claude-code`), **Clyde** et d'autres — utilisent un format de thème radicalement différent : des fichiers APNG distincts par état (`idle`, `thinking`, `working`, `error`...) plutôt qu'une spritesheet unifiée.

**Résultat : les 190+ pets de Petdex sont techniquement inexploitables dans les apps Claude Code.**

Un utilisateur de Clawd on Desk qui veut le pet "Boba" doit soit découper la spritesheet manuellement dans Photoshop ou GIMP, soit se passer de customisation. Aucun outil, aucun script, aucun bridge n'existe aujourd'hui.

---

## La solution

`pet-theme-converter` est un CLI npm interactif. L'utilisateur lance `npx pet-theme-converter`, répond à 3 questions, et récupère un thème prêt à l'emploi en moins d'une minute :

```
┌ 🐾 pet-theme-converter
│
◇ Source de la spritesheet ? → https://.../boba/spritesheet.webp
◇ Nom du thème ?             → boba
◇ Mode de sortie ?           → ZIP (installation manuelle)
│
└ ✅ boba-clawd-theme.zip prêt !
```

Sous le capot, l'outil :

1. Télécharge ou lit la spritesheet `.webp`
2. Auto-détecte le format standard Codex (grille 8×9, 192×208px)
3. Découpe les frames et assemble des APNG animés par état
4. Génère un `theme.json` compatible avec l'application cible
5. Livre en ZIP ou installe directement (Windows / macOS / Linux)

Le mapping d'états est pré-configuré — les 9 états Petdex sont traduits vers les 8 états Clawd on Desk (`idle → idle`, `waiting → thinking`, `running → working`, `failed → error`, `waving → happy`, `review → notification`, `jumping → waking`). Les 2 états sans équivalent (`run right`, `run left`) sont ignorés silencieusement.

---

## Ce qui le différencie

**Zéro friction** — pas de flags à mémoriser, pas de documentation à consulter. Le CLI pose exactement les 3 questions dont il a besoin, rien de plus.

**Autonomie totale** — publié sur npm, aucune dépendance sur les mainteneurs de Petdex, Clawd ou Clyde. Le pont fonctionne indépendamment de toute collaboration tierce. La stratégie de distribution (npm publish + mini PRs de documentation de 2 lignes dans les READMEs) permet une adoption progressive sans friction.

**Architecture extensible** — le Core de conversion est découplé des Output Adapters. Ajouter le support Clyde revient à écrire un adapter supplémentaire sans toucher à la logique centrale. Chaque nouvelle app de compagnon est un adapter, pas un fork.

**Format standard, pas marketplace spécifique** — le convertisseur accepte toute spritesheet respectant le format Codex (grille 8×9, 192×208px), qu'elle vienne de Petdex, d'une future marketplace, ou d'un fichier local. Les formats non-standard déclenchent un avertissement non-bloquant plutôt qu'un rejet.

---

## À qui ça s'adresse

**Utilisateur primaire** : développeur utilisant Claude Code avec une application desktop pet (Clawd on Desk principalement), qui a repéré un pet sur Petdex et veut le réutiliser dans son environnement de travail.

Profil type : il connaît `npx`, il est à l'aise avec un CLI, il n'a pas envie de passer une heure dans Photoshop. Il veut que "ça marche" sans réfléchir au format.

**Utilisateur secondaire** : créateur de pets Petdex qui veut étendre la portée de ses créations au-delà de l'écosystème Codex, sans effort supplémentaire de sa part.

---

## Critères de succès

| Signal                | Indicateur cible                                                |
| --------------------- | --------------------------------------------------------------- |
| Adoption initiale     | 100 downloads npm dans la semaine suivant l'annonce             |
| Visibilité écosystème | PRs de documentation acceptées sur Petdex, Clawd on Desk, Clyde |
| Qualité d'output      | 0 bug critique signalé sur les 10 premiers pets convertis       |
| Extensibilité         | Adapter Clyde livré en v0.3 sans modification du Core           |

---

## Périmètre

### V0.1 — MVP (dans le scope)

- Core : découpe spritesheet (URL ou local) → frames → APNG par état
- Output adapter : Clawd on Desk (`theme.json` + APNGs)
- CLI interactif : `npx pet-theme-converter` (ZIP ou install direct)
- Publication npm

### Hors scope — V0.1

- SVG animé (source raster, couche sans valeur ajoutée)
- Support Clyde (prévu en v0.3)
- Override manuel de la grille via CLI (prévu en v0.2+)
- Génération du SVG natif Clawd pour l'eye tracking (feature optionnelle)

---

## Vision

Si `pet-theme-converter` réussit, il devient l'infrastructure invisible de l'écosystème des desktop pets pour agents IA.

**À 6 mois** : référencé dans les READMEs de Petdex, Clawd on Desk et Clyde. Chaque nouvelle marketplace de pets l'intègre dans sa documentation de démarrage. La communauté commence à contribuer des adapters pour de nouvelles apps.

**À 2 ans** : quand une nouvelle application de compagnon IA émerge, un adapter `pet-theme-converter` existe avant la première release stable. Le convertisseur est le point d'entrée standard pour distribuer un pet dans plusieurs écosystèmes simultanément — le `ffmpeg` des compagnons pixel-art.
