// src/components/layout/Footer.tsx
import React from 'react';
import { Facebook, Twitter, Youtube } from 'lucide-react';
import logo from '../../assets/logoCordobaSemFundo.png';

export function FooterLP() {

    const linkTitleStyle =
        "text-xl font-bold text-accent-yellow mb-4 tracking-wider border-b-2 border-accent-yellow inline-block pb-1";

    return (
        <footer className="bg-primary-dark text-white py-14 md:py-24 border-t border-neon-blue/20">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">

                {/* GRID PRINCIPAL DO FOOTER */}
                <div className="
                    grid 
                    grid-cols-1 
                    sm:grid-cols-2 
                    md:grid-cols-4 
                    gap-14
                    items-start
                ">

                    {/* COLUNA 1 – LOGO */}
                    <div className="flex flex-col items-start space-y-4 text-center sm:text-left">
                        <img
                            src={logo}
                            alt="logo"
                            className="w-40 sm:w-48 md:w-56 object-contain"
                        />

                        <p className="text-base text-white/70">
                            Inteligência em Recuperação de Crédito.
                        </p>
                    </div>

                    {/* COLUNA 2 – REDES SOCIAIS */}
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-neon-blue mb-5">REDES SOCIAIS</h3>

                        <div className="flex justify-center sm:justify-start space-x-4 mb-6">

                            {/* FACEBOOK */}
                            <a className="
                                p-3 rounded-md bg-white hover:bg-gray-200 
                                transition shadow
                            ">
                                <Facebook className="w-7 h-7 text-blue-700" />
                            </a>

                            {/* INSTAGRAM (placeholder) */}
                            <a className="
                                p-3 rounded-md bg-white hover:bg-gray-200 
                                transition shadow font-bold text-pink-500
                            ">
                                IG
                            </a>

                            {/* YOUTUBE */}
                            <a className="
                                p-3 rounded-md bg-white hover:bg-gray-200
                                transition shadow
                            ">
                                <Youtube className="w-7 h-7 text-red-600" />
                            </a>
                        </div>

                        <div className="text-accent-yellow space-y-1 text-base font-semibold">
                            <p>FACEBOOK</p>
                            <p>INSTAGRAM</p>
                            <p>YOUTUBE</p>
                        </div>
                    </div>

                    {/* COLUNA 3 – LINKS */}
                    <div className="text-center sm:text-left">
                        <h3 className={linkTitleStyle}>LINKS IMPORTANTES</h3>

                        <div className="space-y-3 text-base">
                            <a href="#" className="block hover:text-neon-blue transition">
                                POLÍTICA DE SEGURANÇA DE DADOS
                            </a>
                            <a href="#" className="block hover:text-neon-blue transition">
                                POLÍTICA DE QUALIDADE
                            </a>
                            <a href="#" className="block text-white/50 hover:text-neon-blue transition">
                                Termos de Uso
                            </a>
                        </div>
                    </div>

                    {/* COLUNA 4 – CONTATO */}
                    <div className="text-center sm:text-left">
                        <h3 className={linkTitleStyle}>CONTATO</h3>

                        <div className="space-y-3 text-base">
                            <p>comercial@cordoba.com.br</p>
                            <p>(31) 3046-9803</p>

                            {/* BOTÃO */}
                            <button 
                                className="
                                    mt-4 px-6 py-3 
                                    bg-neon-blue/20 
                                    text-neon-blue 
                                    font-semibold 
                                    border border-neon-blue 
                                    rounded-lg
                                    shadow-[0_0_12px_rgba(0,174,255,0.5)]
                                    hover:bg-neon-blue 
                                    hover:text-primary-dark
                                    hover:shadow-[0_0_22px_rgba(0,174,255,0.9)]
                                    transition-all duration-300 
                                    tracking-wide text-lg
                                "
                            >
                                ✦ Agende uma Demonstração
                            </button>
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div className="
                    mt-14 pt-8 
                    border-t border-neon-blue/20 
                    text-center 
                    text-base text-white/50
                ">
                    <p>&copy; {new Date().getFullYear()} CORDOBA. Todos os direitos reservados.</p>
                </div>

            </div>
        </footer>
    );
}
