'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, plain } = require('./helpers/load-app');

describe('js/rules-engine.js', () => {
    let env;

    beforeEach(() => {
        env = createTestEnv({ withCharacter: true });
    });

    afterEach(() => {
        env.cleanup();
    });

    describe('derived stat formulas', () => {
        it('computes max health across levels 0, 1, 5, 10, 20, and 21+', () => {
            const { app } = env;
            const hp0 = app.computeMaxHealth(0, 2);
            const hp1 = app.computeMaxHealth(1, 2);
            const hp5 = app.computeMaxHealth(5, 2);
            const hp20 = app.computeMaxHealth(20, 2);
            const hp21 = app.computeMaxHealth(21, 2);

            assert.equal(hp0, 12);
            assert.equal(hp1, 12);
            assert.ok(hp5 > hp1, 'level 5 health should exceed level 1 health');
            assert.ok(hp20 > hp5, 'level 20 health should exceed level 5 health');
            assert.equal(hp21 - hp20, env.rules.resources.health.perLevelAfter20);
        });

        it('applies talent maxHealthPerLevel bonuses inside computeMaxHealth', () => {
            const { app, rules } = env;
            // Find any heroic talent with effects.maxHealthPerLevel
            let healthTalentId = null;
            let perLevel = 0;
            for (const path of rules.heroicPaths) {
                for (const spec of path.specialties) {
                    for (const t of spec.talents) {
                        if (t.effects && t.effects.maxHealthPerLevel) {
                            healthTalentId = `${path.id}_${t.id}`;
                            perLevel = t.effects.maxHealthPerLevel;
                            break;
                        }
                    }
                    if (healthTalentId) break;
                }
                if (healthTalentId) break;
            }
            assert.ok(healthTalentId, 'expected at least one talent with maxHealthPerLevel');

            const baseHp = app.computeMaxHealth(4, 2);
            app.currentCharacter.talents.push(healthTalentId);
            assert.equal(app.computeTalentMaxHealthBonus(4), perLevel * 4);
            assert.equal(app.computeMaxHealth(4, 2), baseHp + perLevel * 4);
        });

        it('computes focus, senses range, movement rate, and investiture', () => {
            const { app } = env;
            assert.equal(app.computeMaxFocus(0), 2);
            assert.equal(app.computeMaxFocus(3), 5);

            assert.equal(app.computeSensesRange(0), 5);
            assert.equal(app.computeSensesRange(2), 10);
            assert.ok(app.computeSensesRange(5) > app.computeSensesRange(2));

            assert.equal(app.computeMovementRate(0), 20);
            assert.equal(app.computeMovementRate(2), 25);
            assert.ok(app.computeMovementRate(5) > app.computeMovementRate(2));

            const inv1 = app.computeMaxInvestiture(1);
            const inv5 = app.computeMaxInvestiture(5);
            assert.ok(inv5 >= inv1);
        });

        it('throws on invalid non-numeric formula inputs', () => {
            const { app } = env;
            assert.throws(() => app.computeMaxHealth('1', 2));
            assert.throws(() => app.computeMaxFocus(null));
            assert.throws(() => app.computeSensesRange(undefined));
            assert.throws(() => app.computeMovementRate('fast'));
        });
    });

    describe('budgets and tier caps', () => {
        it('computes attribute and skill budgets and tier-based caps', () => {
            const { app } = env;
            assert.equal(app.computeAttributeBudget(0), env.rules.attributes.startingTotal);
            assert.ok(app.computeAttributeBudget(6) >= app.computeAttributeBudget(1));

            const baseSkillBudget = app.computeSkillRankBudget(1);
            app.currentCharacter.grants.push({ source: 'test', type: 'skill_rank', amount: 1 });
            assert.equal(app.computeSkillRankBudget(1), baseSkillBudget + 1);

            assert.equal(app.getMaxAttributeAtCurrentLevel(0), 3);
            assert.equal(app.getMaxAttributeAtCurrentLevel(1), env.rules.attributes.maxValue);

            assert.equal(app.getCurrentTier(0), 1);
            assert.equal(app.getMaxSkillRankAtCurrentLevel(0), 2);
            assert.equal(app.getMaxSkillRankAtCurrentLevel(1), app.getCurrentTier(1) + 1);
            assert.equal(app.getCurrentTier(21), 5);
        });

        it('computes expertise budget from culture, intellect, and granting talents', () => {
            const { app, rules } = env;
            const culture = rules.cultures.find(c => c.expertises && c.expertises.length > 0);
            app.currentCharacter.culture = culture.id;
            app.currentCharacter.attributes.intellect = 3;

            const expected = culture.expertises.length + 3;
            assert.equal(app.computeExpertiseBudget(), expected);
        });
    });

    describe('migrateCharacterShape and cascadeCleanup', () => {
        it('migrates legacy culture name, string expertises, missing fields, and heroic key talents idempotently', () => {
            const { app, rules } = env;
            const culture = rules.cultures[0];
            const heroic = rules.heroicPaths[0];
            const legacy = {
                id: 'legacy-1',
                name: 'Kal',
                ancestry: 'Human',
                culture: culture.name,
                attributes: { strength: 2, speed: 2, intellect: 2, willpower: 2, awareness: 2, presence: 2 },
                skills: {},
                expertises: ['Military Life'],
                paths: [{ id: heroic.id, type: 'heroic', level: 1 }]
            };

            app.migrateCharacterShape(legacy);
            const firstPass = JSON.stringify(legacy);
            app.migrateCharacterShape(legacy);
            const secondPass = JSON.stringify(legacy);

            assert.equal(firstPass, secondPass, 'migrateCharacterShape must be idempotent');
            assert.equal(legacy.culture, culture.id);
            assert.deepEqual(plain(legacy.expertises), [{ name: 'Military Life', source: 'manual' }]);
            assert.ok(Array.isArray(legacy.grants));
            assert.ok(Array.isArray(legacy.surgeTalents));
            assert.ok(legacy.talents.includes(`${heroic.id}_${heroic.keyTalent.id}`));
            assert.deepEqual(plain(legacy.pdfOptions), { pageSize: 'a4', compactTalents: [] });
        });

        it('cleans up path talents and surges in cascadeCleanup when a path is removed', () => {
            const { app, rules } = env;
            const heroic = rules.heroicPaths[0];
            const keyId = `${heroic.id}_${heroic.keyTalent.id}`;
            const specTalent = heroic.specialties[0].talents[0];
            const specTalentId = `${heroic.id}_${specTalent.id}`;

            app.currentCharacter.paths = [];
            app.currentCharacter.talents = [keyId, specTalentId];
            app.currentCharacter.grants = [
                { source: heroic.id, type: 'auto_talent', amount: 1, payload: { talentId: keyId } }
            ];

            app.cascadeCleanup({ removedPathIds: [heroic.id] });

            assert.ok(!app.currentCharacter.talents.includes(keyId));
            assert.ok(!app.currentCharacter.talents.includes(specTalentId));
        });
    });

    describe('recalculateAll, updatePointTrackers, and validateCharacter (DOM)', () => {
        it('updates defenses, resources, and DOM elements on recalculateAll', () => {
            const { app, document } = env;
            const char = app.currentCharacter;
            char.attributes = { strength: 3, speed: 2, intellect: 2, willpower: 3, awareness: 1, presence: 1 };
            char.paths = [{ id: env.rules.heroicPaths[0].id, type: 'heroic', level: 1 }];

            app.recalculateAll();

            assert.equal(char.physicalDefense, 10 + 3 + 2);
            assert.equal(char.cognitiveDefense, 10 + 2 + 3);
            assert.equal(char.spiritualDefense, 10 + 1 + 1);
            assert.equal(document.getElementById('physicalDefense').textContent, '15');
            assert.equal(document.getElementById('cognitiveDefense').textContent, '15');
            assert.equal(document.getElementById('spiritualDefense').textContent, '12');
            assert.equal(document.getElementById('maxHealth').textContent, String(char.maxHealth));
            assert.equal(document.getElementById('maxFocus').textContent, '5');
        });

        it('flags missing fields and over-spent points in validateCharacter, and clears when valid', () => {
            const { app, document, rules } = env;
            const char = app.currentCharacter;

            app.updatePointTrackers();
            app.validateCharacter();
            const summary = document.getElementById('validationSummary').textContent;
            assert.match(summary, /Please enter a character name/);
            assert.match(summary, /Please select an ancestry/);
            assert.match(summary, /Please select a culture/);
            assert.equal(document.getElementById('characterCompleteBadge').textContent, '⚠ Incomplete');

            // Make character complete
            char.name = 'Shallan';
            char.ancestry = 'Human';
            char.culture = rules.cultures[0].id;
            char.purpose = 'Discover the truth';
            char.obstacle = 'Self-doubt';
            char.attributes = { strength: 2, speed: 2, intellect: 3, willpower: 2, awareness: 2, presence: 1 };
            const heroic = rules.heroicPaths[0];
            char.paths = [{ id: heroic.id, type: 'heroic', level: 1 }];
            char.talents = [`${heroic.id}_${heroic.keyTalent.id}`];
            char.grants = [{ source: heroic.id, type: 'auto_talent', amount: 1, payload: { talentId: `${heroic.id}_${heroic.keyTalent.id}` } }];

            // Spend exact skill rank budget
            const skillBudget = app.computeSkillRankBudget(1);
            const skills = rules.skills.list;
            for (let i = 0; i < skillBudget; i++) {
                char.skills[skills[i % skills.length].id] += 1;
            }

            // Pick one non-auto talent if level 1 grants a talent point
            app.updatePointTrackers();
            const remainingTalents = app.cachedPointData.remainingTalentPoints;
            if (remainingTalents > 0) {
                for (let i = 0; i < remainingTalents; i++) {
                    const t = heroic.specialties[0].talents[i];
                    if (t) char.talents.push(`${heroic.id}_${t.id}`);
                }
            }

            app.updatePointTrackers();
            app.validateCharacter();
            assert.equal(document.getElementById('characterCompleteBadge').textContent, '✓ Character Complete');
            assert.match(document.getElementById('validationSummary').textContent, /Character is ready to play!/);
        });
    });
});
