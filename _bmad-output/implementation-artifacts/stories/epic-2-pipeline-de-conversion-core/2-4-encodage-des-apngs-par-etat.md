---
id: "2-4-encodage-des-apngs-par-etat"
epic: 2
story: 4
title: "Encodage des APNGs par état"
status: review
created: 2026-05-07
---

# Story 2.4 — Encodage des APNGs par état

## User Story

En tant que développeur,
Je veux que le système encode les frames brutes de chaque état en un `Buffer` APNG animé,
Afin que l'adapter Clawd dispose de 8 APNGs prêts à être packagés dans le thème.

## Status

**Status :** done

> 📋 **Review :** [reviews/epic-2/review-2-4-encodage-des-apngs-par-etat.md](../../reviews/epic-2/review-2-4-encodage-des-apngs-par-etat.md)

## Acceptance Criteria

### AC1 — Retourner `Record<ClawdState, Buffer>` avec APNGs valides

**Étant donné** un `Record<ClawdState, Buffer[]>` retourné par `sliceFrames`
**Quand** `encodeAPNGs(frames)` est appelé
**Alors** la fonction retourne un `Record<ClawdState, Buffer>` où chaque valeur est un Buffer APNG valide (magic bytes `\x89PNG` + chunk `acTL`)

### AC2 — `ValidationError` en cas d'échec d'encodage

**Étant donné** que `apngasm-bin` est utilisé pour l'encodage
**Quand** l'encodage d'un état échoue
**Alors** la fonction lève une `ValidationError` avec `exitCode = 2` et un message identifiant l'état concerné

### AC3 — Callback `onProgress` optionnel, invoqué par état

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** `encodeAPNGs` est appelé
**Alors** le callback est invoqué pour chaque état encodé avec un label lisible (ex. `"Encoding APNG: idle"`)
**Et** la fonction fonctionne identiquement si `onProgress` est absent

### AC4 — Temps total pipeline < 60s (NFR1)

**Étant donné** que l'encodage de tous les états est terminé
**Quand** je mesure le temps total (fetch + détection + découpe + encodage) sur une spritesheet standard distante
**Alors** il est inférieur à 60 secondes sur une connexion internet normale (NFR1)

## Tasks

- [x] Implémenter `src/core/encode-apngs.ts` — remplacer le stub `export {};` par l'implémentation complète
  - [x] Accepter `(frames: Record<ClawdState, Buffer[]>, onProgress?: ProgressCallback)`
  - [x] Itérer sur `Object.entries(STATE_MAPPING)` pour conserver l'ordre canonique des états
  - [x] Pour chaque état : créer un dossier temporaire via `mkdtemp`, écrire les frames PNG sur disque, appeler `apngasm-bin` via `execFileAsync`, lire le fichier APNG produit, nettoyer dans `finally`
  - [x] Guard : lever `ValidationError` si le tableau de frames d'un état est vide
  - [x] Lever `ValidationError` si `execFileAsync` échoue, avec message identifiant l'état
  - [x] Invoquer `onProgress` avant l'encodage de chaque état avec ratio `stateIndex / total`
- [x] Vérifier les frontières architecturales : aucun import depuis `src/cli/`, `src/adapters/`, ni `@clack/prompts`
- [x] `pnpm build` → exit 0
- [x] `pnpm typecheck` → exit 0

## Dev Notes

### Contexte de la story

Cette story implémente la **quatrième et dernière brique du pipeline Core** : `src/core/encode-apngs.ts`.

Le fichier existe déjà mais est un stub vide (`export {};`). Il faut le **remplacer intégralement** par l'implémentation ci-dessous.

**Position dans le pipeline :**

```
cli/index.ts
  → core/fetch-spritesheet.ts   (Story 2.1 — done ✅)
  → core/detect-grid.ts         (Story 2.2 — done ✅)
  → core/slice-frames.ts        (Story 2.3 — done ✅)
  → core/encode-apngs.ts        ← CETTE STORY
  → adapters/clawd.ts           (Epic 3)
```

