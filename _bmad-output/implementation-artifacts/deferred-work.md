# Deferred Work

Findings reportés lors des code reviews — à traiter dans les stories appropriées.

Statuts : 🔵 Ouvert | ✅ Résolu | 🚫 Annulé

---

## Deferred from: code review of 1-1-initialisation-du-projet-et-configuration-du-build (2026-05-05)

- 🔵 **Aucune infrastructure de test** — pas de runner, pas de scripts `test`. Scope Epic 4 / story dédiée.
- 🔵 **Garde runtime pour les deps optionnelles** — au démarrage CLI, vérifier la disponibilité de `sharp` et `apngasm-bin` avant usage. Scope Stories 2.x/3.x.
- 🔵 **`"resolveJsonModule": true` dans tsconfig.json** — à ajouter si des imports JSON apparaissent dans les stories suivantes.
- 🔵 **Script `lint`** — ajouter ESLint ou Biome + script `lint` dans `package.json`. Scope Story 4.x / CI (Epic 4).
- 🔵 **Champs npm manquants** (`repository`, `license`, `homepage`, `bugs`) — à ajouter dans `package.json`. Scope Story 4.2.
- ✅ **Enforcement runtime version Node** — le champ `engines` est déclaratif ; ajouter une vérification runtime dans `src/cli/index.ts`. Résolu dans review Story 1.1 (2026-05-05) : check `process.versions.node < 18` ajouté, `tsconfig.json` complété avec `"types": ["node"]`.
- 🔵 **`README.md` absent** — sera inclus dans `files` une fois créé. Scope Story 4.2.
- ✅ **`sharp` et `apngasm-bin` non externalisés dans tsup** — ajouter `external: ['sharp', 'apngasm-bin']` dans `tsup.config.ts` dès que ces packages sont importés. Résolu dans review Story 1.1 (2026-05-05) : `external` ajouté de façon préventive dans `tsup.config.ts`.
- 🔵 **Gestion d'échec d'install des deps optionnelles** — si `sharp` ou `apngasm-bin` absent, le CLI doit dégrader gracieusement (warning + sortie propre). Scope Stories 2.x/3.x.

---

## Deferred from: code review of 1-3-documentation-de-contribution-contributing-md (2026-05-06)

- 🔵 **D1 — `pnpm link` : scope global vs local non documenté** — La commande sans `--global` ne rend pas le binaire accessible depuis le terminal pour un CLI tool. Mérite clarification + mention de `pnpm unlink --global`. Scope Story 4.x ou amélioration standalone.
- 🔵 **D2 — `warnings` : comportement CLI non spécifié** — La doc dit que les warnings sont "passed to the CLI layer" sans préciser le traitement de `undefined` vs `[]` ni le comportement non-interactif. Sera clarifié en Story 3.3 (CLI layer).
- 🔵 **D3 — Politique de versionnement sémantique / breaking changes** — Aucune section ne documente comment les changements breaking d'`AdapterInput`/`AdapterOutput` seront communiqués. Scope : documentation de contribution future.
- 🔵 **D4 — Politique de dépendances tierces pour contributions** — Aucune contrainte sur l'ajout de `node_modules` dans un adapter (licences, bundle size). Scope : règle de review PR ou section CONTRIBUTING future.
- 🔵 **D5 — Template PR formalisé absent** — Section "Open a Pull Request" en prose sans template GitHub `.github/PULL_REQUEST_TEMPLATE.md`. Scope Epic 4 ou configuration repo.
- 🔵 **D6 — Contrat `outputDir` : existence garantie par le Core non documentée** — La doc ne précise pas si le Core garantit que `outputDir` existe avant l'appel de l'adapter. Sera défini lors de l'implémentation Core (Epic 2).
- 🔵 **P1→Defer — `pnpm lint` absent de la checklist PR CONTRIBUTING.md** — Le script `lint` n'existe pas encore dans `package.json`. À ajouter dans CONTRIBUTING.md (step 4 de la checklist PR) une fois le lint setup en place. Scope : après Story 4.x.

---

## Deferred from: code review of 1-2-interface-publique-outputadapter-et-types-partages (2026-05-05)

- ✅ **ThemeManifest.compatibleWith non validé** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `/** Format attendu : "clawd-on-desk@1.x" */` ajouté sur le champ.
- 🔵 **STATE_MAPPING : valeurs placeholder à valider contre la spritesheet réelle** — `frames: 9` / `row: 0-7` sont des stubs intentionnels. Story 2.2 devra valider que la spritesheet a exactement 8 lignes avant de consommer STATE_MAPPING, sinon risque de découpe silencieuse hors-bornes.
- ✅ **ProgressCallback : plage de `progress` non documentée** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `@param progress 0–1` ajouté sur le type.
- ✅ **AdapterInput.apngs : aucune contrainte de taille minimum sur Buffer** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc documentant l'exigence de Buffer non-vide ajouté.
- ✅ **AdapterOutput.path : absolu vs. relatif non spécifié** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `/** Must be an absolute filesystem path. */` ajouté sur le champ.
