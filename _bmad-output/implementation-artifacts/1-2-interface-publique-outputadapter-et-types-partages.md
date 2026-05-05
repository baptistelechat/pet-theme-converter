# Story 1.2 : Interface publique OutputAdapter et types partagés

Status: done

> 📋 **Review :** [reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-2-interface-publique-outputadapter-et-types-partages.md](../../reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-2-interface-publique-outputadapter-et-types-partages.md)

## Story

En tant que contributeur souhaitant ajouter le support d'une nouvelle app de compagnon,
Je veux une interface `OutputAdapter` clairement typée avec tous les types partagés dans un fichier unique,
Afin de pouvoir implémenter mon adapter sans lire ni toucher au code Core ou CLI.

## Acceptance Criteria

**AC1 — Exports de `src/types.ts` (types et interfaces)**

Étant donné que `src/types.ts` est créé,
Quand j'inspecte ses exports,
Alors il exporte :

- `ClawdState` : union type `'idle' | 'thinking' | 'working' | 'error' | 'happy' | 'notification' | 'sleeping' | 'waking'`
- `ThemeManifest` : interface avec `name: string`, `compatibleWith: string`, `version: string`
- `AdapterInput` : interface avec `apngs: Record<ClawdState, Buffer>`, `manifest: ThemeManifest`, `outputDir: string`
- `AdapterOutput` : interface avec `mode: 'zip' | 'install'`, `path: string`, `warnings?: string[]`
- `OutputAdapter` : interface avec `generate(input: AdapterInput): Promise<AdapterOutput>`
- `ProgressCallback` : type `(step: string, progress?: number) => void`

**AC2 — Classes d'erreur typées de `src/types.ts`**

Étant donné que `src/types.ts` est créé,
Quand j'inspecte ses classes d'erreur,
Alors il exporte :

- `FetchError extends Error` avec `exitCode = 1 as const`
- `ValidationError extends Error` avec `exitCode = 2 as const`
- `InstallError extends Error` avec `exitCode = 3 as const`

**AC3 — Build et typecheck propres avec stubs**

Étant donné que tous les fichiers source existent (même en tant que stubs vides),
Quand je lance `pnpm build` puis `pnpm typecheck`,
Alors les deux commandes se terminent avec zéro erreur.

**AC4 — Frontières architecturales respectées**

Étant donné que tous les fichiers source existent,
Quand j'inspecte leurs imports,
Alors les fichiers `src/core/*` importent uniquement depuis `../types` — jamais depuis `../cli/` ou `../adapters/`
Et les fichiers `src/adapters/*` importent uniquement depuis `../types` — jamais depuis `../cli/` ou `../core/`
Et `@clack/prompts` n'apparaît dans aucun fichier hors de `src/cli/`.

## Tasks / Subtasks

- [x] Créer `src/types.ts` avec tous les types, interfaces et classes d'erreur (AC1, AC2)
  - [x] Exporter `ClawdState` comme union type string (8 valeurs exactes)
  - [x] Exporter `ThemeManifest`, `AdapterInput`, `AdapterOutput`, `OutputAdapter`
  - [x] Exporter `ProgressCallback`
  - [x] Exporter `FetchError`, `ValidationError`, `InstallError` avec les `exitCode` en `as const`
- [x] Créer les stubs `src/core/` (AC3, AC4)
  - [x] `src/core/state-mapping.ts` — exporter un `STATE_MAPPING` typé avec valeurs placeholder
  - [x] `src/core/fetch-spritesheet.ts` — stub `export {};`
  - [x] `src/core/detect-grid.ts` — stub `export {};`
  - [x] `src/core/slice-frames.ts` — stub `export {};`
  - [x] `src/core/encode-apngs.ts` — stub `export {};`
- [x] Créer le stub `src/adapters/clawd.ts` (AC3, AC4) — stub `export {};`
- [x] Vérifier : `pnpm build` → exit 0, puis `pnpm typecheck` → exit 0 (AC3)

## Dev Notes

### Fichiers concernés par cette story

**À CRÉER (nouveaux) :**

| Fichier                         | Contenu                                                                   |
| ------------------------------- | ------------------------------------------------------------------------- |
| `src/types.ts`                  | Types publics + classes d'erreur — contenu complet ci-dessous             |
| `src/core/state-mapping.ts`     | Export `STATE_MAPPING` typé (valeurs placeholder, raffinées en Story 2.2) |
| `src/core/fetch-spritesheet.ts` | Stub vide `export {};`                                                    |
| `src/core/detect-grid.ts`       | Stub vide `export {};`                                                    |
| `src/core/slice-frames.ts`      | Stub vide `export {};`                                                    |
| `src/core/encode-apngs.ts`      | Stub vide `export {};`                                                    |
| `src/adapters/clawd.ts`         | Stub vide `export {};`                                                    |

**À NE PAS MODIFIER :**

