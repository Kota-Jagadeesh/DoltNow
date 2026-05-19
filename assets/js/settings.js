const SettingsPanelEngine = {
    init() {
        this.cacheDOM();
        this.hydrateFields();
        this.bindEvents();
    },

    cacheDOM() {
        this.form = document.getElementById('profile-settings-form');
        this.usernameInput = document.getElementById('settings-username');
        this.goalInput = document.getElementById('settings-daily-goal');
        this.clearTasksBtn = document.getElementById('clear-tasks-action-btn');
        this.factoryResetBtn = document.getElementById('factory-reset-action-btn');
    },

    hydrateFields() {

        const currentProfile = StorageEngine.getUserProfile();

        if (this.usernameInput) this.usernameInput.value = currentProfile.name || '';
        if (this.goalInput) this.goalInput.value = currentProfile.dailyGoal || 5;
    },

    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleProfileSave(e));
        }

        if (this.clearTasksBtn) {
            this.clearTasksBtn.addEventListener('click', () => this.handleClearTasksCache());
        }

        if (this.factoryResetBtn) {
            this.factoryResetBtn.addEventListener('click', () => this.handleFactoryReset());
        }
    },

    handleProfileSave(e) {
        e.preventDefault();

        const updatedName = this.usernameInput.value.trim();
        const updatedGoal = parseInt(this.goalInput.value, 10);


        StorageEngine.updateUserProfile({
            name: updatedName,
            dailyGoal: updatedGoal
        });

        ToastNotification.show("✅ Identity parameters updated successfully", "success");


        const nameDisplay = document.getElementById('profile-name-display');
        if (nameDisplay) nameDisplay.innerText = updatedName;

        const avatarSlot = document.getElementById('sidebar-avatar-placeholder');
        if (avatarSlot && updatedName.length > 0) {
            avatarSlot.innerText = updatedName.charAt(0).toUpperCase();
        }
    },

    handleClearTasksCache() {
        if (!confirm("Are you sure you want to flush all allocated task data arrays? This action preserves your profile fields.")) return;

        StorageEngine.saveTasks([]);
        ToastNotification.show("Task logs cleaned successfully", "warning");
    },

    handleFactoryReset() {
        if (!confirm("CRITICAL ENFORCEMENT: Reset full application parameters? All custom configurations, notes, and records will be dropped.")) return;

        localStorage.removeItem(StorageEngine.STORAGE_KEY);
        ToastNotification.show("Platform data scrubbed. Reloading engine...", "error");


        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SettingsPanelEngine.init();
});