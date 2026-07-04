/**
 * ============================================================================
 * Tic Tac Toe — Game Engine Module
 * Controls gameplay lifecycle, turn transitions, scorekeeping, and AI triggers.
 * ============================================================================
 */

import { Gameboard } from './board.js';
import { AIController } from './ai.js';
import { SoundManager } from './sound.js';
import { UIController } from './ui.js';

export const GameEngine = {
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
