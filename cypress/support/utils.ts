export const apiRequestHeaders = (accessToken: string) => {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + accessToken,
  }
}

export const euAddress = {
  city: "Cogorno",
  country: "Italy",
  country_code: "IT",
  customer_email: "customer@example.it",
  first_name: "Darth",
  last_name: "Vader",
  line_1: "Via Morte Nera, 13",
  phone: "+39 055 1234567890",
  state_code: "GE",
  zip_code: "16030",
  // other_phone: '+39 055 0987654321',
  // billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ',
}

export const euAddress2 = {
  city: "Canguro",
  country: "Italy",
  country_code: "IT",
  customer_email: "customer@example.it",
  first_name: "Spider",
  last_name: "Man",
  line_1: "Ragnatela, 99",
  phone: "+39 010 010101010",
  state_code: "RN",
  zip_code: "32100",
  // other_phone: '+39 055 0987654321',
  // billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ',
}
