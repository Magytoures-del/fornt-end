"use client";

import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiLogoutBoxLine,
  RiEditLine,
  RiShieldLine,
  RiFlightTakeoffLine,
  RiHotelLine,
  RiCalendarLine,
  RiMapPinLine,
  RiArrowRightLine,
  RiFileList3Line,
} from "react-icons/ri";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    // Fetch user bookings
    const fetchBookings = async () => {
      if (!user) return;
      
      setBookingsLoading(true);
      try {
        // TODO: Replace with actual API call to fetch user bookings
        // const response = await axios.get('/api/user/bookings');
        // setBookings(response.data);
        
        // Mock data for now
        setTimeout(() => {
          setBookings([]);
          setBookingsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookingsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    console.log("Update profile:", editForm);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">{t("common.loading", "Loading...")}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-20 px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <RiUserLine className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              {t("profile.not_authenticated", "Not Authenticated")}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              {t("profile.please_login", "Please log in to view your profile")}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto"
            >
              {t("common.go_home", "Go Home")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 md:py-12 mt-20 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className={`flex items-center gap-3 sm:gap-4 w-full sm:w-auto ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <RiUserLine className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : t("profile.welcome", "Welcome")}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto justify-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <RiEditLine className="w-4 h-4" />
              <span className="font-medium text-sm">
                {isEditing
                  ? t("common.cancel", "Cancel")
                  : t("common.edit", "Edit")}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content - Personal Information & Bookings */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className={`text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <RiUserLine className="w-5 h-5 text-blue-600" />
                {t("profile.personal_info", "Personal Information")}
              </h2>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                        {t("profile.first_name", "First Name")}
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                        {t("profile.last_name", "Last Name")}
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        dir={isRTL ? "rtl" : "ltr"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                      {t("profile.phone", "Phone Number")}
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                  <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      {t("common.save", "Save Changes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                    >
                      {t("common.cancel", "Cancel")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <RiUserLine className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("profile.first_name", "First Name")}
                        </p>
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {user.firstName ||
                            t("common.not_provided", "Not provided")}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <RiUserLine className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-1">
                          {t("profile.last_name", "Last Name")}
                        </p>
                        <p className="font-semibold text-gray-800 text-sm truncate">
                          {user.lastName ||
                            t("common.not_provided", "Not provided")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RiMailLine className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("profile.email", "Email Address")}
                      </p>
                      <p className="font-semibold text-gray-800 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RiPhoneLine className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">
                        {t("profile.phone", "Phone Number")}
                      </p>
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {user.phone || t("common.not_provided", "Not provided")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className={`text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <RiFileList3Line className="w-5 h-5 text-blue-600" />
                {t("profile.my_bookings", "My Bookings")}
              </h2>

              {bookingsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-600">{t("profile.loading_bookings", "Loading bookings...")}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <RiFileList3Line className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    {t("profile.no_bookings", "No bookings yet")}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
                    {t("profile.no_bookings_desc", "You haven't made any bookings yet. Start exploring our flights and hotels!")}
                  </p>
                  <div className={`flex flex-col sm:flex-row gap-2 justify-center ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                    <button
                      onClick={() => router.push("/flights")}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <RiFlightTakeoffLine className="w-4 h-4" />
                      {t("common.flights", "Flights")}
                    </button>
                    <button
                      onClick={() => router.push("/hotels")}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <RiHotelLine className="w-4 h-4" />
                      {t("common.hotels", "Hotels")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            {booking.type === "flight" ? (
                              <RiFlightTakeoffLine className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            ) : (
                              <RiHotelLine className="w-5 h-5 text-green-600 flex-shrink-0" />
                            )}
                            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                              {booking.title || t("profile.booking", "Booking")} #{booking.reference}
                            </h3>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            {booking.date && (
                              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <RiCalendarLine className="w-4 h-4 flex-shrink-0" />
                                <span>{booking.date}</span>
                              </div>
                            )}
                            {booking.location && (
                              <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <RiMapPinLine className="w-4 h-4 flex-shrink-0" />
                                <span>{booking.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (booking.type === "flight") {
                              router.push(`/flights/details/${booking.tripType || "oneway"}/${booking.id}`);
                            } else {
                              router.push(`/hotels/booking/success?bookingId=${booking.id}`);
                            }
                          }}
                          className={`flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <span>{t("profile.view_details", "View Details")}</span>
                          <RiArrowRightLine className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Account Actions */}
          <div className="space-y-6 sm:space-y-8">
            {/* Account Actions */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className={`text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <RiShieldLine className="w-5 h-5 text-blue-600" />
                {t("profile.account_actions", "Account Actions")}
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // TODO: Implement change password functionality
                    console.log("Change password clicked");
                  }}
                  className={`w-full flex items-center gap-2.5 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <RiShieldLine className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-medium text-sm">{t("profile.change_password", "Change Password")}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2.5 p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <RiLogoutBoxLine className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{t("profile.logout", "Logout")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

