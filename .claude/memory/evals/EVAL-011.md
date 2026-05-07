---
id: EVAL-011
type: eval
date: 2026-05-05
---

# EVAL-011 — Story 1.1 produite via `/bmad-create-story` — anomalie `moduleResolution` détectée et corrigée

| Output                                                                                                                                                        | Méthode eval                               | Anomalies                                                                                                                                                                           | Action          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Story `1-1-initialisation-du-projet-et-configuration-du-build.md` — 7 tâches, 5 ACs BDD, Dev Notes complets (skeleton package.json, tsconfig, tsup, stub CLI) | Relecture par Baptiste + retour en session | `"moduleResolution": "Node16"` hérité de l'architecture — impose les extensions `.js`, non voulu. Corrigé vers `"moduleResolution": "bundler"` dans la story et dans `epics.md` AC3 | keep (corrigée) |

La story est prête pour `/bmad-dev-story`. Le sprint-status.yaml a été mis à jour : `epic-1` → `in-progress`, story 1.1 → `ready-for-dev`.

## Références

- [BDR-012](../decisions/BDR-012.md) — décision `moduleResolution: bundler`
- [LRN-013](../learnings/LRN-013.md) — pattern TypeScript + tsup
