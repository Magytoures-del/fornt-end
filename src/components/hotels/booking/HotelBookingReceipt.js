"use client";

import React, { forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { localizeCurrency, localizeNumber } from "@/utils/numberLocalization";
import SARCurrencyIcon from "@/components/common/SARCurrencyIcon";

const formatDate = (value, locale = "en") => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      calendar: "gregory",
    });
  } catch (error) {
    return value;
  }
};

const formatDateTime = (value, locale = "en") => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "gregory",
    });
  } catch (error) {
    return value;
  }
};

const formatCurrency = (amount, currency = "SAR", locale = "en") => {
  // For SAR, return JSX with icon, otherwise use localizeCurrency
  if (currency === "SAR") {
    const formattedAmount = localizeNumber(amount, locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <span className="inline-flex items-center gap-1" dir="ltr">
        <SARCurrencyIcon className="w-4 h-4 inline-flex" /> {formattedAmount}
      </span>
    );
  }
  return localizeCurrency(amount, currency, locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const HotelBookingReceipt = forwardRef(
  ({ bookingDetails = {}, bookingData = {}, paymentResponse = {} }, ref) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language || "en";

    // Extract data from new response structure
    const hotelInfo = bookingDetails?.HotelInfo || {};
    const rooms = bookingDetails?.Rooms || [];
    const contactInfo = bookingDetails?.ContactInfo || {};
    const moreInfo = bookingDetails?.MoreInfo || [];
    const hotelFacilities = bookingDetails?.HotelFacilities || [];

    const referenceNumber =
      bookingDetails?.TransactionId ||
      bookingDetails?.TransactionID ||
      bookingDetails?.BookingConfirmationId ||
      paymentResponse?.TransactionID ||
      "-";

    const hotelName = hotelInfo?.Name || bookingData?.hotel?.name || t("hotels.details.booking.receipt.hotel", "Hotel");
    const hotelAddress = hotelInfo?.HotelAddress || {};
    const fullAddress = [
      hotelAddress.AddressLine1,
      hotelAddress.AddressLine2,
      hotelAddress.City,
      hotelAddress.State,
      hotelAddress.Country,
      hotelAddress.ZIP,
    ]
      .filter(Boolean)
      .join(", ");

    const totals = useMemo(
      () => ({
        netAmount: bookingDetails?.NetFare || bookingDetails?.NetAmount || bookingData?.room?.totalPrice || 0,
        grossAmount: bookingDetails?.GrossFare || bookingDetails?.GrossAmount || bookingData?.room?.grossPrice || 0,
        paymentStatus: bookingDetails?.PaymentStatus || paymentResponse?.Code || "-",
      }),
      [bookingDetails, bookingData, paymentResponse]
    );

    const getStatusLabel = (status) => {
      if (!status) return t("hotels.details.booking.receipt.status.confirmed", "Confirmed");
      const statusMap = {
        B0: t("hotels.details.booking.receipt.status.booked", "Booked"),
        I8: t("hotels.details.booking.receipt.status.pending", "Pending"),
        CONFIRMED: t("hotels.details.booking.receipt.status.confirmed", "Confirmed"),
      };
      return statusMap[status] || status;
    };

    const getPaymentStatusLabel = (status) => {
      if (!status) return t("hotels.details.booking.receipt.payment.paid", "Paid");
      const statusMap = {
        I8: t("hotels.details.booking.receipt.payment.pending", "Pending"),
        PAID: t("hotels.details.booking.receipt.payment.paid", "Paid"),
      };
      return statusMap[status] || status;
    };

    return (
      <div
        ref={ref}
        className="bg-white text-gray-900 max-w-4xl mx-auto rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5">
          <h2 className="text-xl font-semibold">{t("hotels.details.booking.receipt.title", "Hotel Booking Receipt")}</h2>
          <p className="text-sm text-blue-100 mt-1">
            {t("hotels.details.booking.receipt.reference", "Reference")}: {referenceNumber}
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Booking Summary */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
              {t("hotels.details.booking.receipt.booking_summary", "Booking Summary")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.hotel", "Hotel")}</p>
                <p className="font-medium text-gray-900">{hotelName}</p>
                {hotelInfo.StarRating && (
                  <p className="text-xs text-yellow-600">
                    {"★".repeat(parseInt(hotelInfo.StarRating))} {t("hotels.details.booking.receipt.star_rating", "Star Rating")}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.transaction_id", "Transaction ID")}</p>
                <p className="font-medium text-gray-900">{referenceNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.booking_confirmation", "Booking Confirmation")}</p>
                <p className="font-medium text-gray-900">
                  {bookingDetails?.BookingConfirmationId || "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.tui", "TUI")}</p>
                <p className="font-mono text-xs break-all text-gray-900">
                  {bookingDetails?.TUI || "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.booking_status", "Booking Status")}</p>
                <p className="font-medium text-gray-900 uppercase">
                  {getStatusLabel(bookingDetails?.BookingStatus || bookingDetails?.CurrentStatus)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.issued_date", "Issued Date")}</p>
                <p className="font-medium text-gray-900">
                  {formatDateTime(bookingDetails?.IssuedDate, locale)}
                </p>
              </div>
            </div>
          </section>

          {/* Hotel Information */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
              {t("hotels.details.booking.receipt.hotel_information", "Hotel Information")}
            </h3>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-sm space-y-3">
              <div>
                <p className="text-gray-500">{t("hotels.details.booking.receipt.address", "Address")}</p>
                <p className="font-medium text-gray-900">{fullAddress || "-"}</p>
              </div>
              {hotelInfo.Phone && (
                <div>
                  <p className="text-gray-500">{t("hotels.details.booking.receipt.phone", "Phone")}</p>
                  <p className="font-medium text-gray-900">{hotelInfo.Phone}</p>
                </div>
              )}
              {hotelInfo.Latitude && hotelInfo.Longitude && (
                <div>
                  <p className="text-gray-500">{t("hotels.details.booking.receipt.location", "Location")}</p>
                  <p className="font-medium text-gray-900">
                    {hotelInfo.Latitude}, {hotelInfo.Longitude}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Dates & Check-in/out */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
              {t("hotels.details.booking.receipt.dates", "Dates")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="border border-gray-200 rounded-xl p-4 bg-blue-50">
                <p className="text-gray-500 mb-1">{t("hotels.details.booking.receipt.check_in", "Check-in")}</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {formatDate(bookingDetails?.CheckInDate || bookingData?.dates?.checkIn, locale)}
                </p>
                {bookingDetails?.CheckInTime && (
                  <p className="text-xs text-gray-600 mt-1">
                    {t("hotels.details.booking.receipt.time", "Time")}: {bookingDetails.CheckInTime}
                  </p>
                )}
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-green-50">
                <p className="text-gray-500 mb-1">{t("hotels.details.booking.receipt.check_out", "Check-out")}</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {formatDate(bookingDetails?.CheckOutDate || bookingData?.dates?.checkOut, locale)}
                </p>
                {bookingDetails?.CheckOutTime && (
                  <p className="text-xs text-gray-600 mt-1">
                    {t("hotels.details.booking.receipt.time", "Time")}: {bookingDetails.CheckOutTime}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Rooms & Guests */}
          {rooms.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t("hotels.details.booking.receipt.rooms_guests", "Rooms & Guests")}
              </h3>
              <div className="space-y-4">
                {rooms.map((room, roomIndex) => (
                  <div key={roomIndex} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900">{room.Name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {t("hotels.details.booking.receipt.adults", "Adults")}: {room.NumberOfAdults}
                        </span>
                        {room.NumberOfChildren > 0 && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {t("hotels.details.booking.receipt.children", "Children")}: {room.NumberOfChildren}
                          </span>
                        )}
                        {room.Refundable === "True" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {t("hotels.details.booking.receipt.refundable", "Refundable")}
                          </span>
                        )}
                        {room.RoomBoardBasis?.[0] && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {room.RoomBoardBasis[0].name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Room Rates */}
                    {room.RoomRates?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">{t("hotels.details.booking.receipt.room_rates", "Room Rates")}</p>
                        {room.RoomRates.map((rate, rateIndex) => (
                          <div key={rateIndex} className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t("hotels.details.booking.receipt.base_rate", "Base Rate")}</span>
                              <span className="font-medium">{formatCurrency(rate.BaseRate, "SAR", locale)}</span>
                            </div>
                            {rate.ServiceCharge > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">{t("hotels.details.booking.receipt.service_charge", "Service Charge")}</span>
                                <span className="font-medium">{formatCurrency(rate.ServiceCharge, "SAR", locale)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-semibold pt-1 border-t">
                              <span>{t("hotels.details.booking.receipt.total_rate", "Total Rate")}</span>
                              <span>{formatCurrency(rate.TotalRate, "SAR", locale)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Guests in Room */}
                    {room.Guests?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">{t("hotels.details.booking.receipt.guests", "Guests")}</p>
                        {room.Guests.map((guest, guestIndex) => (
                          <div key={guestIndex} className="text-xs space-y-1 mb-2">
                            <p className="font-medium text-gray-900">
                              {[guest.Title, guest.FirstName, guest.LastName].filter(Boolean).join(" ")}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-gray-600">
                              <span>{t("hotels.details.booking.receipt.email", "Email")}: {guest.Email || "-"}</span>
                              <span>{t("hotels.details.booking.receipt.phone", "Phone")}: {guest.MobileNumber || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Payment Details */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
              {t("hotels.details.booking.receipt.payment_details", "Payment Details")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.payment_status", "Payment Status")}</p>
                <p className="font-medium text-gray-900">
                  {getPaymentStatusLabel(totals.paymentStatus)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.payment_type", "Payment Type")}</p>
                <p className="font-medium text-gray-900">
                  {bookingDetails?.PaymentType || bookingDetails?.PaymentMode || t("hotels.details.booking.receipt.online", "Online")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.gross_fare", "Gross Fare")}</p>
                <p className="font-medium text-gray-900">
                  {formatCurrency(totals.grossAmount, "SAR", locale)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">{t("hotels.details.booking.receipt.net_fare", "Net Fare")}</p>
                <p className="font-medium text-gray-900 text-lg">
                  {formatCurrency(totals.netAmount, "SAR", locale)}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          {contactInfo && Object.keys(contactInfo).length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t("hotels.details.booking.receipt.contact_information", "Contact Information")}
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-gray-500">{t("hotels.details.booking.receipt.name", "Name")}</p>
                    <p className="font-medium text-gray-900">
                      {[contactInfo.Title, contactInfo.FName, contactInfo.LName]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">{t("hotels.details.booking.receipt.email", "Email")}</p>
                    <p className="font-medium text-gray-900">{contactInfo.Email || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">{t("hotels.details.booking.receipt.phone", "Phone")}</p>
                    <p className="font-medium text-gray-900">
                      {contactInfo.MobileCountryCode
                        ? `${contactInfo.MobileCountryCode} ${contactInfo.Mobile || ""}`
                        : contactInfo.Mobile || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">{t("hotels.details.booking.receipt.address", "Address")}</p>
                    <p className="font-medium text-gray-900">
                      {[
                        contactInfo.Address,
                        contactInfo.City,
                        contactInfo.State,
                        contactInfo.PIN,
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Important Information */}
          {moreInfo.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t("hotels.details.booking.receipt.important_information", "Important Information")}
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 bg-yellow-50 text-sm space-y-3">
                {moreInfo.map((info, index) => (
                  <div key={index} className="border-l-4 border-yellow-400 pl-3">
                    <p className="font-medium text-gray-900 mb-1">{info.Name || info.Code}</p>
                    <p className="text-gray-700 whitespace-pre-line text-xs">
                      {info.Description || "-"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hotel Facilities */}
          {hotelFacilities.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t("hotels.details.booking.receipt.hotel_facilities", "Hotel Facilities")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {hotelFacilities.slice(0, 10).map((facility, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                  >
                    {facility.name}
                  </span>
                ))}
                {hotelFacilities.length > 10 && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                    +{hotelFacilities.length - 10} {t("hotels.details.booking.receipt.more", "more")}
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Remarks */}
          {bookingDetails?.Remarks?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                {t("hotels.details.booking.receipt.remarks", "Remarks")}
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 bg-white text-sm">
                <ul className="space-y-3">
                  {bookingDetails.Remarks.map((remark, index) => (
                    <li key={index} className="border-l-4 border-blue-200 pl-3">
                      <p className="text-gray-700 whitespace-pre-line">{remark?.Remarks || "-"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {remark?.RecievedFrom || t("hotels.details.booking.receipt.system", "System")} • {remark?.RecievedDate || "-"}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-4 text-xs text-gray-500 flex justify-between items-center">
          <span>{t("hotels.details.booking.receipt.generated_on", "Generated on")} {formatDateTime(new Date(), locale)}</span>
          <span>{t("hotels.details.booking.receipt.flymoon_hotels", "Flymoon Hotels")}</span>
        </div>
      </div>
    );
  }
);

HotelBookingReceipt.displayName = "HotelBookingReceipt";

export default HotelBookingReceipt;
