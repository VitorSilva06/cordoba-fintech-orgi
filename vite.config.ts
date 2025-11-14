// vite.config.ts

// 1. IMPORTAR o defineConfig e o plugin React
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // <-- ESSA LINHA É ESSENCIAL

// 2. Definir a base (opcional, mas recomendado para hospedagem)
// '.' ou './' é geralmente a melhor opção para caminhos relativos na hospedagem compartilhada
export default defineConfig({
  plugins: [react()],
  base: './', 
});