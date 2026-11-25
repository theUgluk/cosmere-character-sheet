/**
 * Cosmere Character Sheet - App Core
 * Defines window.app base state (rules, characters, currentCharacter) and core
 * lifecycle/sheet methods: init, loadRules, character CRUD, sheet/skill rendering,
 * attribute/character updates, and HTML escaping.
 */
(function () {
    window.app = {
        rules: null,

        characters: [],

        currentCharacter: null,

        init: async function() {
            try {
                mobileDebug.log('Starting initialization...');
                console.log('Initializing app...');
                await this.loadRules();
                mobileDebug.log('Rules loaded');
                console.log('Rules loaded, loading from localStorage...');
                this.loadFromLocalStorage();
                mobileDebug.log(`Characters loaded: ${this.characters.length}`);
                console.log('Characters loaded:', this.characters.length);
                this.renderCharacterList();
                mobileDebug.log('Character list rendered');
                
                if (this.characters.length === 0) {
                    mobileDebug.log('Creating new character...');
                    console.log('No characters found, creating new character...');
                    this.createNewCharacter();
                } else {
                    mobileDebug.log('Loading first character...');
                    console.log('Loading first character...');
                    this.loadCharacter(this.characters[0].id);
                }
                this.initTabFromStorage();
                this.maybeShowRulesUpdateNotice();
                mobileDebug.log('Initialization complete!');
                console.log('Initialization complete');
            } catch (error) {
                mobileDebug.error('Init failed', error);
                console.error('Error during initialization:', error);
                this.dialog.alert('Error initializing app: ' + error.message, { title: 'Initialization Error', variant: 'error' });
            }
        },

        loadRules: async function() {
            // Load embedded rules (single source of truth)
            this.rules = COSMERE_RULES;
            console.log('Rules loaded:', this.rules);
        },

        createNewCharacter: function() {
            let id = Date.now().toString();
            while (this.characters.some(c => c.id === id)) {
                id = (Number(id) + 1).toString();
            }

            const newChar = {
                id,
                name: '',
                playerName: '',
                ancestry: '',
                culture: '',
                attributes: {
                    strength: 2,
                    speed: 2,
                    intellect: 2,
                    willpower: 2,
                    awareness: 2,
                    presence: 2
                },
                skills: {},
                // Current resources will be set to max values after calculation
                deflect: 0,
                paths: [], // Multi-path system
                talents: [],
                surgeRanks: {}, // {surgeId: rank}
                surgeTalents: [], // Selected surge talents
                expertises: [], // Array of {name, source}
                grants: [], // Array of {source, type, payload} – tracks auto-grants for cleanup
                purpose: '',
                obstacle: '',
                goals: [], // Array of {text: string, milestones: [bool, bool, bool]}
                notes: '',
                // Equipment & Combat
                startingKit: null,
                weapons: [],
                equippedArmor: null,
                inventory: [],
                currency: {chips: 0, marks: 0, broams: 0},
                // Injuries & Conditions
                injuries: {temporary: [], permanent: []},
                conditions: [],
                // Connections
                connections: [],
                // Character Details
                portrait: null,
                languages: [],
                characterDetails: {
                    age: '',
                    gender: '',
                    height: '',
                    weight: '',
                    appearance: '',
                    backstory: ''
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Initialize all skills to rank 0
            this.rules.skills.list.forEach(skill => {
                newChar.skills[skill.id] = 0;
            });

            this.characters.push(newChar);
            this.loadCharacter(newChar.id);
            this.saveToLocalStorage();
        },

        loadCharacter: function(charId) {
            mobileDebug.log(`Loading character: ${charId}`);
            this.currentCharacter = this.characters.find(c => c.id === charId);
            if (this.currentCharacter) {
                try {
                    this.expandedPaths = {};
                    mobileDebug.log('Character found, initializing resources...');
                    // Initialize current resources to max if undefined (new characters)
                    this.migrateCharacterShape(this.currentCharacter);
                    const totalLevel = this.getTotalLevel();
                    const hasRadiant = this.currentCharacter.paths && this.currentCharacter.paths.some(p => p.type === 'radiant' && p.level > 0);
                    
                    if (this.currentCharacter.currentHealth === undefined) {
                        this.currentCharacter.currentHealth = this.computeMaxHealth(totalLevel, this.currentCharacter.attributes.strength);
                    }
                    
                    if (this.currentCharacter.currentFocus === undefined) {
                        this.currentCharacter.currentFocus = this.computeMaxFocus(this.currentCharacter.attributes.willpower);
                    }
                    
                    if (this.currentCharacter.currentInvestiture === undefined) {
                        this.currentCharacter.currentInvestiture = hasRadiant ? this.computeMaxInvestiture(totalLevel) : 0;
                    }
                    
                    mobileDebug.log('Showing character sheet...');
                    // Always show character sheet first, then populate it
                    document.getElementById('characterSheetSection').classList.remove('hidden');
                    mobileDebug.log('Hidden class removed');
                    
                    mobileDebug.log('Rendering character sheet...');
                    this.renderCharacterSheet();
                    mobileDebug.log('Updating point trackers...');
                    this.updatePointTrackers();
                    mobileDebug.log('Validating character...');
                    this.validateCharacter();
                    mobileDebug.log('Rendering character list...');
                    this.renderCharacterList();
                    mobileDebug.log('Character loaded successfully!');
                } catch (error) {
                    mobileDebug.error('Error loading character', error);
                    console.error('Error loading character:', error);
                    // Still show the character sheet even if there's an error
                    document.getElementById('characterSheetSection').classList.remove('hidden');
                    this.dialog.alert('Error loading character: ' + error.message + '. Check console for details.', { title: 'Load Error', variant: 'error' });
                }
            } else {
                mobileDebug.error('Character not found', new Error(`No character with id ${charId}`));
            }
        },

        deleteCurrentCharacter: async function() {
            if (!this.currentCharacter) return;
            const confirmed = await this.dialog.confirm(
                `Are you sure you want to delete ${this.currentCharacter.name || 'Unnamed Character'}? This cannot be undone.`,
                { title: 'Delete Character', okText: 'Delete', danger: true }
            );
            if (confirmed) {
                this.characters = this.characters.filter(c => c.id !== this.currentCharacter.id);
                this.saveToLocalStorage();
                
                if (this.characters.length > 0) {
                    this.loadCharacter(this.characters[0].id);
                } else {
                    this.currentCharacter = null;
                    document.getElementById('characterSheetSection').classList.add('hidden');
                    this.createNewCharacter();
                }
                
                this.renderCharacterList();
            }
        },

        renderCharacterList: function() {
            const container = document.getElementById('characterListItems');
            container.innerHTML = '';

            this.characters.forEach(char => {
                const card = document.createElement('div');
                card.className = 'character-card';
                if (this.currentCharacter && char.id === this.currentCharacter.id) {
                    card.classList.add('active');
                }
                card.onclick = () => this.loadCharacter(char.id);
                
                // Calculate total level from paths. Ancestry paths don't carry character
                // levels — they're a parallel talent tree, so exclude them from totals
                // and from the path display.
                const charLevel = char.paths ? char.paths.reduce((sum, path) => {
                    if (path.type === 'ancestry') return sum;
                    if (path.level === undefined) throw new Error(`Path has undefined level in character ${char.id}`);
                    return sum + path.level;
                }, 0) : 0;
                
                let pathsDisplay = 'No Paths';
                if (char.paths && char.paths.length > 0) {
                    pathsDisplay = char.paths
                        .filter(p => p.type !== 'ancestry' && p.level > 0)
                        .map(p => {
                            const pathData = p.type === 'heroic' 
                                ? this.rules.heroicPaths.find(hp => hp.id === p.id)
                                : this.rules.radiantOrders.find(ro => ro.id === p.id);
                            const pathName = pathData ? pathData.name : p.id;
                            return `${pathName} ${p.level}`;
                        })
                        .join(' • ') || 'No Paths';
                }
                
                const cultureObj = this.getCultureData(char.culture);
                const cultureLabel = cultureObj ? cultureObj.name : (char.culture || '');
                const ancestryCultureDisplay = [char.ancestry, cultureLabel].filter(Boolean).join(' • ') || 'No ancestry or culture';

                const portraitHtml = char.portrait 
                    ? `<img src="${char.portrait}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-color); flex-shrink: 0; cursor: pointer;" alt="" onclick="event.stopPropagation(); app.openPortraitLightbox(this.src)">`
                    : '';
                card.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${portraitHtml}
                        <div>
                            <h3 style="margin: 0;">${this.escapeHtml(char.name || 'Unnamed Character')}</h3>
                            <p style="margin: 2px 0;">Level ${charLevel} - ${this.escapeHtml(pathsDisplay)}</p>
                            <p style="margin: 0;">${this.escapeHtml(ancestryCultureDisplay)}</p>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            });
        },

        renderCharacterSheet: function() {
            const char = this.currentCharacter;
            
            // Basic info
            document.getElementById('characterName').value = char.name || '';
            document.getElementById('playerName').value = char.playerName || '';
            const totalLevel = this.getTotalLevel();
            document.getElementById('characterLevel').textContent = totalLevel;
            
            // Tier
            const levelData = this.rules.advancement.levelProgression.find(l => l.level === totalLevel);
            const tierNames = ['Local Heroes', 'Regional Heroes', 'World Shapers'];
            const tierIndex = totalLevel <= 3 ? 0 : (totalLevel <= 6 ? 1 : 2);
            document.getElementById('characterTier').textContent = tierNames[tierIndex];
            
            // Ancestry dropdown
            const ancestrySelect = document.getElementById('ancestry');
            ancestrySelect.innerHTML = '<option value="">-- Select Ancestry --</option>' + this.rules.ancestries.map(a => 
                `<option value="${a}" ${char.ancestry === a ? 'selected' : ''}>${a}</option>`
            ).join('');
            ancestrySelect.value = char.ancestry || '';
            
            // Culture dropdown (cultures are objects {id,name,expertises})
            const cultureSelect = document.getElementById('culture');
            const currentCultureId = (char.culture && typeof char.culture === 'object') ? char.culture.id : (char.culture || '');
            const matchedCulture = this.getCultureData(currentCultureId);
            const selectedCultureId = matchedCulture ? matchedCulture.id : currentCultureId;
            cultureSelect.innerHTML = '<option value="">-- Select Culture --</option>' + this.rules.cultures.map(c =>
                `<option value="${c.id}" ${selectedCultureId === c.id ? 'selected' : ''}>${c.name}</option>`
            ).join('');
            cultureSelect.value = selectedCultureId || '';
            
            // Attributes (also clamp the spinner max to the per-creation/per-tier cap)
            const attrMax = this.getMaxAttributeAtCurrentLevel(totalLevel);
            ['strength','speed','intellect','willpower','awareness','presence'].forEach(attrId => {
                const el = document.getElementById(attrId);
                if (!el) return;
                el.value = char.attributes[attrId];
                el.max = attrMax;
                el.title = totalLevel <= 0
                    ? `Max ${attrMax} per attribute at character creation`
                    : `Max ${attrMax} per attribute`;
            });
            
            // Skills
            this.renderSkills('physical');
            this.renderSkills('cognitive');
            this.renderSkills('spiritual');
            
            // Resources
            document.getElementById('currentHealth').value = char.currentHealth;
            document.getElementById('currentFocus').value = char.currentFocus;
            document.getElementById('currentInvestiture').value = char.currentInvestiture;
            document.getElementById('deflect').value = char.deflect;
            
            // Purpose and Obstacle
            document.getElementById('purpose').value = char.purpose || '';
            document.getElementById('obstacle').value = char.obstacle || '';
            
            // Goals
            this.renderGoals();
            
            // Notes
            document.getElementById('notes').value = char.notes || '';
            
            // Paths and Talents
            this.renderPathsAndTalents();
            
            // Surges
            this.renderSurges();
            
            // Expertises
            this.renderExpertises();
            
            // Equipment
            this.migrateEquipmentData();
            this.renderEquippedSummary();
            this.renderInventory();
            
            // Starting Kit
            this.renderStartingKitOptions();
            const startingKitSelect = document.getElementById('startingKit');
            const startingKitDetails = document.getElementById('startingKitDetails');
            if (char.startingKit) {
                startingKitSelect.value = char.startingKit;
                this.showStartingKitDetails(char.startingKit);
            } else {
                startingKitSelect.value = '';
                if (startingKitDetails) {
                    startingKitDetails.style.display = 'none';
                    startingKitDetails.innerHTML = '';
                }
            }
            
            // Currency (display only — do not call updateCurrency/updateCharacter mid-render)
            this.renderCurrency();
            
            // Injuries & Conditions
            this.renderInjuries();
            this.renderConditions();
            
            // Connections
            this.renderConnections();
            
            // Character Details
            document.getElementById('characterAge').value = char.characterDetails?.age || '';
            document.getElementById('characterGender').value = char.characterDetails?.gender || '';
            document.getElementById('characterHeight').value = char.characterDetails?.height || '';
            document.getElementById('characterWeight').value = char.characterDetails?.weight || '';
            document.getElementById('characterAppearance').value = char.characterDetails?.appearance || '';
            document.getElementById('characterBackstory').value = char.characterDetails?.backstory || '';
            // Languages
            this.renderLanguages();

            // Portrait
            this.renderPortrait();
            
            // Path Levels Display (exclude ancestry paths — they're tier-less)
            const pathLevelsDisplay = document.getElementById('pathLevelsDisplay');
            if (char.paths && char.paths.length > 0) {
                const pathLevels = char.paths
                    .filter(p => p.type !== 'ancestry' && p.level > 0)
                    .map(p => {
                        const pathData = this.getPathData(p);
                        return `${pathData.name}: Level ${p.level}`;
                    })
                    .join(' | ');
                pathLevelsDisplay.textContent = pathLevels || 'No path levels yet';
            } else {
                pathLevelsDisplay.textContent = 'No paths selected';
            }
            
            // Recalculate all derived values                
            this.recalculateAll();
            this.updateCombatPlayDisplay();
        },

        renderSkills: function(category) {
            const container = document.getElementById(`${category}Skills`);
            const skills = this.rules.skills.list.filter(s => s.category === category);
            const maxRank = this.getMaxSkillRankAtCurrentLevel(this.getTotalLevel());

            container.innerHTML = skills.map(skill => {
                const rank = this.currentCharacter.skills[skill.id];
                const attr = this.currentCharacter.attributes[skill.attribute];
                if (rank === undefined) throw new Error(`Skill ${skill.id} is undefined`);
                if (attr === undefined) throw new Error(`Attribute ${skill.attribute} is undefined`);
                const modifier = attr + rank;

                return `
                    <div class="skill-row">
                        <div>
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-attr">(${skill.attribute.toUpperCase().substring(0,3)})</div>
                        </div>
                        <input type="number" class="skill-rank"
                               data-skill-id="${skill.id}"
                               value="${rank}"
                               min="0"
                               max="${maxRank}"
                               oninput="app.updateSkill('${skill.id}', this.value)"
                               title="${skill.description} (max rank ${maxRank} at your current tier)">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <div class="skill-modifier" title="Modifier = ${skill.attribute.toUpperCase().substring(0,3)} (${attr}) + Rank (${rank})">+${modifier}</div>
                            <button class="inline-dice-btn"
                                    onclick="diceRoller.rollInline('1d20+${modifier}', '${skill.name} Test')"
                                    title="Roll ${skill.name} test (1d20+${modifier})">🎲</button>
                        </div>
                    </div>
                `;
            }).join('');
        },

        updateSkill: function(skillId, value) {
            const newValue = parseInt(value);
            if (Number.isNaN(newValue) || newValue < 0) {
                document.querySelector(`input.skill-rank[data-skill-id="${skillId}"]`).value = this.currentCharacter.skills[skillId] || 0;
                return;
            }
            const totalLevel = this.getTotalLevel();
            const maxRank = this.getMaxSkillRankAtCurrentLevel(totalLevel);
            if (newValue > maxRank) {
                this.dialog.alert(`Maximum rank in any skill at your current tier is ${maxRank}.`, { title: 'Skill Rank Limit', variant: 'warning' });
                document.querySelector(`input.skill-rank[data-skill-id="${skillId}"]`).value = this.currentCharacter.skills[skillId] || 0;
                return;
            }
            const previous = this.currentCharacter.skills[skillId] || 0;
            const others = Object.entries(this.currentCharacter.skills)
                .filter(([id]) => id !== skillId)
                .reduce((sum, [, v]) => sum + v, 0);
            const surgeRanks = this.currentCharacter.surgeRanks
                ? Object.values(this.currentCharacter.surgeRanks).reduce((sum, v) => sum + v, 0)
                : 0;
            const budget = this.computeSkillRankBudget(totalLevel);
            // Only block net increases that bust the budget. Decreases always allowed.
            if (newValue > previous && others + newValue + surgeRanks > budget) {
                this.dialog.alert(`Not enough skill ranks. Budget: ${budget}. You'd be using ${others + newValue + surgeRanks}.`, { title: 'Skill Rank Budget', variant: 'warning' });
                document.querySelector(`input.skill-rank[data-skill-id="${skillId}"]`).value = previous;
                return;
            }
            this.currentCharacter.skills[skillId] = newValue;
            this.recalculateAll();
            this.updateCharacter();
        },

        updateAttributeValue: function(attrName, value) {
            const newValue = parseInt(value);
            if (Number.isNaN(newValue)) {
                throw new Error(`updateAttributeValue: invalid value '${value}' for ${attrName}`);
            }
            const totalLevel = this.getTotalLevel();
            const minValue = this.rules.attributes.minValue;
            const maxValue = this.getMaxAttributeAtCurrentLevel(totalLevel);
            if (newValue < minValue || newValue > maxValue) {
                const reason = totalLevel <= 0
                    ? `At character creation, no attribute can exceed ${maxValue}.`
                    : `Attribute scores must be between ${minValue} and ${maxValue}.`;
                this.dialog.alert(reason, { title: 'Attribute Limit', variant: 'warning' });
                document.getElementById(attrName).value = this.currentCharacter.attributes[attrName];
                return;
            }
            const previous = this.currentCharacter.attributes[attrName];
            const others = Object.entries(this.currentCharacter.attributes)
                .filter(([k]) => k !== attrName)
                .reduce((sum, [, v]) => sum + v, 0);
            const budget = this.computeAttributeBudget(totalLevel);
            // Only block if this is a net increase that exceeds budget. Decreases always allowed
            // (so loaded over-budget characters can be fixed).
            if (newValue > previous && others + newValue > budget) {
                this.dialog.alert(`Not enough attribute points. Budget: ${budget}. You'd be using ${others + newValue}.`, { title: 'Attribute Point Budget', variant: 'warning' });
                document.getElementById(attrName).value = previous;
                return;
            }
            this.currentCharacter.attributes[attrName] = newValue;
            this.recalculateAll();
            this.updateCharacter();
        },

        updateCharacter: function() {
            const char = this.currentCharacter;

            char.name = document.getElementById('characterName').value;
            char.playerName = document.getElementById('playerName').value;

            const newAncestry = document.getElementById('ancestry').value;
            const oldAncestry = char.ancestry;
            char.ancestry = newAncestry;

            const newCultureId = document.getElementById('culture').value;
            const oldCulture = char.culture;
            char.culture = newCultureId;

            if (oldCulture !== newCultureId || oldAncestry !== newAncestry) {
                if (oldAncestry !== newAncestry) {
                    // syncAncestryPath adds/removes the synthetic ancestry path entry and
                    // auto-grants/refunds its key talent. It also calls cascadeCleanup on
                    // removal so dependents (e.g. Forms of Finesse if Singer is dropped)
                    // are cleared in the same step.
                    this.syncAncestryPath();
                }
                this.cascadeCleanup({ oldCulture, oldAncestry });
                this.renderExpertises();
                this.renderPathsAndTalents();
                this.renderSurges();
                this.recalculateAll();
            }

            char.attributes.strength = parseInt(document.getElementById('strength').value) || 0;
            char.attributes.speed = parseInt(document.getElementById('speed').value) || 0;
            char.attributes.intellect = parseInt(document.getElementById('intellect').value) || 0;
            char.attributes.willpower = parseInt(document.getElementById('willpower').value) || 0;
            char.attributes.awareness = parseInt(document.getElementById('awareness').value) || 0;
            char.attributes.presence = parseInt(document.getElementById('presence').value) || 0;
            
            char.currentHealth = parseInt(document.getElementById('currentHealth').value) || 0;
            char.currentFocus = parseInt(document.getElementById('currentFocus').value) || 0;
            char.currentInvestiture = parseInt(document.getElementById('currentInvestiture').value) || 0;
            char.deflect = parseInt(document.getElementById('deflect').value) || 0;
            
            char.purpose = document.getElementById('purpose').value;
            char.obstacle = document.getElementById('obstacle').value;
            char.notes = document.getElementById('notes').value;
            
            // Character details
            if (!char.characterDetails) char.characterDetails = {};
            char.characterDetails.age = document.getElementById('characterAge').value;
            char.characterDetails.gender = document.getElementById('characterGender').value;
            char.characterDetails.height = document.getElementById('characterHeight').value;
            char.characterDetails.weight = document.getElementById('characterWeight').value;
            char.characterDetails.appearance = document.getElementById('characterAppearance').value;
            char.characterDetails.backstory = document.getElementById('characterBackstory').value;
            // languages saved via toggleLanguage/addCustomLanguage
            
            char.updatedAt = new Date().toISOString();
            
            this.renderCharacterList();
            this.saveToLocalStorage();
        },



        // Builds a lookup of all talents in the rules (heroic, radiant, surge, ancestry).
        // Each entry: { id: fullId, talentId: shortId, name, talent, pathId, pathType, isKey, location: 'heroic'|'radiant'|'surge'|'ancestry' }.,

        escapeHtml: function(s) {
            if (s == null) return '';
            return String(s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    };
})();
