---
id: "2-2-detection-de-la-grille-et-state-mapping"
epic: 2
story: 2
title: "Détection de la grille et STATE_MAPPING"
status: review
created: 2026-05-07
---

# Story 2.2 — Détection de la grille et STATE_MAPPING

## User Story

En tant que développeur,
Je veux que le système détecte automatiquement les dimensions de la grille de la spritesheet et avertisse si elles diffèrent du standard Codex,
Afin que la découpe soit correctement paramétrée et que l'utilisateur soit informé des écarts sans blocage.

## Status

**Status :** done

> 📋 **Review :** [reviews/epic-2/review-2-2-detection-de-la-grille-et-state-mapping.md](../../reviews/epic-2/review-2-2-detection-de-la-grille-et-state-mapping.md)

## Acceptance Criteria

### AC1 — Spritesheet standard → GridInfo correct avec isStandard: true

**Étant donné** un `Buffer` d'une spritesheet aux dimensions standard (1536×1872px = 8 colonnes × 9 lignes de 192×208px)
**Quand** `detectGrid(buffer)` est appelé
**Alors** la fonction retourne un objet `GridInfo` contenant `cols: 8`, `rows: 9`, `cellWidth: 192`, `cellHeight: 208`, et `isStandard: true`

### AC2 — Spritesheet non-standard → GridInfo avec isStandard: false, sans erreur

**Étant donné** un `Buffer` d'une spritesheet aux dimensions non-standard (ex. 1520×1854px)
**Quand** `detectGrid(buffer)` est appelé
**Alors** la fonction retourne un `GridInfo` avec `isStandard: false`, les dimensions réellement détectées, et les dimensions attendues (`expectedWidth: 192`, `expectedHeight: 208`)
**Et** la fonction ne lève pas d'erreur — la conversion continue

### AC3 — STATE_MAPPING exporté depuis state-mapping.ts, jamais inline

**Étant donné** que `STATE_MAPPING` est défini dans `src/core/state-mapping.ts`
**Quand** je l'inspecte
**Alors** il exporte une constante `Record<ClawdState, { row: number; frames: number }>` couvrant les 8 états Clawd (`idle`, `thinking`, `working`, `error`, `happy`, `notification`, `sleeping`, `waking`)
**Et** il n'est jamais défini inline dans un autre module

## Tasks

- [x] Implémenter `src/core/detect-grid.ts` — remplacer le stub `export {};` par l'implémentation complète
  - [x] Exporter l'interface `GridInfo` depuis ce fichier
  - [x] Utiliser `sharp(buffer).metadata()` pour lire les dimensions réelles
  - [x] Calculer `cellWidth = round(width / 8)` et `cellHeight = round(height / 9)`
  - [x] Retourner `isStandard: true` si `cellWidth === 192 && cellHeight === 208`
  - [x] Retourner `isStandard: false` avec `expectedWidth: 192, expectedHeight: 208` sinon
  - [x] Lever `ValidationError` si sharp échoue ou si les dimensions sont absentes/nulles
- [x] Corriger `src/core/state-mapping.ts` : `frames: 9` → `frames: 8` pour les 8 états
- [x] Vérifier les frontières architecturales : aucun import depuis `src/cli/`, `src/adapters/`, ni `@clack/prompts`
- [x] `pnpm build` → exit 0
- [x] `pnpm typecheck` → exit 0

## Dev Notes

### Contexte de la story

Cette story implémente la **deuxième brique du pipeline Core** : `src/core/detect-grid.ts`.

Le fichier existe déjà mais est un stub vide (`export {};`). Il faut le **remplacer intégralement** par l'implémentation ci-dessous.

La story corrige également un bug de valeur placeholder dans `src/core/state-mapping.ts` : `frames: 9` est un stub intentionnel documenté dans les deferred items Story 1.2. La valeur réelle est **`frames: 8`** (8 colonnes = 8 frames par état dans la grille standard Codex).

**Position dans le pipeline :**

```
cli/index.ts
  → core/fetch-spritesheet.ts   (Story 2.1 — done ✅)
  → core/detect-grid.ts         ← CETTE STORY
  → core/slice-frames.ts        (Story 2.3)
  → core/encode-apngs.ts        (Story 2.4)
  → adapters/clawd.ts           (Epic 3)
```

### Format Codex standard (LRN-001)

