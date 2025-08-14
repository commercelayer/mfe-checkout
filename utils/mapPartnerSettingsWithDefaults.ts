import { SettingsGlobalAppStoryblok } from "@typings/storyblok";

const DEFAULT_PARTNER_SETTINGS: PartnerSettings =  {brandColors: {dark: "#000A1C", accent: "#003596", base: "#F1F2F9" }, headerLogo: {alt: '', image: ''}};

export function mapPartnerSettingsWithDefaults(data: NullableType<SettingsGlobalAppStoryblok>) {
    return {
        brandColors: {
            dark: data?.dark || DEFAULT_PARTNER_SETTINGS.brandColors.dark,
            accent: data?.accent || DEFAULT_PARTNER_SETTINGS.brandColors.accent,
            base: data?.base || DEFAULT_PARTNER_SETTINGS.brandColors.base,
        },
        headerLogo: {alt: data?.logo?.alt ?? '', image: data?.logo?.filename ?? ''},
    }
}