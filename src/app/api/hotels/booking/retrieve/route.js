import axios from "axios";

export async function POST(request) {
  console.log("Hotels booking retrieve POST request received");

  try {
    const body = await request.json();
    console.log("Hotels booking retrieve request body:", body);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    const response = await axios.post(
      `${baseUrl}/api/hotels/booking/retrieve`,
      body
    );

    console.log("Hotels booking retrieve response:", response.data);

    return Response.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Hotels booking retrieve POST error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to retrieve hotel booking";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
