# Review — Story 1.2 : Interface publique OutputAdapter et types partagés

**Date :** 2026-05-05
**Reviewer :** bmad-code-review (Blind Hunter + Edge Case Hunter + Acceptance Auditor)
**Story :** `1-2-interface-publique-outputadapter-et-types-partages.md`
**Statut review :** ✅ done

---

## Résumé

| Couche             | Résultat                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Acceptance Auditor | ✅ AC1, AC2, AC4 satisfaits — AC3 non vérifiable dans le diff (confirmé par Dev Agent Record) |
| Blind Hunter       | 10 findings bruts → 0 patch, 2 defer, 8 dismiss                                               |
| Edge Case Hunter   | 7 findings bruts → 0 patch, 3 defer, 4 dismiss                                                |

**0** `decision-needed` · **4** `patch` (JSDoc) · **1** `defer` · **7** dismissed

---

## Findings

### 🔴 Patch (appliqués — JSDoc `src/types.ts`)

- [x] **P1 — ThemeManifest.compatibleWith non documenté** [`src/types.ts:12`] — ✅ JSDoc `/** Format attendu : "clawd-on-desk@1.x" */` ajouté.
- [x] **P2 — ProgressCallback : plage de `progress` non documentée** [`src/types.ts:28`] — ✅ JSDoc `@param progress 0–1` ajouté.
- [x] **P3 — AdapterInput.apngs : contrainte Buffer non-vide non documentée** [`src/types.ts:17`] — ✅ JSDoc documentant l'exigence de Buffer non-vide ajouté.
- [x] **P4 — AdapterOutput.path : chemin absolu non spécifié** [`src/types.ts:21`] — ✅ JSDoc `/** Must be an absolute filesystem path. */` ajouté.

### 🟡 Defer (différé)

- [x] **D1 — STATE_MAPPING : valeurs placeholder non validées contre la spritesheet réelle** [`src/core/state-mapping.ts:4-14`] — `frames: 9` et `row: 0-7` sont des stubs intentionnels (⚠️ noté dans la story). Story 2.2 (`detect-grid.ts`) devra valider que la spritesheet source a exactement 8 lignes avant de consommer `STATE_MAPPING` — sinon risque de découpe silencieuse hors-bornes.

### ⚫ Dismissed (7 findings)

| Finding                                                         | Raison du dismiss                                                                                                                             |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Error class message forwarding (Blind Hunter, critical)         | Faux positif — constructeur implicite ESNext forwarde correctement les args via `super(...args)`                                              |
| AdapterInput.outputDir "leaks filesystem" (Blind Hunter, major) | Spec-defined — champ requis par BDR-009 ; les adapters en-mémoire ne sont pas dans le périmètre v0.1                                          |
| AdapterOutput.path toujours requis (Blind Hunter, major)        | Spec-defined — `path` est le champ de sortie primaire du contrat public                                                                       |
| Stub files `export {}` (Blind Hunter, major)                    | Spec-defined — stubs explicitement requis par la story pour AC3 (build propre)                                                                |
| `mode: "zip"\|"install"` naming (Blind Hunter, minor)           | Spec-defined — union validée par BDR-009 ; pas une ambiguïté, nomenclature intentionnelle                                                     |
| `exitCode` non `readonly` (Blind Hunter, minor)                 | Explicitement documenté dans les Dev Notes de la story — `exitCode = X as const` est le pattern intentionnel (pas `readonly exitCode: 1 = 1`) |
| instanceof cross-realm (Edge Case Hunter, major)                | Trop spéculatif pour v0.1 — le package cible des adapters locaux, pas des bundlers multi-copies                                               |
