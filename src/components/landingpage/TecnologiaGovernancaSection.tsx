// src/components/sections/TecnologiaGovernancaSection.tsx
import React from 'react';
import { Database, TrendingUp, Cpu, BarChart2 } from 'lucide-react';

// Importe a imagem do dashboard para a seção "Esqueça o Excel"
import dashboardPreview from '../../assets/dashboard.png';

export function TecnologiaGovernancaSection() {

    // Estilo base para os blocos de texto com borda e padding
    const boxStyle = "bg-primary-dark/80 backdrop-blur-sm border border-neon-blue p-5 rounded-xl text-white font-light leading-relaxed shadow-xl hover:shadow-neon-blue/40 transition duration-500";

    // Estilo para o título/questão principal (texto branco com fundo neon-blue)
    const titleStyle = "bg-neon-blue text-primary-dark font-extrabold px-6 py-3 rounded-full inline-block shadow-lg tracking-wide text-lg sm:text-xl uppercase hover:shadow-xl transition duration-300";

    return (
        <section className="bg-primary-dark py-16 md:py-32 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Título Principal (Alinhado à Esquerda no Desktop) */}
                <h2 className="text-4xl sm:text-5xl font-extrabold text-accent-yellow mb-20 border-b border-accent-yellow/50 pb-3 uppercase text-center md:text-left">
                    Nossa Tecnologia
                </h2>

                {/* 2. Bloco 1: QUANDO A TECNOLOGIA É INTELIGENTE */}
                {/* Alinhamento à esquerda (padrão) no desktop */}
                <div className="mb-20 max-w-5x1">
                    <div className={boxStyle}>
                        <h3 className="text-2xl font-bold text-neon-blue mb-2 leading-snug text-left">
                            Quando a tecnologia é inteligente o suficiente para que você não trave batalhas tecnológicas
                        </h3>
                    </div>

                    {/* Conteúdo com margem e alinhamento à esquerda no desktop */}
                    <div className="ml-0 md:ml-12 mt-6 space-y-6 text-left max-w-xl">

                        <p className="text-xl text-white/90">
                            <span className="font-bold text-neon-blue uppercase block mb-1">Muito mais que uma simples plataforma</span>
                            A Aurea integra todas as nossas soluções em um único ambiente, amigável, prático e transparente.
                        </p>

                        <p className="text-xl text-white/90">
                            <span className="font-bold text-neon-blue uppercase block mb-1">Grande poder de customização e detalhamento.</span> Personalização para atender as suas necessidades.
                        </p>

                        <h4 className="text-2xl font-extrabold text-accent-yellow pt-4">
                            ACESSIBILIDADE E VISIBILIDADE EM TEMPO REAL E ON-LINE
                        </h4>
                    </div>
                </div>

                {/* 3. Bloco 2: MELHORES OS SEUS DADOS (Alinhamento Centralizado) */}
                <div className="flex justify-center mb-20">
                    <div className={titleStyle}>
                        MELHORES OS SEUS DADOS, MELHORES OS SEUS RESULTADOS
                    </div>
                </div>

                {/* 4. Bloco 3: QUANDO AS RESPOSTAS PARAM DE SER DIFÍCEIS */}
                {/* Bloco alinhado à direita (ml-auto) para o box ficar à direita no desktop */}
                <div className="mb-20 max-w-5xl ml-auto">
                    <div className={boxStyle}>
                        <h3 className="text-2xl font-bold text-neon-blue mb-2 leading-snug text-left">
                            Quando as respostas param de ser difíceis de se obter
                        </h3>
                    </div>

                    {/* Conteúdo com margem e alinhamento à esquerda no desktop, mas o bloco é empurrado para a direita */}
                    <div className="mr-0 md:mr-12 mt-6 space-y-4 text-left max-w-xl ml-auto">
                        <p className="text-xl text-white/90">
                            Tem lidado com relatórios sem sentido ou que trazem informações que você já possui?
                            Nos seus relatórios, por vezes, faltam dados dos quais você realmente precisa?
                        </p>
                    </div>
                </div>

                {/* 5. Bloco 4: ESQUEÇA O EXCEL / MELHORE A GOVERNANÇA (Layout de Imagem) */}
                {/* Revertendo a ordem das colunas para o fluxo da esquerda para a direita no desktop */}
                <div className="grid md:grid-cols-3 items-center gap-10 md:gap-16">

                    {/* Imagem do Dashboard (COLUNA 1 no Desktop) - Fica na extrema esquerda */}
                    <div className="md:col-span-1 flex justify-center md:justify-start order-1">
                        <img
                            src={dashboardPreview}
                            alt="Visualização de Dashboard de Dados"
                            className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] object-contain shadow-2xl rounded-lg border-2 border-neon-blue/80"
                        />
                    </div>

                    {/* Títulos Centrais (COLUNA 2 no Desktop) - Fica no meio no desktop */}
                    <div className="md:col-span-1 text-center space-y-8 order-2">
                        <div className={titleStyle}>
                            ESQUEÇA O EXCEL
                        </div>
                        <div className={titleStyle}>
                            MELHORE A SUA GOVERNANÇA
                        </div>
                    </div>

                    {/* Descrição da Governança (COLUNA 3 no Desktop) - Fica na extrema direita */}
                    <div className="md:col-span-1 text-center md:text-left order-3">
                        <p className="text-xl text-white/90">
                            Engenharia Financeira e tecnologia que garantem o aumento de sua produtividade e a sua eficácia.
                        </p>
                    </div>
                </div>

                {/* CTA Final (Centralizado) */}
                <div className="mt-24 flex justify-center">
                    <a
                        href="#contato"
                        className="px-12 py-5 bg-accent-yellow text-primary-dark text-2xl font-black rounded-full 
                                    shadow-2xl shadow-accent-yellow/70 transition duration-300 transform hover:scale-105 hover:shadow-accent-yellow/90 uppercase"
                    >
                        FALE CONOSCO
                    </a>
                </div>

            </div>
        </section>
    );
}