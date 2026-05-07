---
id: "3-1-generation-du-theme-et-packaging-zip"
epic: 3
story: 1
title: "Génération du thème et packaging ZIP"
status: ready-for-dev
created: 2026-05-07
---

# Story 3.1 — Génération du thème et packaging ZIP

## User Story

En tant qu'utilisateur,
Je veux que le système génère un thème Clawd on Desk complet depuis les APNGs produits par le Core,
Afin de disposer d'une archive ZIP installable manuellement dans n'importe quel environnement.

## Status

**Status :** ready-for-dev

## Acceptance Criteria

### AC1 — Archive ZIP créée avec structure correcte

**Étant donné** un `AdapterInput` valide (8 APNGs + manifest + outputDir)
**Quand** `generateZip(input)` est appelé
**Alors** un fichier `<nom-pet>-clawd-theme.zip` est créé dans `outputDir`
**Et** l'archive contient :

- `<nom-pet>/theme.json`
- `<nom-pet>/assets/idle.apng`
- `<nom-pet>/assets/thinking.apng`
- `<nom-pet>/assets/working.apng`
- `<nom-pet>/assets/error.apng`
- `<nom-pet>/assets/happy.apng`
- `<nom-pet>/assets/notification.apng`
- `<nom-pet>/assets/sleeping.apng`
- `<nom-pet>/assets/waking.apng`

### AC2 — `theme.json` conforme à la spec Clawd on Desk v1.x

**Étant donné** que `theme.json` est généré dans l'archive
**Quand** je l'inspecte
**Alors** il contient les champs `name`, `compatibleWith` (ex. `"clawd-on-desk@1.x"`) et `version`
**Et** ces champs correspondent exactement aux valeurs du `ThemeManifest` reçu en entrée

### AC3 — APNGs lisibles et non corrompus dans le ZIP

**Étant donné** que l'archive ZIP est créée via `archiver`
**Quand** je l'extrais manuellement
**Alors** les 8 fichiers APNG sont lisibles (magic bytes `\x89PNG` + chunk `acTL`)

### AC4 — `AdapterOutput` correct

**Étant donné** que `generateZip(input)` retourne un `AdapterOutput`
**Quand** je l'inspecte
**Alors** `mode` vaut `'zip'` et `path` contient le chemin absolu vers le fichier ZIP généré

## Tasks

- [ ] Implémenter `src/adapters/clawd.ts` — remplacer le stub `export {};` par l'implémentation complète
  - [ ] Exporter la fonction `generateZip(input: AdapterInput): Promise<AdapterOutput>`
  - [ ] Créer `outputDir` si inexistant via `mkdir(outputDir, { recursive: true })`
  - [ ] Construire le nom du ZIP : `${manifest.name}-clawd-theme.zip`
  - [ ] Sérialiser `theme.json` depuis les 3 champs de `ThemeManifest` (`name`, `compatibleWith`, `version`)
  - [ ] Créer l'archive via `archiver('zip', { zlib: { level: 9 } })`
  - [ ] Ajouter `theme.json` à l'archive : `<nom-pet>/theme.json`
  - [ ] Ajouter les 8 APNGs : `<nom-pet>/assets/<state>.apng` pour chaque état
  - [ ] Attendre la finalisation via Promise sur l'événement `'close'` du writeStream
  - [ ] Retourner `{ mode: 'zip', path: zipPath }` avec chemin absolu (`resolve(...)`)
- [ ] Vérifier les frontières architecturales : aucun import depuis `src/cli/`, `src/core/`, ni `@clack/prompts`
- [ ] `pnpm build` → exit 0
- [ ] `pnpm typecheck` → exit 0

## Dev Notes

### Contexte de la story

Cette story implémente la **première brique de l'Epic 3** : `src/adapters/clawd.ts`.

Le fichier existe déjà mais est un stub vide (`export {};`). Il faut le **remplacer intégralement** par l'implémentation ci-dessous.

**Position dans le pipeline global :**

```
cli/index.ts
  → core/fetch-spritesheet.ts   (Story 2.1 — done ✅)
  → core/detect-grid.ts         (Story 2.2 — done ✅)
  → core/slice-frames.ts        (Story 2.3 — done ✅)
  → core/encode-apngs.ts        (Story 2.4 — done ✅)
  → adapters/clawd.ts           ← CETTE STORY (mode ZIP uniquement)
    detectClawd()               ← Story 3.2
    generateZip()               ← CETTE STORY ✅
    install()                   ← Story 3.2
  → cli/prompts.ts              ← Story 3.3
  → cli/messages.ts             ← Story 3.4
```

