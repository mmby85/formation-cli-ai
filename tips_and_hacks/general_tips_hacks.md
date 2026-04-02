# CLI × IA — Guide des Astuces Avancées & Hacks Universels

> **Niveau :** Intermédiaire → Expert  
> **Applicable à :** Gemini CLI, Aider, OpenCode, Claude Code, Cursor, Copilot CLI, et tout outil IA en ligne de commande.

---

## 1. Philosophie : Penser en "Pipelines IA"

L'outil IA n'est qu'un maillon dans une chaîne. La vraie puissance vient de la **composition** :

```
source_de_données → transformation → IA → action
```

Exemples concrets :
```bash
# git log → IA → CHANGELOG
git log --oneline -30 | ia "Génère un CHANGELOG"

# logs d'erreur → IA → ticket Jira
tail -n 100 error.log | ia "Crée un rapport de bug structuré"

# code → IA → documentation → fichier
cat src/*.py | ia "Génère la doc API" > docs/api.md

# CSV → IA → analyse → rapport
cat data.csv | ia "Analyse ces données et identifie les tendances" > rapport.md
```

**Règle d'or :** Si vous faites quelque chose plus d'une fois, créez un alias ou une fonction shell avec votre outil IA.

---

## 2. Prompt Engineering pour le Terminal

### Le Template ROPE (Rôle, Objectif, Processus, Exemple)

```bash
ia "
RÔLE : Tu es un expert DevOps senior spécialisé en Kubernetes.

OBJECTIF : Diagnostiquer pourquoi ce pod crashe en boucle.

PROCESSUS :
1. Analyse les logs
2. Identifie la cause racine
3. Propose une solution concrète avec les commandes exactes

EXEMPLE DE FORMAT SOUHAITÉ :
## Cause racine
[explication]
## Solution
\`\`\`bash
[commandes à exécuter]
\`\`\`

DONNÉES :
$(kubectl logs pod-name --previous 2>&1 | tail -50)
"
```

### Contraintes de format en sortie
```bash
# Forcer JSON (pour le parsing)
ia "... Réponds UNIQUEMENT en JSON valide. Pas de texte avant, pas de backticks markdown."

# Forcer une commande directement exécutable
ia "Donne-moi la commande pour... Réponds UNIQUEMENT avec la commande, rien d'autre." | bash

# Forcer le markdown
ia "... Formate ta réponse en Markdown avec des headers H2 pour chaque section."

# Forcer la concision
ia "... Réponse max 3 phrases. Sois ultra-concis."
```

### Prompts négatifs (dire ce qu'on ne veut PAS)
```bash
ia "Explique Docker.
NE PAS :
- Mentionner Docker Desktop
- Faire une intro générique
- Parler de Kubernetes
- Dépasser 10 lignes
FAIRE :
- Aller droit au but
- Donner un exemple immédiatement
- Supposer que je connais Linux"
```

---

## 3. Bibliothèque de Fonctions Shell Universelles

### Ajouter à votre `.zshrc` / `.bashrc`

