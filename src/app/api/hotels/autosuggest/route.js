import axios from "axios";

export async function GET(request) {
  console.log("Hotels autosuggest GET request received");
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");

    // Validate required parameters
    if (!term || term.trim().length === 0) {
      return Response.json(
        {
          error: "Missing required parameter: term",
        },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Forward the request to the backend API
    const response = await axios.get(`${baseUrl}/api/hotels/autosuggest`, {
      params: {
        term: term.trim(),
      },
    });

    console.log("Hotels autosuggest response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotels autosuggest GET error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to fetch hotel autosuggestions";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
