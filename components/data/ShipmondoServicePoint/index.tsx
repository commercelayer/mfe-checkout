export const fetchServicePoints = async (zipcode: string) => {
  if (!zipcode || zipcode.length !== 4) {
    return []
  }

  if (
    !process.env.NEXT_PUBLIC_SHIPMONDO_API_URL ||
    !process.env.NEXT_PUBLIC_SHIPMONDO_API_USER ||
    !process.env.NEXT_PUBLIC_SHIPMONDO_API_KEY
  ) {
    console.error("NEXT_PUBLIC_SHIPMONDO_API_* are not defined")
    return []
  }

  try {
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_SHIPMONDO_API_USER}:${process.env.NEXT_PUBLIC_SHIPMONDO_API_KEY}`
    ).toString("base64")

    const options = {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Basic ${auth}` },
    }

    const shipmondoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SHIPMONDO_API_URL}/pickup_points?zipcode=${zipcode}&country_code=DK&carrier_code=gls`,
      options
    )

    const shipmondoServicePoints = await shipmondoResponse.json()

    return shipmondoServicePoints
  } catch (error) {
    console.error("Error fetching shipmondo service points", error)
    return []
  }
}
