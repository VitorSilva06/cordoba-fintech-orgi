/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Garanta que este caminho está correto para seus arquivos!
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html", 
  ],
    theme: {
      // Estenda o tema para adicionar suas novas cores
      extend: {
        colors: {
          // Paleta Fornecida
          'primary-dark': '#2E1C80',    // Roxo Profundo
          'neon-blue': '#A8FFF0',       // Azul-Claro Neon
          'accent-yellow': '#FFC107',   // Amarelo Solar
          'neutral-gray': '#F5F5F5',    // Cinza Neutro
          'dark-text': '#1E1E1E',       // Grafite Técnico
        },
        // Exemplo: Configurar a fonte principal para ser usada por padrão
        fontFamily: {
          sans: ['Inter', 'sans-serif'], // Use sua fonte de preferência
        },
      },
    },
  plugins: [],
}