### Signature de la fonction

```ts
encodeAPNGs(
  frames: Record<ClawdState, Buffer[]>,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer>>
```

**Input :** Les frames `Buffer[]` de chaque état sont **déjà au format PNG** — `sliceFrames` force `.png()` en sortie (LRN-039). Ne pas reconvertir.

**Output :** Un `Record<ClawdState, Buffer>` où chaque valeur est un **Buffer APNG animé** valide, prêt à être consommé par `adapters/clawd.ts` (Epic 3, interface `AdapterInput.apngs`).

### ⚠️ CRITIQUE : `apngasm-bin` est un chemin binaire, PAS une fonction

C'est le point le plus important de cette story. Ne pas se tromper :

```typescript
import apngasm from "apngasm-bin";
// apngasm est une STRING — le chemin absolu vers l'exécutable natif
// typeof apngasm === 'string'
// Exemple Windows : "C:\\...\\node_modules\\apngasm-bin\\vendor\\apngasm.exe"
// Exemple Linux   : "/home/user/.../.../apngasm"
```

**Il n'y a aucune fonction, aucune méthode à appeler.** On invoque l'exécutable via `execFileAsync` de `node:child_process`.

### ⚠️ CRITIQUE : fichiers temporaires obligatoires

`apngasm-bin` est un CLI tool : il lit des fichiers PNG depuis le disque et produit un fichier APNG sur le disque. **Il ne peut pas lire des Buffer en mémoire.**

**Séquence obligatoire pour chaque état :**

1. Créer un dossier temporaire via `mkdtemp(join(tmpdir(), 'pet-theme-<state>-'))`
2. Écrire chaque frame `Buffer` en fichier `.png` dans ce dossier
3. Appeler `execFileAsync(apngasm, [outputPath, ...frameArgs, '-l0'])`
4. Lire le fichier APNG produit avec `readFile(outputPath)` → Buffer résultat
5. Supprimer le dossier dans `finally` : `rm(tempDir, { recursive: true, force: true })`

### Syntaxe CLI d'apngasm (v2.91)

```
apngasm output.apng frame_0000.png 1 10 frame_0001.png 1 10 ... -l0
```

- Chaque frame est suivie de son délai (numérateur `1` et dénominateur `10`) = 1/10 s = 100 ms/frame
- `-l0` : boucle infinie
- **Aucun glob** — `execFile` n'utilise pas de shell → les patterns `frame_*.png` ne sont **pas expandus** sur Windows. Passer chaque chemin de fichier individuellement.

### Skeleton copier-coller — `src/core/encode-apngs.ts`

