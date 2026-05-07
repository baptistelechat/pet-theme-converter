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

---

Session `/bmad-create-story 1.2` — création de la Story 1.2 : Interface publique OutputAdapter et types partagés.

Le workflow a été exécuté de bout en bout. Le fichier story de la Story 1.1 était absent de `implementation-artifacts/` au moment de charger le contexte précédent — seul `deferred-work.md` était présent dans le dossier. Le contexte a été reconstitué depuis deux sources alternatives : le fichier de review existant (`reviews/epic-1-.../review-1-1-...md`) et le journal de session. Ce fallback s'est avéré suffisant — les learnings critiques (BDR-012, LRN-021, patrons de code) étaient tous disponibles.

La story produite contient : 4 ACs BDD précis (types, classes d'erreur, build propre, frontières d'import), 7 tâches avec sous-tâches, le skeleton complet de `src/types.ts` (copier-coller ready), le skeleton de `src/core/state-mapping.ts` avec le `STATE_MAPPING` typé en placeholder, les stubs minimaux pour les 5 autres fichiers, et un bloc de règles anti-erreurs critiques : `Buffer` est un global Node (pas d'import), pattern `exitCode = 1 as const` (pas `number`), imports sans extension `.js` avec `moduleResolution: bundler`, `ClawdState` union type string (jamais enum), `pnpm typecheck` obligatoire en plus de `pnpm build`. Une table explicite liste les fichiers à ne PAS modifier (`src/cli/index.ts`, configs). Sprint-status mis à jour : story 1.2 → `ready-for-dev`.

**Entrées clés :**

- [LRN-023](learnings/LRN-023.md) — fichier story done absent, fallback via review + journal
- [EVAL-016](evals/EVAL-016.md) — Story 1.2 produite, keep

---

Session `/bmad-dev-story 1.2` — implémentation de la Story 1.2 : Interface publique OutputAdapter et types partagés.

La session a été la plus rapide du projet à ce jour. La story était dotée de skeletons copier-coller exacts dans ses Dev Notes pour tous les fichiers non-triviaux (`src/types.ts`, `src/core/state-mapping.ts`), ce qui a réduit l'implémentation à une série de `Write` sans diagnostic ni décision. 7 fichiers créés en une passe : `src/types.ts` (2 types, 4 interfaces, 3 classes d'erreur avec `exitCode = X as const`), `src/core/state-mapping.ts` (STATE_MAPPING typé, valeurs placeholder), et 5 stubs `export {};` (`fetch-spritesheet.ts`, `detect-grid.ts`, `slice-frames.ts`, `encode-apngs.ts`, `src/adapters/clawd.ts`).

`pnpm build` → `dist/index.js` 207 B, exit 0 ✅. `pnpm typecheck` → zéro erreur TypeScript ✅. Tous les 4 ACs satisfaits. Story → review, sprint-status mis à jour.

Pattern extrait : quand les Dev Notes incluent le code complet à écrire, le coût rédactionnel est récupéré 10× à l'implémentation — règle à appliquer systématiquement lors de la rédaction des stories futures.

**Entrées clés :**

- [LRN-024](learnings/LRN-024.md) — skeleton copier-coller → implémentation sans friction
- [EVAL-017](evals/EVAL-017.md) — Story 1.2 implémentée, keep

---

Session `/bmad-code-review 1.2` — review de la Story 1.2 : Interface publique OutputAdapter et types partagés.

Workflow exécuté en intégralité. Trois agents parallèles lancés : Blind Hunter (10 findings bruts), Edge Case Hunter (7 findings), Acceptance Auditor (AC1/AC2/AC4 satisfaits, AC3 confirmé par Dev Agent Record). Triage initial : 0 patch, 5 defer, 7 dismiss. Baptiste a alors signalé que D1/D3/D4/D5 n'avaient aucune raison d'être déférés — ce sont des JSDoc sur une API publique, fixes non-ambigus applicables immédiatement. Correction appliquée : 4 patches JSDoc dans `src/types.ts`, 1 seul defer conservé (STATE_MAPPING — nécessite les spritesheets réelles, Story 2.2).

JSDoc ajoutés : `ThemeManifest.compatibleWith` (format `"clawd-on-desk@1.x"`), `ProgressCallback.progress` (plage 0–1), `AdapterInput.apngs` (Buffer non-vide requis), `AdapterOutput.path` (chemin absolu). `pnpm typecheck` → exit 0 après patches.

Le seul defer légitime restant : `STATE_MAPPING` avec `frames: 9` hardcodé — valeurs placeholder intentionnelles (noté dans la story), validation contre la grille réelle déléguée à Story 2.2 (`detect-grid.ts`).

7 findings dismissés, tous des faux positifs spec-defined : le Blind Hunter ne connaît pas le contexte architectural (outputDir requis par BDR-009, stubs `export {}` exigés par AC3, exitCode pattern documenté dans Dev Notes, etc.). Pattern cohérent avec [LRN-022](learnings/LRN-022.md).

Pattern structurant capturé dans [LRN-025](learnings/LRN-025.md) : `defer` ≠ "je le ferai plus tard" — un `defer` est réservé aux changements nécessitant une story dédiée, des données externes ou une décision architecturale.

Story 1.2 → `done`. Sprint-status, deferred-work.md et fichier de review tous mis à jour.

**Entrées clés :**

- [LRN-025](learnings/LRN-025.md) — defer vs patch : JSDoc sur interface publique = patch non-ambigu
- [EVAL-018](evals/EVAL-018.md) — Story 1.2 review complète, story → done

---

Session de finalisation du pipeline graphify `--update` (v5) et décision de purge.

La session a repris après compaction de contexte, au milieu du pipeline graphify `--update` lancé lors de la session précédente. Le subagent sémantique avait terminé et écrit `graphify-out/.graphify_chunk_01.json` (24 nœuds, 25 edges, 4 hyperedges sur les 5 fichiers modifiés). Le reste du pipeline a été complété : merge cache + semantic → `build_merge` (8 déduplications dont 3 fuzzy) → cluster (13 communautés) → `god_nodes` + `surprising_connections` → `to_json` + `to_html` + `GRAPH_REPORT.md`. Résultat final : 90 nœuds, 207 edges — graphe v5.

