# AGENTS.md — Cosmere RPG Character Sheet

Guidance for AI coding agents and contributors working in this repository. Read this file before making changes so the codebase stays modular and never regresses into a monolithic HTML file.

## Non-Negotiable Invariants

1. **Zero build step & `file://` compatibility**: Users open `index.html` directly from disk via `file://` (no server required).
   - Do **not** use ES module `<script type="module">` tags or `fetch()` for local JSON/CSS/JS assets (browsers block `fetch()` and ES modules over `file://` due to CORS).
   - Keep all browser code as classic `<script src="...">` files wrapped in IIFEs `(function () { ... })();` attaching to `window.COSMERE_RULES`, `window.app`, `window.diceRoller`, or `window.mobileDebug`.
2. **Plain Vanilla JS + CSS**: Do not introduce frameworks, build tools, or npm runtime dependencies unless explicitly requested.
3. **No inline `<style>` or `<script>` blocks in `index.html`**: Keep `index.html` strictly as semantic HTML markup plus ordered `<link>` and `<script src="...">` tags.
4. **Preserve global event handler contracts**: Markup and dynamically rendered `innerHTML` templates invoke `app.<method>(...)`, `diceRoller.<method>(...)`, and `mobileDebug.<method>(...)`. Never rename or remove public methods without updating all callers in `index.html` and `js/*.js`.
5. **Ignore legacy Python scripts**: `extract_handbook.py`, `run_server.py`, `sync_rules.py`, `cosmere-rules.json`, and `rules-minified.txt` are legacy utility files; do not treat `sync_rules.py` or `cosmere-rules.json` as the runtime source of truth. The runtime rules source of truth is `data/rules/*.js`.

## Directory Layout

- `index.html` — Single HTML entry point (DOM shell, 5 character tabs, Combat & Play panel, picker modals, shared `#appDialog`, `<link>` and `<script>` tags).
- `styles/` — Ordered stylesheets (preserve `<link>` order in HTML):
  - `styles/base.css` — CSS variables (`:root`), reset, header, buttons, character list, base inputs, `.hidden`.
  - `styles/sheet.css` — Attributes/skills grid, defenses, resources, paths/talents, expertises, point trackers, validation, equipment/inventory, conditions, portraits.
  - `styles/modals.css` — Shared modal shell, `#appDialog` overlay/form styles, expertise/weapon/armor/item picker modals, portrait lightbox.
  - `styles/dice-roller.css` — Floating dice FAB/toggles, dice modal, roll history, inline dice icons, toast notifications.
  - `styles/combat-play.css` — Tablet-optimized Combat & Play view, quick-stat cards, action list.
  - `styles/layout-overrides.css` — Universal collapsible panels, tab bar/panes, responsive `@media` and `@media print` rules (**must stay loaded last**).
- `data/rules/` — Pretty-printed game rules modules populating `window.COSMERE_RULES`:
  - `data/rules/core.js` — Metadata, attributes, skills, defenses, resources, movement, senses, lifting, advancement, ancestries, ancestryPaths, cultures, conditions.
  - `data/rules/heroic-paths.js` — `heroicPaths` and their specialties/talents.
  - `data/rules/radiant-orders.js` — `radiantOrders`, ideals, and order talents.
  - `data/rules/surges.js` — `surges` and surge talents.
  - `data/rules/expertises.js` — `expertises` catalog and mechanical effects.
  - `data/rules/equipment.js` — `itemTraitGlossary`, `weapons`, `armor`, `currency`, `equipment`, `startingKits`.
  - `data/rules/index.js` — Validates all required keys exist on `window.COSMERE_RULES`.
