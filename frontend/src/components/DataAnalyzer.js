import React, { useState } from 'react';
import FileUpload from './FileUpload';
import AnalysisResults from './AnalysisResults';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { analyzeData } from '../services/api';

const DataAnalyzer = () => {
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

    // Validações
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="lg:col-span-1">
        <div className="bg-slate-700 rounded-lg p-6 shadow-xl border border-slate-600">
          <h2 className="text-xl font-bold text-white mb-6">📊 Configuração da Análise</h2>
          
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Upload de Arquivo */}
            <FileUpload onFileSelect={handleFileSelect} selectedFile={file} />

            {/* Campo Target */}
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

            {/* Campo Contexto */}
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

            {/* Mensagem de Erro */}
            {error && <ErrorMessage message={error} />}

            {/* Botões */}
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
  );
};

export default DataAnalyzer;
