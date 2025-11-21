// src/components/sections/PorQueContarComCordobaSection.tsx
import React from 'react';

export function PorQueContarComCordobaSection() {

    // Estilo do título (subtítulo)
    const highlightBoxStyle = `
        border-b-4 border-neon-blue 
        inline-block px-4 py-2 
        text-xl font-extrabold 
        text-neon-blue tracking-wider
        text-left
    `;

    // Estilo dos textos de suporte
    const supportTextStyle = `
        p-4 border border-neon-blue/50 
        rounded-lg text-lg text-white 
        font-light w-full 
        bg-primary-dark/30 backdrop-blur-sm
    `;

    // ALTURA FIXA que alinha os títulos
    const titleAlignedHeight = "h-[100px] flex items-end";

    return (
        <section className="bg-primary-dark py-16 md:py-28 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* TÍTULO PRINCIPAL */}
                <h2 className="
                    text-4xl sm:text-5xl font-extrabold 
                    text-white mb-12 sm:mb-16 
                    uppercase text-center md:text-left
                ">
                    Porque contar com <span className="text-accent-yellow">CÓRDOBA</span>
                </h2>

                {/* GRID DOS 3 BLOCOS */}
                <div
                    className="
                        grid 
                        grid-cols-1 
                        sm:grid-cols-2 
                        lg:grid-cols-3 
                        gap-12
                        items-start
                    "
                >

                    {/* BLOCO 1 */}
                    <div className="flex flex-col items-start w-full space-y-4">
                        <h3 className={`${highlightBoxStyle} ${titleAlignedHeight}`}>
                            ESSÊNCIA NO CLIENTE
                        </h3>

                        <p className={supportTextStyle}>
                            Soluções customizadas para atender cada cliente de forma única e exclusiva.
                        </p>

                        <p className={supportTextStyle}>
                            Estratégias com foco em agregar Valor para o negócio dos nossos clientes.
                        </p>
                    </div>

                    {/* BLOCO 2 */}
                    <div className="flex flex-col items-start w-full space-y-4">
                        <h3 className={`${highlightBoxStyle} ${titleAlignedHeight}`}>
                            ACOMPANHAMENTO DE TODA A SUA OPERAÇÃO EM TEMPO REAL E ON-LINE
                        </h3>
                    </div>

                    {/* BLOCO 3 */}
                    <div className="flex flex-col items-start w-full space-y-4">
                        <h3 className={`${highlightBoxStyle} ${titleAlignedHeight}`}>
                            RESOLUÇÃO COMPLEXAS DE FORMA ÁGIL E SIMPLES
                        </h3>
                    </div>

                </div>

                {/* CTA FINAL */}
                <div className="mt-16 flex justify-center md:justify-start">
                    <a
                        href="#contrate"
                        className="
                            px-10 py-4 
                            bg-accent-yellow text-primary-dark 
                            text-xl font-bold 
                            rounded-lg 
                            shadow-lg hover:shadow-accent-yellow/50 
                            transition duration-300 
                            transform hover:scale-105
                        "
                    >
                        CONTRATE AGORA
                    </a>
                </div>

            </div>
        </section>
    );
}
