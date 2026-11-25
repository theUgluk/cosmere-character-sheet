/**
 * Rules Engine, Derived Stats, Character Migration & Validation
 * Handbook formulas (health, focus, investiture, senses, movement, budgets, tiers),
 * character schema migration, cascade cleanup, recalculation, point trackers, and validation.
 */
(function () {
    Object.assign(window.app, {
        computeMaxHealth: function(totalLevel, strength) {
            if (typeof totalLevel !== 'number' || typeof strength !== 'number') {
                throw new Error(`computeMaxHealth: invalid inputs totalLevel=${totalLevel}, strength=${strength}`);
            }
            const healthRules = this.rules.resources.health;
            if (totalLevel <= 0) return healthRules.level1Base + strength;
            let max = healthRules.level1Base + strength;
            for (let lvl = 1; lvl <= totalLevel; lvl++) {
                let row;
                if (lvl <= 20) {
                    row = healthRules.progression.find(r => r.level === lvl);
                    if (!row) throw new Error(`Missing health progression row for level ${lvl}`);
                } else {
                    row = { perLevel: healthRules.perLevelAfter20, addAttribute: false };
                }
                if (lvl > 1) {
                    max += row.perLevel;
                    if (row.addAttribute) max += strength;
                }
            }
            const talentBonus = this.computeTalentMaxHealthBonus(totalLevel);
            return max + talentBonus;
        },

        computeTalentMaxHealthBonus: function(totalLevel) {
            const char = this.currentCharacter;
            if (!char || !char.talents || totalLevel <= 0) return 0;
            let bonus = 0;
            this.rules.heroicPaths.forEach(path => {
                path.specialties.forEach(spec => {
                    spec.talents.forEach(t => {
                        if (!t.effects || !t.effects.maxHealthPerLevel) return;
                        const fullId = `${path.id}_${t.id}`;
                        if (char.talents.includes(fullId)) {
                            bonus += t.effects.maxHealthPerLevel * totalLevel;
                        }
                    });
                });
            });
            return bonus;
        },

        computeMaxFocus: function(willpower) {
            if (typeof willpower !== 'number') {
                throw new Error(`computeMaxFocus: invalid willpower=${willpower}`);
            }
            return this.rules.resources.focus.base + willpower;
        },

        computeSensesRange: function(awareness) {
            if (typeof awareness !== 'number') {
                throw new Error(`computeSensesRange: invalid awareness=${awareness}`);
            }
            const table = this.rules.senses && this.rules.senses.rangeTable;
            if (Array.isArray(table) && table.length) {
                const row = table.find(r => awareness >= r.minAwareness && awareness <= r.maxAwareness);
                if (!row) throw new Error(`No senses range row for awareness ${awareness}`);
                return row.range;
            }
            if (this.rules.senses && typeof this.rules.senses.baseRange === 'number') {
                return this.rules.senses.baseRange + (awareness * 10);
            }
            throw new Error('Senses rules are missing a range table');
        },

        computeMovementRate: function(speed) {
            if (typeof speed !== 'number') {
                throw new Error(`computeMovementRate: invalid speed=${speed}`);
            }
            const row = this.rules.movement.rateTable.find(r => speed >= r.minSpeed && speed <= r.maxSpeed);
            if (!row) throw new Error(`No movement rate row for speed ${speed}`);
            return row.rate;
        },

        computeMaxInvestiture: function(totalLevel) {
            return this.rules.resources.investiture.baseValue + (totalLevel * this.rules.resources.investiture.perLevel);
        },

        computeAttributeBudget: function(totalLevel) {
            let total = this.rules.attributes.startingTotal;
            for (let i = 1; i <= totalLevel; i++) {
                const lvl = this.rules.advancement.levelProgression.find(l => l.level === i);
                if (lvl && lvl.attributeIncreases) total += lvl.attributeIncreases;
            }
            return total;
        },

        computeSkillRankBudget: function(totalLevel) {
            let total = 4;
            for (let i = 1; i <= totalLevel; i++) {
                const lvl = this.rules.advancement.levelProgression.find(l => l.level === i);
                if (lvl && lvl.skillRankIncreases) total += lvl.skillRankIncreases;
            }
            const char = this.currentCharacter;
            if (char && char.grants) {
                char.grants.forEach(g => {
                    if (g.type === 'skill_rank') total += g.amount;
                });
            }
            return total;
        },

        getMaxAttributeAtCurrentLevel: function(totalLevel) {
            if (totalLevel <= 0) return 3;
            return this.rules.attributes.maxValue;
        },

        getCurrentTier: function(totalLevel) {
            if (totalLevel <= 0) return 1;
            const lvl = this.rules.advancement.levelProgression.find(l => l.level === totalLevel);
            if (!lvl) {
                if (totalLevel >= 21) return 5;
                return 1;
            }
            return lvl.tier;
        },

        // Per Stormlight Handbook (page 29 Character Advancement table), max skill rank is 2 at
        // creation and increases by 1 each tier up. Since the JSON's tier brackets are
        // compressed for the 10-level game, we use rank = tier + 1 to keep parity with the
        // official "tier 1 = max 2" rule.,

        getMaxSkillRankAtCurrentLevel: function(totalLevel) {
            if (totalLevel <= 0) return 2;
            const tier = this.getCurrentTier(totalLevel);
            return tier + 1;
        },

        computeExpertiseBudget: function() {
            const char = this.currentCharacter;
            let total = 0;
            const culture = this.getCultureData(char.culture);
            if (culture && culture.expertises) total += culture.expertises.length;
            total += char.attributes.intellect || 0;
            if (char.talents) {
                this.rules.heroicPaths.forEach(path => {
                    if (path.keyTalent && path.keyTalent.grantsExpertiseChoice) {
                        const fullId = `${path.id}_${path.keyTalent.id}`;
                        if (char.talents.includes(fullId)) total += path.keyTalent.grantsExpertiseChoice;
                    }
                    path.specialties.forEach(spec => {
                        spec.talents.forEach(t => {
                            if (!t.grantsExpertiseChoice) return;
                            const fullId = `${path.id}_${t.id}`;
                            if (char.talents.includes(fullId)) total += t.grantsExpertiseChoice;
                        });
                    });
                });
            }
            return total;
        },

        getCultureData: function(cultureRef) {
            if (!cultureRef) return null;
            if (typeof cultureRef === 'object') return cultureRef;
            const cultures = this.rules.cultures;
            if (!cultures) return null;
            return cultures.find(c => c.id === cultureRef || c.name === cultureRef) || null;
        },

        // Resolve a granted expertise reference (id OR display name) into a full
        // record { id?, name, category?, custom? } using the catalog where possible.
        // Unknown names are kept as custom-style entries so legacy / talent-text grants
        // still display.,

        resolveGrantedExpertise: function(ref, source) {
            const catalog = this.rules.expertises || [];
            const refLower = (ref || '').toLowerCase();
            const def = catalog.find(e => e.id.toLowerCase() === refLower)
                || catalog.find(e => e.name.toLowerCase() === refLower);
            if (def) {
                return { id: def.id, name: def.name, category: def.category, custom: false, source };
            }
            return { name: ref, custom: true, source };
        },

        getAutoGrantedExpertises: function() {
            const char = this.currentCharacter;
            const result = [];
            const culture = this.getCultureData(char.culture);
            if (culture && culture.expertises) {
                culture.expertises.forEach(ref => {
                    result.push(this.resolveGrantedExpertise(ref, 'culture'));
                });
            }
            if (char.talents) {
                this.rules.heroicPaths.forEach(path => {
                    const consider = (talent) => {
                        if (!talent || !talent.grantsExpertise) return;
                        const fullId = `${path.id}_${talent.id}`;
                        if (!char.talents.includes(fullId)) return;
                        talent.grantsExpertise.forEach(ref => {
                            result.push(this.resolveGrantedExpertise(ref, `talent:${fullId}`));
                        });
                    };
                    if (path.keyTalent) consider(path.keyTalent);
                    path.specialties.forEach(spec => spec.talents.forEach(consider));
                });
            }
            if (char.startingKit) {
                const kit = this.rules.startingKits && this.rules.startingKits.find(k => k.id === char.startingKit);
                if (kit && kit.bonuses && kit.bonuses.expertise) {
                    const cleaned = kit.bonuses.expertise.split(/\s*\(/)[0].trim();
                    if (cleaned) result.push(this.resolveGrantedExpertise(cleaned, `kit:${kit.id}`));
                }
            }
            return result;
        },

        // ===================================================================
        // CHARACTER MIGRATION & CASCADE CLEANUP
        // ===================================================================

        // Brings a saved character object up to the current schema in-place. Safe to run
        // multiple times. Old saves may have:
        //   - culture as a plain string (now we store the culture id)
        //   - expertises as plain strings (now {name, source})
        //   - missing char.grants,

        migrateCharacterShape: function(char) {
            if (!char) return;
            if (!Array.isArray(char.grants)) char.grants = [];
            if (Array.isArray(char.expertises)) {
                char.expertises = char.expertises.map(e =>
                    typeof e === 'string' ? { name: e, source: 'manual' } : e
                );
            } else {
                char.expertises = [];
            }
            if (typeof char.culture === 'string') {
                const culture = this.getCultureData(char.culture);
                if (culture) char.culture = culture.id;
            } else if (char.culture && typeof char.culture === 'object' && char.culture.id) {
                char.culture = char.culture.id;
            }
            if (!char.surgeRanks || typeof char.surgeRanks !== 'object') char.surgeRanks = {};
            if (!Array.isArray(char.surgeTalents)) char.surgeTalents = [];
            if (!Array.isArray(char.talents)) char.talents = [];
            if (!char.characterDetails || typeof char.characterDetails !== 'object') {
                char.characterDetails = { age: '', gender: '', height: '', weight: '', appearance: '', backstory: '' };
            }
            if (!char.pdfOptions || typeof char.pdfOptions !== 'object') {
                char.pdfOptions = { pageSize: 'a4', compactTalents: [] };
            } else {
                char.pdfOptions.pageSize = char.pdfOptions.pageSize === 'a5' ? 'a5' : 'a4';
                if (!Array.isArray(char.pdfOptions.compactTalents)) {
                    char.pdfOptions.compactTalents = [];
                }
            }

            // Retroactively grant heroic key talents for any path that doesn't have it.
            // Older saves never recorded these, so prereq checks for non-key talents fail.
            if (Array.isArray(char.paths) && Array.isArray(this.rules.heroicPaths)) {
                char.paths.forEach(pathRef => {
                    if (pathRef.type !== 'heroic') return;
                    const pathData = this.rules.heroicPaths.find(p => p.id === pathRef.id);
                    if (!pathData || !pathData.keyTalent || !pathData.keyTalent.id) return;
                    const keyTalentId = `${pathRef.id}_${pathData.keyTalent.id}`;
                    if (!char.talents.includes(keyTalentId)) {
                        char.talents.push(keyTalentId);
                    }
                    const alreadyTracked = char.grants.some(g =>
                        g.type === 'auto_talent' &&
                        g.payload && g.payload.talentId === keyTalentId);
                    if (!alreadyTracked) {
                        char.grants.push({
                            source: pathRef.id,
                            type: 'auto_talent',
                            amount: 1,
                            payload: { talentId: keyTalentId }
                        });
                    }
                });
            }

            // Sync ancestry paths (e.g. add Singer's Change Form tree for legacy saves).
            // We temporarily swap currentCharacter so syncAncestryPath operates on `char`.
            if (Array.isArray(this.rules.ancestryPaths)) {
                const prevCurrent = this.currentCharacter;
                this.currentCharacter = char;
                try {
                    this.syncAncestryPath();
                } finally {
                    this.currentCharacter = prevCurrent;
                }
            }
        },

        // Coordinates removal of all derived state when a character's source data changes
        // (path removed, ancestry/culture/kit swapped). Per the plan this is "full cascade":
        // talents -> surges -> auto expertises -> starting skill rank -> orphaned-prereq talents.
        // After this runs, the caller should re-render and update derived stats.,

        cascadeCleanup: function(opts) {
            const char = this.currentCharacter;
            if (!char) return;
            opts = opts || {};

            // 1) Remove talents from removed paths and their dependent talents.
            if (Array.isArray(opts.removedPathIds) && opts.removedPathIds.length > 0) {
                const removed = new Set(opts.removedPathIds);
                char.talents = (char.talents || []).filter(id => {
                    const prefixId = id.split('_')[0];
                    return !removed.has(prefixId);
                });
                char.surgeTalents = (char.surgeTalents || []).filter(id => {
                    const path = char.paths.find(p => p.type === 'radiant' && removed.has(p.id));
                    if (!path) return true;
                    const radiantOrder = this.rules.radiantOrders.find(o => o.id === path.id);
                    if (!radiantOrder) return true;
                    const surgeIds = radiantOrder.surges || [];
                    return !surgeIds.some(sId => id.startsWith(`surge_${sId}_`));
                });
                if (char.surgeRanks) {
                    Object.keys(char.surgeRanks).forEach(sId => {
                        const stillUsed = (char.paths || []).some(p => {
                            if (p.type !== 'radiant' || removed.has(p.id)) return false;
                            const order = this.rules.radiantOrders.find(o => o.id === p.id);
                            return order && order.surges && order.surges.includes(sId);
                        });
                        if (!stillUsed) delete char.surgeRanks[sId];
                    });
                }

                // Refund per-path grants (e.g. starting skill rank, auto-granted key talents).
                if (Array.isArray(char.grants)) {
                    const remainingGrants = [];
                    char.grants.forEach(grant => {
                        if (removed.has(grant.source)) {
                            if (grant.type === 'skill_rank' && grant.payload && grant.payload.skillId) {
                                const sId = grant.payload.skillId;
                                if (typeof char.skills[sId] === 'number' && char.skills[sId] > 0) {
                                    char.skills[sId] = Math.max(0, char.skills[sId] - grant.amount);
                                }
                            } else if (grant.type === 'auto_talent' && grant.payload && grant.payload.talentId) {
                                const tId = grant.payload.talentId;
                                const i = (char.talents || []).indexOf(tId);
                                if (i >= 0) char.talents.splice(i, 1);
                            }
                            return;
                        }
                        remainingGrants.push(grant);
                    });
                    char.grants = remainingGrants;
                }
            }

            // 2) Reconcile auto-granted expertises (culture/talent/kit changes affect this).
            this.reconcileExpertises();

            // 3) Drop talents whose prereqs are no longer met (cascading).
            let changed = true;
            let safety = 0;
            while (changed && safety++ < 10) {
                changed = false;
                const index = this.buildTalentIndex();
                const newTalents = [];
                const orphaned = [];
                (char.talents || []).forEach(id => {
                    const entry = index.byId.get(id);
                    if (!entry) {
                        // Unknown talent (perhaps from removed path) – drop silently.
                        changed = true;
                        return;
                    }
                    const result = this.checkTalentPrerequisite(entry.talent, entry.pathId);
                    if (result.ok) newTalents.push(id);
                    else { orphaned.push(entry.name); changed = true; }
                });
                char.talents = newTalents;
                if (orphaned.length > 0) {
                    console.warn('Cascade cleanup removed talents with unmet prereqs:', orphaned);
                }
                const newSurge = [];
                (char.surgeTalents || []).forEach(id => {
                    const entry = index.byId.get(id);
                    if (!entry) { changed = true; return; }
                    const result = this.checkTalentPrerequisite(entry.talent, entry.pathId);
                    if (result.ok) newSurge.push(id);
                    else changed = true;
                });
                char.surgeTalents = newSurge;
            }

            // 4) Truncate over-budget skills/attributes if path level dropped.
            const totalLevel = this.getTotalLevel();
            const maxRank = this.getMaxSkillRankAtCurrentLevel(totalLevel);
            Object.keys(char.skills).forEach(sId => {
                if (char.skills[sId] > maxRank) char.skills[sId] = maxRank;
            });
            if (char.surgeRanks) {
                Object.keys(char.surgeRanks).forEach(sId => {
                    if (char.surgeRanks[sId] > maxRank) char.surgeRanks[sId] = maxRank;
                });
            }
            const maxAttr = this.getMaxAttributeAtCurrentLevel(totalLevel);
            Object.keys(char.attributes).forEach(a => {
                if (char.attributes[a] > maxAttr) char.attributes[a] = maxAttr;
            });

            // 5) Clamp current resources to new maxes (recalculateAll will fully refresh).
            const maxHealth = this.computeMaxHealth(totalLevel, char.attributes.strength);
            const maxFocus = this.computeMaxFocus(char.attributes.willpower);
            if (typeof char.currentHealth === 'number' && char.currentHealth > maxHealth) char.currentHealth = maxHealth;
            if (typeof char.currentFocus === 'number' && char.currentFocus > maxFocus) char.currentFocus = maxFocus;
        },

        maybeShowRulesUpdateNotice: function() {
            try {
                const KEY = 'cosmereRulesNoticeShown_v3';
                if (localStorage.getItem(KEY)) return;
                setTimeout(async () => {
                    await this.dialog.alert(
                        '• HP, focus, and movement now match the Stormlight Handbook tables (max HP and movement may be lower).\n' +
                        '• Character creation rules (12 attribute pts, max 3/attribute, 4 skill ranks, max 2/skill at creation) are now enforced.\n' +
                        '• Talent prerequisites are enforced; unavailable talents appear locked.\n' +
                        '• Expertises are now budget-tracked (2 culture + Intellect + talent choices).\n' +
                        '• UI uses tabs instead of folds.\n\n' +
                        'If any character\'s current HP/focus exceeded the new maximum, it has been clamped.',
                        { title: 'Rules Update Applied', okText: 'Got It', variant: 'info' }
                    );
                    localStorage.setItem(KEY, '1');
                }, 100);
            } catch (e) {
                console.warn('Could not display rules update notice', e);
            }
        },

        // ===================================================================,

        recalculateAll: function() {
            const char = this.currentCharacter;
            const totalLevel = this.getTotalLevel();
            
            // Defenses
            const physicalDefense = 10 + char.attributes.strength + char.attributes.speed;
            const cognitiveDefense = 10 + char.attributes.intellect + char.attributes.willpower;
            const spiritualDefense = 10 + char.attributes.awareness + char.attributes.presence;
            
            char.physicalDefense = physicalDefense;
            char.cognitiveDefense = cognitiveDefense;
            char.spiritualDefense = spiritualDefense;
            
            document.getElementById('physicalDefense').textContent = physicalDefense;
            document.getElementById('cognitiveDefense').textContent = cognitiveDefense;
            document.getElementById('spiritualDefense').textContent = spiritualDefense;
            
            // Resources per Stormlight Handbook formulas
            const maxHealth = this.computeMaxHealth(totalLevel, char.attributes.strength);
            const maxFocus = this.computeMaxFocus(char.attributes.willpower);
            
            char.maxHealth = maxHealth;
            char.maxFocus = maxFocus;
            
            document.getElementById('maxHealth').textContent = maxHealth;
            document.getElementById('maxFocus').textContent = maxFocus;

            // Clamp current values to new maxes (they could have dropped after rules changes)
            if (typeof char.currentHealth === 'number' && char.currentHealth > maxHealth) {
                char.currentHealth = maxHealth;
                const ch = document.getElementById('currentHealth');
                if (ch) ch.value = maxHealth;
            }
            if (typeof char.currentFocus === 'number' && char.currentFocus > maxFocus) {
                char.currentFocus = maxFocus;
                const cf = document.getElementById('currentFocus');
                if (cf) cf.value = maxFocus;
            }
            
            // Investiture (only for Radiants)
            const hasRadiant = char.paths && char.paths.some(p => p.type === 'radiant' && p.level > 0);
            if (hasRadiant) {
                const maxInvestiture = this.computeMaxInvestiture(totalLevel);
                char.maxInvestiture = maxInvestiture;
                document.getElementById('maxInvestiture').textContent = maxInvestiture;
                if (typeof char.currentInvestiture === 'number' && char.currentInvestiture > maxInvestiture) {
                    char.currentInvestiture = maxInvestiture;
                    const ci = document.getElementById('currentInvestiture');
                    if (ci) ci.value = maxInvestiture;
                }
            } else {
                char.maxInvestiture = '—';
                document.getElementById('maxInvestiture').textContent = '—';
            }
            
            // Recovery Die
            let recoveryDie = '1d6';
            for (const [level, die] of Object.entries(this.rules.resources.recoveryDie.progression).reverse()) {
                if (totalLevel >= parseInt(level)) {
                    recoveryDie = die;
                    break;
                }
            }
            char.recoveryDie = recoveryDie;
            document.getElementById('recoveryDie').textContent = recoveryDie;
            
            // Movement (table lookup per handbook)
            const movement = this.computeMovementRate(char.attributes.speed);
            char.movement = movement + ' ft';
            document.getElementById('movement').textContent = movement + ' ft';
            
            // Senses
            const senses = this.computeSensesRange(char.attributes.awareness);
            document.getElementById('sensesRange').textContent = senses < 0 ? 'Unaffected' : senses + ' ft';
            
            // Lifting
            const lifting = this.rules.lifting.baseCapacity + (char.attributes.strength * 50);
            document.getElementById('liftingCapacity').textContent = lifting + ' lbs';
            
            // Update skill modifiers
            this.renderSkills('physical');
            this.renderSkills('cognitive');
            this.renderSkills('spiritual');
            
            // Combat stats
            this.calculateAttackBonuses();
            this.calculateInitiative();
            
            // Update point trackers and validation
            this.updatePointTrackers();
            this.validateCharacter();
            this.updateCombatPlayDisplay();
        },

        updatePointTrackers: function() {
            const char = this.currentCharacter;
            const totalLevel = this.getTotalLevel();
            
            // Calculate available attribute points (12 base + increases from leveling)
            const totalAttributePoints = this.computeAttributeBudget(totalLevel);
            
            // Calculate used attribute points
            const usedAttributePoints = Object.values(char.attributes).reduce((sum, val) => sum + val, 0);
            const remainingAttributePoints = totalAttributePoints - usedAttributePoints;
            
            // Store for use by validateCharacter()
            this.cachedPointData = {
                totalAttributePoints,
                usedAttributePoints,
                remainingAttributePoints,
                totalSkillRanks: 0,
                usedSkillRanks: 0,
                remainingSkillRanks: 0
            };
            
            // Update attribute tracker UI
            document.getElementById('attributePointsUsed').textContent = usedAttributePoints;
            document.getElementById('attributePointsTotal').textContent = totalAttributePoints;
            document.getElementById('attributePointsRemaining').textContent = remainingAttributePoints + ' remaining';
            
            const attrRemainingElem = document.getElementById('attributePointsRemaining');
            attrRemainingElem.classList.remove('over', 'complete');
            if (remainingAttributePoints < 0) {
                attrRemainingElem.classList.add('over');
            } else if (remainingAttributePoints === 0) {
                attrRemainingElem.classList.add('complete');
            }
            
            // Update attribute progress bar
            const attrProgress = Math.min((usedAttributePoints / totalAttributePoints) * 100, 100);
            const attrProgressBar = document.getElementById('attributeProgressBar');
            attrProgressBar.style.width = attrProgress + '%';
            attrProgressBar.classList.remove('over', 'complete');
            if (remainingAttributePoints < 0) {
                attrProgressBar.classList.add('over');
            } else if (remainingAttributePoints === 0) {
                attrProgressBar.classList.add('complete');
            }
            
            // Calculate available skill ranks: 4 starting + leveling increases + grants (e.g. starting path skill)
            const totalSkillRanks = this.computeSkillRankBudget(totalLevel);
            
            // Calculate used skill ranks (including surge ranks)
            const regularSkillRanks = Object.values(char.skills).reduce((sum, rank) => sum + rank, 0);
            const surgeRanks = char.surgeRanks ? Object.values(char.surgeRanks).reduce((sum, rank) => sum + rank, 0) : 0;
            const usedSkillRanks = regularSkillRanks + surgeRanks;
            const remainingSkillRanks = totalSkillRanks - usedSkillRanks;
            
            // Update cached values for use by validateCharacter()
            this.cachedPointData.totalSkillRanks = totalSkillRanks;
            this.cachedPointData.usedSkillRanks = usedSkillRanks;
            this.cachedPointData.remainingSkillRanks = remainingSkillRanks;
            
            // Update skill tracker UI
            document.getElementById('skillRanksUsed').textContent = `${usedSkillRanks} (${regularSkillRanks} skills + ${surgeRanks} surges)`;
            document.getElementById('skillRanksTotal').textContent = totalSkillRanks;
            document.getElementById('skillRanksRemaining').textContent = remainingSkillRanks + ' remaining';
            
            const skillRemainingElem = document.getElementById('skillRanksRemaining');
            skillRemainingElem.classList.remove('over', 'complete');
            if (remainingSkillRanks < 0) {
                skillRemainingElem.classList.add('over');
            } else if (remainingSkillRanks === 0 && totalSkillRanks > 0) {
                skillRemainingElem.classList.add('complete');
            }
            
            // Update skill progress bar
            const skillProgress = totalSkillRanks > 0 ? Math.min((usedSkillRanks / totalSkillRanks) * 100, 100) : 0;
            const skillProgressBar = document.getElementById('skillProgressBar');
            skillProgressBar.style.width = skillProgress + '%';
            skillProgressBar.classList.remove('over', 'complete');
            if (remainingSkillRanks < 0) {
                skillProgressBar.classList.add('over');
            } else if (remainingSkillRanks === 0 && totalSkillRanks > 0) {
                skillProgressBar.classList.add('complete');
            }
            
            // Calculate available talent points (from total character level)
            // Talent points are GLOBAL, not per-path
            // Each level grants 1 talent point
            let totalTalentPoints = 0;
            
            for (let i = 1; i <= totalLevel; i++) {
                const levelData = this.rules.advancement.levelProgression.find(l => l.level === i);
                if (levelData && levelData.talentPoints) {
                    totalTalentPoints += levelData.talentPoints;
                }
            }
            
            // Add ancestry bonus talents (per the handbook: at levels 1, 6, 11, 16, 21).
            // Humans choose from a heroic path; Singers may also choose from the Singer tree.
            // Change Form is auto-granted to Singers (not from this pool), but the handbook
            // still grants Singers 1 bonus talent at level 1 connected to Change Form.
            const ancestryBonusLevels = [1, 6, 11, 16, 21];
            let ancestryBonusTalents = 0;
            for (const bonusLevel of ancestryBonusLevels) {
                if (totalLevel >= bonusLevel) {
                    ancestryBonusTalents += 1;
                }
            }
            totalTalentPoints += ancestryBonusTalents;
            
            // Calculate used talent points (path talents + surge talents).
            // Auto-granted talents (e.g. heroic path key talents) don't cost a point.
            const autoGrantedTalentIds = new Set(
                (char.grants || [])
                    .filter(g => g.type === 'auto_talent' && g.payload && g.payload.talentId)
                    .map(g => g.payload.talentId)
            );
            const pathTalents = char.talents
                ? char.talents.filter(id => !autoGrantedTalentIds.has(id)).length
                : 0;
            const surgeTalents = char.surgeTalents ? char.surgeTalents.length : 0;
            const usedTalentPoints = pathTalents + surgeTalents;
            const remainingTalentPoints = totalTalentPoints - usedTalentPoints;
            
            // Store for use by validation
            this.cachedPointData.totalTalentPoints = totalTalentPoints;
            this.cachedPointData.usedTalentPoints = usedTalentPoints;
            this.cachedPointData.remainingTalentPoints = remainingTalentPoints;
            
            // Update talent points display (new tracker UI at top)
            document.getElementById('talentPointsUsed').textContent = usedTalentPoints;
            document.getElementById('talentPointsTotal').textContent = totalTalentPoints;
            document.getElementById('talentPointsRemaining').textContent = remainingTalentPoints + ' remaining';
            
            const talentRemainingElem = document.getElementById('talentPointsRemaining');
            talentRemainingElem.classList.remove('over', 'complete');
            if (remainingTalentPoints < 0) {
                talentRemainingElem.classList.add('over');
            } else if (remainingTalentPoints === 0 && totalTalentPoints > 0) {
                talentRemainingElem.classList.add('complete');
            }
            
            // Update talent progress bar
            const talentProgress = totalTalentPoints > 0 ? Math.min((usedTalentPoints / totalTalentPoints) * 100, 100) : 0;
            const talentProgressBar = document.getElementById('talentProgressBar');
            talentProgressBar.style.width = talentProgress + '%';
            talentProgressBar.classList.remove('over', 'complete');
            if (remainingTalentPoints < 0) {
                talentProgressBar.classList.add('over');
            } else if (remainingTalentPoints === 0 && totalTalentPoints > 0) {
                talentProgressBar.classList.add('complete');
            }
            
            // Update breakdown help text
            const baseTalentPoints = totalTalentPoints - ancestryBonusTalents;
            const breakdownText = ancestryBonusTalents > 0 
                ? `${baseTalentPoints} from levels + ${ancestryBonusTalents} from ancestry (${pathTalents} path + ${surgeTalents} surge selected)`
                : `${baseTalentPoints} from levels (${pathTalents} path + ${surgeTalents} surge selected)`;
            document.getElementById('talentPointsBreakdown').textContent = breakdownText;
            
            // Also update old display if it exists (for backwards compatibility)
            const talentPointsElem = document.getElementById('talentPoints');
            if (talentPointsElem) {
                if (totalTalentPoints === 0) {
                    talentPointsElem.textContent = `No talents available (Level up to gain talent points)`;
                    talentPointsElem.style.color = 'inherit';
                } else {
                    let breakdown = ancestryBonusTalents > 0 
                        ? `${usedTalentPoints}/${totalTalentPoints} used (${baseTalentPoints} level + ${ancestryBonusTalents} ancestry | ${pathTalents} path + ${surgeTalents} surge) - ${remainingTalentPoints} remaining`
                        : `${usedTalentPoints}/${totalTalentPoints} used (${pathTalents} path + ${surgeTalents} surge) - ${remainingTalentPoints} remaining`;
                    talentPointsElem.textContent = breakdown;
                    talentPointsElem.style.color = remainingTalentPoints < 0 ? 'var(--error-color)' : 
                                                   remainingTalentPoints === 0 ? 'var(--success-color)' : 
                                                   'inherit';
                }
            }
        },

        validateCharacter: function() {
            const char = this.currentCharacter;
            const issues = [];
            const warnings = [];
            
            // Validate character name
            if (!char.name || char.name.trim() === '' || char.name === 'New Character') {
                issues.push('Please enter a character name');
            }

            // Validate ancestry and culture
            if (!char.ancestry || char.ancestry.trim() === '') {
                issues.push('Please select an ancestry');
            }

            if (!char.culture || (typeof char.culture === 'string' && char.culture.trim() === '')) {
                issues.push('Please select a culture');
            }
            
            // Use cached point data from updatePointTrackers() - SINGLE SOURCE OF TRUTH
            if (!this.cachedPointData) {
                // Initialize if not yet set
                this.cachedPointData = {
                    totalAttributePoints: 0,
                    usedAttributePoints: 0,
                    remainingAttributePoints: 0,
                    totalSkillRanks: 0,
                    usedSkillRanks: 0,
                    remainingSkillRanks: 0
                };
            }
            
            const { totalAttributePoints, usedAttributePoints, remainingAttributePoints } = this.cachedPointData;
            
            // Validate attribute points
            if (remainingAttributePoints < 0) {
                issues.push(`You have used ${-remainingAttributePoints} too many attribute points`);
            } else if (remainingAttributePoints > 0) {
                warnings.push(`You have ${remainingAttributePoints} unspent attribute points`);
            }
            
            // Check for attributes over maximum (creation-aware)
            const attrCap = this.getMaxAttributeAtCurrentLevel(this.getTotalLevel());
            for (const [attr, value] of Object.entries(char.attributes)) {
                if (value > attrCap) {
                    const niceName = attr.charAt(0).toUpperCase() + attr.slice(1);
                    issues.push(`${niceName} cannot exceed ${attrCap}${this.getTotalLevel() <= 0 ? ' at character creation' : ''}`);
                }
            }
            
            // Validate skill ranks using cached data
            const { totalSkillRanks, usedSkillRanks, remainingSkillRanks } = this.cachedPointData;
            
            if (remainingSkillRanks < 0) {
                issues.push(`You have used ${-remainingSkillRanks} too many skill ranks`);
            } else if (remainingSkillRanks > 0 && totalSkillRanks > 0) {
                warnings.push(`You have ${remainingSkillRanks} unspent skill ranks`);
            }
            
            // Check for skills over maximum (uses tier-aware cap)
            const skillCap = this.getMaxSkillRankAtCurrentLevel(this.getTotalLevel());
            for (const [skillId, rank] of Object.entries(char.skills)) {
                if (rank > skillCap) {
                    const skill = this.rules.skills.list.find(s => s.id === skillId);
                    issues.push(`${skill.name} cannot exceed ${skillCap} ranks at your current tier`);
                }
            }
            
            // Validate talent points using cached data
            if (this.cachedPointData.totalTalentPoints !== undefined) {
                const { totalTalentPoints, usedTalentPoints, remainingTalentPoints } = this.cachedPointData;
                
                if (remainingTalentPoints < 0) {
                    issues.push(`You have used ${-remainingTalentPoints} too many talent points (Level up to gain more)`);
                } else if (remainingTalentPoints > 0 && totalTalentPoints > 0) {
                    warnings.push(`You have ${remainingTalentPoints} unspent talent points`);
                }
            }
            
            // Validate heroic path selection
            const hasHeroicPath = char.paths && char.paths.some(p => p.type === 'heroic' && (p.level || 0) > 0);
            if (!hasHeroicPath) {
                warnings.push('Consider selecting a Heroic Path');
            }
            
            // Validate purpose and obstacle (recommended but not required)
            if (!char.purpose || char.purpose.trim() === '') {
                warnings.push('Consider adding a Purpose for your character');
            }
            
            if (!char.obstacle || char.obstacle.trim() === '') {
                warnings.push('Consider adding an Obstacle for your character');
            }
            
            // Update validation summary
            this.renderValidationSummary(issues, warnings);
            
            // Update character complete badge
            const isComplete = issues.length === 0 && warnings.length <= 2; // Allow missing purpose/obstacle
            const badge = document.getElementById('characterCompleteBadge');
            if (isComplete) {
                badge.textContent = '✓ Character Complete';
                badge.className = 'character-complete-badge complete';
            } else {
                badge.textContent = '⚠ Incomplete';
                badge.className = 'character-complete-badge incomplete';
            }
        },

        renderValidationSummary: function(issues, warnings) {
            const container = document.getElementById('validationSummary');
            
            if (issues.length === 0 && warnings.length === 0) {
                container.innerHTML = `
                    <div class="validation-warning success">
                        <span class="validation-icon">✓</span>
                        <div class="validation-message">
                            <strong>Character is ready to play!</strong> All required fields are complete.
                        </div>
                    </div>
                `;
                return;
            }
            
            let html = '';
            
            // Show errors
            if (issues.length > 0) {
                html += `
                    <div class="validation-warning error">
                        <span class="validation-icon">⚠</span>
                        <div class="validation-message">
                            <strong>Issues to fix:</strong>
                            <ul style="margin: 5px 0 0 20px;">
                                ${issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
            
            // Show warnings
            if (warnings.length > 0) {
                html += `
                    <div class="validation-warning">
                        <span class="validation-icon">ℹ</span>
                        <div class="validation-message">
                            <strong>Recommendations:</strong>
                            <ul style="margin: 5px 0 0 20px;">
                                ${warnings.map(warning => `<li>${warning}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        }
    });
})();
