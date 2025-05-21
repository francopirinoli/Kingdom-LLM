// -----------------------------------------------------------------------------
// Kingdom LLM - main.js
//
// Core game logic, state management, and initialization.
// -----------------------------------------------------------------------------

// --- Game State Variables ---
let gameState = {}; // Initialized by initializeBaseGameState

// --- DOM Element References ---
let domElements = {};

// --- Constants ---
const FACTIONS = ['nobility', 'clergy', 'merchants', 'peasantry', 'military_leaders'];
const RESOURCES = ['population', 'wealth', 'food', 'military', 'stability'];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SAVE_GAME_KEY = 'kingdomLLMSaveGame';
const RANDOM_CRISIS_CHANCE = 0.05; // 5% chance per turn for a random crisis
const INITIAL_RESOURCES = { population: 1000, wealth: 500, food: 750, military: 100, stability: 75 };
const INITIAL_FACTIONS = { nobility: 50, clergy: 50, merchants: 50, peasantry: 50, military_leaders: 50 };
const DEFAULT_PLAYER_INFO = { playerName: 'King Arthur', kingdomName: 'Eldoria', kingAvatarSeed: '' };
const DEFAULT_SETTINGS = { geminiApiKey: '', dicebearStyle: 'adventurer' };


// --- Event Chain Tracking ---
let currentEventIsChainStepForCrisisId = null; // Tracks if the current event is part of a chain for a specific crisisId

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Initializing game setup...");
    if (typeof CrisisDefinitions === 'undefined') {
        console.error("CRITICAL: CrisisDefinitions is not loaded. Ensure crisis_definitions.js is included before main.js");
        if (window.UIManager) UIManager.showNotification("Critical Error: Crisis definitions not found!", "error", 10000);
        return;
    }
    cacheDOMElements();
    initGameSetup();
});

/**
 * Caches references to frequently used DOM elements for performance.
 */
function cacheDOMElements() {
    const ids = [
        'initial-setup-screen', 'game-content', 'king-avatar-preview',
        'randomize-king-avatar-button', 'king-name-input', 'kingdom-name-input',
        'start-game-button', 'load-game-button', 'setup-settings-icon',
        'population-value', 'wealth-value', 'food-value', 'military-value',
        'stability-value', 'year-value', 'character-portrait-img',
        'character-name', 'character-faction', 'king-portrait-img',
        'king-name-display', 'kingdom-name-display', 'resource-log-console',
        'resource-log-panel', 'dialogue-text', 'choices-container',
        'settings-icon', 'settings-modal', 'close-settings-button',
        'api-key-input', 'dicebear-style-select', 'save-settings-button',
        'modal-new-game-button', 'new-game-button-container'
    ];
    ids.forEach(id => domElements[id.replace(/-(\w)/g, (match, letter) => letter.toUpperCase())] = document.getElementById(id));

    FACTIONS.forEach(factionId => {
        domElements[`${factionId}Standing`] = document.getElementById(`${factionId}-standing`);
    });
    console.log("DOM elements cached.");
}

/**
 * Initializes the base game state object.
 * @param {object} [settingsToPreserve={}] - Optional settings (apiKey, style) to carry over.
 * @returns {object} The initialized game state.
 */
function initializeBaseGameState(settingsToPreserve = {}) {
    return {
        ...INITIAL_RESOURCES,
        ...INITIAL_FACTIONS,
        ...DEFAULT_PLAYER_INFO,
        currentYear: 1,
        currentMonthIndex: 0,
        currentEvent: null,
        activeCrises: [],
        geminiApiKey: settingsToPreserve.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey,
        dicebearStyle: settingsToPreserve.dicebearStyle || DEFAULT_SETTINGS.dicebearStyle,
    };
}


/**
 * Initializes the game setup screen and event listeners.
 */
function initGameSetup() {
    console.log("Initializing game setup screen...");
    gameState = initializeBaseGameState(gameState); // Ensure gameState is initialized or re-initialized with preserved settings
    loadSettings(); // Load from localStorage, potentially overriding defaults if present

    if (domElements.kingNameInput) domElements.kingNameInput.value = gameState.playerName;
    if (domElements.kingdomNameInput) domElements.kingdomNameInput.value = gameState.kingdomName;

    randomizeKingAvatarPreview(); // Generates initial avatar seed

    // Attach event listeners - ensure this is done only once or listeners are managed
    // For simplicity, assuming they are attached once on DOMContentLoaded -> initGameSetup
    // If initGameSetup is called multiple times, listeners might be duplicated.
    // Consider adding checks or removing old listeners if re-calling is frequent.
    if (domElements.randomizeKingAvatarButton) domElements.randomizeKingAvatarButton.onclick = randomizeKingAvatarPreview;
    if (domElements.startGameButton) domElements.startGameButton.onclick = startGame;
    if (domElements.loadGameButton) domElements.loadGameButton.onclick = loadGameState;
    if (domElements.setupSettingsIcon) domElements.setupSettingsIcon.onclick = () => toggleSettingsModal(true);
    if (domElements.modalNewGameButton) domElements.modalNewGameButton.onclick = handleNewGameFromModal;
    if (domElements.settingsIcon) domElements.settingsIcon.onclick = () => toggleSettingsModal(false);
    if (domElements.closeSettingsButton) domElements.closeSettingsButton.onclick = () => toggleSettingsModal();
    if (domElements.saveSettingsButton) domElements.saveSettingsButton.onclick = saveSettings;


    if (!window.UIManager) console.warn("UIManager not yet available during initGameSetup.");

    if (domElements.newGameButtonContainer && domElements.initialSetupScreen.style.display !== 'none') {
        domElements.newGameButtonContainer.style.display = 'none';
    }
    console.log("Game setup screen initialized.");
}

