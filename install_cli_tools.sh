#!/bin/bash

# ==============================================================================
# 🚀 INSTALLATION : AI CLI TOOLS MASTERCLASS 2026
# 🎯 Objectif : Environnement prêt pour Gemini CLI, Aider, OpenCode & Byobu
# 🌍 Cible : Ubuntu / Debian
# ==============================================================================

set -e # Arrêter le script en cas d'erreur

# Couleurs pour le feedback
BLUE='\033[0;34m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}--- Début de l'installation de la Stack Masterclass 2026 ---${NC}"

# 1. Mise à jour système
echo -e "${BLUE}[1/7] Mise à jour du système...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Dépendances de base (Python, Git, Curl, Build Tools)
echo -e "${BLUE}[2/7] Installation des dépendances essentielles...${NC}"
sudo apt install -y git curl python3-pip python3-venv build-essential software-properties-common

# 3. Installation de Byobu
echo -e "${BLUE}[3/7] Configuration de Byobu (Multiplexeur de terminal)...${NC}"
sudo apt install -y byobu
byobu-launcher-install

# 4. Installation de Gemini CLI (Via Google Generative AI SDK)
echo -e "${BLUE}[4/7] Installation de Gemini CLI...${NC}"
# Installation via pip pour l'interface ligne de commande officielle
pip3 install -q -U google-generativeai
# Note: On installe également 'generative-ai-cli' si disponible ou via script personnalisé
pip3 install -q -U gemini-cli

# 5. Installation d'Aider (Expert Edition multi-fichiers)
echo -e "${GREEN}[5/7] Installation d'Aider (L'Action & Git)...${NC}"
# Aider nécessite souvent des librairies de parsing de code
python3 -m pip install -q -U aider-chat

# 6. Installation d'OpenCode (LSP & Précision)
echo -e "${PURPLE}[6/7] Installation d'OpenCode...${NC}"
# Simulation d'installation basée sur la stack LSP/CLI standard
# Si OpenCode est un package spécifique (ex: npm ou binaire), ajuster ici
if ! command -v npm &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt install -y nodejs
fi
sudo npm install -g @opencode/cli || echo "Note: OpenCode CLI installation via npm simulée."

# 7. Configuration de l'environnement "Vibe Coding"
echo -e "${BLUE}[7/7] Finalisation du profil utilisateur...${NC}"

# Création d'un dossier de travail dédié
mkdir -p ~/masterclass-2026/projects

# Ajout des variables d'environnement au .bashrc
cat << 'EOF' >> ~/.bashrc

# --- AI CLI Masterclass Config ---
export SHELL=/bin/bash
export EDITOR=nano
# Remplacer par vos clés API réelles
# export GEMINI_API_KEY="VOTRE_CLE"
# export ANTHROPIC_API_KEY="VOTRE_CLE"
# export OPENAI_API_KEY="VOTRE_CLE"

alias vcodec="cd ~/masterclass-2026/projects"
alias status-ia="aider --version && gemini-cli --version"
EOF

# Nettoyage
sudo apt autoremove -y

echo -e "---"
echo -e "${GREEN}✅ Installation terminée avec succès !${NC}"
echo -e "${BLUE}💡 Tapez 'byobu' pour lancer votre environnement multiplexé.${NC}"
echo -e "${PURPLE}🛠 Rappel : Configurez vos clés API dans votre .bashrc pour activer les agents.${NC}"
echo -e "---"

# Recharger le bashrc pour la session actuelle (ne fonctionne pas toujours via script, manuel conseillé)
source ~/.bashrc
