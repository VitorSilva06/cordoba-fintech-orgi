import { motion } from 'motion/react';
import { Users, BarChart3, Mail } from 'lucide-react';
import { useState } from 'react';

export function WhyCordoba() {
  const [formData, setFormData] = useState({
    name: '',  
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const benefits = [
    {
      icon: Users,
      title: 'ACOMPANHAMENTO DA OPERAÇÃO EM TEMPO REAL',
      description: 'Visibilidade completa das ações de cobrança, evolução das negociações e resultados, com total transparência e controle da operação.',
    },
    {
      icon: BarChart3,
      title: 'RÉGUA DE COMUNICAÇÃO ESTRATÉGICA',
      description: 'Planejamento e execução de réguas de comunicação multicanal, com contatos no momento certo, linguagem adequada e acompanhamento contínuo das interações.',
    },
    {
      icon: Mail,
      title: 'SEGURANÇA E CONFORMIDADE',
      description: 'Atuação em conformidade com a LGPD, com controle das informações, proteção de dados e segurança em todas as etapas da cobrança.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="porque-cordoba" className="py-20 px-4 md:px-8 bg-[#0C1B33] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 text-white">
            PORQUE CONTAR COM <span className="text-[#004BFF]">CÓRDOBA</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg白/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors border border-white/10 shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#004BFF] flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/70">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <button className="w-full bg-[#00C08A] text-white py-4 px-8 rounded-xl hover:bg-[#00A076] transition-colors shadow-lg">
                CONHECER AGORA
              </button>
            </motion.div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#004BFF] rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl text-white mb-4">
                  CÓRDOBA
                </h3>
                <p className="text-white text-lg">
                  INTELIGÊNCIA EM RECUPERAÇÃO DE CRÉDITO
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#00C08A]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#00C08A]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#00C08A]"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder="Empresa"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#00C08A]"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Mensagem"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#00C08A] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00C08A] text-white py-4 px-8 rounded-xl hover:bg-[#00A076] transition-colors shadow-lg"
                >
                  ENVIAR MENSAGEM
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/80 text-sm">
                  Experimente financeiro e tecnologia em ambiente inovador, eficaz e simples de ser implementado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="bg-[#00C08A] text-white py-4 px-12 rounded-xl hover:bg-[#00A076] transition-colors text-lg shadow-lg">
            FALE CONOSCO
          </button>
        </motion.div>
      </div>
    </section>
  );
}
