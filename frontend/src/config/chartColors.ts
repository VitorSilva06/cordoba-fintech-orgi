// Paleta de cores Córdoba para os gráficos
// Valores estáticos para uso em recharts (que não suporta CSS vars diretamente)
export const chartColors = {
  primary: '#004BFF',      // Azul-intenso
  success: '#00C08A',      // Verde-fintech
  warning: '#ffaa00',      // Amarelo
  danger: '#ff4444',       // Vermelho
  info: '#5b9bd5',         // Azul claro
  neutral: '#4A4A4A',      // Cinza-escuro
};

// Função para obter cores do tema atual (CSS vars)
export function getChartThemeColors() {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    backgroundColor: isDark ? '#0C1B33' : '#ffffff',
    borderColor: isDark ? 'rgba(0,75,255,0.3)' : 'rgba(0,75,255,0.2)',
    gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    textColor: isDark ? '#F2F4F7' : '#1a1a1a',
    tooltipBg: isDark ? '#0C1B33' : '#ffffff',
    tooltipBorder: isDark ? 'rgba(0,75,255,0.5)' : 'rgba(0,75,255,0.3)',
  };
}

// Config padrão para charts (dark mode por padrão, compatível com código existente)
export const chartConfig = {
  backgroundColor: '#0C1B33',
  borderColor: 'rgba(0,75,255,0.3)',
  gridColor: 'rgba(255,255,255,0.1)',
  textColor: '#F2F4F7',
  tooltipBg: '#0C1B33',
  tooltipBorder: 'rgba(0,75,255,0.5)',
};

// Array de cores para gráficos de pizza e múltiplas séries
export const multiColors = [
  chartColors.primary,
  chartColors.success,
  chartColors.warning,
  chartColors.danger,
  chartColors.info,
  chartColors.neutral,
];