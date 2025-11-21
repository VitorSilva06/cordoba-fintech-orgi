// src/components/landingpage/HeroSection.tsx
import React from 'react';
import ButtonRedirect from './ButtonRedirect';

export function HeroSection() {
    return (
        <main className="min-h-screen bg-primary-dark max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pb-24">

            {/* Título Principal */}
            <header className="mb-16 pt-10 sm:pt-16">
                <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none text-white break-words">
                        CÓRDOBA FINTECH
                    </h1>
                </div>

                {/* Subtítulo */}
                <h2 className="text-lg sm:text-2xl font-light pl-4 sm:pl-6 py-1 text-neon-blue border-l-4 border-accent-yellow inline-block">
                    INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
                </h2>
            </header>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">

                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-neon-blue/20 hover:scale-[1.02] transition duration-300">
                    <p className="text-lg sm:text-2xl font-medium text-gray-100 leading-snug">
                        Somos uma FINTECH, uma <span className="text-accent-yellow font-extrabold">business intelligence</span> de RECUPERAÇÃO DE CRÉDITO.
                    </p>
                </div>

                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl border border-neon-blue/20 hover:scale-[1.02] transition duration-300">
                    <p className="text-lg sm:text-2xl font-medium text-gray-100 leading-snug">
                        Utilizamos Soluções digitais multiplataforma, integradas, personalizadas, seguras e práticas em um só lugar para <span className="text-accent-yellow font-extrabold">exponenciar a sua saúde financeira.</span>
                    </p>
                </div>
            </div>

            {/* BLOCO ROXO CLARO */}
            <div className="w-full bg-[rgb(128,72,169)] p-6 sm:p-10 mt-20 rounded-xl">

                {/* Barra amarela */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black px-4 sm:px-6 py-3 bg-[rgb(255,204,0)] uppercase w-full break-words">
                    Com inteligência e tecnologia, impulsionamos sua performance financeira.
                </h3>

                {/* Textos */}
                <p className="text-2xl sm:text-3xl lg:text-3xl font-extrabold leading-tight text-white mt-6">
                    Automatizamos toda a jornada de comunicação e relacionamento com seus clientes.
                </p>

                <p className="text-2xl sm:text-3xl lg:text-3xl font-extrabold leading-tight text-white mt-4">
                    Antes, durante e após os vencimentos, incluindo réguas completas para campanhas, feirões e ações estratégicas.
                </p>

                <p className="text-2xl sm:text-3xl lg:text-3xl font-extrabold leading-tight text-white mt-4">
                    Tudo com agilidade, transparência, segurança e automação em cada etapa.
                </p>

                <div className="mt-8">
                    <ButtonRedirect />
                </div>
            </div>

        </main>
    );
}
