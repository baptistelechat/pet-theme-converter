---
id: "2-3-decoupe-des-frames-par-etat"
epic: 2
story: 3
title: "Découpe des frames par état"
status: review
created: 2026-05-07
---

# Story 2.3 — Découpe des frames par état

## User Story

En tant que développeur,
Je veux que le système découpe la spritesheet en frames individuelles groupées par état Clawd selon le STATE_MAPPING,
Afin que chaque état dispose de ses frames brutes prêtes à l'encodage APNG.

## Status

**Status :** done

> 📋 **Review :** [reviews/epic-2/review-2-3-decoupe-des-frames-par-etat.md](../../reviews/epic-2/review-2-3-decoupe-des-frames-par-etat.md)

## Acceptance Criteria

### AC1 — Retourner `Record<ClawdState, Buffer[]>` avec exactement le bon nombre de frames

**Étant donné** un `Buffer` de spritesheet valide et un `GridInfo` retourné par `detectGrid`
**Quand** `sliceFrames(buffer, grid)` est appelé
**Alors** la fonction retourne un `Record<ClawdState, Buffer[]>` où chaque clé est un des 8 états Clawd
**Et** chaque tableau contient exactement le bon nombre de frames selon `STATE_MAPPING[state].frames`

### AC2 — Coordonnées calculées depuis `GridInfo` et `STATE_MAPPING` — jamais hardcodées

**Étant donné** que `sharp` est utilisé pour la découpe
**Quand** une frame est extraite
**Alors** les coordonnées `left`, `top`, `width`, `height` sont calculées depuis `GridInfo` et `STATE_MAPPING` — jamais codées en dur

### AC3 — Callback `onProgress` optionnel, invoqué par état

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** `sliceFrames` est appelé
**Alors** le callback est invoqué pour chaque état découpé avec un label lisible
**Et** la fonction fonctionne identiquement si `onProgress` est absent

## Tasks

- [x] Implémenter `src/core/slice-frames.ts` — remplacer le stub `export {};` par l'implémentation complète
  - [x] Accepter `(buffer: Buffer, grid: GridInfo, onProgress?: ProgressCallback)`
  - [x] Itérer sur `Object.entries(STATE_MAPPING)` pour chaque état
  - [x] Calculer `left = frameIndex * grid.cellWidth`, `top = row * grid.cellHeight`
  - [x] Extraire chaque frame via `sharp(buffer).extract({ left, top, width: grid.cellWidth, height: grid.cellHeight }).png().toBuffer()`
  - [x] Lever `ValidationError` si sharp échoue, avec message identifiant l'état et le numéro de frame
  - [x] Invoquer `onProgress` avant la découpe de chaque état
- [x] Vérifier les frontières architecturales : aucun import depuis `src/cli/`, `src/adapters/`, ni `@clack/prompts`
- [x] `pnpm build` → exit 0
- [x] `pnpm typecheck` → exit 0

## Dev Notes

### Contexte de la story

Cette story implémente la **troisième brique du pipeline Core** : `src/core/slice-frames.ts`.

Le fichier existe déjà mais est un stub vide (`export {};`). Il faut le **remplacer intégralement** par l'implémentation ci-dessous.

**Position dans le pipeline :**

```
cli/index.ts
  → core/fetch-spritesheet.ts   (Story 2.1 — done ✅)
  → core/detect-grid.ts         (Story 2.2 — done ✅)
  → core/slice-frames.ts        ← CETTE STORY
  → core/encode-apngs.ts        (Story 2.4)
  → adapters/clawd.ts           (Epic 3)
```

### Signature de la fonction

```ts
sliceFrames(
  buffer: Buffer,
  grid: GridInfo,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer[]>>
```

Le `GridInfo` est retourné par `detectGrid` (Story 2.2) et contient :

```ts
{
  cols: 8,        // colonnes dans la spritesheet (= frames par état)
  rows: 9,        // lignes (= états Petdex, dont 8 utilisés par Clawd)
  cellWidth: 192, // largeur d'une cellule en px (arrondi via Math.round)
  cellHeight: 208 // hauteur d'une cellule en px (arrondi via Math.round)
}
```

### Calcul des coordonnées d'extraction sharp

Pour chaque état `state` et chaque frame `frameIndex` (0-based) :

```
left   = frameIndex * grid.cellWidth
top    = STATE_MAPPING[state].row * grid.cellHeight
width  = grid.cellWidth
height = grid.cellHeight
```

