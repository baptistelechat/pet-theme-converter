---
story: 2-3-decoupe-des-frames-par-etat
date: 2026-05-07
reviewer: Claude (bmad-code-review)
---

# Review — Story 2.3 : Découpe des frames par état

## Résultat

| Catégorie | Compte |
| --------- | ------ |
| Patch     | 1      |
| Defer     | 5      |
| Dismissed | 14     |

**Acceptance Auditor :** 0 violation — AC1, AC2, AC3 tous satisfaits ✅

---

## Patch

### P1 — JSDoc manquante sur `sliceFrames` [src/core/slice-frames.ts:7]

- [x] [Review][Patch] JSDoc manquante sur `sliceFrames` [src/core/slice-frames.ts:7] — ✅ appliqué (2026-05-07)

`sliceFrames` est une fonction publique exportée du module Core. Aucun commentaire JSDoc ne documente ses paramètres, sa valeur de retour, les préconditions attendues, ni les erreurs qu'elle peut lancer (pattern LRN-025 : JSDoc sur API publique = patch non-ambigu).

**Fix suggéré :**

```ts
/**
 * Slice a spritesheet buffer into individual frames grouped by Clawd state.
 * @param buffer - Raw image data returned by `fetchSpritesheet`.
 * @param grid - Grid metadata returned by `detectGrid`.
 * @param onProgress - Optional callback invoked once per state with a human-readable label.
 * @returns A record mapping each ClawdState to its extracted PNG frames.
 * @throws {ValidationError} If the buffer is empty or sharp fails to extract a frame.
 */
```

---

## Defer

### D1 — `sharp(buffer)` réinstancié 64× sans `.clone()` [src/core/slice-frames.ts:31]

- [x] [Review][Defer] `sharp(buffer)` réinstancié 64× sans `.clone()` [src/core/slice-frames.ts:31] — ✅ résolu opportunistement (2026-05-07)

`sharpBase = sharp(buffer)` créé une seule fois hors des boucles. Chaque frame utilise `sharpBase.clone()`. Combiné avec D3 (`Promise.all`).

---

### D2 — Bornes extraction non pré-vérifiées vs dimensions réelles [src/core/slice-frames.ts:26-37]

- [x] [Review][Defer] Bornes extraction non pré-vérifiées vs dimensions réelles [src/core/slice-frames.ts:26-37] — deferred, pre-existing

`left + cellWidth` et `top + cellHeight` ne sont pas comparés aux dimensions réelles du buffer avant extraction. Mitigation actuelle : sharp catch les out-of-bounds et lance une erreur wrappée en `ValidationError` avec état + numéro de frame. Clampage complet → nécessite `totalWidth`/`totalHeight` dans `GridInfo`. Documenté dans la story comme déféré de la review 2.2 (D2). Scope post-v0.1.

---

### D3 — Await séquentiel non parallélisé [src/core/slice-frames.ts:26-47]

- [x] [Review][Defer] Await séquentiel non parallélisé [src/core/slice-frames.ts:26-47] — ✅ résolu opportunistement (2026-05-07)

`Promise.all(Array.from({ length: frames }, ...))` sur la boucle frame-level. Les 8 frames d'un même état sont désormais extraites en parallèle. États toujours séquentiels (pour `onProgress` ordonné).

---

### D4 — Messages d'erreur en français dans une librairie publique [src/core/slice-frames.ts:14, 44]

- [x] [Review][Defer] Messages d'erreur en français dans une lib publique [src/core/slice-frames.ts:14, 44] — ✅ résolu opportunistement (2026-05-07)

Tous les messages des 3 modules Core traduits en anglais : `fetch-spritesheet.ts` (7 strings), `detect-grid.ts` (3 strings), `slice-frames.ts` (3 strings). Build ✅, typecheck ✅.

---

### D5 — `onProgress` sans paramètre ratio 0-1 [src/core/slice-frames.ts:23]

- [x] [Review][Defer] `onProgress` sans ratio de progression 0-1 [src/core/slice-frames.ts:23] — ✅ résolu opportunistement (2026-05-07)

`onProgress?.(label, stateIndex / stateEntries.length)` — ratio calculé depuis l'index dans `stateEntries`. Passe `0/8, 1/8, ..., 7/8` à chaque invocation.

---

## Dismissed (14)

| Source | Finding                                      | Raison                                                                                                                  |
| ------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| BH-2   | `{} as Record` cast                          | Pattern TS standard pour construction incrémentale d'un Record. Aucun résultat partiel exposé (exception avant return). |
| BH-3   | `Object.entries` ordering                    | Ordre d'insertion garanti ECMAScript 2015+ pour clés string non-numériques.                                             |
| BH-5   | onProgress par état, pas par frame           | AC3 spécifie "invoqué pour chaque état découpé". Comportement conforme à la spec.                                       |
| BH-6   | ValidationError re-throw sans contexte       | Logic correcte. Sharp n'émet pas de ValidationError. Re-throw préserve le message original.                             |
| BH-7   | cellWidth=0 guard absent                     | detectGrid est responsable de la validité de GridInfo. Si cellWidth=0, detectGrid aurait déjà échoué. Subsumé par D2.   |
| BH-9   | `state as ClawdState` redondant              | `state` est déjà typé `ClawdState` via le cast sur `Object.entries`. Redondant mais inoffensif.                         |
| BH-12  | Memory limit globale                         | Subsumé par D1/D3. Design v0.1 documenté.                                                                               |
| ECH-1  | Double `const result`                        | Faux positif — artefact du prompt d'agent. Fichier réel = 1 seule déclaration.                                          |
| ECH-2  | cellWidth=0 → message d'erreur opaque        | Subsumé par D2.                                                                                                         |
| ECH-5  | Cast masque désync STATE_MAPPING/ClawdState  | STATE_MAPPING typé `Record<ClawdState,...>` — cast nécessaire (Object.entries → string[]) mais sûr. Alignement vérifié. |
| ECH-6  | `frames=0` → tableau vide silencieux         | Impossible avec STATE_MAPPING constant typé à `frames: 8`.                                                              |
| ECH-7  | STATE_MAPPING vide → retour `{}` sans erreur | Impossible avec STATE_MAPPING constant typé.                                                                            |
| ECH-10 | Aucune corrélation buffer↔grid               | Responsabilité du pipeline appelant, boundary design.                                                                   |
| ECH-11 | Retour `Buffer[]` trop large (Node 22+)      | Compatible Node 18-20 (cible du projet). Non-issue.                                                                     |
| ECH-12 | Désync ClawdState ↔ STATE_MAPPING            | Faux positif — STATE_MAPPING et ClawdState parfaitement alignés dans les fichiers réels.                                |
