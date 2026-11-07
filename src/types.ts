export interface ClinicInfo {
  clinicName: string;
  contactName: string;
  whatsapp: string;
  email: string;
  city: string;
}

export interface QuestionAnswer {
  value: string | string[];
  notes?: string;
}

export type AnswersMap = Record<number, QuestionAnswer>;

export interface Submission {
  id: string;
  clinicName: string;
  contactName?: string;
  whatsapp: string;
  email?: string;
  city?: string;
  answers: AnswersMap;
  createdAt: string;
  status?: string;
}
