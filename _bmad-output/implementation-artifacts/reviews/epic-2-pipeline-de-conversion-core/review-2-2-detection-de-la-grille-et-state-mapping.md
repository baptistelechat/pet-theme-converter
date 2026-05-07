# Review — Story 2.2 : Détection de la grille et STATE_MAPPING

**Date :** 2026-05-07
**Story :** `2-2-detection-de-la-grille-et-state-mapping`
**Spec :** `_bmad-output/implementation-artifacts/2-2-detection-de-la-grille-et-state-mapping.md`
**Layers :** Blind Hunter ✅ | Edge Case Hunter ✅ | Acceptance Auditor ✅

---

## Résumé

| Catégorie       | Count                          |
| --------------- | ------------------------------ |
| Decision-needed | 0                              |
| Patch           | 3 ✅                           |
| Defer           | 5 (D1 résolu opportunistement) |
| Dismissed       | 7                              |

**Acceptance Auditor :** 0 violations — AC1 ✅ AC2 ✅ AC3 ✅ + toutes les contraintes architecturales ✅

---

## Findings

### Patches

- [x] [Review][Patch] P1 — `GridInfo` : commentaires inline manquants sur `isStandard`, `expectedWidth`, `expectedHeight` [`src/core/detect-grid.ts:4-11`]
- [x] [Review][Patch] P2 — `STANDARD_ROWS = 9` : commentaire manquant sur la sémantique (9 lignes Petdex, 8 utilisées par Clawd) [`src/core/detect-grid.ts:13`]
- [x] [Review][Patch] P3 — `frames: 8` : commentaire manquant expliquant la correction (8 colonnes = 8 frames/état, jamais 9) [`src/core/state-mapping.ts:7-14`]

### Defers

- [x] [Review][Defer] D1 — Buffer vide → `ValidationError` générique — ✅ résolu opportunistement : guard `buffer.length === 0` ajouté en tête de `detectGrid` [`src/core/detect-grid.ts:21-23`]
- [x] [Review][Defer] D2 — `Math.round` masque spritesheets non-alignées → hors-bornes potentiels dans `sliceFrames` [`src/core/detect-grid.ts:39-40`] — deferred, pre-existing. Scope Story 2.3.
- [x] [Review][Defer] D3 — `detectGrid` sans `onProgress` → étape invisible dans la progression CLI [`src/core/detect-grid.ts`] — deferred. Scope Story 3.3.
- [x] [Review][Defer] D4 — `ValidationError` mélange format invalide et erreur opérationnelle (architectural, pre-existing) [`src/core/detect-grid.ts`] — deferred, pre-existing. Scope architectural.
- [x] [Review][Defer] D5 — `frames: 8` dans `state-mapping.ts` non synchronisé avec `STANDARD_COLS` (aucune assertion runtime) [`src/core/state-mapping.ts:7-14`] — deferred. Scope Story 2.3 / tests futurs.

### Dismissed (7)

1. `cols: STANDARD_COLS` toujours fixe à 8 — design per spec, confirmé par Acceptance Auditor (AC1 ✅)
2. Spread conditionnel sans commentaire inline — code lisible, règle "no-comments by default"
3. Tests unitaires non reproductibles depuis le repo — deferred by design (pas de runner en v0.1)
4. `STATE_MAPPING` sans `frameDelay`/timing — exigence future hypothétique, hors spec actuelle
5. Division par zéro si `STANDARD_COLS = 0` — constante hardcodée, impossible à 0
6. `metadata.width = 0` non détecté — le check `!metadata.width` gère correctement le cas falsy
7. Acceptance Auditor : 0 violations AC/contraintes
