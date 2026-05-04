---
stepsCompleted:
  [
    "step-01-init",
    "step-02-discovery",
    "step-02b-vision",
    "step-02c-executive-summary",
    "step-03-success",
    "step-04-journeys",
    "step-05-domain",
    "step-06-innovation",
    "step-07-project-type",
    "step-08-scoping",
    "step-09-functional",
    "step-10-nonfunctional",
    "step-11-polish",
  ]
releaseMode: phased
inputDocuments:
  - "_bmad-output/planning-artifacts/product-brief.md"
  - "docs/pet-theme-converter-RFC.md"
workflowType: "prd"
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 1
classification:
  projectType: cli_tool
  architecture: "Core + Adapters (internal, OutputAdapter documented in repo)"
  domain: "general + ecosystem format constraints + license responsibility"
  complexity: medium
  projectContext: greenfield_constrained
prdNotes:
  - "Warning non-bloquant si spritesheet hors-standard (seuil ±px à définir) — option Install direct désactivée si Clawd non détecté"
  - "Validation Content-Type avant traitement sharp + timeout fetch + messages d'erreur explicites"
  - "Matrice OS/Node pour binaires natifs + stratégie packaging + CI multi-OS"
  - "Détection Clawd : liste chemins par OS + saisie manuelle optionnelle"
  - "Champ compatibleWith dans theme.json + message CLI de version cible"
  - "Interface OutputAdapter documentée dans repo + CONTRIBUTING.md — livrables v0.1"
  - "Disclaimer licence dans CLI + README"
  - "Roadmap : CLI non-interactif (v2+), --provider (v futur), batch (v futur), web app (surface complémentaire future)"
---

# Product Requirements Document - pet-theme-converter

**Author:** Baptiste
**Date:** 2026-05-04

## Executive Summary

