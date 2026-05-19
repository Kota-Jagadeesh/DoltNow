const StorageEngine = {
    STORAGE_KEY: 'doitnow_state',


    getInitialState() {
        return {
            user: {
                name: "Kota Jagadeeshwar",
                streak: 3,
                dailyGoal: 5
            },
            tasks: [
                {
                    id: 1716228000000,
                    title: "Submit Modern Android Abstract to ASC Newsletter",
                    category: "Study",
                    priority: "high",
                    dueDate: "2026-05-20",
                    dueTime: "20:00",
                    completed: false
                },
                {
                    id: 1716238800000,
                    title: "Refactor Application Dark Theme Persistence Logic",
                    category: "Work",
                    priority: "medium",
                    dueDate: "2026-05-22",
                    dueTime: "14:30",
                    completed: true
                },
                {
                    id: 1716246000000,
                    title: "Cardio Session and Hydration Check",
                    category: "Health",
                    priority: "low",
                    dueDate: "2026-05-19",
                    dueTime: "07:00",
                    completed: false
                }
            ],
            scratchpad: "Use this physical neumorphic scratchpad to store temporary data pointers, API definitions, or layout adjustments mid-sprint."
        };
    },


    getState() {
        const rawData = localStorage.getItem(this.STORAGE_KEY);
        if (!rawData) {
            const defaultState = this.getInitialState();
            this.saveState(defaultState);
            return defaultState;
        }
        return JSON.parse(rawData);
    },


    saveState(state) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    },


    getTasks() {
        return this.getState().tasks;
    },

    saveTasks(tasksArray) {
        const state = this.getState();
        state.tasks = tasksArray;
        this.saveState(state);
    },


    getScratchpad() {
        return this.getState().scratchpad;
    },

    saveScratchpad(text) {
        const state = this.getState();
        state.scratchpad = text;
        this.saveState(state);
    },


    getUserProfile() {
        return this.getState().user;
    },


    updateUserProfile(profileData) {
        const state = this.getState();
        state.user = { ...state.user, ...profileData };
        this.saveState(state);

        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: state.user }));
    },

    updateUserName(name) {
        this.updateUserProfile({ name });
    },

    updateDailyGoal(goal) {
        this.updateUserProfile({ dailyGoal: goal });
    },

    updateStreak(streak) {
        this.updateUserProfile({ streak });
    }
};