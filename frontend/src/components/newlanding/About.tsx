import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section id="sobre" className="py-20 bg-[#0C1B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-[#004BFF] text-center mb-16"
        >
          ENTENDA A CÓRDOBA
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0C1B33]/60 p-8 md:p-12 rounded-2xl border border-white/10 shadow-lg"
          >
            <p className="text-white text-lg leading-relaxed mb-6">
              A Córdoba atua como uma gestora operacional de cobrança, responsável pelo gerenciamento completo da carteira de inadimplentes das empresas.{' '}
              <span className="text-[#FECB07] font-bold">Combinamos tecnologia própria e atuação especializada</span>,
              para simplificar a rotina das empresas, reduzir riscos financeir,diminuir as dores de cabeça do dia a dia {' '}
              <span className="text-[#FECB07] font-bold">e aumentar a eficácia  na recuperação de crédito.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <ImageWithFallback
                src="https://i.ibb.co/vCHvDmhK/Gemini-Generated-Image-w18kpiw18kpiw18k.png"
                alt="Tecnologia Córdoba Fintech"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
