// src/components/landingpage/AboutCordobaSection.tsx

import React from 'react';
import sistemaGerenciamento from '../../assets/sistemaGerenciamento.png';


export function AboutCordobaSection() {
    return (
        <section 
            // Fundo Primário (Roxo Profundo) - Consistente com Header/Hero
            className="bg-primary-dark py-16 md:py-32 text-white relative"
            id="start-section" 
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. Título e Subtítulo (Limpos e Centrais) */}
                <header className="mb-20 text-center">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent-yellow mb-2">
                        ENTENDA A CORDOBA
                    </h2>
                </header>
                
                {/* 2. Conteúdo em Blocos de Informação (Grid 40/60) */}
                <div className="grid md:grid-cols-5 gap-12 items-center">
                    
                    {/* Coluna 1: Bloco de Texto (Ocupa 2/5) */}
                    <div 
                        className="md:col-span-2 p-8 md:p-10 
                                   // Estilo Flutuante e Elegante (Harmoniza com cartões do Hero)
                                   bg-white/5 backdrop-blur-md rounded-2xl 
                                   border-l-4 border-accent-yellow shadow-xl shadow-accent-yellow/10 
                                   transform transition duration-500 hover:scale-[1.03] space-y-8"
                    >
                        
                        {/* Parágrafo 1: Definição */}
                        <p className="text-xl sm:text-2xl font-light leading-relaxed">
                            A CORDOBA é uma <span className="text-accent-yellow font-bold">gerente digital e operacional</span>, que realiza o gerenciamento de toda a carteira de inadimplentes das empresas.
                        </p>
                        
                        {/* Parágrafo 2: Benefício */}
                        <p className="text-lg sm:text-xl font-light leading-relaxed">
                            Ela simplifica a vida das empresas diminuindo as <span className="font-semibold text-accent-yellow">"dores de cabeça"</span> e aumentando o retorno financeiro.
                        </p>

                    </div>

                    {/* Coluna 2: Imagem (Ocupa 3/5 - Maior e Destacada) */}
                    <div className="md:col-span-3 flex justify-center md:justify-end">
                        <img 
                            src={sistemaGerenciamento} 
                            alt="Ilustração de uma gerente digital e operacional" 
                            // Borda neon-blue (para coesão com detalhes do Hero)
                            className="w-full max-w-xl h-auto rounded-3xl border-2 border-neon-blue/40 shadow-2xl shadow-neon-blue/20 transition duration-500 hover:shadow-neon-blue/50"
                        />
                    </div>
                </div>

            </div>
            
            {/* Detalhe Decorativo de Fundo (soft blur) - Mantém a coesão visual e profundidade */}
            <div className="absolute top-1/4 right-0 w-48 h-48 bg-neon-blue opacity-5 rounded-full filter blur-3xl -z-0"></div>
            <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-accent-yellow opacity-5 rounded-full filter blur-3xl -z-0"></div>

        </section>
    );
}