export const apiRequestHeaders = (accessToken: string) => {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + accessToken,
  }
}

export const euAddress = {
  firstName: "Darth",
  lastName: "Vader",
  line1: "Via Morte Nera, 13",
  line2: "Ragnatela, 99",
  city: "Cogorno",
  countryCode: "IT",
  stateCode: "GE",
  zipCode: "16030",
  phone: "+39 055 1234567890",
  billingInfo: "ABCDEFGHIJKLMNOPQRSTUVWYXZ",
}

export const euAddress2 = {
  firstName: "Spider",
  lastName: "Man",
  line1: "Ragnatela, 99",
  line2: "Via Morte Nera, 13",
  city: "Canguro",
  countryCode: "FR",
  stateCode: "RE",
  zipCode: "32100",
  phone: "+39 010 010101010",
  billingInfo: "0ABCDEFGHIJKLMNOPQRSTUVWYX",
}

export const euAddress3 = {
  firstName: "Sponge",
  lastName: "Bob",
  line1: "Sott'acqua, 1",
  line2: "Via Morte Nera, 13",
  city: "Besciamella",
  countryCode: "IT",
  stateCode: "TO",
  zipCode: "010101",
  phone: "+39 123 321123123",
  billingInfo: "00CDEFGHIJKLMNOPQRSTUVWYXZ",
}
