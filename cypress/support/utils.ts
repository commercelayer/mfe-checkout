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
  countryCode: "IT",
  firstName: "Darth",
  lastName: "Vader",
  line1: "Via Morte Nera, 13",
  phone: "+39 055 1234567890",
  stateCode: "GE",
  zipCode: "16030",
}

export const euAddress2 = {
  city: "Canguro",
  country: "Italy",
  countryCode: "IT",
  firstName: "Spider",
  lastName: "Man",
  line1: "Ragnatela, 99",
  phone: "+39 010 010101010",
  stateCode: "RN",
  zipCode: "32100",
}

export const euAddress3 = {
  city: "Besciamella",
  country: "Italy",
  countryCode: "IT",
  firstName: "Sponge",
  lastName: "Bob",
  line1: "Sott'acqua, 1",
  phone: "+39 123 321123123",
  stateCode: "TO",
  zipCode: "010101",
}
