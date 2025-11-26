# Airline Localization Guide

## Overview

This guide explains the airline name localization system that has been implemented in the Flymoon Travel application. The system automatically translates airline names from English to Arabic based on the user's selected language.

## Files Created/Modified

### 1. New Utility File

**`src/utils/airlineLocalization.js`**

- Contains comprehensive mapping of airline names from English to Arabic
- Includes 100+ major airlines worldwide
- Provides utility functions for retrieving localized airline names

### 2. Updated Components

The following components have been updated to use airline localization:

1. **`src/components/flights/details/FlightCard.js`**

   - Displays airline names in booking details
   - Shows localized airline names based on user's language preference

2. **`src/components/flights/results/FlightCard.js`**

   - Displays airline names in flight search results
   - Handles both outbound and return flights for round trips
   - Shows localized airline names in image alt text

3. **`src/components/flights/FlightInfoModal.js`**
   - Shows airline name in flight information modal
   - Displays localized airline name in header section

## How It Works

### 1. Import the Utility

```javascript
import { getLocalizedAirlineName } from "@/utils/airlineLocalization";
```

### 2. Use in Components

```javascript
// Get current language from i18next
const { i18n } = useTranslation();

// Localize airline name
const localizedName = getLocalizedAirlineName(airlineName, i18n.language);
```

### 3. Example Usage

```javascript
<AirlineName>
  {getLocalizedAirlineName(trip.flight.airline, i18n.language)}
</AirlineName>
```

## Supported Airlines

The system includes translations for:

### Middle East Airlines

- Saudi Arabian Airlines (الخطوط السعودية)
- Flynas (طيران ناس)
- Flyadeal (طيران أديل)
- Emirates (طيران الإمارات)
- Etihad Airways (طيران الاتحاد)
- Qatar Airways (الخطوط الجوية القطرية)
- Gulf Air (طيران الخليج)
- Kuwait Airways (الخطوط الجوية الكويتية)
- Oman Air (الطيران العماني)
- Royal Jordanian (الملكية الأردنية)
- EgyptAir (مصر للطيران)
- And many more...

### International Airlines

- Turkish Airlines (الخطوط الجوية التركية)
- Singapore Airlines (الخطوط الجوية السنغافورية)
- Emirates Airlines (طيران الإمارات)
- British Airways (الخطوط الجوية البريطانية)
- Air France (الخطوط الجوية الفرنسية)
- Lufthansa (لوفتهانزا)
- American Airlines (الخطوط الأمريكية)
- And 100+ more airlines...

## API Functions

### `getLocalizedAirlineName(airlineName, language)`

Returns the localized airline name based on the current language.

**Parameters:**

- `airlineName` (string): The airline name (usually in English)
- `language` (string): The current language ('en' or 'ar')

**Returns:**

- (string): The localized airline name

**Example:**

```javascript
getLocalizedAirlineName("Emirates", "ar"); // Returns: "طيران الإمارات"
getLocalizedAirlineName("Emirates", "en"); // Returns: "Emirates"
```

### `getAllAirlineTranslations()`

Returns all airline translations as an object.

**Returns:**

- (Object): Complete mapping of English to Arabic airline names

### `addAirlineTranslation(englishName, arabicName)`

Adds or updates an airline translation dynamically.

**Parameters:**

- `englishName` (string): English airline name
- `arabicName` (string): Arabic airline name

## Fallback Behavior

The localization system includes intelligent fallback:

1. **Exact Match**: Tries to find exact airline name match
2. **Case-Insensitive Match**: Tries case-insensitive matching
3. **Partial Match**: Tries partial string matching
4. **Original Name**: Returns original name if no translation found

This ensures that even if an airline is not in the database, the application continues to work properly.

## Adding New Airlines

To add a new airline translation:

1. **Option 1: Edit the utility file**

   ```javascript
   // In src/utils/airlineLocalization.js
   const airlineTranslations = {
     // ... existing translations
     "New Airline Name": "الاسم العربي للخطوط",
   };
   ```

2. **Option 2: Use the API function**

   ```javascript
   import { addAirlineTranslation } from "@/utils/airlineLocalization";

   addAirlineTranslation("New Airline Name", "الاسم العربي للخطوط");
   ```

## Testing

To test the localization:

1. Navigate to any page showing flight results
2. Switch language between English and Arabic using the language selector
3. Verify that airline names change accordingly:
   - English: Shows original English names
   - Arabic: Shows translated Arabic names

## Best Practices

1. **Always use the localization utility** for airline names instead of displaying raw API data
2. **Maintain consistency** across all components
3. **Update translations** when new airlines are added to the booking system
4. **Test thoroughly** when switching between languages
5. **Check RTL/LTR** text direction for proper display

## Future Enhancements

Potential improvements:

1. Load translations from a JSON file or API
2. Add support for more languages (French, German, etc.)
3. Include airline codes mapping
4. Add airline descriptions/information
5. Create admin interface for managing translations

## Related Files

- `src/utils/cityLocalization.js` - Similar utility for city names
- `src/utils/airportLocalization.js` - Similar utility for airport names
- `src/config/i18n.js` - i18next configuration
- `src/context/LanguageContext.js` - Language switching context

## Support

If you need to add more airlines or have questions about the localization system, refer to this guide or consult the existing utility files for similar patterns.
