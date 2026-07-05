export type ChoiceType = 'single-choice' | 'multiple-choice';
export type Lang = 'fr' | 'en';

export interface OptionView {
  label: string;
  textFr: string;
  textEn: string;
}

export interface QuestionView {
  id: string;
  titleFr: string;
  titleEn: string;
  type: ChoiceType;
  options: OptionView[];
  correctAnswers: string[];
  explanationFr: string;
  explanationEn: string;
}

export interface ExamView {
  id: string;
  title: string;
  lang: Lang;
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