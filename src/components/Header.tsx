import React from 'react';
import { Bot, Shield, ArrowLeft, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentView: 'form' | 'admin';
  onNavigate: (view: 'form' | 'admin') => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isAdminLoggedIn }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div 
          onClick={() => onNavigate('form')}
          className="flex items-center gap-3 cursor-pointer group transition-opacity hover:opacity-90"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800/10 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900">
                LOCALWAY
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Automação
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Diagnóstico de Atendimento para Clínicas
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          {currentView === 'admin' ? (
            <button
              onClick={() => onNavigate('form')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Formulário Público</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all"
              title="Acesso restrito da equipe Localway"
            >
              <Shield className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600" />
              <span>{isAdminLoggedIn ? 'Painel Admin' : 'Área Restrita'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
