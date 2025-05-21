# Kingdom LLM

Kingdom LLM is a single-player, browser-based kingdom management game where you take on the role of a monarch. Your decisions, guided by interactions with characters role-played by a Large Language Model (LLM), will shape the fate of your realm. Balance resources, manage faction approval, and navigate treacherous crises to ensure your reign is long and prosperous.

Play Online: https://francopirinoli.github.io/Kingdom-LLM/

## Table of Contents

1.  [Game Overview](#game-overview)
2.  [Core Mechanics](#core-mechanics)
    * [Resource Management](#resource-management)
    * [Faction Management](#faction-management)
    * [Event System & LLM Interaction](#event-system--llm-interaction)
    * [Decision Making](#decision-making)
    * [Crisis System](#crisis-system)
3.  [How to Play](#how-to-play)
    * [Initial Setup](#initial-setup)
    * [Gameplay Loop](#gameplay-loop)
    * [Game Over Conditions](#game-over-conditions)
4.  [Technical Details](#technical-details)
5.  [Setup & Running the Game](#setup--running-the-game)

## Game Overview

**Concept:** As the monarch of your kingdom, you will be presented with a series of events. Characters, generated and role-played by an LLM (Google's Gemini 1.5 Flash), will approach you with requests, problems, or opportunities. Each choice you make has tangible consequences, affecting your kingdom's resources, the loyalty of various internal factions, and the overall stability of your realm.

**Goal:** Rule wisely to maintain stability and ensure the survival and prosperity of your kingdom for as long as possible. The game ends if critical resources are depleted, a faction's approval drops to zero leading to revolt, or other dire conditions are met.

**Inspiration:** Games like *Reigns* and *Sort the Court*, with a modern twist using generative AI for dynamic storytelling.

## Core Mechanics

### Resource Management

The health and stability of your kingdom are tracked by five key resources:

* **Population:** The number of citizens in your kingdom. Affected by food supply, prosperity, war, and disease. Reaching zero (or a critical low) can lead to game over.
* **Wealth (Treasury):** The kingdom's gold and financial strength. Gained through taxes and trade, spent on army upkeep, construction, and various event choices. Reaching zero can cripple your ability to govern.
* **Food:** The kingdom's food supply. Essential for feeding your population and army. Affected by harvests, trade, spoilage, and disasters. Reaching zero leads to famine.
* **Military Strength:** The power and readiness of your kingdom's army. Crucial for defense and projecting power. Gained through recruitment and funding, lost in battles or due to poor morale/funding. Reaching zero leaves your kingdom defenseless.
* **Stability:** A measure of order and control within the kingdom. Influenced by strong military, happy factions, and fair laws. Low stability can lead to unrest and negative events. Reaching zero signifies chaos.

### Faction Management

Five influential factions exist within your kingdom, each with its own agenda and approval rating of your rule:

* **Nobility:** Concerned with power, tradition, land rights, and their privileges.
* **Clergy:** Focused on faith, morality, church influence, and divine favor.
* **Merchants:** Interested in trade, profit, economic freedom, and infrastructure.
* **Peasantry:** Concerned with food security, justice, fair taxes, and protection.
* **Military Leaders:** Prioritize army strength, funding for war, border security, and glory.

Faction standing is represented by a percentage (0% to 100%), starting neutral (e.g., 50%). Your decisions can please or anger factions, impacting their standing. If any faction's standing reaches 0%, it can lead to revolt, a coup, or civil war, resulting in a game over.

### Event System & LLM Interaction

Events are the primary driver of gameplay.
* **Event Trigger:** Events occur sequentially. After one event is resolved, a new one is generated.
* **Character Generation:** The LLM creates a unique character for each event, including their name, role, faction, and mood.
* **LLM Persona:** The LLM adopts the persona of this character, describing their situation and making their request directly to you, the ruler.
* **Dynamic Scenarios:** Event situations are drawn from a wide pool of templates and can be influenced by ongoing crises or the specific stage of an event chain.

### Decision Making

For each event, you are presented with 2-4 choices.
* **Choice Presentation:** Each choice has a brief player-facing text describing the action.
* **Consequences:** The LLM generates the mechanical impacts for each choice using a hidden tagging system. These tags define changes to resources (e.g., `<wealth:-100>`, `<food:+50>`) and faction standings (e.g., `<nobility:+10>`, `<peasantry:-5>`).
* **Outcome:** After you make a choice, the game applies these effects, and the story progresses. The LLM's ability to generate varied consequences ensures that decisions are meaningful and often involve trade-offs.

### Crisis System

Your kingdom may face various crises, ranging from resource shortages (like famine or bankruptcy) to faction-driven turmoil (like noble rebellions or peasant uprisings) and narrative-driven event chains (like plagues or the rise of a bandit king).
* **Triggers:** Crises can be triggered by specific resource or faction thresholds, or randomly.
* **Ongoing Effects:** Active crises often have per-turn negative impacts on your resources or faction standings.
* **Resolution:** Crises can be resolved by meeting certain conditions (e.g., restoring a resource level), through specific player choices in multi-stage event chains, or by lasting a defined duration.
* **Event Chains:** Some major crises unfold over several events (stages). Your choices at each stage influence the progression and ultimate outcome of the crisis. The LLM is given specific guidance for each stage to ensure narrative coherence.

## How to Play

### Initial Setup

1.  **Open `index.html` in your web browser.**
2.  **API Key (Important):**
    * The game uses Google's Gemini 1.5 Flash model for generating event narratives and choices.
    * You will need to obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    * On the initial setup screen or via the in-game settings menu (gear icon), enter your Gemini API Key. The key is stored locally in your browser's `localStorage` and is not transmitted anywhere else except directly to the Google API.
    * **Without an API key, the game will run using predefined mock events.**
3.  **Customize Your Ruler:**
    * Enter your desired Ruler's Name and Kingdom's Name.
    * Randomize your ruler's avatar or go with the default.
    * Choose an avatar style from the Dicebear collection in the settings menu.
4.  **Start Game:** Click "Begin New Reign" to start a fresh game or "Load Saved Game" if you have previous progress.

### Gameplay Loop

1.  **Event Presentation:** A character will appear with a situation or request. Read their dialogue carefully.
2.  **Make a Choice:** Review the 2-3 options presented. Consider the potential (but initially hidden) consequences.
3.  **Observe Outcomes:** After choosing, the game will:
    * Update your resources and faction standings based on the choice.
    * Log these changes in the "Event Log" panel.
    * Advance the in-game date by one month.
    * Apply any ongoing effects from active crises.
    * Check for new crisis triggers or resolutions of existing ones.
    * Check for game over conditions.
4.  **New Event:** A new event will be generated, and the cycle continues.
5.  **Manage Settings:** Click the gear icon at any time to access settings (API Key, Avatar Style) or start a new game.

### Game Over Conditions

Your reign will end if:

* Any critical resource (Population, Food, Military, Stability) reaches zero (or a critically low threshold).
* Wealth becomes too deeply negative.
* Any faction's standing drops to 0%, leading to a revolt or collapse.
* Specific critical crises result in an unavoidable game over.

A message will explain the cause of your downfall.

## Technical Details

* **Frontend:** Built with HTML, CSS (Tailwind CSS), and vanilla JavaScript.
* **LLM Interaction:** Uses the `fetch` API to communicate with the Google Gemini API.
* **Avatars:** Character portraits are generated using the [Dicebear API](https://www.dicebear.com/).
* **Local Persistence:** Game state and settings (API key, avatar style) are saved in the browser's `localStorage`.

## Setup & Running the Game

1.  **Clone the Repository (or download the files):**
2.  **Obtain a Gemini API Key:**
    * Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    * Create an API key.
3.  **Run the Game:**
    * Open the `index.html` file in a modern web browser (Chrome, Firefox, Edge, Safari).
    * No local server is strictly required for basic functionality, but running one can prevent some browser security restrictions if you encounter them (e.g., using the Live Server extension in VS Code).
4.  **Enter API Key:**
    * On the game's initial setup screen, click the gear icon (or wait for the prompt if it's your first time).
    * Enter your Gemini API Key into the designated field and save.

Good luck, Your Majesty! May your reign be wise and your kingdom flourish.
