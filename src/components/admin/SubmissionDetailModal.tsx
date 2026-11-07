import React, { useState } from 'react';
import {
  X,
  Printer,
  Trash2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bot,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Submission } from '../../types';
import { CATEGORIES, QUESTIONS, Question } from '../../data/questions';

interface SubmissionDetailModalProps {
  submission: Submission | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteRequest: (submission: Submission) => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  isOpen,
  onClose,
  onDeleteRequest,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<number | 'all'>('all');

  if (!isOpen || !submission) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(submission.createdAt).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate answered questions
  const totalQuestions = QUESTIONS.length;
  let answeredCount = 0;
  let unansweredCount = 0;

  QUESTIONS.forEach((q) => {
    const a = submission.answers?.[q.id];
    if (a && (Array.isArray(a.value) ? a.value.length > 0 : Boolean(a.value?.trim()))) {
      answeredCount++;
    } else {
      unansweredCount++;
    }
  });

  const rawPhone = (submission.whatsapp || '').replace(/\D/g, '');
  const waUrl = rawPhone ? `https://wa.me/55${rawPhone}` : '#';

  const displayedCategories =
    activeCategoryFilter === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.id === activeCategoryFilter);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto print:shadow-none print:border-none print:max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Diagnóstico de Atendimento
              </h2>
              <p className="text-xs text-slate-400">
                Respostas completas da clínica • Localway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              title="Exportar respostas para PDF ou imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={() => onDeleteRequest(submission)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Excluir este formulário"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excluir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Screen Header with Clinic Information */}
        <div className="p-5 sm:p-8 bg-slate-50/70 border-b border-slate-200">
          {/* Print only header */}
          <div className="hidden print:flex items-center justify-between pb-4 mb-4 border-b border-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">LOCALWAY</span>
              <span className="text-xs text-slate-500">• Diagnóstico de Automação de WhatsApp</span>
            </div>
            <span className="text-xs text-slate-500">Impresso em {new Date().toLocaleDateString('pt-BR')}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full mb-2">
                Clínica Cadastrada
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {submission.clinicName}
              </h1>
              {submission.contactName && (
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {submission.contactName}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Respondidas</span>
                <span className="text-sm font-extrabold text-emerald-600">
                  {answeredCount} / {totalQuestions}
                </span>
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Sem Resposta</span>
                <span className={`text-sm font-extrabold ${unansweredCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {unansweredCount}
                </span>
              </div>
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-semibold">{submission.whatsapp}</span>
              {rawPhone && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium hover:bg-emerald-100 transition-colors no-print"
                  title="Abrir conversa no WhatsApp Web"
                >
                  WhatsApp <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate">{submission.email || 'Não informado'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="truncate">{submission.city || 'Não informada'}</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills (Hidden on print) */}
        <div className="px-5 sm:px-8 py-3 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar no-print">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeCategoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas as Categorias (25)
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                activeCategoryFilter === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cat. {cat.numberRoman} — {cat.title}
            </button>
          ))}
        </div>

        {/* Answers List Body */}
        <div className="p-5 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {displayedCategories.map((category) => {
            const catQuestions = QUESTIONS.filter((q) => q.category === category.id);

            return (
              <div key={category.id} className="space-y-4 break-inside-avoid">
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                  <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 text-xs font-extrabold flex items-center justify-center">
                    {category.numberRoman}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{category.subtitle}</p>
                  </div>
                </div>

                {/* Questions under this category */}
                <div className="space-y-3">
                  {catQuestions.map((q) => {
                    const ans = submission.answers?.[q.id];
                    const hasValue =
                      ans &&
                      (Array.isArray(ans.value)
                        ? ans.value.length > 0
                        : Boolean(ans.value && ans.value.trim().length > 0));

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs sm:text-sm transition-all break-inside-avoid ${
                          hasValue
                            ? 'bg-white border-slate-200/90 shadow-2xs'
                            : 'bg-amber-50/40 border-amber-200/80'
                        }`}
                      >
                        {/* Question title and answer status badge */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="font-semibold text-slate-800 leading-snug">
                            {q.title}
                          </span>

                          {hasValue ? (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Respondida
                            </span>
                          ) : (
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              Sem resposta
                            </span>
                          )}
                        </div>

                        {/* Answer rendering */}
                        {hasValue ? (
                          <div className="mt-2 text-slate-900">
                            {Array.isArray(ans.value) ? (
                              <div className="flex flex-wrap gap-1.5">
                                {ans.value.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold"
                                  >
                                    ✓ {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {ans.value}
                              </div>
                            )}

                            {/* Additional notes if provided */}
                            {ans.notes && ans.notes.trim() && (
                              <div className="mt-2 p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-indigo-950">
                                <span className="font-bold text-indigo-700 block mb-0.5 text-[10px] uppercase">
                                  Observação adicional da clínica:
                                </span>
                                {ans.notes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-amber-700 font-medium italic">
                            Esta pergunta não foi respondida pelo cliente. Pode ser abordada durante a reunião de alinhamento com a clínica.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            ID do registro: <code className="font-mono text-slate-700">{submission.id}</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
