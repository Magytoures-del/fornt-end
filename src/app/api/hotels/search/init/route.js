import axios from "axios";

export async function POST(request) {
  console.log("Hotels search init POST request received");
  try {
    const body = await request.json();
    console.log("body", body);
    const { location, checkIn, checkOut, guests, nationality, destination } =
      body;

    // Validate required parameters
    // if (!location || !checkIn || !checkOut || !guests) {
    //   return Response.json(
    //     {
    //       success: false,
    //       error:
    //         "Missing required parameters: location, checkIn, checkOut, guests",
    //     },
    //     { status: 400 }
    //   );
    // }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://apib2c.flymoonsa.com";

    // Prepare the request payload
    const payload = body;
    console.log("payload", payload);

    // Forward the request to the backend API
    const response = await axios.post(
      `${baseUrl}/api/hotels/search/init`,
      payload
    );

    console.log("Hotels search init response:", response.data);

    return Response.json({
      success: true,
      data: response.data.data,
    });
  } catch (error) {
    console.error("Hotels search init POST error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to initialize hotel search";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
