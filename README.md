# 🎮 Modern Tic Tac Toe — The Gentleman's Game

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

A state-of-the-art, feature-complete web implementation of **Tic Tac Toe** originally inspired by [The Odin Project](https://www.theodinproject.com/). Refactored with a sleek dark glassmorphic design system, interactive audio cues, modular architecture, and an **unbeatable Minimax AI**.

---

## ✨ Features

- **🤖 Three AI Difficulties (Player vs Computer)**
  - **Easy**: Casual random play for a relaxed game.
  - **Medium**: Smart AI that prioritizes winning moves and blocks immediate player threats.
  - **Unbeatable (Minimax)**: Powered by the recursive Minimax algorithm with alpha-beta pruning. It evaluates every possible future game state to guarantee a win or force a tie!
- **👥 Player vs Player Mode**
  - Pass-and-play local multiplayer with customizable player names and symbol selection (X or O).
- **🎨 State-of-the-Art Glassmorphic UI**
  - Rich midnight dark theme (`#090d16`) styled with backdrop blur panels, neon gradients, and dynamic floating background glow orbs.
  - Smooth micro-animations for cell marking, turn indicators, winning line highlights, and celebratory end-game modals.
- **🔊 Audio Effects & Sound Management**
  - Custom audio feedback for marker placements, winning matches, defeat, tie games, and invalid moves.
  - Convenient mute/unmute toggle in the header that persists audio preferences across sessions via `localStorage`.
- **📊 Real-Time Score Tracking**
  - Interactive top scoreboard keeping count of Player 1 victories, Opponent/AI victories, and Tie games across consecutive rounds.
- **🛡️ Secure & Accurate Game Logic**
  - Strict input sanitation and text rendering (`textContent`) to prevent Cross-Site Scripting (XSS).
  - Robust validation preventing illegal moves, square hijacking, or clicks while the AI is computing.
- **📱 Responsive & Accessible**
  - Seamlessly scales across desktop, tablet, and mobile screens.
  - Implements WAI-ARIA attributes, semantic HTML5 tags, keyboard navigation, and respects `@media (prefers-reduced-motion: reduce)`.

---

## 🕹️ How to Play

1. **Setup Your Game**:
   - Choose between **Player vs Computer** or **Player vs Player**.
   - If playing against the computer, select your desired **AI Difficulty** (*Easy*, *Medium*, or *Unbeatable*).
   - Enter your name(s) and select your preferred symbol (**X** or **O**).
2. **Start the Match**:
   - Click **Start Game**. Player X always takes the first turn.
   - Click any empty square on the 3x3 grid to place your marker.
3. **Winning the Game**:
   - The first player to align **3 of their symbols** horizontally, vertically, or diagonally wins the round!
   - If all 9 squares are filled without a winning alignment, the round ends in a **Tie**.

---

## 🚀 Getting Started

No installation or build step is required! This application runs natively in any modern web browser.

### 1. Clone the Repository
```bash
git clone https://github.com/hamilto8/tic-tac-toe.git
cd tic-tac-toe
```

### 2. Launch the Application
- Simply double-click `index.html` to open it in your default web browser.
- Or, if you use VS Code, install the **Live Server** extension and right-click `index.html` -> **Open with Live Server**.
- Alternatively, start a local development server using Node.js:
  ```bash
  npx serve .
  ```

---

## 🏗️ Technical Architecture & Clean Code

The codebase is engineered following strict modularity and separation of concerns without relying on external frameworks:

```
├── index.html     # Semantic markup, accessibility roles, UI containers & modals
├── style.css      # Design tokens, glassmorphism utilities, animations & media queries
├── script.js      # IIFE encapsulated modular engine
├── images/        # Favicons & brand logos
└── sound/         # Audio effects (mp3 format)
```

### JavaScript Modules (`script.js`)
- `SoundManager`: Handles audio loading, browser autoplay policies, playback, and mute state persistence.
- `Gameboard`: Encapsulates the 3x3 grid array, cell validation, empty square queries, and static winning combination checks.
- `AIController`: Implements the decision logic for Easy, Medium, and Unbeatable (recursive Minimax) difficulties.
- `GameEngine`: Coordinates game rules, turn switching, AI triggering, round resets, and score tallying.
- `UIController`: Manages DOM manipulation, event listeners, XSS-safe text rendering, toast alerts, and modal popups.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
