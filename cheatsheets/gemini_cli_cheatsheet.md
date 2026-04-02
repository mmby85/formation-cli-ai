Voici un guide complet, détaillé et structuré sous forme de fichier Markdown (`.md`) pour maîtriser **Gemini CLI**. Vous pouvez copier-coller ce contenu directement dans votre éditeur Markdown ou votre documentation interne.

***

# 🚀 Guide Complet : Gemini CLI (Command Line Interface)

**Gemini CLI** est un outil en ligne de commande officiel de Google permettant d'interagir avec les modèles d'intelligence artificielle Gemini (Gemini 2.5 Pro, Flash, etc.) directement depuis votre terminal. 

C'est l'outil parfait pour les développeurs, les administrateurs système et les ingénieurs DevOps qui souhaitent intégrer l'IA dans leurs scripts, analyser des logs ou automatiser des tâches.

🔗 **Documentation officielle :** [https://google-gemini.github.io/gemini-cli/](https://google-gemini.github.io/gemini-cli/)

---

## 🛠️ 1. Installation et Configuration

### Prérequis
- **Node.js** (version 18 ou supérieure)
- Une clé API Gemini via [Google AI Studio](https://aistudio.google.com/) ou un accès via **Google Cloud Vertex AI**.

### Installation
```bash
# Installation globale via npm
npm install -g @google/gemini-cli
```

### Vérification
```bash
gemini --version
```

---

## 🔐 2. Permissions, Policies et Sécurité

Il existe deux manières de s'authentifier, selon que vous utilisez la version "Développeur" (AI Studio) ou "Entreprise" (Vertex AI).

### Option A : Google AI Studio (API Key) - *Le plus simple*
Idéal pour les scripts locaux et le prototypage. Vous devez exposer la clé via une variable d'environnement.

```bash
# À ajouter dans votre ~/.bashrc ou ~/.zshrc
export GEMINI_API_KEY="votre_cle_api_ici"
```
**Policy de sécurité :** 
- Ne commitez **jamais** cette clé sur Git.
- Restreignez les API Keys dans Google Cloud Console (APIs & Services > Credentials) pour qu'elles ne puissent appeler que l'API "Generative Language API".

---

## 📜 3. Cheat Sheet (Aide-mémoire des Commandes)

| Commande / Flag | Description | Exemple |
| :--- | :--- | :--- |
| `gemini chat` | Lance une session de chat interactive. | `gemini chat` |
| `gemini ask` | Pose une question unique (one-shot). | `gemini ask "Que fait la commande ls ?"` |
| `gemini models` | Liste les modèles disponibles. | `gemini models` |
| `-m, --model` | Spécifie le modèle à utiliser. | `gemini ask "..." -m gemini-2.5-pro` |
| `-s, --system` | Ajoute une instruction système (rôle). | `gemini ask "..." -s "Tu es un pirate."` |
| `-t, --temperature`| Règle la créativité (0.0 à 2.0). | `gemini ask "..." -t 0.2` |
| `--media` | Analyse un fichier multimédia/image. | `gemini ask "Que vois-tu ?" --media img.jpg`|
| `--json` | Force la sortie au format JSON. | `gemini ask "Liste 3 couleurs" --json` |

---

## 🤖 4. Exemples d'Utilisation Détaillés

### Cas 1 : Interaction basique
Pour obtenir une réponse rapide sans quitter le terminal.
```bash
gemini ask "Écris une fonction Python pour inverser une chaîne de caractères, donne juste le code."
```

### Cas 2 : Analyser un fichier local (Multimodal)
Gemini CLI excelle dans l'analyse de fichiers (images, documents).
```bash
gemini ask "Décris l'architecture réseau sur ce schéma" --media ./architecture.png
```

### Cas 3 : Analyser le contenu d'un fichier texte (Piping)
C'est ici que le CLI devient surpuissant. Vous pouvez lui envoyer le contenu de fichiers via l'entrée standard (`stdin`).

**Exemple : Expliquer un code source**
```bash
cat main.go | gemini ask "Explique-moi ce code Go en 3 bullet points."
```

**Exemple : Déboguer un log d'erreur**
```bash
tail -n 50 /var/log/nginx/error.log | gemini ask "Trouve la cause de l'erreur dans ces logs et propose une solution avec les commandes bash pour réparer." -s "Tu es un ingénieur DevOps Senior." -t 0.1
```

---

## ⚙️ 5. Lancement en Mode Auto (Scripts & Batch)

Pour automatiser des processus sans aucune interaction humaine (mode "non-interactif"), la commande `gemini ask` est votre meilleure alliée.

### Exemple de script Bash automatisé (Review de code Git)
Imaginez un script qui s'exécute lors d'un `git commit` pour vérifier la qualité de votre code.

```bash
#!/bin/bash
# script: auto-review.sh

echo "🔍 Analyse du code modifié en cours par Gemini..."

# Récupère les différences (git diff) et les envoie à Gemini
git diff | gemini ask \
  --system "Tu es un relecteur de code très strict. Analyse ce git diff. Si tu vois des failles de sécurité ou du code mort, liste-les. Sinon, réponds 'OK'." \
  --temperature 0.0

if [ $? -eq 0 ]; then
  echo "✅ Analyse terminée."
else
  echo "❌ Erreur lors de l'appel à l'API Gemini."
fi
```

### Script de traitement en masse (Batch avec JSON)
Générer des métadonnées pour plusieurs articles de blog.

```bash
#!/bin/bash

for file in ./articles/*.md; do
  echo "Traitement de $file..."
  
  # On force le format JSON pour l'injecter facilement dans une BDD
  cat "$file" | gemini ask "Génère un résumé de 100 mots et 5 mots-clés." \
    --system "Tu dois répondre UNIQUEMENT avec un objet JSON valide contenant les clés 'resume' et 'mots_cles'." \
    --json > "${file%.md}.json"
done
```

---

## 💡 6. Astuces et "Pro Tips"

### Astuce 1 : Contrôler la température (Prévisibilité vs Créativité)
- **Pour du code, des logs ou des requêtes SQL :** Utilisez `-t 0` ou `-t 0.1` (Le modèle sera déterministe, analytique et n'inventera rien).
- **Pour du brainstorming ou de la rédaction :** Utilisez `-t 0.9` ou `-t 2.5` (Le modèle sera créatif).

### Astuce 2 : Créer des alias Bash/Zsh
Gagnez du temps en créant des alias dans votre profil terminal :
```bash
# Rédacteur de commandes Git
alias gcommit="git diff | gemini ask 'Rédige un message de commit conventionnel (conventional commits) basé sur ce diff. Ne donne que le message.'"

# Assistant Terminal
alias wtf="gemini ask -s 'Tu es un expert Linux. Donne uniquement la commande exacte, sans explication.' "
# Utilisation : wtf "comment trouver tous les fichiers .log de plus de 100Mo"
```

### Astuce 3 : Contourner la limite de tokens (Context Window)
Gemini 2.5 Pro a une fenêtre de contexte massive (jusqu'à 2 millions de tokens). Vous pouvez l'utiliser pour lui faire lire un repo complet.

```bash
# Concatène tout un projet dans un fichier temporaire puis l'envoie à Gemini
find ./src -name "*.js" -exec cat {} + | gemini ask "Fais un audit de sécurité complet de ce code JavaScript." -m gemini-2.5-pro
```

---

## 🚨 Dépannage fréquent

1. **Erreur d'authentification (401 / 403) :** 
   - Vérifiez que `GEMINI_API_KEY` est bien définie : `echo $GEMINI_API_KEY`.
   - Assurez-vous que l'API "Generative Language API" est activée dans votre console Google Cloud.
2. **Quota dépassé (429) :**
   - L'API gratuite de Gemini a des limites de requêtes par minute (RPM). Ajoutez des commandes `sleep 15` dans vos scripts Bash si vous faites des appels en boucle.
3. **Sortie non désirée (Bavardage) :**
   - Ajoutez toujours `--system "Réponds de manière concise, sans markdown, sans bonjour."` si vous voulez réutiliser le résultat (pipe) dans une autre commande Linux.
