---
stepsCompleted:
  - "step-01-init"
  - "step-02-context"
  - "step-03-starter"
  - "step-04-decisions"
  - "step-05-patterns"
  - "step-06-structure"
  - "step-07-validation"
  - "step-08-complete"
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/product-brief.md"
  - "docs/pet-theme-converter-RFC.md"
workflowType: "architecture"
lastStep: 8
status: "complete"
completedAt: "2026-05-04"
project_name: "pet-theme-converter"
user_name: "Baptiste"
date: "2026-05-04"
---

# Architecture Decision Document — pet-theme-converter

_Ce document se construit collaborativement à travers une découverte pas à pas. Les sections sont ajoutées au fil des décisions architecturales prises ensemble._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (34 total) :**

- Acquisition spritesheet (FR1–FR4) : URL distante + chemin local, validation Content-Type, timeout 30s
- Traitement & Conversion (FR5–FR9) : détection grille auto, découpe frames, génération 8 APNGs, warning hors-standard
- Génération thème (FR10–FR13) : theme.json conforme Clawd v1.x avec `compatibleWith`, structure `assets/`, ZIP
- Interface CLI (FR14–FR18) : `npx` sans argument, 3 prompts séquentiels, barre de progression, exit codes, saisie manuelle Clawd
- Feedback & Erreurs (FR19–FR24) : messages explicites URL/timeout/Content-Type/décodage, warning non-bloquant, disclaimer licence
- Livraison thème (FR25–FR28) : mode ZIP (toujours disponible) + Install direct (si Clawd détecté), détection chemins OS
- Extensibilité (FR32–FR34) : interface `OutputAdapter` publique, découplage Core/Adapters, `CONTRIBUTING.md`

**Non-Functional Requirements :**

- **Performance** : conversion complète < 60s, timeout réseau = 30s, traitement local sans réseau post-téléchargement
- **Compatibilité plateforme** : Windows 10+, macOS 12+, Ubuntu 20.04+ × Node.js LTS ≥ 18.x, sans droits administrateur
- **Fiabilité** : zéro sortie silencieuse, warnings non-bloquants, état des artefacts explicité en cas d'échec partiel
- **Accessibilité CLI** : messages lisibles sans couleur, compatible non-TTY (pipes, redirection)

**Scale & Complexity :**

- Domaine primaire : CLI tool / pipeline traitement image
- Niveau de complexité : **Medium** (binaires natifs multi-plateforme, frame extraction, install multi-OS)
- Composants architecturaux estimés : Core (pipeline) + 1 OutputAdapter (Clawd) + CLI layer + types/interfaces publics

### Technical Constraints & Dependencies

- `sharp` (traitement image) et `apngasm-bin` (encodage APNG) : binaires natifs → packaging `optionalDependencies` par plateforme
- **Format Codex source** : grille 8×9, 192×208px — contrainte externe, non modifiable
- **Spec Clawd on Desk v1.x** : structure `theme.json` + noms APNG — contrainte externe, versionnée via `compatibleWith`
- **Node.js LTS ≥ 18.x** : ES Modules natifs disponibles, pas de legacy CommonJS requis
- **Zéro état persistant** : pas de fichier de config, pas de cache, pas de base de données (BDR-006)

### Cross-Cutting Concerns Identified

1. **Gestion d'erreur pipeline** — chaque étape (fetch/validate/slice/encode/package) doit produire des erreurs typées → exit codes cohérents (0/1/2/3)
2. **Isolation plateforme** — détection Clawd, résolution binaires, chemins OS → encapsulés dans des modules dédiés, jamais inline
3. **Contrat public `OutputAdapter`** — interface v0.1 figée pour les contributeurs externes, doit être stable dès le départ
4. **Testabilité Core** — architecture permettant l'injection de dépendances pour les tests unitaires (v0.2+)

## Starter Template Evaluation

### Primary Technology Domain

CLI Tool TypeScript — pipeline de traitement image publié sur npm via `npx`

### Starter Options Considered

| Option                                                      | Verdict                                                                           |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **oclif**                                                   | Écarté — 85ms startup, structure plugins, conçu pour 50+ commandes                |
| **commander.js**                                            | Écarté — parser de flags CLI, non pertinent pour un CLI 100% interactif (BDR-006) |
| **Templates communautaires** (kucherenko, khalidx, bitjson) | Écartés — dépendances non alignées (Yargs, Dotenv, legacy CJS)                    |
| **Setup manuel minimal** ✅                                 | Retenu — contrôle total, zéro overhead, ESM natif                                 |

