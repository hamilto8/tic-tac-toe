/**
 * ============================================================================
 * Tic Tac Toe — Modern Edition (Engine & UI Controller)
 * Follows modular architecture, secure coding practices, and unbeatable AI logic.
 * ============================================================================
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. SOUND MANAGER
     ========================================================================== */
  const SoundManager = {
    sounds: {
      click: new Audio('./sound/bassDrum.mp3'),
      moveX: new Audio('./sound/light-beep.mp3'),
      moveO: new Audio('./sound/low-beep.mp3'),
      win: new Audio('./sound/success.mp3'),
      lose: new Audio('./sound/failure.mp3'),
      tie: new Audio('./sound/alert.mp3'),
      error: new Audio('./sound/wrong.mp3'),
    },
    isMuted: false,

    init() {
      // Load mute setting from localStorage if available
      try {
        const savedMute = localStorage.getItem('ttt_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === 'true';
        }
      } catch (e) {
        console.warn('localStorage access denied or unavailable:', e);
      }
    },

    play(soundName) {
      if (this.isMuted || !this.sounds[soundName]) return;
      
      try {
        const audio = this.sounds[soundName];
        audio.currentTime = 0;
        audio.play().catch(err => {
          // Browser autoplay policy might block audio before first user interaction
          console.debug('Audio play blocked by browser policy:', err);
        });
      } catch (e) {
        console.error('Error playing sound:', e);
      }
    },

    toggleMute() {
      this.isMuted = !this.isMuted;
      try {
        localStorage.setItem('ttt_muted', String(this.isMuted));
      } catch (e) {
        // Ignore localStorage error
      }
      return this.isMuted;
    }
  };

  /* ==========================================================================
     2. GAMEBOARD STATE
     ========================================================================== */
  const Gameboard = {
    board: Array(9).fill(null),
    winningCombos: Object.freeze([
      Object.freeze([0, 1, 2]), Object.freeze([3, 4, 5]), Object.freeze([6, 7, 8]), // Rows
      Object.freeze([0, 3, 6]), Object.freeze([1, 4, 7]), Object.freeze([2, 5, 8]), // Columns
      Object.freeze([0, 4, 8]), Object.freeze([2, 4, 6])                            // Diagonals
    ]),

    reset() {
      this.board = Array(9).fill(null);
    },

    setCell(index, marker) {
      if (index < 0 || index > 8 || this.board[index] !== null) {
        return false;
      }
      this.board[index] = marker;
      return true;
    },

    getCell(index) {
      return this.board[index];
    },

    getEmptyIndices(customBoard = this.board) {
      const empty = [];
      for (let i = 0; i < customBoard.length; i++) {
        if (customBoard[i] === null) empty.push(i);
      }
      return empty;
    },

    isFull(customBoard = this.board) {
      return !customBoard.includes(null);
    },

    /**
     * Checks if a given board state has a winner.
     * @param {Array} customBoard - The 9-element board array to evaluate.
     * @returns {Object|null} - { winner: 'X'|'O', combo: [indices] } or null.
     */
    checkWin(customBoard = this.board) {
      for (const combo of this.winningCombos) {
        const [a, b, c] = combo;
        if (
          customBoard[a] !== null &&
          customBoard[a] === customBoard[b] &&
          customBoard[a] === customBoard[c]
        ) {
          return { winner: customBoard[a], combo };
        }
      }
      return null;
    }
  };

  /* ==========================================================================
     3. AI CONTROLLER (Minimax Algorithm & Difficulties)
     ========================================================================== */
  const AIController = {
    /**
     * Determines the AI's move based on selected difficulty.
     * Operates on a defensive copy of the board to avoid mutating game state.
     * @param {Array} board - Current board array (will NOT be mutated).
     * @param {string} aiMarker - AI's symbol ('X' or 'O').
     * @param {string} humanMarker - Human's symbol ('X' or 'O').
     * @param {string} difficulty - 'easy', 'medium', or 'hard'.
     * @returns {number} - The chosen cell index (0-8), or -1 if board is full.
     */
    getMove(board, aiMarker, humanMarker, difficulty) {
      const boardCopy = [...board];
      const emptyIndices = Gameboard.getEmptyIndices(boardCopy);
      if (emptyIndices.length === 0) return -1;

      if (difficulty === 'easy') {
        return this._getEasyMove(emptyIndices);
      } else if (difficulty === 'medium') {
        return this._getMediumMove(boardCopy, emptyIndices, aiMarker, humanMarker);
      } else {
        return this._getHardMove(boardCopy, aiMarker, humanMarker);
      }
    },

    _getEasyMove(emptyIndices) {
      const randomIndex = Math.floor(Math.random() * emptyIndices.length);
      return emptyIndices[randomIndex];
    },

    _getMediumMove(board, emptyIndices, aiMarker, humanMarker) {
      // 1. Check if AI can win in 1 move
      for (const idx of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[idx] = aiMarker;
        if (Gameboard.checkWin(boardCopy)) return idx;
      }

      // 2. Check if Human can win in 1 move -> Block them
      for (const idx of emptyIndices) {
        const boardCopy = [...board];
        boardCopy[idx] = humanMarker;
        if (Gameboard.checkWin(boardCopy)) return idx;
      }

      // 3. Take center if available
      if (board[4] === null) return 4;

      // 4. Otherwise, random move from remaining empty cells
      return this._getEasyMove(emptyIndices);
    },

    _getHardMove(board, aiMarker, humanMarker) {
      // Unbeatable Minimax Algorithm (operates on a copy — safe to mutate)
      const bestMove = this._minimax(board, 0, true, -Infinity, Infinity, aiMarker, humanMarker);
      return bestMove.index;
    },

    /**
     * Recursive Minimax with Alpha-Beta Pruning.
     * Mutates the passed board array in-place during recursion (caller must
     * pass a defensive copy so the canonical Gameboard.board is never touched).
     */
    _minimax(board, depth, isMaximizing, alpha, beta, aiMarker, humanMarker) {
      const winResult = Gameboard.checkWin(board);
      if (winResult !== null) {
        // If AI wins, return high score minus depth (prefer faster wins)
        // If Human wins, return low score plus depth (delay losses)
        return winResult.winner === aiMarker
          ? { score: 100 - depth }
          : { score: depth - 100 };
      }

      const emptyIndices = Gameboard.getEmptyIndices(board);
      if (emptyIndices.length === 0) {
        return { score: 0 }; // Tie
      }

      if (isMaximizing) {
        let maxScore = -Infinity;
        let bestIndex = emptyIndices[0];

        for (const idx of emptyIndices) {
          board[idx] = aiMarker;
          const result = this._minimax(board, depth + 1, false, alpha, beta, aiMarker, humanMarker);
          board[idx] = null; // Backtrack

          if (result.score > maxScore) {
            maxScore = result.score;
            bestIndex = idx;
          }
          alpha = Math.max(alpha, maxScore);
          if (beta <= alpha) break; // Prune branch
        }
        return { score: maxScore, index: bestIndex };
      } else {
        let minScore = Infinity;
        let bestIndex = emptyIndices[0];

        for (const idx of emptyIndices) {
          board[idx] = humanMarker;
          const result = this._minimax(board, depth + 1, true, alpha, beta, aiMarker, humanMarker);
          board[idx] = null; // Backtrack

          if (result.score < minScore) {
            minScore = result.score;
            bestIndex = idx;
          }
          beta = Math.min(beta, minScore);
          if (beta <= alpha) break; // Prune branch
        }
        return { score: minScore, index: bestIndex };
      }
    }
  };

  /* ==========================================================================
     4. GAME ENGINE / CONTROLLER
     ========================================================================== */
  const GameEngine = {
    state: {
      mode: 'pvc',            // 'pvc' | 'pvp'
      difficulty: 'medium',   // 'easy' | 'medium' | 'hard'
      player1: { name: 'Player 1', marker: 'X', score: 0 },
      player2: { name: 'Computer', marker: 'O', score: 0, isAi: true },
      ties: 0,
      currentTurn: 1,         // 1 for Player 1, 2 for Player 2 / AI
      isPlaying: false,
      isAiThinking: false
    },

    /** @type {number|null} Active AI timeout ID, used to cancel on navigation */
    _aiTimeoutId: null,

    initGame(config) {
      this._clearAiTimeout();
      this.state.mode = config.mode;
      this.state.difficulty = config.difficulty;
      
      // Sanitize names and set defaults
      const p1Name = (config.p1Name || 'Player 1').trim() || 'Player 1';
      const p2Default = config.mode === 'pvc' ? 'Computer' : 'Player 2';
      const p2Name = (config.p2Name || p2Default).trim() || p2Default;
      
      this.state.player1 = {
        name: p1Name,
        marker: config.p1Marker,
        score: 0
      };

      this.state.player2 = {
        name: p2Name,
        marker: config.p1Marker === 'X' ? 'O' : 'X',
        score: 0,
        isAi: config.mode === 'pvc'
      };

      this.state.ties = 0;
      this.startRound();
    },

    startRound() {
      this._clearAiTimeout();
      Gameboard.reset();
      this.state.isPlaying = true;
      this.state.isAiThinking = false;
      
      // X always goes first in standard Tic Tac Toe
      this.state.currentTurn = this.state.player1.marker === 'X' ? 1 : 2;
      
      UIController.renderBoard();
      UIController.updateScoreboard(this.state);
      UIController.updateTurnIndicator(this.getCurrentPlayer());

      // If AI is player 2 and has 'X', AI moves first!
      if (this.state.currentTurn === 2 && this.state.player2.isAi) {
        this.triggerAiTurn();
      }
    },

    /**
     * Cancels any pending AI timeout to prevent stale callbacks
     * firing after the user navigates away from the game screen.
     */
    _clearAiTimeout() {
      if (this._aiTimeoutId !== null) {
        clearTimeout(this._aiTimeoutId);
        this._aiTimeoutId = null;
      }
    },

    getCurrentPlayer() {
      return this.state.currentTurn === 1 ? this.state.player1 : this.state.player2;
    },

    handleCellClick(index) {
      if (!this.state.isPlaying || this.state.isAiThinking) return;

      // In PvC mode, only allow clicks when it's the human's turn
      if (this.state.player2.isAi && this.state.currentTurn === 2) return;

      const cellContent = Gameboard.getCell(index);
      if (cellContent !== null) {
        SoundManager.play('error');
        UIController.showToast('That square is already taken!');
        return;
      }

      const currentPlayer = this.getCurrentPlayer();
      this.executeMove(index, currentPlayer);
    },

    executeMove(index, player) {
      Gameboard.setCell(index, player.marker);
      
      // Play sound
      SoundManager.play(player.marker === 'X' ? 'moveX' : 'moveO');
      
      // Update DOM
      UIController.renderCell(index, player.marker);

      // Check win or tie
      const winResult = Gameboard.checkWin();
      if (winResult !== null) {
        this.handleGameOver(winResult);
        return;
      }

      if (Gameboard.isFull()) {
        this.handleGameOver(null); // Tie
        return;
      }

      // Switch turn
      this.state.currentTurn = this.state.currentTurn === 1 ? 2 : 1;
      UIController.updateTurnIndicator(this.getCurrentPlayer());

      // If next turn is AI, trigger AI move
      if (this.state.currentTurn === 2 && this.state.player2.isAi) {
        this.triggerAiTurn();
      }
    },

    triggerAiTurn() {
      this.state.isAiThinking = true;
      UIController.setBoardDisabled(true);

      // Add a slight natural delay for AI thinking
      this._aiTimeoutId = setTimeout(() => {
        this._aiTimeoutId = null;

        if (!this.state.isPlaying) return;

        const aiMove = AIController.getMove(
          Gameboard.board,
          this.state.player2.marker,
          this.state.player1.marker,
          this.state.difficulty
        );

        this.state.isAiThinking = false;
        UIController.setBoardDisabled(false);

        if (aiMove !== -1) {
          this.executeMove(aiMove, this.state.player2);
        }
      }, 500);
    },

    handleGameOver(winResult) {
      this._clearAiTimeout();
      this.state.isPlaying = false;
      this.state.isAiThinking = false;
      UIController.setBoardDisabled(true);

      if (winResult !== null) {
        // We have a winner
        const isPlayer1Win = winResult.winner === this.state.player1.marker;
        const winner = isPlayer1Win ? this.state.player1 : this.state.player2;
        
        winner.score += 1;
        
        // Play appropriate win/lose sound
        if (this.state.mode === 'pvc') {
          SoundManager.play(isPlayer1Win ? 'win' : 'lose');
        } else {
          SoundManager.play('win');
        }

        UIController.highlightWinningCells(winResult.combo);
        UIController.updateScoreboard(this.state);
        
        setTimeout(() => {
          UIController.showResultModal({
            type: 'win',
            winnerName: winner.name,
            winnerMarker: winner.marker,
            isAiWin: winner.isAi
          });
        }, 650);
      } else {
        // Tie Game
        this.state.ties += 1;
        SoundManager.play('tie');
        UIController.updateScoreboard(this.state);
        
        setTimeout(() => {
          UIController.showResultModal({ type: 'tie' });
        }, 500);
      }
    },

    /** Called by UIController when navigating away from the game screen */
    stopGame() {
      this._clearAiTimeout();
      this.state.isPlaying = false;
      this.state.isAiThinking = false;
    }
  };

  /* ==========================================================================
     5. UI CONTROLLER (DOM Manipulation & Events)
     ========================================================================== */

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

  const UIController = {
    elements: {
      setupScreen: document.getElementById('setup-screen'),
      gameScreen: document.getElementById('game-screen'),
      logoBtn: document.getElementById('logo-button'),
      soundToggleBtn: document.getElementById('sound-toggle-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      
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

      this.elements.settingsBtn.addEventListener('click', () => {
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
      
      this.elements.settingsBtn.classList.add('hidden');
    },

    showGameScreen() {
      this.elements.setupScreen.classList.remove('active');
      this.elements.setupScreen.classList.add('hidden');
      
      this.elements.gameScreen.classList.remove('hidden');
      this.elements.gameScreen.classList.add('active');
      
      this.elements.settingsBtn.classList.remove('hidden');
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

  /* ==========================================================================
     6. INITIALIZE APPLICATION ON DOM READY
     ========================================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIController.init());
  } else {
    UIController.init();
  }

})();