```bash
# ============================================
# FONCTIONS IA UNIVERSELLES
# ============================================

# Choisir votre outil IA (changez cette ligne pour switcher)
AI_CMD="gemini"  # ou: "aider --yes -m", "opencode --print", etc.

# Expliquer n'importe quelle commande
explain() {
  echo "$*" | $AI_CMD "Explique cette commande shell en français. Décris chaque argument/flag."
}
# Usage : explain "grep -rn 'TODO' . --include='*.py'"

# Corriger la dernière commande qui a échoué
fix-last() {
  local last_cmd=$(fc -ln -1)
  local last_err=$(eval "$last_cmd" 2>&1 || true)
  $AI_CMD "Cette commande a échoué : '$last_cmd'
Erreur : $last_err
Donne-moi la commande corrigée UNIQUEMENT, sans explication."
}

# Générer une commande depuis une description
cmd() {
  $AI_CMD "Génère la commande shell pour : $*
Réponds UNIQUEMENT avec la commande. Pas d'explication, pas de backticks." 
}
# Usage : cmd "trouver tous les fichiers .log de plus de 100MB"

# Résumer un man page
mansum() {
  man "$1" 2>/dev/null | col -bx | head -300 | \
    $AI_CMD "Résume les options les plus utiles de cette man page. Format : tableau markdown avec Commande | Description."
}

# Analyser un fichier de log
analyze-log() {
  tail -n "${2:-200}" "${1:?Usage: analyze-log <fichier> [lignes]}" | \
    $AI_CMD "Analyse ces logs. Identifie : erreurs critiques, patterns suspects, tendances. Format rapport markdown."
}

# Revue de sécurité rapide
sec-review() {
  cat "$1" | $AI_CMD "Effectue un audit de sécurité de ce code (OWASP Top 10). 
Identifie chaque vulnérabilité avec : ligne approximative, sévérité (CRITIQUE/HAUTE/MOYENNE), description, correction recommandée."
}

# Commit conventionnel automatique
smart-commit() {
  git diff --cached | $AI_CMD "Génère un message de commit Conventional Commits.
Format strict : type(scope): description (max 72 chars)
Types valides : feat, fix, refactor, test, docs, chore, perf
Réponds UNIQUEMENT avec le message, rien d'autre." | git commit -F -
}

# Traduire du code entre langages
translate-code() {
  local from="${1:?Usage: translate-code <from_lang> <to_lang>}"
  local to="${2:?Usage: translate-code <from_lang> <to_lang>}"
  $AI_CMD "Traduis ce code de $from vers $to. Adapte les idiomes du langage cible, n'importe pas les anti-patterns du langage source." < /dev/stdin
}
# Usage : cat script.py | translate-code Python TypeScript
```

---

## 4. Gestion des Secrets & Sécurité

### Ne jamais exposer vos clés API

```bash
# ❌ MAUVAIS : hardcoder dans le script
ANTHROPIC_API_KEY="sk-ant-xxxxx"

# ✅ BIEN : variables d'environnement depuis un gestionnaire de secrets
export ANTHROPIC_API_KEY=$(op read "op://Personal/Anthropic/api_key")  # 1Password CLI
export ANTHROPIC_API_KEY=$(pass show anthropic/api-key)                # pass
export ANTHROPIC_API_KEY=$(security find-generic-password -a anthropic -w)  # macOS Keychain

# ✅ BIEN : fichier .env non commité
echo "ANTHROPIC_API_KEY=sk-ant-..." >> ~/.env_secrets
echo "source ~/.env_secrets" >> ~/.zshrc
echo "~/.env_secrets" >> ~/.gitignore
```

### Vérifier avant d'envoyer du contexte
```bash
# Scanner le code pour des secrets avant de l'envoyer à une IA cloud
git diff | grep -iE "(api[_-]?key|password|secret|token|credential)" && \
  echo "⚠️ Secrets potentiels détectés ! Vérifiez avant d'envoyer à l'IA."

# Utiliser truffleHog ou detect-secrets
detect-secrets scan . --all-files 2>/dev/null | jq '.results | keys[]'
```

### Décider IA cloud vs IA locale
```
Code propriétaire / données sensibles ?  → Ollama local (Qwen2.5-Coder, DeepSeek Coder)
Code open source / tâches génériques ?   → IA cloud (Claude, Gemini, GPT-4)
Données clients dans le contexte ?       → JAMAIS en cloud → Local uniquement
```

---

## 5. Intégration Git Universelle

### Hooks Git intelligents

```bash
# Créer le hook pre-commit universel
cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
set -e

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(py|js|ts|go|rs)$' || true)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

echo "🤖 Revue IA des fichiers stagés..."

DIFF=$(git diff --cached -- $STAGED_FILES)
RESULT=$(echo "$DIFF" | gemini "Revue rapide. Réponds UNIQUEMENT par :
- OK si aucun problème critique
- PROBLEME: [description courte] si tu détectes : secrets hardcodés, injections SQL, vulnérabilités XSS, erreurs logiques évidentes")

echo "$RESULT"
if echo "$RESULT" | grep -q "^PROBLEME:"; then
  echo "❌ Commit bloqué par la revue IA. Corrigez puis re-commitez."
  exit 1
fi
echo "✅ Revue IA OK"
HOOK
chmod +x .git/hooks/pre-commit
```

