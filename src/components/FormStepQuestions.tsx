import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Check,
  Plus,
  MessageSquare,
  Calendar,
  TrendingUp,
  Building2,
  Sparkles,
  HelpCircle,
  FileEdit,
  Loader2,
} from 'lucide-react';
import { Question, CategoryInfo, CATEGORIES, QUESTIONS } from '../data/questions';
import { AnswersMap, QuestionAnswer } from '../types';

interface FormStepQuestionsProps {
  currentCategory: number;
  answers: AnswersMap;
  onAnswerChange: (questionId: number, answer: QuestionAnswer) => void;
  onCategorySelect: (categoryId: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const FormStepQuestions: React.FC<FormStepQuestionsProps> = ({
  currentCategory,
  answers,
  onAnswerChange,
  onCategorySelect,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
}) => {
  // Track open notes fields
  const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});

  const toggleNotes = (qId: number) => {
    setOpenNotes((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const categoryQuestions = QUESTIONS.filter((q) => q.category === currentCategory);
  const currentCategoryInfo = CATEGORIES.find((c) => c.id === currentCategory) || CATEGORIES[0];

  // Global progress calculation across all 25 questions
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).filter((key) => {
    const a = answers[Number(key)];
    if (!a) return false;
    if (Array.isArray(a.value)) return a.value.length > 0;
    return typeof a.value === 'string' && a.value.trim().length > 0;
  }).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Category specific answered count
  const catAnsweredCount = categoryQuestions.filter((q) => {
    const a = answers[q.id];
    if (!a) return false;
    if (Array.isArray(a.value)) return a.value.length > 0;
    return typeof a.value === 'string' && a.value.trim().length > 0;
  }).length;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  // Handlers for question value changes
  const handleSingleSelect = (questionId: number, option: string) => {
    const current = answers[questionId] || { value: '' };
    // Click again to unselect if desired
    const newValue = current.value === option ? '' : option;
    onAnswerChange(questionId, {
      ...current,
      value: newValue,
    });
  };

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

  const handleTextChange = (questionId: number, text: string) => {
    const current = answers[questionId] || { value: '' };
    onAnswerChange(questionId, {
      ...current,
      value: text,
    });
  };

  const handleNotesChange = (questionId: number, notes: string) => {
    const current = answers[questionId] || { value: '' };
    onAnswerChange(questionId, {
      ...current,
      notes,
    });
  };

  const isLastCategory = currentCategory === CATEGORIES.length;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      {/* Top Sticky Progress & Category Tabs Bar */}
      <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-4 mb-6 border-b border-slate-200/60 transition-all">
        {/* Overall progress bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 px-1">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Progresso Geral
          </span>
          <span className="font-medium">
            {answeredCount} de {totalQuestions} perguntas preenchidas ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>

        {/* Category navigation tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === currentCategory;
            const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
            const count = catQuestions.filter((q) => {
              const a = answers[q.id];
              return a && (Array.isArray(a.value) ? a.value.length > 0 : Boolean(a.value?.trim()));
            }).length;
            const isCompleted = count === catQuestions.length;

            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span className={`p-1 rounded-lg ${isActive ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'}`}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span>Cat. {cat.numberRoman}</span>
                {isCompleted && (
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
                {!isCompleted && count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                    {count}/{catQuestions.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Category Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
              {getCategoryIcon(currentCategoryInfo.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  CATEGORIA {currentCategoryInfo.numberRoman}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {catAnsweredCount} de {categoryQuestions.length} respondidas
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {currentCategoryInfo.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentCategoryInfo.subtitle}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 hidden sm:block">
            <span className="text-xs text-slate-400">Respostas não obrigatórias</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {categoryQuestions.map((q) => {
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
                hasAnswer ? 'border-indigo-200/90 ring-1 ring-indigo-50/50' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {q.title}
                  </h3>
                  {hasAnswer ? (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Preenchida
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

              {/* Question Body by Type */}

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

              {/* 4. SINGLE WITH TEXT (Options with customizable or extra input) */}
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

                  {/* Supplemental text input for specific custom answer */}
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

      {/* Navigation Footer */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.99]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {isLastCategory ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-60 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando Diagnóstico...</span>
              </>
            ) : (
              <>
                <span>Finalizar e Enviar Diagnóstico</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow cursor-pointer active:scale-[0.99]"
          >
            <span>Avançar para Categoria {CATEGORIES[currentCategory]?.numberRoman || ''}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
