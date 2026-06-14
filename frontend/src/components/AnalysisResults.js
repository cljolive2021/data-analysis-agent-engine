import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AnalysisResults = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    target: true,
    correlations: true,
    recommendations: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  // Preparar dados de correlações para gráfico
  const correlationData = Object.entries(data.correlations || {})
    .filter(([key, value]) => typeof value === 'number')
    .map(([name, value]) => ({
      name: name.replace('_', ' '),
      value: Math.abs(value),
      original: value
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // Dados para o insight resumido
  const summary = data.insights?.data_summary || {};
  const targetAnalysis = data.insights?.target_analysis || {};
  const topCorrelations = data.insights?.top_correlations || [];
  const recommendations = data.recommendations || [];
  const columnTypes = data.column_types || {};

  return (
    <div className="space-y-6">
      {/* Seção de Resumo */}
      <Section
        title="📊 Resumo dos Dados"
        section="summary"
        expanded={expandedSections.summary}
        onToggle={toggleSection}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total de Linhas" value={summary.total_rows} icon="📈" />
          <StatCard label="Total de Colunas" value={summary.total_columns} icon="📋" />
          <StatCard label="Colunas Numéricas" value={summary.numeric_columns} icon="🔢" />
          <StatCard label="Colunas Categóricas" value={summary.categorical_columns} icon="🏷️" />
        </div>
      </Section>

      {/* Seção de Análise do Target */}
      <Section
        title={`🎯 Análise do Target: ${data.target}`}
        section="target"
        expanded={expandedSections.target}
        onToggle={toggleSection}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {targetAnalysis.type === 'numeric' && (
              <>
                <StatCard label="Média" value={targetAnalysis.mean?.toFixed(2)} icon="📊" />
                <StatCard label="Mediana" value={targetAnalysis.median?.toFixed(2)} icon="📍" />
                <StatCard label="Desvio Padrão" value={targetAnalysis.std?.toFixed(2)} icon="📐" />
                <StatCard label="Mínimo" value={targetAnalysis.min?.toFixed(0)} icon="📉" />
                <StatCard label="Máximo" value={targetAnalysis.max?.toFixed(0)} icon="📈" />
              </>
            )}
            {targetAnalysis.type === 'categorical' && (
              <StatCard label="Valores Únicos" value={targetAnalysis.unique_values} icon="🏷️" />
            )}
          </div>
        </div>
      </Section>

      {/* Seção de Correlações */}
      {topCorrelations.length > 0 && (
        <Section
          title="🔗 Top Correlações"
          section="correlations"
          expanded={expandedSections.correlations}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            {correlationData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} angle={-45} textAnchor="end" height={100} />
                  <YAxis tick={{ fill: '#cbd5e1' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => value.toFixed(4)}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="bg-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-white mb-3">Detalhes das Correlações:</h4>
              <ul className="space-y-2">
                {topCorrelations.map((corr, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm text-slate-300">
                    <span>{corr.feature}</span>
                    <span className={`font-mono font-bold px-3 py-1 rounded ${
                      corr.correlation > 0.5 ? 'bg-green-500/20 text-green-400' :
                      corr.correlation < -0.5 ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {corr.correlation.toFixed(4)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* Seção de Recomendações */}
      {recommendations.length > 0 && (
        <Section
          title="💡 Recomendações"
          section="recommendations"
          expanded={expandedSections.recommendations}
          onToggle={toggleSection}
        >
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-slate-600 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-slate-200 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Seção de Tipos de Colunas */}
      <Section title="📋 Tipos de Colunas" section="columns" expanded={true} onToggle={() => {}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Categóricas ({columnTypes.categorical?.length || 0})</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              {columnTypes.categorical?.map((col, idx) => (
                <li key={idx}>• {col}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-600 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Numéricas ({columnTypes.numeric?.length || 0})</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              {columnTypes.numeric?.map((col, idx) => (
                <li key={idx}>• {col}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, section, expanded, onToggle, children }) => {
  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden shadow-xl">
      <button
        onClick={() => onToggle(section)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-600 transition"
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {expanded && <div className="px-6 py-4 border-t border-slate-600">{children}</div>}
    </div>
  );
};

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="bg-slate-600 rounded-lg p-4 text-center border border-slate-500">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default AnalysisResults;
