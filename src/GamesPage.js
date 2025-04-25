import React from "react";
import PageTemplate from "./components/PageTemplate";

const GamesPage = ({ user }) => (
  <div className="px-4 py-10">
    <PageTemplate title="🎮 Game Assistant" placeholder="Ask about a game..." user={user} />
  </div>
);

export default GamesPage;