Trois mismatches API graphify ont nécessité des diagnostics rapides : `build_from_json()` ne supporte pas `existing_graph` (→ `build_merge`), `graphify.analyze` n'exporte pas `analyze` (→ `god_nodes` + `surprising_connections`), et `report.generate` attend `total_files`/`total_words` dans `detect_result` (→ dict synthétique). Chacun résolu en une tentative.

Après la completion du pipeline, Baptiste a demandé d'enregistrer la décision de purger graphify du projet. [BDR-017](decisions/BDR-017.md) créé : arrêt définitif — coût de maintenance (injection `.claude/memory/` requise, run manuel après chaque session, pas d'automatisation possible sur corpus 100% docs) supérieur à la valeur produite. [BDR-013](decisions/BDR-013.md) et [BDR-014](decisions/BDR-014.md) passés en `supersédé`. Ce graphe v5 est le dernier run graphify sur ce projet.

**Entrées clés :**

- [BDR-017](decisions/BDR-017.md) — Arrêt définitif de graphify sur pet-theme-converter
- [EVAL-019](evals/EVAL-019.md) — graphe v5, dernier run avant purge

## 2026-05-06

Session `/bmad-create-story 1.3` — création de la Story 1.3 : Documentation de contribution (CONTRIBUTING.md).

Session courte et sans friction. Story 1.3 est la troisième et dernière story de l'Epic 1. Sa particularité : c'est une story purement documentaire — aucun fichier TypeScript à créer ou modifier, aucune compilation requise. Le livrable unique est `CONTRIBUTING.md` à la racine du repo.

La story produite contient un skeleton Markdown copier-coller complet couvrant les 3 ACs : section "Écrire un Adapter" (contrat `OutputAdapter.generate()`, tables `AdapterInput`/`AdapterOutput`, usage du champ `warnings`, placeholder `clawd.ts` → Epic 3), section setup (4 commandes pnpm, schéma Core/Adapters/CLI, règles de frontières), section soumission (enregistrement `src/cli/index.ts` + procédure PR). Une checklist manuelle de vérification post-création complète les Dev Notes. Le sprint-status a été mis à jour : story 1.3 → `ready-for-dev`.

Correction de cohérence en marge : [BDR-017](decisions/BDR-017.md) (Arrêt définitif graphify, créé en session 2026-05-05) était absent de l'index `decisions.md` — ajouté lors du rituel de fermeture.

Pattern extrait : les stories documentaires (CONTRIBUTING.md, README.md) ne se valident pas par exit code — elles nécessitent une checklist de lecture ACs. Documenté dans [LRN-026](learnings/LRN-026.md).

**Entrées clés :**

- [EVAL-020](evals/EVAL-020.md) — Story 1.3 produite, keep
- [LRN-026](learnings/LRN-026.md) — pattern story documentaire sans compilation

---

Session `/bmad-dev-story 1.3` — implémentation de la Story 1.3 : Documentation de contribution (CONTRIBUTING.md).

Session la plus courte du projet à ce jour. Livrable unique : `CONTRIBUTING.md` à la racine du repo. Le skeleton copier-coller fourni dans les Dev Notes a permis une création en une seule passe, sans diagnostic ni décision technique. Vérification manuelle des 3 ACs : tous couverts (AC1 — contrat `OutputAdapter.generate()` + placeholder `clawd.ts → Epic 3` ; AC2 — 4 commandes pnpm + schéma 3 couches + frontières modules ; AC3 — enregistrement `src/cli/index.ts` + procédure PR).

Immédiatement après la création, Baptiste a demandé de réécrire le fichier en anglais. Le fichier initial avait été rédigé en français (conformément à `document_output_language: Français`), mais `CONTRIBUTING.md` est une convention GitHub ciblant des contributeurs internationaux — l'anglais s'impose. Réécriture complète effectuée, décision formalisée en [BDR-018](decisions/BDR-018.md). Pattern capturé dans [LRN-027](learnings/LRN-027.md) pour que les stories futures (README.md en Story 4.2) démarrent directement en anglais sans aller-retour.

Aucun blocage, aucune compilation. Story → `review`, sprint-status mis à jour.

**Entrées clés :**

- [BDR-018](decisions/BDR-018.md) — GitHub community files en anglais
- [LRN-027](learnings/LRN-027.md) — pattern à appliquer dès Story 4.2 (README.md)
- [EVAL-021](evals/EVAL-021.md) — Story 1.3 implémentée, keep

---

Session `/bmad-code-review 1.3` — review de la Story 1.3 : Documentation de contribution (CONTRIBUTING.md).

La session a débuté par un diagnostic Python à la demande de Baptiste : le premier appel Bash avait échoué à cause d'un problème de quoting des chemins Windows (chemins sans guillemets interprétés comme un seul token cassé). Le deuxième appel avec guillemets a fonctionné. Diagnostic confirmé : `python` = Python 3.14.3 installé, `python3` = stub Microsoft Store — cohérent avec [LRN-005](learnings/LRN-005.md).

Trois agents parallèles lancés : Blind Hunter (12 findings bruts), Edge Case Hunter (17 findings bruts), Acceptance Auditor (AC1+AC2+AC3 tous satisfaits — 2 observations mineures sans impact). Après triage : 1 patch appliqué, 1 patch reclassifié defer, 6 defer, 19 dismissed.

**P2 appliqué** : `"The 8 states available in ClawdState"` → `"The states available in ClawdState"` — le count en dur aurait pu silencieusement devenir obsolète si un état est ajouté en v0.2+.

**P1 reclassifié en defer** : le patch demandait d'ajouter `pnpm lint` à la checklist PR de CONTRIBUTING.md. Or le script `lint` n'existe pas dans `package.json` (item 🔵 ouvert depuis Story 1.1). Appliquer l'instruction créerait une doc erronée pour les contributors. Reclassifié dans deferred-work.md, à appliquer après Story 4.x. Pattern capturé dans [LRN-028](learnings/LRN-028.md).

Les 6 défers couvrent : scope pnpm link (global vs local), comportement warnings côté CLI (Epic 3), politique semver/breaking changes, politique de dépendances tierces, template PR GitHub, contrat outputDir (Epic 2). Aucun fixable opportunistement.

Scan opportuniste de deferred-work.md : tous les items ouverts (Story 1.1 × 7, Story 1.2 × 1, Story 1.3 × 7) sont bloqués sur des stories dédiées ou des epics futures — aucune résolution immédiate possible. Story 1.3 → `done`. Sprint-status mis à jour.

