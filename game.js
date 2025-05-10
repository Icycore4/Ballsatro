let hand = [];
let suits = ['hearts', 'diamonds', 'clubs', 'spades'];
let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
let suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠'
};

let score = 0;
let targetScore = 500;
let lastHandResult = '';
let lastHandPoints = 0;
let handEvaluated = false;
let handsPlayed = 0;
let maxHands = 6;
let gamePhase = 'playing';
let win = false;
let rerollsLeft = 10;
let scoreMultiplier = 1.0;
let money = 0;

let deck = [];
let cardsLeft = 52;
let selectedCardIndex = -1;
let showHandValues = false;
let roundNumber = 1;

let shopItems = [
  {
    name: "Buy 3 Rerolls",
    cost: 500,
    action: () => { rerollsLeft += 3; },
  },
  {
    name: "Increase Max Hands",
    cost: 800,
    action: () => { maxHands++; },
  },
  {
    name: "Boost Score Multiplier",
    cost: 1000,
    action: () => { scoreMultiplier += 0.5; },
  }
];

function setup() {
  createCanvas(1000, 600);
  startNewGame();
}

function draw() {
  background(30, 120, 70);

  if (gamePhase === 'playing') {
    drawGame();
  } else if (gamePhase === 'shop') {
    drawShop();
  } else if (gamePhase === 'gameover') {
    drawGameOver();
  }
}

