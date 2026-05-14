/**
 * Static reference data for the /dossier checklist tool.
 *
 * Sourced from service-public.fr, the Décret n° 2025-1345 du 20
 * décembre 2025 (relatif aux modalités du contrôle d'assimilation),
 * the Circulaire Retailleau du 2 mai 2025 (NOR INTK2511758J) and the
 * decree 93-1362 (declarations de nationalité). We codify the
 * common list of supporting documents per exam type × situation —
 * NOT legal advice, but a practical inventory that maps to what
 * préfectures actually ask for.
 *
 * The list is non-exhaustive on purpose: the goal is to give the
 * candidate a credible scaffold to start their dossier, not to
 * replace the official cerfa form they'll receive. We point them to
 * service-public.fr for the formal source.
 */

export type ExamTypeCode = 'csp' | 'cr' | 'nat';

export interface Situation {
  id: string;
  label: string;
  /** When this situation applies — short, plain French. */
  blurb: string;
}

export interface DocumentItem {
  /** Short, unambiguous, imperative-ish label. */
  label: string;
  /** When applicable / why it's needed / where to get it. */
  hint?: string;
  /** Marks documents that systematically trip candidates up. */
  pitfall?: boolean;
}

export interface ChecklistEntry {
  examType: ExamTypeCode;
  situationId: string;
  /** Grouped sections — "Identité", "Logement", "Ressources", etc. */
  sections: Array<{
    title: string;
    documents: DocumentItem[];
  }>;
  /** Final notes specific to this combination. */
  notes?: string[];
}

export const EXAM_TYPE_LABELS: Record<ExamTypeCode, string> = {
  csp: 'Carte de séjour pluriannuelle',
  cr: 'Carte de résident',
  nat: 'Naturalisation française',
};

export const SITUATIONS_BY_EXAM_TYPE: Record<ExamTypeCode, Situation[]> = {
  csp: [
    { id: 'student', label: 'Étudiant·e', blurb: 'Inscription dans un établissement français du supérieur.' },
    { id: 'employee', label: 'Salarié·e', blurb: 'Contrat de travail en France (CDI / CDD long).' },
    { id: 'family', label: 'Vie privée et familiale', blurb: 'Conjoint·e de Français·e, parent d\'enfant français, regroupement familial.' },
    { id: 'visitor', label: 'Visiteur·euse', blurb: 'Ressources suffisantes, sans activité professionnelle en France.' },
  ],
  cr: [
    { id: 'long_stay', label: '5 ans de séjour régulier', blurb: 'Cas général : 5 ans en France avec titre de séjour régulier.' },
    { id: 'spouse', label: 'Conjoint·e de Français·e', blurb: 'Mariage ≥ 3 ans, vie commune continue.' },
    { id: 'refugee', label: 'Statut de réfugié', blurb: 'Décision OFPRA / CNDA reconnue.' },
    { id: 'parent_french', label: 'Parent d\'enfant français', blurb: 'Contribution effective à l\'entretien de l\'enfant.' },
  ],
  nat: [
    { id: 'decret', label: 'Naturalisation par décret', blurb: 'Cas général : 5 ans de résidence régulière en France.' },
    { id: 'mariage', label: 'Déclaration par mariage', blurb: 'Marié·e à un·e Français·e depuis ≥ 4 ans.' },
    { id: 'ascendant', label: 'Ascendant de Français', blurb: 'Parent ou grand-parent d\'un·e Français·e, 65 ans et plus.' },
    { id: 'fratrie', label: 'Frère/sœur de Français', blurb: 'Fratrie ayant acquis la nationalité française par naissance/déclaration.' },
  ],
};

/**
 * Common identity & residence docs reused across nearly every entry.
 * Centralized so a change to "what's a valid passport copy" propagates
 * everywhere. The combinator below pulls these in and adds the
 * situation-specific extras.
 */
