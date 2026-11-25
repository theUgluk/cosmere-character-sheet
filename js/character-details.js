/**
 * Character Details: Injuries, Conditions, Connections, Goals, Languages & Portrait
 * CRUD and rendering for narrative and status sections plus portrait resize/lightbox.
 */
(function () {
    Object.assign(window.app, {
        addInjury: async function(type) {
            const label = type === 'permanent' ? 'Permanent' : 'Temporary';
            const result = await this.dialog.form({
                title: `Add ${label} Injury`,
                fields: [{
                    name: 'description',
                    label: `${label} Injury Description`,
                    type: 'textarea',
                    rows: 2,
                    required: true,
                    placeholder: 'Describe the injury and its effects...'
                }],
                okText: 'Add Injury'
            });
            if (!result) return;
            const description = result.description.trim();
            if (!description) return;
            
            if (!this.currentCharacter.injuries) {
                this.currentCharacter.injuries = {temporary: [], permanent: []};
            }
            
            this.currentCharacter.injuries[type].push({description, date: new Date().toLocaleDateString()});
            this.renderInjuries();
            this.updateCharacter();
        },

        removeInjury: async function(type, index) {
            const confirmed = await this.dialog.confirm('Remove this injury?', { title: 'Remove Injury', okText: 'Remove', danger: true });
            if (!confirmed) return;
            this.currentCharacter.injuries[type].splice(index, 1);
            this.renderInjuries();
            this.updateCharacter();
        },

        renderInjuries: function() {
            ['temporary', 'permanent'].forEach(type => {
                const container = document.getElementById(`${type}Injuries`);
                const injuries = this.currentCharacter.injuries?.[type] || [];
                
                if (injuries.length === 0) {
                    container.innerHTML = `<div class="help-text">No ${type} injuries</div>`;
                    return;
                }
                
                container.innerHTML = injuries.map((injury, index) => `
                    <div class="injury-card">
                        <div>
                            <div style="font-weight: bold;">${injury.description}</div>
                            <div style="font-size: 0.85em; margin-top: 4px;">Date: ${injury.date}</div>
                        </div>
                        <button onclick="app.removeInjury('${type}', ${index})" class="danger">×</button>
                    </div>
                `).join('');
            });
        },

        addCondition: function() {
            const search = document.getElementById('conditionSearch');
            if (search) search.value = '';
            this.renderConditionSelectionModal();
            document.getElementById('conditionModal').classList.add('active');
        },

        renderConditionSelectionModal: function() {
            const container = document.getElementById('conditionSelectionList');
            const conditions = this.rules.conditions || [];
            
            container.innerHTML = conditions.map(condition => `
                <div class="weapon-option" onclick="app.selectCondition('${condition.id}')">
                    <div class="weapon-option-name">${condition.name}</div>
                    <div class="weapon-option-stats">${condition.description}</div>
                </div>
            `).join('');
        },

        selectCondition: function(conditionId) {
            const condition = this.rules.conditions.find(c => c.id === conditionId);
            if (!condition) return;
            
            if (!this.currentCharacter.conditions) {
                this.currentCharacter.conditions = [];
            }
            
            // Check if already added
            if (this.currentCharacter.conditions.some(c => c.name === condition.name)) {
                this.dialog.alert('This condition is already active.', { title: 'Condition Already Active', variant: 'warning' });
                return;
            }
            
            this.currentCharacter.conditions.push({
                ...condition,
                applied: new Date().toLocaleDateString()
            });
            
            this.closeConditionModal();
            this.renderConditions();
            this.updateCharacter();
        },

        closeConditionModal: function() {
            document.getElementById('conditionModal').classList.remove('active');
        },

        filterConditions: function(searchTerm) {
            const container = document.getElementById('conditionSelectionList');
            const conditions = this.rules.conditions || [];
            const term = searchTerm.toLowerCase();
            
            const filtered = conditions.filter(condition => 
                condition.name.toLowerCase().includes(term) ||
                condition.description.toLowerCase().includes(term)
            );
            
            if (filtered.length === 0) {
                container.innerHTML = '<div class="help-text">No conditions found matching your search</div>';
                return;
            }
            
            container.innerHTML = filtered.map(condition => `
                <div class="weapon-option" onclick="app.selectCondition('${condition.id}')">
                    <div class="weapon-option-name">${condition.name}</div>
                    <div class="weapon-option-stats">${condition.description}</div>
                </div>
            `).join('');
        },

        removeCondition: async function(index) {
            const confirmed = await this.dialog.confirm('Remove this condition?', { title: 'Remove Condition', okText: 'Remove', danger: true });
            if (!confirmed) return;
            this.currentCharacter.conditions.splice(index, 1);
            this.renderConditions();
            this.updateCharacter();
        },

        renderConditions: function() {
            const container = document.getElementById('conditionsList');
            if (!this.currentCharacter.conditions || this.currentCharacter.conditions.length === 0) {
                container.innerHTML = '<div class="help-text">No active conditions</div>';
                return;
            }

            container.innerHTML = this.currentCharacter.conditions.map((condition, index) => `
                <div class="condition-card">
                    <div>
                        <div style="font-weight: bold;">${condition.name}</div>
                        <div style="font-size: 0.9em; margin-top: 4px;">${condition.description}</div>
                        <div style="font-size: 0.85em; margin-top: 4px;">Applied: ${condition.applied}</div>
                    </div>
                    <button onclick="app.removeCondition(${index})" class="danger">×</button>
                </div>
            `).join('');
        },

        // ========== CONNECTIONS FUNCTIONS ==========,

        addConnection: function() {
            if (!this.currentCharacter.connections) this.currentCharacter.connections = [];
            this.currentCharacter.connections.push({
                name: '',
                relationship: 'Acquaintance',
                description: ''
            });
            this.renderConnections();
            this.updateCharacter();
        },

        removeConnection: async function(index) {
            const confirmed = await this.dialog.confirm('Remove this connection?', { title: 'Remove Connection', okText: 'Remove', danger: true });
            if (!confirmed) return;
            this.currentCharacter.connections.splice(index, 1);
            this.renderConnections();
            this.updateCharacter();
        },

        updateConnectionField: function(index, field, value) {
            this.currentCharacter.connections[index][field] = value;
            this.updateCharacter();
        },

        renderConnections: function() {
            const container = document.getElementById('connectionsList');
            if (!this.currentCharacter.connections) {
                this.currentCharacter.connections = [];
            }
            
            if (this.currentCharacter.connections.length === 0) {
                container.innerHTML = '<div class="help-text">No connections tracked yet. Click "+ Add Connection" to create one.</div>';
                return;
            }

            container.innerHTML = this.currentCharacter.connections.map((conn, index) => `
                <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--accent-color);">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" 
                               value="${conn.name || ''}" 
                               placeholder="Connection name..." 
                               style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; font-weight: bold;"
                               oninput="app.updateConnectionField(${index}, 'name', this.value)">
                        <button onclick="app.removeConnection(${index})" 
                                style="padding: 8px 12px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🗑️
                        </button>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px; font-weight: bold;">Relationship:</label>
                        <select style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
                                onchange="app.updateConnectionField(${index}, 'relationship', this.value)">
                            <option value="Acquaintance" ${conn.relationship === 'Acquaintance' ? 'selected' : ''}>Acquaintance</option>
                            <option value="Ally" ${conn.relationship === 'Ally' ? 'selected' : ''}>Ally</option>
                            <option value="Enemy" ${conn.relationship === 'Enemy' ? 'selected' : ''}>Enemy</option>
                            <option value="Family" ${conn.relationship === 'Family' ? 'selected' : ''}>Family</option>
                            <option value="Friend" ${conn.relationship === 'Friend' ? 'selected' : ''}>Friend</option>
                            <option value="Mentor" ${conn.relationship === 'Mentor' ? 'selected' : ''}>Mentor</option>
                            <option value="Patron" ${conn.relationship === 'Patron' ? 'selected' : ''}>Patron</option>
                            <option value="Rival" ${conn.relationship === 'Rival' ? 'selected' : ''}>Rival</option>
                            <option value="Spren Bond" ${conn.relationship === 'Spren Bond' ? 'selected' : ''}>Spren Bond</option>
                            <option value="Other" ${conn.relationship === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.9em; margin-bottom: 4px; font-weight: bold;">Description:</label>
                        <textarea style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; min-height: 60px; font-family: inherit;"
                                  placeholder="Describe this connection..."
                                  oninput="app.updateConnectionField(${index}, 'description', this.value)">${conn.description || ''}</textarea>
                    </div>
                </div>
            `).join('');
        },

        // Toggle Combat & Play section,

        renderGoals: function() {
            const container = document.getElementById('goalsList');
            if (!this.currentCharacter.goals) {
                this.currentCharacter.goals = [];
            }
            
            if (this.currentCharacter.goals.length === 0) {
                container.innerHTML = '<div class="help-text">No goals added yet. Click "+ Add Goal" to create one.</div>';
                return;
            }
            
            container.innerHTML = this.currentCharacter.goals.map((goal, goalIndex) => `
                <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" 
                               value="${goal.text || ''}" 
                               placeholder="Enter your goal..." 
                               style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
                               oninput="app.updateGoalText(${goalIndex}, this.value)">
                        <button onclick="app.removeGoal(${goalIndex})" 
                                style="padding: 8px 12px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🗑️
                        </button>
                    </div>
                    <div style="display: flex; gap: 15px; align-items: center;">
                        <strong style="font-size: 0.9em;">Milestones:</strong>
                        ${[0, 1, 2].map(milestoneIndex => `
                            <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                <input type="checkbox" 
                                       ${goal.milestones && goal.milestones[milestoneIndex] ? 'checked' : ''}
                                       onchange="app.toggleMilestone(${goalIndex}, ${milestoneIndex})"
                                       style="width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 0.9em;">${milestoneIndex + 1}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        },

        addGoal: function() {
            if (!this.currentCharacter.goals) {
                this.currentCharacter.goals = [];
            }
            this.currentCharacter.goals.push({
                text: '',
                milestones: [false, false, false]
            });
            this.renderGoals();
            this.updateCharacter();
        },

        removeGoal: async function(index) {
            const confirmed = await this.dialog.confirm('Remove this goal?', { title: 'Remove Goal', okText: 'Remove', danger: true });
            if (!confirmed) return;
            this.currentCharacter.goals.splice(index, 1);
            this.renderGoals();
            this.updateCharacter();
        },

        updateGoalText: function(index, text) {
            this.currentCharacter.goals[index].text = text;
            this.updateCharacter();
        },

        toggleMilestone: function(goalIndex, milestoneIndex) {
            const goal = this.currentCharacter.goals[goalIndex];
            if (!goal.milestones) {
                goal.milestones = [false, false, false];
            }
            goal.milestones[milestoneIndex] = !goal.milestones[milestoneIndex];
            this.updateCharacter();
        },

        // ========== PORTRAIT FUNCTIONS ==========

        // ========== LANGUAGE FUNCTIONS ==========,

        getKnownLanguages: function() {
            return [
                'Alethi', 'Azish', 'Veden', 'Thaylen', 'Kharbranthian',
                'Unkalaki', 'Listener', 'Herdazian', 'Reshi', 'Shin',
                'Iriali', 'Makabaki', 'Natan', 'Purelaker'
            ];
        },

        normalizeLanguages: function() {
            const char = this.currentCharacter;
            if (!char.languages) {
                char.languages = [];
            } else if (typeof char.languages === 'string') {
                char.languages = char.languages
                    .split(/[,;]+/)
                    .map(l => l.trim())
                    .filter(l => l.length > 0);
            }
        },

        renderLanguages: function() {
            this.normalizeLanguages();
            const char = this.currentCharacter;
            const customLangInput = document.getElementById('customLanguage');
            if (customLangInput) customLangInput.value = '';
            const container = document.getElementById('languagesCheckboxes');
            const known = this.getKnownLanguages();

            const customLangs = char.languages.filter(l => !known.includes(l));
            const allLangs = [...known, ...customLangs];

            container.innerHTML = allLangs.map(lang => {
                const checked = char.languages.includes(lang) ? 'checked' : '';
                const isCustom = !known.includes(lang);
                return `
                    <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.9em; white-space: nowrap;">
                        <input type="checkbox" ${checked} onchange="app.toggleLanguage('${lang.replace(/'/g, "\\'")}', this.checked)">
                        ${lang}${isCustom ? ' <span onclick="event.preventDefault(); app.removeCustomLanguage(\'' + lang.replace(/'/g, "\\'") + '\')" style="color: var(--danger-color); cursor: pointer; font-size: 0.8em;" title="Remove">&times;</span>' : ''}
                    </label>
                `;
            }).join('');
        },

        toggleLanguage: function(lang, checked) {
            this.normalizeLanguages();
            const char = this.currentCharacter;
            if (checked && !char.languages.includes(lang)) {
                char.languages.push(lang);
            } else if (!checked) {
                char.languages = char.languages.filter(l => l !== lang);
            }
            this.updateCharacter();
        },

        addCustomLanguage: function() {
            const input = document.getElementById('customLanguage');
            const lang = input.value.trim();
            if (!lang) return;

            this.normalizeLanguages();
            const char = this.currentCharacter;
            if (!char.languages.includes(lang)) {
                char.languages.push(lang);
            }
            input.value = '';
            this.renderLanguages();
            this.updateCharacter();
        },

        removeCustomLanguage: function(lang) {
            this.normalizeLanguages();
            this.currentCharacter.languages = this.currentCharacter.languages.filter(l => l !== lang);
            this.renderLanguages();
            this.updateCharacter();
        },

        handlePortraitClick: function() {
            if (this.currentCharacter && this.currentCharacter.portrait) {
                this.openPortraitLightbox(this.currentCharacter.portrait);
            } else {
                document.getElementById('portraitInput').click();
            }
        },

        openPortraitLightbox: function(src) {
            const lightbox = document.getElementById('portraitLightbox');
            const img = document.getElementById('portraitLightboxImage');
            img.src = src;
            lightbox.classList.add('active');
        },

        closePortraitLightbox: function() {
            const lightbox = document.getElementById('portraitLightbox');
            lightbox.classList.remove('active');
        },

        uploadPortrait: function(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                this.dialog.alert('Please select an image file.', { title: 'Invalid File', variant: 'warning' });
                return;
            }

            const MAX_SIZE = 512;
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width;
                    let h = img.height;
                    if (w > MAX_SIZE || h > MAX_SIZE) {
                        const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
                        w = Math.round(w * ratio);
                        h = Math.round(h * ratio);
                    }
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    this.currentCharacter.portrait = dataUrl;
                    this.renderPortrait();
                    this.updateCharacter();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        },

        removePortrait: async function() {
            if (!this.currentCharacter.portrait) return;
            const confirmed = await this.dialog.confirm('Remove character portrait?', { title: 'Remove Portrait', okText: 'Remove', danger: true });
            if (!confirmed) return;
            this.currentCharacter.portrait = null;
            this.renderPortrait();
            this.updateCharacter();
        },

        renderPortrait: function() {
            const char = this.currentCharacter;
            const imgElem = document.getElementById('portraitImage');
            const placeholder = document.getElementById('portraitPlaceholder');
            const frame = document.getElementById('portraitFrame');
            const playPortrait = document.getElementById('playPortrait');
            const portraitInput = document.getElementById('portraitInput');
            if (portraitInput) portraitInput.value = '';

            if (char.portrait) {
                imgElem.src = char.portrait;
                imgElem.style.display = 'block';
                placeholder.style.display = 'none';
                frame.classList.add('has-image');
                if (playPortrait) {
                    playPortrait.src = char.portrait;
                    playPortrait.style.display = 'block';
                }
            } else {
                imgElem.style.display = 'none';
                imgElem.removeAttribute('src');
                placeholder.style.display = 'block';
                frame.classList.remove('has-image');
                if (playPortrait) {
                    playPortrait.style.display = 'none';
                    playPortrait.removeAttribute('src');
                }
            }
        }
    });
})();
