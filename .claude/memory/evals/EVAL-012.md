---
id: EVAL-012
type: eval
date: 2026-05-05
---

# EVAL-012 — Graphe graphify v3 — 125 nœuds, 194 edges, 13 communautés

| Output                                                    | Méthode eval                                                                          | Anomalies                                                                                           | Action |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| Graphe graphify v3 : 125 nœuds, 194 edges, 13 communautés | 3 subagents parallèles, injection manuelle `.claude/memory/`, `.graphifyignore` actif | Encodage UTF-8 bloquant à l'étape 4, résolu — god nodes attendus présents (RFC, PRD, arch, journal) | keep   |

Progression vs v2 ([EVAL-009](../evals/EVAL-009.md)) : 82 → 125 nœuds (+52%), 174 → 194 edges, 10 → 13 communautés. L'augmentation reflète les nouvelles entrées mémoire (BDR-012, LRN-013, LRN-014, EVAL-010, EVAL-011) et la Story 1.1 ajoutées depuis le dernier run.

God nodes : `RFC & Roadmap` (19 edges), `PRD FR1–FR34` (15), `Architecture Document` (14), `Story 1.1` (12), `Agent Session Journal` (12).

## Références

- [BLK-004](../blockers/BLK-004.md) — encodage UTF-8 bloquant résolu pendant ce run
- [LRN-015](../learnings/LRN-015.md) — décision de retirer le hook suite à ce run
