# DoItNow

DoItNow is a static productivity workspace built for planning tasks, tracking progress, and keeping focus in one place. It is not a generic starter project or a framework demo. It is a small but complete personal productivity site with a polished visual style, a local storage data layer, charts, a Pomodoro timer, calendar scheduling, settings controls, and an About page for the project team.

## What the project does

The site is designed around a simple idea: open the workspace, create tasks, track what is done, and move through the day with less noise. The dashboard gives you the main control center. Analytics shows patterns and completion trends. Calendar helps place tasks across dates. Settings lets you update profile data, daily goals, and reset local data. About introduces the developers and links out to their profiles.

Everything runs in the browser. No backend, no database, no build step, and no framework overhead.

## Main pages

- `index.html` - landing page and entry point for the app
- `dashboard.html` - the main workspace for tasks, search, filters, Pomodoro, and scratchpad notes
- `analytics.html` - charts and task insights powered by Chart.js
- `calendar.html` - month calendar and agenda view for date-based planning
- `settings.html` - profile, goal, cache clearing, and factory reset controls
- `about.html` - developer profiles, photo placeholders, and social links

## Features

- Task creation, completion, and deletion
- Search and filter controls for categories and priority
- Persistent data storage through `localStorage`
- Profile name, streak, and daily goal tracking
- Pomodoro focus timer with focus and break cycles
- Analytics charts for task priority and category distribution
- Calendar view with agenda items for selected dates
- Scratchpad notes for quick thoughts and temporary ideas
- Theme toggle for light and dark mode
- Responsive layout for desktop and smaller screens
- Developer About page with image slots and social links

## How the app is structured

The project is a static HTML/CSS/JavaScript application. Most of the behavior lives in small vanilla JavaScript modules under `assets/js/`, and the shared visual language lives in `assets/css/`.

### JavaScript modules

- `assets/js/storage.js` - central state management using `localStorage`
- `assets/js/app.js` - shared UI sync, profile updates, and scratchpad hydration
- `assets/js/tasks.js` - task creation, task rendering, and task actions
- `assets/js/analytics.js` - metrics and Chart.js graphs
- `assets/js/calendar.js` - calendar rendering and date agenda logic
- `assets/js/settings.js` - profile settings and reset actions
- `assets/js/pomodoro.js` - focus timer logic
- `assets/js/theme.js` - theme switching
- `assets/js/notifications.js` - toast notifications
- `assets/js/search.js` - search-related behavior
- `assets/js/dragdrop.js` - drag and drop helpers
- `assets/js/quotes.js` - quote or message rotation support

### Styling files

- `assets/css/themes.css` - color variables and theme values
- `assets/css/style.css` - landing page and shared base styles
- `assets/css/components.css` - common components such as cards, modals, and inputs
- `assets/css/dashboard.css` - dashboard shell and shared app layout
- `assets/css/analytics.css` - analytics-specific layout and chart areas
- `assets/css/calendar.css` - calendar-specific layout
- `assets/css/settings.css` - settings-specific layout

## Data storage

The app stores its state in the browser through `localStorage` under a single project key. That state includes:

- user profile name
- streak count
- daily goal
- task list
- scratchpad text

This means the app remembers your content across refreshes on the same browser, without needing sign-in or a server.

## Third-party libraries

- [Lucide](https://lucide.dev/) for icons
- [Chart.js](https://www.chartjs.org/) for analytics charts

## Running the project

This is a static site, so you can open `index.html` directly in a browser. A local server is still better if you want smoother navigation and fewer browser restrictions.

### Simple local run

```bash
cd /home/kota-jagadeeshwar-reddy/DoltNow
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

If you prefer a different server, any static file server will work.

## A few implementation notes

- The UI uses a consistent neumorphic visual style across pages.
- The site was written to stay readable and light rather than packed with framework abstractions.
- The app is responsive and adapts the dashboard layout on smaller screens.
- The About page includes real social links and image placeholders that can be replaced with final profile pictures.

## Suggested project flow

1. Open the landing page.
2. Enter the dashboard.
3. Create tasks and organize them with search and filters.
4. Use the Pomodoro timer while working.
5. Check analytics to see progress.
6. Use the calendar to place tasks on dates.
7. Update preferences in settings.

## Project team

The About page currently highlights the three developers behind the project:

- Jagadeesh Kota
- Bharath Simha
- Pavan Shiva

## Notes for contributors

- Keep the site comment-free if you continue editing the codebase.
- Preserve the existing visual style when adding new screens or components.
- Keep changes compatible with the current static structure unless you intentionally move to a framework.

## File map

- [index.html](index.html)
- [dashboard.html](dashboard.html)
- [analytics.html](analytics.html)
- [calendar.html](calendar.html)
- [settings.html](settings.html)
- [about.html](about.html)
- [assets/css](assets/css)
- [assets/js](assets/js)
