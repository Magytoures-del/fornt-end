/**
 * Flight Data Transformation Utilities
 * Pure functions for transforming API responses into UI-friendly formats
 */

/**
 * Process raw flight API data into a normalized format
 */
export const processFlightData = (apiData) => {
  const payload = apiData?.data?.data ?? apiData?.data ?? apiData;
  const trips = payload?.RawData?.Trips;
  if (!Array.isArray(trips)) return [];

  return trips.map((trip, index) => {
    const journey = trip?.Journey?.[0];
    const segment = journey?.Segments?.[0];
    const flight = segment?.Flight ?? {};
    const fares = segment?.Fares ?? {};
    const ptc0 = Array.isArray(fares.PTCFare) ? fares.PTCFare[0] : {};

    const airlineParsed =
      (flight.Airline || "").split("|")[0] || "Unknown Airline";

    return {
      id: `FL${index + 1}`,
      status: payload?.Status || "Confirmed",
      airlineName: airlineParsed,
      flightNo: flight.FlightNo,
      origin: `${flight.DepAirportName ?? ""} (${flight.DepartureCode ?? ""})`,
      destination: `${flight.ArrAirportName ?? ""} (${
        flight.ArrivalCode ?? ""
      })`,
      departureTime: flight.DepartureTime,
      arrivalTime: flight.ArrivalTime,
      duration: flight.Duration,
      aircraft: flight.AirCraft,
      equipmentType: flight.EquipmentType,
      cabin: flight.Cabin,
      refundable: flight.Refundable === "Y",
      seats: flight.Seats,
      macCode: flight.MAC,
      trip: [
        {
          origin: `${flight.DepAirportName ?? ""} (${
            flight.DepartureCode ?? ""
          })`,
          destination: `${flight.ArrAirportName ?? ""} (${
            flight.ArrivalCode ?? ""
          })`,
          departureTime: flight.DepartureTime,
          arrivalTime: flight.ArrivalTime,
          flightNo: flight.FlightNo,
          airlineName: airlineParsed,
          departureTerminal: flight.DepartureTerminal,
          arrivalTerminal: flight.ArrivalTerminal,
        },
      ],
      pricing: {
        baseFare: Math.round(ptc0?.Fare || 0),
        taxes: Math.round(ptc0?.Tax || 0),
        totalFare: Math.round(ptc0?.GrossFare || payload?.TotalPrice || 0),
        currency: payload?.Currency || "SAR",
        transactionFee: Math.round(ptc0?.TransactionFee || 0),
        vatOnTransactionFee: Math.round(ptc0?.VATonTransactionFee || 0),
      },
      // Shape required by FlightCard
      card: {
        flight: {
          MAC: flight.MAC,
          airline: airlineParsed,
          flightNumber: flight.FlightNo,
          aircraft: flight.AirCraft,
          duration: flight.Duration,
          cabin: flight.Cabin,
        },
        from: {
          time: flight.DepartureTime,
          name: flight.DepAirportName,
        },
        to: {
          time: flight.ArrivalTime,
          name: flight.ArrAirportName,
        },
      },
    };
  });
};

/**
 * Extract SSR baggage data from price results
 */
export const getSSRBaggageData = (priceResults, priceLoading) => {
  if (priceLoading) {
    return {
      checkedBaggage: null,
      cabinBaggage: null,
      isLoading: true,
    };
  }

  if (!priceResults?.data?.data?.RawData?.SSR) {
    return {
      checkedBaggage: "0",
      cabinBaggage: "0",
      isLoading: false,
    };
  }

  const ssrData = priceResults.data.data.RawData.SSR[0];
  return {
    checkedBaggage: ssrData?.Baggage || "23kg",
    cabinBaggage: ssrData?.CabinBaggage || "7kg",
    isLoading: false,
  };
};

/**
 * Extract pricing data from price check results
 */
