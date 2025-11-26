import axios from "axios";

export async function POST(request) {
  console.log("Hotels itinerary create POST request received");
  try {
    const body = await request.json();
    console.log("Hotels booking request body:", body);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Forward the request to the backend API
    const response = await axios.post(
      `${baseUrl}/api/hotels/itinerary/create`,
      body
    );

    console.log("Hotels itinerary create response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotels itinerary create POST error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to create hotel booking";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
