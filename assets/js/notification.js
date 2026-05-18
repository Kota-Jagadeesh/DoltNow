/**
 * ==========================================================================
 * DYNAMIC NEUMORPHIC TOAST ENGINE (notifications.js)
 * ==========================================================================
 */

const ToastNotification = {
    // Structural launcher node mapping
    show(message, type = 'info') {
        const container = document.getElementById('toast-stack-container');
        if (!container) return;

        // Build native layout node element
        const toast = document.createElement('div');
        toast.className = `toast-item nm-card-toast type-${type}`;

        // Map icons dynamically depending on standard status inputs
        let iconMarkup = '<i data-lucide="info"></i>';
        if (type === 'success') iconMarkup = '<i data-lucide="check-circle" class="text-success"></i>';
        if (type === 'warning') iconMarkup = '<i data-lucide="alert-triangle" class="text-warn"></i>';
        if (type === 'error') iconMarkup = '<i data-lucide="x-circle" style="color: var(--high-priority)"></i>';

        toast.innerHTML = `
            ${iconMarkup}
            <span>${message}</span>
        `;

        // Inject container item into visible stack frame
        container.appendChild(toast);
        
        // Re-execute Lucide icon lookup for the freshly injected layout elements
        if (window.lucide) {
            lucide.createIcons({ attrs: { class: 'toast-vector-icon' } });
        }

        // Trigger graceful sliding exit routines automatically
        setTimeout(() => {
            toast.style.animation = 'slideOutToast 0.4s ease forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3500);
    }
};

// Add standard CSS keyframe support for slide outs if missing
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes slideOutToast {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(140%); opacity: 0; }
    }
    .toast-item { display: flex; align-items: center; gap: 0.75rem; }
`;
document.head.appendChild(styleSheet);