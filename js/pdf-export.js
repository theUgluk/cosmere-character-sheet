/**
 * PDF Export (Official Blank Sheet Filler & Simplified PDF Generator)
 * Maps character state into blank_sheet.pdf AcroForm fields or generates a compact
 * simplified A4 PDF via optional PDFLib (pdf-lib.min.js) and blank-sheet-pdf.js.
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

        pdfTalentEntries: function() {
            const char = this.currentCharacter;
            const index = this.buildTalentIndex();
            const ids = [...(char.talents || []), ...(char.surgeTalents || [])];
            const seen = new Set();
            const entries = [];
            ids.forEach(id => {
                const entry = index.byId.get(id);
                const name = entry ? entry.name : String(id);
                const key = name.toLowerCase();
                if (seen.has(key)) return;
                seen.add(key);
                const description = entry && entry.talent && entry.talent.description
                    ? entry.talent.description.replace(/\s+/g, ' ').trim()
                    : '';
                entries.push({ name, description });
            });
            return entries;
        },

        pdfTalentLines: function() {
            return this.pdfTalentEntries().map(({ name, description }) => {
                const short = description.length > 160 ? description.slice(0, 157).trim() + '...' : description;
                return short ? `${name}: ${short}` : name;
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

        getSimplifiedPdfOptions: function() {
            const char = this.currentCharacter || {};
            const saved = char.pdfOptions && typeof char.pdfOptions === 'object' ? char.pdfOptions : {};
            return {
                pageSize: saved.pageSize === 'a5' ? 'a5' : 'a4',
                compactTalents: Array.isArray(saved.compactTalents)
                    ? saved.compactTalents.map(name => String(name).toLowerCase())
                    : []
            };
        },

        simplifiedSheetModel: function(options) {
            const char = this.currentCharacter;
            const opts = Object.assign({}, this.getSimplifiedPdfOptions(), options || {});
            const compactSet = new Set((opts.compactTalents || []).map(name => String(name).toLowerCase()));
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
            const armor = this.getEquippedArmorDisplayData();
            const weapons = this.getEquippedWeaponDisplayData().map(w => {
                const traits = (w.traits || [])
                    .slice(0, 3)
                    .map(trait => typeof trait === 'string' ? trait : trait.name)
                    .filter(Boolean)
                    .join(', ');
                return `${w.name}: ${w.damage} ${w.damageType}, ${w.range}, +${w.attackBonus}${traits ? ' (' + traits + ')' : ''}`;
            });
            const talents = this.pdfTalentEntries().map(entry => ({
                name: entry.name,
                description: entry.description,
                showDescription: !compactSet.has(entry.name.toLowerCase())
            }));
            return {
                pageSize: opts.pageSize === 'a5' ? 'a5' : 'a4',
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
                    ['STR', char.attributes.strength, 'physical'],
                    ['SPD', char.attributes.speed, 'physical'],
                    ['INT', char.attributes.intellect, 'cognitive'],
                    ['WIL', char.attributes.willpower, 'cognitive'],
                    ['AWA', char.attributes.awareness, 'spiritual'],
                    ['PRE', char.attributes.presence, 'spiritual']
                ],
                resources: [
                    ['HEALTH', `${char.currentHealth ?? maxHealth} / ${maxHealth}`],
                    ['FOCUS', `${char.currentFocus ?? maxFocus} / ${maxFocus}`],
                    ['INVESTITURE', hasRadiant ? `${char.currentInvestiture ?? 0} / ${this.computeMaxInvestiture(totalLevel)}` : '-'],
                    ['DEFLECT', String(this.pdfDeflectValue())],
                    ['MOVEMENT', `${this.computeMovementRate(char.attributes.speed)} ft`],
                    ['SENSES', sensesText],
                    ['LIFTING', `${this.rules.lifting.baseCapacity + (char.attributes.strength * 50)} lbs`],
                    ['RECOVERY', this.pdfRecoveryDie(totalLevel)],
                    ['TIER', String(this.getCurrentTier(totalLevel))]
                ],
                skills,
                weapons,
                armor: armor ? `${armor.name} | deflect ${armor.deflect}` : '',
                talents,
                expertises: this.pdfExpertiseLines(),
                conditions: this.pdfConditionLines()
            };
        },

        buildSimplifiedSheet: async function(options) {
            const { PDFDocument, StandardFonts, rgb } = PDFLib;
            const doc = await PDFDocument.create();
            const font = await doc.embedFont(StandardFonts.Helvetica);
            const bold = await doc.embedFont(StandardFonts.HelveticaBold);
            const model = this.simplifiedSheetModel(options);
            const self = this;
            const isA5 = model.pageSize === 'a5';
            // ISO A4 (210x297mm) or A5 (148x210mm) Portrait in PDF points
            const W = isA5 ? 420.94 : 595.28;
            const H = isA5 ? 595.28 : 841.89;
            const M = isA5 ? 16 : 20;
            const contentW = W - M * 2;
            const ink = rgb(0, 0, 0);
            const muted = rgb(0.28, 0.28, 0.28);
            const border = rgb(0.2, 0.2, 0.2);
            const hair = rgb(0.68, 0.68, 0.68);
            let page;
            let top;

            const newPage = (continued) => {
                page = doc.addPage([W, H]);
                page.drawText('Cosmere RPG  ·  simplified sheet', {
                    x: M, y: 14, size: 7.5, font, color: muted
                });
                if (continued) {
                    page.drawText(self.pdfFitLine(`${model.name}  ·  continued`, bold, 9.5, contentW), {
                        x: M, y: H - 22, size: 9.5, font: bold, color: ink
                    });
                    page.drawLine({
                        start: { x: M, y: H - 26 }, end: { x: M + contentW, y: H - 26 },
                        thickness: 0.8, color: ink
                    });
                    top = 33;
                    return;
                }
                const meta = [
                    `Level ${model.level}`,
                    model.ancestry,
                    model.paths
                ].filter(Boolean).join('  |  ');
                const safeName = self.pdfSafe(model.name);
                const safeMeta = self.pdfSafe(meta);
                let nameSize = 13;
                const metaSize = 7.8;
                let nameW = bold.widthOfTextAtSize(safeName, nameSize);
                const metaW = font.widthOfTextAtSize(safeMeta, metaSize);
                while (nameSize > 9.5 && nameW + 12 + metaW > contentW) {
                    nameSize -= 0.5;
                    nameW = bold.widthOfTextAtSize(safeName, nameSize);
                }
                const singleLine = nameW + 12 + metaW <= contentW;
                const metaLines = singleLine ? [safeMeta] : self.pdfWrapLines(safeMeta, font, 7.5, contentW).slice(0, 2);
                const ruleYTop = singleLine ? 24 : (metaLines.length > 1 ? 42 : 33);
                if (singleLine) {
                    page.drawText(safeName, { x: M, y: H - 20, size: nameSize, font: bold, color: ink });
                    page.drawText(safeMeta, {
                        x: W - M - metaW, y: H - 20, size: metaSize, font, color: muted
                    });
                } else {
                    const fittedName = self.pdfFitLine(safeName, bold, nameSize, contentW);
                    page.drawText(fittedName, { x: M, y: H - 19, size: nameSize, font: bold, color: ink });
                    metaLines.forEach((line, i) => {
                        page.drawText(line, { x: M, y: H - 29.5 - (i * 9), size: 7.5, font, color: muted });
                    });
                }
                page.drawLine({
                    start: { x: M, y: H - ruleYTop }, end: { x: M + contentW, y: H - ruleYTop },
                    thickness: 1.2, color: ink
                });
                top = ruleYTop + 6;
            };

            const ensure = (height) => {
                if (top + height > H - 28) newPage(true);
            };

            const sectionTitle = (label) => {
                ensure(14);
                page.drawText(label, { x: M, y: H - top - 7.5, size: 8.5, font: bold, color: ink });
                page.drawLine({
                    start: { x: M, y: H - top - 10 }, end: { x: M + contentW, y: H - top - 10 },
                    thickness: 0.6, color: border
                });
                top += 13;
            };

            const drawWrappedBlock = (lines, size, leading, color, usedFont) => {
                lines.forEach(line => {
                    ensure(leading);
                    page.drawText(line, { x: M, y: H - top - size, size, font: usedFont || font, color: color || ink });
                    top += leading;
                });
            };

            const drawLabelledLine = (line, size, leading, extraGap, boldIfNoSep) => {
                const safe = self.pdfSafe(line).replace(/\s+/g, ' ').trim();
                if (!safe) return;
                const sep = safe.indexOf(': ');
                if (sep <= 0) {
                    const f = boldIfNoSep ? bold : font;
                    drawWrappedBlock(self.pdfWrapLines(safe, f, size, contentW), size, leading, ink, f);
                    if (extraGap) top += extraGap;
                    return;
                }
                const prefix = safe.slice(0, sep + 2);
                const rest = safe.slice(sep + 2).trim();
                const prefixW = bold.widthOfTextAtSize(prefix, size);
                if (!rest || prefixW > contentW * 0.6) {
                    drawWrappedBlock(self.pdfWrapLines(safe, font, size, contentW), size, leading, ink, font);
                    if (extraGap) top += extraGap;
                    return;
                }
                const indent = 8;
                const firstMaxW = contentW - prefixW;
                const words = rest.split(' ');
                let firstRest = '';
                let idx = 0;
                while (idx < words.length) {
                    const trial = firstRest ? firstRest + ' ' + words[idx] : words[idx];
                    if (font.widthOfTextAtSize(trial, size) <= firstMaxW) {
                        firstRest = trial;
                        idx += 1;
                    } else {
                        break;
                    }
                }
                ensure(leading);
                page.drawText(prefix, { x: M, y: H - top - size, size, font: bold, color: ink });
                if (firstRest) {
                    page.drawText(firstRest, { x: M + prefixW, y: H - top - size, size, font, color: ink });
                }
                top += leading;
                if (idx < words.length) {
                    const remainingText = words.slice(idx).join(' ');
                    const wrapped = self.pdfWrapLines(remainingText, font, size, contentW - indent);
                    wrapped.forEach(wLine => {
                        ensure(leading);
                        page.drawText(wLine, { x: M + indent, y: H - top - size, size, font, color: ink });
                        top += leading;
                    });
                }
                if (extraGap) top += extraGap;
            };

            newPage(false);

            // Compact 3-row stats table: Defenses | Attr 1 | Attr 2 | Resource Pools | Derived | Combat
            const resMap = Object.fromEntries(model.resources);
            const statLabelSize = isA5 ? 5.7 : 6.3;
            const statPadX = isA5 ? 3.5 : 5;
            const statCols = isA5
                ? [
                    { w: 74, valW: 20, valSize: 8.2 },
                    { w: 39, valW: 17, valSize: 8.2 },
                    { w: 39, valW: 17, valSize: 8.2 },
                    { w: 85, valW: 39, valSize: 7.4 },
                    { w: 86, valW: 45, valSize: 7.4 },
                    { w: contentW - (74 + 39 + 39 + 85 + 86), valW: 26, valSize: 7.4 }
                ]
                : [
                    { w: 110, valW: 24, valSize: 9 },
                    { w: 54, valW: 22, valSize: 9 },
                    { w: 54, valW: 22, valSize: 9 },
                    { w: 116, valW: 54, valSize: 8.3 },
                    { w: 113, valW: 56, valSize: 8.3 },
                    { w: contentW - (110 + 54 + 54 + 116 + 113), valW: 48, valSize: 8.3 }
                ];
            const defSuffix = isA5 ? ' DEF' : ' DEFENSE';
            const statRows = [
                [
                    { label: 'PHYSICAL' + defSuffix, value: String(model.defenses[0].value) },
                    { label: model.attributes[0][0], value: String(model.attributes[0][1]) },
                    { label: model.attributes[1][0], value: String(model.attributes[1][1]) },
                    { label: 'HEALTH', value: resMap['HEALTH'] || '-' },
                    { label: 'MOVEMENT', value: resMap['MOVEMENT'] || '-' },
                    { label: 'DEFLECT', value: resMap['DEFLECT'] || '0' }
                ],
                [
                    { label: 'COGNITIVE' + defSuffix, value: String(model.defenses[1].value) },
                    { label: model.attributes[2][0], value: String(model.attributes[2][1]) },
                    { label: model.attributes[3][0], value: String(model.attributes[3][1]) },
                    { label: 'FOCUS', value: resMap['FOCUS'] || '-' },
                    { label: 'SENSES', value: resMap['SENSES'] || '-' },
                    { label: 'RECOVERY', value: resMap['RECOVERY'] || '-' }
                ],
                [
                    { label: 'SPIRITUAL' + defSuffix, value: String(model.defenses[2].value) },
                    { label: model.attributes[4][0], value: String(model.attributes[4][1]) },
                    { label: model.attributes[5][0], value: String(model.attributes[5][1]) },
                    { label: 'INVESTITURE', value: resMap['INVESTITURE'] || '-' },
                    { label: 'LIFTING', value: resMap['LIFTING'] || '-' },
                    { label: 'TIER', value: resMap['TIER'] || '1' }
                ]
            ];
            const rowH = isA5 ? 14.5 : 16;
            const tableH = rowH * statRows.length;
            ensure(tableH + 7);
            const tableTop = top;

            // Table cell text and inner label|value dividers (no background fills)
            statRows.forEach((row, r) => {
                const yTop = tableTop + r * rowH;
                const yBottom = H - yTop - rowH;
                let cx = M;
                row.forEach((cell, c) => {
                    const col = statCols[c];
                    const labelW = col.w - col.valW;
                    const labelText = self.pdfFitLine(cell.label, bold, statLabelSize, labelW - statPadX * 1.4);
                    const lw = bold.widthOfTextAtSize(labelText, statLabelSize);
                    const labelBaseline = rowH / 2 + statLabelSize * 0.35;
                    page.drawText(labelText, {
                        x: cx + labelW - lw - statPadX, y: H - yTop - labelBaseline, size: statLabelSize, font: bold, color: muted
                    });
                    const valText = self.pdfFitLine(cell.value, bold, col.valSize, col.valW - statPadX * 1.2);
                    const vw = bold.widthOfTextAtSize(valText, col.valSize);
                    const valBaseline = rowH / 2 + col.valSize * 0.35;
                    page.drawText(valText, {
                        x: cx + col.w - vw - statPadX, y: H - yTop - valBaseline, size: col.valSize, font: bold, color: ink
                    });
                    // Inner divider between label and value
                    page.drawLine({
                        start: { x: cx + labelW, y: yBottom },
                        end: { x: cx + labelW, y: yBottom + rowH },
                        thickness: 0.4, color: hair
                    });
                    cx += col.w;
                });
            });

            // Horizontal row dividers
            for (let r = 1; r < statRows.length; r++) {
                const y = H - tableTop - r * rowH;
                page.drawLine({
                    start: { x: M, y }, end: { x: M + contentW, y },
                    thickness: 0.5, color: border
                });
            }
            // Vertical column dividers (stronger divider between Attributes and Resources)
            let vx = M;
            for (let c = 0; c < statCols.length - 1; c++) {
                vx += statCols[c].w;
                page.drawLine({
                    start: { x: vx, y: H - tableTop - tableH },
                    end: { x: vx, y: H - tableTop },
                    thickness: c === 2 ? 1.0 : 0.6,
                    color: c === 2 ? ink : border
                });
            }
            // Crisp outer frame
            page.drawRectangle({
                x: M, y: H - tableTop - tableH, width: contentW, height: tableH,
                borderColor: border, borderWidth: 0.8
            });
            top = tableTop + tableH + 7;

            sectionTitle('SKILLS');
            const groups = { physical: [], cognitive: [], spiritual: [] };
            model.skills.forEach(skill => {
                if (groups[skill.category]) groups[skill.category].push(skill);
            });
            const skillCats = ['physical', 'cognitive', 'spiritual'];
            const subColsPerCat = isA5 ? 1 : 2;
            const catW = contentW / 3;
            const subW = catW / subColsPerCat;
            const skillRows = Math.max(1, ...skillCats.map(cat => Math.ceil(groups[cat].length / subColsPerCat)));
            const skillHeadH = 11.5;
            const skillRowH = isA5 ? 10.2 : 11;
            const skillTableH = skillHeadH + skillRows * skillRowH;
            ensure(skillTableH + 7);
            const skillTop = top;
            const skillSize = 6.8;
            const modSize = 7;
            const rankSize = 6;

            // Category header row (plain white, bold black centered)
            skillCats.forEach((cat, i) => {
                const x = M + i * catW;
                const title = cat.toUpperCase();
                const titleW = bold.widthOfTextAtSize(title, 6.5);
                page.drawText(title, {
                    x: x + (catW - titleW) / 2, y: H - skillTop - 8, size: 6.5, font: bold, color: ink
                });
            });
            page.drawLine({
                start: { x: M, y: H - skillTop - skillHeadH },
                end: { x: M + contentW, y: H - skillTop - skillHeadH },
                thickness: 0.7, color: border
            });

            // Skill cells (1 col/category on A5 Portrait, 2 sub-columns/category on A4 Portrait)
            skillCats.forEach((cat, i) => {
                const list = groups[cat];
                const split = Math.ceil(list.length / subColsPerCat);
                const catX = M + i * catW;
                for (let sub = 0; sub < subColsPerCat; sub++) {
                    const colX = catX + sub * subW;
                    for (let r = 0; r < skillRows; r++) {
                        const idx = sub * split + r;
                        if (sub === 0 && r >= split) continue;
                        if (idx >= list.length) continue;
                        const skill = list[idx];
                        const yTop = skillTop + skillHeadH + r * skillRowH;
                        const y = H - yTop - (skillRowH / 2 + skillSize * 0.34);
                        const trained = skill.rank > 0;
                        const nameFont = trained ? bold : font;
                        const modFont = trained ? bold : font;
                        const modStr = `+${skill.modifier}`;
                        const rankStr = `(${skill.rank})`;
                        const modW = modFont.widthOfTextAtSize(modStr, modSize);
                        const rankW = font.widthOfTextAtSize(rankStr, rankSize);
                        const nameMaxW = subW - modW - rankW - 14;
                        page.drawText(self.pdfFitLine(skill.name, nameFont, skillSize, nameMaxW), {
                            x: colX + 4, y, size: skillSize, font: nameFont, color: trained ? ink : muted
                        });
                        page.drawText(modStr, {
                            x: colX + subW - modW - rankW - 6, y, size: modSize, font: modFont, color: trained ? ink : muted
                        });
                        page.drawText(rankStr, {
                            x: colX + subW - rankW - 4, y, size: rankSize, font, color: muted
                        });
                    }
                }
            });

            // Subtle horizontal row hairlines
            for (let r = 1; r < skillRows; r++) {
                const y = H - skillTop - skillHeadH - r * skillRowH;
                page.drawLine({
                    start: { x: M, y }, end: { x: M + contentW, y },
                    thickness: 0.35, color: hair
                });
            }
            // Vertical dividers: light between sub-columns (A4 only), stronger between categories
            for (let i = 0; i < 3; i++) {
                if (subColsPerCat === 2) {
                    const subLineX = M + i * catW + subW;
                    page.drawLine({
                        start: { x: subLineX, y: H - skillTop - skillTableH },
                        end: { x: subLineX, y: H - skillTop - skillHeadH },
                        thickness: 0.35, color: hair
                    });
                }
                if (i > 0) {
                    const catLineX = M + i * catW;
                    page.drawLine({
                        start: { x: catLineX, y: H - skillTop - skillTableH },
                        end: { x: catLineX, y: H - skillTop },
                        thickness: 0.7, color: border
                    });
                }
            }
            // Crisp outer frame
            page.drawRectangle({
                x: M, y: H - skillTop - skillTableH, width: contentW, height: skillTableH,
                borderColor: border, borderWidth: 0.8
            });
            top = skillTop + skillTableH + 7;

            sectionTitle('WEAPONS');
            if (model.armor) {
                drawLabelledLine(`Armor: ${model.armor}`, 7.6, 10, 0.5, false);
            }
            if (model.weapons.length === 0) {
                drawWrappedBlock(['No weapons equipped'], 7.6, 10, muted, font);
            } else {
                model.weapons.forEach(line => {
                    drawLabelledLine(line, 7.6, 10, 0.5, false);
                });
            }
            top += 5;

            sectionTitle('TALENTS');
            if (model.talents.length === 0) {
                drawWrappedBlock(['No talents'], 7.5, 9.8, muted, font);
            } else {
                const cols = isA5 ? 2 : 3;
                const blockGap = 5;
                const blockW = (contentW - blockGap * (cols - 1)) / cols;
                const cellPadX = 4;
                const innerW = blockW - cellPadX * 2;
                const titleSize = 7.1;
                const titleLeading = 8.6;
                const descSize = 6.7;
                const descLeading = 8.3;

                const detailedTalents = model.talents.filter(t => t.showDescription);
                const compactTalents = model.talents.filter(t => !t.showDescription);

                // Loose 2-row blocks for talents with full explanations
                for (let i = 0; i < detailedTalents.length; i += cols) {
                    const rowSlice = detailedTalents.slice(i, i + cols).map(talent => {
                        const titleLines = self.pdfWrapLines(talent.name, bold, titleSize, innerW);
                        const descLines = talent.description
                            ? self.pdfWrapLines(talent.description, font, descSize, innerW)
                            : ['-'];
                        const titleH = Math.max(1, titleLines.length) * titleLeading + 3;
                        const descH = descLines.length * descLeading + 3.5;
                        return { talent, titleLines, descLines, titleH, descH, totalH: titleH + descH };
                    });
                    const rowH = Math.max(...rowSlice.map(item => item.totalH));
                    ensure(rowH + blockGap);
                    const rowTop = top;

                    rowSlice.forEach((item, colIdx) => {
                        const x = M + colIdx * (blockW + blockGap);
                        page.drawRectangle({
                            x, y: H - rowTop - rowH, width: blockW, height: rowH,
                            borderColor: border, borderWidth: 0.7
                        });
                        item.titleLines.forEach((line, idx) => {
                            page.drawText(line, {
                                x: x + cellPadX,
                                y: H - rowTop - 8.2 - (idx * titleLeading),
                                size: titleSize,
                                font: bold,
                                color: ink
                            });
                        });
                        const divY = H - rowTop - item.titleH;
                        page.drawLine({
                            start: { x, y: divY },
                            end: { x: x + blockW, y: divY },
                            thickness: 0.4, color: hair
                        });
                        item.descLines.forEach((line, idx) => {
                            page.drawText(line, {
                                x: x + cellPadX,
                                y: divY - 8 - (idx * descLeading),
                                size: descSize,
                                font,
                                color: item.talent.description ? ink : muted
                            });
                        });
                    });

                    top = rowTop + rowH + blockGap;
                }

                // Compact 1-row name-only blocks for talents with explanations hidden
                for (let i = 0; i < compactTalents.length; i += cols) {
                    const rowSlice = compactTalents.slice(i, i + cols).map(talent => {
                        const titleLines = self.pdfWrapLines(talent.name, bold, titleSize, innerW);
                        const titleH = Math.max(1, titleLines.length) * titleLeading + 3;
                        return { titleLines, titleH };
                    });
                    const rowH = Math.max(...rowSlice.map(item => item.titleH));
                    ensure(rowH + blockGap);
                    const rowTop = top;

                    rowSlice.forEach((item, colIdx) => {
                        const x = M + colIdx * (blockW + blockGap);
                        page.drawRectangle({
                            x, y: H - rowTop - rowH, width: blockW, height: rowH,
                            borderColor: border, borderWidth: 0.7
                        });
                        item.titleLines.forEach((line, idx) => {
                            page.drawText(line, {
                                x: x + cellPadX,
                                y: H - rowTop - 8.2 - (idx * titleLeading),
                                size: titleSize,
                                font: bold,
                                color: ink
                            });
                        });
                    });

                    top = rowTop + rowH + blockGap;
                }
            }
            top += 2;

            sectionTitle('EXPERTISES');
            const expertiseText = model.expertises.length ? model.expertises.join(', ') : 'None';
            drawWrappedBlock(self.pdfWrapLines(expertiseText, font, 7.6, contentW), 7.6, 10, model.expertises.length ? ink : muted, font);

            if (model.conditions.length) {
                top += 5;
                sectionTitle('CONDITIONS');
                model.conditions.forEach(line => {
                    drawWrappedBlock(self.pdfWrapLines(line, font, 7.6, contentW), 7.6, 10, ink, font);
                });
            }

            const bytes = await doc.save();
            return { bytes, failures: [] };
        },

        openSimplifiedPdfModal: function() {
            const modal = document.getElementById('simplifiedPdfModal');
            if (!modal) {
                this.confirmSimplifiedPdfExport();
                return;
            }
            if (!this._simplifiedPdfEscBound) {
                this._simplifiedPdfEscBound = true;
                document.addEventListener('keydown', (e) => {
                    if (e.key !== 'Escape') return;
                    const m = document.getElementById('simplifiedPdfModal');
                    if (m && m.classList.contains('active')) {
                        e.preventDefault();
                        this.closeSimplifiedPdfModal();
                    }
                });
            }

            const opts = this.getSimplifiedPdfOptions();
            const radios = modal.querySelectorAll('input[name="simplifiedPdfPageSize"]');
            radios.forEach(radio => {
                radio.checked = radio.value === opts.pageSize;
            });

            const listEl = document.getElementById('simplifiedPdfTalentList');
            if (listEl) {
                listEl.innerHTML = '';
                const compactSet = new Set(opts.compactTalents);
                const entries = this.pdfTalentEntries();
                if (entries.length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'pdf-talent-empty';
                    empty.textContent = 'No talents selected on this character.';
                    listEl.appendChild(empty);
                } else {
                    entries.forEach(entry => {
                        const label = document.createElement('label');
                        label.className = 'pdf-talent-check-item';
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.dataset.talentKey = entry.name.toLowerCase();
                        checkbox.checked = !compactSet.has(entry.name.toLowerCase());
                        const textWrap = document.createElement('span');
                        textWrap.className = 'pdf-talent-check-text';
                        const titleEl = document.createElement('strong');
                        titleEl.textContent = entry.name;
                        textWrap.appendChild(titleEl);
                        if (entry.description) {
                            const descEl = document.createElement('span');
                            descEl.className = 'pdf-talent-check-desc';
                            descEl.textContent = entry.description;
                            textWrap.appendChild(descEl);
                        }
                        label.appendChild(checkbox);
                        label.appendChild(textWrap);
                        listEl.appendChild(label);
                    });
                }
            }

            modal.classList.add('active');
        },

        closeSimplifiedPdfModal: function() {
            const modal = document.getElementById('simplifiedPdfModal');
            if (modal) modal.classList.remove('active');
        },

        setAllSimplifiedTalentDescriptions: function(includeAll) {
            const listEl = document.getElementById('simplifiedPdfTalentList');
            if (!listEl) return;
            listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = !!includeAll;
            });
        },

        confirmSimplifiedPdfExport: async function() {
            if (!this.currentCharacter) return;
            const modal = document.getElementById('simplifiedPdfModal');
            let pageSize = this.getSimplifiedPdfOptions().pageSize;
            let compactTalents = this.getSimplifiedPdfOptions().compactTalents;

            if (modal) {
                const checkedRadio = modal.querySelector('input[name="simplifiedPdfPageSize"]:checked');
                if (checkedRadio) pageSize = checkedRadio.value === 'a5' ? 'a5' : 'a4';
                const listEl = document.getElementById('simplifiedPdfTalentList');
                if (listEl) {
                    const checkboxes = listEl.querySelectorAll('input[type="checkbox"]');
                    if (checkboxes.length > 0) {
                        compactTalents = [];
                        checkboxes.forEach(cb => {
                            if (!cb.checked && cb.dataset.talentKey) {
                                compactTalents.push(cb.dataset.talentKey);
                            }
                        });
                    }
                }
            }

            this.currentCharacter.pdfOptions = { pageSize, compactTalents };
            if (typeof this.saveToLocalStorage === 'function') {
                this.saveToLocalStorage();
            }
            this.closeSimplifiedPdfModal();

            try {
                const safeName = (this.currentCharacter.name || 'character').replace(/[^a-z0-9]+/gi, '_') || 'character';
                const level = this.getTotalLevel();
                const filled = await this.buildSimplifiedSheet({ pageSize, compactTalents });
                this.downloadBytes(filled.bytes, `${safeName}_Lv${level}_simple_${pageSize.toUpperCase()}.pdf`, 'application/pdf');
            } catch (err) {
                console.error('Simplified PDF export failed', err);
                await this.dialog.alert('Could not export the PDF: ' + (err && err.message ? err.message : err), { title: 'PDF Export Error', variant: 'error' });
            }
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
                if (mode === 'simplified') {
                    this.openSimplifiedPdfModal();
                    return;
                }
                const safeName = (this.currentCharacter.name || 'character').replace(/[^a-z0-9]+/gi, '_') || 'character';
                const level = this.getTotalLevel();
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