```
Dimensions totales : 1536 × 1872 px
Grille             : 8 colonnes × 9 lignes
Cellule            : 192 × 208 px (largeur × hauteur)
```

**Décomposition :**

- 8 colonnes → 8 **frames** par état (axe horizontal)
- 9 lignes → 9 états Petdex (axe vertical), dont 8 utilisés par Clawd (lignes 0–7, la 9e ligne Petdex est ignorée)

**Pourquoi `frames: 8` (pas `frames: 9`) dans STATE_MAPPING :**

```
1536px ÷ 8 colonnes = 192px/colonne → 8 colonnes = 8 frames par état ✓
```

L'ancienne valeur `frames: 9` était un stub placeholder (deferred depuis la review Story 1.2).
**Cette story la corrige.** Si elle n'est pas corrigée, `sliceFrames` (Story 2.3) tenterait d'extraire une 9ème colonne inexistante → découpe hors-bornes silencieuse.

### Dépendances disponibles

| Dépendance | Source                 | Notes                                                    |
| ---------- | ---------------------- | -------------------------------------------------------- |
| `sharp`    | `optionalDependencies` | Déjà installé en dev ; `sharp(buf).metadata()` est async |

`sharp` est en `optionalDependencies` dans `package.json`. La garde runtime (vérifier si sharp est disponible au démarrage CLI) est déférée (item ouvert dans deferred-work.md depuis Story 1.1). Pour cette story, **assumer sharp disponible** — importer normalement.

`sharp` inclut ses propres typings TypeScript. **Pas besoin de `@types/sharp`** dans `devDependencies`.

### Interface `GridInfo`

À exporter depuis `detect-grid.ts` — c'est un type **interne Core**, pas un type de l'API publique des adapters (qui vont dans `src/types.ts`). Les modules qui en ont besoin l'importent depuis `../core/detect-grid` ou `./detect-grid`.

```ts
export interface GridInfo {
  cols: number; // nombre de colonnes (frames par état) — 8 pour le standard
  rows: number; // nombre de lignes (états dans la spritesheet) — 9 pour le standard
  cellWidth: number; // largeur d'une cellule en px
  cellHeight: number; // hauteur d'une cellule en px
  isStandard: boolean; // true si 192×208 exactement
  expectedWidth?: number; // présent uniquement si isStandard: false → 192
  expectedHeight?: number; // présent uniquement si isStandard: false → 208
}
```

### Skeleton copier-coller — `src/core/detect-grid.ts`

```typescript
import sharp from "sharp";
import { ValidationError } from "../types";

export interface GridInfo {
  cols: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  isStandard: boolean;
  expectedWidth?: number;
  expectedHeight?: number;
}

const STANDARD_COLS = 8;
const STANDARD_ROWS = 9;
const STANDARD_CELL_WIDTH = 192;
const STANDARD_CELL_HEIGHT = 208;

export const detectGrid = async (buffer: Buffer): Promise<GridInfo> => {
  let width: number;
  let height: number;

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new ValidationError(
        "Impossible de lire les dimensions de la spritesheet : métadonnées absentes.",
      );
    }
    width = metadata.width;
    height = metadata.height;
  } catch (err) {
    if (err instanceof ValidationError) throw err;
    throw new ValidationError(
      `Impossible de lire la spritesheet : ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const cellWidth = Math.round(width / STANDARD_COLS);
  const cellHeight = Math.round(height / STANDARD_ROWS);
  const isStandard =
    cellWidth === STANDARD_CELL_WIDTH && cellHeight === STANDARD_CELL_HEIGHT;

  return {
    cols: STANDARD_COLS,
    rows: STANDARD_ROWS,
    cellWidth,
    cellHeight,
    isStandard,
    ...(isStandard
      ? {}
      : {
          expectedWidth: STANDARD_CELL_WIDTH,
          expectedHeight: STANDARD_CELL_HEIGHT,
        }),
  };
};
```

### Skeleton copier-coller — `src/core/state-mapping.ts` (correction complète)

Remplacer l'intégralité du fichier par :

```typescript
import type { ClawdState } from "../types";

export const STATE_MAPPING: Record<
  ClawdState,
  { row: number; frames: number }
