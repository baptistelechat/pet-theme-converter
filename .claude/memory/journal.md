---
register: journal
last_updated: 2026-05-05
---

## 2026-05-04

Session d'initialisation du projet `pet-theme-converter`. Lecture du RFC complet (`docs/pet-theme-converter-RFC.md`). Le projet est en phase de conception — aucun code écrit encore. Mise en place de l'infrastructure mémoire agent `.claude/memory/` avec les 5 registres standards.

Les décisions architecturales clés (format APNG, architecture Core+Adapters, distribution npm) ont été documentées d'après le RFC. Le mapping entre les 9 états Petdex et les 8 états Clawd on Desk a été capturé dans les apprentissages.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Format de sortie APNG plutôt que SVG animé
- [BDR-002](decisions/BDR-002.md) — Distribution via package npm indépendant + mini PRs de doc
- [BDR-003](decisions/BDR-003.md) — Architecture Core + Output Adapters interchangeables
- [LRN-001](learnings/LRN-001.md) — Format Petdex standardisé : grille 8×9, 192×208px, 9 états nommés
- [LRN-002](learnings/LRN-002.md) — Mapping états Petdex → états Clawd on Desk
- [BLK-001](blockers/BLK-001.md) — Aucun pont entre l'écosystème Petdex/Codex et les apps Claude Code

---

Session de brainstorming d'alignement sur le RFC. Baptiste a utilisé `/bmad-brainstorming` non pas pour générer des idées mais pour vérifier que la compréhension du projet est correcte avant de démarrer le développement. Le RFC était suffisamment complet pour court-circuiter la phase d'idéation.

Deux clarifications structurantes ont émergé : (1) le convertisseur cible **toutes les marketplaces exposant des spritesheets Codex-compatibles**, pas seulement Petdex — Petdex reste l'exemple principal dans la doc mais n'est pas une contrainte technique ; (2) les spritesheets hors-standard (dimensions non conformes à la grille 9×8/192×208px) seront traitées avec un **warning non-bloquant** plutôt qu'un rejet, avec un futur param CLI d'override prévu en v0.2+.

Le mapping états Petdex→Clawd est explicitement provisoire — Baptiste anticipe des ajustements après tests terrain sur des pets réels. À garder en tête pour que le mapping reste facilement modifiable dans le code.

Fin de session : alignement confirmé, prêt à attaquer le dev (setup projet → core converter → adapter Clawd → CLI).

**Entrées clés :**

- [BDR-004](decisions/BDR-004.md) — Gestion des spritesheets hors-standard : warning + grille 9×8 par défaut
- [BDR-005](decisions/BDR-005.md) — Cible sources : toutes marketplaces Codex-compatibles
- [LRN-003](learnings/LRN-003.md) — Mapping états provisoire, ajustable post-terrain

---

Session de production du Product Brief via `/bmad-product-brief`. Baptiste a demandé un brief directement depuis le RFC existant et la mémoire agent, sans nouvelle découverte. Le workflow a pu sauter les stages 1 et 2 (intent + contextual discovery) grâce à la richesse du RFC et des 5 registres déjà remplis.

Le script BMAD `resolve_customization.py` a échoué (Python absent du PATH Windows) — résolu par lecture manuelle de `customize.toml` sans perte de fonctionnalité. Le brief a été produit en une passe, sauvegardé dans `_bmad-output/planning-artifacts/product-brief.md`. 8 sections, ~1,5 page, cohérent avec toutes les décisions BDR-001→BDR-005.

**Entrées clés :**

- [LRN-004](learnings/LRN-004.md) — RFC complet + mémoire court-circuitent le discovery dans `/bmad-product-brief`
- [BLK-002](blockers/BLK-002.md) — Python absent sur Windows, fallback manuel appliqué
- [EVAL-003](evals/EVAL-003.md) — Product Brief produit, aucune anomalie

---

