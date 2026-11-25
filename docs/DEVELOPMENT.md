# Development Guide

Practical instructions for modifying and extending the Cosmere RPG Character Sheet safely.

## Running Locally

- **Primary workflow (no server needed)**: Open `index.html` directly in your browser (`file://...`).
- **Optional local HTTP server** (helpful for DevTools or browser automation):
  - `npx serve .` or any static file server pointed at the repository root, then visit `/index.html`.
- Always verify changes over `file://` as well, because `file://` is the primary user workflow.

## Common Tasks

### 1. Editing or Adding Game Rules (`data/rules/`)

- Open the relevant pretty-printed data file in `data/rules/`:
  - Core stats, skills, advancement, ancestries, cultures, conditions -> `data/rules/core.js`
  - Heroic paths & talents -> `data/rules/heroic-paths.js`
  - Radiant orders & talents -> `data/rules/radiant-orders.js`
  - Surges & surge talents -> `data/rules/surges.js`
  - Expertises -> `data/rules/expertises.js`
  - Weapons, armor, traits, gear, kits -> `data/rules/equipment.js`
- Keep talent IDs unique within their path; `buildTalentIndex()` namespaces path talents as `${pathId}_${talent.id}` and surge talents as `surge_${surgeId}_${talent.id}`.
- Express talent tree edges via `requiresTalent` (array of local talent IDs; nested arrays represent OR groups) so `computeTalentTiers()` and `evaluateRequiresTalent()` enforce and display prerequisites automatically.
- After editing, verify syntax with `node --check data/rules/*.js`.

### 2. Adding a New JavaScript Module or Method

- Prefer placing new methods in the existing owning module (see [ARCHITECTURE.md](ARCHITECTURE.md)).
- If adding a new feature domain:
  1. Create `js/<feature>.js` wrapped in an IIFE:
     ```js
     /**
      * <Feature Name>
      * <Short description of responsibility and public methods>
      */
     (function () {
         Object.assign(window.app, {
             myMethod: function () {
                 // ...
             }
         });
     })();
     ```
  2. Add `<script src="js/<feature>.js"></script>` to `index.html` **after** `js/app-core.js` and **before** `js/main.js`.
  3. Document the new module in `AGENTS.md` and `docs/ARCHITECTURE.md`.

### 3. Modifying Character Schema

- Add default values to `createNewCharacter()` in `js/app-core.js`.
- Add backwards-compatible migration logic to `migrateCharacterShape(char)` in `js/rules-engine.js` so existing `localStorage` saves and imported JSON files upgrade cleanly without throwing errors.
- If the new field affects PDF output, update `js/pdf-export.js`.

### 4. Editing Styles (`styles/`)

- Place base tokens and global elements in `styles/base.css`.
- Place character sheet component styles in `styles/sheet.css`, modals in `styles/modals.css`, dice UI in `styles/dice-roller.css`, and Combat & Play styles in `styles/combat-play.css`.
- Keep responsive `@media` overrides, tab overrides, and `@media print` rules in `styles/layout-overrides.css` so stylesheet cascade order remains predictable.

### 5. Running Unit Tests & Checking for Errors

Unit tests use Node's built-in `node:test` runner and a single dev-only dependency (`happy-dom`) so the browser app remains 100% zero-build vanilla JS over `file://`.

- One-time dev setup (for running unit tests):
  ```bash
  npm install
  ```
- Syntax-check all JS files and run the unit test suite from the repo root:
  ```bash
  npm run check
  npm test
  ```
- Add or update unit tests in `tests/*.test.js` whenever you change rules data, derived-stat formulas, migrations, prerequisite logic, equipment, expertises, or UI state. Use `createTestEnv()` from `tests/helpers/load-app.js` for an isolated `happy-dom` instance loaded with `index.html` and the ordered rules/app scripts.
- Open `index.html` in a browser and inspect the DevTools Console:
  - Confirm zero errors or uncaught promise rejections on startup.
  - Test creating a new character, modifying attributes/skills/paths/talents/expertises/equipment, rolling dice inline and in the modal, switching tabs, and reloading the page to verify `localStorage` persistence.