> = {
  idle: { row: 0, frames: 8 },
  thinking: { row: 1, frames: 8 },
  working: { row: 2, frames: 8 },
  error: { row: 3, frames: 8 },
  happy: { row: 4, frames: 8 },
  notification: { row: 5, frames: 8 },
  sleeping: { row: 6, frames: 8 },
  waking: { row: 7, frames: 8 },
};
```

### Règles anti-erreurs critiques

1. **`sharp` inclut ses propres typings** — pas besoin de `@types/sharp`. `import sharp from "sharp"` compile directement.

2. **Propagation du message d'erreur sharp** — Comme dans `fetchFromLocal` (LRN-034), toujours propager `err.message` dans le `ValidationError`. Un message générique masque les vraies causes (format EXIF manquant, buffer tronqué, format non supporté).

3. **Re-lancer les erreurs typées avant le wrapping** — Dans le catch principal, toujours vérifier `if (err instanceof ValidationError) throw err;` avant de wrapper. Sinon, une `ValidationError` interne serait enveloppée dans une autre `ValidationError`.

4. **`isStandard` = comparaison sur les dimensions de CELLULE** — Comparer `cellWidth === 192 && cellHeight === 208`, **pas** les dimensions totales `1536 × 1872`. Ce qui compte pour la découpe (Story 2.3), c'est la taille des cellules.

5. **`expectedWidth`/`expectedHeight` uniquement si `isStandard: false`** — Spread conditionnel pour ne pas polluer l'objet avec des champs `undefined` explicites :

   ```ts
   ...(isStandard ? {} : { expectedWidth: 192, expectedHeight: 208 })
   ```

6. **`Math.round` sur `cellWidth` et `cellHeight`** — Évite les valeurs flottantes dans GridInfo pour des spritesheets légèrement imparfaites. `Math.round` (pas `Math.floor` ni `Math.ceil`).

7. **`GridInfo` exporté depuis `detect-grid.ts`, PAS depuis `types.ts`** — `types.ts` est réservé à l'API publique des adapters. `sliceFrames` (Story 2.3) l'importera via `import type { GridInfo } from './detect-grid'`.

8. **Jamais `throw new Error()`** — Toujours `ValidationError`. Règle d'enforcement architecturale.

9. **Jamais `import @clack/prompts`** — Violation de frontière architecturale.

10. **Imports sans extension `.js`** — `"moduleResolution": "bundler"` dans tsconfig.

### Fichiers à modifier

| Fichier                     | Action                     | Notes                                                 |
| --------------------------- | -------------------------- | ----------------------------------------------------- |
| `src/core/detect-grid.ts`   | **REMPLACER** `export {};` | Implémentation complète + export interface GridInfo   |
| `src/core/state-mapping.ts` | **REMPLACER** intégralité  | Corriger `frames: 9` → `frames: 8` sur tous les états |

### Fichiers à NE PAS modifier

| Fichier                                           | Raison                                                        |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `src/types.ts`                                    | Types publics finalisés — `GridInfo` va dans `detect-grid.ts` |
| `src/core/fetch-spritesheet.ts`                   | Implémentation Story 2.1 — ne pas toucher                     |
| `src/core/slice-frames.ts`                        | Stub → Story 2.3                                              |
| `src/core/encode-apngs.ts`                        | Stub → Story 2.4                                              |
| `src/adapters/clawd.ts`                           | Stub → Epic 3                                                 |
| `src/cli/index.ts`                                | Entry point → Story 3.3                                       |
| `package.json`, `tsconfig.json`, `tsup.config.ts` | Configuration finalisée                                       |

### Sources de test de référence (LRN-030 + epic-1-retro-2026-05-07.md)

**6 URLs Petdex** (format standard attendu 1536×1872px) — extraites du document de rétrospective Epic 1 :

```
# .webp — format principal
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/cinder-6161d74eaa29/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/emma-745775f158a3/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/sima-832ee7de48ef/sprite.webp

# .png — valider que sharp lit les métadonnées correctement aussi sur ce format
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png

