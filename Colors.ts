
const themeColors = {
  light: {
    backColor: "#F9F7F7",
    deactiveColor: "#DBE2EF",
    activeColor: "#3F72AF",
    textColor: "#112D4E",
  }, 
  dark: {
    backColor: "#222831",
    deactiveColor: "#393E46",
    activeColor: "#00ADB5",
    textColor: "#EEEEEE",
  }
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;

export { themeColors, Color };