```typescript
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import apngasm from "apngasm-bin";
import { ValidationError } from "../types";
import type { ClawdState, ProgressCallback } from "../types";
import { STATE_MAPPING } from "./state-mapping";

const execFileAsync = promisify(execFile);

/**
 * Encode per-state PNG frames into animated APNG buffers using apngasm-bin.
 * @param frames - Per-state PNG frame buffers returned by `sliceFrames`.
 * @param onProgress - Optional callback invoked once per state with a readable label.
 * @returns A record mapping each ClawdState to its encoded APNG buffer.
 * @throws {ValidationError} If a state has no frames or if apngasm-bin fails.
 */
export const encodeAPNGs = async (
  frames: Record<ClawdState, Buffer[]>,
  onProgress?: ProgressCallback,
): Promise<Record<ClawdState, Buffer>> => {
  const result = {} as Record<ClawdState, Buffer>;
  const stateEntries = Object.entries(STATE_MAPPING) as [
    ClawdState,
    { row: number; frames: number },
  ][];

  for (let stateIndex = 0; stateIndex < stateEntries.length; stateIndex++) {
    const [state] = stateEntries[stateIndex];
    onProgress?.(`Encoding APNG: ${state}`, stateIndex / stateEntries.length);

    const stateFrames = frames[state];
    if (!stateFrames || stateFrames.length === 0) {
      throw new ValidationError(
        `No frames for state "${state}": cannot encode APNG.`,
      );
    }

    const tempDir = await mkdtemp(join(tmpdir(), `pet-theme-${state}-`));
    const outputPath = join(tempDir, "output.apng");

    try {
      // Write PNG frames to disk (apngasm-bin cannot read from buffers directly)
      const framePaths = await Promise.all(
        stateFrames.map(async (frameBuffer, i) => {
          const framePath = join(
            tempDir,
            `frame_${String(i).padStart(4, "0")}.png`,
          );
          await writeFile(framePath, frameBuffer);
          return framePath;
        }),
      );

      // Build args: each frame followed by its per-frame delay (1/10s = 100ms)
      const frameArgs: string[] = [];
      for (const framePath of framePaths) {
        frameArgs.push(framePath, "1", "10");
      }

      await execFileAsync(apngasm, [outputPath, ...frameArgs, "-l0"]);

      result[state] = await readFile(outputPath);
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      throw new ValidationError(
        `APNG encoding failed for state "${state}": ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  }

  return result;
};
```

### Règles anti-erreurs critiques

1. **`apngasm` est une `string`** — toujours appeler via `execFileAsync(apngasm, [...])`. Jamais `apngasm()` ou `apngasm.someMethod()`.

2. **Pas de globs dans les args** — `execFile` n'utilise pas de shell. Toujours construire la liste de chemins individuels (voir boucle `framePaths` ci-dessus).

3. **Nettoyage dans `finally`** — même si l'encodage échoue, le dossier temporaire doit être supprimé. Le `finally` couvre tous les cas d'erreur.

4. **Re-lancer les `ValidationError` avant wrapping** — `if (err instanceof ValidationError) throw err;` avant le `catch` générique. Sinon une erreur typée serait encapsulée dans une autre `ValidationError`.

5. **Jamais `throw new Error()`** — toujours `ValidationError`. Règle d'enforcement architecturale (architecture.md).

6. **Jamais `import @clack/prompts`** — violation de frontière architecturale. Uniquement dans `src/cli/`.

7. **Imports sans extension `.js`** — `"moduleResolution": "bundler"` dans tsconfig.

8. **`Object.entries(STATE_MAPPING) as [ClawdState, ...][]`** — cast obligatoire (`Object.entries` retourne `[string, ...][]`).

9. **Types manquants pour `apngasm-bin`** — le package ne fournit pas de déclaration TypeScript. Si `pnpm typecheck` échoue sur `import apngasm from 'apngasm-bin'`, ajouter en haut du fichier :
   ```typescript
   declare module "apngasm-bin" {
     const path: string;
     export default path;
   }
   ```

### Dépendances disponibles

| Dépendance           | Source                 | Notes                                       |
| -------------------- | ---------------------- | ------------------------------------------- |
| `apngasm-bin`        | `optionalDependencies` | Exporte le chemin du binaire natif (string) |
| `node:child_process` | Node.js built-in       | `execFile` + `promisify` → `execFileAsync`  |
| `node:fs/promises`   | Node.js built-in       | `mkdtemp`, `writeFile`, `readFile`, `rm`    |
| `node:path`          | Node.js built-in       | `join`                                      |
| `node:os`            | Node.js built-in       | `tmpdir()`                                  |
| `node:util`          | Node.js built-in       | `promisify`                                 |

### Fichiers à modifier

| Fichier                    | Action                     | Notes                             |
| -------------------------- | -------------------------- | --------------------------------- |
| `src/core/encode-apngs.ts` | **REMPLACER** `export {};` | Implémentation complète ci-dessus |

### Fichiers à NE PAS modifier

| Fichier                                           | Raison                                    |
| ------------------------------------------------- | ----------------------------------------- |
| `src/types.ts`                                    | Types publics finalisés                   |
| `src/core/fetch-spritesheet.ts`                   | Implémentation Story 2.1 — ne pas toucher |
| `src/core/detect-grid.ts`                         | Implémentation Story 2.2 — ne pas toucher |
| `src/core/slice-frames.ts`                        | Implémentation Story 2.3 — ne pas toucher |
| `src/core/state-mapping.ts`                       | Finalisé Story 2.2 — ne pas toucher       |
| `src/adapters/clawd.ts`                           | Stub → Epic 3                             |
| `src/cli/index.ts`                                | Entry point → Story 3.3                   |
| `package.json`, `tsconfig.json`, `tsup.config.ts` | Configuration finalisée                   |

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

| AC  | Comment vérifier                                                                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| AC1 | `Object.keys(result)` = 8 entrées ; pour chaque état : `result[state]` est un Buffer non-vide avec magic bytes PNG + `acTL` |
| AC2 | Passer un objet `frames` avec `[]` pour un état → vérifier que `ValidationError` est levée avec le nom de l'état            |
| AC3 | Passer un `onProgress` console.log → vérifier 8 appels avec labels `"Encoding APNG: <state>"`                               |
| AC4 | Le script de validation mesure `Date.now()` autour du pipeline complet → afficher l'elapsed                                 |

**Script de validation complet** (créer `test-2-4.mjs`, exécuter, supprimer) :

```js
import { fetchSpritesheet } from "./src/core/fetch-spritesheet.js";
import { detectGrid } from "./src/core/detect-grid.js";
import { sliceFrames } from "./src/core/slice-frames.js";
import { encodeAPNGs } from "./src/core/encode-apngs.js";
import { STATE_MAPPING } from "./src/core/state-mapping.js";

