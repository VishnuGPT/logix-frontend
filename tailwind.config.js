/** @type {import('tailwindcss').Config} */
export default {
  // IMPORTANT: Make sure this path is correct for your project structure.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FFFAFF',
        'text': '#1e1b18',
        'headings': '#0a2463',
        'interactive': '#3e92cc',
        'accent-cta': '#d8315b',
        'accent-highlight': '#EEE8A9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'DEFAULT': '8px', // Setting the default 'rounded' class
      }
    },
  },
  plugins: [],
}