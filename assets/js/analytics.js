const AnalyticsEngine = {
    charts: {},

    init() {

        const tasks = StorageEngine.getTasks();

        this.renderOverviewMetrics(tasks);
        this.generatePriorityChart(tasks);
        this.generateCategoryChart(tasks);
        this.renderActivityTimeline(tasks);


        window.addEventListener('tasksUpdated', () => this.refreshAnalytics());
    },

    refreshAnalytics() {

        const tasks = StorageEngine.getTasks();


        this.renderOverviewMetrics(tasks);
        this.updatePriorityChart(tasks);
        this.updateCategoryChart(tasks);
        this.renderActivityTimeline(tasks);
    },

    renderOverviewMetrics(tasks) {
        const scoreVal = document.getElementById('analytics-score-val');
        const completedVal = document.getElementById('analytics-completed-val');
        const velocityVal = document.getElementById('analytics-velocity-val');

        const totalCount = tasks.length;
        const completedCount = tasks.filter(t => t.completed).length;


        const productivityScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const velocityRatio = totalCount > 0 ? (completedCount / 3).toFixed(1) : "0.0";

        if (scoreVal) {
            scoreVal.innerText = `${productivityScore}%`;

            scoreVal.parentElement?.classList.add('metric-pulse');
            setTimeout(() => scoreVal.parentElement?.classList.remove('metric-pulse'), 600);
        }
        if (completedVal) {
            completedVal.innerText = completedCount;
            completedVal.parentElement?.classList.add('metric-pulse');
            setTimeout(() => completedVal.parentElement?.classList.remove('metric-pulse'), 600);
        }
        if (velocityVal) {
            velocityVal.innerText = velocityRatio;
            velocityVal.parentElement?.classList.add('metric-pulse');
            setTimeout(() => velocityVal.parentElement?.classList.remove('metric-pulse'), 600);
        }
    },

    generatePriorityChart(tasks) {
        const ctx = document.getElementById('priorityBarChart');
        if (!ctx) return;


        const highCount = tasks.filter(t => t.priority === 'high').length;
        const medCount = tasks.filter(t => t.priority === 'medium').length;
        const lowCount = tasks.filter(t => t.priority === 'low').length;


        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const labelTextColor = isDark ? '#f7fafc' : '#2d3748';

        this.charts.priorityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['High Priority', 'Medium Priority', 'Low Priority'],
                datasets: [{
                    label: 'Active Nodes',
                    data: [highCount, medCount, lowCount],
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { boxPadding: 5 }
                },
                scales: {
                    x: { ticks: { color: labelTextColor }, grid: { display: false } },
                    y: { ticks: { color: labelTextColor, stepSize: 1 }, grid: { alpha: 0.1 } }
                }
            }
        });
    },

    updatePriorityChart(tasks) {
        if (!this.charts.priorityChart) {
            this.generatePriorityChart(tasks);
            return;
        }

        const highCount = tasks.filter(t => t.priority === 'high').length;
        const medCount = tasks.filter(t => t.priority === 'medium').length;
        const lowCount = tasks.filter(t => t.priority === 'low').length;

        this.charts.priorityChart.data.datasets[0].data = [highCount, medCount, lowCount];
        this.charts.priorityChart.update('none');
    },

    generateCategoryChart(tasks) {
        const ctx = document.getElementById('categoryPieChart');
        if (!ctx) return;

        const categories = ['Study', 'Work', 'Personal', 'Health', 'Shopping', 'Meetings'];
        const metricDataArray = categories.map(cat => tasks.filter(t => t.category === cat).length);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const labelTextColor = isDark ? '#f7fafc' : '#2d3748';

        this.charts.categoryChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: categories,
                datasets: [{
                    data: metricDataArray,
                    backgroundColor: ['#6366f1', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#1a202c' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: labelTextColor, padding: 12, font: { weight: '600' } }
                    }
                }
            }
        });
    },

    updateCategoryChart(tasks) {
        if (!this.charts.categoryChart) {
            this.generateCategoryChart(tasks);
            return;
        }

        const categories = ['Study', 'Work', 'Personal', 'Health', 'Shopping', 'Meetings'];
        const metricDataArray = categories.map(cat => tasks.filter(t => t.category === cat).length);

        this.charts.categoryChart.data.datasets[0].data = metricDataArray;
        this.charts.categoryChart.update('none');
    },

    renderActivityTimeline(tasks) {
        const timelineWrapper = document.getElementById('activity-log-timeline');
        if (!timelineWrapper) return;

        if (tasks.length === 0) {
            timelineWrapper.innerHTML = `
                <div class="empty-timeline-notice">
                    <p>No operational items found in recent processing queues.</p>
                </div>
            `;
            return;
        }

        timelineWrapper.innerHTML = '';


        const visibleLogsSlice = tasks.slice(0, 3);

        visibleLogsSlice.forEach(task => {
            const logRow = document.createElement('div');
            logRow.className = 'timeline-row-item';

            logRow.innerHTML = `
                <div class="log-meta-left">
                    <span class="log-status-dot" style="background-color: ${task.completed ? 'var(--low-priority)' : 'var(--accent)'}"></span>
                    <span>Operational item "${task.title}" verified in execution pool.</span>
                </div>
                <span class="log-timestamp-label">${task.dueDate}</span>
            `;
            timelineWrapper.appendChild(logRow);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AnalyticsEngine.init();
});