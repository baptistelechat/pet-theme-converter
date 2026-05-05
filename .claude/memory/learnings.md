---
register: learnings
last_updated: 2026-05-05
---

## Index

| ID                              | Date       | Pattern observé                                                                                                         | Contexte                                                                 |
| ------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [LRN-001](learnings/LRN-001.md) | 2026-05-04 | Format Petdex standardisé : grille 8×9, 192×208px, 9 états nommés                                                       | Analyse de l'écosystème Petdex                                           |
| [LRN-002](learnings/LRN-002.md) | 2026-05-04 | Mapping états Petdex → états Clawd on Desk (6 sur 9 ont un équivalent)                                                  | RFC de correspondance des états                                          |
| [LRN-003](learnings/LRN-003.md) | 2026-05-04 | Mapping états Petdex→Clawd provisoire, ajustable post-terrain                                                           | Clarification en session de brainstorming                                |
| [LRN-004](learnings/LRN-004.md) | 2026-05-04 | `bmad-product-brief` court-circuitable quand RFC complet + mémoire structurée                                           | Session `/bmad-product-brief` sur pet-theme-converter                    |
| [LRN-005](learnings/LRN-005.md) | 2026-05-04 | `resolve_customization.py` inutilisable sur Windows sans Python — fallback manuel suffisant                             | Activation de skill BMAD sur Windows                                     |
| [LRN-006](learnings/LRN-006.md) | 2026-05-04 | PRDs BMAD multi-step : duplications inter-sections naturelles à merger en step-11                                       | Session `/bmad-create-prd` — polish step-11                              |
| [LRN-007](learnings/LRN-007.md) | 2026-05-04 | BMAD step-04 (decisions) : filtrer les catégories génériques non pertinentes pour un CLI tool                           | Session `/bmad-create-architecture` sur pet-theme-converter              |
| [LRN-008](learnings/LRN-008.md) | 2026-05-04 | `bmad-create-epics-and-stories` step-03 : vérifier `document_output_language` avant de générer les stories              | Session `/bmad-create-epics-and-stories` sur pet-theme-converter         |
| [LRN-009](learnings/LRN-009.md) | 2026-05-04 | CLI tool + BMAD : Epic Core sans valeur end-user standalone = dérogation acceptable, ne pas bloquer                     | Session `/bmad-check-implementation-readiness` sur pet-theme-converter   |
| [LRN-010](learnings/LRN-010.md) | 2026-05-04 | Coverage Map ≠ couverture ACs UX : vérifier le QUAND/COMMENT de chaque FR d'interaction, pas seulement le QUOI          | Session `/bmad-check-implementation-readiness` — FR18 sans AC de flux UX |
| [LRN-011](learnings/LRN-011.md) | 2026-05-05 | `graphify` ignore les dossiers cachés (`.`) — `.claude/memory/` non détecté automatiquement, injection manuelle requise | Session `/graphify` sur pet-theme-converter                              |
| [LRN-012](learnings/LRN-012.md) | 2026-05-05 | Le dossier `_bmad/` est un framework interne (≡ `node_modules/`) — toujours l'exclure via `.graphifyignore`             | Session `/graphify` — pollution du graphe par nœuds AST non pertinents   |