/**
 * Handles starting a new game from the settings modal.
 */
function handleNewGameFromModal() {
    console.log("New Game initiated from settings modal.");
    resetGameToInitialSetup(); // This will also close the modal
    if (window.UIManager) UIManager.showNotification("Starting a new game. Previous save cleared.", "info");
}

/**
 * Resets the game to the initial setup screen, preserving essential settings.
 */
function resetGameToInitialSetup() {
    if (window.UIManager) UIManager.showInitialSetupScreen();
    else { // Fallback if UIManager is not ready (shouldn't happen in normal flow)
        if (domElements.gameContent) domElements.gameContent.style.display = 'none';
        if (domElements.initialSetupScreen) domElements.initialSetupScreen.style.display = 'flex';
    }
    if (domElements.settingsModal.classList.contains('active')) toggleSettingsModal(); // Close modal if open

    const preservedSettings = {
        geminiApiKey: gameState.geminiApiKey,
        dicebearStyle: gameState.dicebearStyle
    };
    gameState = initializeBaseGameState(preservedSettings);
    currentEventIsChainStepForCrisisId = null;

    // Re-populate setup screen fields with defaults (or preserved if logic changes)
    if (domElements.kingNameInput) domElements.kingNameInput.value = gameState.playerName;
    if (domElements.kingdomNameInput) domElements.kingdomNameInput.value = gameState.kingdomName;
    randomizeKingAvatarPreview(); // Get a new avatar seed for the new default king

    localStorage.removeItem(SAVE_GAME_KEY);
    if (window.UIManager) UIManager.clearResourceLog();
    console.log("Game reset to initial setup.");
}

/**
 * Randomizes the king's avatar preview on the setup screen.
 */
function randomizeKingAvatarPreview() {
    if (!window.DicebearHandler || !domElements.kingAvatarPreview) {
        console.warn("DicebearHandler or king avatar preview element not available.");
        if (domElements.kingAvatarPreview) { // Basic fallback
            domElements.kingAvatarPreview.src = 'https://placehold.co/144x144/6b7280/ffffff?text=King';
            domElements.kingAvatarPreview.alt = "King's Avatar";
        }
        return;
    }
    const randomSeedComponent = Math.random().toString(36).substring(2, 10);
    gameState.kingAvatarSeed = `King-${randomSeedComponent}-${Date.now()}`; // Store the seed

    try {
        const portraitUrl = DicebearHandler.getPortraitUrl(gameState.kingAvatarSeed);
        domElements.kingAvatarPreview.src = portraitUrl;
        domElements.kingAvatarPreview.alt = (domElements.kingNameInput ? domElements.kingNameInput.value.trim() : gameState.playerName) || "King's Avatar";
    } catch (error) {
        console.error("Error generating king avatar preview:", error);
        if (domElements.kingAvatarPreview) {
            domElements.kingAvatarPreview.src = 'https://placehold.co/144x144/ff0000/ffffff?text=Error';
            domElements.kingAvatarPreview.alt = "Error";
        }
    }
}

/**
 * Starts a new game with current setup screen values.
 */
function startGame() {
    console.log("Starting new game...");

    const playerSettings = {
        playerName: domElements.kingNameInput.value.trim() || DEFAULT_PLAYER_INFO.playerName,
        kingdomName: domElements.kingdomNameInput.value.trim() || DEFAULT_PLAYER_INFO.kingdomName,
        kingAvatarSeed: gameState.kingAvatarSeed || `King-${Math.random().toString(36).substring(2, 10)}`, // Ensure seed exists
        geminiApiKey: gameState.geminiApiKey,
        dicebearStyle: gameState.dicebearStyle
    };

    gameState = initializeBaseGameState(playerSettings); // Initialize with default resources/factions
    // Apply player customizations from setup
    gameState.playerName = playerSettings.playerName;
    gameState.kingdomName = playerSettings.kingdomName;
    gameState.kingAvatarSeed = playerSettings.kingAvatarSeed;
    gameState.currentMonthIndex = Math.floor(Math.random() * 12); // Random start month
    currentEventIsChainStepForCrisisId = null;

    console.log("Final King Details for new game:", { name: gameState.playerName, kingdom: gameState.kingdomName, avatarSeed: gameState.kingAvatarSeed });

    if (window.UIManager) {
        UIManager.showMainGameUI(gameState);
        UIManager.updateAllResourceDisplays(gameState);
        UIManager.updateAllFactionDisplays(gameState);
        UIManager.updateDateDisplay(MONTH_NAMES[gameState.currentMonthIndex], gameState.currentYear);
        UIManager.clearResourceLog();
    } else {
        console.error("UIManager.showMainGameUI is not available at startGame.");
        // Basic fallback display toggle
        if(domElements.initialSetupScreen) domElements.initialSetupScreen.style.display = 'none';
        if(domElements.gameContent) domElements.gameContent.style.display = 'flex';
    }

    saveGameState();
    generateAndDisplayEvent();
    console.log(`New game started. First event initiated. Date: ${MONTH_NAMES[gameState.currentMonthIndex]}, Year ${gameState.currentYear}`);
}

