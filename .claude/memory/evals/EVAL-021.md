---
id: EVAL-021
type: eval
date: 2026-05-06
---

# EVAL-021 — Story 1.3 implémentée — CONTRIBUTING.md créé en anglais, 3 ACs couverts, story → review

| Output                             | Méthode eval              | Anomalies                                               | Action |
| ---------------------------------- | ------------------------- | ------------------------------------------------------- | ------ |
| `CONTRIBUTING.md` (159 lignes, EN) | Vérification visuelle ACs | Langue initiale FR → corrigée en EN post-implémentation | keep   |

## Détail

- **AC1 ✅** : section "Writing an Adapter" — référence `src/types.ts`, placeholder `clawd.ts → Epic 3`, contrat `AdapterInput`/`AdapterOutput`/`warnings`, gestion erreurs typées
- **AC2 ✅** : section "Project Setup" + "Architecture" — 4 commandes pnpm, schéma 3 couches, table de frontières, isolation `@clack/prompts`
- **AC3 ✅** : section "Submitting an Adapter" — enregistrement `src/cli/index.ts` + procédure PR en 5 étapes

**Anomalie mineure :** story créée en français (conformément à `document_output_language`) puis réécrite en anglais sur décision de Baptiste. Pattern capturé dans [LRN-027](../learnings/LRN-027.md) pour prévenir ce cas sur les stories futures.

**Aucun blocage, aucune compilation requise** — story purement documentaire ([LRN-026](../learnings/LRN-026.md)).

## Références

- [BDR-018](../decisions/BDR-018.md) — décision langue anglaise pour CONTRIBUTING.md
- [LRN-026](../learnings/LRN-026.md) — pattern story documentaire sans compilation
- [LRN-027](../learnings/LRN-027.md) — GitHub community files = anglais par convention
