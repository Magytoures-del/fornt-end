import axios from "axios";

export async function POST(request) {
  console.log("Flight price check POST request received");

  try {
    const body = await request.json();
    const { bookingID } = body;

    // Validate required parameters
    if (!bookingID) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: bookingID",
        },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await axios.post(
      "https://apib2c.flymoonsa.com/api/flights/check_price",
      {
        bookingID: bookingID,
      }
    );

    console.log("Backend price check response:", response.data);

    // Return the response from the backend
    return Response.json(response.data);
  } catch (error) {
    console.error("Price check API error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to check flight price";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
