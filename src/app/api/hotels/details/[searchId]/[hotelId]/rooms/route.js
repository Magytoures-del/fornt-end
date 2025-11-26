import axios from "axios";

export async function GET(request, { params }) {
  console.log("Hotel details rooms GET request received");
  try {
    const { searchId, hotelId } = await params;

    // Validate required parameters
    if (!searchId) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: searchId",
        },
        { status: 400 }
      );
    }

    if (!hotelId) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: hotelId",
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Forward the request to the backend API
    const response = await axios.get(
      `${baseUrl}/api/hotels/details/${searchId}/${hotelId}/rooms`
    );

    console.log("Hotel details rooms response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel details rooms GET error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch hotel rooms";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
