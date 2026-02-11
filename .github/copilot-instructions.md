# Copilot / AI Agent Instructions — "A Book of Us"

Summary
- This is a static, client-side "digital book" single-page experience. The main entry is `index.html` and the UI is split into many full-screen `<section>`s (class `page-section`) that function as pages/chapters.

Big picture
- Entry: `index.html` — contains all chapter sections (IDs like `page-chap1`, `page-chap2`, `page-final`).
- Behavior: `script.js` implements navigation and interactivity. Navigation uses `.nav-link` elements with a `data-target` attribute and a global `navigateTo(targetId)` function. Example: call `navigateTo('page-chap3')` to open Chapter 3.
- Presentation: `style.css` contains most layout, animations, and theme tokens. Visual state is driven by CSS class toggles (not by server rendering).

Key files & examples
- `index.html` — main sections and audio elements (`bgMusic`, `sfx-flip`, `sfx-paper`).
- `script.js` — important functions: `navigateTo()`, `initFinalPageInteraction()`, `startRosePetals()`, `startFallingPetals()`, `openLetter()` and `startTimer()` (change the `startDate` inside `startTimer()` to adjust the time counter).
- `style.css` — theme variables and classes (search for `:root` and `.page-section`).
- Assets: `photos/`, `music/`, and the large image folder `beautiful-red-love-valentines-day-banner-background-multipurpose-3d-heart-glass-effect/`.

Project-specific conventions (do not override without updating JS/CSS)
- DOM-first: code references specific element IDs (e.g., `btnYes`, `btnNo`, `proposalContent`, `successMessage`, `rose-tracker`). Avoid renaming IDs; update `script.js` if you must rename.
- Navigation via attributes: use `data-target` on `.nav-link` and `.page-curl` to trigger client navigation (JS reads that attribute).
- Visual state is CSS-class-driven: toggling `active`, `hidden`, `fade-in-up`, `flipping-in`, etc. Add new states by adding classes in `style.css` and triggering them from `script.js`.
- Sound assets are referenced by `<audio id="...">` elements — playback may be blocked by browser autoplay policies; `script.js` already uses `.play().catch()` patterns.

Developer workflows
- No build step or package manager present. To preview locally serve the folder (recommended) rather than opening files directly to avoid media/CORS oddities:

  - Python (works on Windows):
    ```powershell
    python -m http.server 8000
    ```

  - Node (if you have `http-server`):
    ```powershell
    npx http-server . -p 8080
    ```

- For quick edit-preview, use VS Code Live Server extension.
- Debugging: use browser DevTools console (watch for uncaught exceptions in `script.js`), inspect the DOM to confirm `active` classes, and check network panel for missing assets (images/audio).

Integration & external dependencies
- External fonts: Google Fonts links in `index.html` (internet connection needed for fonts). A remote texture URL is used in `style.css` for overlays.
- No server-side integration or npm scripts present.

Practical editing examples
- Add a chapter: copy an existing `<section id="page-chapN" class="page-section">...</section>` and add a trigger `button` with `class="nav-link" data-target="page-chapN"`.
- Programmatic navigation: `navigateTo('page-chap2')` or `window.navigateTo('page-chap2')` (both supported).
- Timer start date: open `script.js`, find `startTimer()` and edit `const startDate = new Date(2023, 1, 14);`.
- Petal/rose states: `rose-tracker` classes (`rose-tracker-bud`, `rose-tracker-opening`, `rose-tracker-half`, `rose-tracker-full`) are assigned based on active page; change logic in the `updateRoseState()` function in `script.js` if you alter page IDs.

Risks & gotchas
- Many UI behaviors assume elements exist and IDs are stable — adding/removing nodes may require updating JS that queries them. Example: `initFinalPageInteraction()` checks `btnNo` and may reparent it into `document.body` to avoid transform containment issues.
- Autoplay: audio may be blocked; tests should include user interactions that start audio.
- CSS is large and stateful — prefer adding classes over editing numerous selectors when introducing variants.

If anything above is unclear or you want additional examples (e.g., exact code snippets to add a chapter or wire a new interaction), tell me which area to expand and I will iterate.
