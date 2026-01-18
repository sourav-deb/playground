// A simple but effective semantic mapping system for the game

const CATEGORIES = {
    // Nature & Environment
    nature: ["tree", "flower", "grass", "forest", "mountain", "river", "ocean", "rain", "sun", "cloud", "wind", "storm", "snow", "earth", "leaf", "plant"],
    animal: ["dog", "cat", "bird", "lion", "tiger", "fish", "shark", "whale", "monkey", "bear", "snake", "eagle", "pet", "zoo", "wild", "farm", "cow", "pig"],
    space: ["star", "moon", "planet", "mars", "galaxy", "asteroid", "comet", "sun", "sky", "alien", "ufo", "rocket", "orbit", "universe", "black hole"],

    // Food & Drink
    food: ["pizza", "burger", "sushi", "pasta", "rice", "bread", "cheese", "fruit", "apple", "banana", "cake", "cookie", "chocolate", "soup", "salad", "meat", "vegetable"],
    drink: ["water", "coffee", "tea", "juice", "soda", "beer", "wine", "milk", "cocktail", "lemonade", "liquid", "thirsty"],
    flavor: ["sweet", "salty", "sour", "spicy", "hot", "cold", "bitter", "delicious", "yummy", "tasty"],

    // Technology & Science
    tech: ["computer", "phone", "robot", "internet", "wifi", "code", "screen", "keyboard", "mouse", "battery", "chip", "digital", "virtual", "ai", "data"],
    science: ["atom", "energy", "lab", "chemical", "physics", "biology", "math", "gravity", "magnet", "experiment", "theory", "formula"],

    // Emotions & Human
    emotion: ["happy", "sad", "angry", "love", "hate", "fear", "joy", "smile", "cry", "laugh", "bored", "excited", "tired"],
    body: ["hand", "foot", "head", "eye", "ear", "mouth", "nose", "hair", "brain", "heart", "leg", "arm", "finger", "face"],
    clothing: ["shirt", "pants", "shoes", "hat", "dress", "jacket", "coat", "socks", "gloves", "glasses", "tie", "fashion", "wear"],

    // Abstract
    color: ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "pink", "brown", "gray", "dark", "light"],
    time: ["now", "later", "yesterday", "tomorrow", "clock", "hour", "minute", "second", "day", "night", "week", "month", "year", "calendar"],

    // Action
    action: ["run", "jump", "walk", "sleep", "eat", "drink", "play", "work", "fight", "dance", "sing", "talk", "listen", "watch"]
};

// Inverse map: Word -> Categories
const WORD_TO_CATEGORIES = {};
Object.entries(CATEGORIES).forEach(([category, words]) => {
    words.forEach(word => {
        if (!WORD_TO_CATEGORIES[word]) WORD_TO_CATEGORIES[word] = [];
        WORD_TO_CATEGORIES[word].push(category);
    });
});

/**
 * Returns a random word from the dictionary
 */
export const getRandomWord = () => {
    const categories = Object.keys(CATEGORIES);
    const randomCat = categories[Math.floor(Math.random() * categories.length)];
    const words = CATEGORIES[randomCat];
    const word = words[Math.floor(Math.random() * words.length)];
    return { text: word, category: randomCat };
};

/**
 * Calculates semantic similarity between input and a target word.
 * Returns score 0-100.
 */
export const getSimilarity = (input, targetWord, targetCategory) => {
    const cleanInput = input.toLowerCase().trim();
    const cleanTarget = targetWord.toLowerCase().trim();

    // 1. Direct Match
    if (cleanInput === cleanTarget) return 100;

    // 2. Partial Match / Substring
    if (cleanTarget.includes(cleanInput) && cleanInput.length > 2) return 80;
    if (cleanInput.includes(cleanTarget)) return 80;

    // 3. Category Match (The "Smart" Part)
    // If input is "Food", it matches any word in the 'food' category
    if (WORDS_IN_CATEGORY(cleanInput, targetCategory)) return 75;

    // 4. Input is a sibling (User types "Dog", Target is "Cat") -> Both are 'animal'
    if (ARE_SIBLINGS(cleanInput, targetWord)) return 60;

    return 0;
};

// Helper: Check if input exists in the target's category list
const WORDS_IN_CATEGORY = (input, category) => {
    const words = CATEGORIES[category];
    if (!words) return false;
    return words.includes(input);
};

// Helper: Check if both words share a category
const ARE_SIBLINGS = (wordA, wordB) => {
    const catsA = WORD_TO_CATEGORIES[wordA] || [];
    const catsB = WORD_TO_CATEGORIES[wordB] || [];
    return catsA.some(c => catsB.includes(c));
};

// Export raw data for debug if needed
export const DICTIONARY = CATEGORIES;