| Fichier            | Raison                                                                         |
| ------------------ | ------------------------------------------------------------------------------ |
| `src/cli/index.ts` | Stub existant avec check Node version — ne pas toucher, Story 3.3 l'implémente |
| `tsup.config.ts`   | Configuration correcte — aucune modification requise                           |
| `tsconfig.json`    | Correct avec `"moduleResolution": "bundler"` + `"types": ["node"]`             |
| `package.json`     | Complet — aucune dépendance à ajouter dans cette story                         |

---

### Skeleton `src/types.ts` — copier-coller exact

```typescript
export type ClawdState =
  | "idle"
  | "thinking"
  | "working"
  | "error"
  | "happy"
  | "notification"
  | "sleeping"
  | "waking";

export interface ThemeManifest {
  name: string;
  compatibleWith: string;
  version: string;
}

export interface AdapterInput {
  apngs: Record<ClawdState, Buffer>;
  manifest: ThemeManifest;
  outputDir: string;
}

export interface AdapterOutput {
  mode: "zip" | "install";
  path: string;
  warnings?: string[];
}

export interface OutputAdapter {
  generate(input: AdapterInput): Promise<AdapterOutput>;
}

export type ProgressCallback = (step: string, progress?: number) => void;

export class FetchError extends Error {
  exitCode = 1 as const;
}

export class ValidationError extends Error {
  exitCode = 2 as const;
}

export class InstallError extends Error {
  exitCode = 3 as const;
}
```

---

### Skeleton `src/core/state-mapping.ts`

```typescript
import type { ClawdState } from "../types";

export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 9 },
  thinking: { row: 1, frames: 9 },
  working: { row: 2, frames: 9 },
  error: { row: 3, frames: 9 },
  happy: { row: 4, frames: 9 },
  notification: { row: 5, frames: 9 },
  sleeping: { row: 6, frames: 9 },
  waking: { row: 7, frames: 9 },
};
```

> ⚠️ **Valeurs placeholder** — le mapping réel Petdex→Clawd sera affiné en Story 2.2 (`detect-grid.ts` + `state-mapping.ts`) une fois les spritesheets réels analysés. Les valeurs ci-dessus sont des stubs compilables mais ne reflètent pas encore le mapping terrain.

---

### Skeleton des stubs Core restants

Chaque fichier Core vide doit contenir **exactement** :

```typescript
export {};
```

