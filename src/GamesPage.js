import React from "react";
import { Link } from "react-router-dom";
import PageTemplate from "./components/PageTemplate";

const GamesPage = ({ user }) => (
  <div className="px-4 py-10 space-y-10">
    <PageTemplate title="🎮 Game Assistant" placeholder="Ask about a game..." user={user} />

    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-800 dark:text-blue-300">
        🕹️ Choose a Game
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Tic Tac Toe Game Card */}
        <Link
          to="/games/tictactoe"
          className="group relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105 duration-300"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/32/Tic_tac_toe.svg"
            alt="Tic Tac Toe Preview"
            className="w-full h-40 object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:underline text-center">
            Tic Tac Toe
          </h3>
        </Link>

        {/* Solitaire Game Card */}
        <Link
          to="/games/solitaire"
          className="group relative block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105 duration-300"
        >
          <img
            src="https://d3o15ch5dvbj06.cloudfront.net/wp-content/uploads/2021/06/solitaire-strategies.jpg"
            alt="Solitaire Preview"
            className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
          />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:underline text-center">
            Solitaire
          </h3>
        </Link>
      </div>
    </div>
  </div>
);

export default GamesPage;
