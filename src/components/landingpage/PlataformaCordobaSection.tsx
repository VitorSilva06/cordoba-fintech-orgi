// src/components/sections/PlataformaCordobaSection.tsx
import React from 'react';
import dashboardImage from '../../assets/sistemaPlataforma.png';

export function PlataformaCordobaSection() {
    return (
        <section className="relative overflow-hidden bg-primary-dark">
            {/* Ajustei o min-h para garantir que o fundo amarelo cubra a área de visualização no mobile */}
            <div className="relative min-h-[700px] sm:min-h-[800px] lg:min-h-[800px] flex items-center justify-center py-12 sm:py-16">

                {/* 2. Bloco Amarelo - Correção para garantir 100% amarelo no Mobile */}
                
                {/* Bloco Amarelo Mobile/Tablet (Retângulo Completo - visível apenas em telas pequenas) */}
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-accent-yellow z-0 lg:hidden"
                ></div>

                {/* Bloco Amarelo Desktop (Corte Assimétrico - visível apenas em telas grandes) */}
                <div 
                    className="absolute top-0 left-0 w-full h-full bg-accent-yellow z-0 hidden lg:block"
                    style={{
                        // Corte Assimétrico para Desktop (funciona apenas quando a div está visível)
                        clipPath: 'polygon(0 0, 50% 0, 75% 100%, 0 100%)' 
                    }}
                ></div>

                {/* DETALHES HOLOGRÁFICOS */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-1 bg-neon-blue transform rotate-45"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-28 sm:w-40 h-1 bg-neon-blue transform -rotate-30"></div>
                </div>

                {/* CONTEÚDO */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">

                        {/* TEXTOS */}
                        <div className="relative z-20 text-center md:text-left p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center md:items-start h-full">

                            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-primary-dark mb-2 sm:mb-4 drop-shadow-lg">
                                PLATAFORMA
                            </h2>

                            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter border-b-4 border-primary-dark pb-2 sm:pb-4 inline-block text-primary-dark drop-shadow-lg">
                                CÓRDOBA
                            </h2>

                            <p className="mt-6 sm:mt-8 text-xl sm:text-3xl lg:text-4xl text-black/80 max-w-md">
                                Sua gestão de inadimplência reimaginada. Inteligência artificial e automação para resultados sem precedentes.
                            </p>
                        </div>

                        {/* IMAGEM (MONITOR) */}
                        <div className="relative z-20 flex items-center justify-center p-4 sm:p-6 md:p-8">

                            <div
                                className="
                                    w-full 
                                    max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                                    relative 
                                    /* Mobile: Margem negativa para subir a imagem ligeiramente */
                                    -mt-6 sm:-mt-10 md:mt-0 
                                    /* Desktop: Reintrodução do efeito 'ejetado' */
                                    md:transform md:-rotate-3 md:-ml-12 lg:-ml-24 xl:-ml-32 
                                    /* Hover effect */
                                    hover:md:rotate-0 transition-transform duration-500 
                                    shadow-2xl shadow-neon-blue/80
                                "
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