Exemple pour l'état `idle` (row=0, frames=8) :

- Frame 0 : left=0, top=0
- Frame 1 : left=192, top=0
- Frame 7 : left=1344, top=0

Exemple pour l'état `thinking` (row=1, frames=8) :

- Frame 0 : left=0, top=208
- Frame 7 : left=1344, top=208

### Pourquoi `.png()` sur la sortie de sharp

La spritesheet source peut être `.webp` ou `.png` (LRN-030). L'encodeur APNG (Story 2.4, `apngasm-bin`) attend des frames au format **PNG**. Forcer `.png()` à la sortie de chaque extraction garantit que les buffers reçus par `encodeAPNGs` sont toujours dans le bon format, quelle que soit la source.

```ts
await sharp(buffer)
  .extract({ left, top, width: grid.cellWidth, height: grid.cellHeight })
  .png() // ← conversion explicite en PNG, obligatoire pour apngasm-bin (Story 2.4)
  .toBuffer();
```

### Note sur D2 de la review Story 2.2

Le deferred item D2 signale que `Math.round` peut produire un `cellWidth`/`cellHeight` légèrement supérieur à la taille réelle d'une colonne/ligne sur des spritesheets non-alignées. Dans ce cas, la dernière frame d'une ligne ou d'une colonne pourrait déborder les bornes de l'image.

**Gestion retenue :** sharp lève une erreur si `left + width > image.width` ou `top + height > image.height`. Cette erreur est catchée et re-lancée comme `ValidationError` avec un message identifiant l'état et le numéro de frame. Ce comportement est acceptable pour v0.1 : les spritesheets standard (1536×1872px) ne posent aucun problème. Une clampe des bornes nécessiterait d'ajouter `totalWidth`/`totalHeight` dans `GridInfo` — modification déférée post-v0.1.

### Skeleton copier-coller — `src/core/slice-frames.ts`