// --- Game State Persistence ---
/**
 * Saves the current game state to localStorage.
 */
function saveGameState() {
    try {
        const crisesToSave = gameState.activeCrises.map(crisis => ({
            crisisId: crisis.crisisId,
            turnsActive: crisis.turnsActive || 0,
            chainProgress: crisis.chainProgress,
            chainState: crisis.chainState
        }));
        const stateToSave = { ...gameState, activeCrises: crisesToSave, currentEvent: null };
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(stateToSave));
        console.log("Game state saved.");
    } catch (error) {
        console.error("Error saving game state:", error);
        if (window.UIManager) UIManager.showNotification("Error saving game!", "error");
    }
}

/**
 * Loads game state from localStorage.
 */
function loadGameState() {
    console.log("Attempting to load game state...");
    try {
        const savedStateJSON = localStorage.getItem(SAVE_GAME_KEY);
        if (savedStateJSON) {
            const loadedState = JSON.parse(savedStateJSON);

            // Initialize with base and then overlay loaded state to ensure all properties are present
            const baseSettings = { geminiApiKey: loadedState.geminiApiKey, dicebearStyle: loadedState.dicebearStyle };
            gameState = initializeBaseGameState(baseSettings); // Start with a full default structure

            // Overlay all saved properties
            Object.keys(loadedState).forEach(key => {
                if (key !== 'activeCrises' && key !== 'currentEvent') { // These are handled specially
                    gameState[key] = loadedState[key];
                }
            });

            gameState.activeCrises = []; // Clear default before loading saved crises
            if (loadedState.activeCrises && Array.isArray(loadedState.activeCrises)) {
                loadedState.activeCrises.forEach(savedCrisis => {
                    const crisisDef = CrisisDefinitions.find(def => def.crisisId === savedCrisis.crisisId);
                    if (crisisDef) {
                        gameState.activeCrises.push({
                            ...crisisDef,
                            turnsActive: savedCrisis.turnsActive || 0,
                            chainProgress: savedCrisis.chainProgress,
                            chainState: savedCrisis.chainState
                        });
                    } else {
                        console.warn(`Could not find crisis definition for loaded ID: ${savedCrisis.crisisId}.`);
                    }
                });
            }
            gameState.currentEvent = null;
            currentEventIsChainStepForCrisisId = null;
            console.log("Game state loaded:", JSON.parse(JSON.stringify(gameState)));

            // Ensure Dicebear style is applied
            if (window.DicebearHandler) DicebearHandler.setCurrentStyle(gameState.dicebearStyle);

            if (window.UIManager) {
                UIManager.showMainGameUI(gameState);
                UIManager.updateAllResourceDisplays(gameState);
                UIManager.updateAllFactionDisplays(gameState);
                UIManager.updateDateDisplay(MONTH_NAMES[gameState.currentMonthIndex], gameState.currentYear);
                UIManager.clearResourceLog();
                gameState.activeCrises.forEach(crisis => {
                    UIManager.logCrisisEvent(`Ongoing crisis: ${crisis.crisisName} (Stage: ${crisis.chainProgress || 'N/A'}, Turns: ${crisis.turnsActive}, State: ${crisis.chainState || 'active'})`, crisis.crisisName, 'crisisOngoing');
                });
                UIManager.showNotification("Game Loaded Successfully!", "success");
            }
            generateAndDisplayEvent();
        } else {
            console.log("No saved game found.");
            if (window.UIManager) UIManager.showNotification("No saved game found.", "info");
        }
    } catch (error) {
        console.error("Error loading game state:", error);
        if (window.UIManager) UIManager.showNotification("Error loading saved game. Starting new game.", "error");
        resetGameToInitialSetup();
    }
}

// --- Settings Management ---
/**
 * Toggles the visibility of the settings modal.
 * @param {boolean} [isFromSetupScreen=false] - Indicates if the modal was opened from the initial setup screen.
 */
function toggleSettingsModal(isFromSetupScreen = false) {
    if (!domElements.settingsModal) return;
    const isActive = domElements.settingsModal.classList.toggle('active');
    if (isActive) {
        if (domElements.apiKeyInput) domElements.apiKeyInput.value = gameState.geminiApiKey || '';
        if (domElements.dicebearStyleSelect) domElements.dicebearStyleSelect.value = gameState.dicebearStyle || DEFAULT_SETTINGS.dicebearStyle;
        if (domElements.newGameButtonContainer) {
            const inGame = domElements.gameContent && domElements.gameContent.style.display !== 'none';
            domElements.newGameButtonContainer.style.display = (inGame || !isFromSetupScreen) ? 'block' : 'none';
        }
    }
}

