/**
 * Central Dialog System (alert, confirm, prompt, form)
 * Replaces native browser alert()/confirm()/prompt() dialogs with an accessible,
 * Promise-based, queued in-app modal dialog styled consistently with the sheet.
 */
(function () {
    const VARIANTS = ['info', 'warning', 'error', 'success'];

    const dialog = {
        _queue: [],
        _active: null,
        _keyHandlerBound: false,

        isOpen: function() {
            return !!this._active;
        },

        alert: function(message, options) {
            const opts = options || {};
            return this._enqueue({
                mode: 'alert',
                title: opts.title || 'Notice',
                message: message || '',
                okText: opts.okText || 'OK',
                variant: opts.variant || 'info'
            });
        },

        confirm: function(message, options) {
            const opts = options || {};
            return this._enqueue({
                mode: 'confirm',
                title: opts.title || 'Confirm',
                message: message || '',
                okText: opts.okText || 'Confirm',
                cancelText: opts.cancelText || 'Cancel',
                danger: !!opts.danger,
                variant: opts.variant || (opts.danger ? 'warning' : 'info')
            });
        },

        prompt: function(message, options) {
            const opts = options || {};
            return this.form({
                title: opts.title || 'Input',
                message: opts.label ? (message || '') : '',
                okText: opts.okText || 'OK',
                cancelText: opts.cancelText || 'Cancel',
                variant: opts.variant || 'info',
                fields: [{
                    name: 'value',
                    label: opts.label || message || 'Value',
                    type: opts.type || 'text',
                    value: opts.defaultValue !== undefined ? String(opts.defaultValue) : '',
                    placeholder: opts.placeholder || '',
                    required: !!opts.required,
                    min: opts.min,
                    max: opts.max,
                    step: opts.step,
                    rows: opts.rows
                }]
            }).then(res => (res ? res.value : null));
        },

        form: function(options) {
            const opts = options || {};
            return this._enqueue({
                mode: 'form',
                title: opts.title || 'Enter Details',
                message: opts.message || '',
                fields: Array.isArray(opts.fields) ? opts.fields : [],
                columns: opts.columns || 1,
                wide: !!opts.wide || (opts.columns && opts.columns > 1),
                okText: opts.okText || 'Save',
                cancelText: opts.cancelText || 'Cancel',
                danger: !!opts.danger,
                variant: opts.variant || 'info'
            });
        },

        _enqueue: function(config) {
            return new Promise(resolve => {
                this._queue.push({ config, resolve });
                if (!this._active) {
                    this._showNext();
                }
            });
        },

        _bindGlobalKeys: function() {
            if (this._keyHandlerBound) return;
            this._keyHandlerBound = true;
            document.addEventListener('keydown', (e) => {
                if (!this._active) return;
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    this._dismissCurrent();
                }
            }, true);
        },

        _dismissCurrent: function() {
            if (!this._active) return;
            const mode = this._active.config.mode;
            if (mode === 'alert') this._finish(undefined);
            else if (mode === 'confirm') this._finish(false);
            else this._finish(null);
        },

        _showNext: function() {
            if (this._queue.length === 0) {
                this._active = null;
                return;
            }

            const item = this._queue.shift();
            const overlay = document.getElementById('appDialog');
            if (!overlay) {
                // Fallback if DOM isn't ready yet
                item.resolve(item.config.mode === 'confirm' ? false : null);
                this._showNext();
                return;
            }

            this._bindGlobalKeys();

            const content = overlay.querySelector('.app-dialog-content');
            const titleEl = document.getElementById('appDialogTitle');
            const closeBtn = document.getElementById('appDialogClose');
            const messageEl = document.getElementById('appDialogMessage');
            const formEl = document.getElementById('appDialogForm');
            const fieldsEl = document.getElementById('appDialogFields');
            const errorEl = document.getElementById('appDialogError');
            const actionsEl = document.getElementById('appDialogActions');

            const { config } = item;
            const previouslyFocused = document.activeElement;

            this._active = {
                config,
                resolve: item.resolve,
                previouslyFocused
            };

            // Apply variant and width classes
            VARIANTS.forEach(v => content.classList.remove(`variant-${v}`));
            if (VARIANTS.includes(config.variant)) {
                content.classList.add(`variant-${config.variant}`);
            }
            content.classList.toggle('is-wide', !!config.wide);

            titleEl.textContent = config.title;

            if (config.message) {
                messageEl.textContent = config.message;
                messageEl.classList.remove('hidden');
            } else {
                messageEl.textContent = '';
                messageEl.classList.add('hidden');
            }

            errorEl.textContent = '';
            errorEl.classList.add('hidden');

            // Render form fields if mode === 'form'
            fieldsEl.innerHTML = '';
            fieldsEl.classList.toggle('cols-2', config.columns === 2);
            const fieldInputs = [];
            if (config.mode === 'form' && config.fields.length > 0) {
                fieldsEl.classList.remove('hidden');
                config.fields.forEach((field, idx) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'app-dialog-field' + (field.fullWidth ? ' full-width' : '');

                    const inputId = `appDialogField_${idx}_${field.name}`;
                    const label = document.createElement('label');
                    label.setAttribute('for', inputId);
                    label.textContent = field.label + (field.required ? ' *' : '');
                    wrapper.appendChild(label);

                    let input;
                    if (field.type === 'textarea') {
                        input = document.createElement('textarea');
                        input.rows = field.rows || 3;
                    } else if (field.type === 'select') {
                        input = document.createElement('select');
                        (field.options || []).forEach(opt => {
                            const optEl = document.createElement('option');
                            if (typeof opt === 'object') {
                                optEl.value = opt.value;
                                optEl.textContent = opt.label;
                            } else {
                                optEl.value = opt;
                                optEl.textContent = opt;
                            }
                            input.appendChild(optEl);
                        });
                    } else {
                        input = document.createElement('input');
                        input.type = field.type || 'text';
                        if (field.min !== undefined) input.min = String(field.min);
                        if (field.max !== undefined) input.max = String(field.max);
                        if (field.step !== undefined) input.step = String(field.step);
                    }

                    input.id = inputId;
                    input.name = field.name;
                    if (field.placeholder) input.placeholder = field.placeholder;
                    if (field.value !== undefined && field.value !== null) {
                        input.value = String(field.value);
                    }
                    if (field.required) input.required = true;

                    wrapper.appendChild(input);
                    fieldsEl.appendChild(wrapper);
                    fieldInputs.push({ field, input });
                });
            } else {
                fieldsEl.classList.add('hidden');
            }

            // Render action buttons
            actionsEl.innerHTML = '';

            let cancelBtn = null;
            if (config.mode === 'confirm' || config.mode === 'form') {
                cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'app-dialog-btn-secondary';
                cancelBtn.textContent = config.cancelText || 'Cancel';
                cancelBtn.onclick = () => this._dismissCurrent();
                actionsEl.appendChild(cancelBtn);
            }

            const okBtn = document.createElement('button');
            okBtn.type = 'submit';
            okBtn.className = config.danger ? 'danger' : 'app-dialog-btn-primary';
            okBtn.textContent = config.okText || 'OK';
            actionsEl.appendChild(okBtn);

            // Wire overlay backdrop & close button
            overlay.onclick = (e) => {
                if (e.target === overlay) this._dismissCurrent();
            };
            closeBtn.onclick = () => this._dismissCurrent();

            // Wire form submission
            formEl.onsubmit = (e) => {
                e.preventDefault();
                if (config.mode === 'alert') {
                    this._finish(undefined);
                    return;
                }
                if (config.mode === 'confirm') {
                    this._finish(true);
                    return;
                }
                // Validate form fields
                const values = {};
                for (const { field, input } of fieldInputs) {
                    const raw = input.value;
                    if (field.required && raw.trim() === '') {
                        errorEl.textContent = `Please enter ${field.label.toLowerCase()}.`;
                        errorEl.classList.remove('hidden');
                        input.focus();
                        return;
                    }
                    if (field.type === 'number' && raw.trim() !== '') {
                        const num = Number(raw);
                        if (Number.isNaN(num)) {
                            errorEl.textContent = `Please enter a valid number for ${field.label.toLowerCase()}.`;
                            errorEl.classList.remove('hidden');
                            input.focus();
                            return;
                        }
                        if (field.min !== undefined && num < field.min) {
                            errorEl.textContent = `${field.label} must be at least ${field.min}.`;
                            errorEl.classList.remove('hidden');
                            input.focus();
                            return;
                        }
                        if (field.max !== undefined && num > field.max) {
                            errorEl.textContent = `${field.label} cannot exceed ${field.max}.`;
                            errorEl.classList.remove('hidden');
                            input.focus();
                            return;
                        }
                    }
                    values[field.name] = raw;
                }
                this._finish(values);
            };

            overlay.classList.add('active');

            // Set sensible initial focus
            setTimeout(() => {
                if (fieldInputs.length > 0) {
                    const first = fieldInputs[0].input;
                    first.focus();
                    if (first.select && first.value) {
                        first.select();
                    }
                } else if (config.mode === 'confirm' && config.danger && cancelBtn) {
                    cancelBtn.focus();
                } else {
                    okBtn.focus();
                }
            }, 0);
        },

        _finish: function(result) {
            const current = this._active;
            if (!current) return;
            this._active = null;

            const overlay = document.getElementById('appDialog');
            if (overlay) {
                overlay.classList.remove('active');
            }

            if (current.previouslyFocused && typeof current.previouslyFocused.focus === 'function') {
                try {
                    current.previouslyFocused.focus();
                } catch (e) {
                    /* ignore if element is no longer focusable */
                }
            }

            current.resolve(result);
            this._showNext();
        }
    };

    Object.assign(window.app, { dialog });
})();
