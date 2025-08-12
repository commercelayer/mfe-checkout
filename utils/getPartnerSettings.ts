import { SettingsGlobalAppStoryblok } from "@typings/storyblok";

const DEFAULT_PARTNER_SETTINGS: PartnerSettings =  {brandColors: {dark: "#000A1C", accent: "#003596", base: "#F1F2F9" }}


export async function getPartnerSettings(partnerId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
       try {const response = await fetch(`${baseUrl}/api/partner-settings/${partnerId}`, { method: "GET", headers: { "Content-Type": "application/json" }});
       const data: {story: {content: SettingsGlobalAppStoryblok}} =await response.json();
       if (!data?.story?.content) {
        throw new Error("Settings not found");
       }
       return mapPartnerThemeFromSettings(data.story.content);
     } catch (error) {
        console.error("Error fetching partner settings:", error);
        console.info("Returning default settings");
        return DEFAULT_PARTNER_SETTINGS;
     }
   
}

export function mapPartnerThemeFromSettings(data: SettingsGlobalAppStoryblok) {
    return {
        brandColors: {
            dark: data?.dark || DEFAULT_PARTNER_SETTINGS.dark,
            accent: data?.accent || DEFAULT_PARTNER_SETTINGS.accent,
            base: data?.base || DEFAULT_PARTNER_SETTINGS.base,
        }
    }
}