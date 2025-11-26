#!/usr/bin/env node

/**
 * Script to download missing country flag SVG files
 * Uses flagpedia.net as the source
 */

const fs = require("fs");
const https = require("https");
const path = require("path");

const missingFlags = [
  "ye",
  "tz",
  "ug",
  "rw",
  "zw",
  "bw",
  "na",
  "zm",
  "mw",
  "mz",
  "mg",
  "mu",
  "sc",
  "ie",
  "is",
  "lu",
  "mc",
  "mt",
  "cy",
  "ee",
  "lv",
  "lt",
  "sk",
  "si",
  "hr",
  "ba",
  "rs",
  "me",
  "mk",
  "al",
  "xk",
  "md",
  "gt",
  "hn",
  "sv",
  "ni",
  "cr",
  "pa",
  "cu",
  "do",
  "ht",
  "jm",
  "tt",
  "bb",
  "bs",
  "bz",
  "gy",
  "sr",
  "tw",
  "hk",
  "mo",
];

const flagsDir = path.join(__dirname, "../public/flags");

// Ensure flags directory exists
if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
}

function downloadFlag(countryCode) {
  return new Promise((resolve, reject) => {
    const url = `https://flagcdn.com/${countryCode}.svg`;
    const filePath = path.join(flagsDir, `${countryCode}.svg`);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${countryCode}.svg already exists`);
      resolve();
      return;
    }

    console.log(`Downloading ${countryCode}.svg...`);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`✓ Downloaded ${countryCode}.svg`);
            resolve();
          });
        } else if (response.statusCode === 404) {
          console.log(`✗ ${countryCode}.svg not found (404)`);
          // Try alternative source
          tryAlternativeSource(countryCode)
            .then(resolve)
            .catch(() => {
              console.log(`✗ Failed to download ${countryCode}.svg`);
              resolve(); // Continue with other flags
            });
        } else {
          console.log(
            `✗ Failed to download ${countryCode}.svg (${response.statusCode})`
          );
          resolve(); // Continue with other flags
        }
      })
      .on("error", (err) => {
        console.log(`✗ Error downloading ${countryCode}.svg: ${err.message}`);
        resolve(); // Continue with other flags
      });
  });
}

function tryAlternativeSource(countryCode) {
  return new Promise((resolve, reject) => {
    // Try flagpedia.net
    const url = `https://flagpedia.net/data/flags/w580/${countryCode}.svg`;
    const filePath = path.join(flagsDir, `${countryCode}.svg`);

    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(
              `✓ Downloaded ${countryCode}.svg from alternative source`
            );
            resolve();
          });
        } else {
          reject(
            new Error(`Alternative source also failed: ${response.statusCode}`)
          );
        }
      })
      .on("error", reject);
  });
}

async function downloadAllFlags() {
  console.log(`Downloading ${missingFlags.length} missing flag files...\n`);

  for (const flag of missingFlags) {
    await downloadFlag(flag);
    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log("\n✓ Download process completed!");
  console.log("\nNote: Some flags might not be available. You may need to:");
  console.log("1. Download them manually from https://flagpedia.net/");
  console.log("2. Or use https://github.com/lipis/flag-icons");
}

downloadAllFlags().catch(console.error);