Session de finalisation du PRD via `/bmad-create-prd`. La session a repris après compaction de contexte (la session précédente avait produit les steps 1 à 11 du workflow). Les 3 corrections de polish restantes du step 11 ont été appliquées : suppression de la sous-section "Project-Type Overview" (doublon de l'Executive Summary), suppression de "Technical Architecture Considerations" (doublon de Domain-Specific Requirements), et fusion de "Product Scope" (step 3, liste concise) avec "Project Scoping & Phased Development" (step 8, détaillé) en une section unique "Product Scope & Roadmap".

Le step 12 (Workflow Completion) a été exécuté — le PRD est finalisé et validé. Le document couvre 9 sections, FR1–FR34, des NFRs mesurables (< 60s, timeout 30s, 3 OS), 4 user journeys et une classification greenfield contraint.

Deux décisions techniques complémentaires ont été documentées : CLI 100% interactif sans config en v0.1 ([BDR-006](decisions/BDR-006.md)) et timeout fetch = 30 secondes ([BDR-007](decisions/BDR-007.md)). Un learning de processus BMAD a été capturé : les steps 3 et 8 génèrent des duplications de contenu Scope qu'il faut systématiquement merger en step-11 ([LRN-006](learnings/LRN-006.md)).

**Entrées clés :**

- [EVAL-004](evals/EVAL-004.md) — PRD v1.0 complet, aucune anomalie résiduelle
- [BDR-006](decisions/BDR-006.md) — CLI 100% interactif, pas de config en v0.1
- [LRN-006](learnings/LRN-006.md) — Duplications inter-sections BMAD à merger en step-11

---

Session d'architecture via `/bmad-create-architecture`. Le workflow complet (steps 1→8) a été exécuté sans interruption. L'architecture de `pet-theme-converter` est maintenant documentée dans `_bmad-output/planning-artifacts/architecture.md`.

Les décisions architecturales clés ont toutes été prises collaborativement : pipeline fonctionnel pur avec callbacks `onProgress` découplés de la CLI layer ([BDR-008](decisions/BDR-008.md)), interface `OutputAdapter` figée avec `AdapterInput` recevant des `Buffer[]` pré-encodés ([BDR-009](decisions/BDR-009.md)), librairie `archiver` pour le ZIP ([BDR-010](decisions/BDR-010.md)), et CI GitHub Actions sur 3 OS × Node 18/20 ([BDR-011](decisions/BDR-011.md)).

Le step-04 (decisions) a nécessité une adaptation : les 5 catégories génériques BMAD (Data, Auth, API, Frontend, Infrastructure) ont été remplacées par 3 catégories spécifiques au CLI tool (architecture interne du pipeline, contrat public OutputAdapter, infrastructure & distribution). Ce pattern de filtrage a été capturé dans [LRN-007](learnings/LRN-007.md).

Le gap analysis du step-07 a détecté un point non décidé (librairie ZIP) — résolu immédiatement avec `archiver`. Aucun blocage rencontré. Le document final couvre les 34 FR, les 4 catégories NFR, 14 fichiers sources définis, frontières architecturales explicitées, et data flow de bout en bout tracé.

Le triptyque `RFC → Product Brief → PRD → Architecture` est maintenant complet. La prochaine étape est `/bmad-create-epics-and-stories`.

**Entrées clés :**

- [EVAL-005](evals/EVAL-005.md) — Architecture v1.0 complète, validée
- [BDR-008](decisions/BDR-008.md) — Pipeline fonctionnel pur + onProgress
- [BDR-009](decisions/BDR-009.md) — Interface OutputAdapter figée
- [LRN-007](learnings/LRN-007.md) — Filtrage des catégories BMAD step-04 pour CLI tools

---

Session de création des epics et stories via `/bmad-create-epics-and-stories`. Le workflow complet (steps 1→4) a été exécuté. Le document `_bmad-output/planning-artifacts/epics.md` est finalisé.

4 epics, 14 stories au total : Epic 1 (3 stories — fondation + types + CONTRIBUTING.md), Epic 2 (4 stories — pipeline Core fetch→detect→slice→encode), Epic 3 (4 stories — adapter Clawd ZIP/install + CLI prompts/messages), Epic 4 (3 stories — CI + README + publication npm). Couverture FR1–FR34 = 100%, toutes les validations passées.

Deux corrections de process notées : (1) les stories doivent être en français dès le départ (`document_output_language: Français`), la langue anglaise utilisée initialement a été corrigée dès que Baptiste l'a signalé ; (2) Baptiste a confirmé que la CI GitHub Actions (BDR-011) était bien connue et voulue dans l'Epic 4 — aucune confusion sur ce point.

Le triptyque `RFC → Brief → PRD → Architecture → Epics & Stories` est maintenant complet. La prochaine étape est `/bmad-dev-story` pour implémenter story par story.

**Entrées clés :**

- [EVAL-006](evals/EVAL-006.md) — Epics & Stories v1.0 complets — 4 epics, 14 stories, FR1–FR34 couverts

---

Rituel de fermeture `/memory-close`. Une seule entrée produite : [LRN-008](learnings/LRN-008.md) — vérifier `document_output_language` avant step-03 de `bmad-create-epics-and-stories`. Aucune nouvelle décision, aucun blocage, EVAL-006 déjà indexé en cours de session.

La chaîne complète de planification `RFC → Brief → PRD → Architecture → Epics & Stories` est désormais entièrement documentée. Prochaine session : `/bmad-check-implementation-readiness`, puis `/bmad-sprint-planning` et l'implémentation story par story via `/bmad-dev-story`.

---

Session `/bmad-check-implementation-readiness` sur pet-theme-converter. Workflow complet exécuté en 6 steps (discovery → PRD analysis → epic coverage → UX alignment → epic quality review → final assessment). Rapport généré dans `_bmad-output/planning-artifacts/implementation-readiness-report-2026-05-04.md`.

Verdict : **READY WITH CONDITIONS**. 34/34 FRs tracées dans le Coverage Map, 12/12 NFRs avec ACs mesurables, 0 violation critique. Quatre issues majeures identifiées : (1) Story 1.3 — CONTRIBUTING.md référence `clawd.ts` comme "exemple fonctionnel" alors qu'il n'existe pas encore en Epic 1 ; (2) Epic 2 — le Core seul ne délivre pas de valeur end-user sans la couche CLI (Epic 3) ; (3) Story 3.3 — aucun AC pour le flux UX de saisie manuelle du chemin Clawd (FR18) ; (4) Story 4.1 — commande CI `--version` non définie nulle part.

Après le rapport, Baptiste a demandé d'appliquer uniquement les amendments sans écrire de code. Trois corrections ciblées dans `epics.md` : Story 1.3 reformulée avec placeholder acceptable pour clawd.ts, Story 3.3 enrichie d'un AC complet pour FR18 (prompt conditionnel + validation chemin + re-prompt si invalide), Story 4.1 simplifiée — `pnpm build` (exit 0 + shebang vérifié) remplace la commande `--version` inexistante.

Deux patterns capturés : l'Epic Core sans valeur end-user est une dérogation acceptable et attendue pour un CLI tool ([LRN-009](learnings/LRN-009.md)) ; le Coverage Map ne garantit pas que les ACs couvrent le flux UX complet — il faut vérifier le QUAND/COMMENT des interactions ([LRN-010](learnings/LRN-010.md)).

La chaîne de planification est maintenant entièrement validée et amendée. Prochaine étape : implémentation story par story via `/bmad-dev-story`, en commençant par Story 1.1.

**Entrées clés :**

- [EVAL-007](evals/EVAL-007.md) — Rapport readiness READY WITH CONDITIONS + 3 amendments epics.md
- [LRN-010](learnings/LRN-010.md) — Coverage Map ≠ couverture ACs UX

## 2026-05-05

Session de génération du graphe de connaissance `/graphify` sur le projet `pet-theme-converter`. Deux runs ont été nécessaires : le premier a mis en évidence deux problèmes structurels, le second a produit un graphe propre et pertinent.

**Run 1 — problèmes détectés :** Le dossier `_bmad/` a été inclus par défaut, injectant 20 nœuds AST issus des scripts Python du framework BMAD (`deep_merge()`, `_detect_keyed_merge_field()`, etc.) et générant 2 communautés entièrement parasites sur 8 (Community 0 "BMAD Customization Engine" et Community 1 "Config Resolution Pipeline"). Parallèlement, le dossier `.claude/memory/` — le plus riche du projet avec 35 fichiers — était absent : graphify ne scanne pas les dossiers dont le nom commence par `.` (dossiers cachés). Résultat : 55 nœuds, 8 communautés dont 25% de bruit, god nodes mémoire manquants.

**Correction appliquée :** Création d'un fichier `.graphifyignore` à la racine excluant `_bmad/` et `graphify-out/`. Injection manuelle des 35 fichiers `.claude/memory/*.md` (hors `.obsidian/`) dans `.graphify_detect.json` après la détection, avant le lancement de l'extraction sémantique.

**Run 2 — résultat :** 82 nœuds, 174 edges, 10 communautés propres. Les registres mémoire sont devenus des god nodes structurants : `Decisions Memory Index` (11 edges, rang 4), `Learnings Register Index` (10 edges, rang 6), `Agent Session Journal` (9 edges, rang 7). Le `Readiness Report` présente la centralité betweenness la plus élevée (0.478), confirmant son rôle de pont entre les 4 grandes communautés du projet. 6 hyperedges capturent les flows clés : pipeline de conversion, chaîne planning BMAD complète, et ecosystem bridge Petdex→Clawd.

Deux patterns réutilisables documentés pour tout futur projet utilisant graphify avec BMAD et une mémoire `.claude/`.

**Entrées clés :**

- [BLK-003](blockers/BLK-003.md) — graphify ne détecte pas les dossiers cachés, résolu par injection manuelle
- [LRN-011](learnings/LRN-011.md) — workaround injection `.claude/memory/` dans detect.json
- [LRN-012](learnings/LRN-012.md) — `_bmad/` = framework interne, toujours exclure via `.graphifyignore`
- [EVAL-009](evals/EVAL-009.md) — graphe v2 propre, 82 nœuds, keep

---

Session `/bmad-sprint-planning` sur pet-theme-converter. Workflow exécuté en une passe sans interruption.

Lecture du fichier `_bmad-output/planning-artifacts/epics.md` (4 epics, 14 stories, FR1–FR34). Le dossier `_bmad-output/implementation-artifacts/` était vide — aucune story existante. Le dossier a été créé, et `sprint-status.yaml` a été généré avec l'intégralité des entrées : 4 epics, 14 stories, 4 rétrospectives, toutes en `backlog`.

Anomalie détectée sans impact bloquant : le champ `project_name` dans `_bmad/bmm/config.yaml` vaut `Français` (probablement une coquille lors du setup BMAD) — corrigé manuellement dans le sprint-status en utilisant `pet-theme-converter`.

La chaîne de planification complète est opérationnelle. Prochaine étape : `/bmad-dev-story` Story 1.1 — initialisation du projet et configuration du build.

**Entrées clés :**

- [EVAL-010](evals/EVAL-010.md) — sprint-status.yaml généré, 4 epics / 14 stories en backlog

---

Session `/bmad-create-story` sur pet-theme-converter. Première story du projet créée : Story 1.1 — Initialisation du projet et configuration du build.

Le workflow a été exécuté sans interruption pour la création elle-même. La story produite couvre 5 ACs BDD, 7 tâches concrètes, et des Dev Notes exhaustifs (skeleton `package.json`, `tsconfig.json`, `tsup.config.ts`, stub `src/cli/index.ts`). Le `sprint-status.yaml` a été mis à jour : `epic-1` → `in-progress`, story 1.1 → `ready-for-dev`.

**Trois anomalies soulevées par Baptiste après la création :**

1. **Python / LRN-005** : j'ai appliqué LRN-005 ("Python absent du PATH") sans vérification, ce qui était correct. Mais quand Baptiste a dit "Python marche bien sur mon PC", j'ai incorrectement corrigé LRN-005. Après test réel (`python3 --version` → stub Microsoft Store), LRN-005 a été restauré dans son état original correct. Règle apprise : ne jamais corriger une mémoire sur témoignage verbal — vérifier par observation directe.

2. **`moduleResolution: "Node16"` non voulu** : la story et l'epics.md avaient hérité de `"module": "Node16"` + `"moduleResolution": "Node16"` de l'architecture, ce qui impose des extensions `.js` sur tous les imports relatifs TypeScript. Baptiste ne voulait pas de cette contrainte. Corrigé vers `"module": "ESNext"` + `"moduleResolution": "bundler"` (TypeScript 5.x, conçu pour les projets avec bundler comme tsup) dans la story, l'AC3 de l'`epics.md`, et formalisé en [BDR-012](decisions/BDR-012.md).

3. **Graphify non consulté** : l'instruction CLAUDE.md impose de lire `graphify-out/GRAPH_REPORT.md` avant toute exploration de codebase. Cette instruction a été ignorée en début de session. Le rapport a été lu en cours de session et ne contenait pas d'information supplémentaire critique pour cette story, mais la règle doit être respectée systématiquement.

**Entrées clés :**

- [BDR-012](decisions/BDR-012.md) — `"moduleResolution": "bundler"` pour TypeScript + tsup
- [LRN-013](learnings/LRN-013.md) — pattern TypeScript 5.x + tsup → bundler
- [LRN-014](learnings/LRN-014.md) — vérifier par observation directe avant de corriger une mémoire
- [EVAL-011](evals/EVAL-011.md) — Story 1.1 produite et corrigée

---

Session `/graphify .` — troisième run du graphe de connaissance sur `pet-theme-converter`.

Le run a produit un graphe v3 propre : 54 fichiers indexés (9 projet + 45 `.claude/memory/` injectés manuellement selon [LRN-011](learnings/LRN-011.md)), 3 subagents sémantiques en parallèle, 125 nœuds, 194 edges, 13 communautés. Progression nette par rapport au v2 (82 nœuds) : les nouvelles entrées mémoire et la Story 1.1 ont enrichi le graphe de +52% en nœuds.

Un blocage encodage UTF-8 s'est produit à l'étape 4 (écriture de `GRAPH_REPORT.md`) : Windows utilisait cp1252 par défaut, incompatible avec les caractères `→`, `×`, `–` présents dans le rapport. Résolu en ajoutant `$env:PYTHONIOENCODING = "utf-8"` et `encoding='utf-8'` sur tous les I/O fichiers Python.

La discussion post-run sur le hook vs `--update` a abouti à retirer le hook post-commit (`graphify hook uninstall`) : le hook ne traite que les fichiers code via AST, or le projet est 100% docs — il n'apportait rien et obligeait quand même un run manuel pour les `.md`. Le workflow retenu est `/graphify . --update` manuel, avec injection préalable de `.claude/memory/` (contrainte permanente, [LRN-011](learnings/LRN-011.md)).

**Entrées clés :**

- [BLK-004](blockers/BLK-004.md) — `UnicodeEncodeError` cp1252 résolu par UTF-8 forcé
- [LRN-015](learnings/LRN-015.md) — distinction hook vs `--update`
- [BDR-013](decisions/BDR-013.md) — hook retiré, workflow manuel adopté
- [EVAL-012](evals/EVAL-012.md) — graphe v3 : 125 nœuds, 13 communautés

---

Session de reprise après compaction de contexte. L'objectif principal était de finaliser le rebuild graphify v4 — un run complet `/graphify .` sur les 9 fichiers projet uniquement, sans injection de `.claude/memory/`, pour produire un graphe propre sans nœuds LRN/EVAL/BDR/BLK.

Le rebuild a été complété avec succès : 46 nœuds, 95 edges, 10 communautés. Le cache sémantique était vide (le dossier `graphify-out/` avait été supprimé entre les deux sessions), donc un subagent d'extraction complète a été dispatché. L'extraction a bien fonctionné et les 9 fichiers ont été cachés pour les runs suivants.

Un blocage API s'est produit à l'étape 4 : le skill graphify référence `graphify.graph.build_graph` qui n'existe pas dans la version installée. Résolu par inspection des sous-modules (`pkgutil.iter_modules`) — l'API réelle est `graphify.build.build_from_json`, `graphify.cluster.cluster`, `graphify.export.to_json/to_html`, `graphify.report.generate`.

Après le rebuild, Baptiste a constaté que toutes les communautés s'appelaient "Community 0…9" dans le HTML. Cause : j'avais utilisé des labels génériques `{cid: "Community N"}` au lieu de nommer chaque communauté en analysant ses membres — l'étape 5 "Label communities" du skill est une génération manuelle LLM, pas un automatisme. Corrigé en analysant les 10 communautés et en générant des labels significatifs (Requirements & Target Apps, Project Planning & Sprints, Build Toolchain, etc.), puis en régénérant `graph.html` et `GRAPH_REPORT.md`.

En fin de session, Baptiste a décidé de gitignorer `graphify-out/` (dossier d'artefacts générés) et a lancé `git rm -r --cached graphify-out/` pour détracker les fichiers précédemment commités. VS Code continuait à afficher certains fichiers en couleur, ce qui l'a inquiété — expliqué que c'est un état hybride normal (staged deletion + fichier recréé) qui se résout au prochain commit.

**Entrées clés :**

- [BDR-014](decisions/BDR-014.md) — `graphify-out/` gitignored
- [BLK-005](blockers/BLK-005.md) — `graphify.graph` inexistant, API réelle trouvée
- [LRN-017](learnings/LRN-017.md) — labels communautés = étape manuelle LLM
- [EVAL-013](evals/EVAL-013.md) — graphe v4 : 46 nœuds, sans mémoire, labels significatifs

---

Courte session de correction et de décision finale sur le versionning de `graphify-out/`.

LRN-011 avait été supprimé par erreur lors d'une session précédente (il documentait le workaround d'injection manuelle de `.claude/memory/`). La suppression avait créé des liens orphelins dans le journal (références aux graphes v2 et v3) et dans EVAL-012. LRN-011 a été reconstruit avec un contenu enrichi couvrant le cycle complet : workaround actif en v2/v3, abandonné en v4.

La décision BDR-014 a été corrigée : la version initiale gitignoraient tout `graphify-out/`, ce qui aurait forcé chaque PC à repayer le coût LLM d'extraction. La version finale retient les 3 outputs utiles (`graph.json`, `GRAPH_REPORT.md`, `graph.html`) et n'exclut que les fichiers volatils (`cache/`, `.graphify_*.json/txt`, `obsidian/`). Avec cette stratégie, un `git pull` suffit pour avoir le graphe fonctionnel sur n'importe quel PC — aucune reconstruction nécessaire tant que les fichiers source n'ont pas changé.

**Entrées clés :**

- [BDR-014](decisions/BDR-014.md) — stratégie versionning graphify-out affinée

---

Session `/bmad-dev-story 1.1` — première implémentation de code du projet `pet-theme-converter`.

La story 1.1 (Initialisation du projet et configuration du build) a été exécutée de bout en bout sur un projet greenfield côté code. Tous les fichiers de fondation ont été créés : `package.json`, `tsconfig.json`, `tsup.config.ts`, `src/cli/index.ts` (stub ESM minimal), `.npmignore`. Le `.gitignore` existait déjà avec des entrées Obsidian et graphify — corrigé par Read + Edit (append) plutôt que Write.

Deux petits accrocs de workflow résolus rapidement : le Write sur `.gitignore` a échoué au premier essai ([BLK-006](blockers/BLK-006.md)), et `pnpm install` n'a pas replacé les specifiers `"latest"` par des versions pinned ([BLK-007](blockers/BLK-007.md)) — nécessité d'une édition manuelle avec les versions issues de l'output d'install.

`pnpm build` → `dist/index.js` 20 B, shebang `#!/usr/bin/env node` ligne 1 ✅. `pnpm typecheck` → zéro erreur (TypeScript 6.0.3) ✅. Les 5 ACs BDD sont satisfaits. Story → `review`, sprint-status mis à jour.

En fin de session, Baptiste a demandé des explications sur le `banner: { js: "#!/usr/bin/env node" }` de tsup (injection du shebang après compilation) et sur tsup lui-même (bundler TS basé sur esbuild, produit un seul fichier ESM distributable vs `tsc` qui conserve la structure de fichiers).

**Entrées clés :**

- [EVAL-014](evals/EVAL-014.md) — Story 1.1 implémentée, keep
- [BLK-006](blockers/BLK-006.md) — `.gitignore` existant, résolu
- [BLK-007](blockers/BLK-007.md) — `"latest"` non remplacé par pnpm, résolu

---

Session `/bmad-code-review` Story 1.1 — première code review du projet.

La session a débuté par une correction de [LRN-005](learnings/LRN-005.md) : `python3` est intercepté par le stub Microsoft Store, mais `python` (sans le 3) pointe vers Python 3.14.3 réellement installé. Le script `resolve_customization.py` fonctionne avec `python` — l'index et le fichier ont été mis à jour après vérification par observation directe (conformément à [LRN-014](learnings/LRN-014.md)).

Le workflow `/bmad-code-review` a été exécuté en intégralité pour la première fois sur ce projet. Trois agents parallèles ont été lancés : Blind Hunter (14 findings bruts), Edge Case Hunter (6 findings JSON), Acceptance Auditor (0 finding — tous ACs satisfaits). Après triage : 2 patch, 9 defer, 9 dismiss. Les 9 findings dismissés du Blind Hunter étaient majoritairement des faux positifs sur des versions de packages — les versions `@clack/prompts 1.3.0` et `typescript 6.0.3` sont valides en 2026 mais inconnues du training data du modèle. Pattern capturé dans [LRN-022](learnings/LRN-022.md).

Deux décisions de workflow ont été établies à la demande de Baptiste, inspirées d'un projet précédent : (1) les findings de review vont désormais dans un fichier dédié `reviews/<epic-slug>/review-<story-slug>.md` — jamais dans le story file ([BDR-015](decisions/BDR-015.md)) ; (2) les règles post-review (résolution opportuniste deferred-work, format emoji 🔵/✅/🚫, cochage ACs) sont stockées dans `CLAUDE.md` plutôt que dans les custom toml skills ([BDR-016](decisions/BDR-016.md)). Ces règles ont été appliquées rétroactivement : fichier de review créé, story file nettoyé, `deferred-work.md` reformaté.

Lors de l'application des patches, un blocage typecheck a été rencontré ([BLK-008](blockers/BLK-008.md)) : `process` non reconnu malgré `@types/node` installé — `"moduleResolution": "bundler"` ne résout pas les types Node automatiquement. Résolu par ajout de `"types": ["node"]` dans `tsconfig.json`. Pattern documenté dans [LRN-021](learnings/LRN-021.md).

Au total, 4 corrections appliquées sur les fichiers source : `.npmignore` (glob `**/*.test.ts`), `package.json` (`prepublishOnly`), `tsup.config.ts` (`external`), `src/cli/index.ts` (check runtime Node), `tsconfig.json` (`"types": ["node"]`). Build ✅ typecheck ✅. Story 1.1 → `done`.

**Entrées clés :**

- [BDR-015](decisions/BDR-015.md) — findings review dans fichier dédié
- [BDR-016](decisions/BDR-016.md) — règles post-review dans CLAUDE.md
- [LRN-021](learnings/LRN-021.md) — `"types": ["node"]` requis avec `"moduleResolution": "bundler"`
- [LRN-022](learnings/LRN-022.md) — faux positifs Blind Hunter sur versions packages
- [EVAL-015](evals/EVAL-015.md) — Story 1.1 review complète, story → done
