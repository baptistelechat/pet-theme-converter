---
id: EVAL-020
type: eval
date: 2026-05-06
---

# EVAL-020 — Story 1.3 produite — skeleton CONTRIBUTING.md complet, story purement documentaire

| Output                                                             | Méthode eval                             | Anomalies       | Action |
| ------------------------------------------------------------------ | ---------------------------------------- | --------------- | ------ |
| Story 1.3 `ready-for-dev` — skeleton CONTRIBUTING.md copier-coller | Relecture ACs + vérification index index | Aucune anomalie | keep   |

## Détail

Story 1.3 "Documentation de contribution (CONTRIBUTING.md)" créée en une passe. Particularité : story 100% documentaire, aucun fichier TypeScript à modifier, pas de `pnpm build` requis. La vérification passe par une checklist manuelle des 3 ACs.

Le skeleton CONTRIBUTING.md fourni dans les Dev Notes couvre :

- **AC1** : section "Écrire un Adapter" avec contrat `OutputAdapter.generate()`, tables `AdapterInput`/`AdapterOutput`, usage `warnings`, placeholder Epic 3 pour `clawd.ts`
- **AC2** : section setup avec 4 commandes pnpm, schéma Core/Adapters/CLI, table des frontières + isolation `@clack/prompts`
- **AC3** : section soumission avec enregistrement `src/cli/index.ts` + procédure PR

Correction de cohérence effectuée en parallèle : [BDR-017](../decisions/BDR-017.md) ajouté à l'index `decisions.md` (fichier existait depuis la session 2026-05-05 mais était absent de l'index).

## Références

- [LRN-026](../learnings/LRN-026.md) — pattern story documentaire sans compilation
- [LRN-024](../learnings/LRN-024.md) — skeleton copier-coller dans Dev Notes
