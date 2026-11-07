import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, Phone, Building2, ArrowRight, Printer, Sparkles, MessageCircle } from 'lucide-react';
import { ClinicInfo, AnswersMap } from '../types';

interface FormConfirmationProps {
  clinicInfo?: ClinicInfo;
  answers: AnswersMap;
  submissionId: string;
  createdAt: string;
  onReset: () => void;
  onPrint: () => void;
}

export const FormConfirmation: React.FC<FormConfirmationProps> = ({
  clinicInfo,
  answers,
  submissionId,
  createdAt,
  onReset,
  onPrint,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#10B981', '#06B6D4', '#6366F1'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const totalAnswered = Object.keys(answers).filter((k) => {
    const a = answers[Number(k)];
    return a && (Array.isArray(a.value) ? a.value.length > 0 : Boolean(a.value?.trim()));
  }).length;

  const formattedDate = new Date(createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-indigo-100/50 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Animated check badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-6">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            Diagnóstico Recebido com Sucesso
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Obrigado! Diagnóstico Concluído
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
            Suas respostas foram registradas com sucesso no nosso banco de dados. Nossa equipe técnica da Localway já iniciou a análise dos seus requisitos para desenhar a automação ideal para o seu WhatsApp.
          </p>

          {/* Submission Summary Box */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 mb-8 text-left text-xs sm:text-sm">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3 text-slate-500">
              Resumo do Envio
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinicInfo?.clinicName && (
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span className="font-semibold truncate">{clinicInfo.clinicName}</span>
                </div>
              )}
              {clinicInfo?.whatsapp && (
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <span>{clinicInfo.whatsapp}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-slate-700">
                <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  {totalAnswered}
                </span>
                <span>{totalAnswered} de 25 perguntas respondidas</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400">
              Identificador do registro: <code className="text-slate-600 font-mono">{submissionId}</code>
            </div>
          </div>

          {/* Next Steps Roadmap */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 rounded-2xl border border-indigo-100 p-5 mb-8 text-left">
            <h3 className="font-bold text-indigo-950 text-xs sm:text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              O que acontece agora?
            </h3>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Análise do perfil da clínica:</strong> Avaliamos os gargalos informados e o volume de mensagens para definir a arquitetura do bot.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Estruturação do fluxo conversacional:</strong> Modelamos a inteligência artificial ou menus de agendamento conforme sua preferência.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Contato direto via WhatsApp:</strong> Um especialista da Localway entrará em contato {clinicInfo?.whatsapp ? <>com <strong>{clinicInfo.whatsapp}</strong></> : 'com sua equipe via WhatsApp'} para apresentar a proposta e demonstração.
                </span>
              </li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onPrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir / Salvar Cópia em PDF</span>
            </button>
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Enviar Novo Diagnóstico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
