---
id: EVAL-001
type: eval
date: 2026-05-04
---

# EVAL-001 — Stratégie de distribution : npm vs PR côté les apps

| Output                                              | Méthode eval                                         | Anomalies | Action |
| --------------------------------------------------- | ---------------------------------------------------- | --------- | ------ |
| Package npm indépendant + mini PRs de documentation | Comparaison de 3 approches (RFC, section §Stratégie) | Aucune    | keep   |

Trois approches évaluées :

| Approche                    | Avantages                      | Inconvénients                             |
| --------------------------- | ------------------------------ | ----------------------------------------- |
| PR côté Clawd on Desk       | Plug & play natif              | Dépend du mainteneur, couplé à Clawd      |
| PR côté Petdex              | Touche tous les users Petdex   | Petdex est Codex-first, intérêt incertain |
| **Package npm indépendant** | 100% autonome, multi-cibles ✅ | Besoin de référencer chez les autres      |

Conclusion : approche npm retenue. Voir [BDR-002](../decisions/BDR-002.md).

## Références

- [BDR-002](../decisions/BDR-002.md) — Distribution via package npm indépendant + mini PRs de doc
