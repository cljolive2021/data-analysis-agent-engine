'use client';

import { useState } from 'react';
import { BarChart3, Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { analyzeData } from '@/services/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('');
  const [context, setContext] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Por favor, selecione um arquivo para análise');
      return;
    }

    if (!target.trim()) {
      setError('Por favor, especifique a coluna alvo (target)');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeData(file, target, context);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Erro ao processar análise. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTarget('');
    setContext('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Data Analysis Engine</h1>
                <p className="text-blue-100 text-sm">Análise Inteligente de Dados para Copilot Studio</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white text-sm font-medium">100% Gratuito</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 rounded-lg p-6 shadow-xl border border-slate-600 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">📊 Configuração da Análise</h2>
              
              <form onSubmit={handleAnalyze} className="space-y-6">
                <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Coluna Alvo (Target) *
                  </label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="ex: salario, performance_score"
                    className="w-full px-4 py-2 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition"
                  />
                  <p className="mt-1 text-xs text-slate-400">Nome da coluna que você deseja analisar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Contexto da Análise (Opcional)
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="ex: Análise de fatores que influenciam o salário dos funcionários"
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-slate-600 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition resize-none"
                  />
                  <p className="mt-1 text-xs text-slate-400">Forneça contexto para melhor interpretação dos resultados</p>
                </div>

                {error && <ErrorMessage message={error} />}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Analisando...
                      </>
                    ) : (
                      '🚀 Analisar'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:cursor-not-allowed"
                  >
                    🔄 Limpar
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-2">
            {loading && <LoadingSpinner />}
            {results && !loading && <AnalysisResults data={results} />}
            {!loading && !results && !error && (
              <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-white mb-2">Aguardando Análise</h3>
                <p className="text-slate-400">Selecione um arquivo, especifique o target e clique em "Analisar" para ver os resultados</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-slate-400 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span>Desenvolvido com ❤️ para Copilot Studio</span>
            </div>
            <div className="flex items-center gap-4 text-xs flex-wrap">
              <a href="https://github.com/cljolive2021/data-analysis-agent-engine" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub
              </a>
              <span>© 2026 - MIT License</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
