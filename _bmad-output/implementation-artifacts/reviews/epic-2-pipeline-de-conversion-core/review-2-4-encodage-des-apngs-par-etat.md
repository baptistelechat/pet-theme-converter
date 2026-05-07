---
story: 2-4-encodage-des-apngs-par-etat
date: 2026-05-07
reviewer: Claude (bmad-code-review)
---

# Review — Story 2.4 : Encodage des APNGs par état

## Résultat

| Catégorie | Compte |
| --------- | ------ |
| Patch     | 3      |
| Defer     | 6      |
| Dismissed | 12     |

**Acceptance Auditor :** 1 violation (AC3 — ratio `onProgress` jamais à 1.0), adressée en P2. AC1, AC2, AC4 satisfaits ✅

---

## Patch

### P1 — `mkdtemp` hors `try` : TDZ dans `finally` + message d'erreur trompeur [src/core/encode-apngs.ts:41]

- [x] [Review][Patch] `mkdtemp` hors `try` → TDZ dans `finally` + message trompeur [src/core/encode-apngs.ts:41] — ✅ appliqué (2026-05-07)

`mkdtemp` est appelé avant le bloc `try/catch`. Si `mkdtemp` échoue (ENOSPC, EACCES), deux problèmes :

1. **TDZ (Temporal Dead Zone)** : `const tempDir` n'est jamais assigné → le `finally` tente `rm(tempDir)` sur un binding non-initialisé → `ReferenceError` dans le `finally`, masquant l'erreur originale.
2. **Message trompeur** : l'erreur de `mkdtemp` est capturée par le `catch` et wrappée en `ValidationError("APNG encoding failed for state X: ENOSPC...")` — le label "APNG encoding failed" indique un problème d'encodage alors qu'il s'agit d'une erreur d'accès disque.

**Fix :**

```ts
let tempDir: string | undefined;
try {
  tempDir = await mkdtemp(join(tmpdir(), `pet-theme-${state}-`));
  const outputPath = join(tempDir, "output.apng");
  // ... reste du bloc try
} catch (err) {
  if (err instanceof ValidationError) throw err;
  throw new ValidationError(
    `APNG encoding failed for state "${state}": ${err instanceof Error ? err.message : String(err)}`,
  );
} finally {
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
}
```

---

### P2 — `onProgress` ratio jamais atteint 1.0 [src/core/encode-apngs.ts:32]

- [x] [Review][Patch] `onProgress` ratio jamais atteint 1.0 [src/core/encode-apngs.ts:32] — ✅ appliqué (2026-05-07)

`onProgress` est appelé avec `stateIndex / stateEntries.length` avant chaque encodage. Pour 8 états, les ratios émis sont `0/8, 1/8, ..., 7/8` — jamais `1.0`. La `ProgressCallback` est documentée avec `@param progress 0–1` (range complète). AC3 : "le callback est invoqué pour chaque état **encodé**" (passé), ce qui implique un appel post-encodage ou un appel final à 1.0.

**Fix :** Déplacer l'appel `onProgress` après le bloc `try/finally`, avec ratio `(stateIndex + 1) / stateEntries.length` :

```ts
// ... fin du try/finally
onProgress?.(`Encoding APNG: ${state}`, (stateIndex + 1) / stateEntries.length);
```

Ratios émis : `1/8, 2/8, ..., 8/8 = 1.0` — signalés après completion de chaque état.

---

### P3 — JSDoc manquante dans `src/apngasm-bin.d.ts` [src/apngasm-bin.d.ts:2]

- [x] [Review][Patch] JSDoc manquante dans `apngasm-bin.d.ts` [src/apngasm-bin.d.ts:2] — ✅ appliqué (2026-05-07)

La constante `path: string` exportée ne documente pas sa nature. Sans contexte, un lecteur ignore que cette `string` est un **chemin absolu vers l'exécutable natif** — pas un import de fonction, pas une valeur de configuration. Critique car l'erreur d'appel (`apngasm()` vs `execFileAsync(apngasm, [...])`) est le piège principal documenté dans les Dev Notes.

**Fix :**

```ts
declare module "apngasm-bin" {
  /** Absolute path to the apngasm native binary. Use with `execFile`, never call directly. */
  const path: string;
  export default path;
}
```

---

## Defer

### D1 — Guard runtime `apngasm-bin` absent avant appel [src/core/encode-apngs.ts:55]

- [x] [Review][Defer] Guard runtime `apngasm-bin` avant appel — deferred, pre-existing (Story 1.1)

`apngasm-bin` est en `optionalDependencies`. Si non installé, `apngasm` peut valoir `undefined` ou pointer vers un binaire absent. `execFileAsync(undefined, [...])` lève `TypeError: The "file" argument must be of type string` — wrappé en `ValidationError("APNG encoding failed")` sans indiquer la cause réelle (binaire manquant).

