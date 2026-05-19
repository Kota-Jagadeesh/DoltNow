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


        this.searchInput.addEventListener('input', () => this.processPipeline());
        this.categorySelect.addEventListener('change', () => this.processPipeline());
        this.prioritySelect.addEventListener('change', () => this.processPipeline());


        window.addEventListener('tasksUpdated', () => this.processPipeline());
    },

    processPipeline() {
        const query = this.searchInput.value.toLowerCase().trim();
        const selectedCategory = this.categorySelect.value;
        const selectedPriority = this.prioritySelect.value;


        const masterTasksList = StorageEngine.getTasks();


        const filteredTasks = masterTasksList.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(query);
            const matchesCategory = (selectedCategory === 'all') || (task.category === selectedCategory);
            const matchesPriority = (selectedPriority === 'all') || (task.priority === selectedPriority);

            return matchesSearch && matchesCategory && matchesPriority;
        });


        if (window.TaskManager) {
            window.TaskManager.render(filteredTasks);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FilterPipeline.init();
});