### Selected Starter : Setup manuel minimal

**Rationale :** Le CLI v0.1 est entièrement piloté par `@clack/prompts` (3 prompts séquentiels, barre de progression). Aucun framework de parsing de commandes n'est nécessaire. Un setup manuel garantit un arbre de dépendances minimal, un démarrage rapide et une compatibilité ESM native sans adapter.

**Initialisation :**

```bash
pnpm init
pnpm add @clack/prompts sharp
pnpm add -D typescript @types/node tsx tsup
```

**Architectural Decisions Provided by Starter :**

**Language & Runtime :**
TypeScript 5.x strict, Node.js LTS ≥ 18.x, `"type": "module"` dans `package.json` — ES Modules natifs, syntaxe `import/export` partout.

**Build Tooling :**
`tsup` — bundle le CLI en un fichier ESM optimisé pour npm. Gère le shebang `#!/usr/bin/env node`, tree-shaking et cible Node.js nativement. Préféré à `tsc` raw pour un package CLI publié.

**Dev Tooling :**
`tsx` — exécution TypeScript directe sans transpilation pour le développement local (`pnpm dev` → `tsx src/index.ts`).

**Testing Framework :**
Vitest — à configurer en v0.2, hors scope v0.1. L'architecture Core/Adapters permettra l'injection de dépendances pour les tests unitaires.

**Code Organization :**
Structure `src/` avec modules séparés par responsabilité (Core pipeline, Adapters, CLI layer, types publics).

**Development Experience :**
`pnpm dev` via tsx, `pnpm build` via tsup, `pnpm link` pour test local avant publication npm.

**Note :** La story d'initialisation du projet doit inclure la création du `package.json`, `tsconfig.json` et la configuration `tsup.config.ts`.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (bloquants pour l'implémentation) :**

- Pipeline fonctionnel pur + callbacks `onProgress`
- Interface `OutputAdapter` publique figée dès v0.1
- Champs `package.json` pour `npx` + binaires natifs

