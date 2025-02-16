/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'blue-background': '#0E67C7', 
        'text-blue': '#ABD3FF',
        'dark-blue': '#0E67C7', 
      },
      spacing: {
        'custom-padding-horizontal': '15.1px', 
        'custom-padding-vertical': '10px',    
      },
      fontSize: {
        'custom-16': '16px', 
      },
    },
  },
  plugins: [],
}