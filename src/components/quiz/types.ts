export type ChoiceType = 'single-choice' | 'multiple-choice';

export interface OptionView {
  label: string;
  text: string;
}

export interface QuestionView {
  id: string;
  title: string;
  type: ChoiceType;
  options: OptionView[];
  correctAnswers: string[];
  explanationFr: string;
  explanationEn: string;
}

export interface ExamView {
  id: string;
  title: string;
  lang: 'fr' | 'en';
  durationMinutes: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  difficulty: string;
  tags: string[];
  questions: QuestionView[];
}

export type Answers = Record<string, string[]>;

export interface SubmittedResult {
  answers: Answers;
  timedOut: boolean;
  durationSeconds: number;
}