### Génération de PR descriptions
```bash
generate-pr() {
  local base="${1:-main}"
  local diff_stats=$(git diff "$base"...HEAD --stat)
  local commits=$(git log "$base"...HEAD --oneline)
  
  gemini "Génère une description de Pull Request professionnelle.

Commits :
$commits

Fichiers modifiés :
$diff_stats

Format requis :
## Résumé
[1-2 phrases]

## Changements
[bullet points des changements majeurs]

## Tests
[comment tester ces changements]

## Notes de déploiement
[si applicable]"
}
```

---

## 6. Automatisation & Batch Processing

### Traitement de fichiers en parallèle

```bash
# Traiter plusieurs fichiers en parallèle avec xargs
find src/ -name "*.py" -print0 | \
  xargs -0 -P 4 -I {} sh -c '
    result=$(cat "{}" | gemini "Ajoute des type hints Python 3.12 à ce fichier. Retourne UNIQUEMENT le fichier modifié.")
    echo "$result" > "{}"
    echo "✅ {}"
  '
```

### Queue de tâches IA
```bash
#!/bin/bash
# ai-queue.sh — Traiter une liste de tâches IA séquentiellement

TASKS_FILE="${1:?Fournir un fichier de tâches}"
LOG_FILE="ai-queue-$(date +%Y%m%d-%H%M%S).log"

while IFS='|' read -r file prompt; do
  echo "📝 Traitement : $file"
  echo "   Prompt : $prompt"
  
  result=$(cat "$file" | gemini "$prompt" 2>&1)
  echo "$result" > "${file%.py}_processed.py"
  
  echo "[$(date)] OK : $file" >> "$LOG_FILE"
  sleep 1  # Rate limiting
done < "$TASKS_FILE"

echo "✅ Queue terminée. Log : $LOG_FILE"

# Format du fichier de tâches (tasks.txt) :
# src/utils.py|Ajoute des type hints
# src/models.py|Ajoute des docstrings Google-style
# src/api.py|Refactorise pour utiliser async/await
```

---

## 7. Intégration avec les Outils de Développement

### VS Code + Terminal IA
```bash
# Ouvrir le fichier courant dans VS Code depuis le terminal IA
# Dans votre .zshrc :
ai-edit() {
  local result=$(cat "$1" | gemini "$2")
  echo "$result" > "$1"
  code "$1"  # Ouvre dans VS Code pour review
}
# Usage : ai-edit src/utils.py "Optimise les performances de ce fichier"
```

### Intégration avec `fzf` (fuzzy finder)
```bash
# Sélectionner des fichiers interactivement puis les analyser
ai-select-analyze() {
  local files=$(find . -name "*.py" | fzf --multi --preview 'cat {}')
  local prompt="$*"
  cat $files | gemini "$prompt"
}

# Sélectionner un snippet de l'historique des prompts IA
ai-history() {
  history | grep -E "(gemini|aider|opencode)" | \
    fzf --tac | sed 's/^[ 0-9]*//' | xargs gemini
}
```

### Intégration avec `jq` pour le JSON
```bash
# IA + jq : transformer et interroger des données JSON
curl -s api.github.com/repos/anthropics/claude/issues | \
  jq '.[] | {title, state, created_at}' | \
  gemini "Catégorise ces issues GitHub par type (bug, feature, doc). Format tableau markdown."
```

---

## 8. Monitoring & Observabilité

### Dashboard de coûts IA
```bash
# Tracker les appels API et les coûts
cat > ~/bin/ai-cost-tracker << 'SCRIPT'
#!/bin/bash
# Wrapper qui log chaque appel IA
LOG="$HOME/.ai-usage.log"
START=$(date +%s)
gemini "$@"
END=$(date +%s)
DURATION=$((END - START))
echo "$(date '+%Y-%m-%d %H:%M') | ${DURATION}s | $(echo "$*" | wc -c) chars | gemini" >> "$LOG"
SCRIPT
chmod +x ~/bin/ai-cost-tracker

# Analyser l'usage
cat ~/.ai-usage.log | awk -F'|' '{print $3}' | sort | uniq -c | sort -rn | head -20
```

### Alertes sur les réponses IA
```bash
# Détecter si une réponse IA semble être une hallucination
validate-ai-response() {
  local response="$1"
  local validation=$(echo "$response" | gemini "Cette réponse contient-elle des affirmations factuellement douteuses ou invérifiables ? Réponds : FIABLE ou VÉRIFIER:[raison]")
  echo "$validation"
}
```