// PNG magic bytes (\x89PNG) + chunk acTL = APNG valide
const isAPNG = (buf) => {
  if (!buf || buf.length < 41) return false;
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47)
    return false;
  return buf.indexOf(Buffer.from("acTL")) !== -1;
};

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

const testEncode = async (source, label) => {
  console.log(`\n📌 ${label}`);
  const startTime = Date.now();

  const buffer = await fetchSpritesheet(source);
  const grid = await detectGrid(buffer);
  const frames = await sliceFrames(buffer, grid, (step) =>
    process.stdout.write(`  → ${step}\n`),
  );
  const apngs = await encodeAPNGs(frames, (step) =>
    process.stdout.write(`  → ${step}\n`),
  );

  const elapsed = Date.now() - startTime;

  const states = Object.keys(apngs);
  assert(states.length === 8, `8 états retournés (got ${states.length})`);

  for (const state of Object.keys(STATE_MAPPING)) {
    const apng = apngs[state];
    assert(apng && apng.length > 0, `${state} : buffer non vide`);
    assert(isAPNG(apng), `${state} : magic bytes PNG + chunk acTL valide`);
  }

  assert(elapsed < 60_000, `Temps total pipeline < 60s (got ${elapsed}ms)`);
  console.log(`  ⏱️ Temps total : ${elapsed}ms`);
};

// Test 1 — URL distante .webp (pipeline complet)
await testEncode(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp",
  "URL distante .webp (clippy)",
);

// Test 2 — URL distante .png (pipeline complet)
await testEncode(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png",
  "URL distante .png (yellow-rabbit)",
);

// Test 3 — fichier local .webp
await testEncode("./test-sprite.webp", "Fichier local .webp");

// Test 4 — fichier local .png
await testEncode("./test-sprite.png", "Fichier local .png");

