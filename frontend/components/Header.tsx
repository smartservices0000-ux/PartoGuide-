
import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">PartoAnaliz AI</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Akıllı Partograf Takip Sistemi</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Canlı Analiz Aktif
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
