---
id: EVAL-037
type: eval
date: 2026-05-07
---

# EVAL-037 — Story 2.4 review complète — 3 patches + 3 opportunistic + 6 defers + 12 dismissed, story → done

| Output                                                                                     | Méthode eval                                         | Anomalies                                                                                      | Action |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| Review `encode-apngs.ts` + `state-mapping.ts` + `apngasm-bin.d.ts` via 3 agents parallèles | Blind Hunter + Edge Case Hunter + Acceptance Auditor | P1 TDZ dans finally (bug réel non cosmétique) ; P2 ratio onProgress jamais 1.0 (violation AC3) | keep   |

## Détail

**Diff reviewé (Story 2.4):**

- `src/core/encode-apngs.ts` : +76/-1 (stub → implémentation complète APNG encoding)
- `src/core/state-mapping.ts` : +20/-10 (correction mapping Codex→Clawd per BDR-022)
- `src/apngasm-bin.d.ts` : +4 (déclaration TypeScript pour apngasm-bin)

**Résultat du triage :**

| Catégorie | Compte |
| --------- | ------ |
| Patch     | 3      |
| Defer     | 6      |
| Dismissed | 12     |

**Patches appliqués :**

- P1 — `mkdtemp` hors `try` → TDZ dans `finally` (voir [LRN-048](../learnings/LRN-048.md)) : `let tempDir: string | undefined` + `if (tempDir)` guard
- P2 — `onProgress` ratio jamais 1.0 (voir [LRN-049](../learnings/LRN-049.md)) : appel post-opération avec `(stateIndex+1)/total`
- P3 — JSDoc manquante `apngasm-bin.d.ts` : commentaire expliquant que la `string` est un chemin vers le binaire natif

**Fixes opportunistes :**

- D6 Story 1.3 : JSDoc `AdapterInput.outputDir` (contrat Core vs adapter) → résolu dans `types.ts`
- D5 Story 2.2 : `frames:8` non synchronisé STANDARD_COLS → obsolète par BDR-022, marqué résolu
- D1 Story 2.1 : traitement partiel `stateFrames.length === 0` guard → marqué résolu partiel

Build ✅ typecheck ✅ après tous les patches. Story 2.4 → `done`. Sprint-status mis à jour.

## Références

- [LRN-048](../learnings/LRN-048.md) — TDZ dans finally, pattern `let + if (tempDir)`
- [LRN-049](../learnings/LRN-049.md) — onProgress ratio (i+1)/total pour atteindre 1.0
- [BDR-022](../decisions/BDR-022.md) — mapping Codex→Clawd validé terrain (contexte state-mapping.ts)
