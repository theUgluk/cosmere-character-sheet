/**
 * Heroic Paths, Radiant Orders, Ancestry Paths, Surges & Talent Trees
 * Path management, level tracking, surge ranks/talents, talent tree tier layout,
 * talent index building, prerequisite evaluation, and talent selection/cascade checks.
 */
(function () {
    Object.assign(window.app, {
        renderPathsAndTalents: function() {
            // Populate dropdown options
            const heroicOptions = document.getElementById('heroicPathOptions');
            const radiantOptions = document.getElementById('radiantOrderOptions');
            
            if (heroicOptions) {
                heroicOptions.innerHTML = this.rules.heroicPaths.map(p => 
                    `<option value="heroic:${p.id}">${p.name}</option>`
                ).join('');
            }
            
            if (radiantOptions) {
                radiantOptions.innerHTML = this.rules.radiantOrders.map(o => 
                    `<option value="radiant:${o.id}">${o.name}</option>`
                ).join('');
            }

            const addPathDropdown = document.getElementById('addPathDropdown');
            if (addPathDropdown) addPathDropdown.value = '';

            // Initialize paths array if needed
            if (!this.currentCharacter.paths) {
                this.currentCharacter.paths = [];
                // Migrate old heroicPath/radiantOrder if they exist
                if (this.currentCharacter.heroicPath) {
                    this.currentCharacter.paths.push({type: 'heroic', id: this.currentCharacter.heroicPath});
                }
                if (this.currentCharacter.radiantOrder) {
                    this.currentCharacter.paths.push({type: 'radiant', id: this.currentCharacter.radiantOrder});
                }
            }

            // Keep ancestry paths in sync with the character's current ancestry.
            this.syncAncestryPath();

            // Render each selected path
            const container = document.getElementById('pathsAndTalentsContainer');
            if (!container) return;
            
            if (this.currentCharacter.paths.length === 0) {
                container.innerHTML = '<div class="help-text">No paths selected. Use the dropdown below to add a path.</div>';
                return;
            }

            container.innerHTML = this.currentCharacter.paths.map((pathRef, index) => {
                const pathData = this.getPathData(pathRef);
                if (!pathData) return '';

                return this.renderPathWithTalents(pathRef, pathData, index);
            }).join('');
        },

        getPathData: function(pathRef) {
            if (pathRef.type === 'heroic') {
                return this.rules.heroicPaths.find(p => p.id === pathRef.id);
            } else if (pathRef.type === 'radiant') {
                return this.rules.radiantOrders.find(o => o.id === pathRef.id);
            } else if (pathRef.type === 'ancestry') {
                return (this.rules.ancestryPaths || []).find(p => p.id === pathRef.id);
            }
            return null;
        },

        // Look up the ancestry path that belongs to a given ancestry name (e.g. "Singer").
        // Returns the rules entry, or null if there is no ancestry-specific tree.,

        getAncestryPathForAncestry: function(ancestryName) {
            if (!ancestryName) return null;
            return (this.rules.ancestryPaths || []).find(p => p.ancestry === ancestryName) || null;
        },

        // Ensure character.paths reflects the current ancestry choice. The ancestry path
        // entry is auto-managed: it appears when the character's ancestry has a matching
        // ancestryPath in the rules, and is removed (with cascading talent cleanup) when
        // the ancestry changes away. The synthetic entry uses level=1 so the existing UI
        // shows talents; ancestry paths don't track tier-by-tier level progression.
        // Also auto-grants the ancestry path's keyTalent (e.g. Change Form for Singers).,

        syncAncestryPath: function() {
            const char = this.currentCharacter;
            if (!char) return;
            if (!Array.isArray(char.paths)) char.paths = [];
            if (!Array.isArray(char.grants)) char.grants = [];
            if (!Array.isArray(char.talents)) char.talents = [];

            const desired = this.getAncestryPathForAncestry(char.ancestry);
            const existingIdx = char.paths.findIndex(p => p.type === 'ancestry');
            const existing = existingIdx >= 0 ? char.paths[existingIdx] : null;

            if (desired) {
                if (!existing || existing.id !== desired.id) {
                    // Replace any stale entry, then add the new one.
                    const removedPathIds = [];
                    if (existing) {
                        removedPathIds.push(existing.id);
                        char.paths.splice(existingIdx, 1);
                    }
                    char.paths.push({ type: 'ancestry', id: desired.id, level: 1 });

                    if (desired.keyTalent && desired.keyTalent.id) {
                        const keyTalentId = `${desired.id}_${desired.keyTalent.id}`;
                        if (!char.talents.includes(keyTalentId)) {
                            char.talents.push(keyTalentId);
                            char.grants.push({
                                source: desired.id,
                                type: 'auto_talent',
                                amount: 1,
                                payload: { talentId: keyTalentId }
                            });
                        }
                    }

                    if (removedPathIds.length > 0) {
                        this.cascadeCleanup({ removedPathIds });
                    }
                }
            } else if (existing) {
                // Ancestry no longer has a tree: remove the synthetic path entirely.
                const removedPathIds = [existing.id];
                char.paths.splice(existingIdx, 1);
                this.cascadeCleanup({ removedPathIds });
            }
        },

        renderSurges: function() {
            const surgesSection = document.getElementById('surgesSection');
            const surgesContainer = document.getElementById('surgesContainer');
            
            // Check if character has a Radiant Order
            const radiantPath = this.currentCharacter.paths.find(p => p.type === 'radiant');
            if (!radiantPath) {
                surgesSection.style.display = 'none';
                surgesContainer.innerHTML = '';
                return;
            }
            
            surgesSection.style.display = 'block';
            
            const radiantOrder = this.rules.radiantOrders.find(o => o.id === radiantPath.id);
            if (!radiantOrder || !radiantOrder.surges) {
                surgesContainer.innerHTML = '<div class="help-text">No surges found for this order.</div>';
                return;
            }
            
            // Initialize surgeRanks if needed
            if (!this.currentCharacter.surgeRanks) {
                this.currentCharacter.surgeRanks = {};
            }
            if (!this.currentCharacter.surgeTalents) {
                this.currentCharacter.surgeTalents = [];
            }
            
            let html = '';
            radiantOrder.surges.forEach(surgeId => {
                const surgeData = this.rules.surges[surgeId];
                if (!surgeData) return;
                
                const currentRank = this.currentCharacter.surgeRanks[surgeId] ?? 0; // 0 is valid for unleveled
                const attribute = this.rules.attributes.list.find(a => a.id === surgeData.attribute);
                const attributeValue = this.currentCharacter.attributes[surgeData.attribute];
                if (attributeValue === undefined) throw new Error(`Attribute ${surgeData.attribute} is undefined`);
                const surgeModifier = attributeValue + currentRank;
                
                html += `
                    <div class="surge-card" style="border: 2px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <div style="flex: 1;">
                                <h3 style="margin: 0 0 8px 0; color: var(--primary-color);">
                                    ${surgeData.name} (${attribute ? attribute.name : surgeData.attribute})
                                    <button class="roll-inline" onclick="diceRoller.rollInline('1d20+${surgeModifier}', '${surgeData.name} Test', true)" title="${surgeData.name} Test (1d20 + ${surgeModifier})">
                                        🎲
                                    </button>
                                </h3>
                                <p style="margin: 5px 0; color: var(--text-secondary); font-size: 0.9em;">${surgeData.description}</p>
                                <div style="font-size: 0.85em; margin-top: 8px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
                                    <strong>Base Ability:</strong> ${surgeData.baseAbility}
                                </div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: linear-gradient(135deg, #6200ea, #b388ff); color: white; border-radius: 20px; font-weight: bold; font-size: 0.9em; margin-left: 10px;">
                                <button onclick="app.changeSurgeRank('${surgeId}', -1)" 
                                        style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold;"
                                        ${currentRank <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>−</button>
                                <span style="min-width: 60px; text-align: center;">Rank ${currentRank}</span>
                                <button onclick="app.changeSurgeRank('${surgeId}', 1)" 
                                        style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold;"
                                        ${currentRank >= 5 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>+</button>
                            </div>
                        </div>
                `;
                
                // Show talents if surge has rank > 0
                if (currentRank > 0 && surgeData.talents && surgeData.talents.length > 0) {
                    html += `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                            <h4 style="margin: 0 0 10px 0; font-size: 0.95em;">Surge Talents:</h4>
                            ${this.renderTalentTree(surgeData.talents, surgeId, 'surge')}
                        </div>
                    `;
                }
                
                html += `</div>`;
            });
            
            surgesContainer.innerHTML = html;
        },

        changeSurgeRank: function(surgeId, delta) {
            if (!this.currentCharacter.surgeRanks) {
                this.currentCharacter.surgeRanks = {};
            }

            const currentRank = this.currentCharacter.surgeRanks[surgeId] ?? 0;
            const totalLevel = this.getTotalLevel();
            const maxRank = this.getMaxSkillRankAtCurrentLevel(totalLevel);
            let newRank = currentRank + delta;
            if (newRank < 0) newRank = 0;
            if (newRank > maxRank) {
                this.dialog.alert(`Maximum rank in any skill (or surge) at your current tier is ${maxRank}.`, { title: 'Surge Rank Limit', variant: 'warning' });
                return;
            }

            if (delta > 0) {
                const skillSum = Object.values(this.currentCharacter.skills).reduce((s, v) => s + v, 0);
                const surgeSum = Object.values(this.currentCharacter.surgeRanks).reduce((s, v) => s + v, 0);
                const budget = this.computeSkillRankBudget(totalLevel);
                if (skillSum + (surgeSum - currentRank) + newRank > budget) {
                    this.dialog.alert(`Not enough skill ranks. Budget: ${budget}.`, { title: 'Skill Rank Budget', variant: 'warning' });
                    return;
                }
            }

            this.currentCharacter.surgeRanks[surgeId] = newRank;
            this.updatePointTrackers();
            this.validateCharacter();
            this.renderSurges();
            this.updateCharacter();
        },

        toggleSurgeTalent: async function(talentId) {
            if (!this.currentCharacter.surgeTalents) {
                this.currentCharacter.surgeTalents = [];
            }

            const idxLookup = this.buildTalentIndex();
            const entry = idxLookup.byId.get(talentId);
            if (!entry) {
                throw new Error(`toggleSurgeTalent: unknown talentId '${talentId}'`);
            }

            const has = this.currentCharacter.surgeTalents.includes(talentId);
            if (has) {
                const dependents = this.findDependentTalents(entry);
                if (dependents.length > 0) {
                    const names = dependents.map(d => d.name).join(', ');
                    const confirmed = await this.dialog.confirm(
                        `Removing this surge talent will also remove dependents: ${names}. Continue?`,
                        { title: 'Remove Surge Talent', okText: 'Remove', danger: true }
                    );
                    if (!confirmed) {
                        return;
                    }
                    dependents.forEach(d => {
                        const i = this.currentCharacter.surgeTalents.indexOf(d.id);
                        if (i >= 0) this.currentCharacter.surgeTalents.splice(i, 1);
                        const j = (this.currentCharacter.talents || []).indexOf(d.id);
                        if (j >= 0) this.currentCharacter.talents.splice(j, 1);
                    });
                }
                const i = this.currentCharacter.surgeTalents.indexOf(talentId);
                this.currentCharacter.surgeTalents.splice(i, 1);
            } else {
                const result = this.checkTalentPrerequisite(entry.talent, entry.pathId);
                if (!result.ok) {
                    this.dialog.alert(`Cannot select '${entry.name}': ${result.reason}`, { title: 'Prerequisite Not Met', variant: 'warning' });
                    return;
                }
                if (this.cachedPointData && typeof this.cachedPointData.remainingTalentPoints === 'number') {
                    if (this.cachedPointData.remainingTalentPoints <= 0) {
                        this.dialog.alert(`No talent points remaining (${this.cachedPointData.usedTalentPoints}/${this.cachedPointData.totalTalentPoints} used). Level up to gain more.`, { title: 'No Talent Points Remaining', variant: 'warning' });
                        return;
                    }
                }
                this.currentCharacter.surgeTalents.push(talentId);
            }

            this.updatePointTrackers();
            this.validateCharacter();
            this.renderSurges();
            this.updateCharacter();
        },

        renderPathWithTalents: function(pathRef, pathData, index) {
            const expandedId = `path-${index}`;
            const isExpanded = this.expandedPaths && this.expandedPaths[expandedId];
            const pathLevel = pathRef.level || 0;
            const isAncestry = pathRef.type === 'ancestry';
            const icon = pathRef.type === 'heroic' ? '⚔️'
                : pathRef.type === 'radiant' ? '✨'
                : '🧬';

            let html = `
                <div class="path-section" style="border: 2px solid var(--border-color); border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <h3 style="margin: 0; color: var(--primary-color);">
                                    ${icon} ${pathData.name}
                                </h3>
            `;

            if (isAncestry) {
                html += `
                                <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: linear-gradient(135deg, #6a4c93, #b388ff); color: white; border-radius: 20px; font-weight: bold; font-size: 0.85em;">
                                    Ancestry: ${pathData.ancestry}
                                </div>
                `;
            } else {
                html += `
                                <div style="display: flex; align-items: center; gap: 5px; padding: 4px 10px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border-radius: 20px; font-weight: bold; font-size: 0.9em;">
                                    <button onclick="app.changePathLevel(${index}, -1)" 
                                            style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold;"
                                            ${pathLevel <= 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>−</button>
                                    <span style="min-width: 60px; text-align: center;">Level ${pathLevel}</span>
                                    <button onclick="app.changePathLevel(${index}, 1)" 
                                            style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-weight: bold;"
                                            ${pathLevel >= 10 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>+</button>
                                </div>
                `;
            }

            html += `
                            </div>
                            <p style="margin: 5px 0; color: var(--text-secondary); font-size: 0.9em;">${pathData.description}</p>
            `;

            if (pathRef.type === 'heroic' && pathData.keyTalent) {
                html += `<div style="font-size: 0.85em; margin-top: 5px;"><strong>Key Talent:</strong> ${pathData.keyTalent.name} - ${pathData.keyTalent.description}</div>`;
            }

            if (pathRef.type === 'radiant') {
                html += `<div style="font-size: 0.85em; margin-top: 5px;"><strong>Surges:</strong> ${pathData.surges.join(', ')}</div>`;
                if (pathData.oaths && pathData.oaths.length > 0) {
                    html += `<div style="font-size: 0.85em; margin-top: 5px;"><strong>Ideals:</strong></div>`;
                    html += `<ul style="margin: 5px 0; padding-left: 20px; font-size: 0.85em;">`;
                    pathData.oaths.forEach(oath => {
                        html += `<li style="font-style: italic; margin: 2px 0;">"${oath}"</li>`;
                    });
                    html += `</ul>`;
                }
            }

            // Ancestry paths are auto-managed (added/removed when ancestry changes), so
            // they don't get a "remove" button. Their talents are always available, so we
            // also unconditionally show the toggle.
            const showTalentsToggle = isAncestry || pathLevel > 0;
            html += `
                        </div>
                        <div style="display: flex; gap: 10px; align-items: start;">
                            ${showTalentsToggle ? `<button onclick="app.togglePathTalents('${expandedId}')" style="padding: 5px 15px;">
                                ${isExpanded ? '▼ Hide' : '▶ Show'} Talents
                            </button>` : ''}
                            ${isAncestry ? '' : `<button onclick="app.removePath(${index})" class="danger" style="padding: 5px 10px;">×</button>`}
                        </div>
                    </div>
            `;

            if (isExpanded && pathData.specialties && (isAncestry || pathLevel > 0)) {
                html += this.renderPathTalentsSection(pathData, pathRef.id, isAncestry ? 1 : pathLevel);
            }

            html += `</div>`;
            return html;
        },

        // Compute the depth tier for each talent in a list, based on `requiresTalent` edges.
        // Talents with no edges or unresolved edges are tier 0. Each talent's tier is one
        // greater than the maximum tier of any of its talent prereqs in the same list.
        // Returns a Map keyed by talent.id -> tier number.,

        computeTalentTiers: function(talents) {
            const byLocalId = new Map();
            talents.forEach(t => byLocalId.set(t.id, t));
            const tiers = new Map();

            const tierOf = (talent, visiting) => {
                if (tiers.has(talent.id)) return tiers.get(talent.id);
                if (visiting.has(talent.id)) {
                    // Cycle guard. Shouldn't happen with valid data; treat as tier 0.
                    return 0;
                }
                visiting.add(talent.id);

                const edges = Array.isArray(talent.requiresTalent) ? talent.requiresTalent : [];
                let maxParent = -1;
                edges.forEach(entry => {
                    const ids = Array.isArray(entry) ? entry : [entry];
                    ids.forEach(localId => {
                        const parent = byLocalId.get(localId);
                        if (parent) {
                            const parentTier = tierOf(parent, visiting);
                            if (parentTier > maxParent) maxParent = parentTier;
                        }
                    });
                });

                visiting.delete(talent.id);
                const tier = maxParent < 0 ? 0 : maxParent + 1;
                tiers.set(talent.id, tier);
                return tier;
            };

            talents.forEach(t => tierOf(t, new Set()));
            return tiers;
        },

        // Format a talent's `requiresTalent` edges as a readable "Requires" badge,
        // resolving local ids back to display names from the same talent list.,

        formatRequiresBadge: function(talent, talents) {
            if (!Array.isArray(talent.requiresTalent) || talent.requiresTalent.length === 0) {
                return '';
            }
            const byLocalId = new Map();
            talents.forEach(t => byLocalId.set(t.id, t.name));
            const parts = talent.requiresTalent.map(entry => {
                const ids = Array.isArray(entry) ? entry : [entry];
                const names = ids.map(id => byLocalId.get(id) || id);
                return ids.length > 1 ? names.join(' or ') : names[0];
            });
            return parts.join(' + ');
        },

        // Render a single talent card. `kind` is 'heroic' or 'surge' and controls the
        // selection/toggle wiring. `siblings` is the list of talents in the same scope
        // (specialty / surge), used to resolve `requiresTalent` ids back into display names.
        // The card displays activation, name, status, the prerequisite tree edge badge,
        // and the description.,

        renderTalentCard: function(talent, scopeId, kind, siblings) {
            const fullId = kind === 'surge' ? `surge_${scopeId}_${talent.id}` : `${scopeId}_${talent.id}`;
            const selectedList = kind === 'surge' ? (this.currentCharacter.surgeTalents || []) : (this.currentCharacter.talents || []);
            const isSelected = selectedList.includes(fullId);
            const prereqResult = isSelected ? { ok: true, reason: '' } : this.checkTalentPrerequisite(talent, scopeId);
            const isLocked = !isSelected && !prereqResult.ok;

            const activationIcons = {
                '1_action': '▶',
                '2_actions': '▶▶',
                '3_actions': '▶▶▶',
                'free_action': '◆',
                'reaction': '↻',
                'special': '★',
                'always': '∞'
            };
            const activationIcon = activationIcons[talent.activation] || '★';

            const borderColor = isSelected ? 'var(--success-color)' : (isLocked ? '#999' : 'var(--border-color)');
            const bgColor = isSelected ? '#e8f5e9' : (isLocked ? '#f0f0f0' : 'white');
            const opacity = isLocked ? '0.6' : '1';
            const cursor = isLocked ? 'not-allowed' : 'pointer';
            const lockedTitle = isLocked ? ` title="${prereqResult.reason.replace(/"/g, '&quot;')}"` : '';
            const toggleFn = kind === 'surge' ? 'toggleSurgeTalent' : 'toggleTalent';
            const onclick = isLocked ? '' : `onclick="app.${toggleFn}('${fullId}')"`;

            // Build the prereq badge. Prefer the textual `prerequisite` (it includes
            // skill/attribute requirements), and fall back to the structured `requiresTalent`
            // edges only when the textual prereq is missing or "none".
            const hasTextPrereq = talent.prerequisite && talent.prerequisite.trim() && talent.prerequisite.trim().toLowerCase() !== 'none';
            let prereqLabel;
            if (hasTextPrereq) {
                prereqLabel = `Prereq: ${talent.prerequisite}`;
            } else if (Array.isArray(talent.requiresTalent) && talent.requiresTalent.length > 0 && siblings) {
                prereqLabel = `Prereq: ${this.formatRequiresBadge(talent, siblings)}`;
            } else {
                prereqLabel = '<span style="opacity: 0.6;">(starter)</span>';
            }

            return `
                <div class="talent-tree-card"${lockedTitle}
                     style="border: 2px solid ${borderColor};
                            background: ${bgColor};
                            padding: 10px;
                            border-radius: 6px;
                            font-size: 0.85em;
                            cursor: ${cursor};
                            opacity: ${opacity};
                            width: 240px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.08);"
                     ${onclick}>
                    <div style="font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                        <span>${activationIcon} ${talent.name}</span>
                        ${isSelected ? '<span style="color: var(--success-color); margin-left: auto;">✓</span>' : ''}
                        ${isLocked ? '<span style="color: #999; margin-left: auto;">🔒</span>' : ''}
                    </div>
                    <div style="font-size: 0.78em; color: #666; margin-bottom: 4px; font-style: italic;">
                        ${prereqLabel}
                    </div>
                    ${isLocked ? `<div style="font-size: 0.78em; color: var(--danger-color); margin-bottom: 4px;">${prereqResult.reason}</div>` : ''}
                    <div style="line-height: 1.3; font-size: 0.85em;">
                        ${talent.description}
                    </div>
                </div>
            `;
        },

        // Render a list of talents as a tree, grouped into rows by depth tier.
        // Each row shows the talents at that tier side-by-side. Above each row
        // (except the first), a small connector arrow visually separates tiers.
        // `scopeId` is the path/order/surge id used to construct full talent ids.
        // `kind` is 'heroic' or 'surge'.,

        renderTalentTree: function(talents, scopeId, kind) {
            if (!talents || talents.length === 0) return '';
            const tiers = this.computeTalentTiers(talents);
            const maxTier = Math.max(0, ...Array.from(tiers.values()));
            const rows = [];
            for (let i = 0; i <= maxTier; i++) rows.push([]);
            talents.forEach(t => {
                rows[tiers.get(t.id)].push(t);
            });

            let html = '<div class="talent-tree" style="display: flex; flex-direction: column; gap: 18px; align-items: stretch;">';
            rows.forEach((tierTalents, idx) => {
                if (tierTalents.length === 0) return;
                if (idx > 0) {
                    html += `<div class="talent-tree-connector" style="text-align: center; color: #b0b0b0; font-size: 1.1em; line-height: 0.5;">▼</div>`;
                }
                html += `<div class="talent-tree-tier" style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">`;
                tierTalents.forEach(talent => {
                    html += this.renderTalentCard(talent, scopeId, kind, talents);
                });
                html += `</div>`;
            });
            html += '</div>';
            return html;
        },

        renderPathTalentsSection: function(pathData, pathId, pathLevel) {
            // Talent points are GLOBAL (from total character level), tracked at the top of the sheet.

            let html = `
                <div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 6px;">
            `;

            // Heroic paths have a separate keyTalent that's auto-granted at level 1 and
            // gates every other talent in the path. Show it as a prominent banner above
            // the specialty trees. Radiant orders embed their key talent (First Ideal)
            // inside the spren bond specialty list, so we skip the banner there.
            if (pathData.keyTalent && pathData.keyTalent.id) {
                const keyTalent = pathData.keyTalent;
                const keyFullId = `${pathId}_${keyTalent.id}`;
                const isSelected = (this.currentCharacter.talents || []).includes(keyFullId);
                html += `
                    <div style="margin-bottom: 18px; padding: 10px; background: white; border: 2px solid var(--primary-color); border-radius: 6px;">
                        <div style="font-weight: bold; color: var(--primary-color); margin-bottom: 4px;">
                            ★ Key Talent: ${keyTalent.name}
                            ${isSelected ? '<span style="color: var(--success-color);"> ✓ auto-granted</span>' : ''}
                        </div>
                        <div style="font-size: 0.85em; line-height: 1.3;">
                            ${keyTalent.description}
                        </div>
                    </div>
                `;
            }

            pathData.specialties.forEach(specialty => {
                html += `
                    <div style="margin-bottom: 25px;">
                        <h4 style="margin: 10px 0 4px 0; color: var(--secondary-color);">${specialty.name}</h4>
                        <p style="margin: 0 0 12px 0; font-size: 0.85em; color: var(--text-secondary);">${specialty.description}</p>
                        ${this.renderTalentTree(specialty.talents, pathId, 'heroic')}
                    </div>
                `;
            });

            html += `</div>`;
            return html;
        },

        togglePathTalents: function(pathId) {
            if (!this.expandedPaths) this.expandedPaths = {};
            this.expandedPaths[pathId] = !this.expandedPaths[pathId];
            this.renderPathsAndTalents();
        },

        addPath: function(value) {
            if (!value) return;

            const [type, id] = value.split(':');
            const pathType = type === 'heroic' ? 'heroic' : 'radiant';

            const exists = this.currentCharacter.paths.some(p => p.type === pathType && p.id === id);
            if (exists) {
                this.dialog.alert('This path is already added!', { title: 'Duplicate Path', variant: 'warning' });
                return;
            }

            if (pathType === 'radiant' && this.getTotalLevel() < 1) {
                this.dialog.alert('You must have at least 1 level before adding a Radiant Order.', { title: 'Level Requirement', variant: 'warning' });
                return;
            }

            if (pathType === 'radiant') {
                const hasRadiant = this.currentCharacter.paths.some(p => p.type === 'radiant');
                if (hasRadiant) {
                    this.dialog.alert('You can only have one Radiant Order! Remove your current order first.', { title: 'Radiant Order Limit', variant: 'warning' });
                    return;
                }
            }

            const pathRef = { type: pathType, id: id, level: 0 };
            this.currentCharacter.paths.push(pathRef);

            if (!Array.isArray(this.currentCharacter.grants)) this.currentCharacter.grants = [];
            if (!Array.isArray(this.currentCharacter.talents)) this.currentCharacter.talents = [];

            // Grant starting skill rank if this is the first heroic path at character creation.
            // Recorded in char.grants so removePath can refund it.
            if (pathType === 'heroic' && this.getTotalLevel() === 0) {
                const pathData = this.rules.heroicPaths.find(p => p.id === id);
                if (pathData && pathData.startingSkill) {
                    const skillId = pathData.startingSkill;
                    if (!this.currentCharacter.skills[skillId]) {
                        this.currentCharacter.skills[skillId] = 1;
                        this.currentCharacter.grants.push({
                            source: id,
                            type: 'skill_rank',
                            amount: 1,
                            payload: { skillId }
                        });
                    }
                }
            }

            // Auto-grant the heroic key talent. Per the handbook, taking a heroic path
            // grants its key talent (e.g. Agent => Opportunist) for free; it never
            // appears as a selectable card and does not consume a talent point.
            if (pathType === 'heroic') {
                const pathData = this.rules.heroicPaths.find(p => p.id === id);
                if (pathData && pathData.keyTalent && pathData.keyTalent.id) {
                    const keyTalentId = `${id}_${pathData.keyTalent.id}`;
                    if (!this.currentCharacter.talents.includes(keyTalentId)) {
                        this.currentCharacter.talents.push(keyTalentId);
                        this.currentCharacter.grants.push({
                            source: id,
                            type: 'auto_talent',
                            amount: 1,
                            payload: { talentId: keyTalentId }
                        });
                    }
                }
            }

            this.renderCharacterSheet();
            this.updateCharacter();
        },

        changePathLevel: function(pathIndex, delta) {
            const path = this.currentCharacter.paths[pathIndex];
            if (!path) return;
            if (path.type === 'ancestry') return; // ancestry paths don't track tier levels

            if (path.level === undefined) throw new Error(`Path ${path.id} has undefined level`);
            const newLevel = path.level + delta;
            if (newLevel < 0 || newLevel > 10) return;
            
            // Calculate old max values before level change
            const oldTotalLevel = this.getTotalLevel();
            const oldHasRadiant = this.currentCharacter.paths.some(p => p.type === 'radiant' && p.level > 0);
            const oldMaxHealth = this.computeMaxHealth(oldTotalLevel, this.currentCharacter.attributes.strength);
            const oldMaxFocus = this.computeMaxFocus(this.currentCharacter.attributes.willpower);
            const oldMaxInvestiture = oldHasRadiant ? this.computeMaxInvestiture(oldTotalLevel) : 0;
            
            // Apply level change
            path.level = newLevel;
            
            // Calculate new max values after level change
            const newTotalLevel = this.getTotalLevel();
            const newHasRadiant = this.currentCharacter.paths.some(p => p.type === 'radiant' && p.level > 0);
            const newMaxHealth = this.computeMaxHealth(newTotalLevel, this.currentCharacter.attributes.strength);
            const newMaxFocus = this.computeMaxFocus(this.currentCharacter.attributes.willpower);
            const newMaxInvestiture = newHasRadiant ? this.computeMaxInvestiture(newTotalLevel) : 0;
            
            // Adjust current values by the difference (leveling up increases current, leveling down decreases current)
            const char = this.currentCharacter;
            if (char.currentHealth === undefined) throw new Error('Current health is undefined');
            if (char.currentFocus === undefined) throw new Error('Current focus is undefined');
            if (char.currentInvestiture === undefined) throw new Error('Current investiture is undefined');
            
            char.currentHealth = Math.max(0, char.currentHealth + (newMaxHealth - oldMaxHealth));
            char.currentFocus = Math.max(0, char.currentFocus + (newMaxFocus - oldMaxFocus));
            char.currentInvestiture = Math.max(0, char.currentInvestiture + (newMaxInvestiture - oldMaxInvestiture));
            
            // Full re-render to ensure all derived values update
            this.renderCharacterSheet();
            this.updateCharacter();
        },

        getTotalLevel: function() {
            if (!this.currentCharacter.paths) return 0;
            // Ancestry paths don't carry character levels; they're a parallel talent tree.
            const total = this.currentCharacter.paths.reduce((sum, path) => {
                if (path.type === 'ancestry') return sum;
                if (path.level === undefined) throw new Error(`Path ${path.id} has undefined level`);
                return sum + path.level;
            }, 0);
            return total;
        },

        removePath: async function(index) {
            const pathRef = this.currentCharacter.paths[index];
            if (!pathRef) return;
            if (pathRef.type === 'ancestry') {
                this.dialog.alert('Ancestry paths are managed automatically. Change your ancestry to remove this tree.', { title: 'Ancestry Path', variant: 'info' });
                return;
            }

            const pathData = this.getPathData(pathRef);
            const pathName = pathData ? pathData.name : pathRef.id;
            const removedPathIds = [pathRef.id];

            // Preview impact (talents/expertises) so the player understands the cleanup scope.
            const ownedFromPath = (this.currentCharacter.talents || [])
                .filter(id => id.startsWith(pathRef.id + '_'));
            const ownedSurges = pathRef.type === 'radiant' && pathData && pathData.surges
                ? (this.currentCharacter.surgeTalents || []).filter(id =>
                    pathData.surges.some(s => id.startsWith(`surge_${s}_`)))
                : [];

            let msg = `Remove ${pathName}?`;
            if (ownedFromPath.length > 0) msg += `\n\n${ownedFromPath.length} talent(s) will be removed.`;
            if (ownedSurges.length > 0) msg += `\n${ownedSurges.length} surge talent(s) will be removed.`;
            msg += '\nAuto-granted expertises and the starting-skill rank from this path will be refunded.';

            const confirmed = await this.dialog.confirm(msg, { title: `Remove ${pathName}`, okText: 'Remove Path', danger: true });
            if (!confirmed) return;

            this.currentCharacter.paths.splice(index, 1);
            this.cascadeCleanup({ removedPathIds });

            this.renderCharacterSheet();
            this.updateCharacter();
        },

        buildTalentIndex: function() {
            if (this._talentIndex) return this._talentIndex;
            const byName = new Map();
            const byId = new Map();
            // Snapshot of the expertise catalog by lowercased id and name. Used so
            // talent prereqs of the form "<X> expertise" can resolve cleanly against
            // both the canonical id and the display name.
            const byExpertise = new Map();
            (this.rules.expertises || []).forEach(e => {
                byExpertise.set(e.id.toLowerCase(), e);
                byExpertise.set(e.name.toLowerCase(), e);
            });
            const addEntry = (entry) => {
                byId.set(entry.id, entry);
                if (entry.name) {
                    const lower = entry.name.toLowerCase();
                    if (!byName.has(lower)) byName.set(lower, []);
                    byName.get(lower).push(entry);
                    // Also index a parenthetical-stripped variant so prereqs like
                    // "Change Form key talent" can resolve to "Change Form (Singer Key)".
                    const stripped = lower.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
                    if (stripped && stripped !== lower) {
                        if (!byName.has(stripped)) byName.set(stripped, []);
                        byName.get(stripped).push(entry);
                    }
                }
            };
            (this.rules.heroicPaths || []).forEach(path => {
                if (path.keyTalent) {
                    addEntry({
                        id: `${path.id}_${path.keyTalent.id}`,
                        talentId: path.keyTalent.id,
                        name: path.keyTalent.name,
                        talent: path.keyTalent,
                        pathId: path.id,
                        pathType: 'heroic',
                        isKey: true,
                        location: 'heroic'
                    });
                }
                (path.specialties || []).forEach(spec => {
                    (spec.talents || []).forEach(t => {
                        addEntry({
                            id: `${path.id}_${t.id}`,
                            talentId: t.id,
                            name: t.name,
                            talent: t,
                            pathId: path.id,
                            pathType: 'heroic',
                            isKey: false,
                            location: 'heroic'
                        });
                    });
                });
            });
            (this.rules.radiantOrders || []).forEach(order => {
                (order.specialties || []).forEach(spec => {
                    (spec.talents || []).forEach(t => {
                        addEntry({
                            id: `${order.id}_${t.id}`,
                            talentId: t.id,
                            name: t.name,
                            talent: t,
                            pathId: order.id,
                            pathType: 'radiant',
                            isKey: t.id === 'first_ideal',
                            location: 'radiant'
                        });
                    });
                });
            });
            Object.entries(this.rules.surges || {}).forEach(([surgeId, surgeData]) => {
                (surgeData.talents || []).forEach(t => {
                    addEntry({
                        id: `surge_${surgeId}_${t.id}`,
                        talentId: t.id,
                        name: t.name,
                        talent: t,
                        pathId: surgeId,
                        pathType: 'surge',
                        isKey: false,
                        location: 'surge'
                    });
                });
            });
            (this.rules.ancestryPaths || []).forEach(path => {
                if (path.keyTalent) {
                    addEntry({
                        id: `${path.id}_${path.keyTalent.id}`,
                        talentId: path.keyTalent.id,
                        name: path.keyTalent.name,
                        talent: path.keyTalent,
                        pathId: path.id,
                        pathType: 'ancestry',
                        isKey: true,
                        location: 'ancestry'
                    });
                }
                (path.specialties || []).forEach(spec => {
                    (spec.talents || []).forEach(t => {
                        addEntry({
                            id: `${path.id}_${t.id}`,
                            talentId: t.id,
                            name: t.name,
                            talent: t,
                            pathId: path.id,
                            pathType: 'ancestry',
                            isKey: false,
                            location: 'ancestry'
                        });
                    });
                });
            });
            this._talentIndex = { byName, byId, byExpertise };
            return this._talentIndex;
        },

        // Returns true iff the character owns the expertise identified by `nameOrId`
        // (case-insensitive). Auto-granted entries (culture/talent/kit) and manual
        // entries both count.,

        characterHasExpertise: function(nameOrId) {
            if (!nameOrId) return false;
            const lower = nameOrId.toLowerCase();
            const owned = (this.currentCharacter && this.currentCharacter.expertises) || [];
            return owned.some(e =>
                (e.id && e.id.toLowerCase() === lower)
                || (e.name && e.name.toLowerCase() === lower)
            );
        },

        // Resolve a "skill or surge name" to its effective level (attribute + rank), case-insensitive.
        // The Cosmere character sheet displays this attribute+rank total as the player's actual
        // skill bonus, so talent prereqs like "Deduction 1+" are checked against this end value
        // rather than the raw rank — what you see is what you need.
        // Returns null if no matching skill or surge exists.,

        getSkillOrSurgeRank: function(name) {
            const char = this.currentCharacter;
            const lower = name.toLowerCase().trim();
            const skill = (this.rules.skills.list || []).find(s =>
                s.name.toLowerCase() === lower || s.id === lower.replace(/\s+/g, '_')
            );
            if (skill) {
                const rank = char.skills[skill.id] || 0;
                const attr = char.attributes[skill.attribute] || 0;
                return rank + attr;
            }
            if (this.rules.surges && this.rules.surges[lower]) {
                const surgeData = this.rules.surges[lower];
                const rank = (char.surgeRanks && char.surgeRanks[lower]) || 0;
                const attr = char.attributes[surgeData.attribute] || 0;
                return rank + attr;
            }
            if (this.rules.surges) {
                const matched = Object.entries(this.rules.surges).find(([id, s]) => s.name && s.name.toLowerCase() === lower);
                if (matched) {
                    const [surgeId, surgeData] = matched;
                    const rank = (char.surgeRanks && char.surgeRanks[surgeId]) || 0;
                    const attr = char.attributes[surgeData.attribute] || 0;
                    return rank + attr;
                }
            }
            return null;
        },

        // Resolve a path-local talent id (as used in `requiresTalent` edges) to its
        // full, globally-unique id within `talentIndex.byId`. Tries the heroic/radiant
        // prefix first, then the surge prefix. Returns null if neither resolves.,

        resolveLocalTalentId: function(localId, contextPathId, talentIndex) {
            if (!localId || !contextPathId) return null;
            const direct = `${contextPathId}_${localId}`;
            if (talentIndex.byId.has(direct)) return direct;
            const surge = `surge_${contextPathId}_${localId}`;
            if (talentIndex.byId.has(surge)) return surge;
            return null;
        },

        // Build a map of full-talent-id -> display name, used for human-readable failure
        // messages when a structured `requiresTalent` edge isn't satisfied.,

        isTalentSelected: function(fullId) {
            const char = this.currentCharacter;
            if ((char.talents || []).includes(fullId)) return true;
            if ((char.surgeTalents || []).includes(fullId)) return true;
            return false;
        },

        // Evaluate a structured `requiresTalent` array, scoped to `pathId`.
        // Format: each top-level item is either a string (single required talent id)
        // or an array of strings (OR group, at least one must be selected). The
        // top-level array uses AND semantics across its entries.,

        evaluateRequiresTalent: function(talent, pathId) {
            if (!talent || !Array.isArray(talent.requiresTalent) || talent.requiresTalent.length === 0) {
                return { ok: true, reason: '' };
            }
            const index = this.buildTalentIndex();
            for (const entry of talent.requiresTalent) {
                if (Array.isArray(entry)) {
                    // OR group: any one selected satisfies this group.
                    const names = [];
                    let met = false;
                    for (const localId of entry) {
                        const fullId = this.resolveLocalTalentId(localId, pathId, index);
                        const idxEntry = fullId ? index.byId.get(fullId) : null;
                        names.push(idxEntry ? idxEntry.name : localId);
                        if (fullId && this.isTalentSelected(fullId)) {
                            met = true;
                            break;
                        }
                    }
                    if (!met) {
                        return { ok: false, reason: `Requires one of: ${names.join(' or ')}` };
                    }
                } else {
                    const localId = entry;
                    const fullId = this.resolveLocalTalentId(localId, pathId, index);
                    const idxEntry = fullId ? index.byId.get(fullId) : null;
                    if (!fullId || !this.isTalentSelected(fullId)) {
                        return { ok: false, reason: `Requires talent: ${idxEntry ? idxEntry.name : localId}` };
                    }
                }
            }
            return { ok: true, reason: '' };
        },

        // Returns { ok: boolean, reason: string } describing whether a talent's prereqs are met.
        // When ok=false, reason is a human-readable failure message.
        //
        // Order of checks:
        //   1. Structured `requiresTalent` edges (path-scoped, authoritative tree structure).
        //   2. Textual `prerequisite` clauses for skill/attribute/narrative requirements.
        //   3. Implicit "key talent of this path is selected" rule for heroic non-key talents.,

        checkTalentPrerequisite: function(talent, pathId) {
            if (!talent) return { ok: true, reason: '' };

            const requiresResult = this.evaluateRequiresTalent(talent, pathId);
            if (!requiresResult.ok) return requiresResult;

            if (!talent.prerequisite || talent.prerequisite === 'none') {
                return this.checkPrecedingTalentRule(talent, pathId);
            }

            const char = this.currentCharacter;
            const raw = talent.prerequisite.trim();
            const reasons = [];

            // Split on top-level "or" (case-insensitive). If found, ANY clause may satisfy.
            const orParts = raw.split(/\s+or\s+/i);
            if (orParts.length > 1) {
                for (const part of orParts) {
                    const result = this.evaluatePrereqClause(part.trim(), char, pathId);
                    if (result.ok) return this.checkPrecedingTalentRule(talent, pathId);
                    reasons.push(result.reason);
                }
                return { ok: false, reason: `Need one of: ${reasons.join(' OR ')}` };
            }

            // No top-level "or": split on commas; ALL clauses must be met.
            const andParts = raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
            for (const clause of andParts) {
                const result = this.evaluatePrereqClause(clause, char, pathId);
                if (!result.ok) return { ok: false, reason: result.reason };
            }

            return this.checkPrecedingTalentRule(talent, pathId);
        },

        // Implicit rule: a non-key talent in a heroic or ancestry path requires that path's keyTalent.
        // Radiant orders embed their key (First Ideal) in a specialty, so they don't use this hook.,

        checkPrecedingTalentRule: function(talent, pathId) {
            if (!talent || !pathId) return { ok: true, reason: '' };
            const char = this.currentCharacter;
            const path = (this.rules.heroicPaths || []).find(p => p.id === pathId)
                || (this.rules.ancestryPaths || []).find(p => p.id === pathId);
            if (!path || !path.keyTalent) return { ok: true, reason: '' };
            const keyId = `${path.id}_${path.keyTalent.id}`;
            if (talent.id === path.keyTalent.id) return { ok: true, reason: '' };
            if ((char.talents || []).includes(keyId)) return { ok: true, reason: '' };
            return { ok: false, reason: `Requires the path's key talent: ${path.keyTalent.name}` };
        },

        // Evaluates a single comma-separated clause of a talent's prerequisite string.,

        evaluatePrereqClause: function(clause, char, pathId) {
            const trimmed = clause.trim();
            if (!trimmed || trimmed.toLowerCase() === 'none') return { ok: true, reason: '' };

            // "<Skill or Surge> N+"
            const rankMatch = trimmed.match(/^([A-Za-z][A-Za-z\s']+?)\s+(\d+)\+$/);
            if (rankMatch) {
                const name = rankMatch[1].trim();
                const need = parseInt(rankMatch[2], 10);
                const have = this.getSkillOrSurgeRank(name);
                if (have === null) {
                    return { ok: false, reason: `Unknown skill/surge prerequisite: '${name}'` };
                }
                if (have < need) return { ok: false, reason: `Need ${name} ${need}+ (you have ${have})` };
                return { ok: true, reason: '' };
            }

            // "<Ancestry> ancestry"
            const ancestryMatch = trimmed.match(/^([A-Za-z]+)\s+ancestry$/i);
            if (ancestryMatch) {
                const required = ancestryMatch[1];
                if ((char.ancestry || '').toLowerCase() === required.toLowerCase()) return { ok: true, reason: '' };
                return { ok: false, reason: `Requires ${required} ancestry` };
            }

            // "Speak the <Ordinal> Ideal" — satisfied if the matching radiant ideal talent is selected.
            const ordinalMap = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };
            const idealMatch = trimmed.match(/^Speak the (First|Second|Third|Fourth|Fifth) Ideal$/i);
            if (idealMatch) {
                const word = idealMatch[1].toLowerCase();
                const tier = ordinalMap[word];
                const idealTalentId = ['first_ideal', 'second_ideal', 'third_ideal', 'fourth_ideal', 'fifth_ideal'][tier - 1];
                const has = (char.talents || []).some(id => id.endsWith(`_${idealTalentId}`));
                if (has) return { ok: true, reason: '' };
                return { ok: false, reason: `Requires Speak the ${idealMatch[1]} Ideal` };
            }

            // "<Name> expertise" — talent prereqs occasionally require possession of a
            // catalog expertise (e.g. "Hammer expertise"). Resolve via the catalog's
            // byExpertise lookup so we honor both ids and display names.
            const expertiseMatch = trimmed.match(/^(.+?)\s+expertise$/i);
            if (expertiseMatch) {
                const wanted = expertiseMatch[1].trim();
                const idx = this.buildTalentIndex();
                const def = idx.byExpertise.get(wanted.toLowerCase());
                if (def) {
                    if (this.characterHasExpertise(def.id) || this.characterHasExpertise(def.name)) {
                        return { ok: true, reason: '' };
                    }
                    return { ok: false, reason: `Requires ${def.name} expertise` };
                }
                // Unknown expertise name — fall through to talent / narrative handling.
            }

            // Talent name lookup (case-insensitive). Multiple entries may share a name across paths.
            // Strip the handbook's " talent" / " talents" suffix and the "key" qualifier so
            // phrasings like "Hardy talent" or "Change Form key talent" resolve correctly.
            const normalized = trimmed
                .replace(/\s+talents?$/i, '')
                .replace(/\s+key$/i, '')
                .trim()
                .toLowerCase();
            const index = this.buildTalentIndex();
            const matches = index.byName.get(normalized);
            if (matches && matches.length > 0) {
                const has = matches.some(entry => {
                    const inTalents = (char.talents || []).includes(entry.id);
                    const inSurge = (char.surgeTalents || []).includes(entry.id);
                    return inTalents || inSurge;
                });
                if (has) return { ok: true, reason: '' };
                return { ok: false, reason: `Requires talent: ${trimmed}` };
            }

            // Narrative / GM-controlled prereqs (e.g. "Patron in high society", "A patron",
            // "Access to a Shardblade and Shardplate", "Title granting..."). These have no
            // mechanical check — the player and GM handle them. Allow.
            return { ok: true, reason: '' };
        },

        isTalentPrereqMet: function(talentEntry) {
            if (!talentEntry) return false;
            const result = this.checkTalentPrerequisite(talentEntry.talent, talentEntry.pathId);
            return result.ok;
        },

        toggleTalent: async function(talentId) {
            if (!this.currentCharacter.talents) {
                this.currentCharacter.talents = [];
            }

            const index = this.buildTalentIndex();
            const entry = index.byId.get(talentId);
            if (!entry) {
                throw new Error(`toggleTalent: unknown talentId '${talentId}'`);
            }

            const isAutoGranted = (this.currentCharacter.grants || []).some(g =>
                g.type === 'auto_talent' && g.payload && g.payload.talentId === talentId);
            if (isAutoGranted) {
                this.dialog.alert(`'${entry.name}' is automatically granted by your path and cannot be removed individually. Remove the path to remove it.`, { title: 'Auto-Granted Talent', variant: 'info' });
                return;
            }

            const alreadyHas = this.currentCharacter.talents.includes(talentId);
            if (alreadyHas) {
                const dependents = this.findDependentTalents(entry);
                if (dependents.length > 0) {
                    const names = dependents.map(d => d.name).join(', ');
                    const confirmed = await this.dialog.confirm(
                        `Removing this talent will also remove dependent talents: ${names}. Continue?`,
                        { title: 'Remove Talent', okText: 'Remove', danger: true }
                    );
                    if (!confirmed) {
                        return;
                    }
                    dependents.forEach(d => {
                        const i = this.currentCharacter.talents.indexOf(d.id);
                        if (i >= 0) this.currentCharacter.talents.splice(i, 1);
                        const j = (this.currentCharacter.surgeTalents || []).indexOf(d.id);
                        if (j >= 0) this.currentCharacter.surgeTalents.splice(j, 1);
                    });
                }
                const idx = this.currentCharacter.talents.indexOf(talentId);
                this.currentCharacter.talents.splice(idx, 1);
            } else {
                const result = this.checkTalentPrerequisite(entry.talent, entry.pathId);
                if (!result.ok) {
                    this.dialog.alert(`Cannot select '${entry.name}': ${result.reason}`, { title: 'Prerequisite Not Met', variant: 'warning' });
                    return;
                }
                const totalLevel = this.getTotalLevel();
                if (totalLevel === 0 && !entry.isKey && entry.pathType === 'heroic') {
                    // First level grants only the path's key talent automatically; players still need
                    // talent points for non-key talents at later levels.
                }
                if (this.cachedPointData && typeof this.cachedPointData.remainingTalentPoints === 'number') {
                    if (this.cachedPointData.remainingTalentPoints <= 0) {
                        this.dialog.alert(`No talent points remaining (${this.cachedPointData.usedTalentPoints}/${this.cachedPointData.totalTalentPoints} used). Level up to gain more.`, { title: 'No Talent Points Remaining', variant: 'warning' });
                        return;
                    }
                }
                this.currentCharacter.talents.push(talentId);
            }

            this.renderCharacterSheet();
            this.updateCharacter();
        },

        // Returns talents currently selected whose prereqs reference this talent (by name).,

        findDependentTalents: function(removedEntry) {
            const char = this.currentCharacter;
            const dependents = [];
            const allSelected = [...(char.talents || []), ...(char.surgeTalents || [])];
            const index = this.buildTalentIndex();
            allSelected.forEach(selectedId => {
                const entry = index.byId.get(selectedId);
                if (!entry || entry.id === removedEntry.id) return;

                // Check structured requiresTalent edges first — only edges within the
                // same scope (path/order/surge) can reference the removed talent.
                if (entry.pathId === removedEntry.pathId && Array.isArray(entry.talent.requiresTalent)) {
                    const referencesRemoved = entry.talent.requiresTalent.some(item => {
                        const ids = Array.isArray(item) ? item : [item];
                        return ids.includes(removedEntry.talent.id);
                    });
                    if (referencesRemoved) {
                        dependents.push(entry);
                        return;
                    }
                }

                // Fallback: textual prerequisite name match (covers narrative or
                // legacy entries without requiresTalent edges).
                const prereq = (entry.talent.prerequisite || '').toLowerCase();
                if (!prereq || prereq === 'none') return;
                if (prereq.includes(removedEntry.name.toLowerCase())) {
                    dependents.push(entry);
                }
            });
            return dependents;
        }
    });
})();
