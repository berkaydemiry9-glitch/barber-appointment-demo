module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        accent: "#ffb300",
        bg: "#f8fafc"
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        logo: ['Pacifico', 'cursive']
      },
      boxShadow: {
        'soft': '0 8px 32px 0 rgba(31, 38, 135, 0.12)'
      }
    }
  },
  plugins: []
}