/**
 * Loads settings from localStorage or uses defaults.
 */
function loadSettings() {
    gameState.geminiApiKey = localStorage.getItem('geminiApiKey') || gameState.geminiApiKey || DEFAULT_SETTINGS.geminiApiKey;
    gameState.dicebearStyle = localStorage.getItem('dicebearStyle') || gameState.dicebearStyle || DEFAULT_SETTINGS.dicebearStyle;
    if (window.DicebearHandler) DicebearHandler.setCurrentStyle(gameState.dicebearStyle);
    console.log("Settings loaded/ensured. API Key set:", !!gameState.geminiApiKey, "Style:", gameState.dicebearStyle);
}

/**
 * Saves current settings to localStorage and applies them.
 */
function saveSettings() {
    if (!domElements.apiKeyInput || !domElements.dicebearStyleSelect) return;
    gameState.geminiApiKey = domElements.apiKeyInput.value.trim();
    gameState.dicebearStyle = domElements.dicebearStyleSelect.value;

    localStorage.setItem('geminiApiKey', gameState.geminiApiKey);
    localStorage.setItem('dicebearStyle', gameState.dicebearStyle);

    if (window.DicebearHandler) DicebearHandler.setCurrentStyle(gameState.dicebearStyle);

    if (domElements.initialSetupScreen.style.display !== 'none' && gameState.kingAvatarSeed) {
        randomizeKingAvatarPreview(); // Re-render with new style if on setup
    }

    console.log("Settings saved:", { apiKeySet: !!gameState.geminiApiKey, style: gameState.dicebearStyle });
    if (window.UIManager) UIManager.showNotification("Settings Saved!", "success");
    toggleSettingsModal();
}

// --- Game Loop / Event Progression ---
/**
 * Generates event parameters (random or crisis chain) and calls the LLM to get event details.
 */
async function generateAndDisplayEvent() {
    console.log("Generating new event...");
    if (window.UIManager) UIManager.showLoading(true);
    currentEventIsChainStepForCrisisId = null;

    let eventParams;
    let llmStageGuidanceForPrompt = null;

    const activeChainCrisis = gameState.activeCrises.find(
        c => c.resolutionCondition && c.resolutionCondition.type === 'eventChain' && c.chainState === 'ongoing'
    );

    if (activeChainCrisis) {
        console.log(`Active event chain: ${activeChainCrisis.crisisId}, progress: ${activeChainCrisis.chainProgress}`);
        eventParams = RandomTables.getNextCrisisChainEventParams(activeChainCrisis);
        if (eventParams) {
            currentEventIsChainStepForCrisisId = activeChainCrisis.crisisId;
            llmStageGuidanceForPrompt = eventParams.llmStageGuidance || null;
            if (!eventParams.crisisName) eventParams.crisisName = activeChainCrisis.crisisName;
        } else {
            console.warn(`Failed to get next chain event for ${activeChainCrisis.crisisId}. Falling back.`);
            eventParams = RandomTables.getRandomEventParams(getGameContextForLLM());
        }
    } else {
        eventParams = RandomTables.getRandomEventParams(getGameContextForLLM());
    }

    eventParams.isCrisisChainEvent = !!currentEventIsChainStepForCrisisId;
    if (eventParams.isCrisisChainEvent && !eventParams.crisisName && activeChainCrisis) {
        eventParams.crisisName = activeChainCrisis.crisisName;
    }

    const activeCrisesLLMInfo = gameState.activeCrises.map(c => c.llmPromptText).filter(Boolean);
    const prompt = LLMHandler.constructPrompt(eventParams, getGameContextForLLM(), activeCrisesLLMInfo, llmStageGuidanceForPrompt);

    if (!gameState.geminiApiKey) {
        console.warn("Gemini API Key not set. Using mock event.");
        if (window.UIManager) UIManager.showNotification("API Key missing. Using mock event.", "warning", 5000);
        displayMockEvent(eventParams);
        return;
    }

    try {
        const llmResponse = await LLMHandler.callLLM(prompt, gameState.geminiApiKey);
        if (llmResponse) {
            const parsedEvent = LLMHandler.parseLLMResponse(llmResponse, eventParams);
            if (!parsedEvent || !parsedEvent.character || !parsedEvent.character.name || !parsedEvent.character.portraitSeed) {
                throw new Error("LLM parsing failed to return essential character data.");
            }
            gameState.currentEvent = parsedEvent;
            if (window.UIManager) UIManager.displayEvent(parsedEvent);
        } else {
            throw new Error("LLM response was null or blocked.");
        }
    } catch (error) {
        console.error("Error with LLM, using mock event:", error);
        if (window.UIManager) UIManager.showNotification(`LLM Error: ${error.message}. Using mock event.`, "error", 7000);
        displayMockEvent(eventParams);
    } finally {
        if (window.UIManager) UIManager.showLoading(false);
    }
}