export const extractPricingData = (priceResults) => {
  if (!priceResults?.data?.data) {
    return {
      baseFare: 0,
      taxes: 0,
      fees: 0,
      total: 0,
      currency: "SAR",
      baggage: "Not specified",
      seatSelection: "Standard",
      meal: "Not included",
      netAmount: 0,
      grossAmount: 0,
      discounts: 0,
      transactionFee: 0,
      vatOnTransactionFee: 0,
    };
  }

  const rawData = priceResults.data.data.RawData;
  const trips = rawData?.Trips?.[0];
  const journey = trips?.Journey?.[0];
  const segment = journey?.Segments?.[0];
  const fares = segment?.Fares;
  const ptcFare = fares?.PTCFare?.[0];
  const ssr = rawData?.SSR?.[0];

  const baggageInfo = ssr?.Description || "Not specified";

  return {
    baseFare: Math.round(ptcFare?.Fare || 0),
    taxes: Math.round(ptcFare?.Tax || 0),
    fees: Math.round(
      (ptcFare?.TransactionFee || 0) + (ptcFare?.VATonTransactionFee || 0)
    ),
    total: Math.round(priceResults.data.data.TotalPrice || 0),
    currency: priceResults.data.data.Currency || "SAR",
    baggage: baggageInfo,
    seatSelection: "Standard",
    meal: "Not included",
    netAmount: Math.round(priceResults.data.data.TotalPrice || 0),
    grossAmount: Math.round(rawData?.GrossAmount || 0),
    discounts: Math.round(priceResults.data.data.Discounts || 0),
    transactionFee: Math.round(ptcFare?.TransactionFee || 0),
    vatOnTransactionFee: Math.round(ptcFare?.VATonTransactionFee || 0),
  };
};

/**
 * Calculate age based on birth date and travel date
 */
export const calculateAge = (birthDate, onwardDate) => {
  const birth = new Date(birthDate);
  const onward = new Date(onwardDate);

  if (isNaN(birth) || isNaN(onward)) {
    return 0;
  }

  let age = onward.getFullYear() - birth.getFullYear();
  const monthDiff = onward.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && onward.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Transform form values to traveller API payload
 */
export const transformToTraveller = (
  formValues,
  travellerRequirements,
  onwardDate
) => {
  const travellers = [];

  const traveller = {
    ID: 1,
    PaxID: "ADT1",
    Operation: "0",
    Title: formValues.gender || "Mr",
    FName: formValues.name || "",
    LName: formValues.surname || "",
    Email: formValues.email || "",
    Gender: formValues.gender === "Mr" ? "M" : "F",
    PTC: "ADT",
    isOptionSelected: false,
    ApproverManagers: {
      Managers: [],
      Type: "",
    },
  };

  // Conditionally include fields based on requirements
  if (travellerRequirements.dateOfBirth?.required) {
    const birthDate = formValues.birthDate;
    if (birthDate?.day && birthDate?.month && birthDate?.year) {
      traveller.DOB = `${birthDate.year}-${birthDate.month.padStart(
        2,
        "0"
      )}-${birthDate.day.padStart(2, "0")}`;
      traveller.age = calculateAge(traveller.DOB, onwardDate);
    }
  }

  if (travellerRequirements.nationality?.required) {
    traveller.Nationality = formValues.nationality || "";
  }

  if (travellerRequirements.passportNumber?.required) {
    traveller.PassportNo = formValues.passportNumber || "";
  }

  if (travellerRequirements.passportExpiry?.required) {
    const passportExpDate = formValues.passportExpDate;
    if (
      passportExpDate?.day &&
      passportExpDate?.month &&
      passportExpDate?.year
    ) {
      traveller.PDOE = `${
        passportExpDate.year
      }-${passportExpDate.month.padStart(
        2,
        "0"
      )}-${passportExpDate.day.padStart(2, "0")}`;
    }
  }

  if (travellerRequirements.passportIssue?.required) {
    traveller.PLI = formValues.passportIssueLocation || "";
  }

  if (travellerRequirements.passportIssueDate?.required) {
    const passportIssueDate = formValues.passportIssueDate;
    if (
      passportIssueDate?.day &&
      passportIssueDate?.month &&
      passportIssueDate?.year
    ) {
      traveller.PDOI = `${
        passportIssueDate.year
      }-${passportIssueDate.month.padStart(
        2,
        "0"
      )}-${passportIssueDate.day.padStart(2, "0")}`;
    }
  }

  if (travellerRequirements.country?.required) {
    traveller.Country = formValues.country || "";
  }

  if (travellerRequirements.panNumber?.required) {
    traveller.PANNo = formValues.panNumber || "";
  }

  if (travellerRequirements.emigrationCheck?.required) {
    traveller.EmigrationCheck = formValues.emigrationCheck || false;
  }

  if (formValues.phone) {
    traveller.Phone = `${formValues.phoneCode || "+20"}${formValues.phone}`;
  }

  // Add special service requests if available
  const ssr = [];
  if (formValues.specialMeal) {
    ssr.push({ type: "MEAL", value: formValues.specialMeal });
  }
  if (formValues.seatPreference) {
    ssr.push({ type: "SEAT", value: formValues.seatPreference });
  }
  if (ssr.length > 0) {
    traveller.SSR = ssr;
  }

  travellers.push(traveller);
  return travellers;
};

