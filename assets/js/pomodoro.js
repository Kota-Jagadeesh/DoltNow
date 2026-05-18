/**
 * ==========================================================================
 * POMODORO FOCUS TIMER ENGINE ENGINE (pomodoro.js)
 * ==========================================================================
 */

const PomodoroTimer = {
    init() {
        this.durationFocus = 25 * 60; // 25 Minutes mapped to physical seconds
        this.durationBreak = 5 * 60;  // 5 Minute break cycle mapping
        this.timeLeft = this.durationFocus;
        this.timerIntervalId = null;
        this.isBreakModeActive = false;

        this.cacheDOM();
        this.bindEvents();
        this.updateUI();
    },

    cacheDOM() {
        this.countdownText = document.getElementById('pomo-time-countdown');
        this.stateLabel = document.getElementById('pomo-state-label');
        this.startBtn = document.getElementById('pomo-start-btn');
        this.pauseBtn = document.getElementById('pomo-pause-btn');
        this.resetBtn = document.getElementById('pomo-reset-btn');
    },

    bindEvents() {
        if (!this.startBtn) return;

        this.startBtn.addEventListener('click', () => this.startSession());
        this.pauseBtn.addEventListener('click', () => this.pauseSession());
        this.resetBtn.addEventListener('click', () => this.resetSession());
    },

    startSession() {
        if (this.timerIntervalId !== null) return; // Prevent multiple concurrent loop allocations

        this.startBtn.classList.add('checked-active');
        this.pauseBtn.classList.remove('checked-active');

        // Capture starting timestamp parameters to calculate true time differentials
        const endTimestamp = Date.now() + (this.timeLeft * 1000);

        this.timerIntervalId = setInterval(() => {
            const remainingSeconds = Math.round((endTimestamp - Date.now()) / 1000);
            
            if (remainingSeconds <= 0) {
                this.timeLeft = 0;
                this.updateUI();
                this.handleCycleCompletion();
            } else {
                this.timeLeft = remainingSeconds;
                this.updateUI();
            }
        }, 200); // High-frequency operational sampling loop ensures accurate countdown display
    },

    pauseSession() {
        if (this.timerIntervalId === null) return;

        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;

        this.pauseBtn.classList.add('checked-active');
        this.startBtn.classList.remove('checked-active');
        ToastNotification.show("Focus clock suspended", "info");
    },

    resetSession() {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;
        this.isBreakModeActive = false;
        this.timeLeft = this.durationFocus;

        this.startBtn.classList.remove('checked-active');
        this.pauseBtn.classList.remove('checked-active');
        
        ToastNotification.show("Focus intervals reset to standard limits", "warning");
        this.updateUI();
    },

    handleCycleCompletion() {
        clearInterval(this.timerIntervalId);
        this.timerIntervalId = null;

        this.startBtn.classList.remove('checked-active');

        if (!this.isBreakModeActive) {
            ToastNotification.show("Deep Focus Block Complete! Take a break. 🎉", "success");
            this.isBreakModeActive = true;
            this.timeLeft = this.durationBreak;
        } else {
            ToastNotification.show("Break concluded. Initializing next Focus interval...", "info");
            this.isBreakModeActive = false;
            this.timeLeft = this.durationFocus;
        }

        this.updateUI();
        this.startSession(); // Automatically transition and spin up next sequential clock cycle
    },

    updateUI() {
        if (!this.countdownText) return;

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.countdownText.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.stateLabel) {
            this.stateLabel.innerText = this.isBreakModeActive ? "Mental Recuperation Break" : "Deep Focus Block";
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PomodoroTimer.init();
});