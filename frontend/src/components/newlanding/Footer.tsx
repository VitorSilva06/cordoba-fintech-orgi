import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0C1B33] text-white pt-20 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left - Brand and Social */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-6">
              <span className="text-white text-2xl font-bold">CÓRDOBA FINTECH</span>
            </div>
            
            <div className="mb-6">
              <h4 className="text-white mb-4">REDES SOCIAIS</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#00C08A] transition text-[#0C1B33]"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#00C08A] transition text-[#0C1B33]"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-[#00C08A] transition text-[#0C1B33]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <a href="#" className="hover:text-[#00C08A] transition">FACEBOOK</a>
              </div>
              <div>
                <a href="#" className="hover:text-[#00C08A] transition">INSTAGRAM</a>
              </div>
              <div>
                <a href="#" className="hover:text-[#00C08A] transition">LINKEDIN</a>
              </div>
            </div>
          </div>

          {/* Center - Important Links */}
          <div className="text-center lg:text-left">
            <h4 className="text-[#004BFF] mb-6">LINKS IMPORTANTES</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-[#00C08A] transition">
                  POLÍTICA DE PRIVACIDADE DE DADOS
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00C08A] transition">
                  PORTAL
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00C08A] transition">
                  Política de Cookies Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00C08A] transition">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          {/* Right - Contact */}
          <div className="text-center lg:text-left">
            <h4 className="text-[#004BFF] mb-6">CONTATO</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 justify-center lg:justify-start">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:comercial@cordoba.com.br"
                  className="hover:text-[#00C08A] transition"
                >
                  comercial@cordoba.com.br
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center lg:justify-start">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="tel:+551130480920" className="hover:text-[#00C08A] transition">
                  (11) 3048-0920
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center lg:justify-start">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-left">
                  Rua Jaguari, 208, Prado, Belo Horizonte<br />
                  - MG - CEP 30411-040
                </span>
              </li>
              <li className="flex items-start gap-2 justify-center lg:justify-start">
                <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.cordoba.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00C08A] transition"
                >
                  www.cordoba.com.br
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <a
                href="#contato-form"
                className="inline-block bg-[#00C08A] text-white px-6 py-3 rounded-lg hover:bg-[#00A076] transition"
              >
                + Agende uma Demonstração
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 CÓRDOBA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
