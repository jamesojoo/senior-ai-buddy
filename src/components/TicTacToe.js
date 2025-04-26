import React, { useState, useEffect } from "react";

const initialBoard = Array(9).fill(null);

// ✨ Thinking Messages
const thinkingMessages = [
  "🤔 Hmm...",
  "🧠 Calculating best move...",
  "⏳ Thinking carefully...",
  "🤖 Crunching numbers...",
  "🧩 Planning strategy...",
  "🧠 Deep thinking...",
];

export default function TicTacToe() {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [message, setMessage] = useState("");
  const [difficulty, setDifficulty] = useState("Easy"); // Easy / Medium / Hard
  const [thinking, setThinking] = useState(false); // ✨ New state
  const [thinkingMessage, setThinkingMessage] = useState("🤔 Thinking..."); // ✨ Random message

  // Check for winner or draw
  const checkWinner = (b) => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let [a, b1, c] of winPatterns) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    if (b.every(cell => cell)) return "draw";
    return null;
  };

  // Handle user click
  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || message) return;
    const newBoard = [...board];
    newBoard[index] = "❌";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  // AI move depending on difficulty
  const aiMove = (b) => {
    const empty = b.map((val, i) => val ? null : i).filter(x => x !== null);

    if (difficulty === "Easy") {
      // Easy: Random
      const choice = empty[Math.floor(Math.random() * empty.length)];
      const newBoard = [...b];
      newBoard[choice] = "⭕";
      return newBoard;
    } 
    else if (difficulty === "Medium") {
      // Medium: Try win, block, random
      for (let i of empty) {
        const testBoard = [...b];
        testBoard[i] = "⭕";
        if (checkWinner(testBoard) === "⭕") return testBoard;
      }
      for (let i of empty) {
        const testBoard = [...b];
        testBoard[i] = "❌";
        if (checkWinner(testBoard) === "❌") {
          const newBoard = [...b];
          newBoard[i] = "⭕";
          return newBoard;
        }
      }
      const choice = empty[Math.floor(Math.random() * empty.length)];
      const newBoard = [...b];
      newBoard[choice] = "⭕";
      return newBoard;
    } 
    else if (difficulty === "Hard") {
      // Hard: Minimax
      const bestMove = minimax(b, true).index;
      const newBoard = [...b];
      newBoard[bestMove] = "⭕";
      return newBoard;
    }
  };

  // Minimax AI (for Hard mode)
  const minimax = (newBoard, isAITurn) => {
    const winner = checkWinner(newBoard);
    if (winner === "⭕") return { score: 10 };
    if (winner === "❌") return { score: -10 };
    if (winner === "draw") return { score: 0 };

    const emptySpots = newBoard.map((val, i) => val ? null : i).filter(x => x !== null);
    const moves = [];

    for (let i of emptySpots) {
      const move = {};
      move.index = i;

      const boardCopy = [...newBoard];
      boardCopy[i] = isAITurn ? "⭕" : "❌";

      const result = minimax(boardCopy, !isAITurn);
      move.score = result.score;

      moves.push(move);
    }

    if (isAITurn) {
      let bestScore = -Infinity;
      let bestMove;
      for (let move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
      return bestMove;
    } else {
      let bestScore = Infinity;
      let bestMove;
      for (let move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
      return bestMove;
    }
  };

  // React to changes
  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setMessage(winner === "draw" ? "It’s a draw!" : `${winner} wins!`);
      setThinking(false);
      return;
    }

    if (!isPlayerTurn) {
      const randomMessage = thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];
      setThinkingMessage(randomMessage);
      setThinking(true);

      setTimeout(() => {
        const newBoard = aiMove(board);
        setBoard(newBoard);
        setIsPlayerTurn(true);
        setThinking(false);
      }, 1000);
    }
  }, [board, isPlayerTurn]);

  // Reset the game
  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setMessage("");
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>

      {/* Difficulty selector */}
      <div className="mb-6">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 w-60 mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            className="w-20 h-20 text-3xl font-bold border-2 border-blue-500 rounded-md bg-white dark:bg-gray-800 dark:text-white"
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Thinking Animation */}
      {thinking && (
        <div className="mt-4 text-blue-500 text-lg animate-pulse">
          {thinkingMessage}
        </div>
      )}

      {/* Result Message */}
      {message && (
        <>
          <p className="mt-4 text-lg font-semibold">{message}</p>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}