```typescript
import sharp from "sharp";
import { ValidationError } from "../types";
import type { ClawdState, ProgressCallback } from "../types";
import type { GridInfo } from "./detect-grid";
import { STATE_MAPPING } from "./state-mapping";

export const sliceFrames = async (
  buffer: Buffer,
  grid: GridInfo,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer[]>> => {
  if (!buffer || buffer.length === 0)
    throw new ValidationError(
      "Buffer vide : aucune donnée de spritesheet à découper.",
    );

  const result = {} as Record<ClawdState, Buffer[]>;

  for (const [state, { row, frames }] of Object.entries(STATE_MAPPING) as [
    ClawdState,
    { row: number; frames: number },
  ][]) {
    onProgress?.(`Découpe des frames : ${state}`);
    const stateFrames: Buffer[] = [];

    for (let frameIndex = 0; frameIndex < frames; frameIndex++) {
      const left = frameIndex * grid.cellWidth;
      const top = row * grid.cellHeight;

      try {
        const frameBuffer = await sharp(buffer)
          .extract({
            left,
            top,
            width: grid.cellWidth,
            height: grid.cellHeight,
          })
          .png()
          .toBuffer();
        stateFrames.push(frameBuffer);
      } catch (err) {
        if (err instanceof ValidationError) throw err;
        throw new ValidationError(
          `Découpe impossible pour l'état "${state}" (frame ${frameIndex + 1}/${frames}) : ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    result[state as ClawdState] = stateFrames;
  }

  return result;
};
```

### Règles anti-erreurs critiques

1. **`import type { GridInfo } from "./detect-grid"`** — `GridInfo` est un type interne Core, défini dans son module source (BDR-019). Ne pas l'importer depuis `src/types.ts` (il n'y est pas).

2. **`import { STATE_MAPPING } from "./state-mapping"`** — Toujours importer la constante centralisée. Jamais redéfinir un mapping inline.

3. **`.png()` obligatoire** — Sans `.png()`, les buffers sortent dans le format source (webp si la spritesheet est webp). `apngasm-bin` (Story 2.4) nécessite des frames PNG.

4. **Re-lancer les erreurs typées avant le wrapping** — `if (err instanceof ValidationError) throw err;` avant de wrapper. Sinon une `ValidationError` interne serait enveloppée dans une autre `ValidationError`.

5. **Jamais `throw new Error()`** — Toujours `ValidationError`. Règle d'enforcement architecturale.

6. **Jamais `import @clack/prompts`** — Violation de frontière architecturale. `@clack/prompts` est réservé à `src/cli/`.

7. **Imports sans extension `.js`** — `"moduleResolution": "bundler"` dans tsconfig.

8. **`sharp` inclut ses propres typings** — pas besoin de `@types/sharp`.

9. **`Object.entries(STATE_MAPPING) as [ClawdState, ...][]`** — le cast est nécessaire car `Object.entries` retourne `[string, ...][]` en TypeScript strict. Le cast est sûr puisque `STATE_MAPPING` est défini avec la clé `Record<ClawdState, ...>`.

### Dépendances disponibles

| Dépendance | Source                 | Notes                                                      |
| ---------- | ---------------------- | ---------------------------------------------------------- |
| `sharp`    | `optionalDependencies` | Déjà installé en dev. `extract()` + `png()` + `toBuffer()` |

### Fichiers à modifier

| Fichier                    | Action                     | Notes                             |
| -------------------------- | -------------------------- | --------------------------------- |
| `src/core/slice-frames.ts` | **REMPLACER** `export {};` | Implémentation complète ci-dessus |

### Fichiers à NE PAS modifier

| Fichier                                           | Raison                                           |
| ------------------------------------------------- | ------------------------------------------------ |
| `src/types.ts`                                    | Types publics finalisés — `GridInfo` n'y est pas |
| `src/core/fetch-spritesheet.ts`                   | Implémentation Story 2.1 — ne pas toucher        |
| `src/core/detect-grid.ts`                         | Implémentation Story 2.2 — ne pas toucher        |
| `src/core/state-mapping.ts`                       | Correction Story 2.2 — ne pas toucher            |
| `src/core/encode-apngs.ts`                        | Stub → Story 2.4                                 |
| `src/adapters/clawd.ts`                           | Stub → Epic 3                                    |
| `src/cli/index.ts`                                | Entry point → Story 3.3                          |
| `package.json`, `tsconfig.json`, `tsup.config.ts` | Configuration finalisée                          |

### Sources de test de référence (LRN-030 + LRN-036)

**6 URLs Petdex** (format standard 1536×1872px) :

```
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/cinder-6161d74eaa29/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/emma-745775f158a3/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/sima-832ee7de48ef/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/curated/boxcat/spritesheet.webp
```

**Fichiers locaux** (LRN-036 — toujours couvrir URL + chemin local) :

```bash
curl -L -o test-sprite.webp "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp"
curl -L -o test-sprite.png "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png"
```

### Vérification manuelle des ACs

| AC  | Comment vérifier                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------- |
| AC1 | `Object.keys(result)` = 8 entrées ; pour chaque état : `result[state].length === 8`                     |
| AC1 | Pour chaque frame buffer : `length > 0` et magic bytes PNG (`buffer[0] === 0x89 && buffer[1] === 0x50`) |
| AC2 | Inspecter le code : aucune valeur 192, 208, 1536, 1872 hardcodée dans `slice-frames.ts`                 |
| AC3 | Ajouter un `onProgress` console.log — vérifier 8 appels (un par état) avec labels lisibles              |

**Script de validation complet** (créer `test-2-3.mjs`, exécuter, supprimer) :

```js
import { fetchSpritesheet } from "./src/core/fetch-spritesheet.js";
import { detectGrid } from "./src/core/detect-grid.js";
import { sliceFrames } from "./src/core/slice-frames.js";
import { STATE_MAPPING } from "./src/core/state-mapping.js";

const PNG_MAGIC_0 = 0x89;
const PNG_MAGIC_1 = 0x50;

const isPng = (buf) => buf[0] === PNG_MAGIC_0 && buf[1] === PNG_MAGIC_1;

let passed = 0;
let failed = 0;

const assert = (condition, label) => {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
  }
};

const testSlice = async (source, label) => {
  console.log(`\n📌 ${label}`);
  const buffer = await fetchSpritesheet(source);
  const grid = await detectGrid(buffer);
  const result = await sliceFrames(buffer, grid, (step) =>
    process.stdout.write(`  → ${step}\n`),
  );

  const states = Object.keys(result);
  assert(states.length === 8, `8 états retournés (got ${states.length})`);

  for (const [state, { frames }] of Object.entries(STATE_MAPPING)) {
    const stateFrames = result[state];
    assert(
      stateFrames && stateFrames.length === frames,
      `${state} : ${frames} frames (got ${stateFrames?.length ?? "undefined"})`,
    );
    if (stateFrames) {
      for (let i = 0; i < stateFrames.length; i++) {
        assert(stateFrames[i].length > 0, `${state} frame ${i + 1} non vide`);
        assert(
          isPng(stateFrames[i]),
          `${state} frame ${i + 1} = PNG magic bytes`,
        );
      }
    }
  }
};