/**
 * Displays a mock event.
 * @param {object} eventParams - Parameters for the mock event.
 */
function displayMockEvent(eventParams) {
    const mockEventData = RandomTables.getMockEvent(eventParams);
    gameState.currentEvent = mockEventData;
    if (window.UIManager) {
        UIManager.displayEvent(mockEventData);
        UIManager.showLoading(false);
    }
}

/**
 * Returns a context object for the LLM prompt.
 * @returns {object} Game context for the LLM.
 */
function getGameContextForLLM() {
    return {
        ...gameState, // Includes all resources, factions, player/kingdom names
        currentMonthName: MONTH_NAMES[gameState.currentMonthIndex]
    };
}

/**
 * Processes the player's choice, applies effects, and advances the game.
 * @param {object} choiceEffect - The effect object from the chosen option.
 */
function processPlayerChoice(choiceEffect) {
    console.log("Processing player choice:", choiceEffect);
    if (window.UIManager) UIManager.addNewEventLogSeparator();

    const changes = { resources: {}, factions: {} };
    applyChoiceEffects(choiceEffect, changes); // Apply direct effects and populate 'changes'

    if (window.UIManager) UIManager.logResourceChanges(changes);

    handleChainDirectives(choiceEffect); // Handle crisis chain progression/resolution

    advanceDate();
    applyOngoingCrisisEffects();
    checkCrisisTriggersAndResolutions();

    if (window.UIManager) { // Update UI after all state changes
        UIManager.updateAllResourceDisplays(gameState);
        UIManager.updateAllFactionDisplays(gameState);
    }

    if (checkGameOverConditions()) return;

    saveGameState();
    currentEventIsChainStepForCrisisId = null;
    generateAndDisplayEvent();
}

/**
 * Applies resource and faction changes from a choice effect.
 * @param {object} choiceEffect - The effect object from the chosen option.
 * @param {object} changes - An object to log specific changes.
 */
function applyChoiceEffects(choiceEffect, changes) {
    if (choiceEffect && choiceEffect.resources) {
        for (const resource in choiceEffect.resources) {
            if (RESOURCES.includes(resource)) {
                const changeAmount = parseInt(choiceEffect.resources[resource], 10);
                if (!isNaN(changeAmount)) {
                    gameState[resource] += changeAmount;
                    changes.resources[resource] = changeAmount;
                    if (resource === 'stability') gameState[resource] = Math.max(0, Math.min(100, gameState[resource]));
                    else if (resource !== 'wealth') gameState[resource] = Math.max(0, gameState[resource]);
                }
            }
        }
    }
    if (choiceEffect && choiceEffect.factions) {
        for (const faction in choiceEffect.factions) {
            if (FACTIONS.includes(faction)) {
                const changeAmount = parseInt(choiceEffect.factions[faction], 10);
                if (!isNaN(changeAmount)) {
                    gameState[faction] += changeAmount;
                    changes.factions[faction] = changeAmount;
                    gameState[faction] = Math.max(0, Math.min(100, gameState[faction]));
                }
            }
        }
    }
}

/**
 * Handles crisis chain directives from a player's choice.
 * @param {object} choiceEffect - The effect object from the chosen option.
 */
function handleChainDirectives(choiceEffect) {
    if (!currentEventIsChainStepForCrisisId || !choiceEffect || !choiceEffect.chainDirective) return;

    const crisisToUpdate = gameState.activeCrises.find(c => c.crisisId === currentEventIsChainStepForCrisisId);
    if (!crisisToUpdate) {
        console.warn(`Could not find active crisis ${currentEventIsChainStepForCrisisId} for chain directive.`);
        return;
    }

    const directive = choiceEffect.chainDirective;
    if (directive.type === 'progress' && directive.value) {
        crisisToUpdate.chainProgress = directive.value;
        console.log(`Crisis ${crisisToUpdate.crisisId} progressed to: ${directive.value}`);
        if (window.UIManager) UIManager.logCrisisEvent(`The ${crisisToUpdate.crisisName} situation develops... (Stage: ${directive.value})`, crisisToUpdate.crisisName, 'crisisEffect');
    } else if (directive.type === 'resolve') {
        crisisToUpdate.chainState = directive.value === 'success' ? 'resolved_success' : 'resolved_failure';
        console.log(`Crisis ${crisisToUpdate.crisisId} ${crisisToUpdate.chainState}.`);
        const message = directive.value === 'success' ?
            `${crisisToUpdate.crisisName} resolved! ${crisisToUpdate.playerNotificationEnd || ''}` :
            `Efforts for ${crisisToUpdate.crisisName} failed.`;
        if (window.UIManager) UIManager.logCrisisEvent(message, crisisToUpdate.crisisName, directive.value === 'success' ? 'crisisEnd' : 'crisisStart');
    }
}

/**
 * Advances the game date by one month.
 */
