
export const runtime = "nodejs";

export async function GET(
  req: Request,
  context: { params: Promise<{ "partner-id": string }> }
) {
  const params = await context.params;
  const partnerId = params["partner-id"];
  console.log("API partner-settings called with partnerId:", partnerId);

  if (!partnerId) {
    return new Response(JSON.stringify({ message: "Invalid partner ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = process.env.SB_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";
  const deliveryId = "_settings";
  const url = `https://api-us.storyblok.com/v2/cdn/stories/${partnerId}/${deliveryId}?token=${token}&version=${isProduction ? "published" : "draft"}`;
  
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
      return new Response(JSON.stringify({ message: "Settings not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    const json = await res.json();

    if (!json.story) {
      return new Response(JSON.stringify({ message: "Settings not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(json.story), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Storyblok settings:", error);
    return new Response(JSON.stringify({ message: "Storyblok request error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
