---
id: EVAL-031
type: eval
date: 2026-05-07
---

# EVAL-031 — Story 2.3 produite — `sliceFrames` skeleton complet, `.png()` pour apngasm-bin, gestion D2 Story 2.2

| Output                                                                                                                                        | Méthode eval                                                                                     | Anomalies | Action |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------- | ------ |
| Story 2.3 `2-3-decoupe-des-frames-par-etat.md` — 3 ACs BDD, skeleton `sliceFrames` copier-coller, script test 4 scénarios (2 URLs + 2 locaux) | Lecture epics.md + architecture + stories 2.1/2.2 + fichiers source existants + deferred-work.md | Aucune    | keep   |

Décisions de conception documentées dans la story :

- `.png()` conversion systématique en sortie de `sharp.extract()` — contrat avec `apngasm-bin` (Story 2.4)
- D2 de la review Story 2.2 (Math.round masking) traité partiellement via error wrapping sharp → `ValidationError` avec état + numéro de frame
- D5 de Story 2.2 (frames non synchronisé avec STANDARD_COLS) conservé ouvert

## Références

- [LRN-039](../learnings/LRN-039.md) — pattern `.png()` capturé depuis cette story
