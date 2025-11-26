"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FlightBookingSuccess from "@/components/flights/FlightBookingSuccess";
import { exportElementToPdf } from "@/utils/exportPdf";

export default function BookingSuccessDemo() {
  const router = useRouter();
  const [showDemo, setShowDemo] = useState(false);

  // Sample booking data for demonstration
  const sampleBookingData = {
    bookingId: "FLY-2024-001234",
    flight: {
      airlineCode: "J9",
      airlineName: "Jazeera Airways",
      flightNo: "732",
      fromCity: "Cairo",
      toCity: "Jeddah",
      fromAirport: "Cairo International Airport",
      toAirport: "King Abdulaziz International Airport",
      departureTime: "2025-10-20T13:20:00",
      arrivalTime: "2025-10-20T20:10:00",
      duration: "06h 50m",
      stops: 1,
      cabinClass: "Economy",
      aircraft: "AIRBUS JET",
      seats: 9,
      connections: [
        {
          airport: "KWI",
          arrivalAirportName: "Kuwait International Airport",
          duration: "01h 50m",
          flightNo: "217",
          marketingAirline: "J9|Jazeera Airways",
        },
      ],
    },
    passengers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    passengerInfo: {
      fullName: "Ahmed Mohamed",
      email: "ahmed.mohamed@example.com",
      phone: "+966501234567",
      passport: "A12345678",
    },
    pricing: {
      baseFare: 400.0,
      taxes: 50.0,
      serviceFee: 22.62,
      total: 472.62,
    },
  };

  const handleDemoBooking = () => {
    // Store sample data in localStorage
    localStorage.setItem(
      "flightBookingData",
      JSON.stringify(sampleBookingData)
    );

    // Redirect to booking success page
    router.push("/flights/booking-success?bookingId=FLY-2024-001234");
  };

  const handleInlineDemo = () => {
    setShowDemo(true);
  };

  const handleDownload = async () => {
    try {
      const container = document.getElementById("ticket-print-area");
      if (!container) {
        console.warn("Ticket container not found for PDF export.");
        alert("Unable to prepare the ticket for download. Please try again.");
        return;
      }
      await exportElementToPdf({
        element: container,
        fileName: `${sampleBookingData?.bookingId || "ticket"}.pdf`,
        margin: 8,
        scale: 2,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const handlePrint = (bookingData) => {
    console.log("Print ticket for booking:", bookingData.bookingId);
    window.print();
  };

  const handleWhatsApp = (bookingData) => {
    const message = encodeURIComponent(
      `I've successfully booked my flight!\n\n` +
        `Flight Details:\n` +
        `${bookingData.flight.airlineName} - ${bookingData.flight.flightNo}\n` +
        `${bookingData.flight.fromCity} to ${bookingData.flight.toCity}\n` +
        `Booking Reference: ${bookingData.bookingId}`
    );
    const phoneNumber = "1234567890";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Flight Booking Success Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This page demonstrates the flight booking success functionality
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleDemoBooking}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Booking Success Page
            </button>
            <button
              onClick={handleInlineDemo}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Show Inline Demo
            </button>
            <Link
              href="/flights"
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Flights
            </Link>
          </div>
        </div>

        {showDemo && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Inline Booking Success Component Demo
            </h2>
            <FlightBookingSuccess
              bookingData={sampleBookingData}
              onDownload={handleDownload}
              onPrint={handlePrint}
              onWhatsAppShare={handleWhatsApp}
              showActions={true}
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            How to Use the Booking Success Page
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Store Booking Data
              </h3>
              <p>
                Before redirecting to the success page, store the booking data
                in localStorage:
              </p>
              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                {`localStorage.setItem('flightBookingData', JSON.stringify(bookingData));`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. Redirect to Success Page
              </h3>
              <p>Redirect to the booking success page with the booking ID:</p>
              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                {`router.push('/flights/booking-success?bookingId=YOUR_BOOKING_ID');`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. Use the Reusable Component
              </h3>
              <p>
                You can also use the FlightBookingSuccess component directly in
                other pages:
              </p>
              <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-x-auto">
                {`<FlightBookingSuccess 
  bookingData={bookingData}
  onDownload={handleDownload}
  onPrint={handlePrint}
  onWhatsAppShare={handleWhatsApp}
  showActions={true}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
