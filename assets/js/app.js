function syncProfileDisplay() {
    const profile = StorageEngine.getUserProfile();
    const nameDisplay = document.getElementById('profile-name-display');
    const streakDisplay = document.getElementById('profile-streak-display');
    const avatarDisplay = document.getElementById('sidebar-avatar-placeholder');

    if (nameDisplay) nameDisplay.innerText = profile.name;
    if (streakDisplay) streakDisplay.innerText = `🔥 ${profile.streak} Day Streak`;
    if (avatarDisplay) avatarDisplay.innerText = profile.name.charAt(0).toUpperCase();
}

function updateActiveMenuState() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('href');
        item.classList.toggle('active', href === currentPage);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    syncProfileDisplay();


    updateActiveMenuState();


    const scratchpad = document.getElementById('scratchpad-textarea');
    if (scratchpad) {

        scratchpad.value = StorageEngine.getScratchpad();


        scratchpad.addEventListener('input', (e) => {
            StorageEngine.saveScratchpad(e.target.value);
        });
    }


    window.addEventListener('profileUpdated', (event) => {
        syncProfileDisplay();
    });


    window.addEventListener('tasksUpdated', (event) => {
        syncProfileDisplay();
    });

    console.log("🚀 DoItNow Application Engine core synchronization loops successfully linked.");
});