**Important Decisions (structurent l'architecture) :**

- CI/CD matrice 3 OS × Node 18/20
- `AdapterInput` reçoit des APNGs pré-encodés (`Buffer[]`) — pas les frames brutes

**Deferred Decisions (post-MVP) :**

- Publication npm automatisée via tag (v0.2+)
- Tests unitaires Core via injection de dépendances (v0.2+)
- CLI non-interactif avec flags (v2+)

### Architecture Interne du Pipeline

**Décision : Pipeline fonctionnel pur + callbacks `onProgress`**

Chaque étape est une fonction pure `(input) => Promise<output>`. La progression est communiquée via un callback optionnel `onProgress` injecté par la CLI layer.

```ts
const buffer = await fetchSpritesheet(source, { timeout: 30_000, onProgress });
const grid = detectGrid(buffer);
const frames = sliceFrames(buffer, grid);
const apngs = await encodeAPNGs(frames, STATE_MAPPING, { onProgress });
const output = await adapter.generate({ apngs, manifest, outputDir });
```

Rationale : fonctions pures testables à l'unité ; le Core ne dépend jamais de `@clack/prompts` ; la CLI layer branche la barre de progression sans coupler les étapes entre elles.

### Contrat Public OutputAdapter

**Décision : Interface minimale, APNGs pré-encodés en entrée**

```ts
type ClawdState =
  | "idle"
  | "thinking"
  | "working"
  | "error"
  | "happy"
  | "notification"
  | "sleeping"
  | "waking";

interface ThemeManifest {
  name: string;
  compatibleWith: string; // ex: "clawd-on-desk@1.x"
  version: string;
}

interface AdapterInput {
  apngs: Record<ClawdState, Buffer>;
  manifest: ThemeManifest;
  outputDir: string;
}

interface AdapterOutput {
  mode: "zip" | "install";
  path: string;
  warnings?: string[];
}

interface OutputAdapter {
  generate(input: AdapterInput): Promise<AdapterOutput>;
}
```

Rationale : l'adapter reçoit des APNGs déjà encodés — le Core reste responsable de l'encodage, l'adapter ne fait que packager. Interface stable dès v0.1 pour les contributeurs externes.

### Infrastructure & Deployment

**CI/CD : GitHub Actions, matrice 3 OS × 2 Node**

```yaml
strategy:
  matrix:
    os: [windows-latest, macos-latest, ubuntu-latest]
    node: [18, 20]
```

Rationale : les 3 OS sont cibles du PRD ; valider les binaires natifs (`sharp`, `apngasm-bin`) sur chaque configuration avant publication.

**Publication npm : manuelle en v0.1**

`pnpm publish` déclenché manuellement par Baptiste après validation des 10 pets sur 3 OS. La validation terrain est un critère de publication bloquant (PRD).

**`package.json` : champs critiques**

```json
{
  "type": "module",
  "bin": { "pet-theme-converter": "./dist/index.js" },
  "files": ["dist/", "README.md"],
  "engines": { "node": ">=18.0.0" },
  "optionalDependencies": { "sharp": "...", "apngasm-bin": "..." }
}
```

### Decision Impact Analysis

**Séquence d'implémentation :**

1. Setup projet (`package.json`, `tsconfig.json`, `tsup.config.ts`)
2. Types publics (`ClawdState`, `ThemeManifest`, `AdapterInput`, `AdapterOutput`, `OutputAdapter`)
3. Core pipeline (fetch → validate → slice → encode)
4. Adapter Clawd on Desk
5. CLI layer (`@clack/prompts`, barre de progression, exit codes)
6. CI GitHub Actions

**Dépendances croisées :**

- Les types publics doivent être définis avant Core et Adapter
- L'Adapter dépend des types mais pas du Core
- La CLI layer dépend du Core + Adapter mais pas de leurs implémentations internes

## Implementation Patterns & Consistency Rules

### Points de conflit identifiés : 5 zones

### Naming Patterns

| Catégorie                      | Convention             | Exemple                                    |
| ------------------------------ | ---------------------- | ------------------------------------------ |
| Fichiers sources               | `kebab-case.ts`        | `fetch-spritesheet.ts`, `clawd-adapter.ts` |
| Fonctions / variables          | `camelCase`            | `fetchSpritesheet`, `detectGrid`           |
| Interfaces / types             | `PascalCase`           | `OutputAdapter`, `ThemeManifest`           |
| Constantes                     | `SCREAMING_SNAKE_CASE` | `DEFAULT_TIMEOUT`, `GRID_COLUMNS`          |
| Fichiers de sortie utilisateur | `kebab-case`           | `boba-clawd-theme.zip`                     |

### Structure Patterns

- **Types publics** : `src/types.ts` — fichier unique en v0.1, migrable en `src/types/` si nécessaire
- **Tests** : co-localisés `*.test.ts` — à configurer en v0.2
- **Adapters** : `src/adapters/<nom>.ts` → `src/adapters/clawd.ts`
- **State mapping** : `src/core/state-mapping.ts` — jamais inline dans la logique de découpe

### Error Handling Pattern

Classes d'erreur typées avec `exitCode` — la CLI layer catch et appelle `process.exit(err.exitCode)` :

```ts
class FetchError extends Error {
  exitCode = 1 as const;
}
class ValidationError extends Error {
  exitCode = 2 as const;
}
class InstallError extends Error {
  exitCode = 3 as const;
}
```

Anti-pattern : `throw new Error('message')` raw sans classe typée.

### onProgress Callback Pattern

Signature uniforme sur toutes les fonctions Core du pipeline :

```ts
type ProgressCallback = (step: string, progress?: number) => void;
```

- Paramètre **optionnel** sur chaque fonction Core → absent en test, branché sur `@clack/prompts` en production
- La CLI layer est le seul module qui importe `@clack/prompts`

### State Mapping Pattern

Constante exportée depuis `src/core/state-mapping.ts`, jamais définie inline :

```ts
export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 9 },
  thinking: { row: 1, frames: 9 },
  working: { row: 2, frames: 9 },
  // ...
};
```

### Enforcement — Tous les agents DOIVENT

1. Nommer les fichiers en `kebab-case.ts`
2. Étendre les classes d'erreur typées — jamais `throw new Error()` raw
3. Accepter `onProgress?: ProgressCallback` dans les fonctions Core du pipeline
4. Importer `STATE_MAPPING` depuis `src/core/state-mapping.ts`
5. Ne jamais importer `@clack/prompts` hors de `src/cli/`

## Project Structure & Boundaries

### Complete Project Directory Structure

```
pet-theme-converter/
├── .github/
│   └── workflows/
│       └── ci.yml                  ← matrice 3 OS × Node 18/20
├── src/
│   ├── cli/
│   │   ├── index.ts                ← entry point, shebang, orchestration, process.exit()
│   │   ├── prompts.ts              ← 3 prompts @clack/prompts + barre de progression
│   │   └── messages.ts             ← messages erreur/warning/disclaimer (lisibles sans couleur)
│   ├── core/
│   │   ├── fetch-spritesheet.ts    ← fetch URL ou fs.readFile, Content-Type, timeout 30s
│   │   ├── detect-grid.ts          ← dimensions cellule, nb colonnes/lignes, warning hors-standard
│   │   ├── slice-frames.ts         ← découpe sharp par état selon STATE_MAPPING
│   │   ├── encode-apngs.ts         ← génération Buffer APNG par état via apngasm-bin
│   │   └── state-mapping.ts        ← STATE_MAPPING constante + rows/frames par ClawdState
│   ├── adapters/
│   │   └── clawd.ts                ← OutputAdapter : theme.json + ZIP + install + détection Clawd
│   └── types.ts                    ← ClawdState, ThemeManifest, AdapterInput, AdapterOutput,
│                                      OutputAdapter, ProgressCallback, FetchError,
│                                      ValidationError, InstallError
├── dist/                           ← généré par tsup (gitignored)
├── .gitignore
├── .npmignore                      ← exclure src/, *.test.ts, .github/
├── CONTRIBUTING.md                 ← procédure écriture + soumission adapter (FR34)
├── README.md
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Architectural Boundaries

```
src/types.ts          ← aucune dépendance interne (racine du graphe)
src/core/*            ← importe types.ts uniquement — jamais cli/ ni adapters/
src/adapters/clawd.ts ← importe types.ts uniquement — jamais cli/ ni core/
src/cli/*             ← importe core/ + adapters/ + types.ts — seul module @clack/prompts
```

### Requirements to Structure Mapping

| FR                                                             | Module                                                   |
| -------------------------------------------------------------- | -------------------------------------------------------- |
| FR1–FR4 (fetch + Content-Type + timeout)                       | `src/core/fetch-spritesheet.ts`                          |
| FR5 (détection grille)                                         | `src/core/detect-grid.ts`                                |
| FR6, FR29 (découpe + STATE_MAPPING)                            | `src/core/slice-frames.ts` + `src/core/state-mapping.ts` |
| FR7–FR9 (génération APNGs + warning)                           | `src/core/encode-apngs.ts`                               |
| FR10–FR13, FR25–FR28 (thème + ZIP + install + détection Clawd) | `src/adapters/clawd.ts`                                  |
| FR14–FR18 (prompts + progression + exit codes)                 | `src/cli/index.ts` + `src/cli/prompts.ts`                |
| FR19–FR24 (messages erreur + warning + disclaimer)             | `src/cli/messages.ts`                                    |
| FR32–FR34 (interface publique + CONTRIBUTING.md)               | `src/types.ts` + `CONTRIBUTING.md`                       |

### Integration Points

**Externes :**

| Point                                  | Emplacement                                           |
| -------------------------------------- | ----------------------------------------------------- |
| `fetch()` URL distante                 | `src/core/fetch-spritesheet.ts`                       |
| `fs.readFile` chemin local             | `src/core/fetch-spritesheet.ts`                       |
| `sharp` (metadata + découpe)           | `src/core/detect-grid.ts`, `src/core/slice-frames.ts` |
| `apngasm-bin` (encodage APNG)          | `src/core/encode-apngs.ts`                            |
| Chemins Clawd OS (Windows/macOS/Linux) | `src/adapters/clawd.ts`                               |
| `archiver` (ZIP) + `fs.cp` (install)   | `src/adapters/clawd.ts`                               |

**Data Flow :**

```
cli/index.ts
  → cli/prompts.ts          (3 prompts utilisateur)
  → core/fetch-spritesheet  (source → Buffer)
  → core/detect-grid        (Buffer → GridInfo + warning éventuel)
  → core/slice-frames       (Buffer + GridInfo → Record<ClawdState, Sharp[]>)
  → core/encode-apngs       (frames → Record<ClawdState, Buffer>)
  → adapters/clawd.ts       (APNGs + manifest → AdapterOutput)
  → cli/messages.ts         (affichage résultat + disclaimer)
  → process.exit(0)
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility :** TypeScript + ESM + tsup + tsx — stack cohérente sans conflits. `@clack/prompts` isolé dans `src/cli/` par règle d'enforcement. Pipeline fonctionnel + callbacks `onProgress` sans couplage Core/CLI. `Buffer[]` en entrée adapter → responsabilités claires. Classes d'erreur typées cohérentes avec les exit codes 0/1/2/3 du PRD. `optionalDependencies` par plateforme alignés avec la CI 3 OS.

**Pattern Consistency :** Naming kebab-case uniforme sur tous les fichiers sources. Error handling centralisé par classes typées. `STATE_MAPPING` constante unique importée partout. `ProgressCallback` signature identique sur toutes les fonctions Core.

**Structure Alignment :** La structure `src/` en 3 couches (core, adapters, cli) respecte exactement les frontières architecturales décidées. Chaque FR est mappé à un fichier précis.

### Requirements Coverage Validation ✅

**Functional Requirements :** FR1–FR34 entièrement couverts — chaque FR mappé à un fichier source dans la structure du projet.

**Non-Functional Requirements :**

- Performance < 60s : pipeline local post-fetch, pas de blocage architectural
- Timeout 30s : `fetch-spritesheet.ts` (BDR-007)
- 3 OS sans droits admin : CI matrice + `optionalDependencies` + `npx` natif
- Accessibilité CLI non-TTY : `messages.ts` pattern sans couleur seule
- Zéro config persistante : BDR-006, aucun fichier de config dans la structure

### Gap Analysis Results

**Résolu :** Librairie ZIP → `archiver` retenu (standard de facto, API simple, < 5 kB overhead).

**À documenter dans `clawd.ts` (implémentation) :**

```
Windows : %LOCALAPPDATA%\Clawd on Desk\themes\
macOS   : ~/Library/Application Support/Clawd on Desk/themes/
Linux   : ~/.config/clawd-on-desk/themes/
```

### Architecture Completeness Checklist

**Analyse des exigences :**

- [x] Contexte projet analysé (34 FR, 4 catégories NFR)
- [x] Complexité évaluée (Medium — binaires natifs, multi-OS)
- [x] Contraintes techniques identifiées (sharp, apngasm-bin, Clawd spec)
- [x] Préoccupations transversales mappées (erreurs, isolation OS, contrat public)

**Décisions architecturales :**

- [x] Stack complète documentée (TypeScript 5.x, ESM, PNPM, tsup, tsx)
- [x] Interface `OutputAdapter` figée avec types complets
- [x] Pipeline fonctionnel + `onProgress` callbacks
- [x] CI GitHub Actions matrice 3 OS × Node 18/20
- [x] `archiver` retenu pour la création ZIP

**Patterns d'implémentation :**

- [x] Conventions de nommage (kebab-case, camelCase, PascalCase, SCREAMING_SNAKE_CASE)
- [x] Error handling (classes typées avec exitCode)
- [x] `onProgress` callback uniforme sur le Core
- [x] `STATE_MAPPING` constante centralisée

**Structure du projet :**

- [x] Arborescence complète définie (14 fichiers + CI)
- [x] Frontières architecturales explicitées (types → core → adapters → cli)
- [x] Points d'intégration externes documentés
- [x] Data flow de bout en bout tracé

### Architecture Readiness Assessment

**Status global : PRÊT POUR L'IMPLÉMENTATION**

**Confiance : Haute** — architecture simple, sans ambiguïtés, toutes les frontières sont nettes.

**Points forts :**

- Découplage Core/Adapters/CLI strict → testabilité et extensibilité garanties
- Interface `OutputAdapter` minimaliste → contributions externes facilitées
- Zéro état persistant → pas de migration, pas de cache à gérer
- Structure plate (14 fichiers) → facile à naviguer pour un agent IA

**Améliorations futures :**

- Tests unitaires Core via injection de dépendances (v0.2)
- Publication npm automatisée via tag (v0.2)
- Adapter Clyde (v0.3)

### Implementation Handoff

**Priorité d'implémentation :**

1. `pnpm init` + `package.json` + `tsconfig.json` + `tsup.config.ts`
2. `src/types.ts` — types publics et classes d'erreur
3. `src/core/` — pipeline fonctionnel (fetch → detect → slice → encode)
4. `src/adapters/clawd.ts` — OutputAdapter Clawd
5. `src/cli/` — CLI layer (@clack/prompts, progression, exit codes)
6. `.github/workflows/ci.yml` — CI matrice 3 OS

**Règle fondamentale pour les agents IA :** Ne jamais importer `@clack/prompts` hors de `src/cli/`. Ne jamais `throw new Error()` raw — toujours étendre une classe d'erreur typée.
