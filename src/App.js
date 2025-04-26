// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaGamepad, FaLifeRing, FaNewspaper, FaUser, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HomePage from "./HomePage";
import GamesPage from "./GamesPage";
import SupportPage from "./SupportPage";
import NewsPage from "./NewsPage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import TicTacToe from "./components/TicTacToe";
import Solitaire from "./components/Solitaire";
import { auth, db } from "./firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setPreferences(userData.preferences);
            setChatLogs(userData.chatLogs || []);
            if (userData.preferences?.theme === "dark") {
              setDarkMode(true);
            }
          } else {
            await setDoc(userRef, {
              preferences: { theme: "light" },
              chatLogs: []
            });
            setPreferences({ theme: "light" });
            setChatLogs([]);
          }
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      } else {
        setPreferences(null);
        setChatLogs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out.");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors">

          {/* Header with logo */}
          <header className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/assets/AgewellLogo.png"
                alt="Agewell Logo"
                className="h-10 w-auto"
              />
              <span className="text-3xl font-extrabold tracking-tight bg-white text-blue-600 px-3 py-1 rounded-xl shadow-lg">
                Agewell
              </span>
            </div>

            <nav className="space-x-4 flex items-center">
              <Link to="/" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaHome /> Home</Link>
              <Link to="/games" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaGamepad /> Games</Link>
              <Link to="/support" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaLifeRing /> Support</Link>
              <Link to="/news" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaNewspaper /> News</Link>
              {!user ? (
                <>
                  <Link to="/login" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaUser /> Login</Link>
                  <Link to="/signup" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-1 rounded-lg transition"><FaUserPlus /> Sign Up</Link>
                </>
              ) : (
                <>
                  <span className="text-sm text-white px-3">{user.email}</span>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition"><FaSignOutAlt /> Logout</button>
                </>
              )}
              <button
                onClick={async () => {
                  const newTheme = !darkMode ? "dark" : "light";
                  setDarkMode(!darkMode);
                  localStorage.setItem("theme", newTheme);
                  if (user) {
                    try {
                      const userRef = doc(db, "users", user.uid);
                      await setDoc(userRef, {
                        preferences: { theme: newTheme }
                      }, { merge: true });
                    } catch (error) {
                      console.error("Failed to save theme preference:", error);
                    }
                  }
                }}
                className="ml-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-3 py-1 rounded-full shadow transition"
              >
                {darkMode ? "\u2600\ufe0f Light" : "\ud83c\udf19 Dark"}
              </button>
            </nav>
          </header>

          {/* Main App Routes */}
          <Routes>
            <Route path="/" element={<HomePage user={user} preferences={preferences} chatLogs={chatLogs} />} />
            <Route path="/games" element={<GamesPage user={user} />} />
            <Route path="/support" element={<SupportPage user={user} />} />
            <Route path="/news" element={<NewsPage user={user} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/games/tictactoe" element={<TicTacToe />} />
            <Route path="/games/solitaire" element={<Solitaire />} />
          </Routes>

        </div>
      </Router>
    </DndProvider>
  );
}
