import { createStore } from "@sky0014/store";
import { ThemeConfig, theme } from "antd";

type ThemeName = "light" | "dark";

const themes: Record<ThemeName, ThemeConfig> = {
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
  autoTheme = true;

  theme: ThemeName = "light";

  get themeConfig() {
    return themes[this.theme];
  }

  setAutoTheme(autoTheme: boolean) {
    this.autoTheme = autoTheme;
  }

  changeTheme(theme: ThemeName) {
    this.theme = theme;
  }
}

export const config = createStore(new Config());
