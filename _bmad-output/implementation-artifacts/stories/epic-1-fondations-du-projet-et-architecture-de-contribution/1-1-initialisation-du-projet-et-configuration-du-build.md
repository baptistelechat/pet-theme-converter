# Story 1.1 : Initialisation du projet et configuration du build

Status: done

> 📋 **Review :** [reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-1-initialisation-du-projet-et-configuration-du-build.md](../../reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-1-initialisation-du-projet-et-configuration-du-build.md)

## Story

En tant que développeur,
Je veux un projet Node.js CLI fonctionnel avec TypeScript strict, ESM natif, et la bonne configuration de build/dev,
Afin de pouvoir commencer à implémenter le convertisseur avec le bon outillage en place dès le premier commit.

## Acceptance Criteria

**AC1 — Build fonctionnel**
Étant donné que je clone le repo et lance `pnpm install`,
Quand je lance `pnpm build`,
Alors `dist/index.js` est généré avec un shebang `#!/usr/bin/env node` et est exécutable via Node.js.

**AC2 — Champs package.json**
Étant donné que j'inspecte `package.json`,
Quand je vérifie ses champs critiques,
Alors il contient : `"type": "module"`, `"bin": { "pet-theme-converter": "./dist/index.js" }`, `"files": ["dist/", "README.md"]`, `"engines": { "node": ">=18.0.0" }`, `sharp` et `apngasm-bin` en `optionalDependencies`, les scripts `"build": "tsup"` et `"dev": "tsx src/cli/index.ts"`.

**AC3 — tsconfig.json**
Étant donné que j'inspecte `tsconfig.json`,
Quand je vérifie ses options de compilation,
Alors il contient `"strict": true`, `"module": "ESNext"`, `"target": "ESNext"`, `"moduleResolution": "bundler"`.

**AC4 — tsup.config.ts**
Étant donné que j'inspecte `tsup.config.ts`,
Quand je vérifie sa configuration,
Alors il bundle `src/cli/index.ts` en format ESM, cible Node.js, et injecte le shebang `#!/usr/bin/env node`.

**AC5 — Fichiers ignore**
Étant donné que `.gitignore` et `.npmignore` sont créés,
Quand je les inspecte,
Alors `.gitignore` exclut `dist/` et `node_modules/`,
Et `.npmignore` exclut `src/`, `*.test.ts` et `.github/`.

## Tasks / Subtasks

