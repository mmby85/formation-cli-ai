/**
 * TERMINAL: Moteur du Hero et Initialisation Globale
 */
async function runHeroTerminal() {
    const container = document.getElementById('hero-terminal');
    if(!container) return;

    for (const line of HERO_LINES) {
        const p = document.createElement('p');
        p.className = 'mb-1';
        if (line.type === 'command') p.classList.add('command-line');
        if (line.color) p.classList.add(line.color);
        if (line.italic) p.classList.add('italic', 'mt-4', 'text-slate-500');
        container.appendChild(p);

        for (let i = 0; i < line.text.length; i++) {
            p.innerHTML += line.text.charAt(i);
            await new Promise(r => setTimeout(r, 25));
        }
        await new Promise(r => setTimeout(r, 600));
    }
}

// Initialisation de tous les modules UX
window.onload = () => {
    runHeroTerminal();
    initClipboard();
    initCustomCursor();
    initSectionReveal();
    if (typeof initPageActiveDots === 'function') initPageActiveDots();
    initVibeMeter(); // New
    if (typeof setPACD === 'function') setPACD('P'); // Initialize first step
};
