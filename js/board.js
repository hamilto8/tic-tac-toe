/**
 * ============================================================================
 * Tic Tac Toe — Gameboard State Module
 * Manages canonical board array, cell mutations, and win condition evaluation.
 * ============================================================================
 */

export const Gameboard = {
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
