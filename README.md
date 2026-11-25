# Cosmere RPG Character Sheet

A standalone, zero-build character sheet web application for the **Cosmere RPG (Stormlight Archive)** that runs directly in your browser—no server or installation required.

## Quick Start

1. Keep the repository folder intact (HTML, `styles/`, `js/`, `data/`, and optional PDF scripts).
2. Double-click **`index.html`** to open it in any modern browser (Chrome, Firefox, Edge, Safari).
3. Create a character, track stats, talents, expertises, equipment, and roll dice inline. Characters are saved automatically in browser `localStorage` and can be exported/imported as JSON or exported to PDF.

## Key Features

- **Multi-Character Management**: Create, switch, delete, auto-save (`localStorage`), and JSON import/export.
- **Full Handbook Rules & Validation**: Real-time derived stats (Health, Focus, Investiture, Defenses, Movement, Senses, Lifting, Recovery Die), level/tier caps, point trackers, and validation banners.
- **Paths, Surges & Talent Trees**: Multi-path progression across Heroic Paths, Radiant Orders, and Ancestry Paths with tier-grouped talent trees and prerequisite checking.
- **Expertises & Equipment**: Categorized Expertise picker with automatic item-trait upgrades, starting kits, unified inventory with equip/unequip flows, and sphere currency tracking.
- **Combat & Play View + Dice Roller**: Tablet-friendly quick-reference play mode, inline dice roll buttons with toast notifications, and a full Dice Roller modal supporting Advantage, Disadvantage, Plot Die, and roll history (`D` shortcut).
- **PDF Export**: Fill the official blank character sheet or generate a clean 2-page simplified PDF (powered by optional local `pdf-lib.min.js` and `blank-sheet-pdf.js`).

## Project Structure

- `index.html` — Single HTML entry point you open in the browser
- `styles/` — Modular stylesheets (`base.css`, `sheet.css`, `modals.css`, `dice-roller.css`, `combat-play.css`, `layout-overrides.css`)
- `data/rules/` — Pretty-printed rules data modules (`core.js`, `heroic-paths.js`, `radiant-orders.js`, `surges.js`, `expertises.js`, `equipment.js`, `index.js`)
- `js/` — Modular vanilla JS application files (`app-core.js`, `rules-engine.js`, `paths-talents.js`, `expertises.js`, `equipment.js`, `character-details.js`, `combat-play.js`, `dice-roller.js`, `storage.js`, `pdf-export.js`, `debug.js`, `main.js`)
- `AGENTS.md` — Architecture rules and conventions for AI coding agents and contributors
- `docs/` — Architecture, development guide, user guides, and archived logs

## Documentation

- **Architecture & Contributing**: [AGENTS.md](AGENTS.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- **User Guides**: [docs/guides/USAGE.md](docs/guides/USAGE.md), [docs/guides/BEGINNER_GUIDE.md](docs/guides/BEGINNER_GUIDE.md), [docs/guides/DICE_ROLLER_GUIDE.md](docs/guides/DICE_ROLLER_GUIDE.md), [docs/guides/CHANGELOG.md](docs/guides/CHANGELOG.md)
- **Historical Notes**: [docs/archive/](docs/archive/)

## Credits

This project is based on the first version of the Cosmere Character Sheet created by Arnd Rosemeier: [ArndRosemeier/Cosmere-character-sheet](https://github.com/ArndRosemeier/Cosmere-character-sheet).
