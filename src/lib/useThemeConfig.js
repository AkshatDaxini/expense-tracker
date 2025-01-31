import { Appearance } from "react-native";

export const lightTheme = {
  backgroundColor: "red",
  textColor: "#000000",
  primaryColor: "#6200EE",
};

export const darkTheme = {
  backgroundColor: "orange",
  textColor: "#ffffff",
  primaryColor: "orange",
};

export const useThemeConfig = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
