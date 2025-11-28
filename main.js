// main.js - Main game logic and control flow

import Deck from './deck.js';
import ScoreCalculator from './score.js';
import UI from './ui.js';

class BlackjackGame {
  constructor() {
    this.deck = new Deck();
    this.ui = new UI();
    
    this.playerHand = [];
    this.dealerHand = [];
    this.playerMoney = 1000;
    this.currentBet = 0;
    this.gameActive = false;
    
    this.initializeGame();
  }

  initializeGame() {
    this.ui.updateMoney(this.playerMoney);
    this.ui.updateMessage('Place your bet to start!');
    this.ui.showBettingControls();
    
    document.querySelectorAll('.bet-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const betAmount = parseInt(e.target.dataset.amount);
        this.placeBet(betAmount);
      });
    });
    
    this.ui.hitBtn.addEventListener('click', () => this.hit());
    this.ui.standBtn.addEventListener('click', () => this.stand());
    this.ui.newRoundBtn.addEventListener('click', () => this.newRound());
  }

  placeBet(amount) {
    if (amount > this.playerMoney) {
      this.ui.showError('Not enough money!');
      return;
    }
    
    this.currentBet = amount;
    this.playerMoney -= amount;
    this.ui.updateMoney(this.playerMoney);
    this.ui.updateCurrentBet(this.currentBet);
    
    this.startNewGame();
  }

  startNewGame() {
    this.gameActive = true;
    this.playerHand = [];
    this.dealerHand = [];
    this.ui.clearTable();
    
    this.playerHand.push(this.deck.dealCard());
    this.dealerHand.push(this.deck.dealCard());
    this.playerHand.push(this.deck.dealCard());
    this.dealerHand.push(this.deck.dealCard());
    
    this.updateDisplay();
    this.ui.showGameControls();
    this.ui.updateMessage('Hit or Stand?');
    
    if (ScoreCalculator.isBlackjack(this.playerHand)) {
      this.ui.updateMessage('Blackjack! Checking dealer...');
      setTimeout(() => this.dealerPlay(), 1000);
    }
  }

  hit() {
    if (!this.gameActive) return;
    
    const newCard = this.deck.dealCard();
    this.playerHand.push(newCard);
    this.updateDisplay();
    
    const playerValue = ScoreCalculator.calculateHandValue(this.playerHand);
    
    if (ScoreCalculator.isBust(this.playerHand)) {
      this.gameActive = false;
      this.ui.disableGameControls();
      this.ui.updateMessage('Bust! You lose.');
      this.ui.revealDealerCard(
        this.dealerHand, 
        ScoreCalculator.calculateHandValue(this.dealerHand)
      );
      setTimeout(() => this.endGame('lose'), 1500);
    } 
    else if (playerValue === 21) {
      this.ui.updateMessage('21! Dealer\'s turn...');
      this.ui.disableGameControls();
      setTimeout(() => this.dealerPlay(), 1000);
    }
  }

  stand() {
    if (!this.gameActive) return;
    
    this.gameActive = false;
    this.ui.disableGameControls();
    this.ui.updateMessage('Dealer\'s turn...');
    
    setTimeout(() => this.dealerPlay(), 1000);
  }

  dealerPlay() {
    this.ui.revealDealerCard(
      this.dealerHand, 
      ScoreCalculator.calculateHandValue(this.dealerHand)
    );
    
    const dealerDrawCard = () => {
      if (ScoreCalculator.shouldDealerHit(this.dealerHand)) {
        setTimeout(() => {
          const newCard = this.deck.dealCard();
          this.dealerHand.push(newCard);
          this.ui.displayDealerHand(
            this.dealerHand, 
            ScoreCalculator.calculateHandValue(this.dealerHand), 
            false
          );
          dealerDrawCard();
        }, 800);
      } else {
        setTimeout(() => this.determineWinner(), 500);
      }
    };
    
    dealerDrawCard();
  }

  determineWinner() {
    const outcome = ScoreCalculator.determineWinner(this.playerHand, this.dealerHand);
    const payout = ScoreCalculator.calculatePayout(this.currentBet, outcome.result);
    
    this.playerMoney += payout;
    this.ui.updateMoney(this.playerMoney);
    this.ui.updateMessage(outcome.message);
    this.ui.highlightResult(outcome.result);
    
    this.endGame(outcome.result);
  }

  endGame(result) {
    this.gameActive = false;
    this.ui.showNewRoundButton();
    
    if (this.playerMoney <= 0) {
      this.ui.updateMessage('Game Over! You\'re out of money.');
      this.ui.newRoundBtn.textContent = 'Reset Game';
    }
  }

  newRound() {
    if (this.playerMoney <= 0) {
      this.playerMoney = 1000;
      this.ui.updateMoney(this.playerMoney);
      this.ui.newRoundBtn.textContent = 'New Round';
    }
    
    this.currentBet = 0;
    this.ui.updateCurrentBet(0);
    this.ui.clearTable();
    this.ui.updateMessage('Place your bet to start!');
    this.ui.showBettingControls();
    this.ui.enableGameControls();
    
    if (this.deck.getRemainingCards() < 15) {
      this.deck.reset();
    }
  }

  updateDisplay() {
    this.ui.displayPlayerHand(
      this.playerHand, 
      ScoreCalculator.calculateHandValue(this.playerHand)
    );
    this.ui.displayDealerHand(
      this.dealerHand, 
      ScoreCalculator.calculateHandValue(this.dealerHand),
      this.gameActive
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new BlackjackGame();
});