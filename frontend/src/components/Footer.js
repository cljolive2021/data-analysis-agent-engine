import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span>Desenvolvido com</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>para Copilot Studio</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/cljolive2021" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Github className="w-5 h-5" />
            </a>
            <span className="text-xs">© 2026 - Todos os direitos reservados</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
