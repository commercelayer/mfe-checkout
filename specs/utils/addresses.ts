import { Address } from "@commercelayer/sdk"

export const euAddress: Partial<Address> = {
  first_name: "Darth",
  last_name: "Vader",
  line_1: "Via Morte Nera, 13",
  line_2: "Ragnatela, 99",
  city: "Cogorno",
  country_code: "IT",
  state_code: "GE",
  zip_code: "16030",
  phone: "+39 055 1234567890",
  billing_info: "ABCDEFGHIJKLMNOPQRSTUVWYXZ",
}

export const euAddress2: Partial<Address> = {
  first_name: "Spider",
  last_name: "Man",
  line_1: "Ragnatela, 99",
  line_2: "Via Morte Nera, 13",
  city: "Canguro",
  country_code: "FR",
  state_code: "RE",
  zip_code: "32100",
  phone: "+39 010 010101010",
  billing_info: "0ABCDEFGHIJKLMNOPQRSTUVWYX",
}

export const euAddress3: Partial<Address> = {
  first_name: "Sponge",
  last_name: "Bob",
  line_1: "Sott'acqua, 1",
  line_2: "Via Morte Nera, 13",
  city: "Besciamella",
  country_code: "IT",
  state_code: "TO",
  zip_code: "010101",
  phone: "+39 123 321123123",
  billing_info: "00CDEFGHIJKLMNOPQRSTUVWYXZ",
}

export const usAddress: Partial<Address> = {
  first_name: "Tim",
  last_name: "Cook",
  line_1: "1 Infinite Loop",
  city: "Cupertino",
  country_code: "US",
  state_code: "CA",
  zip_code: "95014",
  phone: "+1 123 321123123",
}

export function composeForCheck(address: Partial<Address>) {
  return `${address.first_name} ${address.last_name}${address.line_1}${
    address.line_2 ? `, ${address.line_2}` : ""
  }${address.zip_code} ${address.city} - ${address.state_code} (${
    address.country_code
  })${address.phone}`
}
