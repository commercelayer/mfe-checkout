import type { SettingsGlobalAppStoryblok } from "@typings/storyblok"
import type { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { partnerId } = req.query
  if (!partnerId || typeof partnerId !== "string") {
    return res.status(400).json({ message: "Invalid partner ID" })
  }

  const token = process.env.SB_TOKEN
  const partner = partnerId
  const isProduction = process.env.NODE_ENV === "production"
  console.log("Fetching settings for partner:", partner)
  const deliveryId = "_settings"
  const url = `https://api-us.storyblok.com/v2/cdn/stories/${partner}/${deliveryId}?token=${token}&version=${isProduction ? "published" : "draft"}`
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  let response: { story: SettingsGlobalAppStoryblok } | undefined

  try {
    response = await (await fetch(url, options)).json()

    console.log("Response from Storyblok:", response)
    if (!response || !response.story) {
      console.error("Settings not found for partner:", partner)
      return res.status(404).json({ message: "Settings not found" })
    }

    console.log("SERVER: Settings fetched successfully for partner:", response)
    // return res.status(200).json(response.story)
    return NextResponse.json({ message: 'TEST' })
  } catch (error: any) {
    console.error("Error fetching order settings:", error)
    return res
      .status(error.statusCode ?? 500)
      .json({ message: "Storyblok request error" })
  }
}
