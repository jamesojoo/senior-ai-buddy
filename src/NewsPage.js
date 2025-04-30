import React, { useState, useEffect } from "react";
import PageTemplate from "./components/PageTemplate";

const NewsPage = ({ user }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        let url = "";
        if (filter === "good") {
          url = `https://newsapi.org/v2/everything?q=positive%20OR%20uplifting%20OR%20inspiring%20OR%20breakthrough%20OR%20hero&sortBy=publishedAt&language=en&apiKey=40810d343d53433aba2d251e8f5d7d1c`;
        } else if (query.trim()) {
          url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=40810d343d53433aba2d251e8f5d7d1c`;
        } else {
          url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=40810d343d53433aba2d251e8f5d7d1c`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "ok") {
          setArticles(data.articles);
        } else {
          throw new Error("Failed to fetch news");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load news. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [filter, query]);

  const readAloud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="px-4 py-10 space-y-8">
      <PageTemplate
        title="📰 News Search"
        placeholder="Ask a question about the news..."
        user={user}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-center items-center gap-4">
  <button
    className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
    onClick={() => setFilter("all")}
  >
    🌍 All News
  </button>
  <button
    className={`px-4 py-2 rounded-lg shadow flex items-center gap-2 ${filter === "good" ? "bg-green-600 text-white" : "bg-white text-green-600"}`}
    onClick={() => setFilter("good")}
  >
    💚 Good News
  </button>
  <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300">
  {filter === "good"
    ? "🟢 Showing Good News Only (Uplifting, Positive Stories)"
    : query.trim()
    ? `🔍 Showing Search Results for "${query}"`
    : "📣 Showing All Headlines"}
</h2>
<p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
  Last updated: {new Date().toLocaleString()}
</p>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="space-y-6">
  {!loading && articles.length === 0 && (
    <p className="text-center text-gray-500">No articles found for this section.</p>
  )}
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  {article.title}
                </h3>
                <button
                  onClick={() => readAloud(article.title)}
                  className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  🔊 Read Aloud
                </button>
              </div>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt="news preview"
                  className="w-full h-64 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {article.description || "No summary available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Read Full Article
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
