import React, { useState } from 'react';
import { Building2, User, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { ClinicInfo } from '../types';

interface FormStepClinicProps {
  clinicInfo: ClinicInfo;
  onChange: (info: ClinicInfo) => void;
  onNext: () => void;
}

export const FormStepClinic: React.FC<FormStepClinicProps> = ({ clinicInfo, onChange, onNext }) => {
  const [errors, setErrors] = useState<{ clinicName?: string; whatsapp?: string }>({});

  const validate = () => {
    const newErrors: { clinicName?: string; whatsapp?: string } = {};
    if (!clinicInfo.clinicName.trim()) {
      newErrors.clinicName = 'Por favor, informe o nome da clínica.';
    }
    if (!clinicInfo.whatsapp.trim()) {
      newErrors.whatsapp = 'Por favor, informe o número de WhatsApp para contato.';
    } else if (clinicInfo.whatsapp.replace(/\D/g, '').length < 10) {
      newErrors.whatsapp = 'Informe o DDD e o número completo (mínimo 10 dígitos).';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  // Simple Brazilian phone mask helper
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    onChange({ ...clinicInfo, whatsapp: formatted });
    if (errors.whatsapp) setErrors({ ...errors, whatsapp: undefined });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro Hero Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          Diagnóstico Especializado
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Diagnóstico para Automação de Atendimento
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Responda às perguntas abaixo para entendermos o funcionamento da sua clínica e desenvolvermos uma automação de atendimento adequada às suas necessidades.
        </p>
      </div>

      {/* Highlights bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
          <Clock className="w-4 h-4 text-indigo-600 mb-1" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Rápido & Direto</span>
          <span className="text-[10px] text-slate-500">Cerca de 4 a 6 min</span>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700">5 Categorias</span>
          <span className="text-[10px] text-slate-500">Fluxo organizado</span>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
          <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Confidencial</span>
          <span className="text-[10px] text-slate-500">Uso exclusivo Localway</span>
        </div>
      </div>

      {/* Clinic identification form card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Dados Iniciais da Clínica
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informações básicas para personalizarmos o diagnóstico e associarmos seu atendimento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Clínica */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nome da Clínica ou Consultório <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Ex.: Clínica Odontológica Sorriso & Vida"
                value={clinicInfo.clinicName}
                onChange={(e) => {
                  onChange({ ...clinicInfo, clinicName: e.target.value });
                  if (errors.clinicName) setErrors({ ...errors, clinicName: undefined });
                }}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.clinicName
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.clinicName && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.clinicName}</p>
            )}
          </div>

          {/* Nome do Responsável */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nome do Responsável / Cargo <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Ex.: Dra. Mariana Silva (Diretora Clínica)"
                value={clinicInfo.contactName}
                onChange={(e) => onChange({ ...clinicInfo, contactName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              />
            </div>
          </div>

          {/* WhatsApp & Email (Two Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp Principal <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={clinicInfo.whatsapp}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-2 ${
                    errors.whatsapp
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.whatsapp && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.whatsapp}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                E-mail <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="contato@clinicamodelo.com.br"
                  value={clinicInfo.email}
                  onChange={(e) => onChange({ ...clinicInfo, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cidade e Estado */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cidade / Estado <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Ex.: São Paulo - SP"
                value={clinicInfo.city}
                onChange={(e) => onChange({ ...clinicInfo, city: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:opacity-95 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Começar Diagnóstico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-3">
              Você poderá navegar livremente entre as categorias e alterar respostas antes do envio.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