**Périmètre de cette story : mode ZIP uniquement.** Les fonctions `detectClawd()` et `install()` (mode 'install') sont réservées à Story 3.2. Ne pas les implémenter dans cette story pour ne pas anticiper.

### Interface `AdapterInput` (rappel)

```ts
// src/types.ts — ne pas modifier
interface AdapterInput {
  /** Each Buffer must be non-empty — a zero-length buffer will produce a corrupt APNG. */
  apngs: Record<ClawdState, Buffer>;
  manifest: ThemeManifest;
  /**
   * Destination directory for the generated theme files.
   * The Core does NOT guarantee this directory exists — the adapter is responsible
   * for creating it if needed (e.g., via `fs.mkdir(outputDir, { recursive: true })`).
   * Must be an absolute filesystem path.
   */
  outputDir: string;
}

interface ThemeManifest {
  name: string;
  /** Format attendu : `"clawd-on-desk@1.x"` */
  compatibleWith: string;
  version: string;
}
```

**Points critiques :**

- `outputDir` peut ne pas exister → l'adapter **doit** créer le répertoire si nécessaire
- `outputDir` doit être un chemin absolu (la CLI layer en est responsable)

### Structure du ZIP produit

```
<nom-pet>-clawd-theme.zip
└── <nom-pet>/
    ├── theme.json
    └── assets/
        ├── idle.apng
        ├── thinking.apng
        ├── working.apng
        ├── error.apng
        ├── happy.apng
        ├── notification.apng
        ├── sleeping.apng
        └── waking.apng
```

- Le préfixe `<nom-pet>` est `manifest.name` (ex. `"clippy"`)
- Le fichier ZIP se nomme `${manifest.name}-clawd-theme.zip`

### `theme.json` — contenu exact

```json
{
  "name": "clippy",
  "compatibleWith": "clawd-on-desk@1.x",
  "version": "1.0.0"
}
```

Les 3 champs sont les 3 champs de `ThemeManifest`. Les sérialiser en JSON indenté (`JSON.stringify(..., null, 2)`) pour la lisibilité.

### `archiver` — API v7

`archiver` est déjà dans les `dependencies` (`^7.0.1`) et `@types/archiver` dans `devDependencies`. Aucune installation supplémentaire requise.

**Pattern async/await avec archiver :**

```typescript
import { createWriteStream } from "node:fs";
import archiver from "archiver";

// Attendre la fermeture du writeStream, pas juste la finalisation de l'archive
await new Promise<void>((resolvePromise, rejectPromise) => {
  const output = createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  // L'événement 'close' sur output (pas 'finish') indique que tout est écrit sur disque
  output.on("close", () => resolvePromise());
  archive.on("error", rejectPromise);

  archive.pipe(output);

  // Ajouter les entrées AVANT d'appeler finalize()
  archive.append(themeJson, { name: `${petName}/theme.json` });
  for (const [state, buffer] of Object.entries(apngs)) {
    archive.append(buffer as Buffer, {
      name: `${petName}/assets/${state}.apng`,
    });
  }

  archive.finalize(); // déclenche la fermeture
});
```

**⚠️ `resolve` conflict** : `node:path` exporte `resolve`. Si on l'importe, il entre en conflit avec le paramètre `resolve` de la Promise. Utiliser un alias : `import { resolve as resolvePath, join } from 'node:path'`.

### Skeleton copier-coller — `src/adapters/clawd.ts`

