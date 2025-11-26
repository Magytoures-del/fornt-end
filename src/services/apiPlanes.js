import axios from "axios";

export const locationSearch = async (term, lan) => {
  try {
    const res = await axios.get("/api/planes/location/search", {
      params: {
        term: term,
        lan: lan,
      },
    });

    // Handle the response data here
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.error || "Failed to search locations");
    }
  } catch (error) {
    // Handle errors here
    console.error("Location search error:", error);
    return error.response?.data?.error || error.message;
  }
};

export const getCityById = async (id, lan) => {
  try {
    const res = await axios.get("/api/planes/location/id", {
      params: {
        id,
        lan: lan,
      },
    });

    // Handle the response data here
    if (res.data.success) {
      return res.data.data;
    } else {
      throw new Error(res.data.error || "Failed to get city");
    }
  } catch (error) {
    // Handle errors here
    console.error("Get city by ID error:", error);
    return error.response?.data?.error || error.message;
  }
};
