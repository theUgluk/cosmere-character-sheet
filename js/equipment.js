/**
 * Equipment, Weapons, Armor, Starting Kits, Inventory & Combat Bonuses
 * Equipment migration, expertise-to-item trait modifiers, weapon/armor/item picker modals,
 * equip/unequip flows, starting kits, attack/initiative calculations, inventory, and currency.
 */
(function () {
    const LEGACY_EQUIPMENT_BUNDLES = {
        'Anesthetic (5 doses)': { name: 'Anesthetic (1 dose)', factor: 5, weight: 0.3, price: 15 },
        'Antiseptic (potent, 5 doses)': { name: 'Antiseptic (potent, 1 dose)', factor: 5, weight: 0.2, price: 10 },
        'Antiseptic (weak, 5 doses)': { name: 'Antiseptic (weak, 1 dose)', factor: 5, weight: 0.2, price: 5 },
        'Chain (thick, 10 feet)': { name: 'Chain (thick, 1 foot)', factor: 10, weight: 1, price: 2 },
        'Rope (50 feet)': { name: 'Rope (1 foot)', factor: 50, weight: 0.1, price: 0.6 }
    };

    Object.assign(window.app, {
        formatEquipmentNumber: function(value, maxDecimals = 2) {
            const num = Number(value);
            if (!Number.isFinite(num)) return '0';
            return Number(num.toFixed(maxDecimals)).toString();
        },

        getItemUnitPrice: function(item) {
            if (!item) return 0;
            if (typeof item.price === 'number' && !Number.isNaN(item.price)) {
                return item.price;
            }
            if (item.type === 'weapon' && item.weaponData && typeof item.weaponData.price === 'number') {
                return item.weaponData.price;
            }
            if (item.type === 'armor') {
                if (item.armorData && typeof item.armorData.price === 'number') {
                    return item.armorData.price;
                }
                if (item.armorId && this.rules && Array.isArray(this.rules.armor)) {
                    const armorDef = this.rules.armor.find(a => a.id === item.armorId);
                    if (armorDef && typeof armorDef.price === 'number') return armorDef.price;
                }
            }
            return 0;
        },

        migrateEquipmentData: function() {
            const char = this.currentCharacter;
            if (!char.inventory) char.inventory = [];

            // Migrate legacy weapons from char.weapons into inventory
            if (char.weapons && char.weapons.length > 0) {
                for (const weapon of char.weapons) {
                    const alreadyInInventory = char.inventory.some(
                        i => i.type === 'weapon' && i.weaponData && i.weaponData.id === weapon.id && i.equipped
                    );
                    if (!alreadyInInventory) {
                        char.inventory.push({
                            name: weapon.name,
                            quantity: 1,
                            weight: weapon.weight,
                            price: weapon.price ?? 0,
                            description: `${weapon.damage} ${weapon.damageType} | ${weapon.range}`,
                            type: 'weapon',
                            weaponData: {...weapon},
                            equipped: true
                        });
                    }
                }
            }

            // Migrate legacy armor items without type field
            if (char.equippedArmor) {
                const armorDef = this.rules.armor.find(a => a.id === char.equippedArmor);
                if (armorDef) {
                    const hasTypedArmor = char.inventory.some(
                        i => i.type === 'armor' && i.armorId === char.equippedArmor
                    );
                    if (!hasTypedArmor) {
                        const legacyItem = char.inventory.find(
                            i => !i.type && (i.name.toLowerCase() === armorDef.name.toLowerCase() ||
                                 i.name.toLowerCase().includes(armorDef.name.toLowerCase()))
                        );
                        if (legacyItem) {
                            legacyItem.type = 'armor';
                            legacyItem.armorId = armorDef.id;
                            legacyItem.equipped = true;
                            if (typeof legacyItem.price !== 'number') legacyItem.price = armorDef.price ?? 0;
                            if (!legacyItem.armorData) legacyItem.armorData = { ...armorDef };
                        } else {
                            char.inventory.push({
                                name: armorDef.name,
                                quantity: 1,
                                weight: armorDef.weight,
                                price: armorDef.price ?? 0,
                                description: `Deflect ${armorDef.deflect}`,
                                type: 'armor',
                                armorId: armorDef.id,
                                armorData: { ...armorDef },
                                equipped: true
                            });
                        }
                    }
                }
            }

            // Normalize prices, descriptions, and legacy multi-unit bundles across inventory
            const equipmentCatalog = (this.rules && Array.isArray(this.rules.equipment)) ? this.rules.equipment : [];
            const armorCatalog = (this.rules && Array.isArray(this.rules.armor)) ? this.rules.armor : [];

            for (const item of char.inventory) {
                if (!item) continue;

                if (item.type === 'weapon') {
                    if (typeof item.price !== 'number' || Number.isNaN(item.price)) {
                        item.price = (item.weaponData && typeof item.weaponData.price === 'number') ? item.weaponData.price : 0;
                    }
                    if (item.weaponData && (typeof item.weaponData.price !== 'number' || Number.isNaN(item.weaponData.price))) {
                        item.weaponData.price = item.price;
                    }
                    continue;
                }

                if (item.type === 'armor') {
                    const armorDef = item.armorId ? armorCatalog.find(a => a.id === item.armorId) : null;
                    let parsedDescPrice = null;
                    if (typeof item.description === 'string' && item.description) {
                        const parts = item.description.split(' | ');
                        const kept = [];
                        for (const part of parts) {
                            const m = part.trim().match(/^(\d+(?:\.\d+)?)\s*mk$/i);
                            if (m) {
                                if (parsedDescPrice === null) parsedDescPrice = parseFloat(m[1]);
                            } else {
                                kept.push(part);
                            }
                        }
                        item.description = kept.join(' | ');
                    }
                    if (typeof item.price !== 'number' || Number.isNaN(item.price)) {
                        if (item.armorData && typeof item.armorData.price === 'number') {
                            item.price = item.armorData.price;
                        } else if (armorDef && typeof armorDef.price === 'number') {
                            item.price = armorDef.price;
                        } else if (parsedDescPrice !== null) {
                            item.price = parsedDescPrice;
                        } else {
                            item.price = 0;
                        }
                    }
                    if (item.armorData && (typeof item.armorData.price !== 'number' || Number.isNaN(item.armorData.price))) {
                        item.armorData.price = item.price;
                    }
                    continue;
                }

                // General equipment item: extract legacy "<price> mk each" from description
                if (typeof item.price !== 'number' || Number.isNaN(item.price)) {
                    if (typeof item.description === 'string' && item.description) {
                        const parts = item.description.split(' | ');
                        const kept = [];
                        let extractedPrice = null;
                        for (const part of parts) {
                            const m = part.trim().match(/^(\d+(?:\.\d+)?)\s*mk\s+each$/i);
                            if (m) {
                                if (extractedPrice === null) extractedPrice = parseFloat(m[1]);
                            } else {
                                kept.push(part);
                            }
                        }
                        if (extractedPrice !== null) {
                            item.price = extractedPrice;
                            item.description = kept.join(' | ');
                        }
                    }
                }

                // Convert legacy multi-unit bundles (e.g. "Antiseptic (potent, 5 doses)") into per-1 units
                const bundle = LEGACY_EQUIPMENT_BUNDLES[item.name];
                if (bundle) {
                    const prevQty = Math.max(1, parseInt(item.quantity, 10) || 1);
                    item.name = bundle.name;
                    item.quantity = prevQty * bundle.factor;
                    item.weight = (typeof item.weight === 'number' && item.weight > 0)
                        ? Number((item.weight / bundle.factor).toFixed(4))
                        : bundle.weight;
                    item.price = (typeof item.price === 'number' && item.price > 0)
                        ? Number((item.price / bundle.factor).toFixed(4))
                        : bundle.price;
                }

                // Backfill unit price from catalog if still unset
                if (typeof item.price !== 'number' || Number.isNaN(item.price)) {
                    const catalogDef = equipmentCatalog.find(
                        eq => eq.name.toLowerCase() === (item.name || '').toLowerCase()
                    );
                    item.price = catalogDef ? catalogDef.price : 0;
                }
            }

            // Rebuild char.weapons from inventory source of truth
            this.syncEquippedFromInventory();
        },

        syncEquippedFromInventory: function() {
            const char = this.currentCharacter;
            if (!char.inventory) char.inventory = [];

            char.weapons = char.inventory
                .filter(i => i.type === 'weapon' && i.equipped && i.weaponData)
                .map(i => ({...i.weaponData, equipped: true}));

            const equippedArmorItem = char.inventory.find(i => i.type === 'armor' && i.equipped && (i.armorId || i.armorData));
            char.equippedArmor = equippedArmorItem ? (equippedArmorItem.armorId ?? equippedArmorItem.armorData?.id ?? null) : null;
        },

        // Look up the catalog entry whose `appliesTo` matches the given item id and kind.
        // Returns null if no expertise covers this item (e.g. custom weapons / unknown ids).,

        lookupItemExpertise: function(itemId, kind) {
            if (!itemId) return null;
            const catalog = this.rules.expertises || [];
            return catalog.find(e =>
                e.appliesTo
                && e.appliesTo.kind === kind
                && (e.appliesTo.weaponId === itemId || e.appliesTo.armorId === itemId)
            ) || null;
        },

        // Returns true iff the character owns the expertise that applies to this item.
        // Auto-granted (talent / kit / culture) and manual entries both count.,

        characterHasExpertiseForItem: function(itemId, kind) {
            const def = this.lookupItemExpertise(itemId, kind);
            if (!def) return false;
            const owned = this.currentCharacter.expertises || [];
            const idLower = def.id.toLowerCase();
            const nameLower = def.name.toLowerCase();
            return owned.some(e =>
                (e.id && e.id.toLowerCase() === idLower)
                || (e.name && e.name.toLowerCase() === nameLower)
            );
        },

        // Apply expertise effects to a base item view. Returns:
        //   { traits: [{name, expert}], reachBonus, expertNotes, hasExpertise, expertiseDef }
        // The traits array preserves order: base traits first, then expert-added traits.,

        applyExpertiseToItem: function(baseTraits, item, kind) {
            const traits = (baseTraits || []).map(t => ({ name: t, expert: false }));
            const expertNotes = [];
            let reachBonus = 0;
            if (!item || !item.id) {
                return { traits, reachBonus, expertNotes, hasExpertise: false, expertiseDef: null };
            }
            const def = this.lookupItemExpertise(item.id, kind);
            if (!def) {
                return { traits, reachBonus, expertNotes, hasExpertise: false, expertiseDef: null };
            }
            const hasExpertise = this.characterHasExpertiseForItem(item.id, kind);
            if (!hasExpertise) {
                return { traits, reachBonus, expertNotes, hasExpertise: false, expertiseDef: def };
            }
            for (const eff of def.expertEffects || []) {
                if (typeof eff !== 'string' || !eff.includes(':')) {
                    throw new Error(`Invalid expertEffect in catalog for ${def.id}: ${eff}`);
                }
                const idx = eff.indexOf(':');
                const verb = eff.slice(0, idx);
                const arg = eff.slice(idx + 1);
                switch (verb) {
                    case 'addTrait':
                        traits.push({ name: arg, expert: true });
                        break;
                    case 'removeTrait': {
                        const traitName = arg;
                        const i = traits.findIndex(t => t.name === traitName);
                        if (i === -1) {
                            if (item.edited) break;
                            throw new Error(`removeTrait expected base trait "${traitName}" on ${item.id} but it was missing`);
                        }
                        traits.splice(i, 1);
                        break;
                    }
                    case 'replaceTrait': {
                        const sep = arg.indexOf('=>');
                        if (sep === -1) {
                            throw new Error(`replaceTrait must use Old=>New, got: ${arg}`);
                        }
                        const oldT = arg.slice(0, sep);
                        const newT = arg.slice(sep + 2);
                        const i = traits.findIndex(t => t.name === oldT);
                        if (i === -1) {
                            if (item.edited) break;
                            throw new Error(`replaceTrait expected base trait "${oldT}" on ${item.id} but it was missing`);
                        }
                        traits[i] = { name: newT, expert: true };
                        break;
                    }
                    case 'addReach':
                        reachBonus += parseInt(arg, 10);
                        if (Number.isNaN(reachBonus)) {
                            throw new Error(`addReach expected a number, got: ${arg}`);
                        }
                        break;
                    case 'addExpertNote':
                        expertNotes.push(arg);
                        break;
                    default:
                        throw new Error(`Unknown expertEffect verb in catalog: ${verb} (in ${def.id})`);
                }
            }
            return { traits, reachBonus, expertNotes, hasExpertise: true, expertiseDef: def };
        },

        // Compose the final display range for a melee weapon, applying any reach bonus.,

        composeRangeWithReach: function(baseRange, reachBonus) {
            if (!reachBonus) return baseRange;
            if (typeof baseRange !== 'string') return baseRange;
            if (baseRange === 'Melee') return `Melee [+${reachBonus}]`;
            const m = baseRange.match(/^Melee \[\+(\d+)\]$/);
            if (m) return `Melee [+${parseInt(m[1], 10) + reachBonus}]`;
            return baseRange;
        },

        // Resolve a stored weapon item to its canonical base traits + range. This
        // lets us recover from pre-split saves where weaponData.traits conflated
        // base and expert traits. Custom weapons (no rules match) keep their own.,

        canonicalWeaponView: function(w) {
            if (!w) return { traits: [], range: null };
            if (w.edited || !w.id) return { traits: w.traits ? w.traits : [], range: w.range || null };
            const buckets = ['light', 'heavy', 'special'];
            for (const b of buckets) {
                const list = (this.rules.weapons && this.rules.weapons[b]) || [];
                const def = list.find(x => x.id === w.id);
                if (def) return { traits: def.traits || [], range: def.range };
            }
            return { traits: w.traits || [], range: w.range };
        },

        canonicalArmorView: function(a) {
            if (!a) return { traits: [] };
            if (a.edited || !a.id) return { traits: a.traits ? a.traits : [] };
            const def = (this.rules.armor || []).find(x => x.id === a.id);
            if (def) return { traits: def.traits || [] };
            return { traits: a.traits || [] };
        },

        getEquippedWeaponDisplayData: function() {
            const char = this.currentCharacter;
            return (char.inventory || [])
                .filter(i => i.type === 'weapon' && i.equipped && i.weaponData)
                .map(i => {
                    const w = i.weaponData;
                    const canon = this.canonicalWeaponView(w);
                    const skillData = this.rules.skills.list.find(s => s.id === w.skill);
                    const skillRank = skillData ? (char.skills[w.skill] ?? 0) : 0;
                    const attrValue = skillData ? (char.attributes[skillData.attribute] ?? 0) : 0;
                    const view = this.applyExpertiseToItem(canon.traits, w, 'weapon');
                    return {
                        id: w.id,
                        name: w.name, damage: w.damage, damageType: w.damageType,
                        range: this.composeRangeWithReach(canon.range || w.range, view.reachBonus),
                        attackBonus: attrValue + skillRank,
                        skillName: skillData ? skillData.name : 'Unknown',
                        traits: view.traits,
                        expertNotes: view.expertNotes,
                        hasExpertise: view.hasExpertise,
                        expertiseDef: view.expertiseDef
                    };
                });
        },

        getEquippedArmorDisplayData: function() {
            const char = this.currentCharacter;
            const item = (char.inventory || []).find(i => i.type === 'armor' && i.equipped);
            if (!item) return null;
            // Prefer inline armorData (set for both standard and custom armor)
            if (item.armorData) {
                const canon = this.canonicalArmorView(item.armorData);
                const view = this.applyExpertiseToItem(canon.traits, item.armorData, 'armor');
                return {
                    id: item.armorData.id,
                    name: item.armorData.name,
                    deflect: item.armorData.deflect,
                    weight: item.armorData.weight,
                    traits: view.traits,
                    expertNotes: view.expertNotes,
                    hasExpertise: view.hasExpertise,
                    expertiseDef: view.expertiseDef,
                    custom: item.armorData.custom || false
                };
            }
            // Fallback: legacy items stored only with armorId
            if (item.armorId) {
                const armorDef = this.rules.armor.find(a => a.id === item.armorId);
                if (!armorDef) return null;
                const view = this.applyExpertiseToItem(armorDef.traits, armorDef, 'armor');
                return {
                    id: armorDef.id,
                    name: armorDef.name, deflect: armorDef.deflect,
                    weight: armorDef.weight,
                    traits: view.traits,
                    expertNotes: view.expertNotes,
                    hasExpertise: view.hasExpertise,
                    expertiseDef: view.expertiseDef,
                    custom: false
                };
            }
            return null;
        },

        refreshAfterEquipChange: function() {
            this.syncEquippedFromInventory();
            this.renderEquippedSummary();
            this.renderInventory();
            this.recalculateAll();
            this.updateCharacter();
        },

        addWeaponToInventory: function() {
            this.renderWeaponModal();
            document.getElementById('customWeaponForm').style.display = 'none';
            document.getElementById('weaponListView').style.display = 'block';
            document.getElementById('weaponSearch').value = '';
            document.getElementById('weaponModal').classList.add('active');
        },

        closeWeaponModal: function() {
            document.getElementById('weaponModal').classList.remove('active');
            document.getElementById('customWeaponForm').style.display = 'none';
            document.getElementById('weaponListView').style.display = 'block';
        },

        // Render the per-weapon traits + expert traits line for the picker modal.,

        renderWeaponPickerTraits: function(weapon) {
            const base = weapon.traits || [];
            const expert = weapon.expertTraits || [];
            if (base.length === 0 && expert.length === 0) return '';
            const baseHtml = base.length > 0 ? base.map(t => this.escapeHtml(t)).join(', ') : '';
            const expertHtml = expert.length > 0
                ? `<span style="color: #6b4f8c;"> + expert: ${expert.map(t => this.escapeHtml(t)).join(', ')}</span>`
                : '';
            return `<div style="font-size: 0.75em; margin-top: 4px; color: #666;">${baseHtml}${expertHtml}</div>`;
        },

        renderWeaponModal: function() {
            const renderWeaponList = (weapons, category) => {
                const containerId = category === 'light' ? 'lightWeaponsList'
                    : category === 'heavy' ? 'heavyWeaponsList'
                    : 'specialWeaponsList';
                const container = document.getElementById(containerId);
                container.innerHTML = weapons.map(weapon => `
                    <div class="weapon-option" onclick="app.selectWeapon('${weapon.id}', '${category}')">
                        <div class="weapon-option-name">${weapon.name}</div>
                        <div class="weapon-option-stats">
                            ${weapon.damage} ${weapon.damageType} | ${weapon.range}<br>
                            ${weapon.price} mk | ${weapon.weight} lbs
                        </div>
                        ${this.renderWeaponPickerTraits(weapon)}
                    </div>
                `).join('');
            };
            renderWeaponList(this.rules.weapons.light, 'light');
            renderWeaponList(this.rules.weapons.heavy, 'heavy');
            renderWeaponList(this.rules.weapons.special || [], 'special');
        },

        filterWeapons: function(searchTerm) {
            const term = searchTerm.toLowerCase();
            const filterList = (weapons, category) => {
                const containerId = category === 'light' ? 'lightWeaponsList'
                    : category === 'heavy' ? 'heavyWeaponsList'
                    : 'specialWeaponsList';
                const filtered = weapons.filter(w =>
                    w.name.toLowerCase().includes(term) ||
                    (w.damageType && w.damageType.toLowerCase().includes(term)) ||
                    (w.traits && w.traits.some(t => t.toLowerCase().includes(term))) ||
                    (w.expertTraits && w.expertTraits.some(t => t.toLowerCase().includes(term)))
                );
                const container = document.getElementById(containerId);
                if (filtered.length === 0) {
                    container.innerHTML = '<div class="help-text">No weapons found</div>';
                } else {
                    container.innerHTML = filtered.map(weapon => `
                        <div class="weapon-option" onclick="app.selectWeapon('${weapon.id}', '${category}')">
                            <div class="weapon-option-name">${weapon.name}</div>
                            <div class="weapon-option-stats">
                                ${weapon.damage} ${weapon.damageType} | ${weapon.range}<br>
                                ${weapon.price} mk | ${weapon.weight} lbs
                            </div>
                            ${this.renderWeaponPickerTraits(weapon)}
                        </div>
                    `).join('');
                }
            };
            filterList(this.rules.weapons.light, 'light');
            filterList(this.rules.weapons.heavy, 'heavy');
            filterList(this.rules.weapons.special || [], 'special');
        },

        showCustomWeaponForm: function() {
            document.getElementById('weaponListView').style.display = 'none';
            document.getElementById('customWeaponForm').style.display = 'block';
            document.getElementById('cwName').value = '';
            document.getElementById('cwSkill').value = 'light_weaponry';
            document.getElementById('cwDamage').value = '1d6';
            document.getElementById('cwDamageType').value = 'keen';
            document.getElementById('cwRange').value = 'Melee';
            document.getElementById('cwWeight').value = '2';
            const cwPriceEl = document.getElementById('cwPrice');
            if (cwPriceEl) cwPriceEl.value = '0';
            document.getElementById('cwTraits').value = '';
            document.getElementById('cwNotes').value = '';
        },

        cancelCustomWeaponForm: function() {
            document.getElementById('customWeaponForm').style.display = 'none';
            document.getElementById('weaponListView').style.display = 'block';
        },

        addCustomWeapon: function() {
            const name = document.getElementById('cwName').value.trim();
            if (!name) { this.dialog.alert('Please enter a weapon name.', { title: 'Missing Weapon Name', variant: 'warning' }); return; }
            const skill = document.getElementById('cwSkill').value;
            const damage = document.getElementById('cwDamage').value;
            const damageType = document.getElementById('cwDamageType').value;
            const range = document.getElementById('cwRange').value.trim() || 'Melee';
            const weight = Math.max(0, parseFloat(document.getElementById('cwWeight').value) || 0);
            const cwPriceEl = document.getElementById('cwPrice');
            const price = cwPriceEl ? Math.max(0, parseFloat(cwPriceEl.value) || 0) : 0;
            const traitsRaw = document.getElementById('cwTraits').value.trim();
            const traits = traitsRaw ? traitsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
            const notes = document.getElementById('cwNotes').value.trim();

            const weaponData = {
                id: 'custom_' + Date.now(),
                name, skill, damage, damageType, range, traits, weight, price,
                notes,
                custom: true
            };

            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];
            this.currentCharacter.inventory.push({
                name,
                quantity: 1,
                weight,
                price,
                description: `${damage} ${damageType} | ${range}${notes ? ' | ' + notes : ''}`,
                type: 'weapon',
                weaponData,
                equipped: false
            });

            this.closeWeaponModal();
            this.refreshAfterEquipChange();
        },

        selectWeapon: function(weaponId, category) {
            const weapon = this.rules.weapons[category].find(w => w.id === weaponId);
            if (!weapon) return;
            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];

            this.currentCharacter.inventory.push({
                name: weapon.name,
                quantity: 1,
                weight: weapon.weight,
                price: weapon.price ?? 0,
                description: `${weapon.damage} ${weapon.damageType} | ${weapon.range}`,
                type: 'weapon',
                weaponData: {...weapon},
                equipped: false
            });

            this.closeWeaponModal();
            this.refreshAfterEquipChange();
        },

        equipWeaponFromInventory: function(inventoryIndex) {
            const item = this.currentCharacter.inventory[inventoryIndex];
            if (!item || item.type !== 'weapon' || !item.weaponData) return;

            for (const invItem of this.currentCharacter.inventory) {
                if (invItem.type === 'weapon') invItem.equipped = false;
            }
            item.equipped = true;
            this.refreshAfterEquipChange();
        },

        unequipWeaponFromInventory: function(inventoryIndex) {
            const item = this.currentCharacter.inventory[inventoryIndex];
            if (!item || item.type !== 'weapon') return;
            item.equipped = false;
            this.refreshAfterEquipChange();
        },

        equipArmorFromInventory: function(inventoryIndex) {
            const item = this.currentCharacter.inventory[inventoryIndex];
            if (!item || item.type !== 'armor' || (!item.armorId && !item.armorData)) return;

            for (const invItem of this.currentCharacter.inventory) {
                if (invItem.type === 'armor') invItem.equipped = false;
            }
            item.equipped = true;
            this.refreshAfterEquipChange();
        },

        unequipArmorFromInventory: function(inventoryIndex) {
            const item = this.currentCharacter.inventory[inventoryIndex];
            if (!item || item.type !== 'armor') return;
            item.equipped = false;
            this.refreshAfterEquipChange();
        },

        showArmorModal: function() {
            this.renderArmorModal();
            document.getElementById('armorListView').style.display = 'block';
            document.getElementById('customArmorForm').style.display = 'none';
            document.getElementById('armorSearch').value = '';
            document.getElementById('armorModal').classList.add('active');
        },

        closeArmorModal: function() {
            document.getElementById('armorModal').classList.remove('active');
        },

        renderArmorModal: function() {
            const ownedIds = (this.currentCharacter.inventory || [])
                .filter(i => i.type === 'armor' && i.armorId)
                .map(i => i.armorId);

            const container = document.getElementById('armorList');
            container.innerHTML = this.rules.armor.map(armor => {
                const owned = ownedIds.includes(armor.id);
                return `<div class="weapon-option" onclick="app.selectArmor('${armor.id}')" style="${owned ? 'opacity: 0.55;' : ''}">
                    <div class="weapon-option-name">${armor.name}${owned ? ' <span style="font-size:0.8em; font-weight: normal;">(already owned)</span>' : ''}</div>
                    <div class="weapon-option-stats">
                        Deflect ${armor.deflect} | ${armor.weight} lbs | ${armor.price} mk
                        ${armor.traits && armor.traits.length > 0 ? '| ' + armor.traits.join(', ') : ''}
                        ${armor.strengthRequired > 0 ? '| STR ' + armor.strengthRequired + ' req.' : ''}
                    </div>
                    ${armor.expertTraits && armor.expertTraits.length > 0 ?
                        `<div style="font-size: 0.75em; margin-top: 4px; color: #666;">Expert: ${armor.expertTraits.join(', ')}</div>`
                        : ''}
                </div>`;
            }).join('');
        },

        filterArmor: function(searchTerm) {
            const term = searchTerm.toLowerCase();
            const ownedIds = (this.currentCharacter.inventory || [])
                .filter(i => i.type === 'armor' && i.armorId)
                .map(i => i.armorId);

            const filtered = this.rules.armor.filter(a =>
                a.name.toLowerCase().includes(term) ||
                (a.traits && a.traits.some(t => t.toLowerCase().includes(term)))
            );
            const container = document.getElementById('armorList');
            if (filtered.length === 0) {
                container.innerHTML = '<div class="help-text">No armor found</div>';
            } else {
                container.innerHTML = filtered.map(armor => {
                    const owned = ownedIds.includes(armor.id);
                    return `<div class="weapon-option" onclick="app.selectArmor('${armor.id}')" style="${owned ? 'opacity: 0.55;' : ''}">
                        <div class="weapon-option-name">${armor.name}${owned ? ' <span style="font-size:0.8em; font-weight: normal;">(already owned)</span>' : ''}</div>
                        <div class="weapon-option-stats">
                            Deflect ${armor.deflect} | ${armor.weight} lbs | ${armor.price} mk
                            ${armor.traits && armor.traits.length > 0 ? '| ' + armor.traits.join(', ') : ''}
                            ${armor.strengthRequired > 0 ? '| STR ' + armor.strengthRequired + ' req.' : ''}
                        </div>
                        ${armor.expertTraits && armor.expertTraits.length > 0 ?
                            `<div style="font-size: 0.75em; margin-top: 4px; color: #666;">Expert: ${armor.expertTraits.join(', ')}</div>`
                            : ''}
                    </div>`;
                }).join('');
            }
        },

        selectArmor: function(armorId) {
            const armor = this.rules.armor.find(a => a.id === armorId);
            if (!armor) return;
            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];

            this.currentCharacter.inventory.push({
                name: armor.name,
                quantity: 1,
                weight: armor.weight,
                price: armor.price ?? 0,
                description: `Deflect ${armor.deflect}`,
                type: 'armor',
                armorId: armor.id,
                armorData: { ...armor },
                equipped: false
            });

            this.closeArmorModal();
            this.refreshAfterEquipChange();
        },

        showCustomArmorForm: function() {
            document.getElementById('armorListView').style.display = 'none';
            document.getElementById('customArmorForm').style.display = 'block';
            document.getElementById('caName').value = '';
            document.getElementById('caDeflect').value = '0';
            document.getElementById('caWeight').value = '20';
            document.getElementById('caPrice').value = '0';
            document.getElementById('caStrRequired').value = '0';
            document.getElementById('caTraits').value = '';
            document.getElementById('caNotes').value = '';
        },

        cancelCustomArmorForm: function() {
            document.getElementById('customArmorForm').style.display = 'none';
            document.getElementById('armorListView').style.display = 'block';
        },

        addCustomArmor: function() {
            const name = document.getElementById('caName').value.trim();
            if (!name) { this.dialog.alert('Please enter an armor name.', { title: 'Missing Armor Name', variant: 'warning' }); return; }
            const deflect = parseInt(document.getElementById('caDeflect').value) || 0;
            const weight = parseFloat(document.getElementById('caWeight').value) || 0;
            const price = parseFloat(document.getElementById('caPrice').value) || 0;
            const strengthRequired = parseInt(document.getElementById('caStrRequired').value) || 0;
            const traitsRaw = document.getElementById('caTraits').value.trim();
            const traits = traitsRaw ? traitsRaw.split(',').map(t => t.trim()).filter(t => t) : [];
            const notes = document.getElementById('caNotes').value.trim();

            const armorData = {
                id: 'custom_' + Date.now(),
                name, deflect, traits, expertTraits: [], weight, price, strengthRequired,
                notes,
                custom: true
            };

            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];
            this.currentCharacter.inventory.push({
                name,
                quantity: 1,
                weight,
                price,
                description: `Deflect ${deflect}${notes ? ' | ' + notes : ''}`,
                type: 'armor',
                armorId: null,
                armorData,
                equipped: false
            });

            this.closeArmorModal();
            this.refreshAfterEquipChange();
        },

        // Render a list of {name, expert} trait objects (or legacy strings) with
        // glossary tooltips and expert badges. Returns innerHTML.,

        renderTraitList: function(traits) {
            if (!traits || traits.length === 0) return '';
            const glossary = this.rules.itemTraitGlossary || {};
            return traits.map(t => {
                const obj = (typeof t === 'string') ? { name: t, expert: false } : t;
                const tooltip = this.lookupTraitGlossary(obj.name, glossary);
                const titleAttr = tooltip ? ` title="${this.escapeHtml(tooltip)}"` : '';
                const dataAttr = tooltip ? ' data-glossary="1"' : '';
                const badge = obj.expert ? ' <span class="expert-trait-badge">expert</span>' : '';
                return `<span class="item-trait"${titleAttr}${dataAttr}>${this.escapeHtml(obj.name)}${badge}</span>`;
            }).join(', ');
        },

        // Glossary keys may include parameter brackets (e.g. "Cumbersome [3]"). If the
        // exact name is missing, fall back to the keyword before "[" so all
        // Cumbersome variants share a tooltip.,

        lookupTraitGlossary: function(traitName, glossary) {
            if (!traitName) return '';
            if (glossary[traitName]) return glossary[traitName];
            const m = traitName.match(/^([A-Za-z]+(?:\s[A-Za-z]+)*)\s*\[/);
            if (m) {
                const base = m[1];
                if (glossary[base]) return glossary[base];
            }
            return '';
        },

        renderEquippedSummary: function() {
            const container = document.getElementById('equippedSummary');
            let html = '';

            const weapons = this.getEquippedWeaponDisplayData();
            for (const w of weapons) {
                const expertBadge = w.hasExpertise
                    ? `<span class="expert-trait-badge" title="You have the matching expertise.">expertise active</span>` : '';
                const expertNotes = (w.expertNotes || []).length > 0
                    ? `<div style="margin-top: 4px; font-size: 0.8em; color: var(--text-secondary);">${(w.expertNotes || []).map(n => this.escapeHtml(n)).join('<br>')}</div>` : '';
                html += `<div class="item-card">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 6px;">⚔️ ${this.escapeHtml(w.name)} ${expertBadge}</div>
                        <div class="item-details">
                            <div class="item-stat"><div class="item-stat-label">Damage</div><div class="item-stat-value">${w.damage} ${w.damageType}</div></div>
                            <div class="item-stat"><div class="item-stat-label">Range</div><div class="item-stat-value">${this.escapeHtml(w.range)}</div></div>
                            <div class="item-stat"><div class="item-stat-label">Attack</div><div class="item-stat-value">+${w.attackBonus}</div></div>
                            <div class="item-stat"><div class="item-stat-label">Skill</div><div class="item-stat-value">${this.escapeHtml(w.skillName)}</div></div>
                        </div>
                        ${w.traits.length > 0 ?
                            `<div style="margin-top: 6px; font-size: 0.85em; color: var(--text-secondary);"><strong>Traits:</strong> ${this.renderTraitList(w.traits)}</div>` : ''}
                        ${expertNotes}
                    </div>
                    <div class="item-actions">
                        <button class="inline-dice-btn"
                                onclick="diceRoller.rollWeaponAttack(\`${w.name}\`, ${w.attackBonus}, \`${w.damage}\`)"
                                title="Roll attack">🎲</button>
                    </div>
                </div>`;
            }

            const armor = this.getEquippedArmorDisplayData();
            if (armor) {
                const expertBadge = armor.hasExpertise
                    ? `<span class="expert-trait-badge" title="You have the matching expertise.">expertise active</span>` : '';
                const expertNotes = (armor.expertNotes || []).length > 0
                    ? `<div style="margin-top: 4px; font-size: 0.8em; color: var(--text-secondary);">${(armor.expertNotes || []).map(n => this.escapeHtml(n)).join('<br>')}</div>` : '';
                html += `<div class="item-card">
                    <div style="flex: 1;">
                        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 6px;">🛡️ ${this.escapeHtml(armor.name)} ${expertBadge}</div>
                        <div class="item-details">
                            <div class="item-stat"><div class="item-stat-label">Deflect</div><div class="item-stat-value">${armor.deflect}</div></div>
                            <div class="item-stat"><div class="item-stat-label">Weight</div><div class="item-stat-value">${armor.weight} lbs</div></div>
                            <div class="item-stat"><div class="item-stat-label">Traits</div><div class="item-stat-value">${armor.traits.length > 0 ? this.renderTraitList(armor.traits) : 'None'}</div></div>
                        </div>
                        ${expertNotes}
                    </div>
                </div>`;
            }

            if (!html) {
                html = '<div class="help-text">No gear equipped. Equip weapons and armor from your inventory below.</div>';
            }
            container.innerHTML = html;
        },

        renderStartingKitOptions: function() {
            const select = document.getElementById('startingKit');
            if (!this.rules.startingKits) return;
            
            select.innerHTML = '<option value="">-- Choose a Starting Kit --</option>' + 
                this.rules.startingKits.map(kit => 
                    `<option value="${kit.id}" ${this.currentCharacter.startingKit === kit.id ? 'selected' : ''}>
                        ${kit.name}
                    </option>`
                ).join('');
        },

        selectStartingKit: async function(kitId) {
            const oldKitId = this.currentCharacter.startingKit;
            if (!kitId) {
                this.currentCharacter.startingKit = null;
                document.getElementById('startingKitDetails').style.display = 'none';
                if (oldKitId) this.cascadeCleanup({ oldKitId });
                this.renderExpertises();
                this.updateCharacter();
                return;
            }

            const kit = this.rules.startingKits.find(k => k.id === kitId);
            if (!kit) return;

            if (oldKitId && oldKitId !== kitId) {
                const confirmed = await this.dialog.confirm(
                    'Changing your starting kit will remove kit-granted expertises and re-validate dependent talents. Items already in your inventory will not be removed. Continue?',
                    { title: 'Change Starting Kit', okText: 'Change Kit' }
                );
                if (!confirmed) {
                    document.getElementById('startingKit').value = oldKitId;
                    return;
                }
            }

            this.currentCharacter.startingKit = kitId;
            this.showStartingKitDetails(kitId);
            this.cascadeCleanup({ oldKitId });
            this.renderExpertises();
            this.updateCharacter();
        },

        applyKitToInventory: async function() {
            const kitId = this.currentCharacter.startingKit;
            if (!kitId) return;
            const kit = this.rules.startingKits.find(k => k.id === kitId);
            if (!kit) return;

            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];
            const added = [];

            // Roll currency
            if (kit.currency && kit.currency.dice !== "0") {
                const [count, sides] = kit.currency.dice.split('d').map(Number);
                let total = 0;
                for (let i = 0; i < count; i++) {
                    total += Math.floor(Math.random() * sides) + 1;
                }
                this.currentCharacter.currency.marks = total;
                document.getElementById('marks').value = total;
                added.push(`${total} marks (rolled ${kit.currency.dice})`);
            }

            // Bonus expertises
            if (kit.bonuses && kit.bonuses.expertise) {
                const exp = kit.bonuses.expertise.split(' (')[0];
                if (!this.currentCharacter.expertises.includes(exp)) {
                    this.currentCharacter.expertises.push(exp);
                    added.push(`Expertise: ${exp}`);
                }
            }

            // Connection
            if (kit.bonuses && kit.bonuses.connection) {
                if (!this.currentCharacter.connections) this.currentCharacter.connections = [];
                const connection = {
                    name: kit.name + ' Connection',
                    description: kit.bonuses.connection,
                    relationship: 'Patron/Bond'
                };
                if (!this.currentCharacter.connections.some(c => c.name === connection.name)) {
                    this.currentCharacter.connections.push(connection);
                    added.push(`Connection: ${connection.name}`);
                }
            }

            // Equipment
            if (kit.equipment && kit.equipment.length > 0) {
                const equipmentCatalog = (this.rules && Array.isArray(this.rules.equipment)) ? this.rules.equipment : [];
                for (const entry of kit.equipment) {
                    const isObj = entry && typeof entry === 'object';
                    const catalogName = isObj ? entry.item : entry;
                    const quantity = isObj && entry.quantity ? Math.max(1, parseInt(entry.quantity, 10) || 1) : 1;
                    const note = isObj && entry.note ? entry.note : '';
                    const catalogDef = equipmentCatalog.find(
                        eq => eq.name.toLowerCase() === String(catalogName || '').toLowerCase()
                    );
                    const itemName = catalogDef ? catalogDef.name : (isObj ? (entry.label || entry.item) : entry);
                    const weight = catalogDef ? catalogDef.weight : 0;
                    const price = catalogDef ? catalogDef.price : 0;
                    const description = note ? `${note} | From ${kit.name}` : `From ${kit.name}`;

                    if (!this.currentCharacter.inventory.some(i => i.name === itemName)) {
                        this.currentCharacter.inventory.push({
                            name: itemName,
                            quantity,
                            weight,
                            price,
                            description
                        });
                        added.push(quantity > 1 ? `${itemName} (×${quantity})` : itemName);
                    }
                }
            }

            // Armor → inventory with type:'armor'
            if (kit.armor && kit.armor !== 'none') {
                for (const armorName of kit.armor.split(' and ')) {
                    const armorId = armorName.trim().toLowerCase().replace(/\s+/g, '_');
                    const armorDef = this.rules.armor.find(a => a.id === armorId);
                    const capitalizedName = armorName.trim().charAt(0).toUpperCase() + armorName.trim().slice(1);
                    if (!this.currentCharacter.inventory.some(i => i.name.toLowerCase() === capitalizedName.toLowerCase())) {
                        this.currentCharacter.inventory.push({
                            name: armorDef ? armorDef.name : capitalizedName,
                            quantity: 1,
                            weight: armorDef ? armorDef.weight : 0,
                            price: armorDef ? armorDef.price : 0,
                            description: armorDef ? `Deflect ${armorDef.deflect}` : `Armor from ${kit.name}`,
                            type: 'armor',
                            armorId: armorDef ? armorDef.id : armorId,
                            armorData: armorDef ? { ...armorDef } : undefined,
                            equipped: false
                        });
                        added.push(`${armorDef ? armorDef.name : capitalizedName} (armor)`);
                    }
                }
            }

            this.syncEquippedFromInventory();
            this.renderCharacterSheet();
            this.updateCharacter();

            // Show result, then open weapon modal if kit includes weapons
            if (added.length > 0) {
                await this.dialog.alert('Added to inventory:\n• ' + added.join('\n• '), { title: 'Starting Kit Applied', variant: 'success' });
            } else {
                await this.dialog.alert('All kit items are already in your inventory.', { title: 'Starting Kit', variant: 'info' });
            }

            if (kit.weapons && kit.weapons.length > 0) {
                await this.dialog.alert(
                    'Your kit includes weapons: ' + kit.weapons.join(', ') +
                    '\n\nThe weapon catalog will open now so you can choose.',
                    { title: 'Choose Starting Weapons', okText: 'Open Weapon Catalog' }
                );
                this.addWeaponToInventory();
            }
        },

        showStartingKitDetails: function(kitId) {
            const kit = this.rules.startingKits.find(k => k.id === kitId);
            if (!kit) {
                document.getElementById('startingKitDetails').style.display = 'none';
                return;
            }
            
            const detailsDiv = document.getElementById('startingKitDetails');
            detailsDiv.style.display = 'block';
            
            let html = `<p style="margin: 0 0 10px 0; font-style: italic;">${kit.description}</p>`;
            
            if (kit.weapons && kit.weapons.length > 0) {
                html += `<div><strong>Weapons:</strong> ${kit.weapons.join(', ')}</div>`;
            }
            if (kit.armor && kit.armor !== 'none') {
                html += `<div><strong>Armor:</strong> ${kit.armor}</div>`;
            }
            if (kit.equipment && kit.equipment.length > 0) {
                const equipLabels = kit.equipment.map(e => (e && typeof e === 'object') ? (e.label || e.item) : e);
                html += `<div><strong>Equipment:</strong> ${equipLabels.join(', ')}</div>`;
            }
            if (kit.currency) {
                html += `<div><strong>Currency:</strong> Roll ${kit.currency.dice} ${kit.currency.type}</div>`;
            }
            if (kit.bonuses) {
                if (kit.bonuses.expertise) {
                    html += `<div><strong>Bonus:</strong> ${kit.bonuses.expertise}</div>`;
                }
                if (kit.bonuses.connection) {
                    html += `<div><strong>Connection:</strong> ${kit.bonuses.connection}</div>`;
                }
            }
            
            html += `<button onclick="app.applyKitToInventory()" style="margin-top: 12px; background: linear-gradient(135deg, #4CAF50, #45a049); color: white; font-weight: bold; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; width: 100%;">
                📦 Apply Kit Items to Inventory
            </button>`;
            
            detailsDiv.innerHTML = html;
        },

        calculateAttackBonuses: function() {
            // Melee attack = STR or SPD + Light/Heavy Weaponry skill
            const str = this.currentCharacter.attributes.strength;
            const spd = this.currentCharacter.attributes.speed;
            const lightWeap = this.currentCharacter.skills.light_weaponry;
            const heavyWeap = this.currentCharacter.skills.heavy_weaponry;
            if (str === undefined || spd === undefined || lightWeap === undefined || heavyWeap === undefined) {
                throw new Error('Required attributes or skills undefined in calculateAttackBonuses');
            }
            
            const meleeBonus = Math.max(str + lightWeap, str + heavyWeap, spd + lightWeap);
            const rangedBonus = Math.max(spd + lightWeap, str + heavyWeap);
            
            document.getElementById('meleeAttack').textContent = `+${meleeBonus}`;
            document.getElementById('rangedAttack').textContent = `+${rangedBonus}`;
        },

        calculateInitiative: function() {
            const awa = this.currentCharacter.attributes.awareness;
            const spd = this.currentCharacter.attributes.speed;
            if (awa === undefined || spd === undefined) {
                throw new Error('Awareness or Speed undefined in calculateInitiative');
            }
            const initiative = awa + spd;
            document.getElementById('initiative').textContent = `+${initiative}`;
        },

        addInventoryItem: function() {
            // Open item selection modal
            const search = document.getElementById('itemSearch');
            if (search) search.value = '';
            this.renderItemList();
            document.getElementById('itemModal').classList.add('active');
        },

        closeItemModal: function() {
            document.getElementById('itemModal').classList.remove('active');
        },

        renderItemList: function() {
            if (!this.rules.equipment) return;
            
            const container = document.getElementById('itemsList');
            const categories = {};
            
            // Group items by category
            this.rules.equipment.forEach(item => {
                if (!categories[item.category]) {
                    categories[item.category] = [];
                }
                categories[item.category].push(item);
            });
            
            // Render by category
            let html = '';
            Object.keys(categories).sort().forEach(category => {
                html += `<h4 style="margin-top: 15px; color: var(--secondary-color);">${category}</h4>`;
                html += categories[category].map(item => `
                    <div class="weapon-option" onclick="app.selectItem(${JSON.stringify(item.name).replace(/"/g, '&quot;')}, ${item.weight}, ${item.price})">
                        <div class="weapon-option-name">${this.escapeHtml(item.name)}</div>
                        <div class="weapon-option-stats">
                            Weight: ${item.weight} lbs | Price: ${item.price} mk
                        </div>
                    </div>
                `).join('');
            });
            
            container.innerHTML = html;
        },

        filterItems: function(searchTerm) {
            const items = document.querySelectorAll('#itemsList .weapon-option');
            const term = searchTerm.toLowerCase();
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? 'block' : 'none';
            });
            
            // Show/hide category headers
            const headers = document.querySelectorAll('#itemsList h4');
            headers.forEach(header => {
                const nextItems = [];
                let sibling = header.nextElementSibling;
                while (sibling && sibling.tagName !== 'H4') {
                    if (sibling.classList.contains('weapon-option') && sibling.style.display !== 'none') {
                        nextItems.push(sibling);
                    }
                    sibling = sibling.nextElementSibling;
                }
                header.style.display = nextItems.length > 0 ? 'block' : 'none';
            });
        },

        selectItem: async function(name, weight, price) {
            const result = await this.dialog.form({
                title: `Add ${name}`,
                message: `Weight: ${weight} lbs | Price: ${price} mk each`,
                fields: [{
                    name: 'quantity',
                    label: 'Quantity',
                    type: 'number',
                    value: '1',
                    min: 1,
                    step: 1,
                    required: true
                }],
                okText: 'Add to Inventory'
            });
            if (!result) return;
            const quantity = Math.max(1, parseInt(result.quantity, 10) || 1);
            
            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];
            this.currentCharacter.inventory.push({
                name: name,
                quantity: quantity,
                weight: weight,
                price: price,
                description: ''
            });
            
            this.closeItemModal();
            this.renderInventory();
            this.updateCharacter();
        },

        addCustomItem: async function() {
            const result = await this.dialog.form({
                title: '✨ Add Custom Item',
                fields: [
                    { name: 'name', label: 'Item Name', type: 'text', required: true, placeholder: 'e.g. Rope (1 foot), Fabrial Lantern' },
                    { name: 'quantity', label: 'Quantity', type: 'number', value: '1', min: 1, step: 1, required: true },
                    { name: 'weight', label: 'Weight (lbs each)', type: 'number', value: '0', min: 0, step: 'any' },
                    { name: 'price', label: 'Price (mk each)', type: 'number', value: '0', min: 0, step: 'any' },
                    { name: 'description', label: 'Description (optional)', type: 'textarea', rows: 2, placeholder: 'Notes or special properties...' }
                ],
                okText: 'Add to Inventory'
            });
            if (!result) return;
            const name = result.name.trim();
            if (!name) return;
            const quantity = Math.max(1, parseInt(result.quantity, 10) || 1);
            const weight = Math.max(0, parseFloat(result.weight) || 0);
            const price = Math.max(0, parseFloat(result.price) || 0);
            const description = (result.description || '').trim();
            
            if (!this.currentCharacter.inventory) this.currentCharacter.inventory = [];
            this.currentCharacter.inventory.push({name, quantity, weight, price, description});
            
            this.closeItemModal();
            this.renderInventory();
            this.updateCharacter();
        },

        editInventoryItem: async function(index) {
            const item = this.currentCharacter.inventory && this.currentCharacter.inventory[index];
            if (!item) return;

            if (item.type === 'weapon') {
                await this.editWeaponItem(item);
            } else if (item.type === 'armor') {
                await this.editArmorItem(item);
            } else {
                await this.editGeneralItem(item);
            }
        },

        editGeneralItem: async function(item) {
            const result = await this.dialog.form({
                title: '✏️ Edit Item',
                fields: [
                    { name: 'name', label: 'Item Name', type: 'text', required: true, value: item.name || '' },
                    { name: 'quantity', label: 'Quantity', type: 'number', value: String(item.quantity ?? 1), min: 1, step: 1, required: true },
                    { name: 'weight', label: 'Weight (lbs each)', type: 'number', value: String(item.weight ?? 0), min: 0, step: 'any' },
                    { name: 'price', label: 'Price (mk each)', type: 'number', value: String(this.getItemUnitPrice(item)), min: 0, step: 'any' },
                    { name: 'description', label: 'Description', type: 'textarea', rows: 3, value: item.description || '' }
                ],
                okText: 'Save Changes'
            });
            if (!result) return;

            item.name = result.name.trim();
            item.quantity = Math.max(1, parseInt(result.quantity, 10) || 1);
            item.weight = Math.max(0, parseFloat(result.weight) || 0);
            item.price = Math.max(0, parseFloat(result.price) || 0);
            item.description = (result.description || '').trim();

            this.renderInventory();
            this.updateCharacter();
        },

        editWeaponItem: async function(item) {
            const w = item.weaponData || {};
            const canon = this.canonicalWeaponView(w);
            const currentTraits = Array.isArray(canon.traits) ? canon.traits.join(', ') : '';
            const currentRange = canon.range || w.range || 'Melee';

            // Recover notes from weaponData.notes, or trailing segment of legacy custom descriptions
            let currentNotes = w.notes || '';
            if (!currentNotes && item.description) {
                const parts = item.description.split(' | ');
                if (parts.length > 2) currentNotes = parts.slice(2).join(' | ');
            }

            const skillOptions = [
                { value: 'light_weaponry', label: 'Light Weaponry' },
                { value: 'heavy_weaponry', label: 'Heavy Weaponry' },
                { value: 'athletics', label: 'Athletics (Unarmed)' },
                { value: 'variable', label: 'Variable' }
            ];
            const currentSkill = w.skill || 'light_weaponry';
            if (!skillOptions.some(o => o.value === currentSkill)) {
                skillOptions.push({ value: currentSkill, label: currentSkill });
            }

            const damageTypeOptions = [
                { value: 'keen', label: 'Keen' },
                { value: 'impact', label: 'Impact' },
                { value: 'energy', label: 'Energy' },
                { value: 'spirit', label: 'Spirit' },
                { value: 'variable', label: 'Variable' }
            ];
            const currentDamageType = w.damageType || 'keen';
            if (!damageTypeOptions.some(o => o.value === currentDamageType)) {
                damageTypeOptions.push({ value: currentDamageType, label: currentDamageType });
            }

            const result = await this.dialog.form({
                title: '✏️ Edit Weapon',
                columns: 2,
                fields: [
                    { name: 'name', label: 'Weapon Name', type: 'text', required: true, value: w.name || item.name || '', fullWidth: true },
                    { name: 'skill', label: 'Skill', type: 'select', options: skillOptions, value: currentSkill },
                    { name: 'damage', label: 'Damage Dice', type: 'text', required: true, value: w.damage || '1d6', placeholder: 'e.g. 1d6, 2d8, Variable' },
                    { name: 'damageType', label: 'Damage Type', type: 'select', options: damageTypeOptions, value: currentDamageType },
                    { name: 'range', label: 'Range', type: 'text', value: currentRange, placeholder: 'e.g. Melee, Ranged [80/320]' },
                    { name: 'quantity', label: 'Quantity', type: 'number', value: String(item.quantity ?? 1), min: 1, step: 1, required: true },
                    { name: 'weight', label: 'Weight (lbs)', type: 'number', value: String(w.weight ?? item.weight ?? 0), min: 0, step: 'any' },
                    { name: 'price', label: 'Price (mk each)', type: 'number', value: String(this.getItemUnitPrice(item)), min: 0, step: 'any', fullWidth: true },
                    { name: 'traits', label: 'Traits (comma-separated)', type: 'text', value: currentTraits, placeholder: 'e.g. Quickdraw, Deadly, Offhand', fullWidth: true },
                    { name: 'notes', label: 'Notes / Description', type: 'textarea', rows: 2, value: currentNotes, placeholder: 'Special rules, lore, or GM notes...', fullWidth: true }
                ],
                okText: 'Save Changes'
            });
            if (!result) return;

            const name = result.name.trim();
            const skill = result.skill;
            const damage = result.damage.trim() || '1d6';
            const damageType = result.damageType;
            const range = result.range.trim() || 'Melee';
            const quantity = Math.max(1, parseInt(result.quantity, 10) || 1);
            const weight = Math.max(0, parseFloat(result.weight) || 0);
            const price = Math.max(0, parseFloat(result.price) || 0);
            const traits = (result.traits || '').split(',').map(t => t.trim()).filter(Boolean);
            const notes = (result.notes || '').trim();

            item.name = name;
            item.quantity = quantity;
            item.weight = weight;
            item.price = price;
            item.description = `${damage} ${damageType} | ${range}${notes ? ' | ' + notes : ''}`;
            item.weaponData = {
                ...w,
                id: w.id || ('custom_' + Date.now()),
                name,
                skill,
                damage,
                damageType,
                range,
                weight,
                price,
                traits,
                notes,
                edited: true
            };

            this.refreshAfterEquipChange();
        },

        editArmorItem: async function(item) {
            const armorDef = item.armorId ? (this.rules.armor || []).find(a => a.id === item.armorId) : null;
            const base = item.armorData || armorDef || {};
            const canon = this.canonicalArmorView(base);
            const currentTraits = Array.isArray(canon.traits) ? canon.traits.join(', ') : '';

            let currentNotes = base.notes || '';
            if (!currentNotes && item.description) {
                const parts = item.description.split(' | ');
                const extraParts = parts.filter(p => !/^Deflect\s+\d+$/i.test(p.trim()) && !/^\d+(\.\d+)?\s*mk$/i.test(p.trim()));
                if (extraParts.length > 0) currentNotes = extraParts.join(' | ');
            }

            const result = await this.dialog.form({
                title: '✏️ Edit Armor',
                columns: 2,
                fields: [
                    { name: 'name', label: 'Armor Name', type: 'text', required: true, value: base.name || item.name || '', fullWidth: true },
                    { name: 'deflect', label: 'Deflect Value', type: 'number', value: String(base.deflect ?? 0), min: 0, max: 20, step: 1, required: true },
                    { name: 'weight', label: 'Weight (lbs)', type: 'number', value: String(base.weight ?? item.weight ?? 0), min: 0, step: 'any' },
                    { name: 'price', label: 'Price (mk each)', type: 'number', value: String(this.getItemUnitPrice(item)), min: 0, step: 'any' },
                    { name: 'strengthRequired', label: 'STR Required', type: 'number', value: String(base.strengthRequired ?? 0), min: 0, max: 10, step: 1 },
                    { name: 'quantity', label: 'Quantity', type: 'number', value: String(item.quantity ?? 1), min: 1, step: 1, required: true },
                    { name: 'traits', label: 'Traits (comma-separated)', type: 'text', value: currentTraits, placeholder: 'e.g. Cumbersome [3], Presentable', fullWidth: true },
                    { name: 'notes', label: 'Notes / Description', type: 'textarea', rows: 2, value: currentNotes, placeholder: 'Special rules, lore, or GM notes...', fullWidth: true }
                ],
                okText: 'Save Changes'
            });
            if (!result) return;

            const name = result.name.trim();
            const deflect = Math.max(0, parseInt(result.deflect, 10) || 0);
            const weight = Math.max(0, parseFloat(result.weight) || 0);
            const price = Math.max(0, parseFloat(result.price) || 0);
            const strengthRequired = Math.max(0, parseInt(result.strengthRequired, 10) || 0);
            const quantity = Math.max(1, parseInt(result.quantity, 10) || 1);
            const traits = (result.traits || '').split(',').map(t => t.trim()).filter(Boolean);
            const notes = (result.notes || '').trim();

            item.name = name;
            item.quantity = quantity;
            item.weight = weight;
            item.price = price;
            const descParts = [`Deflect ${deflect}`];
            if (notes) descParts.push(notes);
            item.description = descParts.join(' | ');
            item.armorData = {
                ...base,
                id: base.id || item.armorId || ('custom_' + Date.now()),
                name,
                deflect,
                weight,
                price,
                strengthRequired,
                traits,
                notes,
                edited: true
            };

            this.refreshAfterEquipChange();
        },

        removeInventoryItem: async function(index) {
            const item = this.currentCharacter.inventory[index];
            if (!item) return;

            const msg = (item.equipped && (item.type === 'weapon' || item.type === 'armor'))
                ? `Remove "${item.name}" from inventory and unequip it?`
                : `Remove "${item.name}" from inventory?`;
            const confirmed = await this.dialog.confirm(msg, { title: 'Remove Item', okText: 'Remove', danger: true });
            if (!confirmed) return;

            this.currentCharacter.inventory.splice(index, 1);
            this.refreshAfterEquipChange();
        },

        // Sections inside tabs are always-open. Kept as a no-op for legacy onclick handlers.,

        renderInventory: function() {
            const container = document.getElementById('inventoryList');
            if (!this.currentCharacter.inventory || this.currentCharacter.inventory.length === 0) {
                container.innerHTML = '<div class="help-text">No items in inventory. Use the buttons below to add gear.</div>';
                return;
            }

            let totalWeight = 0;
            let totalValue = 0;
            container.innerHTML = this.currentCharacter.inventory.map((item, index) => {
                const itemWeight = item.weight ?? 0;
                const itemPrice = this.getItemUnitPrice(item);
                const itemQuantity = item.quantity ?? 1;
                const itemTotalWeight = itemWeight * itemQuantity;
                const itemTotalPrice = itemPrice * itemQuantity;
                totalWeight += itemTotalWeight;
                totalValue += itemTotalPrice;

                let typeBadge = '';
                let equipBtn = '';
                if (item.type === 'weapon') {
                    if (item.equipped) {
                        typeBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:0.75em;background:#4CAF50;color:white;margin-left:6px;">Equipped</span>';
                        equipBtn = `<button onclick="app.unequipWeaponFromInventory(${index})" title="Unequip" style="background:#FF9800;color:white;">↩</button>`;
                    } else {
                        typeBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:0.75em;background:var(--primary-color);color:white;margin-left:6px;">Weapon</span>';
                        equipBtn = `<button onclick="app.equipWeaponFromInventory(${index})" title="Equip weapon" style="background:var(--secondary-color);color:white;">⚔️</button>`;
                    }
                } else if (item.type === 'armor') {
                    if (item.equipped) {
                        typeBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:0.75em;background:#4CAF50;color:white;margin-left:6px;">Equipped</span>';
                        equipBtn = `<button onclick="app.unequipArmorFromInventory(${index})" title="Unequip" style="background:#FF9800;color:white;">↩</button>`;
                    } else {
                        typeBadge = '<span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:0.75em;background:#795548;color:white;margin-left:6px;">Armor</span>';
                        equipBtn = `<button onclick="app.equipArmorFromInventory(${index})" title="Equip armor" style="background:var(--secondary-color);color:white;">🛡️</button>`;
                    }
                }

                const metaParts = [];
                if (itemWeight > 0) {
                    metaParts.push(`Weight: ${this.formatEquipmentNumber(itemTotalWeight, 2)} lbs`);
                }
                if (itemPrice > 0) {
                    const unitNote = itemQuantity > 1 ? ` (${this.formatEquipmentNumber(itemPrice, 2)} mk each)` : '';
                    metaParts.push(`Price: ${this.formatEquipmentNumber(itemTotalPrice, 2)} mk${unitNote}`);
                }
                const metaHtml = metaParts.length > 0
                    ? `<div style="font-size: 0.85em; margin-top: 4px;">${metaParts.join(' | ')}</div>`
                    : '';

                return `
                    <div class="item-card">
                        <div style="flex: 1;">
                            <div style="font-weight: bold;">${this.escapeHtml(item.name)} ${itemQuantity > 1 ? `(×${itemQuantity})` : ''}${typeBadge}</div>
                            ${item.description ? `<div style="font-size: 0.9em; color: var(--text-secondary); margin-top: 4px;">${this.escapeHtml(item.description)}</div>` : ''}
                            ${metaHtml}
                        </div>
                        <div class="item-actions">
                            ${equipBtn}
                            <button onclick="app.editInventoryItem(${index})" title="Edit item" style="background: var(--primary-color); color: white;">✏️</button>
                            <button onclick="app.removeInventoryItem(${index})" class="danger" title="Remove">×</button>
                        </div>
                    </div>
                `;
            }).join('') + `<div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-weight: bold; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;"><span>Total Weight: ${this.formatEquipmentNumber(totalWeight, 2)} lbs</span><span>Total Value: ${this.formatEquipmentNumber(totalValue, 2)} mk</span></div>`;
        },

        renderCurrency: function() {
            const char = this.currentCharacter;
            const chips = char.currency?.chips || 0;
            const marks = char.currency?.marks || 0;
            const broams = char.currency?.broams || 0;

            document.getElementById('chips').value = chips;
            document.getElementById('marks').value = marks;
            document.getElementById('broams').value = broams;

            const totalMarks = (chips * 0.05) + marks + (broams * 20);
            document.getElementById('totalMarks').textContent = totalMarks.toFixed(2);
        },

        updateCurrency: function() {
            const chips = parseFloat(document.getElementById('chips').value) || 0;
            const marks = parseFloat(document.getElementById('marks').value) || 0;
            const broams = parseFloat(document.getElementById('broams').value) || 0;
            
            this.currentCharacter.currency = {chips, marks, broams};
            
            const totalMarks = (chips * 0.05) + marks + (broams * 20);
            document.getElementById('totalMarks').textContent = totalMarks.toFixed(2);
            
            this.updateCharacter();
        },

        // ========== INJURIES & CONDITIONS FUNCTIONS ==========
    });
})();
