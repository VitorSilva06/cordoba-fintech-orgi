// src/components/sections/DadosContatoCircularSection.tsx
import React from 'react';
import { MapPin, Phone, Globe, Mail } from 'lucide-react';

export function DadosContatoCircularSection() {

    const contactItemStyle = "flex items-center justify-center space-x-3";
    const contactTextStyle = "text-dark-text font-semibold text-center";

    return (
        <section className="bg-primary-dark py-16 md:py-32 flex items-center justify-center min-h-screen px-4">
            
            {/* CÍRCULO EXTERNO */}
            <div className="
                relative 
                w-[95vw] h-[95vw]
                max-w-[650px] max-h-[650px]
                rounded-full border-8 border-neon-blue/40 
                flex items-center justify-center 
                p-4 md:p-8
            ">

                {/* CÍRCULO INTERNO */}
                <div className="
                    w-full h-full rounded-full bg-white 
                    flex flex-col items-center justify-center 
                    text-dark-text 
                    p-6 md:p-12 text-center 
                    shadow-2xl
                ">
                    
                    {/* TÍTULO */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-accent-yellow mb-8 tracking-wide">
                        CÓRDOBA
                    </h2>

                    {/* INFORMAÇÕES */}
                    <div className="text-sm sm:text-base md:text-lg space-y-5 max-w-xs sm:max-w-sm mx-auto">
                        
                        {/* Endereço */}
                        <div className={contactItemStyle}>
                            <MapPin className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>
                                Rua Jaeguar, 208, Prado, Belo Horizonte - MG - CEP 30411-040
                            </p>
                        </div>

                        {/* Telefone */}
                        <div className={contactItemStyle}>
                            <Phone className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>(31) 3046-9803</p>
                        </div>

                        {/* Website */}
                        <div className={contactItemStyle}>
                            <Globe className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>www.cordoba.com.br</p>
                        </div>

                        {/* E-mail */}
                        <div className={contactItemStyle}>
                            <Mail className="w-5 h-5 text-dark-text flex-shrink-0" />
                            <p className={contactTextStyle}>comercial@cordoba.com.br</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
