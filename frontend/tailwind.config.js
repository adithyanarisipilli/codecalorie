const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Include other content paths as needed
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(), // Include Flowbite content paths
  ],
  plugins: [
    // Include other plugins as needed
    flowbite.plugin(), // Include Flowbite plugins
    require('tailwind-scrollbar'),
  ],
};