```typescript
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";
import archiver from "archiver";
import type { AdapterInput, AdapterOutput } from "../types";

/**
 * Generates a Clawd on Desk theme ZIP archive from the given adapter input.
 * Creates `<name>-clawd-theme.zip` in `input.outputDir`.
 * @param input - Adapter input: APNGs, manifest, and destination directory.
 * @returns AdapterOutput with mode 'zip' and the absolute path to the generated ZIP.
 */
export const generateZip = async (
  input: AdapterInput,
): Promise<AdapterOutput> => {
  const { apngs, manifest, outputDir } = input;
  const petName = manifest.name;
  const zipFileName = `${petName}-clawd-theme.zip`;
  const zipPath = resolvePath(join(outputDir, zipFileName));

  // outputDir may not exist — the adapter is responsible for creating it (see AdapterInput.outputDir JSDoc)
  await mkdir(outputDir, { recursive: true });

  const themeJson = JSON.stringify(
    {
      name: manifest.name,
      compatibleWith: manifest.compatibleWith,
      version: manifest.version,
    },
    null,
    2,
  );

  await new Promise<void>((resolvePromise, rejectPromise) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // 'close' fires after all data is flushed and the underlying file descriptor is closed
    output.on("close", () => resolvePromise());
    archive.on("error", rejectPromise);
    archive.pipe(output);

    archive.append(themeJson, { name: `${petName}/theme.json` });

    for (const [state, buffer] of Object.entries(apngs)) {
      archive.append(buffer as Buffer, {
        name: `${petName}/assets/${state}.apng`,
      });
    }

    archive.finalize();
  });

  return {
    mode: "zip",
    path: zipPath,
  };
};
```

### Règles anti-erreurs critiques

1. **`archiver` est un CJS package** — `import archiver from 'archiver'` fonctionne avec `"moduleResolution": "bundler"` + tsup. Ne pas utiliser `import { create } from 'archiver'`.

2. **`output.on('close')`, pas `output.on('finish')`** — sur `createWriteStream`, `'finish'` se déclenche quand les données sont écrites en buffer OS mais avant le flush disque ; `'close'` garantit que le file descriptor est fermé et le fichier lisible. Toujours utiliser `'close'`.

3. **Alias `resolvePath`** — ne pas importer `resolve` directement de `node:path` dans une fonction avec `new Promise<void>((resolve, reject) => ...)` — collision de noms silencieuse.

4. **Entrées dans l'archive avant `finalize()`** — `archive.finalize()` clôture l'archive. Toujours appeler `append()` avant.

5. **`buffer as Buffer`** — `Object.entries(apngs)` retourne `[string, Buffer][]` mais TypeScript infère `[string, unknown][]` dans certains contextes. Cast explicite requis si l'erreur de type apparaît.

6. **Jamais `import @clack/prompts`** — violation de frontière architecturale. Uniquement dans `src/cli/`.

7. **Jamais importer depuis `src/core/`** — frontière architecturale : `adapters/clawd.ts` importe uniquement depuis `../types`.

8. **Imports sans extension `.js`** — `"moduleResolution": "bundler"` dans tsconfig.

### Dépendances disponibles

| Dépendance         | Source            | Notes                                   |
| ------------------ | ----------------- | --------------------------------------- |
| `archiver`         | `dependencies`    | ZIP creation — déjà installé `^7.0.1`   |
| `@types/archiver`  | `devDependencies` | Types archiver — déjà installé `^7.0.0` |
| `node:fs`          | Node.js built-in  | `createWriteStream`                     |
| `node:fs/promises` | Node.js built-in  | `mkdir`                                 |
| `node:path`        | Node.js built-in  | `join`, `resolve as resolvePath`        |

### Fichiers à modifier

| Fichier                 | Action                     | Notes                      |
| ----------------------- | -------------------------- | -------------------------- |
| `src/adapters/clawd.ts` | **REMPLACER** `export {};` | Skeleton complet ci-dessus |

### Fichiers à NE PAS modifier

| Fichier                                           | Raison                                        |
| ------------------------------------------------- | --------------------------------------------- |
| `src/types.ts`                                    | Types publics finalisés                       |
| `src/core/fetch-spritesheet.ts`                   | Implémentation Story 2.1 — ne pas toucher     |
| `src/core/detect-grid.ts`                         | Implémentation Story 2.2 — ne pas toucher     |
| `src/core/slice-frames.ts`                        | Implémentation Story 2.3 — ne pas toucher     |
| `src/core/encode-apngs.ts`                        | Implémentation Story 2.4 — ne pas toucher     |
| `src/core/state-mapping.ts`                       | Finalisé Story 2.2 (BDR-022) — ne pas toucher |
| `src/cli/index.ts`                                | Entry point → Story 3.3                       |
| `package.json`, `tsconfig.json`, `tsup.config.ts` | Configuration finalisée                       |

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

