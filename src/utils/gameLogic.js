/**
 * Determines the winner of a Rock Paper Scissors game
 * @param {string} playerChoice - 'rock', 'paper', or 'scissors'
 * @param {string} botChoice - 'rock', 'paper', or 'scissors'
 * @returns {string} - 'win', 'lose', or 'tie'
 */
export const determineWinner = (playerChoice, botChoice) => {
  if (playerChoice === botChoice) return 'tie';

  const winConditions = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  return winConditions[playerChoice] === botChoice ? 'win' : 'lose';
};

/**
 * Intelligent bot that predicts player's next move based on their history
 * Uses pattern recognition and frequency analysis
 */
export class IntelligentBot {
  constructor() {
    this.moveHistory = [];
    this.patterns = {};
    this.choices = ['rock', 'paper', 'scissors'];
  }

  /**
   * Adds a move to the history
   */
  addMove(move) {
    this.moveHistory.push(move);
    this.updatePatterns();
  }

  /**
   * Updates pattern recognition based on move history
   */
  updatePatterns() {
    if (this.moveHistory.length < 2) return;

    // Analyze last 2-move patterns
    const lastTwo = this.moveHistory.slice(-2).join('-');
    this.patterns[lastTwo] = (this.patterns[lastTwo] || 0) + 1;
  }

  /**
   * Predicts the player's next move with confidence level
   * @returns {{prediction: string, confidence: number}}
   */
  predictNextMove() {
    // Not enough data for prediction
    if (this.moveHistory.length < 2) {
      return {
        prediction: this.choices[Math.floor(Math.random() * 3)],
        confidence: 33,
      };
    }

    // Frequency analysis - what move has the player used most?
    const frequency = this.moveHistory.reduce((acc, move) => {
      acc[move] = (acc[move] || 0) + 1;
      return acc;
    }, {});

    // Pattern-based prediction - look for repeating sequences
    const lastTwo = this.moveHistory.slice(-2).join('-');
    let prediction = null;
    let confidence = 33;

    // Check if we've seen this pattern before
    if (this.patterns[lastTwo] && this.patterns[lastTwo] > 1) {
      // Find what move commonly follows this pattern
      const followingMoves = this.moveHistory
        .map((move, i) => {
          if (i >= 2) {
            const pattern = this.moveHistory.slice(i - 2, i).join('-');
            return pattern === lastTwo ? move : null;
          }
          return null;
        })
        .filter(m => m !== null);

      if (followingMoves.length > 0) {
        const mostCommon = followingMoves.reduce(
          (acc, move) => {
            acc[move] = (acc[move] || 0) + 1;
            return acc;
          },
          {}
        );

        prediction = Object.keys(mostCommon).reduce((a, b) =>
          mostCommon[a] > mostCommon[b] ? a : b
        );
        confidence = Math.min(
          90,
          Math.round((mostCommon[prediction] / followingMoves.length) * 100)
        );
      }
    }

    // Fallback to frequency analysis
    if (!prediction) {
      const mostFrequent = Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
      );
      prediction = mostFrequent;
      confidence = Math.min(
        75,
        Math.round((frequency[mostFrequent] / this.moveHistory.length) * 100)
      );
    }

    // Detect if player is alternating or following a sequence
    if (this.moveHistory.length >= 3) {
      const last3 = this.moveHistory.slice(-3);
      const isAlternating = last3[0] !== last3[1] && last3[1] !== last3[2];
      
      if (isAlternating) {
        // Predict they'll switch again
        const lastMove = this.moveHistory[this.moveHistory.length - 1];
        const secondLast = this.moveHistory[this.moveHistory.length - 2];
        const unusedChoices = this.choices.filter(
          c => c !== lastMove && c !== secondLast
        );
        if (unusedChoices.length > 0) {
          prediction = unusedChoices[0];
          confidence = Math.min(85, confidence + 15);
        }
      }
    }

    return { prediction, confidence };
  }

  /**
   * Gets the bot's choice - counters the predicted player move
   * @returns {string} - 'rock', 'paper', or 'scissors'
   */
  makeMove() {
    const { prediction } = this.predictNextMove();

    // Counter the predicted move
    const counters = {
      rock: 'paper',
      paper: 'scissors',
      scissors: 'rock',
    };

    // Add some randomness (70% counter prediction, 30% random)
    const shouldCounter = Math.random() < 0.7;
    
    if (shouldCounter && prediction) {
      return counters[prediction];
    } else {
      return this.choices[Math.floor(Math.random() * 3)];
    }
  }

  /**
   * Gets the move history
   */
  getHistory() {
    return [...this.moveHistory];
  }

  /**
   * Resets the bot's memory
   */
  reset() {
    this.moveHistory = [];
    this.patterns = {};
  }
}