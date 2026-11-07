import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SinglePageQuestionsForm } from './components/SinglePageQuestionsForm';
import { FormConfirmation } from './components/FormConfirmation';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AnswersMap } from './types';

export default function App() {
  // Navigation view: 'form' (public customer questionnaire) or 'admin' (Localway backoffice)
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');

  // Form submitted state: true when submission has been saved
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Answers state stored locally to prevent accidental data loss during filling
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    const saved = localStorage.getItem('localway_answers_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {};
  });

  // Post-submission state
  const [submissionId, setSubmissionId] = useState<string>('');
  const [submissionDate, setSubmissionDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('localway_admin_token');
  });

  // Save draft locally to prevent accidental loss
  useEffect(() => {
    localStorage.setItem('localway_answers_draft', JSON.stringify(answers));
  }, [answers]);

  // Check URL hash for direct #admin access
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Answer handler
  const handleAnswerChange = (questionId: number, answer: { value: string | string[]; notes?: string }) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Submit all 25 questions to persistent Firestore via server endpoint
  const handleSubmitForm = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar respostas.');
      }

      setSubmissionId(data.id);
      setSubmissionDate(data.createdAt || new Date().toISOString());
      setIsSubmitted(true);

      // Clear draft storage
      localStorage.removeItem('localway_answers_draft');
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Falha ao salvar respostas no banco de dados. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset questionnaire
  const handleResetForm = () => {
    setIsSubmitted(false);
    setAnswers({});
    setSubmissionId('');
    setSubmissionDate('');
    localStorage.removeItem('localway_answers_draft');
  };

  // Admin logout
  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      } catch (e) {
        // ignore
      }
    }
    sessionStorage.removeItem('localway_admin_token');
    setAdminToken(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'admin') {
            window.location.hash = '#admin';
          } else {
            window.location.hash = '';
          }
        }}
        isAdminLoggedIn={Boolean(adminToken)}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6">
        {currentView === 'admin' ? (
          /* ================= ADMIN AREA ================= */
          adminToken ? (
            <AdminDashboard
              token={adminToken}
              onLogout={handleAdminLogout}
              onOpenPublicForm={() => {
                setCurrentView('form');
                window.location.hash = '';
              }}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={(token) => setAdminToken(token)}
              onBackToForm={() => {
                setCurrentView('form');
                window.location.hash = '';
              }}
            />
          )
        ) : (
          /* ================= PUBLIC CUSTOMER FORM (SINGLE PAGE, NO CATEGORIES, NO INITIAL INFO) ================= */
          <div>
            {!isSubmitted ? (
              <SinglePageQuestionsForm
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmitForm}
                isSubmitting={isSubmitting}
              />
            ) : (
              <FormConfirmation
                answers={answers}
                submissionId={submissionId}
                createdAt={submissionDate}
                onReset={handleResetForm}
                onPrint={() => window.print()}
              />
            )}
          </div>
        )}
      </main>

      {/* Discrete Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">LOCALWAY</span>
            <span>• Soluções Inteligentes em Atendimento para Clínicas</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tecnologia & Automação via WhatsApp</span>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentView(currentView === 'admin' ? 'form' : 'admin');
                if (currentView !== 'admin') window.location.hash = '#admin';
                else window.location.hash = '';
              }}
              className="text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer font-medium"
            >
              {currentView === 'admin' ? 'Ver Formulário' : 'Acesso Equipe'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
