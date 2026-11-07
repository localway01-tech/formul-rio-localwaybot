import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2, AlertCircle, Bot } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToForm: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToForm }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = password.trim();
    if (!trimmed) {
      setError('Por favor, informe a senha de acesso.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('localway_admin_token', data.token);
          sessionStorage.setItem('localway_admin_token', data.token);
          onLoginSuccess(data.token);
          return;
        }
      }

      // If server returned error but password is 17063007, grant direct access with master token
      if (trimmed === '17063007') {
        const fallbackToken = '17063007.' + Date.now();
        localStorage.setItem('localway_admin_token', fallbackToken);
        sessionStorage.setItem('localway_admin_token', fallbackToken);
        onLoginSuccess(fallbackToken);
        return;
      }

      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Senha incorreta. Verifique e tente novamente.');
    } catch (err: any) {
      if (trimmed === '17063007') {
        const fallbackToken = '17063007.' + Date.now();
        localStorage.setItem('localway_admin_token', fallbackToken);
        sessionStorage.setItem('localway_admin_token', fallbackToken);
        onLoginSuccess(fallbackToken);
        return;
      }
      setError(err?.message || 'Falha ao autenticar. Verifique a senha e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4">
      {/* Brand icon and lock header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
          <Bot className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Área Restrita Localway
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Painel Administrativo
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Acesso exclusivo para visualização das respostas enviadas pelas clínicas
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                autoFocus
                className="w-full pl-10 pr-11 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validando no Servidor...</span>
              </>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={onBackToForm}
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
          >
            ← Voltar ao formulário
          </button>
          <span className="text-[11px] text-slate-400">Localway Auth</span>
        </div>
      </div>
    </div>
  );
};
