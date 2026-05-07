---
id: "2-1-telechargement-et-validation-de-la-spritesheet"
epic: 2
story: 1
title: "Téléchargement et validation de la spritesheet"
status: review
created: 2026-05-07
---

# Story 2.1 — Téléchargement et validation de la spritesheet

## User Story

En tant qu'utilisateur,
Je veux fournir une URL distante ou un chemin local comme source de spritesheet,
Afin que le système récupère le fichier de manière sécurisée avant tout traitement.

## Status

**Status :** done

> 📋 **Review :** [reviews/epic-2/review-2-1-telechargement-et-validation-de-la-spritesheet.md](../reviews/epic-2/review-2-1-telechargement-et-validation-de-la-spritesheet.md)

## Acceptance Criteria

### AC1 — URL HTTPS valide → Buffer + timeout < 30s

**Étant donné** que je fournis une URL HTTPS valide pointant vers une image `.webp` ou `.png`
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction retourne un `Buffer` contenant les octets de l'image
**Et** le téléchargement s'effectue en moins de 30 secondes (NFR2)

### AC2 — Timeout dépassé → FetchError

**Étant donné** que je fournis une URL dont le téléchargement dépasse 30 secondes
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction lève une `FetchError` avec `exitCode = 1`

### AC3 — Content-Type non-image → ValidationError

**Étant donné** que je fournis une URL valide et accessible dont le `Content-Type` HTTP n'est pas une image (ex. `text/html`)
**Quand** `fetchSpritesheet(url)` est appelé
**Alors** la fonction lève une `ValidationError` avec `exitCode = 2`

### AC4 — Chemin local existant → Buffer sans réseau

**Étant donné** que je fournis un chemin local absolu ou relatif vers un fichier existant
**Quand** `fetchSpritesheet(path)` est appelé
**Alors** la fonction retourne un `Buffer` contenant le fichier sans requête réseau

### AC5 — Chemin local inexistant → FetchError

**Étant donné** que je fournis un chemin local vers un fichier inexistant
**Quand** `fetchSpritesheet(path)` est appelé
**Alors** la fonction lève une `FetchError` avec `exitCode = 1`

### AC6 — onProgress optionnel et fonctionnel

**Étant donné** qu'un `onProgress?: ProgressCallback` est injecté
**Quand** la fonction est appelée
**Alors** le callback est appelé au démarrage du téléchargement / de la lecture avec un label de step lisible
**Et** la fonction fonctionne identiquement si `onProgress` est absent (paramètre optionnel)

## Tasks

- [x] Implémenter `src/core/fetch-spritesheet.ts` — remplacer le stub `export {};` par l'implémentation complète
  - [x] Détection URL vs chemin local via `new URL()`
  - [x] Téléchargement URL avec `fetch()` natif + `AbortController` (timeout 30s)
  - [x] Vérification `response.ok` → `FetchError` si non-2xx
  - [x] Validation `Content-Type` (`image/`) → `ValidationError` si non-image
  - [x] Lecture fichier local avec `fs.readFile` (node:fs/promises)
  - [x] Callback `onProgress` optionnel appelé au démarrage de chaque branche
  - [x] Conversion `ArrayBuffer` → `Buffer` pour la réponse fetch
- [x] Vérifier les frontières architecturales : aucun import depuis `src/cli/`, `src/adapters/`, ni `@clack/prompts`
- [x] `pnpm build` → exit 0, `dist/index.js` généré
- [x] `pnpm typecheck` → exit 0, zéro erreur TypeScript

## Dev Notes

### Contexte de la story

Cette story implémente la **première brique du pipeline Core** : `src/core/fetch-spritesheet.ts`.

Le fichier existe déjà mais est un stub vide (`export {};`). Il faut le **remplacer intégralement** par l'implémentation ci-dessous.

**Position dans le pipeline :**

```
cli/index.ts
  → core/fetch-spritesheet.ts   ← CETTE STORY
  → core/detect-grid.ts         (Story 2.2)
  → core/slice-frames.ts        (Story 2.3)
  → core/encode-apngs.ts        (Story 2.4)
  → adapters/clawd.ts           (Epic 3)
```

**Signature attendue par le call site dans `cli/index.ts` (Epic 3 — ne pas anticiper) :**

```ts
const buffer = await fetchSpritesheet(source, { timeout: 30_000, onProgress });
```

### Dépendances disponibles

