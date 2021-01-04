export const apiRequestHeaders = (accessToken: string) => {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: "Bearer " + accessToken,
  }
}
