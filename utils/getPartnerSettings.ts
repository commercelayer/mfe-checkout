import { SettingsGlobalAppStoryblok } from "@typings/storyblok";

export async function getPartnerSettings(partnerId: string) {
       try {
        const response = await fetch(`/api/partner-settings?partner-id=${partnerId}`, { method: "GET",  headers: { "Content-Type": "application/json" }});
       const data: {content: SettingsGlobalAppStoryblok} = await response.json();
       if (!data?.content) {
        throw new Error("Settings not found");
       }
       return data.content;
     } catch (error) {
        console.error("Error fetching partner settings:", error);
        console.info("Returning default settings");
        return undefined;
     }
   
}