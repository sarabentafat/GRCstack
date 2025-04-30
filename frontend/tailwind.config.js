module.exports = {
  darkMode: "class", // Enable dark mode using the 'class' strategy
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
      colors: {
        main: "#0A092D",
        second: "#17153B",
        third: "#372e4c",
        bluemain: "#0077FF",
        "scrollbar-track": "#f1f1f1", // Light gray for scrollbar track
        "scrollbar-thumb": "#888", // Dark gray for scrollbar thumb
        "scrollbar-thumb-hover": "#555", // Darker gray for thumb on hover
      },
      scrollbarWidth: {
        thin: "thin",
      },
      scrollbarColor: {
        "scrollbar-thumb": "#888",
        "scrollbar-track": "#f1f1f1",
      },

      transform: {
        "rotate-y-180": "rotateY(180deg)",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      perspective: {
        1000: "1000px",
      },
    },
  },
  plugins: [
    require("tailwindcss-rtl"),
    require("tailwind-scrollbar")({ nocompatible: true }), // Add scrollbar plugin
    // Other plugins...
  ],
  variants: {
    extend: {
      scrollbar: ["rounded"],
    },
  },
};
