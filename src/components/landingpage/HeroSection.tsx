// src/components/landingpage/HeroSection.tsx
import React from 'react';
import ButtonRedirect from './ButtonRedirect';

export function HeroSection() {
    return (
        // Fundo primário (roxo profundo)
        <main className="min-h-screen bg-primary-dark max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pb-24">
            
            {/* Título Principal */}
            <header className="mb-16 pt-16">
                <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none text-white">
                        CÓRDOBA FINTECH
                    </h1>
                </div>
                
                {/* Linha de Destaque / Subtítulo - Usa neon-blue */}
                <h2 className="text-xl sm:text-2xl font-light pl-6 py-1 text-neon-blue border-l-4 border-accent-yellow ml-0 inline-block">
                    INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
                </h2>
            </header>

            {/* Propostas de Valor (Cartões) */}
            <div className="grid md:grid-cols-2 gap-8 mt-20">
                
                {/* Cartão 1 */}
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-neon-blue/20 transform hover:scale-[1.02] transition duration-300 cursor-default">
                    <p className="text-xl sm:text-2xl font-medium text-gray-100">
                        Somos uma FINTECH, uma <span className="text-accent-yellow font-extrabold">business inteligence</span> de RECUPERAÇÃO DE CRÉDITO.
                    </p>
                </div>
                
                {/* Cartão 2 */}
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-neon-blue/20 transform hover:scale-[1.02] transition duration-300 cursor-default">
                    <p className="text-xl sm:text-2xl font-medium text-gray-100">
                        Utilizamos Soluções digitais multiplataforma, integradas, personalizadas, seguras, práticas em um só lugar para <span className="text-accent-yellow font-extrabold">exponenciar a sua saúde financeira.</span>
                    </p>
                </div>
            </div>

            {/* Chamada de Ação Final (Destacada) */}
            <div className="mt-24 pt-8 border-t border-gray-500/50">
                <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
                    Nós automatizamos a cobrança.
                </h3>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-accent-yellow">
                    Você recupera crédito com inteligência, agilidade e segurança.
                </p>
                <br />
                <br />
            </div>
            <ButtonRedirect />
        </main>
    );
}