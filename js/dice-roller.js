/**
 * Dice Roller System & Keyboard Shortcuts
 * Exposes window.diceRoller for inline rolls, toast notifications, modal roller,
 * Advantage/Disadvantage/Plot Die toggles, roll history, and D/Escape shortcuts.
 */
(function () {
    // Dice Roller System
    const diceRoller = window.diceRoller = {
        history: [],
        hasAdvantage: false,
        hasDisadvantage: false,
        hasPlotDie: false,

        toggleAdvantage: function() {
            this.hasAdvantage = !this.hasAdvantage;
            if (this.hasAdvantage) this.hasDisadvantage = false; // Mutex with disadvantage
            this.updateToggleUI();
        },

        toggleDisadvantage: function() {
            this.hasDisadvantage = !this.hasDisadvantage;
            if (this.hasDisadvantage) this.hasAdvantage = false; // Mutex with advantage
            this.updateToggleUI();
        },

        togglePlotDie: function() {
            this.hasPlotDie = !this.hasPlotDie;
            this.updateToggleUI();
        },

        updateToggleUI: function() {
            document.getElementById('advantageToggle').classList.toggle('active', this.hasAdvantage);
            document.getElementById('disadvantageToggle').classList.toggle('active', this.hasDisadvantage);
            document.getElementById('plotDieToggle').classList.toggle('active', this.hasPlotDie);
        },

        resetToggles: function() {
            this.hasAdvantage = false;
            this.hasDisadvantage = false;
            this.hasPlotDie = false;
            this.updateToggleUI();
        },

        open: function() {
            document.getElementById('diceRollerModal').classList.add('active');
            this.updateSkillQuickRolls();
        },

        close: function() {
            document.getElementById('diceRollerModal').classList.remove('active');
        },

        roll: function(diceNotation, label = '') {
            const result = this.parseDiceRoll(diceNotation);
            this.displayResult(result, label);
            this.addToHistory(result, label);
            return result;
        },

        rollCustom: function() {
            const input = document.getElementById('customDiceInput').value.trim();
            if (!input) return;
            this.roll(input, 'Custom Roll');
        },

        rollWithPlotDie: function() {
            const plotDieRoll = Math.floor(Math.random() * 6) + 1;
            let plotResult = '';
            let plotBonus = 0;

            // Plot die mechanics (6-sided)
            // 1-2: Complication with bonus, 3-4: Blank, 5-6: Opportunity
            if (plotDieRoll >= 5) {
                plotResult = `⭐ Opportunity! (${plotDieRoll})`;
            } else if (plotDieRoll <= 2) {
                plotBonus = plotDieRoll * 2;
                plotResult = `⚠️ Complication! (+${plotBonus} bonus) (${plotDieRoll})`;
            } else {
                plotResult = `Blank (${plotDieRoll}) - No effect`;
            }

            // Roll d20
            const d20Roll = Math.floor(Math.random() * 20) + 1;
            const finalRoll = d20Roll + plotBonus;
            
            let breakdown = `Plot Die: ${plotResult}<br>`;
            if (plotBonus > 0) {
                breakdown += `d20: ${d20Roll} + ${plotBonus} (Complication bonus) = ${finalRoll}`;
            } else {
                breakdown += `d20: ${d20Roll}`;
            }

            const result = {
                total: finalRoll,
                breakdown: breakdown,
                dice: [d20Roll],
                modifier: plotBonus,
                diceRolls: [d20Roll]
            };

            this.displayResult(result, 'Plot Die Roll');
            this.addToHistory(result, 'Plot Die Roll');

            // Show plot die result
            document.getElementById('plotDieResult').innerHTML = `
                <div class="plot-die-result">
                    <span class="plot-die-icon">🎲</span>
                    <div>${plotResult}</div>
                </div>
            `;
        },

        parseDiceRoll: function(notation) {
            notation = notation.toLowerCase().replace(/\s/g, '');
            
            // Parse notation like "2d6+5" or "1d20-2"
            const match = notation.match(/(\d+)?d(\d+)([\+\-]\d+)?/);
            
            if (!match) {
                // Try just a modifier
                if (/^[\+\-]?\d+$/.test(notation)) {
                    return {
                        total: parseInt(notation),
                        breakdown: `Flat modifier: ${notation}`,
                        dice: [],
                        modifier: parseInt(notation),
                        diceRolls: []
                    };
                }
                return null;
            }

            const numDice = parseInt(match[1]) || 1;
            const dieSize = parseInt(match[2]);
            const modifier = match[3] ? parseInt(match[3]) : 0;

            const rolls = [];
            for (let i = 0; i < numDice; i++) {
                rolls.push(Math.floor(Math.random() * dieSize) + 1);
            }

            const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0);
            const total = diceTotal + modifier;

            const breakdown = `${numDice}d${dieSize}${modifier >= 0 ? '+' : ''}${modifier !== 0 ? modifier : ''}<br>` +
                            `Rolls: [${rolls.join(', ')}] = ${diceTotal}` +
                            (modifier !== 0 ? `<br>Modifier: ${modifier >= 0 ? '+' : ''}${modifier}` : '');

            return {
                total: total,
                breakdown: breakdown,
                dice: rolls,
                modifier: modifier,
                diceRolls: rolls
            };
        },

        displayResult: function(result, label) {
            if (!result) {
                document.getElementById('rollResult').innerHTML = `
                    <div class="roll-result">
                        <div>Invalid dice notation</div>
                    </div>
                `;
                document.getElementById('rollResult').style.display = 'block';
                return;
            }

            const resultHTML = `
                <div class="roll-result">
                    ${label ? `<div style="font-size: 1.2em; margin-bottom: 10px;">${label}</div>` : ''}
                    <div class="roll-result-total">${result.total}</div>
                    <div class="roll-result-breakdown">${result.breakdown}</div>
                </div>
            `;

            document.getElementById('rollResult').innerHTML = resultHTML;
            document.getElementById('rollResult').style.display = 'block';
        },

        addToHistory: function(result, label) {
            const timestamp = new Date().toLocaleTimeString();
            this.history.unshift({
                result: result,
                label: label,
                timestamp: timestamp
            });

            // Keep only last 20 rolls
            if (this.history.length > 20) {
                this.history = this.history.slice(0, 20);
            }

            this.updateHistoryDisplay();
        },

        updateHistoryDisplay: function() {
            const container = document.getElementById('rollHistory');
            
            if (this.history.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">No rolls yet</p>';
                return;
            }

            container.innerHTML = this.history.map(entry => {
                let resultDisplay;
                if (entry.result.damageTotal !== undefined) {
                    // Weapon attack with damage
                    resultDisplay = `<strong>${entry.result.total}</strong> <span style="font-size: 0.8em; color: #999;">ATK</span> / <strong>${entry.result.damageTotal}</strong> <span style="font-size: 0.8em; color: #999;">DMG</span>`;
                } else {
                    resultDisplay = `<strong>${entry.result.total}</strong>`;
                }
                
                return `
                    <div class="roll-history-item">
                        ${resultDisplay} - ${entry.label || 'Roll'}
                        <span style="float: right; color: #999; font-size: 0.85em;">${entry.timestamp}</span>
                        <div style="font-size: 0.85em; color: #666; margin-top: 3px;">${entry.result.breakdown.replace(/<br>/g, ', ').replace(/<\/?strong>/g, '')}</div>
                    </div>
                `;
            }).join('');
        },

        clearHistory: function() {
            this.history = [];
            this.updateHistoryDisplay();
        },

        updateSkillQuickRolls: function() {
            if (!app.currentCharacter) return;

            const char = app.currentCharacter;
            const skills = app.rules.skills.list;

            // Get skills with ranks > 0 or significant modifiers
            const relevantSkills = skills.filter(skill => {
                const rank = char.skills[skill.id] || 0;
                const attr = char.attributes[skill.attribute] || 0;
                return rank > 0 || attr > 0;
            }).slice(0, 12); // Show top 12

            if (relevantSkills.length === 0) return;

            const html = `
                <h3>Quick Skill Rolls</h3>
                <div class="skill-quick-roll">
                    ${relevantSkills.map(skill => {
                        const rank = char.skills[skill.id] || 0;
                        const attr = char.attributes[skill.attribute] || 0;
                        const modifier = attr + rank;
                        
                        return `
                            <button class="skill-roll-btn" onclick="diceRoller.rollSkill('${skill.id}', '${skill.name}', ${modifier})">
                                <div class="skill-roll-name">${skill.name}</div>
                                <div class="skill-roll-modifier">+${modifier}</div>
                            </button>
                        `;
                    }).join('')}
                </div>
            `;

            document.getElementById('skillQuickRolls').innerHTML = html;
        },

        rollSkill: function(skillId, skillName, modifier) {
            const d20Roll = Math.floor(Math.random() * 20) + 1;
            const total = d20Roll + modifier;

            const result = {
                total: total,
                breakdown: `1d20 + ${modifier}<br>Roll: ${d20Roll} + Modifier: ${modifier}`,
                dice: [d20Roll],
                modifier: modifier,
                diceRolls: [d20Roll]
            };

            this.displayResult(result, `${skillName} Test`);
            this.addToHistory(result, `${skillName} Test`);
        },

        // Inline rolling - shows toast instead of modal
        rollInline: function(notation, label, showToast = true) {
            let finalResult;
            let plotDieInfo = '';
            let plotBonus = 0;

            // Roll plot die if enabled
            if (this.hasPlotDie) {
                const plotRoll = Math.floor(Math.random() * 6) + 1;
                if (plotRoll >= 5) {
                    // 5-6: Opportunity
                    plotDieInfo = '📖 Plot Die: ⭐ Opportunity! • ';
                } else if (plotRoll <= 2) {
                    // 1-2: Complication with bonus
                    plotBonus = plotRoll * 2; // +2 for roll of 1, +4 for roll of 2
                    plotDieInfo = `📖 Plot Die: ⚠️ Complication! (+${plotBonus} bonus) • `;
                } else {
                    // 3-4: Blank (no effect)
                    plotDieInfo = '📖 Plot Die: Blank (no effect) • ';
                }
            }

            // Check if this is a d20 roll that can have advantage/disadvantage
            const isD20Roll = notation.toLowerCase().includes('d20');
            
            if (isD20Roll && (this.hasAdvantage || this.hasDisadvantage)) {
                // Roll with advantage/disadvantage
                const baseResult = this.parseDiceRoll(notation);
                const secondResult = this.parseDiceRoll(notation);
                
                if (this.hasAdvantage) {
                    finalResult = baseResult.total >= secondResult.total ? baseResult : secondResult;
                    finalResult.breakdown = `⬆️ Advantage: [${baseResult.total}, ${secondResult.total}] → Keep ${finalResult.total}`;
                } else {
                    finalResult = baseResult.total <= secondResult.total ? baseResult : secondResult;
                    finalResult.breakdown = `⬇️ Disadvantage: [${baseResult.total}, ${secondResult.total}] → Keep ${finalResult.total}`;
                }
                
                // Apply plot die bonus
                if (plotBonus > 0) {
                    finalResult.total += plotBonus;
                    finalResult.breakdown = plotDieInfo + finalResult.breakdown + ` + ${plotBonus}`;
                } else if (plotDieInfo) {
                    finalResult.breakdown = plotDieInfo + finalResult.breakdown;
                }
            } else {
                finalResult = this.parseDiceRoll(notation);
                if (!finalResult) return;
                
                // Apply plot die bonus
                if (plotBonus > 0) {
                    finalResult.total += plotBonus;
                }
                
                if (plotDieInfo) {
                    finalResult.breakdown = plotDieInfo + finalResult.breakdown;
                }
            }

            this.addToHistory(finalResult, label);

            if (showToast) {
                this.showToast(finalResult, label);
            } else {
                this.displayResult(finalResult, label);
            }

            // Reset toggles after integrated roll
            this.resetToggles();

            return finalResult;
        },

        showToast: function(result, label) {
            const toast = document.getElementById('rollToast');
            const title = document.getElementById('toastTitle');
            const resultElem = document.getElementById('toastResult');
            const breakdown = document.getElementById('toastBreakdown');

            title.textContent = label || 'Roll';
            
            // If this is a weapon attack with hit/graze/crit damage, show all values prominently
            if (result.hitDamage !== undefined && result.grazeDamage !== undefined && result.critDamage !== undefined) {
                resultElem.innerHTML = `
                    <div style="font-size: 2em; font-weight: bold;">${result.total}</div>
                    <div style="font-size: 0.8em; color: #999; margin-top: 5px;">
                        Hit: ${result.hitDamage} dmg | Graze: ${result.grazeDamage} dmg | Crit ⭐: ${result.critDamage} dmg
                    </div>
                `;
            } else if (result.damageTotal !== undefined) {
                resultElem.innerHTML = `${result.total} <span style="font-size: 0.7em; color: #999;">ATK</span> / ${result.damageTotal} <span style="font-size: 0.7em; color: #999;">DMG</span>`;
            } else {
                resultElem.textContent = result.total;
            }
            
            breakdown.innerHTML = result.breakdown.replace(/<br>/g, ' • ');

            // Show toast (stays visible until manually dismissed)
            toast.classList.remove('hiding');
            toast.classList.add('show');
        },

        hideToast: function() {
            const toast = document.getElementById('rollToast');
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.classList.remove('show', 'hiding');
            }, 300);
        },

        rollAttribute: function(attrName, attrValue) {
            const label = attrName.charAt(0).toUpperCase() + attrName.slice(1) + ' Test';
            this.rollInline(`1d20+${attrValue}`, label);
        },

        rollDefense: function(defenseName, defenseValue) {
            const label = defenseName + ' Check';
            // For defense checks, just roll d20 (defense is the DC for opponents)
            this.rollInline('1d20', label);
        },

        rollRecovery: function(dieType) {
            this.rollInline(dieType, 'Recovery Roll');
        },

        rollWeaponAttack: function(weaponName, attackBonus, damage) {
            let plotDieInfo = '';
            let effectiveAdvantage = this.hasAdvantage;
            let effectiveDisadvantage = this.hasDisadvantage;

            // Roll plot die if enabled
            let plotBonus = 0;
            if (this.hasPlotDie) {
                const plotRoll = Math.floor(Math.random() * 6) + 1;
                if (plotRoll >= 5) {
                    // 5-6: Opportunity
                    plotDieInfo = '📖 Plot Die: ⭐ Opportunity!<br>';
                } else if (plotRoll <= 2) {
                    // 1-2: Complication with bonus
                    plotBonus = plotRoll * 2; // +2 for roll of 1, +4 for roll of 2
                    plotDieInfo = `📖 Plot Die: ⚠️ Complication! (+${plotBonus} bonus)<br>`;
                } else {
                    // 3-4: Blank (no effect)
                    plotDieInfo = '📖 Plot Die: Blank (no effect)<br>';
                }
            }

            // Roll attack (1d20 + bonus) with advantage/disadvantage
            let d20Roll, attackTotal, attackInfo;
            if (this.hasAdvantage || this.hasDisadvantage) {
                const roll1 = Math.floor(Math.random() * 20) + 1;
                const roll2 = Math.floor(Math.random() * 20) + 1;
                
                if (this.hasAdvantage) {
                    d20Roll = Math.max(roll1, roll2);
                    attackInfo = `⬆️ Advantage: [${roll1}, ${roll2}] → ${d20Roll}`;
                } else {
                    d20Roll = Math.min(roll1, roll2);
                    attackInfo = `⬇️ Disadvantage: [${roll1}, ${roll2}] → ${d20Roll}`;
                }
                attackTotal = d20Roll + attackBonus + plotBonus;
                if (plotBonus > 0) {
                    attackInfo += ` + ${attackBonus} + ${plotBonus}`;
                } else {
                    attackInfo += ` + ${attackBonus}`;
                }
            } else {
                d20Roll = Math.floor(Math.random() * 20) + 1;
                attackTotal = d20Roll + attackBonus + plotBonus;
                if (plotBonus > 0) {
                    attackInfo = `1d20 (${d20Roll}) + ${attackBonus} + ${plotBonus}`;
                } else {
                    attackInfo = `1d20 (${d20Roll}) + ${attackBonus}`;
                }
            }
            
            // Roll damage
            const damageResult = this.parseDiceRoll(damage);
            
            const label = `${weaponName} Attack`;
            let breakdown = plotDieInfo + `<strong>Attack:</strong> ${attackInfo} = <strong>${attackTotal}</strong>`;
            
            if (damageResult) {
                const hitDamage = damageResult.total + attackBonus; // Hit = dice + skill modifier
                const grazeDamage = damageResult.total; // Graze = dice only
                
                // Calculate critical hit damage (maximize all dice)
                const damageNotation = damage.toLowerCase().replace(/\s/g, '');
                const damageMatch = damageNotation.match(/(\d+)?d(\d+)/);
                let critDamage = attackBonus; // Start with modifier
                if (damageMatch) {
                    const numDice = parseInt(damageMatch[1]) || 1;
                    const dieSize = parseInt(damageMatch[2]);
                    critDamage += numDice * dieSize; // All dice at maximum
                }
                
                breakdown += `<br><strong>Damage (if hit):</strong> ${damageResult.breakdown.replace(/<br>/g, ' ')} + ${attackBonus} = <strong>${hitDamage}</strong>`;
                breakdown += `<br><strong>Damage (if graze):</strong> ${damageResult.breakdown.replace(/<br>/g, ' ')} = <strong>${grazeDamage}</strong>`;
                breakdown += `<br><strong>Damage (if crit ⭐):</strong> Max dice + ${attackBonus} = <strong>${critDamage}</strong>`;
            } else {
                breakdown += `<br><strong>Damage:</strong> ${damage}`;
            }
            
            const result = {
                total: attackTotal,
                damageTotal: damageResult ? damageResult.total : 0,
                hitDamage: damageResult ? damageResult.total + attackBonus : 0,
                grazeDamage: damageResult ? damageResult.total : 0,
                critDamage: damageResult ? (() => {
                    const damageNotation = damage.toLowerCase().replace(/\s/g, '');
                    const damageMatch = damageNotation.match(/(\d+)?d(\d+)/);
                    if (damageMatch) {
                        const numDice = parseInt(damageMatch[1]) || 1;
                        const dieSize = parseInt(damageMatch[2]);
                        return numDice * dieSize + attackBonus;
                    }
                    return attackBonus;
                })() : 0,
                breakdown: breakdown,
                diceRolls: [d20Roll, ...(damageResult ? damageResult.diceRolls : [])]
            };
            
            this.showToast(result, label);
            this.addToHistory(result, label);

            // Reset toggles after weapon attack
            this.resetToggles();
        },

        rollAttack: function(type, bonusStr) {
            const bonus = parseInt(bonusStr.replace('+', '')) || 0;
            const label = `${type} Attack Roll`;
            this.rollInline(`1d20+${bonus}`, label);
        },

        rollInitiative: function(bonusStr) {
            const bonus = parseInt(bonusStr.replace('+', '')) || 0;
            this.rollInline(`1d20+${bonus}`, 'Initiative');
        }
    };

    // Keyboard shortcuts: Press 'D' to open dice roller, Escape to close open modals/lightbox
    document.addEventListener('keydown', (e) => {
        if (window.app && app.dialog && app.dialog.isOpen()) return;

        if (e.key === 'Escape') {
            if (window.app) {
                app.closePortraitLightbox();
                app.closeWeaponModal();
                app.closeArmorModal();
                app.closeItemModal();
                app.closeExpertiseModal();
                app.closeConditionModal();
            }
            diceRoller.close();
            return;
        }
        if (e.key === 'd' || e.key === 'D') {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            diceRoller.open();
        }
    });
})();
