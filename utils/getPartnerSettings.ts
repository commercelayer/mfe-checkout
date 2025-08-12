export async function getPartnerSettings(partnerId: string) {
    const response = await fetch(`/api/partner-settings/${partnerId}`);
    console.log("Fetching partner settings for:", partnerId);
    console.log("Response status:", response.status);
    console.log("Response headers:", response);
    if (!response.ok) {
        throw new Error(`Failed to fetch partner settings: ${response.statusText}`);
    }
    
    const data = await response;
    return data;
}