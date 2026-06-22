/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          sage: {
            DEFAULT: "#7c8c6c",
            light: "#a3b18a",
            dark: "#5c6b50",
            50: "#f2f4f0",
            100: "#e4e8e0",
            200: "#c9d1c1",
            300: "#a3b18a",
            400: "#8fa07b",
            500: "#7c8c6c",
            600: "#5c6b50",
            700: "#4a5640",
            800: "#3a4333",
            900: "#2a3125"
          },
          ivory: {
            DEFAULT: "#e8e1d9",
            light: "#f5f0eb",
            dark: "#d4cdc4",
            50: "#faf8f6",
            100: "#f5f0eb",
            200: "#e8e1d9",
            300: "#d4cdc4",
            400: "#b8b0a6",
            500: "#9c9488"
          },
          black: "#1a1a1a",
          charcoal: "#333333",
          muted: "#8a8a8a",
          white: "#ffffff"
        },
        status: {
          error: "#c44545",
          success: "#4a7c59",
          warning: "#c49a45",
          info: "#4578a0"
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        heading: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"]
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "heading-xl": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.875rem", { lineHeight: "1.25" }],
        "heading-md": ["1.5rem", { lineHeight: "1.3" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.35" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        overline: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.1em" }]
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        section: "6rem",
        "section-lg": "8rem"
      },
      borderRadius: {
        brand: "2px",
        "brand-md": "4px",
        "brand-lg": "8px"
      },
      boxShadow: {
        card: "0 1px 3px rgba(26, 26, 26, 0.06)",
        "card-hover": "0 8px 30px rgba(26, 26, 26, 0.08)",
        elevated: "0 12px 40px rgba(26, 26, 26, 0.12)",
        modal: "0 20px 60px rgba(26, 26, 26, 0.15)"
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms"
      }
    }
  },
  plugins: []
};
