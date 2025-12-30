import { motion } from 'motion/react';
import { Bot, MessageSquare, BarChart3, Shield, Zap, Users } from 'lucide-react';

export function Solutions() {
  const solutions = [
    {
      icon: Bot,
      title: 'Automação Inteligente',
      description:
        'Réguas automatizadas de comunicação que se adaptam ao comportamento de cada cliente.',
    },
    {
      icon: MessageSquare,
      title: 'Comunicação Omnichannel',
      description:
        'WhatsApp, SMS, Email, voz e muito mais. Tudo integrado em uma única plataforma.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description:
        'Dashboards em tempo real com métricas de performance e inteligência de dados.',
    },
    {
      icon: Shield,
      title: 'Segurança LGPD',
      description:
        'Compliance total com a Lei Geral de Proteção de Dados e melhores práticas de mercado.',
    },
    {
      icon: Zap,
      title: 'Campanhas Estratégicas',
      description:
        'Feirões, acordos especiais e ações customizadas para maximizar recuperação.',
    },
    {
      icon: Users,
      title: 'Gestão Operacional Especializada',
      description:
        'Gestão operacional do nosso time especializado em cobrança, com processos bem definidos, acompanhamento contínuo e foco total na recuperação de crédito.',
    },
  ];

  return (
    <section id="solucoes" className="py-20 bg-[#F2F4F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[#004BFF] mb-6">
            NOSSAS SOLUÇÕES
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Tecnologia de ponta para transformar sua operação de recuperação de crédito
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-[#004BFF]/10 hover:border-[#004BFF]/50 transition-all duration-300 group shadow-lg"
              >
                <div className="w-16 h-16 bg-[#004BFF] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0C1B33] mb-4">{solution.title}</h3>
                <p className="text-[#4A4A4A] leading-relaxed">{solution.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
