import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SinglePageQuestionsForm } from './components/SinglePageQuestionsForm';
import { FormConfirmation } from './components/FormConfirmation';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AnswersMap, ClinicInfo } from './types';

export default function App() {
  // Navigation view: 'form' (public customer questionnaire) or 'admin' (Localway backoffice)
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');

  // Form submitted state: true when submission has been saved
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Optional clinic identification fields
  const [clinicName, setClinicName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Admin authentication state (persists across reloads)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('localway_admin_token') || sessionStorage.getItem('localway_admin_token');
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

  // Submit all 25 questions to persistent Firestore (Dual-layer resilience)
  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const generatedId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const resolvedClinicName = clinicName.trim()
      ? clinicName.trim()
      : (answers[18]?.value && typeof answers[18].value === 'string' && answers[18].value.trim())
        ? 'Clínica: ' + answers[18].value.trim().slice(0, 45)
        : 'Diagnóstico #' + generatedId.slice(-6);

    const resolvedWhatsapp = whatsapp.trim()
      ? whatsapp.trim()
      : (answers[21]?.value && typeof answers[21].value === 'string')
        ? answers[21].value.trim()
        : '';

    const submissionPayload = {
      id: generatedId,
      clinicName: resolvedClinicName,
      whatsapp: resolvedWhatsapp,
      answers,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    let saved = false;
    let savedId = generatedId;
    let savedCreatedAt = submissionPayload.createdAt;

    // 1. Try server endpoint first
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicName: clinicName.trim(),
          whatsapp: whatsapp.trim(),
          answers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          saved = true;
          savedId = data.id || generatedId;
          savedCreatedAt = data.createdAt || submissionPayload.createdAt;
        }
      }
    } catch (err) {
      console.warn('Server endpoint submission failed, attempting direct Firestore write:', err);
    }

    // 2. Direct Firestore fallback if server endpoint had an issue
    if (!saved) {
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('./lib/firebase');
        await setDoc(doc(db, 'submissions', generatedId), submissionPayload);
        saved = true;
      } catch (fbErr: any) {
        console.error('Direct Firestore write failed:', fbErr);
        setSubmitError(
          fbErr?.message || 'Falha ao salvar as respostas. Por favor, tente novamente.'
        );
        setIsSubmitting(false);
        return;
      }
    }

    setSubmissionId(savedId);
    setSubmissionDate(savedCreatedAt);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Clear draft storage
    localStorage.removeItem('localway_answers_draft');
  };

  // Reset questionnaire
  const handleResetForm = () => {
    setIsSubmitted(false);
    setAnswers({});
    setClinicName('');
    setWhatsapp('');
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
    localStorage.removeItem('localway_admin_token');
    sessionStorage.removeItem('localway_admin_token');
    setAdminToken(null);
  };

  const clinicInfoSummary: ClinicInfo = {
    clinicName: clinicName.trim() || 'Sua Clínica',
    contactName: '',
    whatsapp: whatsapp.trim(),
    email: '',
    city: '',
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
              onLoginSuccess={(token) => {
                setAdminToken(token);
                localStorage.setItem('localway_admin_token', token);
              }}
              onBackToForm={() => {
                setCurrentView('form');
                window.location.hash = '';
              }}
            />
          )
        ) : (
          /* ================= PUBLIC CUSTOMER FORM ================= */
          <div>
            {!isSubmitted ? (
              <SinglePageQuestionsForm
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmitForm}
                isSubmitting={isSubmitting}
                submitError={submitError}
                clinicName={clinicName}
                onClinicNameChange={setClinicName}
                whatsapp={whatsapp}
                onWhatsappChange={setWhatsapp}
              />
            ) : (
              <FormConfirmation
                clinicInfo={clinicInfoSummary}
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
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
            >
              {currentView === 'admin' ? 'Ver Formulário' : 'Painel ADM (Respostas)'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