- [x] Task 1 — Créer `package.json` (AC: #2)
  - [x] Écrire le `package.json` manuellement avec les champs critiques (voir skeleton dans Dev Notes)
  - [x] Ajouter les scripts : `"build": "tsup"`, `"dev": "tsx src/cli/index.ts"`, `"typecheck": "tsc --noEmit"`
  - [x] Déclarer `sharp` et `apngasm-bin` dans la section `optionalDependencies`
- [x] Task 2 — Installer les dépendances (AC: #1, #2)
  - [x] `pnpm add @clack/prompts archiver`
  - [x] `pnpm add -D typescript @types/node tsx tsup @types/archiver`
  - [x] `pnpm install` pour résoudre les `optionalDependencies`
- [x] Task 3 — Créer `tsconfig.json` (AC: #3)
  - [x] Configurer avec tous les champs requis (voir contenu exact dans Dev Notes)
- [x] Task 4 — Créer `tsup.config.ts` (AC: #4)
  - [x] Entry : `src/cli/index.ts`, format : `['esm']`, shebang via `banner.js` (voir contenu exact dans Dev Notes)
- [x] Task 5 — Créer le stub d'entrée `src/cli/index.ts`
  - [x] Créer le dossier `src/cli/`
  - [x] Créer `src/cli/index.ts` comme module TS minimal compilable (voir contenu exact dans Dev Notes)
- [x] Task 6 — Créer `.gitignore` et `.npmignore` (AC: #5)
- [x] Task 7 — Valider le build (AC: #1)
  - [x] Lancer `pnpm build` et vérifier que `dist/index.js` est généré
  - [x] Vérifier que la première ligne de `dist/index.js` est `#!/usr/bin/env node`
  - [x] Lancer `pnpm typecheck` et vérifier exit code 0 (zéro erreur TypeScript)

## Dev Notes

### Contexte projet (CRITIQUE — lire en premier)

Ce repo est un projet **greenfield côté code** : aucun `package.json`, aucun fichier source n'existe encore. Le dev agent part de zéro.

Ce qui EXISTE déjà et ne doit pas être modifié :

- `_bmad-output/` — artefacts de planification BMAD
- `.claude/` — mémoire agent
- `docs/` — RFC et documentation
- `graphify-out/` — graphe de connaissance
- `.graphifyignore`, `.graphify_detect.json` — config graphify

### Stack technique (toutes les dépendances de cette story)

| Paquet            | Catégorie            | Rôle                                              |
| ----------------- | -------------------- | ------------------------------------------------- |
| `@clack/prompts`  | production           | CLI interactive (prompts + progression)           |
| `archiver`        | production           | Création archives ZIP                             |
| `sharp`           | optionalDependencies | Traitement image (binaire natif multi-plateforme) |
| `apngasm-bin`     | optionalDependencies | Encodage APNG (binaire natif multi-plateforme)    |
| `typescript`      | devDependencies      | Compilateur TypeScript                            |
| `@types/node`     | devDependencies      | Types Node.js                                     |
| `@types/archiver` | devDependencies      | Types pour archiver                               |
| `tsx`             | devDependencies      | Exécution TS directe pour `pnpm dev`              |
| `tsup`            | devDependencies      | Bundler ESM pour `pnpm build`                     |

### Contenu exact de tsup.config.ts

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
});
```

⚠️ Le shebang est injecté via `banner.js` dans tsup — ne pas l'écrire manuellement dans `src/cli/index.ts`.

### Contenu exact de tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

`"moduleResolution": "bundler"` (TypeScript 5.x) est le choix correct pour un projet avec tsup. Les imports relatifs s'écrivent sans extension `.js` : `import { ClawdState } from './types'` fonctionne directement. tsup gère la résolution au build.

### Contenu exact de src/cli/index.ts (stub Story 1.1)

```ts
// Entry point — orchestration complète implémentée en Story 3.3
export {};
```

Le `export {}` transforme le fichier en module ESM valide. **Ne rien implémenter ici** — juste ce stub pour que `pnpm build` fonctionne.

### Skeleton complet de package.json

```json
{
  "name": "pet-theme-converter",
  "version": "0.1.0",
  "description": "Convert Codex-compatible spritesheets into Clawd on Desk themes",
  "type": "module",
  "bin": {
    "pet-theme-converter": "./dist/index.js"
  },
  "files": ["dist/", "README.md"],
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsx src/cli/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clack/prompts": "...",
    "archiver": "..."
  },
  "devDependencies": {
    "@types/archiver": "...",
    "@types/node": "...",
    "tsx": "...",
    "tsup": "...",
    "typescript": "..."
  },
  "optionalDependencies": {
    "apngasm-bin": "...",
    "sharp": "..."
  }
}
```

Les `"..."` sont remplacés par pnpm lors de l'installation (`pnpm add` renseigne automatiquement les versions).

### Contenu de .gitignore

```
dist/
node_modules/
```

### Contenu de .npmignore

```
src/
*.test.ts
.github/
```

### Structure des fichiers créés par cette story

```
pet-theme-converter/
├── src/
│   └── cli/
│       └── index.ts        ← stub minimal (créé ici)
├── dist/                   ← généré par pnpm build (gitignored)
├── node_modules/           ← géré par pnpm (gitignored)
├── .gitignore              ← créé ici
├── .npmignore              ← créé ici
├── package.json            ← créé ici
├── pnpm-lock.yaml          ← généré par pnpm
├── tsconfig.json           ← créé ici
└── tsup.config.ts          ← créé ici
```

**Ne pas créer** : `src/types.ts`, `src/core/*`, `src/adapters/*` — scope des Stories 1.2 et suivantes.

### Frontières architecturales (à respecter dès maintenant)

```
src/types.ts          ← aucune dépendance interne — Story 1.2
src/core/*            ← importe types.ts uniquement — Stories 2.x
src/adapters/clawd.ts ← importe types.ts uniquement — Stories 3.x
src/cli/*             ← importe core/ + adapters/ + types.ts — seul module @clack/prompts
```

### Rappel — Conventions de nommage (architecture.md)

| Catégorie             | Convention             | Exemple                |
| --------------------- | ---------------------- | ---------------------- |
| Fichiers sources      | `kebab-case.ts`        | `fetch-spritesheet.ts` |
| Fonctions / variables | `camelCase`            | `fetchSpritesheet`     |
| Interfaces / types    | `PascalCase`           | `OutputAdapter`        |
| Constantes            | `SCREAMING_SNAKE_CASE` | `DEFAULT_TIMEOUT`      |

### Project Structure Notes

- Branche courante : `epic-1` — rester sur cette branche
- Le repo est déjà initialisé git (pas besoin de `git init`)
- L'initialisation via `pnpm init` est un point de départ acceptable, mais les champs critiques doivent ensuite être ajoutés manuellement (le skeleton ci-dessus est la référence)
- `optionalDependencies` pour `sharp` et `apngasm-bin` est obligatoire pour éviter des échecs d'installation sur les 3 OS cibles (NFR7)

### References

- [Source: _bmad-output/planning-artifacts/architecture.md — Starter Template Evaluation]
- [Source: _bmad-output/planning-artifacts/architecture.md — Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md — Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/architecture.md — Naming Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md — Story 1.1]
- [Source: _bmad-output/planning-artifacts/epics.md — Additional Requirements]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_Aucun blocage rencontré._

### Completion Notes List

- Projet greenfield initialisé depuis zéro : `package.json`, `tsconfig.json`, `tsup.config.ts`, `.gitignore`, `.npmignore`, `src/cli/index.ts` créés.
- `.gitignore` existait déjà (Obsidian + graphify) — `dist/` et `node_modules/` ajoutés sans écraser les entrées existantes.
- `package.json` écrit avec `"latest"` puis mis à jour avec les versions réelles (`^x.y.z`) car `pnpm add` ne remplace pas les specifiers existants.
- `pnpm build` → `dist/index.js` 20 B, shebang `#!/usr/bin/env node` confirmé en ligne 1.
- `pnpm typecheck` → zéro erreur TypeScript (TypeScript 6.0.3, `moduleResolution: bundler`).
- Toutes les dépendances installées : `@clack/prompts ^1.3.0`, `archiver ^7.0.1`, `sharp ^0.34.5`, `apngasm-bin ^1.0.3` (optionalDependencies), + devDependencies TypeScript/tsup/tsx.

### File List

- `package.json` (créé)
- `pnpm-lock.yaml` (généré par pnpm)
- `tsconfig.json` (créé)
- `tsup.config.ts` (créé)
- `src/cli/index.ts` (créé — stub ESM minimal)
- `.gitignore` (modifié — ajout `dist/` et `node_modules/`)
- `.npmignore` (créé)

## Change Log

| Date       | Description                                                                        |
| ---------- | ---------------------------------------------------------------------------------- |
| 2026-05-05 | Story 1.1 implémentée — fondation projet Node.js CLI TypeScript ESM opérationnelle |
