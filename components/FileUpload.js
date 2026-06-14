'use client';

import { useRef } from 'react';
import { Upload, FileCheck } from 'lucide-react';

export default function FileUpload({ onFileSelect, selectedFile }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['.csv', '.xlsx'];
      const isValid = validTypes.some(type => file.name.endsWith(type));
      
      if (isValid) {
        onFileSelect(file);
      } else {
        alert('Selecione um arquivo CSV ou Excel');
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Upload de Arquivo *
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full border-2 border-dashed border-slate-500 hover:border-blue-400 rounded-lg p-6 text-center cursor-pointer transition"
      >
        {selectedFile ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <FileCheck className="w-6 h-6" />
            <div className="text-left">
              <p className="font-semibold">{selectedFile.name}</p>
              <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Upload className="w-8 h-8" />
            <div>
              <p className="font-semibold text-white">Clique para selecionar</p>
              <p className="text-xs">CSV ou Excel</p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
