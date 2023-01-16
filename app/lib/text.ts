export function getLiteTextColor (colorMode: "light" | "dark") {
  return colorMode === "light" ?
    "blackAlpha.700" :
    "whiteAlpha.700";
}