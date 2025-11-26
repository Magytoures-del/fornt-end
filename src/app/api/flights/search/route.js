import axios from "axios";

export async function POST(request) {
  console.log("Flight search POST request received");
  try {
    const body = await request.json();

    const {
      origin,
      destination,
      outboundDate,
      inboundDate = "",
      adults = 1,
      children = 0,
      infants = 0,
      cabinClass = "E",
      isDirect = false,
    } = body;

    // Validate required parameters
    if (!origin || !destination || !outboundDate) {
      return Response.json(
        {
          error:
            "Missing required parameters: origin, destination, outboundDate",
        },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://apib2c.flymoonsa.com/api/flights/search",
      {
        adults,
        children,
        infants,
        cabinClass,
        origin,
        destination,
        outboundDate,
        inboundDate: inboundDate || "",
        isDirect: isDirect === "true",
      }
    );
    console.log(response.data);
    // Generate a unique search cID

    // Simulate API delay

    return Response.json({
      success: true,
      data: response.data,
      message:
        "Search initiated successfully. Use the search_id to get results.",
    });
  } catch (error) {
    console.error("Flight search POST error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
