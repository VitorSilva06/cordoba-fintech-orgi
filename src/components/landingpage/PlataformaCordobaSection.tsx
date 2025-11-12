// src/components/sections/PlataformaCordobaSection.tsx
import React from 'react';

// Importe a imagem do dashboard do sistema
import dashboardImage from '../../assets/sistemaPlataforma.png'; 

export function PlataformaCordobaSection() {
    return (
        <section className="relative overflow-hidden bg-primary-dark">
            <div className="relative min-h-[600px] lg:min-h-[800px] flex items-center justify-center py-16">
                
                {/* 2. Bloco Amarelo com Clip-Path para um Corte Assimétrico Inovador */}
                {/* Este shape simula um "recorte" que se abre para o monitor */}
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-accent-yellow z-0"
                    style={{ 
                        // Mantendo o corte assimétrico, mas ajustando a proporção no desktop para ser menos invasivo
                        clipPath: 'polygon(0 0, 40% 0, 65% 100%, 0 100%)' 
                    }}
                ></div>

                {/* 3. Camada de Detalhes Holográficos (Linhas sutis) */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-1 bg-neon-blue transform rotate-45"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-40 h-1 bg-neon-blue transform -rotate-30"></div>
                </div>

                {/* Conteúdo Principal: Título e Monitor (Z-index alto para sobrepor tudo) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-0">
                        
                        {/* Coluna Esquerda: Título em Amarelo */}
                        <div className="relative z-20 text-center md:text-left p-4 md:p-8 flex flex-col justify-center items-center md:items-start h-full">
                            
                            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-primary-dark mb-4 drop-shadow-lg">
                                PLATAFORMA
                            </h2>
                            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter border-b-4 border-primary-dark pb-4 inline-block text-primary-dark drop-shadow-lg">
                                CORDOBA
                            </h2>
                            <p className="mt-8 text-xl text-primary-dark/80 max-w-md">
                                Sua gestão de inadimplência reimaginada. Inteligência artificial e automação para resultados sem precedentes.
                            </p>
                        </div>

                        {/* Coluna Direita: Dashboard do Sistema (Monitor "Ejetado") */}
                        <div className="relative z-20 flex items-center justify-center p-4 md:p-8">
                            
                            {/* Container da Imagem (Monitor) - Mais elevado e com sombra dramática */}
                            <div className="w-full max-w-xl lg:max-w-2xl relative 
                                            // Ajuste no mobile: -mt-10 e remoção de -ml e -left para não quebrar o layout
                                            -mt-10 md:-mt-0 md:-ml-12 lg:-ml-24 xl:-ml-32 
                                            transform -rotate-3 hover:rotate-0 transition-transform duration-500
                                            // CORREÇÃO: Usando shadow-2xl ou shadow-lg (classes nativas) no lugar de shadow-3xl
                                            shadow-2xl shadow-neon-blue/80" 
                            > 
                                <img
                                    src={dashboardImage} 
                                    alt="Dashboard da Plataforma Cordoba (Acompanhamento de Serviços)"
                                    className="w-full h-auto object-contain rounded-xl border border-neon-blue/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}