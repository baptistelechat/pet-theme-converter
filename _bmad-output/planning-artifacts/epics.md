---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-01-confirmed"
  - "step-02-design-epics"
  - "step-03-epic-1"
  - "step-03-epic-2"
  - "step-03-epic-3"
  - "step-03-epic-4"
  - "step-04-final-validation"
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
---

# pet-theme-converter - Epic Breakdown

## Overview

Ce document présente le découpage complet en epics et stories pour `pet-theme-converter`, décomposant les requirements du PRD et de l'Architecture en stories implémentables.

## Requirements Inventory

### Functional Requirements

**Acquisition de la Spritesheet**

FR1: L'utilisateur peut fournir une URL distante comme source de spritesheet
FR2: L'utilisateur peut fournir un chemin local (absolu ou relatif) comme source de spritesheet
FR3: Le système valide que l'URL fournie pointe vers une ressource image (Content-Type HTTP) avant tout traitement
FR4: Le système applique un timeout de 30 secondes au téléchargement d'une spritesheet distante pour éviter les blocages indéfinis

**Traitement & Conversion**

FR5: Le système détecte automatiquement les dimensions de la grille de la spritesheet (colonnes, hauteur et largeur de cellule)
FR6: Le système découpe la spritesheet en frames individuelles selon le mapping d'états Petdex → Clawd on Desk
FR7: Le système génère un APNG animé pour chacun des 8 états Clawd on Desk (`idle`, `thinking`, `working`, `error`, `happy`, `notification`, `sleeping`, `waking`)
FR8: Le système signale à l'utilisateur si les dimensions détectées diffèrent du format Codex standard (192×208px, grille 8×9) sans bloquer la conversion
FR9: Le message de warning affiche les dimensions réellement détectées et les dimensions attendues

**Génération du Thème**

FR10: Le système génère un fichier `theme.json` conforme à la spec Clawd on Desk v1.x
FR11: Le `theme.json` inclut un champ `compatibleWith` indiquant explicitement la version cible de Clawd on Desk
FR12: Le système organise les fichiers générés dans la structure `<nom-pet>/theme.json` + `<nom-pet>/assets/*.apng`
FR13: Le système produit une archive ZIP contenant le thème complet prêt à l'installation manuelle

**Interface CLI**

