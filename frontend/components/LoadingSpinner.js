'use client';

export default function LoadingSpinner() {
  return (
    <div className="bg-slate-700 rounded-lg p-12 text-center border border-slate-600 shadow-xl">
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-600"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Analisando dados...</h3>
      <p className="text-slate-400">Calculando correlações</p>
    </div>
  );
}