**Entrées clés :**

- [LRN-028](learnings/LRN-028.md) — patch→defer si script npm inexistant
- [EVAL-022](evals/EVAL-022.md) — Story 1.3 review complète, keep

## 2026-05-07

Session `/bmad-retrospective epic-1` — première rétrospective du projet `pet-theme-converter`.

L'Epic 1 (Fondation du Projet & Architecture de Contribution) est 100% complet : 3 stories toutes en `done` (1.1 initialisation build, 1.2 types/interfaces, 1.3 CONTRIBUTING.md). La rétrospective a été conduite en party mode avec analyse complète des story records, reviews et deferred-work avant la discussion.

**Succès majeurs :** exécution sans blocage sur les 3 stories, pattern skeleton Dev Notes → zéro friction confirmé comme pratique à systématiser, détection précoce de `moduleResolution: "bundler"` avant qu'elle bloque Epic 2, 4 résolutions opportunistes pendant les reviews.

**Friction principale : graphify.** Baptiste a révélé que le mode `--update` de graphify avait consommé 100% de son budget de session Claude Code sur une session de 5h — première fois sur ce projet. La cause est structurelle : le mode `--update` passe chaque fichier modifié par le LLM pour re-labelliser les communautés. Sur un projet 100% documentaire comme pet-theme-converter à ce stade, le coût est maximal pour une valeur quasi-nulle. [BDR-017](decisions/BDR-017.md) (arrêt définitif graphify) a été confirmé sans ambiguïté — graphify ne sera pas relancé avant l'existence d'une codebase lourde et complexe (pas avant Epic 3/4 minimum).

**Learning `/find-docs` :** Baptiste a signalé que l'utilisation manuelle de `/find-docs` n'est pas adaptée — l'agent doit l'utiliser proactivement et automatiquement pour toute question de version, API ou documentation de package. Ce comportement est désormais intégré sans déclenchement manuel requis. Contexte : les faux positifs Blind Hunter (~50% sur stories de config) viennent du cutoff du modèle ; `/find-docs` (Context7) résout ce problème à la source.

**Préparation Epic 2 :** Baptiste a fourni 6 URLs de spritesheets Petdex réelles. Observation critique : formats mixtes `.webp` ET `.png` coexistent, noms de fichiers variables (`sprite.webp` vs `spritesheet.webp`). Story 2.1 devra gérer les deux formats. `sharp` est connu superficiellement, `apngasm-bin` jamais utilisé — spike recommandé avant Story 2.4.

Le document de rétrospective a été sauvegardé dans `_bmad-output/implementation-artifacts/epic-1-retro-2026-05-07.md`. Sprint-status mis à jour : `epic-1-retrospective: optional → done`. Epic 2 peut démarrer.

**Entrées clés :**

- [LRN-029](learnings/LRN-029.md) — Graphify `--update` = saturation 100% session budget sur corpus docs
- [LRN-030](learnings/LRN-030.md) — Spritesheets Petdex : formats mixtes + noms variables
- [EVAL-023](evals/EVAL-023.md) — Rétrospective Epic 1 produite, keep

---

Session `/pr-description-writer` — génération de la PR description pour merger `epic-1` dans `development`.

Session courte et sans friction. Unique opération : exécution du skill `pr-description-writer` avec les arguments `development epic-1`. Les données ont été collectées via trois commandes git (`git log`, `git diff --stat`, `git diff` sur les fichiers source uniquement). L'analyse des 11 commits a permis de classer les changements en 4 thèmes : architecture/config (initialisation TypeScript, tsup, package.json), interface publique Core (src/types.ts, state-mapping.ts), CLI entry point, et cleanup (suppression graphify-out/). La description bilingue FR/EN produite couvre les métriques exactes vérifiées sur git (11 commits, 129 fichiers, +6 370 / −6 526 lignes). Aucune décision ni learning nouveau — opération purement mécanique.

**Entrées clés :**

- [EVAL-024](evals/EVAL-024.md) — PR description `epic-1 → development`, keep

---

Session `/bmad-create-story 2.1` — création de la Story 2.1 : Téléchargement et validation de la spritesheet.

Première story de l'Epic 2. La session a été fluide et sans blocage. L'analyse de contexte a couvert les 5 registres mémoire, le sprint-status, l'epics.md, l'architecture, les fichiers source existants (`src/types.ts`, `src/core/state-mapping.ts`, `src/core/fetch-spritesheet.ts` stub, `package.json`, `tsconfig.json`, `src/cli/index.ts`) et le deferred-work.

La story produite couvre 6 ACs BDD (URL .webp/.png, timeout AbortController, Content-Type non-image, chemin local existant/inexistant, `onProgress` optionnel) et inclut un skeleton copier-coller complet de `src/core/fetch-spritesheet.ts` utilisant le `fetch()` natif Node 18+ — aucune dépendance HTTP à ajouter. Un pattern subtil a été détecté à la conception : sans vérification `response.ok` avant le check Content-Type, une URL 404 retournant `text/html` déclencherait une `ValidationError` au lieu de la `FetchError` attendue. Le skeleton corrige ce cas dès le départ ([LRN-031](learnings/LRN-031.md)).

Les 6 URLs de test Petdex de la rétrospective Epic 1 ([LRN-030](learnings/LRN-030.md)) sont référencées dans les Dev Notes pour la validation manuelle. Sprint-status mis à jour : `epic-2` → `in-progress`, story 2.1 → `ready-for-dev`.

**Entrées clés :**

- [EVAL-025](evals/EVAL-025.md) — Story 2.1 produite, keep
- [LRN-031](learnings/LRN-031.md) — séquence `response.ok` → Content-Type pour typer FetchError vs ValidationError

---

Session `/bmad-dev-story 2.1` — implémentation de la Story 2.1 : Téléchargement et validation de la spritesheet.

Le stub `export {};` de `src/core/fetch-spritesheet.ts` a été remplacé par l'implémentation complète (82 lignes) en suivant exactement le skeleton copier-coller du Dev Notes — zéro friction, pattern [LRN-024](learnings/LRN-024.md) confirmé une deuxième fois. L'implémentation couvre la détection URL vs chemin local (`new URL()`), le téléchargement via `fetch()` natif Node 18+ avec `AbortController` (timeout 30s), la séquence correcte `response.ok` → Content-Type ([LRN-031](learnings/LRN-031.md)), la lecture locale via `node:fs/promises`, et le callback `onProgress` optionnel.

