import { extendTheme } from "@chakra-ui/react";

const fonts = {
  heading: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
};

const colors = {
  brand: {
    50: "#e3f2ff",
    100: "#bddfff",
    200: "#94cbff",
    300: "#6bb6ff",
    400: "#42a2ff",
    500: "#1a8dff",
    600: "#0071e6",
    700: "#0056b4",
    800: "#003d82",
    900: "#002451",
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "lg",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.600" },
        _active: { bg: "brand.700" },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: "2xl",
        borderWidth: "1px",
        borderColor: "gray.100",
      },
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: "gray.50",
          borderRadius: "lg",
          _focus: {
            bg: "white",
            borderColor: "brand.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
          },
        },
      },
    },
    defaultProps: {
      variant: "filled",
    },
  },
  Textarea: {
    defaultProps: {
      variant: "filled",
    },
  },
};

const theme = extendTheme({ fonts, colors, components });

export default theme;
