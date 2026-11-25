/**
 * Cosmere RPG Radiant Orders Data
 * All Knights Radiant Orders, surges, ideals, and order talent trees.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "radiantOrders": [
        {
            "id": "windrunner",
            "name": "Windrunners",
            "description": "Protect those who cannot protect themselves",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will protect those who cannot protect themselves",
                "I will protect even those I hate, even if the one I hate most is myself"
            ],
            "surges": [
                "gravitation",
                "adhesion"
            ],
            "sprenType": "Honorspren",
            "attributes": [
                "strength",
                "willpower"
            ],
            "keyTalent": {
                "name": "First Ideal (Windrunner Key)",
                "description": "Begin bonding an honorspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Honorspren Bond",
                    "description": "Talents unique to your bond with an honorspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Windrunner Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Adhesion and Gravitation surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of windspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "reverse_lashing",
                            "name": "Reverse Lashing",
                            "prerequisite": "First Ideal",
                            "activation": "1_action",
                            "description": "Infuse yourself or an object with a mix of Adhesion and Gravitation, giving it a weak gravitational pull on specific objects within your gravitation rate distance.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Reverse Lashing",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "reverse_lashing"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges and the ability to Breathe Stormlight, Enhance, and Regenerate. You can have a maximum number of squires up to twice your level.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "skybreaker",
            "name": "Skybreakers",
            "description": "Enforce the law and strive for justice",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will follow the law",
                "I am the law"
            ],
            "surges": [
                "gravitation",
                "division"
            ],
            "sprenType": "Highspren",
            "attributes": [
                "awareness",
                "presence"
            ],
            "keyTalent": {
                "name": "First Ideal (Skybreaker Key)",
                "description": "Begin bonding a highspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Highspren Bond",
                    "description": "Talents unique to your bond with a highspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Skybreaker Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Division and Gravitation surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of luckspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "soaring_destruction",
                            "name": "Soaring Destruction",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "After you Move while maintaining a Basic Lashing on yourself, spend 1 focus to gain an action which can be used only for Division or one of its talents.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Soaring Destruction",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "soaring_destruction"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges and the ability to Breathe Stormlight, Enhance, and Regenerate. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "dustbringer",
            "name": "Dustbringers",
            "description": "Great power requires strong discipline",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will seek mastery",
                "I will use my power wisely"
            ],
            "surges": [
                "division",
                "abrasion"
            ],
            "sprenType": "Ashspren",
            "attributes": [
                "intellect",
                "willpower"
            ],
            "keyTalent": {
                "name": "First Ideal (Dustbringer Key)",
                "description": "Begin bonding an ashspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Ashspren Bond",
                    "description": "Talents unique to your bond with an ashspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Dustbringer Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Abrasion and Division surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of flamespren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "searing_dust_storm",
                            "name": "Searing Dust Storm",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Spend Investiture to kick up an obscuring cloud of dust as you Move. Enemies in this cloud take extra damage equal to your ranks in Discipline.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Searing Dust Storm",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "searing_dust_storm"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "edgedancer",
            "name": "Edgedancers",
            "description": "Remember and serve those who others forget",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will remember those who have been forgotten",
                "I will listen to those who have been ignored"
            ],
            "surges": [
                "abrasion",
                "progression"
            ],
            "sprenType": "Cultivationspren",
            "attributes": [
                "speed",
                "awareness"
            ],
            "keyTalent": {
                "name": "First Ideal (Edgedancer Key)",
                "description": "Begin bonding a cultivationspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Cultivationspren Bond",
                    "description": "Talents unique to your bond with a cultivationspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Edgedancer Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Abrasion and Progression surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of lifespren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "edgedancers_grace",
                            "name": "Edgedancer's Grace",
                            "prerequisite": "Abrasion 2+; Progression 2+; Speak the First Ideal",
                            "activation": "special",
                            "description": "You've mastered the supernatural grace told of the Edgedancers of yore. After you start your turn with 1 Investiture or more, you gain an additional action, which you can use only to Avoid Danger or Dodge. If you use the Dodge reaction in this way, ignore its focus cost.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Edgedancer's Grace",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "edgedancers_grace"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "truthwatcher",
            "name": "Truthwatchers",
            "description": "Search for fundamental truth and share it",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will seek truth",
                "I will share truth"
            ],
            "surges": [
                "progression",
                "illumination"
            ],
            "sprenType": "Mistspren",
            "attributes": [
                "intellect",
                "awareness"
            ],
            "keyTalent": {
                "name": "First Ideal (Truthwatcher Key)",
                "description": "Begin bonding a mistspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Mistspren Bond",
                    "description": "Talents unique to your bond with a mistspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Truthwatcher Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Progression and Illumination surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of gloryspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "spiritual_healing",
                            "name": "Spiritual Healing",
                            "prerequisite": "Illumination 2+; Progression 2+; Speak the First Ideal",
                            "activation": "always",
                            "description": "You mix Illumination and Regrowth to skillfully repair the mind and soul. Before you restore health to yourself or a willing ally, you can spend 2 Investiture to instead cause the target to recover half as much focus (rounded up) as they would have recovered health.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Spiritual Healing talent",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "spiritual_healing"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                },
                {
                    "id": "enlightened_mistspren",
                    "name": "Enlightened Mistspren",
                    "description": "Optional sub-tree for Truthwatchers bonded to a mistspren Enlightened by Sja-anat. Requires GM permission to bond an Enlightened mistspren; once acquired, you gain Future Sight as a free key talent and unlock the rest of the tree.",
                    "talents": [
                        {
                            "id": "future_sight",
                            "name": "Future Sight (Enlightened Key)",
                            "prerequisite": "Bond an Enlightened mistspren",
                            "activation": "always",
                            "description": "As a Truthwatcher bonded to an Enlightened mistspren, you have enigmatic visions of the future, initially outside your control. After a short or long rest or at the start of any scene, you can ask the GM for a vision of the future. If the GM deems an event in the near future important enough to trigger a vision, you have a vision; the GM might describe what it reveals, or describe a jumbled vision with no useful information. The GM can spend a Complication from a Deduction test to give you true or false information."
                        },
                        {
                            "id": "glimpse_the_future",
                            "name": "Glimpse the Future",
                            "prerequisite": "Speak the First Ideal; Future Sight key talent",
                            "activation": "special",
                            "description": "You have vague visions of future possibilities, giving you some sway to divert your Fortune. Once per round after you roll the dice for a test, you can spend 1 Investiture or more to reroll that many of the test's dice. The original rolls have no effect and you must use the new result.",
                            "requiresTalent": [
                                "first_ideal",
                                "future_sight"
                            ]
                        },
                        {
                            "id": "search_the_past",
                            "name": "Search the Past",
                            "prerequisite": "Speak the First Ideal; Future Sight key talent",
                            "activation": "special",
                            "description": "You can attempt to direct your visions to see past events; the further back you look, the harder they are to glimpse. After a long rest, choose one past event you've heard about or experienced, then make a Lore test (DC 10 for 1 day, 13 for 10 days, 16 for 50 days, 19 for 1 year, 22 for 10 years, 25 for 100 years, 30 for 1,000 years, 35 for 10,000 years; reduced by 10 if you've experienced the event). On a success, you experience a vision of 10 minutes of the event as a passive observer.",
                            "requiresTalent": [
                                "first_ideal",
                                "future_sight"
                            ]
                        },
                        {
                            "id": "alter_fortune",
                            "name": "Alter Fortune",
                            "prerequisite": "Glimpse the Future talent",
                            "activation": "reaction",
                            "description": "You use your glimpses of possibilities to control the outcome of events. Each time you finish a long rest, roll a number of d20s equal to 1 + your tier and record each result. When an enemy or willing ally you can sense makes a test, you can use a reaction to replace the test's d20 roll with one of your recorded numbers (after seeing their roll and any advantages, but before resolution). You lose a recorded number when you use it to replace a roll or after a long rest.",
                            "requiresTalent": [
                                "glimpse_the_future"
                            ]
                        },
                        {
                            "id": "vision_void",
                            "name": "Vision Void",
                            "prerequisite": "Glimpse the Future talent or Search the Past talent",
                            "activation": "always",
                            "description": "Thanks to your ability to see the future and change its course, you and your nearby allies create a black spot in the future sight of others. You and each ally within your spren bond range are immune to any enemy effect that would reroll or replace the result of any die rolled by you or those allies. Additionally, if you're present in or strongly influencing an event, no enemy can ever see visions of that event, whether they're viewing it as a future event or a past one.",
                            "requiresTalent": [
                                [
                                    "glimpse_the_future",
                                    "search_the_past"
                                ]
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "lightweaver",
            "name": "Lightweavers",
            "description": "Separate truth from lies",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will speak my truth",
                "I will accept who I am"
            ],
            "surges": [
                "illumination",
                "transformation"
            ],
            "sprenType": "Cryptic",
            "attributes": [
                "presence",
                "intellect"
            ],
            "keyTalent": {
                "name": "First Ideal (Lightweaver Key)",
                "description": "Begin bonding a cryptic and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Cryptic Bond",
                    "description": "Talents unique to your bond with a cryptic companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Lightweaver Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Illumination and Transformation surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of creationspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Speak the First Ideal",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested talent",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "physical_illusion",
                            "name": "Physical Illusion",
                            "prerequisite": "Speak the Fourth Ideal; Wound Regeneration talent",
                            "activation": "1_action",
                            "description": "By mixing Transformation and Illumination, you create illusions with weight and tangibility. Spend 1 Investiture or more to use your Illumination surge to infuse a physical illusion in thin air. The illusion occupies its space as if it were real (objects can't pass through it). It weighs half as much as the real version (max 25 lbs/surge rank), has health equal to 5 × your ranks in Transformation, and each defense equals 10 + your Transformation modifier. While controlling it, you can task it with attacks or actions, using your Illumination instead of the usual skill.",
                            "requiresTalent": [
                                "fourth_ideal",
                                "wound_regeneration"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Speak the Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Speak the Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "elsecaller",
            "name": "Elsecallers",
            "description": "Strive to reach your true potential",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will reach my potential",
                "I will seek self-mastery"
            ],
            "surges": [
                "transformation",
                "transportation"
            ],
            "sprenType": "Inkspren",
            "attributes": [
                "intellect",
                "willpower"
            ],
            "keyTalent": {
                "name": "First Ideal (Elsecaller Key)",
                "description": "Begin bonding an inkspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Inkspren Bond",
                    "description": "Talents unique to your bond with an inkspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Elsecaller Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Transformation and Transportation surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of logicspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "elsecallers_perspicacity",
                            "name": "Elsecaller's Perspicacity",
                            "prerequisite": "Transformation 2+; Transportation 2+; Speak the First Ideal",
                            "activation": "always",
                            "description": "Your shrewd reasoning and enhanced observations across realms allow you to notice details others overlook and to react with supernatural alacrity. While you have 1 Investiture or more, you gain an advantage on Deduction tests, on tests you make as part of a reaction, and on tests to gather information while peering between the Physical and Cognitive Realms.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Elsecaller's Perspicacity talent",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "elsecallers_perspicacity"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "willshaper",
            "name": "Willshapers",
            "description": "Seek freedom and choice for all peoples",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will seek freedom for those in bondage",
                "I will give others freedom to choose"
            ],
            "surges": [
                "transportation",
                "cohesion"
            ],
            "sprenType": "Lightspren",
            "attributes": [
                "presence",
                "awareness"
            ],
            "keyTalent": {
                "name": "First Ideal (Willshaper Key)",
                "description": "Begin bonding a lightspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Lightspren Bond",
                    "description": "Talents unique to your bond with a lightspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Willshaper Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Cohesion and Transportation surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of joyspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "spiritual_cohesion",
                            "name": "Spiritual Cohesion",
                            "prerequisite": "Speak the First Ideal",
                            "activation": "1_action",
                            "description": "Willshapers lead by example, raising the spirits of those around them through radical acts of self-expression. Choose a number of allies up to your current Ideal that you can influence to become Determined. While Determined from this talent, that ally's Cognitive and Spiritual defenses increase by 2.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Spiritual Cohesion talent",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "spiritual_cohesion"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "stoneward",
            "name": "Stonewards",
            "description": "Be the support on which others can depend",
            "oaths": [
                "Life before death",
                "Strength before weakness",
                "Journey before destination",
                "I will be there when I'm needed",
                "I will stand firm"
            ],
            "surges": [
                "cohesion",
                "tension"
            ],
            "sprenType": "Peakspren",
            "attributes": [
                "strength",
                "willpower"
            ],
            "keyTalent": {
                "name": "First Ideal (Stoneward Key)",
                "description": "Begin bonding a peakspren and gain Investiture"
            },
            "specialties": [
                {
                    "name": "Peakspren Bond",
                    "description": "Talents unique to your bond with a peakspren companion",
                    "talents": [
                        {
                            "id": "first_ideal",
                            "name": "First Ideal (Stoneward Key)",
                            "prerequisite": "none",
                            "activation": "special",
                            "description": "Gain Investiture score and the Breathe Stormlight, Enhance, and Regenerate actions. When you complete the goal 'Speak the First Ideal,' you become Empowered and gain access to Cohesion and Tension surges."
                        },
                        {
                            "id": "second_ideal",
                            "name": "Second Ideal",
                            "prerequisite": "First Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Second Ideal.' After completing it, you become Empowered and can use Enhance as a free action without spending Investiture.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "third_ideal",
                            "name": "Third Ideal",
                            "prerequisite": "Second Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Third Ideal.' After completing it, you become Empowered and can summon your spren as a Radiant Shardblade.",
                            "requiresTalent": [
                                "second_ideal"
                            ]
                        },
                        {
                            "id": "fourth_ideal",
                            "name": "Fourth Ideal",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "Gain the goal 'Speak the Fourth Ideal.' After completing it, you become Empowered and can call a swarm of gloryspren as Radiant Shardplate.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "cohesive_teamwork",
                            "name": "Cohesive Teamwork",
                            "prerequisite": "Cohesion 2+; Tension 2+; Speak the First Ideal",
                            "activation": "always",
                            "description": "Stonewards strive to exemplify determination and teamwork. Their resolve shows allies where to intuitively hold the line. After you use the Gain Advantage action while having 1 Investiture or more, whether you succeed or fail, the next test an ally makes against that target gains an advantage. Until the end of your next turn, while standing on stone, you can't be moved against your will or knocked Prone.",
                            "requiresTalent": [
                                "first_ideal"
                            ]
                        },
                        {
                            "id": "invested",
                            "name": "Invested",
                            "prerequisite": "Cohesive Teamwork talent",
                            "activation": "always",
                            "description": "Your maximum Investiture increases by a number equal to your tier. When your tier increases by 1, your maximum Investiture does as well.",
                            "requiresTalent": [
                                "cohesive_teamwork"
                            ]
                        },
                        {
                            "id": "wound_regeneration",
                            "name": "Wound Regeneration",
                            "prerequisite": "Invested",
                            "activation": "free_action",
                            "description": "When you use Regenerate, you can spend 2 Investiture to recover from a temporary injury, or spend 3 Investiture to recover from a permanent one.",
                            "requiresTalent": [
                                "invested"
                            ]
                        },
                        {
                            "id": "deepened_bond",
                            "name": "Deepened Bond",
                            "prerequisite": "Third Ideal",
                            "activation": "always",
                            "description": "Your spren bond range increases from 30 feet to 100 feet. Additionally, when you spend focus to give your spren a task, it costs you 1 fewer focus (to a minimum cost of 1).",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        },
                        {
                            "id": "take_squire",
                            "name": "Take Squire",
                            "prerequisite": "Third Ideal",
                            "activation": "special",
                            "description": "After a long rest, choose willing companions to take as your squires, granting them your surges. You can have a maximum number of squires equal to your current Ideal.",
                            "requiresTalent": [
                                "third_ideal"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
})();