`pnpm build` → exit 0, `dist/index.js` 207 B. `pnpm typecheck` → exit 0. Frontières architecturales respectées (aucun import `@clack/prompts`, `src/cli/`, `src/adapters/`).

**Lacune de test signalée par Baptiste :** pour valider AC4 ("chemin local → Buffer"), j'avais utilisé `./package.json` — un fichier JSON, pas une image. Baptiste a signalé que ce n'était pas représentatif. J'ai téléchargé une vraie spritesheet `.webp` (1,3 Mo via `curl`) et retesté. Les 14 cas passent, dont les 6 spritesheets Petdex réelles de la rétrospective Epic 1 (`.webp` + `.png` + nom de fichier variable). Pattern capturé dans [LRN-032](learnings/LRN-032.md).

Story 2.1 → `review`. Sprint-status mis à jour.

**Entrées clés :**

- [EVAL-026](evals/EVAL-026.md) — Story 2.1 implémentée, keep
- [LRN-032](learnings/LRN-032.md) — tests AC "fichier local image" : toujours utiliser un vrai fichier du type attendu

---

Session `/bmad-code-review 2.1` — review de la Story 2.1 : Téléchargement et validation de la spritesheet.

Workflow exécuté en intégralité. Trois agents parallèles lancés : Blind Hunter (13 findings bruts), Edge Case Hunter (14 findings bruts), Acceptance Auditor (6 ACs tous satisfaits, 3 observations mineures). Après déduplication et triage : 3 patch, 8 defer, 11 dismissed.

**Patches appliqués immédiatement :**

- **P1** — `contentType.toLowerCase().startsWith("image/")` : les headers HTTP sont case-insensitive par RFC 7231 ; un serveur non-conforme peut retourner `"Image/PNG"` déclenchant un faux `ValidationError`. Fix trivial, zéro trade-off.
- **P2** — `export interface FetchOptions` : l'interface apparaissait dans la signature publique de `fetchSpritesheet` sans être exportée — les consumers externes ne pouvaient pas la référencer.
- **P3** — `catch (err) { throw new FetchError(\`...: ${err.message}\`) }`dans`fetchFromLocal`: le catch générique masquait`EACCES`, `EISDIR` derrière "Fichier introuvable" — message activement trompeur.

`pnpm build` → exit 0, `pnpm typecheck` → exit 0 après les 3 patches. Story 2.1 → `done`. Sprint-status mis à jour. Opportunité détectée en passant : epic-1 était encore `in-progress` malgré toutes les stories + rétrospective à `done` — corrigé en `done`.

