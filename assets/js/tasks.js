/**
 * ==========================================================================
 * CORE TASK LIFECYCLE MANAGEMENT ENGINE (tasks.js)
 * ==========================================================================
 */

const TaskManager = {
    // Bootstraps state parameters and hooks click boundaries
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
    },

    cacheDOM() {
        this.modal = document.getElementById('task-creation-modal');
        this.openModalBtn = document.getElementById('open-task-modal-btn');
        this.closeModalBtn = document.getElementById('close-task-modal-btn');
        this.cancelModalBtn = document.getElementById('cancel-modal-action-btn');
        this.form = document.getElementById('task-node-creation-form');
        this.taskListContainer = document.getElementById('task-list-container');
        
        // Metrics DOM Bindings
        this.statTotal = document.getElementById('stat-total-tasks');
        this.statPending = document.getElementById('stat-pending-tasks');
        this.statCompleted = document.getElementById('stat-completed-tasks');
        this.statGoal = document.getElementById('stat-daily-goal');
        this.goalProgressFill = document.getElementById('goal-progress-fill');
    },

    bindEvents() {
        // Modal Visibility Triggers (only on pages that have task creation modal)
        if (this.openModalBtn) this.openModalBtn.addEventListener('click', () => this.toggleModal(true));
        if (this.closeModalBtn) this.closeModalBtn.addEventListener('click', () => this.toggleModal(false));
        if (this.cancelModalBtn) this.cancelModalBtn.addEventListener('click', () => this.toggleModal(false));
        
        // Form intercept submission logic (only on pages that have task form)
        if (this.form) this.form.addEventListener('submit', (e) => this.handleTaskCreation(e));
    },

    toggleModal(show) {
        if (show) {
            // Set input defaults to current time boundary
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('task-date-input').value = today;
            this.modal.classList.add('is-visible');
        } else {
            this.modal.classList.remove('is-visible');
            this.form.reset();
        }
    },

    handleTaskCreation(e) {
        e.preventDefault();

        const title = document.getElementById('task-title-input').value.trim();
        const category = document.getElementById('task-category-select').value;
        const priority = document.getElementById('task-priority-select').value;
        const dueDate = document.getElementById('task-date-input').value;
        const dueTime = document.getElementById('task-time-input').value;

        const newTask = {
            id: Date.now(), // Unique structural time tracker identifier
            title,
            category,
            priority,
            dueDate,
            dueTime,
            completed: false
        };

        const currentTasks = StorageEngine.getTasks();
        currentTasks.unshift(newTask); // Push tracking node into front execution pipeline
        StorageEngine.saveTasks(currentTasks);

        ToastNotification.show("Action node committed successfully!", "success");
        this.toggleModal(false);
        this.render();
        
        // Optional dispatch hook for local system modules like Search or Sort pipelines
        window.dispatchEvent(new Event('tasksUpdated'));
    },

    toggleTaskStatus(id) {
        const currentTasks = StorageEngine.getTasks();
        const updatedTasks = currentTasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
                if (task.completed) {
                    ToastNotification.show("✨ Task marked complete 🎉", "success");
                } else {
                    ToastNotification.show("↩️  Task operational state restored", "info");
                }
            }
            return task;
        });
        StorageEngine.saveTasks(updatedTasks);
        this.render();
        window.dispatchEvent(new Event('tasksUpdated'));
    },

    deleteTask(id) {
        if (!confirm("Are you sure you want to remove this operational task node?")) return;
        
        const currentTasks = StorageEngine.getTasks();
        const filteredTasks = currentTasks.filter(task => task.id !== id);
        StorageEngine.saveTasks(filteredTasks);

        ToastNotification.show("Task scrubbed from memory logs", "warning");
        this.render();
        window.dispatchEvent(new Event('tasksUpdated'));
    },

    calculateMetrics(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        const profile = StorageEngine.getUserProfile();
        const currentDailyGoal = profile.dailyGoal || 5;
        const completionPercentage = total > 0 ? Math.round((completed / currentDailyGoal) * 100) : 0;
        const boundedPercentage = Math.min(completionPercentage, 100);

        // Update DOM displays safely
        if (this.statTotal) this.statTotal.innerText = total;
        if (this.statPending) this.statPending.innerText = pending;
        if (this.statCompleted) this.statCompleted.innerText = completed;
        if (this.statGoal) this.statGoal.innerText = `${completionPercentage}%`;
        if (this.goalProgressFill) this.goalProgressFill.style.width = `${boundedPercentage}%`;
    },

    render(tasksToRender = null) {
        const tasks = tasksToRender || StorageEngine.getTasks();
        this.calculateMetrics(StorageEngine.getTasks()); // Always parse metrics against base data source

        if (!this.taskListContainer) return;
        this.taskListContainer.innerHTML = '';

        if (tasks.length === 0) {
            this.taskListContainer.innerHTML = `
                <div class="empty-state-card">
                    <i data-lucide="shield-alert" class="empty-icon"></i>
                    <p>No active operational items found matching selection parameters.</p>
                </div>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = `task-node-item ${task.completed ? 'completed-state' : ''}`;
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', task.id);

            // Match structural labels for dates nicely
            const dateOptions = { month: 'short', day: 'numeric' };
            const formattedDate = new Date(task.dueDate).toLocaleDateString(undefined, dateOptions);

            card.innerHTML = `
                <div class="task-left-cluster">
                    <div class="nm-checkbox-container ${task.completed ? 'checked-active' : ''}" onclick="TaskManager.toggleTaskStatus(${task.id})">
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
                    <span class="deadline-stamp">${formattedDate} at ${task.dueTime}</span>
                    <div class="task-action-triggers">
                        <button class="nm-btn btn-icon-trash" onclick="TaskManager.deleteTask(${task.id})" aria-label="Scrub Node">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
            this.taskListContainer.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }
};

// Auto-trigger on clean execution access paths
document.addEventListener('DOMContentLoaded', () => {
    TaskManager.init();
});