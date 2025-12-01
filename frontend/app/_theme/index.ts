import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    // Deep Forest Green
    primary: "#1C4532",
    primaryLight: "#276749",
    primaryDark: "#14352a",
    // Warm Terracotta
    secondary: "#C2644B",
    secondaryLight: "#D87D66",
    secondaryDark: "#9E4F3A",
    // Antique Gold
    accent: "#B68D40",
    accentLight: "#D4A855",
    accentDark: "#8A6A30",
    // Charcoal for text
    text: "#2D2926",
    textMuted: "#5C5552",
    textLight: "#8A8583",
    // Ivory backgrounds
    ivory: "#FAFAF7",
    ivoryDark: "#F5F5F0",
    cream: "#F0EDE6",
    paper: "#E8E4DC",
  },
};

const fonts = {
  heading: `'DM Serif Display', Georgia, serif`,
  body: `'Source Sans 3', 'Hiragino Sans', sans-serif`,
  mono: `'JetBrains Mono', monospace`,
};

const styles = {
  global: {
    "html, body": {
      bg: "brand.ivory",
      color: "brand.text",
      lineHeight: "tall",
      letterSpacing: "0.01em",
    },
    "::selection": {
      bg: "brand.accent",
      color: "white",
    },
    // Noise texture overlay
    "body::before": {
      content: '""',
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 9999,
      opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    },
  },
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "600",
      borderRadius: "sm",
      letterSpacing: "0.02em",
      textTransform: "uppercase" as const,
      fontSize: "xs",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    variants: {
      solid: {
        bg: "brand.primary",
        color: "white",
        _hover: {
          bg: "brand.primaryLight",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          bg: "brand.primaryDark",
          transform: "translateY(0)",
        },
      },
      outline: {
        borderColor: "brand.primary",
        color: "brand.primary",
        borderWidth: "2px",
        _hover: {
          bg: "brand.primary",
          color: "white",
          transform: "translateY(-2px)",
        },
      },
      ghost: {
        color: "brand.text",
        _hover: {
          bg: "brand.paper",
        },
      },
      accent: {
        bg: "brand.secondary",
        color: "white",
        _hover: {
          bg: "brand.secondaryLight",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
      },
      gold: {
        bg: "brand.accent",
        color: "white",
        _hover: {
          bg: "brand.accentLight",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
      },
    },
    defaultProps: {
      variant: "solid",
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: "heading",
      fontWeight: "400",
      letterSpacing: "-0.02em",
    },
  },
  Text: {
    baseStyle: {
      fontFamily: "body",
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "white",
        borderRadius: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid",
        borderColor: "brand.paper",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: "none",
          borderColor: "brand.paper",
          borderWidth: "2px",
          fontFamily: "body",
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "none",
          },
          _hover: {
            borderColor: "brand.textLight",
          },
        },
      },
    },
  },
  Textarea: {
    variants: {
      outline: {
        borderRadius: "none",
        borderColor: "brand.paper",
        borderWidth: "2px",
        fontFamily: "body",
        _focus: {
          borderColor: "brand.primary",
          boxShadow: "none",
        },
        _hover: {
          borderColor: "brand.textLight",
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "600",
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      fontSize: "2xs",
      borderRadius: "none",
      px: 3,
      py: 1,
    },
    variants: {
      solid: {
        bg: "brand.primary",
        color: "white",
      },
      subtle: {
        bg: "brand.cream",
        color: "brand.text",
      },
      outline: {
        borderWidth: "1px",
        borderColor: "brand.primary",
        color: "brand.primary",
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        borderRadius: "none",
        border: "1px solid",
        borderColor: "brand.paper",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        py: 2,
      },
      item: {
        fontFamily: "body",
        fontSize: "sm",
        _hover: {
          bg: "brand.cream",
        },
        _focus: {
          bg: "brand.cream",
        },
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          fontFamily: "body",
          fontWeight: "700",
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          fontSize: "xs",
          color: "brand.textMuted",
          borderBottomWidth: "2px",
          borderColor: "brand.paper",
        },
        td: {
          fontFamily: "body",
          borderBottomWidth: "1px",
          borderColor: "brand.paper",
        },
      },
    },
  },
  Alert: {
    variants: {
      subtle: {
        container: {
          borderRadius: "none",
          border: "1px solid",
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: "none",
        bg: "white",
      },
      header: {
        fontFamily: "heading",
        fontWeight: "400",
      },
    },
  },
  AlertDialog: {
    baseStyle: {
      dialog: {
        borderRadius: "none",
        bg: "white",
      },
      header: {
        fontFamily: "heading",
        fontWeight: "400",
      },
    },
  },
};

const shadows = {
  outline: "0 0 0 3px rgba(28, 69, 50, 0.2)",
};

export const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
  shadows,
});

