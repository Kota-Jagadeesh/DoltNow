/**
 * ==========================================================================
 * LOCALIZED GRID CALENDAR ITERATOR ENGINE (calendar.js)
 * ==========================================================================
 */

const CalendarEngine = {
    init() {
        this.currentDateContext = new Date(2026, 4, 18); // Synchronized precisely with system context date (May 2026)
        this.selectedDateTracker = new Date(this.currentDateContext);

        this.cacheDOM();
        this.bindEvents();
        this.renderCalendarGrid();
        this.renderDailyAgenda();

        // Listen for real-time task updates
        window.addEventListener('tasksUpdated', () => this.refreshCalendar());
    },

    cacheDOM() {
        this.monthYearLabel = document.getElementById('current-month-year-label');
        this.daysContainer = document.getElementById('calendar-days-container');
        this.agendaContainer = document.getElementById('agenda-items-container');
        this.dateLabel = document.getElementById('selected-date-string-label');
        this.prevBtn = document.getElementById('prev-month-btn');
        this.nextBtn = document.getElementById('next-month-btn');
    },

    bindEvents() {
        if (!this.prevBtn) return;

        this.prevBtn.addEventListener('click', () => this.shiftMonth(-1));
        this.nextBtn.addEventListener('click', () => this.shiftMonth(1));
    },

    shiftMonth(direction) {
        this.currentDateContext.setMonth(this.currentDateContext.getMonth() + direction);
        this.renderCalendarGrid();
    },

    refreshCalendar() {
        this.renderCalendarGrid();
        this.renderDailyAgenda();
    },

    renderCalendarGrid() {
        if (!this.daysContainer) return;
        this.daysContainer.innerHTML = '';

        const year = this.currentDateContext.getFullYear();
        const month = this.currentDateContext.getMonth();

        // Print Month Text Label Content Header strings
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthYearLabel.innerText = `${monthNames[month]} ${year}`;

        // Compute starting weekday index parameters and final numeric day lengths
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDaysCount = new Date(year, month + 1, 0).getDate();

        const todayObj = new Date(2026, 4, 18); // Dynamic static baseline clock
        const tasks = StorageEngine.getTasks();

        // 1. Render empty neighbor paddings for leading month structures
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-node empty-neighbor-month';
            this.daysContainer.appendChild(emptyCell);
        }

        // 2. Loop and generate interactive operational calendar layout blocks
        for (let day = 1; day <= totalDaysCount; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-node';
            dayCell.innerText = day;

            const trackingDateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            
            // Check for matching target events in dataset arrays
            const matchingDayTasks = tasks.filter(t => t.dueDate === trackingDateString);

            if (matchingDayTasks.length > 0) {
                const indicatorRow = document.createElement('div');
                indicatorRow.className = 'task-indicator-row';
                matchingDayTasks.slice(0, 3).forEach(() => {
                    const dot = document.createElement('span');
                    dot.className = 'mini-indicator-dot';
                    indicatorRow.appendChild(dot);
                });
                dayCell.appendChild(indicatorRow);
            }

            // Flag highlights matching specific clock states
            if (day === todayObj.getDate() && month === todayObj.getMonth() && year === todayObj.getFullYear()) {
                dayCell.classList.add('is-today');
            }

            if (day === this.selectedDateTracker.getDate() && month === this.selectedDateTracker.getMonth() && year === this.selectedDateTracker.getFullYear()) {
                dayCell.classList.add('is-selected');
            }

            // Bind contextual interactions to day slots
            dayCell.addEventListener('click', () => {
                // Clear out current structural active flags across all nodes
                document.querySelectorAll('.calendar-day-node').forEach(n => n.classList.remove('is-selected'));
                dayCell.classList.add('is-selected');

                this.selectedDateTracker = new Date(year, month, day);
                this.renderDailyAgenda();
            });

            this.daysContainer.appendChild(dayCell);
        }
    },

    renderDailyAgenda() {
        if (!this.agendaContainer) return;
        this.agendaContainer.innerHTML = '';

        const year = this.selectedDateTracker.getFullYear();
        const month = this.selectedDateTracker.getMonth() + 1;
        const day = this.selectedDateTracker.getDate();
        
        const isoQueryString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        this.dateLabel.innerText = this.selectedDateTracker.toLocaleDateString(undefined, { dateStyle: 'long' });

        const matchingTasks = StorageEngine.getTasks().filter(t => t.dueDate === isoQueryString);

        if (matchingTasks.length === 0) {
            this.agendaContainer.innerHTML = `
                <div class="empty-agenda-notice">
                    <p>No operational entries scheduled for this day tracking slot.</p>
                </div>
            `;
            return;
        }

        matchingTasks.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-node-item ${task.completed ? 'completed-state' : ''}`;
            item.style.cursor = 'default';

            item.innerHTML = `
                <div class="task-left-cluster">
                    <div class="nm-checkbox-container ${task.completed ? 'checked-active' : ''}" onclick="TaskManager ? TaskManager.toggleTaskStatus(${task.id}) : null" style="cursor: pointer;">
                        ${task.completed ? '<i data-lucide="check"></i>' : ''}
                    </div>
                    <div class="task-details-meta">
                        <h4>${task.title}</h4>
                        <div class="task-tags-row">
                            <span class="priority-indicator-pill priority-${task.priority}"></span>
                            <span class="tag-badge">${task.category}</span>
                        </div>
                    </div>
                </div>
                <div class="task-right-cluster">
                    <span class="deadline-stamp"><i data-lucide="clock" style="width:12px; height:12px; display:inline-block; vertical-align:middle; margin-right:4px;"></i>${task.dueTime}</span>
                </div>
            `;
            this.agendaContainer.appendChild(item);
        });

        if (window.lucide) lucide.createIcons();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CalendarEngine.init();
});