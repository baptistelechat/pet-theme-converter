# Code Review — Story 2.1 : Téléchargement et validation de la spritesheet

**Date :** 2026-05-07
**Story :** [2-1-telechargement-et-validation-de-la-spritesheet.md](../../2-1-telechargement-et-validation-de-la-spritesheet.md)
**Fichier reviewé :** `src/core/fetch-spritesheet.ts`
**Diff :** +87 / −1 lignes (stub `export {};` → implémentation complète)
**Agents :** Blind Hunter · Edge Case Hunter · Acceptance Auditor

---

## Couverture des ACs

| AC                                               | Statut       | Note                                     |
| ------------------------------------------------ | ------------ | ---------------------------------------- |
| AC1 — URL HTTPS valide → Buffer + timeout < 30s  | ✅ Satisfait | `fetchFromUrl` + `AbortController` 30s   |
| AC2 — Timeout dépassé → FetchError               | ✅ Satisfait | `AbortError` → `FetchError` (exitCode 1) |
| AC3 — Content-Type non-image → ValidationError   | ✅ Satisfait | `startsWith("image/")` + exitCode 2      |
| AC4 — Chemin local existant → Buffer sans réseau | ✅ Satisfait | `readFile` node:fs/promises              |
| AC5 — Chemin local inexistant → FetchError       | ✅ Satisfait | catch → `FetchError` (exitCode 1)        |
| AC6 — onProgress optionnel et fonctionnel        | ✅ Satisfait | `onProgress?.()` dans les deux branches  |

**Tous les ACs sont couverts.** ✅

---

## Findings

### Patch

- [x] [Review][Patch] P1 — Content-Type casse non normalisée [`fetch-spritesheet.ts:41`] — `"Image/PNG"` ou `"IMAGE/webp"` échouent le check `startsWith("image/")` → faux `ValidationError`. Fix appliqué : `contentType.toLowerCase().startsWith("image/")`.
- [x] [Review][Patch] P2 — `FetchOptions` non exportée [`fetch-spritesheet.ts:7`] — les consumers externes ne peuvent pas référencer l'interface pour typer leurs options ; ils doivent utiliser `Parameters<typeof fetchSpritesheet>[1]`. Fix appliqué : `export interface FetchOptions { ... }`.
- [x] [Review][Patch] P3 — `fetchFromLocal` : catch générique masque la vraie cause [`fetch-spritesheet.ts:73`] — `EACCES` (permission refusée), `EISDIR` (répertoire), `ENAMETOOLONG` sont tous affichés comme `"Fichier introuvable"` — message factuellement faux si le fichier existe. Fix appliqué : `err.message` propagé dans le `FetchError`.

### Defer

- [x] [Review][Defer] D1 — Pas de limite de taille / buffer vide [`fetch-spritesheet.ts:47,71`] — `arrayBuffer()` charge la réponse entière sans cap mémoire ; `readFile` retourne un `Buffer` vide sans erreur si le fichier est vide (0 octets), entraînant une corruption APNG silencieuse downstream. Scope Story 2.4 (encode-apngs) ou Story 3.4.
- [x] [Review][Defer] D2 — URL complète dans messages d'erreur [`fetch-spritesheet.ts:36,53,57`] — l'URL entière (potentiellement avec tokens en query string) est injectée dans les messages `FetchError`. Scope Story 3.4 (messages d'erreur & logging).
- [x] [Review][Defer] D3 — Content-Type `startsWith("image/")` trop permissif [`fetch-spritesheet.ts:41`] — accepte silencieusement `image/svg+xml`, `image/gif`, etc. Une allowlist `["image/png","image/webp","image/jpeg"]` serait plus défensive. Décision architecturale requise. Scope Story 2.x ou Epic 3.
- [x] [Review][Defer] D4 — `onProgress` appelé hors try/catch [`fetch-spritesheet.ts:26,68`] — si le callback lève une exception, elle se propage sans être wrappée dans `FetchError`/`ValidationError`. Risque faible (callback interne), mais violation du contrat de types sortants du pipeline. Scope Story 3.3 (CLI layer).
- [x] [Review][Defer] D5 — URLs HTTP acceptées sans warning [`fetch-spritesheet.ts:15`] — `isUrl()` accepte `http:` ET `https:` ; la spec AC1 mentionne "URL HTTPS valide" mais ne dit pas explicitement que HTTP doit lever une erreur. Ambiguïté à clarifier. Scope Story 3.3 ou Story 3.4.
- [x] [Review][Defer] D6 — `timeout = 0` ou valeur négative non validé [`fetch-spritesheet.ts:29`] — `setTimeout(..., 0)` déclenche l'abort au premier tick : toute URL échoue avec `"Timeout dépassé (0s)"`. Aucun guard. Scope Story 3.3 (CLI layer input validation).
- [x] [Review][Defer] D7 — Protocoles non-HTTP non explicitement rejetés [`fetch-spritesheet.ts:13-19`] — `file://`, `data:`, `ftp://` retournent `false` depuis `isUrl()` et tombent dans `fetchFromLocal()` avec un message confus. Scope Story 3.3 (CLI layer input validation).
- [x] [Review][Defer] D8 — Source vide ou invalide non gardée [`fetch-spritesheet.ts:77`] — `fetchSpritesheet("")` est routé vers `fetchFromLocal("")` → `FetchError("Fichier introuvable : ")` sans contexte. Scope Story 3.3 (CLI layer input validation).

---

## Dismissed (11 findings bruts)

| Finding(s)                                                   | Raison                                                                                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| BH-2 — body non consommé si `response.ok === false`          | Node 18+/undici gère le cleanup automatiquement. Non-issue pour un CLI single-fetch.                                                              |
| BH-6 + ECH-5 — `AbortError` detection via `err.name` fragile | Correct pour Node 18+/undici avec `AbortController.abort()`. `TimeoutError` ne s'applique qu'à `AbortSignal.timeout()` qui n'est pas utilisé ici. |
| BH-10 — `FetchError`/`ValidationError` sans `this.name`      | ESNext compilation + Node 18+ : l'héritage de classe fonctionne correctement. Problème ES5 uniquement.                                            |
| BH-12 — `file://` URL non documentée                         | Out of scope v0.1. Comportement défensif acceptable (tombe sur `fetchFromLocal` → erreur claire).                                                 |
| BH-13 — pas de timeout pour `fetchFromLocal`                 | NFS/SMB hors use case du CLI. La spec ne mentionne pas de timeout local.                                                                          |
| ECH-4 — `arrayBuffer()` échoue mid-stream                    | L'erreur est bien wrappée dans le `catch` générique → `FetchError`. Le message est légèrement imprécis mais le comportement est correct.          |
| ECH-8 — chemins Windows avec espaces/accents                 | `readFile()` de Node.js gère nativement Unicode et les espaces. Non-issue.                                                                        |
| ECH-14 — SSRF localhost/IP privées                           | Non applicable : CLI tool où l'utilisateur saisit lui-même l'URL. Pas de surface d'attaque server-side.                                           |
| AA-3 — `progress` (0–1) jamais renseigné                     | Le paramètre est optionnel dans le type `ProgressCallback`. La spec AC6 ne le requiert pas. Informatif uniquement.                                |