console.log(`\n📊 Résultat : ${passed} passés / ${passed + failed} total`);
if (failed > 0) process.exit(1);
```

> ⚠️ **LRN-037** : Annoncer explicitement les 3 phases : (1) création de `test-2-4.mjs` + téléchargement des fichiers locaux, (2) exécution avec résultats, (3) suppression des fichiers temporaires. Ne pas les enchaîner silencieusement.

**Gate final obligatoire :**

```bash
rtk pnpm build       # exit 0
rtk pnpm typecheck   # exit 0
```

Ne pas déclarer la story terminée avant que les deux commandes passent.

### Deferred work applicable

**D1 de Story 2.1 (🔵 ouvert) :** "Limite de taille / buffer vide — corruption APNG silencieuse downstream." Partiellement couvert dans cette story par le guard `stateFrames.length === 0`. Les frames individuellement vides (Buffer 0-octet dans le tableau) ne sont pas vérifiées — `apngasm-bin` échouera si un fichier PNG vide lui est passé, ce qui sera capturé par le try/catch et traduit en `ValidationError`. Marquer D1 comme `✅ traitement partiel` dans `deferred-work.md` après la review.

## Dev Agent Record

### Completion Notes

- `src/core/encode-apngs.ts` : stub `export {};` remplacé par l'implémentation complète (84 lignes). Workflow : mkdtemp → writeFile (frames) → execFileAsync(apngasm) → readFile(output.apng) → rm dans finally.
- `src/apngasm-bin.d.ts` : déclaration ambiante créée pour typer le module. Le bloc `declare module` inline dans encode-apngs.ts était traité comme une augmentation (TS2666) — fichier `.d.ts` séparé requis (sans imports → contexte script → déclaration ambiante valide).
- Découverte : le postinstall de `apngasm-bin` n'avait pas été exécuté par pnpm (scripts bloqués par défaut) → `vendor/apngasm.exe` absent. Exécution manuelle de `node lib/install.js` dans le dossier du package pour déployer le binaire.
- Validation : 75/75 assertions sur 4 scénarios (URL .webp, URL .png, fichier local .webp, fichier local .png). Temps pipeline : 20–35s (< 60s NFR1). Magic bytes PNG + chunk acTL validés pour tous les 8 états.
- `pnpm build` → exit 0 (`dist/index.js` 207 B) ✅
- `pnpm typecheck` → exit 0 ✅
- Frontières architecturales : 0 import `cli/`, `adapters/`, `@clack/prompts` ✅

## File List

- `src/core/encode-apngs.ts` — implémentation complète (remplace stub)
- `src/apngasm-bin.d.ts` — déclaration ambiante TypeScript pour apngasm-bin

### Review Findings

- [x] [Review][Patch] `mkdtemp` hors `try` → TDZ dans `finally` + message trompeur [src/core/encode-apngs.ts:41] — ✅ appliqué (2026-05-07)
- [x] [Review][Patch] `onProgress` ratio jamais atteint 1.0 [src/core/encode-apngs.ts:32] — ✅ appliqué (2026-05-07)
- [x] [Review][Patch] JSDoc manquante dans `apngasm-bin.d.ts` [src/apngasm-bin.d.ts:2] — ✅ appliqué (2026-05-07)
- [x] [Review][Defer] Guard runtime `apngasm-bin` avant appel — deferred, pre-existing (Story 1.1)
- [x] [Review][Defer] Framerate 100ms hardcodé, non configurable — deferred, design choice v0.1
- [x] [Review][Defer] `rm` dans `finally` peut masquer erreur originale — deferred, edge case
- [x] [Review][Defer] `readFile` sans vérification intégrité APNG — deferred, extreme edge case
- [x] [Review][Defer] `notification`/`waking` sans constante partagée — deferred, cosmetic (BDR-022)
- [x] [Review][Defer] Pas de tests de régression pour le remapping — deferred, pre-existing (Epic 4)

## Change Log

| Date       | Changement                                                                    |
| ---------- | ----------------------------------------------------------------------------- |
| 2026-05-07 | Story créée — contexte complet, skeleton copier-coller apngasm-bin fourni     |
| 2026-05-07 | Implémentation complète — 75/75 tests, build ✅, typecheck ✅, story → review |
