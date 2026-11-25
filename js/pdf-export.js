/**
 * PDF Export (Official Blank Sheet Filler & Simplified PDF Generator)
 * Maps character state into blank_sheet.pdf AcroForm fields or generates a clean
 * 2-page PDF via optional PDFLib (pdf-lib.min.js) and blank-sheet-pdf.js.
 */
(function () {
    Object.assign(window.app, {
        pdfSkillRows: [
            { id: 'agility', field: 'Agility', ranks: ['Rank Box 7', 'Rank Box 10', 'Rank Box 6', 'Rank Box 9', 'Rank Box 8'] },
            { id: 'athletics', field: 'Athletics', ranks: ['Rank Box 12', 'Rank Box 15', 'Rank Box 11', 'Rank Box 14', 'Rank Box 13'] },
            { id: 'heavy_weaponry', field: 'Heavy Weapons', ranks: ['Rank Box 17', 'Rank Box 20', 'Rank Box 16', 'Rank Box 19', 'Rank Box 18'] },
            { id: 'light_weaponry', field: 'Light Weapons', ranks: ['Rank Box 22', 'Rank Box 25', 'Rank Box 21', 'Rank Box 24', 'Rank Box 23'] },
            { id: 'stealth', field: 'Stealth', ranks: ['Rank Box 27', 'Rank Box 30', 'Rank Box 26', 'Rank Box 29', 'Rank Box 28'] },
            { id: 'thievery', field: 'Thievery', ranks: ['Rank Box 32', 'Rank Box 35', 'Rank Box 31', 'Rank Box 34', 'Rank Box 33'] },
            { id: 'crafting', field: 'Crafting', ranks: ['Rank Box 42', 'Rank Box 45', 'Rank Box 41', 'Rank Box 44', 'Rank Box 43'] },
            { id: 'deduction', field: 'Deduction', ranks: ['Rank Box 47', 'Rank Box 50', 'Rank Box 46', 'Rank Box 49', 'Rank Box 48'] },
            { id: 'discipline', field: 'Discipline', ranks: ['Rank Box 52', 'Rank Box 55', 'Rank Box 51', 'Rank Box 54', 'Rank Box 53'] },
            { id: 'intimidation', field: 'Intimidation', ranks: ['Rank Box 57', 'Rank Box 60', 'Rank Box 56', 'Rank Box 59', 'Rank Box 58'] },
            { id: 'lore', field: 'Lore', ranks: ['Rank Box 62', 'Rank Box 65', 'Rank Box 61', 'Rank Box 64', 'Rank Box 63'] },
            { id: 'medicine', field: 'Medicine', ranks: ['Rank Box 67', 'Rank Box 70', 'Rank Box 66', 'Rank Box 69', 'Rank Box 68'] },
            { id: 'deception', field: 'Deception', ranks: ['Rank Box 77', 'Rank Box 80', 'Rank Box 76', 'Rank Box 79', 'Rank Box 78'] },
            { id: 'insight', field: 'Insight', ranks: ['Rank Box 82', 'Rank Box 85', 'Rank Box 81', 'Rank Box 84', 'Rank Box 83'] },
            { id: 'leadership', field: 'Leadership', ranks: ['Rank Box 87', 'Rank Box 90', 'Rank Box 86', 'Rank Box 89', 'Rank Box 88'] },
            { id: 'perception', field: 'Perception', ranks: ['Rank Box 92', 'Rank Box 95', 'Rank Box 91', 'Rank Box 94', 'Rank Box 93'] },
            { id: 'persuasion', field: 'Persuasion', ranks: ['Rank Box 97', 'Rank Box 100', 'Rank Box 96', 'Rank Box 99', 'Rank Box 98'] },
            { id: 'survival', field: 'Survival', ranks: ['Rank Box 102', 'Rank Box 105', 'Rank Box 101', 'Rank Box 104', 'Rank Box 103'] }
        ],

        pdfCustomSlots: [
            { category: 'physical', name: 'Custom Skill 1', abbr: 'Custom Score 1', mod: 'Physical Custom', ranks: ['Rank Box 37', 'Rank Box 40', 'Rank Box 36', 'Rank Box 39', 'Rank Box 38'] },
            { category: 'cognitive', name: 'Custom Skill 2', abbr: 'Custom Score 2', mod: 'Cognitive Custom', ranks: ['Rank Box 72', 'Rank Box 75', 'Rank Box 71', 'Rank Box 74', 'Rank Box 73'] },
            { category: 'spiritual', name: 'Custom Skill 3', abbr: 'Custom Score 3', mod: 'Spiritual Custom', ranks: ['Rank Box 107', 'Rank Box 110', 'Rank Box 106', 'Rank Box 109', 'Rank Box 108'] }
        ],

        pdfGoalBoxes: [
            ['Goal Box 2', 'Goal Box 3', 'GoalBox4'],
            ['Goal Box 4', 'Goal Box 5', 'GoalBox5'],
            ['Goal Box 6', 'Goal Box 7', 'GoalBox6'],
            ['Goal Box 8', 'Goal Box 9', 'GoalBox7'],
            ['Goal Box 10', 'Goal Box 11', 'GoalBox8'],
            ['Goal Box 12', 'Goal Box 13', 'GoalBox9'],
            ['Goal Box 14', 'Goal Box 15', 'GoalBox10'],
            ['Goal Box 16', 'Goal Box 17', 'GoalBox11'],
            ['Goal Box 18', 'Goal Box 19', 'GoalBox12']
        ],

        pdfAttrAbbr: {
            strength: 'STR',
            speed: 'SPD',
            intellect: 'INT',
            willpower: 'WIL',
            awareness: 'AWA',
            presence: 'PRE'
        },

        pdfSafe: function(value) {
            return String(value ?? '')
                .replace(/\u00A0/g, ' ')
                .replace(/[\u2018\u2019\u2032]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/[\u2013\u2014]/g, '-')
                .replace(/\u2026/g, '...')
                .replace(/\u2022/g, '*')
                .replace(/[^\n\r\t\x20-\x7E]/g, '');
        },

        pdfWrapLines: function(text, font, size, maxWidth) {
            const safe = this.pdfSafe(text).replace(/\s+/g, ' ').trim();
            if (!safe) return [];
            const lines = [];
            let current = '';
            const pushWord = (word) => {
                const trial = current ? current + ' ' + word : word;
                if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
                    current = trial;
                    return;
                }
                if (current) lines.push(current);
                if (font.widthOfTextAtSize(word, size) <= maxWidth) {
                    current = word;
                    return;
                }
                let chunk = '';
                for (const ch of word) {
                    const next = chunk + ch;
                    if (font.widthOfTextAtSize(next, size) <= maxWidth) chunk = next;
                    else {
                        if (chunk) lines.push(chunk);
                        chunk = ch;
                    }
                }
                current = chunk;
            };
            safe.split(' ').forEach(pushWord);
            if (current) lines.push(current);
            return lines;
        },

        pdfFitLine: function(text, font, size, maxWidth) {
            const safe = this.pdfSafe(text);
            if (font.widthOfTextAtSize(safe, size) <= maxWidth) return safe;
            let cut = safe;
            while (cut.length > 1 && font.widthOfTextAtSize(cut + '...', size) > maxWidth) {
                cut = cut.slice(0, -1);
            }
            return cut + '...';
        },

        pdfRecoveryDie: function(totalLevel) {
            let recoveryDie = '1d6';
            const progression = this.rules.resources.recoveryDie.progression;
            for (const [level, die] of Object.entries(progression).reverse()) {
                if (totalLevel >= parseInt(level, 10)) {
                    recoveryDie = die;
                    break;
                }
            }
            return recoveryDie;
        },

        pdfSplitLines: function(lines, fieldNames, maxLines) {
            const text = {};
            let cursor = 0;
            fieldNames.forEach((name, index) => {
                const last = index === fieldNames.length - 1;
                const slice = last ? lines.slice(cursor) : lines.slice(cursor, cursor + maxLines);
                cursor += slice.length;
                text[name] = slice.join('\n');
            });
            return text;
        },

        pdfPathLines: function() {
            const char = this.currentCharacter;
            const lines = [];
            (char.paths || []).forEach(path => {
                if (path.type === 'ancestry' || !(path.level > 0)) return;
                const pathData = path.type === 'heroic'
                    ? this.rules.heroicPaths.find(hp => hp.id === path.id)
                    : this.rules.radiantOrders.find(ro => ro.id === path.id);
                lines.push(`${pathData ? pathData.name : path.id} ${path.level}`);
            });
            return lines;
        },

        pdfTalentLines: function() {
            const char = this.currentCharacter;
            const index = this.buildTalentIndex();
            const ids = [...(char.talents || []), ...(char.surgeTalents || [])];
            return ids.map(id => {
                const entry = index.byId.get(id);
                if (!entry) return id;
                const desc = entry.talent && entry.talent.description ? entry.talent.description : '';
                const short = desc.length > 160 ? desc.slice(0, 157).trim() + '...' : desc;
                return short ? `${entry.name}: ${short}` : entry.name;
            });
        },

        pdfExpertiseLines: function() {
            const seen = new Set();
            const lines = [];
            (this.currentCharacter.expertises || []).forEach(exp => {
                const name = typeof exp === 'string' ? exp : exp.name;
                if (!name) return;
                const key = name.toLowerCase();
                if (seen.has(key)) return;
                seen.add(key);
                lines.push(name);
            });
            return lines;
        },

        pdfWeaponLines: function() {
            const equipped = this.getEquippedWeaponDisplayData();
            const equippedIds = new Set(equipped.map(w => w.id));
            const lines = equipped.map(w => {
                const traits = (w.traits || []).join(', ');
                const expert = w.hasExpertise ? ' (expert)' : '';
                return `${w.name}${expert}: ${w.damage} ${w.damageType}, ${w.range}, ${w.skillName} +${w.attackBonus}${traits ? ' [' + traits + ']' : ''}`;
            });
            (this.currentCharacter.inventory || []).forEach(item => {
                if (item.type !== 'weapon' || !item.weaponData) return;
                if (equippedIds.has(item.weaponData.id)) return;
                const w = item.weaponData;
                const skill = this.rules.skills.list.find(s => s.id === w.skill);
                const bonus = skill
                    ? (this.currentCharacter.attributes[skill.attribute] || 0) + (this.currentCharacter.skills[w.skill] || 0)
                    : 0;
                const qty = (item.quantity || 1) > 1 ? ` x${item.quantity}` : '';
                lines.push(`${w.name}${qty}: ${w.damage || ''} ${w.damageType || ''}, ${w.range || ''}, +${bonus}`.replace(/\s+/g, ' ').trim());
            });
            return lines;
        },

        pdfEquipmentLines: function() {
            const char = this.currentCharacter;
            const lines = [];
            const armor = this.getEquippedArmorDisplayData();
            if (armor) {
                const traits = (armor.traits || []).join(', ');
                lines.push(`Armor: ${armor.name} (deflect ${armor.deflect}${traits ? ', ' + traits : ''})`);
            }
            (char.inventory || []).forEach(item => {
                if (item.type === 'weapon') return;
                if (item.type === 'armor' && item.equipped) return;
                const qty = (item.quantity || 1) > 1 ? ` x${item.quantity}` : '';
                const extra = item.description ? ` - ${item.description}` : '';
                lines.push(`${item.name}${qty}${item.equipped ? ' (equipped)' : ''}${extra}`);
            });
            return lines;
        },

        pdfConditionLines: function() {
            const char = this.currentCharacter;
            const lines = [];
            (char.conditions || []).forEach(condition => {
                lines.push(condition.name || String(condition));
            });
            const injuries = char.injuries || {};
            (injuries.temporary || []).forEach(injury => lines.push(`Temporary injury: ${injury.description}`));
            (injuries.permanent || []).forEach(injury => lines.push(`Permanent injury: ${injury.description}`));
            return lines;
        },

        pdfConnectionLines: function() {
            return (this.currentCharacter.connections || []).map(conn => {
                const name = conn.name || 'Unnamed';
                const rel = conn.relationship ? ` (${conn.relationship})` : '';
                const desc = conn.description ? `: ${conn.description}` : '';
                return `${name}${rel}${desc}`;
            });
        },

        pdfAppearanceText: function() {
            const details = this.currentCharacter.characterDetails || {};
            const bits = [];
            if (details.age) bits.push(`Age ${details.age}`);
            if (details.gender) bits.push(details.gender);
            if (details.height) bits.push(details.height);
            if (details.weight) bits.push(`${details.weight}`);
            const lines = [];
            if (bits.length) lines.push(bits.join(', '));
            if (details.appearance) lines.push(details.appearance);
            if (details.backstory) lines.push(details.backstory);
            return lines.join('\n\n');
        },

        pdfCustomSkills: function() {
            const char = this.currentCharacter;
            const slots = { physical: null, cognitive: null, spiritual: null };
            const overflow = [];
            const seen = new Set();
            const categoryOf = {
                strength: 'physical',
                speed: 'physical',
                intellect: 'cognitive',
                willpower: 'cognitive',
                awareness: 'spiritual',
                presence: 'spiritual'
            };
            const place = (entry) => {
                if (seen.has(entry.key)) return;
                seen.add(entry.key);
                if (!slots[entry.category]) slots[entry.category] = entry;
                else overflow.push(entry);
            };
            (char.paths || []).forEach(path => {
                if (path.type !== 'radiant' || !(path.level > 0)) return;
                const order = this.rules.radiantOrders.find(o => o.id === path.id);
                if (!order) return;
                (order.surges || []).forEach(surgeId => {
                    const surge = this.rules.surges[surgeId];
                    if (!surge) return;
                    const rank = (char.surgeRanks && char.surgeRanks[surgeId]) || 0;
                    const attr = surge.attribute;
                    place({
                        key: surgeId,
                        name: surge.name,
                        abbr: this.pdfAttrAbbr[attr] || '',
                        category: categoryOf[attr] || 'spiritual',
                        modifier: (char.attributes[attr] || 0) + rank,
                        rank
                    });
                });
            });
            overflow.forEach(entry => {
                const open = ['physical', 'cognitive', 'spiritual'].find(cat => !slots[cat]);
                if (open) slots[open] = entry;
            });
            return slots;
        },

        pdfDeflectValue: function() {
            const char = this.currentCharacter;
            if (typeof char.deflect === 'number' && char.deflect > 0) return char.deflect;
            const armor = this.getEquippedArmorDisplayData();
            if (armor && typeof armor.deflect === 'number') return armor.deflect;
            return char.deflect || 0;
        },

        buildBlankSheetValues: function() {
            const char = this.currentCharacter;
            const totalLevel = this.getTotalLevel();
            const hasRadiant = (char.paths || []).some(p => p.type === 'radiant' && p.level > 0);
            const maxHealth = this.computeMaxHealth(totalLevel, char.attributes.strength);
            const maxFocus = this.computeMaxFocus(char.attributes.willpower);
            const movement = this.computeMovementRate(char.attributes.speed);
            const senses = this.computeSensesRange(char.attributes.awareness);
            const sensesText = senses < 0 ? 'Unaffected' : `${senses} ft`;
            const lifting = this.rules.lifting.baseCapacity + (char.attributes.strength * 50);
            const culture = this.getCultureData(char.culture);

            const text = {
                'Character Name.Page 1': char.name || '',
                'Player Name.Page 1': char.playerName || '',
                'Level.Page 1': String(totalLevel),
                'Ancestry.Page 1': [char.ancestry || '', culture ? culture.name : ''].filter(Boolean).join('\n'),
                'Paths.Page 1': this.pdfPathLines().join('\n'),
                'Strength.Page 1': String(char.attributes.strength),
                'Speed.Page 1': String(char.attributes.speed),
                'Intellect.Page 1': String(char.attributes.intellect),
                'Willpower.Page 1': String(char.attributes.willpower),
                'Awareness.Page 1': String(char.attributes.awareness),
                'Presence.Page 1': String(char.attributes.presence),
                'Physical Defense.Page 1': String(10 + char.attributes.strength + char.attributes.speed),
                'Cognitive Defense.Page 1': String(10 + char.attributes.intellect + char.attributes.willpower),
                'Spiritual Defense.Page 1': String(10 + char.attributes.awareness + char.attributes.presence),
                'Health Maximum': String(maxHealth),
                'Health Current': String(char.currentHealth ?? maxHealth),
                'Focus Maximum': String(maxFocus),
                'Focus Current': String(char.currentFocus ?? maxFocus),
                'Investiture Maximum 4': hasRadiant ? String(this.computeMaxInvestiture(totalLevel)) : '',
                'Investiture Current 4': hasRadiant ? String(char.currentInvestiture ?? 0) : '',
                'Deflect': String(this.pdfDeflectValue()),
                'Movement': `${movement} ft`,
                'Lifting Capacity': `${lifting} lbs`,
                'Senses Range': sensesText,
                'Recovery Die': this.pdfRecoveryDie(totalLevel),
                'Purpose': char.purpose || '',
                'Obstacle': char.obstacle || '',
                'Notes': char.notes || '',
                'Character Appearance': this.pdfAppearanceText(),
                'Spheres': this.pdfSphereText(),
                'Connections': this.pdfConnectionLines().join('\n')
            };

            this.pdfSkillRows.forEach(row => {
                const rank = char.skills[row.id] || 0;
                const skill = this.rules.skills.list.find(s => s.id === row.id);
                const attr = skill ? (char.attributes[skill.attribute] || 0) : 0;
                text[row.field] = `+${attr + rank}`;
            });

            const checks = {};
            this.pdfSkillRows.forEach(row => {
                const rank = Math.min(char.skills[row.id] || 0, row.ranks.length);
                row.ranks.forEach((box, index) => { checks[box] = index < rank; });
            });

            const custom = this.pdfCustomSkills();
            this.pdfCustomSlots.forEach(slot => {
                const entry = custom[slot.category];
                text[slot.name] = entry ? entry.name : '';
                text[slot.abbr] = entry ? entry.abbr : '';
                text[slot.mod] = entry ? `+${entry.modifier}` : '';
                const rank = entry ? Math.min(entry.rank, slot.ranks.length) : 0;
                slot.ranks.forEach((box, index) => { checks[box] = index < rank; });
            });

            Object.assign(text, this.pdfSplitLines(this.pdfExpertiseLines(), ['Expertises 1', 'Expertises 2'], 6));
            Object.assign(text, this.pdfSplitLines(this.pdfTalentLines(), ['Talents 1', 'Talents 2', 'Talents 3'], 14));
            text['Weapons'] = this.pdfWeaponLines().join('\n');
            text['Armor & Equipment'] = this.pdfEquipmentLines().join('\n');
            text['Conditions'] = this.pdfConditionLines().join('\n');

            const goals = char.goals || [];
            for (let i = 0; i < 9; i++) {
                const goal = goals[i];
                text[`Goal ${i + 1}`] = goal && goal.text ? goal.text : '';
                const boxes = this.pdfGoalBoxes[i];
                boxes.forEach((box, milestone) => {
                    checks[box] = !!(goal && goal.milestones && goal.milestones[milestone]);
                });
            }

            const centered = [
                'Level.Page 1', 'Ancestry.Page 1', 'Paths.Page 1',
                'Strength.Page 1', 'Speed.Page 1', 'Intellect.Page 1', 'Willpower.Page 1', 'Awareness.Page 1', 'Presence.Page 1',
                'Physical Defense.Page 1', 'Cognitive Defense.Page 1', 'Spiritual Defense.Page 1',
                'Health Maximum', 'Health Current', 'Focus Maximum', 'Focus Current',
                'Investiture Maximum 4', 'Investiture Current 4', 'Deflect',
                'Movement', 'Lifting Capacity', 'Senses Range', 'Recovery Die',
                'Custom Score 1', 'Custom Score 2', 'Custom Score 3',
                'Physical Custom', 'Cognitive Custom', 'Spiritual Custom'
            ];
            this.pdfSkillRows.forEach(row => centered.push(row.field));

            return { text, checks, centered };
        },

        pdfSphereText: function() {
            const currency = this.currentCharacter.currency || {};
            const parts = [];
            if (currency.chips) parts.push(`${currency.chips} chips`);
            if (currency.marks) parts.push(`${currency.marks} marks`);
            if (currency.broams) parts.push(`${currency.broams} broams`);
            return parts.join(', ');
        },

        blankSheetBytesFromEmbedded: function() {
            const b64 = window.BLANK_SHEET_PDF_BASE64;
            if (!b64) return null;
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return bytes.buffer;
        },

        loadBlankSheetBytes: async function() {
            const embedded = this.blankSheetBytesFromEmbedded();
            if (embedded) return embedded;
            try {
                const res = await fetch('blank_sheet.pdf');
                if (!res.ok) throw new Error(`blank_sheet.pdf returned ${res.status}`);
                return await res.arrayBuffer();
            } catch (err) {
                console.warn('Could not fetch blank_sheet.pdf, asking for a file.', err);
                await this.dialog.alert('The blank sheet is not embedded and could not be read from this folder. Choose blank_sheet.pdf to fill.', { title: 'Select Blank Sheet PDF', okText: 'Choose File' });
                return await this.pickBlankSheetBytes();
            }
        },

        pickBlankSheetBytes: function() {
            return new Promise((resolve, reject) => {
                const input = document.getElementById('blankSheetInput');
                if (!input) {
                    reject(new Error('Missing blank sheet file picker'));
                    return;
                }
                const finish = (err, result) => {
                    input.removeEventListener('change', onchange);
                    window.removeEventListener('focus', onFocus);
                    input.value = '';
                    if (err) reject(err);
                    else resolve(result);
                };
                const onchange = () => {
                    const file = input.files && input.files[0];
                    if (!file) {
                        finish(Object.assign(new Error('No PDF selected'), { name: 'AbortError' }));
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => finish(null, reader.result);
                    reader.onerror = () => finish(reader.error || new Error('Could not read the PDF'));
                    reader.readAsArrayBuffer(file);
                };
                const onFocus = () => {
                    setTimeout(() => {
                        if (!input.files || input.files.length === 0) {
                            finish(Object.assign(new Error('PDF selection cancelled'), { name: 'AbortError' }));
                        }
                    }, 400);
                };
                input.addEventListener('change', onchange);
                window.addEventListener('focus', onFocus);
                input.click();
            });
        },

        fillBlankSheet: async function(bytes) {
            if (typeof PDFLib === 'undefined') {
                throw new Error('PDF library failed to load');
            }
            const { PDFDocument, StandardFonts, TextAlignment } = PDFLib;
            const pdfDoc = await PDFDocument.load(bytes);
            const form = pdfDoc.getForm();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const { text, checks, centered } = this.buildBlankSheetValues();
            const center = new Set(centered);
            const failures = [];

            Object.entries(text).forEach(([name, value]) => {
                try {
                    const field = form.getTextField(name);
                    if (field.isRichFormatted()) field.disableRichFormatting();
                    if (center.has(name)) field.setAlignment(TextAlignment.Center);
                    field.setText(this.pdfSafe(value));
                    field.updateAppearances(font);
                } catch (err) {
                    console.error(`PDF field ${name}`, err);
                    failures.push(name);
                }
            });

            Object.entries(checks).forEach(([name, on]) => {
                if (!on) return;
                try {
                    form.getCheckBox(name).check();
                } catch (err) {
                    console.error(`PDF checkbox ${name}`, err);
                    failures.push(name);
                }
            });

            if (failures.length) {
                console.warn('Some PDF fields could not be filled:', failures);
            }
            const saved = await pdfDoc.save({ updateFieldAppearances: false });
            return { bytes: saved, failures };
        },

        simplifiedSheetModel: function() {
            const char = this.currentCharacter;
            const totalLevel = this.getTotalLevel();
            const culture = this.getCultureData(char.culture);
            const hasRadiant = (char.paths || []).some(p => p.type === 'radiant' && p.level > 0);
            const maxHealth = this.computeMaxHealth(totalLevel, char.attributes.strength);
            const maxFocus = this.computeMaxFocus(char.attributes.willpower);
            const senses = this.computeSensesRange(char.attributes.awareness);
            const sensesText = senses < 0 ? 'Unaffected' : `${senses} ft`;
            const skills = [];
            this.pdfSkillRows.forEach(row => {
                const rank = char.skills[row.id] || 0;
                if (rank <= 0) return;
                const skill = this.rules.skills.list.find(s => s.id === row.id);
                const attr = skill ? (char.attributes[skill.attribute] || 0) : 0;
                skills.push({
                    name: skill ? skill.name : row.field,
                    category: skill ? skill.category : 'physical',
                    rank,
                    modifier: attr + rank
                });
            });
            const surgeCategory = {
                strength: 'physical',
                speed: 'physical',
                intellect: 'cognitive',
                willpower: 'cognitive',
                awareness: 'spiritual',
                presence: 'spiritual'
            };
            const seenSurges = new Set();
            (char.paths || []).forEach(path => {
                if (path.type !== 'radiant' || !(path.level > 0)) return;
                const order = this.rules.radiantOrders.find(o => o.id === path.id);
                if (!order) return;
                (order.surges || []).forEach(surgeId => {
                    if (seenSurges.has(surgeId)) return;
                    seenSurges.add(surgeId);
                    const surge = this.rules.surges[surgeId];
                    if (!surge) return;
                    const rank = (char.surgeRanks && char.surgeRanks[surgeId]) || 0;
                    skills.push({
                        name: surge.name,
                        category: surgeCategory[surge.attribute] || 'spiritual',
                        rank,
                        modifier: (char.attributes[surge.attribute] || 0) + rank
                    });
                });
            });
            const index = this.buildTalentIndex();
            const talentIds = [...(char.talents || []), ...(char.surgeTalents || [])];
            const talents = [];
            const seenTalents = new Set();
            talentIds.forEach(id => {
                const entry = index.byId.get(id);
                const name = entry ? entry.name : id;
                const key = name.toLowerCase();
                if (seenTalents.has(key)) return;
                seenTalents.add(key);
                talents.push(name);
            });
            const armor = this.getEquippedArmorDisplayData();
            const weapons = this.getEquippedWeaponDisplayData().map(w => {
                const traits = (w.traits || [])
                    .slice(0, 3)
                    .map(trait => typeof trait === 'string' ? trait : trait.name)
                    .filter(Boolean)
                    .join(', ');
                return `${w.name}: ${w.damage} ${w.damageType}, ${w.range}, +${w.attackBonus}${traits ? ' (' + traits + ')' : ''}`;
            });
            return {
                name: char.name || 'Unnamed',
                player: char.playerName || '',
                level: totalLevel,
                ancestry: [char.ancestry || '', culture ? culture.name : ''].filter(Boolean).join(', ') || 'No ancestry',
                paths: this.pdfPathLines().join(' | ') || 'No paths',
                defenses: [
                    { label: 'PHYSICAL', value: 10 + char.attributes.strength + char.attributes.speed, tone: 'physical' },
                    { label: 'COGNITIVE', value: 10 + char.attributes.intellect + char.attributes.willpower, tone: 'cognitive' },
                    { label: 'SPIRITUAL', value: 10 + char.attributes.awareness + char.attributes.presence, tone: 'spiritual' }
                ],
                attributes: [
                    ['STR', char.attributes.strength],
                    ['SPD', char.attributes.speed],
                    ['INT', char.attributes.intellect],
                    ['WIL', char.attributes.willpower],
                    ['AWA', char.attributes.awareness],
                    ['PRE', char.attributes.presence]
                ],
                resources: [
                    ['HEALTH', `${char.currentHealth ?? maxHealth} / ${maxHealth}`],
                    ['FOCUS', `${char.currentFocus ?? maxFocus} / ${maxFocus}`],
                    ['INVESTITURE', hasRadiant ? `${char.currentInvestiture ?? 0} / ${this.computeMaxInvestiture(totalLevel)}` : '-'],
                    ['DEFLECT', String(this.pdfDeflectValue())],
                    ['MOVEMENT', `${this.computeMovementRate(char.attributes.speed)} ft`],
                    ['SENSES', sensesText],
                    ['LIFTING', `${this.rules.lifting.baseCapacity + (char.attributes.strength * 50)} lbs`],
                    ['RECOVERY', this.pdfRecoveryDie(totalLevel)]
                ],
                skills,
                weapons,
                armor: armor ? `${armor.name} | deflect ${armor.deflect}` : '',
                talents,
                expertises: this.pdfExpertiseLines(),
                conditions: this.pdfConditionLines()
            };
        },

        buildSimplifiedSheet: async function() {
            const { PDFDocument, StandardFonts, rgb } = PDFLib;
            const doc = await PDFDocument.create();
            const font = await doc.embedFont(StandardFonts.Helvetica);
            const bold = await doc.embedFont(StandardFonts.HelveticaBold);
            const model = this.simplifiedSheetModel();
            const self = this;
            const W = 612;
            const H = 792;
            const M = 28;
            const contentW = W - M * 2;
            const ink = rgb(0.13, 0.15, 0.18);
            const muted = rgb(0.38, 0.40, 0.45);
            const hair = rgb(0.76, 0.72, 0.64);
            const paper = rgb(0.98, 0.965, 0.945);
            const white = rgb(1, 1, 1);
            const navy = rgb(0.16, 0.32, 0.55);
            const gold = rgb(0.62, 0.47, 0.14);
            const tones = {
                physical: rgb(0.66, 0.22, 0.22),
                cognitive: rgb(0.22, 0.38, 0.64),
                spiritual: rgb(0.30, 0.48, 0.24)
            };
            let page;
            let top;

            const newPage = (continued) => {
                page = doc.addPage([W, H]);
                page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: paper });
                page.drawText('Cosmere RPG  ·  simplified sheet', {
                    x: M, y: 16, size: 8, font, color: muted
                });
                if (continued) {
                    page.drawRectangle({ x: 0, y: H - 34, width: W, height: 34, color: navy });
                    page.drawText(self.pdfFitLine(`${model.name}  ·  continued`, bold, 11, contentW), {
                        x: M, y: H - 22, size: 11, font: bold, color: white
                    });
                    top = 48;
                    return;
                }
                page.drawRectangle({ x: 0, y: H - 86, width: W, height: 86, color: navy });
                page.drawRectangle({ x: 0, y: H - 90, width: W, height: 4, color: gold });
                let nameSize = 20;
                const safeName = self.pdfSafe(model.name);
                while (nameSize > 13 && bold.widthOfTextAtSize(safeName, nameSize) > contentW) nameSize -= 1;
                page.drawText(safeName, { x: M, y: H - 32, size: nameSize, font: bold, color: white });
                const meta = [
                    `Level ${model.level}`,
                    model.ancestry,
                    model.paths,
                    model.player ? `Player ${model.player}` : ''
                ].filter(Boolean).join('  |  ');
                const metaLines = self.pdfWrapLines(meta, font, 9, contentW).slice(0, 2);
                metaLines.forEach((line, i) => {
                    page.drawText(line, { x: M, y: H - 52 - (i * 12), size: 9, font, color: rgb(0.90, 0.92, 0.95) });
                });
                top = 106;
            };

            const ensure = (height) => {
                if (top + height > H - 36) newPage(true);
            };

            const sectionTitle = (label) => {
                ensure(22);
                page.drawRectangle({ x: M, y: H - top - 13, width: 4, height: 13, color: gold });
                page.drawText(label, { x: M + 10, y: H - top - 11, size: 11, font: bold, color: navy });
                top += 20;
            };

            const card = (x, yTop, w, h) => {
                page.drawRectangle({
                    x, y: H - yTop - h, width: w, height: h,
                    color: white, borderColor: hair, borderWidth: 0.8
                });
            };

            const drawWrappedBlock = (lines, size, leading, color, usedFont) => {
                lines.forEach(line => {
                    ensure(leading);
                    page.drawText(line, { x: M, y: H - top - size, size, font: usedFont || font, color: color || ink });
                    top += leading;
                });
            };

            newPage(false);

            const gap = 8;
            const defW = (contentW - gap * 2) / 3;
            ensure(56);
            model.defenses.forEach((defense, i) => {
                const x = M + i * (defW + gap);
                card(x, top, defW, 52);
                page.drawRectangle({ x, y: H - top - 52, width: 4, height: 52, color: tones[defense.tone] });
                page.drawText(defense.label + ' DEFENSE', {
                    x: x + 12, y: H - top - 16, size: 7.5, font: bold, color: muted
                });
                const value = String(defense.value);
                const vw = bold.widthOfTextAtSize(value, 20);
                page.drawText(value, {
                    x: x + (defW - vw) / 2, y: H - top - 40, size: 20, font: bold, color: ink
                });
            });
            top += 62;

            const attrW = (contentW - gap * 5) / 6;
            ensure(44);
            model.attributes.forEach(([abbr, value], i) => {
                const x = M + i * (attrW + gap);
                card(x, top, attrW, 40);
                const abbrW = bold.widthOfTextAtSize(abbr, 8);
                page.drawText(abbr, { x: x + (attrW - abbrW) / 2, y: H - top - 14, size: 8, font: bold, color: muted });
                const valueText = String(value);
                const vw = bold.widthOfTextAtSize(valueText, 16);
                page.drawText(valueText, { x: x + (attrW - vw) / 2, y: H - top - 32, size: 16, font: bold, color: ink });
            });
            top += 50;

            const resW = (contentW - gap * 3) / 4;
            for (let row = 0; row < 2; row++) {
                ensure(34);
                model.resources.slice(row * 4, row * 4 + 4).forEach(([label, value], i) => {
                    const x = M + i * (resW + gap);
                    card(x, top, resW, 32);
                    page.drawText(label, { x: x + 8, y: H - top - 12, size: 7, font: bold, color: muted });
                    page.drawText(self.pdfFitLine(String(value), bold, 11, resW - 16), {
                        x: x + 8, y: H - top - 26, size: 11, font: bold, color: ink
                    });
                });
                top += 38;
            }
            top += 6;

            sectionTitle('SKILLS');
            const groups = { physical: [], cognitive: [], spiritual: [] };
            model.skills.forEach(skill => {
                if (groups[skill.category]) groups[skill.category].push(skill);
            });
            const skillRows = Math.max(1, ...Object.values(groups).map(list => list.length));
            const skillHead = 18;
            const skillRowH = 16;
            const skillBoxH = skillHead + skillRows * skillRowH + 6;
            ensure(skillBoxH);
            const skillTop = top;
            ['physical', 'cognitive', 'spiritual'].forEach((category, i) => {
                const x = M + i * (defW + gap);
                card(x, skillTop, defW, skillBoxH);
                page.drawRectangle({ x, y: H - skillTop - skillHead, width: defW, height: skillHead, color: tones[category] });
                const title = category.toUpperCase();
                const titleW = bold.widthOfTextAtSize(title, 8);
                page.drawText(title, {
                    x: x + (defW - titleW) / 2, y: H - skillTop - 13, size: 8, font: bold, color: white
                });
                const list = groups[category];
                if (list.length === 0) {
                    page.drawText('No ranks', {
                        x: x + 10, y: H - skillTop - skillHead - 16, size: 9, font, color: muted
                    });
                    return;
                }
                list.forEach((skill, rowIndex) => {
                    const y = H - skillTop - skillHead - 14 - rowIndex * skillRowH;
                    const mod = `+${skill.modifier}`;
                    const rank = `(${skill.rank})`;
                    const modW = bold.widthOfTextAtSize(mod, 10);
                    const rankW = font.widthOfTextAtSize(rank, 8);
                    page.drawText(self.pdfFitLine(skill.name, font, 9, defW - modW - rankW - 28), {
                        x: x + 8, y, size: 9, font, color: ink
                    });
                    page.drawText(mod, { x: x + defW - modW - rankW - 16, y, size: 10, font: bold, color: ink });
                    page.drawText(rank, { x: x + defW - rankW - 8, y, size: 8, font, color: muted });
                });
            });
            top = skillTop + skillBoxH + 14;

            sectionTitle('WEAPONS');
            if (model.armor) {
                drawWrappedBlock(self.pdfWrapLines(`Armor  ·  ${model.armor}`, font, 9, contentW), 9, 13, ink, font);
            }
            if (model.weapons.length === 0) {
                drawWrappedBlock(['No weapons equipped'], 9, 13, muted, font);
            } else {
                model.weapons.forEach(line => {
                    drawWrappedBlock(self.pdfWrapLines(line, font, 9, contentW), 9, 13, ink, font);
                });
            }
            top += 6;

            sectionTitle('TALENTS');
            if (model.talents.length === 0) {
                drawWrappedBlock(['No talents'], 9, 13, muted, font);
            } else {
                model.talents.forEach(name => {
                    drawWrappedBlock(self.pdfWrapLines(name, font, 9, contentW), 9, 13, ink, font);
                });
            }
            top += 6;

            sectionTitle('EXPERTISES');
            const expertiseText = model.expertises.length ? model.expertises.join(', ') : 'None';
            drawWrappedBlock(self.pdfWrapLines(expertiseText, font, 9, contentW), 9, 13, model.expertises.length ? ink : muted, font);

            if (model.conditions.length) {
                top += 6;
                sectionTitle('CONDITIONS');
                model.conditions.forEach(line => {
                    drawWrappedBlock(self.pdfWrapLines(line, font, 9, contentW), 9, 13, ink, font);
                });
            }

            const bytes = await doc.save();
            return { bytes, failures: [] };
        },

        exportToPdf: async function() {
            if (!this.currentCharacter) {
                await this.dialog.alert('Open a character before exporting a PDF.', { title: 'PDF Export', variant: 'warning' });
                return;
            }
            if (typeof PDFLib === 'undefined') {
                await this.dialog.alert('The PDF library did not load. Reload the page and try again.', { title: 'PDF Export Error', variant: 'error' });
                return;
            }
            try {
                this.updateCharacter();
                this.recalculateAll();
                const mode = (document.getElementById('pdfExportMode') || {}).value || 'full';
                const safeName = (this.currentCharacter.name || 'character').replace(/[^a-z0-9]+/gi, '_') || 'character';
                const level = this.getTotalLevel();
                if (mode === 'simplified') {
                    const filled = await this.buildSimplifiedSheet();
                    this.downloadBytes(filled.bytes, `${safeName}_Lv${level}_simple.pdf`, 'application/pdf');
                    return;
                }
                const template = await this.loadBlankSheetBytes();
                const filled = await this.fillBlankSheet(template);
                this.downloadBytes(filled.bytes, `${safeName}_Lv${level}.pdf`, 'application/pdf');
                if (filled.failures.length) {
                    await this.dialog.alert(`PDF exported, but ${filled.failures.length} field(s) could not be filled. Check the console for names.`, { title: 'PDF Export Warning', variant: 'warning' });
                }
            } catch (err) {
                if (err && err.name === 'AbortError') return;
                console.error('PDF export failed', err);
                await this.dialog.alert('Could not export the PDF: ' + (err && err.message ? err.message : err), { title: 'PDF Export Error', variant: 'error' });
            }
        }
    });
})();
