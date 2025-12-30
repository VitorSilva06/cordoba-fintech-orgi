import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export function CTA() {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    mensagem: '',
    newsletter: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <section id="contato-form" className="py-20 px-4 md:px-8 bg-[#0C1B33] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Blue Block */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#004BFF] rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl"
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl text-white mb-2">
                CÓRDOBA
              </h2>
              <p className="text-lg text-white">
                INTELIGÊNCIA EM RECUPERAÇÃO DE<br />
                CRÉDITO
              </p>
            </div>

            <div className="space-y-6 text-white">
              <p>
                A Córdoba é uma empresa especializada em cobrança e recuperação de crédito, que atua de forma estratégica para viabilizar novos acordos com clientes inadimplentes, sempre com foco em soluções conscientes, responsáveis e eficazes.
              </p>

              <p>
              Criamos condições para que o cliente pague da melhor forma possível, respeitando sua realidade e mantendo o equilíbrio entre resultado, relacionamento e conformidade.
              </p>

              <p>
       Todo o processo de comunicação é planejado, analisado e acompanhado de ponta a ponta, garantindo agilidade no atendimento e atuação próxima junto aos clientes inadimplentes.
Disponibilizamos canais digitais ágeis para negociação e pagamento, como boletos e formulários, aliados à atuação direta do nosso time especializado, que conduz as tratativas, esclarece dúvidas e assegura a efetividade da cobrança.
              </p>

              <div className="pt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:comercial@cordoba.com.br" className="hover:underline">
                    comercial@cordoba.com.br
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+551130480920" className="hover:underline">
                    (31) 3048-0920
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - White Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F2F4F7] text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#004BFF] border border-gray-200"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Sobrenome"
                  value={formData.sobrenome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F2F4F7] text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#004BFF] border border-gray-200"
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
                  className="w-full px-4 py-3 rounded-lg bg-[#F2F4F7] text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#004BFF] border border-gray-200"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F2F4F7] text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#004BFF] border border-gray-200"
                  required
                />
              </div>

              <div>
                <textarea
                  name="mensagem"
                  placeholder="Mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#F2F4F7] text-[#0C1B33] placeholder:text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#004BFF] border border-gray-200 resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="newsletter"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-[#004BFF] border-gray-300 rounded focus:ring-[#004BFF]"
                />
                <label htmlFor="newsletter" className="text-sm text-[#4A4A4A]">
                  Ao preencher este cadastro, concordo em receber comunicações de acordo com os{' '}
                  <a href="#" className="text-[#004BFF] underline">termos</a>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00C08A] text-white py-4 px-8 rounded-lg hover:bg-[#00A076] transition-colors shadow-lg"
              >
                ENVIAR
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
