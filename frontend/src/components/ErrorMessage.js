import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-red-200 text-sm font-medium">Erro</p>
        <p className="text-red-100 text-sm mt-1">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-300 transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
