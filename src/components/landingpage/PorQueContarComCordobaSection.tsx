// src/components/sections/PorQueContarComCordobaSection.tsx
import React from 'react';

export function PorQueContarComCordobaSection() {
    
    // Estilo para o título/caixa de destaque (ESSÊNCIA NO CLIENTE, ACOMPANHAMENTO, RESOLUÇÃO)
    const highlightBoxStyle = "border-b-4 border-neon-blue inline-block px-4 py-2 text-xl font-extrabold text-neon-blue tracking-wider";
    
    // Estilo para o texto de suporte abaixo do destaque
    const supportTextStyle = "p-4 border border-neon-blue/50 rounded-lg text-lg text-white font-light max-w-sm mt-2";

    return (
        // Usamos o primary-dark (Roxo Profundo) como fundo
        <section className="bg-primary-dark py-16 md:py-32 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título Principal */}
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-16">
                    Porque contar com <span className="text-accent-yellow">CORDOBA</span>
                </h2>

                {/* Grid para organizar os pontos de valor */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    
                    {/* Ponto 1: ESSÊNCIA NO CLIENTE */}
                    <div className="flex flex-col items-start space-y-4">
                        <h3 className={highlightBoxStyle}>
                            ESSÊNCIA NO CLIENTE
                        </h3>
                        <p className={supportTextStyle}>
                            Soluções customizadas para atender cada cliente de forma única e exclusiva.
                        </p>
                        <p className={supportTextStyle}>
                            Estratégias com foco em agregar Valor para o negócio dos nossos clientes.
                        </p>
                    </div>

                    {/* Ponto 2: ACOMPANHAMENTO */}
                    <div className="flex flex-col items-start space-y-4">
                        <h3 className={highlightBoxStyle}>
                            ACOMPANHAMENTO DE TODO A SUA OPERAÇÃO EM TEMPO REAL E ON-LINE
                        </h3>
                        {/* Texto de suporte opcional para este ponto */}
                    </div>

                    {/* Ponto 3: RESOLUÇÃO COMPLEXA */}
                    <div className="flex flex-col items-start space-y-4">
                        <h3 className={highlightBoxStyle}>
                            RESOLUÇÃO COMPLEXAS DE FORMA ÁGIL E SIMPLES
                        </h3>
                        {/* Texto de suporte opcional para este ponto */}
                    </div>

                </div>

                {/* CTA Final: CONTRATE AGORA */}
                <div className="mt-20 flex justify-center md:justify-start">
                    <a 
                        href="#contrate" 
                        className="px-10 py-4 bg-accent-yellow text-primary-dark text-xl font-bold rounded-lg 
                                   shadow-lg hover:shadow-accent-yellow/50 transition duration-300 transform hover:scale-105"
                    >
                        CONTRATE AGORA
                    </a>
                </div>

            </div>
        </section>
    );
}