import axios from "axios";

export async function POST(request) {
  console.log("Itinerary create POST request received");
  try {
    const body = await request.json();
    console.log("Booking request body:", body);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Forward the request to the backend API
    const response = await axios.post(`${baseUrl}/api/itinerary/create`, body);

    console.log("Itinerary create response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Itinerary create POST error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to create booking";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
