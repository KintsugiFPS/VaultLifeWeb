// Design tokens and theme configuration
export const theme = {
  colors: {
    background: "#0A0B1E",
    surface: "#1A1B2E",
    surfaceLight: "rgba(26, 27, 46, 0.5)",
    border: "#2D2E47",
    borderLight: "rgba(45, 46, 71, 0.3)",
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B1C3",
      muted: "#7A7B8F",
    },
    accent: {
      primary: "#6C5CE7",
      light: "#9B88D9",
      lighter: "#E8E4F7",
    },
    status: {
      success: "#00B894",
      warning: "#FDCB6E",
      danger: "#E84C3D",
      info: "#0984E3",
    },
    category: {
      food: "#FF6B6B",
      transport: "#4ECDC4",
      rent: "#FFE66D",
      shopping: "#FF8B94",
      utilities: "#74B9FF",
      subscriptions: "#A29BFE",
      education: "#FD79A8",
      other: "#DFEEF9",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px",
  },
  typography: {
    family: {
      sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    size: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  },
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  categoryEmoji: {
    food: "🍔",
    transport: "🚗",
    rent: "🏠",
    shopping: "🛍️",
    utilities: "⚡",
    subscriptions: "📱",
    education: "📚",
    other: "📌",
  },
} as const;

export type Theme = typeof theme;