FR14: L'utilisateur peut démarrer le convertisseur avec `npx pet-theme-converter` sans argument
FR15: Le CLI guide l'utilisateur via 3 prompts séquentiels : source de la spritesheet, nom du thème, mode de sortie
FR16: Le CLI affiche une progression nommée pendant la conversion (téléchargement → découpe → génération APNG → packaging)
FR17: Le CLI retourne un exit code standard à la fin de chaque exécution (`0` succès, `1` erreur générique, `2` format invalide, `3` erreur d'installation)
FR18: L'utilisateur peut saisir manuellement le chemin d'installation de Clawd on Desk si la détection automatique échoue

**Feedback & Gestion des Erreurs**

FR19: Le CLI affiche un message d'erreur explicite et actionnable en cas d'URL inaccessible ou de timeout réseau
FR20: Le CLI affiche un message d'erreur explicite si le Content-Type de l'URL n'est pas une image
FR21: Le CLI affiche un message d'erreur explicite si la spritesheet ne peut pas être décodée ou découpée
FR22: Le CLI affiche un warning non-bloquant si les dimensions de la spritesheet diffèrent du format Codex standard
FR23: Le CLI affiche un disclaimer de licence à l'issue de chaque conversion réussie
FR24: Le CLI informe l'utilisateur explicitement si le mode Install direct est indisponible (Clawd non détecté)

**Livraison du Thème**

FR25: L'utilisateur peut recevoir le thème sous forme d'archive ZIP dans le dossier courant (option toujours disponible)
FR26: L'utilisateur peut installer le thème directement dans le répertoire Clawd on Desk de l'OS (option disponible uniquement si Clawd est détecté)
FR27: Le système détecte automatiquement la présence de Clawd on Desk via les chemins standards de chaque OS (Windows, macOS, Linux)
FR28: L'option Install direct n'est présentée que si Clawd on Desk est détecté ou si l'utilisateur a fourni un chemin manuel valide

**Compatibilité Écosystème**

FR29: Le système accepte toute spritesheet respectant le format Codex (grille 8×9, 192×208px), quelle que soit sa marketplace source
FR30: Le thème généré est utilisable dans Clawd on Desk sans modification manuelle supplémentaire
FR31: Le README documente explicitement la version de Clawd on Desk ciblée par l'adapter

**Extensibilité & Contribution**

FR32: Un développeur tiers peut implémenter un Output Adapter pour une nouvelle application de compagnon en implémentant l'interface `OutputAdapter` documentée
FR33: Le système sépare la logique de conversion (Core) des modules de génération de sortie (Adapters) de façon à ce qu'un adapter soit développable sans modifier le Core
FR34: Le repo expose un `CONTRIBUTING.md` décrivant la procédure pour écrire et soumettre un nouvel adapter

### NonFunctional Requirements

NFR1: La conversion complète d'une spritesheet standard (192×208px, grille 8×9) s'exécute en moins de 60 secondes sur une machine de développement standard avec une connexion internet normale
NFR2: Le téléchargement d'une spritesheet distante est soumis à un timeout de 30 secondes ; au-delà, le CLI interrompt la tentative et affiche un message d'erreur explicite (FR19)
NFR3: La génération des 8 APNGs est entièrement locale après le téléchargement — aucune dépendance réseau pour le traitement
NFR4: Le package s'installe et fonctionne sur Windows 10+, macOS 12+, Ubuntu 20.04+
NFR5: Compatibilité garantie avec Node.js LTS ≥ 18.x (Node 18 et Node 20 validés en CI avant publication)
NFR6: L'installation via `npx` fonctionne sans droits administrateur sur les 3 OS cibles
NFR7: Les binaires natifs (`sharp`, `apngasm-bin`) sont déclarés en `optionalDependencies` par plateforme pour éviter les échecs d'installation sur des configurations non-standard
NFR8: Le CLI ne se termine jamais silencieusement — chaque exécution produit soit un artefact valide, soit un message d'erreur explicite accompagné d'un exit code non-zéro
NFR9: Un warning non-bloquant (FR8, FR22) n'interrompt jamais le processus de conversion — la conversion continue et produit un résultat
NFR10: En cas d'échec partiel, le CLI indique précisément l'état des artefacts produits avant l'échec
NFR11: Les messages d'erreur et de warning ne transmettent pas d'information uniquement via la couleur du texte — chaque message est compréhensible en plain text
NFR12: Les outputs sont lisibles dans des contextes non-TTY (redirection vers fichier, pipes) sans formatage ANSI cassé

### Additional Requirements

_Requirements techniques issus de l'Architecture qui impactent la création des stories :_

- **Setup projet greenfield manuel** : pas de framework CLI (oclif/commander écarté) — initialisation via `pnpm init` + création manuelle de `package.json`, `tsconfig.json`, `tsup.config.ts`
- **Stack TypeScript 5.x strict** : `"type": "module"` dans `package.json` — ESM natif, syntaxe `import/export` partout, no CommonJS
- **Build** : `tsup` (bundle ESM optimisé pour npm, shebang `#!/usr/bin/env node`) ; **Dev** : `tsx` pour exécution directe
- **Champs critiques `package.json`** : `type: "module"`, `bin: { "pet-theme-converter": "./dist/index.js" }`, `files: ["dist/", "README.md"]`, `engines: { "node": ">=18.0.0" }`, `optionalDependencies` pour `sharp` et `apngasm-bin`
- **Types publics en premier** (`src/types.ts`) : `ClawdState`, `ThemeManifest`, `AdapterInput`, `AdapterOutput`, `OutputAdapter`, `ProgressCallback`, `FetchError` (exitCode=1), `ValidationError` (exitCode=2), `InstallError` (exitCode=3)
- **Pipeline fonctionnel pur** : chaque fonction Core accepte `onProgress?: ProgressCallback` — le Core ne dépend jamais de `@clack/prompts` (isolation stricte dans `src/cli/` uniquement)
- **STATE_MAPPING centralisé** dans `src/core/state-mapping.ts` — jamais inline
- **Chemins Clawd OS** à documenter dans `src/adapters/clawd.ts` : Windows `%LOCALAPPDATA%\Clawd on Desk\themes\`, macOS `~/Library/Application Support/Clawd on Desk/themes\`, Linux `~/.config/clawd-on-desk/themes/`
- **Librairie ZIP** : `archiver` (BDR-010)
- **CI GitHub Actions** : matrice `3 OS × Node 18/20` (windows-latest, macos-latest, ubuntu-latest)
- **Frontières architecturales strictes** : `types.ts → core/* → adapters/* → cli/*` (imports en sens unique uniquement)
- **`.npmignore`** : exclure `src/`, `*.test.ts`, `.github/` du package publié
- **Vitest** : hors scope v0.1 (à configurer en v0.2)
- **Publication npm manuelle** en v0.1 par Baptiste après validation 10 pets sur 3 OS

### UX Design Requirements

_Aucun document UX Design disponible — ce projet est un CLI sans interface graphique. Les exigences d'accessibilité CLI (non-TTY, couleur non exclusive) sont couvertes dans les NFR (NFR11, NFR12)._

### FR Coverage Map

FR1 → Epic 2 — fetch URL distante dans `fetch-spritesheet.ts`
FR2 → Epic 2 — fetch chemin local dans `fetch-spritesheet.ts`
FR3 → Epic 2 — validation Content-Type dans `fetch-spritesheet.ts`
FR4 → Epic 2 — timeout 30s dans `fetch-spritesheet.ts`
FR5 → Epic 2 — détection grille automatique dans `detect-grid.ts`
FR6 → Epic 2 — découpe frames dans `slice-frames.ts` + `state-mapping.ts`
FR7 → Epic 2 — génération 8 APNGs dans `encode-apngs.ts`
FR8 → Epic 2 — warning hors-standard dans `detect-grid.ts`
FR9 → Epic 2 — message warning avec dimensions réelles dans `detect-grid.ts`
FR10 → Epic 3 — génération `theme.json` dans `clawd.ts`
FR11 → Epic 3 — champ `compatibleWith` dans `clawd.ts`
FR12 → Epic 3 — structure `<nom-pet>/assets/` dans `clawd.ts`
FR13 → Epic 3 — archive ZIP dans `clawd.ts`
FR14 → Epic 3 — entry point `npx` dans `cli/index.ts`
FR15 → Epic 3 — 3 prompts séquentiels dans `cli/prompts.ts`
FR16 → Epic 3 — barre de progression dans `cli/prompts.ts`
FR17 → Epic 3 — exit codes 0/1/2/3 dans `cli/index.ts`
FR18 → Epic 3 — saisie manuelle chemin Clawd dans `cli/prompts.ts` + `clawd.ts`
FR19 → Epic 3 — message erreur URL/timeout dans `cli/messages.ts`
FR20 → Epic 3 — message erreur Content-Type dans `cli/messages.ts`
FR21 → Epic 3 — message erreur décodage/découpe dans `cli/messages.ts`
FR22 → Epic 3 — warning non-bloquant dans `cli/messages.ts`
FR23 → Epic 3 — disclaimer licence dans `cli/messages.ts`
FR24 → Epic 3 — info Install direct indisponible dans `cli/messages.ts`
FR25 → Epic 3 — mode ZIP dans `clawd.ts`
FR26 → Epic 3 — Install direct dans `clawd.ts`
FR27 → Epic 3 — détection Clawd par chemins OS dans `clawd.ts`
FR28 → Epic 3 — affichage conditionnel Install direct dans `cli/prompts.ts` + `clawd.ts`
FR29 → Epic 2 — format Codex universel dans `fetch-spritesheet.ts` + `detect-grid.ts`
FR30 → Epic 3 — thème utilisable sans modification (qualité output `clawd.ts`)
FR31 → Epic 4 — README avec version Clawd ciblée
FR32 → Epic 1 — interface `OutputAdapter` dans `src/types.ts`
FR33 → Epic 1 — découplage Core/Adapters dans architecture skeleton
FR34 → Epic 1 — `CONTRIBUTING.md` dans repo

## Epic List

### Epic 1: Fondation du Projet & Architecture de Contribution

Un contributeur peut cloner le repo, comprendre l'architecture Core/Adapters, et savoir comment écrire un adapter pour une nouvelle app de compagnon — sans toucher au Core.

**FRs couverts :** FR32, FR33, FR34

---

### Epic 2: Pipeline de Conversion Core

Le moteur de conversion transforme n'importe quelle spritesheet au format Codex en 8 APNGs animés par état Clawd, avec gestion complète des erreurs typées et avertissement non-bloquant pour les formats hors-standard.

**FRs couverts :** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR29

---

### Epic 3: Expérience CLI & Livraison du Thème Clawd

Un utilisateur lance `npx pet-theme-converter`, répond à 3 questions interactives, et reçoit son thème Clawd on Desk — en ZIP dans le dossier courant ou installé directement — avec messages de progression, d'erreur et disclaimer licence à chaque étape.

**FRs couverts :** FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28, FR30

---

### Epic 4: CI, Documentation & Publication npm

Le package est fiable (CI validée sur 3 OS × Node 18/20), documenté pour la découverte (README avec version Clawd ciblée), et disponible publiquement via `npx`.

**FRs couverts :** FR31

---

## Epic 1: Fondation du Projet & Architecture de Contribution

Un contributeur peut cloner le repo, comprendre l'architecture Core/Adapters, et savoir comment écrire un adapter pour une nouvelle app de compagnon — sans toucher au Core.

### Story 1.1 : Initialisation du projet et configuration du build

En tant que développeur,
Je veux un projet Node.js CLI fonctionnel avec TypeScript strict, ESM natif, et la bonne configuration de build/dev,
Afin de pouvoir commencer à implémenter le convertisseur avec le bon outillage en place dès le premier commit.

**Critères d'acceptation :**

**Étant donné** que je clone le repo et lance `pnpm install`
**Quand** je lance `pnpm build`
**Alors** `dist/index.js` est généré avec un shebang `#!/usr/bin/env node` et est exécutable via Node.js

**Étant donné** que j'inspecte `package.json`
**Quand** je vérifie ses champs critiques
**Alors** il contient : `"type": "module"`, `"bin": { "pet-theme-converter": "./dist/index.js" }`, `"files": ["dist/", "README.md"]`, `"engines": { "node": ">=18.0.0" }`, `sharp` et `apngasm-bin` en `optionalDependencies`, les scripts `"build": "tsup"` et `"dev": "tsx src/cli/index.ts"`

**Étant donné** que j'inspecte `tsconfig.json`
**Quand** je vérifie ses options de compilation
**Alors** il contient `"strict": true`, `"module": "ESNext"`, `"target": "ESNext"`, `"moduleResolution": "bundler"`

**Étant donné** que j'inspecte `tsup.config.ts`
**Quand** je vérifie sa configuration
**Alors** il bundle `src/cli/index.ts` en format ESM, cible Node.js, et injecte le shebang `#!/usr/bin/env node`

**Étant donné** que `.gitignore` et `.npmignore` sont créés
**Quand** je les inspecte
**Alors** `.gitignore` exclut `dist/` et `node_modules/`
**Et** `.npmignore` exclut `src/`, `*.test.ts` et `.github/`

---

### Story 1.2 : Interface publique OutputAdapter et types partagés

En tant que contributeur souhaitant ajouter le support d'une nouvelle app de compagnon,
Je veux une interface `OutputAdapter` clairement typée avec tous les types partagés dans un fichier unique,
Afin de pouvoir implémenter mon adapter sans lire ni toucher au code Core ou CLI.

**Critères d'acceptation :**

**Étant donné** que `src/types.ts` est créé
**Quand** j'inspecte ses exports
**Alors** il exporte : `ClawdState` (union des 8 états : `idle | thinking | working | error | happy | notification | sleeping | waking`), `ThemeManifest` (interface avec `name`, `compatibleWith`, `version`), `AdapterInput` (interface avec `apngs: Record<ClawdState, Buffer>`, `manifest: ThemeManifest`, `outputDir: string`), `AdapterOutput` (interface avec `mode: 'zip' | 'install'`, `path: string`, `warnings?: string[]`), `OutputAdapter` (interface avec `generate(input: AdapterInput): Promise<AdapterOutput>`), `ProgressCallback` (type `(step: string, progress?: number) => void`)

**Étant donné** que `src/types.ts` est créé
**Quand** j'inspecte ses classes d'erreur
**Alors** il exporte `FetchError extends Error` avec `exitCode = 1 as const`, `ValidationError extends Error` avec `exitCode = 2 as const`, `InstallError extends Error` avec `exitCode = 3 as const`

**Étant donné** que tous les fichiers source existent (même en tant que stubs vides)
**Quand** je lance `pnpm build`
**Alors** zéro erreur de compilation TypeScript

**Étant donné** que tous les fichiers source existent
**Quand** j'inspecte leurs imports
**Alors** les fichiers `src/core/*` importent uniquement depuis `src/types.ts` — jamais depuis `src/cli/` ou `src/adapters/`
**Et** les fichiers `src/adapters/*` importent uniquement depuis `src/types.ts` — jamais depuis `src/cli/` ou `src/core/`
**Et** `@clack/prompts` est importé uniquement dans les fichiers `src/cli/`

---

### Story 1.3 : Documentation de contribution (CONTRIBUTING.md)

En tant que développeur souhaitant écrire un OutputAdapter pour une nouvelle app de compagnon,
Je veux une documentation claire et complète pour créer et soumettre un adapter,
Afin de pouvoir contribuer un adapter fonctionnel en une session sans avoir à lire le codebase Core.

**Critères d'acceptation :**

**Étant donné** que `CONTRIBUTING.md` existe à la racine du repo
**Quand** je lis la section "Écrire un Adapter"
**Alors** elle référence `src/types.ts` (pour l'interface) et mentionne `src/adapters/clawd.ts` comme exemple de référence à consulter une fois Epic 3 implémenté (placeholder acceptable : _"Voir `src/adapters/clawd.ts` — implémenté en Epic 3"_)
**Et** elle documente le contrat `OutputAdapter.generate()` : inputs reçus, outputs attendus, usage du champ `warnings`

**Étant donné** que `CONTRIBUTING.md` existe
**Quand** je lis la section setup
**Alors** elle inclut les étapes de dev (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm link`), le schéma des couches architecturales (Core/Adapters/CLI), et les règles de frontières de modules (isolation `@clack/prompts`, sens unique des imports)

**Étant donné** que `CONTRIBUTING.md` existe
**Quand** je lis la section soumission
**Alors** elle explique comment enregistrer le nouvel adapter dans `src/cli/index.ts` et comment ouvrir une PR

---

## Epic 2: Pipeline de Conversion Core

Le moteur de conversion transforme n'importe quelle spritesheet au format Codex en 8 APNGs animés par état Clawd, avec gestion complète des erreurs typées et avertissement non-bloquant pour les formats hors-standard.

### Story 2.1 : Téléchargement et validation de la spritesheet

En tant qu'utilisateur,
Je veux fournir une URL distante ou un chemin local comme source de spritesheet,
Afin que le système récupère le fichier de manière sécurisée avant tout traitement.

**Critères d'acceptation :**

**Étant donné** que je fournis une URL HTTPS valide pointant vers une image `.webp`
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction retourne un `Buffer` contenant les octets de l'image
**Et** le téléchargement s'effectue en moins de 30 secondes (NFR2)

**Étant donné** que je fournis une URL dont le téléchargement dépasse 30 secondes
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction lève une `FetchError` avec `exitCode = 1`

**Étant donné** que je fournis une URL valide mais dont le `Content-Type` HTTP n'est pas une image (ex. `text/html`)
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction lève une `ValidationError` avec `exitCode = 2`

**Étant donné** que je fournis un chemin local absolu ou relatif vers un fichier existant
**Quand** `fetchSpritesheet(path)` est appelé
**Alors** la fonction retourne un `Buffer` contenant le fichier sans requête réseau

**Étant donné** que je fournis un chemin local vers un fichier inexistant
**Quand** `fetchSpritesheet(path)` est appelé
**Alors** la fonction lève une `FetchError` avec `exitCode = 1`

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** la fonction est appelée
**Alors** le callback est appelé au démarrage du téléchargement avec un label de step explicite
**Et** la fonction fonctionne identiquement si `onProgress` est absent (paramètre optionnel)

---

### Story 2.2 : Détection de la grille et STATE_MAPPING

En tant que développeur,
Je veux que le système détecte automatiquement les dimensions de la grille de la spritesheet et avertisse si elles diffèrent du standard Codex,
Afin que la découpe soit correctement paramétrée et que l'utilisateur soit informé des écarts sans blocage.

**Critères d'acceptation :**

**Étant donné** un `Buffer` d'une spritesheet aux dimensions standard (1536×1872px = 8 colonnes × 9 lignes de 192×208px)
**Quand** `detectGrid(buffer)` est appelé
**Alors** la fonction retourne un objet `GridInfo` contenant `cols: 8`, `rows: 9`, `cellWidth: 192`, `cellHeight: 208`, et `isStandard: true`

**Étant donné** un `Buffer` d'une spritesheet aux dimensions non-standard (ex. 1520×1854px)
**Quand** `detectGrid(buffer)` est appelé
**Alors** la fonction retourne un `GridInfo` avec `isStandard: false`, les dimensions réellement détectées, et les dimensions attendues (`expectedWidth: 192`, `expectedHeight: 208`)
**Et** la fonction ne lève pas d'erreur — la conversion continue

**Étant donné** que `STATE_MAPPING` est défini dans `src/core/state-mapping.ts`
**Quand** je l'inspecte
**Alors** il exporte une constante `Record<ClawdState, { row: number; frames: number }>` couvrant les 8 états Clawd (`idle`, `thinking`, `working`, `error`, `happy`, `notification`, `sleeping`, `waking`)
**Et** il n'est jamais défini inline dans un autre module

---

### Story 2.3 : Découpe des frames par état

En tant que développeur,
Je veux que le système découpe la spritesheet en frames individuelles groupées par état Clawd selon le STATE_MAPPING,
Afin que chaque état dispose de ses frames brutes prêtes à l'encodage APNG.

**Critères d'acceptation :**

**Étant donné** un `Buffer` de spritesheet valide et un `GridInfo` retourné par `detectGrid`
**Quand** `sliceFrames(buffer, grid)` est appelé
**Alors** la fonction retourne un `Record<ClawdState, Buffer[]>` où chaque clé est un des 8 états Clawd
**Et** chaque tableau contient exactement le bon nombre de frames selon `STATE_MAPPING[state].frames`

**Étant donné** que `sharp` est utilisé pour la découpe
**Quand** une frame est extraite
**Alors** les coordonnées `left`, `top`, `width`, `height` sont calculées depuis `GridInfo` et `STATE_MAPPING` — jamais codées en dur

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** `sliceFrames` est appelé
**Alors** le callback est invoqué pour chaque état découpé avec un label lisible
**Et** la fonction fonctionne identiquement si `onProgress` est absent

---

### Story 2.4 : Encodage des APNGs par état

En tant que développeur,
Je veux que le système encode les frames brutes de chaque état en un `Buffer` APNG animé,
Afin que l'adapter Clawd dispose de 8 APNGs prêts à être packagés dans le thème.

**Critères d'acceptation :**

**Étant donné** un `Record<ClawdState, Buffer[]>` retourné par `sliceFrames`
**Quand** `encodeAPNGs(frames)` est appelé
**Alors** la fonction retourne un `Record<ClawdState, Buffer>` où chaque valeur est un Buffer APNG valide (magic bytes `\x89PNG` + chunk `acTL`)

**Étant donné** que `apngasm-bin` est utilisé pour l'encodage
**Quand** l'encodage d'un état échoue
**Alors** la fonction lève une `ValidationError` avec `exitCode = 2` et un message identifiant l'état concerné

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** `encodeAPNGs` est appelé
**Alors** le callback est invoqué pour chaque état encodé avec un label lisible (ex. `"Encodage APNG : idle"`)
**Et** la fonction fonctionne identiquement si `onProgress` est absent

**Étant donné** que l'encodage de tous les états est terminé
**Quand** je mesure le temps total (fetch + détection + découpe + encodage)
**Alors** il est inférieur à 60 secondes sur une connexion internet normale (NFR1)

---

## Epic 3: Expérience CLI & Livraison du Thème Clawd

Un utilisateur lance `npx pet-theme-converter`, répond à 3 questions interactives, et reçoit son thème Clawd on Desk — en ZIP dans le dossier courant ou installé directement — avec messages de progression, d'erreur et disclaimer licence à chaque étape.

### Story 3.1 : Génération du thème et packaging ZIP

En tant qu'utilisateur,
Je veux que le système génère un thème Clawd on Desk complet depuis les APNGs produits par le Core,
Afin de disposer d'une archive ZIP installable manuellement dans n'importe quel environnement.

**Critères d'acceptation :**

**Étant donné** un `AdapterInput` valide (8 APNGs + manifest + outputDir)
**Quand** `clawd.generate(input)` est appelé avec `mode: 'zip'`
**Alors** un fichier `<nom-pet>-clawd-theme.zip` est créé dans `outputDir`
**Et** l'archive contient : `<nom-pet>/theme.json` et `<nom-pet>/assets/idle.apng`, `thinking.apng`, `working.apng`, `error.apng`, `happy.apng`, `notification.apng`, `sleeping.apng`, `waking.apng`

**Étant donné** que `theme.json` est généré
**Quand** je l'inspecte
**Alors** il est conforme à la spec Clawd on Desk v1.x et contient le champ `compatibleWith` (ex. `"clawd-on-desk@1.x"`)

**Étant donné** que l'archive ZIP est créée via `archiver`
**Quand** je l'extrais
**Alors** les 8 fichiers APNG sont lisibles et non corrompus

**Étant donné** que `clawd.generate(input)` retourne un `AdapterOutput`
**Quand** je l'inspecte
**Alors** `mode` vaut `'zip'` et `path` contient le chemin absolu vers le fichier ZIP généré

---

### Story 3.2 : Détection de Clawd on Desk et installation directe

En tant qu'utilisateur ayant Clawd on Desk installé,
Je veux pouvoir installer le thème directement dans le répertoire Clawd sans manipulation manuelle,
Afin d'avoir mon pet disponible immédiatement après la conversion.

**Critères d'acceptation :**

**Étant donné** que Clawd on Desk est installé dans son répertoire standard
**Quand** `detectClawd()` est appelé
**Alors** la fonction retourne le chemin absolu vers le dossier `themes/` de Clawd
**Et** les chemins vérifiés sont : Windows `%LOCALAPPDATA%\Clawd on Desk\themes\`, macOS `~/Library/Application Support/Clawd on Desk/themes/`, Linux `~/.config/clawd-on-desk/themes/`

**Étant donné** que Clawd on Desk n'est pas détecté dans les chemins standards
**Quand** `detectClawd()` est appelé
**Alors** la fonction retourne `null` sans lever d'erreur

**Étant donné** un chemin Clawd valide (détecté ou saisi manuellement) et un `AdapterInput`
**Quand** `clawd.generate(input)` est appelé avec `mode: 'install'`
**Alors** le dossier `<nom-pet>/` est copié dans le répertoire `themes/` de Clawd
**Et** `AdapterOutput.mode` vaut `'install'` et `path` contient le chemin d'installation

**Étant donné** que le dossier Clawd `themes/` n'est pas accessible en écriture
**Quand** `clawd.generate(input)` est appelé avec `mode: 'install'`
**Alors** la fonction lève une `InstallError` avec `exitCode = 3`

---

### Story 3.3 : Interface CLI interactive (prompts et progression)

En tant qu'utilisateur,
Je veux être guidé par 3 questions séquentielles pour configurer la conversion, avec une barre de progression en temps réel,
Afin de convertir un pet sans consulter de documentation ni mémoriser de flags.

**Critères d'acceptation :**

**Étant donné** que je lance `npx pet-theme-converter` sans argument
**Quand** le CLI démarre
**Alors** il pose 3 prompts dans l'ordre : (1) source de la spritesheet (URL ou chemin local), (2) nom du thème, (3) mode de sortie

**Étant donné** que Clawd on Desk n'est pas détecté
**Quand** le prompt du mode de sortie est affiché
**Alors** seule l'option `ZIP` est présentée — l'option `Install direct` n'apparaît pas

**Étant donné** que Clawd on Desk est détecté
**Quand** le prompt du mode de sortie est affiché
**Alors** les deux options `ZIP` et `Install direct` sont présentées

**Étant donné** que Clawd on Desk n'est pas détecté dans les chemins standards
**Quand** le prompt du mode de sortie est affiché
**Alors** une troisième option `Install direct (entrer le chemin manuellement)` est également proposée
**Et** si l'utilisateur sélectionne cette option, un prompt supplémentaire demande le chemin absolu vers le dossier `themes/` de Clawd
**Et** ce chemin est validé (existence du dossier + accès en écriture) avant de continuer
**Et** si le chemin est invalide, un message d'erreur explicite est affiché et le prompt est reposé

**Étant donné** que la conversion démarre
**Quand** chaque étape du pipeline s'exécute
**Alors** la barre de progression `@clack/prompts` affiche des labels nommés : `"Téléchargement"`, `"Détection de la grille"`, `"Découpe des frames"`, `"Encodage APNG"`, `"Packaging"`

**Étant donné** que la conversion se termine avec succès
**Quand** le CLI affiche le résultat
**Alors** `process.exit(0)` est appelé

**Étant donné** qu'une erreur est levée par le pipeline
**Quand** le CLI la catch dans `src/cli/index.ts`
**Alors** `process.exit(err.exitCode)` est appelé avec le code approprié (1, 2 ou 3)

---

### Story 3.4 : Messages d'erreur, warnings et disclaimer

En tant qu'utilisateur,
Je veux des messages clairs et actionnables pour chaque situation d'erreur, avertissement ou fin de conversion,
Afin de comprendre immédiatement ce qui s'est passé et quoi faire — sans couleur exclusive ni jargon technique.

**Critères d'acceptation :**

**Étant donné** qu'une `FetchError` est levée (URL inaccessible ou timeout)
**Quand** `cli/messages.ts` formate le message
**Alors** le message indique explicitement la cause (timeout ou URL inaccessible) et suggère une action corrective
**Et** le message est lisible en plain text sans dépendre de la couleur (NFR11)

**Étant donné** qu'une `ValidationError` est levée (Content-Type non-image)
**Quand** `cli/messages.ts` formate le message
**Alors** le message affiche le Content-Type reçu et explique qu'une image est attendue

**Étant donné** qu'une `ValidationError` est levée (spritesheet non décodable)
**Quand** `cli/messages.ts` formate le message
**Alors** le message identifie l'étape où l'échec s'est produit (fetch / découpe / encodage)

**Étant donné** que `detectGrid` retourne `isStandard: false`
**Quand** `cli/messages.ts` affiche le warning
**Alors** le message contient les dimensions détectées et les dimensions attendues (NFR9 — la conversion continue)
**Et** il est affiché avant le démarrage de la découpe, pas après

**Étant donné** que la conversion se termine avec succès
**Quand** le CLI affiche le récapitulatif
**Alors** il inclut le chemin vers le ZIP ou le dossier d'installation
**Et** il affiche le disclaimer : `"⚠️ Vérifiez la licence du pet avant tout usage commercial."`

**Étant donné** que le mode Install direct est sélectionné mais Clawd n'est pas détecté
**Quand** `cli/messages.ts` affiche l'information
**Alors** le message indique explicitement que Clawd n'a pas été détecté et que le thème a été généré en mode ZIP
**Et** aucun exit code non-zéro n'est retourné dans ce cas (fallback silencieux vers ZIP)

**Étant donné** que le CLI est exécuté dans un contexte non-TTY (pipe ou redirection)
**Quand** les messages sont affichés
**Alors** aucun code ANSI cassé n'apparaît dans la sortie (NFR12)

---

## Epic 4: CI, Documentation & Publication npm

Le package est fiable (CI validée sur 3 OS × Node 18/20), documenté pour la découverte (README avec version Clawd ciblée), et disponible publiquement via `npx`.

### Story 4.1 : Pipeline CI GitHub Actions (matrice 3 OS × Node 18/20)

En tant que développeur,
Je veux un pipeline CI qui valide automatiquement le build et l'installation du package sur les 3 OS cibles et les 2 versions Node LTS supportées,
Afin de détecter les régressions de compatibilité (binaires natifs, ESM) avant toute publication.

**Critères d'acceptation :**

**Étant donné** que `.github/workflows/ci.yml` est créé
**Quand** je l'inspecte
**Alors** il définit une matrice `os: [windows-latest, macos-latest, ubuntu-latest]` × `node: [18, 20]` soit 6 jobs parallèles

**Étant donné** qu'un push est effectué sur la branche `main`
**Quand** le workflow CI se déclenche
**Alors** chaque job exécute dans l'ordre : `pnpm install`, `pnpm build` — la réussite de `pnpm build` (exit 0, `dist/index.js` généré avec shebang `#!/usr/bin/env node`) est la validation d'exécutabilité suffisante pour la CI

**Étant donné** que `sharp` et `apngasm-bin` sont en `optionalDependencies`
**Quand** `pnpm install` s'exécute dans la CI sur les 3 OS
**Alors** l'installation se termine sans erreur fatale — les binaires natifs se résolvent correctement pour chaque plateforme

**Étant donné** qu'un job de la matrice échoue
**Quand** je consulte le résumé du workflow sur GitHub
**Alors** l'OS et la version Node concernés sont clairement identifiables dans le rapport d'échec

---

### Story 4.2 : README.md — Documentation utilisateur et découverte

En tant qu'utilisateur découvrant le package,
Je veux un README clair expliquant comment utiliser le convertisseur, quelles sources sont compatibles et quelle version de Clawd est ciblée,
Afin de pouvoir convertir mon premier pet sans friction et comprendre les limites de l'outil.

**Critères d'acceptation :**

**Étant donné** que `README.md` existe à la racine du repo
**Quand** je lis la section "Usage"
**Alors** elle contient la commande `npx pet-theme-converter` et décrit les 3 prompts attendus avec des exemples

**Étant donné** que `README.md` existe
**Quand** je lis la section "Sources compatibles"
**Alors** elle mentionne Petdex comme source principale et précise que tout format Codex (grille 8×9, 192×208px) est accepté, quelle que soit la marketplace

**Étant donné** que `README.md` existe
**Quand** je lis la section "Compatibilité"
**Alors** elle indique explicitement la version de Clawd on Desk ciblée par l'adapter (FR31)
**Et** elle documente les OS supportés (Windows 10+, macOS 12+, Ubuntu 20.04+) et les versions Node (≥ 18.x)

**Étant donné** que `README.md` existe
**Quand** je lis la section "Licence"
**Alors** elle contient le disclaimer : _"Vérifiez la licence du pet avant tout usage commercial. Cet outil ne vérifie pas les licences programmatiquement."_

---

### Story 4.3 : Validation manuelle et publication npm

En tant que mainteneur,
Je veux valider le package sur 10 pets réels sur les 3 OS cibles avant de le publier sur npm,
Afin de garantir zéro bug critique (APNG corrompu, crash, mauvais mapping) lors du lancement public.

**Critères d'acceptation :**

**Étant donné** que le package est buildé et linké localement via `pnpm link`
**Quand** je teste la commande `npx pet-theme-converter` avec 10 pets aux morphologies variées (standard + hors-standard)
**Alors** aucun bug critique n'est rencontré : les APNGs générés sont lisibles dans Clawd on Desk, aucun crash (exit non-zéro inattendu), le mapping d'états est correct

**Étant donné** que la validation est effectuée sur Windows, macOS et Linux
**Quand** j'installe le package via `pnpm link` sur chaque OS
**Alors** l'installation s'effectue sans droits administrateur et sans erreur fatale sur les 3 OS (NFR6)

**Étant donné** que la validation manuelle est concluante (0 bug critique sur 10 pets × 3 OS)
**Quand** je lance `pnpm publish --access public`
**Alors** le package est disponible sur npm sous le nom `pet-theme-converter` et installable via `npx pet-theme-converter`

**Étant donné** que le package est publié
**Quand** je lance `npx pet-theme-converter` depuis un répertoire vierge sans installation préalable
**Alors** le CLI démarre correctement et affiche le premier prompt
