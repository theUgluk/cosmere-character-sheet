/**
 * Persistence & File Import/Export
 * Browser localStorage save/load (cosmereCharacters) and JSON character file import/export.
 */
(function () {
    Object.assign(window.app, {
        saveToLocalStorage: function() {
            try {
                localStorage.setItem('cosmereCharacters', JSON.stringify(this.characters));
                console.log('Saved to localStorage');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                this.dialog.alert('Error saving to local storage. Your browser may have storage disabled.', { title: 'Save Error', variant: 'error' });
            }
        },

        loadFromLocalStorage: function() {
            try {
                const saved = localStorage.getItem('cosmereCharacters');
                if (saved) {
                    this.characters = JSON.parse(saved);
                    // Migrate each character to the current schema (no-op for fresh saves).
                    this.characters.forEach(c => this.migrateCharacterShape(c));
                    console.log('Loaded from localStorage');
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        },

        // Rank pips on blank_sheet.pdf, left to right, for each printed skill row.,

        downloadBytes: function(data, filename, mime) {
            const blob = new Blob([data], { type: mime });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1500);
        },

        exportToFile: async function() {
            if (!this.currentCharacter) return;
            
            const dataStr = JSON.stringify(this.currentCharacter, null, 2);
            const totalLevel = this.getTotalLevel();
            const safeName = (this.currentCharacter.name || 'character').replace(/[^a-z0-9]/gi, '_') || 'character';
            const defaultFileName = `${safeName}_Lv${totalLevel}.json`;
            
            // Try to use File System Access API (Chrome, Edge, Opera)
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: defaultFileName,
                        types: [{
                            description: 'Character JSON',
                            accept: { 'application/json': ['.json'] }
                        }]
                    });
                    
                    const writable = await handle.createWritable();
                    await writable.write(dataStr);
                    await writable.close();
                    
                    console.log('Character exported successfully');
                    return;
                } catch (err) {
                    // User cancelled or error occurred
                    if (err.name !== 'AbortError') {
                        console.error('Export error:', err);
                    }
                    return;
                }
            }
            
            // Fallback for browsers without File System Access API
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = defaultFileName;
            link.click();
            
            URL.revokeObjectURL(url);
        },

        importFromFile: function() {
            document.getElementById('fileInput').click();
        },

        handleFileImport: function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const character = JSON.parse(e.target.result);
                    
                    // Generate new ID to avoid conflicts
                    character.id = Date.now().toString();
                    character.updatedAt = new Date().toISOString();
                    
                    this.characters.push(character);
                    this.loadCharacter(character.id);
                    this.saveToLocalStorage();
                    
                    this.dialog.alert('Character imported successfully!', { title: 'Import Complete', variant: 'success' });
                } catch (error) {
                    console.error('Error importing character:', error);
                    this.dialog.alert('Error importing character. Make sure the file is a valid character JSON.', { title: 'Import Error', variant: 'error' });
                }
            };
            reader.readAsText(file);
            
            // Reset file input
            event.target.value = '';
        },

        // ========== EQUIPMENT & COMBAT FUNCTIONS ==========
    });
})();
