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
