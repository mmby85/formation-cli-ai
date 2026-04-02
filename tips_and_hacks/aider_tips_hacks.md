# Aider — Astuces Avancées & Hacks

> **Niveau :** Intermédiaire → Expert  
> **Outil :** [Aider](https://aider.chat) — Le pair-programmeur IA dans votre terminal, avec intégration Git native.

---

## 1. Configuration Optimale

### Fichier `.aider.conf.yml` (projet)
Placez ce fichier à la racine de chaque projet pour une config automatique :

```yaml
# .aider.conf.yml
model: claude-opus-4-5
editor-model: claude-haiku-4-5
auto-commits: true
dirty-commits: true
auto-lint: true
auto-test: true
test-cmd: pytest -x -q
lint-cmd: ruff check --fix
map-tokens: 4096
cache-prompts: true
```

### Fichier global `~/.aider.conf.yml`
```yaml
# Config globale pour tous les projets
dark-mode: true
stream: true
pretty: true
show-diffs: true
cache-prompts: true
```

### Variables d'environnement essentielles
```bash
export AIDER_MODEL="claude-opus-4-5"
export AIDER_EDITOR_MODEL="claude-haiku-4-5"
export AIDER_AUTO_COMMITS=true
export AIDER_CACHE_PROMPTS=true
```

---

## 2. Sélection Stratégique des Modèles

### Architecture bi-modèle (Architect + Editor)
L'une des fonctionnalités les plus puissantes d'Aider :

```bash
# Modèle puissant pour la réflexion, modèle rapide pour l'édition
aider --architect --model claude-opus-4-5 --editor-model claude-haiku-4-5

# Variante économique
aider --architect --model gemini/gemini-2.5-pro --editor-model gemini/gemini-2.5-flash

# Mode DeepSeek (très économique)
aider --architect --model deepseek/deepseek-reasoner --editor-model deepseek/deepseek-chat
```

### Tableau de référence des modèles

| Cas d'usage | Recommandation |
|---|---|
| Refactoring complexe | `--model claude-opus-4-5` |
| Features simples, bugfixes | `--model claude-sonnet-4-5` |
| Prototypage rapide | `--model gemini/gemini-2.5-flash` |
| Budget limité | `--model deepseek/deepseek-chat` |
| Code propriétaire sensible | `--model ollama/qwen2.5-coder:32b` |

---

## 3. Gestion du Contexte & Repo Map

### Comprendre la Repo Map
Aider génère automatiquement une carte de votre codebase. Optimisez-la :

```bash
# Augmenter la taille de la map pour les grands projets
aider --map-tokens 8192

# Voir la map générée
aider --show-repo-map

# Désactiver pour les très grands repos (>100k fichiers)
aider --map-tokens 0
```

### Commande `/add` — Ajouter des fichiers au contexte
```
# Dans la session Aider
/add src/auth/middleware.py src/auth/models.py
/add tests/test_auth.py

# Ajouter par pattern glob
/add src/api/*.py

# Voir les fichiers actuellement en contexte
/ls
```

### Commande `/drop` — Retirer des fichiers
```
# Libérer le contexte quand on change de tâche
/drop src/legacy/old_module.py

# Tout retirer sauf les fichiers essentiels
/drop
/add src/core/models.py
```

### `.aiderignore` — Exclure des fichiers de la map
```gitignore
# .aiderignore
*.lock
node_modules/
dist/
.env*
migrations/
*.min.js
vendor/
```

---

## 4. Commandes Slash Avancées

### Workflow de débogage
```
/add src/problematic_module.py tests/test_module.py

Voici le traceback :
```
AttributeError: 'NoneType' object has no attribute 'get_user'
  File "src/api/views.py", line 47, in get_profile
```
Trouve et corrige le bug, puis ajoute un test qui aurait détecté ce problème.
```

### `/run` — Exécuter et corriger automatiquement
```
/run pytest tests/test_api.py -v

# Si des tests échouent, Aider voit le résultat et peut corriger automatiquement
```

### `/lint` — Lint & fix en une commande
```
/lint
# Aider lint les fichiers en contexte et corrige les erreurs automatiquement
```

### `/test` — Tester et itérer
```
/test
# Lance la commande de test configurée, analyse les échecs, et corrige
```

### `/commit` — Commit intelligent
```
/commit
# Génère un message de commit conventionnel basé sur les changements
```

### `/undo` — Annuler le dernier commit IA
```
/undo
# Git reset --mixed HEAD~1 — garde les changements, annule le commit
```

---

## 5. Mode `--auto-test` et TDD avec Aider

### Workflow TDD automatisé
```bash
aider --auto-test --test-cmd "pytest -x -q" src/calculator.py tests/test_calculator.py
```

Puis dans la session :
```
Implémente la fonction `divide(a, b)` qui gère la division par zéro en levant une ValueError. 
Écris d'abord le test, puis l'implémentation.
```

Aider va :
1. Écrire le test
2. Lancer les tests (ils échouent — Red)
3. Implémenter la fonction
4. Relancer les tests (ils passent — Green)
5. Refactoriser si nécessaire

### Script de TDD en batch
```bash
#!/bin/bash
# tdd_batch.sh — Implémenter une liste de fonctionnalités en TDD
FEATURES=(
  "Ajoute une méthode cache_results() avec TTL de 5 minutes"
  "Ajoute la gestion des erreurs réseau avec retry exponentiel (3 tentatives)"
  "Ajoute la pagination à l'API avec curseur"
)

for feature in "${FEATURES[@]}"; do
  aider --yes --auto-test --test-cmd "pytest -x" \
    --message "$feature. Commence par le test." \
    src/api.py tests/test_api.py
done
```

---

## 6. Mode Non-Interactif & Automatisation

### `--message` / `-m` — One-shot sans interaction
```bash
# Exécuter une tâche précise sans ouvrir de session
aider --yes -m "Ajoute des type hints Python à toutes les fonctions publiques" src/utils.py

# Refactoring en masse
aider --yes -m "Convertis tous les f-strings legacy (%) en f-strings modernes" src/*.py

# Génération de documentation
aider --yes -m "Génère des docstrings Google-style pour toutes les fonctions sans docstring" src/
```

### `--message-file` — Prompts depuis un fichier
```bash
# Créer un fichier de prompt complexe
cat > refactor_task.md << 'EOF'
Effectue le refactoring suivant sur le module auth :

1. Sépare la logique d'authentification et d'autorisation
2. Implémente le pattern Repository pour les accès DB
3. Ajoute des tests unitaires pour chaque nouvelle classe
4. Mets à jour les imports dans tous les fichiers concernés

Contraintes :
- Ne casse pas les endpoints existants
- Maintiens la compatibilité avec l'API publique actuelle
EOF

aider --yes --message-file refactor_task.md src/auth/ tests/test_auth.py
```

### Pipeline CI/CD avec Aider
```yaml
# .github/workflows/ai-review.yml
name: AI Code Review
on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Aider
        run: pip install aider-chat
      - name: Auto-fix lint issues
        run: |
          git diff origin/main...HEAD --name-only | grep "\.py$" | \
          xargs aider --yes --auto-lint \
            --lint-cmd "ruff check --fix" \
            -m "Corrige tous les problèmes de linting" \
            --model claude-haiku-4-5
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## 7. Gestion Avancée de Git

### Branches de travail IA
```bash
# Toujours travailler sur une branche dédiée
git checkout -b ai/refactor-authentication
aider --model claude-opus-4-5 src/auth/

# Après validation, squash les commits IA
git rebase -i main
# Dans l'éditeur, squash les commits "aider:" en un seul commit propre
```

### Configurer les messages de commit IA
```yaml
# .aider.conf.yml
commit-prompt: |
  Génère un message de commit selon Conventional Commits (feat/fix/refactor/test/docs).
  Sois concis, utilise l'impératif, max 72 caractères pour la première ligne.
  Exemple: "feat(auth): add JWT refresh token rotation"
```

### Analyser l'historique des commits IA
```bash
# Voir tous les commits générés par Aider
git log --oneline --author="aider"

# Statistiques des changements IA
git log --author="aider" --stat | grep -E "files? changed"
```

---

## 8. Utilisation Hors-Ligne avec Ollama

### Configuration locale complète
```bash
# Installer Ollama et un modèle de code
ollama pull qwen2.5-coder:32b
ollama pull deepseek-coder-v2:16b

# Lancer Aider avec Ollama
aider --model ollama/qwen2.5-coder:32b

# Architecture locale bi-modèle
aider --architect \
  --model ollama/qwen2.5-coder:32b \
  --editor-model ollama/qwen2.5-coder:7b
```

### Alias pour switcher facilement
```bash
alias aider-local="aider --model ollama/qwen2.5-coder:32b --no-auto-commits"
alias aider-cloud="aider --model claude-opus-4-5"
alias aider-fast="aider --model claude-haiku-4-5"
```

---

## 9. Hacks & Techniques Avancées

### Context Files — Fichiers de contexte permanents
```bash
# Créer un fichier CONVENTIONS.md que vous ajoutez toujours
cat > CONVENTIONS.md << 'EOF'
## Standards de code ce projet

- Python 3.12+, type hints obligatoires
- Tests avec pytest + pytest-asyncio
- Logging avec structlog (pas print())
- Gestion d'erreurs : toujours des exceptions custom (voir src/exceptions.py)
- Format : Black + Ruff, ligne max 88 chars
- Docstrings : Google-style
EOF

# L'ajouter dans .aider.conf.yml
# read-only-files: ["CONVENTIONS.md"]
```

### Mode lecture seule pour les fichiers de référence
```yaml
# .aider.conf.yml
read-only: 
  - CONVENTIONS.md
  - docs/architecture.md
  - src/interfaces/base.py
```

### Prompt système personnalisé
```bash
aider --system-prompt "Tu es un expert Python spécialisé en APIs REST haute performance. Tu priorises : la lisibilité, la testabilité, et la performance. Tu utilises toujours des types hints et des dataclasses ou Pydantic."
```

### Workflow de migration de codebase
```bash
# Migrer de Python 2 vers Python 3 par batch
find . -name "*.py" -print0 | \
  xargs -0 -n 5 sh -c 'aider --yes -m "Migre ces fichiers de Python 2 à Python 3.12. Modernise la syntaxe (f-strings, walrus operator, type hints)." "$@"' _
```

---

## 10. Optimisation des Coûts

```bash
# Activer le cache de prompts (réduit les coûts de ~90% sur les contextes répétés)
aider --cache-prompts

# Utiliser le modèle le moins cher pour les tâches simples
aider --model claude-haiku-4-5 -m "Ajoute des commentaires au code" src/utils.py

# Limiter la taille du repo map
aider --map-tokens 2048  # Au lieu de 4096 par défaut

# Voir le coût de la session en cours
/tokens
# Affiche : tokens utilisés, coût estimé, % de la fenêtre de contexte
```

---

*Dernière mise à jour : 2026 — Compatible Aider v0.80+*
