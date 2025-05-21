// Kingdom LLM - random_tables.js
//
// Contains data and functions for generating random event parameters,
// mock event data, and specific parameters for crisis event chain stages.
// -----------------------------------------------------------------------------

const RandomTables = {
    // --- Faction Definitions & Character Roles ---
    factions: {
        nobility: {
            name: "Nobility",
            roles: [
                "Aging Duke", "Ambitious Countess", "Young Baron", "Scheming Viscount",
                "Powerful Duchess", "Grumpy Earl", "Concerned Lord", "Wealthy Landowner",
                "Knight Banneret", "Courtly Advisor", "Master of the Hunt", "Provincial Governor",
                "Disinherited Noble", "Regent Dowager", "Scholarly Prince", "Stern Matriarch", "Cunning Chancellor"
            ],
            concerns: [
                "land rights", "ancient privileges", "succession disputes", "royal favor", "tax exemptions",
                "military obligations", "threats to their lineage", "courtly influence", "marriage alliances",
                "loss of traditional power", "peasant unrest on their lands", "maintaining their castles", "feudal dues"
            ]
        },
        clergy: {
            name: "Clergy",
            roles: [
                "Pious Bishop", "Stern Abbess", "Humble Friar", "Zealous Inquisitor",
                "Scholarly Monk", "Mysterious Oracle", "Devout Priest", "Temple Elder",
                "Wandering Preacher", "Abbey Scribe", "Canon Lawyer", "Relic Keeper",
                "Charitable Sister", "Head of a Holy Order", "Archbishop's Emissary", "Keeper of Sacred Texts"
            ],
            concerns: [
                "divine favor", "heresy", "church property", "moral failings of the populace", "religious festivals", "tithes",
                "blasphemy", "pilgrimages", "construction of new temples/monasteries", "influence over education",
                "charitable works", "prophecies and omens", "maintaining church authority", "combating paganism"
            ]
        },
        merchants: {
            name: "Merchants",
            roles: [
                "Wealthy Guildmaster", "Shrewd Trader", "Exotic Goods Importer", "Craftsman Representative",
                "Banker", "Ship Owner", "Shopkeeper", "Peddler", "Master Artisan",
                "Caravan Leader", "Spice Merchant", "Loan Shark (discreetly)", "Foreign Emissary of Trade",
                "Chief of the Dockworkers' Guild", "Master Cartographer"
            ],
            concerns: [
                "trade routes", "guild monopolies", "taxation on goods", "infrastructure (roads, ports, bridges)", "coinage quality",
                "safety from bandits/pirates", "new market opportunities", "tariffs and tolls", "standardized weights and measures",
                "competition from foreign traders", "labor disputes", "letters of credit", "insurance for shipments"
            ]
        },
        peasantry: {
            name: "Peasantry",
            roles: [
                "Stoic Farmer", "Desperate Villager", "Village Elder", "Angry Mob Leader",
                "Grieving Mother", "Hopeful Youth", "Local Miller", "Shepherd", "Blacksmith",
                "Innkeeper", "Fisherman", "Forager", "Displaced Serf", "Wise Woman of the Village", "Reeve (village official)"
            ],
            concerns: [
                "harvest quality", "banditry", "corvee labor (forced labor)", "access to justice", "famine", "disease",
                "high taxes", "oppressive lords", "land enclosures", "access to common lands (forests, pastures)",
                "military conscription", "witchcraft accusations", "fair prices for their goods", "protection from wild animals"
            ]
        },
        military_leaders: {
            name: "Military Leaders",
            roles: [
                "Veteran General", "Young Captain", "Gruff Sergeant", "Master-at-Arms",
                "Knight Commander", "Siege Engineer", "Scout Leader", "Royal Guard Captain",
                "Mercenary Commander", "Quartermaster", "Drill Instructor", "Naval Admiral", "Border Warden",
                "Master Spy (for the army)", "Keeper of the Armory"
            ],
            concerns: [
                "army funding and pay", "troop morale and discipline", "border defenses and fortifications", "new recruits and training",
                "weaponry and armor quality", "potential external threats", "intelligence on enemy movements", "supply lines",
                "veterans' welfare", "glory and recognition", "internal security threats", "siege preparations", "naval power"
            ]
        }
    },

    // --- Character Moods ---
    moods: [
        "Concerned", "Desperate", "Hopeful", "Angry", "Fearful", "Greedy",
        "Scheming", "Proud", "Humble", "Demanding", "Cautious", "Optimistic",
        "Pessimistic", "Frustrated", "Excited", "Suspicious", "Loyal", "Worried",
        "Resentful", "Determined", "Anxious", "Relieved", "Impatient", "Grateful",
        "Disappointed", "Skeptical", "Urgent", "Solemn", "Enthusiastic"
    ],

    // --- Event Archetypes / Situation Templates ---
    situationTemplates: [
        // Resource related
        "There is a critical shortage of {resource} in the region of {region_name}, and the people are suffering greatly.",
        "We request royal funds to improve the production of {resource_production_method} which will benefit the entire kingdom and increase your treasury.",
        "A disaster ({disaster_type}) has destroyed our supply of {resource} in {place}, we need immediate aid or face ruin.",
        "An opportunity to acquire a large amount of {resource} from {source} has arisen, but it requires a significant investment and carries some risk of {potential_risk}.",
        "The royal stores of {resource} are dwindling rapidly due to {reason_for_dwindling}, and we may not last the season.",
        "A new method for {resource_production_method} promises to double our output of {resource}, but requires royal charter and access to {specific_land_or_material}.",
        "The price of {resource} has skyrocketed due to {market_manipulation_or_shortage}, causing hardship for many.",

        // Faction specific
        "The {other_faction_name} are encroaching on our traditional rights concerning {faction_concern}, this insult cannot be tolerated!",
        "We demand justice for a heinous crime committed against one of our members by a {other_faction_member_role} from the {other_faction_name}.",
        "A sacred festival/celebration honoring {deity_or_tradition} is approaching, and we require your support, presence, and a generous contribution to ensure its success and divine favor.",
        "We propose a new law that would greatly benefit our faction regarding {faction_concern}, and we seek your royal assent to enact it swiftly.",
        "A prominent member of our faction, {character_name_placeholder}, has been {wrongfully_accused_or_detained} by {accusing_party}, and we demand their immediate release and an apology.",
        "Our faction wishes to fund the construction of a {faction_building} in {place}, but we need your permission and perhaps a grant of royal land or resources.",
        "There is a growing schism within our faction regarding {internal_dispute}, and your wisdom is needed to mediate before it tears us apart.",

        // General Kingdom Issues
        "Bandits, led by the notorious {bandit_leader_name}, are plaguing the {road_or_region}, disrupting travel and trade, and the local militia is overwhelmed.",
        "A strange and virulent sickness, known as {disease_name}, is spreading like wildfire through {place}, and the healers are baffled and desperate.",
        "Rumors of {ominous_event_or_conspiracy} are causing widespread unrest among the people, some whisper of rebellion and the end of days.",
        "A neighboring kingdom, {neighboring_kingdom_name}, has made a {diplomatic_overture_type} (e.g., threat, offer, request) that requires an immediate and carefully considered response.",
        "A new discovery of {valuable_item_or_knowledge} has been made in {location}, but it is guarded by {guardian_type} and retrieving it will be perilous.",
        "There's a bitter dispute over {disputed_resource_or_territory} between two powerful noble families, the {noble_family_1} and the {noble_family_2}, threatening to erupt into open conflict.",
        "A {natural_phenomenon} (e.g., comet, earthquake, prolonged drought) is being interpreted as a bad omen by the populace, causing fear and religious fervor.",
        "We've received credible reports of {mythical_creature} sightings near {place}, troubling the local populace and disrupting their livelihoods.",
        "The old {infrastructure_type} at {location} is crumbling and urgently needs repair before it collapses entirely, cutting off {vital_connection}.",

        // Personal pleas
        "My family is starving due to {reason}, I beg for your aid, Your Majesty, even a small amount of {resource} or a royal pardon for {minor_offense} would save us.",
        "I have been wrongly accused of {crime} by {accuser_name}, a person of ill repute, I plead for your intervention and a fair trial by a neutral judge.",
        "My child has been taken by {kidnapper_type} to their lair in {dangerous_location}, I implore you to send your bravest soldiers to rescue them!",
        "I offer a unique skill, {unique_skill}, in service to the Crown, if you would grant me patronage and the resources to pursue my work for the good of {kingdom_name_placeholder}.",
        "A great injustice has been done to my village of {village_name_1} by the neighboring {village_name_2} over {local_dispute}, we seek your judgment."
    ],

    // Helper data for templates
    placeholders: {
        resource: ["grain", "timber", "stone", "gold", "livestock", "tools", "medicine", "iron ore", "fine textiles", "ale", "salt", "herbs", "horses"],
        region_name: ["the Northern Marches", "the Sunken Valley", "Westwood", "Oldtown District", "Riverbend Province", "the Dragon's Tooth Mountains", "the Whispering Plains", "Blackwood Forest", "the Barren Hills", "the Coastal Lowlands"],
        resource_production_method: ["advanced farming techniques", "deep mining operations", "sustainable logging camps", "expanded fishing fleets", "efficient quarrying methods", "grand irrigation systems", "three-field crop rotation", "masterful smithing techniques", "alchemical processes"],
        place: ["the capital city", "the village of Oakhaven", "the port of Seacliff", "the monastery of Quiet Peak", "the frontier town of Grimwater", "the fishing village of Saltmarsh", "your summer palace", "the Western Garrison", "the Grand Market"],
        source: ["a traveling merchant caravan from the distant South", "a newly discovered rich mine in the {region_name}", "a neighboring barony (for a hefty price and a promise of future favors)", "a reclusive inventor with a revolutionary design", "a shipwreck salvaged by our fishermen from the treacherous {coastal_area_name}", "a hidden temple cache"],
        potential_risk: ["attracting pirates", "upsetting a rival guild", "provoking a neighboring lord", "the goods being cursed", "the investment failing entirely"],
        reason_for_dwindling: ["a harsh and prolonged winter", "increased army upkeep for border patrols", "unexpected spoilage due to damp conditions", "a recent grand royal festival", "theft from the royal granaries by unknown culprits", "a failed trade expedition"],
        specific_land_or_material: ["the King's Wood", "the old quarry at Stonefall", "rare reagents from the Shadowfen", "a royal patent"],
        market_manipulation_or_shortage: ["hoarding by the {other_faction_name} Guild", "a blight in a neighboring kingdom", "disruption of trade routes by {hostile_force}", "a sudden increase in demand from the army"],
        disaster_type: ["a great fire that swept through the granaries", "a devastating flood along the {river_name} River", "a crop blight that affects {specific_crop}", "an earthquake that collapsed several mines", "a fierce storm that sank three merchant ships", "a cattle plague that decimated the herds"],
        other_faction_name: ["Nobility", "Clergy", "Merchants", "Peasantry", "Military Leaders"], // Filtered in fillTemplate
        faction_concern: ["land usage and borders", "tax collection rights and amounts", "religious doctrine and practices", "market access and trade fees", "military conscription and command", "judicial authority and legal interpretation", "ancient charters and laws", "representation on the Royal Council"],
        other_faction_member_role: ["an arrogant young noble", "a notoriously greedy merchant", "a fanatically zealous priest", "a disgruntled and outspoken soldier", "a corrupt and cruel tax collector", "a rival guildmaster seeking to undermine us", "a haughty bishop"],
        deity_or_tradition: ["the Harvest God", "our Founding Ancestors", "the Spring Equinox Festival", "the Feast of Saint Cuthbert", "the ancient Rite of Kingship", "the All-Mother Goddess", "the Sun God Sol"],
        character_name_placeholder: ["Lord Valerius", "Sister Agnes", "Master Tiberion", "Grizelda the Herbalist", "Sir Kaelan", "Lady Annelise"],
        wrongfully_accused_or_detained: ["imprisoned on trumped-up false charges", "accused of witchcraft by superstitious villagers", "detained by a rival faction without trial", "exiled without cause or hearing", "slandered and stripped of their titles"],
        accusing_party: ["a jealous rival", "a corrupt magistrate", "a misinformed mob", "a political enemy"],
        faction_building: ["new chapterhouse for our order", "grand cathedral to inspire the faithful", "fortified guildhall to protect our trade", "an orphanage for the destitute", "new training barracks for your soldiers", "a public library for all citizens", "a monument to {historical_figure}"],
        internal_dispute: ["the interpretation of sacred texts", "the leadership of our guild", "the allocation of newly acquired lands", "a matter of honor between two prominent families", "the correct strategy for dealing with {external_problem}"],
        road_or_region: ["King's Highway", "Whispering Woods", "borderlands near {neighboring_kingdom_name}", "the trade route to {major_city_name}", "the Pilgrim's Path to the {sacred_site}"],
        bandit_leader_name: ["One-Eyed Jack", "Elara the Red", "Gorgon the Smasher", "The Shadow Fox"],
        disease_name: ["the Shivering Pox", "the Grey Wasting", "Dragon's Breath Fever", "the Weeping Ague", "the Crimson Blight", "the Fading Sickness"],
        ominous_event_or_conspiracy: ["a prophecy of doom foretold by a mad hermit found in the {wilderness_area}", "a secret cult worshipping a dark entity known as {dark_entity_name}", "a cabal of nobles plotting treason with aid from {foreign_power}", "rumors of a royal impostor seeking to usurp your throne", "whispers of a dragon awakening in the {mountain_range}"],
        neighboring_kingdom_name: ["Sylvandell", "Ironhold", "Meridia", "the Sunken Kingdom of Eldoria", "the Free Cities of the Coast", "the Valorian Empire", "the Shadow Marches"],
        diplomatic_overture_type: ["an aggressive demand for tribute and hostages", "a surprising offer of a royal marriage to unite our kingdoms", "a desperate request for military aid against the encroaching {common_enemy}", "a lucrative trade proposal that seems too good to be true", "a veiled threat concerning border skirmishes and 'accidental' incursions", "an invitation to a grand tournament with hidden political motives"],
        valuable_item_or_knowledge: ["an ancient artifact of immense power known as the {artifact_name}", "a rich vein of {rare_mineral} previously unknown in these lands", "a new magical incantation for {magical_effect} recorded on a fragile scroll", "a lost map to a forgotten city rumored to hold untold riches", "a cure for the dreaded {disease_name} made from rare herbs found only in {dangerous_location}"],
        location: ["the old ruins of {ancient_civilization} in the {wilderness_area}", "the deep caverns beneath the {mountain_range}, rumored to be a {mythical_creature}'s lair", "a forgotten library hidden within the Grand Cathedral's catacombs", "a hermit's cave high in the {mountain_range}", "a haunted battlefield where a great tragedy occurred"],
        guardian_type: ["a fearsome beast of legend", "a well-armed band of outlaws led by {bandit_leader_name}", "an ancient curse that affects the minds of intruders", "a rival explorer from {neighboring_kingdom_name}", "powerful magical wards that repel the unworthy", "a cunning series of traps"],
        disputed_resource_or_territory: ["a fertile valley known as {valley_name}", "a vital river crossing at {bridge_or_ford_name}", "an ancient forest rich in {valuable_tree_type} timber", "exclusive hunting rights in the King's Wood", "fishing rights in the {river_or_lake_name}"],
        noble_family_1: ["House Beaumont", "House Tyrell (be creative!)", "House Lancaster (be creative!)", "Clan MacLeod (be creative!)"],
        noble_family_2: ["House Mortimer", "House de Valois (be creative!)", "House York (be creative!)", "Clan Campbell (be creative!)"],
        village_name_1: ["Oakhaven", "Streamford", "Milltown", "Stonebridge", "Fairwater", "Greenfield"],
        village_name_2: ["Willow Creek", "Highmeadow", "Ironhill", "Riverdell", "Blackcroft", "Shepherd's Rest"],
        natural_phenomenon: ["a blood-red comet that hangs in the sky for weeks", "a series of earth tremors that have damaged buildings in {place}", "a prolonged and unnatural drought that has withered the crops", "an unseasonal blizzard that has trapped travelers in the {mountain_range}", "a solar eclipse that plunged the land into darkness at midday", "a strange aurora in the southern skies"],
        mythical_creature: ["a griffin with a taste for royal livestock", "a manticore terrorizing the {road_or_region}", "a band of goblins raiding outlying farms", "a lone, ancient giant demanding tribute", "a will-o'-the-wisp leading travelers astray in the {wilderness_area}", "a basilisk turning shepherds to stone"],
        reason: ["a failed harvest due to unseasonal frosts", "unjust taxes levied by a corrupt local official who demands bribes", "a recent bandit attack on my farm where they stole all my seed grain", "the loss of my fishing boat in a storm and the nets with it", "my workshop burning down due to a rival's sabotage", "a crippling injury sustained while performing corvee labor"],
        crime: ["theft of a sacred relic from the Grand Cathedral", "high treason against the Crown by conspiring with {neighboring_kingdom_name}", "blasphemy against the High Temple and its most sacred tenets", "the murder of a royal tax collector in broad daylight", "practicing forbidden magic that endangers the souls of the innocent", "desertion from the army in a time of war"],
        kidnapper_type: ["slavers from a distant land known for their cruelty", "a desperate bandit gang led by the ruthless {bandit_leader_name}", "a rival noble seeking ransom or political leverage", "followers of a dark cult who require sacrifices", "orcish raiders from the {mountain_range}"],
        unique_skill: ["unparalleled swordsmanship and tactical genius", "knowledge of ancient languages and lost histories", "the ability to brew potent healing potions and antitoxins", "mastery of siegecraft and fortification design", "a talent for diplomacy with hostile barbarian tribes", "the art of creating intricate clockwork devices", "predicting the weather with uncanny accuracy"],
        rare_mineral: ["mithril", "adamantine", "sunstones", "dragonshards", "star-iron", "moon-crystals"],
        magical_effect: ["healing grievous wounds", "warding against evil spirits", "creating convincing illusions", "divining future events", "enhancing crop growth", "communicating with animals"],
        ancient_civilization: ["the Star-Gazers", "the First Men", "the Serpent Cultists of Yigg", "the Elder Elves", "the Dwarven Earth-Shapers"],
        mountain_range: ["Dragon's Tooth Mountains", "Grey Peaks", "Spine of the World", "The Frostfangs", "The Cloudpiercers"],
        wilderness_area: ["Blackwood Forest", "Haunted Marshes of Sorrow", "Sunken Desert of Lost Souls", "The Whispering Wastes", "The Tangled Wilds"],
        major_city_name: ["Silverport", "King's Crown", "Old Capital City", "Port Prosperity", "Stronghold"],
        common_enemy: ["the Orcish hordes from the East", "the Undead Scourge rising from ancient battlefields", "the Northern Barbarian tribes", "the insidious {dark_entity_name} cult", "the aggressive {neighboring_kingdom_name} empire"],
        coastal_area_name: ["Shipwreck Bay", "the Jagged Coast", "Kraken's Deeps"],
        river_name: ["Silverstream", "Blackwater", "Dragon's Tail"],
        specific_crop: ["wheat", "barley", "grapes", "apples"],
        hostile_force: ["the {neighboring_kingdom_name} navy", "pirates from the Serpent Isles", "a goblin warband"],
        historical_figure: ["King Uther the Great", "Saint Elara the Pure", "Grak the Conqueror"],
        external_problem: ["the goblin raids", "the trade embargo by {neighboring_kingdom_name}", "the spread of heresy"],
        valley_name: ["Green Vale", "Eagle's Pass", "Shadow Glen"],
        bridge_or_ford_name: ["Old King's Bridge", "Troll Ford", "Merchant's Crossing"],
        valuable_tree_type: ["oaken", "ironwood", "heartwood"],
        river_or_lake_name: ["Lake Evendim", "River Running", "Mirror Mere"],
        minor_offense: ["poaching a rabbit for my starving family", "speaking out of turn against a minor noble", "sleeping on watch (once!)"],
        accuser_name: ["Baron Von Malice", "Old Man Hemlock", "Greedy Giselbert"],
        dangerous_location: ["the Goblin Caves", "the ruins of Castle Direstone", "the heart of the Cursed Forest"],
        kingdom_name_placeholder: ["your glorious kingdom", "this realm", "our beloved land"],
        local_dispute: ["water rights for irrigation", "grazing boundaries for livestock", "an unpaid debt between families", "a stolen heirloom"],
        dark_entity_name: ["Moloch", "The Shadow That Creeps", "Nihilith"],
        foreign_power: ["the spies of {neighboring_kingdom_name}", "a wealthy merchant prince from a rival city-state", "a shadowy organization with unknown motives"],
        artifact_name: ["Orb of Dominion", "Crown of Ages", "Shard of Eternal Night"]
    },

    // --- Character Names ---
    maleNames: [
        "Arthur", "Gideon", "Reginald", "Bartholomew", "Cedric", "Finnian", "Percival", "Theodore", "Jasper", "Alaric",
        "Leoric", "Marcus", "Gareth", "Tristan", "Edmund", "Roland", "Silas", "Victor", "Lucian", "Darius",
        "Corbin", "Lysander", "Orion", "Rhys", "Kael", "Finn", "Eamon", "Brennan", "Malachi", "Sterling",
        "Alasdair", "Brand", "Caspian", "Drake", "Evander", "Fabian", "Giles", "Hector", "Ivor", "Jareth",
        "Keiran", "Lancelot", "Merrick", "Neville", "Osmund", "Piers", "Quentin", "Roderick", "Sylvan", "Torin",
        "Ulric", "Vaughn", "Warwick", "Xavier", "York", "Zephyr"
    ],
    femaleNames: [
        "Guinevere", "Eleanor", "Isolde", "Matilda", "Astrid", "Rowena", "Seraphina", "Beatrix", "Clara", "Elara",
        "Lyra", "Morgana", "Vivienne", "Cora", "Adelaide", "Genevieve", "Rosalind", "Helena", "Cassandra", "Diana",
        "Anya", "Brynn", "Celeste", "Dahlia", "Eira", "Fiona", "Giselle", "Honora", "Imogen", "Jocelyn",
        "Kiera", "Lilith", "Maeve", "Nadia", "Ophelia", "Portia", "Quintessa", "Rhiannon", "Sabina", "Thalia",
        "Una", "Vespera", "Willow", "Xanthe", "Yvaine", "Zara"
    ],

    /**
     * Selects a random element from an array.
     * @param {Array} arr - The array to select from.
     * @returns {*} A random element from the array.
     */
    getRandomElement(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Fills placeholders in a situation template string.
     * @param {string} template - The template string.
     * @param {string} currentFactionName - The name of the current event's faction to avoid self-conflict in some templates.
     * @returns {string} The template with placeholders filled.
     */
    fillTemplate(template, currentFactionName = null) {
        let filledTemplate = template;
        const placeholderKeys = Object.keys(this.placeholders);

        placeholderKeys.forEach(key => {
            const regex = new RegExp(`{${key}}`, 'g');
            if (filledTemplate.match(regex)) {
                let valuePool = [...this.placeholders[key]];
                if (key === 'other_faction_name' && currentFactionName) {
                    valuePool = valuePool.filter(f => f.toLowerCase() !== currentFactionName.toLowerCase());
                }
                let replacement = this.getRandomElement(valuePool);
                if (replacement === undefined || replacement === null || valuePool.length === 0) {
                    replacement = `[${key}_unavailable]`; // Fallback if pool is empty or random element is undefined
                }
                filledTemplate = filledTemplate.replace(regex, replacement);
            }
        });
        return filledTemplate;
    },


    /**
     * Generates a random set of parameters for an event.
     * @param {object} gameContext - The current game state and other context (e.g., currentMonthName).
     * @returns {object} An object containing event parameters.
     */
    getRandomEventParams(gameContext) {
        const factionIds = Object.keys(this.factions);
        const randomFactionId = this.getRandomElement(factionIds);
        const factionData = this.factions[randomFactionId];

        const characterRole = this.getRandomElement(factionData.roles);
        const mood = this.getRandomElement(this.moods);

        const isMale = Math.random() < 0.5;
        const characterName = isMale ? this.getRandomElement(this.maleNames) : this.getRandomElement(this.femaleNames);

        let situation = this.getRandomElement(this.situationTemplates);
        situation = this.fillTemplate(situation, factionData.name);

        return {
            factionId: randomFactionId,
            factionName: factionData.name,
            characterRole: characterRole,
            characterName: characterName,
            mood: mood,
            situation: situation,
            portraitSeed: `${characterName} ${characterRole} ${factionData.name}`
        };
    },

// --- Crisis Event Chain Stage Definitions ---
// This object maps eventParamsGeneratorKey (from crisis_definitions.js) to functions
// that return specific eventParams for that stage of a crisis chain.
crisisChainEventStages: {
    // --- Plague Crisis Stages ---
    'plague_stage_0_initial_report': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames.concat(RandomTables.maleNames));
        return {
            factionId: 'peasantry',
            factionName: RandomTables.factions.peasantry.name,
            characterRole: "Village Healer",
            characterName: characterName,
            mood: "Extremely Fearful",
            situation: `Your Majesty, a terrifying sickness has broken out in the village of {village_name_1}! People are developing high fevers, crimson rashes, and falling into delirium. We've already lost several souls. We call it the 'Crimson Sweats'. We desperately need your wisdom and aid before it consumes us all!`,
            portraitSeed: `${characterName} Village Healer Crimson Sweats`,
        };
    },
    'plague_stage_1_investigation_efforts': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'clergy',
            factionName: RandomTables.factions.clergy.name,
            characterRole: "Royal Physician", // Or a learned monk
            characterName: characterName,
            mood: "Grave and Overwhelmed",
            situation: `The Crimson Sweats is worse than we imagined, Your Majesty. It spreads like wildfire through close contact and taints the water. My initial investigations in {region_name} suggest it may have originated from {source_of_contamination}. We need immediate resources for further study, to establish quarantine zones, or to develop a treatment. The people are panicking.`,
            portraitSeed: `${characterName} Royal Physician Plague Study`,
        };
    },
    'plague_stage_2_resolution_attempt': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'merchants',
            factionName: RandomTables.factions.merchants.name,
            characterRole: "Master Alchemist",
            characterName: characterName,
            mood: "Hopeful but Desperate",
            situation: `After tireless work, funded by your generosity, I believe I've developed a potential antitoxin for the Crimson Sweats, Your Majesty! It uses rare {rare_herb_name} and {another_ingredient}. However, it's untested on humans and carries risks. The alternative, as some councilors suggest, is to enact the 'Purifying Flame' protocol – burning infected districts to stop the spread, a horrifying prospect. What is your command?`,
            portraitSeed: `${characterName} Master Alchemist Experimental Cure`,
        };
    },

    // --- Comet Sighted Crisis Stages ---
    'comet_stage_0_sighting_panic': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'clergy',
            factionName: RandomTables.factions.clergy.name,
            characterRole: "Temple Astrologer",
            characterName: characterName,
            mood: "Agitated and Awestruck",
            situation: `A new star, a blood-red comet with a fearsome tail, has appeared in the heavens, Your Majesty! The ancient texts are unclear, but many fear it as a harbinger of doom or great upheaval. The populace is already whispering and panic is beginning to set in. How will the Crown interpret this celestial sign?`,
            portraitSeed: `${characterName} Temple Astrologer Comet Sighting`,
        };
    },
    'comet_stage_1_interpretation': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'nobility',
            factionName: RandomTables.factions.nobility.name,
            characterRole: "Royal Scholar & Historian",
            characterName: characterName,
            mood: "Thoughtful and Concerned",
            situation: `Your Majesty, I have consulted the royal archives regarding the comet. Some records speak of similar omens preceding great victories, others of famine and war. The Clergy preaches repentance, while some philosophers claim it's merely a natural wonder. A clear royal declaration is needed to guide public opinion and prevent further unrest.`,
            portraitSeed: `${characterName} Royal Scholar Comet Interpretation`,
        };
    },
    'comet_stage_2_fallout_resolution': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'peasantry',
            factionName: RandomTables.factions.peasantry.name,
            characterRole: "Village Elder from {village_name_2}",
            characterName: characterName,
            mood: "Cautiously Relieved",
            situation: `The fearsome comet begins to fade from the night sky, Your Majesty. Your previous actions (or inactions) have shaped the people's mood. Some are still wary, others relieved. What final decree or action will Your Majesty take to close this chapter and restore full confidence in the realm?`,
            portraitSeed: `${characterName} Village Elder Comet Fading`,
        };
    },

    // --- Cult Activity Crisis Stages ---
    'cult_activity_stage_0_suspicions': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'military_leaders',
            factionName: RandomTables.factions.military_leaders.name,
            characterRole: "Captain of the City Watch",
            characterName: characterName,
            mood: "Suspicious and Uneasy",
            situation: `Your Majesty, my patrols report strange occurrences in the {slum_district_name} district – hushed gatherings at odd hours, symbols scrawled on walls that my men don't recognize, and a general air of secrecy. It could be harmless, but my gut tells me something is amiss.`,
            portraitSeed: `${characterName} Captain of the Watch Cult Suspicions`,
        };
    },
    'cult_activity_stage_1_evidence': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'nobility',
            factionName: RandomTables.factions.nobility.name,
            characterRole: "Royal Spymaster",
            characterName: characterName,
            mood: "Grave and Concerned",
            situation: `My agents have confirmed your fears, Your Majesty. There is indeed a cult operating within the city, worshipping a forgotten entity known as {dark_entity_name}. We've found a hidden shrine and texts speaking of {cult_goal}. They are actively recruiting. We need to decide on a course of action before their influence spreads further.`,
            portraitSeed: `${characterName} Royal Spymaster Cult Evidence`,
        };
    },
    'cult_activity_stage_2_confrontation': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'military_leaders',
            factionName: RandomTables.factions.military_leaders.name,
            characterRole: "General of the Royal Guard",
            characterName: characterName,
            mood: "Determined and Grim",
            situation: `We have actionable intelligence on the cult's main temple, hidden beneath the old {abandoned_building_name} in the {district_name}. Their numbers are significant, but they are unaware we know their location. A swift, decisive strike could end this threat. Shall I prepare the troops, Your Majesty?`,
            portraitSeed: `${characterName} General Royal Guard Cult Confrontation`,
        };
    },

    // --- Bandit King Crisis Stages ---
    'bandit_king_stage_0_reports': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'merchants',
            factionName: RandomTables.factions.merchants.name,
            characterRole: "Master of the Caravansers' Guild",
            characterName: characterName,
            mood: "Anxious and Angry",
            situation: `Your Majesty, our trade routes through the {region_name} are under constant attack! A new, cunning bandit leader, who styles himself the '{bandit_leader_name} King of the Wilds', has united several disparate clans. Our guards are overwhelmed, and goods are being lost or ransoms demanded. Commerce is suffering!`,
            portraitSeed: `${characterName} Guildmaster Bandit Reports`,
        };
    },
    'bandit_king_stage_1_escalation': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'military_leaders',
            factionName: RandomTables.factions.military_leaders.name,
            characterRole: "Warden of the {border_region_name} Marches",
            characterName: characterName,
            mood: "Frustrated and Beleaguered",
            situation: `The 'Bandit King' {bandit_leader_name} grows bolder by the day, Your Majesty! He has seized the fortified {strategic_pass_name} pass and now extracts tolls from all who would travel. My forces attempted to dislodge him but were repulsed with losses. He's becoming a true power in the region. We need a significant military commitment or a new strategy.`,
            portraitSeed: `${characterName} Border Warden Bandit Escalation`,
        };
    },
    'bandit_king_stage_2_confrontation': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.maleNames);
        return {
            factionId: 'military_leaders',
            factionName: RandomTables.factions.military_leaders.name,
            characterRole: "Veteran General {general_name_placeholder}",
            characterName: characterName,
            mood: "Resolute and Battle-Ready",
            situation: `By your command, we have tracked the Bandit King {bandit_leader_name} to his mountain fortress at {fortress_name_placeholder} in the {dangerous_location}. It's a formidable position. A direct assault would be bloody. A siege would be long. Some of my scouts believe there might be a hidden approach. Your orders, Your Majesty?`,
            portraitSeed: `${characterName} Veteran General Bandit Confrontation`,
        };
    },
    'bandit_king_stage_3_aftermath': (gameContext) => {
        const characterName = RandomTables.getRandomElement(RandomTables.femaleNames);
        return {
            factionId: 'nobility',
            factionName: RandomTables.factions.nobility.name,
            characterRole: "Governor of {region_name}",
            characterName: characterName,
            mood: "Grateful but Weary",
            situation: `The self-proclaimed 'Bandit King' {bandit_leader_name} is finally defeated, Your Majesty, thanks to your decisive action! The people of {region_name} rejoice and offer their thanks. However, the land is scarred, some of his lieutenants have scattered, and the treasury here is depleted from the conflict. How shall we proceed to restore order and prosperity?`,
            portraitSeed: `${characterName} Provincial Governor Bandit Aftermath`,
        };
    }
},
    /**
     * Generates event parameters for a specific stage of an active crisis event chain.
     * @param {object} activeCrisis - The active crisis object from gameState, including crisisId and chainProgress.
     * @returns {object|null} An eventParams object for the chain stage, or null if not found.
     */
    getNextCrisisChainEventParams(activeCrisis) {
        if (!activeCrisis || !activeCrisis.eventChainDefinition || typeof activeCrisis.chainProgress === 'undefined') {
            console.warn("[RandomTables] Invalid activeCrisis or chainProgress for getNextCrisisChainEventParams:", activeCrisis);
            return null;
        }

        const currentStageDefinition = activeCrisis.eventChainDefinition.find(stage => stage.stageId === activeCrisis.chainProgress);

        if (!currentStageDefinition || !currentStageDefinition.eventParamsGeneratorKey) {
            console.warn(`[RandomTables] No stage definition or generator key found for crisis ${activeCrisis.crisisId}, stage ${activeCrisis.chainProgress}.`);
            return null;
        }

        const generatorFunction = this.crisisChainEventStages[currentStageDefinition.eventParamsGeneratorKey];

        if (typeof generatorFunction === 'function') {
            const gameContext = window.GameLogic ? window.GameLogic.getGameState() : {}; // Get current game state for context
            let eventParams = generatorFunction(gameContext); // Pass gameContext if needed by generators

            // Fill any placeholders in the situation text
            if (eventParams && eventParams.situation) {
                eventParams.situation = this.fillTemplate(eventParams.situation, eventParams.factionName);
            }
            // Add llmStageGuidance to eventParams if it exists, so main.js can pass it to LLMHandler
            if (currentStageDefinition.llmStageGuidance) {
                eventParams.llmStageGuidance = currentStageDefinition.llmStageGuidance;
            }
             // Include a way for main.js to know this event is part of a chain and its success/failure conditions
            eventParams.isCrisisChainEvent = true;
            eventParams.crisisId = activeCrisis.crisisId;
            eventParams.currentStageId = activeCrisis.chainProgress;
            if (currentStageDefinition.isTerminalSuccess) eventParams.isTerminalSuccessStage = true;
            if (currentStageDefinition.isTerminalFailure) eventParams.isTerminalFailureStage = true;


            return eventParams;
        } else {
            console.warn(`[RandomTables] No generator function found for key: ${currentStageDefinition.eventParamsGeneratorKey}`);
            return null;
        }
    },


    /**
     * Returns a hardcoded mock event object for testing or fallback.
     * @param {object} [baseParams=null] - Optional base parameters to make mock more consistent.
     * @returns {object} A mock event object.
     */
    getMockEvent(baseParams = null) {
        const params = baseParams || this.getRandomEventParams({});

        // Ensure factionId is present in params for the mock effect
        const factionIdForMock = params.factionId || Object.keys(this.factions)[0];


        return {
            character: {
                name: params.characterName || "Mock Character",
                factionName: params.factionName || "Mock Faction",
                portraitSeed: params.portraitSeed || "Mock Seed",
                role: params.characterRole || "Mock Role"
            },
            dialogue: `Greetings, Your Majesty. I am ${params.characterName || "Mock Character"}, a ${params.characterRole || "Mock Role"} from the ${params.factionName || "Mock Faction"}. My mood is ${params.mood || "neutral"}. We are facing a mock situation: "${params.situation || "A generic problem."}". We need your wisdom. This is a fallback event because the LLM is currently unavailable or not configured.`,
            choices: [
                {
                    text: `Acknowledge (Mock Option 1: +10 Wealth, -5 Stability)`,
                    effect: {
                        resources: { wealth: 10, stability: -5 },
                        factions: { [factionIdForMock]: 5 }
                        // Example of how a chain directive might be added for testing:
                        // chainDirective: "chain_progress:next_mock_stage"
                    }
                },
                {
                    text: `Dismiss (Mock Option 2: -10 Wealth, +5 Stability)`,
                    effect: {
                        resources: { wealth: -10, stability: 5 },
                        factions: { [factionIdForMock]: -5 }
                        // Example of how a chain directive might be added for testing:
                        // chainDirective: "chain_resolve:success"
                    }
                }
            ]
        };
    }
};

window.RandomTables = RandomTables;
