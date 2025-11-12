// src/components/layout/Footer.tsx
import React from 'react';
import { Facebook, Twitter, Youtube } from 'lucide-react'; 

export function FooterLP() {
    
    // Estilo para os títulos de links/políticas
    const linkTitleStyle = "text-lg font-bold text-accent-yellow mb-2 tracking-wider border-b-2 border-accent-yellow inline-block pb-1";

    return (
        // Fundo em Roxo Profundo (primary-dark)
        <footer className="bg-primary-dark text-white py-12 md:py-20 border-t border-neon-blue/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-4">
                    
                    {/* Coluna 1: Logo ou Informação Principal (Opcional - Adicionei um placeholder) */}
                    <div>
                        <h3 className="text-3xl font-extrabold text-neon-blue mb-4">CORDOBA</h3>
                        <p className="text-sm text-white/70">Inteligência em Recuperação de Crédito.</p>
                    </div>

                    {/* Coluna 2: Redes Sociais */}
                    <div>
                        <h3 className="text-lg font-bold text-neon-blue mb-4">REDES SOCIAIS</h3>
                        
                        <div className="flex space-x-4 mb-6">
                            {/* Facebook */}
                            <a href="#" aria-label="Facebook" className="p-2 rounded-md bg-white hover:bg-gray-200 transition">
                                <Facebook className="w-6 h-6 text-blue-700" />
                            </a>
                            {/* Instagram (Usando um placeholder visual) */}
                            <a href="#" aria-label="Instagram" className="p-2 rounded-md bg-white hover:bg-gray-200 transition">
                                <span className="w-6 h-6 text-pink-500 font-bold">IG</span> {/* Placeholder para Instagram */}
                            </a>
                            {/* YouTube */}
                            <a href="#" aria-label="YouTube" className="p-2 rounded-md bg-white hover:bg-gray-200 transition">
                                <Youtube className="w-6 h-6 text-red-600" />
                            </a>
                        </div>
                        
                        {/* Links de Redes (Texto Amarelo - conforme imagem) */}
                        <div className="text-accent-yellow space-y-1 text-sm font-semibold">
                            <p>FACEBOOK</p>
                            <p>INSTAGRAM</p>
                            <p>YOUTUBE</p>
                        </div>
                    </div>

                    {/* Coluna 3: Links de Políticas */}
                    <div>
                        <h3 className={linkTitleStyle}>LINKS IMPORTANTES</h3>
                        <div className="space-y-2 text-sm">
                            <a href="#" className="block text-white hover:text-neon-blue transition duration-200">
                                POLÍTICA DE SEGURANÇA DE DADOS
                            </a>
                            <a href="#" className="block text-white hover:text-neon-blue transition duration-200">
                                POLÍTICA DE QUALIDADE
                            </a>
                            {/* Placeholder para outros links comuns de rodapé */}
                            <a href="#" className="block text-white/50 hover:text-neon-blue transition duration-200">
                                Termos de Uso
                            </a>
                        </div>
                    </div>

                    {/* Coluna 4: Contato Rápido (Opcional - Reutilizando dados do formulário) */}
                    <div>
                        <h3 className={linkTitleStyle}>CONTATO</h3>
                        <div className="space-y-2 text-sm">
                            <p>sucesso.cliente@numy.com.br</p>
                            <p>(31) 3046-9803</p>
                            <p className="pt-2 text-neon-blue font-semibold">
                                Agende uma demonstração
                            </p>
                        </div>
                    </div>
                </div>

                {/* Direitos Autorais (Copyright) */}
                <div className="mt-12 pt-8 border-t border-neon-blue/20 text-center text-sm text-white/50">
                    <p>&copy; {new Date().getFullYear()} CORDOBA. Todos os direitos reservados.</p>
                </div>

            </div>
        </footer>
    );
}