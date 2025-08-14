declare namespace Organization {
  type DefaultConfig =
    import('@commercelayer/organization-config').DefaultConfig
}

type NullableType<T> = T | null | undefined
type ChildrenType = JSX.Element[] | JSX.Element | null
interface HSLProps {
  h: number
  s: string
  l: string
}

interface CheckoutSettings {
  accessToken: string
  orderId: string
  orderNumber: string
  validCheckout: true
  isGuest: boolean
  isShipmentRequired: boolean
  endpoint: string
  domain: string
  slug: string
  logoUrl: NullableType<string>
  companyName: string
  partnerId: string
  language: string
  primaryColor: string
  favicon: string
  gtmId: NullableType<string>
  supportEmail: NullableType<string>
  supportPhone: NullableType<string>
  termsUrl: NullableType<string>
  privacyUrl: NullableType<string>
  config: Organization.DefaultConfig | null
}

interface BrandColors {
    dark: string,
    accent: string,
    base: string
}

interface HeaderLogo {
  image: string
  alt: string
}

interface PartnerSettings {
//   brandName: string
    brandColors: BrandColors
    headerLogo: HeaderLogo
//   email: string
//   phone: string
//   linkPartner: string
//   currency: string
//   logoHeaderPath: string
//   logoHeaderAlt: string
//   logoFooterPath: string
//   logoFooterAlt: string
//   faviconIcoPath: string
//   splashFilePath: string
//   splashFileAlt: string
//   splashFileType: string
//   privacyPolicy: string
//   termsAndConditions: string
}

interface InvalidCheckoutSettings {
  validCheckout: false
  retryOnError: boolean
}

type CheckoutPageContextProps = Pick<
  CheckoutSettings,
  | 'accessToken'
  | 'orderId'
  | 'logoUrl'
  | 'isGuest'
  | 'companyName'
  | 'endpoint'
  | 'language'
  | 'primaryColor'
  | 'favicon'
  | 'gtmId'
  | 'supportEmail'
  | 'supportPhone'
  | 'termsUrl'
  | 'privacyUrl'
>
