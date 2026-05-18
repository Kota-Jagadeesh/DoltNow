/**
 * ==========================================================================
 * TOAST NOTIFICATION DISPLAY ENGINE (notifications.js)
 * ==========================================================================
 */

const ToastNotification = {
    show(message, type = 'info') {
        const container = document.getElementById('toast-stack-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;
        toast.textContent = message;

        // Add semantic icon mapping
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };

        toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;

        container.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutToast 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Export for browser environment
window.ToastNotification = ToastNotification;
