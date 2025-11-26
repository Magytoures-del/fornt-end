"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getLocalizedAirport,
  preloadAirportLocalization,
} from "@/utils/airportLocalization";

// Sample airport codes to test (module scope to avoid hook deps warning)
const airportCodes = [
  "RUH",
  "JED",
  "DMM",
  "DXB",
  "CAI",
  "IST",
  "DOH",
  "BAH",
  "LHR",
  "CDG",
  "JFK",
  "DXB",
  "SIN",
  "NRT",
  "ICN",
  "BKK",
];

export default function TestAirportsPage() {
  const { i18n } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [testAirports, setTestAirports] = useState([]);

  useEffect(() => {
    const loadAirports = async () => {
      await preloadAirportLocalization(i18n.language);

      const airports = airportCodes.map((code) => ({
        code,
        ...getLocalizedAirport(code, i18n.language),
      }));

      setTestAirports(airports);
      setLoaded(true);
    };

    loadAirports();
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Airport Localization Test
          </h1>

          <div className="mb-6 flex gap-4">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                i18n.language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              English
            </button>
            <button
              onClick={() => i18n.changeLanguage("ar")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                i18n.language === "ar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              العربية
            </button>
          </div>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Language:</strong> {i18n.language}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> {loaded ? "✅ Loaded" : "⏳ Loading..."}
            </p>
          </div>

          <div className="space-y-4">
            {testAirports.map((airport) => (
              <div
                key={airport.code}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {airport.code}
                  </span>
                  <span className="text-sm text-gray-500">
                    {i18n.language === "ar" ? "العربية" : "English"}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-800">
                    🏙️ {airport.city || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    ✈️ {airport.airport || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2">✅ How to Test:</h3>
            <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
              <li>Click the &quot;العربية&quot; button to switch to Arabic</li>
              <li>Watch the airport and city names change to Arabic</li>
              <li>Click &quot;English&quot; to switch back</li>
              <li>All 250+ airports are now localized!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
