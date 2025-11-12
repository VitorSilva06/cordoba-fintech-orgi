import { Menu, X } from "lucide-react"; 
import React, { useState } from 'react';

// Importar o logo (ajuste o caminho se necessário)
import logoCordoba from '../../assets/logoCordobaSemFundo.png'; 

// Função auxiliar para combinar classes CSS, evitando repetições desnecessárias
const classNames = (...classes) => classes.filter(Boolean).join(' ');


export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar o menu mobile

    // Lista de itens de navegação (Ajuste os hrefs para os IDs das suas seções)
    const navItems = [
        { name: 'HOME', href: '#home', current: true },
        { name: 'SOBRE', href: '#about-purpose', current: false }, 
        { name: 'START', href: '#start-section', current: false }, 
        { name: 'SOLUÇÕES', href: '#solutions', current: false },
        { name: 'CONTATO', href: '#contact', current: false },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false); // Fecha o menu ao clicar em um link (mobile)
    };

    return (
        <> 
            {/* 1. Barra de Navegação Superior (Sticky/Fixo) */}
            {/* Fundo Roxo (primary-dark) com transparência e blur para o efeito "flutuante" */}
            <nav className="fixed top-0 w-full bg-primary-dark/95 backdrop-blur-sm py-4 border-b border-gray-500/50 z-30 transition duration-300"> 
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-10">
                        
                        {/* Logo para telas pequenas (Mobile - à esquerda) */}
                        <div className="flex items-center lg:hidden">
                             {/* Você pode querer mostrar o logo apenas na sidebar mobile ou centralizar o nome da marca. 
                                 Para manter o layout limpo, vou deixar o botão à esquerda e o logo centralizado na sidebar. */}
                        </div>

                        {/* Botão Hamburguer (Aparece apenas em mobile) */}
                        <button
                            type="button"
                            className="lg:hidden p-2 text-white hover:text-accent-yellow transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Menu Horizontal (Desktop - Hidden em mobile) */}
                        <div className="hidden lg:flex flex-1 items-center justify-between">
                            {/* Logo à esquerda na navegação desktop */}
                            <img src={logoCordoba} alt="Logotipo Córdoba Fintech" className="h-8 mr-6" /> 
                            
                            <div className="flex space-x-6">
                                {navItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            'p-2 text-sm font-semibold tracking-wider transition-colors duration-200 flex-shrink-0',
                                            // Destaque Amarelo (accent-yellow) para o item ativo/hover
                                            item.current
                                                ? 'bg-accent-yellow text-primary-dark rounded shadow-md' 
                                                : 'text-white hover:text-accent-yellow hover:scale-[1.05] transform'
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </nav>
            
            {/* 2. Menu Lateral (Sidebar) - Mobile */}
            <div 
                className={classNames(
                    "fixed top-0 right-0 h-full w-64 bg-primary-dark shadow-2xl z-40 transform transition-transform duration-300 lg:hidden",
                    isMenuOpen ? "translate-x-0" : "translate-x-full" // Controla se o menu está visível
                )}
            >
                {/* Cabeçalho da Sidebar (Logo + Botão Fechar) */}
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <img src={logoCordoba} alt="Logotipo Córdoba Fintech" className="h-8" />
                    <button
                        type="button"
                        className="p-2 text-white hover:text-accent-yellow"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Itens do Menu Lateral */}
                <div className="flex flex-col p-4 space-y-4">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={handleLinkClick} // Fecha ao clicar
                            className={classNames(
                                'block p-3 text-lg font-semibold transition-colors duration-200 rounded',
                                // Destaque Amarelo
                                item.current
                                    ? 'bg-accent-yellow text-primary-dark shadow-md' 
                                    : 'text-white hover:bg-white/10 hover:text-accent-yellow'
                            )}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>

            {/* 3. Overlay Escuro (Fecha o menu ao clicar fora) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
}