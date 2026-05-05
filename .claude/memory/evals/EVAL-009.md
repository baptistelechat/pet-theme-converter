---
id: EVAL-009
type: eval
date: 2026-05-05
---

# EVAL-009 — Graphe graphify v2 avec `.graphifyignore` + injection `.claude/memory/`

| Output                                                   | Méthode eval                                                          | Anomalies                                                                                                         | Action |
| -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ |
| Graphe graphify v2 : 82 nœuds, 174 edges, 10 communautés | Analyse god nodes, communautés, connexions surprenantes, nœuds isolés | 10 nœuds isolés mineurs (`tsup`, `tsx`, `CLAUDE.md` non connectés) — gaps de documentation acceptables à ce stade | keep   |

## Points forts

- God nodes pertinents : `Architecture Decision Document` (17 edges), `RFC & Roadmap` (16 edges), `Core Pipeline` (12 edges), **`Decisions Memory Index`** (11 edges), **`OutputAdapter Interface`** (11 edges), **`Learnings Register Index`** (10 edges)
- 10 communautés nettes, aucune parasite
- 6 hyperedges capturant les flows clés : pipeline de conversion, chaîne planning BMAD, ecosystem bridge Petdex→Clawd
- Betweenness centrality `Readiness Report` = 0.478 → nœud bridge le plus structurant

## Config ayant produit ce résultat

- `.graphifyignore` : `_bmad/` + `graphify-out/`
- Injection manuelle de 35 fichiers `.claude/memory/*.md` dans `.graphify_detect.json`

## Références

- [LRN-011](../learnings/LRN-011.md) — injection manuelle `.claude/memory/`
- [LRN-012](../learnings/LRN-012.md) — exclusion `_bmad/`
- [EVAL-008](EVAL-008.md) — version précédente dépréciée
