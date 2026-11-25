/**
 * Cosmere RPG Core Rules Data
 * Metadata, attributes, skills, defenses, resources, movement, senses, lifting, advancement, ancestries, ancestryPaths, cultures, and conditions.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "version": "2.0",
    "gameName": "Cosmere RPG - Stormlight",
    "maxLevel": 10,
    "attributes": {
        "list": [
            {
                "id": "strength",
                "name": "Strength",
                "abbr": "STR",
                "category": "physical",
                "description": "Physical power and resilience"
            },
            {
                "id": "speed",
                "name": "Speed",
                "abbr": "SPD",
                "category": "physical",
                "description": "Quickness and reflexes"
            },
            {
                "id": "intellect",
                "name": "Intellect",
                "abbr": "INT",
                "category": "cognitive",
                "description": "Applied intelligence and wit"
            },
            {
                "id": "willpower",
                "name": "Willpower",
                "abbr": "WIL",
                "category": "cognitive",
                "description": "Mental fortitude and determination"
            },
            {
                "id": "awareness",
                "name": "Awareness",
                "abbr": "AWA",
                "category": "spiritual",
                "description": "Perception and environmental awareness"
            },
            {
                "id": "presence",
                "name": "Presence",
                "abbr": "PRE",
                "category": "spiritual",
                "description": "Force of personality and charisma"
            }
        ],
        "minValue": 0,
        "maxValue": 5,
        "startingTotal": 12
    },
    "skills": {
        "list": [
            {
                "id": "agility",
                "name": "Agility",
                "category": "physical",
                "attribute": "speed",
                "description": "Acrobatics, climbing, and nimbleness"
            },
            {
                "id": "athletics",
                "name": "Athletics",
                "category": "physical",
                "attribute": "strength",
                "description": "Running, jumping, and physical prowess"
            },
            {
                "id": "heavy_weaponry",
                "name": "Heavy Weaponry",
                "category": "physical",
                "attribute": "strength",
                "description": "Large melee and ranged weapons"
            },
            {
                "id": "light_weaponry",
                "name": "Light Weaponry",
                "category": "physical",
                "attribute": "speed",
                "description": "Small melee and ranged weapons"
            },
            {
                "id": "stealth",
                "name": "Stealth",
                "category": "physical",
                "attribute": "speed",
                "description": "Hiding and moving undetected"
            },
            {
                "id": "crafting",
                "name": "Crafting",
                "category": "cognitive",
                "attribute": "intellect",
                "description": "Creating and repairing items"
            },
            {
                "id": "deduction",
                "name": "Deduction",
                "category": "cognitive",
                "attribute": "intellect",
                "description": "Logic and investigation"
            },
            {
                "id": "discipline",
                "name": "Discipline",
                "category": "cognitive",
                "attribute": "willpower",
                "description": "Self-control and composure"
            },
            {
                "id": "intimidation",
                "name": "Intimidation",
                "category": "cognitive",
                "attribute": "willpower",
                "description": "Threats and coercion"
            },
            {
                "id": "lore",
                "name": "Lore",
                "category": "cognitive",
                "attribute": "intellect",
                "description": "Knowledge and education"
            },
            {
                "id": "medicine",
                "name": "Medicine",
                "category": "cognitive",
                "attribute": "intellect",
                "description": "Healing and treating injuries"
            },
            {
                "id": "thievery",
                "name": "Thievery",
                "category": "physical",
                "attribute": "speed",
                "description": "Lockpicking and sleight of hand"
            },
            {
                "id": "perception",
                "name": "Perception",
                "category": "spiritual",
                "attribute": "awareness",
                "description": "Spotting details and danger"
            },
            {
                "id": "survival",
                "name": "Survival",
                "category": "spiritual",
                "attribute": "awareness",
                "description": "Wilderness skills and tracking"
            },
            {
                "id": "deception",
                "name": "Deception",
                "category": "spiritual",
                "attribute": "presence",
                "description": "Lying and misdirection"
            },
            {
                "id": "insight",
                "name": "Insight",
                "category": "spiritual",
                "attribute": "awareness",
                "description": "Reading people and motives"
            },
            {
                "id": "leadership",
                "name": "Leadership",
                "category": "spiritual",
                "attribute": "presence",
                "description": "Inspiring and commanding others"
            },
            {
                "id": "persuasion",
                "name": "Persuasion",
                "category": "spiritual",
                "attribute": "presence",
                "description": "Convincing and negotiating"
            }
        ],
        "maxRanks": 5
    },
    "defenses": {
        "physical": {
            "name": "Physical",
            "base": 10,
            "attributes": [
                "strength",
                "speed"
            ]
        },
        "cognitive": {
            "name": "Cognitive",
            "base": 10,
            "attributes": [
                "intellect",
                "willpower"
            ]
        },
        "spiritual": {
            "name": "Spiritual",
            "base": 10,
            "attributes": [
                "awareness",
                "presence"
            ]
        }
    },
    "resources": {
        "health": {
            "level1Base": 10,
            "level1Note": "level1 health = level1Base + Strength; per-level rows below add to that base, with addAttribute granting an extra +Strength at the start of each tier.",
            "perLevelAfter20": 1,
            "progression": [
                {
                    "level": 1,
                    "perLevel": 0,
                    "addAttribute": false
                },
                {
                    "level": 2,
                    "perLevel": 5,
                    "addAttribute": false
                },
                {
                    "level": 3,
                    "perLevel": 5,
                    "addAttribute": false
                },
                {
                    "level": 4,
                    "perLevel": 5,
                    "addAttribute": false
                },
                {
                    "level": 5,
                    "perLevel": 5,
                    "addAttribute": false
                },
                {
                    "level": 6,
                    "perLevel": 4,
                    "addAttribute": true
                },
                {
                    "level": 7,
                    "perLevel": 4,
                    "addAttribute": false
                },
                {
                    "level": 8,
                    "perLevel": 4,
                    "addAttribute": false
                },
                {
                    "level": 9,
                    "perLevel": 4,
                    "addAttribute": false
                },
                {
                    "level": 10,
                    "perLevel": 4,
                    "addAttribute": false
                },
                {
                    "level": 11,
                    "perLevel": 3,
                    "addAttribute": true
                },
                {
                    "level": 12,
                    "perLevel": 3,
                    "addAttribute": false
                },
                {
                    "level": 13,
                    "perLevel": 3,
                    "addAttribute": false
                },
                {
                    "level": 14,
                    "perLevel": 3,
                    "addAttribute": false
                },
                {
                    "level": 15,
                    "perLevel": 3,
                    "addAttribute": false
                },
                {
                    "level": 16,
                    "perLevel": 2,
                    "addAttribute": true
                },
                {
                    "level": 17,
                    "perLevel": 2,
                    "addAttribute": false
                },
                {
                    "level": 18,
                    "perLevel": 2,
                    "addAttribute": false
                },
                {
                    "level": 19,
                    "perLevel": 2,
                    "addAttribute": false
                },
                {
                    "level": 20,
                    "perLevel": 2,
                    "addAttribute": false
                }
            ]
        },
        "focus": {
            "base": 2,
            "attributeBonus": "willpower",
            "note": "Per Stormlight Handbook: maximum focus = 2 + Willpower."
        },
        "investiture": {
            "baseValue": 0,
            "perLevel": 2,
            "note": "Radiant paths only"
        },
        "recoveryDie": {
            "progression": {
                "0": "1d4",
                "1": "1d6",
                "3": "1d8",
                "5": "1d10",
                "7": "1d12",
                "9": "1d20"
            },
            "note": "Keys are minimum Willpower values; the code iterates highest-key-first and picks the first row whose key <= Willpower."
        }
    },
    "movement": {
        "rateTable": [
            {
                "minSpeed": 0,
                "maxSpeed": 0,
                "rate": 20
            },
            {
                "minSpeed": 1,
                "maxSpeed": 2,
                "rate": 25
            },
            {
                "minSpeed": 3,
                "maxSpeed": 4,
                "rate": 30
            },
            {
                "minSpeed": 5,
                "maxSpeed": 6,
                "rate": 40
            },
            {
                "minSpeed": 7,
                "maxSpeed": 8,
                "rate": 60
            },
            {
                "minSpeed": 9,
                "maxSpeed": 99,
                "rate": 80
            }
        ],
        "note": "Movement rate (feet per action) per the handbook Movement Rate table."
    },
    "senses": {
        "rangeTable": [
            {
                "minAwareness": 0,
                "maxAwareness": 0,
                "range": 5
            },
            {
                "minAwareness": 1,
                "maxAwareness": 2,
                "range": 10
            },
            {
                "minAwareness": 3,
                "maxAwareness": 4,
                "range": 20
            },
            {
                "minAwareness": 5,
                "maxAwareness": 6,
                "range": 50
            },
            {
                "minAwareness": 7,
                "maxAwareness": 8,
                "range": 100
            },
            {
                "minAwareness": 9,
                "maxAwareness": 99,
                "range": -1
            }
        ],
        "note": "Senses range (feet) per the handbook Senses Range table; -1 means unaffected by obscured senses."
    },
    "lifting": {
        "baseCapacity": 100,
        "note": "Base capacity in lbs, +50 per Strength"
    },
    "advancement": {
        "_note": "Per Stormlight Handbook page 29 Character Advancement table. Skill ranks: 4 base at level 1 (already included in computeSkillRankBudget), then +2 per level from level 2 onward through level 20. Attribute: 12 base at level 1, then +1 at levels 3, 6, 9, 12, 15, 18. Tiers: 1 (levels 1-5), 2 (6-10), 3 (11-15), 4 (16-20), 5 (21+). Talents: +1 per level (level 21+ is +1 skill OR +1 talent, modeled here as +1). Ancestry bonus talents at levels 1, 6, 11, 16, 21 are tracked separately in computeTalentPoints.",
        "levelProgression": [
            {
                "level": 1,
                "tier": 1,
                "talentPoints": 1,
                "skillRankIncreases": 0,
                "attributeIncreases": 0
            },
            {
                "level": 2,
                "tier": 1,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 3,
                "tier": 1,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 4,
                "tier": 1,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 5,
                "tier": 1,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 6,
                "tier": 2,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 7,
                "tier": 2,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 8,
                "tier": 2,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 9,
                "tier": 2,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 10,
                "tier": 2,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 11,
                "tier": 3,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 12,
                "tier": 3,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 13,
                "tier": 3,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 14,
                "tier": 3,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 15,
                "tier": 3,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 16,
                "tier": 4,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 17,
                "tier": 4,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 18,
                "tier": 4,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 1
            },
            {
                "level": 19,
                "tier": 4,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            },
            {
                "level": 20,
                "tier": 4,
                "talentPoints": 1,
                "skillRankIncreases": 2,
                "attributeIncreases": 0
            }
        ]
    },
    "ancestries": [
        "Human",
        "Singer"
    ],
    "ancestryPaths": [
        {
            "id": "singer",
            "name": "Singer Forms",
            "ancestry": "Singer",
            "description": "Singers can bond spren during highstorms to assume different forms, each granting unique abilities. As a Singer you gain the Change Form key talent for free, and you can spend your normal talent points on talents in this tree (in addition to any heroic path or radiant order trees you have access to).",
            "keyTalent": {
                "id": "change_form",
                "name": "Change Form (Singer Key)",
                "prerequisite": "Singer ancestry",
                "activation": "special",
                "description": "You learn to bond a spren during highstorms and change your form. While outdoors during a highstorm, you can activate this talent to change into dullform, mateform, or any singer form you've unlocked. You begin with two singer forms, dullform and mateform: Dullform — your form isn't specialized, but you can pass unnoticed as a 'parshman' in most human societies. Mateform — bonded with a lifespren; specialized for reproduction. While in a form, you temporarily gain its actions, statistic increases, and other effects (even above the maximum) until you assume a different form. You can only be in one form at a time."
            },
            "specialties": [
                {
                    "id": "honorable_forms",
                    "name": "Honorable Forms",
                    "description": "Forms granted by ordinary spren of Honor or Cultivation. These forms enhance natural singer aptitudes without inviting Odium's influence.",
                    "talents": [
                        {
                            "id": "forms_of_finesse",
                            "name": "Forms of Finesse",
                            "prerequisite": "Change Form key talent",
                            "activation": "special",
                            "description": "You gain two new singer forms — artform and nimbleform — which you can transform into using Change Form. Artform (creationspren bond): Awareness +1, utility expertises in Painting and Music, advantage on Crafting tests and tests to entertain. Nimbleform (windspren bond): Speed +1; while in this form, your maximum focus and current focus both increase by 2 (and decrease by 2 when you leave the form).",
                            "requiresTalent": [
                                "change_form"
                            ]
                        },
                        {
                            "id": "forms_of_resolve",
                            "name": "Forms of Resolve",
                            "prerequisite": "Change Form key talent",
                            "activation": "special",
                            "description": "You gain two new singer forms — warform and workform — which you can transform into using Change Form. Warform (painspren bond): Strength +1, deflect +1 (doesn't stack with worn armor). You can jump horizontally up to your movement rate and vertically up to half your movement rate without an Athletics test. Workform (gravitationspren bond): Willpower +1, ignore the Exhausted condition. You can disguise yourself to pass as a 'parshman' in most human societies.",
                            "requiresTalent": [
                                "change_form"
                            ]
                        },
                        {
                            "id": "forms_of_wisdom",
                            "name": "Forms of Wisdom",
                            "prerequisite": "Change Form key talent",
                            "activation": "special",
                            "description": "You gain two new singer forms — mediationform and scholarform — which you can transform into using Change Form. Mediationform (bindspren bond): Presence +1; you can use the Aid reaction without spending focus. Scholarform (logicspren bond): Intellect +1; while in this form, choose one cultural or utility expertise you don't already have and one non-surge cognitive skill — you temporarily gain that expertise and an additional rank in that skill. (If you also have Erudition, scholarform's grants count as part of Erudition's pool for reassignment.)",
                            "requiresTalent": [
                                "change_form"
                            ]
                        }
                    ]
                },
                {
                    "id": "regal_forms",
                    "name": "Regal Forms (Voidspren)",
                    "description": "Forms of power granted by Voidspren connected to Odium. These forms grant exceptional abilities at the cost of vulnerability to Odium's influence.",
                    "talents": [
                        {
                            "id": "ambitious_mind",
                            "name": "Ambitious Mind",
                            "prerequisite": "Discipline 3+; either the Forms of Finesse, Forms of Resolve, or Forms of Wisdom talent",
                            "activation": "always",
                            "description": "Your growing thirst for power opens you to Odium's influence. Cognitive defense increases by 2. If you later acquire a talent that grants forms of power, you can use Change Form to attract a Voidspren. While bonded with a Voidspren, once per day when you gain a Complication on a test you must succeed on a DC 15 Discipline test or become Stunned until the end of your next turn. You automatically succeed on this test if you've sworn the First Ideal of a Radiant order.",
                            "requiresTalent": [
                                [
                                    "forms_of_finesse",
                                    "forms_of_resolve",
                                    "forms_of_wisdom"
                                ]
                            ]
                        },
                        {
                            "id": "forms_of_destruction",
                            "name": "Forms of Destruction",
                            "prerequisite": "Ambitious Mind talent",
                            "activation": "special",
                            "description": "You gain two new forms of power — direform and stormform — which you can transform into using Change Form. Direform (callousspren bond): Strength +2, deflect +2 (doesn't stack with worn armor); when a character triggers a Reactive Strike from you, you can use that reaction to attempt to Grapple them instead of attacking (still spending 1 focus). Stormform (stormspren bond): Strength +1, Speed +1, deflect +1 (doesn't stack with worn armor); you gain Unleash Lightning — spend 1 focus or 1 Investiture to make a ranged Discipline attack (60 ft) vs. Physical defense, dealing 2d8 energy damage and Disorienting on a hit (2d10 at 4 Discipline ranks, 2d12 at 5+).",
                            "requiresTalent": [
                                "ambitious_mind"
                            ]
                        },
                        {
                            "id": "forms_of_expansion",
                            "name": "Forms of Expansion",
                            "prerequisite": "Ambitious Mind talent",
                            "activation": "special",
                            "description": "You gain two new forms of power — envoyform and relayform — which you can transform into using Change Form. Envoyform (zealspren bond): Intellect +1, Presence +1; you speak, read, write, and understand all languages, and gain advantage on Insight tests to interpret others' desires or intentions. Relayform (hastespren bond): Speed +2, ignore the Slowed condition; you can spend 1 focus to gain advantage on an Agility, Stealth, or Thievery test.",
                            "requiresTalent": [
                                "ambitious_mind"
                            ]
                        },
                        {
                            "id": "forms_of_mystery",
                            "name": "Forms of Mystery",
                            "prerequisite": "Ambitious Mind talent",
                            "activation": "special",
                            "description": "You gain two new forms of power — decayform and nightform — which you can transform into using Change Form. Decayform (blightspren bond): Willpower +2; you gain Decaying Touch — spend 1 focus or 1 Investiture before a character within reach recovers health or focus to prevent that recovery (resources spent are still spent). Nightform (nightspren bond): Awareness +1, Intellect +1; while in this form, your maximum focus and current focus both increase by 2 (and decrease by 2 when you leave the form). You also gain Intervening Premonitions (preroll two d20s each session and use them to replace enemy or willing-ally rolls) and Sporadic Premonitions (the GM may grant unpredictable glimpses of the future).",
                            "requiresTalent": [
                                "ambitious_mind"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "cultures": [
        {
            "id": "alethi",
            "name": "Alethi",
            "expertises": [
                "alethi"
            ]
        },
        {
            "id": "azish",
            "name": "Azish",
            "expertises": [
                "azish"
            ]
        },
        {
            "id": "veden",
            "name": "Veden",
            "expertises": [
                "veden"
            ]
        },
        {
            "id": "thaylen",
            "name": "Thaylen",
            "expertises": [
                "thaylen"
            ]
        },
        {
            "id": "kharbranthian",
            "name": "Kharbranthian",
            "expertises": [
                "kharbranthian"
            ]
        },
        {
            "id": "unkalaki",
            "name": "Unkalaki (Horneater)",
            "expertises": [
                "unkalaki"
            ]
        },
        {
            "id": "listener",
            "name": "Listener",
            "expertises": [
                "listener"
            ]
        },
        {
            "id": "reshi",
            "name": "Reshi",
            "expertises": [
                "reshi"
            ]
        },
        {
            "id": "herdazian",
            "name": "Herdazian",
            "expertises": [
                "herdazian"
            ]
        },
        {
            "id": "wayfarer",
            "name": "Wayfarer",
            "expertises": [
                "wayfarer"
            ]
        },
        {
            "id": "high_society",
            "name": "High Society",
            "expertises": [
                "high_society"
            ]
        },
        {
            "id": "military_life",
            "name": "Military Life",
            "expertises": [
                "military_life"
            ]
        }
    ],
    "conditions": [
        {
            "id": "blinded",
            "name": "Blinded",
            "description": "Cannot see. Attacks against you gain advantage, your attacks gain disadvantage."
        },
        {
            "id": "deafened",
            "name": "Deafened",
            "description": "Cannot hear. Disadvantage on Perception tests that rely on hearing."
        },
        {
            "id": "frightened",
            "name": "Frightened",
            "description": "Disadvantage on attacks and tests while source of fear is in line of sight."
        },
        {
            "id": "immobilized",
            "name": "Immobilized",
            "description": "Speed becomes 0. Cannot Move or use movement."
        },
        {
            "id": "prone",
            "name": "Prone",
            "description": "Melee attacks against you gain advantage. Ranged attacks gain disadvantage. Moving requires half movement to stand."
        },
        {
            "id": "restrained",
            "name": "Restrained",
            "description": "Speed becomes 0. Attacks gain disadvantage. Attacks against you gain advantage."
        },
        {
            "id": "slowed",
            "name": "Slowed",
            "description": "Movement is halved."
        },
        {
            "id": "stunned",
            "name": "Stunned",
            "description": "Cannot take actions or reactions. Attacks against you gain advantage."
        },
        {
            "id": "unconscious",
            "name": "Unconscious",
            "description": "Cannot take actions. Drop items. Attacks against you gain advantage and auto-crit within 5 feet."
        }
    ]
});
})();