# nom de fichier différent (spritesheet.webp vs sprite.webp)
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/curated/boxcat/spritesheet.webp
```

**Fichiers locaux** — télécharger au préalable 1 `.webp` et 1 `.png` pour tester le chemin local de `fetchSpritesheet` + `detectGrid` en mode hors-ligne :

```bash
# Télécharger les fichiers de test (à lancer dans le dossier du projet)
curl -L -o test-sprite.webp "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp"
curl -L -o test-sprite.png "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png"
```

Ces fichiers servent au test du chemin local (`fetchSpritesheet('./test-sprite.webp')`) — à supprimer après validation, ils ne sont pas commités.

### Vérification manuelle des ACs

| AC                | Comment vérifier                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| AC1 (URL .webp)   | `fetchSpritesheet(URL_webp)` → `detectGrid(buffer)` → `{ cols: 8, rows: 9, cellWidth: 192, cellHeight: 208, isStandard: true }` |
| AC1 (URL .png)    | Même séquence avec `URL_png` (yellow-rabbit) — les métadonnées sharp doivent être identiques                                    |
| AC1 (local .webp) | `fetchSpritesheet('./test-sprite.webp')` → `detectGrid(buffer)` → même résultat qu'en URL                                       |
| AC1 (local .png)  | `fetchSpritesheet('./test-sprite.png')` → `detectGrid(buffer)` → même résultat                                                  |
| AC2               | Créer un PNG factice 1520×1854 → `{ isStandard: false, expectedWidth: 192, expectedHeight: 208 }`, aucune exception             |
| AC3               | Inspecter `src/core/state-mapping.ts` : 8 entrées, toutes `frames: 8`, zéro `frames: 9` résiduel                                |

Séquence de test complète (URL + fichier local) :

```ts
import { fetchSpritesheet } from "./src/core/fetch-spritesheet";
import { detectGrid } from "./src/core/detect-grid";

// Test 1 — URL distante .webp
const bufferUrl = await fetchSpritesheet(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp",
);
console.log(await detectGrid(bufferUrl));
// { cols: 8, rows: 9, cellWidth: 192, cellHeight: 208, isStandard: true }

// Test 2 — fichier local .webp (téléchargé avec curl au préalable)
const bufferLocal = await fetchSpritesheet("./test-sprite.webp");
console.log(await detectGrid(bufferLocal));
// { cols: 8, rows: 9, cellWidth: 192, cellHeight: 208, isStandard: true }

// Test 3 — fichier local .png
const bufferPng = await fetchSpritesheet("./test-sprite.png");
console.log(await detectGrid(bufferPng));
// { cols: 8, rows: 9, cellWidth: 192, cellHeight: 208, isStandard: true }
```

**Gate final obligatoire :**

```bash
rtk pnpm build       # exit 0
rtk pnpm typecheck   # exit 0
```

Ne pas déclarer la story terminée avant que les deux commandes passent.

### Deferred work applicable

**Item ouvert de Story 1.1 :** "Garde runtime pour les deps optionnelles" (`sharp`, `apngasm-bin`). **Non traité dans cette story** — l'import statique `import sharp from "sharp"` reste tel quel. La garde runtime (import dynamique + message d'erreur CLI) sera traitée en Story 3.3 ou Story 3.4. Ne pas anticiper.

**Item ouvert de Story 1.2 :** "STATE_MAPPING : valeurs placeholder `frames: 9` à valider contre la spritesheet réelle." — **Résolu par cette story** : correction vers `frames: 8` et ajout de `detectGrid` qui valide les dimensions. À marquer ✅ dans `deferred-work.md` à la fin de la code review.

## Dev Agent Record

### Completion Notes

- `src/core/detect-grid.ts` : stub `export {};` remplacé par l'implémentation complète (57 lignes). Skeleton Dev Notes appliqué sans modification. Interface `GridInfo` exportée depuis ce fichier (BDR-019 respecté — pas dans `types.ts`).
- `src/core/state-mapping.ts` : correction `frames: 9` → `frames: 8` sur les 8 états (LRN-035). Fichier entièrement réécrit.
- Frontières architecturales vérifiées : aucun import `src/cli/`, `src/adapters/`, ni `@clack/prompts`.
- Validation manuelle complète : 32/32 assertions réussies — 4 scénarios AC1 (URL .webp, URL .png, local .webp, local .png), AC2 (PNG 1520×1854 non-standard → `isStandard: false`), AC3 (STATE_MAPPING).
- `pnpm build` → exit 0 (`dist/index.js` 207 B). `pnpm typecheck` → exit 0.

## File List

- `src/core/detect-grid.ts` — modifié (implémentation complète)
- `src/core/state-mapping.ts` — modifié (correction `frames: 9` → `frames: 8`)

## Change Log

| Date       | Changement                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 2026-05-07 | Story créée — contexte complet, skeletons copier-coller fournis                                |
| 2026-05-07 | Implémentation complète — `detectGrid` + correction STATE_MAPPING, 32/32 tests, story → review |
