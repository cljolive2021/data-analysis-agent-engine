import React, { useState } from 'react';
import DataAnalyzer from './components/DataAnalyzer';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <DataAnalyzer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
