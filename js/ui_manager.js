// -----------------------------------------------------------------------------
// Kingdom LLM - ui_manager.js
//
// Handles all DOM manipulation and UI updates for the game.
// -----------------------------------------------------------------------------

const UIManager = {
    elements: {},
    MAX_LOG_ENTRIES: 50,
    INITIAL_LOG_MESSAGE: '<p class="log-neutral">Awaiting your decisions...</p>',

    init() {
        this.elements.initialSetupScreen = document.getElementById('initial-setup-screen');
        this.elements.gameContent = document.getElementById('game-content');
        this.elements.populationValue = document.getElementById('population-value');
        this.elements.wealthValue = document.getElementById('wealth-value');
        this.elements.foodValue = document.getElementById('food-value');
        this.elements.militaryValue = document.getElementById('military-value');
        this.elements.stabilityValue = document.getElementById('stability-value');
        this.elements.yearValue = document.getElementById('year-value');

        const FACTION_IDS = ['nobility', 'clergy', 'merchants', 'peasantry', 'military_leaders'];
        FACTION_IDS.forEach(id => {
            this.elements[`${id}Standing`] = document.getElementById(`${id}-standing`);
        });

        this.elements.characterPortraitImg = document.getElementById('character-portrait-img');
        this.elements.characterName = document.getElementById('character-name');
        this.elements.characterFaction = document.getElementById('character-faction');

        this.elements.kingPortraitImg = document.getElementById('king-portrait-img');
        this.elements.kingNameDisplay = document.getElementById('king-name-display');
        this.elements.kingdomNameDisplay = document.getElementById('kingdom-name-display');
        this.elements.resourceLogConsole = document.getElementById('resource-log-console');
        this.elements.resourceLogPanel = document.getElementById('resource-log-panel');

        this.elements.dialogueText = document.getElementById('dialogue-text');
        this.elements.choicesContainer = document.getElementById('choices-container');

        console.log("UIManager initialized and DOM elements cached.");
        if (!this.elements.initialSetupScreen || !this.elements.gameContent) {
            console.error("UIManager critical error: initialSetupScreen or gameContent element not found during init!");
        }
    },

    /**
     * Shows the initial setup screen and hides the main game content.
     */
    showInitialSetupScreen() {
        if (this.elements.gameContent) {
            this.elements.gameContent.style.display = 'none';
        }
        if (this.elements.initialSetupScreen) {
            this.elements.initialSetupScreen.style.display = 'flex'; // Assuming flex layout
        }
        console.log("Switched to initial setup screen.");
    },

    showMainGameUI(currentGameState) {
        if (this.elements.initialSetupScreen) {
            this.elements.initialSetupScreen.style.display = 'none';
        }
        if (this.elements.gameContent) {
            this.elements.gameContent.style.display = 'flex';
        }
        this.updateKingInfoPanel(currentGameState);
        // this.clearResourceLog(); // Clearing log on showing main game UI might be too aggressive if loading a game. Let main.js decide.
        console.log("Main game UI shown.");
    },

    updateKingInfoPanel(currentGameState) {
        if (!currentGameState) {
            console.error("Cannot update King info panel: currentGameState is undefined.");
            return;
        }
        if (this.elements.kingNameDisplay) this.elements.kingNameDisplay.textContent = currentGameState.playerName || "Ruler";
        if (this.elements.kingdomNameDisplay) this.elements.kingdomNameDisplay.textContent = `Kingdom of ${currentGameState.kingdomName || "Unknown"}`;

        if (this.elements.kingPortraitImg && window.DicebearHandler) {
            try {
                const portraitUrl = DicebearHandler.getPortraitUrl(currentGameState.kingAvatarSeed || currentGameState.playerName);
                this.elements.kingPortraitImg.src = portraitUrl;
                this.elements.kingPortraitImg.alt = currentGameState.playerName || "King's Avatar";
            } catch (error) {
                console.error("Error generating king's portrait for panel:", error);
                this.elements.kingPortraitImg.src = 'https://placehold.co/128x128/ff0000/ffffff?text=Error';
            }
        }
    },

    updateResourceDisplay(resourceName, value) {
        const element = this.elements[`${resourceName}Value`];
        if (element) element.textContent = value;
    },
    updateAllResourceDisplays(gameState) {
        this.updateResourceDisplay('population', gameState.population);
        this.updateResourceDisplay('wealth', gameState.wealth);
        this.updateResourceDisplay('food', gameState.food);
        this.updateResourceDisplay('military', gameState.military);
        this.updateResourceDisplay('stability', gameState.stability);
    },

    updateFactionDisplay(factionName, value) {
        const element = this.elements[`${factionName}Standing`];
        if (element) element.textContent = value;
    },
    updateAllFactionDisplays(gameState) {
        const FACTION_IDS = ['nobility', 'clergy', 'merchants', 'peasantry', 'military_leaders'];
        FACTION_IDS.forEach(id => {
            if (gameState.hasOwnProperty(id)) this.updateFactionDisplay(id, gameState[id]);
        });
    },

    updateDateDisplay(monthName, year) {
        if (this.elements.yearValue) this.elements.yearValue.textContent = `${monthName}, Year ${year}`;
        else console.warn("Date display element (yearValue) not found.");
    },

    displayEvent(eventData) {
        if (!eventData || !eventData.character || !eventData.choices) {
            console.error("[displayEvent] Invalid eventData received:", eventData);
            if (this.elements.dialogueText) this.elements.dialogueText.textContent = "An unexpected error occurred while preparing the event.";
            if (this.elements.choicesContainer) this.elements.choicesContainer.innerHTML = "";
            return;
        }

        if (this.elements.characterName) this.elements.characterName.textContent = eventData.character.name;
        const factionAndRole = eventData.character.role ? `${eventData.character.role} of the ${eventData.character.factionName}` : eventData.character.factionName;
        if (this.elements.characterFaction) this.elements.characterFaction.textContent = factionAndRole;
        if (this.elements.dialogueText) this.elements.dialogueText.textContent = eventData.dialogue;

        if (window.DicebearHandler && this.elements.characterPortraitImg) {
            if (eventData.character.portraitSeed && String(eventData.character.portraitSeed).trim() !== '') {
                try {
                    const portraitUrl = DicebearHandler.getPortraitUrl(eventData.character.portraitSeed);
                    this.elements.characterPortraitImg.src = portraitUrl;
                    this.elements.characterPortraitImg.alt = eventData.character.name;
                } catch (error) {
                    console.error("[displayEvent] Error NPC portrait URL:", error);
                    this.elements.characterPortraitImg.src = `https://placehold.co/128x128/ff0000/ffffff?text=ERR`;
                }
            } else {
                this.elements.characterPortraitImg.src = `https://placehold.co/128x128/6b7280/ffffff?text=${eventData.character.name ? eventData.character.name.substring(0,1) : '?'}`;
            }
        }

        if (this.elements.choicesContainer) {
            this.elements.choicesContainer.innerHTML = '';
            eventData.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.className = 'choice-button bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 md:px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 w-full sm:w-auto min-h-[50px] flex items-center justify-center';
                button.addEventListener('click', () => {
                    if (window.GameLogic && typeof window.GameLogic.processPlayerChoice === 'function') {
                        window.GameLogic.processPlayerChoice(choice.effect);
                    } else {
                        console.error("GameLogic.processPlayerChoice is not available.");
                    }
                });
                this.elements.choicesContainer.appendChild(button);
            });
        } else {
            console.error("[displayEvent] choicesContainer element not found.");
        }
    },

    addNewEventLogSeparator() {
        if (!this.elements.resourceLogConsole) {
            console.error("Resource log console element not found for separator.");
            return;
        }
        const consoleDiv = this.elements.resourceLogConsole;
        if (consoleDiv.innerHTML.trim() !== '' && consoleDiv.innerHTML.trim() !== this.INITIAL_LOG_MESSAGE) {
            const hr = document.createElement('hr');
            hr.className = 'my-2 border-gray-600';
            consoleDiv.appendChild(hr);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        }
    },

    logResourceChanges(changes) {
        if (!this.elements.resourceLogConsole) {
            console.error("Resource log console element not found.");
            return;
        }
        const consoleDiv = this.elements.resourceLogConsole;
        if (consoleDiv.innerHTML.trim() === this.INITIAL_LOG_MESSAGE) {
            consoleDiv.innerHTML = '';
        }
        let hasChanges = false;
        if (changes.resources) {
            for (const resource in changes.resources) {
                const value = changes.resources[resource];
                if (value === 0 && resource !== 'stability') continue;
                hasChanges = true;
                const p = document.createElement('p');
                p.textContent = `${resource.charAt(0).toUpperCase() + resource.slice(1)}: ${value > 0 ? '+' : ''}${value}`;
                p.className = value > 0 ? 'log-increase' : (value < 0 ? 'log-decrease' : 'log-neutral');
                consoleDiv.appendChild(p);
            }
        }
        if (changes.factions) {
            for (const faction in changes.factions) {
                const value = changes.factions[faction];
                if (value === 0) continue;
                hasChanges = true;
                const p = document.createElement('p');
                const factionName = faction.charAt(0).toUpperCase() + faction.slice(1).replace('_leaders', ' Leaders').replace('_', ' ');
                p.textContent = `${factionName} Standing: ${value > 0 ? '+' : ''}${value}%`;
                p.className = value > 0 ? 'log-increase' : (value < 0 ? 'log-decrease' : 'log-neutral');
                consoleDiv.appendChild(p);
            }
        }
        if (!hasChanges) {
             const p = document.createElement('p');
             p.textContent = "No significant changes from that decision.";
             p.className = 'log-neutral';
             consoleDiv.appendChild(p);
        }
        while (consoleDiv.children.length > this.MAX_LOG_ENTRIES) {
            consoleDiv.removeChild(consoleDiv.firstChild);
        }
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    },

    /**
     * Logs crisis-related events to the resource log console.
     * @param {string} message - The main message to log.
     * @param {string} crisisName - The name of the crisis for context.
     * @param {'crisisStart'|'crisisEnd'|'crisisEffect'|'crisisOngoing'} type - The type of crisis log.
     */
    logCrisisEvent(message, crisisName, type = 'crisisEffect') {
        if (!this.elements.resourceLogConsole) {
            console.error("Resource log console element not found for crisis log.");
            return;
        }
        const consoleDiv = this.elements.resourceLogConsole;
        if (consoleDiv.innerHTML.trim() === this.INITIAL_LOG_MESSAGE) {
            consoleDiv.innerHTML = '';
        }

        const p = document.createElement('p');
        let fullMessage = message;
        // Optionally prefix with crisis name if not already in message, or for styling.
        // For now, keeping it simple as `main.js` constructs messages with context.

        p.textContent = fullMessage;

        switch (type) {
            case 'crisisStart':
                p.className = 'log-crisis-start';
                break;
            case 'crisisEnd':
                p.className = 'log-crisis-end';
                break;
            case 'crisisEffect':
                p.className = 'log-crisis-effect';
                break;
            case 'crisisOngoing': // For logging active crises on game load, for example
                p.className = 'log-crisis-ongoing';
                break;
            default:
                p.className = 'log-neutral';
        }

        consoleDiv.appendChild(p);

        while (consoleDiv.children.length > this.MAX_LOG_ENTRIES) {
            consoleDiv.removeChild(consoleDiv.firstChild);
        }
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
        console.log(`[Crisis Log - ${type} - ${crisisName}]: ${message}`);
    },


    clearResourceLog() {
        if (this.elements.resourceLogConsole) {
            this.elements.resourceLogConsole.innerHTML = this.INITIAL_LOG_MESSAGE;
        }
    },

    showNotification(message, type = 'info', duration = 3000) {
        const notificationArea = document.getElementById('notification-area') || this.createNotificationArea();
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white text-sm z-[100] transition-opacity duration-300 ease-in-out';
        switch (type) {
            case 'success': notification.classList.add('bg-green-500'); break;
            case 'warning': notification.classList.add('bg-yellow-500'); break;
            case 'error': notification.classList.add('bg-red-600'); break;
            default: notification.classList.add('bg-blue-500'); break;
        }
        notificationArea.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
                if (notificationArea.children.length === 0 && notificationArea.id === '_dynamicNotificationArea') {
                    document.body.removeChild(notificationArea);
                }
            }, 300);
        }, duration);
    },
    createNotificationArea() {
        let area = document.createElement('div');
        area.id = '_dynamicNotificationArea';
        area.className = 'fixed bottom-0 right-0 p-4 space-y-2 z-[99]';
        document.body.appendChild(area);
        return area;
    },

    displayGameOver(reason) {
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.id = 'game-over-overlay';
        gameOverOverlay.className = 'fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-[100] p-4 text-center';
        const title = document.createElement('h2');
        title.textContent = "Game Over";
        title.className = 'text-5xl font-bold text-red-500 mb-4';
        const reasonText = document.createElement('p');
        reasonText.textContent = reason;
        reasonText.className = 'text-xl text-gray-300 mb-8';
        const restartButton = document.createElement('button');
        restartButton.textContent = "Restart Kingdom";
        restartButton.className = 'bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-150 text-lg';
        restartButton.onclick = () => { window.location.reload(); }; // Simple reload for now
        gameOverOverlay.appendChild(title);
        gameOverOverlay.appendChild(reasonText);
        gameOverOverlay.appendChild(restartButton);
        document.body.appendChild(gameOverOverlay);
        if(this.elements.choicesContainer) {
            this.elements.choicesContainer.innerHTML = `<div class="text-gray-500 italic">The reign has ended.</div>`;
        }
    },

    showLoading(isLoading) {
        let loadingOverlay = document.getElementById('loading-overlay');
        if (isLoading) {
            if (!loadingOverlay) {
                loadingOverlay = document.createElement('div');
                loadingOverlay.id = 'loading-overlay';
                loadingOverlay.className = 'absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-30 rounded-xl';

                const spinner = document.createElement('div');
                spinner.className = 'animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500';
                const loadingText = document.createElement('p');
                loadingText.textContent = 'Consulting the royal advisors...';
                loadingText.className = 'text-purple-300 ml-4 text-lg';
                const innerFlex = document.createElement('div');
                innerFlex.className = 'flex items-center';
                innerFlex.appendChild(spinner);
                innerFlex.appendChild(loadingText);
                loadingOverlay.appendChild(innerFlex);

                const targetContainer = (this.elements.gameContent && this.elements.gameContent.style.display !== 'none') ?
                                      this.elements.gameContent :
                                      (this.elements.initialSetupScreen && this.elements.initialSetupScreen.style.display !== 'none' ?
                                       this.elements.initialSetupScreen : document.body);
                if(targetContainer.appendChild) { // Ensure targetContainer is a node
                    targetContainer.appendChild(loadingOverlay);
                } else {
                    console.error("Loading overlay target container is not a valid DOM node.", targetContainer);
                    document.body.appendChild(loadingOverlay); // Fallback
                }
            }
            loadingOverlay.style.display = 'flex';
        } else {
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    UIManager.init();
});

window.UIManager = UIManager;
