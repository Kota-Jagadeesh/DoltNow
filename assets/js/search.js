/**
 * ==========================================================================
 * SEARCH, FILTER, AND SORT PIPELINE ENGINE (search.js)
 * ==========================================================================
 */

const FilterPipeline = {
    init() {
        this.cacheDOM();
        this.bindEvents();
    },

    cacheDOM() {
        this.searchInput = document.getElementById('task-search-input');
        this.categorySelect = document.getElementById('filter-category');
        this.prioritySelect = document.getElementById('filter-priority');
    },

    bindEvents() {
        if (!this.searchInput) return;

        // Attach event listeners to filter inputs
        this.searchInput.addEventListener('input', () => this.processPipeline());
        this.categorySelect.addEventListener('change', () => this.processPipeline());
        this.prioritySelect.addEventListener('change', () => this.processPipeline());

        // Listen for internal state updates from TaskManager CRUD modifications
        window.addEventListener('tasksUpdated', () => this.processPipeline());
    },

    processPipeline() {
        const query = this.searchInput.value.toLowerCase().trim();
        const selectedCategory = this.categorySelect.value;
        const selectedPriority = this.prioritySelect.value;

        // Pull the fresh, unfiltered source-of-truth task array from local storage
        const masterTasksList = StorageEngine.getTasks();

        // Pass data through multi-parameter conditional filter loops
        const filteredTasks = masterTasksList.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(query);
            const matchesCategory = (selectedCategory === 'all') || (task.category === selectedCategory);
            const matchesPriority = (selectedPriority === 'all') || (task.priority === selectedPriority);

            return matchesSearch && matchesCategory && matchesPriority;
        });

        // Bypass standard TaskManager rendering parameters by passing our filtered array slice
        if (window.TaskManager) {
            window.TaskManager.render(filteredTasks);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FilterPipeline.init();
});