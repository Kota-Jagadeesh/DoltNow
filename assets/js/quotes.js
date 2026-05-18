/**
 * ==========================================================================
 * MOTIVATIONAL MANIFESTO & LIVE CLOCK INFRASTRUCTURE (quotes.js)
 * ==========================================================================
 */

const DashboardAnalyticsHeader = {
    quotes: [
        "Small progress is still progress.",
        "Focus on execution velocity, not just activity maps.",
        "Clean structures build clean mind states.",
        "Action is the core foundational key to all operational success.",
        "Break complex tasks down into simple, iterative commits."
    ],

    init() {
        this.renderLiveClock();
        this.cycleManifestoQuote();
        
        // Setup structural execution intervals
        setInterval(() => this.renderLiveClock(), 1000);
        setInterval(() => this.cycleManifestoQuote(), 60000); // Shift quotes every 60 seconds
    },

    renderLiveClock() {
        const clockDisplay = document.getElementById('live-clock-display');
        if (!clockDisplay) return;

        const now = new Date();
        const choices = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockDisplay.innerText = now.toLocaleDateString('en-US', choices);
    },

    cycleManifestoQuote() {
        const quoteElement = document.getElementById('manifesto-quote');
        if (!quoteElement) return;

        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        quoteElement.innerText = `"${this.quotes[randomIndex]}"`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    DashboardAnalyticsHeader.init();
});