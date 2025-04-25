import React from "react";
import PageTemplate from "./components/PageTemplate";

const NewsPage = ({ user }) => (
  <div className="px-4 py-10">
    <PageTemplate title="📰 News Search" placeholder="Ask a question about the news..." user={user} />
  </div>
);

export default NewsPage;
