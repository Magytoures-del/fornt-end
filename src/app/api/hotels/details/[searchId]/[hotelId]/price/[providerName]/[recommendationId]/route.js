import axios from "axios";

export async function GET(request, { params }) {
  console.log("Hotel price GET request received");
  try {
    const { searchId, hotelId, providerName, recommendationId } = await params;

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

    if (!providerName) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: providerName",
        },
        { status: 400 }
      );
    }

    if (!recommendationId) {
      return Response.json(
        {
          success: false,
          error: "Missing required parameter: recommendationId",
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Forward the request to the backend API
    const response = await axios.get(
      `${baseUrl}/api/hotels/details/${searchId}/${hotelId}/price/${providerName}/${recommendationId}`
    );

    console.log("Hotel price response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotel price GET error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch hotel price";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
