Voici une version considérablement enrichie et approfondie du guide OpenCode. Ce document est structuré pour servir de référence technique complète, de la configuration avancée aux stratégies d'automatisation.

---

# 📘 Manuel de Référence Avancé : OpenCode.ai

OpenCode n'est pas seulement un assistant de code, c'est un **environnement d'exécution d'agents autonomes**. Il permet de déléguer des cycles entiers de développement (Planification -> Codage -> Test -> Correction).

---

## 🛠️ 1. Installation et Configuration Profonde

### Installation Multi-Environnement
```bash
# Via NPM (Recommandé pour les projets JS/TS)
npm install -g @opencode/sdk @opencode/cli

# Via PIP (Pour les workflows Data Science/Python)
pip install opencode-python-sdk

# Vérification de l'installation
opencode --version
```

### Configuration des Variables d'Environnement
Pour éviter de passer les clés en argument, configurez votre fichier `.env` global ou votre export shell :
```bash
export OPENCODE_API_KEY="votre_cle_ici"
export OPENCODE_PROJECT_ID="id_de_votre_projet"
export OPENCODE_DEFAULT_MODEL="gpt-4-turbo-preview" # ou Claude-3-Opus
```

---

## ⌨️ 2. Lexique Complet des Commandes (CLI)

### Gestion du Contexte & Projet
| Commande | Description | Option Avancée |
| :--- | :--- | :--- |
| `opencode init` | Initialise le fichier `.opencode.json` | `--force` pour écraser |
| `opencode context status` | Affiche ce que l'IA "voit" actuellement | `--tokens` pour voir la consommation |
| `opencode context add <path>` | Ajoute manuellement un fichier/dossier au contexte | `--recursive` |
| `opencode context clear` | Vide la mémoire de travail de l'IA | |

### Interaction Agentique (Le cœur du système)
| Commande | Description | Exemple |
| :--- | :--- | :--- |
| `opencode ask "question"` | Question simple sans modification de fichier | `opencode ask "Explique ce pattern"` |
| `opencode task "instruction"` | Exécute une modification de code | `opencode task "Ajoute Stripe"` |
| `opencode plan "instruction"` | Génère uniquement un plan d'action (YAML/MD) | `opencode plan "Refonte API"` |
| `opencode apply <plan_id>` | Applique un plan précédemment généré | |

### Debug & Qualité
| Commande | Description |
| :--- | :--- |
| `opencode debug "cmd"` | Exécute une commande et répare automatiquement en cas d'échec |
| `opencode audit` | Scan de sécurité et de performance complet |
| `opencode spec` | Génère la documentation technique à partir du code |

---

## 🛡️ 3. Permissions, Sécurité et Politiques (Policies)

OpenCode utilise un système de **Sandbox** (Bac à sable). Vous devez définir explicitement ce que l'agent a le droit de faire dans le fichier `opencode.policy.json`.

### Exemple de configuration de sécurité stricte
```json
{
  "version": "1.0",
  "trust_level": "medium",
  "capabilities": {
    "fs": {
      "allow_read": ["./src", "./tests", "package.json"],
      "allow_write": ["./src/generated", "./docs"],
      "deny": [".env", "node_modules/", "/etc/passwd"]
    },
    "network": {
      "enabled": true,
      "domains": ["api.github.com", "registry.npmjs.org"],
      "block_all_others": true
    },
    "process": {
      "allow_exec": ["npm test", "jest", "eslint"],
      "interactive": false
    }
  },
  "privacy": {
    "pii_redaction": true,
    "telemetry": false
  }
}
```

### Modes de validation
- **Mode Strict :** Chaque écriture de fichier demande une confirmation `(y/n)`.
- **Mode Grant :** L'IA a les droits d'écriture mais pas d'exécution de scripts.
- **Mode Full-Auto :** Droits totaux (à utiliser uniquement dans des conteneurs Docker).

---

## 🤖 4. Mode Automatique (Autonomous Mode)

Le mode automatique permet de lancer l'IA sur une tâche longue sans intervention.

### Commande de lancement auto
```bash
opencode task "Migre le projet de Express vers Fastify" \
  --auto-mode \
  --max-steps 20 \
  --retry-on-error \
  --think-first
```

### Utilisation de Prompts de Système Personnalisés
Vous pouvez créer un fichier `.opencode/agent.prompt` pour définir la personnalité de l'IA :
```markdown
# Agent Profile: Senior Security Architect
- Priorise la sécurité sur la concision.
- Utilise toujours des types stricts.
- Vérifie systématiquement les injections SQL avant de valider un fichier.
- Format de sortie : Toujours inclure un mini-rapport de changement.
```

---

## 🚀 5. Cas d'Utilisation Concrets

### Cas A : Correction de Pipeline CI/CD
**Problème :** Le build échoue sur GitHub Actions de manière aléatoire.
**Commande :**
```bash
opencode debug "npm run build" --logs-dir ./logs --deep-search
```
*L'IA va lire les logs, identifier la race condition, modifier le script de build et relancer jusqu'à succès.*

### Cas B : Documentation de Code Legacy
**Problème :** 50 fichiers sans aucun commentaire ni README.
**Commande :**
```bash
opencode task "Génère des JSDoc pour chaque fonction et crée un fichier README.md détaillé dans chaque sous-dossier" --bulk
```

### Cas C : Création de Tests de Régression
**Commande :**
```bash
opencode task "Analyse les 3 derniers commits et génère les tests unitaires correspondants pour éviter les régressions."
```

---

## 💡 6. Astuces de "Power User"

1. **Le Pipe Magique :**
   Envoyez la sortie d'une commande directement à OpenCode :
   `cat error.log | opencode ask "Analyse cette erreur et propose un fix"`

2. **Mode "Dry-Run" :**
   Utilisez toujours `--dry-run` lors d'une première tâche complexe pour voir quels fichiers l'IA a l'intention de toucher.

3. **Context Clipping (Économie de tokens) :**
   Utilisez un fichier `.opencodeignore` (similaire au .gitignore) pour empêcher l'IA de lire des fichiers inutiles comme les images, les minified JS ou les gros datasets CSV.

4. **Changement d'Agent à la volée :**
   `opencode switch --agent frontend` (Si vous avez configuré plusieurs profils d'IA).

---

## 📝 7. Cheatsheet Récapitulative

| Objectif | Commande |
| :--- | :--- |
| **Login** | `opencode auth login` |
| **Aide** | `opencode help` |
| **Nouveau composant** | `opencode task "Crée un composant React <Name> avec Tailwind"` |
| **Expliquer erreur** | `opencode ask "Pourquoi j'ai une erreur 403 ici ?"` |
| **Refactor** | `opencode task "Refactorise cette classe pour utiliser le pattern Strategy"` |
| **Review** | `opencode review --diff origin/main` |
| **Nettoyer** | `opencode context clear` |
| **Auto-Fix** | `opencode fix --file src/app.ts` |

---

> **Attention :** En mode automatique (`--auto-mode`), assurez-vous que votre projet est versionné avec Git. Utilisez `git add . && git commit` avant de lancer une tâche majeure afin de pouvoir `git reset --hard` si l'IA produit un résultat inattendu.
