/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ChorEscape brand colors using CSS variables
        primary: "var(--ce-primary)",
        "primary-hover": "var(--ce-primary-hover)",
        "primary-soft": "var(--ce-primary-soft)",
        text: "var(--ce-text)",
        muted: "var(--ce-muted)",
        border: "var(--ce-border)",
        surface: "var(--ce-surface)",
        bg: "var(--ce-bg)",
        success: "var(--ce-success)",
        warning: "var(--ce-warning)",
        danger: "var(--ce-danger)",
        info: "var(--ce-info)",
      },
      borderRadius: {
        card: "var(--ce-radius-card)",
        btn: "var(--ce-radius-btn)",
      },
      boxShadow: {
        card: "var(--ce-shadow-card)",
      },
    },
  },
  plugins: [],
}

