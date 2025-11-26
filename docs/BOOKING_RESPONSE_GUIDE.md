# Booking Response Data Guide

## Overview

When a booking is successfully created, the API returns a comprehensive response containing all booking details, flight information, pricing, and rules.

## Response Structure

```javascript
{
  "message": "Itinerary created successfully.",
  "data": {
    "success": true,
    "message": "Itinerary created successfully",
    "data": {
      // Booking Reference
      "TUI": "25417409-3009-4820-8b62-ea66a11c886d|...",
      "TransactionID": 251138462,
      "TripID": "",

      // Pricing Information
      "CurrencyCode": "SAR",
      "NetAmount": 139.49,
      "GrossAmount": 139.49,
      "AirlineNetFare": 139.49,
      "SSRAmount": 0,
      "CrossSellAmount": 0,

      // Passenger Counts
      "ADT": 1,  // Adults
      "CHD": 0,  // Children
      "INF": 0,  // Infants
      "YTH": 0,  // Youth

      // Booking Status
      "Hold": true,  // If true, booking is on hold
      "Mode": null,

      // Flight Details
      "Trips": [...],

      // Additional Services
      "SSR": [...],      // Special Service Requests (baggage, etc.)
      "Rules": [...],    // Fare rules and penalties
      "CrossSell": null,
      "Auxiliaries": [],

      // Response Metadata
      "Code": "200",
      "Msg": ["Success"]
    },
    "timestamp": "2025-10-03T00:04:21.099Z"
  }
}
```

## Key Fields Explained

### 1. Booking References

- **TUI**: Unique Travel Identifier - Main booking reference
- **TransactionID**: Internal transaction reference number
- **TripID**: Trip identifier (may be empty for new bookings)

### 2. Pricing

- **NetAmount**: Final amount to be paid (after all fees/taxes)
- **GrossAmount**: Total gross amount
- **AirlineNetFare**: Base airline fare
- **CurrencyCode**: Currency (e.g., "SAR", "USD")

### 3. Passenger Information

- **ADT**: Number of adult passengers
- **CHD**: Number of child passengers
- **INF**: Number of infant passengers
- **YTH**: Number of youth passengers

### 4. Trip Details (`Trips` array)

Each trip contains:

```javascript
{
  "Journey": [
    {
      "Provider": "1G",     // GDS/Provider code
      "Stops": "0",         // Number of stops
      "GrossFare": 139.49,
      "NetFare": 139.49,

      "Segments": [
        {
          "Flight": {
            "FlightNo": "1057",
            "Airline": "Saudi Airline|Saudi Airline|Saudi Airline",
            "Aircraft": "Airbus A330-300",
            "DepartureCode": "RUH",
            "ArrivalCode": "JED",
            "DepartureTime": "2025-11-26T02:30:00",
            "ArrivalTime": "2025-11-26T04:25:00",
            "Duration": "01h 55m",
            "Cabin": "E",        // E=Economy, B=Business, F=First
            "Refundable": "N",   // Y=Yes, N=No
            "DepartureTerminal": "5",
            "ArrivalTerminal": "1"
          },

          "Fares": {
            "PTCFare": [
              {
                "PTC": "ADT",    // Passenger Type Code
                "Fare": 52,      // Base fare
                "Tax": 82.55,    // Total taxes
                "GrossFare": 139.49,
                "NetFare": 139.49
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### 5. Special Services (SSR)

Baggage and other services:

```javascript
{
  "PTC": "ADT",              // Passenger type
  "PaxId": "1",              // Passenger ID
  "Code": "BAG",             // Service code
  "Description": "0Kg,7Kg",  // Checked, Cabin baggage
  "Charge": 0,               // Additional charge if any
  "Type": "2"                // Service type
}
```

### 6. Fare Rules

```javascript
{
  "OrginDestination": "RUH-JED",
  "Provider": "1G",
  "FareRuleText": "...",  // HTML formatted rules text
  "Rule": []
}
```

## Using Booking Response in Your Code

### 1. Accessing Basic Information

```javascript
const bookingRef = bookingResponse.data.data.TUI;
const transactionId = bookingResponse.data.data.TransactionID;
const totalAmount = bookingResponse.data.data.NetAmount;
const currency = bookingResponse.data.data.CurrencyCode;
const isOnHold = bookingResponse.data.data.Hold;
```

### 2. Extracting Flight Details

```javascript
import { extractBookingFlights } from "@/domain/flights/bookingResponse";

const flights = extractBookingFlights(bookingResponse);

flights.forEach((flight) => {
  console.log(`Flight: ${flight.segments[0].flightNumber}`);
  console.log(`From: ${flight.segments[0].departure.code}`);
  console.log(`To: ${flight.segments[0].arrival.code}`);
  console.log(`Time: ${flight.segments[0].departure.time}`);
});
```

### 3. Getting Baggage Information

```javascript
import { extractBookingBaggage } from "@/domain/flights/bookingResponse";

const baggage = extractBookingBaggage(bookingResponse);
console.log(`Baggage allowance: ${baggage[0]?.description}`);
```

### 4. Complete Formatting

```javascript
import { formatBookingForDisplay } from "@/domain/flights/bookingResponse";

const bookingData = formatBookingForDisplay(bookingResponse);

console.log("Booking Summary:", bookingData.summary);
console.log("Flights:", bookingData.flights);
console.log("Baggage:", bookingData.baggage);
console.log("Is on hold?", bookingData.isOnHold);
```

## Display in Payment Step

The `PaymentStep` component receives the full booking response:

```javascript
<PaymentStep
  bookingResponse={bookingResponse}
  onBackToDetails={handleBackToDetails}
/>
```

Inside `PaymentStep`, you can access:

- Booking reference for confirmation
- Flight details for itinerary display
- Pricing for payment processing
- Rules for terms & conditions

## Important Notes

1. **Hold Status**: If `Hold: true`, the booking is reserved but not yet confirmed. Payment must be completed within the hold time.

2. **TUI Reference**: Save this reference - it's the main identifier for the booking and needed for:

   - Payment processing
   - Ticket issuance
   - Cancellations
   - Modifications

3. **Fare Rules**: Always display the `FareRuleText` to users - it contains important cancellation/change policies.

4. **Session Storage**: The booking response is automatically saved to session storage via the `useCreateBooking` hook's `onSaveToSession` callback.

## Error Handling

If booking creation fails, check:

```javascript
const { bookingResponse, error } = useCreateBooking({...});

if (error) {
  console.error('Booking failed:', error);
  // Show error message to user
}

if (!bookingResponse) {
  // Handle missing response
}
```

## Next Steps After Successful Booking

1. ✅ Store `TUI` and `TransactionID` securely
2. ✅ Display booking confirmation to user
3. ✅ Show flight itinerary details
4. ✅ Process payment with the `TUI` reference
5. ✅ Send confirmation email (if applicable)
6. ✅ Allow user to download/print itinerary

## API Response Codes

- `"200"` - Success
- Other codes indicate errors (check `Msg` array for details)

```javascript
const isSuccess = bookingResponse.data.data.Code === "200";
const messages = bookingResponse.data.data.Msg;
```

