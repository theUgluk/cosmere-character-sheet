/**
 * Cosmere RPG Expertises Catalog Data
 * Armor, weapon, cultural, utility, and specialist expertises with mechanical effects.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "expertises": [
        {
            "id": "javelin",
            "name": "Javelin",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "javelin"
            },
            "expertEffects": [
                "addTrait:Indirect"
            ],
            "description": "Javelin maintenance and use. Unlocks Indirect: arc shots over cover; target can't Brace."
        },
        {
            "id": "knife",
            "name": "Knife",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "knife"
            },
            "expertEffects": [
                "addTrait:Offhand",
                "addTrait:Thrown [20/60]"
            ],
            "description": "Knife maintenance and use. Unlocks Offhand (offhand Strike costs 1 focus) and Thrown [20/60]."
        },
        {
            "id": "mace",
            "name": "Mace",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "mace"
            },
            "expertEffects": [
                "addTrait:Momentum"
            ],
            "description": "Mace maintenance and use. Unlocks Momentum: advantage on attack after 10 ft straight-line move toward target."
        },
        {
            "id": "rapier",
            "name": "Rapier",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "rapier"
            },
            "expertEffects": [
                "addTrait:Defensive"
            ],
            "description": "Rapier maintenance and use. Unlocks Defensive: can use Brace without cover."
        },
        {
            "id": "shortspear",
            "name": "Shortspear",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "shortspear"
            },
            "expertEffects": [
                "removeTrait:Two-Handed"
            ],
            "description": "Shortspear maintenance and use. Removes the Two-Handed trait so it can be wielded one-handed."
        },
        {
            "id": "sidesword",
            "name": "Sidesword",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "sidesword"
            },
            "expertEffects": [
                "addTrait:Offhand"
            ],
            "description": "Sidesword maintenance and use. Unlocks Offhand (offhand Strike costs 1 focus instead of 2)."
        },
        {
            "id": "staff",
            "name": "Staff",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "staff"
            },
            "expertEffects": [
                "addTrait:Defensive"
            ],
            "description": "Staff maintenance and use. Unlocks Defensive: can use Brace without cover."
        },
        {
            "id": "shortbow",
            "name": "Shortbow",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "shortbow"
            },
            "expertEffects": [
                "addTrait:Quickdraw"
            ],
            "description": "Shortbow maintenance and use. Unlocks Quickdraw: drawing the weapon is a free reaction."
        },
        {
            "id": "sling",
            "name": "Sling",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "sling"
            },
            "expertEffects": [
                "addTrait:Indirect"
            ],
            "description": "Sling maintenance and use. Unlocks Indirect: arc shots over cover; target can't Brace."
        },
        {
            "id": "axe",
            "name": "Axe",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "axe"
            },
            "expertEffects": [
                "addTrait:Offhand"
            ],
            "description": "Axe maintenance and use. Unlocks Offhand (offhand Strike costs 1 focus instead of 2)."
        },
        {
            "id": "greatsword",
            "name": "Greatsword",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "greatsword"
            },
            "expertEffects": [
                "addTrait:Deadly"
            ],
            "description": "Greatsword maintenance and use. Unlocks Deadly: spend focus on a hit to inflict an injury."
        },
        {
            "id": "hammer",
            "name": "Hammer",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "hammer"
            },
            "expertEffects": [
                "addTrait:Momentum"
            ],
            "description": "Hammer maintenance and use. Unlocks Momentum: advantage on attack after 10 ft straight-line move toward target."
        },
        {
            "id": "longspear",
            "name": "Longspear",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "longspear"
            },
            "expertEffects": [
                "addTrait:Defensive"
            ],
            "description": "Longspear maintenance and use. Unlocks Defensive: can use Brace without cover."
        },
        {
            "id": "longsword",
            "name": "Longsword",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "longsword"
            },
            "expertEffects": [
                "removeTrait:Two-Handed"
            ],
            "description": "Longsword maintenance and use. Removes the Two-Handed trait so it can be wielded one-handed."
        },
        {
            "id": "poleaxe",
            "name": "Poleaxe",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "poleaxe"
            },
            "expertEffects": [
                "addReach:5"
            ],
            "description": "Poleaxe maintenance and use. Adds 5 ft reach (Melee [+5])."
        },
        {
            "id": "shield",
            "name": "Shield",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "shield"
            },
            "expertEffects": [
                "addTrait:Offhand"
            ],
            "description": "Shield maintenance and use. Unlocks Offhand (offhand Strike costs 1 focus instead of 2)."
        },
        {
            "id": "crossbow",
            "name": "Crossbow",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "crossbow"
            },
            "expertEffects": [
                "addTrait:Deadly"
            ],
            "description": "Crossbow maintenance and use. Unlocks Deadly: spend focus on a hit to inflict an injury."
        },
        {
            "id": "longbow",
            "name": "Longbow",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "longbow"
            },
            "expertEffects": [
                "addTrait:Indirect"
            ],
            "description": "Longbow maintenance and use. Unlocks Indirect: arc shots over cover; target can't Brace."
        },
        {
            "id": "unarmed",
            "name": "Unarmed Attacks",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "unarmed"
            },
            "expertEffects": [
                "addTrait:Momentum",
                "addTrait:Offhand"
            ],
            "description": "Trained unarmed combat. Unlocks Momentum and Offhand on unarmed attacks."
        },
        {
            "id": "improvised",
            "name": "Improvised Weapons",
            "category": "weapon",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "improvised"
            },
            "expertEffects": [
                "addExpertNote:Improvised attacks gain the expert traits of the weapon most similar to the object used."
            ],
            "description": "Picking up almost anything to fight. Improvised attacks gain the expert traits of the most similar weapon, even without expertise in that weapon."
        },
        {
            "id": "uniform_armor",
            "name": "Uniform",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "uniform"
            },
            "expertEffects": [],
            "description": "Wearing and maintaining the uniform armor. (No additional expert traits.)"
        },
        {
            "id": "leather_armor",
            "name": "Leather Armor",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "leather"
            },
            "expertEffects": [
                "addTrait:Presentable"
            ],
            "description": "Wearing and maintaining leather armor. Unlocks Presentable: acceptable in non-military polite contexts."
        },
        {
            "id": "chain_armor",
            "name": "Chain Armor",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "chain"
            },
            "expertEffects": [
                "removeTrait:Cumbersome [3]"
            ],
            "description": "Wearing and maintaining chain armor. Removes the Cumbersome [3] trait so it can be worn with any Strength."
        },
        {
            "id": "breastplate_armor",
            "name": "Breastplate",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "breastplate"
            },
            "expertEffects": [
                "addTrait:Presentable"
            ],
            "description": "Wearing and maintaining a breastplate. Unlocks Presentable: acceptable in non-military polite contexts."
        },
        {
            "id": "half_plate_armor",
            "name": "Half Plate",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "half_plate"
            },
            "expertEffects": [
                "replaceTrait:Cumbersome [4]=>Cumbersome [3]"
            ],
            "description": "Wearing and maintaining half plate. Lowers Cumbersome from [4] to [3]."
        },
        {
            "id": "full_plate_armor",
            "name": "Full Plate",
            "category": "armor",
            "appliesTo": {
                "kind": "armor",
                "armorId": "full_plate"
            },
            "expertEffects": [],
            "description": "Wearing and maintaining full plate. (No additional expert traits.)"
        },
        {
            "id": "alethi",
            "name": "Alethi",
            "category": "cultural",
            "description": "Alethi customs, history, and language. You speak Alethi and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "azish",
            "name": "Azish",
            "category": "cultural",
            "description": "Azish customs, bureaucracy, and language. You speak Azish and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "veden",
            "name": "Veden",
            "category": "cultural",
            "description": "Veden customs and language. You speak Veden and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "thaylen",
            "name": "Thaylen",
            "category": "cultural",
            "description": "Thaylen customs, trade, and language. You speak Thaylen and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "kharbranthian",
            "name": "Kharbranthian",
            "category": "cultural",
            "description": "Kharbranthian customs and language. You speak Kharbranthian and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "unkalaki",
            "name": "Unkalaki (Horneater)",
            "category": "cultural",
            "description": "Unkalaki/Horneater customs and language. You speak Unkalaki and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "listener",
            "name": "Listener",
            "category": "cultural",
            "description": "Listener (singer) customs, songs, and language. You speak Listener and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "reshi",
            "name": "Reshi",
            "category": "cultural",
            "description": "Reshi customs and language. You speak Reshi and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "herdazian",
            "name": "Herdazian",
            "category": "cultural",
            "description": "Herdazian customs and language. You speak Herdazian and recall basic facts; can make Lore tests for obscure details."
        },
        {
            "id": "wayfarer",
            "name": "Wayfarer",
            "category": "cultural",
            "description": "Roads, road-side communities, traveler customs across Roshar; recognize travelers, cargo, and routes."
        },
        {
            "id": "high_society",
            "name": "High Society",
            "category": "cultural",
            "description": "Noble etiquette, courtly customs, and aristocratic protocol; recognize titles, lineages, and politics."
        },
        {
            "id": "military_life",
            "name": "Military Life",
            "category": "cultural",
            "description": "Military culture, ranks, and conduct. Recall basic facts; make Lore tests for obscure information."
        },
        {
            "id": "animal_care",
            "name": "Animal Care",
            "category": "utility",
            "description": "Tending and training animals; veterinary basics."
        },
        {
            "id": "archaeology",
            "name": "Archaeology",
            "category": "utility",
            "description": "Ancient ruins, lost peoples, and material culture; recognize artifacts and dating."
        },
        {
            "id": "armor_crafting",
            "name": "Armor Crafting",
            "category": "utility",
            "description": "Making and repairing armor; craft non-Invested armor of standard types."
        },
        {
            "id": "botany",
            "name": "Botany",
            "category": "utility",
            "description": "Identifying plants and their uses; recognize species automatically."
        },
        {
            "id": "engineering",
            "name": "Engineering",
            "category": "utility",
            "description": "Mechanical principles, structural integrity, and devices; recognize hazards (e.g., a rickety bridge)."
        },
        {
            "id": "equipment_crafting",
            "name": "Equipment Crafting",
            "category": "utility",
            "description": "Making and repairing general adventuring equipment."
        },
        {
            "id": "history",
            "name": "History",
            "category": "utility",
            "description": "Major events, dynasties, and timelines on Roshar."
        },
        {
            "id": "investigation",
            "name": "Investigation",
            "category": "utility",
            "description": "Following leads, interpreting evidence, and conducting inquiries."
        },
        {
            "id": "literature",
            "name": "Literature",
            "category": "utility",
            "description": "Books, poetry, and the written canon; granted by the Academic starting kit."
        },
        {
            "id": "medicine",
            "name": "Medicine",
            "category": "utility",
            "description": "Practical medicine and surgery basics; recognize injuries and treatments."
        },
        {
            "id": "meteorology",
            "name": "Meteorology",
            "category": "utility",
            "description": "Weather, highstorms, and storm patterns; predict storms and read signs."
        },
        {
            "id": "military_strategy",
            "name": "Military Strategy",
            "category": "utility",
            "description": "Tactics, formations, logistics, and command-level planning."
        },
        {
            "id": "music",
            "name": "Music",
            "category": "utility",
            "description": "Performing, composing, and recognizing music traditions."
        },
        {
            "id": "painting",
            "name": "Painting",
            "category": "utility",
            "description": "Painting techniques, pigments, and art history."
        },
        {
            "id": "religion",
            "name": "Religion",
            "category": "utility",
            "description": "Vorinism, the Almighty, and other Rosharan faiths; recall doctrine and rites."
        },
        {
            "id": "riding_horses",
            "name": "Riding Horses",
            "category": "utility",
            "description": "Horsemanship, gear, and care; ride competently in difficult terrain."
        },
        {
            "id": "sleight_of_hand",
            "name": "Sleight of Hand",
            "category": "utility",
            "description": "Pickpocketing, palming, and stage-magic style misdirection."
        },
        {
            "id": "underworld",
            "name": "Underworld",
            "category": "utility",
            "description": "Thieves' guilds, smuggling, and criminal jargon; communicate covertly with locals."
        },
        {
            "id": "weapon_crafting",
            "name": "Weapon Crafting",
            "category": "utility",
            "description": "Making and repairing weapons; craft non-Invested weapons of standard types."
        },
        {
            "id": "half_shards",
            "name": "Half-Shards",
            "category": "specialist",
            "description": "Wielding half-shard kite shields. Allows benefiting from a half-shard's expert traits and unique fabrial."
        },
        {
            "id": "grandbows",
            "name": "Grandbows",
            "category": "specialist",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "grandbow"
            },
            "expertEffects": [
                "addTrait:Pierce"
            ],
            "description": "Wielding grandbows. Unlocks Pierce: damage cannot be reduced by deflect."
        },
        {
            "id": "shardblades",
            "name": "Shardblades",
            "category": "specialist",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "shardblade"
            },
            "expertEffects": [
                "removeTrait:Dangerous"
            ],
            "description": "Wielding Shardblades. Removes the Dangerous trait when wielding a Shardblade."
        },
        {
            "id": "shardplate",
            "name": "Shardplate",
            "category": "specialist",
            "appliesTo": {
                "kind": "armor",
                "armorId": "shardplate"
            },
            "expertEffects": [
                "removeTrait:Dangerous"
            ],
            "description": "Wearing and operating Shardplate. Removes the Dangerous trait."
        },
        {
            "id": "warhammers",
            "name": "Warhammers",
            "category": "specialist",
            "appliesTo": {
                "kind": "weapon",
                "weaponId": "warhammer"
            },
            "expertEffects": [
                "addExpertNote:Crushing Weight: on hit vs. equal-or-smaller target, push 10 ft horizontally; spend focus to push others within reach."
            ],
            "description": "Wielding warhammers. Adds Crushing Weight: push targets on hit."
        },
        {
            "id": "fabrial_crafting",
            "name": "Fabrial Crafting",
            "category": "specialist",
            "description": "Designing and constructing fabrials and Invested devices."
        },
        {
            "id": "singer_history",
            "name": "Singer History",
            "category": "specialist",
            "description": "The lost history of the singers, before and after their forms changed."
        },
        {
            "id": "knights_radiant",
            "name": "Knights Radiant",
            "category": "specialist",
            "description": "The lost history, orders, and Ideals of the Knights Radiant."
        }
    ]
});
})();
