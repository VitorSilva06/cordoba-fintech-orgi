// src/components/sections/ComoFazemosSection.tsx
import React from 'react';
import { Upload, CheckCircle, MessageSquare, CreditCard, BarChart } from 'lucide-react'; 

export function ComoFazemosSection() {
    
    // Dados para os passos do processo (Baseado em image_4ae8ed.png)
    const steps = [
        { 
            icon: Upload, 
            text: "Upload da base de inadimplentes (em CSV/Excel)." 
        },
        { 
            icon: CheckCircle, 
            text: "Validação automática dos dados e segmentação por faixa de atraso." 
        },
        { 
            icon: MessageSquare, 
            text: "Disparos multicanais (WhatsApp, Voz, E-mail e SMS) com mensagens inteligentes e personalizadas." 
        },
        { 
            icon: CreditCard, 
            text: "Pagamentos integrados via Pix, Boleto e Cartão (Mercado Pago ou PicPay)." 
        },
        { 
            icon: BarChart, 
            text: "Conciliação automática e dashboards hierárquicos (Diretor, Gerente, Operador e Cliente)." 
        },
    ];

    return (
        // Usamos o primary-dark (roxo escuro) como fundo, como na imagem de referência.
        <section className="bg-primary-dark py-16 md:py-32 text-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título Principal */}
                <header className="mb-12 md:mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-accent-yellow mb-4">
                        Como fazemos
                    </h2>
                </header>
                
                {/* Introdução (Corpo de Texto - image_4ae8ed.png) */}
                <div className="space-y-6 text-lg md:text-xl font-light leading-relaxed">
                    <p>
                        nós transformamos o processo de cobrança em um fluxo <span className="font-bold text-neon-blue">automático, digital e inteligente.</span>
                    </p>
                    <p>
                        Conectamos <span className="font-bold text-accent-yellow">tecnologia, dados e comportamento</span> para gerir toda a sua carteira de inadimplentes — desde o primeiro contato até o pagamento efetivo — <span className="font-bold text-neon-blue">sem esforço manual, sem planilhas e sem complicação.</span>
                    </p>
                    <p>
                        A nossa plataforma realiza <span className="font-bold text-neon-blue">toda a jornada de recuperação de crédito de forma integrada</span>:
                    </p>
                </div>

                {/* Lista de Passos (image_4ae8ed.png) */}
                <div className="mt-12 md:mt-16 max-w-4xl">
                    <ul className="space-y-8">
                        {steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-4">
                                {/* Ícone de Destaque (Arrow/Triângulo, simulado com a cor neon-blue) */}
                                <step.icon className="w-8 h-8 flex-shrink-0 mt-1 text-neon-blue" />
                                
                                <span className="text-xl md:text-2xl font-medium leading-snug">
                                    {/* O texto é citado diretamente das setas da imagem */}
                                    {step.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Conclusão/Garantia (image_4ae8ed.png) */}
                <div className="mt-16 pt-8 border-t border-neon-blue/50">
                    <p className="text-xl md:text-2xl font-extrabold leading-snug text-white">
                        Tudo isso com <span className="text-accent-yellow">IA de aprendizado, criptografia total</span>, e uma <span className="text-accent-yellow">operação 100% em conformidade com a LGPD.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}