# Review — Story 1.1 : Initialisation du projet et configuration du build

**Date :** 2026-05-05
**Reviewer :** bmad-code-review (Blind Hunter + Edge Case Hunter + Acceptance Auditor)
**Story :** [1-1-initialisation-du-projet-et-configuration-du-build.md](../stories/epic-1-fondations-du-projet-et-architecture-de-contribution/1-1-initialisation-du-projet-et-configuration-du-build.md)
**Statut review :** ✅ done

---

## Résumé

| Couche             | Résultat                                        |
| ------------------ | ----------------------------------------------- |
| Acceptance Auditor | ✅ Tous les ACs satisfaits — aucun finding      |
| Blind Hunter       | 14 findings bruts → 2 patch, 5 defer, 7 dismiss |
| Edge Case Hunter   | 6 findings bruts → 0 patch, 4 defer, 2 dismiss  |

**0** `decision-needed` · **2** `patch` · **9** `defer` · **9** dismissed

---

## Findings

### 🔴 Patch (à corriger)

- [x] **P1 — `.npmignore` glob `*.test.ts` ne capture pas les fichiers imbriqués** [`.npmignore:2`] — ✅ corrigé : `**/*.test.ts`
- [x] **P2 — Pas de script `prepublishOnly`** [`package.json:scripts`] — ✅ corrigé : `"prepublishOnly": "pnpm build"` ajouté

### 🟡 Defer (différé)

- [x] **D1 — Aucune infrastructure de test** [`package.json`] — scope Epic 4 / story dédiée
- [x] **D2 — Pas de garde runtime pour les deps optionnelles** [`package.json:32-35`] — scope Stories 2.x/3.x
- [x] **D3 — `"resolveJsonModule": true` absent de tsconfig.json** [`tsconfig.json`] — non nécessaire sans imports JSON
- [x] **D4 — Pas de script `lint`** [`package.json:scripts`] — scope Story 4.x / CI
- [x] **D5 — Champs npm manquants** (`repository`, `license`, `homepage`, `bugs`) [`package.json`] — scope Story 4.2
- [x] **D6 — Enforcement runtime version Node absent** [`package.json:13-15`] — ✅ résolu opportuniste : check runtime ajouté dans `src/cli/index.ts`
- [x] **D7 — `README.md` absent** [`package.json:files`] — scope Story 4.2
- [x] **D8 — `sharp` et `apngasm-bin` non externalisés dans tsup** [`tsup.config.ts`] — ✅ résolu opportuniste : `external: ['sharp', 'apngasm-bin']` ajouté dans `tsup.config.ts`
- [x] **D9 — Gestion d'échec d'install des deps optionnelles** [`package.json:32-35`] — scope Stories 2.x/3.x

### ⚫ Dismissed (9 findings)

| Finding                                                      | Raison                                         |
| ------------------------------------------------------------ | ---------------------------------------------- |
| `@clack/prompts 1.3.0` n'existe pas                          | Installé avec succès — version 2026            |
| `typescript 6.0.3` n'existe pas                              | Utilisé avec succès au build — version 2026    |
| Stub `src/cli/index.ts` non fonctionnel                      | Intentionnel — spécifié en Story 3.3           |
| `declaration`/`dts` manquants                                | CLI tool, pas une librairie                    |
| `files` + `.npmignore` coexistence conflictuelle             | Comportement npm correct — pas de conflit réel |
| `moduleResolution: bundler` avec `tsc --noEmit`              | Intentionnel — BDR-012, pattern validé         |
| Index.ts n'exporte rien d'exécutable (Edge Case)             | Intentionnel per spec                          |
| Deps optionnelles — échec install plateforme (Edge Case)     | Géré par `optionalDependencies` npm            |
| Deps optionnelles — non externalisées à ce stade (Edge Case) | Non importées dans cette story                 |