Les 8 defers sont tous scopés Stories 3.x (validation CLI layer, messages d'erreur, protocoles non-HTTP, timeout négatif) ou épics futurs (limit taille, Content-Type allowlist). Aucun résolvable opportunistement.

**Entrées clés :**

- [EVAL-027](evals/EVAL-027.md) — Story 2.1 review complète, keep
- [LRN-033](learnings/LRN-033.md) — HTTP Content-Type headers case-insensitive
- [LRN-034](learnings/LRN-034.md) — catch {} filesystem → propager err.message

---

Session `/bmad-create-story 2.2` — création de la Story 2.2 : Détection de la grille et STATE_MAPPING.

Session courte et précise. L'analyse de contexte a couvert les 5 registres mémoire, le sprint-status, l'epics.md, l'architecture, les fichiers source existants (`src/types.ts`, `src/core/state-mapping.ts`, `src/core/detect-grid.ts` stub, `src/core/fetch-spritesheet.ts` implémenté en Story 2.1) et le deferred-work.

La story produite couvre 3 ACs BDD et inclut deux décisions de conception structurantes. Première décision : `GridInfo` est exporté depuis `detect-grid.ts` et non depuis `src/types.ts` — les types intermédiaires du pipeline Core restent dans leur module source, `types.ts` étant réservé à l'API publique des adapters ([BDR-019](decisions/BDR-019.md)). Deuxième décision : correction du placeholder `frames: 9` → `frames: 8` dans `STATE_MAPPING`, justifiée mathématiquement (1536px ÷ 8 colonnes = 192px → 8 colonnes = 8 frames par état). Ce bug de placeholder documenté depuis la review Story 1.2 est résolu dans cette story avant que `sliceFrames` (Story 2.3) ne le consomme — évite une découpe hors-bornes silencieuse ([LRN-035](learnings/LRN-035.md)).

En post-création, Baptiste a demandé d'enrichir le protocole de test avec des fichiers locaux (1 `.webp` + 1 `.png` téléchargés via `curl`) en complément des 6 URLs de la rétrospective Epic 1. Pattern formalisé : toute story Core I/O doit couvrir URL ET chemin local dans ses Dev Notes de validation ([LRN-036](learnings/LRN-036.md)). Sprint-status mis à jour : story 2.2 → `ready-for-dev`.

**Entrées clés :**

- [BDR-019](decisions/BDR-019.md) — Types intermédiaires Core dans leur module source, pas `types.ts`
- [LRN-035](learnings/LRN-035.md) — Grille Petdex : 8 colonnes = 8 frames (correction `frames: 9` → `8`)
- [EVAL-028](evals/EVAL-028.md) — Story 2.2 produite, keep

---

Session `/bmad-dev-story 2.2` — implémentation de la Story 2.2 : Détection de la grille et STATE_MAPPING.

Session courte et sans blocage. Deux fichiers modifiés : `src/core/detect-grid.ts` (stub `export {};` → implémentation complète, 57 lignes — interface `GridInfo` exportée depuis ce fichier conformément à [BDR-019](decisions/BDR-019.md), `sharp(buffer).metadata()`, calcul `cellWidth`/`cellHeight` via `Math.round`, spread conditionnel `expectedWidth`/`expectedHeight` uniquement si `isStandard: false`) et `src/core/state-mapping.ts` (correction `frames: 9` → `frames: 8` sur les 8 états — [LRN-035](learnings/LRN-035.md)).

Le skeleton copier-coller des Dev Notes a permis une implémentation en une seule passe — pattern [LRN-024](learnings/LRN-024.md) confirmé une troisième fois sur ce projet. `pnpm build` et `pnpm typecheck` : exit 0. Validation manuelle via script temporaire `test-2-2.mjs` (node --import tsx/esm) : 32/32 assertions réussies — AC1 × 4 scénarios (URL .webp, URL .png, local .webp, local .png), AC2 (PNG factice 1520×1854 → `isStandard: false, expectedWidth: 192, expectedHeight: 208`, aucune exception), AC3 (STATE_MAPPING — 8 états, tous `frames: 8`). Les fichiers temporaires (`test-2-2.mjs`, `test-sprite.webp`, `test-sprite.png`) ont été supprimés après validation.

En fin de session, Baptiste a demandé si les tests avaient bien été exécutés — il n'avait pas vu la création et la suppression du script temporaire. La séquence était bien passée mais trop rapide pour être visible. Pattern capturé dans [LRN-037](learnings/LRN-037.md) : annoncer explicitement chaque phase (création, exécution, résultats, suppression) comme étapes distinctes.

Story 2.2 → `review`. Sprint-status mis à jour.

**Entrées clés :**

- [LRN-037](learnings/LRN-037.md) — visibilité des phases de validation temporaire
- [EVAL-029](evals/EVAL-029.md) — Story 2.2 implémentée, keep

---

Session `/bmad-code-review 2.2` — review complète de la Story 2.2 : Détection de la grille et STATE_MAPPING.

Workflow exécuté en intégralité. Trois agents parallèles lancés : Blind Hunter (11 findings bruts), Edge Case Hunter (5 findings JSON), Acceptance Auditor (0 violations — tous ACs et contraintes architecturales satisfaits). Triage : 3 patches, 5 defers, 7 dismissed.

**Patches appliqués :** (P1) commentaires inline sur les champs `isStandard`, `expectedWidth`, `expectedHeight` de `GridInfo` ; (P2) commentaire sur `STANDARD_ROWS = 9` expliquant que 9 lignes existent dans la spritesheet Petdex mais seulement 8 sont utilisées par Clawd (row 8 ignoré) ; (P3) commentaire sur `frames: 8` dans `state-mapping.ts` rappelant que 8 colonnes = 8 frames/état.

**Résolution opportuniste :** D1 (buffer vide → message générique) reclassifié de defer vers fix immédiat sur instruction de Baptiste ("Fix les patch et defers"). Guard `buffer.length === 0` ajouté en tête de `detectGrid` (2 lignes). Pattern extrait dans [LRN-038](learnings/LRN-038.md) : quand l'utilisateur demande de fixer les defers, scanner ceux qui sont trivials (< 5 lignes, pas de story dédiée) et les appliquer immédiatement.

**deferred-work.md :** item Story 1.2 (`STATE_MAPPING placeholder frames: 9`) marqué ✅ (résolu par implémentation Story 2.2), D1 Story 2.2 marqué ✅ (buffer guard appliqué). Les 4 defers restants (D2→Story 2.3, D3→Story 3.3, D4→architectural, D5→Story 2.3/tests) conservés 🔵.

`pnpm build` et `pnpm typecheck` → exit 0 après patches. Story 2.2 → `done`. sprint-status mis à jour.

**Entrées clés :**

- [LRN-038](learnings/LRN-038.md) — "Fix les defers" : scanner les trivials applicables immédiatement
- [EVAL-030](evals/EVAL-030.md) — Story 2.2 review complète, story → done

---

Session `/bmad-create-story 2.3` — création de la Story 2.3 : Découpe des frames par état.

Session courte et sans blocage. Rituel de démarrage complet exécuté (5 registres mémoire + sprint-status + epics.md + architecture + story 2.2 + fichiers source existants + deferred-work.md).

La story produite couvre 3 ACs BDD et inclut un skeleton `sliceFrames` copier-coller complet. Deux décisions de conception structurantes documentées dans la story. Première : `.png()` systématique en sortie de `sharp.extract()` — les frames doivent être en format PNG pour `apngasm-bin` (Story 2.4), quelle que soit la source spritesheet (`.webp` ou `.png`). Ce contrat inter-story est capturé dans [LRN-039](learnings/LRN-039.md). Deuxième : le deferred item D2 de Story 2.2 (Math.round masking) est traité partiellement — error wrapping sharp → `ValidationError` avec identification de l'état et du numéro de frame, sans clampage des bornes (clampage déféré post-v0.1 car il nécessiterait d'ajouter `totalWidth`/`totalHeight` dans `GridInfo`).

Le script de validation `test-2-3.mjs` couvre 4 scénarios (2 URLs distantes + 2 fichiers locaux, conformément à [LRN-036](learnings/LRN-036.md)) et vérifie les magic bytes PNG de chaque frame extraite. Sprint-status mis à jour : story 2.3 → `ready-for-dev`.

**Entrées clés :**

- [LRN-039](learnings/LRN-039.md) — `.png()` systématique dans sliceFrames pour apngasm-bin
- [EVAL-031](evals/EVAL-031.md) — Story 2.3 produite, keep

---

Session `/bmad-dev-story 2.3` — implémentation de la Story 2.3 : Découpe des frames par état.

Session courte et sans blocage — la plus propre depuis Story 2.2. Le stub `export {};` de `src/core/slice-frames.ts` a été remplacé par l'implémentation complète (52 lignes) en une seule passe depuis le skeleton Dev Notes. Aucune décision technique, aucun diagnostic, aucun changement de direction — pattern [LRN-024](learnings/LRN-024.md) confirmé pour la 4ème fois sur ce projet.

L'implémentation couvre : guard buffer vide en tête (cohérent avec `detectGrid`), itération `Object.entries(STATE_MAPPING)` avec cast `[ClawdState, ...][]`, calcul des coordonnées depuis `GridInfo` (pas de valeur hardcodée), `.png()` systématique après `.extract()` conformément au contrat [LRN-039](learnings/LRN-039.md), re-lancement des `ValidationError` avant wrapping pour éviter la double-encapsulation, et `onProgress` invoqué avant la découpe de chaque état.

Validation en 4 phases annoncées séparément (LRN-037) : (1) téléchargement des fichiers de test `test-sprite.webp` + `test-sprite.png` ; (2) création de `test-2-3.mjs` ; (3) exécution → **548/548 assertions réussies** sur 4 scénarios (URL `.webp`, URL `.png`, fichier local `.webp`, fichier local `.png`) ; (4) suppression des 3 fichiers temporaires. Frontières architecturales vérifiées par grep : aucun import `cli/`, `adapters/`, `@clack/prompts`.

