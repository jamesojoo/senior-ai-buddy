import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Animation from "../assets/Animation.json"; // ✅ Perfect path now

export default function PageTemplate({ title, placeholder, user }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const callAI = async () => {
    if (!query) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`
        },
        body: JSON.stringify({ inputs: query })
      });
      const data = await res.json();
      const answer = data[0]?.generated_text || "Sorry, no results available.";
      setResponse(answer);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          chatLogs: arrayUnion({ question: query, answer })
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setResponse("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 rounded-3xl p-6 mb-10 shadow bg-white dark:bg-gray-900">
      {/* Dimming overlay while thinking */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
          >
            <div className="w-72 h-72">
              <Lottie animationData={Animation} loop={true} />
            </div>
            <p className="text-white mt-4 text-lg font-semibold">Thinking...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat UI */}
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-800 dark:text-blue-300">{title}</h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-4 border rounded-xl dark:bg-gray-800 dark:text-white"
          disabled={loading}
        />
        <button
          onClick={callAI}
          className={`px-6 py-2 rounded-xl transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {response && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl border dark:border-gray-600">
          <p className="whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
}
