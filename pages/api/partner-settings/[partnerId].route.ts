import type { SettingsGlobalAppStoryblok } from "@typings/storyblok";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { partnerId } = req.query;
  console.log("API partner-settings called with partnerId:", partnerId);

  if (!partnerId || typeof partnerId !== "string") {
    return res.status(400).json({ message: "Invalid partner ID" });
  }

  const token = process.env.SB_TOKEN;
  const isProduction = process.env.NODE_ENV === "production";
  const deliveryId = "_settings";
  const url = `https://api-us.storyblok.com/v2/cdn/stories/${partnerId}/${deliveryId}?token=${token}&version=${isProduction ? "published" : "draft"}`;
  
  try {
    const response = await fetch(url, { 
      headers: { "Content-Type": "application/json" } 
    });
    
    if (!response.ok) {
      return res.status(404).json({ message: "Settings not found" });
    }
    
    const json = await response.json();

    if (!json.story) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.status(200).json(json.story);
  } catch (error) {
    console.error("Error fetching Storyblok settings:", error);
    return res.status(500).json({ message: "Storyblok request error" });
  }
}
