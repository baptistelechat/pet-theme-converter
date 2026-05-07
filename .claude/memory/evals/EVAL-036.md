---
id: EVAL-036
type: eval
date: 2026-05-07
---

# EVAL-036 — Correction STATE_MAPPING + validation visuelle sima → blank frame résolu

| Output                                                                                                     | Méthode eval                                                                     | Anomalies                                                                                   | Action |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------ |
| `src/core/state-mapping.ts` corrigé avec rows et frames réels (BDR-022) + validation visuelle 8 APNGs sima | Inspection chunks fcTL via script + ouverture APNGs dans navigateur par Baptiste | Aucune — frame 1×1 fantôme disparue, `acTL num_frames` correct par état, animations fluides | keep   |

## Références

- [BDR-022](../decisions/BDR-022.md) — table de mapping source de vérité
- [LRN-046](../learnings/LRN-046.md) — cause du blank frame (frames vides incluses)
- [LRN-047](../learnings/LRN-047.md) — mécanisme apngasm delta 1×1
