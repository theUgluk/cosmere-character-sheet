'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, plain } = require('./helpers/load-app');

describe('UI state: dialogs, storage, combat-play tabs, and character details', () => {
    let env;

    beforeEach(() => {
        env = createTestEnv({ withCharacter: true });
    });

    afterEach(() => {
        env.cleanup();
    });

    describe('js/dialogs.js', () => {
        it('queues dialogs sequentially and resolves alert, confirm, and form with validation', async () => {
            const { app, document, window } = env;

            const p1 = app.dialog.confirm('Proceed?', { title: 'Confirm Action' });
            const p2 = app.dialog.form({
                title: 'Enter Qty',
                fields: [{ name: 'qty', label: 'Quantity', type: 'number', value: '1', min: 1, required: true }]
            });

            // First dialog is active
            assert.equal(app.dialog.isOpen(), true);
            assert.equal(document.getElementById('appDialogTitle').textContent, 'Confirm Action');

            // Submit confirm dialog
            const form = document.getElementById('appDialogForm');
            form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
            assert.equal(await p1, true);

            // Second dialog is now shown from the queue
            assert.equal(document.getElementById('appDialogTitle').textContent, 'Enter Qty');
            const input = document.querySelector('#appDialogFields input[name="qty"]');

            // Try invalid value (< min) -> stays open and displays error
            input.value = '0';
            form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
            assert.equal(app.dialog.isOpen(), true);
            assert.match(document.getElementById('appDialogError').textContent, /at least 1/i);

            // Submit valid value -> resolves with field map
            input.value = '4';
            form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
            const result = await p2;
            assert.deepEqual(plain(result), { qty: '4' });
            assert.equal(app.dialog.isOpen(), false);
        });

        it('dismisses confirm as false when Cancel is clicked', async () => {
            const { app, document } = env;
            const p = app.dialog.confirm('Delete item?');
            const cancelBtn = document.querySelector('#appDialogActions .app-dialog-btn-secondary');
            cancelBtn.click();
            assert.equal(await p, false);
            assert.equal(app.dialog.isOpen(), false);
        });
    });

    describe('js/storage.js', () => {
        it('persists characters to localStorage and migrates legacy shapes on loadFromLocalStorage', () => {
            const { app, window, rules } = env;
            const char = app.currentCharacter;
            char.name = 'Adolin';
            app.saveToLocalStorage();

            const raw = window.localStorage.getItem('cosmereCharacters');
            assert.ok(raw);
            assert.match(raw, /Adolin/);

            // Inject a legacy save directly into localStorage and reload
            const culture = rules.cultures[0];
            window.localStorage.setItem('cosmereCharacters', JSON.stringify([{
                id: 'legacy-save',
                name: 'Dalinar',
                ancestry: 'Human',
                culture: culture.name,
                attributes: { strength: 3, speed: 2, intellect: 2, willpower: 3, awareness: 2, presence: 2 },
                skills: {},
                expertises: ['Military Life'],
                paths: []
            }]));

            app.characters = [];
            app.loadFromLocalStorage();
            assert.equal(app.characters.length, 1);
            assert.equal(app.characters[0].name, 'Dalinar');
            assert.equal(app.characters[0].culture, culture.id);
            assert.deepEqual(plain(app.characters[0].expertises), [{ name: 'Military Life', source: 'manual' }]);
        });
    });

    describe('js/combat-play.js', () => {
        it('switches tabs, persists active tab to localStorage, and restores via initTabFromStorage', () => {
            const { app, document, window } = env;

            app.switchTab('combat');
            assert.equal(app.activeTab, 'combat');
            assert.equal(window.localStorage.getItem('cosmereActiveTab'), 'combat');
            assert.ok(document.getElementById('tab-combat').classList.contains('active'));
            assert.equal(document.getElementById('tab-identity').classList.contains('active'), false);

            app.activeTab = null;
            app.initTabFromStorage();
            assert.equal(app.activeTab, 'combat');

            assert.throws(() => app.switchTab('nonexistent'));
        });

        it('toggles Combat & Play panel and syncs character attributes/defenses into play display', () => {
            const { app, document } = env;
            const char = app.currentCharacter;
            char.attributes.strength = 4;
            app.recalculateAll();
            app.updateCombatPlayDisplay();

            assert.equal(document.getElementById('playStrength').textContent, '4');
            assert.equal(document.getElementById('playPhysicalDefense').textContent, String(char.physicalDefense));

            const content = document.getElementById('combatPlayContent');
            const wasCollapsed = content.classList.contains('collapsed');
            app.toggleCombatPlay();
            assert.equal(content.classList.contains('collapsed'), !wasCollapsed);
        });
    });

    describe('js/character-details.js', () => {
        it('manages goals and milestones, connections, conditions, and languages', () => {
            const { app, document, rules } = env;
            const char = app.currentCharacter;

            // Goals & milestones
            app.addGoal();
            assert.equal(char.goals.length, 1);
            app.updateGoalText(0, 'Speak the Second Ideal');
            app.toggleMilestone(0, 0);
            app.toggleMilestone(0, 2);
            assert.equal(char.goals[0].text, 'Speak the Second Ideal');
            assert.deepEqual(plain(char.goals[0].milestones), [true, false, true]);

            // Connections
            app.addConnection();
            assert.equal(char.connections.length, 1);
            app.updateConnectionField(0, 'name', 'Syl');
            app.updateConnectionField(0, 'relationship', 'Honorspren');
            assert.equal(char.connections[0].name, 'Syl');

            // Conditions
            const cond = rules.conditions[0];
            app.selectCondition(cond.id);
            assert.ok(char.conditions.some(c => c.id === cond.id));

            // Languages (including legacy string normalization & custom language)
            char.languages = 'Alethi, Veden';
            app.normalizeLanguages();
            assert.deepEqual(plain(char.languages), ['Alethi', 'Veden']);

            app.toggleLanguage('Thaylen', true);
            assert.ok(char.languages.includes('Thaylen'));
            app.toggleLanguage('Veden', false);
            assert.equal(char.languages.includes('Veden'), false);

            document.getElementById('customLanguage').value = 'Dawnchant';
            app.addCustomLanguage();
            assert.ok(char.languages.includes('Dawnchant'));
            app.removeCustomLanguage('Dawnchant');
            assert.equal(char.languages.includes('Dawnchant'), false);
        });
    });
});
