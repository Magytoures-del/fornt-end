"use client";

import { useState } from "react";
import PriceCard from "./PriceCard";
import BookingButton from "./BookingButton";
import BookingModal from "./BookingModal";

const PackageClient = ({ offer }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      {/* Sidebar - Right Side */}
      <div className="lg:col-span-1 space-y-8 px-4">
        <PriceCard offer={offer} onClick={() => setIsBookingModalOpen(true)} />
      </div>

      {/* Booking Modal */}
      <BookingModal
        offer={offer}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </>
  );
};

export default PackageClient;
