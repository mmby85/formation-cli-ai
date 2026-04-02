/**
 * UTILS: Fonctions utilitaires (Copy, Cursor, Reveal)
 */

// 1. Initialisation du Presse-papier
function initClipboard() {
    document.querySelectorAll('.code-block').forEach(block => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn px-3 py-1 bg-slate-800 text-slate-400 rounded-md text-[10px] mono border border-white/10 hover:bg-emerald-500 hover:text-white transition-all';
        btn.innerHTML = '<span>Copy</span>';
        block.appendChild(btn);

        btn.addEventListener('click', () => {
            const text = block.innerText.replace('Copy', '').trim().replace('$ ', '');
            navigator.clipboard.writeText(text);
            btn.innerHTML = '<span class="flex items-center gap-1 text-emerald-400 animate-pulse">✓ Copied!</span>';
            setTimeout(() => btn.innerHTML = '<span>Copy</span>', 2000);
        });
    });
}

// 2. Curseur Personnalisé
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.classList.add('active');
        cursor.style.left = e.clientX - 7 + 'px';
        cursor.style.top = e.clientY - 7 + 'px';
    });

    document.addEventListener('mousedown', () => cursor.style.transform = 'scale(0.8)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'scale(1)');
}

// 3. Section Reveal Observer
function initSectionReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section').forEach(s => observer.observe(s));
}

function initVibeMeter() {
    const checks = document.querySelectorAll('.vibe-check');
    const bar = document.getElementById('vibe-bar');
    const status = document.getElementById('vibe-status');
    if (!bar || !status) return;

    const update = () => {
        let score = 0;
        checks.forEach(c => { if(c.checked) score += parseInt(c.dataset.weight); });
        bar.style.width = score + '%';
        if(score === 0) status.innerText = "Current Vibe: Needs structure...";
        else if(score < 50) status.innerText = "Current Vibe: Getting warmer...";
        else if(score < 100) status.innerText = "Current Vibe: Highly Agentic!";
        else status.innerText = "Current Vibe: PURE FLOW STATE 🚀";
    };

    checks.forEach(c => c.addEventListener('change', update));
}
