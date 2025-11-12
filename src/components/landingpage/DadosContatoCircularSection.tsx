// src/components/sections/DadosContatoCircularSection.tsx
import React from 'react';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';

export function DadosContatoCircularSection() {
    
    // Estilo para todos os itens de contato
    const contactItemStyle = "flex items-center justify-center space-x-3"; 
    // Texto dos dados de contato: mais escuro (dark-text) e mais forte (font-semibold)
    const contactTextStyle = "text-dark-text font-semibold text-center"; 

    return (
        // Fundo em Roxo Profundo (primary-dark)
        <section className="bg-primary-dark py-16 md:py-32 flex items-center justify-center min-h-screen">
            
            {/* Contêiner do Círculo Externo */}
            <div className="relative w-[90vw] h-[90vw] max-w-[700px] max-h-[700px] 
                            rounded-full border-8 border-neon-blue/40 flex items-center justify-center p-4 md:p-8">
                
                {/* Contêiner do Círculo Interno (Fundo Branco/Cinza Neutro) */}
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-dark-text p-6 md:p-12 text-center shadow-2xl">
                    
                    {/* Título CÓRDOBA */}
                    <h2 className="text-5xl md:text-6xl font-extrabold text-accent-yellow mb-8 tracking-wide">
                        CÓRDOBA
                    </h2>

                    {/* Detalhes de Contato */}
                    {/* Alterado para centralizar todo o bloco */}
                    <div className="text-base md:text-lg space-y-4 max-w-xs md:max-w-sm mx-auto">
                        
                        {/* Endereço */}
                        <div className={contactItemStyle}>
                            <MapPin className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>Rua Jaeguar, 208, Prado, Belo Horizonte - MG - CEP 30411-040</p>
                        </div>
                        
                        {/* Telefone Geral */}
                        <div className={contactItemStyle}>
                            <Phone className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>(31) 3046-9803</p>
                        </div>
                        
                        {/* Website */}
                        <div className={contactItemStyle}>
                            <Globe className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>www.cordoba.com.br</p>
                        </div>
                        
                        {/* E-mail Comercial */}
                        <div className={contactItemStyle}>
                            <Mail className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>comercial@cordoba.com.br</p>
                        </div>

                        {/* Separador */}
                        <div className="py-2">
                             <div className="h-0.5 w-1/3 bg-neutral-gray mx-auto"></div>
                        </div>

                        {/* Nome do Contato (Welson Reis) */}
                        <div className={contactItemStyle}>
                            <Mail className="w-5 h-5 text-dark-text flex-shrink-0" /> 
                            <p className="text-dark-text font-bold">Welson Reis</p>
                        </div>
                        
                        {/* Telefone Welson Reis */}
                        <div className={contactItemStyle}>
                            <Phone className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>(31) 97519-5359</p>
                        </div>
                        
                        {/* E-mail Welson Reis */}
                        <div className={contactItemStyle}>
                            <Mail className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>welson.reis@numy.yoom.br</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}