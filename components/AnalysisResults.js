'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function AnalysisResults({ data }) {
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

  const correlationData = (data.correlations || [])
    .map(item => ({
      name: item.feature?.replace(/_/g, ' '),
      value: Math.abs(item.correlation)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <Section title="📊 Resumo dos Dados" section="summary" expanded={expandedSections.summary} onToggle={toggleSection}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Linhas" value={data.rows} icon="📈" />
          <StatCard label="Colunas" value={data.columns} icon="📋" />
          <StatCard label="Numéricas" value={data.numericCols} icon="🔢" />
          <StatCard label="Categóricas" value={data.categoricalCols} icon="🏷️" />
        </div>
      </Section>

      <Section title={`🎯 Target: ${data.target}`} section="target" expanded={expandedSections.target} onToggle={toggleSection}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Média" value={data.stats?.mean?.toFixed(2)} icon="📊" />
          <StatCard label="Mediana" value={data.stats?.median?.toFixed(2)} icon="📈" />
          <StatCard label="Desvio" value={data.stats?.std?.toFixed(2)} icon="📉" />
          <StatCard label="Mínimo" value={data.stats?.min?.toFixed(0)} icon="⬇️" />
          <StatCard label="Máximo" value={data.stats?.max?.toFixed(0)} icon="⬆️" />
        </div>
      </Section>

      {correlationData.length > 0 && (
        <Section title="🔗 Top Correlações" section="correlations" expanded={expandedSections.correlations} onToggle={toggleSection}>
          <div className="space-y-4">
            {correlationData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1' }} angle={-45} textAnchor="end" height={100} />
                  <YAxis tick={{ fill: '#cbd5e1' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} labelStyle={{ color: '#e2e8f0' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="bg-slate-600 rounded-lg p-4 max-h-64 overflow-y-auto">
              <ul className="space-y-2">
                {(data.correlations || []).map((corr, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm text-slate-300">
                    <span>{corr.feature}</span>
                    <span className="font-mono font-bold px-3 py-1 rounded bg-slate-500/20">
                      {corr.correlation?.toFixed(4)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {data.recommendations && data.recommendations.length > 0 && (
        <Section title="💡 Recomendações" section="recommendations" expanded={expandedSections.recommendations} onToggle={toggleSection}>
          <div className="space-y-3">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-slate-600 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-slate-200 text-sm">• {rec}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, section, expanded, onToggle, children }) {
  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden shadow-xl">
      <button
        onClick={() => onToggle(section)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-600 transition"
      >
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {expanded && <div className="px-6 py-4 border-t border-slate-600">{children}</div>}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-slate-600 rounded-lg p-4 text-center border border-slate-500">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-slate-400 text-xs uppercase">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
