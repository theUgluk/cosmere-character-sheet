'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, plain } = require('./helpers/load-app');

describe('js/paths-talents.js', () => {
    let env;

    beforeEach(() => {
        env = createTestEnv({ withCharacter: true });
    });

    afterEach(() => {
        env.cleanup();
    });

    describe('buildTalentIndex and tree tiers', () => {
        it('indexes heroic, radiant, ancestry, and surge talents by id and name', () => {
            const { app } = env;
            const index = app.buildTalentIndex();

            assert.ok(index.byId.size > 50, 'expected full catalog of talents indexed');
            assert.ok(index.byName.size > 50);
            assert.ok(index.byExpertise.size > 10);

            // Spot-check each location type
            const heroic = env.rules.heroicPaths[0];
            assert.ok(index.byId.has(`${heroic.id}_${heroic.keyTalent.id}`));

            const order = env.rules.radiantOrders[0];
            const orderTalent = order.specialties[0].talents[0];
            assert.ok(index.byId.has(`${order.id}_${orderTalent.id}`));

            const firstSurgeKey = Object.keys(env.rules.surges)[0];
            const firstSurgeTalent = env.rules.surges[firstSurgeKey].talents[0];
            assert.ok(index.byId.has(`surge_${firstSurgeKey}_${firstSurgeTalent.id}`));
        });

        it('computes talent tiers from requiresTalent DAG and guards against cycles', () => {
            const { app } = env;
            const talents = [
                { id: 'root', name: 'Root' },
                { id: 'mid', name: 'Mid', requiresTalent: ['root'] },
                { id: 'leaf', name: 'Leaf', requiresTalent: [['mid', 'root']] }
            ];
            const tiers = app.computeTalentTiers(talents);
            assert.equal(tiers.get('root'), 0);
            assert.equal(tiers.get('mid'), 1);
            assert.equal(tiers.get('leaf'), 2);

            // Cycle guard should terminate without stack overflow
            const cyclic = [
                { id: 'a', name: 'A', requiresTalent: ['b'] },
                { id: 'b', name: 'B', requiresTalent: ['a'] }
            ];
            const cyclicTiers = app.computeTalentTiers(cyclic);
            assert.equal(typeof cyclicTiers.get('a'), 'number');
        });
    });

    describe('prerequisite evaluation', () => {
        it('evaluates requiresTalent AND and OR groups scoped to pathId', () => {
            const { app } = env;
            const agent = env.rules.heroicPaths.find(p => p.id === 'agent');
            const spec = agent.specialties[0];
            const dependent = spec.talents.find(t => Array.isArray(t.requiresTalent) && t.requiresTalent.length > 0);
            assert.ok(dependent, 'expected a talent with requiresTalent');

            const failed = app.evaluateRequiresTalent(dependent, 'agent');
            assert.equal(failed.ok, false);
            assert.match(failed.reason, /Requires/);

            // Select required parent(s)
            for (const req of dependent.requiresTalent) {
                const localId = Array.isArray(req) ? req[0] : req;
                app.currentCharacter.talents.push(`agent_${localId}`);
            }
            assert.equal(app.evaluateRequiresTalent(dependent, 'agent').ok, true);
        });

        it('evaluates skill rank, ancestry, ideal, expertise, and narrative clauses', () => {
            const { app } = env;
            const char = app.currentCharacter;

            // Skill rank clause checks effective level (attribute + rank)
            char.attributes.intellect = 2;
            char.skills.deduction = 0;
            assert.equal(app.evaluatePrereqClause('Deduction 3+', char, 'agent').ok, false);
            char.skills.deduction = 1;
            assert.equal(app.evaluatePrereqClause('Deduction 3+', char, 'agent').ok, true);

            // Ancestry clause
            char.ancestry = 'Human';
            assert.equal(app.evaluatePrereqClause('Singer ancestry', char, 'singer').ok, false);
            char.ancestry = 'Singer';
            assert.equal(app.evaluatePrereqClause('Singer ancestry', char, 'singer').ok, true);

            // Radiant Ideal clause
            assert.equal(app.evaluatePrereqClause('Speak the First Ideal', char, 'windrunner').ok, false);
            char.talents.push('windrunner_first_ideal');
            assert.equal(app.evaluatePrereqClause('Speak the First Ideal', char, 'windrunner').ok, true);

            // Expertise clause
            assert.equal(app.evaluatePrereqClause('Hammer expertise', char, 'warrior').ok, false);
            char.expertises.push({ id: 'hammer', name: 'Hammer', source: 'manual' });
            assert.equal(app.evaluatePrereqClause('Hammer expertise', char, 'warrior').ok, true);

            // Narrative GM-controlled prereq is allowed
            assert.equal(app.evaluatePrereqClause('Patron in high society', char, 'envoy').ok, true);
        });

        it('enforces implicit heroic key talent rule in checkTalentPrerequisite', () => {
            const { app } = env;
            const agent = env.rules.heroicPaths.find(p => p.id === 'agent');
            const rootTalent = agent.specialties[0].talents.find(
                t => (!t.requiresTalent || t.requiresTalent.length === 0) && (!t.prerequisite || t.prerequisite === 'none')
            ) || { id: 'dummy_talent', name: 'Dummy', prerequisite: 'none' };

            const withoutKey = app.checkTalentPrerequisite(rootTalent, 'agent');
            assert.equal(withoutKey.ok, false);
            assert.match(withoutKey.reason, /key talent/i);

            app.currentCharacter.talents.push(`agent_${agent.keyTalent.id}`);
            assert.equal(app.checkTalentPrerequisite(rootTalent, 'agent').ok, true);
        });

        it('identifies dependent talents via findDependentTalents', () => {
            const { app } = env;
            const index = app.buildTalentIndex();
            const agent = env.rules.heroicPaths.find(p => p.id === 'agent');
            const keyId = `agent_${agent.keyTalent.id}`;
            const child = agent.specialties[0].talents.find(t => Array.isArray(t.requiresTalent) && typeof t.requiresTalent[0] === 'string');
            const parentId = `agent_${child.requiresTalent[0]}`;
            const childId = `agent_${child.id}`;

            app.currentCharacter.talents = [keyId, parentId, childId];
            const parentEntry = index.byId.get(parentId);
            const dependents = app.findDependentTalents(parentEntry);
            assert.ok(dependents.some(d => d.id === childId), 'expected child talent to depend on parent');
        });
    });

    describe('paths, levels, and ancestry sync', () => {
        it('adds heroic paths with auto-granted key talent and starting skill rank', () => {
            const { app } = env;
            const agent = env.rules.heroicPaths.find(p => p.id === 'agent');
            app.addPath('heroic:agent');

            assert.equal(app.currentCharacter.paths.length, 1);
            assert.equal(app.currentCharacter.paths[0].id, 'agent');
            assert.ok(app.currentCharacter.talents.includes(`agent_${agent.keyTalent.id}`));
            if (agent.startingSkill) {
                assert.equal(app.currentCharacter.skills[agent.startingSkill], 1);
            }
        });

        it('adjusts current resources proportionally when changing path level', () => {
            const { app } = env;
            app.addPath('heroic:warrior');
            const char = app.currentCharacter;
            char.currentHealth = char.maxHealth;

            app.changePathLevel(0, 1);
            assert.equal(app.getTotalLevel(), 1);
            const hpAt1 = char.maxHealth;

            app.changePathLevel(0, 1);
            assert.equal(app.getTotalLevel(), 2);
            assert.ok(char.maxHealth > hpAt1);
            assert.equal(char.currentHealth, char.maxHealth);
        });

        it('syncs Singer ancestry path automatically and excludes ancestry paths from getTotalLevel', () => {
            const { app } = env;
            app.addPath('heroic:agent');
            app.changePathLevel(0, 2);

            app.currentCharacter.ancestry = 'Singer';
            app.syncAncestryPath();

            assert.ok(app.currentCharacter.paths.some(p => p.type === 'ancestry' && p.id === 'singer'));
            assert.equal(app.getTotalLevel(), 2, 'ancestry path must not contribute to character total level');

            // Switching back to Human removes the Singer ancestry path
            app.currentCharacter.ancestry = 'Human';
            app.syncAncestryPath();
            assert.equal(app.currentCharacter.paths.some(p => p.type === 'ancestry'), false);
        });
    });
});
