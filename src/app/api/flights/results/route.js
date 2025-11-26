import axios from "axios";

export async function POST(request) {
  console.log("Flight results POST request received");

  try {
    const body = await request.json();
    const { booking_id, search_id } = body;
    const resolvedSearchId = search_id;
    console.log(resolvedSearchId);
    // Validate required parameters
    if (!resolvedSearchId) {
      return Response.json(
        { error: "Missing required parameter: booking_id or search_id" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    const response = await axios.post(`${baseUrl}/api/flights/results`, {
      search_id: resolvedSearchId,
    });
    console.log(response.data.complete_data);
    console.log(response.data);
    return Response.json({
      success: true,
      data: response.data.data,
      complete_data: response.data.complete_data,
      message: "Results retrieved successfully.",
    });
  } catch (error) {
    const backendStatus = error?.response?.status || 500;
    const backendData = error?.response?.data;
    console.error("Flight results POST error:", backendData || error);
    return Response.json(
      {
        error: "Failed to retrieve results",
        details: backendData || null,
      },
      { status: backendStatus }
    );
  }
}
