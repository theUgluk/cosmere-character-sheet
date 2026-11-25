/**
 * Cosmere RPG Rules Data Entry Point
 * Verifies all rules data modules loaded into window.COSMERE_RULES.
 */
(function () {
    const requiredKeys = ["version","gameName","maxLevel","attributes","skills","defenses","resources","movement","senses","lifting","heroicPaths","radiantOrders","advancement","ancestries","ancestryPaths","cultures","expertises","itemTraitGlossary","weapons","armor","currency","equipment","startingKits","conditions","surges"];
    const rules = window.COSMERE_RULES;
    if (!rules) {
        throw new Error("COSMERE_RULES was not initialized. Check data/rules/*.js script tags.");
    }
    const missing = requiredKeys.filter(key => !(key in rules));
    if (missing.length > 0) {
        throw new Error("COSMERE_RULES is missing required sections: " + missing.join(", "));
    }
})();