function advanceDate() {
    gameState.currentMonthIndex++;
    if (gameState.currentMonthIndex >= 12) {
        gameState.currentMonthIndex = 0;
        gameState.currentYear++;
    }
    if (window.UIManager) UIManager.updateDateDisplay(MONTH_NAMES[gameState.currentMonthIndex], gameState.currentYear);
}

// --- Crisis System Functions ---

/**
 * Evaluates if a value meets a specified condition.
 * @param {number} currentValue - The value to check.
 * @param {object} condition - The condition object { threshold, comparison }.
 * @returns {boolean} True if the condition is met.
 */
function evaluateCondition(currentValue, condition) {
    if (!condition || typeof condition.threshold === 'undefined' || !condition.comparison) {
        console.warn("[evaluateCondition] Invalid condition:", condition);
        return false;
    }
    const threshold = Number(condition.threshold);
    switch (condition.comparison) {
        case 'lessThan': return currentValue < threshold;
        case 'lessThanOrEqual': return currentValue <= threshold;
        case 'greaterThan': return currentValue > threshold;
        case 'greaterThanOrEqual': return currentValue >= threshold;
        case 'equalTo': return currentValue === threshold;
        default: console.warn(`Unknown comparison: ${condition.comparison}`); return false;
    }
}

/**
 * Applies ongoing effects for all active crises and increments their active turns.
 */
function applyOngoingCrisisEffects() {
    if (!gameState.activeCrises || gameState.activeCrises.length === 0) return;
    console.log("Applying ongoing crisis effects for:", MONTH_NAMES[gameState.currentMonthIndex], "Year", gameState.currentYear);
    const summary = { resources: {}, factions: {} };

    gameState.activeCrises.forEach(crisis => {
        if (crisis.chainState === 'resolved_success' || crisis.chainState === 'resolved_failure') return;

        if (Array.isArray(crisis.ongoingEffect)) {
            crisis.ongoingEffect.forEach(effect => {
                if (effect.frequency === 'perTurn') {
                    let amount = parseInt(effect.amount, 10);
                    if (isNaN(amount)) return;

                    if (effect.type === 'resourceChange' && RESOURCES.includes(effect.resource)) {
                        gameState[effect.resource] += amount;
                        summary.resources[effect.resource] = (summary.resources[effect.resource] || 0) + amount;
                        if (effect.resource === 'stability') gameState[effect.resource] = Math.max(0, Math.min(100, gameState[effect.resource]));
                        else if (effect.resource !== 'wealth') gameState[effect.resource] = Math.max(0, gameState[effect.resource]);
                    } else if (effect.type === 'factionStandingChange' && FACTIONS.includes(effect.faction)) {
                        gameState[effect.faction] += amount;
                        summary.factions[effect.faction] = (summary.factions[effect.faction] || 0) + amount;
                        gameState[effect.faction] = Math.max(0, Math.min(100, gameState[effect.faction]));
                    }
                }
            });
        }
        crisis.turnsActive = (crisis.turnsActive || 0) + 1;
        console.log(`Crisis ${crisis.crisisName} turnsActive: ${crisis.turnsActive}`);
    });

    if (window.UIManager && (Object.keys(summary.resources).length > 0 || Object.keys(summary.factions).length > 0)) {
        let messages = Object.entries(summary.resources).map(([res, val]) => val !== 0 ? `${res} by ${val}` : null);
        messages = messages.concat(Object.entries(summary.factions).map(([fac, val]) => val !== 0 ? `${fac} standing by ${val}%` : null));
        messages = messages.filter(Boolean);
        if (messages.length > 0) {
            UIManager.logCrisisEvent(`Ongoing crises affected: ${messages.join(', ')}.`, "Ongoing Crises", "crisisEffect");
        }
    }
}

/**
 * Checks for crisis triggers and resolutions.
 */
