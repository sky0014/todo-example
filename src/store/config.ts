import { createStore } from "@sky0014/store";
import { ThemeConfig, theme } from "antd";

type ThemeName = "auto" | "light" | "dark";

export const themes: Record<Exclude<ThemeName, "auto">, ThemeConfig> = {
  light: {
    components: {
      Checkbox: {
        colorPrimary: "#d9d9d9",
        colorPrimaryHover: "#8c8c8c",
      },
    },
  },
  dark: {
    algorithm: theme.darkAlgorithm,

    components: {
      Checkbox: {
        colorPrimary: "#434343",
        colorPrimaryHover: "#595959",
      },
    },
  },
};

class Config {
  theme: ThemeName = "auto";

  changeTheme(theme: ThemeName) {
    this.theme = theme;
  }
}

export const config = createStore(new Config());