`pnpm build` → exit 0, `dist/index.js` 207 B. `pnpm typecheck` → exit 0. Story 2.3 → `review`. Sprint-status mis à jour.

**Entrées clés :**

- [EVAL-032](evals/EVAL-032.md) — Story 2.3 implémentée, keep

---

Session `/bmad-code-review 2.3` — review complète de la Story 2.3 : Découpe des frames par état.

Workflow exécuté en intégralité. Trois agents parallèles lancés : Blind Hunter (12 findings bruts), Edge Case Hunter (12 findings bruts dont 2 faux positifs liés à des erreurs dans le prompt d'agent — ECH-1 doublon `const result` et ECH-12 désync STATE_MAPPING inexistante), Acceptance Auditor (0 violation — AC1/AC2/AC3 tous satisfaits).

Triage initial : 1 patch (P1 JSDoc sur `sliceFrames`), 5 defers, 14 dismissed.

**Corrections appliquées :**

P1 — JSDoc complète sur `sliceFrames` (pattern [LRN-025](learnings/LRN-025.md)).

D1 + D3 résolus simultanément : `sharpBase = sharp(buffer)` créé une seule fois hors des boucles, `sharpBase.clone()` par frame dans un `Promise.all(Array.from({length: frames}, ...))`. Pattern documenté dans [LRN-041](learnings/LRN-041.md).

D5 résolu : ratio `stateIndex / stateEntries.length` passé comme second argument à `onProgress` — `ProgressCallback` utilisé dans sa forme complète.

D4 — initialement classé "defer — design decision" (messages d'erreur en français, décision de localisation non tranchée). Baptiste a signalé l'erreur de classification : il n'y a pas d'ambiguïté, l'anglais est la convention universelle pour une lib npm publique. D4 appliqué immédiatement sur les 3 modules Core (`fetch-spritesheet.ts` 7 strings, `detect-grid.ts` 3 strings, `slice-frames.ts` 3 strings). Build ✅ typecheck ✅. Pattern capturé dans [LRN-040](learnings/LRN-040.md), décision formalisée en [BDR-020](decisions/BDR-020.md).

D2 (bornes extraction non pré-vérifiées) conservé ouvert — nécessite d'ajouter `totalWidth`/`totalHeight` dans l'interface `GridInfo`, changement multi-fichiers déféré post-v0.1.

Scan opportuniste `deferred-work.md` : D2 de Story 2.2 (Math.round masking) marqué ✅ traitement partiel. Aucun autre item résolvable — tous bloqués Epic 3/4.

Story 2.3 → `done`. Sprint-status mis à jour.

**Entrées clés :**

- [BDR-020](decisions/BDR-020.md) — Messages d'erreur Core en anglais
- [LRN-040](learnings/LRN-040.md) — Convention universelle = patch non-ambigu
- [LRN-041](learnings/LRN-041.md) — Pattern sharp clone + Promise.all frame-level
- [LRN-042](learnings/LRN-042.md) — Faux positifs agents liés aux prompts
- [EVAL-033](evals/EVAL-033.md) — Review Story 2.3 complète, keep

---

Session `/bmad-create-story 2.4` — création de la Story 2.4 : Encodage des APNGs par état.

Avant de rédiger la story, une recherche préliminaire sur `apngasm-bin` a été conduite via un agent Explore. Découverte critique : le package n'exporte pas une fonction mais une **string** — le chemin vers l'exécutable natif (APNG Assembler v2.91). L'implémentation nécessite donc un workflow fichiers temporaires complet : `mkdtemp` → `writeFile` (frames PNG sur disque) → `execFileAsync(apngasm, [...args])` → `readFile` (APNG produit) → `rm` dans `finally`. Sur Windows, `execFile` n'utilisant pas de shell, les globs (`frame_*.png`) ne sont pas expandus — les chemins de frames doivent être passés individuellement. Ce pattern est documenté dans [LRN-043](learnings/LRN-043.md) et intégralement retranscrit dans le skeleton copier-coller de la story.

La story produite couvre 4 ACs BDD (APNGs valides magic bytes + acTL, ValidationError par état, onProgress optionnel, NFR1 < 60s pipeline complet), le skeleton `encodeAPNGs` complet avec tous les imports `node:` built-ins, 9 règles anti-erreurs (dont la gestion des types TypeScript manquants pour `apngasm-bin`), et un script de validation `test-2-4.mjs` sur 4 scénarios (2 URLs + 2 fichiers locaux). Une typo d'URL (`9e3ra462` au lieu de `9e3fa462`) a été détectée et corrigée avant finalisation.

En fin de session, Baptiste a signalé que les stories n'étaient pas triées dans le dossier `stories/`. Audit de la structure : seule la story 1.1 était correctement placée dans `stories/epic-1-*/` — les stories 1.2, 1.3, 2.1→2.4 étaient toutes à la racine de `implementation-artifacts/`. Correction appliquée : création de `stories/epic-2-pipeline-de-conversion-core/`, déplacement de toutes les stories dans leur sous-dossier d'epic respectif. Baptiste a ensuite demandé un dossier `retrospectives/` — créé et `epic-1-retro-2026-05-07.md` déplacé dedans. La structure finale est propre : `stories/`, `retrospectives/`, `reviews/` tous organisés par epic. Décision formalisée en [BDR-021](decisions/BDR-021.md).

**Entrées clés :**

- [LRN-043](learnings/LRN-043.md) — `apngasm-bin` = chemin binaire string, workflow temp files obligatoire
- [BDR-021](decisions/BDR-021.md) — Organisation `stories/epic-X/` + `retrospectives/` dans impl-artifacts
- [EVAL-034](evals/EVAL-034.md) — Story 2.4 créée, keep

---

Session `/bmad-dev-story 2.4` — implémentation de la Story 2.4 : Encodage des APNGs par état.

Session courte mais avec deux blocages techniques inédits résolus rapidement. Le stub `export {};` de `src/core/encode-apngs.ts` a été remplacé par l'implémentation complète (84 lignes) en une seule passe depuis le skeleton Dev Notes — pattern [LRN-024](learnings/LRN-024.md) confirmé une 5ème fois.

**Blocage 1 — TypeScript TS2666** : le bloc `declare module "apngasm-bin"` placé inline dans `encode-apngs.ts` (qui a des imports) était traité comme une augmentation de module et non une déclaration ambiante. Erreurs : TS2666 (exports interdits en augmentation), TS2300 (duplicate identifier), TS2693 (type utilisé comme valeur). Fix : création de `src/apngasm-bin.d.ts` sans aucun import (contexte script → déclaration ambiante valide). Pattern capturé dans [LRN-045](learnings/LRN-045.md).

**Blocage 2 — ENOENT au runtime** : `execFileAsync(apngasm, [...])` levait `ENOENT` malgré que `import apngasm from "apngasm-bin"` retournait un chemin. Cause : le script postinstall de `apngasm-bin` (`node lib/install.js`) n'avait pas été exécuté par pnpm (scripts bloqués). Ce script utilise `BinWrapper.run()` pour déployer le binaire de `vendor/win/x64/apngasm.exe` vers `vendor/apngasm.exe` (chemin attendu par `BinWrapper.path()`). Fix : exécution manuelle de `node lib/install.js` dans le dossier du package. Pattern capturé dans [LRN-044](learnings/LRN-044.md).

Validation en 3 phases annoncées ([LRN-037](learnings/LRN-037.md)) : (1) téléchargement `test-sprite.webp` + `test-sprite.png` + création `test-2-4.mjs` ; (2) exécution → **75/75 assertions réussies** sur 4 scénarios (URL .webp, URL .png, fichier local .webp, fichier local .png) — NFR1 : 20–35s < 60s ; (3) suppression des 3 fichiers temporaires. Frontières architecturales vérifiées par grep : 0 import `cli/`, `adapters/`, `@clack/prompts`.

`pnpm build` → exit 0 ✅ `pnpm typecheck` → exit 0 ✅ Story 2.4 → `review`. Sprint-status mis à jour.

**Entrées clés :**

- [LRN-044](learnings/LRN-044.md) — `apngasm-bin` postinstall bloqué par pnpm → `node lib/install.js` manuel
- [LRN-045](learnings/LRN-045.md) — `declare module` inline = augmentation (TS2666) → `.d.ts` séparé requis
- [EVAL-035](evals/EVAL-035.md) — Story 2.4 implémentée, keep

---

Post-implémentation Story 2.4 : découverte bug blank frame + correction STATE_MAPPING + validation sima.

Après la story, Baptiste a inspecté les APNGs générés et signalé une frame vide dans les animations. Un script `inspect-apng.mjs` a permis de lire les chunks PNG bruts : `acTL num_frames=7` au lieu de 8, et une frame `1×1 at (0,0) delay=2/10s` en fin de séquence — signe classique d'une optimisation delta apngasm sur des frames identiques. Cause racine : `STATE_MAPPING` avait `frames: 8` pour tous les états, mais les spritesheets Petdex ont des counts non uniformes. Baptiste a compté manuellement ligne par ligne et fourni les vraies valeurs : 6/8/8/4/5/8/6/6/6.

Baptiste a également fourni le mapping complet des événements Codex avec les noms officiels des 9 états (idle, run right, run left, waving, jumping, failed, waiting, running, review) et sa correspondance avec les 8 états Clawd on Desk. Points structurants : (1) les lignes 2 et 3 (run right/left) restent non mappées — potentiellement utilisables pour des événements DnD d'avatar dans de futures versions de Clawd on Desk ; (2) `notification` et `waking` partagent la même animation Codex (waving, row 3 → row index 3, 4 frames). Aucun état Clawd oublié — tous les 8 sont couverts.

`src/core/state-mapping.ts` corrigé avec les rows et frames exacts pour chaque état. Commentaire inline référençant [BDR-022](decisions/BDR-022.md) ajouté. Build ✅ typecheck ✅. Validation finale sur sima (`sprite.webp`) : 8 APNGs générés, animations fluides, frame 1×1 fantôme disparue (`acTL num_frames=6` pour idle). Fichiers temporaires purgés.

**Entrées clés :**

- [BDR-022](decisions/BDR-022.md) — mapping Codex→Clawd validé terrain, source de vérité STATE_MAPPING
- [LRN-046](learnings/LRN-046.md) — frame counts non uniformes → blank frame si on découpe toujours 8 colonnes
- [LRN-047](learnings/LRN-047.md) — apngasm delta 1×1 fantôme sur frames identiques/vides
- [EVAL-036](evals/EVAL-036.md) — correction STATE_MAPPING + validation sima, keep

---

Session `/bmad-code-review 2.4` — review de la Story 2.4 : Encodage des APNGs par état.

Trois agents parallèles lancés sur le diff Story 2.4 (`encode-apngs.ts` +76/-1, `state-mapping.ts` +20/-10, `apngasm-bin.d.ts` nouveau fichier). Triage : 3 patches, 6 defers, 12 dismissed.

**P1 — TDZ dans `finally`** (Blind Hunter + Edge Case Hunter) : `const tempDir = await mkdtemp(...)` était déclaré hors du bloc `try`. Si `mkdtemp` throw (ENOSPC, EACCES), le binding `const` est en Temporal Dead Zone — le `finally` tente `rm(tempDir)` sur une variable non initialisée → `ReferenceError` masquant l'erreur originale. Fix : `let tempDir: string | undefined` avant le `try`, `if (tempDir)` guard dans `finally`. Pattern capturé dans [LRN-048](learnings/LRN-048.md).

**P2 — `onProgress` jamais à 1.0** (Blind Hunter + Acceptance Auditor) : l'appel `onProgress?.(..., stateIndex / total)` avant chaque encodage émet de 0/8 à 7/8 — la `ProgressCallback` est documentée `@param progress 0–1`. Fix : appel déplacé après le bloc `try/finally` avec ratio `(stateIndex + 1) / total`. Pattern capturé dans [LRN-049](learnings/LRN-049.md).

**P3 — JSDoc manquante** dans `apngasm-bin.d.ts` : commentaire ajouté pour préciser que la `string` exportée est le chemin absolu vers le binaire natif (`execFile`, jamais appel direct).

**Fixes opportunistes :** D6 Story 1.3 résolu (JSDoc `AdapterInput.outputDir` — contrat Core vs adapter dans `types.ts`) ; D5 Story 2.2 clôturé comme obsolète (frames sont désormais des valeurs empiriques BDR-022, plus dérivées de `STANDARD_COLS`) ; commentaire erroné `detect-grid.ts` ligne 15 corrigé (disait "row 8 ignorée" alors que `thinking` mappe sur row 8 depuis BDR-022) ; D1 Story 2.1 marqué traitement partiel.

Build ✅ typecheck ✅ après tous les patches. Story 2.4 → `done`. Sprint-status mis à jour. Epic 2 entièrement terminée — toutes les 4 stories à `done`.

**Entrées clés :**

- [LRN-048](learnings/LRN-048.md) — TDZ dans finally : `let v: T | undefined` + `if (v)` guard
- [LRN-049](learnings/LRN-049.md) — onProgress : appel après opération, ratio `(i+1)/total`
- [EVAL-037](evals/EVAL-037.md) — review Story 2.4, keep

---

Session `/bmad-retrospective epic-2` — rétrospective du Pipeline de Conversion Core.

L'Epic 2 est 100% complet : 4 stories toutes en `done` (2.1 fetchSpritesheet, 2.2 detectGrid + STATE_MAPPING, 2.3 sliceFrames, 2.4 encodeAPNGs). La rétrospective a été conduite en party mode avec analyse complète des 4 story files, 4 review files, deferred-work.md et retro Epic 1 avant la discussion.

**Succès majeurs :** 5/5 engagements Epic 1 honorés (premier epic où le taux est parfait), pattern skeleton Dev Notes × 5 confirmé, 44% des defers résolus opportunistement (12/27), 623 assertions passées sur 2 stories, protocole test vrais fichiers intégré en pratique permanente.

**Point structurant de la session — validation visuelle obligatoire :** Baptiste a verbalisé explicitement que sans son inspection visuelle des APNGs générés après Story 2.4, des animations fausses auraient été livrées en Epic 3. Les 75 tests automatisés (magic bytes + chunk acTL) validaient la structure des fichiers mais pas le contenu animé. La cause : frame counts Petdex non uniformes par état (6/8/8/4/5/8/6/6/6) — des données empiriques non documentables dans les specs, accessibles uniquement en regardant les vrais fichiers. Ce pattern a été formalisé en [LRN-050](learnings/LRN-050.md) et en action item A1 (AC explicite de validation visuelle dans toute story produisant des artefacts empiriques).

**Autres difficultés documentées :** BLK-011 (apngasm-bin postinstall pnpm) avec implication CI pour Story 4.1 ; BLK-010 (TS2666 declare module inline) ; mauvaise classification D4 review 2.3 (messages FR → recadrée par Baptiste → BDR-020).

Sprint-status mis à jour : `epic-2` → `done`, `epic-2-retrospective` → `done`. Rétrospective sauvegardée dans `retrospectives/epic-2-retro-2026-05-07.md`. Epic 3 peut démarrer.

**Entrées clés :**

- [LRN-050](learnings/LRN-050.md) — tests bytes/chunks APNG ≠ validation visuelle des animations
- [EVAL-038](evals/EVAL-038.md) — Rétrospective Epic 2 produite, keep

---

Session `/pr-description-writer` — génération de la PR description pour merger `epic-2` dans `development`.

Session courte et sans friction. Unique opération : exécution du skill `pr-description-writer` avec les arguments `development epic-2`. Les données ont été collectées via trois commandes git (`git log`, `git diff --stat`, `git diff -- src/`). Le diff brut `--stat` retournait 66 fichiers — 59 hors-code (`.claude/memory/`, stories BMAD, reviews, retrospectives). La restriction `-- src/` a isolé les 7 fichiers source réels. L'analyse des 6 commits a permis de classer les changements en 4 fonctions Core (fetchSpritesheet, detectGrid + state-mapping, sliceFrames, encodeAPNGs). La description bilingue FR/EN produite couvre les métriques exactes vérifiées sur git (6 commits, 7 fichiers source, 321 insertions). Pattern de scoping `-- src/` capturé dans [LRN-051](learnings/LRN-051.md).

**Entrées clés :**

- [LRN-051](learnings/LRN-051.md) — Scope `-- src/` pour PR descriptions sur branches mixtes
- [EVAL-039](evals/EVAL-039.md) — PR description `epic-2 → development`, keep

---

Session `/bmad-create-story 3.1` — création de la Story 3.1 : Génération du thème et packaging ZIP.

Session courte et sans friction. Première story de l'Epic 3. Le rituel de démarrage a couvert les 5 registres mémoire, le sprint-status, l'epics.md, l'architecture, le deferred-work, la story 2.4 (story précédente) et les fichiers source existants (`src/types.ts`, `src/adapters/clawd.ts` stub, `package.json`, `tsconfig.json`).

La story produite couvre 4 ACs BDD et inclut le skeleton copier-coller complet de `generateZip` — la seule fonction à implémenter dans cette story (périmètre ZIP uniquement, mode 'install' et `detectClawd()` déférés à Story 3.2). Points structurants du skeleton : alias `resolvePath` pour éviter la collision avec le paramètre `resolve` de la Promise, événement `output.on('close')` plutôt que `'finish'` pour garantir le flush disque, cast `buffer as Buffer` pour `Object.entries(apngs)`. `archiver@7` et `@types/archiver` sont déjà dans les dépendances — aucune installation requise.

Deux échanges post-création : (1) Baptiste a demandé si le ZIP de Story 3.1 suffisait pour une validation alpha dans Clawd on Desk — réponse oui, extraction `Expand-Archive` dans `%LOCALAPPDATA%\Clawd on Desk\themes\` fonctionne directement ; Story 3.2 n'est que l'automatisation de ce geste. Pattern capturé dans [LRN-052](learnings/LRN-052.md). (2) Baptiste a demandé si on devait ajouter une commande npm permanente ou rester avec les scripts temporaires — réponse : scripts temporaires pour 3.1/3.2 (CLI pas encore prêt), `pnpm dev` à partir de Story 3.3, infrastructure de test permanente en Epic 4.

Sprint-status mis à jour : `epic-3` → `in-progress`, story 3.1 → `ready-for-dev`.

**Entrées clés :**

- [LRN-052](learnings/LRN-052.md) — Alpha validation manuelle dès Story 3.1 via extraction ZIP
- [EVAL-040](evals/EVAL-040.md) — Story 3.1 produite, keep
