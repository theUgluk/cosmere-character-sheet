/**
 * Cosmere RPG Equipment & Kits Data
 * Item trait glossary, weapons, armor, currency, general equipment, and starting kits.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "itemTraitGlossary": {
        "Defensive": "While wielding/wearing this, you can use the Brace action without cover nearby.",
        "Deadly": "On a hit, spend focus to cause the target to immediately suffer an injury.",
        "Offhand": "While wielded in your offhand, the Strike action costs 1 focus instead of 2.",
        "Momentum": "If you moved at least 10 ft in a straight line toward your target this turn, gain advantage on the attack.",
        "Quickdraw": "You can use the Interact action to draw this weapon as a free reaction.",
        "Indirect": "Arc shots over cover and obscuring terrain. Target can't benefit from the Brace action vs. these attacks.",
        "Pierce": "This weapon's damage cannot be reduced by the target's deflect value.",
        "Two-Handed": "Must be wielded with two hands.",
        "Presentable": "Acceptable in polite, non-military contexts; doesn't draw undue attention.",
        "Discreet": "Advantage on tests to disguise, hide, or keep this weapon (in non-combat scenes).",
        "Dangerous": "GM can spend a Complication to also graze an ally within reach (weapons) or injure a nearby ally (armor).",
        "Fragile": "GM can spend a Complication after an attack to break this weapon.",
        "Always Available": "Doesn't count as a weapon attack; can never be disarmed of it.",
        "Indirect (specialist)": "Arc shots over cover; target can't Brace.",
        "Loaded [1]": "Stores 1 shot of ammunition; reload action required between ranged attacks.",
        "Cumbersome [3]": "If your Strength < 3, you are Slowed and have disadvantage on attacks (weapon) or all SPD-based tests (armor) while using this.",
        "Cumbersome [4]": "If your Strength < 4, you are Slowed and have disadvantage on attacks (weapon) or all SPD-based tests (armor) while using this.",
        "Cumbersome [5]": "If your Strength < 5, you are Slowed and have disadvantage on attacks (weapon) or all SPD-based tests (armor) while using this."
    },
    "weapons": {
        "light": [
            {
                "id": "javelin",
                "name": "Javelin",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Thrown [30/120]"
                ],
                "weight": 2,
                "price": 20,
                "expertTraits": [
                    "Indirect"
                ]
            },
            {
                "id": "knife",
                "name": "Knife",
                "skill": "light_weaponry",
                "damage": "1d4",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Discreet"
                ],
                "weight": 1,
                "price": 8,
                "expertTraits": [
                    "Offhand",
                    "Thrown [20/60]"
                ]
            },
            {
                "id": "mace",
                "name": "Mace",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "impact",
                "range": "Melee",
                "traits": [],
                "weight": 3,
                "price": 20,
                "expertTraits": [
                    "Momentum"
                ]
            },
            {
                "id": "rapier",
                "name": "Rapier",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Quickdraw"
                ],
                "weight": 2,
                "price": 100,
                "expertTraits": [
                    "Defensive"
                ]
            },
            {
                "id": "shortspear",
                "name": "Shortspear",
                "skill": "light_weaponry",
                "damage": "1d8",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 3,
                "price": 10,
                "expertTraits": [
                    "Loses Two-Handed"
                ]
            },
            {
                "id": "sidesword",
                "name": "Sidesword",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Quickdraw"
                ],
                "weight": 2,
                "price": 40,
                "expertTraits": [
                    "Offhand"
                ]
            },
            {
                "id": "staff",
                "name": "Staff",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "impact",
                "range": "Melee",
                "traits": [
                    "Discreet",
                    "Two-Handed"
                ],
                "weight": 4,
                "price": 1,
                "expertTraits": [
                    "Defensive"
                ]
            },
            {
                "id": "shortbow",
                "name": "Shortbow",
                "skill": "light_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Ranged [80/320]",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 2,
                "price": 80,
                "expertTraits": [
                    "Quickdraw"
                ]
            },
            {
                "id": "sling",
                "name": "Sling",
                "skill": "light_weaponry",
                "damage": "1d4",
                "damageType": "impact",
                "range": "Ranged [30/120]",
                "traits": [
                    "Discreet"
                ],
                "weight": 1,
                "price": 2,
                "expertTraits": [
                    "Indirect"
                ]
            }
        ],
        "heavy": [
            {
                "id": "axe",
                "name": "Axe",
                "skill": "heavy_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Thrown [20/60]"
                ],
                "weight": 2,
                "price": 20,
                "expertTraits": [
                    "Offhand"
                ]
            },
            {
                "id": "greatsword",
                "name": "Greatsword",
                "skill": "heavy_weaponry",
                "damage": "1d10",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 7,
                "price": 200,
                "expertTraits": [
                    "Deadly"
                ]
            },
            {
                "id": "hammer",
                "name": "Hammer",
                "skill": "heavy_weaponry",
                "damage": "1d10",
                "damageType": "impact",
                "range": "Melee",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 8,
                "price": 40,
                "expertTraits": [
                    "Momentum"
                ]
            },
            {
                "id": "longspear",
                "name": "Longspear",
                "skill": "heavy_weaponry",
                "damage": "1d8",
                "damageType": "keen",
                "range": "Melee [+5]",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 9,
                "price": 15,
                "expertTraits": [
                    "Defensive"
                ]
            },
            {
                "id": "longsword",
                "name": "Longsword",
                "skill": "heavy_weaponry",
                "damage": "1d8",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Quickdraw",
                    "Two-Handed"
                ],
                "weight": 3,
                "price": 60,
                "expertTraits": [
                    "Loses Two-Handed"
                ]
            },
            {
                "id": "poleaxe",
                "name": "Poleaxe",
                "skill": "heavy_weaponry",
                "damage": "1d10",
                "damageType": "keen",
                "range": "Melee",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 5,
                "price": 40,
                "expertTraits": [
                    "Adds 5 ft reach"
                ]
            },
            {
                "id": "shield",
                "name": "Shield",
                "skill": "heavy_weaponry",
                "damage": "1d4",
                "damageType": "impact",
                "range": "Melee",
                "traits": [
                    "Defensive"
                ],
                "weight": 2,
                "price": 10,
                "expertTraits": [
                    "Offhand"
                ]
            },
            {
                "id": "crossbow",
                "name": "Crossbow",
                "skill": "heavy_weaponry",
                "damage": "1d8",
                "damageType": "keen",
                "range": "Ranged [100/400]",
                "traits": [
                    "Loaded [1]",
                    "Two-Handed"
                ],
                "weight": 7,
                "price": 200,
                "expertTraits": [
                    "Deadly"
                ]
            },
            {
                "id": "longbow",
                "name": "Longbow",
                "skill": "heavy_weaponry",
                "damage": "1d6",
                "damageType": "keen",
                "range": "Ranged [150/600]",
                "traits": [
                    "Two-Handed"
                ],
                "weight": 3,
                "price": 100,
                "expertTraits": [
                    "Indirect"
                ]
            }
        ],
        "special": [
            {
                "id": "unarmed",
                "name": "Unarmed Attack",
                "skill": "athletics",
                "damage": "Variable",
                "damageType": "impact",
                "range": "Melee",
                "traits": [
                    "Always Available"
                ],
                "weight": 0,
                "price": 0,
                "expertTraits": [
                    "Momentum",
                    "Offhand"
                ]
            },
            {
                "id": "improvised",
                "name": "Improvised Weapon",
                "skill": "variable",
                "damage": "Variable",
                "damageType": "variable",
                "range": "Variable",
                "traits": [
                    "Fragile"
                ],
                "weight": 0,
                "price": 0,
                "expertTraits": [
                    "As similar weapon"
                ]
            }
        ]
    },
    "armor": [
        {
            "id": "uniform",
            "name": "Uniform",
            "deflect": 0,
            "traits": [
                "Presentable"
            ],
            "expertTraits": [],
            "weight": 5,
            "price": 40,
            "strengthRequired": 0
        },
        {
            "id": "leather",
            "name": "Leather",
            "deflect": 1,
            "traits": [],
            "expertTraits": [
                "Presentable"
            ],
            "weight": 10,
            "price": 60,
            "strengthRequired": 0
        },
        {
            "id": "chain",
            "name": "Chain",
            "deflect": 2,
            "traits": [
                "Cumbersome [3]"
            ],
            "expertTraits": [
                "Loses Cumbersome"
            ],
            "weight": 25,
            "price": 80,
            "strengthRequired": 3
        },
        {
            "id": "breastplate",
            "name": "Breastplate",
            "deflect": 2,
            "traits": [
                "Cumbersome [3]"
            ],
            "expertTraits": [
                "Presentable"
            ],
            "weight": 30,
            "price": 120,
            "strengthRequired": 3
        },
        {
            "id": "half_plate",
            "name": "Half Plate",
            "deflect": 3,
            "traits": [
                "Cumbersome [4]"
            ],
            "expertTraits": [
                "Cumbersome [3] instead"
            ],
            "weight": 40,
            "price": 400,
            "strengthRequired": 4
        },
        {
            "id": "full_plate",
            "name": "Full Plate",
            "deflect": 4,
            "traits": [
                "Cumbersome [5]"
            ],
            "expertTraits": [],
            "weight": 55,
            "price": 1600,
            "strengthRequired": 5
        }
    ],
    "currency": {
        "denominations": [
            {
                "id": "chip",
                "name": "Chip",
                "value": 0.05
            },
            {
                "id": "mark",
                "name": "Mark",
                "value": 1
            },
            {
                "id": "broam",
                "name": "Broam",
                "value": 20
            }
        ]
    },
    "equipment": [
        {
            "name": "Alcohol (1 serving)",
            "weight": 0.2,
            "price": 0.5,
            "category": "Consumables"
        },
        {
            "name": "Alcohol (bottle)",
            "weight": 3,
            "price": 10,
            "category": "Consumables"
        },
        {
            "name": "Anesthetic (1 dose)",
            "weight": 0.3,
            "price": 15,
            "category": "Medical"
        },
        {
            "name": "Antiseptic (potent, 1 dose)",
            "weight": 0.2,
            "price": 10,
            "category": "Medical"
        },
        {
            "name": "Antiseptic (weak, 1 dose)",
            "weight": 0.2,
            "price": 5,
            "category": "Medical"
        },
        {
            "name": "Backpack",
            "weight": 5,
            "price": 8,
            "category": "Containers"
        },
        {
            "name": "Barrel",
            "weight": 70,
            "price": 15,
            "category": "Containers"
        },
        {
            "name": "Blanket",
            "weight": 2,
            "price": 2,
            "category": "Camping"
        },
        {
            "name": "Book (reference)",
            "weight": 3,
            "price": 100,
            "category": "Tools"
        },
        {
            "name": "Bottle (crem)",
            "weight": 3,
            "price": 0.5,
            "category": "Containers"
        },
        {
            "name": "Bottle (glass)",
            "weight": 2,
            "price": 1,
            "category": "Containers"
        },
        {
            "name": "Bucket",
            "weight": 2,
            "price": 1,
            "category": "Containers"
        },
        {
            "name": "Candle",
            "weight": 0.2,
            "price": 0.2,
            "category": "Light"
        },
        {
            "name": "Case (leather)",
            "weight": 1,
            "price": 4,
            "category": "Containers"
        },
        {
            "name": "Chain (thick, 1 foot)",
            "weight": 1,
            "price": 2,
            "category": "Tools"
        },
        {
            "name": "Chain (thin, 1 foot)",
            "weight": 0.5,
            "price": 20,
            "category": "Tools"
        },
        {
            "name": "Chest",
            "weight": 25,
            "price": 30,
            "category": "Containers"
        },
        {
            "name": "Clothing (common)",
            "weight": 3,
            "price": 2,
            "category": "Clothing"
        },
        {
            "name": "Clothing (fine)",
            "weight": 6,
            "price": 100,
            "category": "Clothing"
        },
        {
            "name": "Clothing (ragged)",
            "weight": 1.5,
            "price": 0.5,
            "category": "Clothing"
        },
        {
            "name": "Crowbar",
            "weight": 3,
            "price": 10,
            "category": "Tools"
        },
        {
            "name": "Ear trumpet",
            "weight": 1,
            "price": 50,
            "category": "Tools"
        },
        {
            "name": "Flask or tankard",
            "weight": 1,
            "price": 1,
            "category": "Containers"
        },
        {
            "name": "Flint and steel",
            "weight": 1.5,
            "price": 4,
            "category": "Tools"
        },
        {
            "name": "Food (ration, 1 day)",
            "weight": 0.5,
            "price": 0.2,
            "category": "Consumables"
        },
        {
            "name": "Food (street, 1 day)",
            "weight": 1.5,
            "price": 3,
            "category": "Consumables"
        },
        {
            "name": "Food (fine, 1 day)",
            "weight": 0.5,
            "price": 25,
            "category": "Consumables"
        },
        {
            "name": "Grappling hook",
            "weight": 4,
            "price": 10,
            "category": "Tools"
        },
        {
            "name": "Hammer (handheld)",
            "weight": 3,
            "price": 4,
            "category": "Tools"
        },
        {
            "name": "Ink (1-ounce bottle)",
            "weight": 0.2,
            "price": 40,
            "category": "Writing"
        },
        {
            "name": "Ink pen",
            "weight": 0.1,
            "price": 0.1,
            "category": "Writing"
        },
        {
            "name": "Jug or pitcher",
            "weight": 4,
            "price": 2,
            "category": "Containers"
        },
        {
            "name": "Ladder (10-foot)",
            "weight": 20,
            "price": 5,
            "category": "Tools"
        },
        {
            "name": "Lantern (oil)",
            "weight": 2,
            "price": 20,
            "category": "Light"
        },
        {
            "name": "Lantern (sphere)",
            "weight": 2,
            "price": 20,
            "category": "Light"
        },
        {
            "name": "Lock and key",
            "weight": 1,
            "price": 50,
            "category": "Tools"
        },
        {
            "name": "Lockpick",
            "weight": 0.5,
            "price": 5,
            "category": "Tools"
        },
        {
            "name": "Magnifying lens",
            "weight": 0.2,
            "price": 400,
            "category": "Tools"
        },
        {
            "name": "Manacles",
            "weight": 6,
            "price": 10,
            "category": "Tools"
        },
        {
            "name": "Mirror (handheld)",
            "weight": 2,
            "price": 25,
            "category": "Tools"
        },
        {
            "name": "Musical instrument",
            "weight": 5,
            "price": 20,
            "category": "Tools"
        },
        {
            "name": "Net (hunting)",
            "weight": 5,
            "price": 4,
            "category": "Tools"
        },
        {
            "name": "Net (fishing)",
            "weight": 15,
            "price": 10,
            "category": "Tools"
        },
        {
            "name": "Oil (1 flask)",
            "weight": 1,
            "price": 1,
            "category": "Consumables"
        },
        {
            "name": "Paper or parchment (1 sheet)",
            "weight": 0.1,
            "price": 0.5,
            "category": "Writing"
        },
        {
            "name": "Perfume (1 vial)",
            "weight": 0.5,
            "price": 20,
            "category": "Consumables"
        },
        {
            "name": "Pick (mining)",
            "weight": 10,
            "price": 10,
            "category": "Tools"
        },
        {
            "name": "Poison (weak, 1 dose)",
            "weight": 0.2,
            "price": 20,
            "category": "Consumables"
        },
        {
            "name": "Poison (effectual, 1 dose)",
            "weight": 0.2,
            "price": 50,
            "category": "Consumables"
        },
        {
            "name": "Poison (potent, 1 dose)",
            "weight": 0.2,
            "price": 120,
            "category": "Consumables"
        },
        {
            "name": "Pot (iron)",
            "weight": 10,
            "price": 8,
            "category": "Camping"
        },
        {
            "name": "Pouch",
            "weight": 1,
            "price": 1,
            "category": "Containers"
        },
        {
            "name": "Pulley system",
            "weight": 12,
            "price": 100,
            "category": "Tools"
        },
        {
            "name": "Rope (1 foot)",
            "weight": 0.1,
            "price": 0.6,
            "category": "Tools"
        },
        {
            "name": "Sack",
            "weight": 0.5,
            "price": 0.2,
            "category": "Containers"
        },
        {
            "name": "Scale",
            "weight": 3,
            "price": 20,
            "category": "Tools"
        },
        {
            "name": "Shovel",
            "weight": 5,
            "price": 8,
            "category": "Tools"
        },
        {
            "name": "Soap",
            "weight": 0.1,
            "price": 1,
            "category": "Consumables"
        },
        {
            "name": "Spyglass",
            "weight": 1,
            "price": 500,
            "category": "Tools"
        },
        {
            "name": "Surgical supplies",
            "weight": 3,
            "price": 20,
            "category": "Medical"
        },
        {
            "name": "Tent (two-person)",
            "weight": 20,
            "price": 10,
            "category": "Camping"
        },
        {
            "name": "Treatment (medical, 1 dose)",
            "weight": 0.2,
            "price": 10,
            "category": "Medical"
        },
        {
            "name": "Tuning fork",
            "weight": 0.5,
            "price": 50,
            "category": "Tools"
        },
        {
            "name": "Unencased gem (infused)",
            "weight": 0.01,
            "price": 2,
            "category": "Consumables"
        },
        {
            "name": "Vial (glass)",
            "weight": 0.2,
            "price": 4,
            "category": "Containers"
        },
        {
            "name": "Waterskin",
            "weight": 1,
            "price": 1,
            "category": "Camping"
        },
        {
            "name": "Wax (1 block)",
            "weight": 0.5,
            "price": 2,
            "category": "Consumables"
        },
        {
            "name": "Whetstone",
            "weight": 1,
            "price": 0.2,
            "category": "Tools"
        }
    ],
    "startingKits": [
        {
            "id": "academic",
            "name": "Academic Kit",
            "weapons": [
                "One knife, sling, or staff"
            ],
            "armor": "uniform",
            "equipment": [
                "Backpack",
                { "label": "Common clothing", "item": "Clothing (common)", "quantity": 1 },
                "Ink pen",
                { "label": "Bottle of ink", "item": "Ink (1-ounce bottle)", "quantity": 1 },
                { "label": "10 sheets of paper", "item": "Paper or parchment (1 sheet)", "quantity": 10 },
                { "label": "3 empty vials", "item": "Vial (glass)", "quantity": 3 },
                { "label": "Block of wax", "item": "Wax (1 block)", "quantity": 1 },
                { "label": "Reference book (topic of choice)", "item": "Book (reference)", "quantity": 1, "note": "Topic of choice" },
                { "label": "1 dose of weak poison", "item": "Poison (weak, 1 dose)", "quantity": 1 }
            ],
            "currency": {
                "dice": "3d12",
                "type": "marks"
            },
            "bonuses": {
                "expertise": "Literature (or cultural/utility expertise if already known)"
            },
            "description": "For scholars and students"
        },
        {
            "id": "artisan",
            "name": "Artisan Kit",
            "weapons": [
                "One hammer or light weapon (your choice)"
            ],
            "armor": "leather",
            "equipment": [
                "Chest",
                { "label": "Common clothing", "item": "Clothing (common)", "quantity": 1 },
                "Surgical supplies",
                { "label": "5 doses of weak antiseptic", "item": "Antiseptic (weak, 1 dose)", "quantity": 5 },
                "Ink pen",
                { "label": "Bottle of ink", "item": "Ink (1-ounce bottle)", "quantity": 1 },
                { "label": "5 sheets of parchment", "item": "Paper or parchment (1 sheet)", "quantity": 5 },
                { "label": "5 candles", "item": "Candle", "quantity": 5 },
                "Flint and steel",
                { "label": "3 empty glass bottles", "item": "Bottle (glass)", "quantity": 3 },
                "Tuning fork",
                { "label": "Musical instrument (of choice)", "item": "Musical instrument", "quantity": 1, "note": "Of choice" },
                "Scale"
            ],
            "currency": {
                "dice": "4d8",
                "type": "marks"
            },
            "description": "For craftsmen and artisans"
        },
        {
            "id": "military",
            "name": "Military Kit",
            "weapons": [
                "Two non-special weapons"
            ],
            "armor": "uniform and chain",
            "equipment": [
                "Backpack",
                { "label": "Common clothing", "item": "Clothing (common)", "quantity": 1 },
                "Waterskin",
                "Flint and steel",
                "Whetstone",
                "Blanket",
                { "label": "10 days of food rations", "item": "Food (ration, 1 day)", "quantity": 10 }
            ],
            "currency": {
                "dice": "2d6",
                "type": "marks"
            },
            "description": "For soldiers and guards"
        },
        {
            "id": "courtier",
            "name": "Courtier Kit",
            "weapons": [
                "One sidesword, greatsword, longsword, or longbow"
            ],
            "armor": "none",
            "equipment": [
                { "label": "Alcohol (bottle of violet wine)", "item": "Alcohol (bottle)", "quantity": 1, "note": "Violet wine" },
                { "label": "Fine clothing", "item": "Clothing (fine)", "quantity": 1 }
            ],
            "currency": {
                "dice": "4d20",
                "type": "marks"
            },
            "bonuses": {
                "connection": "Patron of noble house (provides accommodations and standard of living)"
            },
            "description": "For nobles and diplomats"
        },
        {
            "id": "prisoner",
            "name": "Prisoner Kit",
            "weapons": [],
            "armor": "none",
            "equipment": [
                "Manacles",
                { "label": "Ragged clothing", "item": "Clothing (ragged)", "quantity": 1 }
            ],
            "currency": {
                "dice": "0",
                "type": "marks"
            },
            "bonuses": {
                "connection": "Radiant spren (choose spren type with GM, gain 2 progress boxes on 'Speak the First Ideal' goal if you choose this Order's key talent)"
            },
            "description": "For characters starting in captivity"
        },
        {
            "id": "underworld",
            "name": "Underworld Kit",
            "weapons": [
                "Two light weapons"
            ],
            "armor": "leather",
            "equipment": [
                "Backpack",
                { "label": "Common clothing", "item": "Clothing (common)", "quantity": 1 },
                { "label": "Alcohol (bottle of Horneater white)", "item": "Alcohol (bottle)", "quantity": 1, "note": "Horneater white" },
                "Crowbar",
                "Lockpick",
                { "label": "50 feet of rope", "item": "Rope (1 foot)", "quantity": 50 },
                "Flint and steel",
                { "label": "Oil lantern", "item": "Lantern (oil)", "quantity": 1 },
                { "label": "Flask of oil", "item": "Oil (1 flask)", "quantity": 1 },
                { "label": "5 days of street food", "item": "Food (street, 1 day)", "quantity": 5 }
            ],
            "currency": {
                "dice": "1d20",
                "type": "marks"
            },
            "description": "For thieves and criminals"
        }
    ]
});
})();
