// -----------------------------------------------------------------------------
// Kingdom LLM - dicebear_handler.js
//
// Handles interactions with the Dicebear API to generate character portraits.
// -----------------------------------------------------------------------------

const DicebearHandler = {
    // Base URL for the Dicebear API (Version 8.x)
    baseUrl: 'https://api.dicebear.com/8.x/',
    // Default style if none is set or loaded
    currentStyle: 'adventurer', // This will be updated by main.js from localStorage

    /**
     * Sets the current Dicebear style to be used for generating portraits.
     * @param {string} styleName - The name of the Dicebear style (e.g., 'adventurer', 'pixel-art').
     */
    setCurrentStyle(styleName) {
        if (styleName && typeof styleName === 'string') {
            this.currentStyle = styleName;
            console.log(`Dicebear style set to: ${this.currentStyle}`);
        } else {
            console.warn(`Invalid Dicebear style name provided: ${styleName}. Using default: ${this.currentStyle}`);
        }
    },

    /**
     * Generates a full Dicebear API URL for a given seed and the current style.
     * @param {string} seed - A string used as the seed for the avatar generation.
     * Typically a character name or a unique identifier.
     * @returns {string} The full URL to fetch the Dicebear avatar.
     */
    getPortraitUrl(seed) {
        if (!seed || typeof seed !== 'string' || seed.trim() === '') {
            console.warn('A valid seed is required for Dicebear portrait generation. Using a default seed.');
            seed = 'default-character-seed'; // Provide a fallback seed
        }

        // Sanitize seed a bit (optional, Dicebear usually handles most characters)
        const sanitizedSeed = encodeURIComponent(seed);

        // Construct the URL
        // Example: https://api.dicebear.com/8.x/adventurer/svg?seed=Arthur
        const portraitUrl = `${this.baseUrl}${this.currentStyle}/svg?seed=${sanitizedSeed}&size=128&radius=50`;
        // Added size and radius for consistency with the placeholder look.
        // `radius=50` makes it a circle if the style supports it.
        // `size=128` matches the placeholder.

        console.log(`Generated Dicebear URL: ${portraitUrl}`);
        return portraitUrl;
    },

    /**
     * Asynchronously fetches the portrait.
     * This can be used if we need to confirm the image loads correctly,
     * but UIManager currently just sets the src.
     * For simplicity, UIManager directly uses getPortraitUrl.
     * This function is more of an example if direct fetching/validation was needed here.
     * @param {string} seed - The seed for the avatar.
     * @returns {Promise<string>} A promise that resolves with the image URL or rejects on error.
     */
    async fetchPortrait(seed) {
        const url = this.getPortraitUrl(seed);
        try {
            // Note: We don't actually "fetch" the image data here,
            // as the browser handles that when an <img> src is set.
            // This function primarily serves to demonstrate where such logic *could* go
            // if pre-flight checks or direct image data handling were needed.
            // For now, it just returns the URL.
            return url;
        } catch (error) {
            console.error(`Error constructing Dicebear URL for seed "${seed}":`, error);
            // Return a fallback placeholder URL in case of an unexpected error during URL construction
            return `https://placehold.co/128x128/ff0000/ffffff?text=Error`;
        }
    }
};

// Expose DicebearHandler to the global scope
window.DicebearHandler = DicebearHandler;

// Initialize with a default style, though main.js will likely override this on load.
// DicebearHandler.setCurrentStyle('adventurer'); // Already set as default property
