/**
 * Cosmere RPG Heroic Paths Data
 * All Heroic Paths, specialties, key talents, and talent trees.
 * Registers onto window.COSMERE_RULES (classic script for file:// compatibility).
 */
(function () {
    window.COSMERE_RULES = window.COSMERE_RULES || {};
    Object.assign(window.COSMERE_RULES, {
    "heroicPaths": [
        {
            "id": "agent",
            "name": "Agent",
            "description": "Artists of duplicity and sabotage, Agents grasp the threads of fate in the palms of their hands",
            "keyAttribute": "awareness",
            "startingSkill": "insight",
            "primarySkills": [
                "stealth",
                "thievery",
                "deception",
                "insight",
                "deduction"
            ],
            "keyTalent": {
                "id": "opportunist",
                "name": "Opportunist",
                "prerequisite": "none",
                "activation": "special",
                "description": "Once per round, when you roll a plot die, you can reroll that result. The original roll has no effect and you must use the new result."
            },
            "specialties": [
                {
                    "id": "investigator",
                    "name": "Investigator",
                    "description": "Cultivate trustworthy instincts, learning to listen, collaborate, and pursue answers to questions others don't think to ask",
                    "talents": [
                        {
                            "id": "watchful_eye",
                            "name": "Watchful Eye",
                            "prerequisite": "Deduction 1+; Opportunist key talent",
                            "activation": "reaction",
                            "description": "Use Opportunist on the plot die of a willing ally within 20 feet.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "get_em_talking",
                            "name": "Get 'Em Talking",
                            "prerequisite": "Insight 2+; Opportunist key talent",
                            "activation": "2_actions",
                            "description": "Spend 1 focus to test Deduction vs. Spiritual to learn the target's motivation. During this scene, you can raise the stakes on tests to leverage this motivation.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "quick_analysis",
                            "name": "Quick Analysis",
                            "prerequisite": "Watchful Eye talent",
                            "activation": "free_action",
                            "description": "Spend 2 focus to gain momentum for cognitive tests with Use a Skill, Gain Advantage, or an Agent talent.",
                            "requiresTalent": [
                                "watchful_eye"
                            ]
                        },
                        {
                            "id": "baleful",
                            "name": "Baleful",
                            "prerequisite": "Get 'Em Talking talent",
                            "activation": "always",
                            "description": "To resist your influence, a character must spend additional focus equal to your tier.",
                            "requiresTalent": [
                                "get_em_talking"
                            ]
                        },
                        {
                            "id": "gather_evidence",
                            "name": "Gather Evidence",
                            "prerequisite": "Insight 2+; Quick Analysis talent",
                            "activation": "always",
                            "description": "Gain Legal Codes expertise. When you succeed on a cognitive test against a target, you become Focused until the end of your next turn.",
                            "requiresTalent": [
                                "quick_analysis"
                            ]
                        },
                        {
                            "id": "hardy_agent",
                            "name": "Hardy",
                            "prerequisite": "Baleful talent",
                            "activation": "always",
                            "description": "Gain +1 max health per level (including previous levels).",
                            "requiresTalent": [
                                "baleful"
                            ],
                            "effects": {
                                "maxHealthPerLevel": 1
                            }
                        },
                        {
                            "id": "sleuths_instincts",
                            "name": "Sleuth's Instincts",
                            "prerequisite": "Deduction 3+; Hardy talent",
                            "activation": "always",
                            "description": "Gain an advantage on cognitive tests against characters whose motivation you know. You know when those characters lie to you.",
                            "requiresTalent": [
                                "hardy_agent"
                            ]
                        },
                        {
                            "id": "close_the_case",
                            "name": "Close the Case",
                            "prerequisite": "Deduction 3+; Hardy talent",
                            "activation": "1_action",
                            "description": "Spend 3 focus to test Deduction vs. Cognitive, gaining an advantage if you know the target's motivation. On failure, the target gains an advantage against you. On success, they back down.",
                            "requiresTalent": [
                                "hardy_agent"
                            ]
                        }
                    ]
                },
                {
                    "id": "spy",
                    "name": "Spy",
                    "description": "Plant themselves in sticky situations, ready to deflect or ease suspicion when it inevitably sweeps their way",
                    "talents": [
                        {
                            "id": "sure_outcome",
                            "name": "Sure Outcome",
                            "prerequisite": "Insight 2+; Opportunist key talent",
                            "activation": "special",
                            "description": "When you use Opportunist, spend 2 focus to change opportunity to 4, or change any result to opportunity.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "plausible_excuse",
                            "name": "Plausible Excuse",
                            "prerequisite": "Deception 1+; Opportunist key talent",
                            "activation": "free_action",
                            "description": "Gain Sleight of Hand expertise. When discovered skulking, spend 2 focus to feign innocence.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "collected_agent",
                            "name": "Collected",
                            "prerequisite": "Sure Outcome talent",
                            "activation": "always",
                            "description": "Increase your Cognitive and Spiritual defenses by 2.",
                            "requiresTalent": [
                                "sure_outcome"
                            ]
                        },
                        {
                            "id": "cover_story",
                            "name": "Cover Story",
                            "prerequisite": "Plausible Excuse talent",
                            "activation": "always",
                            "description": "Gain a false identity and a relevant cultural expertise.",
                            "requiresTalent": [
                                "plausible_excuse"
                            ]
                        },
                        {
                            "id": "subtle_takedown",
                            "name": "Subtle Takedown",
                            "prerequisite": "Insight 3+; Cover Story talent",
                            "activation": "1_action",
                            "description": "Make an unarmed attack with Insight vs. an unsuspecting target's Cognitive, raising the stakes. On a hit, they can't communicate.",
                            "requiresTalent": [
                                "cover_story"
                            ]
                        },
                        {
                            "id": "mighty_agent",
                            "name": "Mighty",
                            "prerequisite": "Cover Story talent",
                            "activation": "always",
                            "description": "When you hit with a weapon or unarmed attack, for each action spent, deal extra damage equal to 1 + your tier.",
                            "requiresTalent": [
                                "cover_story"
                            ]
                        },
                        {
                            "id": "mercurial_facade",
                            "name": "Mercurial Facade",
                            "prerequisite": "Deception 3+; Subtle Takedown talent",
                            "activation": "1_action",
                            "description": "Disguise yourself using Deception without needing physical supplies. The first character to see through your disguise is Surprised.",
                            "requiresTalent": [
                                "subtle_takedown"
                            ]
                        },
                        {
                            "id": "high_society_contacts_agent",
                            "name": "High Society Contacts",
                            "prerequisite": "Have a patron who is part of high society; Cover Story talent",
                            "activation": "special",
                            "description": "Gain High Society expertise. Spend 2 focus to add opportunity to a test to interact in high society.",
                            "requiresTalent": [
                                "cover_story"
                            ]
                        }
                    ]
                },
                {
                    "id": "thief",
                    "name": "Thief",
                    "description": "Train their bodies to keep pace with their quick minds, risking it all to swindle insurmountable odds",
                    "talents": [
                        {
                            "id": "risky_behavior",
                            "name": "Risky Behavior",
                            "prerequisite": "Insight 2+; Opportunist key talent",
                            "activation": "special",
                            "description": "Spend 1 focus to raise the stakes on your test.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "cheap_shot",
                            "name": "Cheap Shot",
                            "prerequisite": "Opportunist key talent",
                            "activation": "1_action",
                            "description": "Spend 1 focus to make an unarmed attack with Thievery vs. Cognitive, raising the stakes. On a hit, the target is Stunned.",
                            "requiresTalent": [
                                "opportunist"
                            ]
                        },
                        {
                            "id": "double_down",
                            "name": "Double Down",
                            "prerequisite": "Risky Behavior talent",
                            "activation": "special",
                            "description": "You can reroll again with Opportunist, but on complication, you lose 2 focus.",
                            "requiresTalent": [
                                "risky_behavior"
                            ]
                        },
                        {
                            "id": "surefooted_agent",
                            "name": "Surefooted",
                            "prerequisite": "Cheap Shot talent",
                            "activation": "always",
                            "description": "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
                            "requiresTalent": [
                                "cheap_shot"
                            ]
                        },
                        {
                            "id": "underworld_contacts",
                            "name": "Underworld Contacts",
                            "prerequisite": "Have a patron or follower who is a member of the criminal underworld; Double Down talent",
                            "activation": "special",
                            "description": "Gain Criminal Groups expertise. Spend 2 focus to add opportunity to a social test against criminals.",
                            "requiresTalent": [
                                "double_down"
                            ]
                        },
                        {
                            "id": "shadow_step",
                            "name": "Shadow Step",
                            "prerequisite": "Thievery 3+; Surefooted talent",
                            "activation": "special",
                            "description": "After you Disengage, spend 2 focus to test Thievery vs. each enemy's Cognitive to hide from them. You gain an advantage if in cover or obscured.",
                            "requiresTalent": [
                                "surefooted_agent"
                            ]
                        },
                        {
                            "id": "fast_talker",
                            "name": "Fast Talker",
                            "prerequisite": "Insight 3+; Double Down talent",
                            "activation": "free_action",
                            "description": "Spend 2 focus to gain momentum for spiritual tests with Use a Skill, Gain Advantage, or an Agent talent.",
                            "requiresTalent": [
                                "double_down"
                            ]
                        },
                        {
                            "id": "tricksters_hand",
                            "name": "Trickster's Hand",
                            "prerequisite": "Thievery 3+; Surefooted talent",
                            "activation": "free_action",
                            "description": "Spend 2 focus to gain momentum for physical tests with Use a Skill, Gain Advantage, or an Agent talent.",
                            "requiresTalent": [
                                "surefooted_agent"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "envoy",
            "name": "Envoy",
            "description": "Prominent organizations appoint Envoys who vie for resources, curry favor, or offer service on the organization's behalf",
            "keyAttribute": "presence",
            "startingSkill": "discipline",
            "primarySkills": [
                "discipline",
                "leadership",
                "persuasion",
                "deception",
                "lore"
            ],
            "keyTalent": {
                "id": "rousing_presence",
                "name": "Rousing Presence",
                "prerequisite": "none",
                "activation": "free_action",
                "description": "Choose an ally you can influence. They become Determined until they benefit from that condition or until the scene ends."
            },
            "specialties": [
                {
                    "id": "diplomat",
                    "name": "Diplomat",
                    "description": "Adept at navigating court politics, using what they learn to seek favorable treatment",
                    "talents": [
                        {
                            "id": "steadfast_challenge",
                            "name": "Steadfast Challenge",
                            "prerequisite": "Discipline 1+; Rousing Presence key talent",
                            "activation": "1_action",
                            "description": "Spend 1 focus to test Discipline vs. an enemy's Spiritual. On success, they are Disoriented and gain a disadvantage on tests against you.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "collected_envoy",
                            "name": "Collected",
                            "prerequisite": "Rousing Presence key talent",
                            "activation": "always",
                            "description": "Increase your Cognitive and Spiritual defenses by 2.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "withering_retort",
                            "name": "Withering Retort",
                            "prerequisite": "Discipline 2+; Steadfast Challenge talent",
                            "activation": "reaction",
                            "description": "Use your Steadfast Challenge before an attack and increase your deflect against the attack by your ranks in Discipline.",
                            "requiresTalent": [
                                "steadfast_challenge"
                            ]
                        },
                        {
                            "id": "well_dressed_envoy",
                            "name": "Well Dressed",
                            "prerequisite": "Steadfast Challenge talent",
                            "activation": "always",
                            "description": "Gain Fashion expertise. While wearing Presentable armor or fashionable clothing, gain an advantage on your first Deception, Leadership, or Persuasion test.",
                            "requiresTalent": [
                                "steadfast_challenge"
                            ]
                        },
                        {
                            "id": "calm_appeal",
                            "name": "Calm Appeal",
                            "prerequisite": "Discipline 2+; Withering Retort talent",
                            "activation": "special",
                            "description": "When your Steadfast Challenge makes a target Disoriented, spend 1 focus to pacify them. Resisting your Steadfast Challenge costs additional focus equal to your ranks in Discipline.",
                            "requiresTalent": [
                                "withering_retort"
                            ]
                        },
                        {
                            "id": "high_society_contacts_envoy",
                            "name": "High Society Contacts",
                            "prerequisite": "Have a patron who is part of high society; Well Dressed talent",
                            "activation": "special",
                            "description": "Gain High Society expertise. Spend 2 focus to add opportunity to a test to interact in high society.",
                            "requiresTalent": [
                                "well_dressed_envoy"
                            ]
                        },
                        {
                            "id": "peaceful_solution",
                            "name": "Peaceful Solution",
                            "prerequisite": "Discipline 3+; Calm Appeal talent",
                            "activation": "special",
                            "description": "If all non-minion enemies are pacified, you ease tensions and end combat.",
                            "requiresTalent": [
                                "calm_appeal"
                            ]
                        },
                        {
                            "id": "practiced_oratory",
                            "name": "Practiced Oratory",
                            "prerequisite": "Persuasion 3+; High Society Contacts",
                            "activation": "special",
                            "description": "When you use Rousing Presence or Steadfast Challenge, spend focus up to your ranks in Persuasion to add that many targets.",
                            "requiresTalent": [
                                "high_society_contacts_envoy"
                            ]
                        }
                    ]
                },
                {
                    "id": "faithful",
                    "name": "Faithful",
                    "description": "Devote themselves to traditions of their faith, demonstrating convictions through word or deed",
                    "talents": [
                        {
                            "id": "customary_garb_envoy",
                            "name": "Customary Garb",
                            "prerequisite": "Rousing Presence key talent",
                            "activation": "always",
                            "description": "While wearing Presentable armor or appropriate clothing, increase your Physical and Spiritual defenses by 2.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "galvanize",
                            "name": "Galvanize",
                            "prerequisite": "Rousing Presence key talent",
                            "activation": "1_action",
                            "description": "An ally rolls their recovery die and recovers that much focus.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "devoted_presence",
                            "name": "Devoted Presence",
                            "prerequisite": "Lore 1+; Customary Garb talent",
                            "activation": "special",
                            "description": "When you use Rousing Presence, spend 1 focus to remove Prone, Slowed, Stunned, and Surprised from your target.",
                            "requiresTalent": [
                                "customary_garb_envoy"
                            ]
                        },
                        {
                            "id": "composed_envoy",
                            "name": "Composed",
                            "prerequisite": "Galvanize talent",
                            "activation": "always",
                            "description": "Increase your max and current focus by your tier.",
                            "requiresTalent": [
                                "galvanize"
                            ]
                        },
                        {
                            "id": "stalwart_presence",
                            "name": "Stalwart Presence",
                            "prerequisite": "Discipline 2+; Devoted Presence talent",
                            "activation": "special",
                            "description": "When you use Rousing Presence, spend 1 focus to increase one of the target's defenses by 2.",
                            "requiresTalent": [
                                "devoted_presence"
                            ]
                        },
                        {
                            "id": "applied_motivation",
                            "name": "Applied Motivation",
                            "prerequisite": "Discipline 2+; Galvanize talent",
                            "activation": "always",
                            "description": "When you cause a character to recover focus, they recover additional focus equal to half your ranks in Lore.",
                            "requiresTalent": [
                                "galvanize"
                            ]
                        },
                        {
                            "id": "sage_counsel",
                            "name": "Sage Counsel",
                            "prerequisite": "Lore 3+; Stalwart Presence talent",
                            "activation": "special",
                            "description": "When you Aid a character, spend 1 focus to grant them Rousing Presence.",
                            "requiresTalent": [
                                "stalwart_presence"
                            ]
                        },
                        {
                            "id": "inspired_zeal",
                            "name": "Inspired Zeal",
                            "prerequisite": "Discipline 3+; either Applied Motivation talent or Stalwart Presence talent",
                            "activation": "always",
                            "description": "When an ally uses Determined, choose other allies to recover 1 focus, up to your ranks in Discipline.",
                            "requiresTalent": [
                                [
                                    "applied_motivation",
                                    "stalwart_presence"
                                ]
                            ]
                        }
                    ]
                },
                {
                    "id": "mentor",
                    "name": "Mentor",
                    "description": "Devote themselves to their wards, patiently nurturing others toward greatness",
                    "talents": [
                        {
                            "id": "sound_advice",
                            "name": "Sound Advice",
                            "prerequisite": "Rousing Presence key talent",
                            "activation": "special",
                            "description": "Spend 1 focus to use Rousing Presence on an ally who failed a skill test.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "practical_demonstration",
                            "name": "Practical Demonstration",
                            "prerequisite": "Leadership 1+; Rousing Presence key talent",
                            "activation": "special",
                            "description": "When you Gain Advantage or hit with an attack, use your Rousing Presence as a free action.",
                            "requiresTalent": [
                                "rousing_presence"
                            ]
                        },
                        {
                            "id": "lessons_in_patience",
                            "name": "Lessons in Patience",
                            "prerequisite": "Discipline 2+; Sound Advice talent",
                            "activation": "special",
                            "description": "Gain Motivational Speech expertise. When you use Rousing Presence, your target recovers 1 focus.",
                            "requiresTalent": [
                                "sound_advice"
                            ]
                        },
                        {
                            "id": "mighty_envoy",
                            "name": "Mighty",
                            "prerequisite": "Practical Demonstration talent",
                            "activation": "always",
                            "description": "When you hit with a weapon or unarmed attack, for each action spent, deal extra damage equal to 1 + your tier.",
                            "requiresTalent": [
                                "practical_demonstration"
                            ]
                        },
                        {
                            "id": "instill_confidence",
                            "name": "Instill Confidence",
                            "prerequisite": "Have a companion; Lessons in Patience talent",
                            "activation": "special",
                            "description": "Rousing Presence can make an ally Focused instead of Determined.",
                            "requiresTalent": [
                                "lessons_in_patience"
                            ]
                        },
                        {
                            "id": "guiding_oration",
                            "name": "Guiding Oration",
                            "prerequisite": "Leadership 2+; Mighty talent",
                            "activation": "always",
                            "description": "After you Gain Advantage, an ally within 10 feet of your target gains an advantage on their next test against your target.",
                            "requiresTalent": [
                                "mighty_envoy"
                            ]
                        },
                        {
                            "id": "foresight",
                            "name": "Foresight",
                            "prerequisite": "Discipline 3+; Instill Confidence talent",
                            "activation": "always",
                            "description": "Gain an additional action each turn.",
                            "requiresTalent": [
                                "instill_confidence"
                            ]
                        },
                        {
                            "id": "rallying_shout",
                            "name": "Rallying Shout",
                            "prerequisite": "Leadership 3+; Guiding Oration talent",
                            "activation": "special",
                            "description": "Rousing Presence can revive an Unconscious ally, and if they have 0 health, they recover health equal to their recovery die + your ranks in Leadership.",
                            "requiresTalent": [
                                "guiding_oration"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "hunter",
            "name": "Hunter",
            "description": "The thrill of the chase thrums in a Hunter's mind as they patiently surveil",
            "keyAttribute": "awareness",
            "startingSkill": "perception",
            "primarySkills": [
                "perception",
                "stealth",
                "survival",
                "agility",
                "light_weaponry"
            ],
            "keyTalent": {
                "id": "seek_quarry",
                "name": "Seek Quarry",
                "prerequisite": "none",
                "activation": "special",
                "description": "After spending 1 minute mentally preparing, you choose a character who you can sense or who you've previously encountered. That character becomes your quarry. You gain an advantage on tests made to find, attack, or study your quarry."
            },
            "specialties": [
                {
                    "id": "archer",
                    "name": "Archer",
                    "description": "Shape the battlefield before frontline confrontation, steadily unleashing a torrent of arrows",
                    "talents": [
                        {
                            "id": "tagging_shot",
                            "name": "Tagging Shot",
                            "prerequisite": "Perception 2+; Seek Quarry key talent",
                            "activation": "1_action",
                            "description": "Move 5 feet and make a ranged attack. On a hit or a graze, the target becomes your quarry.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "combat_training_hunter",
                            "name": "Combat Training",
                            "prerequisite": "Seek Quarry key talent",
                            "activation": "always",
                            "description": "Gain expertise in a weapon, an armor, and Military Life. Once per round, graze without spending focus.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "sharp_eye",
                            "name": "Sharp Eye",
                            "prerequisite": "Tagging Shot talent",
                            "activation": "special",
                            "description": "Observe a target then test Perception vs. Cognitive to learn their lowest attribute, lowest defense, or if their health, focus, or Investiture are below half.",
                            "requiresTalent": [
                                "tagging_shot"
                            ]
                        },
                        {
                            "id": "steady_aim",
                            "name": "Steady Aim",
                            "prerequisite": "Agility 1+; Combat Training talent",
                            "activation": "always",
                            "description": "Increase your weapon range by half and deal extra damage equal to your ranks in Perception.",
                            "requiresTalent": [
                                "combat_training_hunter"
                            ]
                        },
                        {
                            "id": "exploit_weakness",
                            "name": "Exploit Weakness",
                            "prerequisite": "Perception 3+; Sharp Eye talent",
                            "activation": "free_action",
                            "description": "Gain Advantage on your quarry without spending actions.",
                            "requiresTalent": [
                                "sharp_eye"
                            ]
                        },
                        {
                            "id": "backstep",
                            "name": "Backstep",
                            "prerequisite": "Agility 2+; Steady Aim talent",
                            "activation": "special",
                            "description": "After making a ranged attack, spend 2 focus to Disengage without spending actions, and Brace if you enter cover or obscured area.",
                            "requiresTalent": [
                                "steady_aim"
                            ]
                        },
                        {
                            "id": "unrelenting_salvo",
                            "name": "Unrelenting Salvo",
                            "prerequisite": "Agility 3+; Hardy talent",
                            "activation": "always",
                            "description": "You can Strike your quarry more than once per turn with the same ranged weapon.",
                            "requiresTalent": [
                                "hardy_hunter"
                            ]
                        },
                        {
                            "id": "hardy_hunter",
                            "name": "Hardy",
                            "prerequisite": "Steady Aim talent",
                            "activation": "always",
                            "description": "Gain +1 max health per level (including previous levels).",
                            "requiresTalent": [
                                "steady_aim"
                            ],
                            "effects": {
                                "maxHealthPerLevel": 1
                            }
                        }
                    ]
                },
                {
                    "id": "assassin",
                    "name": "Assassin",
                    "description": "Exploit weaknesses to quickly incapacitate their quarry",
                    "talents": [
                        {
                            "id": "startling_blow",
                            "name": "Startling Blow",
                            "prerequisite": "Stealth 1+; Seek Quarry key talent",
                            "activation": "1_action",
                            "description": "Make an unarmed or improvised weapon attack vs. Cognitive. On a hit or graze, the target is Surprised.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "killing_edge",
                            "name": "Killing Edge",
                            "prerequisite": "Perception 2+; Seek Quarry key talent",
                            "activation": "always",
                            "description": "Gain Knives and Slings expertises. These weapons gain the Deadly and Quickdraw expert traits.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "fatal_thrust",
                            "name": "Fatal Thrust",
                            "prerequisite": "Perception 3+; Startling Blow talent",
                            "activation": "1_action",
                            "description": "Attack an unsuspecting target with a light melee weapon vs. Cognitive. Add 4d4 damage, and gain two advantages if the weapon is Discreet. Max damage rolls add a penalty to the injury roll.",
                            "requiresTalent": [
                                "startling_blow"
                            ]
                        },
                        {
                            "id": "shadowing",
                            "name": "Shadowing",
                            "prerequisite": "Stealth 2+; Killing Edge talent",
                            "activation": "always",
                            "description": "Your quarry gains a disadvantage to sense you, and you gain an advantage to avoid their notice. When you succeed vs. Spiritual while in cover or obscured, spend 3 focus to designate that target as your quarry.",
                            "requiresTalent": [
                                "killing_edge"
                            ]
                        },
                        {
                            "id": "mighty_hunter",
                            "name": "Mighty",
                            "prerequisite": "Cold Eyes talent",
                            "activation": "always",
                            "description": "When you hit with a weapon or unarmed attack, for each action spent, deal extra damage equal to 1 + your tier.",
                            "requiresTalent": [
                                "cold_eyes"
                            ]
                        },
                        {
                            "id": "cold_eyes",
                            "name": "Cold Eyes",
                            "prerequisite": "Shadowing talent",
                            "activation": "always",
                            "description": "After you defeat your quarry, recover 1 focus and choose a new quarry.",
                            "requiresTalent": [
                                "shadowing"
                            ]
                        },
                        {
                            "id": "swift_strikes_hunter",
                            "name": "Swift Strikes",
                            "prerequisite": "Cold Eyes talent",
                            "activation": "special",
                            "description": "Spend 1 focus to make a second Strike with the same weapon.",
                            "requiresTalent": [
                                "cold_eyes"
                            ]
                        },
                        {
                            "id": "sidestep",
                            "name": "Sidestep",
                            "prerequisite": "Stealth 3+; Shadowing talent",
                            "activation": "always",
                            "description": "Gain an additional action to Dodge when you're not wearing armor with deflect of 2 or higher.",
                            "requiresTalent": [
                                "shadowing"
                            ]
                        }
                    ]
                },
                {
                    "id": "tracker",
                    "name": "Tracker",
                    "description": "In untamed wilds, none are more capable, with trusty animal companions at their sides",
                    "talents": [
                        {
                            "id": "deadly_trap",
                            "name": "Deadly Trap",
                            "prerequisite": "Survival 1+; Seek Quarry key talent",
                            "activation": "1_action",
                            "description": "Conceal a 5-foot entangling or impaling trap. Entangling Trap: Test Survival vs. Cognitive, roll 2d4 impact damage, target is Immobilized. Impaling Trap: Test Survival vs. Physical, roll 2d4 keen damage, target is Afflicted.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "animal_bond",
                            "name": "Animal Bond",
                            "prerequisite": "Have an animal companion; Seek Quarry key talent",
                            "activation": "always",
                            "description": "While your companion is within 10 feet, your defenses increase by 1. Use free action to give your companion momentum or actions on your turn. They can use Track as free action to make a target your quarry.",
                            "requiresTalent": [
                                "seek_quarry"
                            ]
                        },
                        {
                            "id": "experienced_trapper",
                            "name": "Experienced Trapper",
                            "prerequisite": "Perception 2+; Deadly Trap talent",
                            "activation": "always",
                            "description": "You easily forage for characters up to your ranks in Survival. You can fashion natural tools using Survival. Your Deadly Traps increase to 2d6 damage and 2 rounds duration.",
                            "requiresTalent": [
                                "deadly_trap"
                            ]
                        },
                        {
                            "id": "protective_bond",
                            "name": "Protective Bond",
                            "prerequisite": "Animal Bond talent",
                            "activation": "always",
                            "description": "Your animal companion protects an ally within 30 feet of you, and that ally gains your Animal Bond bonus instead of you.",
                            "requiresTalent": [
                                "animal_bond"
                            ]
                        },
                        {
                            "id": "hunters_edge",
                            "name": "Hunter's Edge",
                            "prerequisite": "Survival 3+; Experienced Trapper talent",
                            "activation": "always",
                            "description": "Your animal companion gains an advantage against your quarry. Your Deadly Traps increase to 2d8 damage and 3 rounds duration.",
                            "requiresTalent": [
                                "experienced_trapper"
                            ]
                        },
                        {
                            "id": "pack_hunting",
                            "name": "Pack Hunting",
                            "prerequisite": "Perception 3+; Protective Bond talent",
                            "activation": "special",
                            "description": "Spend 1 focus to add your ranks in Survival to your ally's attack or damage roll against your quarry.",
                            "requiresTalent": [
                                "protective_bond"
                            ]
                        },
                        {
                            "id": "surefooted_hunter",
                            "name": "Surefooted",
                            "prerequisite": "Experienced Trapper talent",
                            "activation": "always",
                            "description": "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
                            "requiresTalent": [
                                "experienced_trapper"
                            ]
                        },
                        {
                            "id": "feral_connection",
                            "name": "Feral Connection",
                            "prerequisite": "Survival 2+; Protective Bond talent",
                            "activation": "always",
                            "description": "Gain expertise in Animal Care. Your animal companion's health increases by 5 × your tier, their defenses increase by 2, and their tests gain a bonus equal to your ranks in Survival.",
                            "requiresTalent": [
                                "protective_bond"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "leader",
            "name": "Leader",
            "description": "Beacons of encouragement and direction, Leaders oversee the efforts of others",
            "keyAttribute": "presence",
            "startingSkill": "leadership",
            "primarySkills": [
                "leadership",
                "persuasion",
                "intimidation",
                "athletics",
                "heavy_weaponry"
            ],
            "keyTalent": {
                "id": "decisive_command",
                "name": "Decisive Command",
                "prerequisite": "none",
                "activation": "1_action",
                "description": "Gain a command die (d4). Spend 1 focus to choose an ally you can influence within 20 feet. The next time they make a test before the end of their next turn, they can roll your command die and add it to one die roll from that test (other than the plot die)."
            },
            "specialties": [
                {
                    "id": "champion",
                    "name": "Champion",
                    "description": "Inspiring others through unfaltering grit, ferociously charging their foes",
                    "talents": [
                        {
                            "id": "combat_coordination",
                            "name": "Combat Coordination",
                            "prerequisite": "Leadership 2+; Decisive Command key talent",
                            "activation": "special",
                            "description": "After you Strike, use Decisive Command as free action. If your Strike didn't hit, you also don't spend focus.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "valiant_intervention",
                            "name": "Valiant Intervention",
                            "prerequisite": "Athletics 1+; Decisive Command key talent",
                            "activation": "1_action",
                            "description": "Spend 1 focus to move 10 feet, then test Athletics vs. Spiritual to give a target a disadvantage on tests against your allies.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "imposing_posture",
                            "name": "Imposing Posture",
                            "prerequisite": "Athletics 2+; Combat Coordination talent",
                            "activation": "always",
                            "description": "After an enemy resists your influence while in your weapon's reach, they are Disoriented until the end of their next turn.",
                            "requiresTalent": [
                                "combat_coordination"
                            ]
                        },
                        {
                            "id": "hardy_leader",
                            "name": "Hardy",
                            "prerequisite": "Valiant Intervention talent",
                            "activation": "always",
                            "description": "Gain +1 max health per level (including previous levels).",
                            "requiresTalent": [
                                "valiant_intervention"
                            ],
                            "effects": {
                                "maxHealthPerLevel": 1
                            }
                        },
                        {
                            "id": "mighty_leader",
                            "name": "Mighty",
                            "prerequisite": "Imposing Posture talent",
                            "activation": "always",
                            "description": "When you hit with a weapon or unarmed attack, for each action spent, deal extra damage equal to 1 + your tier.",
                            "requiresTalent": [
                                "imposing_posture"
                            ]
                        },
                        {
                            "id": "resolute_stand",
                            "name": "Resolute Stand",
                            "prerequisite": "Athletics 1+; Hardy talent",
                            "activation": "special",
                            "description": "Valiant Intervention prevents Reactive Strikes. Spend focus up to your ranks in Leadership to add that many targets for Valiant Intervention.",
                            "requiresTalent": [
                                "hardy_leader"
                            ]
                        },
                        {
                            "id": "resilient_hero",
                            "name": "Resilient Hero",
                            "prerequisite": "Athletics 3+; Resolute Stand talent",
                            "activation": "reaction",
                            "description": "Once per scene, before your health drops to 0, it instead becomes equal to your Athletics modifier.",
                            "requiresTalent": [
                                "resolute_stand"
                            ]
                        },
                        {
                            "id": "demonstrative_command",
                            "name": "Demonstrative Command",
                            "prerequisite": "Leadership 2+; Resolute Stand talent",
                            "activation": "special",
                            "description": "Increase the size of your command die. Spend 1 focus to add your command die to your Athletics, Agility, or Leadership d20 roll.",
                            "requiresTalent": [
                                "resolute_stand"
                            ]
                        }
                    ]
                },
                {
                    "id": "officer",
                    "name": "Officer",
                    "description": "Coolly maintain order in utter chaos, orchestrating the march to victory",
                    "talents": [
                        {
                            "id": "composed_leader",
                            "name": "Composed",
                            "prerequisite": "Decisive Command key talent",
                            "activation": "always",
                            "description": "Increase your max and current focus by your tier.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "through_the_fray",
                            "name": "Through the Fray",
                            "prerequisite": "Persuasion 1+; Decisive Command key talent",
                            "activation": "free_action",
                            "description": "An ally within 20 feet can Disengage or Gain Advantage as free action.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "well_supplied",
                            "name": "Well Supplied",
                            "prerequisite": "Persuasion 2+; Composed talent",
                            "activation": "special",
                            "description": "Gain Military Logistics expertise. Spend 2 focus to add opportunity to your test to requisition resources.",
                            "requiresTalent": [
                                "composed_leader"
                            ]
                        },
                        {
                            "id": "customary_garb_leader",
                            "name": "Customary Garb",
                            "prerequisite": "Through the Fray talent",
                            "activation": "always",
                            "description": "While wearing Presentable armor or appropriate clothing, increase your Physical and Spiritual defenses by 2.",
                            "requiresTalent": [
                                "through_the_fray"
                            ]
                        },
                        {
                            "id": "relentless_march",
                            "name": "Relentless March",
                            "prerequisite": "Persuasion 3+; Confident Command talent",
                            "activation": "always",
                            "description": "Decisive Command increases your target's movement by 10 feet, and they ignore Exhausted, Slowed, and Surprised.",
                            "requiresTalent": [
                                "confident_command"
                            ]
                        },
                        {
                            "id": "confident_command",
                            "name": "Confident Command",
                            "prerequisite": "Leadership 2+; Customary Garb talent",
                            "activation": "special",
                            "description": "Increase the size of your command die. Spend 1 focus to add your command die to your Intimidation, Leadership, or Persuasion d20 roll.",
                            "requiresTalent": [
                                "customary_garb_leader"
                            ]
                        },
                        {
                            "id": "synchronized_assault",
                            "name": "Synchronized Assault",
                            "prerequisite": "Leadership 3+; Authority talent",
                            "activation": "2_actions",
                            "description": "Spend 2 focus to test Leadership vs. enemy's Cognitive. On success, allies up to your ranks in Leadership gain momentum for an additional Strike against the target. On failure, only one ally gains momentum.",
                            "requiresTalent": [
                                "authority"
                            ]
                        },
                        {
                            "id": "authority",
                            "name": "Authority",
                            "prerequisite": "Have a title granting you command over at least 5 people; Confident Command talent",
                            "activation": "always",
                            "description": "Double the range of Leader talents that affect allies, and double the number of allies affected.",
                            "requiresTalent": [
                                "confident_command"
                            ]
                        }
                    ]
                },
                {
                    "id": "politico",
                    "name": "Politico",
                    "description": "With a penchant for theatrics, chase favor and prestige while subtly undermining enemies",
                    "talents": [
                        {
                            "id": "cutthroat_tactics",
                            "name": "Cutthroat Tactics",
                            "prerequisite": "Deception 1+; Decisive Command key talent",
                            "activation": "special",
                            "description": "Your ally can raise the stakes instead of rolling your command die; if they roll complication, you recover 1 focus.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "tactical_ploy",
                            "name": "Tactical Ploy",
                            "prerequisite": "Decisive Command key talent",
                            "activation": "1_action",
                            "description": "Test Deception vs. Cognitive to make your target lose one action and gain a disadvantage on their next cognitive or spiritual test.",
                            "requiresTalent": [
                                "decisive_command"
                            ]
                        },
                        {
                            "id": "rumormonger",
                            "name": "Rumormonger",
                            "prerequisite": "Have a patron; Cutthroat Tactics talent",
                            "activation": "special",
                            "description": "Gain Scandal expertise. Spend 2 focus to add opportunity when you make a test to spread misinformation or gather rumors.",
                            "requiresTalent": [
                                "cutthroat_tactics"
                            ]
                        },
                        {
                            "id": "well_dressed_leader",
                            "name": "Well Dressed",
                            "prerequisite": "Rumormonger talent",
                            "activation": "always",
                            "description": "Gain Fashion expertise. While wearing Presentable armor or fashionable clothing, gain an advantage on your first Deception, Leadership, or Persuasion test.",
                            "requiresTalent": [
                                "rumormonger"
                            ]
                        },
                        {
                            "id": "baleful_leader",
                            "name": "Baleful",
                            "prerequisite": "Rumormonger talent",
                            "activation": "always",
                            "description": "To resist your influence, a character must spend additional focus equal to your tier.",
                            "requiresTalent": [
                                "rumormonger"
                            ]
                        },
                        {
                            "id": "set_at_odds",
                            "name": "Set at Odds",
                            "prerequisite": "Leadership 3+; Baleful talent",
                            "activation": "special",
                            "description": "Spend focus equal to the number of targets you want to seed division among. Test Leadership vs. their highest Spiritual to make them hostile to each other.",
                            "requiresTalent": [
                                "baleful_leader"
                            ]
                        },
                        {
                            "id": "shrewd_command",
                            "name": "Shrewd Command",
                            "prerequisite": "Leadership 2+; Rumormonger talent",
                            "activation": "special",
                            "description": "Increase the size of your command die. Spend 1 focus to add your command die to your Deception, Insight, or Leadership d20 roll.",
                            "requiresTalent": [
                                "rumormonger"
                            ]
                        },
                        {
                            "id": "grand_deception",
                            "name": "Grand Deception",
                            "prerequisite": "Deception 3+; Shrewd Command talent",
                            "activation": "3_actions",
                            "description": "Spend 3 focus to test Deception (DC 15) to reveal a ruse that changes a detail.",
                            "requiresTalent": [
                                "shrewd_command"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "scholar",
            "name": "Scholar",
            "description": "Creativity, acumen, and patience are hallmarks of legendary Scholars",
            "keyAttribute": "intellect",
            "startingSkill": "lore",
            "primarySkills": [
                "lore",
                "deduction",
                "crafting",
                "medicine"
            ],
            "keyTalent": {
                "id": "erudition",
                "name": "Erudition",
                "prerequisite": "none",
                "activation": "always",
                "description": "Choose one cultural or utility expertise you don't already have, and choose two different cognitive skills that aren't surge skills. When you make a test, you count as having the chosen expertise and one additional rank of each chosen skill. After a long rest with library access, you can reassign these."
            },
            "specialties": [
                {
                    "id": "artifabrian",
                    "name": "Artifabrian",
                    "description": "Combining science, engineering, and artistry, construct fabrials that perform precise functions",
                    "talents": [
                        {
                            "id": "efficient_engineer",
                            "name": "Efficient Engineer",
                            "prerequisite": "Crafting 1+; Erudition key talent",
                            "activation": "always",
                            "description": "Gain expertise in Armor Crafting, Equipment Crafting, or Weapon Crafting, and gain a fabrial. When crafting, your Opportunity range expands by 2 and your material cost is halved.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "prized_acquisition",
                            "name": "Prized Acquisition",
                            "prerequisite": "Erudition key talent",
                            "activation": "always",
                            "description": "Gain Fabrial Crafting expertise. Gain a special gem you can immediately use to craft a fabrial of your tier. You can reuse this gem for new fabrials.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "deep_study",
                            "name": "Deep Study",
                            "prerequisite": "Efficient Engineer talent",
                            "activation": "always",
                            "description": "Erudition grants you an additional cultural or utility expertise and two additional non-surge cognitive skills.",
                            "requiresTalent": [
                                "efficient_engineer"
                            ]
                        },
                        {
                            "id": "inventive_design",
                            "name": "Inventive Design",
                            "prerequisite": "Crafting 2+; Prized Acquisition talent",
                            "activation": "always",
                            "description": "Your Prized Acquisition fabrial can have an effect 1 tier higher than the tier you're currently crafting.",
                            "requiresTalent": [
                                "prized_acquisition"
                            ]
                        },
                        {
                            "id": "fine_handiwork",
                            "name": "Fine Handiwork",
                            "prerequisite": "Efficient Engineer talent",
                            "activation": "always",
                            "description": "When crafting, advanced features cost one upgrade instead of two.",
                            "requiresTalent": [
                                "efficient_engineer"
                            ]
                        },
                        {
                            "id": "overcharge",
                            "name": "Overcharge",
                            "prerequisite": "Crafting 3+; Prized Acquisition talent",
                            "activation": "special",
                            "description": "Once per turn, you can raise the stakes on a fabrial attack, then spend opportunity to Strike with that fabrial as free action.",
                            "requiresTalent": [
                                "prized_acquisition"
                            ]
                        },
                        {
                            "id": "experimental_tinkering",
                            "name": "Experimental Tinkering",
                            "prerequisite": "Fine Handiwork talent",
                            "activation": "always",
                            "description": "When crafting, your Opportunity range expands by 1 and your crafting time is halved. During a long rest, you can reconfigure your Prized Acquisition fabrial to a different fabrial.",
                            "requiresTalent": [
                                "fine_handiwork"
                            ]
                        },
                        {
                            "id": "overwhelm_with_details",
                            "name": "Overwhelm With Detail",
                            "prerequisite": "Lore 3+; Experimental Tinkering talent",
                            "activation": "special",
                            "description": "Spend 2 focus to use your Lore modifier on another cognitive or spiritual test.",
                            "requiresTalent": [
                                "experimental_tinkering"
                            ]
                        }
                    ]
                },
                {
                    "id": "strategist",
                    "name": "Strategist",
                    "description": "Always three steps ahead, knowing timing is everything",
                    "talents": [
                        {
                            "id": "strategize",
                            "name": "Strategize",
                            "prerequisite": "Deduction 1+; Erudition key talent",
                            "activation": "special",
                            "description": "After you succeed on a test to Gain Advantage using a skill gained from your Erudition, you can choose an ally you can influence. That ally gains the benefits of your Gain Advantage action instead of you. You can also spend 2 focus to prevent the target of your Gain Advantage from using reactions against the ally you chose until the end of your next turn.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "mind_and_body",
                            "name": "Mind and Body",
                            "prerequisite": "Erudition key talent",
                            "activation": "always",
                            "description": "Your Erudition talent grants you an additional skill, and you can use Erudition to choose physical skills that aren't surges. Additionally, gain one weapon expertise of your choice.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "composed_scholar",
                            "name": "Composed",
                            "prerequisite": "Strategize talent",
                            "activation": "always",
                            "description": "Through practiced composure, you push your limits without becoming distracted or losing track of threats. When you acquire this talent, your maximum and current focus increase by a number equal to your tier. When your tier increases by 1, your maximum and current focus do as well.",
                            "requiresTalent": [
                                "strategize"
                            ]
                        },
                        {
                            "id": "deep_contemplation",
                            "name": "Deep Contemplation",
                            "prerequisite": "Lore 2+; Composed talent",
                            "activation": "always",
                            "description": "You methodically search your mental archives for facts and information to help resolve your current situation. Reassign up to 2 of the skills and expertises gained from your Erudition.",
                            "requiresTalent": [
                                "composed_scholar"
                            ]
                        },
                        {
                            "id": "contingency",
                            "name": "Contingency",
                            "prerequisite": "Lore 3+; Composed talent",
                            "activation": "reaction",
                            "description": "After an ally you can influence within 20 feet of you rolls a Complication, you can use this reaction and spend 2 focus to remove a Complication from their test.",
                            "requiresTalent": [
                                "composed_scholar"
                            ]
                        },
                        {
                            "id": "know_your_moment",
                            "name": "Know Your Moment",
                            "prerequisite": "Deduction 2+; Mind and Body talent",
                            "activation": "always",
                            "description": "After the beginning of each round, each of your defenses increases by 2 until the start of your turn.",
                            "requiresTalent": [
                                "mind_and_body"
                            ]
                        },
                        {
                            "id": "keen_insight",
                            "name": "Keen Insight",
                            "prerequisite": "Deep Contemplation talent",
                            "activation": "always",
                            "description": "After you succeed on a test to Gain Advantage, you exploit one of your target's crucial traits, strengths, or flaws. Unless the target resists your influence, they gain a disadvantage on their next test during this encounter.",
                            "requiresTalent": [
                                "deep_contemplation"
                            ]
                        },
                        {
                            "id": "turning_point",
                            "name": "Turning Point",
                            "prerequisite": "Deduction 3+; Contingency talent",
                            "activation": "1_action",
                            "description": "Once per scene, spend 2 focus to find a weakness in an opposing group's strategy. Make a Deduction test against the Cognitive defense of the top-ranking enemy leader you can sense in this scene; if you took a slow turn, gain an advantage on this test. On a success, you and your allies you can influence gain an additional action on your next turns.",
                            "requiresTalent": [
                                "contingency"
                            ]
                        }
                    ]
                },
                {
                    "id": "surgeon",
                    "name": "Surgeon",
                    "description": "Apply their knowledge and empathy to heal the unwell and save lives",
                    "talents": [
                        {
                            "id": "field_medicine",
                            "name": "Field Medicine",
                            "prerequisite": "Medicine 1+; Erudition key talent",
                            "activation": "1_action",
                            "description": "Spend 1 focus to make a DC 15 Medicine test to treat a conscious willing character within your reach, rolling the target's recovery die as part of this test. You gain a disadvantage if treating yourself. On a success, your target recovers health equal to the recovery die + your ranks in Medicine. On a failure, only the recovery die value.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "emotional_intelligence",
                            "name": "Emotional Intelligence",
                            "prerequisite": "Erudition key talent",
                            "activation": "always",
                            "description": "Your Erudition talent grants you an additional skill, and you can use Erudition to choose spiritual skills that aren't surges. Additionally, you gain a utility expertise in Diagnosis.",
                            "requiresTalent": [
                                "erudition"
                            ]
                        },
                        {
                            "id": "anatomical_insight",
                            "name": "Anatomical Insight",
                            "prerequisite": "Field Medicine talent",
                            "activation": "special",
                            "description": "When you hit a target of your size or smaller with an unarmed attack, you can spend 1 focus or an opportunity to apply the Exhausted condition to your target. The penalty applied by this condition equals half your ranks in Medicine, rounded up.",
                            "requiresTalent": [
                                "field_medicine"
                            ]
                        },
                        {
                            "id": "collected_scholar",
                            "name": "Collected",
                            "prerequisite": "Emotional Intelligence talent",
                            "activation": "always",
                            "description": "You've learned to be mindful of your immediate goals without losing sight of your deeper value, keeping you even-keeled amid chaos. When you acquire this talent, increase your Cognitive and Spiritual defenses by 2.",
                            "requiresTalent": [
                                "emotional_intelligence"
                            ]
                        },
                        {
                            "id": "swift_healer",
                            "name": "Swift Healer",
                            "prerequisite": "Medicine 2+; Field Medicine talent",
                            "activation": "always",
                            "description": "You can use your Field Medicine as 1 action. Additionally, when you use an ability that restores health to another character, they recover additional health equal to your ranks in Medicine.",
                            "requiresTalent": [
                                "field_medicine"
                            ]
                        },
                        {
                            "id": "applied_medicine",
                            "name": "Applied Medicine",
                            "prerequisite": "Lore 2+; Collected talent",
                            "activation": "always",
                            "description": "When you cause a character to recover health, they recover additional health equal to your ranks in Lore.",
                            "requiresTalent": [
                                "collected_scholar"
                            ]
                        },
                        {
                            "id": "ongoing_care",
                            "name": "Ongoing Care",
                            "prerequisite": "Lore 3+; Swift Healer talent",
                            "activation": "special",
                            "description": "You can forgo the usual benefits of a short or long rest to instead spend that time treating an ally within reach. After that rest, make a DC 10 Medicine test, +5 difficulty per injury beyond the first. On a success, remove a single condition or similar effect caused by one of the target's injuries (the injury itself remains until healed). A target can't benefit from this talent more than once every 24 hours. Additionally, when you acquire this talent, gain a utility expertise in Mental Health Care.",
                            "requiresTalent": [
                                "swift_healer"
                            ]
                        },
                        {
                            "id": "resuscitate",
                            "name": "Resuscitation",
                            "prerequisite": "Medicine 3+; Swift Healer talent",
                            "activation": "special",
                            "description": "You can use your Field Medicine talent to attempt to resuscitate a fallen character. Spend 3 focus (instead of 1) to target a character within your reach who is Unconscious or who died within a number of rounds equal to your ranks in Medicine. The DC increases by 5 per injury beyond the first. On a success, the target recovers health as usual; if dead, they return to life. If Unconscious, they may remove that condition.",
                            "requiresTalent": [
                                "swift_healer"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "warrior",
            "name": "Warrior",
            "description": "Roshar is a world riven by conflict, and many of its people follow the path of the Warrior",
            "keyAttribute": "strength",
            "startingSkill": "athletics",
            "primarySkills": [
                "athletics",
                "heavy_weaponry",
                "light_weaponry",
                "intimidation",
                "leadership"
            ],
            "keyTalent": {
                "id": "vigilant_stance",
                "name": "Vigilant Stance",
                "prerequisite": "none",
                "activation": "free_action",
                "description": "You learn to use stances. Enter Vigilant Stance: While in this stance, reduce the focus cost of your Dodge and Reactive Strike reactions by 1. Additionally, you can enter another stance you know as free action."
            },
            "specialties": [
                {
                    "id": "duelist",
                    "name": "Duelist",
                    "description": "In the inner circles of the elite, contend for glory and political sway",
                    "talents": [
                        {
                            "id": "practiced_kata",
                            "name": "Practiced Kata",
                            "prerequisite": "Vigilant Stance key talent",
                            "activation": "always",
                            "description": "You can now use stances in conversations and endeavors, and unless Surprised, you can start each scene in Vigilant Stance. Spend 1 focus to enter a stance mid-conversation or mid-endeavor.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "flamestance",
                            "name": "Flamestance",
                            "prerequisite": "Intimidation 1+; Vigilant Stance key talent",
                            "activation": "1_action",
                            "description": "Enter Flamestance: You gain an advantage on Intimidation, and when only one enemy is in reach and no allies are, gain momentum to attack or Gain Advantage.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "ironstance",
                            "name": "Ironstance",
                            "prerequisite": "Athletics 2+; Practiced Kata talent",
                            "activation": "1_action",
                            "description": "Enter Ironstance: You gain an advantage on Insight, and when you're grazed or missed, you can make a Reactive Strike against your attacker.",
                            "requiresTalent": [
                                "practiced_kata"
                            ]
                        },
                        {
                            "id": "signature_weapon",
                            "name": "Signature Weapon",
                            "prerequisite": "Flamestance talent",
                            "activation": "always",
                            "description": "Gain a weapon expertise. Choose one of your weapon expertises, expanding its Opportunity range by 1 (2 at tier 3).",
                            "requiresTalent": [
                                "flamestance"
                            ]
                        },
                        {
                            "id": "surefooted_warrior",
                            "name": "Surefooted",
                            "prerequisite": "Ironstance talent",
                            "activation": "always",
                            "description": "Your movement increases by 10. Reduce damage from falling and dangerous terrain by twice your tier.",
                            "requiresTalent": [
                                "ironstance"
                            ]
                        },
                        {
                            "id": "feinting_strike",
                            "name": "Feinting Strike",
                            "prerequisite": "Intimidation 2+; Flamestance talent",
                            "activation": "2_actions",
                            "description": "Spend 2 focus to make a melee weapon attack vs. Cognitive. On a hit, your target loses one action and loses focus equal to your ranks in Intimidation. On a graze, they lose half as much focus.",
                            "requiresTalent": [
                                "flamestance"
                            ]
                        },
                        {
                            "id": "vinestance",
                            "name": "Vinestance",
                            "prerequisite": "Athletics 3+; Feinting Strike talent",
                            "activation": "1_action",
                            "description": "Enter Vinestance: Your Physical and Cognitive defenses increase by 1. After you're hit or grazed in melee, spend momentum to test Athletics vs. Cognitive to make attacker lose 1d4 focus and be pushed.",
                            "requiresTalent": [
                                "feinting_strike"
                            ]
                        },
                        {
                            "id": "wits_end",
                            "name": "Wit's End",
                            "prerequisite": "Intimidation 3+; Feinting Strike talent",
                            "activation": "1_action",
                            "description": "Spend 1 focus to move half your movement then make a melee weapon attack vs. Cognitive of a target who has 0 focus. This attack ignores deflect, deals an extra 4d6 damage, and can't graze.",
                            "requiresTalent": [
                                "feinting_strike"
                            ]
                        }
                    ]
                },
                {
                    "id": "shardbearer",
                    "name": "Shardbearer",
                    "description": "Wield Shardblades and Shardplate to dominate the battlefield with mythic might",
                    "talents": [
                        {
                            "id": "shard_training",
                            "name": "Shard Training",
                            "prerequisite": "Access to a Shardblade and Shardplate for training; Vigilant Stance key talent",
                            "activation": "always",
                            "description": "Gain Shardplate expertise, and gain either Grandbow, Shardblade, or Warhammer expertise. Your Shardplate has 2 additional charges. Your Shardblade Strikes graze additional targets up to your ranks in the skill used.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "stonestance",
                            "name": "Stonestance",
                            "prerequisite": "Vigilant Stance key talent",
                            "activation": "1_action",
                            "description": "Enter Stonestance: Your deflect increases by 1, and enemies within your reach must spend an additional action to attack your allies who aren't in Stonestance.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "windstance",
                            "name": "Windstance",
                            "prerequisite": "Perception 1+; Shard Training talent",
                            "activation": "1_action",
                            "description": "Enter Windstance: Gain an advantage on Agility. While you can reach multiple enemies, use free action to gain momentum to Disengage or attack.",
                            "requiresTalent": [
                                "shard_training"
                            ]
                        },
                        {
                            "id": "mighty_warrior",
                            "name": "Mighty",
                            "prerequisite": "Stonestance talent",
                            "activation": "always",
                            "description": "When you hit with a weapon or unarmed attack, for each action spent, deal extra damage equal to 1 + your tier.",
                            "requiresTalent": [
                                "stonestance"
                            ]
                        },
                        {
                            "id": "shattering_blow",
                            "name": "Shattering Blow",
                            "prerequisite": "Perception 2+; Windstance talent",
                            "activation": "special",
                            "description": "When you hit with a melee attack, spend 2 focus to deplete 1 charge from their armor, and each target you damage is pushed 5 feet.",
                            "requiresTalent": [
                                "windstance"
                            ]
                        },
                        {
                            "id": "bloodstance",
                            "name": "Bloodstance",
                            "prerequisite": "Athletics 2+; Mighty talent or Shard Training talent",
                            "activation": "1_action",
                            "description": "Enter Bloodstance: Your Opportunity range for attacks and physical tests expands by 2, but your Physical, Cognitive, and Spiritual defenses decrease by 2.",
                            "requiresTalent": [
                                [
                                    "mighty_warrior",
                                    "shard_training"
                                ]
                            ]
                        },
                        {
                            "id": "precise_parry",
                            "name": "Precise Parry",
                            "prerequisite": "Perception 3+; Shattering Blow talent",
                            "activation": "reaction",
                            "description": "Before being hit in melee, spend 1 focus to attempt to turn it into a graze. Test Athletics (unarmed) or Light/Heavy Weaponry (armed) vs. triggering attack.",
                            "requiresTalent": [
                                "shattering_blow"
                            ]
                        },
                        {
                            "id": "meteoric_leap",
                            "name": "Meteoric Leap",
                            "prerequisite": "Athletics 3+; Bloodstance talent",
                            "activation": "2_actions",
                            "description": "Spend 2 focus to leap a quarter of your movement and make unarmed attack vs. Physical of multiple targets, doubling damage and knocking weaker targets Prone. Gain an advantage in Shardplate.",
                            "requiresTalent": [
                                "bloodstance"
                            ]
                        }
                    ]
                },
                {
                    "id": "soldier",
                    "name": "Soldier",
                    "description": "The most common of fighting forces, mastering tactics to fight effectively in units",
                    "talents": [
                        {
                            "id": "cautious_advance",
                            "name": "Cautious Advance",
                            "prerequisite": "Discipline 1+; Vigilant Stance key talent",
                            "activation": "1_action",
                            "description": "Move up to half your movement, ignoring difficult terrain, then gain momentum to Brace or Gain Advantage.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "combat_training_warrior",
                            "name": "Combat Training",
                            "prerequisite": "Vigilant Stance key talent",
                            "activation": "always",
                            "description": "Gain expertise in a weapon, armor, and Military Life. Once per round, graze without spending focus.",
                            "requiresTalent": [
                                "vigilant_stance"
                            ]
                        },
                        {
                            "id": "defensive_position",
                            "name": "Defensive Position",
                            "prerequisite": "Athletics 2+; Cautious Advance talent",
                            "activation": "always",
                            "description": "The Brace action adds two disadvantages to attacks against you, instead of one, and allies can Brace behind your shield.",
                            "requiresTalent": [
                                "cautious_advance"
                            ]
                        },
                        {
                            "id": "devastating_blow",
                            "name": "Devastating Blow",
                            "prerequisite": "Athletics 3+; Combat Training talent",
                            "activation": "1_action",
                            "description": "Make a melee weapon attack vs. Physical, rolling an extra 2d8 damage.",
                            "requiresTalent": [
                                "combat_training_warrior"
                            ]
                        },
                        {
                            "id": "formation_drills",
                            "name": "Formation Drills",
                            "prerequisite": "Discipline 2+; Defensive Position talent",
                            "activation": "always",
                            "description": "Allies within 10 feet who Brace gain the benefits of your Defensive Position.",
                            "requiresTalent": [
                                "defensive_position"
                            ]
                        },
                        {
                            "id": "hardy_warrior",
                            "name": "Hardy",
                            "prerequisite": "Combat Training talent",
                            "activation": "always",
                            "description": "Gain +1 max health per level (including previous levels).",
                            "requiresTalent": [
                                "combat_training_warrior"
                            ],
                            "effects": {
                                "maxHealthPerLevel": 1
                            }
                        },
                        {
                            "id": "wary",
                            "name": "Wary",
                            "prerequisite": "Discipline 3+; Defensive Position talent",
                            "activation": "always",
                            "description": "You can't be Surprised while you have focus. When you lose focus involuntarily, reduce the amount lost by your ranks in Discipline.",
                            "requiresTalent": [
                                "defensive_position"
                            ]
                        },
                        {
                            "id": "swift_strikes_warrior",
                            "name": "Swift Strikes",
                            "prerequisite": "Hardy talent",
                            "activation": "special",
                            "description": "Spend 1 focus to make a second Strike with the same weapon.",
                            "requiresTalent": [
                                "hardy_warrior"
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});
})();