| Dépendance         | Source            | Notes                                                 |
| ------------------ | ----------------- | ----------------------------------------------------- |
| `node:fs/promises` | Built-in Node 18+ | `readFile` pour fichiers locaux                       |
| `node:path`        | Built-in Node 18+ | Si besoin de résolution de chemin                     |
| `fetch()`          | Global Node 18+   | **Natif — aucun `node-fetch` ni `axios` à installer** |
| `AbortController`  | Global Node 16+   | Pour le timeout sur `fetch()`                         |

`sharp` est en `optionalDependencies` dans `package.json` mais **n'est pas utilisé dans ce fichier** — il est réservé à `detect-grid.ts` et `slice-frames.ts`.

### Formats à supporter (LRN-030 — rétrospective Epic 1)

Les spritesheets Petdex coexistent en deux formats :

- `.webp` → `Content-Type: image/webp` ✅ couvert par `startsWith("image/")`
- `.png` → `Content-Type: image/png` ✅ couvert par `startsWith("image/")`

La validation par `Content-Type` suffit — ne pas faire de check sur l'extension de l'URL.

### Skeleton copier-coller — `src/core/fetch-spritesheet.ts`

```typescript
import { readFile } from "node:fs/promises";
import { FetchError, ValidationError } from "../types";
import type { ProgressCallback } from "../types";

const DEFAULT_TIMEOUT = 30_000;

interface FetchOptions {
  timeout?: number;
  onProgress?: ProgressCallback;
}

const isUrl = (source: string): boolean => {
  try {
    const url = new URL(source);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const fetchFromUrl = async (
  url: string,
  timeout: number,
  onProgress?: ProgressCallback,
): Promise<Buffer> => {
  onProgress?.("Téléchargement de la spritesheet");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new FetchError(
        `URL inaccessible (HTTP ${response.status}) : ${url}`,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw new ValidationError(
        `Content-Type non supporté : "${contentType}". Une image est attendue.`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    if (err instanceof FetchError || err instanceof ValidationError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new FetchError(
        `Timeout dépassé (${timeout / 1000}s) lors du téléchargement de ${url}`,
      );
    }
    throw new FetchError(
      `Impossible d'accéder à l'URL : ${url}. ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }
};

const fetchFromLocal = async (
  filePath: string,
  onProgress?: ProgressCallback,
): Promise<Buffer> => {
  onProgress?.("Lecture de la spritesheet locale");

  try {
    return await readFile(filePath);
  } catch {
    throw new FetchError(`Fichier introuvable : ${filePath}`);
  }
};

export const fetchSpritesheet = async (
  source: string,
  options: FetchOptions = {},
): Promise<Buffer> => {
  const { timeout = DEFAULT_TIMEOUT, onProgress } = options;

  if (isUrl(source)) {
    return fetchFromUrl(source, timeout, onProgress);
  }
  return fetchFromLocal(source, onProgress);
};
```

### Règles anti-erreurs critiques

1. **`fetch()` est natif en Node 18+** — ne pas ajouter `node-fetch`, `axios` ni aucun autre client HTTP. `package.json` ne les contient pas.

2. **Séquence du `catch` dans `fetchFromUrl`** — toujours re-lancer les erreurs typées en premier :

   ```ts
   if (err instanceof FetchError || err instanceof ValidationError) throw err;
   ```

   Sinon elles seraient enveloppées dans un `FetchError` générique → perte du type.

3. **`AbortError` pour le timeout** — en Node 18+, quand `AbortController.abort()` se déclenche, l'erreur est une `DOMException` avec `name === "AbortError"`. Vérifier `err.name === "AbortError"`, pas `err instanceof AbortError`.

4. **`response.ok` avant le Content-Type** — une URL 404 retourne `text/html`, ce qui déclencherait une `ValidationError`. Or une URL inaccessible doit lever une `FetchError`. L'ordre correct est :
   - `!response.ok` → `FetchError`
   - Content-Type non-image → `ValidationError`

5. **`Buffer.from(arrayBuffer)`** — `response.arrayBuffer()` retourne un `ArrayBuffer` (Web API), pas un `Buffer` Node. Convertir obligatoirement avec `Buffer.from()`.

6. **Imports sans extension `.js`** — `"moduleResolution": "bundler"` dans `tsconfig.json` :

   ```ts
   import { FetchError } from "../types"; // ✅
   import { FetchError } from "../types.js"; // ❌
   ```

7. **Jamais `throw new Error()`** — utiliser `FetchError` ou `ValidationError`. C'est une règle d'enforcement architecturale du projet.

8. **Jamais `import @clack/prompts`** dans ce fichier — violation de frontière architecturale (Core → CLI interdite).

### Fichiers à modifier

| Fichier                         | Action                     | Notes                   |
| ------------------------------- | -------------------------- | ----------------------- |
| `src/core/fetch-spritesheet.ts` | **REMPLACER** `export {};` | Implémentation complète |

### Fichiers à NE PAS modifier

| Fichier                                           | Raison                                                          |
| ------------------------------------------------- | --------------------------------------------------------------- |
| `src/types.ts`                                    | `FetchError`, `ValidationError`, `ProgressCallback` déjà finaux |
| `src/core/state-mapping.ts`                       | Non concerné par cette story                                    |
| `src/core/detect-grid.ts`                         | Stub → Story 2.2                                                |
| `src/core/slice-frames.ts`                        | Stub → Story 2.3                                                |
| `src/core/encode-apngs.ts`                        | Stub → Story 2.4                                                |
| `src/adapters/clawd.ts`                           | Stub → Epic 3                                                   |
| `src/cli/index.ts`                                | Entry point → Story 3.3                                         |
| `package.json`, `tsconfig.json`, `tsup.config.ts` | Configuration finalisée                                         |

### URLs de test de référence (LRN-030)

À utiliser pour la **validation manuelle** des ACs (pas de tests automatisés en v0.1) :

```
# .webp — format principal
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/clippy-eb57a6c19a27/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/cinder-6161d74eaa29/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/emma-745775f158a3/sprite.webp
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/sima-832ee7de48ef/sprite.webp

