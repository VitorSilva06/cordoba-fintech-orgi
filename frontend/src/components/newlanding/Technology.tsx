import { motion } from 'motion/react';
import { Layers, Settings, Eye } from 'lucide-react';

export function Technology() {
  const features = [
    {
      icon: Layers,
      title: 'MUITO MAIS QUE UMA SIMPLES PLATAFORMA',
      description: '',
    },
    {
      icon: Settings,
      title: 'GRANDE PODER DE CUSTOMIZAÇÃO E DETALHAMENTO',
      description: '',
    },
    {
      icon: Eye,
      title: 'ACESSIBILIDADE E VISIBILIDADE EM',
      subtitle: 'TEMPO REAL E ON-LINE',
      description: '',
    },
  ];

  return (
    <section id="tecnologia" className="py-20 px-4 md:px-8 bg-[#0C1B33] relative overflow-hidden">
      {/* Blue diagonal accent */}
      <div className="absolute top-0 left-0 w-full h-20 bg-[#004BFF] transform -skew-y-1 origin-top-left"></div>

      <div className="max-w-7xl mx-auto relative z-10 mt-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#004BFF] mb-8">
            NOSSA TECNOLOGIA
          </h2>
          
          <div className="border-2 border-[#00C08A] rounded-2xl p-6 md:p-8 max-w-4xl shadow-lg">
            <p className="text-lg md:text-xl text-[#00C08A]">
              Quando a tecnologia é inteligente o suficiente para que você não trave batalhas tecnológicas
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors shadow-lg"
            >
              <div className="mb-4">
                <feature.icon className="w-12 h-12 text-[#00C08A]" />
              </div>
              <h3 className="text-xl mb-2 text-white">
                {feature.title}
                {feature.subtitle && (
                  <>
                    <br />
                    <span className="text-[#00C08A]">{feature.subtitle}</span>
                  </>
                )}
              </h3>
              {feature.description && (
                <p className="text-white/80 text-sm mt-2">{feature.description}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-[#00C08A] text-white px-8 py-4 rounded-full shadow-lg">
            <p className="text-lg md:text-xl">
              MELHORES OS SEUS DADOS, MELHORES OS SEUS RESULTADOS
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-2 border-white/20 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg"
        >
          <h3 className="text-xl md:text-2xl text-white mb-4">
            Quando as respostas param de ser difíceis de se obter
          </h3>
          <p className="text-white/80 text-lg">
            Tem lidado com relatórios sem sentido ou que trazem informações que você já possui? Nos seus relatórios, por vezes, a informação vem faltando ou não tem sentido com a realidade?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
