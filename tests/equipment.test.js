'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { createTestEnv, withMockedRandom, plain } = require('./helpers/load-app');

describe('js/equipment.js', () => {
    let env;

    beforeEach(() => {
        env = createTestEnv({ withCharacter: true });
    });

    afterEach(() => {
        env.cleanup();
    });

    describe('formatting and unit price helpers', () => {
        it('formats numbers cleanly without floating-point artifacts', () => {
            const { app } = env;
            assert.equal(app.formatEquipmentNumber(0.6 * 50, 2), '30');
            assert.equal(app.formatEquipmentNumber(0.2 * 3, 2), '0.6');
            assert.equal(app.formatEquipmentNumber(0.01 * 3, 2), '0.03');
            assert.equal(app.formatEquipmentNumber(15, 2), '15');
            assert.equal(app.formatEquipmentNumber(NaN, 2), '0');
        });

        it('resolves unit price from item.price, weaponData, armorData, or armor catalog', () => {
            const { app } = env;
            assert.equal(app.getItemUnitPrice({ name: 'Candle', price: 0.2 }), 0.2);
            assert.equal(app.getItemUnitPrice({ type: 'weapon', weaponData: { id: 'longsword', price: 60 } }), 60);
            assert.equal(app.getItemUnitPrice({ type: 'armor', armorData: { id: 'chain', price: 80 } }), 80);
            assert.equal(app.getItemUnitPrice({ type: 'armor', armorId: 'chain' }), 80);
            assert.equal(app.getItemUnitPrice({ name: 'Unknown' }), 0);
        });
    });

    describe('migrateEquipmentData', () => {
        it('migrates legacy descriptions, armor price tags, and multi-unit bundles idempotently', () => {
            const { app } = env;
            const char = app.currentCharacter;
            char.inventory = [
                { name: 'Anesthetic (5 doses)', quantity: 1, weight: 1.5, description: '75 mk each' },
                { name: 'Antiseptic (potent, 5 doses)', quantity: 2, weight: 1, description: '50 mk each' },
                { name: 'Antiseptic (weak, 5 doses)', quantity: 1, weight: 1, description: '25 mk each' },
                { name: 'Chain (thick, 10 feet)', quantity: 1, weight: 10, description: '20 mk each' },
                { name: 'Rope (50 feet)', quantity: 2, weight: 5, description: '30 mk each | Hemp' },
                { name: 'Candle', quantity: 3, weight: 0.2, description: '0.2 mk each' },
                {
                    name: 'Chain',
                    quantity: 1,
                    weight: 25,
                    description: 'Deflect 2 | 80 mk | Polished',
                    type: 'armor',
                    armorId: 'chain',
                    armorData: { id: 'chain', name: 'Chain', deflect: 2, weight: 25, price: 80 },
                    equipped: false
                },
                {
                    name: 'Longsword',
                    quantity: 1,
                    weight: 3,
                    description: '1d8 keen | Melee',
                    type: 'weapon',
                    weaponData: { id: 'longsword', name: 'Longsword', price: 60 },
                    equipped: true
                }
            ];

            app.migrateEquipmentData();
            const firstPass = JSON.stringify(char.inventory);
            app.migrateEquipmentData();
            const secondPass = JSON.stringify(char.inventory);

            assert.equal(firstPass, secondPass, 'migrateEquipmentData must be idempotent');

            const inv = plain(char.inventory);
            assert.deepEqual(inv[0], { name: 'Anesthetic (1 dose)', quantity: 5, weight: 0.3, price: 15, description: '' });
            assert.deepEqual(inv[1], { name: 'Antiseptic (potent, 1 dose)', quantity: 10, weight: 0.2, price: 10, description: '' });
            assert.deepEqual(inv[2], { name: 'Antiseptic (weak, 1 dose)', quantity: 5, weight: 0.2, price: 5, description: '' });
            assert.deepEqual(inv[3], { name: 'Chain (thick, 1 foot)', quantity: 10, weight: 1, price: 2, description: '' });
            assert.deepEqual(inv[4], { name: 'Rope (1 foot)', quantity: 100, weight: 0.1, price: 0.6, description: 'Hemp' });
            assert.deepEqual(inv[5], { name: 'Candle', quantity: 3, weight: 0.2, price: 0.2, description: '' });
            assert.equal(inv[6].price, 80);
            assert.equal(inv[6].description, 'Deflect 2 | Polished');
            assert.equal(inv[7].price, 60);
        });
    });

    describe('expertise item modifiers and equip/unequip', () => {
        it('applies weapon and armor expertises (removeTrait, replaceTrait, addTrait, addReach)', () => {
            const { app, rules } = env;
            const char = app.currentCharacter;

            const longsword = rules.weapons.heavy.find(w => w.id === 'longsword');
            const poleaxe = rules.weapons.heavy.find(w => w.id === 'poleaxe');
            const halfPlate = rules.armor.find(a => a.id === 'half_plate');

            // Without expertise
            const baseSword = app.applyExpertiseToItem(longsword.traits, longsword, 'weapon');
            assert.equal(baseSword.hasExpertise, false);
            assert.ok(baseSword.traits.some(t => t.name === 'Two-Handed'));

            // Grant expertises
            char.expertises = [
                { id: 'longsword', name: 'Longsword', source: 'manual' },
                { id: 'poleaxe', name: 'Poleaxe', source: 'manual' },
                { id: 'half_plate', name: 'Half Plate', source: 'manual' }
            ];

            const expSword = app.applyExpertiseToItem(longsword.traits, longsword, 'weapon');
            assert.equal(expSword.hasExpertise, true);
            assert.equal(expSword.traits.some(t => t.name === 'Two-Handed'), false, 'Longsword expertise removes Two-Handed');

            const expPoleaxe = app.applyExpertiseToItem(poleaxe.traits, poleaxe, 'weapon');
            assert.equal(expPoleaxe.reachBonus, 5);
            assert.equal(app.composeRangeWithReach('Melee', expPoleaxe.reachBonus), 'Melee [+5]');
            assert.equal(app.composeRangeWithReach('Melee [+5]', 5), 'Melee [+10]');

            const expPlate = app.applyExpertiseToItem(halfPlate.traits, halfPlate, 'armor');
            assert.ok(expPlate.traits.some(t => t.name === 'Cumbersome [3]' && t.expert === true));
        });

        it('enforces single equipped weapon and armor exclusivity and computes display data', () => {
            const { app, document } = env;
            const char = app.currentCharacter;
            document.getElementById('presence').value = '1';
            app.updateAttributeValue('presence', 1);
            document.getElementById('strength').value = '3';
            app.updateAttributeValue('strength', 3);
            char.skills.heavy_weaponry = 2;

            app.selectWeapon('longsword', 'heavy');
            app.selectWeapon('greatsword', 'heavy');
            app.equipWeaponFromInventory(0);
            assert.equal(char.inventory[0].equipped, true);
            assert.equal(char.inventory[1].equipped, false);

            app.equipWeaponFromInventory(1);
            assert.equal(char.inventory[0].equipped, false);
            assert.equal(char.inventory[1].equipped, true);
            assert.equal(char.weapons.length, 1);
            assert.equal(char.weapons[0].id, 'greatsword');

            const equippedWeapons = app.getEquippedWeaponDisplayData();
            assert.equal(equippedWeapons.length, 1);
            assert.equal(equippedWeapons[0].attackBonus, 5);

            app.selectArmor('leather');
            app.selectArmor('chain');
            app.equipArmorFromInventory(2);
            assert.equal(char.equippedArmor, 'leather');
            app.equipArmorFromInventory(3);
            assert.equal(char.equippedArmor, 'chain');
            assert.equal(char.inventory[2].equipped, false);
            assert.equal(app.getEquippedArmorDisplayData().deflect, 2);
        });
    });

    describe('starting kits, inventory rendering, combat bonuses, and currency', () => {
        it('applies starting kit items as per-1 catalog entries with quantities, weights, prices, and armor', async () => {
            const { app, window } = env;
            const char = app.currentCharacter;
            char.startingKit = 'artisan';

            // Auto-resolve dialog alerts opened by applyKitToInventory
            app.dialog.alert = async () => undefined;

            await withMockedRandom(window, [0.5, 0.5, 0.5, 0.5], async () => {
                await app.applyKitToInventory();
            });

            // 4d8 with Math.random() === 0.5 => floor(0.5*8)+1 = 5 each => 20 marks
            assert.equal(char.currency.marks, 20);

            const antiseptic = char.inventory.find(i => i.name === 'Antiseptic (weak, 1 dose)');
            assert.ok(antiseptic, 'expected Antiseptic (weak, 1 dose) from Artisan Kit');
            assert.equal(antiseptic.quantity, 5);
            assert.equal(antiseptic.weight, 0.2);
            assert.equal(antiseptic.price, 5);

            const leather = char.inventory.find(i => i.type === 'armor' && i.armorId === 'leather');
            assert.ok(leather, 'expected Leather armor from Artisan Kit');
            assert.equal(leather.price, 60);
        });

        it('renders dynamic weight, price, per-unit price, and summary totals in renderInventory', () => {
            const { app, document } = env;
            app.currentCharacter.inventory = [
                { name: 'Antiseptic (potent, 1 dose)', quantity: 3, weight: 0.2, price: 10, description: '' },
                { name: 'Rope (1 foot)', quantity: 50, weight: 0.1, price: 0.6, description: '' },
                { name: 'Longsword', quantity: 1, weight: 3, price: 60, description: '1d8 keen | Melee', type: 'weapon', equipped: true }
            ];

            app.renderInventory();
            const text = document.getElementById('inventoryList').textContent;

            assert.match(text, /Antiseptic \(potent, 1 dose\) \(×3\)/);
            assert.match(text, /Weight: 0\.6 lbs \| Price: 30 mk \(10 mk each\)/);
            assert.match(text, /Rope \(1 foot\) \(×50\)/);
            assert.match(text, /Weight: 5 lbs \| Price: 30 mk \(0\.6 mk each\)/);
            assert.match(text, /Weight: 3 lbs \| Price: 60 mk/);
            assert.match(text, /Total Weight: 8\.6 lbs/);
            assert.match(text, /Total Value: 120 mk/);
        });

        it('calculates attack bonuses, initiative, and sphere currency worth', () => {
            const { app, document } = env;
            const char = app.currentCharacter;
            char.attributes = { strength: 3, speed: 4, intellect: 2, willpower: 2, awareness: 3, presence: 1 };
            char.skills.light_weaponry = 2;
            char.skills.heavy_weaponry = 1;

            app.calculateAttackBonuses();
            app.calculateInitiative();
            assert.equal(document.getElementById('meleeAttack').textContent, '+6'); // max(3+2, 3+1, 4+2)
            assert.equal(document.getElementById('rangedAttack').textContent, '+6'); // max(4+2, 3+1)
            assert.equal(document.getElementById('initiative').textContent, '+7'); // 3+4

            document.getElementById('chips').value = '10'; // 0.50
            document.getElementById('marks').value = '5';  // 5.00
            document.getElementById('broams').value = '2'; // 40.00
            app.updateCurrency();
            assert.equal(document.getElementById('totalMarks').textContent, '45.50');
        });
    });
});
