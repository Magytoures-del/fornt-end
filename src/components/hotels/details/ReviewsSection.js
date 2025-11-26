"use client";

import React, { useState } from "react";
import { LuStar, LuThumbsUp, LuThumbsDown, LuFilter } from "react-icons/lu";
import { useTranslation } from "react-i18next";

export default function ReviewsSection({ hotel }) {
  const { t } = useTranslation();
  const [filterRating, setFilterRating] = useState("all");

  // Get review data from API
  const reviewData =
    hotel?.reviews && hotel.reviews.length > 0 ? hotel.reviews[0] : null;
  const overallRating = reviewData?.rating || hotel?.reviewScore || 4.2;
  const totalReviews = reviewData?.count || hotel?.reviewCount || 371;

  const reviews = [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      country: "Saudi Arabia",
      rating: 5,
      date: "2 days ago",
      title: "Amazing stay with incredible views!",
      content:
        "The hotel exceeded all our expectations. The Bosphorus view from our room was breathtaking, and the staff was incredibly helpful and friendly. The breakfast was delicious with many options. Highly recommended!",
      helpful: 12,
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      country: "United States",
      rating: 4,
      date: "1 week ago",
      title: "Great location and service",
      content:
        "Perfect location for exploring Istanbul. The hotel is clean, modern, and the staff speaks excellent English. The only minor issue was the WiFi speed in our room, but overall a great experience.",
      helpful: 8,
      verified: true,
    },
    {
      id: 3,
      name: "Mohammed Hassan",
      country: "UAE",
      rating: 5,
      date: "2 weeks ago",
      title: "Luxury at its finest",
      content:
        "This hotel defines luxury. From the moment we arrived, everything was perfect. The concierge helped us plan our entire Istanbul itinerary. The spa services were outstanding. Worth every penny!",
      helpful: 15,
      verified: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      country: "United Kingdom",
      rating: 3,
      date: "3 weeks ago",
      title: "Good but could be better",
      content:
        "The hotel is nice and the location is convenient, but I expected more for the price. The room was clean but smaller than expected. The breakfast was good but not exceptional. Overall okay experience.",
      helpful: 5,
      verified: false,
    },
  ];

  // Default rating distribution (since API doesn't provide this)
  const ratingDistribution = {
    5: 68,
    4: 22,
    3: 7,
    2: 2,
    1: 1,
  };

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <LuStar
        key={i}
        className={`${size} ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(filterRating));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          {t("hotels.details.reviews.title")}
        </h2>
      </div>

      <div className="p-6">
        {/* Overall Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rating Overview */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {overallRating}
                </div>
                <div className="flex items-center gap-1 mb-1">
                  {renderStars(Math.floor(overallRating), "w-5 h-5")}
                </div>
                <div className="text-sm text-gray-600">
                  {totalReviews} {t("hotels.details.reviews.reviews_count")}
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 w-8">
                        {rating}
                      </span>
                      <LuStar className="w-4 h-4 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${ratingDistribution[rating]}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {ratingDistribution[rating]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              {t("hotels.details.reviews.filter_by_rating")}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilterRating("all")}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  filterRating === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-50"
                }`}
              >
                {t("hotels.details.reviews.all_reviews_count")} (
                {reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating.toString())}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    filterRating === rating.toString()
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                  </div>
                  <span>
                    ({reviews.filter((r) => r.rating === rating).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {t("hotels.details.reviews.verified")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{review.country}</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              <h5 className="font-semibold text-gray-900 mb-2">
                {review.title}
              </h5>
              <p className="text-gray-600 leading-relaxed mb-3">
                {review.content}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <LuThumbsUp className="w-4 h-4" />
                  <span>
                    {t("hotels.details.reviews.helpful")} ({review.helpful})
                  </span>
                </button>
                <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                  <LuThumbsDown className="w-4 h-4" />
                  <span>{t("hotels.details.reviews.not_helpful")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Reviews */}
        <div className="text-center mt-6">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            {t("hotels.details.reviews.load_more")}
          </button>
        </div>
      </div>
    </div>
  );
}
