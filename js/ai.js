/**
 * ============================================================================
 * Tic Tac Toe — AI Controller Module
 * Implements Minimax with Alpha-Beta pruning and difficulty levels.
 * ============================================================================
 */

import { Gameboard } from './board.js';

export const AIController = {
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
