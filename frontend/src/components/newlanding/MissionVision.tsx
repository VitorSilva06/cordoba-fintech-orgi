import { motion } from 'motion/react';
import { Target, Rocket, Eye, Award } from 'lucide-react';

export function MissionVision() {
  return (
    <section className="py-20 bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-[#004BFF] text-center mb-16"
        >
          Propósito, Missão e Visão
        </motion.h2>

        {/* Propósito, Missão, Visão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0C1B33]/60 p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#004BFF] rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#004BFF]">Propósito</h3>
            </div>
            <p className="text-white leading-relaxed">
              Transformar a jornada financeira entre empresas e clientes, tornando cada interação
              mais humana, inteligente e eficiente por meio da tecnologia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0C1B33]/60 p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#004BFF] rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#004BFF]">Missão</h3>
            </div>
            <p className="text-white leading-relaxed">
              Impulsionar a performance financeira dos nossos clientes automatizando toda a
              comunicação, relacionamento e ações estratégicas, do pré ao pós-vencimento, com
              segurança, transparência e eficiência.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#0C1B33]/60 p-8 rounded-2xl border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#004BFF] rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#004BFF]">Visão</h3>
            </div>
            <p className="text-white leading-relaxed">
              Ser referência em cobrança e recuperação de crédito, utilizando inteligência e automação para apoiar a atuação humana especializada e redefinir a forma como o mercado garante pagamentos e se relaciona com seus clientes.
            </p>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0C1B33]/60 p-8 md:p-12 rounded-2xl border border-white/10 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#004BFF] rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-[#004BFF]">Valores</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Transparência</h4>
              <p className="text-white/80">
                Relações claras em todas as interações.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Tecnologia</h4>
              <p className="text-white/80">Inovação como base do nosso trabalho.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Ética</h4>
              <p className="text-white/80">
                Respeito, responsabilidade e integridade em cada etapa.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Performance</h4>
              <p className="text-white/80">Foco em resultados consistentes e mensuráveis.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Empatia</h4>
              <p className="text-white/80">
                Comunicação humanizada, mesmo em processos automatizados.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Segurança</h4>
              <p className="text-white/80">Proteção e confiabilidade em cada dado e ação.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
