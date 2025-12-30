import { motion } from 'motion/react';
import { Building2, Landmark, Home, Phone, Shield, GraduationCap, Wheat } from 'lucide-react';

export function WhoWeServe() {
  const niches = [
    {
      icon: Building2,
      title: 'DEPARTAMENTOS FINANCEIROS',
    },
    {
      icon: Landmark,
      title: 'BANCOS E INSTITUIÇÕES FINANCEIRAS',
    },
    {
      icon: Home,
      title: 'CONSTRUTORAS',
    },
    {
      icon: Phone,
      title: 'TELEFONIA',
    },
    {
      icon: Shield,
      title: 'ADMINISTRADORAS DE CONSÓRCIO E SEGURADORAS',
    },
    {
      icon: GraduationCap,
      title: 'INSTITUIÇÕES DE ENSINO',
    },
    {
      icon: Wheat,
      title: 'AGRONEGÓCIO',
    },
  ];

  return (
    <section id="para-quem" className="py-20 px-4 md:px-8 bg-[#0C1B33] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8">
              <span className="text-[#004BFF]">PARA QUEM</span>
              <br />
              <span className="text-[#004BFF]">FAZEMOS</span>
            </h2>

            <div className="relative">
              <img
                src="https://i.ibb.co/FC0D98d/pexels-fauxels-3183181.jpg"
                alt="Equipe profissional"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl text-[#004BFF] mb-8">
              NICHOS DE MERCADO
            </h3>

            <div className="space-y-4">
              {niches.map((niche, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="text-[#00C08A] group-hover:scale-110 transition-transform">
                    <niche.icon className="w-6 h-6" />
                  </div>
                  <p className="text-white">{niche.title}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-lg bg-white/5 border-l-4 border-[#00C08A]">
              <p className="text-white/80 italic">
                "NOSSAS SOLUÇÕES SE ADEQUAM A TODOS OS SEGMENTOS DE NEGÓCIO, DE FORMA PERSONALIZADA E ÚNICA."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
