// -----------------------------------------------------------------------------
// Kingdom LLM - llm_handler.js
//
// Handles all interactions with the LLM (Gemini 1.5 Flash), including
// prompt construction, API calls, and response parsing.
// -----------------------------------------------------------------------------

/**
 * @file Manages LLM interactions, prompt generation, API calls, and response parsing.
 * @namespace LLMHandler
 */
const LLMHandler = {
    /**
     * Base URL for the Gemini API. API key will be appended.
     * @type {string}
     */
    geminiApiUrl: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=`,

    /**
     * Constructs the detailed prompt for the LLM.
     * @param {object} eventParams - Parameters for the current event (from RandomTables).
     * @param {object} gameContext - Current game state (resources, factions, date, etc.).
     * @param {string[]} [activeCrisesLLMInfo=[]] - Array of strings describing active crises.
     * @param {string|null} [llmStageGuidanceForPrompt=null] - Specific guidance for an event chain stage.
     * @returns {string} The fully constructed prompt.
     * @memberof LLMHandler
     */
    constructPrompt(eventParams, gameContext, activeCrisesLLMInfo = [], llmStageGuidanceForPrompt = null) {
        const { kingdomName = "Eldoria", playerName = "Your Majesty", currentYear = 1, currentMonthName = "January" } = gameContext;

        if (!eventParams || !eventParams.factionId || !eventParams.characterName || !eventParams.characterRole || !eventParams.factionName || !eventParams.mood || !eventParams.situation) {
            console.error("[LLMHandler.constructPrompt] Invalid eventParams or missing required fields:", eventParams);
            // Returning a generic error prompt might be better than a simple string if the LLM is still called.
            // However, the calling function (generateAndDisplayEvent) should ideally catch this.
            return "Error: Critical event parameters are missing. Cannot construct prompt.";
        }

        const { factionId, characterName, characterRole, factionName, mood, situation, isCrisisChainEvent, crisisName: eventCrisisName } = eventParams;
        const currentFactionStanding = gameContext[factionId] !== undefined ? gameContext[factionId] : 50;

        // --- Contextual Sections ---
        let crisisContextSection = "";
        if (activeCrisesLLMInfo.length > 0) {
            crisisContextSection = "CURRENT KINGDOM-WIDE ISSUES:\n" +
                activeCrisesLLMInfo.map(text => `- ${text}`).join("\n") +
                "\nThese issues may influence the current situation, your character's mood, and the options you propose.\n\n";
        }

        let eventChainStageContext = "";
        const crisisDisplayName = eventCrisisName || (isCrisisChainEvent ? "the current crisis" : "");
        if (isCrisisChainEvent && llmStageGuidanceForPrompt) {
            eventChainStageContext = `CRISIS EVENT STAGE DETAILS:\nThis event is a specific step in addressing "${crisisDisplayName}".\nStage Goal/Context: ${llmStageGuidanceForPrompt}\nYour dialogue and proposed choices MUST directly relate to advancing or resolving this stage of the crisis.\n\n`;
        } else if (isCrisisChainEvent) {
            eventChainStageContext = `CRISIS EVENT STAGE DETAILS:\nThis event is a specific step in addressing "${crisisDisplayName}". Your dialogue and proposed choices MUST directly relate to this stage.\n\n`;
        }

        // --- Value and Tag Guidance ---
        const valueGuidance = `
TAG VALUE GUIDANCE (CRITICAL FOR GAME BALANCE - Adhere to these ranges):
- Resource Tags (<population:X>, <wealth:X>, <food:X>, <military:X>): Values typically between -100 and +100. For major events or dire situations, values can range from -300 to +300.
- Stability Tag (<stability:X>): Values typically between -15 and +15. For major events, -30 to +30.
- Faction Standing Tags (<nobility:X>, <clergy:X>, etc.): Values typically between -15 and +15 (representing percentage points). For major events, -30 to +30.
- CHALLENGING CHOICES: Most options should present a trade-off (e.g., gain wealth but lose stability). Avoid purely positive or purely negative options unless it's a clear reward/punishment scenario. The ruler should face meaningful dilemmas.
`;

        let formattingExamples = `
STRICT OUTPUT FORMAT EXAMPLE FOR ONE OPTION (Standard Event):
Player-facing text: Send aid to the flood victims in the Western Province.
Tags: <food:-200> <wealth:-100> <peasantry:+15> <stability:+5>
`;

        if (isCrisisChainEvent) {
            formattingExamples += `
STRICT OUTPUT FORMAT EXAMPLE FOR ONE OPTION (Crisis Chain Event - Progressing):
Player-facing text: Fund the alchemist's research into the plague cure.
Tags: <wealth:-150> <clergy:+5> <chain_progress:plague_research_funded>

STRICT OUTPUT FORMAT EXAMPLE FOR ONE OPTION (Crisis Chain Event - Resolving Successfully):
Player-facing text: Deploy the new cure throughout the kingdom.
Tags: <population:+50> <stability:+10> <chain_resolve:success>

STRICT OUTPUT FORMAT EXAMPLE FOR ONE OPTION (Crisis Chain Event - Resolving with Failure):
Player-facing text: The experimental cure has failed, burn the infected districts.
Tags: <population:-200> <stability:-20> <peasantry:-25> <chain_resolve:failure>
`;
        }

        const chainTagInstructions = isCrisisChainEvent ? `
CRISIS CHAIN TAGS (IMPORTANT: Use ONLY ONE of these per choice, IF the choice directly progresses or resolves the crisis chain):
* \`<chain_progress:NEXT_STAGE_ID>\`: Use if this choice moves the crisis to a new defined stage (e.g., 'plague_cure_found'). Replace NEXT_STAGE_ID with the actual ID.
* \`<chain_resolve:success>\`: Use if this choice successfully resolves the ENTIRE crisis chain.
* \`<chain_resolve:failure>\`: Use if this choice leads to the FAILURE of the ENTIRE crisis chain.
If a choice does NOT directly affect the crisis chain's progression or resolution, DO NOT include any chain_progress or chain_resolve tag for that choice.
` : "";

        // --- Main Prompt Assembly ---
        const prompt = `
You are an AI role-playing as a character in the medieval kingdom of ${kingdomName}, ruled by ${playerName}.
The current date is ${currentMonthName}, Year ${currentYear}.

${crisisContextSection}${eventChainStageContext}
YOUR CHARACTER:
- Name: ${characterName}
- Role: ${characterRole}
- Faction: ${factionName}
- Current Mood: ${mood} (Reflect this in your tone. Your mood is influenced by your faction's standing, any kingdom-wide issues, and the specific situation.)
- Your Faction's Standing with Ruler: ${currentFactionStanding}/100 (Do NOT mention this number directly in your dialogue. Use it to subtly influence your demeanor: respectful if high, perhaps more demanding or desperate if low.)

THE SITUATION:
"${situation}"
(Consider the date, your faction's standing, and any ongoing crises/chain stage context when presenting this.)

YOUR TASK:
1.  DIALOGUE: In 1-2 rich paragraphs, present the situation to ${playerName}. Embody your character's persona, role, and mood. Be descriptive and immersive. Write directly as the character.
2.  PLAYER CHOICES: After your dialogue, propose EXACTLY 2 to 3 distinct options for ${playerName}.

FOR EACH OPTION, YOU MUST PROVIDE THE FOLLOWING ON SEPARATE LINES (FOLLOW THIS FORMAT EXACTLY - THIS IS CRITICAL):
   Line 1: Player-facing text: [A short, clear description of the choice for the player. Maximum 1-2 sentences.]
   Line 2: Tags: [<tag1:value1> <tag2:value2> ...] (Ensure tags are space-separated and enclosed in angle brackets.)

VALID TAGS AND THEIR PURPOSE:
- Resource Tags (Affect kingdom stats): <population:X>, <wealth:X>, <food:X>, <military:X>, <stability:X>
- Faction Standing Tags (Affect faction approval): <nobility:X>, <clergy:X>, <merchants:X>, <peasantry:X>, <military_leaders:X>
${chainTagInstructions}
${valueGuidance}
Ensure options have varied and often mixed consequences. Be creative with choices and their impacts, keeping in mind active crises and any specific crisis chain stage requirements.

${formattingExamples}
---
IMPORTANT: Begin your response IMMEDIATELY with ${characterName}'s dialogue. Do NOT include any preamble, self-correction, or explanation before the dialogue.
        `;
        // console.log("Constructed LLM Prompt:", prompt);
        return prompt.trim();
    },

    /**
     * Calls the Gemini API with the constructed prompt.
     * @param {string} promptText - The prompt to send to the LLM.
     * @param {string} apiKey - The Gemini API key.
     * @returns {Promise<string|null>} The LLM's text response, or null on error.
     * @memberof LLMHandler
     */
    async callLLM(promptText, apiKey) {
        if (!apiKey) {
            console.error("Gemini API Key is missing.");
            if (window.UIManager) UIManager.showNotification("Error: Gemini API Key is not set in Settings.", "error");
            return null;
        }
        const fullApiUrl = this.geminiApiUrl + apiKey;
        const payload = {
            contents: [{ parts: [{ text: promptText }] }],
            // generationConfig: { // Optional: Add if you need to control temperature, topK, etc.
            //  temperature: 0.7, // Example: For more creative responses
            //  topK: 40,
            // }
        };

        try {
            const response = await fetch(fullApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ error: { message: response.statusText } })); // Graceful error parsing
                console.error("LLM API Error:", response.status, errorBody);
                const errorMessage = `LLM API Error: ${response.status}. ${errorBody.error?.message || 'Unknown error.'}`;
                if (window.UIManager) UIManager.showNotification(errorMessage, "error", 7000);
                return null;
            }

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                return data.candidates[0].content.parts[0].text;
            } else if (data.promptFeedback && data.promptFeedback.blockReason) {
                const blockReason = data.promptFeedback.blockReason;
                const safetyRatings = data.promptFeedback.safetyRatings || [];
                console.error("LLM API Blocked:", blockReason, safetyRatings);
                const blockMessage = `LLM content generation blocked: ${blockReason}. Check console for safety ratings.`;
                if (window.UIManager) UIManager.showNotification(blockMessage, "error", 7000);
                return null;
            } else {
                console.error("Invalid LLM response structure:", data);
                if (window.UIManager) UIManager.showNotification("Error: Received an invalid response structure from the LLM.", "error");
                return null;
            }
        } catch (error) {
            console.error("Error calling LLM API:", error);
            if (window.UIManager) UIManager.showNotification(`Network or other error calling LLM: ${error.message}`, "error", 7000);
            return null;
        }
    },

    /**
     * Parses a segment of lines representing a single choice from the LLM response.
     * @param {string[]} segmentLinesArray - Array of lines for one choice.
     * @returns {object|null} The parsed choice object or null if parsing fails.
     * @memberof LLMHandler
     * @private
     */
    _parseSingleChoiceSegment(segmentLinesArray) {
        let choiceText = "";
        let tagString = "";

        // Normalize lines and attempt to find "Player-facing text:" and "Tags:"
        // This regex is more flexible for variations in "Player-facing text:"
        const pftRegex = /^(?:player-facing text:|player facing text:|choice text:)\s*(.*)/i;
        const tagsRegex = /^tags:\s*(.*)/i;

        for (const line of segmentLinesArray) {
            const trimmedLine = line.trim();
            if (trimmedLine === "") continue;

            const pftMatch = trimmedLine.match(pftRegex);
            if (pftMatch && pftMatch[1]) {
                choiceText = pftMatch[1].trim();
                continue; // Found player-facing text, move to next line or look for tags
            }

            const tagsMatch = trimmedLine.match(tagsRegex);
            if (tagsMatch && tagsMatch[1]) {
                tagString = tagsMatch[1].trim();
                // Once tags are found, we assume this choice segment is complete for these two fields.
                // Additional lines might be ignored unless a more complex structure is expected.
                break;
            }
        }
        // If choiceText was not found via explicit prefix, but we have lines,
        // and the first line doesn't look like a "Tags:" line, assume it's the choice text.
        // This is a fallback for less strictly formatted LLM output.
        if (!choiceText && segmentLinesArray.length > 0 && !segmentLinesArray[0].trim().toLowerCase().startsWith("tags:")) {
             // Check if the first non-empty line looks like a choice description.
             const firstNonEmptyLine = segmentLinesArray.find(l => l.trim() !== "");
             if (firstNonEmptyLine && !firstNonEmptyLine.trim().toLowerCase().startsWith("tags:")) {
                 choiceText = firstNonEmptyLine.trim();
                 // If we took the first line as choice text, and the second line is tags
                 if (segmentLinesArray.length > 1) {
                    const secondLineTrimmed = segmentLinesArray.find((l,idx) => idx > 0 && l.trim() !== "")?.trim().toLowerCase();
                    if (secondLineTrimmed && secondLineTrimmed.startsWith("tags:")) {
                        tagString = secondLineTrimmed.substring("tags:".length).trim();
                    }
                 }
             }
        }


        if (!choiceText) {
            console.warn("[LLMHandler._parseSingleChoiceSegment] Could not extract choice text from segment:", segmentLinesArray.join('\n'));
            return null;
        }

        const currentChoice = { text: choiceText, effect: { resources: {}, factions: {}, chainDirective: null } };
        const tags = tagString.match(/<[^>]+>/g) || []; // Extract all <tag:value> patterns

        tags.forEach(tag => {
            const rawTagContent = tag.slice(1, -1).trim(); // Remove < >
            const parts = rawTagContent.split(':');
            const tagName = parts[0].trim().toLowerCase();
            const tagValue = parts.length > 1 ? parts[1].trim() : null;

            const validResources = ['population', 'wealth', 'food', 'military', 'stability'];
            const validFactions = ['nobility', 'clergy', 'merchants', 'peasantry', 'military_leaders'];

            if (validResources.includes(tagName) && tagValue !== null) {
                const numValue = parseInt(tagValue, 10);
                if (!isNaN(numValue)) currentChoice.effect.resources[tagName] = numValue;
            } else if (validFactions.includes(tagName) && tagValue !== null) {
                const numValue = parseInt(tagValue, 10);
                if (!isNaN(numValue)) currentChoice.effect.factions[tagName] = numValue;
            } else if (tagName === 'chain_progress' && tagValue) {
                currentChoice.effect.chainDirective = { type: 'progress', value: tagValue };
            } else if (tagName === 'chain_resolve' && (tagValue === 'success' || tagValue === 'failure')) {
                currentChoice.effect.chainDirective = { type: 'resolve', value: tagValue };
            } else if (tagName === 'chain_resolve') { // Handle invalid chain_resolve value
                 console.warn(`[LLMHandler] Invalid chain_resolve value: '${tagValue}'. Expected 'success' or 'failure'. Tag ignored.`);
            }
            else {
                console.warn(`[LLMHandler] Unknown or malformed tag: ${tag}`);
            }
        });
        return this._finalizeChoiceObject(currentChoice);
    },

    /**
     * Parses the full text response from the LLM into a structured event object.
     * @param {string} llmTextResponse - The raw text response from the LLM.
     * @param {object} baseEventParams - Base event parameters, used for fallback character info.
     * @returns {object} A structured event object { character, dialogue, choices }.
     * @memberof LLMHandler
     */
    parseLLMResponse(llmTextResponse, baseEventParams = {}) {
        const fallbackCharacter = {
            name: baseEventParams.characterName || "Mysterious Figure",
            factionName: baseEventParams.factionName || "Unknown Faction",
            portraitSeed: baseEventParams.portraitSeed || `fallback-${Date.now()}`,
            role: baseEventParams.characterRole || "Visitor"
        };

        if (!llmTextResponse || typeof llmTextResponse !== 'string' || llmTextResponse.trim() === "") {
            console.warn("[LLMHandler.parseLLMResponse] Empty LLM response. Using fallback.", baseEventParams);
            return {
                character: fallbackCharacter,
                dialogue: "The advisor is silent or the message was unclear. (Empty LLM Response)",
                choices: [this._finalizeChoiceObject({ text: "Okay (No LLM Response)" })]
            };
        }

        try {
            const allLines = llmTextResponse.split('\n');
            let dialogueLines = [];
            let choiceSegments = [];
            let currentChoiceLines = [];
            let parsingDialogue = true;

            // Iterate through lines to separate dialogue from choice blocks
            for (let i = 0; i < allLines.length; i++) {
                const line = allLines[i];
                const trimmedLine = line.trim();
                const lowerLine = trimmedLine.toLowerCase();

                // Check for start of a choice block (e.g., "Player-facing text:", "Option X:", "Tags:")
                // or a simple "Options:" header.
                if (lowerLine.match(/^(player-facing text:|player facing text:|choice text:|option \d+:)/i) ||
                    (lowerLine.startsWith("tags:") && currentChoiceLines.length > 0) || // A "Tags:" line often follows a "Player-facing text:" line
                    (lowerLine === "options:" && i + 1 < allLines.length && allLines[i+1].trim().toLowerCase().match(/^(player-facing text:|player facing text:|choice text:|option \d+:)/i) )
                    ) {
                    if (parsingDialogue) parsingDialogue = false; // Switch from dialogue to choices mode

                    // If we were accumulating lines for a previous choice, and this line starts a new one, process the accumulated one.
                    if (currentChoiceLines.length > 0 && lowerLine.match(/^(player-facing text:|player facing text:|choice text:|option \d+:)/i)) {
                        choiceSegments.push([...currentChoiceLines]);
                        currentChoiceLines = [];
                    }
                    currentChoiceLines.push(line);
                } else if (!parsingDialogue) { // Already in choices mode, accumulate lines for current choice
                    currentChoiceLines.push(line);
                } else { // Still in dialogue mode
                    dialogueLines.push(line);
                }
            }
            // Add the last accumulated choice segment
            if (currentChoiceLines.length > 0) {
                choiceSegments.push([...currentChoiceLines]);
            }

            const dialogue = dialogueLines.map(l => l.trim()).filter(Boolean).join('\n');
            const choices = choiceSegments.map(segment => this._parseSingleChoiceSegment(segment)).filter(Boolean);


            if (choices.length === 0) {
                 console.warn("[LLMHandler.parseLLMResponse] No valid choices extracted. Dialogue:", dialogue || "(empty)");
                 // Provide a fallback choice if dialogue exists but no choices were parsed
                 const fallbackText = dialogue ? "Acknowledge (Parsing Issue)" : "Dismiss (Major Parsing Issue)";
                 choices.push(this._finalizeChoiceObject({ text: fallbackText }));
            }
             if (!dialogue && choices.length > 0) {
                console.warn("[LLMHandler.parseLLMResponse] Choices parsed, but no dialogue extracted. This might be an LLM formatting deviation.");
                // It's unusual but possible the LLM skipped dialogue. We'll proceed with choices.
            }


            return {
                character: fallbackCharacter, // Uses baseEventParams for character details
                dialogue: dialogue || "The advisor's message was unclear (Missing Dialogue).",
                choices: choices
            };

        } catch (error) {
            console.error("[LLMHandler.parseLLMResponse] Critical error during parsing:", error, "\nRaw Response:\n", llmTextResponse);
            if (window.UIManager) UIManager.showNotification("Error processing advisor's message. Using fallback.", "error");
            return {
                character: fallbackCharacter,
                dialogue: "A critical error occurred understanding the advisor's message.",
                choices: [this._finalizeChoiceObject({ text: "Continue (Critical Parse Error)" })]
            };
        }
    },

    /**
     * Ensures a choice object has the basic effect structure.
     * @param {object} choice - The choice object to finalize.
     * @returns {object} The finalized choice object.
     * @memberof LLMHandler
     * @private
     */
    _finalizeChoiceObject(choice) {
        if (!choice.effect) choice.effect = {};
        if (!choice.effect.resources) choice.effect.resources = {};
        if (!choice.effect.factions) choice.effect.factions = {};
        if (typeof choice.effect.chainDirective === 'undefined') choice.effect.chainDirective = null;
        return choice;
    }
};

window.LLMHandler = LLMHandler;
