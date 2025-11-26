"use client";
import React, { useState } from "react";
import SearchableSelect from "./SearchableSelect";

const SearchableSelectExample = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Example country options with country field and codes
  const countryOptions = [
    { value: "sa", label: "Saudi Arabia", country: "Saudi Arabia" },
    { value: "ae", label: "United Arab Emirates", country: "UAE" },
    { value: "kw", label: "Kuwait", country: "Kuwait" },
    { value: "qa", label: "Qatar", country: "Qatar" },
    { value: "bh", label: "Bahrain", country: "Bahrain" },
    { value: "om", label: "Oman", country: "Oman" },
    { value: "eg", label: "Egypt", country: "Egypt" },
    { value: "tr", label: "Turkey", country: "Turkey" },
    { value: "jo", label: "Jordan", country: "Jordan" },
    { value: "lb", label: "Lebanon", country: "Lebanon" },
    { value: "fr", label: "France", country: "France" },
    { value: "gb", label: "United Kingdom", country: "UK" },
    { value: "us", label: "United States", country: "USA" },
    { value: "jp", label: "Japan", country: "Japan" },
    { value: "sg", label: "Singapore", country: "Singapore" },
    { value: "th", label: "Thailand", country: "Thailand" },
    { value: "my", label: "Malaysia", country: "Malaysia" },
    { value: "cn", label: "China", country: "China" },
    { value: "in", label: "India", country: "India" },
    { value: "pk", label: "Pakistan", country: "Pakistan" },
  ];

  // Example language options
  const languageOptions = [
    { value: "english", label: "English" },
    { value: "arabic", label: "العربية" },
    { value: "french", label: "Français" },
    { value: "spanish", label: "Español" },
    { value: "german", label: "Deutsch" },
    { value: "italian", label: "Italiano" },
    { value: "portuguese", label: "Português" },
    { value: "russian", label: "Русский" },
    { value: "chinese", label: "中文" },
    { value: "japanese", label: "日本語" },
    { value: "korean", label: "한국어" },
    { value: "hindi", label: "हिन्दी" },
  ];

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Enhanced SearchableSelect Examples
      </h2>

      {/* Country Search with Labels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Country Search with Labels
        </h3>
        <SearchableSelect
          options={countryOptions}
          value={selectedCountry}
          onChange={setSelectedCountry}
          placeholder="Select a country..."
          label="Country"
          enableCountrySearch={true}
          showCountryLabels={true}
          required={true}
        />
        {selectedCountry && (
          <p className="mt-2 text-sm text-gray-600">
            Selected:{" "}
            {countryOptions.find((opt) => opt.value === selectedCountry)?.label}
          </p>
        )}
      </div>

      {/* Language Selection with No Language Option */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Language Selection with &quot;No Language&quot; Option
        </h3>
        <SearchableSelect
          options={languageOptions}
          value={selectedLanguage}
          onChange={setSelectedLanguage}
          placeholder="Select a language..."
          label="Language"
          noLanguageOption={true}
          required={false}
        />
        {selectedLanguage && (
          <p className="mt-2 text-sm text-gray-600">
            Selected:{" "}
            {selectedLanguage === "no_language"
              ? "No Language"
              : languageOptions.find((opt) => opt.value === selectedLanguage)
                  ?.label}
          </p>
        )}
      </div>

      {/* Regular SearchableSelect */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Regular SearchableSelect
        </h3>
        <SearchableSelect
          options={countryOptions}
          value=""
          onChange={() => {}}
          placeholder="Select an option..."
          label="Regular Select"
        />
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">
          Usage Instructions:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • <strong>enableCountrySearch:</strong> Enables searching by country
            name, country code/value, and option label
          </li>
          <li>
            • <strong>showCountryLabels:</strong> Shows country names as
            secondary labels below the main option
          </li>
          <li>
            • <strong>noLanguageOption:</strong> Adds a &quot;No Language&quot;
            option at the top of the list
          </li>
          <li>
            • <strong>searchPlaceholder:</strong> Customizes the search input
            placeholder text
          </li>
          <li>
            • <strong>Search Examples:</strong> Try searching &quot;eg&quot; for
            Egypt, &quot;sa&quot; for Saudi Arabia, &quot;Egypt&quot;, or
            &quot;Saudi Arabia&quot;
          </li>
          <li>
            • All existing props (label, required, error, disabled) work as
            before
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SearchableSelectExample;
