/**
 * ==========================================================================
 * MECHANICAL DRAG AND DROP REORDERING INTERFACE (dragdrop.js)
 * ==========================================================================
 */

const DragDropEngine = {
    init() {
        this.container = document.getElementById('task-list-container');
        if (!this.container) return;

        this.bindEvents();
    },

    bindEvents() {
        // Delegate drag lifecycle events to the main list container element
        this.container.addEventListener('dragstart', (e) => this.handleDragStart(e));
        this.container.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.container.addEventListener('dragend', (e) => this.handleDragEnd(e));
        this.container.addEventListener('drop', (e) => this.handleDrop(e));
    },

    handleDragStart(e) {
        const targetCard = e.target.closest('.task-node-item');
        if (!targetCard) return;

        targetCard.classList.add('is-dragging');
        // Cache the active tracking node identifier directly within the event payload
        e.dataTransfer.setData('text/plain', targetCard.getAttribute('data-id'));
        e.dataTransfer.effectAllowed = 'move';
    },

    handleDragOver(e) {
        e.preventDefault(); // Required to allow drop target zone interception actions
        const draggingElement = document.querySelector('.is-dragging');
        if (!draggingElement) return;

        const afterElement = this.getDragAfterElement(this.container, e.clientY);
        if (afterElement == null) {
            this.container.appendChild(draggingElement);
        } else {
            this.container.insertBefore(draggingElement, afterElement);
        }
    },

    handleDragEnd(e) {
        const targetCard = e.target.closest('.task-node-item');
        if (targetCard) targetCard.classList.remove('is-dragging');
    },

    handleDrop(e) {
        e.preventDefault();
        this.rebuildTaskArrayFromDOM();
    },

    // Calculate vertical element offsets to determine relative insert positions
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-node-item:not(.is-dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    rebuildTaskArrayFromDOM() {
        const renderedCards = [...this.container.querySelectorAll('.task-node-item')];
        const masterTasksList = StorageEngine.getTasks();
        
        // Map DOM positional layout sequences to build a newly sorted results array
        const reorderedTasks = renderedCards.map(card => {
            const id = parseInt(card.getAttribute('data-id'), 10);
            return masterTasksList.find(task => task.id === id);
        }).filter(Boolean); // Clear structural null values safely

        StorageEngine.saveTasks(reorderedTasks);
        
        // Silently update metric displays to reflect changes
        if (window.TaskManager) {
            window.TaskManager.calculateMetrics(reorderedTasks);
        }
    }
};

// Reinitialization hook triggered during manual filter pipeline changes
window.addEventListener('tasksUpdated', () => {
    DragDropEngine.init();
});

document.addEventListener('DOMContentLoaded', () => {
    DragDropEngine.init();
});