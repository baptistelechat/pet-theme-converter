---
id: EVAL-028
type: eval
date: 2026-05-07
---

# EVAL-028 — Story 2.2 produite — `detectGrid` + correction STATE_MAPPING + protocole de test complet

| Output                                                                                                                                                                                                                                                                                                   | Méthode eval                                                                                                                              | Anomalies                                                                                                                                                                                                           | Action |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Story 2.2 "Détection de la grille et STATE_MAPPING" — skeleton `detectGrid` complet, interface `GridInfo` exportée depuis `detect-grid.ts`, correction `frames: 9` → `frames: 8` dans STATE_MAPPING, protocole de test : 6 URLs Petdex (rétrospective Epic 1) + 2 fichiers locaux téléchargés via `curl` | Analyse croisée : architecture.md, deferred-work.md, Story 2.1, LRN-001/LRN-030/LRN-031/LRN-032/LRN-033/LRN-034, format Codex 1536×1872px | Aucune anomalie. Correction du placeholder `frames: 9` justifiée mathématiquement (1536÷8=192px/colonne → 8 colonnes = 8 frames). Baptiste a demandé l'ajout de tests avec fichiers locaux — intégré sans friction. | keep   |

## Références

- [LRN-035](../learnings/LRN-035.md) — Grille Petdex : 8 colonnes = 8 frames par état
- [LRN-036](../learnings/LRN-036.md) — Protocole de test Core I/O : URL + local
- [BDR-019](../decisions/BDR-019.md) — GridInfo dans detect-grid.ts, pas dans types.ts
