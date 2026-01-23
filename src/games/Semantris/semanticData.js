import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model = null;
let modelLoadPromise = null;

const TOPICS = [
    'nature', 'science', 'food', 'technology', 'music',
    'art', 'business', 'history', 'sports', 'weather',
    'ocean', 'animal', 'emotion', 'travel', 'house'
];

/**
 * Loads the Universal Sentence Encoder model.
 * Returns a promise that resolves when loaded.
 */
export const loadModel = async () => {
    if (model) return model;

    if (!modelLoadPromise) {
        // Load the model (this downloads ~30MB)
        console.log("Loading TensorFlow USE Model...");
        modelLoadPromise = use.load();
    }

    model = await modelLoadPromise;
    console.log("TensorFlow Model Loaded.");
    return model;
};

/**
 * Fetches words from Datamuse (keeping this for word generation)
 */
export const fetchTopicWords = async (topic) => {
    try {
        const cleanTopic = topic || TOPICS[Math.floor(Math.random() * TOPICS.length)];
        const response = await fetch(`https://api.datamuse.com/words?ml=${cleanTopic}&max=50`);
        const data = await response.json();

        const words = data
            .map(item => item.word)
            .filter(w => !w.includes(' ') && w.length > 2);

        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        return {
            topic: cleanTopic,
            words: words.slice(0, 30)
        };
    } catch (error) {
        console.error("API Error:", error);
        return { topic: 'offline', words: ['error', 'check', 'connection'] };
    }
};

/**
 * Calculates Cosine Similarity using TFJS
 */
export const checkSemanticMatch = async (input, activeWords) => {
    if (!model) {
        console.warn("Model not loaded yet!");
        return null;
    }

    try {
        const cleanInput = input.trim().toLowerCase();

        // 0. Exact Match Disallowed
        if (activeWords.some(w => w.text.toLowerCase() === cleanInput)) {
            return null; // Strict rule
        }

        // 1. Embed Input
        const inputEmbedding = await model.embed([cleanInput]);

        // 2. Embed All Targets
        const targetTexts = activeWords.map(w => w.text.toLowerCase());
        const targetEmbeddings = await model.embed(targetTexts);

        // 3. Calculate Cosine Similarity
        // Dot product of normalized vectors = Cosine Similarity
        // Matrix multiplication: [1, 512] x [512, N] = [1, N] scores
        const scoresTensor = tf.matMul(
            inputEmbedding,
            targetEmbeddings,
            false,
            true
        );

        const scores = await scoresTensor.data();

        // Cleanup tensors to prevent memory leak
        inputEmbedding.dispose();
        targetEmbeddings.dispose();
        scoresTensor.dispose();

        // 4. Find Best Match
        let bestIndex = -1;
        let highestScore = -1;

        for (let i = 0; i < scores.length; i++) {
            // Check threshold (e.g., 0.5 is usually decent relatedness in USE)
            // "Dog" vs "Puppy" ~ 0.8
            // "Dog" vs "Cat" ~ 0.6
            // "Dog" vs "Car" ~ 0.1
            if (scores[i] > highestScore) {
                highestScore = scores[i];
                bestIndex = i;
            }
        }

        // Threshold tuning
        const THRESHOLD = 0.55;

        if (bestIndex !== -1 && highestScore > THRESHOLD) {
            return {
                match: activeWords[bestIndex],
                score: Math.floor(highestScore * 1000) // 0-1000 scale
            };
        }

        return null;

    } catch (error) {
        console.error("TFJS matching error:", error);
        return null;
    }
};

export const getRandomTopic = () => TOPICS[Math.floor(Math.random() * TOPICS.length)];
