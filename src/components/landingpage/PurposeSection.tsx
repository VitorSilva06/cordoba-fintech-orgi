import React from 'react';
import { Target, TrendingUp, Handshake, Gem } from 'lucide-react'; // Ícones para cada item

export function PurposeSection() {
    // Dados para o conteúdo da seção
    const content = [
        { 
            label: 'Propósito', 
            text: 'Recuperar crédito com eficiência e empatia.',
            icon: Target // Alvo / Objetivo
        },
        { 
            label: 'Missão', 
            text: 'Automatizar e simplificar o processo de recuperação de crédito no Brasil.',
            icon: Handshake // Acordo / Ajuda
        },
        { 
            label: 'Visão', 
            text: 'Ser referência em soluções de cobrança inteligente.',
            icon: TrendingUp // Crescimento / Referência
        },
        { 
            label: 'Valores', 
            text: 'Transparência, Tecnologia, Ética, Inovação e Resultados.',
            icon: Gem // Gema / Algo de valor
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
                  - Duas colunas em telas médias e grandes (md:grid-cols-2)
                  - Espaçamento (gap-8)
                */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                    {content.map((item, index) => {
                        const Icon = item.icon; // Componente do ícone
                        
                        return (
                            <div 
                                key={index} 
                                // Estilização do Cartão: Fundo levemente transparente, borda sutil, sombra, padding e transição de hover
                                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl transition-all duration-300 hover:border-accent-yellow hover:shadow-2xl hover:shadow-accent-yellow/10"
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
                                <p className="text-base sm:text-lg font-light leading-relaxed text-gray-200">
                                    {/* Aplica negrito apenas aos "Valores" para maior destaque, se for o caso */}
                                    <span className={item.label === 'Valores' ? 'font-semibold text-white' : 'font-normal'}>
                                        {item.text}
                                    </span>
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}