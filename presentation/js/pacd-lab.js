/**
 * PACD LAB: Moteur du simulateur interactif.
 * Dépend de PACD_STEPS dans constants.js.
 * Amélioration : Particules colorées par étape.
 */
function setPACD(step) {
    const data = PACD_STEPS[step];
    if(!data) return;

    // UI Updates
    document.getElementById('filename').innerText = `📜 ` + data.file;
    document.getElementById('md-content').innerHTML = data.md;
    document.getElementById('terminal-content').innerHTML = data.term;
    document.getElementById('terminal-status').innerText = data.status;

    // Update File Explorer Tabs
    const explorer = document.getElementById('file-explorer');
    if(explorer) {
        explorer.innerHTML = '';
        const files = ['PLAN.md', 'main.py', 'test_notifications.py', 'api.js'];
        files.forEach(f => {
            const isCurrent = data.file.includes(f);
            const tab = document.createElement('div');
            tab.className = `px-3 py-1 rounded-t text-[9px] mono border-t border-x transition-all ${isCurrent ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-slate-900/50 border-white/5 text-slate-600 opacity-50'}`;
            tab.innerText = f;
            explorer.appendChild(tab);
        });
    }

    // Buttons
    document.querySelectorAll('.pacd-step-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-500/10', 'bg-emerald-500/10', 'bg-purple-500/10', 'bg-red-500/10');
    });

    const activeBtn = document.getElementById('btn-' + step);
    if(activeBtn) {
        activeBtn.classList.add('active');
        const colorClass = step === 'P' ? 'bg-blue-500/10' : 
                           step === 'A' ? 'bg-emerald-500/10' : 
                           step === 'C' ? 'bg-purple-500/10' : 'bg-red-500/10';
        activeBtn.classList.add(colorClass);
    }

    triggerPACDParticles(step);
}

function triggerPACDParticles(step) {
    const container = document.getElementById('pacd-animation');
    if(!container) return;
    
    container.innerHTML = '';
    const colors = { P: '#3b82f6', A: '#10b981', C: '#a855f7', D: '#ef4444' };
    
    // Create Explosion Effect
    for(let i=0; i<20; i++) {
        const p = document.createElement('div');
        p.className = 'absolute w-1 h-1 rounded-full shadow-[0_0_10px_currentColor]';
        p.style.background = colors[step];
        p.style.color = colors[step];
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        
        // Random velocity
        const vx = (Math.random() - 0.5) * 300;
        const vy = (Math.random() - 0.5) * 300;
        
        p.animate([
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], { duration: 1200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', iterations: 1 });
        
        container.appendChild(p);
    }
}
