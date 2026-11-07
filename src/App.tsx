import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FormStepClinic } from './components/FormStepClinic';
import { FormStepQuestions } from './components/FormStepQuestions';
import { FormConfirmation } from './components/FormConfirmation';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClinicInfo, AnswersMap } from './types';
import { CATEGORIES, QUESTIONS } from './data/questions';

export default function App() {
  // Navigation view: 'form' (public customer questionnaire) or 'admin' (Localway backoffice)
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');

  // Form progression: 0 = Clinic Details, 1..5 = Question Categories 1..5, 6 = Success Confirmation
  const [formStep, setFormStep] = useState<number>(0);

  // Clinic state
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>(() => {
    const saved = localStorage.getItem('localway_clinic_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      clinicName: '',
      contactName: '',
      whatsapp: '',
      email: '',
      city: '',
    };
  });

  // Answers state
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('localway_admin_token');
  });

  // Save drafts locally to prevent accidental data loss during filling
  useEffect(() => {
    localStorage.setItem('localway_clinic_draft', JSON.stringify(clinicInfo));
  }, [clinicInfo]);

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

  // Submit to persistent Firestore via server endpoint
  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicName: clinicInfo.clinicName,
          contactName: clinicInfo.contactName,
          whatsapp: clinicInfo.whatsapp,
          email: clinicInfo.email,
          city: clinicInfo.city,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar respostas.');
      }

      setSubmissionId(data.id);
      setSubmissionDate(data.createdAt || new Date().toISOString());

      // Advance to confirmation screen
      setFormStep(6);

      // Clear draft storage
      localStorage.removeItem('localway_answers_draft');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || 'Falha ao salvar respostas. Por favor, tente novamente.');
      alert(err?.message || 'Falha ao salvar respostas no banco de dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset questionnaire
  const handleResetForm = () => {
    setFormStep(0);
    setAnswers({});
    setClinicInfo({
      clinicName: '',
      contactName: '',
      whatsapp: '',
      email: '',
      city: '',
    });
    localStorage.removeItem('localway_clinic_draft');
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
          /* ================= PUBLIC CUSTOMER FORM ================= */
          <div>
            {formStep === 0 && (
              <FormStepClinic
                clinicInfo={clinicInfo}
                onChange={setClinicInfo}
                onNext={() => setFormStep(1)}
              />
            )}

            {formStep >= 1 && formStep <= 5 && (
              <FormStepQuestions
                currentCategory={formStep}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onCategorySelect={(catId) => setFormStep(catId)}
                onPrev={() => setFormStep((prev) => prev - 1)}
                onNext={() => setFormStep((prev) => prev + 1)}
                onSubmit={handleSubmitForm}
                isSubmitting={isSubmitting}
              />
            )}

            {formStep === 6 && (
              <FormConfirmation
                clinicInfo={clinicInfo}
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
