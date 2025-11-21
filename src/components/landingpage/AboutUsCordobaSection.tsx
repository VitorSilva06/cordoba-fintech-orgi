// src/components/landingpage/AboutUsSection.tsx (Versão Atualizada)

import React from 'react';
import { Youtube } from 'lucide-react';
// Importe a imagem da criança com o foguete
import rocketKidImage from '../../assets/meninaComFoguete.png';

export function AboutUsCordobaSection() {

    // NOVO NÚMERO DE WHATSAPP AQUI
    const whatsappNumber = "553175195359";

    return (
        <section
            className="bg-primary-dark py-16 md:py-32 text-white relative"
            id="about-us-section"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <header className="mb-16 md:mb-20">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent-yellow mb-2 uppercase">
                        Sobre nós
                    </h2>
                </header>

                <div className="grid md:grid-cols-2 gap-12 items-start uppercase">

                    <div className="space-y-8 md:space-y-10">
                        {/* ... Bloco de texto ... */}
                        <p className="text-xl sm:text-4xl font-extrabold leading-relaxed text-accent-yellow">
                            Somos talentosos, criativos, dinâmicos e práticos.
                        </p>

                        <p className="text-xl sm:text-4xl font-extrabold leading-relaxed text-accent-yellow">
                            Temos o espírito jovem.
                        </p>

                        <p className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mt-8">
                            ACIMA DE TUDO SOMOS FOCADOS NA ENTREGA DE <span className="text-accent-yellow">RESULTADOS.</span>
                        </p>

                        <p className="text-2xl sm:text-4xl font-extrabold leading-snug pt-4">
                            Resolvemos problemas complexos de <span className="font-extrabold">FORMA SIMPLES.</span>
                            <span className="text-neon-blue font-extrabold italic block mt-1">A NOSSA SIMPLICIDADE SOFISTICADA!!</span>
                        </p>

                        <h4 className="text-2xl font-semibold text-white ">
                            Assista
                        </h4>

                        <div className="flex space-x-6 ">
                            {/* Ícone do WhatsApp (SVG) com o novo número */}
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-neon-blue text-primary-dark rounded-full shadow-lg transition transform hover:scale-110 hover:shadow-neon-blue/50"
                                aria-label={`Contatar via WhatsApp: ${whatsappNumber}`}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.52 3.4 1.48 4.85L2 22l5.47-1.42c1.41.77 2.99 1.18 4.47 1.18 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm3.36 14.5c-.14.23-.39.29-.63.2-.24-.09-.34-.36-.48-.62-.14-.26-.45-.6-.53-.74-.09-.14-.17-.18-.3-.06-.13.12-.34.36-.5.48-.16.12-.33.15-.61.08-.28-.07-.99-.37-1.42-.78-.44-.4-.74-.99-.83-1.26-.09-.27-.01-.42.06-.52.06-.1.14-.17.2-.28.07-.11.14-.19.19-.29.06-.1.02-.18-.02-.27-.04-.09-.39-.93-.45-1.07-.06-.14-.12-.17-.2-.18-.08-.01-.16-.01-.25-.01-.09 0-.25.04-.37.17-.12.13-.48.47-.48 1.15 0 .68.49 1.33.56 1.44.07.11 1.05 1.76 2.53 2.45.65.29 1.17.45 1.57.57.57.17 1.08.14 1.48.09.43-.05 1.29-.53 1.48-1.04.19-.51.19-.94.13-1.04-.06-.1-.23-.15-.48-.28z" />
                                </svg>
                            </a>

                            {/* Ícone do YouTube */}
                            <a
                                href="#video-demo"
                                className="p-3 bg-accent-yellow text-primary-dark rounded-full shadow-lg transition transform hover:scale-110 hover:shadow-accent-yellow/50"
                                aria-label="Assistir Vídeo de Demonstração"
                            >
                                <Youtube className="w-8 h-8" />
                            </a>
                        </div>

                    </div>

                    <div className="flex flex-col items-center md:items-end space-y-8 mt-10 md:mt-0">

                        {/* Removido h-[70rem] para que a altura se ajuste automaticamente ao seu conteúdo (a imagem) */}
                        <div className="w-full max-w-md sm:max-w-lg overflow-hidden">
                            <img
                                src={rocketKidImage}
                                alt="Criança com mochila de foguete, simbolizando inovação e resultados."
                                // Alterado h-full para h-auto ou removido (já que não há h fixo no pai) e mantendo o w-full
                                className="w-full h-auto object-contain transition duration-500 hover:scale-[1.05]"
                            />
                        </div>


                    </div>
                </div>

            </div>
        </section>
    );
}