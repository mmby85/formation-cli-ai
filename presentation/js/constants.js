/**
 * CONSTANTS: Les données textuelles du Hero et du PACD
 * Contenu optimisé pour une démonstration réaliste de 2026.
 */

const HERO_LINES = [
    { text: "aider --model gemini/gemini-2.0-flash", type: "command" },
    { text: "✓ Aider v0.65.0 connected to Google Gemini", type: "response", color: "text-blue-400" },
    { text: "✓ Repository Map built (42 files indexed)", type: "response", color: "text-emerald-400" },
    { text: "Agent: 'Comment puis-je vous aider sur ce projet ?'", type: "response", italic: true },
    { text: "Refactorise le middleware d'auth pour utiliser des tokens JWT asymétriques.", type: "command" },
    { text: "✓ Recherche des dépendances dans lib/auth.js...", type: "response", color: "text-slate-500" },
    { text: "✓ Modification de 3 fichiers. Exécution des tests...", type: "response", color: "text-emerald-500" },
    { text: "✓ Tests passés. Commit généré: 'refactor: switch to asymmetric JWT'", type: "response", color: "text-emerald-400" }
];

const PACD_STEPS = {
    'P': {
        file: 'mission_email_notification.md',
        md: `<span class="text-blue-400"># CAS CONCRET: Système de Notifications Email</span><br/><br/>
             <span class="text-slate-500">## CONTEXTE:</span><br/>
             Les utilisateurs n'ont pas de retour après inscription. Besoin d'un email de confirmation.<br/><br/>
             <span class="text-blue-400">## RÔLE DES OUTILS:</span><br/>
             <span class="text-blue-300">🔍 Gemini:</span> Analyse le codebase existant et les dépendances<br/>
             <span class="text-emerald-300">🐙 Aider:</span> Génère le code multi-fichiers<br/>
             <span class="text-purple-300">⚡ OpenCode:</span> Vérifie les types et la syntaxe`,
        term: `<span class="text-blue-400">$</span> gemini "Analyse le projet et propose un plan pour ajouter des emails de confirmation"<br/><br/>
               <span class="text-slate-400">● Recherche dans 847 fichiers...</span><br/>
               <span class="text-emerald-400">✓</span> 3 points d'entrée identifiés dans /routes<br/>
               <span class="text-blue-400">→</span> Nodemailer recommandé pour l'envoi SMTP`,
        status: '🔍 PLAN'
    },
    'A': {
        file: 'mission_email_notification.md',
        md: `<span class="text-emerald-400 font-bold"># PHASE D'EXÉCUTION</span><br/><br/>
             <span class="text-slate-500">## Fichiers modifiés:</span><br/>
             - <span class="mono">services/email.js</span> (nouveau)<br/>
             - <span class="mono">routes/auth.js</span> (hook post-inscription)<br/>
             - <span class="mono">templates/welcome.html</span> (template email)<br/>
             - <span class="mono">package.json</span> (nodemailer)<br/><br/>
             <span class="text-emerald-500 italic">"Code généré et testé automatiquement..."</span>`,
        term: `<span class="text-emerald-500">$</span> aider services/email.js routes/auth.js --message "Ajoute l'envoi d'email après inscription"<br/><br/>
               <span class="text-blue-400">Aider:</span> Création de services/email.js<br/>
               <span class="text-slate-400">●</span> Intégration dans routes/auth.js...<br/>
               <span class="text-emerald-400">✓ 4 fichiers modifiés</span><br/>
               <span class="text-blue-400">→</span> Tests exécutés: 12/12 passés`,
        status: '🐙 ACT'
    },
    'C': {
        file: 'verification_audit.md',
        md: `<span class="text-purple-400 font-bold"># VÉRIFICATION MULTI-OUTIL</span><br/><br/>
             <span class="text-blue-300">🔍 Gemini Search:</span> Doc Nodemailer à jour ✓<br/>
             <span class="text-purple-300">⚡ OpenCode LSP:</span> 0 erreurs de type ✓<br/>
             <span class="text-emerald-300">🐙 Aider Tests:</span> Intégration vérifiée ✓<br/><br/>
             <span class="text-slate-500 italic">"Triple vérification pour zero régression."</span>`,
        term: `<span class="text-purple-500">$</span> opencode verify --lsp<br/>
               <span class="text-white">Analyse TypeScript...</span><br/>
               <span class="bg-emerald-600 text-white px-2">✓</span> EmailService types: OK<br/>
               <span class="bg-emerald-600 text-white px-2">✓</span> Template variables: OK<br/><br/>
               <span class="text-blue-500">$</span> gemini "Vérifie la doc Nodemailer"<br/>
               <span class="text-emerald-400">→</span> API Nodemailer 6.x confirmée`,
        status: '⚡ CHECK'
    },
    'D': {
        file: 'deployment_summary.md',
        md: `<span class="text-red-400 font-bold"># MISSION COMPLÉTÉE</span><br/><br/>
             <span class="text-emerald-400">✓</span> Code mergé dans main<br/>
             <span class="text-emerald-400">✓</span> Pipeline CI/CD: VERT<br/>
             <span class="text-emerald-400">✓</span> Email envoyé au déploiement<br/><br/>
             <span class="text-slate-400 italic">"Les 3 outils ont collaboré en harmonie."</span>`,
        term: `<span class="text-emerald-500">$</span> aider /commit "feat: add email notification on signup"<br/>
               <span class="text-emerald-400">✓ Commit créé et pushé</span><br/><br/>
               <span class="text-white font-bold"># 🔄 Cycle PACD prêt pour la prochaine feature</span><br/>
               <span class="text-slate-400 italic">→ Prochaine étape: Tests A/B par email?</span>`,
        status: '🚀 DO'
    }
};
