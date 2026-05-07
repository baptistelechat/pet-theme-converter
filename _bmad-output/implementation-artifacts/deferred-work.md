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
- ✅ **D6 — Contrat `outputDir` : existence garantie par le Core non documentée** — Résolu opportunistement (2026-05-07, review Story 2.4) : JSDoc ajouté sur `AdapterInput.outputDir` dans `src/types.ts` — précise que le Core ne garantit pas l'existence du répertoire et que l'adapter en est responsable.
- 🔵 **P1→Defer — `pnpm lint` absent de la checklist PR CONTRIBUTING.md** — Le script `lint` n'existe pas encore dans `package.json`. À ajouter dans CONTRIBUTING.md (step 4 de la checklist PR) une fois le lint setup en place. Scope : après Story 4.x.

---

## Deferred from: code review of 2-1-telechargement-et-validation-de-la-spritesheet (2026-05-07)

- ✅ **D1 — Limite de taille / buffer vide** — `arrayBuffer()` sans cap mémoire + `readFile` retourne un Buffer vide (0 octets) sans erreur → corruption APNG silencieuse downstream. Traitement partiel dans Story 2.4 : guard `stateFrames.length === 0` ajouté dans `encodeAPNGs` ; frames individuellement vides (`Buffer` 0 octet) capturées par le try/catch d'`apngasm-bin` → `ValidationError`. Cap mémoire global et validation taille fichier APNG produit → Scope Story 3.4.
- 🔵 **D2 — URL complète dans messages d'erreur** — L'URL entière (potentiellement avec tokens en query string) est injectée dans les messages `FetchError`. Scope Story 3.4 (messages d'erreur & logging).
- 🔵 **D3 — Content-Type allowlist vs `startsWith("image/")`** — `image/svg+xml`, `image/gif` etc. acceptés silencieusement. Décision architecturale requise. Scope Story 2.x ou Epic 3.
- 🔵 **D4 — `onProgress` appelé hors try/catch** — Exception du callback propagée sans wrapper `FetchError`/`ValidationError`. Risque faible (callback interne). Scope Story 3.3.
- 🔵 **D5 — HTTP URLs acceptées sans warning** — `isUrl()` accepte `http:` et `https:` sans distinction. Ambiguïté spec AC1. Scope Story 3.3 ou 3.4.
- 🔵 **D6 — `timeout = 0` ou négatif non validé** — Abort immédiat au premier tick, message "Timeout dépassé (0s)" sans guard. Scope Story 3.3 (CLI layer input validation).
- 🔵 **D7 — Protocoles non-HTTP non rejetés explicitement** — `file://`, `data:`, `ftp://` tombent silencieusement dans `fetchFromLocal()`. Scope Story 3.3 (CLI layer).
- 🔵 **D8 — Source vide ou invalide non gardée** — `fetchSpritesheet("")` → `FetchError("Fichier introuvable : ")` sans contexte. Scope Story 3.3 (CLI layer input validation).

---

## Deferred from: code review of 1-2-interface-publique-outputadapter-et-types-partages (2026-05-05)

- ✅ **ThemeManifest.compatibleWith non validé** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `/** Format attendu : "clawd-on-desk@1.x" */` ajouté sur le champ.
- ✅ **STATE_MAPPING : valeurs placeholder à valider contre la spritesheet réelle** — Résolu dans Story 2.2 (2026-05-07) : correction `frames: 9` → `frames: 8` sur les 8 états, et `detectGrid` valide les dimensions via sharp.
- ✅ **ProgressCallback : plage de `progress` non documentée** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `@param progress 0–1` ajouté sur le type.
- ✅ **AdapterInput.apngs : aucune contrainte de taille minimum sur Buffer** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc documentant l'exigence de Buffer non-vide ajouté.
- ✅ **AdapterOutput.path : absolu vs. relatif non spécifié** — Résolu dans review Story 1.2 (2026-05-05) : JSDoc `/** Must be an absolute filesystem path. */` ajouté sur le champ.

---

## Deferred from: code review of 2-2-detection-de-la-grille-et-state-mapping (2026-05-07)

- ✅ **D1 — Buffer vide → ValidationError générique** — Résolu opportunistement (2026-05-07) : guard `buffer.length === 0` ajouté en tête de `detectGrid`, lance `ValidationError("Buffer vide : aucune donnée de spritesheet à lire.")` avant tout appel sharp.
- ✅ **D2 — Math.round masque spritesheets non-alignées** — Résolu partiellement dans Story 2.3 (2026-05-07) : sharp catch les extractions hors-bornes et les relance en `ValidationError` avec état + numéro de frame. Clampage complet déféré (nécessite `totalWidth`/`totalHeight` dans `GridInfo`) → D2 Story 2.3.
- 🔵 **D3 — `detectGrid` sans `onProgress`** — Contrairement à `fetchSpritesheet`, `detectGrid` n'accepte pas de callback de progression. L'étape sera invisible dans la barre de progression CLI. Scope Story 3.3.
- 🔵 **D4 — `ValidationError` mélange format invalide et erreur opérationnelle** — Les erreurs sharp (I/O, mémoire) et les vrais formats invalides sont tous enveloppés dans `ValidationError` sans distinction. Architecture actuelle sans erreur opérationnelle dédiée. Scope architectural.
- ✅ **D5 — `frames: 8` non synchronisé avec `STANDARD_COLS`** — De facto résolu par BDR-022 (2026-05-07) : les valeurs `frames` dans `STATE_MAPPING` sont désormais des comptes empiriques validés terrain (4, 5, 6, 8 selon l'état), plus dérivées de `STANDARD_COLS`. Le couplage est brisé. Commentaire `detect-grid.ts` mis à jour pour refléter que les 9 rows sont toutes mappées.

---

## Deferred from: code review of 2-3-decoupe-des-frames-par-etat (2026-05-07)

- ✅ **D1 — `sharp(buffer)` réinstancié 64× sans `.clone()`** — Résolu opportunistement (2026-05-07) : `sharpBase = sharp(buffer)` créé une fois hors boucles, chaque frame utilise `sharpBase.clone()`.
- 🔵 **D2 — Bornes extraction non pré-vérifiées vs dimensions réelles** — `left + cellWidth` / `top + cellHeight` non comparés aux dimensions réelles avant extraction. Mitigation : sharp catch et ValidationError wrapping avec état + frame. Clampage complet nécessite `totalWidth`/`totalHeight` dans `GridInfo`. Scope post-v0.1.
- ✅ **D3 — Await séquentiel non parallélisé** — Résolu opportunistement (2026-05-07) : `Promise.all(Array.from({length: frames}, ...))` sur la boucle frame-level. 8 frames par état extraites en parallèle, états séquentiels.
- ✅ **D4 — Messages d'erreur en français dans une lib publique** — Résolu opportunistement (2026-05-07) : tous les messages des 3 modules Core (`fetch-spritesheet.ts`, `detect-grid.ts`, `slice-frames.ts`) traduits en anglais. Build ✅, typecheck ✅.
- ✅ **D5 — `onProgress` sans ratio 0-1** — Résolu opportunistement (2026-05-07) : ratio `stateIndex / stateEntries.length` passé comme second argument à `onProgress`.

---

## Deferred from: code review of 2-4-encodage-des-apngs-par-etat (2026-05-07)

- 🔵 **D1 — Guard runtime `apngasm-bin` absent avant appel** — `apngasm-bin` en `optionalDependencies` : si non installé, `apngasm` peut être `undefined` → `execFileAsync(undefined, [...])` → `TypeError` wrappée en `ValidationError` sans indiquer la cause réelle (binaire manquant). Guard à placer dans le CLI layer. Scope Story 3.x.
- 🔵 **D2 — Framerate 100ms hardcodé, non configurable** — Délai `"1", "10"` (100ms/frame) identique pour tous les états. Décision v0.1. Si les animations Petdex nécessitent des timings différents par état, extension `STATE_MAPPING`. Scope Epic 3 / post-v0.1.
- 🔵 **D3 — `rm` dans `finally` peut masquer l'erreur originale** — Si `rm(tempDir, { force: true })` lève une exception (EACCES), elle remplace l'exception originale du `catch`. `force: true` couvre "absent" mais pas les permissions. Probabilité très faible. Fix : `rm(...).catch(() => {})`. Scope post-v0.1.
- 🔵 **D4 — `readFile` post-`execFileAsync` sans vérification d'intégrité APNG** — `apngasm` pourrait produire un fichier partiellement écrit (disque plein) avec exit code 0 ; `readFile` lirait silencieusement un buffer tronqué. L'erreur ne serait détectée que dans Clawd on Desk. Scope Story 3.4 / validation post-encodage.
- 🔵 **D5 — `notification`/`waking` partagent `row: 3` sans constante partagée** — Deux entrées `{ row: 3, frames: 4 }` dupliquées dans `STATE_MAPPING`. Comportement voulu (BDR-022). Un changement doit être fait manuellement dans les deux entrées. Fix cosmétique : constante partagée `WAVING_ROW`. Scope post-v0.1.
- 🔵 **D6 — Absence de tests de régression pour le remapping `STATE_MAPPING`** — Mapping complet (frames 4/5/6/8 selon l'état) est une donnée critique sans filet de test. Pre-existing : infrastructure de test absente (Epic 4). Scope Epic 4.
