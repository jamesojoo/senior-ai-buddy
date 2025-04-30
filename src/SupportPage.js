import React, { useState } from "react";
import PageTemplate from "./components/PageTemplate";

const SupportPage = ({ user }) => {
  const [symptom, setSymptom] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleSymptomCheck = async () => {
    if (!symptom.trim()) return;
    setAiResponse("Checking symptoms...");

    // Mock AI response – replace with OpenAI API call if needed
    setTimeout(() => {
      setAiResponse("This might be related to dehydration or fatigue. Please rest, drink water, and consult a professional if symptoms persist.");
    }, 1500);
  };

  const wellnessResources = [
    {
      title: "Mental Health Helpline",
      link: "https://www.mentalhealthhelpline.ca/",
      description: "Talk to someone 24/7 about anxiety, depression, or stress."
    },
    {
      title: "Government Benefits for Seniors",
      link: "https://www.canada.ca/en/services/benefits/publicpensions.html",
      description: "Explore financial support available to you as a senior."
    },
    {
      title: "Fall Prevention Checklist",
      link: "https://www.cdc.gov/steadi/pdf/STEADI-FactSheet-FallCheckList-508.pdf",
      description: "Tips to keep your home safe and prevent falls."
    },
    {
      title: "Wellness Guide PDF",
      link: "https://www.ncoa.org/article/the-ultimate-guide-to-aging-well",
      description: "A printable guide for staying well physically and mentally."
    }
  ];

  return (
    <div className="px-4 py-10 space-y-10">
            {/* AI Nurse Symptom Checker */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-600">
        <h2 className="text-xl font-bold mb-3">🛟 Support Page & Symptom Checker</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Describe your symptom..."
            className="flex-grow p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSymptomCheck}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Check
          </button>
        </div>
        {aiResponse && <p className="mt-4 text-gray-700 dark:text-gray-300">{aiResponse}</p>}
        <p className="text-xs mt-2 text-gray-400 italic">* This tool is not a substitute for professional medical advice.</p>
      </div>

      {/* Resource Cards */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold mb-4">📘 Helpful Wellness Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wellnessResources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1">{resource.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{resource.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Wellness Scheduler */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-600">
        <h2 className="text-xl font-bold mb-3">⏱ Daily Wellness Reminder</h2>
        <p className="mb-2 text-gray-700 dark:text-gray-300">Set a time to receive a gentle reminder to check in.</p>
        <input
          type="time"
          className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
        />
        <p className="text-xs mt-2 text-gray-400">(Coming soon: this will notify you daily at your chosen time!)</p>
      </div>
    </div>
  );
};

export default SupportPage;