const COMMON_IDENTITY: DocumentItem[] = [
  { label: 'Passeport en cours de validité (intégral, toutes pages)', hint: 'Y compris les pages vierges. Photocopie + original le jour du dépôt.' },
  { label: 'Acte de naissance plurilingue ou traduit', hint: 'Délivré il y a moins de 6 mois. Traduction par traducteur assermenté si pas plurilingue.', pitfall: true },
  { label: 'Photos d\'identité aux normes (35×45 mm, fond clair)', hint: 'Récentes, conformes ISO/IEC 19794-5.' },
  { label: 'Justificatif de domicile (3 derniers mois)', hint: 'Quittance EDF/loyer, ou attestation d\'hébergement + CNI hôte + justificatif hôte.' },
];

const COMMON_RESIDENCE: DocumentItem[] = [
  { label: 'Tous les anciens titres de séjour', hint: 'Récupérez-les tous : depuis la première carte. La préfecture vérifie la continuité.', pitfall: true },
  { label: 'Visa long séjour initial (VLS-TS) ou équivalent', hint: 'Avec tampon OFII si applicable.' },
  { label: 'Diplôme du niveau de français requis', hint: 'B1 pour la CR, B2 oral pour la naturalisation depuis circulaire Retailleau du 2 mai 2025.', pitfall: true },
  { label: 'Attestation de réussite à l\'examen civique', hint: 'Délivrée à l\'issue de l\'examen avec note ≥ 13/20. Conserver l\'original.' },
];

const COMMON_RESOURCES: DocumentItem[] = [
  { label: 'Avis d\'imposition des 3 dernières années', hint: 'Téléchargeable sur impots.gouv.fr. Si vous n\'étiez pas imposable, le document « avis de situation déclarative » suffit.' },
  { label: '3 derniers bulletins de salaire', hint: 'Ou attestation Pôle Emploi / déclaration URSSAF pour les indépendants.' },
  { label: 'RIB / IBAN français', hint: 'Compte en France obligatoire (preuve d\'ancrage économique).' },
];

const COMMON_JUSTICE: DocumentItem[] = [
  { label: 'Casier judiciaire de chaque pays de résidence (10 dernières années)', hint: 'Pays d\'origine + tout pays où vous avez vécu > 6 mois. Délivré il y a moins de 3 mois, traduit si nécessaire.', pitfall: true },
];

/**
 * Build a checklist by combining common sections + situation-specific extras.
 * The fall-through (return common only) is a sane default if a less-common
 * situation lands here without bespoke data — better than 404.
 */
