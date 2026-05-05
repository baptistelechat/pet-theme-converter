---
register: decisions
last_updated: 2026-05-05
---

## Index

| ID                              | Date       | Titre                                                                             | Statut    |
| ------------------------------- | ---------- | --------------------------------------------------------------------------------- | --------- |
| [BDR-001](decisions/BDR-001.md) | 2026-05-04 | Format de sortie APNG plutôt que SVG animé                                        | actif     |
| [BDR-002](decisions/BDR-002.md) | 2026-05-04 | Distribution via package npm indépendant + mini PRs de doc                        | actif     |
| [BDR-003](decisions/BDR-003.md) | 2026-05-04 | Architecture Core + Output Adapters interchangeables                              | actif     |
| [BDR-004](decisions/BDR-004.md) | 2026-05-04 | Gestion des spritesheets hors-standard : warning + grille 9×8 par défaut          | actif     |
| [BDR-005](decisions/BDR-005.md) | 2026-05-04 | Cible sources : toutes marketplaces Codex-compatibles, pas seulement Petdex       | actif     |
| [BDR-006](decisions/BDR-006.md) | 2026-05-04 | CLI 100% interactif, pas de fichier de configuration en v0.1                      | actif     |
| [BDR-007](decisions/BDR-007.md) | 2026-05-04 | Timeout fetch réseau = 30 secondes                                                | actif     |
| [BDR-008](decisions/BDR-008.md) | 2026-05-04 | Pipeline fonctionnel pur + callbacks `onProgress`                                 | actif     |
| [BDR-009](decisions/BDR-009.md) | 2026-05-04 | Interface OutputAdapter : AdapterInput reçoit des APNGs pré-encodés (Buffer[])    | actif     |
| [BDR-010](decisions/BDR-010.md) | 2026-05-04 | `archiver` comme librairie ZIP dans `clawd.ts`                                    | actif     |
| [BDR-011](decisions/BDR-011.md) | 2026-05-04 | CI GitHub Actions : matrice 3 OS × Node 18/20                                     | actif     |
| [BDR-012](decisions/BDR-012.md) | 2026-05-05 | `"moduleResolution": "bundler"` pour TypeScript + tsup (pas `"Node16"`)           | actif     |
| [BDR-013](decisions/BDR-013.md) | 2026-05-05 | Workflow graphify : hook post-commit retiré, mise à jour manuelle via `--update`  | supersédé |
| [BDR-014](decisions/BDR-014.md) | 2026-05-05 | Stratégie versionning graphify-out : outputs committés, cache gitignored          | supersédé |
| [BDR-015](decisions/BDR-015.md) | 2026-05-05 | Findings de code review dans fichier dédié `reviews/` — jamais dans le story file | actif     |
| [BDR-016](decisions/BDR-016.md) | 2026-05-05 | Règles workflow post-review stockées dans CLAUDE.md (pas dans custom toml skills) | actif     |
