import { motion } from 'motion/react';
import { Play, Youtube } from 'lucide-react';

export function AboutUs() {
  return (
    <section id="sobre" className="py-20 px-4 md:px-8 bg-[#F2F4F7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8">
              <span className="text-[#004BFF]">SOBRE NÓS</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl">
              <p>
                <span className="text-[#004BFF]">SOMOS TALENTOSOS, CRIATIVOS, DINÂMICOS E PRÁTICOS.</span>
              </p>

              <p>
                <span className="text-[#004BFF]">TEMOS O ESPÍRITO JOVEM.</span>
              </p>

              <p>
                <span className="text-[#4A4A4A]">ACIMA DE TUDO SOMOS FOCADOS NA ENTREGA DE </span>
                <span className="text-[#004BFF]">RESULTADOS.</span>
              </p>

              <p>
                <span className="text-[#4A4A4A]">RESOLVEMOS PROBLEMAS COMPLEXOS DE FORMA SIMPLES.</span>
              </p>

              <p className="italic text-[#00C08A]">
                A NOSSA SIMPLICIDADE SOFISTICADA!!
              </p>

              <div className="pt-6">
                <p className="text-[#4A4A4A] mb-4">ASSISTA</p>
                <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full bg-[#00C08A] flex items-center justify-center hover:bg-[#00A076] transition-colors">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-[#004BFF] flex items-center justify-center hover:bg-[#0040DD] transition-colors">
                    <Youtube className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x:50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://i.ibb.co/WWJkqX9c/pexels-kindelmedia-7105787.jpg"
                alt="Equipe dinâmica e criativa"
                className="max-w-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
