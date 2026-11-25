'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv } = require('./helpers/load-app');

describe('data/rules/* catalog integrity', () => {
    let env;

    before(() => {
        env = createTestEnv({ withCharacter: false });
    });

    after(() => {
        env.cleanup();
    });

    it('exposes all 25 required top-level COSMERE_RULES keys', () => {
        const requiredKeys = [
            'version', 'gameName', 'maxLevel', 'attributes', 'skills', 'defenses',
            'resources', 'movement', 'senses', 'lifting', 'heroicPaths', 'radiantOrders',
            'advancement', 'ancestries', 'ancestryPaths', 'cultures', 'expertises',
            'itemTraitGlossary', 'weapons', 'armor', 'currency', 'equipment',
            'startingKits', 'conditions', 'surges'
        ];
        for (const key of requiredKeys) {
            assert.ok(key in env.rules, `Missing COSMERE_RULES.${key}`);
        }
    });

    it('has unique IDs across core catalogs (paths, orders, surges, expertises, weapons, armor, conditions)', () => {
        const assertUniqueIds = (list, label) => {
            const seen = new Set();
            for (const entry of list) {
                assert.ok(entry.id, `${label} entry is missing id`);
                assert.ok(!seen.has(entry.id), `Duplicate id "${entry.id}" in ${label}`);
                seen.add(entry.id);
            }
        };

        assertUniqueIds(env.rules.heroicPaths, 'heroicPaths');
        assertUniqueIds(env.rules.radiantOrders, 'radiantOrders');
        assertUniqueIds(env.rules.ancestryPaths, 'ancestryPaths');
        assertUniqueIds(env.rules.cultures, 'cultures');
        assertUniqueIds(env.rules.expertises, 'expertises');
        assertUniqueIds(env.rules.armor, 'armor');
        assertUniqueIds(env.rules.conditions, 'conditions');
        assertUniqueIds(env.rules.startingKits, 'startingKits');

        assert.equal(typeof env.rules.surges, 'object');
        const surgeEntries = Object.entries(env.rules.surges);
        assert.equal(surgeEntries.length, 10, 'expected all 10 Surges');
        for (const [surgeKey, surgeDef] of surgeEntries) {
            assert.ok(surgeKey && surgeDef && surgeDef.name, `Invalid surge definition for "${surgeKey}"`);
            assertUniqueIds(surgeDef.talents || [], `surges.${surgeKey}.talents`);
        }

        const allWeapons = [
            ...env.rules.weapons.light,
            ...env.rules.weapons.heavy,
            ...(env.rules.weapons.special || [])
        ];
        assertUniqueIds(allWeapons, 'weapons');
    });

    it('links every startingKit equipment entry and armor entry to valid catalog entries', () => {
        const equipNames = new Set(env.rules.equipment.map(e => e.name.toLowerCase()));
        const armorIds = new Set(env.rules.armor.map(a => a.id));

        for (const kit of env.rules.startingKits) {
            for (const entry of kit.equipment || []) {
                const name = typeof entry === 'string' ? entry : entry.item;
                assert.ok(
                    equipNames.has(name.toLowerCase()),
                    `Starting kit "${kit.id}" references unknown equipment "${name}"`
                );
                if (typeof entry === 'object') {
                    assert.ok(
                        Number.isInteger(entry.quantity) && entry.quantity >= 1,
                        `Starting kit "${kit.id}" entry "${name}" must have positive integer quantity`
                    );
                }
            }

            if (kit.armor && kit.armor !== 'none') {
                for (const part of kit.armor.split(' and ')) {
                    const id = part.trim().toLowerCase().replace(/\s+/g, '_');
                    assert.ok(armorIds.has(id), `Starting kit "${kit.id}" references unknown armor "${id}"`);
                }
            }
        }
    });

    it('keeps all equipment items normalized per 1 unit with valid non-negative weight and price', () => {
        for (const item of env.rules.equipment) {
            assert.equal(typeof item.name, 'string');
            assert.ok(item.name.trim().length > 0);
            assert.equal(typeof item.weight, 'number', `${item.name} weight must be a number`);
            assert.ok(item.weight >= 0, `${item.name} weight must be >= 0`);
            assert.equal(typeof item.price, 'number', `${item.name} price must be a number`);
            assert.ok(item.price >= 0, `${item.name} price must be >= 0`);
            assert.doesNotMatch(
                item.name,
                /\b([2-9]|[1-9]\d+)\s+(doses|feet|days|sheets|servings|vials|flasks|blocks)\b/i,
                `Equipment item "${item.name}" should be normalized per 1 unit`
            );
        }
    });

    it('links every weapon/armor expertise appliesTo target to an existing weapon or armor id', () => {
        const weaponIds = new Set([
            ...env.rules.weapons.light,
            ...env.rules.weapons.heavy,
            ...(env.rules.weapons.special || [])
        ].map(w => w.id));
        const armorIds = new Set(env.rules.armor.map(a => a.id));

        for (const exp of env.rules.expertises) {
            if (!exp.appliesTo) continue;
            // Specialist weapon/armor expertises (e.g. Shardblades, Shardplate, Grandbows) apply to
            // special/custom gear not listed in the standard weapons/armor tables.
            if (exp.category === 'specialist') {
                assert.ok(
                    exp.appliesTo.weaponId || exp.appliesTo.armorId,
                    `Specialist expertise "${exp.id}" appliesTo is missing target id`
                );
                continue;
            }
            if (exp.appliesTo.kind === 'weapon') {
                assert.ok(
                    weaponIds.has(exp.appliesTo.weaponId),
                    `Expertise "${exp.id}" references unknown weapon "${exp.appliesTo.weaponId}"`
                );
            } else if (exp.appliesTo.kind === 'armor') {
                assert.ok(
                    armorIds.has(exp.appliesTo.armorId),
                    `Expertise "${exp.id}" references unknown armor "${exp.appliesTo.armorId}"`
                );
            }
        }
    });

    it('links every Radiant Order surge to a valid entry in rules.surges', () => {
        const surgeIds = new Set(Object.keys(env.rules.surges));
        for (const order of env.rules.radiantOrders) {
            assert.ok(Array.isArray(order.surges) && order.surges.length === 2, `${order.id} should have 2 surges`);
            for (const surgeId of order.surges) {
                assert.ok(surgeIds.has(surgeId), `Order "${order.id}" references unknown surge "${surgeId}"`);
            }
        }
    });
});
