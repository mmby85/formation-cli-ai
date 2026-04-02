# 🚀 Guide Complet d'Aider : L'Assistant de Programmation IA en Terminal

**Aider** (`aider-chat`) est un outil en ligne de commande qui vous permet de coder en binôme avec des LLM (Large Language Models) comme Claude 3.5 Sonnet, GPT-4o, etc. Sa plus grande force est son intégration native avec **Git** : il lit vos fichiers, écrit le code, et génère les commits automatiquement avec des messages pertinents.

---

## 📑 Sommaire
1. [Installation et Configuration rapide](#1-installation-et-configuration-rapide)
2. [Permissions, IAM et Politiques de Sécurité](#2-permissions-iam-et-politiques-de-sécurité)
3. [Lancement en Mode Automatique (Scripting / CI)](#3-lancement-en-mode-automatique-scripting--ci)
4. [Cheat Sheet des Commandes (Mode Interactif)](#4-cheat-sheet-des-commandes-mode-interactif)
5. [Cas d'Utilisation et Exemples Concrets](#5-cas-dutilisation-et-exemples-concrets)
6. [Astuces de Pro (Tips & Tricks)](#6-astuces-de-pro-tips--tricks)

---

## 1. Installation et Configuration rapide

```bash
# Installation via pip
python -m pip install aider-chat

# Définition de la clé API (exemple avec Anthropic, recommandé pour le code)
export ANTHROPIC_API_KEY="votre_clé_api"
# Ou OpenAI
export OPENAI_API_KEY="votre_clé_api"

# Lancement dans votre dossier de projet
aider
```

---

## 2. Permissions, IAM et Politiques de Sécurité

Aider accède directement à vos fichiers locaux et dialogue avec des API externes. La gestion des permissions dépend de votre fournisseur d'IA.

### A. Utilisation de clés API standards (OpenAI / Anthropic / Google)
Si vous utilisez des clés API classiques, la seule règle de sécurité est de **ne jamais les commiter**. 
* Utilisez un fichier `.env` à la racine de votre projet (assurez-vous qu'il est dans le `.gitignore`).
* Aider charge automatiquement les variables du fichier `.env`.


### B. Permissions Locales (Sécurité du système)
* **Exécution de commandes :** Aider peut lancer des tests ou des scripts de linter via la commande `/run`. Il vous demandera *toujours* confirmation avant d'exécuter une commande shell, sauf si vous passez le flag `--yes` (à éviter sur une machine de dev locale).

---

## 3. Lancement en Mode Automatique (Scripting / CI)

Aider n'est pas limité au mode chat interactif. Vous pouvez l'utiliser en mode "One-Shot" ou "Headless" (très utile pour des scripts d'automatisation ou dans un pipeline CI/CD).

### Via l'argument `-m` (Message court)
L'IA va lire le(s) fichier(s), appliquer la modification, commiter, et quitter.
```bash
aider --model claude-3-5-sonnet-20241022 -m "Ajoute des docstrings à toutes les fonctions de ce fichier" src/utils.py
```

### Via l'argument `--message-file` (Prompt complexe)
Si votre prompt est long (ex: spécifications techniques), mettez-le dans un fichier texte.
```bash
aider --message-file prompt_refacto.txt src/app.py src/database.py
```

### Mode pipeline (Stdin)
Vous pouvez piper (rediriger) la sortie d'une autre commande directement dans Aider.
```bash
cat erreur_log.txt | aider -m "Corrige le bug décrit dans ces logs" src/main.py
```

### Arguments utiles pour le mode Automatique :
* `--yes` : Accepte automatiquement toutes les propositions de l'IA (commit, création de fichiers). Utile en CI.
* `--no-auto-commits` : Empêche Aider de commiter. Les modifications restent dans l'arbre de travail (Working Directory).
* `--commit` : Force un commit des modifications en attente avant de commencer à travailler.

**Exemple de script Bash automatisé :**
```bash
#!/bin/bash
# Traduire les commentaires d'un fichier en anglais automatiquement
aider --yes --no-auto-commits -m "Translate all french comments to english. Do not touch the code." legacy_script.py
```

---

## 4. Cheat Sheet des Commandes (Mode Interactif)

Une fois Aider lancé, vous entrez dans le chat. Voici les commandes magiques (commençant par `/`) :

### 📂 Gestion du Contexte (Fichiers)
Le secret d'Aider est de ne lui donner **que** les fichiers pertinents.
* `/add <fichier>` : Ajoute un fichier au contexte de l'IA.
* `/drop <fichier>` : Retire un fichier du contexte.
* `/ls` : Liste tous les fichiers actuellement dans le contexte.
* `/add <dossier>/` : Ajoute tous les fichiers d'un dossier.
* `/map` : Affiche une carte conceptuelle du projet (très utile pour les gros repos).

### ⚙️ Modèles et Paramètres
* `/model <nom_modele>` : Change de LLM à la volée (ex: `/model gpt-4o`).
* `/models` : Recherche les modèles disponibles.
* `/architect` : Active le mode Architecte (un modèle réfléchit à la solution, un autre écrit le code).

### 🛠 Actions et Git
* `/commit` : Demande à Aider de commiter les changements actuels hors-chat.
* `/undo` : **Commande de sauvetage.** Annule le dernier commit fait par Aider.
* `/diff` : Affiche les modifications en cours.
* `/clear` : Efface l'historique de la conversation (pour économiser des tokens).

### 🚀 Exécution et Tests
* `/run <commande>` : Exécute une commande shell (ex: `/run python main.py`). Si la commande échoue, l'erreur est envoyée à l'IA pour qu'elle corrige !
* `/test <commande>` : Exécute votre suite de tests. Si un test échoue, Aider tente de corriger le code et relance les tests automatiquement.

---

## 5. Cas d'Utilisation et Exemples Concrets

### Cas 1 : Création d'un projet "From Scratch"
**Prompt :**
> "Crée un script Python `scraper.py` qui récupère les titres des articles sur HackerNews. Utilise BeautifulSoup. Crée aussi le fichier `requirements.txt`."
**Action d'Aider :** Il va créer les deux fichiers, écrire le code, et faire un commit "Add HN scraper and requirements".

### Cas 2 : Refactoring de code Legacy
Vous avez un vieux code complexe.
**Commandes :**
```text
> /add src/legacy_payment.py
> /add src/new_payment_interface.py
> "Refactorise la classe `OldStripeGateway` dans `legacy_payment.py` pour qu'elle implémente l'interface définie dans `new_payment_interface.py`. Utilise des Dataclasses pour les payloads."
```

### Cas 3 : L'IA en boucle de TDD (Test-Driven Development)
1. Vous écrivez un test qui échoue.
2. Vous ajoutez le test et le fichier source à Aider.
```text
> /add tests/test_calc.py
> /add src/calc.py
> /test pytest tests/test_calc.py
```
**Résultat :** Aider voit que `pytest` échoue, lit le code d'erreur, modifie `src/calc.py`, relance `pytest`, voit que ça passe, et commit.

### Cas 4 : Explication et Documentation
```text
> /add code_obfusque.c
> "Explique-moi ce que fait ce code, ligne par ligne. Ensuite, ajoute des commentaires explicatifs au-dessus de chaque bloc logique."
```

---

## 6. Astuces de Pro (Tips & Tricks)

1. **La règle d'or du Contexte :** Ne faites *jamais* un `/add` de tout votre projet. Ajoutez uniquement le fichier que vous voulez modifier et éventuellement le fichier d'interface ou de base de données dont il dépend.
2. **Utiliser un fichier `CONVENTIONS.md` :**
   Créez un fichier détaillant vos règles (ex: "Utilise toujours TypeScript strict, préfère les fonctions fléchées, utilise la librairie `pydantic` v2"). Ajoutez ce fichier à votre session : `/add CONVENTIONS.md`. Aider respectera votre style.
3. **Le Mode Architecte (`--architect`) :**
   Pour les tâches complexes, lancez Aider avec `--architect`. Cela utilise un modèle ultra-puissant (comme o1-preview) pour designer la solution en texte brut, puis passe le relais à un modèle rapide (comme Claude 3.5 Sonnet) pour éditer les fichiers.
4. **Ignorer des fichiers (`.aiderignore`) :**
   Comme `.gitignore`, créez un `.aiderignore` pour éviter qu'Aider n'analyse vos dossiers de build, `.env`, ou dossiers `node_modules` par erreur via la commande `/map`.
5. **Coder à la voix (`--voice`) :**
   Aider supporte la reconnaissance vocale. Lancez-le avec `--voice`. Parfait pour expliquer des architectures complexes sans taper de longs paragraphes.
