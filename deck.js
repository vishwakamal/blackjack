// deck.js - Handles deck creation and card management

class Deck {
  constructor() {
    this.cards = [];
    this.reset();
  }

  reset() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    this.cards = [];
    
    for (let suit of suits) {
      for (let value of values) {
        this.cards.push({
          suit: suit,
          value: value,
          isRed: suit === '♥' || suit === '♦'
        });
      }
    }
    
    this.shuffle();
  }

  // Shuffle the deck using Fisher-Yates algorithm
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  dealCard() {
    if (this.cards.length === 0) {
      this.reset();
    }
    return this.cards.pop();
  }

  getRemainingCards() {
    return this.cards.length;
  }
}

export default Deck;