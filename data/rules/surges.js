/**
 * Cosmere RPG Surges Data
 * All 10 Surges, linked attributes, and surge talent trees.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "surges": {
        "abrasion": {
            "name": "Abrasion",
            "attribute": "speed",
            "orders": [
                "dustbringer",
                "edgedancer"
            ],
            "description": "Alters the frictional force on an object's surface",
            "baseAbility": "Spend 1 Investiture or more to infuse an object or surface, making it frictionless. Alternatively, infuse yourself to use Skate (move fast in straight line) and Slide (squeeze through spaces easier).",
            "talents": [
                {
                    "id": "frictionless_motion",
                    "name": "Frictionless Motion",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "always",
                    "description": "While infused with Abrasion, your movement rate increases by 10 feet, and you ignore the Slowed condition when imposed by difficult terrain, climbing, crawling, and swimming."
                },
                {
                    "id": "reverse_abrasion",
                    "name": "Reverse Abrasion",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "You can increase friction instead of reducing it. Infused targets give an advantage on Agility and Athletics tests and ignore Slowed conditions from surfaces."
                },
                {
                    "id": "graceful_skating",
                    "name": "Graceful Skating",
                    "prerequisite": "Frictionless Motion talent",
                    "activation": "free_action",
                    "description": "When you Skate, you aren't restricted to moving in a straight line.",
                    "requiresTalent": [
                        "frictionless_motion"
                    ]
                },
                {
                    "id": "stormlight_reclamation",
                    "name": "Stormlight Reclamation",
                    "prerequisite": "Reverse Abrasion talent",
                    "activation": "free_action",
                    "description": "At the start of your turn, you can end any number of infusions within your reach to regain their remaining Investiture.",
                    "requiresTalent": [
                        "reverse_abrasion"
                    ]
                },
                {
                    "id": "slippery_target",
                    "name": "Slippery Target",
                    "prerequisite": "Graceful Skating talent",
                    "activation": "always",
                    "description": "While infused with Abrasion, attacks can't graze you and Reactive Strikes against you gain a disadvantage.",
                    "requiresTalent": [
                        "graceful_skating"
                    ]
                },
                {
                    "id": "distant_surgebinding",
                    "name": "Distant Surgebinding",
                    "prerequisite": "Reverse Abrasion talent",
                    "activation": "always",
                    "description": "You can use your surges and their talents as though your reach is 20 feet, and you don't need to touch the target.",
                    "requiresTalent": [
                        "reverse_abrasion"
                    ]
                },
                {
                    "id": "slick_combatant",
                    "name": "Slick Combatant",
                    "prerequisite": "Slippery Target talent",
                    "activation": "special",
                    "description": "While infused with Abrasion, you can interrupt a Move with other actions. Once per round, deal extra damage (scaling with Abrasion ranks) on a mid-movement attack.",
                    "requiresTalent": [
                        "slippery_target"
                    ]
                },
                {
                    "id": "smooth_operator",
                    "name": "Smooth Operator",
                    "prerequisite": "Distant Surgebinding talent or Slippery Target talent",
                    "activation": "always",
                    "description": "While you have Investiture, you are infused with Abrasion without spending Investiture, and it costs you 1 fewer focus to Skate.",
                    "requiresTalent": [
                        [
                            "distant_surgebinding",
                            "slippery_target"
                        ]
                    ]
                }
            ]
        },
        "adhesion": {
            "name": "Adhesion",
            "attribute": "presence",
            "orders": [
                "bondsmith",
                "windrunner"
            ],
            "description": "Binds things together through Full Lashing",
            "baseAbility": "Spend 1 Investiture to perform a Full Lashing, sticking two objects or an object to a surface together. The objects must be within reach and 5 feet of each other.",
            "talents": [
                {
                    "id": "binding_strike",
                    "name": "Binding Strike",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "special",
                    "description": "After hitting with a melee attack, spend 2 focus or an Opportunity to use Adhesion without spending an action. Automatically succeed on the test."
                },
                {
                    "id": "stormlight_reclamation_adhesion",
                    "name": "Stormlight Reclamation",
                    "prerequisite": "Reverse Abrasion talent",
                    "activation": "free_action",
                    "description": "At the start of your turn, you can end any number of infusions within your reach to regain their remaining Investiture."
                },
                {
                    "id": "binding_shot",
                    "name": "Binding Shot",
                    "prerequisite": "Binding Strike talent",
                    "activation": "special",
                    "description": "You can use Binding Strike when you hit with a ranged attack at any distance.",
                    "requiresTalent": [
                        "binding_strike"
                    ]
                },
                {
                    "id": "adhesive_trap",
                    "name": "Adhesive Trap",
                    "prerequisite": "Binding Shot talent",
                    "activation": "1_action",
                    "description": "Infuse a surface with Adhesion. Characters who touch it become Fully Lashed to it automatically.",
                    "requiresTalent": [
                        "binding_shot"
                    ]
                },
                {
                    "id": "distant_surgebinding_adhesion",
                    "name": "Distant Surgebinding",
                    "prerequisite": "Stormlight Reclamation talent",
                    "activation": "always",
                    "description": "Use your surges and their talents as though your reach is 20 feet, and you don't need to touch the target.",
                    "requiresTalent": [
                        "stormlight_reclamation_adhesion"
                    ]
                },
                {
                    "id": "extended_adhesion",
                    "name": "Extended Adhesion",
                    "prerequisite": "Distant Surgebinding talent",
                    "activation": "always",
                    "description": "Full Lashings expend 1 Investiture per number of rounds equal to your ranks in Adhesion (e.g., 3 ranks = every 3 rounds).",
                    "requiresTalent": [
                        "distant_surgebinding_adhesion"
                    ]
                },
                {
                    "id": "superior_bond",
                    "name": "Superior Bond",
                    "prerequisite": "Adhesive Trap talent or Extended Adhesion talent",
                    "activation": "always",
                    "description": "Automatically succeed on opposed tests to maintain Full Lashings against characters with Strength no higher than your ranks in Adhesion.",
                    "requiresTalent": [
                        [
                            "adhesive_trap",
                            "extended_adhesion"
                        ]
                    ]
                },
                {
                    "id": "living_adhesion",
                    "name": "Living Adhesion",
                    "prerequisite": "Extended Adhesion talent",
                    "activation": "1_action",
                    "description": "You can use Adhesion on characters. When Lashed to something larger, they become Restrained, gain disadvantage on physical tests, and attacks against them gain advantage.",
                    "requiresTalent": [
                        "extended_adhesion"
                    ]
                }
            ]
        },
        "cohesion": {
            "name": "Cohesion",
            "attribute": "willpower",
            "orders": [
                "stoneward",
                "willshaper"
            ],
            "description": "Mold stone as if it were clay (Stoneshaping)",
            "baseAbility": "Spend 1 Investiture to infuse stone within reach, making it moldable and soft like clay. You can reshape it immediately or with additional actions for intricate work.",
            "talents": [
                {
                    "id": "stone_spear",
                    "name": "Stone Spear",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to make a ranged Cohesion attack vs. Physical of a target within 60 feet, rolling 2d4 impact damage (scales with ranks)."
                },
                {
                    "id": "memories_of_stone",
                    "name": "Memories of Stone",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to communicate with stone you're touching, gaining visions of its history and memories."
                },
                {
                    "id": "sinkhole",
                    "name": "Sinkhole",
                    "prerequisite": "Stone Spear talent",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to test Cohesion vs. Cognitive of targets on stone ground. On success, they sink and become Immobilized.",
                    "requiresTalent": [
                        "stone_spear"
                    ]
                },
                {
                    "id": "tunneling",
                    "name": "Tunneling",
                    "prerequisite": "Sinkhole talent",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to move through stone as if through difficult terrain, leaving a 5-foot tunnel behind you.",
                    "requiresTalent": [
                        "sinkhole"
                    ]
                },
                {
                    "id": "through_the_stone",
                    "name": "Through the Stone",
                    "prerequisite": "Sinkhole talent",
                    "activation": "always",
                    "description": "Use your surges and their talents as though your reach is 20 feet, as long as there's a stone surface between you and your target.",
                    "requiresTalent": [
                        "sinkhole"
                    ]
                },
                {
                    "id": "true_stoneshaping",
                    "name": "True Stoneshaping",
                    "prerequisite": "Cohesion 2+; Tunneling talent",
                    "activation": "always",
                    "description": "Intricately and extensively shape stone without using additional actions or time.",
                    "requiresTalent": [
                        "tunneling"
                    ]
                },
                {
                    "id": "flowing_earth",
                    "name": "Flowing Earth",
                    "prerequisite": "True Stoneshaping talent",
                    "activation": "special",
                    "description": "After using Cohesion, shape the stone beneath your feet, pushing yourself in any direction up to 5 feet × your ranks in Cohesion.",
                    "requiresTalent": [
                        "true_stoneshaping"
                    ]
                },
                {
                    "id": "unbound_cohesion",
                    "name": "Unbound Cohesion",
                    "prerequisite": "Cohesion 4+; Through the Stone talent",
                    "activation": "always",
                    "description": "Use Cohesion on any solid material that isn't alive, Invested, or infused with Stormlight.",
                    "requiresTalent": [
                        "through_the_stone"
                    ]
                }
            ]
        },
        "division": {
            "name": "Division",
            "attribute": "intellect",
            "orders": [
                "dustbringer",
                "skybreaker"
            ],
            "description": "Destroy and decay targets, causing them to crumble or burn",
            "baseAbility": "Target a character (melee Division attack vs. Spiritual for 3d4 spirit damage, scales with ranks), or destroy an object/area (spend 1+ Investiture to destroy/decay materials).",
            "talents": [
                {
                    "id": "bodily_decay",
                    "name": "Bodily Decay",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "special",
                    "description": "When you hit with a Division attack, you can spend an Opportunity to cause one target to suffer an injury."
                },
                {
                    "id": "eroding_escape",
                    "name": "Eroding Escape",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 or more Investiture to end that many effects inflicting the Restrained or Immobilized condition."
                },
                {
                    "id": "igniting_division",
                    "name": "Igniting Division",
                    "prerequisite": "Bodily Decay talent",
                    "activation": "special",
                    "description": "When you use Division, spend 1 or more Investiture to light the target's space on fire, dealing ongoing damage equal to your Division modifier.",
                    "requiresTalent": [
                        "bodily_decay"
                    ]
                },
                {
                    "id": "spark_sending",
                    "name": "Spark Sending",
                    "prerequisite": "Bodily Decay talent or Eroding Escape talent",
                    "activation": "always",
                    "description": "When there's a solid surface between you and target, use Division as though your reach is 20 feet.",
                    "requiresTalent": [
                        [
                            "bodily_decay",
                            "eroding_escape"
                        ]
                    ]
                },
                {
                    "id": "gout_of_flame",
                    "name": "Gout of Flame",
                    "prerequisite": "Igniting Division talent",
                    "activation": "1_action",
                    "description": "Spend 3 Investiture to make a Division attack vs. Physical against each target in an area one size larger than normal.",
                    "requiresTalent": [
                        "igniting_division"
                    ]
                },
                {
                    "id": "inescapable_spark",
                    "name": "Inescapable Spark",
                    "prerequisite": "Spark Sending talent",
                    "activation": "always",
                    "description": "Spark Sending extends to your spren bond range. You don't need line of effect when you can sense your target, and they can't Brace against your Division.",
                    "requiresTalent": [
                        "spark_sending"
                    ]
                },
                {
                    "id": "devastating_division",
                    "name": "Devastating Division",
                    "prerequisite": "Gout of Flame talent",
                    "activation": "always",
                    "description": "When you roll damage for Division or its talents, roll an additional damage die of the same size.",
                    "requiresTalent": [
                        "gout_of_flame"
                    ]
                },
                {
                    "id": "unleashed_entropy",
                    "name": "Unleashed Entropy",
                    "prerequisite": "Spark Sending talent or Gout of Flame talent",
                    "activation": "always",
                    "description": "It costs you one focus fewer to use Division (but not its talents). Additionally, your DCs on the Division Under Pressure table are reduced by 5.",
                    "requiresTalent": [
                        [
                            "spark_sending",
                            "gout_of_flame"
                        ]
                    ]
                }
            ]
        },
        "gravitation": {
            "name": "Gravitation",
            "attribute": "awareness",
            "orders": [
                "windrunner",
                "skybreaker"
            ],
            "description": "Manipulate gravity through Basic and Reverse Lashings",
            "baseAbility": "Spend 1 Investiture to perform a Basic Lashing (change gravity direction for yourself or target) or Reverse Lashing (make yourself a source of gravity, pulling nearby objects).",
            "talents": [
                {
                    "id": "flying_ace",
                    "name": "Flying Ace",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Fly up to your gravitation rate (permanently increases to 40 feet). Spend 1 focus to make a melee weapon attack during this flight."
                },
                {
                    "id": "gravitational_slam",
                    "name": "Gravitational Slam",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "special",
                    "description": "Use a Basic Lashing to collide a target with a solid surface, dealing 1d4 impact damage per 10 feet moved (scales with ranks). Target can Avoid Danger to halve damage."
                },
                {
                    "id": "stable_flight",
                    "name": "Stable Flight",
                    "prerequisite": "Flying Ace talent",
                    "activation": "always",
                    "description": "While maintaining a Basic Lashing on yourself, your ranged attacks don't gain disadvantage due to flying or unstable footing.",
                    "requiresTalent": [
                        "flying_ace"
                    ]
                },
                {
                    "id": "multiple_lashings",
                    "name": "Multiple Lashings",
                    "prerequisite": "Gravitational Slam talent",
                    "activation": "special",
                    "description": "When you move an unwilling character with Gravitation, infuse Investiture up to your ranks in Gravitation to prolong the effect.",
                    "requiresTalent": [
                        "gravitational_slam"
                    ]
                },
                {
                    "id": "group_flight",
                    "name": "Group Flight",
                    "prerequisite": "Stable Flight talent",
                    "activation": "special",
                    "description": "When you use a Basic Lashing out of combat, infuse additional characters up to your ranks in Gravitation without spending additional Investiture.",
                    "requiresTalent": [
                        "stable_flight"
                    ]
                },
                {
                    "id": "lashing_shot",
                    "name": "Lashing Shot",
                    "prerequisite": "Gravitational Slam talent",
                    "activation": "1_action",
                    "description": "Propel an object at a target, making a ranged Gravitation attack vs. Physical, rolling 2d4 impact damage (scales with ranks).",
                    "requiresTalent": [
                        "gravitational_slam"
                    ]
                },
                {
                    "id": "master_of_the_skies",
                    "name": "Master of the Skies",
                    "prerequisite": "Group Flight talent or Lashing Shot talent",
                    "activation": "always",
                    "description": "While you have 1 Investiture or more, you gain the benefits of being infused with Gravitation without spending Investiture.",
                    "requiresTalent": [
                        [
                            "group_flight",
                            "lashing_shot"
                        ]
                    ]
                },
                {
                    "id": "aerial_squadron",
                    "name": "Aerial Squadron",
                    "prerequisite": "Gravitation 3+; Group Flight talent",
                    "activation": "always",
                    "description": "You've trained your allies in aerial combat scenarios, readying them to fly together at a moment's notice. You can use your Group Flight in combat.",
                    "requiresTalent": [
                        "group_flight"
                    ]
                }
            ]
        },
        "illumination": {
            "name": "Illumination",
            "attribute": "presence",
            "orders": [
                "lightweaver",
                "truthwatcher"
            ],
            "description": "Create convincing visual and auditory illusions (Lightweaving)",
            "baseAbility": "Spend 1 Investiture to Lightweave an illusion in a space within spren bond range (simple: 1 per 10 min, complex: 1 per round). Can also create an illusory disguise on yourself while having Investiture.",
            "talents": [
                {
                    "id": "distracting_illusion",
                    "name": "Distracting Illusion",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to Lightweave an illusion of yourself or an ally. Until an attack misses the target, attacks against them gain disadvantage and can't graze."
                },
                {
                    "id": "lingering_lightweavings",
                    "name": "Lingering Lightweaving",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "You can infuse an illusion in a sphere. The illusion moves with the sphere, expending 1 Investiture per rounds equal to your ranks in Illumination."
                },
                {
                    "id": "disorienting_flash",
                    "name": "Disorienting Flash",
                    "prerequisite": "Distracting Illusion talent",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to project light in an area, testing Illumination vs. Cognitive of each character to make them Disoriented.",
                    "requiresTalent": [
                        "distracting_illusion"
                    ]
                },
                {
                    "id": "stormlight_reclamation_illumination",
                    "name": "Stormlight Reclamation",
                    "prerequisite": "Distracting Illusion talent",
                    "activation": "free_action",
                    "description": "End Illumination infusions within spren bond range and recover their remaining Investiture.",
                    "requiresTalent": [
                        "distracting_illusion"
                    ]
                },
                {
                    "id": "spiritual_illumination",
                    "name": "Spiritual Illumination",
                    "prerequisite": "Disorienting Flash talent",
                    "activation": "1_action",
                    "description": "Spend 2 Investiture to cause an ally to become Determined and Focused.",
                    "requiresTalent": [
                        "disorienting_flash"
                    ]
                },
                {
                    "id": "multiplicative_lightweaving",
                    "name": "Multiplicative Lightweaving",
                    "prerequisite": "Stormlight Reclamation talent",
                    "activation": "special",
                    "description": "You can Lightweave additional illusions, up to your ranks in Illumination, with no additional Investiture.",
                    "requiresTalent": [
                        "stormlight_reclamation_illumination"
                    ]
                },
                {
                    "id": "painful_truth",
                    "name": "Painful Truth",
                    "prerequisite": "Spiritual Illumination talent",
                    "activation": "1_action",
                    "description": "Spend 2 Investiture and test Illumination vs. Spiritual of a target. On success, they are Slowed and must Move away on their next turn or spend focus to avoid doing so.",
                    "requiresTalent": [
                        "spiritual_illumination"
                    ]
                },
                {
                    "id": "endless_illusions",
                    "name": "Endless Illusions",
                    "prerequisite": "Multiplicative Lightweaving talent or Spiritual Illumination talent",
                    "activation": "always",
                    "description": "While you have Investiture, Illumination infusions in your spren bond range don't expend Investiture.",
                    "requiresTalent": [
                        [
                            "multiplicative_lightweaving",
                            "spiritual_illumination"
                        ]
                    ]
                }
            ]
        },
        "progression": {
            "name": "Progression",
            "attribute": "awareness",
            "orders": [
                "edgedancer",
                "truthwatcher"
            ],
            "description": "Encourage growth and healing in living things",
            "baseAbility": "Spend Investiture to use Growth (rapidly grow plants) or Regrowth (heal living beings). Regenerate action: recover health equal to your Progression modifier.",
            "talents": [
                {
                    "id": "injury_regrowth",
                    "name": "Injury Regrowth",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 2 Investiture to cause a target to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one."
                },
                {
                    "id": "explosive_growth",
                    "name": "Explosive Growth",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to explosively grow plants in an area. Make a Progression attack vs. Physical of each chosen character, rolling 2d4 impact or keen damage (scales with ranks)."
                },
                {
                    "id": "swift_regeneration",
                    "name": "Swift Regeneration",
                    "prerequisite": "Progression 2+; Injury Regrowth talent",
                    "activation": "special",
                    "description": "When you Regenerate, recover health equal to 1d6 + your Progression modifier (scales with ranks). While you have Investiture, you and your Regrowth targets can add your Progression modifier to injury rolls.",
                    "requiresTalent": [
                        "injury_regrowth"
                    ]
                },
                {
                    "id": "overgrowth",
                    "name": "Overgrowth",
                    "prerequisite": "Explosive Growth talent",
                    "activation": "special",
                    "description": "When you infuse Growth into a plant, test Progression (DC 15) to cause it to grow much larger and stronger than its species' normal limits.",
                    "requiresTalent": [
                        "explosive_growth"
                    ]
                },
                {
                    "id": "extended_regrowth",
                    "name": "Extended Regrowth",
                    "prerequisite": "Swift Regeneration talent",
                    "activation": "always",
                    "description": "Your Regrowth infusions only expend 1 Investiture per rounds equal to your ranks in Progression.",
                    "requiresTalent": [
                        "swift_regeneration"
                    ]
                },
                {
                    "id": "reliable_progression",
                    "name": "Reliable Progression",
                    "prerequisite": "Progression 2+; Overgrowth talent",
                    "activation": "always",
                    "description": "When you roll a Progression die, if the result is lower than your ranks in Progression, change the result to equal your ranks.",
                    "requiresTalent": [
                        "overgrowth"
                    ]
                },
                {
                    "id": "from_the_brink",
                    "name": "From the Brink",
                    "prerequisite": "Progression 3+; Extended Regrowth talent",
                    "activation": "1_action",
                    "description": "Spend 3 Investiture to restore life to a willing character who died within the last minute. They return Unconscious with 0 health.",
                    "requiresTalent": [
                        "extended_regrowth"
                    ]
                },
                {
                    "id": "font_of_life",
                    "name": "Font of Life",
                    "prerequisite": "Extended Regrowth talent or Reliable Progression talent",
                    "activation": "always",
                    "description": "It costs you one Opportunity fewer to use Progression and its talents.",
                    "requiresTalent": [
                        [
                            "extended_regrowth",
                            "reliable_progression"
                        ]
                    ]
                }
            ]
        },
        "tension": {
            "name": "Tension",
            "attribute": "strength",
            "orders": [
                "bondsmith",
                "stoneward"
            ],
            "description": "Alter the rigidity of soft materials, making them firm like steel",
            "baseAbility": "Spend 1 Investiture to infuse a soft object, making it completely rigid. Can grant Hardened Defense (+2 Physical defense) or temporarily create weapons from cloth/rope.",
            "talents": [
                {
                    "id": "tension_parry",
                    "name": "Tension Parry",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "reaction",
                    "description": "Spend 2 focus to flare Tension in your clothing or a held object, causing an attack to miss."
                },
                {
                    "id": "stormlight_reclamation_tension",
                    "name": "Stormlight Reclamation",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "free_action",
                    "description": "End Tension infusions within reach and recover their remaining Investiture."
                },
                {
                    "id": "rigged_weaponry",
                    "name": "Rigged Weaponry",
                    "prerequisite": "Tension Parry talent",
                    "activation": "special",
                    "description": "Spend 1 Investiture to increase your melee weapon's reach by 10 feet. When you hit with a melee attack, spend an Opportunity or 2 focus to infuse Tension into an object the target is holding.",
                    "requiresTalent": [
                        "tension_parry"
                    ]
                },
                {
                    "id": "extended_tension",
                    "name": "Extended Tension",
                    "prerequisite": "Stormlight Reclamation talent",
                    "activation": "always",
                    "description": "Your Tension infusions only expend 1 Investiture per rounds equal to your ranks in Tension. While you have Investiture, you can freely maintain Tension infusions on objects you're holding.",
                    "requiresTalent": [
                        "stormlight_reclamation_tension"
                    ]
                },
                {
                    "id": "surface_tension",
                    "name": "Surface Tension",
                    "prerequisite": "Extended Tension talent",
                    "activation": "1_action",
                    "description": "Use Tension to increase a liquid's surface tension and walk on it like solid ground.",
                    "requiresTalent": [
                        "extended_tension"
                    ]
                },
                {
                    "id": "cloth_mastery",
                    "name": "Cloth Mastery",
                    "prerequisite": "Tension 2+; Rigged Weaponry talent",
                    "activation": "always",
                    "description": "Use Tension to instantly create intricate and complex objects.",
                    "requiresTalent": [
                        "rigged_weaponry"
                    ]
                },
                {
                    "id": "fine_control",
                    "name": "Fine Control",
                    "prerequisite": "Cloth Mastery talent",
                    "activation": "special",
                    "description": "Spend Investiture to infuse an object you can control with Opportunities while touching it. It can move up to 25 feet along surfaces, perform tasks, and make attacks using your Tension (2d4 impact damage, scales with ranks).",
                    "requiresTalent": [
                        "cloth_mastery"
                    ]
                },
                {
                    "id": "clothsmith",
                    "name": "Clothsmith",
                    "prerequisite": "Cloth Mastery talent or Surface Tension talent",
                    "activation": "always",
                    "description": "Your Hardened Defense effect increases the target's Physical defense by 4 instead of 2. When you temporarily create a weapon with Tension, it gains an extra d4 damage die.",
                    "requiresTalent": [
                        [
                            "cloth_mastery",
                            "surface_tension"
                        ]
                    ]
                }
            ]
        },
        "transformation": {
            "name": "Transformation",
            "attribute": "willpower",
            "orders": [
                "lightweaver",
                "elsecaller"
            ],
            "description": "Transform matter from one Essence to another (Soulcasting)",
            "baseAbility": "Spend Investiture to transform non-living objects between Essences (Clear Air, Liquid, Wood/Grain, Flesh/Bone, Stone). More distant transformations cost more and have higher DCs. Can also create Soulcast Defense to deflect attacks.",
            "talents": [
                {
                    "id": "soulcast_defense",
                    "name": "Soulcast Defense",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "reaction",
                    "description": "Before you or an ally within reach is hit by a projectile from a ranged attack, spend 1 Investiture to make a Transformation test (DC equals the triggering attack's result). You can choose whether to use this reaction after learning the DC. On failure, the attack grazes; on success, the attack misses and can't graze, and you transform the projectile into a material of your choice."
                },
                {
                    "id": "living_soulcasting",
                    "name": "Living Soulcasting",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture and make a melee Transformation attack vs. Spiritual of a living organism, rolling 3d4 spirit damage (scales with ranks). The target dies if reduced to 0 health."
                },
                {
                    "id": "soulcast_parry",
                    "name": "Soulcast Parry",
                    "prerequisite": "Soulcast Defense talent",
                    "activation": "reaction",
                    "description": "You can use Soulcast Defense on melee weapon attacks.",
                    "requiresTalent": [
                        "soulcast_defense"
                    ]
                },
                {
                    "id": "bloodcasting",
                    "name": "Bloodcasting",
                    "prerequisite": "Living Soulcasting talent",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture and test Transformation (DC 15) to cleanse all poison from the target and reduce one injury's recovery time by 5 days.",
                    "requiresTalent": [
                        "living_soulcasting"
                    ]
                },
                {
                    "id": "distant_surgebinding_transformation",
                    "name": "Distant Surgebinding",
                    "prerequisite": "Soulcast Parry talent",
                    "activation": "always",
                    "description": "Use your surges and their talents as though your reach is 20 feet.",
                    "requiresTalent": [
                        "soulcast_parry"
                    ]
                },
                {
                    "id": "flamecasting",
                    "name": "Flamecasting",
                    "prerequisite": "Soulcast Parry talent",
                    "activation": "1_action",
                    "description": "You gain 'Flame' as a sixth category (DC 30 to transform stone to flame). When Soulcasting flames, attack each character within 5 feet using Transformation vs. Physical, rolling 2d4 energy damage (scales with ranks).",
                    "requiresTalent": [
                        "soulcast_parry"
                    ]
                },
                {
                    "id": "persistent_transformation",
                    "name": "Persistent Transformation",
                    "prerequisite": "Transformation 2+; Distant Surgebinding talent",
                    "activation": "always",
                    "description": "When transforming non-living objects, your max DC is 15. You can reattempt Soulcasting, but on success, must spend 1 additional Investiture per recent failure.",
                    "requiresTalent": [
                        "distant_surgebinding_transformation"
                    ]
                },
                {
                    "id": "expansive_transmuter",
                    "name": "Expansive Transmuter",
                    "prerequisite": "Flamecasting talent",
                    "activation": "always",
                    "description": "Soulcasting non-living material costs 2 fewer Investiture.",
                    "requiresTalent": [
                        "flamecasting"
                    ]
                }
            ]
        },
        "transportation": {
            "name": "Transportation",
            "attribute": "intellect",
            "orders": [
                "elsecaller",
                "willshaper"
            ],
            "description": "Peer into and travel through the Cognitive Realm (Shadesmar)",
            "baseAbility": "Peer into the Cognitive Realm to sense nearby flames (indicating living beings), Invested objects, and the environment. Can attempt Realmic Step to teleport short distances.",
            "talents": [
                {
                    "id": "cognitive_farsight",
                    "name": "Cognitive Farsight",
                    "prerequisite": "Speak the First Ideal",
                    "activation": "always",
                    "description": "You can spot things in the Cognitive Realm up to a distance equal to 3 × your spren bond range. While you have Investiture, you can identify north and the direction to the nearest settlement."
                },
                {
                    "id": "realmic_evasion",
                    "name": "Realmic Evasion",
                    "prerequisite": "Speak the Second Ideal",
                    "activation": "reaction",
                    "description": "Before you're hit by an attack, spend 1 Investiture and test Transportation (DC equals triggering attack). On failure, the attack grazes. On success, the attack misses."
                },
                {
                    "id": "cognitive_vision",
                    "name": "Cognitive Vision",
                    "prerequisite": "Cognitive Farsight talent",
                    "activation": "special",
                    "description": "When you use Transportation to look into the Cognitive Realm, you can learn an enemy's intent by testing Transportation vs. Cognitive, and you can learn about your immediate environment.",
                    "requiresTalent": [
                        "cognitive_farsight"
                    ]
                },
                {
                    "id": "realmic_step",
                    "name": "Realmic Step",
                    "prerequisite": "Realmic Evasion talent",
                    "activation": "1_action",
                    "description": "Test Transportation (DC 15) and spend 2 Investiture to transport yourself to a space within spren bond range.",
                    "requiresTalent": [
                        "realmic_evasion"
                    ]
                },
                {
                    "id": "shared_transportation",
                    "name": "Shared Transportation",
                    "prerequisite": "Transportation 4+; Elsecalling talent",
                    "activation": "special",
                    "description": "When you transport yourself, spend 1 Investiture or more to bring that many additional characters with you.",
                    "requiresTalent": [
                        "elsecalling"
                    ]
                },
                {
                    "id": "elsecalling",
                    "name": "Elsecalling",
                    "prerequisite": "Speak the Third Ideal; Realmic Step talent",
                    "activation": "1_action",
                    "description": "Spend 1 Investiture to transport yourself from the Physical to the Cognitive Realm, or test Transportation (DC 20) and spend 2 Investiture to transport from the Cognitive to the Physical Realm.",
                    "requiresTalent": [
                        "realmic_step"
                    ]
                },
                {
                    "id": "elsegate",
                    "name": "Elsegate",
                    "prerequisite": "Speak the Fourth Ideal; Shared Transportation talent",
                    "activation": "special",
                    "description": "Transport yourself and up to ten companions to an Oathgate or permanent perpendicularity you've visited before.",
                    "requiresTalent": [
                        "shared_transportation"
                    ]
                },
                {
                    "id": "realmwalker",
                    "name": "Realmwalker",
                    "prerequisite": "Elsecalling talent",
                    "activation": "always",
                    "description": "When you test Transportation for a talent, you automatically succeed.",
                    "requiresTalent": [
                        "elsecalling"
                    ]
                }
            ]
        }
    }
});
})();
