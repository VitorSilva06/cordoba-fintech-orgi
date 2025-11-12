// src/components/sections/NichosSection.tsx
import React from 'react';
import { DollarSign, Banknote, Home, Phone, Shield, GraduationCap, Leaf } from 'lucide-react'; 

import nichosIllustration from '../../assets/equipe-depositphotos-bgremover.png'; 

// Dados dos Nichos
const nichos = [
    { icon: DollarSign, text: "DEPARTAMENTOS FINANCEIROS" },
    { icon: Banknote, text: "BANCOS E INSTITUIÇÕES FINANCEIRAS" },
    { icon: Home, text: "CONSTRUTORAS" },
    { icon: Phone, text: "TELEFONIA" },
    { icon: Shield, text: "ADMINISTRADORAS DE CONSÓRCIO E SEGURADORAS" },
    { icon: GraduationCap, text: "INSTITUIÇÕES DE ENSINO" },
    { icon: Leaf, text: "AGRONEGÓCIO" },
];

export function NichosSection() {
    return (
        // Fundo da seção inteira: ROXO ESCURO (primary-dark)
        <section className="bg-primary-dark py-16 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid md:grid-cols-2 gap-8 md:gap-0">
                    
                    {/* Bloco da Esquerda: PARA QUEM FAZEMOS (AGORA BRANCO) */}
                    <div 
                        className="bg-white text-dark-text relative z-10 p-8 md:p-16 
                                   rounded-3xl md:rounded-r-none md:rounded-l-3xl 
                                   shadow-2xl shadow-primary-dark/30 flex flex-col justify-center"
                    >
                        
                        {/* MUDANÇA: Título e Borda em Amarelo (accent-yellow) */}
                        <h3 className="text-5xl sm:text-6xl font-extrabold text-accent-yellow border-b-4 border-accent-yellow inline-block pb-3 mb-2 tracking-tight">
                            PARA QUEM
                        </h3>
                        <h3 className="text-5xl sm:text-6xl font-extrabold text-accent-yellow tracking-tight">
                            FAZEMOS
                        </h3>
                        
                        <div className="mt-12">
                            <img 
                                src={nichosIllustration} 
                                alt="Ilustração de pessoas trabalhando em equipe." 
                                className="w-full max-w-lg h-auto mx-auto md:mx-0 "
                            />
                        </div>
                    </div>
                    
                    {/* Bloco da Direita: NICHOS DE MERCADO (ROXO ESCURO) */}
                    <div 
                        className="bg-primary-dark text-white p-8 md:p-16 relative 
                                   rounded-3xl md:rounded-l-none md:rounded-r-3xl
                                   shadow-2xl shadow-neon-blue/20 
                                   border border-neon-blue/20 transition duration-500 transform hover:scale-[1.02] 
                                   -mx-4 md:mx-0"
                    >
                        <h3 className="text-3xl font-extrabold text-neon-blue mb-12 tracking-wide border-b border-neon-blue/50 pb-4">
                            NICHOS DE MERCADO
                        </h3>

                        <ul className="space-y-6">
                            {nichos.map((nicho, index) => (
                                <li 
                                    key={index} 
                                    className="flex items-start space-x-4 text-xl font-medium p-2 
                                               border-b border-white/10 transition duration-300 
                                               hover:bg-white/10 hover:text-white rounded-lg cursor-pointer"
                                >
                                    <nicho.icon className="w-6 h-6 flex-shrink-0 mt-1 text-accent-yellow" />
                                    <span>{nicho.text}</span>
                                </li>
                            ))}
                        </ul>

                        <blockquote className="mt-16 pt-8 border-t-2 border-neon-blue/80 text-neon-blue italic text-lg leading-relaxed">
                            "NOSSAS SOLUÇÕES SE ADEQUAM A TODOS OS SEGMENTOS DE NEGÓCIO, DE FORMA PERSONALIZADA E ÚNICA."
                        </blockquote>
                    </div>
                </div>
            </div>
        </section>
    );
}