---

## 9. Patterns Avancés

### Chain-of-Thought forcé dans les pipes
```bash
# Résoudre des problèmes complexes en plusieurs étapes
problem="Mon API Node.js a des fuites mémoire en production"

step1=$(echo "$problem" | gemini "Étape 1 - Diagnostic : Quelles sont les causes possibles ? Liste-les.")
step2=$(echo "$step1" | gemini "Étape 2 - Priorisation : Laquelle est la plus probable ? Pourquoi ?")
step3=$(echo "$step2" | gemini "Étape 3 - Solution : Donne le plan d'action concret avec les commandes de debug.")

echo "$step3"
```

### Réflexion et auto-critique
```bash
ai-with-review() {
  local prompt="$1"
  local initial_response=$(gemini "$prompt")
  
  # Demander à l'IA de critiquer sa propre réponse
  gemini "Voici une réponse à la question '$prompt' :

$initial_response

Identifie les erreurs, les imprécisions, ou les améliorations possibles. 
Ensuite, donne une version améliorée."
}
```

### Meta-prompting : générer des prompts
```bash
# Demander à l'IA de créer le meilleur prompt pour une tâche
generate-prompt() {
  gemini "Génère le prompt optimal pour demander à une IA de : $*
Le prompt doit inclure : contexte, contraintes, format de sortie attendu, exemples si utile."
}

# Usage
generate-prompt "refactoriser du code Python synchrone en asynchrone"
```

---

## 10. Environnements & Portabilité

### Setup cross-platform
```bash
# Détecter l'OS et adapter
if [[ "$OSTYPE" == "darwin"* ]]; then
  alias pbcopy-ai='gemini "..." | pbcopy'   # macOS
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  alias pbcopy-ai='gemini "..." | xclip -selection clipboard'  # Linux
fi
```

### Dotfiles IA synchronisés
```bash
# Structure recommandée pour vos dotfiles
~/.config/ai/
├── aliases.sh          # Tous vos alias IA
├── functions.sh        # Toutes vos fonctions IA
├── prompts/            # Bibliothèque de prompts réutilisables
│   ├── code-review.md
│   ├── security-audit.md
│   ├── git-message.md
│   └── doc-generate.md
└── models.env          # Préférences de modèles par contexte
```

```bash
# ~/.config/ai/models.env
export AI_MODEL_FAST="gemini/gemini-2.5-flash"
export AI_MODEL_SMART="anthropic/claude-opus-4-5"
export AI_MODEL_LOCAL="ollama/qwen2.5-coder:32b"
export AI_MODEL_DEFAULT="$AI_MODEL_SMART"
```

---

## 11. Checklist : Best Practices Universelles

```
AVANT d'utiliser un outil IA CLI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Ai-je vérifié qu'il n'y a pas de secrets dans le contexte ?
□ Est-ce que j'utilise le bon modèle pour la tâche ?
□ Mon prompt est-il assez précis et contraint ?
□ Ai-je précisé le format de sortie attendu ?
□ Pour du code sensible : est-ce que j'utilise un modèle local ?

APRÈS avoir reçu une réponse IA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Ai-je relu le code généré avant de l'exécuter ?
□ Les tests passent-ils ?
□ Le code respecte-t-il les conventions du projet ?
□ Ai-je committé avec un message descriptif ?
□ Ai-je documenté la décision architecturale si nécessaire ?
```

---

## 12. Ressources & Communauté

| Ressource | Description |
|---|---|
| [aider.chat/docs](https://aider.chat/docs) | Documentation Aider |
| [opencode.ai](https://opencode.ai) | Documentation OpenCode |
| [ai.google.dev/gemini-api](https://ai.google.dev/gemini-api/docs/downloads) | Gemini CLI |
| [r/LocalLLM](https://reddit.com/r/LocalLLM) | Communauté IA locale |
| [Ollama Library](https://ollama.com/library) | Bibliothèque de modèles locaux |
| [promptingguide.ai](https://promptingguide.ai) | Guide de prompt engineering |

---

*Dernière mise à jour : 2026 — Testé sur macOS, Linux (Ubuntu/Arch), WSL2*
