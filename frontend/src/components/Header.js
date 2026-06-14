import React from 'react';
import { BarChart3, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Data Analysis Engine</h1>
              <p className="text-blue-100 text-sm">Análise Inteligente de Dados para Copilot Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-white text-sm font-medium">Powered by FastAPI + Polars</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
