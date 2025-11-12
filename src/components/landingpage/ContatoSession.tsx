// src/components/sections/ContatoSession.tsx
import React from 'react';
import { Mail, Phone } from 'lucide-react';

export function ContatoSession() {
    return (
        <section className="relative overflow-hidden bg-primary-dark py-16 md:py-32"> 
            
            {/* Container centralizado de largura máxima para agrupar as colunas */}
            <div className="max-w-7xl mx-auto shadow-2xl rounded-xl overflow-hidden">
                
                {/* MUDANÇA 1: Proporção da grade ajustada para 3/8 (Amarelo) e 5/8 (Roxo) */}
                <div className="grid grid-cols-1 md:grid-cols-8 min-h-[600px] items-stretch"> 
                    
                    {/* Coluna Esquerda: Texto de Destaque e Contato (Fundo Amarelo) */}
                    {/* Ocupa 3/8 (md:col-span-3) do espaço. */}
                    <div className="bg-accent-yellow text-primary-dark p-8 md:p-16 flex flex-col justify-center relative md:col-span-3">
                        
                        {/* Removido o max-w-md para que o conteúdo use a largura total do col-span-3 */}
                        <div className="mx-auto md:mx-0"> 
                            
                            {/* Título Principal */}
                            <header className="mb-8">
                                <h2 className="text-4xl font-extrabold text-primary-dark tracking-tighter">
                                    CORDOBA
                                </h2>
                                <p className="text-lg font-semibold border-b-2 border-primary-dark pb-1 inline-block">
                                    INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
                                </p>
                            </header>

                            {/* Bloco de Texto */}
                            <div className="space-y-6 text-lg font-medium">
                                <p>
                                    POSSIBILITAMOS AOS NOSSOS CLIENTES ESTAREM TOTALMENTE FOCADOS EM SEUS NEGÓCIOS. PERMITINDO QUE O SEU TIME ATUE DE FORMA ESTRATÉGICA.
                                </p>
                                <p>
                                    TENDO A GARANTIA DE QUE TODO O TRABALHO DE COBRANÇA SERÁ FEITO POR NÓS. PARA QUE VOCÊ GANHE AGILIDADE NO ATENDIMENTO DOS SEUS CLIENTES AUMENTANDO A SUA RENTABILIDADE.
                                </p>
                                <p className="font-bold text-xl pt-4">
                                    BASTA PREENCHER O FORMULÁRIO QUE A NOSSA EQUIPE ENTRARÁ EM CONTATO PARA CRIAR O SEU LOGIN E LIBERAR O TESTE EM NOSSA PLATAFORMA.
                                </p>
                            </div>
                            
                            {/* Contatos (Ajustado o Mail/Phone para melhor espaçamento) */}
                            <div className="mt-8 pt-4 border-t border-primary-dark/30 space-y-3">
                                <div className="flex items-center space-x-2 text-primary-dark font-bold">
                                    {/* MUDANÇA: Ajuste no tamanho do ícone para evitar quebra de linha */}
                                    <Mail className="w-6 h-6 flex-shrink-0" /> 
                                    <span className="break-words">SUCESSO.CLIENTE@NUMY.COM.BR</span>
                                </div>
                                <div className="flex items-center space-x-2 text-primary-dark font-bold">
                                    <Phone className="w-6 h-6 flex-shrink-0" />
                                    <span>(31) 3046-9803</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Formulário (Fundo Roxo Profundo) */}
                    {/* Ocupa 5/8 (md:col-span-5) do espaço. */}
                    <div className="bg-primary-dark p-8 md:p-16 flex items-center justify-center relative md:col-span-5">
                        
                        {/* MUDANÇA 2: Aumentando a largura máxima do formulário para preencher os 5/8 da coluna */}
                        <form className="w-full max-w-2xl space-y-4 bg-white p-6 rounded-xl shadow-2xl">
                            
                            <input type="text" placeholder="Nome*" required className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow" />
                            <input type="text" placeholder="Sobrenome*" required className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow" />
                            <input type="email" placeholder="Email*" required className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow" />
                            <input type="text" placeholder="Empresa*" required className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow" />
                            
                            {/* Selects: Segmento e Cargo */}
                            <select className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow">
                                <option value="">Segmento* (Selecione)</option>
                            </select>
                            <select className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow">
                                <option value="">Cargo* (Selecione)</option>
                            </select>
                            
                            <input type="tel" placeholder="Telefone*" required className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow" />
                            
                            <textarea placeholder="Mensagem*" rows={3} className="w-full p-3 border border-gray-300 rounded focus:ring-accent-yellow focus:border-accent-yellow"></textarea>
                            
                            {/* Checkbox de Consentimento */}
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="consent" className="text-accent-yellow focus:ring-accent-yellow" />
                                <label htmlFor="consent" className="text-sm text-gray-700">Eu concordo em receber comunicações.</label>
                            </div>
                            
                            {/* Botão ENVIAR */}
                            <button 
                                type="submit" 
                                className="w-full p-4 bg-accent-yellow text-primary-dark text-xl font-extrabold rounded-md mt-6 shadow-md hover:bg-yellow-500 transition duration-300"
                            >
                                ENVIAR
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}