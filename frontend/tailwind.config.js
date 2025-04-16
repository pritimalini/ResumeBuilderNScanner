/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        blob1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(1.1)' }
        },
        blob2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
          '50%': { transform: 'translate(-20px, 20px) scale(1)' }
        },
        blob3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, 20px) scale(1.1)' }
        }
      },
      animation: {
        gradient: 'gradient 8s ease-in-out infinite',
        blob1: 'blob1 7s infinite',
        blob2: 'blob2 8s infinite',
        blob3: 'blob3 9s infinite'
      },
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#d9f2ff",
          200: "#bae8ff",
          300: "#8ad9ff",
          400: "#52c1fc",
          500: "#2aa3f8",
          600: "#1183ed",
          700: "#0f6ad7",
          800: "#1358ae",
          900: "#154b8a",
          950: "#112e54",
        },
        secondary: {
          50: "#f5f7fa",
          100: "#ebeef3",
          200: "#d2dae5",
          300: "#adbcce",
          400: "#8398b1",
          500: "#637a97",
          600: "#4f627c",
          700: "#405165",
          800: "#374455",
          900: "#333b49",
          950: "#21252e",
        },
        accent: {
          50: "#fef2f3",
          100: "#fde6e7",
          200: "#fbd0d5",
          300: "#f7aab2",
          400: "#f27a8a",
          500: "#ea4c65",
          600: "#d42a4c",
          700: "#b21e3f",
          800: "#951c39",
          900: "#7d1c36",
          950: "#450a1a",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
