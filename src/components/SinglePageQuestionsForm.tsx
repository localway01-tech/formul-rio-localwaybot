import React, { useState } from 'react';
import {
  Send,
  Check,
  Plus,
  FileEdit,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { AnswersMap, QuestionAnswer } from '../types';

interface SinglePageQuestionsFormProps {
  answers: AnswersMap;
  onAnswerChange: (questionId: number, answer: QuestionAnswer) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError?: string | null;
}

export const SinglePageQuestionsForm: React.FC<SinglePageQuestionsFormProps> = ({
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
  submitError,
}) => {
  // Track open notes fields per question
  const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});

  const toggleNotes = (qId: number) => {
    setOpenNotes((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Progress calculation
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).filter((key) => {
    const a = answers[Number(key)];
    if (!a) return false;
    if (Array.isArray(a.value)) return a.value.length > 0;
    return typeof a.value === 'string' && a.value.trim().length > 0;
  }).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Handlers for single choice
  const handleSingleSelect = (questionId: number, option: string) => {
    const current = answers[questionId] || { value: '' };
    const newValue = current.value === option ? '' : option;
    onAnswerChange(questionId, {
      ...current,
      value: newValue,
    });
  };

  // Handlers for multiple choice
  const handleMultipleSelect = (questionId: number, option: string) => {
    const current = answers[questionId] || { value: [] };
    const currentValues = Array.isArray(current.value) ? current.value : [];
    let newValues: string[];
    if (currentValues.includes(option)) {
      newValues = currentValues.filter((v) => v !== option);
    } else {
      newValues = [...currentValues, option];
    }
    onAnswerChange(questionId, {
      ...current,
      value: newValues,
    });
  };

  // Handlers for text input / textarea
  const handleTextChange = (questionId: number, text: string) => {
    const current = answers[questionId] || { value: '' };
    onAnswerChange(questionId, {
      ...current,
      value: text,
    });
  };

  // Handlers for notes
  const handleNotesChange = (questionId: number, notes: string) => {
    const current = answers[questionId] || { value: '' };
    onAnswerChange(questionId, {
      ...current,
      notes,
    });
  };

  return (
    <div className="max-w-3xl mx-auto pb-16">

      {/* Title & Introduction Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2.5">
          Diagnóstico para Automação de Atendimento
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Responda às perguntas abaixo para entendermos o funcionamento da sua clínica e desenvolvermos uma automação de atendimento adequada às suas necessidades.
        </p>
      </div>

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 mb-8 shadow-xs transition-all">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Progresso das Respostas
          </span>
          <span className="font-semibold text-indigo-900">
            {answeredCount} de {totalQuestions} perguntas respondidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* Questions List (All 25 questions sequentially on one page) */}
      <div className="space-y-5">
        {QUESTIONS.map((q) => {
          const currentAns = answers[q.id] || { value: '' };
          const hasAnswer = Array.isArray(currentAns.value)
            ? currentAns.value.length > 0
            : typeof currentAns.value === 'string' && currentAns.value.trim().length > 0;
          const hasNotes = Boolean(currentAns.notes?.trim());
          const isNotesOpen = openNotes[q.id] || hasNotes;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-5 sm:p-6 shadow-xs ${
                hasAnswer
                  ? 'border-indigo-200/90 ring-1 ring-indigo-50/60'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.title}
                  </h3>
                  {hasAnswer ? (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Respondida
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                      Opcional
                    </span>
                  )}
                </div>
                {q.helperText && (
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                    <span className="text-indigo-500 font-bold">•</span>
                    {q.helperText}
                  </p>
                )}
              </div>

              {/* 1. SINGLE CHOICE */}
              {q.type === 'single' && q.options && (
                <div className="space-y-2.5">
                  {q.options.map((opt) => {
                    const isSelected = currentAns.value === opt;
                    return (
                      <div
                        key={opt}
                        onClick={() => handleSingleSelect(q.id, opt)}
                        className={`group p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/60 border-indigo-400 text-slate-900 font-medium ring-1 ring-indigo-200'
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/90 text-slate-700'
                        }`}
                      >
                        <span className="leading-relaxed">{opt}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 group-hover:border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 2. MULTIPLE CHOICE */}
              {q.type === 'multiple' && q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const selectedList = Array.isArray(currentAns.value) ? currentAns.value : [];
                    const isSelected = selectedList.includes(opt);
                    return (
                      <div
                        key={opt}
                        onClick={() => handleMultipleSelect(q.id, opt)}
                        className={`group p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/60 border-indigo-400 text-slate-900 font-medium ring-1 ring-indigo-200'
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/90 text-slate-700'
                        }`}
                      >
                        <span className="leading-relaxed">{opt}</span>
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 group-hover:border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. TEXT / TEXTAREA */}
              {q.type === 'text' && (
                <div>
                  <textarea
                    rows={3}
                    placeholder={q.placeholder || 'Digite sua resposta aqui...'}
                    value={typeof currentAns.value === 'string' ? currentAns.value : ''}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    className="w-full p-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none resize-y min-h-[90px]"
                  />
                </div>
              )}

              {/* 4. SINGLE WITH TEXT */}
              {q.type === 'single_with_text' && q.options && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = currentAns.value === opt;
                      return (
                        <div
                          key={opt}
                          onClick={() => handleSingleSelect(q.id, opt)}
                          className={`group p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-indigo-50/60 border-indigo-400 text-slate-900 font-medium ring-1 ring-indigo-200'
                              : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200/90 text-slate-700'
                          }`}
                        >
                          <span className="leading-relaxed">{opt}</span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 group-hover:border-slate-400 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Supplemental text input */}
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder={q.placeholder || 'Ou digite uma resposta personalizada...'}
                      value={typeof currentAns.value === 'string' && !q.options.includes(currentAns.value) ? currentAns.value : ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Optional Notes Section */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                {!isNotesOpen ? (
                  <button
                    type="button"
                    onClick={() => toggleNotes(q.id)}
                    className="self-start inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Adicionar detalhes ou observações adicionais</span>
                  </button>
                ) : (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-medium flex items-center gap-1">
                        <FileEdit className="w-3 h-3 text-indigo-500" />
                        Observações complementares:
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleNotes(q.id)}
                        className="text-slate-400 hover:text-slate-600 text-[10px]"
                      >
                        Ocultar
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Ex.: Particularidades deste item na nossa rotina..."
                      value={currentAns.notes || ''}
                      onChange={(e) => handleNotesChange(q.id, e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Action Card at the Bottom of the Single Page */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 text-center shadow-xs">
        <h4 className="text-lg font-bold text-slate-900 mb-1">
          Finalizar Diagnóstico
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Todas as respostas serão salvas com segurança no banco de dados. Perguntas não preenchidas são tratadas como opcionais.
        </p>

        {/* Error message card if submission failed */}
        {submitError && (
          <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 max-w-lg mx-auto text-left animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Não foi possível enviar agora:</p>
              <p className="text-xs text-rose-700 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2.5 px-8 sm:px-12 py-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 active:scale-[0.99] w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Gravando no Banco de Dados...</span>
            </>
          ) : (
            <>
              <span>Finalizar e Enviar Diagnóstico</span>
              <Send className="w-4 h-4 text-indigo-300" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
