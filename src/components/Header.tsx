import React from 'react';
import { Bot, Shield, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'admin';
  onNavigate: (view: 'form' | 'admin') => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isAdminLoggedIn }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-all no-print">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div 
          onClick={() => onNavigate('form')}
          className="flex items-center gap-2.5 cursor-pointer group transition-opacity hover:opacity-90 flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900">
                LOCALWAY
              </span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Automação
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
              Diagnóstico de Atendimento
            </p>
          </div>
        </div>



        {/* Right Action button */}
        <div className="flex items-center gap-2">
          {currentView === 'admin' ? (
            <button
              onClick={() => onNavigate('form')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Formulário</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-[0.98]"
              title="Acessar o Painel Administrativo da Localway"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isAdminLoggedIn ? 'Painel Admin' : 'Acessar Painel ADM'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
