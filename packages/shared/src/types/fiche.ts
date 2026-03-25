export interface Fiche {
  id: number;
  themeId: number;
  titleFr: string;
  contentFr: string;
  displayOrder: number;
  isPremium: boolean;
  translatedTitle?: string;
  translatedContent?: string;
}
