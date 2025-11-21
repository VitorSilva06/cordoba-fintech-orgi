import React from 'react';
import { Target, TrendingUp, Handshake, Gem } from 'lucide-react'; // Ícones para cada item

export function PurposeSection() {
    // Dados para o conteúdo da seção
    const content = [
        { 
            label: 'Propósito', 
            text: 'Transformar a jornada financeira entre empresas e clientes, tornando cada interação mais humana, inteligente e eficiente por meio da tecnologia.',
            icon: Target 
        },
        { 
            label: 'Missão', 
            text: 'Impulsionar a performance financeira dos nossos clientes automatizando toda a comunicação, relacionamento e ações estratégicas, do pré ao pós-vencimento, com segurança, transparência e eficiência.',
            icon: Handshake 
        },
        { 
            label: 'Visão', 
            text: 'Ser a principal referência em inteligência e automação para jornada financeira e comunicação com clientes, redefinindo como o mercado se relaciona, previne e recupera crédito.',
            icon: TrendingUp 
        },
        { 
            label: 'Valores', 
            text: 'Transparência – relações claras em todas as interações.\nTecnologia – inovação como base do nosso trabalho.\nÉtica – respeito, responsabilidade e integridade em cada etapa.\nPerformance – foco em resultados consistentes e mensuráveis.\nEmpatia – comunicação humanizada, mesmo em processos automatizados.\nSegurança – proteção e confiabilidade em cada dado e ação.',
            icon: Gem 
        },
    ];

    return (
        <section 
            className="bg-primary-dark py-16 md:py-28 text-white" 
            id="about-purpose" 
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título Principal */}
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-16 text-center text-accent-yellow">
                    Propósito, Missão e Visão
                </h2>
                
                {/* Conteúdo em GRID: 
                    - grid-cols-1: 1 coluna em telas muito pequenas (default)
                    - md:grid-cols-2: 2 colunas em telas médias
                    - lg:grid-cols-3: 3 colunas em telas grandes (Propósito, Missão, Visão centralizados)
                */}
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {content.map((item, index) => {
                        const Icon = item.icon; // Componente do ícone
                        
                        // Determina se o item é "Valores"
                        const isValues = item.label === 'Valores';
                        
                        // Classes de ocupação de coluna
                        let colSpanClasses = 'col-span-1'; // Padrão: 1 coluna em 'sm'
                        
                        // Classes para os itens Propósito, Missão, Visão
                        if (!isValues) {
                            // Em telas médias (md:grid-cols-2), o 3º item (index 2: Visão) precisa de classes para centralizar
                            if (index === 2) {
                                // Aplica col-span-1 e centraliza (mx-auto) o 3º item no grid de 2 colunas
                                colSpanClasses = 'md:col-span-2 md:w-1/2 md:mx-auto lg:col-span-1 lg:w-full lg:mx-0';
                            } else {
                                // Propósito (0) e Missão (1) ocupam 1 coluna normalmente
                                colSpanClasses = 'md:col-span-1 lg:col-span-1';
                            }
                        } else {
                            // Valores sempre ocupam a largura total
                            colSpanClasses = 'md:col-span-2 lg:col-span-3'; 
                        }

                        return (
                            <div 
                                key={index} 
                                // Aplica as classes de responsividade e estilização
                                className={`p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl transition-all duration-300 hover:border-accent-yellow hover:shadow-2xl hover:shadow-accent-yellow/10 ${colSpanClasses}`} 
                            >
                                <div className="flex items-center mb-4">
                                    {/* Ícone de Destaque */}
                                    <Icon className="w-8 h-8 text-accent-yellow mr-3 flex-shrink-0" />
                                    
                                    {/* Label Principal */}
                                    <h3 className="text-xl font-bold tracking-wider text-accent-yellow">
                                        {item.label}
                                    </h3>
                                </div>
                                
                                {/* Texto Explicativo (Corpo do Conteúdo) */}
                                {isValues ? (
                                    // Renderização especial para Valores
                                    <div className="space-y-2">
                                        {item.text.split('\n').map((line, lineIndex) => {
                                            const parts = line.split(' – ');
                                            const title = parts[0];
                                            const description = parts.slice(1).join(' – ');
                                            return (
                                                <p key={lineIndex} className="text-base sm:text-lg font-light leading-relaxed text-gray-200">
                                                    <span className="font-semibold text-white">{title}</span> <span className="text-accent-yellow">–</span> <span className="font-normal">{description}</span>
                                                </p>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    // Renderização padrão para Propósito, Missão e Visão
                                    <p className="text-base sm:text-lg font-light leading-relaxed text-gray-200">
                                        <span className="font-normal">
                                            {item.text}
                                        </span>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}