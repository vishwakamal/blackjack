// ui.js - Handles all UI updates and DOM manipulation

class UI {
  constructor() {
    this.playerCardsEl = document.getElementById('player-cards');
    this.dealerCardsEl = document.getElementById('dealer-cards');
    this.playerScoreEl = document.getElementById('player-score');
    this.dealerScoreEl = document.getElementById('dealer-score');
    this.messageEl = document.getElementById('message');
    this.moneyEl = document.getElementById('money-display');
    this.currentBetEl = document.getElementById('current-bet');
    
    this.bettingControls = document.getElementById('betting-controls');
    this.gameControls = document.getElementById('game-controls');
    this.hitBtn = document.getElementById('hit-btn');
    this.standBtn = document.getElementById('stand-btn');
    this.newRoundBtn = document.getElementById('new-round-btn');
  }

  createCardElement(card, hidden = false) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    
    if (hidden) {
      cardDiv.classList.add('card-back');
      cardDiv.innerHTML = '<div class="card-pattern"></div>';
    } else {
      cardDiv.classList.add(card.isRed ? 'red' : 'black');
      cardDiv.innerHTML = `
        <div class="card-corner top-left">
          <div>${card.value}</div>
          <div>${card.suit}</div>
        </div>
        <div class="card-center">${card.suit}</div>
        <div class="card-corner bottom-right">
          <div>${card.value}</div>
          <div>${card.suit}</div>
        </div>
      `;
    }
    
    return cardDiv;
  }

  displayPlayerHand(hand, score) {
    this.playerCardsEl.innerHTML = '';
    hand.forEach(card => {
      const cardEl = this.createCardElement(card);
      this.playerCardsEl.appendChild(cardEl);
    });
    this.playerScoreEl.textContent = score;
  }

  displayDealerHand(hand, score, hideSecondCard = true) {
    this.dealerCardsEl.innerHTML = '';
    hand.forEach((card, index) => {
      const shouldHide = hideSecondCard && index === 1;
      const cardEl = this.createCardElement(card, shouldHide);
      this.dealerCardsEl.appendChild(cardEl);
    });
    this.dealerScoreEl.textContent = hideSecondCard ? '?' : score;
  }

  revealDealerCard(hand, score) {
    this.displayDealerHand(hand, score, false);
  }

  updateMessage(message) {
    this.messageEl.textContent = message;
  }

  updateMoney(amount) {
    this.moneyEl.textContent = `$${amount}`;
  }

  updateCurrentBet(amount) {
    if (amount > 0) {
      this.currentBetEl.textContent = `Current Bet: $${amount}`;
      this.currentBetEl.style.display = 'block';
    } else {
      this.currentBetEl.style.display = 'none';
    }
  }

  showBettingControls() {
    this.bettingControls.style.display = 'flex';
    this.gameControls.style.display = 'none';
    this.newRoundBtn.style.display = 'none';
  }

  showGameControls() {
    this.bettingControls.style.display = 'none';
    this.gameControls.style.display = 'flex';
    this.newRoundBtn.style.display = 'none';
  }

  showNewRoundButton() {
    this.bettingControls.style.display = 'none';
    this.gameControls.style.display = 'none';
    this.newRoundBtn.style.display = 'block';
  }

  disableGameControls() {
    this.hitBtn.disabled = true;
    this.standBtn.disabled = true;
  }

  enableGameControls() {
    this.hitBtn.disabled = false;
    this.standBtn.disabled = false;
  }

  clearTable() {
    this.playerCardsEl.innerHTML = '';
    this.dealerCardsEl.innerHTML = '';
    this.playerScoreEl.textContent = '0';
    this.dealerScoreEl.textContent = '0';
  }

  showError(message) {
    this.updateMessage(message);
    this.messageEl.classList.add('error');
    setTimeout(() => {
      this.messageEl.classList.remove('error');
    }, 2000);
  }

  highlightResult(result) {
    this.messageEl.classList.remove('win', 'lose', 'push');
    if (result === 'win' || result === 'blackjack') {
      this.messageEl.classList.add('win');
    } else if (result === 'lose') {
      this.messageEl.classList.add('lose');
    } else if (result === 'push') {
      this.messageEl.classList.add('push');
    }
  }
}

export default UI;