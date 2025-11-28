// score.js - Handles scoring and hand value calculations

class ScoreCalculator {
  static calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
      if (card.value === 'A') {
        aces += 1;
        value += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    return value;
  }

  static isBlackjack(hand) {
    return hand.length === 2 && this.calculateHandValue(hand) === 21;
  }

  static isBust(hand) {
    return this.calculateHandValue(hand) > 21;
  }

  static shouldDealerHit(hand) {
    const value = this.calculateHandValue(hand);
    return value < 17;
  }

  static determineWinner(playerHand, dealerHand) {
    const playerValue = this.calculateHandValue(playerHand);
    const dealerValue = this.calculateHandValue(dealerHand);
    const playerBlackjack = this.isBlackjack(playerHand);
    const dealerBlackjack = this.isBlackjack(dealerHand);

    // Check for busts
    if (this.isBust(playerHand)) {
      return { result: 'lose', message: 'Bust! You lose.' };
    }
    if (this.isBust(dealerHand)) {
      return { result: 'win', message: 'Dealer busts! You win!' };
    }

    // Check for blackjacks
    if (playerBlackjack && !dealerBlackjack) {
      return { result: 'blackjack', message: 'Blackjack! You win!' };
    }
    if (dealerBlackjack && !playerBlackjack) {
      return { result: 'lose', message: 'Dealer has Blackjack!' };
    }
    if (playerBlackjack && dealerBlackjack) {
      return { result: 'push', message: 'Both Blackjack! Push.' };
    }

    // Compare
    if (playerValue > dealerValue) {
      return { result: 'win', message: 'You win!' };
    } else if (playerValue < dealerValue) {
      return { result: 'lose', message: 'Dealer wins!' };
    } else {
      return { result: 'push', message: 'Push! It\'s a tie.' };
    }
  }

  static calculatePayout(bet, result) {
    switch(result) {
      case 'blackjack':
        return bet * 2.5;
      case 'win':
        return bet * 2;
      case 'push':
        return bet;
      case 'lose':
      default:
        return 0;
    }
  }
}

export default ScoreCalculator;