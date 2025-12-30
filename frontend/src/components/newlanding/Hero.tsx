import { motion } from 'motion/react';

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            CÓRDOBA FINTECH
          </h1>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-12 bg-[#004BFF]"></div>
            <p className="text-xl md:text-2xl text-white">
              INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
            </p>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-xl bg-[#0C1B33]/60 border border-white/10 shadow-lg"
          >
            <p className="text-white text-lg leading-relaxed">
              Somos uma empresa especializada em {' '}
              <span className="text-[#FECB07] font-bold"> Cobrança e Recuperação de Crédito </span> com tecnologia própria voltada para soluções inteligentes e eficazes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-xl bg-[#0C1B33]/60 border border-white/10 shadow-lg"
          >
            <p className="text-white text-lg leading-relaxed">
              Utilizamos soluções digitais próprias, integradas e seguras para potencializar a atuação do nosso time especializado, que conduz a {' '}
              <span className="text-[#FECB07] font-bold">cobrança e a recuperação de crédito com foco em garantir o pagamento.</span>
            </p>
          </motion.div>
        </div>

        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-[#004BFF]/20 to-[#004BFF]/10 rounded-2xl p-8 md:p-12 border border-[#004BFF]/30 shadow-lg"
        >
          <div className="bg-[#004BFF] text-white px-6 py-4 rounded-lg mb-8 inline-block">
            <h2 className="text-2xl md:text-3xl font-bold uppercase">
              COM INTELIGÊNCIA E TECNOLOGIA, ASSEGURAMOS COBRANÇAS EFICIENTES E MAIOR TAXA DE PAGAMENTO.
            </h2>
          </div>

          <div className="space-y-6 text-white mb-8">
            <p className="text-xl font-bold">
              Automatizamos toda a jornada de comunicação e relacionamento com seus clientes.
            </p>
            <p className="text-xl font-bold">
              Antes, durante e após os vencimentos, incluindo réguas completas para campanhas,
              feirões e ações estratégicas.
            </p>
            <p className="text-xl font-bold">
              Tudo com agilidade, transparência, segurança e automação em cada etapa.
            </p>
          </div>

          <a
            href="/login"
            className="inline-block bg-[#00C08A] hover:bg-[#00A076] text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg"
          >
            Solicite uma demonstração
          </a>
        </motion.div>
      </div>
    </section>
  );
}
