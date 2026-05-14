// Pure label lookup for the official sub-topic codes — kept outside
// the 'use server' boundary so Next.js's RSC compiler doesn't reject
// it as a non-async export. Anything else that needs to translate a
// sub-topic code to a French label imports from here.

/**
 * The 15 stable sub-topic codes that match what we persist in
 * `questions.subtopic`. Codes are stable identifiers (used in DB and
 * SQL queries), labels are presentation-only and can evolve without
 * a migration.
 */
export function subtopicLabel(code: string): string {
  const labels: Record<string, string> = {
    devise: 'Devise et symboles',
    laicite: 'Laïcité',
    situation: 'Mises en situation',
    vote: 'Démocratie et droit de vote',
    organisation: 'Organisation de la République',
    union_europ: 'Union européenne',
    droits_fond: 'Droits fondamentaux',
    obligations: 'Obligations et devoirs',
    periodes: 'Périodes et personnages',
    geographie: 'Géographie de la France',
    patrimoine: 'Patrimoine français',
    installation: "S'installer en France",
    soins: 'Accès aux soins',
    travail: 'Travailler en France',
    education: 'Autorité parentale et école',
  };
  return labels[code] ?? code;
}