export function buildChecklist(
  examType: ExamTypeCode,
  situationId: string,
): ChecklistEntry {
  const base: ChecklistEntry = {
    examType,
    situationId,
    sections: [
      { title: 'Identité', documents: COMMON_IDENTITY },
      { title: 'Résidence & langue', documents: COMMON_RESIDENCE },
      { title: 'Ressources', documents: COMMON_RESOURCES },
    ],
    notes: [],
  };

  // Add situation-specific extras. Cases are intentionally explicit
  // rather than table-driven — easier to read and to update one row
  // at a time as regulations shift.
  if (examType === 'csp' && situationId === 'student') {
    base.sections.push({
      title: 'Études',
      documents: [
        { label: 'Certificat de scolarité de l\'année en cours' },
        { label: 'Relevé de notes du dernier semestre' },
        { label: 'Attestation d\'assiduité (si l\'établissement la fournit)' },
        { label: 'Justificatif de ressources étudiantes ≥ 615 €/mois', hint: 'Bourse, attestation parent garant + justificatifs, contrat doctoral, etc.' },
      ],
    });
    base.notes!.push("L'examen civique est désormais exigé pour le renouvellement de votre titre, pas seulement à la première délivrance.");
  } else if (examType === 'csp' && situationId === 'employee') {
    base.sections.push({
      title: 'Activité professionnelle',
      documents: [
        { label: 'Contrat de travail signé' },
        { label: 'Attestation employeur récente' },
        { label: 'Justificatif d\'enregistrement auprès de la DREETS si nouveau poste' },
      ],
    });
  } else if (examType === 'csp' && situationId === 'family') {
    base.sections.push({
      title: 'Lien familial',
      documents: [
        { label: 'Acte de mariage (si conjoint de Français)' },
        { label: 'Livret de famille à jour' },
        { label: 'Acte de naissance des enfants français', hint: 'Avec mention OBLIGATOIRE de la filiation française.' },
        { label: 'Preuves de vie commune (1 an minimum)', hint: 'Factures communes, bail commun, comptes joints, photos, attestations de proches.', pitfall: true },
      ],
    });
  } else if (examType === 'cr' && situationId === 'long_stay') {
    base.sections.push({ title: 'Justice et casier', documents: COMMON_JUSTICE });
    base.notes!.push("Niveau B1 français exigé. Si non titulaire du diplôme, prévoir le passage du TCF ou DELF B1.");
  } else if (examType === 'cr' && situationId === 'spouse') {
    base.sections.push({
      title: 'Vie commune',
      documents: [
        { label: 'Acte de mariage de moins de 3 mois' },
        { label: 'Justificatifs de vie commune sur ≥ 3 ans', hint: 'Bail, factures, déclaration impôts commune.', pitfall: true },
        { label: 'Acte de naissance du conjoint français (≤ 3 mois)' },
      ],
    });
    base.sections.push({ title: 'Justice et casier', documents: COMMON_JUSTICE });
  } else if (examType === 'cr' && situationId === 'refugee') {
    base.sections.push({
      title: 'Statut de protection',
      documents: [
        { label: 'Décision OFPRA ou CNDA de reconnaissance', hint: 'Photocopie certifiée conforme.', pitfall: true },
        { label: 'Certificat de protection délivré par l\'OFPRA', hint: 'À demander à l\'OFPRA si non transmis automatiquement.' },
      ],
    });
    base.notes!.push("Le délai pour solliciter la CR est en principe plus court (3 ans de séjour régulier suffisent).");
  } else if (examType === 'nat' && situationId === 'decret') {
    base.sections.push({ title: 'Justice et casier', documents: COMMON_JUSTICE });
    base.sections.push({
      title: 'Spécifique naturalisation',
      documents: [
        { label: 'Formulaire CERFA n° 12753*04 dûment rempli' },
        { label: 'Lettre de motivation manuscrite en français', hint: 'Expliquant votre attachement à la France et votre projet citoyen. Pas de modèle copié-collé.', pitfall: true },
        { label: 'Diplôme français de niveau B2 oral ou attestation', hint: 'Exigence relevée depuis la circulaire Retailleau du 2 mai 2025.', pitfall: true },
        { label: 'Charte des droits et devoirs du citoyen français signée', hint: 'Signature à l\'issue de la cérémonie d\'accueil dans la citoyenneté.' },
        { label: 'Timbre fiscal de 55 €', hint: 'Achetable en ligne sur timbres.impots.gouv.fr.' },
      ],
    });
    base.notes!.push("L'entretien d'assimilation dure 20 à 40 minutes. Préparez-le avec notre module dédié /app/entretien.");
  } else if (examType === 'nat' && situationId === 'mariage') {
    base.sections.push({
      title: 'Lien matrimonial',
      documents: [
        { label: 'Acte de mariage transcrit dans les registres français', hint: 'Si mariage célébré à l\'étranger, transcription au service central d\'état civil de Nantes.', pitfall: true },
        { label: 'Acte de naissance du conjoint français (≤ 3 mois)' },
        { label: 'Preuves de communauté de vie sur ≥ 4 ans', hint: 'Factures, bail, comptes joints, photos.' },
        { label: 'Formulaire CERFA n° 15277*04', hint: 'Déclaration acquisition de la nationalité par mariage.' },
      ],
    });
    base.sections.push({ title: 'Justice et casier', documents: COMMON_JUSTICE });
  } else if (examType === 'nat' && situationId === 'ascendant') {
    base.sections.push({
      title: 'Lien familial avec ascendant français',
      documents: [
        { label: 'Acte de naissance de l\'enfant/petit-enfant français' },
        { label: 'Justificatif des ≥ 25 ans de résidence en France', hint: 'Anciens titres, contrats locatifs, fiches de paie.' },
        { label: 'Preuve de lien de filiation' },
      ],
    });
  }

  return base;
}
