export async function getPartnerSettings(partnerId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = `${baseUrl}/api/partner-settings/${partnerId}`
    console.log("Fetching partner settings from:", url)
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    // console.log("Fetching partner settings for:", partnerId);
    // console.log("Response status:", response.status);
    // console.log("Response headers:", response.headers);
    // if (!response.ok) {
    //     throw new Error(`Failed to fetch partner settings: ${response.statusText}`);
    // }
    const data = await response.json();
    console.log("Response data:", data);

    return data;
}