---
id: EVAL-008
type: eval
date: 2026-05-05
---

# EVAL-008 — Graphe graphify v1 sur `.` sans `.graphifyignore` ni `.claude/memory/`

| Output                                                  | Méthode eval                                                                       | Anomalies                                                                                                                                                                                                                                                 | Action                                           |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Graphe graphify v1 : 55 nœuds, 101 edges, 8 communautés | Analyse critique post-génération : review des communautés, god nodes, nœuds isolés | 2 communautés entièrement parasites issues de `_bmad/scripts/` (Community 0 "BMAD Customization Engine" 12 nœuds, Community 1 "Config Resolution Pipeline" 8 nœuds). 20 nœuds AST non pertinents. `.claude/memory/` absent → god nodes mémoire manquants. | deprecate — remplacé par [EVAL-009](EVAL-009.md) |

## Anomalies détaillées

- `_bmad/scripts/resolve_config.py` et `resolve_customization.py` → 20 nœuds AST (`deep_merge()`, `_detect_keyed_merge_field()`, `extract_key()`, etc.) sans lien avec le projet
- Communautés 0 et 1 (20 nœuds / 36% du graphe) = bruit pur
- Aucun god node issu de `.claude/memory/` : `Decisions Memory Index`, `Learnings Register Index`, `Agent Session Journal` absents

## Références

- [LRN-012](../learnings/LRN-012.md) — cause : `_bmad/` non exclu
- [BLK-003](../blockers/BLK-003.md) — cause : `.claude/memory/` non détecté
- [EVAL-009](EVAL-009.md) — version corrigée
