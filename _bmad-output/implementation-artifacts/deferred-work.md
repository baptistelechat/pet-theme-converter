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
