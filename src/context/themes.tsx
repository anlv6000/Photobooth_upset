// src/context/themes.ts
export interface Theme {
  background: string;
  header: string;
  footer: string;
}

export type ThemeKey = "wedding" | "birthday" | "corporate" | "festival";

export const themes: Record<ThemeKey, Theme> = {
  wedding: {
    background: "/assets/images/theme/ezop2.png",
    header: "/assets/images/theme/ezop4.png",
    footer: "/assets/images/theme/ezop3.png",
  },
  birthday: {
    background: "/assets/images/theme/birthday-bg.png",
    header: "/assets/images/theme/birthday-header.png",
    footer: "/assets/images/theme/birthday-footer.png",
  },
  corporate: {
    background: "/assets/images/theme/corporate-bg.png",
    header: "/assets/images/theme/corporate-header.png",
    footer: "/assets/images/theme/corporate-footer.png",
  },
  festival: {
    background: "/assets/images/theme/festival-bg.png",
    header: "/assets/images/theme/festival-header.png",
    footer: "/assets/images/theme/festival-footer.png",
  },
};
