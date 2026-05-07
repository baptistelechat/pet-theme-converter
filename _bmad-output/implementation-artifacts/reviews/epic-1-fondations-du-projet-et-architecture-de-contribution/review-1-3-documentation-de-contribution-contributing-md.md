# Review — Story 1.3 : Documentation de contribution (CONTRIBUTING.md)

**Date :** 2026-05-06
**Reviewer :** bmad-code-review (Blind Hunter + Edge Case Hunter + Acceptance Auditor)
**Story :** `1-3-documentation-de-contribution-contributing-md.md`
**Statut review :** ✅ done

---

## Résumé

| Couche             | Résultat                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Acceptance Auditor | ✅ AC1, AC2, AC3 satisfaits — 2 observations mineures sans impact bloquant                    |
| Blind Hunter       | 12 findings bruts → 1 patch, 5 defer, 6 dismiss                                               |
| Edge Case Hunter   | 17 findings bruts → 1 patch, 3 defer, 13 dismiss (dont 2 faux positifs détectés avant triage) |

**0** `decision-needed` · **1** `patch` appliqué · **1** `patch→defer` (lint script inexistant) · **6** `defer` · **19** dismissed

---

## Findings

### 🟠 Patch

- [x] [Review][Patch→Defer] **P1 — `pnpm lint` absent de la checklist PR** [`CONTRIBUTING.md:149`] — Reclassifié en defer : le script `lint` n'existe pas encore dans `package.json` (item 🔵 Story 1.1 deferred-work). Ajouter `pnpm lint` à CONTRIBUTING.md avant que le script existe serait une instruction erronée. Scope : après Story 4.x (CI & lint setup). Ajouté à deferred-work.md.
- [x] [Review][Patch] **P2 — Count "8" hardcodé pour `ClawdState`** [`CONTRIBUTING.md:87`] — ✅ Appliqué : `"The 8 states available in ClawdState"` → `"The states available in ClawdState"`.

### 🟡 Defer

- [x] [Review][Defer] **D1 — `pnpm link` : scope global vs local non documenté** [`CONTRIBUTING.md:31`] — La commande "pnpm link" sans `--global` crée un lien local et ne rend pas le binaire accessible depuis le terminal. Pour un CLI tool, `pnpm link --global` est attendu. Mérite une clarification + mention de `pnpm unlink --global`. Scope : Story 4.x ou amélioration standalone.
- [x] [Review][Defer] **D2 — `warnings` : comportement de la couche CLI non spécifié** [`CONTRIBUTING.md:84-90`] — La doc dit que les warnings sont "passed to the CLI layer". Elle ne précise pas si la CLI gère `undefined` vs `[]` différemment, ni le comportement en mode non-interactif. Sera clarifié lors de l'implémentation CLI (Story 3.3).
- [x] [Review][Defer] **D3 — Politique de versionnement sémantique / breaking changes absente** — Aucune section ne documente comment les changements breaking d'`AdapterInput`/`AdapterOutput` seront communiqués aux mainteneurs d'adapters. Scope : documentation de contribution future (CHANGELOG policy, major version notice).
- [x] [Review][Defer] **D4 — Politique de dépendances tierces pour contributions** — Aucune contrainte sur l'ajout de `node_modules` dans un adapter (dépendances arbitraires, licences, bundle size). Scope : règle de review PR ou section CONTRIBUTING future.
- [x] [Review][Defer] **D5 — Template PR formalisé absent** — La section "Open a Pull Request" décrit les éléments attendus en prose, mais sans template GitHub (`.github/PULL_REQUEST_TEMPLATE.md`). Scope : Epic 4 ou configuration repo.
- [x] [Review][Defer] **D6 — Contrat `outputDir` : existence garantie par le Core non documentée** [`CONTRIBUTING.md:75`] — La doc dit que `outputDir` est un chemin absolu vers le dossier de sortie. Elle ne précise pas si le Core garantit que le dossier existe avant l'appel, ou si l'adapter doit le créer. Sera défini lors de l'implémentation du Core (Epic 2).

### ⚫ Dismissed (19 findings)

| #   | Finding                                          | Source     | Raison du dismiss                                                                               |
| --- | ------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------- |
| 1   | `clawd.ts` référence brisée                      | blind+edge | Faux positif spec-defined — placeholder explicitement accepté par AC1 et rapport de readiness   |
| 2   | CLI registration pattern déféré à Epic 3         | blind+edge | Spec-defined — note intentionnelle documentée dans Dev Notes                                    |
| 3   | `pnpm dev` non défini                            | edge       | Faux positif — script existe : `"dev": "tsx src/cli/index.ts"` dans `package.json`              |
| 4   | Import `../types` sans `.js`                     | edge       | Faux positif — `"moduleResolution": "bundler"` (BDR-012) : extensions non obligatoires          |
| 5   | Buffer non-empty non vérifiable                  | blind      | Le Core garantit des Buffers non-vides avant l'appel ; vérification côté adapter = choix d'impl |
| 6   | `FetchError` inadaptée au contexte adapter       | blind      | Valide pour les adapters upload/API qui font des requêtes réseau                                |
| 7   | Contrainte nommage fichier absente               | blind      | Concern de review PR, pas de documentation contributor                                          |
| 8   | npm/yarn au lieu de pnpm                         | edge       | Prérequis déjà déclaré : "pnpm ≥ 8.x" ; observation redondante                                  |
| 9   | `AdapterOutput.path` peut être relatif           | edge       | La doc est claire ("Absolute path"). La validation runtime est un concern Epic 3                |
| 10  | `outputDir` relative — validation contract       | edge       | Même raisonnement : validation runtime, pas documentation                                       |
| 11  | Error class constructor — message implicite      | edge       | L'exemple montre déjà `throw new InstallError("Output directory is not writable")`              |
| 12  | `FetchError` ne couvre pas timeout/rate-limit    | edge       | "Retrieval failure (network, ...)" couvre bien les timeouts réseau                              |
| 13  | Fork-based workflow non décrit                   | edge       | Étape 1 dit déjà "Fork the repo and create a dedicated branch"                                  |
| 14  | `manifest.compatibleWith` format non documenté   | edge       | Le tableau montre l'exemple `"clawd-on-desk@1.x"` — suffisant pour les contributors             |
| 15  | Placeholder wording légèrement différent du spec | auditor    | BDR-018 a réécrit la story en anglais après la spec — lien Markdown est une amélioration        |
| 16  | `generate()` non identifié comme seule méthode   | auditor    | TypeScript enforces interface compliance à la compilation ; aucune ambiguïté                    |
| 17  | Incohérence d'ordre section soumission           | auditor    | Négligeable — la section explique le COMMENT avant le checklist chronologique                   |
| 18  | Aucune checklist PR formalisée (template)        | blind      | Déjà capturé dans D5 (defer approprié)                                                          |
| 19  | Classe FetchError redondante pour adapters       | blind      | Couvert par dismiss #6 — merged                                                                 |
