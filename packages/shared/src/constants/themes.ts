export interface ThemeDefinition {
  id: number;
  code: string;
  nameFr: string;
  icon: string;
  color: string;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 1,
    code: 'republican_principles',
    nameFr: 'Principes et valeurs de la R\u00e9publique',
    icon: 'flag',
    color: '#002395',
  },
  {
    id: 2,
    code: 'institutional_system',
    nameFr: 'Syst\u00e8me institutionnel et politique',
    icon: 'landmark',
    color: '#ED2939',
  },
  {
    id: 3,
    code: 'rights_duties',
    nameFr: 'Droits et devoirs',
    icon: 'scale',
    color: '#FFD700',
  },
  {
    id: 4,
    code: 'history_geography_culture',
    nameFr: 'Histoire, g\u00e9ographie et culture',
    icon: 'book-open',
    color: '#4A90D9',
  },
  {
    id: 5,
    code: 'living_in_france',
    nameFr: 'Vivre dans la soci\u00e9t\u00e9 fran\u00e7aise',
    icon: 'home',
    color: '#2ECC71',
  },
];