| AC  | Comment vérifier                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------- |
| AC1 | Vérifier magic bytes ZIP (`0x50 0x4B`) + présence du fichier dans `outputDir` — extraction manuelle pour inspecter la structure |
| AC2 | Extraire le ZIP → lire `<nom-pet>/theme.json` → vérifier les 3 champs `name`, `compatibleWith`, `version`                       |
| AC3 | Extraire le ZIP → vérifier magic bytes `\x89PNG` + chunk `acTL` sur les 8 APNGs (ou les ouvrir dans un visualiseur)             |
| AC4 | `result.mode === 'zip'` + `result.path.endsWith('<nom>-clawd-theme.zip')` + `path.isAbsolute(result.path)`                      |

**Script de validation complet** (créer `test-3-1.mjs`, exécuter, supprimer) :

```js
import { fetchSpritesheet } from "./src/core/fetch-spritesheet.js";
import { detectGrid } from "./src/core/detect-grid.js";
import { sliceFrames } from "./src/core/slice-frames.js";
import { encodeAPNGs } from "./src/core/encode-apngs.js";
import { generateZip } from "./src/adapters/clawd.js";
import { readFile, rm } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { resolve } from "node:path";

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

const runPipeline = async (source) => {
  const buffer = await fetchSpritesheet(source);
  const grid = await detectGrid(buffer);
  const frames = await sliceFrames(buffer, grid);
  return await encodeAPNGs(frames);
};

const testGenerateZip = async (source, themeName, label) => {
  console.log(`\n📌 ${label}`);

  const apngs = await runPipeline(source);

  const manifest = {
    name: themeName,
    compatibleWith: "clawd-on-desk@1.x",
    version: "1.0.0",
  };

  const outputDir = resolve("./test-output");
  const result = await generateZip({ apngs, manifest, outputDir });

  // AC4 — AdapterOutput
  assert(result.mode === "zip", 'mode = "zip"');
  assert(
    typeof result.path === "string" && result.path.length > 0,
    "path est une string non vide",
  );
  assert(isAbsolute(result.path), "path est absolu");
  assert(
    result.path.endsWith(`${themeName}-clawd-theme.zip`),
    `path se termine par ${themeName}-clawd-theme.zip`,
  );

  // AC1 — ZIP existe + magic bytes
  const zipBuffer = await readFile(result.path);
  assert(zipBuffer.length > 0, "ZIP non vide");
  assert(
    zipBuffer[0] === 0x50 && zipBuffer[1] === 0x4b,
    "ZIP magic bytes PK ✓",
  );

  console.log(
    `  📁 ZIP : ${result.path} (${(zipBuffer.length / 1024).toFixed(1)} KB)`,
  );
  console.log(`  ⚠️  AC1/AC2/AC3 — vérification manuelle requise :`);
  console.log(
    `     Expand-Archive -Path "${result.path}" -DestinationPath test-extracted`,
  );
  console.log(
    `     Vérifier : ${themeName}/theme.json + 8 APNGs dans ${themeName}/assets/`,
  );
};

// Test 1 — URL distante .webp
await testGenerateZip(
  "https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp",
  "clippy",
  "URL distante .webp (clippy)",
);

// Test 2 — fichier local .webp (LRN-036)
await testGenerateZip(
  "./test-sprite.webp",
  "test-local-webp",
  "Fichier local .webp",
);

console.log(`\n📊 Résultat : ${passed} passés / ${passed + failed} total`);
if (failed > 0) process.exit(1);

// Nettoyage
console.log("\n🧹 Nettoyage...");
await rm("./test-output", { recursive: true, force: true });
await rm("./test-extracted", { recursive: true, force: true }).catch(() => {});
```

> ⚠️ **LRN-037** : Annoncer explicitement les 3 phases : (1) téléchargement des fichiers locaux + création de `test-3-1.mjs`, (2) exécution avec résultats, (3) suppression des fichiers temporaires. Ne pas les enchaîner silencieusement.

**Gate final obligatoire :**

```bash
rtk pnpm build       # exit 0
rtk pnpm typecheck   # exit 0
```

### Deferred work applicable

**D1 de Story 2.4 (🔵 ouvert) :** "Guard runtime `apngasm-bin` absent avant appel." Non couvrable dans `clawd.ts` — ce guard appartient à la CLI layer (Story 3.x).

**D3 de Story 1.3 (🔵 ouvert) :** "Politique de versionnement sémantique." Non adressable dans cette story — documentation future.

## Dev Agent Record

_(à remplir lors de l'implémentation)_

## File List

- `src/adapters/clawd.ts` — implémentation complète (remplace stub)

## Change Log

| Date       | Changement                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| 2026-05-07 | Story créée — contexte complet, skeleton `generateZip` copier-coller fourni |
