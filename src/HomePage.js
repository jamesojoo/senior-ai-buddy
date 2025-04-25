import React, { useState, useEffect } from "react";
import PageTemplate from "./components/PageTemplate";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const HomePage = ({ user, preferences, chatLogs }) => {
  const [dailyTime, setDailyTime] = useState("09:00");

  useEffect(() => {
    if (preferences?.dailyCheckin?.time) {
      setDailyTime(preferences.dailyCheckin.time);
    }
  }, [preferences]);

  const saveDailyCheckinTime = async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          preferences: {
            ...preferences,
            dailyCheckin: {
              enabled: true,
              time: dailyTime,
            },
          },
        }, { merge: true });
        alert("Daily check-in time saved!");
      } catch (err) {
        console.error("Failed to save check-in time:", err);
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">Welcome to Agewell 👋</h1>
      </div>
      <PageTemplate title="Daily Check-in" placeholder="How are you feeling today?" user={user} />

      <div className="bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-100 text-lg p-4 px-6 rounded-xl border border-green-200 dark:border-green-600 shadow max-w-xl mx-auto text-center">
        ✅ You’ve checked in today. Your family has been notified 😊
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-600">
        <h2 className="text-xl font-bold mb-2">🕐 Set Daily Check-in Time</h2>
        <div className="flex gap-4 items-center">
          <input
            type="time"
            value={dailyTime}
            onChange={(e) => setDailyTime(e.target.value)}
            className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={saveDailyCheckinTime}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Time
          </button>
        </div>
      </div>

      {chatLogs && chatLogs.length > 0 && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-600">
          <h2 className="text-xl font-bold mb-2">📝 Previous Chats</h2>
          <ul className="space-y-2 text-left">
            {chatLogs.map((log, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
                <strong>You:</strong> {log.question}<br />
                <strong>AI:</strong> {log.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
