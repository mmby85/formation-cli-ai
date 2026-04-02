# OpenCode — Astuces Avancées & Hacks

> **Niveau :** Intermédiaire → Expert  
> **Outil :** [OpenCode](https://github.com/sst/opencode) — Agent IA de coding pour le terminal, bâti par l'équipe SST.

---

## 1. Installation & Configuration

### Installation et mise à jour
```bash
# Installation
curl -fsSL https://opencode.ai/install | bash

# Ou via npm
npm install -g opencode-ai

# Mise à jour vers la dernière version
npm update -g opencode-ai
```

### Initialisation d'un projet
```bash
cd mon-projet
opencode  # Lance le TUI (Terminal UI)
```

### Fichier de configuration `.opencode/config.json`
```json
{
  "model": "anthropic/claude-opus-4-5",
  "autoshare": false,
  "providers": {
    "anthropic": {
      "apiKey": "$ANTHROPIC_API_KEY"
    },
    "openai": {
      "apiKey": "$OPENAI_API_KEY"
    }
  }
}
```

### Variables d'environnement
```bash
# ~/.bashrc ou ~/.zshrc
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export OPENCODE_MODEL="anthropic/claude-opus-4-5"
```

---

## 2. Navigation dans le TUI

### Raccourcis clavier essentiels

| Raccourci | Action |
|---|---|
| `Ctrl+K` | Ouvrir la palette de commandes |
| `Ctrl+L` | Nouvelle session / Effacer le contexte |
| `Ctrl+Z` | Annuler la dernière action IA |
| `Tab` | Complétion de fichiers/commandes |
| `Ctrl+C` | Interrompre une action en cours |
| `↑ / ↓` | Naviguer dans l'historique des prompts |
| `Ctrl+R` | Rechercher dans l'historique |
| `Esc` | Sortir du mode édition |

### Naviguer entre les sessions
OpenCode garde un historique de sessions. Utilisez `Ctrl+K` → "Sessions" pour retrouver des sessions passées et leur contexte.

---

## 3. Gestion du Contexte & Fichiers

### Référencer des fichiers dans vos prompts
```
# Dans le prompt OpenCode, utilisez @ pour référencer des fichiers
@src/auth/middleware.py Ajoute la validation JWT à ce middleware

# Référencer plusieurs fichiers
@src/models/user.py @src/api/endpoints.py Assure la cohérence entre ces deux fichiers

# Référencer un dossier entier
@src/services/ Refactorise tous ces services pour utiliser le pattern Repository
```

### Glisser-déposer dans le TUI
Dans les terminaux modernes (iTerm2, Warp, Windows Terminal), vous pouvez **glisser-déposer** des fichiers directement dans la fenêtre OpenCode pour les ajouter au contexte.

### Contrôler le contexte manuellement
```
# Lister les fichiers en contexte
/context list

# Retirer un fichier du contexte
/context remove src/legacy.py

# Vider le contexte
/context clear

# Ajouter en lecture seule (pour référence, pas d'édition)
/context add --readonly docs/api-spec.md
```

---

## 4. Commandes Slash

### Commandes disponibles
```
/help              — Liste toutes les commandes
/model             — Changer de modèle en cours de session
/context           — Gérer le contexte de fichiers
/undo              — Annuler les dernières modifications
/diff              — Voir le diff des changements non commités
/commit            — Créer un commit avec message IA
/run <cmd>         — Exécuter une commande shell
/share             — Partager la session (génère un lien)
/cost              — Voir le coût de la session
```

### Changer de modèle à chaud
```
/model anthropic/claude-opus-4-5
/model openai/gpt-4o
/model anthropic/claude-haiku-4-5
/model google/gemini-2.5-pro
```

---

## 5. Workflows de Développement

### Feature complète de A à Z
```
@src/models/ @src/api/ @tests/

Implémente la feature "notifications push" :
1. Modèle Notification avec champs : user_id, type, message, read_at, created_at
2. Migration de base de données
3. Endpoint POST /notifications pour créer
4. Endpoint PATCH /notifications/:id/read pour marquer comme lu  
5. Endpoint GET /notifications avec pagination et filtre unread
6. Tests unitaires et d'intégration pour chaque endpoint
7. Documentation OpenAPI pour les nouveaux endpoints
```

### Debugging assisté
```
/run npm test 2>&1

# OpenCode voit l'output. Ensuite :
Les tests 3 et 7 échouent. Analyse les erreurs, trouve la cause racine et corrige.
```

### Refactoring guidé par les tests
```
@src/old_payment_module.py @tests/test_payments.py

Les tests passent tous. Refactorise le module de paiement pour :
- Séparer la logique Stripe de la logique métier
- Utiliser le pattern Strategy pour supporter plusieurs providers
- Maintenir tous les tests existants au vert
Ne touche pas aux interfaces publiques.
```

---

## 6. Intégration Shell & Automatisation

### Lancer OpenCode depuis un script
```bash
# Mode headless / non-interactif
opencode --print "Génère un Dockerfile pour une app Python FastAPI" > Dockerfile

# Pipeline
cat schema.sql | opencode --print "Génère les modèles SQLAlchemy pour ce schéma"

# Avec contexte de fichiers
opencode --print --files "src/api.py,tests/test_api.py" \
  "Ajoute la validation des entrées manquante"
```

### Alias productifs
```bash
# Explication rapide d'un fichier
alias explain-file='f() { opencode --print "Explique ce fichier en français, ligne par ligne pour les parties complexes" --files "$1"; }; f'

# Génération de tests
alias gen-tests='f() { opencode --print "Génère des tests pytest complets pour ce module" --files "$1" > "tests/test_$(basename $1)"; }; f'

# Revue de sécurité
alias sec-check='f() { opencode --print "Audit de sécurité OWASP Top 10 de ce fichier. Sois précis sur les lignes concernées." --files "$1"; }; f'
```

---

## 7. Gestion Multi-Modèles & Providers

### Configurer plusieurs providers
```json
{
  "providers": {
    "anthropic": { "apiKey": "$ANTHROPIC_API_KEY" },
    "openai":    { "apiKey": "$OPENAI_API_KEY" },
    "google":    { "apiKey": "$GOOGLE_API_KEY" },
    "ollama":    { "endpoint": "http://localhost:11434" }
  }
}
```

### Stratégie de sélection de modèle

```bash
# Pour les tâches de réflexion architecturale
/model anthropic/claude-opus-4-5

# Pour le coding rapide
/model anthropic/claude-sonnet-4-5

# Pour les budgets serrés
/model anthropic/claude-haiku-4-5
# ou
/model ollama/qwen2.5-coder:32b

# Pour du code propriétaire (100% local)
/model ollama/deepseek-coder-v2:16b
```

---

## 8. Fonctionnalités Avancées Agent

### Mode Agent — Laisser OpenCode travailler en autonomie
OpenCode peut chaîner des actions : lire des fichiers, écrire du code, lancer des tests, itérer.

```
Crée une API REST complète pour gérer un blog :
- Structure de projet propre (séparation routes/controllers/models)
- CRUD pour les articles et les commentaires
- Authentification JWT
- Tests avec 80%+ de couverture
- README avec instructions de setup

Travaille de façon autonome, lance les tests après chaque module pour vérifier.
```

OpenCode va :
1. Créer la structure de dossiers
2. Implémenter chaque module
3. Lancer `npm test` ou `pytest` après chaque étape
4. Corriger les erreurs
5. Itérer jusqu'à ce que tout soit vert

### Surveiller et contrôler l'agent
- `Ctrl+C` — Interrompre à tout moment
- `/diff` — Voir ce qui a été modifié
- `/undo` — Revenir en arrière si quelque chose se passe mal
- Gardez un `git stash` en reserve avant les tâches longues

---

## 9. Partage & Collaboration

### Partager une session
```
/share

# Génère un lien type : https://opencode.ai/s/abc123
# Votre équipe peut voir la session complète : prompts, code généré, diffs
```

### Bonnes pratiques de partage
```bash
# Avant de partager, vérifier qu'il n'y a pas de secrets dans le contexte
/context list  # Lister les fichiers en contexte

# Désactiver le partage automatique
# Dans config.json : "autoshare": false
```

---

## 10. Optimisation & Performance

### Réduire les coûts
```bash
# Utiliser le modèle le moins cher pour les tâches simples
/model anthropic/claude-haiku-4-5

# Voir le coût en temps réel
/cost

# Vider le contexte entre les tâches non liées
/context clear
```

### Accélérer les workflows
```bash
# Créer des snippets de prompt réutilisables
mkdir -p ~/.opencode/prompts
cat > ~/.opencode/prompts/add-tests.md << 'EOF'
Génère des tests pytest complets pour le fichier en contexte.
Couvre : cas nominaux, cas limites, cas d'erreur.
Mocks pour les dépendances externes.
Nommage descriptif des tests (test_should_...).
EOF

# Dans OpenCode, référencer le snippet
@~/.opencode/prompts/add-tests.md
```

### Intégration avec votre éditeur
```bash
# Ouvrir OpenCode dans un split terminal (VS Code)
# Terminal 1 : votre éditeur normal
# Terminal 2 : opencode dans le même répertoire

# Trick : synchroniser le fichier ouvert dans VS Code avec OpenCode
code --reuse-window  # Ouvre VS Code et pointe sur les fichiers modifiés par OpenCode
```

---

## 11. Hacks Créatifs

```bash
# Générer un projet entier depuis un cahier des charges
cat cahier_des_charges.md | opencode --print "Génère la structure de projet et le code initial"

# Auto-migration de base de données
opencode --print --files "src/models/old_schema.py,src/models/new_schema.py" \
  "Génère le script de migration Alembic pour passer de old_schema à new_schema"

# Génération de données de seed
opencode --print --files "src/models/" \
  "Génère un fichier seed.py avec 50 entrées de données réalistes pour chaque modèle"

# Analyser et améliorer les performances
/run "python -m cProfile -s cumulative app.py 2>&1 | head -50"
# Puis :
Voici le profil de performance. Identifie les 3 goulots d'étranglement et optimise-les.
```

---

*Dernière mise à jour : 2026 — Compatible OpenCode v0.1+*
