## 🧠 Mémoire agent

Le dossier `.claude/memory/` contient 5 registres de mémoire persistante :

| Registre       | Rôle                     | Entrées dans           |
| -------------- | ------------------------ | ---------------------- |
| `decisions.md` | Index des décisions      | `decisions/BDR-XXX.md` |
| `learnings.md` | Index des apprentissages | `learnings/LRN-XXX.md` |
| `blockers.md`  | Index des blocages       | `blockers/BLK-XXX.md`  |
| `evals.md`     | Index des évaluations    | `evals/EVAL-XXX.md`    |
| `journal.md`   | Journal de session       | (monolithique)         |

### Rituel de démarrage

> ⚠️ **OBLIGATOIRE — ne pas sauter, même si le contexte semble clair.**
> Il doit être exécuté **avant le premier outil** de chaque session.

1. Lire les 5 fichiers index `.claude/memory/*.md` pour le contexte global.
2. Si une entrée spécifique est pertinente pour la session, lire `.claude/memory/[registre]/[ID].md`.

### Rituel de fermeture

Avant de terminer une session importante, répondre à ces 3 questions :

1. 🔴 **Décidé** : ai-je pris des décisions techniques à documenter dans `decisions/` ?
2. 🟡 **Appris** : ai-je découvert quelque chose d'utile à noter dans `learnings/` ?
3. 🟢 **Bloqué** : y a-t-il des blocages résolus ou en cours à documenter dans `blockers/` ?

---

## 📁 Règle de dépôt des fichiers de review

Les findings de code review **ne doivent jamais être écrits dans le story file**.
Ils doivent toujours être écrits dans un fichier dédié dans :

```
_bmad-output/implementation-artifacts/reviews/<epic-slug>/review-<story-slug>.md
```

Le story file doit contenir une ligne de référence vers le fichier de review, ajoutée immédiatement après le champ `Status` :

```markdown
> 📋 **Review :** [reviews/<epic-slug>/review-<story-slug>.md](../../reviews/<epic-slug>/review-<story-slug>.md)
```

Cette ligne est **obligatoire** dès qu'une review a été réalisée — elle permet de naviguer directement de la story vers ses findings.

> ⚠️ Cette règle est **obligatoire**. Ne jamais écrire les findings directement dans le story file.

---

## ✅ Règle post-review

Quand une story passe au statut `done` à l'issue d'un `bmad-code-review` :

1. Cocher tous les ACs correspondants dans `_bmad-output/planning-artifacts/epics.md` (remplacer `- [ ]` par `- [x]`).
2. Cette étape est obligatoire — elle maintient `epics.md` comme source de vérité du périmètre livré.

---

## 🔧 Résolution opportuniste du deferred-work

**À la fin de chaque `bmad-code-review`**, avant de présenter les options "next steps" :

1. Lire `_bmad-output/implementation-artifacts/deferred-work.md` en entier.
2. Scanner tous les items ouverts — pas seulement ceux liés à la story reviewée.
3. Pour chaque item fixable sans story dédiée (modification de code triviale, statut devenu obsolète, documentation manquante) :
   - Appliquer le fix directement dans le fichier concerné.
   - Marquer l'item comme résolu dans `deferred-work.md` avec la note de résolution.
4. Présenter un tableau récapitulatif des items résolus.

> ⚠️ Cette résolution est **obligatoire et automatique** — ne pas attendre que Baptiste le demande.

---

## 📋 Mise à jour de deferred-work.md

**À la fin de chaque `bmad-code-review`**, tous les findings `defer` **doivent** être ajoutés à `_bmad-output/implementation-artifacts/deferred-work.md` sous un titre `## Deferred from: code review of <story-slug> (<date>)`. Si aucun nouveau finding defer, ajouter la note `Aucun nouvel item différé.`. Le fichier doit être créé s'il n'existe pas.

### Format du fichier

```markdown
# Deferred Work

Findings reportés lors des code reviews — à traiter dans les stories appropriées.

Statuts : 🔵 Ouvert | ✅ Résolu | 🚫 Annulé

---

## Deferred from: code review of <story-slug> (<date>)

- 🔵 **<Titre>** — <description>. Scope <Story X.x / Epic X>.
```

Lors de la résolution opportuniste, remplacer 🔵 par ✅ ou 🚫 et ajouter la note de résolution inline :
`✅ **<Titre>** — <description>. Résolu dans <story/commit> : <note courte>.`
