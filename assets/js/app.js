/**
 * ==========================================================================
 * SYSTEM GLOBAL INITIALIZER (app.js)
 * ==========================================================================
 */

// Global function to sync profile across all pages
function syncProfileDisplay() {
    const profile = StorageEngine.getUserProfile();
    const nameDisplay = document.getElementById('profile-name-display');
    const streakDisplay = document.getElementById('profile-streak-display');
    const avatarDisplay = document.getElementById('sidebar-avatar-placeholder');

    if (nameDisplay) nameDisplay.innerText = profile.name;
    if (streakDisplay) streakDisplay.innerText = `🔥 ${profile.streak} Day Streak`;
    if (avatarDisplay) avatarDisplay.innerText = profile.name.charAt(0).toUpperCase();
}

// Update active menu item based on current page
function updateActiveMenuState() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('href');
        item.classList.toggle('active', href === currentPage);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize profile display
    syncProfileDisplay();
    
    // Set active menu state
    updateActiveMenuState();

    // 1. Initialize scratchpad cache handling
    const scratchpad = document.getElementById('scratchpad-textarea');
    if (scratchpad) {
        // Hydrate from storage on initial page load
        scratchpad.value = StorageEngine.getScratchpad();

        // Listen for input events and save updates back to storage
        scratchpad.addEventListener('input', (e) => {
            StorageEngine.saveScratchpad(e.target.value);
        });
    }

    // 2. Listen for profile updates from any source
    window.addEventListener('profileUpdated', (event) => {
        syncProfileDisplay();
    });

    // 3. Listen for task updates to trigger analytics/calendar refresh
    window.addEventListener('tasksUpdated', (event) => {
        syncProfileDisplay(); // Sync profile in case metrics changed
    });

    console.log("🚀 DoItNow Application Engine core synchronization loops successfully linked.");
});