// Test 1 — URL distante .webp
await testSlice(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp",
  "URL distante .webp (clippy)",
);

// Test 2 — URL distante .png
await testSlice(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png",
  "URL distante .png (yellow-rabbit)",
);

// Test 3 — fichier local .webp
await testSlice("./test-sprite.webp", "Fichier local .webp");

// Test 4 — fichier local .png
await testSlice("./test-sprite.png", "Fichier local .png");

console.log(`\n📊 Résultat : ${passed} passés / ${passed + failed} total`);
if (failed > 0) process.exit(1);
```

> ⚠️ **LRN-037** : Annoncer explicitement les 3 phases : (1) création de `test-2-3.mjs`, (2) exécution avec résultats, (3) suppression. Ne pas les enchaîner silencieusement.

**Gate final obligatoire :**

```bash
rtk pnpm build       # exit 0
rtk pnpm typecheck   # exit 0
```

Ne pas déclarer la story terminée avant que les deux commandes passent.

### Deferred work applicable

**D2 de Story 2.2 (ouvert) :** "Math.round masque spritesheets non-alignées — sliceFrames doit en tenir compte." Géré par le wrapping d'erreur sharp : si une extraction dépasse les bornes, sharp lève une erreur catchée en `ValidationError` avec état + numéro de frame. Clampage complet déféré (nécessite `totalWidth`/`totalHeight` dans `GridInfo`). À noter comme `✅ traitement partiel` dans `deferred-work.md` après la review.

**D5 de Story 2.2 (ouvert) :** "`frames: 8` non synchronisé avec `STANDARD_COLS`." Hors scope de cette story — aucune assertion runtime entre les deux constantes. Reste ouvert pour les tests futurs (v0.2).

## Dev Agent Record

### Completion Notes

**Implémentation complète de `sliceFrames` — 2026-05-07**

- Stub `export {};` remplacé par l'implémentation complète (52 lignes)
- Guard buffer vide en tête de fonction (cohérent avec `detectGrid`)
- Itération sur `STATE_MAPPING` via `Object.entries` avec cast `[ClawdState, ...][]`
- Calcul des coordonnées depuis `GridInfo` : `left = frameIndex * grid.cellWidth`, `top = row * grid.cellHeight`
- `.png()` systématique après `.extract()` — contrat inter-story pour `apngasm-bin` (Story 2.4, LRN-039)
- Re-lancement des `ValidationError` avant wrapping pour éviter double-encapsulation
- `onProgress` invoqué avant la découpe de chaque état (1 appel par état = 8 appels au total)
- Frontières architecturales respectées : aucun import `@clack/prompts`, `src/cli/`, `src/adapters/`

**Résultats de validation :**

- `pnpm build` → exit 0, `dist/index.js` 207 B
- `pnpm typecheck` → exit 0, zéro erreur TypeScript
- `test-2-3.mjs` → **548/548 assertions réussies** sur 4 scénarios :
  - URL distante `.webp` (clippy) — 8 états × 8 frames × 3 assertions = 136 ✅
  - URL distante `.png` (yellow-rabbit) — 8 états × 8 frames × 3 assertions = 136 ✅
  - Fichier local `.webp` — 8 états × 8 frames × 3 assertions = 136 ✅
  - Fichier local `.png` — 8 états × 8 frames × 3 assertions = 136 ✅

**ACs vérifiés :**

- AC1 ✅ — 8 états Clawd retournés, chaque état contient 8 frames non vides avec magic bytes PNG
- AC2 ✅ — aucune valeur hardcodée dans `slice-frames.ts` (192, 208, 1536, 1872 absentes)
- AC3 ✅ — `onProgress` invoqué pour chaque état avec label lisible, fonctionne identiquement si absent

## File List

- `src/core/slice-frames.ts` — implémentation complète (stub → 52 lignes)

## Change Log

| Date       | Changement                                                                    |
| ---------- | ----------------------------------------------------------------------------- |
| 2026-05-07 | Story créée — contexte complet, skeleton copier-coller fourni                 |
| 2026-05-07 | `src/core/slice-frames.ts` implémenté — 548/548 tests, build ✅, typecheck ✅ |
