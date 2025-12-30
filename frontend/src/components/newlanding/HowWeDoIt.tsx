import { motion } from 'motion/react';
import { Upload, CheckCircle2, MessageSquare, CreditCard, BarChart3 } from 'lucide-react';

export function HowWeDoIt() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload da base de inadimplentes (em CSV/Excel).',
    },
    {
      icon: CheckCircle2,
      title: 'Validação automática dos dados e segmentação por faixa de atraso.',
    },
    {
      icon: MessageSquare,
      title: 'Disparos multicanais (WhatsApp, Voz, E-mail e SMS) com mensagens inteligentes e personalizadas.',
    },
    {
      icon: CreditCard,
      title: 'Pagamentos integrados via Pix, Boleto e Cartão (Mercado Pago ou PicPay).',
    },
    {
      icon: BarChart3,
      title: 'Conciliação automática e dashboards hierárquicos (Diretor, Gerente, Operador e Cliente).',
    },
  ];

  return (
    <section id="como-fazemos" className="py-20 px-4 md:px-8 bg-[#F2F4F7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-12 text-[#004BFF]">
            COMO FAZEMOS
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-[#4A4A4A] mb-4">
            Transformamos o processo de cobrança em um fluxo organizado, digital e inteligente, com apoio de tecnologia própria e a atuação direta de um time especializado em {' '}
            <span className="text-[#004BFF]">cobrança e recuperação de crédito.</span>
          </p>
          
          <p className="text-lg md:text-xl text-[#4A4A4A]">
            Conectamos tecnologia, dados e estratégia operacional para apoiar nosso time na gestão completa da carteira de inadimplentes {' '}
            <span className="text-[#004BFF]">do primeiro contato até o pagamento efetivo</span>{' '}
            reduzindo esforço interno,{' '}
            <span className="text-[#004BFF]">eliminando controles manuais e simplificando a rotina das empresas.</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-[#4A4A4A] mb-8">
            A nossa plataforma realiza{' '}
            <span className="text-[#004BFF]">toda a jornada de recuperação de crédito de forma integrada:</span>
          </p>

          <div className="grid gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 items-start group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#004BFF]/10 flex items-center justify-center group-hover:bg-[#004BFF] transition-colors">
                  <step.icon className="w-6 h-6 text-[#004BFF] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-[#4A4A4A] text-lg">{step.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-r from-[#004BFF]/10 to-[#0C1B33]/10 border border-[#004BFF]/20 shadow-lg"
        >
          <p className="text-lg md:text-xl text-[#4A4A4A]">
            Tudo isso com{' '}
            <span className="text-[#004BFF]">IA de aprendizado, criptografia total,</span>{' '}
            e uma{' '}
            <span className="text-[#004BFF]">operação 100% em conformidade com a LGPD.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
