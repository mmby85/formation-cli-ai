/**
 * NAVIGATION: Manages progress bar, scroll-dotting for sections, and global page navigation active states.
 */
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const bar = document.getElementById("progress-bar");
    if(bar) bar.style.width = scrolled + "%";

    // Only update section dots if on index.html, as other pages don't have internal sections to highlight
    if (window.location.pathname.split('/').pop() === 'index.html') {
        updateSectionActiveDots(winScroll);
    }
}, { passive: true });

/**
 * Updates the active state of navigation dots based on the current scroll position.
 * This is primarily for in-page section navigation within index.html.
 * @param {number} scrollPos - The current vertical scroll position.
 */
function updateSectionActiveDots(scrollPos) {
    const sections = document.querySelectorAll('section');
    let currentSectionId = "";

    // Determine the current visible section
    sections.forEach(section => {
        // We consider a section active if its top is within 200px of the viewport top
        // and its bottom hasn't scrolled past the viewport top by 200px
        if (scrollPos >= section.offsetTop - 200 && scrollPos < section.offsetTop + section.offsetHeight - 200) {
            currentSectionId = section.getAttribute('id');
        }
    });

    // Default to the first section if at the very top and no other section is active
    if (!currentSectionId && sections.length > 0 && scrollPos < sections[0].offsetTop - 200) {
        currentSectionId = sections[0].getAttribute('id');
    }

    // Toggle 'active' class for dots linking to sections within index.html
    document.querySelectorAll('.nav-dot').forEach(dot => {
        const dotHref = dot.getAttribute('href');
        // Check if the href points to a section within index.html
        if (dotHref && (dotHref.startsWith('index.html#') || dotHref === 'index.html')) {
            const targetSection = dotHref.split('#')[1] || 'intro'; // Default to 'intro' if just 'index.html'
            dot.classList.toggle('active', targetSection === currentSectionId);
        }
    });
}

/**
 * Initializes the active state for global navigation dots based on the current page URL.
 * This handles navigation between different HTML pages (e.g., index.html vs pratique.html).
 */
function initPageActiveDots() {
    const currentPagePath = window.location.pathname.split('/').pop(); // e.g., "index.html" or "pratique.html"

    document.querySelectorAll('.nav-dot').forEach(dot => {
        const dotHref = dot.getAttribute('href');
        
        if (dotHref) {
            // Extract the filename from the dot's href (ignoring hash for comparison)
            const linkPath = dotHref.split('/').pop().split('#')[0]; 
            
            if (linkPath === currentPagePath) {
                // For index.html, only activate the "#intro" link by default on initial load
                // The scroll handler will manage other internal sections.
                if (currentPagePath === 'index.html') {
                    if (dotHref === 'index.html#intro' || dotHref === 'index.html') { // Check for explicit #intro or just index.html
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active'); // Ensure other internal links are inactive on initial page load
                    }
                } else {
                    // For other pages like pratique.html, activate its specific nav-dot
                    dot.classList.add('active');
                }
            } else {
                dot.classList.remove('active'); // Ensure other page links are inactive
            }
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initPageActiveDots(); // Set active dot for the current page
    // If on index.html, also update section dots based on initial scroll
    if (window.location.pathname.split('/').pop() === 'index.html') {
        updateSectionActiveDots(window.scrollY);
    }
});