Cela satisfait ESM (module valide) et TypeScript (pas d'import interdit).

Ne pas importer `../types` dans ces stubs si le type n'est pas utilisé — cela évite les warnings TypeScript et respecte la règle "pas d'import inutile".

---

### Skeleton `src/adapters/clawd.ts`

```typescript
export {};
```

L'implémentation réelle (`generate()`, détection Clawd, ZIP, install) est déléguée à Stories 3.1 et 3.2.

---

### Règles critiques anti-erreurs

**1. `Buffer` est un global Node.js — PAS d'import**

`Buffer` est disponible globalement grâce à `"types": ["node"]` dans `tsconfig.json`. Ne jamais écrire `import { Buffer } from 'buffer'` — ce serait redondant et pourrait causer des conflits.

**2. Pattern `exitCode = X as const` — pas `readonly exitCode: 1 = 1`**

Le pattern `as const` produit le type littéral `1` (pas `number`), ce qui permet à la CLI layer de faire `process.exit(err.exitCode)` avec le bon type inféré.

```typescript
// ✅ Correct
class FetchError extends Error {
  exitCode = 1 as const;
}

// ❌ Incorrect — type trop large
class FetchError extends Error {
  exitCode: number = 1;
}
```

**3. Imports sans extension — `moduleResolution: "bundler"`**

Avec `"moduleResolution": "bundler"` (BDR-012), TypeScript n'exige PAS d'extension `.js` sur les imports relatifs. Écrire `'../types'` (pas `'../types.js'`).

**4. `ClawdState` = union type string, pas un enum**

Un `type` union string est plus léger et plus compatible avec `Record<ClawdState, ...>` que les enums TypeScript. Ne jamais remplacer par `enum ClawdState`.

**5. `tsup` ne fait pas le typecheck**

`pnpm build` (= `tsup`) transpile sans vérifier les types. Pour valider TypeScript, utiliser `pnpm typecheck` (= `tsc --noEmit`). Les deux doivent passer avant de marquer la story `review`.

**6. Frontières d'import — règle stricte**

```
src/types.ts      → aucun import interne (racine du graphe)
src/core/*        → importe uniquement src/types.ts
src/adapters/*    → importe uniquement src/types.ts
src/cli/*         → importe core/ + adapters/ + types.ts
                     seul module autorisé à importer @clack/prompts
```

Ne jamais importer `@clack/prompts` dans `src/types.ts`, `src/core/*` ou `src/adapters/*`.

---

### Context de la Story 1.1 (story précédente — done)

La Story 1.1 a créé l'outillage complet du projet :

- `package.json` — `"type": "module"`, TypeScript strict, `@clack/prompts ^1.3.0`, `archiver ^7.0.1` en deps
- `tsconfig.json` — `"strict": true`, `"module": "ESNext"`, `"moduleResolution": "bundler"`, `"types": ["node"]`
- `tsup.config.ts` — entry `src/cli/index.ts`, format ESM, `external: ["sharp", "apngasm-bin"]`, shebang injecté
- `src/cli/index.ts` — stub avec check Node version (reste intact jusqu'à Story 3.3)

**Learnings importants de la Story 1.1 à ne pas répéter :**

- Ne jamais écrire `"moduleResolution": "Node16"` — utiliser `"bundler"` (BDR-012)
- `"types": ["node"]` est déjà dans `tsconfig.json` et nécessaire pour `process`, `Buffer`, etc.
- `pnpm install` ne remplace pas les specifiers `"latest"` dans `package.json` — utiliser des versions pinned dès la rédaction (toutes les deps sont déjà pinned dans le `package.json` existant)

---

### Détail de la structure finale après Story 1.2

```
src/
├── cli/
│   └── index.ts            ← existant (stub Node check)
├── core/
│   ├── detect-grid.ts      ← NOUVEAU stub
│   ├── encode-apngs.ts     ← NOUVEAU stub
│   ├── fetch-spritesheet.ts← NOUVEAU stub
│   ├── slice-frames.ts     ← NOUVEAU stub
│   └── state-mapping.ts    ← NOUVEAU avec STATE_MAPPING typé
├── adapters/
│   └── clawd.ts            ← NOUVEAU stub
└── types.ts                ← NOUVEAU — contenu complet
```

### Project Structure Notes

- Alignement avec l'architecture : [Source: `_bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries`]
- `src/types.ts` est la **racine du graphe de dépendances** — il n'importe rien d'interne
- Convention de nommage fichiers : `kebab-case.ts` (voir architecture Naming Patterns)
- Convention types/interfaces : `PascalCase` ; constantes : `SCREAMING_SNAKE_CASE`

### References

- Types et interfaces : [Source: `_bmad-output/planning-artifacts/architecture.md#Contrat Public OutputAdapter`]
- Frontières architecturales : [Source: `_bmad-output/planning-artifacts/architecture.md#Architectural Boundaries`]
- Classes d'erreur avec exitCode : [Source: `_bmad-output/planning-artifacts/architecture.md#Error Handling Pattern`]
- `STATE_MAPPING` constante centralisée : [Source: `_bmad-output/planning-artifacts/architecture.md#State Mapping Pattern`]
- `moduleResolution: bundler` : [Source: `.claude/memory/decisions/BDR-012.md`]
- `"types": ["node"]` requis avec bundler : [Source: `.claude/memory/learnings/LRN-021.md`]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (2026-05-05)

### Debug Log References

Aucun blocage rencontré.

### Completion Notes List

- `src/types.ts` créé avec le skeleton exact de la story : 3 types (`ClawdState`, `ProgressCallback`), 4 interfaces (`ThemeManifest`, `AdapterInput`, `AdapterOutput`, `OutputAdapter`), 3 classes d'erreur avec `exitCode = X as const`.
- `src/core/state-mapping.ts` créé avec `STATE_MAPPING` typé `Record<ClawdState, { row, frames }>` (valeurs placeholder, raffinement Story 2.2).
- 4 stubs `src/core/` (`fetch-spritesheet.ts`, `detect-grid.ts`, `slice-frames.ts`, `encode-apngs.ts`) et 1 stub `src/adapters/clawd.ts` créés avec `export {};`.
- `Buffer` utilisé directement sans import grâce à `"types": ["node"]` déjà dans `tsconfig.json` (LRN-021).
- Frontières d'import respectées : `src/types.ts` sans import interne, stubs Core/Adapters uniquement vers `../types` (ou `export {};` sans import), `@clack/prompts` absent de tout fichier hors `src/cli/`.
- `pnpm build` → `dist/index.js` 207 B, exit 0 ✅
- `pnpm typecheck` → zéro erreur TypeScript ✅
- Tous les 4 ACs satisfaits.

### File List

- src/types.ts (créé)
- src/core/state-mapping.ts (créé)
- src/core/fetch-spritesheet.ts (créé)
- src/core/detect-grid.ts (créé)
- src/core/slice-frames.ts (créé)
- src/core/encode-apngs.ts (créé)
- src/adapters/clawd.ts (créé)
- \_bmad-output/implementation-artifacts/sprint-status.yaml (modifié)
- \_bmad-output/implementation-artifacts/1-2-interface-publique-outputadapter-et-types-partages.md (modifié)

## Change Log

| Date       | Auteur            | Description                                                                                                                                                             |
| ---------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-05 | claude-sonnet-4-6 | Implémentation complète : `src/types.ts` (types + interfaces + classes erreur), 5 stubs Core, 1 stub Adapter. `pnpm build` + `pnpm typecheck` → exit 0. Story → review. |
