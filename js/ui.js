/**
 * ============================================================================
 * Tic Tac Toe — UI Controller Module
 * Handles DOM elements, event bindings, board rendering, modals, and toasts.
 * ============================================================================
 */

import { SoundManager } from './sound.js';
import { GameEngine } from './engine.js';

/**
 * Creates a FontAwesome icon element without innerHTML.
 * @param {string} iconClass - Space-separated FA class string, e.g. 'fa-solid fa-trophy'
 * @returns {HTMLElement}
 */
function createIcon(iconClass) {
  const icon = document.createElement('i');
  icon.className = iconClass;
  return icon;
}

export const UIController = {
  elements: {
    setupScreen: document.getElementById('setup-screen'),
    gameScreen: document.getElementById('game-screen'),
    logoBtn: document.getElementById('logo-button'),
    soundToggleBtn: document.getElementById('sound-toggle-btn'),
    
    // Setup elements
    modeBtns: document.querySelectorAll('.mode-btn'),
    diffBtns: document.querySelectorAll('.diff-btn'),
    diffGroup: document.getElementById('difficulty-group'),
    p1NameInput: document.getElementById('player1-name'),
    p2NameInput: document.getElementById('player2-name'),
    p2Label: document.getElementById('player2-label'),
    p2Icon: document.getElementById('player2-icon'),
    p2MarkerPreview: document.getElementById('player2-marker-preview'),
    markerBtns: document.querySelectorAll('.marker-btn'),
    startGameBtn: document.getElementById('start-game-btn'),
    
    // Scoreboard
    p1ScoreCard: document.getElementById('score-card-p1'),
    p2ScoreCard: document.getElementById('score-card-p2'),
    p1NameDisplay: document.getElementById('p1-name-display'),
    p2NameDisplay: document.getElementById('p2-name-display'),
    p1MarkerDisplay: document.getElementById('p1-marker-display'),
    p2MarkerDisplay: document.getElementById('p2-marker-display'),
    p1ScoreNum: document.getElementById('p1-score'),
    p2ScoreNum: document.getElementById('p2-score'),
    tiesScoreNum: document.getElementById('ties-score'),
    
    // Turn indicator & board
    turnIndicator: document.getElementById('turn-indicator'),
    turnText: document.getElementById('turn-text'),
    turnSymbol: document.getElementById('turn-symbol'),
    gameBoard: document.getElementById('game-board'),
    cells: document.querySelectorAll('.cell'),
    resetRoundBtn: document.getElementById('reset-round-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    
    // Modals & Toast
    resultModal: document.getElementById('result-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalSubtitle: document.getElementById('modal-subtitle'),
    modalIcon: document.getElementById('modal-icon'),
    playAgainBtn: document.getElementById('play-again-btn'),
    modalSettingsBtn: document.getElementById('modal-settings-btn'),
    toastContainer: document.getElementById('toast-container')
  },

  init() {
    SoundManager.init();
    this.updateSoundIcon();
    this.bindEvents();
  },

  bindEvents() {
    // Top controls
    this.elements.soundToggleBtn.addEventListener('click', () => {
      const isMuted = SoundManager.toggleMute();
      this.updateSoundIcon();
      if (!isMuted) SoundManager.play('click');
    });

    this.elements.logoBtn.addEventListener('click', () => {
      SoundManager.play('click');
      this.showSetupScreen();
    });

    // Setup Screen Controls
    this.elements.modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        SoundManager.play('click');
        const mode = btn.dataset.mode;
        this.setMode(mode);
      });
    });

    this.elements.diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        SoundManager.play('click');
        this.elements.diffBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      });
    });

    this.elements.markerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        SoundManager.play('click');
        const chosenMarker = btn.dataset.marker;
        this.setPlayerMarker(chosenMarker);
      });
    });

    this.elements.startGameBtn.addEventListener('click', () => {
      SoundManager.play('click');
      this.handleStartGame();
    });

    // Board Clicks (delegated)
    this.elements.gameBoard.addEventListener('click', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      const index = parseInt(cell.dataset.index, 10);
      GameEngine.handleCellClick(index);
    });

    // Board Keyboard Support (delegated)
    this.elements.gameBoard.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const cell = e.target.closest('.cell');
      if (!cell) return;
      e.preventDefault();
      const index = parseInt(cell.dataset.index, 10);
      GameEngine.handleCellClick(index);
    });

    // Footer Actions
    this.elements.resetRoundBtn.addEventListener('click', () => {
      SoundManager.play('click');
      GameEngine.startRound();
    });

    this.elements.newGameBtn.addEventListener('click', () => {
      SoundManager.play('click');
      this.showSetupScreen();
    });

    // Modal Actions
    this.elements.playAgainBtn.addEventListener('click', () => {
      SoundManager.play('click');
      this.elements.resultModal.classList.add('hidden');
      GameEngine.startRound();
    });

    this.elements.modalSettingsBtn.addEventListener('click', () => {
      SoundManager.play('click');
      this.elements.resultModal.classList.add('hidden');
      this.showSetupScreen();
    });
  },

  updateSoundIcon() {
    const icon = this.elements.soundToggleBtn.querySelector('i');
    if (SoundManager.isMuted) {
      icon.className = 'fa-solid fa-volume-xmark';
      this.elements.soundToggleBtn.setAttribute('aria-label', 'Unmute Sound');
    } else {
      icon.className = 'fa-solid fa-volume-high';
      this.elements.soundToggleBtn.setAttribute('aria-label', 'Mute Sound');
    }
  },

  setMode(mode) {
    this.elements.modeBtns.forEach(b => {
      const isActive = b.dataset.mode === mode;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', String(isActive));
    });

    if (mode === 'pvc') {
      this.elements.diffGroup.style.display = 'block';
      this.elements.p2Label.textContent = 'Opponent Name';
      this.elements.p2NameInput.value = 'Computer';
      this.elements.p2NameInput.disabled = true;
      this.elements.p2Icon.className = 'fa-solid fa-robot input-icon';
    } else {
      this.elements.diffGroup.style.display = 'none';
      this.elements.p2Label.textContent = 'Player 2 Name';
      this.elements.p2NameInput.value = '';
      this.elements.p2NameInput.placeholder = 'Player 2';
      this.elements.p2NameInput.disabled = false;
      this.elements.p2Icon.className = 'fa-solid fa-user input-icon';
    }
  },

  setPlayerMarker(marker) {
    this.elements.markerBtns.forEach(b => {
      const isActive = b.dataset.marker === marker;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', String(isActive));
    });

    const oppMarker = marker === 'X' ? 'O' : 'X';
    this.elements.p2MarkerPreview.textContent = oppMarker;
    this.elements.p2MarkerPreview.className = `marker-badge marker-${oppMarker.toLowerCase()}`;
  },

  handleStartGame() {
    const activeModeBtn = document.querySelector('.mode-btn.active');
    const activeDiffBtn = document.querySelector('.diff-btn.active');
    const activeMarkerBtn = document.querySelector('.marker-btn.active');

    const config = {
      mode: activeModeBtn ? activeModeBtn.dataset.mode : 'pvc',
      difficulty: activeDiffBtn ? activeDiffBtn.dataset.diff : 'medium',
      p1Name: this.elements.p1NameInput.value,
      p2Name: this.elements.p2NameInput.value,
      p1Marker: activeMarkerBtn ? activeMarkerBtn.dataset.marker : 'X'
    };

    GameEngine.initGame(config);
    this.showGameScreen();
  },

  showSetupScreen() {
    GameEngine.stopGame();

    this.elements.gameScreen.classList.remove('active');
    this.elements.gameScreen.classList.add('hidden');
    this.elements.resultModal.classList.add('hidden');
    
    this.elements.setupScreen.classList.remove('hidden');
    this.elements.setupScreen.classList.add('active');
  },

  showGameScreen() {
    this.elements.setupScreen.classList.remove('active');
    this.elements.setupScreen.classList.add('hidden');
    
    this.elements.gameScreen.classList.remove('hidden');
    this.elements.gameScreen.classList.add('active');
  },

  renderBoard() {
    this.elements.cells.forEach((cell, idx) => {
      cell.textContent = '';
      cell.className = 'cell';
      cell.removeAttribute('disabled');
      cell.setAttribute('aria-label', `Cell ${idx}, empty`);
      
      // Set hover preview class
      const currentMarker = GameEngine.getCurrentPlayer().marker.toLowerCase();
      cell.classList.add(`preview-${currentMarker}`);
    });
    this.setBoardDisabled(false);
  },

  renderCell(index, marker) {
    const cell = this.elements.cells[index];
    if (!cell) return;

    const markerLower = marker.toLowerCase();
    cell.textContent = marker;
    cell.classList.add(`marked-${markerLower}`, 'taken');
    cell.classList.remove('preview-x', 'preview-o');
    cell.setAttribute('aria-label', `Cell ${index}, marked ${marker}`);
  },

  setBoardDisabled(disabled) {
    this.elements.cells.forEach(cell => {
      if (disabled || cell.classList.contains('taken')) {
        cell.classList.add('disabled');
      } else {
        cell.classList.remove('disabled');
      }
    });
  },

  highlightWinningCells(combo) {
    if (!combo) return;
    combo.forEach(idx => {
      if (this.elements.cells[idx]) {
        this.elements.cells[idx].classList.add('winning-cell');
      }
    });
  },

  updateScoreboard(state) {
    // Secure textContent to prevent XSS
    this.elements.p1NameDisplay.textContent = state.player1.name;
    this.elements.p2NameDisplay.textContent = state.player2.name;
    
    this.elements.p1MarkerDisplay.textContent = state.player1.marker;
    this.elements.p1MarkerDisplay.className = `symbol-badge marker-${state.player1.marker.toLowerCase()}`;
    
    this.elements.p2MarkerDisplay.textContent = state.player2.marker;
    this.elements.p2MarkerDisplay.className = `symbol-badge marker-${state.player2.marker.toLowerCase()}`;
    
    this.elements.p1ScoreNum.textContent = state.player1.score;
    this.elements.p2ScoreNum.textContent = state.player2.score;
    this.elements.tiesScoreNum.textContent = state.ties;
  },

  updateTurnIndicator(currentPlayer) {
    // Update turn indicator text & badge
    this.elements.turnText.textContent = `${currentPlayer.name}'s Turn`;
    const markerLower = currentPlayer.marker.toLowerCase();
    this.elements.turnSymbol.textContent = currentPlayer.marker;
    this.elements.turnSymbol.className = `symbol-badge marker-${markerLower}`;

    // Update active card highlight
    const isP1Turn = GameEngine.state.currentTurn === 1;
    this.elements.p1ScoreCard.classList.toggle('active-turn', isP1Turn);
    this.elements.p2ScoreCard.classList.toggle('active-turn', !isP1Turn);

    // Update empty cell hover previews
    this.elements.cells.forEach(cell => {
      if (!cell.classList.contains('taken')) {
        cell.classList.remove('preview-x', 'preview-o');
        cell.classList.add(`preview-${markerLower}`);
      }
    });
  },

  showResultModal({ type, winnerName, winnerMarker, isAiWin }) {
    // Clear previous icon content (safe: no innerHTML)
    const iconWrapper = this.elements.modalIcon;
    iconWrapper.className = 'modal-icon-wrapper';
    iconWrapper.textContent = '';
    
    if (type === 'win') {
      const markerLower = winnerMarker.toLowerCase();
      iconWrapper.classList.add(`win-${markerLower}`);
      
      if (isAiWin) {
        iconWrapper.appendChild(createIcon('fa-solid fa-robot'));
        this.elements.modalTitle.textContent = `${winnerName} Wins!`;
        this.elements.modalSubtitle.textContent = 'The computer outsmarted you this time! Ready for a rematch?';
      } else {
        iconWrapper.appendChild(createIcon('fa-solid fa-trophy'));
        this.elements.modalTitle.textContent = `${winnerName} Wins!`;
        this.elements.modalSubtitle.textContent = 'Congratulations on the victory! Play another round to defend your title.';
      }
    } else {
      // Tie
      iconWrapper.appendChild(createIcon('fa-solid fa-handshake'));
      this.elements.modalTitle.textContent = "It's a Tie!";
      this.elements.modalSubtitle.textContent = 'A well-fought battle between evenly matched opponents!';
    }

    this.elements.resultModal.classList.remove('hidden');
  },

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';

    const icon = createIcon('fa-solid fa-circle-exclamation');
    const span = document.createElement('span');
    span.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(span);
    
    this.elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.9)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};
