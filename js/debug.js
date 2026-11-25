/**
 * Mobile Debug Console & Global Error Handlers
 * Exposes window.mobileDebug and registers window.onerror / window.onunhandledrejection.
 * Eruda initialization is safely guarded for offline file:// usage.
 */
(function () {
    window.erudaInitialized = false;

    const mobileDebug = {
        enabled: false, // Default off
        logs: [],

        log: function(message) {
            console.log(message);
            if (this.enabled) {
                this.logs.push(message);
                this.update();
            }
        },

        error: function(message, error) {
            console.error(message, error);
            if (this.enabled) {
                this.logs.push(`ERROR: ${message} - ${error ? error.message : ""}`);
                this.update();
            }
        },

        update: function() {
            const debugEl = document.getElementById("mobileDebug");
            const contentEl = document.getElementById("debugContent");
            if (debugEl && contentEl && this.enabled) {
                debugEl.style.display = "block";
                contentEl.innerHTML = this.logs.map((log, i) => `${i + 1}. ${log}`).join("<br>");
            } else if (debugEl && !this.enabled) {
                debugEl.style.display = "none";
            }
        },

        toggle: function(enabled) {
            this.enabled = enabled;
            this.update();

            // Toggle eruda console if loaded
            if (enabled && !window.erudaInitialized && typeof eruda !== "undefined") {
                eruda.init();
                window.erudaInitialized = true;
                console.log("Mobile debug console enabled");
            } else if (!enabled && window.erudaInitialized && typeof eruda !== "undefined" && eruda.destroy) {
                eruda.destroy();
                window.erudaInitialized = false;
            }
        }
    };

    window.mobileDebug = mobileDebug;

    // Catch all errors
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        mobileDebug.error(`JS Error: ${msg} at line ${lineNo}`, error);
        return false;
    };

    window.onunhandledrejection = function(event) {
        mobileDebug.error("Promise rejection", event.reason);
    };
})();
