import axios from "axios";

export async function GET(request, { params }) {
  console.log("Hotels search result content GET request received");
  try {
    const { searchId } = await params;

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

    // Extract query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const offset = searchParams.get("offset") || "-1";
    const filterdata = searchParams.get("filterdata") || "false";

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Build query parameters for backend API
    const queryParams = new URLSearchParams({
      limit,
      offset,
      filterdata,
    });

    // Forward the request to the backend API with pagination params
    const response = await axios.get(
      `${baseUrl}/api/hotels/search/result/${searchId}/content?${queryParams.toString()}`
    );

    console.log("Hotels search result content response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotels search result content GET error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch hotel search results";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
