document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');


    const currentTheme = localStorage.getItem('doitnow_theme') ||
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');


    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);


    themeToggleBtn.addEventListener('click', () => {
        let activeTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = (activeTheme === 'dark') ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('doitnow_theme', newTheme);
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {

            themeIcon.innerHTML = `<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m16 0h1m-9 -9v1m0 16v1m-7.4 -14.4l.7 .7m12.1 12.1l.7 .7m0 -13.5l-.7 .7m-12.1 12.1l-.7 .7" />`;
        } else {

            themeIcon.innerHTML = `<path d="M12 3c.132 0 .263 0 .393 .007a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />`;
        }
    }
});