function checkCrisisTriggersAndResolutions() {
    console.log("[CrisisCheck] Starting checks.");
    let resolvedCrisesThisTurn = [];

    // Check resolution of existing crises
    gameState.activeCrises = gameState.activeCrises.filter(activeCrisis => {
        const definition = CrisisDefinitions.find(def => def.crisisId === activeCrisis.crisisId);
        if (!definition) {
            console.warn(`[CrisisCheck] No definition for active crisis '${activeCrisis.crisisId}'. Removing.`);
            return false; // Remove if no definition
        }

        console.log(`[CrisisCheck] Evaluating: ${definition.crisisName}, Turns: ${activeCrisis.turnsActive}, State: ${activeCrisis.chainState}`);
        let resolved = false;

        if (activeCrisis.chainState === 'resolved_success' || activeCrisis.chainState === 'resolved_failure') {
            resolved = true;
            console.log(`[CrisisCheck] ${definition.crisisName} already ${activeCrisis.chainState}.`);
        } else if (definition.resolutionCondition.type === 'durationTurns') {
            if (Number(activeCrisis.turnsActive) >= Number(definition.resolutionCondition.turns)) {
                resolved = true;
                console.log(`[CrisisCheck] ${definition.crisisName} RESOLVED by duration.`);
                if (window.UIManager) UIManager.logCrisisEvent(definition.playerNotificationEnd || `${definition.crisisName} ended.`, definition.crisisName, 'crisisEnd');
            }
        } else if (definition.resolutionCondition.type === 'eventChain' && definition.resolutionCondition.orDurationTurns) {
            if (Number(activeCrisis.turnsActive) >= Number(definition.resolutionCondition.orDurationTurns)) {
                resolved = true;
                activeCrisis.chainState = 'resolved_by_duration'; // Mark specific resolution
                console.log(`[CrisisCheck] Chain ${definition.crisisName} RESOLVED by orDurationTurns.`);
                if (window.UIManager) UIManager.logCrisisEvent(definition.playerNotificationEnd || `${definition.crisisName} ended.`, definition.crisisName, 'crisisEnd');
            }
        } else if (definition.resolutionCondition.type !== 'eventChain') { // Standard resource/faction resolution
            let value;
            if (definition.triggerType === 'resource') value = gameState[definition.resolutionCondition.resource];
            else if (definition.triggerType === 'faction') value = gameState[definition.resolutionCondition.faction];

            if (value !== undefined && evaluateCondition(value, definition.resolutionCondition)) {
                resolved = true;
                console.log(`[CrisisCheck] ${definition.crisisName} RESOLVED by standard condition.`);
                if (window.UIManager) UIManager.logCrisisEvent(definition.playerNotificationEnd || `${definition.crisisName} ended.`, definition.crisisName, 'crisisEnd');
            }
        }

        if (resolved) resolvedCrisesThisTurn.push(definition.crisisId);
        return !resolved; // Keep if not resolved
    });
    console.log("[CrisisCheck] Active crises after resolution checks:", gameState.activeCrises.length);

    // Check for new standard crisis triggers
    CrisisDefinitions.forEach(crisisDef => {
        if (gameState.activeCrises.some(ac => ac.crisisId === crisisDef.crisisId) || resolvedCrisesThisTurn.includes(crisisDef.crisisId)) {
            return; // Skip if already active or just resolved this turn
        }

        if (crisisDef.triggerType === 'resource' || crisisDef.triggerType === 'faction') {
            let value;
            if (crisisDef.triggerType === 'resource') value = gameState[crisisDef.triggerCondition.resource];
            else value = gameState[crisisDef.triggerCondition.faction];

            if (value !== undefined && evaluateCondition(value, crisisDef.triggerCondition)) {
                activateNewCrisis(crisisDef);
            }
        }
    });

    triggerRandomCrisis(); // Attempt to trigger a random crisis
    console.log("[CrisisCheck] Finished. Final active crises:", gameState.activeCrises.length);
}

/**
 * Activates a new crisis, adding it to the active list and applying onTrigger effects.
 * @param {object} crisisDefinition - The definition of the crisis to activate.
 */
function activateNewCrisis(crisisDefinition) {
    console.log(`[CrisisCheck] TRIGGERED new crisis: '${crisisDefinition.crisisName}'`);
    const newActiveCrisis = {
        ...crisisDefinition,
        turnsActive: 0,
        chainProgress: (crisisDefinition.eventChainDefinition && crisisDefinition.eventChainDefinition.length > 0) ? crisisDefinition.eventChainDefinition[0].stageId : null,
        chainState: (crisisDefinition.eventChainDefinition && crisisDefinition.eventChainDefinition.length > 0) ? 'ongoing' : null
    };
    gameState.activeCrises.push(newActiveCrisis);
    if (window.UIManager) UIManager.logCrisisEvent(newActiveCrisis.playerNotificationStart, newActiveCrisis.crisisName, 'crisisStart');

    // Apply onTrigger effects
    if (Array.isArray(newActiveCrisis.ongoingEffect)) {
        const onTriggerChanges = { resources: {}, factions: {} };
        newActiveCrisis.ongoingEffect.forEach(effect => {
            if (effect.frequency === 'onTrigger') {
                let amount = parseInt(effect.amount, 10);
                if (isNaN(amount)) return;

                if (effect.type === 'resourceChange' && RESOURCES.includes(effect.resource)) {
                    gameState[effect.resource] += amount;
                    onTriggerChanges.resources[effect.resource] = (onTriggerChanges.resources[effect.resource] || 0) + amount;
                    if (effect.resource === 'stability') gameState[effect.resource] = Math.max(0, Math.min(100, gameState[effect.resource]));
                    else if (effect.resource !== 'wealth') gameState[effect.resource] = Math.max(0, gameState[effect.resource]);
                } else if (effect.type === 'factionStandingChange' && FACTIONS.includes(effect.faction)) {
                    gameState[effect.faction] += amount;
                    onTriggerChanges.factions[effect.faction] = (onTriggerChanges.factions[effect.faction] || 0) + amount;
                    gameState[effect.faction] = Math.max(0, Math.min(100, gameState[effect.faction]));
                }
            }
        });
        // Log and update UI for onTrigger effects
        if (window.UIManager && (Object.keys(onTriggerChanges.resources).length > 0 || Object.keys(onTriggerChanges.factions).length > 0)) {
            let messages = Object.entries(onTriggerChanges.resources).map(([res, val]) => val !== 0 ? `${res} by ${val}` : null);
            messages = messages.concat(Object.entries(onTriggerChanges.factions).map(([fac, val]) => val !== 0 ? `${fac} standing by ${val}%` : null));
            messages = messages.filter(Boolean);
            if (messages.length > 0) {
                 UIManager.logCrisisEvent(`${newActiveCrisis.crisisName} immediately affected: ${messages.join(', ')}.`, newActiveCrisis.crisisName, "crisisEffect");
            }
            UIManager.updateAllResourceDisplays(gameState);
            UIManager.updateAllFactionDisplays(gameState);
        }
    }
}


