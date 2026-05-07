---
id: EVAL-035
date: 2026-05-07
register: evals
output: "Story 2.4 implémentée — 75/75 tests, build ✅, typecheck ✅, story → review"
action: keep
---

## Détail

Story 2.4 — Encodage des APNGs par état — implémentée et passée en `review`.

**Fichiers produits :**

- `src/core/encode-apngs.ts` — implémentation complète (84 lignes)
- `src/apngasm-bin.d.ts` — déclaration ambiante TypeScript

**Points notables :**

- Découverte LRN-044 : postinstall `apngasm-bin` bloqué par pnpm → `node lib/install.js` requis manuellement
- Découverte LRN-045 : `declare module` inline dans fichier avec imports = module augmentation (TS2666) → `.d.ts` séparé requis

**Résultats validation :**

- AC2 (ValidationError) : 3/3 ✅
- 4 scénarios pipeline complet (URL .webp, URL .png, local .webp, local .png) × 8 états × 3 assertions = 72/72 ✅
- Total : 75/75 assertions
- NFR1 : 20–35s (< 60s) ✅
- `pnpm build` → exit 0 ✅
- `pnpm typecheck` → exit 0 ✅
