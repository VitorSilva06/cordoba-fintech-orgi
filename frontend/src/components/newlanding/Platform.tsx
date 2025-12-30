import { motion } from 'motion/react';

export function Platform() {
  return (
    <section id="plataforma" className="py-20 px-4 md:px-8 bg-[#0C1B33] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Blue Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#004BFF] rounded-3xl p-8 md:p-12 lg:p-16 relative shadow-2xl"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
                PLATAFORMA<br />
                <span className="border-b-4 border-[#00C08A] inline-block pb-2">CÓRDOBA</span>
              </h2>

              <p className="text-xl md:text-2xl text-white leading-relaxed">
                ecnologia própria com automação, inteligência artificial e inteligência de dados para apoiar a atuação do nosso time na cobrança e recuperação de crédito, garantindo eficiência, rapidez, segurança, organização e controle de ponta a ponta.
              </p>
            </div>

            {/* Decorative diagonal cut */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C08A] transform rotate-45 translate-x-16 -translate-y-16"></div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://i.ibb.co/cKbGCWyV/Gemini-Generated-Image-cep649cep649cep6.png"
                alt="Plataforma Córdoba - Tecnologia e Automação"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

        {/* Top text - IA and LGPD */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl text-white">
            Tudo isso com{' '}
            <span className="text-[#00C08A]">IA de aprendizado, criptografia total,</span>{' '}
            e uma operação{' '}
            <span className="text-[#00C08A]">100% em conformidade com a LGPD.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
