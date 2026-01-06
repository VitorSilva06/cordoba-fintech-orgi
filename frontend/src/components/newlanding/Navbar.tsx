import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#0C1B33]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <span className="text-white text-xl md:text-2xl font-bold tracking-wide">CÓRDOBA FINTECH</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#home" className="text-white hover:text-[#00C08A] transition font-medium">
              HOME
            </a>
            <a href="../login" className="text-white hover:text-[#00C08A] transition font-medium">
              LOGIN
            </a>
            <a href="#sobre" className="text-white hover:text-[#00C08A] transition font-medium">
              SOBRE
            </a>
            <a href="#solucoes" className="text-white hover:text-[#00C08A] transition font-medium">
              SOLUÇÕES
            </a>
            <a href="#contato" className="text-white hover:text-[#00C08A] transition font-medium">
              CONTATO
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="#home"
              className="block text-white hover:text-[#00C08A] transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              HOME
            </a>
            <a
              href="#login"
              className="block text-white hover:text-[#00C08A] transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              LOGIN
            </a>
            <a
              href="#sobre"
              className="block text-white hover:text-[#00C08A] transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              SOBRE
            </a>
            <a
              href="#solucoes"
              className="block text-white hover:text-[#00C08A] transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              SOLUÇÕES
            </a>
            <a
              href="#contato"
              className="block text-white hover:text-[#00C08A] transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              CONTATO
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
