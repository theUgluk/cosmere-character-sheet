'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Window } = require('happy-dom');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

const RULES_SCRIPTS = [
    'data/rules/core.js',
    'data/rules/heroic-paths.js',
    'data/rules/radiant-orders.js',
    'data/rules/surges.js',
    'data/rules/expertises.js',
    'data/rules/equipment.js',
    'data/rules/index.js'
];

const APP_SCRIPTS = [
    'js/debug.js',
    'js/app-core.js',
    'js/dialogs.js',
    'js/rules-engine.js',
    'js/paths-talents.js',
    'js/expertises.js',
    'js/equipment.js',
    'js/character-details.js',
    'js/combat-play.js',
    'js/storage.js'
];

let cachedHtml = null;
const scriptCache = new Map();

function getSanitizedHtml() {
    if (cachedHtml === null) {
        const raw = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
        cachedHtml = raw
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<link\b[^>]*>/gi, '');
    }
    return cachedHtml;
}

function readScript(relPath) {
    if (!scriptCache.has(relPath)) {
        scriptCache.set(relPath, fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf8'));
    }
    return scriptCache.get(relPath);
}

/**
 * Creates an isolated happy-dom browser environment loaded with
 * index.html, data/rules/*.js, and core js/*.js modules
 * (excluding js/pdf-export.js, js/dice-roller.js, and js/main.js).
 */
function createTestEnv(options = {}) {
    const { withCharacter = true, quiet = true } = options;

    const win = new Window({
        url: 'http://localhost/index.html',
        settings: {
            disableJavaScriptFileLoading: true,
            disableCSSFileLoading: true
        }
    });

    if (quiet) {
        win.console.log = () => {};
        win.console.info = () => {};
    }

    win.document.write(getSanitizedHtml());
    win.document.close();

    for (const relPath of RULES_SCRIPTS) {
        win.eval(readScript(relPath));
    }
    for (const relPath of APP_SCRIPTS) {
        win.eval(readScript(relPath));
    }

    win.app.rules = win.COSMERE_RULES;
    win.app.characters = [];
    win.app.currentCharacter = null;

    if (withCharacter) {
        win.app.createNewCharacter();
    }

    const cleanup = () => {
        try {
            win.close();
        } catch (_) {
            // ignore teardown errors
        }
    };

    return {
        window: win,
        document: win.document,
        app: win.app,
        rules: win.COSMERE_RULES,
        cleanup
    };
}

/**
 * Deterministically stubs window.Math.random with a sequence of numbers in [0, 1)
 * for the duration of fn (supports sync and async functions).
 */
async function withMockedRandom(win, sequence, fn) {
    const origRandom = win.Math.random;
    let idx = 0;
    win.Math.random = () => {
        const val = sequence[idx % sequence.length];
        idx += 1;
        return val;
    };
    try {
        return await fn();
    } finally {
        win.Math.random = origRandom;
    }
}

function plain(value) {
    return JSON.parse(JSON.stringify(value));
}

module.exports = {
    ROOT_DIR,
    RULES_SCRIPTS,
    APP_SCRIPTS,
    createTestEnv,
    withMockedRandom,
    plain
};
