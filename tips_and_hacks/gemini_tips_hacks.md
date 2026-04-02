# Gemini CLI — Astuces Avancées & Hacks

> **Niveau :** Intermédiaire → Expert  
> **Outil :** [Gemini CLI](https://github.com/google-gemini/gemini-cli) — Le client terminal officiel de Google pour les modèles Gemini.

---

## 1. Configuration & Initialisation

### Profils multi-clés API
Gérez plusieurs comptes ou projets sans jamais retaper vos clés :

```bash
# ~/.bashrc ou ~/.zshrc
alias gemini-work="GEMINI_API_KEY=$GEMINI_WORK_KEY gemini"
alias gemini-perso="GEMINI_API_KEY=$GEMINI_PERSO_KEY gemini"
```

### Fichier de configuration centralisé
Créez un fichier `~/.gemini/config.json` pour centraliser vos préférences :

```json
{
  "model": "gemini-2.5-pro",
  "temperature": 0.7,
  "maxOutputTokens": 8192,
  "theme": "dark"
}
```

### Changer de modèle à la volée
```bash
gemini --model gemini-2.5-flash "Explique ce code rapidement"
gemini --model gemini-2.5-pro  "Analyse en profondeur ce système"
```
Utilisez **Flash** pour la rapidité, **Pro** pour la réflexion complexe.

---

## 2. Gestion du Contexte & Fenêtre de Tokens

### Injecter des fichiers entiers dans le contexte
```bash
# Un seul fichier
gemini "Audite ce code" < src/main.py

# Plusieurs fichiers concaténés
cat src/*.py | gemini "Trouve les incohérences entre ces modules"

# Avec un heredoc structuré
gemini <<EOF
Voici mon fichier de config :
$(cat config.yaml)

Et voici les logs d'erreur :
$(tail -n 50 /var/log/app.log)

Quel est le problème ?
EOF
```

### Maximiser la fenêtre de contexte
Gemini 2.5 Pro supporte jusqu'à **1 million de tokens**. Exploitez-le :

```bash
# Analyser un repo entier
find . -name "*.py" -exec cat {} \; | gemini "Génère la documentation complète de ce projet"

# Analyser un PDF ou document long
pdftotext document.pdf - | gemini "Résume les points clés et identifie les risques"
```

---

## 3. Pipelines Shell Avancés

### Pipeline de revue de code automatique
```bash
git diff HEAD~1 | gemini "Fais une revue de code de ce diff. Identifie : bugs, problèmes de sécurité, et suggestions d'amélioration. Format markdown."
```

### Génération et exécution en boucle
```bash
# Générer un script, l'exécuter, corriger les erreurs automatiquement
OUTPUT=$(gemini "Écris un script bash pour surveiller l'usage CPU toutes les 5s")
echo "$OUTPUT" > monitor.sh && bash monitor.sh 2>&1 | \
  gemini "Ce script a produit cette erreur, corrige-le"
```

### Traitement en batch de fichiers
```bash
for file in *.md; do
  echo "### $file" >> summary.md
  gemini "Résume ce document en 3 bullet points" < "$file" >> summary.md
  echo "" >> summary.md
done
```

### Extraction de données structurées (JSON)
```bash
curl -s https://api.exemple.com/data | \
  gemini "Transforme ce JSON en tableau markdown lisible"

# Forcer la sortie JSON
gemini "Liste les 5 capitales européennes avec population. Réponds UNIQUEMENT en JSON valide, sans markdown."
```

---

## 4. Mode `--sandbox` & Exécution de Code

### Activer l'exécution de code sandbox
```bash
gemini --sandbox "Calcule les 100 premiers nombres premiers et affiche-les"
```

Gemini peut écrire ET exécuter du code dans un environnement sécurisé directement depuis le terminal.

### Workflow : Analyse de données en direct
```bash
gemini --sandbox <<EOF
J'ai ce CSV :
$(cat ventes.csv)

Génère et exécute un script Python qui :
1. Calcule les statistiques descriptives
2. Identifie les anomalies (valeurs aberrantes)
3. Produit un résumé en texte
EOF
```

---

## 5. Astuces de Prompt Engineering pour le CLI

### Personas spécialisées persistantes
```bash
# Créer un alias avec un persona intégré
alias sec-review='gemini "Tu es un expert en cybersécurité. Analyse ce qui suit pour des vulnérabilités OWASP :"'
alias doc-writer='gemini "Tu es un tech writer senior. Rédige une documentation claire et concise pour :"'

# Usage
sec-review < api_handler.py
```

### Chaînage de prompts (Chain-of-Thought forcé)
```bash
gemini "Problème : $(cat bug_report.txt)

Résous étape par étape :
1. D'abord, identifie la cause racine
2. Ensuite, propose 3 solutions
3. Enfin, recommande la meilleure avec justification"
```

### Output formaté pour l'intégration
```bash
# Générer directement du code exploitable
gemini "Génère un Dockerfile optimisé pour une app Node.js 20. Réponds UNIQUEMENT avec le contenu du fichier, sans explication." > Dockerfile

# Générer une PR description
git log --oneline HEAD~5..HEAD | \
  gemini "Génère une description de Pull Request professionnelle pour ces commits. Format : titre, résumé, changements majeurs, tests."
```

---

## 6. Intégration Git & Workflows DevOps

### Hook pre-commit intelligent
```bash
# .git/hooks/pre-commit
#!/bin/bash
STAGED=$(git diff --cached)
if [ -n "$STAGED" ]; then
  REVIEW=$(echo "$STAGED" | gemini "Revue rapide : y a-t-il des problèmes critiques (bugs, secrets exposés, injections) ? Réponds par OUI/NON suivi d'une explication courte.")
  echo "$REVIEW"
  if echo "$REVIEW" | grep -q "^OUI"; then
    echo "⚠️  Gemini a détecté des problèmes. Vérifiez avant de committer."
    exit 1
  fi
fi
```

### Génération automatique de CHANGELOG
```bash
git log --since="30 days ago" --pretty=format:"%s" | \
  gemini "Génère un CHANGELOG professionnel à partir de ces messages de commit. Catégorise en : Features, Fixes, Breaking Changes."
```

### Revue de sécurité avant déploiement
```bash
# Scan des secrets et vulnérabilités
git diff main..HEAD | gemini "Scan de sécurité : cherche des clés API, mots de passe hardcodés, injections SQL potentielles, et failles XSS. Liste chaque problème avec sa ligne approximative."
```

---

## 7. Fonctions Shell Réutilisables

### Ajouter à votre `.zshrc` / `.bashrc`

```bash
# Explication rapide d'une commande
explain() { gemini "Explique cette commande shell de façon concise : $*"; }

# Déboguer une erreur
fixerr() { gemini "J'ai cette erreur : $1. Contexte : $(pwd). Donne-moi la solution directement."; }

# Générer une commande à partir d'une description
cmd() { gemini "Donne-moi la commande shell pour : $*. Réponds UNIQUEMENT avec la commande, sans explication."; }

# Résumer un man page
mansum() { man "$1" 2>/dev/null | head -200 | gemini "Résume les options les plus importantes de cette man page en bullet points."; }

# Traduire du code entre langages
translate-code() {
  gemini "Traduis ce code de $1 vers $2. Code source :" < /dev/stdin
}
# Usage : cat script.py | translate-code Python JavaScript
```

---

## 8. Multimodalité depuis le Terminal

### Analyser des images
```bash
# Analyser un screenshot d'erreur
gemini "Qu'est-ce qui ne va pas dans ce screenshot ?" --image error_screenshot.png

# Analyser un diagramme d'architecture
gemini "Explique cette architecture et identifie les single points of failure" --image architecture.png

# OCR avancé
gemini "Extrais tout le texte de cette image et formate-le en markdown" --image scan.jpg
```

---

## 9. Optimisation des Coûts & Performances

| Cas d'usage | Modèle recommandé | Raison |
|---|---|---|
| Questions rapides, scripts simples | `gemini-2.5-flash` | Rapide, économique |
| Revue de code, analyse complexe | `gemini-2.5-pro` | Meilleure précision |
| Traitement de documents longs | `gemini-2.5-pro` | Grande fenêtre de contexte |
| Génération de contenu créatif | `gemini-2.5-flash` | Suffisant, moins cher |

### Mettre en cache les réponses fréquentes
```bash
# Wrapper avec cache simple
gemini_cached() {
  HASH=$(echo "$*" | md5sum | cut -d' ' -f1)
  CACHE_FILE="$HOME/.gemini_cache/$HASH"
  mkdir -p "$HOME/.gemini_cache"
  if [ -f "$CACHE_FILE" ]; then
    cat "$CACHE_FILE"
  else
    gemini "$*" | tee "$CACHE_FILE"
  fi
}
```

---

## 10. Hacks Avancés & Cas d'Usage Créatifs

```bash
# Générer des données de test réalistes
gemini "Génère 20 entrées JSON réalistes pour une base de données d'utilisateurs e-commerce (nom, email, adresse française, historique d'achats). JSON pur, sans markdown."

# Auto-documenter un repo
find . -name "*.py" | head -20 | xargs cat | \
  gemini "Génère un README.md complet pour ce projet Python"

# Analyser les performances d'un fichier de logs
tail -n 1000 access.log | \
  gemini "Analyse ces logs nginx. Identifie : IPs suspectes, endpoints les plus appelés, erreurs fréquentes, patterns d'attaque potentiels."

# Assistant de débogage interactif
while true; do
  read -p "🤖 > " question
  gemini "$question"
done
```

---

*Dernière mise à jour : 2026 — Compatible Gemini 2.5 Pro/Flash*
