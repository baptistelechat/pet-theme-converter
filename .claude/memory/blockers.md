---
register: blockers
last_updated: 2026-05-05
---

## Index

| ID                             | Date       | Friction                                                                           | Statut |
| ------------------------------ | ---------- | ---------------------------------------------------------------------------------- | ------ |
| [BLK-001](blockers/BLK-001.md) | 2026-05-04 | Aucun pont entre l'écosystème Petdex/Codex et les apps Claude Code                 | ouvert |
| [BLK-002](blockers/BLK-002.md) | 2026-05-04 | `resolve_customization.py` non exécutable : Python absent du PATH Windows          | résolu |
| [BLK-003](blockers/BLK-003.md) | 2026-05-05 | `graphify` ne détecte pas les dossiers cachés — `.claude/memory/` absent du graphe | résolu |
| [BLK-004](blockers/BLK-004.md) | 2026-05-05 | `UnicodeEncodeError` cp1252 lors de l'écriture du rapport graphify sur Windows     | résolu |
| [BLK-005](blockers/BLK-005.md) | 2026-05-05 | `graphify.graph` inexistant — API réelle = `graphify.build.build_from_json`        | résolu |
| [BLK-006](blockers/BLK-006.md) | 2026-05-05 | Write `.gitignore` échoué — fichier existait déjà avec contenu Obsidian + graphify | résolu |
| [BLK-007](blockers/BLK-007.md) | 2026-05-05 | `"latest"` dans `package.json` non remplacé par pnpm install/add                   | résolu |
| [BLK-008](blockers/BLK-008.md) | 2026-05-05 | `process` non reconnu au typecheck — `"types": ["node"]` manquant dans tsconfig    | résolu |
| [BLK-009](blockers/BLK-009.md) | 2026-05-05 | `build_from_json()` sans support `--update` — `build_merge()` est la bonne API     | résolu |