- `js/` — Application modules (preserve `<script>` order in HTML):
  - `js/debug.js` — `window.mobileDebug`, `window.onerror`/`onunhandledrejection`, offline-safe Eruda toggle.
  - `js/dice-roller.js` — `window.diceRoller` and keyboard shortcuts (`D`, `Escape`).
  - `js/app-core.js` — Initializes `window.app` state (`rules`, `characters`, `currentCharacter`) and core lifecycle/CRUD/sheet/skill rendering.
  - `js/dialogs.js` — Central queued Promise-based dialog system (`app.dialog.alert`, `confirm`, `prompt`, `form`) driving `#appDialog` in place of native browser popups.
  - `js/rules-engine.js` — Handbook derived-stat formulas, budgets, tiers, `migrateCharacterShape`, `cascadeCleanup`, `recalculateAll`, point trackers, validation.
  - `js/paths-talents.js` — Heroic/Radiant/Ancestry paths, surges, talent tree layout, talent index, prerequisite evaluator, talent toggling.
  - `js/expertises.js` — Expertise reconciliation, budget breakdown, picker modal, catalog/custom expertises.
  - `js/equipment.js` — Starting kits, equipment migration, expertise-to-item trait modifiers, weapon/armor/item modals, equip/unequip, attack/initiative bonuses, inventory, currency.
  - `js/character-details.js` — Injuries, conditions, connections, goals & milestones, languages, portrait upload/resize/lightbox.
  - `js/combat-play.js` — Persisted tab navigation (`switchTab`, `initTabFromStorage`) and Combat & Play dashboard rendering.
  - `js/storage.js` — `localStorage` persistence (`cosmereCharacters`), JSON file export/import, `downloadBytes`.
  - `js/pdf-export.js` — AcroForm blank-sheet filler and simplified 2-page PDF generator using optional `pdf-lib.min.js` + `blank-sheet-pdf.js`.
  - `js/main.js` — `DOMContentLoaded` bootstrap calling `window.app.init()` (**must stay loaded last**).
- `tests/` — Unit test suites run with Node's built-in test runner (`node:test`) and dev-only `happy-dom`:
  - `tests/helpers/load-app.js` — Loads `index.html`, `data/rules/*.js`, and core `js/*.js` modules into an isolated `happy-dom` window (`createTestEnv`, `withMockedRandom`, `plain`).
  - `tests/*.test.js` — Unit tests for rules data integrity, rules engine, paths/talents, expertises, equipment, and UI state/dialogs/storage.
- `package.json` — Dev-only test/check scripts (`npm test`, `npm run check`) and `happy-dom` devDependency; never used at browser runtime.
- `docs/` — Architecture, development guide, user guides (`docs/guides/`), and archived historical logs (`docs/archive/`).

## Where to Put Changes

- **New game rules, paths, talents, surges, expertises, weapons, armor, kits, or conditions**: Edit the matching file in `data/rules/*.js`. If adding a brand-new top-level rules key, also add it to `requiredKeys` in `data/rules/index.js`.
- **Derived stat formulas, level/tier caps, validation rules, or character schema migrations**: Edit `js/rules-engine.js`. Always handle legacy saved characters gracefully inside `migrateCharacterShape()`.
- **New character sheet UI section or modal**:
  1. Add markup to `index.html`.
  2. Add styles to the matching file in `styles/` (or `styles/layout-overrides.css` for responsive/tab overrides).
  3. Add JS logic to the owning module in `js/` (or create a new `js/<feature>.js` mixin using `Object.assign(window.app, { ... })` and register it in `index.html` before `js/main.js`).
  4. Update `docs/ARCHITECTURE.md` if you add a new file, DOM tab, character field, or `localStorage` key.
- **Dice mechanics or toast UI**: Edit `js/dice-roller.js` and `styles/dice-roller.css`.
- **PDF field mappings or PDF layout**: Edit `js/pdf-export.js`.
- **Unit tests**: Add or update tests in the matching `tests/<domain>.test.js` file using `node:test`, `node:assert/strict`, and `tests/helpers/load-app.js`.

## Verification Checklist Before Finishing Any Task

Always perform steps 1, 2, 3, and 6. **Ask the user before running step 4 or step 5** rather than starting a local server or browser session automatically.

1. **(Always)** Add or update unit tests in `tests/*.test.js` covering new behavior, rules data changes, migrations, or bug fixes (note: `js/pdf-export.js` and `js/dice-roller.js` are excluded from the unit test suite).
2. **(Always)** Run syntax checks on all JS files: `npm run check` (or `node --check js/*.js data/rules/*.js`).
3. **(Always)** Run the unit test suite and confirm all tests pass: `npm test` (or `node --test tests/*.test.js`).
4. **(Ask user first)** Open `index.html` in a browser (test direct `file://` load or local HTTP) and confirm **zero** console errors or uncaught exceptions.
5. **(Ask user first)** Smoke-test affected flows:
   - Character creation, switching, and reload persistence via `localStorage`
   - Editing attributes/skills and verifying point trackers, derived stats, and validation summary update
   - Switching tabs (`identity`, `stats`, `combat`, `paths`, `story`) and Combat & Play view
   - Testing modals, inline dice rolling + toast, and Dice Roller modal if touched
6. **(Always)** Keep `AGENTS.md` and `docs/ARCHITECTURE.md` accurate if module boundaries change.

For deeper details on module responsibilities, character schema, and rules schema, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