`pet-theme-converter` est un CLI npm interactif qui construit le premier pont entre les 190+ pets pixel-art de Petdex (écosystème Codex Desktop d'OpenAI) et les applications desktop pet pour Claude Code. En une commande `npx pet-theme-converter`, un développeur convertit une spritesheet `.webp` au format Codex vers un thème APNG installable directement dans Clawd on Desk — ce qui prenait plusieurs heures de découpe manuelle dans Photoshop devient interactif en 30 secondes.

**Utilisateurs cibles :**

- **Primaire** — Développeur utilisant Claude Code + Clawd on Desk, qui a repéré un pet sur Petdex et veut le réutiliser sans friction dans son environnement de travail.
- **Secondaire** — Créateur de pets Petdex souhaitant étendre la portée de ses créations à l'écosystème Claude Code sans effort supplémentaire.

**Le problème** — Les 190+ pets de la galerie Petdex sont techniquement inaccessibles aux utilisateurs d'apps Claude Code : les deux écosystèmes utilisent des formats incompatibles (spritesheet unifiée `.webp` vs fichiers APNG distincts par état). Il n'existe aucun outil, aucun script, aucun pont.

### Ce qui le différencie

**Zéro friction** — Le CLI pose exactement 3 questions (source, nom du thème, mode de sortie), rien de plus. Aucun flag à mémoriser, aucune documentation à consulter.

**Autonomie totale** — Publié sur npm, le convertisseur fonctionne indépendamment des mainteneurs de Petdex, Clawd on Desk ou Clyde. La stratégie de distribution (npm publish + mini PRs de 2 lignes dans les READMEs) permet une adoption progressive sans friction ni dépendance tierce.

**Architecture extensible** — Le Core de conversion est découplé des Output Adapters. Ajouter le support d'une nouvelle app de compagnon revient à écrire un adapter, pas un fork. L'interface `OutputAdapter` est documentée dans le repo dès v0.1 pour faciliter les contributions communautaires.

**Format universel, pas marketplace spécifique** — Accepte toute spritesheet respectant le format Codex (grille 8×9, 192×208px), quelle que soit sa source. Les formats non-standard déclenchent un avertissement non-bloquant avec feedback explicite, jamais un rejet.

**Vision** — Devenir _le ffmpeg des compagnons pixel-art_ : l'infrastructure invisible qui permet à chaque pet de circuler librement entre tous les écosystèmes d'agents IA.

> **Classification :** CLI tool · Core + Output Adapters · Domaine général · Complexité medium (binaires natifs, frame extraction, install multi-OS) · Greenfield contraint par les specs Clawd et Petdex.

## Success Criteria

### User Success

- Un utilisateur peut convertir n'importe quel pet compatible (spritesheet `.webp` au format Codex) en thème Clawd on Desk fonctionnel **sans consulter de documentation**.
- En cas d'erreur ou de spritesheet non-standard, l'utilisateur comprend **immédiatement** ce qui s'est passé et quoi faire grâce à des messages CLI explicites.
- Le thème généré s'installe et fonctionne dans Clawd on Desk **sans manipulation manuelle supplémentaire**.
- L'option "Install direct" n'est proposée que si Clawd on Desk est détecté — l'utilisateur n'échoue jamais silencieusement.

### Business Success

| Signal                | Indicateur cible                                                                       | Horizon                   |
| --------------------- | -------------------------------------------------------------------------------------- | ------------------------- |
| Adoption initiale     | 100 downloads npm                                                                      | Semaine suivant l'annonce |
| Visibilité écosystème | PRs de doc acceptées sur ≥ 2 targets (Petdex, Clawd on Desk, Clyde)                    | M+2 après publication     |
| Qualité d'output      | 0 bug critique (APNG corrompu, crash, mauvais mapping) sur 10 pets testés manuellement | Avant publication npm     |
| Contributions         | Au moins 1 adapter communautaire initié grâce à l'interface `OutputAdapter` documentée | Vision long terme         |

### Technical Success

- Installation propre sur **Windows, macOS, Linux** avec Node.js LTS (résolution des binaires natifs `sharp` + `apngasm-bin` sans erreur sur les configs npm standard).
- Thème généré **validé manuellement** dans Clawd on Desk sur les 3 OS avant publication npm.
- Interface `OutputAdapter` suffisamment stable et documentée pour qu'un contributeur externe puisse écrire l'adapter Clyde **sans modifier le Core**.
- CI multi-OS couvre au minimum Windows et macOS avant publication.

### Measurable Outcomes

- **Définition de "bug critique"** : APNG corrompu ou illisible par Clawd, crash du CLI (exit non-zéro inattendu), mauvais mapping d'états (ex. : état `idle` généré avec les frames de `running`).
- **Validation** : 10 pets testés manuellement par Baptiste avant publication + signaux utilisateurs réels post-lancement.

## User Journeys

### Journey 1 — Théo : Happy Path (chemin nominatif)

Théo utilise Claude Code depuis 6 mois. Il a vu passer le pet "Boba" sur un thread Hacker News et il le trouve parfait — un petit personnage en pixel art qui donnerait du caractère à ses sessions de dev. Il ouvre Petdex, trouve la page de Boba, copie l'URL de la spritesheet.

Il tombe sur `pet-theme-converter` dans le README de Petdex. Une ligne : `npx pet-theme-converter`. Il lance la commande dans son terminal.

Trois questions. Il colle l'URL, tape "boba", choisit ZIP. Trente secondes plus tard, `boba-clawd-theme.zip` apparaît dans son dossier courant. Il le dézippe dans `themes/` de Clawd on Desk, redémarre l'app, sélectionne "boba" dans les paramètres. Boba apparaît dans le coin de son écran.

_"C'est exactement ce que je voulais."_ Il n'a pas eu besoin de lire la doc.

**Capabilities révélées :** fetch URL → validation Content-Type → découpe spritesheet → génération 8 APNGs → `theme.json` → packaging ZIP → message de succès.

---

### Journey 2 — Théo : Edge Case (spritesheet non-standard + Clawd non détecté)

Théo veut convertir un pet plus ancien trouvé sur un repo GitHub perso. La spritesheet a des cellules légèrement différentes (190×206px au lieu de 192×208px). Il colle l'URL et lance la conversion.

Le CLI affiche un warning : _"⚠️ Dimensions détectées : 190×206px (attendu 192×208px). Conversion continue avec les dimensions détectées — vérifiez le résultat."_ La conversion aboutit quand même.

Il choisit "Install direct". Le CLI détecte que Clawd on Desk n'est pas installé dans les chemins standards et désactive silencieusement l'option. À la place : _"Clawd on Desk non détecté sur ce système. Le thème a été généré en mode ZIP."_ Théo récupère son ZIP sans avoir vu d'erreur cryptique.

Il inspecte le résultat et constate que les APNGs ont de légers artefacts de bord. Il comprend pourquoi grâce au warning. Il décide que c'est acceptable pour ce pet.

**Capabilities révélées :** seuil de tolérance format, warning explicite avec dimensions réelles, fallback ZIP automatique, détection Clawd par chemins OS.

---

### Journey 3 — Mia : Créatrice de pet qui valide la compatibilité

Mia vient de finir son 4ème pet pour Petdex : "Oreo", un chat noir et blanc. Elle a vu que `pet-theme-converter` est mentionné dans le README de Petdex et que des utilisateurs l'utilisent pour porter ses pets sur Clawd on Desk.

Curieuse, elle teste son propre pet avec le convertisseur pour vérifier que la conversion est propre. Elle lance `npx pet-theme-converter`, colle le chemin local vers sa spritesheet, tape "oreo", choisit ZIP.

Le CLI lui affiche : _"✅ Format standard détecté : 192×208px, grille 8×9. Compatible Clawd on Desk ≤ v1.x."_ Elle voit ses 8 APNGs générés, les inspecte rapidement. Les animations sont fluides, les états bien mappés.

Elle ajoute une note dans sa page Petdex : _"Compatible pet-theme-converter ✅"_. Elle n'a rien eu à modifier, rien à comprendre des formats APNG.

**Capabilities révélées :** chemin local comme source, message de confirmation format standard, champ `compatibleWith` affiché dans le CLI, qualité des APNGs générés.

---

### Journey 4 — Sam : Contributeur qui écrit l'adapter Clyde

Sam développe sur Clyde depuis quelques semaines. Il voit que `pet-theme-converter` supporte Clawd on Desk et se demande s'il peut ajouter Clyde sans attendre Baptiste.

Il clone le repo, ouvre `CONTRIBUTING.md`. La section "Écrire un adapter" pointe vers `src/adapters/output/clawd.ts` et l'interface `OutputAdapter` dans `types.ts`. L'interface est commentée, les méthodes sont claires : `generate(frames, manifest): Promise<AdapterOutput>`.

Il implémente `clyde.ts` en 2 heures en calquant la structure de `clawd.ts`. Il teste avec 3 pets, vérifie que le format Clyde est respecté. Il ouvre une PR.

Baptiste review, merge. L'adapter Clyde est dispo sans qu'une seule ligne du Core ait été touchée.

**Capabilities révélées :** `CONTRIBUTING.md` clair, interface `OutputAdapter` commentée et stable, architecture Core/Adapter réellement découplée, tests sur l'adapter seul.

---

### Journey Requirements Summary

| Journey            | Capabilities clés requises                                                           |
| ------------------ | ------------------------------------------------------------------------------------ |
| Théo — Happy Path  | Fetch URL, validation Content-Type, découpe, génération APNG, ZIP, message succès    |
| Théo — Edge Case   | Seuil tolérance format, warning explicite, fallback ZIP automatique, détection Clawd |
| Mia — Validation   | Source locale, confirmation format standard, `compatibleWith` visible dans CLI       |
| Sam — Contributeur | `CONTRIBUTING.md`, interface `OutputAdapter` commentée, architecture découplée       |

## Domain-Specific Requirements

### Contraintes Écosystème

- **Format Clawd on Desk** — Le `theme.json` généré doit respecter la spec Clawd on Desk v1.x (structure de dossier, noms de fichiers APNG, champs obligatoires). Le champ `compatibleWith` dans le `theme.json` documente explicitement la version cible pour anticiper les changements de spec.
- **Format source Codex/Petdex** — La spritesheet d'entrée doit respecter la grille 8×9, 192×208px par cellule. Les formats non-conformes déclenchent un warning non-bloquant avec affichage des dimensions réellement détectées — jamais un rejet.
- **Sources multiples** — Le convertisseur accepte toute spritesheet respectant le format Codex, quelle que soit la marketplace source. Petdex est documenté comme source principale dans le README, pas codé en dur dans le Core.

### Sécurité & Validation des Entrées

- **Validation Content-Type** — Toute URL fournie par l'utilisateur est validée (Content-Type HTTP) avant d'être passée à `sharp`. Un Content-Type non-image déclenche un message d'erreur explicite, pas un crash.
- **Timeout réseau** — Le fetch d'une spritesheet distante est soumis à un timeout de **30 secondes** pour éviter les hangs indéfinis.
- **Chemins locaux** — Les chemins locaux sont résolus de façon sécurisée sans traversée de répertoires.

### Responsabilité Licence

- Un disclaimer est affiché dans le CLI à la fin de chaque conversion : _"Vérifiez la licence du pet avant tout usage commercial."_
- Le même disclaimer figure dans le README.
- L'outil ne vérifie pas programmatiquement les licences — c'est la responsabilité de l'utilisateur.

### Compatibilité Technique

- **Binaires natifs** (`sharp`, `apngasm-bin`) : la matrice de compatibilité OS × Node.js LTS est documentée dans le README. Le packaging npm garantit la résolution des binaires pré-compilés pour Windows, macOS et Linux.
- **Chemins d'installation Clawd** : liste des chemins standards par OS documentée dans le code de l'adapter. L'utilisateur peut surcharger le chemin manuellement si Clawd est installé dans un emplacement non-standard.

## Innovation & Novel Patterns

### Detected Innovation Areas

**Bridging deux écosystèmes incompatibles (innovation positionnelle)**
`pet-theme-converter` est le premier outil à relier les 190+ pets pixel-art de l'écosystème Codex/Petdex aux applications desktop pet pour Claude Code. Cette position n'est pas défendue par une technologie brevetée, mais par l'antériorité et la qualité d'exécution — le premier outil qui fonctionne devient le standard de facto.

**Format universel, pas marketplace-specific (innovation d'approche)**
Plutôt que de coder en dur la dépendance à Petdex, le convertisseur accepte toute spritesheet respectant le format Codex. Cela anticipe l'émergence de futures marketplaces et positionne l'outil comme infrastructure générique plutôt que pont ponctuel.

**Pattern Core + Adapters comme standard de portabilité (innovation architecturale)**
L'architecture découplée Core/OutputAdapters établit un pattern reproductible : chaque nouvelle app de compagnon IA ne nécessite qu'un adapter, pas un fork. C'est une contribution architecturale à l'écosystème, pas seulement un outil.

### Market Context & Competitive Landscape

- Aucun outil équivalent n'existe à date (2026-05-04) dans l'écosystème Claude Code / Codex.
- Les solutions alternatives (découpe manuelle Photoshop/GIMP) sont des workarounds, pas des concurrents.
- La fenêtre d'opportunité est ouverte : l'écosystème des desktop pets IA est en formation, pas encore structuré.

### Validation Approach

- **Validation technique** : 10 pets convertis manuellement, APNGs vérifiés dans Clawd on Desk sur 3 OS avant publication.
- **Validation marché** : 100 downloads npm en semaine 1 + PRs de doc acceptées = signal d'adoption réel.
- **Validation architecture** : adapter Clyde écrit sans toucher au Core = preuve du découplage.

### Risk Mitigation

| Risque                                  | Mitigation                                             |
| --------------------------------------- | ------------------------------------------------------ |
| Clawd on Desk change son format         | Champ `compatibleWith` + adapter versionné             |
| Une autre app crée son propre converter | Antériorité + architecture ouverte (contributions)     |
| Le marché reste trop petit              | Investissement minimal (CLI léger) — pas de pari lourd |

## CLI Tool Specific Requirements

### Command Structure

```
npx pet-theme-converter
```

Séquence d'exécution :

1. **Prompt 1 — Source** : URL distante (validée par Content-Type HTTP) ou chemin local absolu/relatif
2. **Prompt 2 — Nom du thème** : chaîne alphanumérique utilisée comme nom du dossier de sortie et du fichier ZIP
3. **Prompt 3 — Mode de sortie** : `ZIP` (toujours disponible) ou `Install direct` (affiché uniquement si Clawd on Desk est détecté)
4. **Conversion** : barre de progression avec étapes nommées (téléchargement → découpe → génération APNG → packaging)
5. **Résultat** : chemin du fichier ZIP généré ou confirmation d'installation + disclaimer licence

### Output Formats

| Mode               | Résultat                                            | Condition                   |
| ------------------ | --------------------------------------------------- | --------------------------- |
| **ZIP**            | `<nom-pet>-clawd-theme.zip` dans le dossier courant | Toujours disponible         |
| **Install direct** | Copie dans le répertoire Clawd on Desk de l'OS      | Uniquement si Clawd détecté |

**Contenu du ZIP / dossier installé :**

```
<nom-pet>/
  theme.json          ← manifest avec compatibleWith
  assets/
    idle.apng
    thinking.apng
    working.apng
    error.apng
    happy.apng
    notification.apng
    sleeping.apng
    waking.apng
```

### Config Schema

Pas de fichier de configuration dédié en v0.1. L'outil est 100% interactif — chaque conversion démarre depuis zéro via les prompts. Aucun état persistant entre les exécutions.

### Exit Codes

| Code | Signification                                                                          |
| ---- | -------------------------------------------------------------------------------------- |
| `0`  | Succès — thème généré correctement                                                     |
| `1`  | Erreur générique (ex. : URL inaccessible, timeout réseau)                              |
| `2`  | Format invalide (ex. : Content-Type non-image, spritesheet non-décodable)              |
| `3`  | Erreur d'installation (mode install direct — dossier Clawd non accessible en écriture) |

### Scripting Support

- Mode non-interactif (flags CLI) : **hors scope v0.1**, prévu en v2+
- Shell completion (tab) : **hors scope v0.1**
- Les exit codes standards permettent une intégration basique dans des scripts shell sans mode non-interactif officiel

## Product Scope & Roadmap

### MVP Strategy & Philosophy

**Approche MVP :** Experience MVP — le produit doit fonctionner parfaitement avant d'être publié. La validation sur 10 pets réels sans bug critique est le seuil de publication, pas une cible post-lancement.

**Philosophie :** Un CLI qui rate une fois crée de la méfiance durable. Mieux vaut prendre 2 semaines de plus pour valider correctement que publier précipitamment et gérer des issues de confiance.

**Ressources :** Projet solo, une seule personne, pas de deadline fixe — objectif : publier le plus tôt possible sans sacrifier la qualité d'expérience.

### MVP Feature Set — v0.1

**Journeys couverts :** Théo (happy path + edge case), Mia (validation créateur)

**Must-Have — bloquants pour la publication :**

- Core : téléchargement spritesheet (URL + chemin local) → validation Content-Type → découpe frames → génération 8 APNGs
- Output adapter Clawd on Desk : `theme.json` avec `compatibleWith` + structure `assets/`
- CLI interactif : 3 prompts (@clack/prompts), barre de progression, messages d'erreur explicites
- Warning non-bloquant spritesheet hors-standard avec dimensions détectées affichées
- Mode ZIP (toujours dispo) + Install direct (si Clawd détecté, désactivé sinon)
- Détection Clawd on Desk par chemins OS + saisie manuelle optionnelle
- Exit codes standards (0/1/2/3)
- Interface `OutputAdapter` + `CONTRIBUTING.md` dans le repo
- Disclaimer licence CLI + README
- CI multi-OS (Windows + macOS) + validation manuelle 10 pets sur 3 OS
- Publication npm

**Nice-to-Have en v0.1 — si le temps le permet :**

- Timeout configurable (valeur par défaut suffisante pour une v0.1)
- README complet avec exemples et sources de spritesheets

### Post-MVP Features

**v0.2 — Documentation & Visibilité :**

- README principal finalisé (usage, sources compatibles, FAQ)
- PRs de documentation : Petdex, Clawd on Desk, Clyde READMEs
- Tests unitaires Core (frame extraction, mapping d'états)
- Option `--provider <name>` (réservé, non-implémenté)

**v0.3+ — Extensibilité :**

- Output adapter Clyde
- Support multi-output (`--output clawd,clyde`)
- CLI non-interactif via flags (`--source`, `--name`, `--output`)
- Conversion batch
- Web app (surface complémentaire)

### Risk Mitigation Strategy

**Risques techniques :**

| Risque                                                 | Probabilité | Mitigation                                                                                              |
| ------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| Binaires natifs — install cassée sur certaines configs | Moyen       | Tester Windows Node 18/20/22 + macOS M1/Intel avant publication. `optionalDependencies` par plateforme. |
| Frame extraction imprécise — artefacts de bord         | Faible      | Validation visuelle sur 10 pets aux morphologies variées avant publication                              |
| Clawd change son format avant publication              | Très faible | `compatibleWith` versionné + adapter facilement modifiable                                              |

**Risques marché :**

| Risque                   | Mitigation                                                     |
| ------------------------ | -------------------------------------------------------------- |
| Faible adoption initiale | PRs doc dans les READMEs cibles (v0.2) + annonce communautaire |
| Écosystème trop petit    | Investissement minimal — pas de pari d'infrastructure lourde   |

**Risque side-project :** Scope v0.1 volontairement petit et livrable en autonomie complète — pas de dépendances sur des tiers pour fonctionner.

## Functional Requirements

### Acquisition de la Spritesheet

- **FR1 :** L'utilisateur peut fournir une URL distante comme source de spritesheet
- **FR2 :** L'utilisateur peut fournir un chemin local (absolu ou relatif) comme source de spritesheet
- **FR3 :** Le système valide que l'URL fournie pointe vers une ressource image (Content-Type HTTP) avant tout traitement
- **FR4 :** Le système applique un timeout au téléchargement d'une spritesheet distante pour éviter les blocages indéfinis

### Traitement & Conversion

- **FR5 :** Le système détecte automatiquement les dimensions de la grille de la spritesheet (colonnes, hauteur et largeur de cellule)
- **FR6 :** Le système découpe la spritesheet en frames individuelles selon le mapping d'états Petdex → Clawd on Desk
- **FR7 :** Le système génère un APNG animé pour chacun des 8 états Clawd on Desk (`idle`, `thinking`, `working`, `error`, `happy`, `notification`, `sleeping`, `waking`)
- **FR8 :** Le système signale à l'utilisateur si les dimensions détectées diffèrent du format Codex standard (192×208px, grille 8×9) sans bloquer la conversion
- **FR9 :** Le message de warning affiche les dimensions réellement détectées et les dimensions attendues

### Génération du Thème

- **FR10 :** Le système génère un fichier `theme.json` conforme à la spec Clawd on Desk v1.x
- **FR11 :** Le `theme.json` inclut un champ `compatibleWith` indiquant explicitement la version cible de Clawd on Desk
- **FR12 :** Le système organise les fichiers générés dans la structure `<nom-pet>/theme.json` + `<nom-pet>/assets/*.apng`
- **FR13 :** Le système produit une archive ZIP contenant le thème complet prêt à l'installation manuelle

### Interface CLI

- **FR14 :** L'utilisateur peut démarrer le convertisseur avec `npx pet-theme-converter` sans argument
- **FR15 :** Le CLI guide l'utilisateur via 3 prompts séquentiels : source de la spritesheet, nom du thème, mode de sortie
- **FR16 :** Le CLI affiche une progression nommée pendant la conversion (téléchargement → découpe → génération APNG → packaging)
- **FR17 :** Le CLI retourne un exit code standard à la fin de chaque exécution (`0` succès, `1` erreur générique, `2` format invalide, `3` erreur d'installation)
- **FR18 :** L'utilisateur peut saisir manuellement le chemin d'installation de Clawd on Desk si la détection automatique échoue

### Feedback & Gestion des Erreurs

- **FR19 :** Le CLI affiche un message d'erreur explicite et actionnable en cas d'URL inaccessible ou de timeout réseau
- **FR20 :** Le CLI affiche un message d'erreur explicite si le Content-Type de l'URL n'est pas une image
- **FR21 :** Le CLI affiche un message d'erreur explicite si la spritesheet ne peut pas être décodée ou découpée
- **FR22 :** Le CLI affiche un warning non-bloquant si les dimensions de la spritesheet diffèrent du format Codex standard
- **FR23 :** Le CLI affiche un disclaimer de licence à l'issue de chaque conversion réussie
- **FR24 :** Le CLI informe l'utilisateur explicitement si le mode Install direct est indisponible (Clawd non détecté)

### Livraison du Thème

- **FR25 :** L'utilisateur peut recevoir le thème sous forme d'archive ZIP dans le dossier courant (option toujours disponible)
- **FR26 :** L'utilisateur peut installer le thème directement dans le répertoire Clawd on Desk de l'OS (option disponible uniquement si Clawd est détecté)
- **FR27 :** Le système détecte automatiquement la présence de Clawd on Desk via les chemins standards de chaque OS (Windows, macOS, Linux)
- **FR28 :** L'option Install direct n'est présentée que si Clawd on Desk est détecté ou si l'utilisateur a fourni un chemin manuel valide

### Compatibilité Écosystème

- **FR29 :** Le système accepte toute spritesheet respectant le format Codex (grille 8×9, 192×208px), quelle que soit sa marketplace source
- **FR30 :** Le thème généré est utilisable dans Clawd on Desk sans modification manuelle supplémentaire
- **FR31 :** Le README documente explicitement la version de Clawd on Desk ciblée par l'adapter

### Extensibilité & Contribution

- **FR32 :** Un développeur tiers peut implémenter un Output Adapter pour une nouvelle application de compagnon en implémentant l'interface `OutputAdapter` documentée
- **FR33 :** Le système sépare la logique de conversion (Core) des modules de génération de sortie (Adapters) de façon à ce qu'un adapter soit développable sans modifier le Core
- **FR34 :** Le repo expose un `CONTRIBUTING.md` décrivant la procédure pour écrire et soumettre un nouvel adapter

## Non-Functional Requirements

### Performance

- La conversion complète d'une spritesheet standard (192×208px, grille 8×9) — du lancement du CLI à la génération du ZIP — s'exécute en **moins de 60 secondes** sur une machine de développement standard avec une connexion internet normale.
- Le téléchargement d'une spritesheet distante est soumis à un **timeout de 30 secondes**. Au-delà, le CLI interrompt la tentative et affiche un message d'erreur explicite (FR19).
- La génération des 8 APNGs est entièrement locale après le téléchargement — aucune dépendance réseau pour le traitement.

### Compatibilité Plateforme

- Le package s'installe et fonctionne sur **Windows 10+, macOS 12+, Ubuntu 20.04+**.
- Compatibilité garantie avec **Node.js LTS ≥ 18.x** (Node 18 et Node 20 validés en CI avant publication).
- L'installation via `npx` fonctionne **sans droits administrateur** sur les 3 OS cibles.
- Les binaires natifs (`sharp`, `apngasm-bin`) sont déclarés en `optionalDependencies` par plateforme pour éviter les échecs d'installation sur des configurations non-standard.

### Fiabilité

- Le CLI ne se termine jamais silencieusement — chaque exécution produit soit un artefact valide, soit un message d'erreur explicite accompagné d'un exit code non-zéro.
- Un warning non-bloquant (FR8, FR22) n'interrompt jamais le processus de conversion — la conversion continue et produit un résultat.
- En cas d'échec partiel, le CLI indique précisément l'état des artefacts produits avant l'échec.

### Accessibilité CLI

- Les messages d'erreur et de warning ne transmettent **pas d'information uniquement via la couleur** du texte — chaque message est compréhensible en plain text.
- Les outputs sont lisibles dans des contextes non-TTY (redirection vers fichier, pipes) sans formatage ANSI cassé.
