import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FDFBF4",
          100: "#F9F3E3",
          200: "#F2E4BF",
          300: "#EAD498",
          400: "#E2C372",
          500: "#D4AF37",
          600: "#B8860B",
          700: "#996515",
          800: "#7A4A10",
          900: "#5A330B",
        },
        obsidian: {
          800: "#132A25",
          900: "#0C1E1A",
          950: "#071411",
        },
        milk: {
          50: "#FDFCF9",
          100: "#FAF7F2",
          200: "#F5EFE6",
          300: "#EFE8DC",
          400: "#E3DAC9",
          cream: "#FAF7F0",
          pure: "#FDFBF7",
          card: "#FFFEFD",
          border: "#EAE3D5",
          accent: "#F2EDE4",
        },
        cyanAgri: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63",
          950: "#083344",
          ocean: "#062834",
          deep: "#041E27",
        },
        agri: {
          dark: "#062313",
          primary: "#083344",
          secondary: "#0E5266",
          leaf: "#0891B2",
          lime: "#06B6D4",
          lightLeaf: "#A5F3FC",
          earth: "#78350F",
          warmSand: "#FAF7F0",
          cream: "#FAF7F0",
          pureMilk: "#FDFBF7",
          sun: "#EAB308",
          sky: "#0284C7",
          water: "#06B6D4",
          cyan: "#0891B2",
          cyanDark: "#083344",
        },
      },
      fontFamily: {
        brand: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        editorial: ["'Playfair Display'", "Georgia", "Cambria", "serif"],
        script: ["'Caveat'", "cursive", "serif"],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