function drawGame() {
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Target Score: ${targetScore}`, 20, 30);
  text(`Current Score: ${score}`, 20, 60);
  text(`Hands Played: ${handsPlayed}/${maxHands}`, 20, 90);
  text(`Rerolls Left: ${rerollsLeft}`, 20, 120);
  text(`Money: $${money}`, width - 200, height - 570);

  for (let i = 0; i < hand.length; i++) {
    if (i === selectedCardIndex) {
      strokeWeight(4);
      stroke('yellow');
    } else {
      strokeWeight(1);
      stroke(0);
    }
    drawCard(hand[i], 80 + i * 180, 150);
  }

  if (lastHandResult) {
    textSize(28);
    fill(255);
    textAlign(LEFT, TOP);
    text(lastHandResult, 20, height - 80);
    text(`+${lastHandPoints} points`, 20, height - 50);
  }

  drawScoreButton();
  drawShowValuesButton();

  if (showHandValues) {
    drawHandValuesPopup();
  }
}

function drawShop() {
  background(30);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(36);
  text('SHOP', width / 2, 40);

  textSize(24);
  text(`Money: $${money}`, width / 2, 100);

  let startY = 180;
  let buttonWidth = 300;
  let buttonHeight = 60;
  let spacing = 100;

  for (let i = 0; i < shopItems.length; i++) {
    let x = width / 2 - buttonWidth / 2;
    let y = startY + i * spacing;

    let hovered = mouseX > x && mouseX < x + buttonWidth && mouseY > y && mouseY < y + buttonHeight;
    let canAfford = money >= shopItems[i].cost;

    fill(hovered ? (canAfford ? '#88cc88' : '#cc8888') : (canAfford ? '#55aa55' : '#aa5555'));
    rect(x, y, buttonWidth, buttonHeight, 15);

    fill(255);
    textAlign(CENTER, CENTER);
    text(`${shopItems[i].name} - $${shopItems[i].cost}`, width / 2, y + buttonHeight / 2);
  }

  let continueY = startY + shopItems.length * spacing;
  fill(mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > continueY && mouseY < continueY + 50 ? '#8888cc' : '#5555aa');
  rect(width / 2 - 100, continueY, 200, 50, 10);

  fill(255);
  textSize(24);
  text('Continue', width / 2, continueY + 25);
}

function drawGameOver() {
  background(20, 20, 20, 220);
  textAlign(CENTER, CENTER);
  textSize(48);
  fill(win ? 'gold' : 'red');
  text(win ? 'YOU WIN!' : 'YOU LOSE!', width / 2, height / 2 - 100);

  textSize(24);
  fill(255);
  text(`Final Score: ${score}`, width / 2, height / 2);
  text(`Total Money: $${money}`, width / 2, height / 2 + 40);
  text('Click to Restart', width / 2, height / 2 + 80);
}

function mousePressed() {
  if (gamePhase === 'gameover') {
    startNewGame();
    loop();
    return;
  }

  if (gamePhase === 'shop') {
    let startY = 180;
    let buttonWidth = 300;
    let buttonHeight = 60;
    let spacing = 100;

    for (let i = 0; i < shopItems.length; i++) {
      let x = width / 2 - buttonWidth / 2;
      let y = startY + i * spacing;
      if (mouseX > x && mouseX < x + buttonWidth && mouseY > y && mouseY < y + buttonHeight) {
        if (money >= shopItems[i].cost) {
          money -= shopItems[i].cost;
          shopItems[i].action();
        }
      }
    }

    let continueY = startY + shopItems.length * spacing;
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > continueY && mouseY < continueY + 50) {
      startNewRound();
    }
    return;
  }

  if (gamePhase === 'playing') {
    if (mouseY > height - 50 && mouseY < height - 20) {
      if (mouseX > 20 && mouseX < 220) {
        scoreHand();
        return;
      }
      if (mouseX > width - 220 && mouseX < width - 20) {
        showHandValues = !showHandValues;
        return;
      }
    }

    if (hand.length < 5 && cardsLeft > 0) {
      hand.push(drawCardFromDeck());
    }
  }
}

function keyPressed() {
  if (gamePhase === 'playing') {
    if (key >= '1' && key <= '5') {
      let idx = int(key) - 1;
      if (idx < hand.length) {
        selectedCardIndex = idx;
      }
    }

    if (key === 'W' || key === 'w') {
      if (selectedCardIndex !== -1 && rerollsLeft > 0) {
        hand[selectedCardIndex] = drawCardFromDeck();
        rerollsLeft--;
        selectedCardIndex = -1; 
      }
    }
  }

  if (key === 'Enter' && gamePhase === 'gameover') {
    startNewGame();
    loop();
  }
}

// Draw the hand of cards
function drawCard(card, x, y) {
  let cardWidth = 100;
  let cardHeight = 150;
  fill(255);
  rect(x, y, cardWidth, cardHeight, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(card.rank, x + cardWidth / 2, y + cardHeight / 3);
  text(suitSymbols[card.suit], x + cardWidth / 2, y + 2 * cardHeight / 3);
}

// Helper functions
function startNewGame() {
  hand = [];
  score = 0;
  lastHandResult = '';
  handsPlayed = 0;
  money = 0;
  maxHands = 6;
  targetScore = 500;
  gamePhase = 'playing';
  deck = [];
  cardsLeft = 52;
  rerollsLeft = 10;
  selectedCardIndex = -1;
  showHandValues = false;
  generateDeck();
  shuffle(deck, true);
}

function generateDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ rank, suit });
    }
  }
}

function startNewRound() {
  handsPlayed++;
  if (handsPlayed >= maxHands) {
    gamePhase = 'gameover';
    win = score >= targetScore;
    noLoop();
  } else {
    hand = [];
    rerollsLeft = 10;
    selectedCardIndex = -1;
    drawCardsForHand();
    gamePhase = 'playing';
  }
}

function drawCardsForHand() {
  for (let i = 0; i < 5; i++) {
    hand.push(drawCardFromDeck());
  }
}

function drawCardFromDeck() {
  cardsLeft--;
  return deck.pop();
}

function scoreHand() {
  if (handEvaluated) return;

  lastHandResult = `Hand ${roundNumber} - `;
  lastHandPoints = evaluateHand(hand);
  score += lastHandPoints;

  if (score >= targetScore) {
    targetScore *= 1.5;
    handsPlayed = 0;
    gamePhase = 'shop';
    lastHandResult += `You've hit the target score!`;
  } else {
    lastHandResult += `Hand score: +${lastHandPoints}`;
  }

  roundNumber++;
  handEvaluated = true;
}

function evaluateHand(hand) {
  // Simplified evaluation logic for now (you can expand it with a more complex algorithm)
  let points = Math.floor(Math.random() * 100) + 10;
  return points;
}
