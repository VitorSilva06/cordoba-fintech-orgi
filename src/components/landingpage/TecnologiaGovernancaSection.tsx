// src/components/sections/TecnologiaGovernancaSection.tsx
import React from 'react';
import { Database, TrendingUp, Cpu, BarChart2 } from 'lucide-react'; 

// Importe a imagem do dashboard para a seção "Esqueça o Excel"
import dashboardPreview from '../../assets/dashboard.png'; 
// OBS: Substitua 'dashboard-preview.png' pela imagem correta (parte da image_54ecf8.png)

export function TecnologiaGovernancaSection() {
    
    // Estilo base para os blocos de texto com borda e padding
    const boxStyle = "border border-neon-blue p-4 rounded-lg text-white font-light leading-relaxed";
    
    // Estilo para o título/questão principal (texto branco com fundo neon-blue)
    const titleStyle = "bg-neon-blue text-primary-dark font-extrabold px-6 py-2 rounded-full inline-block shadow-lg tracking-wide";

    return (
        <section className="bg-primary-dark py-16 md:py-32 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título Principal */}
                <h2 className="text-3xl sm:text-4xl font-extrabold text-accent-yellow mb-16 border-b border-accent-yellow/50 pb-2">
                    Nossa Tecnologia
                </h2>

                {/* Bloco 1: QUANDO A TECNOLOGIA É INTELIGENTE */}
                <div className="mb-12 max-w-5xl">
                    <div className={boxStyle}>
                        <h3 className="text-xl font-bold text-neon-blue mb-2">
                            QUANDO A TECNOLOGIA É INTELIGENTE O SUFICIENTE PARA QUE VOCÊ NÃO TRAVE BATALHAS TECNOLÓGICAS
                        </h3>
                    </div>
                    <div className="ml-4 md:ml-12 mt-4 space-y-4">
                        <p className="text-lg text-white/80">
                            <span className="font-bold text-neon-blue">Muito mais que uma simples plataforma</span>
                            <br/>
                            A Aurea integra todas as nossas soluções em um único ambiente, amigável, prático e transparente.
                        </p>
                        <p className="text-lg text-white/80">
                            <span className="font-bold text-neon-blue">GRANDE PODER DE CUSTOMIZAÇÃO E DETALHAMENTO.</span> PERSONALIZAÇÃO PARA ATENDER AS SUAS NECESSIDADES
                        </p>
                        <h4 className="text-2xl font-extrabold text-accent-yellow mt-6">
                            ACESSIBILIDADE E VISIBILIDADE EM TEMPO REAL E ON-LINE
                        </h4>
                    </div>
                </div>
                
                {/* Bloco 2: MELHORES OS SEUS DADOS */}
                <div className="flex justify-center mb-16">
                    <div className={titleStyle}>
                        MELHORES OS SEUS DADOS, MELHORES OS SEUS RESULTADOS
                    </div>
                </div>

                {/* Bloco 3: QUANDO AS RESPOSTAS PARAM DE SER DIFÍCEIS */}
                <div className="mb-12 max-w-5xl ml-auto">
                    <div className={boxStyle}>
                        <h3 className="text-xl font-bold text-neon-blue mb-2">
                            QUANDO AS RESPOSTAS PARAM DE SER DIFÍCEIS DE SE OBTER
                        </h3>
                    </div>
                    <div className="mr-4 md:mr-12 mt-4 space-y-4 text-right">
                        <p className="text-lg text-white/80">
                            Tem lidado com relatórios sem sentido ou que trazem informações que você já possui? 
                            Nos seus relatórios, por vezes, faltam dados dos quais você realmente precisa?
                        </p>
                    </div>
                </div>

                {/* Bloco 4: ESQUEÇA O EXCEL / MELHORE A GOVERNANÇA (Layout de Imagem) */}
                <div className="grid md:grid-cols-3 items-center gap-8 md:gap-16">
                    
                    {/* Imagem do Dashboard (Esquerda) */}
                    <div className="md:col-span-1 flex justify-center md:justify-start">
                        <img 
                            src={dashboardPreview} 
                            alt="Visualização de Dashboard de Dados" 
                            className="w-full max-w-[200px] md:max-w-xs object-contain shadow-lg rounded-md border border-neon-blue/50"
                        />
                    </div>
                    
                    {/* Títulos Centrais (Meio) */}
                    <div className="md:col-span-1 text-center space-y-8">
                        <div className={titleStyle}>
                            ESQUEÇA O EXCEL
                        </div>
                        <div className={titleStyle}>
                            MELHORE A SUA GOVERNANÇA
                        </div>
                    </div>

                    {/* Descrição da Governança (Direita) */}
                    <div className="md:col-span-1 text-center md:text-left">
                        <p className="text-lg text-white/80">
                            Engenharia logística e tecnologia que garantem o aumento de sua produtividade e a sua eficácia.
                        </p>
                    </div>
                </div>
                
                {/* CTA Final */}
                <div className="mt-20 flex justify-center">
                    <a 
                        href="#contato" 
                        className="px-10 py-4 bg-accent-yellow text-primary-dark text-xl font-bold rounded-full 
                                   shadow-lg hover:shadow-accent-yellow/50 transition duration-300 transform hover:scale-105"
                    >
                        FALE CONOSCO
                    </a>
                </div>

            </div>
        </section>
    );
}