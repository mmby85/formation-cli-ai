# AI Coding Agents Masterclass 2026 🚀

Bienvenue dans la formation ultime pour transformer votre workflow de développement via les agents IA. Cette présentation interactive est conçue pour être immersive, modulaire et prête pour le "Vibe Coding".

## 📂 Structure du Projet
- `presentation/index.html` : Le point d'entrée de la Masterclass.
- `presentation/css/` : Design modulaire (Thème, Layout, Animations, Composants).
- `presentation/js/` : Moteurs interactifs (Terminal, Lab PACD, Navigation).
- `presentation/js/constants.js` : **Le fichier à éditer** pour modifier le contenu des démonstrations.

## 🚀 Comment lancer la présentation ?
Puisque le projet utilise des modules CSS et JS, il est préférable de le lancer via un serveur HTTP local pour éviter les restrictions CORS :

### Option 1 : Python (Recommandé)
```bash
python3 -m http.server 8000
```
Puis ouvrez `http://localhost:8000/presentation/`

### Option 2 : Node.js (npx)
```bash
npx serve presentation
```

## 🛠️ Guide de l'instructeur
1. **Introduction :** Laissez le Terminal Hero s'animer pour capter l'attention.
2. **Deep Dives :** Utilisez les slides Gemini, Aider et OpenCode pour expliquer les forces de chaque outil.
3. **Lab PACD :** Faites une démonstration interactive en cliquant sur les étapes P-A-C-D. Montrez comment le fichier `.md` pilote l'IA.
4. **Pratique :** Encouragez les élèves à copier les commandes via le bouton "Copy" et à les tester dans leur propre terminal.

## 📝 Méthodologie PACD
- **Plan :** Écrire l'intention.
- **Act :** Lancer l'agent.
- **Check :** Valider via tests/LSP.
- **Do :** Finaliser et Commit.

---
*© 2026 AI Coding Agents Masterclass - Conçu pour les bâtisseurs de demain.*
