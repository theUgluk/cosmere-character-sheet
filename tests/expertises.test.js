'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, plain } = require('./helpers/load-app');

describe('js/expertises.js', () => {
    let env;

    beforeEach(() => {
        env = createTestEnv({ withCharacter: true });
    });

    afterEach(() => {
        env.cleanup();
    });

    describe('reconcileExpertises', () => {
        it('merges auto-granted culture and kit expertises while preserving manual entries and deduplicating', () => {
            const { app, rules } = env;
            const char = app.currentCharacter;
            const alethi = rules.cultures.find(c => c.id === 'alethi') || rules.cultures.find(c => c.expertises && c.expertises.length > 0);
            char.culture = alethi.id;
            char.startingKit = 'academic'; // grants Literature
            char.expertises = [
                'Literature', // duplicate of kit-granted expertise, should be deduplicated
                'Custom Lore' // custom manual entry, should be kept
            ];

            app.reconcileExpertises();

            const names = char.expertises.map(e => e.name);
            assert.ok(names.includes('Literature'), 'kit-granted Literature should be present');
            assert.equal(names.filter(n => n === 'Literature').length, 1, 'duplicate manual Literature should be removed');
            assert.ok(char.expertises.some(e => e.name === 'Literature' && e.source === 'kit:academic'));
            assert.ok(char.expertises.some(e => e.name === 'Custom Lore' && e.source === 'manual' && e.custom === true));

            for (const cExp of alethi.expertises) {
                assert.ok(
                    char.expertises.some(e => e.source === 'culture' && (e.id === cExp || e.name.toLowerCase() === cExp.toLowerCase())),
                    `expected culture expertise "${cExp}" to be auto-granted`
                );
            }
        });

        it('removes auto-granted expertises when their source culture/kit is cleared', () => {
            const { app } = env;
            const char = app.currentCharacter;
            char.startingKit = 'academic';
            app.reconcileExpertises();
            assert.ok(char.expertises.some(e => e.source === 'kit:academic'));

            char.startingKit = null;
            app.reconcileExpertises();
            assert.equal(char.expertises.some(e => e.source === 'kit:academic'), false);
        });
    });

    describe('catalog, custom, removal, and budget tracker', () => {
        it('commits catalog and custom expertises and updates DOM tracker', () => {
            const { app, document } = env;
            const char = app.currentCharacter;
            document.getElementById('presence').value = '1';
            app.updateAttributeValue('presence', 1);
            document.getElementById('intellect').value = '3';
            app.updateAttributeValue('intellect', 3);

            app.commitCatalogExpertise('longsword');
            assert.ok(char.expertises.some(e => e.id === 'longsword' && e.source === 'manual' && e.custom === false));

            const input = document.getElementById('customExpertiseName');
            input.value = 'Bridge Four Tactics';
            app.commitCustomExpertise();
            assert.ok(char.expertises.some(e => e.name === 'Bridge Four Tactics' && e.custom === true));

            assert.equal(document.getElementById('expertisePointsUsed').textContent, '2');
            assert.equal(document.getElementById('expertisePointsTotal').textContent, '3');
            assert.equal(document.getElementById('expertisePointsRemaining').textContent, '1 remaining');
        });

        it('removes manual expertises but blocks removing auto-granted expertises', () => {
            const { app } = env;
            const char = app.currentCharacter;
            char.attributes.intellect = 2;
            char.startingKit = 'academic';
            app.reconcileExpertises();
            app.commitCatalogExpertise('knife');

            const autoIdx = char.expertises.findIndex(e => e.source === 'kit:academic');
            const manualIdx = char.expertises.findIndex(e => e.id === 'knife');

            // Trying to remove auto-granted triggers alert and leaves array intact
            app.removeExpertise(autoIdx);
            assert.ok(char.expertises.some(e => e.source === 'kit:academic'));

            // Removing manual entry succeeds
            app.removeExpertise(manualIdx);
            assert.equal(char.expertises.some(e => e.id === 'knife'), false);
        });

        it('formats computeExpertiseBudgetBreakdown and describeEffect verbs', () => {
            const { app, rules } = env;
            const culture = rules.cultures.find(c => c.expertises && c.expertises.length > 0);
            app.currentCharacter.culture = culture.id;
            app.currentCharacter.attributes.intellect = 2;

            assert.equal(
                app.computeExpertiseBudgetBreakdown(),
                `${culture.expertises.length} culture + 2 Intellect`
            );

            assert.equal(app.describeEffect('addTrait:Defensive'), '+Defensive');
            assert.equal(app.describeEffect('removeTrait:Two-Handed'), 'removes Two-Handed');
            assert.equal(app.describeEffect('replaceTrait:Cumbersome [4]=>Cumbersome [3]'), 'Cumbersome [4] → Cumbersome [3]');
            assert.equal(app.describeEffect('addReach:5'), '+5 ft reach');
            assert.equal(app.describeEffect('addExpertNote:Special rule'), 'Special rule');
            assert.throws(() => app.describeEffect('invalidVerb:foo'));
        });

        it('resolves catalog definitions by id or name via getExpertiseDef', () => {
            const { app } = env;
            const byId = app.getExpertiseDef({ id: 'longsword' });
            const byName = app.getExpertiseDef({ name: 'Longsword' });
            assert.ok(byId && byName);
            assert.equal(byId.id, 'longsword');
            assert.deepEqual(plain(byId), plain(byName));
            assert.equal(app.getExpertiseDef({ name: 'Nonexistent Custom' }), null);
        });
    });
});
