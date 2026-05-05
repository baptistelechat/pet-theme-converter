---
id: EVAL-019
type: eval
date: 2026-05-05
---

# EVAL-019 — Graphe graphify v5 — 90 nœuds, 207 edges, dernier run avant purge

| Output                                                         | Méthode eval                                  | Anomalies                                                                                      | Action |
| -------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| Graphe v5 via `--update` : 90 nœuds, 207 edges, 13 communautés | `build_merge` + cluster + god_nodes + to_html | API mismatches résolus (`build_from_json` → `build_merge`, `analyze` → `god_nodes/surprising`) | keep   |

## Détail

**Pipeline exécuté :** `build_merge` (merge extract sur graph.json existant, 8 dédup dont 3 fuzzy) → `cluster` (13 communautés) → `god_nodes` + `surprising_connections` → `to_json` + `to_html` + `report.generate` → manifest sauvegardé, 4 fichiers temp nettoyés.

**God nodes principaux :**

1. Story 1.2 — 25 edges (hub central après la review)
2. Architecture Decision Document — 16 edges
3. src/types.ts — 14 edges

**Communautés labelisées :** CLI & APNG Output Pipeline · Toolchain & Project Config · Target Applications & Ecosystem · Type System & Architecture · Adapter Type Contracts · Core Pipeline Stubs · Typed Error Classes · Adapters & Review

**Anomalie :** `detect_result` transmis à `report.generate` devait contenir `total_files` et `total_words` — le fichier `.graphify_detect.json` n'existait pas en mode `--update`. Contourné avec un dict synthétique `{'total_files': G.number_of_nodes(), 'total_words': 0, 'files': {}}`.

Ce run est le **dernier run graphify** sur ce projet — décision de purge prise immédiatement après ([BDR-017](../decisions/BDR-017.md)).

## Références

- [EVAL-013](EVAL-013.md) — graphe v4 (précédent état)
- [BDR-017](../decisions/BDR-017.md) — décision de purge graphify
- [BLK-009](../blockers/BLK-009.md) — API mismatch `build_from_json` vs `build_merge`
