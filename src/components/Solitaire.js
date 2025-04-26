import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes"; // ✅ Using shared ItemTypes
import Card from "./Card"; // ✅ Updated Card component

function generateDeck() {
  const suits = ["♠️", "♥️", "♦️", "♣️"];
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ id: `${rank}${suit}`, rank, suit });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Column({ cards, onDropCard }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => onDropCard(item.card),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={`w-24 min-h-[200px] p-2 rounded-lg border-2 transition-colors ${
        isOver ? "bg-blue-100 dark:bg-blue-800" : "bg-gray-100 dark:bg-gray-700"
      } flex flex-col items-center justify-start gap-2`}
    >
      {cards.map((card, index) => (
        <div key={card.id} className="animate-drop-in">
          <Card card={card} draggable={false} />
        </div>
      ))}
    </div>
  );
}

export default function Solitaire() {
  const [deck, setDeck] = useState(generateDeck());
  const [drawnCard, setDrawnCard] = useState(null);
  const [columns, setColumns] = useState([[], [], [], []]);
  const [aiDeck, setAIDeck] = useState(generateDeck());
  const [aiColumns, setAIColumns] = useState([[], [], [], []]);
  const [winner, setWinner] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAIScore] = useState(0);

  const handleDrawCard = () => {
    if (deck.length === 0 || winner) return;
    const newDeck = [...deck];
    const card = newDeck.pop();
    setDeck(newDeck);
    setDrawnCard(card);
  };

  const handleReset = () => {
    setDeck(generateDeck());
    setDrawnCard(null);
    setColumns([[], [], [], []]);
    setAIDeck(generateDeck());
    setAIColumns([[], [], [], []]);
    setWinner(null);
  };

  const handleDropCard = (colIndex, card) => {
    if (winner || !card) return; // ✅ FIXED: check if card exists, not drawnCard
    const newColumns = [...columns];
    newColumns[colIndex].push(card);
    setColumns(newColumns);

    if (drawnCard && drawnCard.id === card.id) {
      setDrawnCard(null); // ✅ Clear drawnCard only if it was dragged
    }
  };

  const checkVictory = () => {
    if (winner) return;
    if (deck.length === 0 && aiDeck.length === 0) {
      setWinner("draw");
    } else if (deck.length === 0) {
      setWinner("player");
      setPlayerScore(prev => prev + 1);
    } else if (aiDeck.length === 0) {
      setWinner("ai");
      setAIScore(prev => prev + 1);
    }
  };

  useEffect(() => {
    const aiInterval = setInterval(() => {
      if (winner) return;
      if (aiDeck.length > 0) {
        const newDeck = [...aiDeck];
        const card = newDeck.pop();
        const newColumns = [...aiColumns];
        const randomCol = Math.floor(Math.random() * 4);
        newColumns[randomCol].push(card);

        setAIDeck(newDeck);
        setAIColumns(newColumns);
      }
    }, 3000);

    return () => clearInterval(aiInterval);
  }, [aiDeck, aiColumns, winner]);

  useEffect(() => {
    checkVictory();
  }, [deck, aiDeck]);

  return (
    <div className="flex flex-col items-center p-6 space-y-8">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">♠️ Solitaire (You vs AI)</h1>

      {/* Scoreboard */}
      <div className="flex gap-8 text-lg font-semibold">
        <div>Player Score: {playerScore}</div>
        <div>AI Score: {aiScore}</div>
      </div>

      {/* Victory Banner */}
      {winner && (
        <div className="mt-4 p-4 rounded-lg text-2xl font-bold text-center bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-100">
          {winner === "player" && "🎉 You Win!"}
          {winner === "ai" && "🤖 AI Wins!"}
          {winner === "draw" && "🤝 It's a Draw!"}
        </div>
      )}

      {/* Deck and Drawn Card */}
      <div className="flex items-center space-x-8">
        <button
          onClick={handleDrawCard}
          disabled={deck.length === 0 || winner}
          className={`w-24 h-36 flex items-center justify-center text-white bg-green-700 hover:bg-green-800 rounded-lg shadow-lg ${
            deck.length === 0 || winner ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {deck.length > 0 ? "Draw" : "Empty"}
        </button>

        {/* Drawn card */}
        {drawnCard ? (
          <Card card={drawnCard} className="animate-drop-in" draggable={true} />
        ) : (
          <div className="w-20 h-28" />
        )}
      </div>

      {/* Player Columns */}
      <h2 className="text-xl font-semibold text-center">Your Columns</h2>
      <div className="flex space-x-6 mb-10">
        {columns.map((colCards, index) => (
          <Column
            key={index}
            cards={colCards}
            onDropCard={(card) => handleDropCard(index, card)}
          />
        ))}
      </div>

      {/* AI Columns */}
      <h2 className="text-xl font-semibold text-center text-red-500 dark:text-red-400">AI's Columns</h2>
      <div className="flex space-x-6">
        {aiColumns.map((colCards, index) => (
          <div
            key={index}
            className="w-24 min-h-[200px] p-2 rounded-lg border-2 bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-start gap-2"
          >
            {colCards.map((card, i) => (
              <div key={i} className="animate-drop-in">
                <div className="w-20 h-28 flex items-center justify-center rounded-md text-xl font-bold border-2 bg-white dark:bg-gray-800 shadow">
                  {card.rank}{card.suit}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        Restart Game
      </button>
    </div>
  );
}