/**
 * Attempts to trigger a random crisis based on RANDOM_CRISIS_CHANCE.
 */
function triggerRandomCrisis() {
    if (Math.random() >= RANDOM_CRISIS_CHANCE) return;

    console.log("[CrisisCheck] Attempting random crisis trigger...");
    const potentialRandomCrises = CrisisDefinitions.filter(def => def.triggerType === 'random');
    if (potentialRandomCrises.length === 0) {
        console.log("[CrisisCheck] No random crises defined.");
        return;
    }

    const chosenCrisisDef = { ...potentialRandomCrises[Math.floor(Math.random() * potentialRandomCrises.length)] };

    if (gameState.activeCrises.some(ac => ac.crisisId === chosenCrisisDef.crisisId)) {
        console.log(`[CrisisCheck] Randomly selected '${chosenCrisisDef.crisisName}', but already active.`);
        return;
    }

    let conditionsMet = true; // Default to true if no specific sub-conditions
    if (chosenCrisisDef.triggerCondition && Array.isArray(chosenCrisisDef.triggerCondition.conditions)) {
        for (const cond of chosenCrisisDef.triggerCondition.conditions) {
            let value;
            if (cond.type === 'resource') value = gameState[cond.resource];
            else if (cond.type === 'faction') value = gameState[cond.faction];
            else if (cond.type === 'year') value = gameState.currentYear;
            else { conditionsMet = false; break; }

            if (value === undefined || !evaluateCondition(value, { threshold: cond.threshold, comparison: cond.comparison })) {
                conditionsMet = false;
                break;
            }
        }
    } // Note: Simplified single condition check from previous version removed for consistency with array structure.

    if (conditionsMet) {
        activateNewCrisis(chosenCrisisDef);
    } else {
        console.log(`[CrisisCheck] Randomly selected '${chosenCrisisDef.crisisName}', but its specific conditions not met.`);
    }
}

/**
 * Checks for game over conditions and displays the game over screen if met.
 * @returns {boolean} True if the game is over.
 */
function checkGameOverConditions() {
    let gameOverReason = "";
    const criticalCrisisActive = (resource, crisisIds) => gameState.activeCrises.some(c => crisisIds.includes(c.crisisId) && c.triggerCondition && c.triggerCondition.resource === resource);
    const criticalFactionCrisisActive = (factionId) => gameState.activeCrises.some(c => c.triggerType === 'faction' && c.triggerCondition.faction === factionId && c.isCritical);

    if (gameState.population <= 0) gameOverReason = "Your kingdom has no people left!";
    else if (gameState.wealth < -200 && !criticalCrisisActive('wealth', ['economic_collapse'])) gameOverReason = "Your kingdom is bankrupt beyond recovery!";
    else if (gameState.food <= 0 && !criticalCrisisActive('food', ['famine', 'starvation'])) gameOverReason = "Your people have starved!";
    else if (gameState.military <= 0 && !criticalCrisisActive('military', ['defenseless', 'invasion_imminent'])) gameOverReason = "Your kingdom is defenseless and has collapsed!";
    else if (gameState.stability <= 0 && !criticalCrisisActive('stability', ['anarchy'])) gameOverReason = "Your kingdom has descended into chaos!";

    if (!gameOverReason) {
        for (const factionId of FACTIONS) {
            if (gameState[factionId] <= 0 && !criticalFactionCrisisActive(factionId)) {
                const factionName = factionId.charAt(0).toUpperCase() + factionId.slice(1).replace('_leaders', ' Leaders').replace('_', ' ');
                gameOverReason = `The ${factionName} have revolted!`;
                break;
            }
        }
    }

    if (gameOverReason) {
        console.log("Game Over:", gameOverReason);
        if (window.UIManager) UIManager.displayGameOver(gameOverReason);
        if (domElements.choicesContainer) domElements.choicesContainer.innerHTML = `<div class="text-gray-500 italic p-4 text-center w-full">The reign has ended.</div>`;
        localStorage.removeItem(SAVE_GAME_KEY);
        return true;
    }
    return false;
}

// Expose necessary functions to global scope for UIManager or other modules if needed
window.GameLogic = {
    processPlayerChoice,
    getGameState: () => ({ ...gameState }) // Return a shallow copy to prevent direct external mutation
};
