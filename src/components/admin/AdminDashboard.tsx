import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Calendar,
  Phone,
  Search,
  Trash2,
  Eye,
  LogOut,
  RefreshCw,
  FileText,
  User,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Submission } from '../../types';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { QUESTIONS } from '../../data/questions';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onOpenPublicForm: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onOpenPublicForm,
}) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected submission for detail modal
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Deletion modal state
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch submissions from secure server endpoint
  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao carregar formulários.');
      }

      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Falha ao buscar as respostas do banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  // Handle deletion
  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao excluir o formulário.');
      }

      // Remove from state
      setSubmissions((prev) => prev.filter((s) => s.id !== submissionToDelete.id));
      if (selectedSubmission?.id === submissionToDelete.id) {
        setIsDetailOpen(false);
        setSelectedSubmission(null);
      }
      setSubmissionToDelete(null);
    } catch (err: any) {
      alert(err?.message || 'Falha ao excluir o formulário.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered submissions based on search
  const filteredSubmissions = useMemo(() => {
    if (!searchTerm.trim()) return submissions;
    const term = searchTerm.toLowerCase();

    return submissions.filter((sub) => {
      const nameMatch = sub.clinicName?.toLowerCase().includes(term);
      const contactMatch = sub.contactName?.toLowerCase().includes(term);
      const phoneMatch = sub.whatsapp?.toLowerCase().includes(term);
      const cityMatch = sub.city?.toLowerCase().includes(term);
      const emailMatch = sub.email?.toLowerCase().includes(term);

      // Also search through answers text
      const answersMatch = Object.values(sub.answers || {}).some((a) => {
        if (!a) return false;
        if (typeof a.value === 'string') return a.value.toLowerCase().includes(term);
        if (Array.isArray(a.value)) return a.value.some((v) => v.toLowerCase().includes(term));
        return false;
      });

      return nameMatch || contactMatch || phoneMatch || cityMatch || emailMatch || answersMatch;
    });
  }, [submissions, searchTerm]);

  // Stats calculation
  const totalReceived = submissions.length;
  const recentSubmission = submissions[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
              Painel Administrativo
            </span>
            <span className="text-xs text-slate-400">• Localway WhatsApp Automation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Diagnósticos Recebidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gerenciamento e análise das respostas de levantamento de requisitos das clínicas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchSubmissions}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold transition-colors cursor-pointer border border-transparent hover:border-rose-200"
            title="Encerrar sessão administrativa"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-400">Total Recebidos</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalReceived}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">formulários no banco</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase text-slate-400">Clínicas Cadastradas</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {new Set(submissions.map((s) => s.clinicName.toLowerCase().trim())).size}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5">estabelecimentos únicos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold uppercase text-slate-400">Último Envio</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate block">
              {recentSubmission ? (
                new Date(recentSubmission.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              ) : (
                'Nenhum ainda'
              )}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5 truncate">
              {recentSubmission?.clinicName || 'Aguardando envios'}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por clínica, responsável, telefone, cidade ou termo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 w-full sm:w-auto text-right">
          Exibindo <strong>{filteredSubmissions.length}</strong> de <strong>{totalReceived}</strong> formulários
        </div>
      </div>

      {/* Submissions Cards List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Carregando diagnósticos do Firestore...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-xs">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-rose-800">{error}</p>
          <button
            onClick={fetchSubmissions}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm ? 'Nenhum formulário encontrado para a busca' : 'Nenhum diagnóstico recebido ainda'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {searchTerm
              ? 'Tente pesquisar por outro termo ou limpe o campo de busca.'
              : 'Assim que uma clínica responder às perguntas do formulário público, o card dela aparecerá aqui automaticamente.'}
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              Limpar Busca
            </button>
          ) : (
            <button
              onClick={onOpenPublicForm}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-2"
            >
              <span>Abrir Formulário do Cliente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubmissions.map((sub) => {
            const formattedDate = new Date(sub.createdAt).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            // Count answered
            const totalQuestions = QUESTIONS.length;
            const answeredCount = QUESTIONS.filter((q) => {
              const a = sub.answers?.[q.id];
              return a && (Array.isArray(a.value) ? a.value.length > 0 : Boolean(a.value?.trim()));
            }).length;

            // Extract primary goal (Question 25)
            const goalAnswer = sub.answers?.[25]?.value;
            const rawPhone = (sub.whatsapp || '').replace(/\D/g, '');

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Clinic Name & Date */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full inline-block mb-1.5">
                        Clínica
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                        {sub.clinicName}
                      </h2>
                      {sub.contactName && (
                        <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {sub.contactName}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formattedDate}
                      </span>
                      <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {answeredCount}/{totalQuestions} respondidas
                      </span>
                    </div>
                  </div>

                  {/* Contact Info & City */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        {sub.whatsapp}
                      </span>
                      {rawPhone && (
                        <a
                          href={`https://wa.me/55${rawPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-emerald-700 font-semibold hover:underline inline-flex items-center gap-0.5"
                        >
                          Chamar no WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                    {sub.city && (
                      <p className="text-slate-500 truncate">
                        📍 {sub.city}
                      </p>
                    )}
                  </div>

                  {/* Goal highlight if answered */}
                  {goalAnswer && typeof goalAnswer === 'string' && (
                    <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-500 uppercase text-[9px] block">
                        Objetivo Principal:
                      </span>
                      <span className="font-semibold text-indigo-900">{goalAnswer}</span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSubmissionToDelete(sub)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir este formulário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setIsDetailOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Visualizar respostas</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        submission={selectedSubmission}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedSubmission(null);
        }}
        onDeleteRequest={(sub) => {
          setSubmissionToDelete(sub);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!submissionToDelete}
        clinicName={submissionToDelete?.clinicName || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSubmissionToDelete(null)}
      />
    </div>
  );
};