# .png — valider que le Buffer retourné est correct
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/pets/yellow-rabbit-e1f4ef79a907/sprite.png

# nom de fichier différent (spritesheet vs sprite)
https://pub-94495283df974cfea5e98d6a9e3fa462.r2.dev/curated/boxcat/spritesheet.webp
```

### Vérification manuelle des ACs

| AC  | Comment vérifier                                                                           |
| --- | ------------------------------------------------------------------------------------------ |
| AC1 | `fetchSpritesheet(URL_webp)` → `Buffer`, `typeof buffer === 'object'`, `buffer.length > 0` |
| AC2 | `fetchSpritesheet(URL, { timeout: 1 })` → `FetchError` levée                               |
| AC3 | `fetchSpritesheet('https://example.com')` → `ValidationError` levée                        |
| AC4 | `fetchSpritesheet('./chemin/local/image.png')` → `Buffer` lu depuis disque                 |
| AC5 | `fetchSpritesheet('./inexistant.png')` → `FetchError` levée                                |
| AC6 | callback appelé avec label lisible ; appel sans callback → aucune erreur                   |

**Gate final obligatoire :**

```bash
rtk pnpm build       # exit 0
rtk pnpm typecheck   # exit 0
```

Ne pas déclarer la story terminée avant que les deux commandes passent.

### Deferred work applicable

Le déféré "Garde runtime pour les deps optionnelles" (depuis Story 1.1) concerne `sharp` et `apngasm-bin`. Ces deux dépendances **ne sont pas importées dans `fetch-spritesheet.ts`** → ce déféré ne s'applique pas à cette story (il sera traité en Stories 2.3/2.4).

## Dev Agent Record

### Implementation Plan

Implémentation directe depuis le skeleton copier-coller fourni dans les Dev Notes.

Architecture retenue :

- `isUrl()` — détection URL vs chemin local via `new URL()`, filtre protocoles `http:` / `https:`
- `fetchFromUrl()` — `fetch()` natif Node 18+, `AbortController` pour le timeout 30s, séquence correcte `response.ok` → Content-Type (LRN-031)
- `fetchFromLocal()` — `readFile()` depuis `node:fs/promises`
- `fetchSpritesheet()` — orchestrateur public, options `timeout` et `onProgress` optionnels

Frontières respectées : aucun import `@clack/prompts`, `src/cli/`, `src/adapters/`.

### Completion Notes

- `src/core/fetch-spritesheet.ts` : stub `export {};` remplacé par l'implémentation complète (82 lignes)
- `pnpm typecheck` → exit 0, zéro erreur TypeScript ✅
- `pnpm build` → `dist/index.js` 207 B, exit 0 ✅
- 6 ACs BDD satisfaits (URL webp/png, timeout, Content-Type, local existant/inexistant, onProgress)
- Séquence `response.ok` → Content-Type correctement ordonnée (LRN-031 appliqué)

## File List

- `src/core/fetch-spritesheet.ts` — **modifié** (stub remplacé par implémentation complète)

## Change Log

| Date       | Changement                                                                            |
| ---------- | ------------------------------------------------------------------------------------- |
| 2026-05-07 | Implémentation de `fetchSpritesheet` — fetch natif + AbortController + lecture locale |
