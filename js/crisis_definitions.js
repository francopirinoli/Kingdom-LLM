// -----------------------------------------------------------------------------
// Kingdom LLM - crisis_definitions.js
//
// Contains definitions for all crisis events in the game.
// -----------------------------------------------------------------------------

const CrisisDefinitions = [
    // --- Resource-Triggered Crises ---
    {
        crisisId: 'famine',
        crisisName: 'Famine',
        triggerType: 'resource',
        triggerCondition: { resource: 'food', threshold: 150, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'food', threshold: 300, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'population', amount: -75, frequency: 'perTurn' }
        ],
        llmPromptText: "A severe famine grips the land.",
        playerNotificationStart: "The granaries are nearly empty! A devastating famine has begun.",
        playerNotificationEnd: "The harvest improves, and the threat of famine recedes.",
        isCritical: false
    },
    {
        crisisId: 'starvation',
        crisisName: 'Mass Starvation',
        triggerType: 'resource',
        triggerCondition: { resource: 'food', threshold: 50, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'food', threshold: 150, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'population', amount: -150, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'stability', amount: -5, frequency: 'perTurn' }
        ],
        llmPromptText: "Mass starvation is rampant.",
        playerNotificationStart: "People are dying in the streets! Mass starvation sweeps the kingdom.",
        playerNotificationEnd: "Food supplies stabilize, halting the worst of the starvation.",
        isCritical: true
    },
    {
        crisisId: 'bankruptcy_risk',
        crisisName: 'Bankruptcy Risk',
        triggerType: 'resource',
        triggerCondition: { resource: 'wealth', threshold: 50, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'wealth', threshold: 200, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -3, frequency: 'perTurn' }
        ],
        llmPromptText: "The royal treasury is nearly empty.",
        playerNotificationStart: "The royal coffers are dangerously low! The kingdom teeters on the brink of bankruptcy.",
        playerNotificationEnd: "The treasury recovers, averting immediate bankruptcy.",
        isCritical: false
    },
    {
        crisisId: 'economic_collapse',
        crisisName: 'Economic Collapse',
        triggerType: 'resource',
        triggerCondition: { resource: 'wealth', threshold: -100, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'wealth', threshold: 50, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -10, frequency: 'perTurn' },
            { type: 'factionStandingChange', faction: 'merchants', amount: -5, frequency: 'perTurn' }
        ],
        llmPromptText: "The kingdom's economy is collapsing.",
        playerNotificationStart: "The economy has collapsed! Trade is at a standstill, and unrest grows.",
        playerNotificationEnd: "Signs of economic recovery emerge.",
        isCritical: true
    },
    {
        crisisId: 'defenseless',
        crisisName: 'Defenseless Kingdom',
        triggerType: 'resource',
        triggerCondition: { resource: 'military', threshold: 50, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'military', threshold: 100, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -4, frequency: 'perTurn' }
        ],
        llmPromptText: "The kingdom's armies are critically weak.",
        playerNotificationStart: "Our armies are depleted! The kingdom lies vulnerable to its enemies.",
        playerNotificationEnd: "The ranks of the army swell, restoring a measure of security.",
        isCritical: false
    },
    {
        crisisId: 'invasion_imminent',
        crisisName: 'Imminent Invasion',
        triggerType: 'resource',
        triggerCondition: { resource: 'military', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'military', threshold: 75, comparison: 'greaterThanOrEqual' }, // Could also be an event chain
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -8, frequency: 'perTurn' }
        ],
        llmPromptText: "Neighboring kingdoms sense our weakness; an invasion is likely.",
        playerNotificationStart: "Our borders are undefended! Scouts report enemy armies massing for invasion!",
        playerNotificationEnd: "Our strengthened military deters immediate threats of invasion.",
        isCritical: true
    },
    {
        crisisId: 'low_stability',
        crisisName: 'Widespread Unrest',
        triggerType: 'resource',
        triggerCondition: { resource: 'stability', threshold: 30, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'stability', threshold: 50, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'wealth', amount: -50, frequency: 'perTurn' }
        ],
        llmPromptText: "Widespread unrest plagues the kingdom.",
        playerNotificationStart: "Stability is dangerously low! Riots and lawlessness are spreading.",
        playerNotificationEnd: "Order is slowly being restored to the realm.",
        isCritical: false
    },
    {
        crisisId: 'anarchy',
        crisisName: 'Anarchy',
        triggerType: 'resource',
        triggerCondition: { resource: 'stability', threshold: 10, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'stability', threshold: 30, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'wealth', amount: -100, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'food', amount: -50, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'population', amount: -25, frequency: 'perTurn' }
        ],
        llmPromptText: "Anarchy reigns.",
        playerNotificationStart: "The kingdom has descended into anarchy! Royal authority is collapsing.",
        playerNotificationEnd: "The rule of law begins to reassert itself over the chaos.",
        isCritical: true
    },
    {
        crisisId: 'depopulation',
        crisisName: 'Depopulation Crisis',
        triggerType: 'resource',
        triggerCondition: { resource: 'population', threshold: 300, comparison: 'lessThanOrEqual' },
        resolutionCondition: { resource: 'population', threshold: 500, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'wealth', amount: -30, frequency: 'perTurn' }
        ],
        llmPromptText: "The kingdom is becoming depopulated.",
        playerNotificationStart: "Our lands grow empty. A depopulation crisis threatens the kingdom's future.",
        playerNotificationEnd: "The population begins to recover, bringing new life to the realm.",
        isCritical: false
    },

    // --- Faction-Triggered Crises ---
    {
        crisisId: 'noble_discontent',
        crisisName: 'Noble Discontent',
        triggerType: 'faction',
        triggerCondition: { faction: 'nobility', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'nobility', threshold: 35, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -3, frequency: 'perTurn' }
        ],
        llmPromptText: "The nobility are openly expressing their discontent.",
        playerNotificationStart: "The great houses grumble! Noble discontent is high and threatens stability.",
        playerNotificationEnd: "The nobility's grievances have been addressed, for now.",
        isCritical: false
    },
    {
        crisisId: 'noble_rebellion', // This could also become an event chain
        crisisName: 'Noble Rebellion',
        triggerType: 'faction',
        triggerCondition: { faction: 'nobility', threshold: 5, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'nobility', threshold: 25, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -7, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'military', amount: -20, frequency: 'perTurn' }
        ],
        llmPromptText: "A powerful cabal of nobles is plotting rebellion.",
        playerNotificationStart: "Treason! Several noble houses have risen in open rebellion against the Crown!",
        playerNotificationEnd: "The noble rebellion has been quelled, but scars remain.",
        isCritical: true
    },
    {
        crisisId: 'clergy_heresy',
        crisisName: 'Heresy Accusations',
        triggerType: 'faction',
        triggerCondition: { faction: 'clergy', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'clergy', threshold: 35, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -2, frequency: 'perTurn' },
            { type: 'factionStandingChange', faction: 'peasantry', amount: -2, frequency: 'perTurn' }
        ],
        llmPromptText: "The clergy accuses many of heresy, causing fear.",
        playerNotificationStart: "The clergy's fervor grows dangerous! Accusations of heresy are causing widespread fear.",
        playerNotificationEnd: "The clergy's zeal has been tempered, and accusations of heresy lessen.",
        isCritical: false
    },
    {
        crisisId: 'clergy_inquisition', // This could also become an event chain
        crisisName: 'Clerical Inquisition',
        triggerType: 'faction',
        triggerCondition: { faction: 'clergy', threshold: 5, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'clergy', threshold: 25, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -6, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'population', amount: -20, frequency: 'perTurn' }
        ],
        llmPromptText: "A zealous inquisition is underway by the clergy.",
        playerNotificationStart: "The clergy has initiated a brutal inquisition! None are safe from their judgment.",
        playerNotificationEnd: "The inquisition ends, though its chilling effect lingers.",
        isCritical: true
    },
    {
        crisisId: 'merchant_strike',
        crisisName: 'Merchant Strike',
        triggerType: 'faction',
        triggerCondition: { faction: 'merchants', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'merchants', threshold: 35, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'wealth', amount: -75, frequency: 'perTurn' }
        ],
        llmPromptText: "The merchant guilds are threatening a general strike.",
        playerNotificationStart: "The merchant guilds are on strike! Trade grinds to a halt, and wealth plummets.",
        playerNotificationEnd: "The merchants have returned to their work, and trade resumes.",
        isCritical: false
    },
    {
        crisisId: 'peasant_unrest',
        crisisName: 'Peasant Uprising Risk',
        triggerType: 'faction',
        triggerCondition: { faction: 'peasantry', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'peasantry', threshold: 35, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'food', amount: -50, frequency: 'perTurn' }
        ],
        llmPromptText: "The peasantry is restless and on the verge of revolt.",
        playerNotificationStart: "The common folk are at their limit! Peasant unrest is high, and food production suffers.",
        playerNotificationEnd: "The peasantry's immediate concerns are met, and they return to their fields.",
        isCritical: false
    },
     {
        crisisId: 'peasant_rebellion', // This could also become an event chain
        crisisName: 'Peasant Rebellion',
        triggerType: 'faction',
        triggerCondition: { faction: 'peasantry', threshold: 5, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'peasantry', threshold: 25, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -8, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'food', amount: -100, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'population', amount: -50, frequency: 'perTurn' }
        ],
        llmPromptText: "The fields burn as the peasantry rises in open rebellion!",
        playerNotificationStart: "The countryside is aflame! The peasantry has risen in a full-scale rebellion!",
        playerNotificationEnd: "The peasant rebellion has been brutally suppressed, or their demands met. An uneasy peace settles.",
        isCritical: true
    },
    {
        crisisId: 'military_mutiny_risk',
        crisisName: 'Military Mutiny Risk',
        triggerType: 'faction',
        triggerCondition: { faction: 'military_leaders', threshold: 20, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'military_leaders', threshold: 35, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'military', amount: -15, frequency: 'perTurn' }
        ],
        llmPromptText: "Discontent is brewing within the army's ranks.",
        playerNotificationStart: "The soldiers are disloyal! Whispers of mutiny spread through the barracks.",
        playerNotificationEnd: "The army's loyalty is restored, and discipline improves.",
        isCritical: false
    },
    {
        crisisId: 'military_coup', // This could also become an event chain
        crisisName: 'Military Coup',
        triggerType: 'faction',
        triggerCondition: { faction: 'military_leaders', threshold: 5, comparison: 'lessThanOrEqual' },
        resolutionCondition: { faction: 'military_leaders', threshold: 25, comparison: 'greaterThanOrEqual' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -15, frequency: 'perTurn' }
        ],
        llmPromptText: "The generals are plotting to seize power; a military coup is imminent.",
        playerNotificationStart: "The generals have made their move! A military coup is underway to seize control of the kingdom!",
        playerNotificationEnd: "The coup has failed, and loyalist forces have secured the capital. (Or Game Over)",
        isCritical: true
    },

    // --- Random/Narrative Crises (with Event Chain Definitions) ---
    {
        crisisId: 'plague',
        crisisName: 'The Crimson Plague',
        triggerType: 'random',
        triggerCondition: { conditions: [{type: 'year', threshold: 3, comparison: 'greaterThanOrEqual'}] },
        resolutionCondition: { type: 'eventChain', orDurationTurns: 12 },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'population', amount: -100, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'stability', amount: -5, frequency: 'perTurn' }
        ],
        llmPromptText: "The Crimson Plague devastates the populace.",
        playerNotificationStart: "A deadly plague, the Crimson Sweats, has appeared and is spreading rapidly!",
        playerNotificationEnd: "Thanks to your efforts (or divine will), the Crimson Plague has passed from the lands.",
        isCritical: true,
        eventChainDefinition: [
            {
                stageId: 0, // Initial Outbreak Report
                eventParamsGeneratorKey: 'plague_stage_0_initial_report',
                llmStageGuidance: "The character is reporting the first frightening signs of the plague and is looking for the ruler's immediate response or allocation of resources to investigate."
            },
            {
                stageId: 1, // Investigation / Search for Cause/Cure
                eventParamsGeneratorKey: 'plague_stage_1_investigation_efforts',
                llmStageGuidance: "Investigators or healers report back on the plague's spread or a potential lead for a cure/containment, requiring further decisions or resource commitments."
            },
            {
                stageId: 2, // Applying a Solution / Final Measures
                eventParamsGeneratorKey: 'plague_stage_2_resolution_attempt',
                llmStageGuidance: "A potential cure or containment strategy is ready to be implemented, or a desperate final measure is proposed. The outcome may depend on the player's choice.",
                isTerminalSuccess: true // This stage's choices should lead to resolution
            }
        ]
    },
    {
        crisisId: 'earthquake',
        crisisName: 'Great Earthquake',
        triggerType: 'random',
        triggerCondition: { }, // No specific pre-conditions other than being chosen by the random roll
        resolutionCondition: { type: 'durationTurns', turns: 2 }, // Changed to 2 turns
        ongoingEffect: [ // These effects apply once when triggered
            { type: 'resourceChange', resource: 'stability', amount: -15, frequency: 'onTrigger' },
            { type: 'resourceChange', resource: 'food', amount: -200, frequency: 'onTrigger' },
            { type: 'resourceChange', resource: 'population', amount: -50, frequency: 'onTrigger' }
        ],
        llmPromptText: "The kingdom is reeling from a recent great earthquake; reconstruction efforts are underway.", // Updated prompt text
        playerNotificationStart: "A terrible earthquake has struck the kingdom, causing widespread destruction!",
        playerNotificationEnd: "The immediate danger from the earthquake has passed, and the long task of rebuilding begins.", // Updated end notification
        isCritical: true
    },
    {
        crisisId: 'comet_sighted',
        crisisName: 'Ominous Comet',
        triggerType: 'random',
        triggerCondition: { }, // No specific pre-conditions
        resolutionCondition: { type: 'eventChain', orDurationTurns: 4 },
        ongoingEffect: [
            { type: 'factionStandingChange', faction: 'peasantry', amount: -3, frequency: 'perTurn' },
            { type: 'factionStandingChange', faction: 'clergy', amount: +2, frequency: 'perTurn' }
        ],
        llmPromptText: "An ominous comet hangs in the night sky, unsettling the people.",
        playerNotificationStart: "A blood-red comet blazes in the night sky! The people are terrified of this ill omen.",
        playerNotificationEnd: "The comet fades from view, and the people's fears slowly subside.",
        isCritical: false,
        eventChainDefinition: [
            {
                stageId: 0, // Initial Sighting & Panic
                eventParamsGeneratorKey: 'comet_stage_0_sighting_panic',
                llmStageGuidance: "An astronomer or village elder reports the comet, highlighting widespread panic. The ruler must decide on an initial public response."
            },
            {
                stageId: 1, // Interpretation & Investigation
                eventParamsGeneratorKey: 'comet_stage_1_interpretation',
                llmStageGuidance: "Scholars or clergy offer interpretations (divine sign, natural phenomenon). The ruler may need to fund further study or religious ceremonies to appease factions or the populace."
            },
            {
                stageId: 2, // Addressing Fallout / Comet Fades
                eventParamsGeneratorKey: 'comet_stage_2_fallout_resolution',
                llmStageGuidance: "The comet's influence is waning, or a specific action has successfully calmed the populace. Choices here might have lasting impacts on stability or faction relations as the crisis concludes.",
                isTerminalSuccess: true
            }
        ]
    },
    {
        crisisId: 'cult_activity',
        crisisName: 'Shadow Cult Rises',
        triggerType: 'random',
        triggerCondition: { conditions: [{type: 'resource', resource: 'stability', threshold: 40, comparison: 'lessThan'}] },
        resolutionCondition: { type: 'eventChain' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'stability', amount: -2, frequency: 'perTurn' }
        ],
        llmPromptText: "A shadowy cult is gaining influence and sowing discord.",
        playerNotificationStart: "Whispers speak of a dark cult gaining followers and performing profane rituals in the shadows.",
        playerNotificationEnd: "The Shadow Cult has been exposed and its influence broken, for now.",
        isCritical: false,
        eventChainDefinition: [
            {
                stageId: 0, // Whispers and Initial Suspicions
                eventParamsGeneratorKey: 'cult_activity_stage_0_suspicions',
                llmStageGuidance: "A character reports unsettling rumors or minor incidents hinting at cult activity, asking for permission to investigate or expressing concern."
            },
            {
                stageId: 1, // Gathering Evidence / First Confrontation
                eventParamsGeneratorKey: 'cult_activity_stage_1_evidence',
                llmStageGuidance: "Evidence of the cult's activities has been found, or a minor confrontation has occurred. The player needs to decide how to proceed with the investigation or if direct action is needed."
            },
            {
                stageId: 2, // Exposing and Dealing with the Cult
                eventParamsGeneratorKey: 'cult_activity_stage_2_confrontation',
                llmStageGuidance: "The cult's leadership or main hideout has been identified. This stage involves the final actions to dismantle the cult.",
                isTerminalSuccess: true
            }
        ]
    },
    {
        crisisId: 'bandit_king',
        crisisName: 'Rise of the Bandit King',
        triggerType: 'random',
        triggerCondition: { conditions: [
            {type: 'resource', resource: 'military', threshold: 70, comparison: 'lessThan'},
            {type: 'resource', resource: 'stability', threshold: 60, comparison: 'lessThan'}
        ]},
        resolutionCondition: { type: 'eventChain' },
        ongoingEffect: [
            { type: 'resourceChange', resource: 'wealth', amount: -40, frequency: 'perTurn' },
            { type: 'resourceChange', resource: 'stability', amount: -3, frequency: 'perTurn' }
        ],
        llmPromptText: "A powerful Bandit King is unifying robber bands and terrorizing the countryside.",
        playerNotificationStart: "A notorious bandit has crowned himself 'King of the Outlaws'! His forces grow, and trade routes are under siege.",
        playerNotificationEnd: "The Bandit King has been defeated, and his reign of terror is over.",
        isCritical: false,
        eventChainDefinition: [
            {
                stageId: 0, // Reports of Rising Threat
                eventParamsGeneratorKey: 'bandit_king_stage_0_reports',
                llmStageGuidance: "Scouts or merchants report the Bandit King's growing influence and early raids. Initial options could involve investigation, a small punitive force, or attempts at negotiation/appeasement."
            },
            {
                stageId: 1, // Escalation / Failed Initial Attempts
                eventParamsGeneratorKey: 'bandit_king_stage_1_escalation',
                llmStageGuidance: "The Bandit King's power grows, possibly after initial attempts to stop him fail. The situation is more dire, requiring a more significant commitment or a cleverer strategy."
            },
            {
                stageId: 2, // Decisive Action / Confrontation
                eventParamsGeneratorKey: 'bandit_king_stage_2_confrontation',
                llmStageGuidance: "A plan is in motion for a major confrontation. This could be a military campaign, a targeted strike on the Bandit King's stronghold, or an attempt to turn his lieutenants."
            },
            {
                stageId: 3, // Aftermath / Resolution
                eventParamsGeneratorKey: 'bandit_king_stage_3_aftermath',
                llmStageGuidance: "The Bandit King has been dealt with. This stage focuses on the immediate aftermath, such as securing the region, dealing with remaining bandits, or rewarding those who helped.",
                isTerminalSuccess: true
            }
        ]
    }
];

// Make CrisisDefinitions available globally or for other modules
if (typeof window !== 'undefined') {
    window.CrisisDefinitions = CrisisDefinitions;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CrisisDefinitions;
}
