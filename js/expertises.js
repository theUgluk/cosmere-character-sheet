/**
 * Expertises Management & Picker Modal
 * Auto-granted and manual expertise reconciliation, budget tracking,
 * searchable category modal, catalog/custom expertise addition and removal.
 */
(function () {
    Object.assign(window.app, {
        reconcileExpertises: function() {
            const char = this.currentCharacter;
            if (!Array.isArray(char.expertises)) char.expertises = [];

            // Normalize legacy/string entries; resolve catalog ids by name where possible.
            const catalog = this.rules.expertises || [];
            const byNameLower = new Map(catalog.map(e => [e.name.toLowerCase(), e]));
            char.expertises = char.expertises.map(e => {
                if (typeof e === 'string') {
                    const def = byNameLower.get(e.toLowerCase());
                    return def
                        ? { id: def.id, name: def.name, category: def.category, source: 'manual', custom: false }
                        : { name: e, source: 'manual', custom: true };
                }
                if (!e.id && e.name) {
                    const def = byNameLower.get(e.name.toLowerCase());
                    if (def) {
                        return { ...e, id: def.id, name: def.name, category: def.category, custom: false };
                    }
                    if (e.custom === undefined) {
                        return { ...e, custom: true };
                    }
                }
                return e;
            });

            const auto = this.getAutoGrantedExpertises();
            const manual = char.expertises.filter(e => e.source === 'manual');
            // Deduplicate auto expertises by id (preferred) or name (fallback). First source wins.
            const seenKeys = new Set();
            const stillValidAuto = [];
            auto.forEach(a => {
                const key = (a.id || '').toLowerCase() || a.name.toLowerCase();
                if (seenKeys.has(key)) return;
                seenKeys.add(key);
                stillValidAuto.push(a);
            });
            // Drop manual expertises that are now duplicates of an auto-granted one.
            const filteredManual = manual.filter(m => {
                const key = (m.id || '').toLowerCase() || (m.name || '').toLowerCase();
                return !seenKeys.has(key);
            });
            char.expertises = [...stillValidAuto, ...filteredManual];
        },

        renderExpertises: function() {
            const container = document.getElementById('expertiseList');
            if (!container) return;
            this.reconcileExpertises();
            const expertises = this.currentCharacter.expertises;

            const tags = expertises.map((exp, index) => {
                const def = this.getExpertiseDef(exp);
                const isManual = exp.source === 'manual';
                const isCustom = !!exp.custom || !def;
                let cls = 'expertise-tag';
                let label = '';
                if (exp.source === 'culture') { cls += ' from-culture'; label = 'culture'; }
                else if (exp.source && exp.source.startsWith('talent:')) { cls += ' from-talent'; label = 'talent'; }
                else if (exp.source && exp.source.startsWith('kit:')) { cls += ' from-kit'; label = 'kit'; }
                else if (isCustom) { cls += ' is-custom'; label = 'custom'; }
                else { cls += ' from-expertise-catalog'; label = def ? def.category : ''; }
                const removeBtn = isManual
                    ? `<button class="expertise-remove" onclick="app.removeExpertise(${index})" title="Remove expertise">×</button>`
                    : `<span title="Auto-granted; cannot be removed manually" style="opacity: 0.6;">🔒</span>`;
                const sourceLabel = label ? `<span class="expertise-source-label">${label}</span>` : '';
                const titleAttr = def && def.description ? ` title="${this.escapeHtml(def.description)}"` : '';
                return `<div class="${cls}"${titleAttr}>${this.escapeHtml(exp.name)}${sourceLabel}${removeBtn}</div>`;
            }).join('');

            container.innerHTML = tags + `
                <button class="add-expertise" onclick="app.addExpertise()">+ Add Expertise</button>
            `;

            this.updateExpertiseTracker();
        },

        updateExpertiseTracker: function() {
            const char = this.currentCharacter;
            const total = this.computeExpertiseBudget();
            const used = (char.expertises || []).filter(e => e.source === 'manual').length;
            const remaining = total - used;
            const usedEl = document.getElementById('expertisePointsUsed');
            const totalEl = document.getElementById('expertisePointsTotal');
            const remainingEl = document.getElementById('expertisePointsRemaining');
            const barEl = document.getElementById('expertiseProgressBar');
            const breakdownEl = document.getElementById('expertiseBreakdown');
            if (!usedEl || !totalEl || !remainingEl || !barEl) return;
            usedEl.textContent = used;
            totalEl.textContent = total;
            remainingEl.textContent = remaining + ' remaining';
            remainingEl.classList.remove('over', 'complete');
            if (remaining < 0) remainingEl.classList.add('over');
            else if (remaining === 0 && total > 0) remainingEl.classList.add('complete');
            const progress = total > 0 ? Math.min((used / total) * 100, 100) : 0;
            barEl.style.width = progress + '%';
            barEl.classList.remove('over', 'complete');
            if (remaining < 0) barEl.classList.add('over');
            else if (remaining === 0 && total > 0) barEl.classList.add('complete');

            const culture = this.getCultureData(char.culture);
            const cultureCount = culture && culture.expertises ? culture.expertises.length : 0;
            const intCount = char.attributes.intellect || 0;
            let talentChoices = 0;
            if (char.talents) {
                this.rules.heroicPaths.forEach(path => {
                    if (path.keyTalent && path.keyTalent.grantsExpertiseChoice && char.talents.includes(`${path.id}_${path.keyTalent.id}`)) {
                        talentChoices += path.keyTalent.grantsExpertiseChoice;
                    }
                    path.specialties.forEach(spec => spec.talents.forEach(t => {
                        if (t.grantsExpertiseChoice && char.talents.includes(`${path.id}_${t.id}`)) talentChoices += t.grantsExpertiseChoice;
                    }));
                });
            }
            if (breakdownEl) {
                breakdownEl.textContent = `${cultureCount} culture + ${intCount} Intellect + ${talentChoices} talent choices`;
            }
        },

        addExpertise: function() {
            const total = this.computeExpertiseBudget();
            const used = (this.currentCharacter.expertises || []).filter(e => e.source === 'manual').length;
            if (used >= total) {
                this.dialog.alert(`No expertise slots remaining. You have ${total} (${this.computeExpertiseBudgetBreakdown()}). Increase Intellect, change culture, or pick a talent that grants an expertise choice.`, { title: 'No Expertise Slots', variant: 'warning' });
                return;
            }
            this.openExpertiseModal();
        },

        openExpertiseModal: function() {
            this._specialistApproved = false;
            this._expertiseSearchQuery = '';
            const checkbox = document.getElementById('specialistApproved');
            if (checkbox) checkbox.checked = false;
            const search = document.getElementById('expertiseSearch');
            if (search) search.value = '';
            this.selectExpertiseTab('weapon');
            document.getElementById('expertiseModal').classList.add('active');
        },

        closeExpertiseModal: function() {
            document.getElementById('expertiseModal').classList.remove('active');
        },

        selectExpertiseTab: function(category) {
            this._currentExpertiseCategory = category;
            document.querySelectorAll('#expertiseTabBar .expertise-tab').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === category);
            });
            const showSpecialistGate = category === 'specialist';
            document.getElementById('specialistGate').style.display = showSpecialistGate ? 'block' : 'none';
            const showCustomForm = category === 'custom';
            document.getElementById('customExpertiseForm').style.display = showCustomForm ? 'block' : 'none';
            if (showCustomForm) {
                const input = document.getElementById('customExpertiseName');
                if (input) {
                    input.value = '';
                    setTimeout(() => input.focus(), 0);
                }
            }
            this.renderExpertiseModalList();
        },

        toggleSpecialistApproval: function(approved) {
            this._specialistApproved = !!approved;
            this.renderExpertiseModalList();
        },

        filterExpertises: function(query) {
            this._expertiseSearchQuery = (query || '').toLowerCase();
            this.renderExpertiseModalList();
        },

        renderExpertiseModalList: function() {
            const container = document.getElementById('expertiseSelectionList');
            if (!container) return;
            const category = this._currentExpertiseCategory || 'weapon';
            if (category === 'custom') {
                container.innerHTML = '<div class="help-text" style="padding: 8px;">Enter a custom expertise name above. Custom expertises are roleplay-only — they don\'t add traits or affect die rolls.</div>';
                return;
            }
            const search = (this._expertiseSearchQuery || '').toLowerCase();
            const catalog = this.rules.expertises || [];
            const ownedIds = new Set((this.currentCharacter.expertises || []).filter(e => e.id).map(e => e.id));
            const ownedNamesLower = new Set((this.currentCharacter.expertises || []).map(e => (e.name || '').toLowerCase()));

            const items = catalog.filter(e => {
                if (e.category !== category) return false;
                if (search) {
                    const hay = `${e.name} ${e.description || ''}`.toLowerCase();
                    if (!hay.includes(search)) return false;
                }
                return true;
            });

            if (items.length === 0) {
                container.innerHTML = '<div class="help-text" style="padding: 8px;">No matches.</div>';
                return;
            }

            const specialistLocked = category === 'specialist' && !this._specialistApproved;
            container.innerHTML = items.map(e => {
                const owned = ownedIds.has(e.id) || ownedNamesLower.has(e.name.toLowerCase());
                const disabled = owned || specialistLocked;
                const tag = owned
                    ? '<span class="expertise-option-tag">already owned</span>'
                    : (specialistLocked ? '<span class="expertise-option-tag">GM approval required</span>' : '');
                const onclick = disabled ? '' : `onclick="app.commitCatalogExpertise('${e.id}')"`;
                const expertTraits = (e.expertEffects || [])
                    .map(eff => this.describeEffect(eff))
                    .filter(s => s)
                    .join(', ');
                const traitsLine = expertTraits ? `<div class="expertise-option-effect" style="margin-top: 4px;"><strong>Effect:</strong> ${this.escapeHtml(expertTraits)}</div>` : '';
                return `<div class="expertise-option ${disabled ? 'disabled' : ''}" ${onclick}>
                    <div style="flex: 1;">
                        <div class="expertise-option-name">${this.escapeHtml(e.name)}</div>
                        <div class="expertise-option-effect">${this.escapeHtml(e.description || '')}</div>
                        ${traitsLine}
                    </div>
                    ${tag}
                </div>`;
            }).join('');
        },

        describeEffect: function(effect) {
            if (typeof effect !== 'string' || !effect.includes(':')) {
                throw new Error(`Invalid expertEffect: ${effect}`);
            }
            const idx = effect.indexOf(':');
            const verb = effect.slice(0, idx);
            const arg = effect.slice(idx + 1);
            switch (verb) {
                case 'addTrait': return `+${arg}`;
                case 'removeTrait': return `removes ${arg}`;
                case 'replaceTrait': return arg.replace('=>', ' → ');
                case 'addReach': return `+${arg} ft reach`;
                case 'addExpertNote': return arg;
                default: throw new Error(`Unknown expertEffect verb: ${verb}`);
            }
        },

        commitCatalogExpertise: function(expertiseId) {
            const def = (this.rules.expertises || []).find(e => e.id === expertiseId);
            if (!def) throw new Error(`Unknown expertise id: ${expertiseId}`);
            const total = this.computeExpertiseBudget();
            const used = (this.currentCharacter.expertises || []).filter(e => e.source === 'manual').length;
            if (used >= total) {
                this.dialog.alert(`No expertise slots remaining. You have ${total}.`, { title: 'No Expertise Slots', variant: 'warning' });
                return;
            }
            const dup = (this.currentCharacter.expertises || []).some(e => e.id === def.id || (e.name || '').toLowerCase() === def.name.toLowerCase());
            if (dup) {
                this.dialog.alert(`You already have the ${def.name} expertise.`, { title: 'Duplicate Expertise', variant: 'warning' });
                return;
            }
            this.currentCharacter.expertises.push({
                id: def.id,
                name: def.name,
                category: def.category,
                source: 'manual',
                custom: false
            });
            this.closeExpertiseModal();
            this.renderExpertises();
            this.updateCharacter();
            this.refreshAfterEquipChange();
        },

        commitCustomExpertise: function() {
            const input = document.getElementById('customExpertiseName');
            if (!input) return;
            const raw = (input.value || '').trim();
            if (!raw) {
                this.dialog.alert('Please enter a name for the custom expertise.', { title: 'Missing Expertise Name', variant: 'warning' });
                return;
            }
            const total = this.computeExpertiseBudget();
            const used = (this.currentCharacter.expertises || []).filter(e => e.source === 'manual').length;
            if (used >= total) {
                this.dialog.alert(`No expertise slots remaining. You have ${total}.`, { title: 'No Expertise Slots', variant: 'warning' });
                return;
            }
            const dup = (this.currentCharacter.expertises || []).some(e => (e.name || '').toLowerCase() === raw.toLowerCase());
            if (dup) {
                this.dialog.alert(`You already have an expertise named "${raw}".`, { title: 'Duplicate Expertise', variant: 'warning' });
                return;
            }
            this.currentCharacter.expertises.push({
                name: raw,
                source: 'manual',
                custom: true
            });
            this.closeExpertiseModal();
            this.renderExpertises();
            this.updateCharacter();
            this.refreshAfterEquipChange();
        },

        getExpertiseDef: function(exp) {
            if (!exp) return null;
            const catalog = this.rules.expertises || [];
            if (exp.id) {
                return catalog.find(e => e.id === exp.id) || null;
            }
            if (exp.name) {
                const lower = exp.name.toLowerCase();
                return catalog.find(e => e.name.toLowerCase() === lower) || null;
            }
            return null;
        },

        computeExpertiseBudgetBreakdown: function() {
            const char = this.currentCharacter;
            const culture = this.getCultureData(char.culture);
            const cultureCount = culture && culture.expertises ? culture.expertises.length : 0;
            const intCount = char.attributes.intellect || 0;
            return `${cultureCount} culture + ${intCount} Intellect`;
        },

        removeExpertise: function(index) {
            const exp = this.currentCharacter.expertises[index];
            if (!exp || exp.source !== 'manual') {
                this.dialog.alert('This expertise is auto-granted by your culture, talent, or kit and cannot be removed manually.', { title: 'Auto-Granted Expertise', variant: 'info' });
                return;
            }
            this.currentCharacter.expertises.splice(index, 1);
            this.renderExpertises();
            this.updateCharacter();
            this.refreshAfterEquipChange();
        },

        // ===================================================================
        // RULES HELPERS: per-handbook formulas for derived stats and budgets
        // ===================================================================
    });
})();