Defer scope : guard à placer dans le CLI layer (Story 3.x). Pre-existing : "Garde runtime pour les deps optionnelles" (Story 1.1 defer, scope Stories 2.x/3.x).

---

### D2 — Framerate 100ms hardcodé, non configurable [src/core/encode-apngs.ts:58]

- [x] [Review][Defer] Framerate 100ms hardcodé, non configurable — deferred, design choice v0.1

Le délai inter-frame `"1", "10"` (100ms = 10fps) est identique pour tous les états. La décision de framerate unique est raisonnable pour v0.1 mais non documentée comme contrainte Clawd on Desk. Si des animations nécessitent des timings différents (idle vs error), ce sera une extension de `STATE_MAPPING`.

Defer scope : Epic 3 / roadmap post-v0.1.

---

### D3 — `rm` dans `finally` peut masquer l'erreur originale [src/core/encode-apngs.ts:68]

- [x] [Review][Defer] `rm` dans `finally` peut masquer erreur originale — deferred, edge case

Si `rm(tempDir, { recursive: true, force: true })` lève une exception (ex. : permissions EACCES sur le dossier temporaire), elle remplace l'exception originale du `catch`. Le `force: true` couvre le cas "fichier absent" mais pas les permissions. Probabilité très faible (on supprime un dossier qu'on vient de créer).

Defer scope : post-v0.1, fix : `rm(...).catch(() => {})` ou wrapper try/catch interne.

---

### D4 — `readFile` post-`execFileAsync` sans vérification d'intégrité APNG [src/core/encode-apngs.ts:60]

- [x] [Review][Defer] `readFile` sans vérification intégrité APNG — deferred, extreme edge case

`apngasm` pourrait produire un fichier partiellement écrit (disque plein juste après début d'écriture) avec exit code 0. `readFile` lirait silencieusement un buffer tronqué. L'erreur ne serait détectée que lors de l'utilisation du thème dans Clawd on Desk.

Defer scope : Story 3.4 ou couche de validation post-encodage.

---

### D5 — `notification` et `waking` partagent `row: 3` sans constante partagée [src/core/state-mapping.ts:13-14]

- [x] [Review][Defer] `notification`/`waking` sans constante partagée — deferred, cosmetic

Les deux états pointent vers `{ row: 3, frames: 4 }` (Codex: waving). Un changement de row 3 doit être dupliqué manuellement. Le commentaire documente le partage mais rien ne l'enforce. Comportement voulu (BDR-022).

Defer scope : refactor cosmétique, post-v0.1.

---

### D6 — Absence de tests de régression pour le remapping `STATE_MAPPING` [src/core/state-mapping.ts]

- [x] [Review][Defer] Pas de tests de régression pour le remapping — deferred, pre-existing

Le mapping complet (frames: 4, 5, 6, 8 selon l'état) est une donnée critique sans filet de test. Si une valeur est fausse, le slicer produira des frames incorrectes. Pre-existing : infrastructure de test absente depuis Story 1.1 (defer Epic 4).

Defer scope : Epic 4 (infrastructure de test).

---

## Dismissed (12)

| #   | Titre                                              | Raison                                                                                |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| R1  | Position de `-l0` en fin d'args                    | Spec-mandated (Dev Notes) + validé 75/75 tests                                        |
| R2  | Frames `Buffer` 0 octets silencieusement acceptées | Comportement explicitement défini dans le story (try/catch capture → ValidationError) |
| R3  | Itération `STATE_MAPPING` au lieu de `frames`      | Intentionnel (ordre canonique par spec), typage fort empêche désync                   |
| R4  | Cast `{} as Record<ClawdState, Buffer>`            | Pattern TypeScript standard pour Record à construction incrémentale                   |
| R5  | Exécution séquentielle des états                   | Intentionnel (temp dir propre à chaque état), AC4 satisfait (20-35s)                  |
| R6  | Rows 1-2 (run right/left) unmapped non tracés      | Le slicer n'itère que les états de `STATE_MAPPING`, rows unmappées jamais accédées    |
| R7  | `Promise.all writeFile` saturation FDs en batch    | Hors scope (usage single-sprite, non batch)                                           |
| R8  | `onProgress` appelé avant validation               | Pattern cohérent avec fonctions Core existantes (sliceFrames, fetchSpritesheet)       |
| R9  | `apngasm-bin` external dans tsup                   | Déjà résolu Story 1.1 (`external: ['sharp', 'apngasm-bin']` dans tsup.config.ts)      |
| R10 | `state-mapping.ts` modifié hors scope story        | Fix nécessaire per BDR-022 (mapping Codex→Clawd validé terrain)                       |
| R11 | `exitCode = 2` non vérifié par test                | Valeur de classe par défaut (`exitCode = 2 as const`), non une propriété d'instance   |
| R12 | `apngasm-bin.d.ts` à la racine de `src/`           | Convention TypeScript : nom du fichier = nom du module, découverte automatique        |
