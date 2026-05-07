# Story 1.3 : Documentation de contribution (CONTRIBUTING.md)

Status: done

> 📋 **Review :** [reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-3-documentation-de-contribution-contributing-md.md](../reviews/epic-1-fondations-du-projet-et-architecture-de-contribution/review-1-3-documentation-de-contribution-contributing-md.md)

## Story

En tant que développeur souhaitant écrire un OutputAdapter pour une nouvelle app de compagnon,
Je veux une documentation claire et complète pour créer et soumettre un adapter,
Afin de pouvoir contribuer un adapter fonctionnel en une session sans avoir à lire le codebase Core.

## Acceptance Criteria

**AC1 — Section "Écrire un Adapter"**

Étant donné que `CONTRIBUTING.md` existe à la racine du repo,
Quand je lis la section "Écrire un Adapter",
Alors elle référence `src/types.ts` (pour l'interface) et mentionne `src/adapters/clawd.ts` comme exemple de référence avec la note de placeholder _"Voir `src/adapters/clawd.ts` — implémenté en Epic 3"_
Et elle documente le contrat `OutputAdapter.generate()` : inputs reçus (`AdapterInput`), outputs attendus (`AdapterOutput`), et usage du champ `warnings`.

**AC2 — Section setup & architecture**

Étant donné que `CONTRIBUTING.md` existe,
Quand je lis la section setup,
Alors elle inclut les étapes de dev (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm link`), le schéma des couches architecturales (Core / Adapters / CLI), et les règles de frontières de modules (isolation `@clack/prompts`, sens unique des imports).

**AC3 — Section soumission**

Étant donné que `CONTRIBUTING.md` existe,
Quand je lis la section soumission,
Alors elle explique comment enregistrer le nouvel adapter dans `src/cli/index.ts` et comment ouvrir une PR.

## Tasks / Subtasks

- [x] Créer `CONTRIBUTING.md` à la racine du repo (AC1, AC2, AC3)
  - [x] Écrire la section "Setup & Architecture" avec commandes dev + schéma layers + règles frontières (AC2)
  - [x] Écrire la section "Écrire un Adapter" avec contrat complet de `OutputAdapter.generate()` (AC1)
  - [x] Écrire la section "Soumettre un Adapter" avec enregistrement `src/cli/index.ts` + PR (AC3)
- [x] Vérifier visuellement les 3 ACs : chaque section couvre bien son critère

## Dev Notes

### Fichier concerné par cette story

**À CRÉER (nouveau) :**

| Fichier           | Emplacement | Contenu                            |
| ----------------- | ----------- | ---------------------------------- |
| `CONTRIBUTING.md` | Racine repo | Guide complet contribution adapter |

**À NE PAS MODIFIER :** aucun fichier TypeScript ni config — cette story est purement documentaire.

> ⚠️ **Pas de `pnpm build` ni `pnpm typecheck` requis** — CONTRIBUTING.md est un fichier Markdown, pas du code compilé. La vérification est une lecture manuelle des 3 ACs.

---

### Règle de langue

Le fichier doit être rédigé en **français** (conformément à `document_output_language: Français` dans `_bmad/bmm/config.yaml`). Si Baptiste souhaite passer en anglais pour maximiser l'accessibilité internationale, c'est une décision post-story.

---

### Skeleton `CONTRIBUTING.md` — copier-coller direct

Utiliser ce skeleton tel quel. Chaque section est annotée avec l'AC qu'elle couvre.

````markdown
# Contribuer à pet-theme-converter

Bienvenue ! Ce guide explique comment créer et soumettre un **Output Adapter** pour intégrer `pet-theme-converter` avec une nouvelle application de compagnon.

Un adapter reçoit les 8 APNGs générés par le Core et les livre sous la forme attendue par votre app (archive ZIP, installation directe, upload cloud, etc.).

---

## Setup du projet _(AC2)_

**Prérequis :** Node.js ≥ 18.x · pnpm ≥ 8.x · TypeScript (connaissances de base)

```bash
# 1. Cloner le repo
git clone https://github.com/baptistelechat/pet-theme-converter.git
cd pet-theme-converter

# 2. Installer les dépendances
pnpm install

# 3. Lancer en mode développement (sans compilation)
pnpm dev

# 4. Compiler le projet
pnpm build

# 5. Tester localement avant publication
pnpm link
```
````

---

## Architecture _(AC2)_

Le projet est structuré en **3 couches indépendantes** :

```
src/
├── types.ts       ← Interfaces publiques partagées (racine du graphe — aucune dépendance interne)
├── core/          ← Pipeline de conversion (fetch → detect → slice → encode)
├── adapters/      ← Output Adapters (un fichier par app de compagnon)
└── cli/           ← Interface utilisateur interactive (@clack/prompts)
```

### Règles de frontières (obligatoires)

| Couche           | Peut importer depuis                           | Ne peut PAS importer depuis   |
| ---------------- | ---------------------------------------------- | ----------------------------- |
| `src/types.ts`   | _(aucun import interne)_                       | —                             |
| `src/core/*`     | `src/types.ts` uniquement                      | `src/cli/*`, `src/adapters/*` |
| `src/adapters/*` | `src/types.ts` uniquement                      | `src/cli/*`, `src/core/*`     |
| `src/cli/*`      | `src/core/*`, `src/adapters/*`, `src/types.ts` | —                             |

> ⚠️ **`@clack/prompts` est importé uniquement dans `src/cli/`.** Ne jamais l'importer dans un adapter ou dans le Core.

---

## Écrire un Adapter _(AC1)_

Un adapter est un fichier TypeScript dans `src/adapters/` qui implémente l'interface `OutputAdapter` définie dans [`src/types.ts`](src/types.ts).

### Interface `OutputAdapter`

```typescript
import type { OutputAdapter, AdapterInput, AdapterOutput } from "../types";

export const monAdapter: OutputAdapter = {
  async generate(input: AdapterInput): Promise<AdapterOutput> {
    // Votre implémentation ici
    return {
      mode: "zip",
      path: "/chemin/absolu/vers/le/fichier.zip",
      warnings: [], // optionnel
    };
  },
};
```

### Ce que l'adapter reçoit — `AdapterInput`

| Champ       | Type                         | Description                                                                   |
| ----------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `apngs`     | `Record<ClawdState, Buffer>` | 8 APNGs pré-encodés, un par état Clawd. Chaque Buffer est non-vide.           |
| `manifest`  | `ThemeManifest`              | Métadonnées : `name`, `compatibleWith` (ex. `"clawd-on-desk@1.x"`), `version` |
| `outputDir` | `string`                     | Chemin **absolu** du dossier de sortie (créez vos fichiers ici)               |

Les 8 états disponibles dans `ClawdState` : `idle` · `thinking` · `working` · `error` · `happy` · `notification` · `sleeping` · `waking`.

### Ce que l'adapter doit retourner — `AdapterOutput`

| Champ      | Type                     | Description                                                                 |
| ---------- | ------------------------ | --------------------------------------------------------------------------- |
| `mode`     | `'zip' \| 'install'`     | Mode de livraison utilisé par cet adapter                                   |
| `path`     | `string`                 | Chemin **absolu** vers le fichier ou dossier généré                         |
| `warnings` | `string[]` _(optionnel)_ | Avertissements non-bloquants à afficher à l'utilisateur après la conversion |

Le champ `warnings` sert à signaler des situations non-critiques — par exemple :

- `"Version cible inconnue — thème généré sans garantie de compatibilité"`
- `"Dossier de destination créé automatiquement"`

Ces messages sont transmis à la couche CLI et affichés à l'utilisateur sans interrompre la conversion.

### Gestion des erreurs

N'utilisez **jamais** `throw new Error('message')` directement. Étendez les classes typées de `src/types.ts` :

| Classe            | `exitCode` | Quand l'utiliser                                       |
| ----------------- | ---------- | ------------------------------------------------------ |
| `FetchError`      | `1`        | Échec de récupération (réseau, fichier introuvable)    |
| `ValidationError` | `2`        | Format invalide ou données corrompues                  |
| `InstallError`    | `3`        | Échec lors de l'écriture ou de l'installation du thème |

```typescript
import { InstallError } from "../types";

throw new InstallError(
  "Le dossier de destination n'est pas accessible en écriture",
);
```

### Adapter de référence

> _Voir [`src/adapters/clawd.ts`](src/adapters/clawd.ts) — implémenté en Epic 3._

Ce fichier sera l'adapter de référence pour **Clawd on Desk**. Il implémente : détection automatique du dossier Clawd par OS (Windows / macOS / Linux), génération d'archive ZIP via `archiver`, et installation directe dans le dossier `themes/` de l'application.

---

## Soumettre un Adapter _(AC3)_

### 1. Enregistrer l'adapter dans `src/cli/index.ts`

Ajoutez votre adapter au menu de sélection du mode de sortie dans `src/cli/index.ts` :

```typescript
// Importer votre adapter
import { monAdapter } from "../adapters/mon-adapter";

// Ajouter votre adapter aux options présentées à l'utilisateur
// (suivre le pattern d'enregistrement visible dans src/cli/index.ts une fois Epic 3 implémenté)
```

> ℹ️ Le pattern d'enregistrement complet sera visible dans `src/cli/index.ts` à partir d'Epic 3. En attendant, ajoutez l'import et suivez le code existant pour intégrer votre adapter dans les prompts CLI.

### 2. Ouvrir une Pull Request

1. Forkez le repo et créez une branche dédiée :
   ```bash
   git checkout -b adapter/nom-de-lapp
   ```
2. Créez votre adapter dans `src/adapters/nom-de-lapp.ts`
3. Enregistrez-le dans `src/cli/index.ts`
4. Vérifiez que `pnpm build` passe sans erreur (`exit 0`)
5. Ouvrez une PR vers `main` en incluant :
   - Le nom de l'application de compagnon ciblée
   - La version de l'app ciblée par votre adapter
   - Une description du mode de livraison (ZIP, installation directe, etc.)

```

---

### Règles critiques anti-erreurs pour l'agent dev

**1. Pas de code TypeScript à modifier**
Cette story ne touche à aucun fichier `.ts`. Ne pas modifier `src/types.ts`, `src/cli/index.ts` ou toute autre source existante.

**2. Le placeholder `clawd.ts` est intentionnel**
Le skeleton contient `_"Voir `src/adapters/clawd.ts` — implémenté en Epic 3"_`. C'est une formulation acceptée par l'AC1 (validée dans le rapport de readiness). Ne pas reformuler, ne pas essayer d'implémenter `clawd.ts`.

**3. `src/cli/index.ts` est un stub incomplet**
La section AC3 décrit l'enregistrement d'un adapter dans `src/cli/index.ts`. Ce fichier est actuellement un stub (juste un check Node version). L'implémentation réelle arrive en Story 3.3 — la note `"> ℹ️ ..."` dans le skeleton est correcte et nécessaire.

**4. Pas de `pnpm build` ni `pnpm typecheck`**
La vérification se fait en lisant CONTRIBUTING.md et en vérifiant que les 3 ACs sont couverts. Aucune compilation requise.

**5. Position du fichier**
`CONTRIBUTING.md` doit être créé à la **racine** du repo (même niveau que `package.json`, `tsconfig.json`, `CLAUDE.md`), pas dans un sous-dossier.

---

### État du codebase au démarrage de cette story

Fichiers existants pertinents :

```

pet-theme-converter/
├── src/
│ ├── cli/
│ │ └── index.ts ← stub : check Node ≥ 18 + `export {}`
│ ├── core/
│ │ ├── detect-grid.ts ← stub : `export {}`
│ │ ├── encode-apngs.ts ← stub : `export {}`
│ │ ├── fetch-spritesheet.ts ← stub : `export {}`
│ │ ├── slice-frames.ts ← stub : `export {}`
│ │ └── state-mapping.ts ← STATE_MAPPING typé (valeurs placeholder)
│ ├── adapters/
│ │ └── clawd.ts ← stub : `export {}`
│ └── types.ts ← complet : ClawdState, interfaces, classes d'erreur
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── tsup.config.ts

```

`CONTRIBUTING.md` est **absent** — c'est l'unique livrable de cette story.

---

### Vérification manuelle post-création

Après avoir créé CONTRIBUTING.md, vérifier :

| AC   | Critère                                                             | Check               |
|------|---------------------------------------------------------------------|---------------------|
| AC1  | Référence à `src/types.ts` présente                                 | ☐ oui              |
| AC1  | Mention `src/adapters/clawd.ts` avec placeholder Epic 3             | ☐ oui              |
| AC1  | Contrat `generate()` : `AdapterInput`, `AdapterOutput`, `warnings`  | ☐ oui              |
| AC2  | Commandes : `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm link`   | ☐ oui              |
| AC2  | Schéma Core / Adapters / CLI                                        | ☐ oui              |
| AC2  | Règles de frontières + isolation `@clack/prompts`                   | ☐ oui              |
| AC3  | Enregistrement adapter dans `src/cli/index.ts` décrit               | ☐ oui              |
| AC3  | Procédure PR expliquée                                              | ☐ oui              |

### Project Structure Notes

- `CONTRIBUTING.md` à la racine : aligné avec `architecture.md#Complete Project Directory Structure`
- Référence FR34 : _"Le repo expose un `CONTRIBUTING.md` décrivant la procédure pour écrire et soumettre un nouvel adapter"_
- Référence architecture : `FR32–FR34 → src/types.ts + CONTRIBUTING.md`

### References

- Interface `OutputAdapter` complète : [`src/types.ts`](src/types.ts)
- Schéma architecture + frontières : [`_bmad-output/planning-artifacts/architecture.md#Architectural Boundaries`](../_bmad-output/planning-artifacts/architecture.md)
- Readiness report — Story 1.3 reformulée (placeholder `clawd.ts` acceptable) : [`_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md`](../_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md)
- FR34 : [`_bmad-output/planning-artifacts/epics.md#Story-1.3`](../_bmad-output/planning-artifacts/epics.md)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (2026-05-06)

### Debug Log References

_Aucun blocage rencontré._

### Completion Notes List

- `CONTRIBUTING.md` créé à la racine du repo (159 lignes) depuis le skeleton Dev Notes copier-coller.
- AC1 ✅ : section "Écrire un Adapter" avec référence `src/types.ts`, placeholder `clawd.ts → Epic 3`, contrat complet `AdapterInput`/`AdapterOutput`/`warnings`, gestion erreurs typées.
- AC2 ✅ : section "Setup du projet" + "Architecture" avec 4 commandes pnpm, schéma 3 couches, table de frontières, isolation `@clack/prompts`.
- AC3 ✅ : section "Soumettre un Adapter" avec enregistrement `src/cli/index.ts` + procédure PR en 5 étapes.
- Story purement documentaire — aucun fichier TypeScript modifié, aucune compilation requise (conformément à [LRN-026](../../../.claude/memory/learnings/LRN-026.md)).

### File List

- `CONTRIBUTING.md` (créé)

## Change Log

| Date | Changement | Auteur |
|---|---|---|
| 2026-05-06 | Création de `CONTRIBUTING.md` (3 sections, 3 ACs couverts) | claude-sonnet-4-6 |
| 2026-05-06 | Réécriture en anglais — accessibilité internationale (BDR-018) | Baptiste |
```
