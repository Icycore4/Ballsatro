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
let rerollsLeft = 6;
let scoreMultiplier = 1.0;
let money = 0;
let deck = [];
let cardsLeft = 52;
let selectedCardIndex = -1;
let showHandValues = false;
let roundNumber = 1;

let shopItems = [
  { name: "Buy 3 Rerolls", cost: 500, action: () => { rerollsLeft += 3; } },
  { name: "Increase Max Hands", cost: 800, action: () => { maxHands++; } },
  { name: "Boost Score Multiplier", cost: 1000, action: () => { scoreMultiplier += 0.5; } }
];

function setup() {
  let canvas = createCanvas(1000, 600);
  canvas.parent('game-canvas');
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

// Top Buttons Logic
function startNewGame() {
  score = 0;
  hand = [];
  handsPlayed = 0;
  handEvaluated = false;
  lastHandResult = '';
  lastHandPoints = 0;
  gamePhase = 'playing';
  win = false;
  cardsLeft = 52;
  deck = createDeck();
  shuffleDeck(deck);
  targetScore = 500;
  rerollsLeft = 6;
  scoreMultiplier = 1.0;
  roundNumber = 1;
  money = 0;
}

function restartGame() {
  startNewRound();
}

function showRules() {
  alert(
    `Rules:\n
- Draw 5 cards to form hands.\n
- Score based on poker hands (Flush, Straight, Pairs, etc.).\n
- Reach the target score to move to the shop.\n
- Beat 5 rounds to win the game!\n
- You can reroll individual cards using "W" key.\n
- You earn money after each round to spend in the shop!`
  );
}

// Other core game logic (unchanged from before)
// (drawGame, mousePressed, keyPressed, evaluateHand, etc.)

// [Paste the rest of your original drawGame(), mousePressed(), keyPressed(), etc. here without changing]
// (I can paste them here again fully clean if you want.)
