# AI CLI Tools Masterclass 2026 🚀

Bienvenue dans la formation ultime pour maîtriser les agents IA en ligne de commande. Cette présentation interactive est conçue pour être immersive, modulaire et optimisée pour le "Vibe Coding".

## 📂 Structure du Projet
- `index.html` : Le point d'entrée de la Masterclass (racine `/public`).
- `presentation/` : Ressources de la présentation (CSS, JS, animations).
- `presentation/js/constants.js` : **Le fichier central** pour modifier le contenu des démonstrations et du Lab.
- `presentation/pratique.html` : Hub des projets pratiques et cas d'usage réels (SOS Village).
- `cheatsheets/` : Guides de référence rapide pour Gemini, Aider et OpenCode.

## 🚀 Comment lancer la présentation ?
Pour éviter les restrictions CORS liées aux modules JS/CSS, lancez la présentation via un serveur local depuis le dossier `public/` :

### Option 1 : Python (Recommandé)
```bash
python3 -m http.server 8000
```
Puis ouvrez `http://localhost:8000`

### Option 2 : Node.js (npx)
```bash
npx serve .
```

## 🛠️ Contenu de la Formation
1. **The Trinity :** Comparatif détaillé entre Gemini CLI (Contexte), Aider (Git-First) et OpenCode (LSP/Précision).
2. **Vibe Coding :** Méthodologie pour structurer vos projets (README-driven) afin de les rendre "IA-friendly".
3. **Beyond Code :** Exploration de 10 cas d'usage non-IT (Audit, RH, Édition, Marketing) utilisant les mêmes outils CLI.
4. **Lab PACD :** Simulation interactive d'un workflow complet de développement.
5. **Pitfalls :** Identification et gestion des hallucinations, de la saturation de contexte et de la dette technique.

## 📝 Méthodologie PACD
- **Plan :** Définir l'intention et l'architecture (via Gemini/Audit).
- **Act :** Exécution chirurgicale (via Aider/OpenCode).
- **Check :** Validation rigoureuse (Tests, LSP, Lint).
- **Do :** Finalisation, documentation et déploiement.

## 👨‍🏫 Guide de l'instructeur
1. **Intro :** Laissez le Terminal Hero s'animer pour poser le cadre "Choose Your Weapon".
2. **Démonstration :** Utilisez le sélecteur "Vibe Meter" pour illustrer l'importance de la structure.
3. **Cas concrets :** Parcourez la section "Beyond Code" pour montrer que la CLI est un outil universel.
4. **Pratique :** Orientez les apprenants vers `pratique.html` pour les exercices mains-on.

---
*© 2026 AI CLI Tools Masterclass - Conçu pour les bâtisseurs de demain.*
