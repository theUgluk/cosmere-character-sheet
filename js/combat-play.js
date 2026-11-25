/**
 * Tab Navigation & Tablet-Optimized Combat/Play Mode
 * Persisted tab switching (identity, stats, combat, paths, story) and
 * quick-reference Combat & Play dashboard rendering.
 */
(function () {
    Object.assign(window.app, {
        toggleSection: function(sectionId) {
            /* intentionally empty: tab-pane sections are flat-stacked */
        },

        // Tabs replaced collapsible folds. activeTab is persisted to localStorage.,

        switchTab: function(tabId) {
            const validTabs = ['identity', 'stats', 'combat', 'paths', 'story'];
            if (!validTabs.includes(tabId)) {
                throw new Error(`switchTab: unknown tab '${tabId}'`);
            }
            this.activeTab = tabId;
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
            });
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.id === `tab-${tabId}`);
            });
            try {
                localStorage.setItem('cosmereActiveTab', tabId);
            } catch (e) {
                console.warn('Could not persist active tab', e);
            }
        },

        initTabFromStorage: function() {
            let tabId = 'identity';
            try {
                const saved = localStorage.getItem('cosmereActiveTab');
                if (saved) tabId = saved;
            } catch (e) {
                /* ignore */
            }
            this.switchTab(tabId);
        },

        toggleCombatPlay: function() {
            const header = document.querySelector('.combat-play-header');
            const content = document.getElementById('combatPlayContent');
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        },

        // Toggle collapsible sections within Combat & Play
        // (Previously a buggy duplicate toggleSection lived here for "Combat & Play" sub-folds
        // that referenced non-existent *Indicator elements. Removed in favor of the universal
        // no-op toggleSection above; sub-folds inside Combat tab now use collapsible-toggle
        // helpers exclusively.)

        // Update Combat & Play display values,

        updateCombatPlayDisplay: function() {
            if (!this.currentCharacter) return;
            
            const char = this.currentCharacter;
            
            // Update portrait in play header
            const playPortrait = document.getElementById('playPortrait');
            if (playPortrait) {
                if (char.portrait) {
                    playPortrait.src = char.portrait;
                    playPortrait.style.display = 'block';
                } else {
                    playPortrait.style.display = 'none';
                    playPortrait.removeAttribute('src');
                }
            }

            // Update attributes
            document.getElementById('playStrength').textContent = char.attributes.strength;
            document.getElementById('playSpeed').textContent = char.attributes.speed;
            document.getElementById('playIntellect').textContent = char.attributes.intellect;
            document.getElementById('playWillpower').textContent = char.attributes.willpower;
            document.getElementById('playAwareness').textContent = char.attributes.awareness;
            document.getElementById('playPresence').textContent = char.attributes.presence;
            
            // Update defenses
            document.getElementById('playPhysicalDefense').textContent = char.physicalDefense;
            document.getElementById('playCognitiveDefense').textContent = char.cognitiveDefense;
            document.getElementById('playSpiritualDefense').textContent = char.spiritualDefense;
            
            // Update combat stats
            const initiativeElem = document.getElementById('initiative');
            const meleeElem = document.getElementById('meleeAttack');
            const rangedElem = document.getElementById('rangedAttack');
            
            document.getElementById('playInitiative').textContent = initiativeElem ? initiativeElem.textContent : '+0';
            document.getElementById('playMeleeAttack').textContent = meleeElem ? meleeElem.textContent : '+0';
            document.getElementById('playRangedAttack').textContent = rangedElem ? rangedElem.textContent : '+0';
            
            // Update resources
            document.getElementById('playMaxHealth').textContent = char.maxHealth;
            document.getElementById('playMaxFocus').textContent = char.maxFocus;
            document.getElementById('playMaxInvestiture').textContent = char.maxInvestiture;
            document.getElementById('playDeflect').textContent = char.deflect;
            document.getElementById('playRecoveryDie').textContent = char.recoveryDie;
            document.getElementById('playMovement').textContent = char.movement;
            
            // Sync current values
            document.getElementById('playCurrentHealth').value = char.currentHealth;
            document.getElementById('playCurrentFocus').value = char.currentFocus;
            document.getElementById('playCurrentInvestiture').value = char.currentInvestiture;
            
            // Update skills list
            this.renderPlaySkills();
            
            // Update weapons list
            this.renderPlayWeapons();
        },

        // Render skills for Combat & Play section,

        renderPlaySkills: function() {
            const container = document.getElementById('playSkillsList');
            if (!container || !this.currentCharacter) return;
            
            const allSkills = this.rules.skills.list || [];
            const physicalSkills = allSkills.filter(s => s.category === 'physical');
            const cognitiveSkills = allSkills.filter(s => s.category === 'cognitive');
            const spiritualSkills = allSkills.filter(s => s.category === 'spiritual');
            
            container.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                    ${this.renderPlaySkillCategory('Physical', physicalSkills)}
                    ${this.renderPlaySkillCategory('Cognitive', cognitiveSkills)}
                    ${this.renderPlaySkillCategory('Spiritual', spiritualSkills)}
                </div>
            `;
        },

        renderPlaySkillCategory: function(category, skills) {
            return `
                <div class="play-card">
                    <div class="play-card-header">${category}</div>
                    ${skills.map(skill => {
                        const rank = this.currentCharacter.skills[skill.id];
                        const attr = this.currentCharacter.attributes[skill.attribute];
                        if (rank === undefined) throw new Error(`Skill ${skill.id} is undefined`);
                        if (attr === undefined) throw new Error(`Attribute ${skill.attribute} is undefined`);
                        const modifier = attr + rank;
                        return `
                            <div class="play-stat-row">
                                <span class="play-stat-label">${skill.name}</span>
                                <span class="play-stat-value">
                                    <span>+${modifier}</span>
                                    <button class="play-dice-btn" 
                                            onclick="diceRoller.rollInline('1d20+${modifier}', '${skill.name} Test')"
                                            title="Roll ${skill.name} test">🎲</button>
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },

        renderPlayWeapons: function() {
            const container = document.getElementById('playWeaponsList');
            if (!container || !this.currentCharacter) return;

            const weapons = this.getEquippedWeaponDisplayData();
            if (weapons.length === 0) {
                container.innerHTML = '<div class="help-text">No weapons equipped.</div>';
                return;
            }

            container.innerHTML = weapons.map(w => `
                <div class="play-stat-row" style="flex-wrap: wrap;">
                    <span class="play-stat-label" style="flex: 1; min-width: 150px;">
                        <strong>${w.name}</strong><br>
                        <span style="font-size: 0.85em; color: #999;">${w.damage} ${w.damageType} | ${w.range}</span>
                    </span>
                    <span class="play-stat-value">
                        <span>+${w.attackBonus}</span>
                        <button class="play-dice-btn"
                                onclick="diceRoller.rollWeaponAttack(\`${w.name}\`, ${w.attackBonus}, \`${w.damage}\`)"
                                title="Roll attack">🎲</button>
                    </span>
                </div>
            `).join('');
        }
    });
})();
