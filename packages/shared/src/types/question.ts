export interface Choice {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
}

export type QuestionType = 'knowledge' | 'situational';

export interface Question {
  id: number;
  themeId: number;
  type: QuestionType;
  difficulty: number;
  isPremium: boolean;
  textFr: string;
  explanationFr?: string;
  choicesFr: Choice[];
  correctChoice: 'a' | 'b' | 'c' | 'd';
  translatedText?: string;
  translatedExplanation?: string;
  translatedChoices?: Choice[];
}
