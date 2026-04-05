export const questionsTheme2 = [
  // ─── Q1: Qui nomme le Premier ministre ? (CSP, CR, NAT) ───────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr: "Qui nomme le Premier ministre ?",
    explanationFr:
      "Le Premier ministre est nommé par le président de la République. C'est une prérogative constitutionnelle définie par l'article 8 de la Constitution de 1958.",
    choicesFr: [
      { id: "a" as const, text: "Le président de la République" },
      { id: "b" as const, text: "L'Assemblée nationale" },
      { id: "c" as const, text: "Le Sénat" },
      { id: "d" as const, text: "Le Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q2: Le Parlement est composé : (CSP, CR) ─────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Le Parlement est composé :",
    explanationFr:
      "Le Parlement français est bicaméral. Il est composé de l'Assemblée nationale et du Sénat, qui votent les lois et contrôlent l'action du Gouvernement.",
    choicesFr: [
      { id: "a" as const, text: "De l'Assemblée nationale et du Sénat" },
      { id: "b" as const, text: "Du Sénat et du Conseil constitutionnel" },
      { id: "c" as const, text: "De l'Assemblée nationale et du Gouvernement" },
      { id: "d" as const, text: "Du Conseil d'État et de l'Assemblée nationale" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q3: Qu'est-ce que le pouvoir exécutif ? (CSP) ────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qu'est-ce que le pouvoir exécutif ? Le pouvoir :",
    explanationFr:
      "Le pouvoir exécutif est le pouvoir de faire appliquer les lois. En France, il est exercé par le président de la République et le Gouvernement.",
    choicesFr: [
      { id: "a" as const, text: "De faire appliquer les lois" },
      { id: "b" as const, text: "De voter les lois" },
      { id: "c" as const, text: "De juger les infractions" },
      { id: "d" as const, text: "De modifier la Constitution" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q4: Les dirigeants sont élus par les citoyens dans : (CSP) ───────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Les dirigeants sont élus par les citoyens dans :",
    explanationFr:
      "Dans une démocratie, les dirigeants sont élus par les citoyens lors d'élections libres. C'est le principe fondamental du régime démocratique.",
    choicesFr: [
      { id: "a" as const, text: "Une démocratie" },
      { id: "b" as const, text: "Une dictature" },
      { id: "c" as const, text: "Une monarchie absolue" },
      { id: "d" as const, text: "Une oligarchie" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q5: A-t-on le droit de ne pas respecter une loi ? (CSP, NAT) ────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "A-t-on le droit de ne pas respecter une loi ?",
    explanationFr:
      "Non, nul n'a le droit de ne pas respecter la loi. La loi s'applique à tous de manière égale. Nul n'est censé ignorer la loi.",
    choicesFr: [
      { id: "a" as const, text: "Non, jamais" },
      { id: "b" as const, text: "Oui, si on n'est pas d'accord avec la loi" },
      { id: "c" as const, text: "Oui, si on est étranger" },
      { id: "d" as const, text: "Oui, dans certaines circonstances personnelles" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q6: Qui doit respecter la loi ? (CSP) ────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui doit respecter la loi ?",
    explanationFr:
      "Tout le monde doit respecter la loi en France, sans exception. Ce principe s'applique aux citoyens, aux étrangers, aux élus et aux dirigeants.",
    choicesFr: [
      { id: "a" as const, text: "Tout le monde" },
      { id: "b" as const, text: "Seulement les citoyens français" },
      { id: "c" as const, text: "Seulement les adultes" },
      { id: "d" as const, text: "Seulement les personnes qui vivent en France" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q7: Quel est le rôle de l'autorité judiciaire ? (CSP) ────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel est le rôle de l'autorité judiciaire ?",
    explanationFr:
      "L'autorité judiciaire a pour rôle de veiller au respect des lois et de sanctionner leur non-respect. Elle protège les libertés individuelles.",
    choicesFr: [
      { id: "a" as const, text: "Veiller au respect des lois et sanctionner leur non-respect" },
      { id: "b" as const, text: "Voter les lois" },
      { id: "c" as const, text: "Proposer de nouvelles lois" },
      { id: "d" as const, text: "Nommer les ministres" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q8: Quel pouvoir détient un juge ? (CSP) ─────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel pouvoir détient un juge ? Le pouvoir :",
    explanationFr:
      "Le juge détient le pouvoir judiciaire. Il rend la justice en appliquant les lois et en sanctionnant les infractions.",
    choicesFr: [
      { id: "a" as const, text: "Judiciaire" },
      { id: "b" as const, text: "Exécutif" },
      { id: "c" as const, text: "Législatif" },
      { id: "d" as const, text: "Administratif" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q9: L'autorité judiciaire est exercée par : (CSP) ────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "L'autorité judiciaire est exercée par :",
    explanationFr:
      "L'autorité judiciaire est exercée par les magistrats et les juges. Ils sont indépendants du pouvoir exécutif et du pouvoir législatif.",
    choicesFr: [
      { id: "a" as const, text: "Les magistrats et les juges" },
      { id: "b" as const, text: "Les députés" },
      { id: "c" as const, text: "Les ministres" },
      { id: "d" as const, text: "Les préfets" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q10: Que se passe-t-il si un ministre ne respecte pas la loi ? (CSP, CR) ──
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Que se passe-t-il si un ministre ne respecte pas la loi ?",
    explanationFr:
      "Un ministre qui ne respecte pas la loi peut être jugé comme tout citoyen. Nul n'est au-dessus des lois, y compris les membres du Gouvernement.",
    choicesFr: [
      { id: "a" as const, text: "Il peut être jugé comme tout citoyen" },
      { id: "b" as const, text: "Il ne peut pas être jugé car il est ministre" },
      { id: "c" as const, text: "Il est seulement renvoyé du Gouvernement" },
      { id: "d" as const, text: "Il est protégé par l'immunité ministérielle à vie" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q11: Qui est élu lors des élections législatives ? (CSP, NAT) ────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui est élu lors des élections législatives ?",
    explanationFr:
      "Les députés sont élus lors des élections législatives. Ils siègent à l'Assemblée nationale et votent les lois.",
    choicesFr: [
      { id: "a" as const, text: "Les députés" },
      { id: "b" as const, text: "Les sénateurs" },
      { id: "c" as const, text: "Les maires" },
      { id: "d" as const, text: "Les conseillers régionaux" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q12: Combien de députés composent l'Assemblée nationale ? (CSP, CR) ──
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Combien de députés composent l'Assemblée nationale ?",
    explanationFr:
      "L'Assemblée nationale est composée de 577 députés. Ils sont élus au suffrage universel direct pour un mandat de 5 ans.",
    choicesFr: [
      { id: "a" as const, text: "577" },
      { id: "b" as const, text: "348" },
      { id: "c" as const, text: "500" },
      { id: "d" as const, text: "650" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q13: Quand sont élus les sénateurs ? (CSP) ───────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quand sont élus les sénateurs ?",
    explanationFr:
      "Les sénateurs sont élus au suffrage universel indirect par les grands électeurs. Le Sénat est renouvelé par moitié tous les 3 ans.",
    choicesFr: [
      { id: "a" as const, text: "Ils sont élus au suffrage universel indirect" },
      { id: "b" as const, text: "Ils sont élus au suffrage universel direct" },
      { id: "c" as const, text: "Ils sont nommés par le président de la République" },
      { id: "d" as const, text: "Ils sont désignés par les députés" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q14: Qui est élu lors des élections municipales ? (CSP, NAT) ─────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui est élu lors des élections municipales ?",
    explanationFr:
      "Les conseillers municipaux sont élus lors des élections municipales. Ils élisent ensuite le maire parmi eux.",
    choicesFr: [
      { id: "a" as const, text: "Les conseillers municipaux" },
      { id: "b" as const, text: "Le maire directement" },
      { id: "c" as const, text: "Les conseillers départementaux" },
      { id: "d" as const, text: "Les députés" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q15: Qui est élu lors des élections présidentielles ? (CSP) ──────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui est élu lors des élections présidentielles ?",
    explanationFr:
      "Le président de la République est élu lors des élections présidentielles, au suffrage universel direct depuis 1962.",
    choicesFr: [
      { id: "a" as const, text: "Le président de la République" },
      { id: "b" as const, text: "Le Premier ministre" },
      { id: "c" as const, text: "Les députés" },
      { id: "d" as const, text: "Les sénateurs" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q16: À partir de quel âge a-t-on le droit de voter ? (CSP) ──────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "À partir de quel âge a-t-on le droit de voter ?",
    explanationFr:
      "En France, le droit de vote est accordé à partir de 18 ans. C'est l'âge de la majorité civile et politique.",
    choicesFr: [
      { id: "a" as const, text: "18 ans" },
      { id: "b" as const, text: "16 ans" },
      { id: "c" as const, text: "21 ans" },
      { id: "d" as const, text: "25 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q17: Pour combien de temps est élu le président ? (CSP, NAT) ─────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Pour combien de temps est élu le président de la République française ?",
    explanationFr:
      "Le président de la République est élu pour un mandat de 5 ans (quinquennat) depuis la réforme constitutionnelle de 2000.",
    choicesFr: [
      { id: "a" as const, text: "5 ans" },
      { id: "b" as const, text: "7 ans" },
      { id: "c" as const, text: "4 ans" },
      { id: "d" as const, text: "6 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q18: Pour combien de temps sont élus les députés ? (CSP, NAT) ────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Pour combien de temps sont élus les députés ?",
    explanationFr:
      "Les députés sont élus pour un mandat de 5 ans. L'Assemblée nationale peut être dissoute avant la fin du mandat par le président de la République.",
    choicesFr: [
      { id: "a" as const, text: "5 ans" },
      { id: "b" as const, text: "6 ans" },
      { id: "c" as const, text: "4 ans" },
      { id: "d" as const, text: "7 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q19: Pour combien de temps sont élus les sénateurs ? (CSP, CR, NAT) ──
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr: "Pour combien de temps sont élus les sénateurs ?",
    explanationFr:
      "Les sénateurs sont élus pour un mandat de 6 ans. Le Sénat est renouvelé par moitié tous les 3 ans.",
    choicesFr: [
      { id: "a" as const, text: "6 ans" },
      { id: "b" as const, text: "5 ans" },
      { id: "c" as const, text: "4 ans" },
      { id: "d" as const, text: "7 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q20: Qui possède le pouvoir exécutif ? (CSP) ─────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui possède le pouvoir exécutif ?",
    explanationFr:
      "Le pouvoir exécutif est détenu par le président de la République et le Gouvernement. Ils font appliquer les lois votées par le Parlement.",
    choicesFr: [
      { id: "a" as const, text: "Le président de la République et le Gouvernement" },
      { id: "b" as const, text: "Le Parlement" },
      { id: "c" as const, text: "Les juges" },
      { id: "d" as const, text: "Le Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q21: Condition pour voter aux élections (CSP, CR) ────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Quelle condition est nécessaire pour voter aux élections ?",
    explanationFr:
      "Pour voter aux élections en France, il faut être inscrit sur les listes électorales. L'inscription est une condition préalable indispensable.",
    choicesFr: [
      { id: "a" as const, text: "Être inscrit sur les listes électorales" },
      { id: "b" as const, text: "Avoir un emploi en France" },
      { id: "c" as const, text: "Posséder un bien immobilier" },
      { id: "d" as const, text: "Avoir un diplôme français" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q22: Qui peut voter aux élections en France ? (CSP, CR) ──────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Qui peut voter aux élections en France ?",
    explanationFr:
      "Les citoyens français majeurs (18 ans et plus) jouissant de leurs droits civils et politiques peuvent voter aux élections en France.",
    choicesFr: [
      { id: "a" as const, text: "Les citoyens français majeurs" },
      { id: "b" as const, text: "Toute personne résidant en France" },
      { id: "c" as const, text: "Les personnes ayant un titre de séjour" },
      { id: "d" as const, text: "Les personnes de plus de 21 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q23: Que signifie "suffrage universel" ? (CSP) ───────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Que signifie « suffrage universel » ?",
    explanationFr:
      "Le suffrage universel signifie que tous les citoyens majeurs ont le droit de voter, sans distinction de sexe, de richesse ou d'origine.",
    choicesFr: [
      { id: "a" as const, text: "Tous les citoyens majeurs ont le droit de voter" },
      { id: "b" as const, text: "Seuls les hommes ont le droit de voter" },
      { id: "c" as const, text: "Le vote est obligatoire pour tous" },
      { id: "d" as const, text: "Seuls les propriétaires peuvent voter" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q24: Concernant les partis politiques (CSP) ──────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Concernant les partis politiques, quelle proposition est correcte ?",
    explanationFr:
      "En France, il existe plusieurs partis politiques et on peut adhérer librement au parti de son choix. Le multipartisme est un principe fondamental de la démocratie.",
    choicesFr: [
      { id: "a" as const, text: "Il existe plusieurs partis politiques et on peut adhérer au parti de son choix" },
      { id: "b" as const, text: "Il n'existe qu'un seul parti politique en France" },
      { id: "c" as const, text: "Les partis politiques sont interdits" },
      { id: "d" as const, text: "Seuls les fonctionnaires peuvent adhérer à un parti" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q25: Quel est le rôle des députés ? (CSP) ────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel est le rôle des députés ?",
    explanationFr:
      "Les députés votent les lois et contrôlent l'action du Gouvernement. Ils représentent le peuple à l'Assemblée nationale.",
    choicesFr: [
      { id: "a" as const, text: "Voter les lois et contrôler l'action du Gouvernement" },
      { id: "b" as const, text: "Diriger le Gouvernement" },
      { id: "c" as const, text: "Nommer les juges" },
      { id: "d" as const, text: "Gérer les communes" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q26: La séparation des pouvoirs (CSP, CR, NAT) ──────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr: "La séparation des pouvoirs est un principe fondamental. Quels sont les trois pouvoirs concernés ?",
    explanationFr:
      "Les trois pouvoirs sont : le pouvoir législatif (faire les lois), le pouvoir exécutif (appliquer les lois) et le pouvoir judiciaire (juger). Ce principe garantit la démocratie.",
    choicesFr: [
      { id: "a" as const, text: "Législatif, exécutif, judiciaire" },
      { id: "b" as const, text: "Présidentiel, parlementaire, judiciaire" },
      { id: "c" as const, text: "Municipal, départemental, régional" },
      { id: "d" as const, text: "Militaire, civil, religieux" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q27: Qui possède le pouvoir législatif ? (CSP) ───────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui possède le pouvoir législatif ?",
    explanationFr:
      "Le pouvoir législatif est détenu par le Parlement, composé de l'Assemblée nationale et du Sénat. Il vote les lois.",
    choicesFr: [
      { id: "a" as const, text: "Le Parlement (Assemblée nationale et Sénat)" },
      { id: "b" as const, text: "Le président de la République" },
      { id: "c" as const, text: "Le Gouvernement" },
      { id: "d" as const, text: "Les juges" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q28: Qui sanctionne l'auteur d'un vol ? (CSP, CR, NAT) ──────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr: "Qui sanctionne l'auteur d'un vol ?",
    explanationFr:
      "C'est la justice (un juge) qui sanctionne l'auteur d'un vol. Le pouvoir judiciaire est seul compétent pour prononcer des sanctions pénales.",
    choicesFr: [
      { id: "a" as const, text: "La justice (un juge)" },
      { id: "b" as const, text: "La police" },
      { id: "c" as const, text: "Le maire" },
      { id: "d" as const, text: "La victime elle-même" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q29: Qui élit les députés ? (CSP) ─────────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui élit les députés ?",
    explanationFr:
      "Les députés sont élus par les citoyens français au suffrage universel direct. Chaque député représente une circonscription.",
    choicesFr: [
      { id: "a" as const, text: "Les citoyens français au suffrage universel direct" },
      { id: "b" as const, text: "Les sénateurs" },
      { id: "c" as const, text: "Le président de la République" },
      { id: "d" as const, text: "Les grands électeurs" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q30: Qui vote les lois ? (CSP, NAT) ──────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui vote les lois ?",
    explanationFr:
      "Le Parlement (Assemblée nationale et Sénat) vote les lois. C'est la fonction principale du pouvoir législatif.",
    choicesFr: [
      { id: "a" as const, text: "Le Parlement (Assemblée nationale et Sénat)" },
      { id: "b" as const, text: "Le président de la République" },
      { id: "c" as const, text: "Le Gouvernement" },
      { id: "d" as const, text: "Le Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q31: Qui réside au palais de l'Élysée ? (CSP) ───────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui réside au palais de l'Élysée ?",
    explanationFr:
      "Le palais de l'Élysée est la résidence officielle du président de la République française, situé à Paris.",
    choicesFr: [
      { id: "a" as const, text: "Le président de la République" },
      { id: "b" as const, text: "Le Premier ministre" },
      { id: "c" as const, text: "Le président de l'Assemblée nationale" },
      { id: "d" as const, text: "Le président du Sénat" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q32: Combien de départements en France ? (CSP, NAT) ─────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Combien y a-t-il de départements en France ?",
    explanationFr:
      "La France compte 101 départements : 96 départements métropolitains et 5 départements d'outre-mer (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte).",
    choicesFr: [
      { id: "a" as const, text: "101" },
      { id: "b" as const, text: "96" },
      { id: "c" as const, text: "95" },
      { id: "d" as const, text: "110" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q33: Qui représente l'État dans un département ? (CSP, NAT) ─────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui représente l'État dans un département ?",
    explanationFr:
      "Le préfet représente l'État dans le département. Il est nommé par le président de la République et veille à l'application des lois.",
    choicesFr: [
      { id: "a" as const, text: "Le préfet" },
      { id: "b" as const, text: "Le maire" },
      { id: "c" as const, text: "Le député" },
      { id: "d" as const, text: "Le sénateur" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q34: Qui dirige la commune ? (CSP, CR) ──────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Qui dirige la commune ?",
    explanationFr:
      "Le maire dirige la commune. Il est élu par les conseillers municipaux et exerce à la fois des fonctions au nom de la commune et au nom de l'État.",
    choicesFr: [
      { id: "a" as const, text: "Le maire" },
      { id: "b" as const, text: "Le préfet" },
      { id: "c" as const, text: "Le député" },
      { id: "d" as const, text: "Le président du conseil départemental" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q35: Le président a-t-il tous les pouvoirs ? (CSP, CR) ──────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Est-ce que le président de la République a tous les pouvoirs ?",
    explanationFr:
      "Non, le président de la République n'a pas tous les pouvoirs. La séparation des pouvoirs (législatif, exécutif, judiciaire) garantit qu'aucune personne ne détient tous les pouvoirs.",
    choicesFr: [
      { id: "a" as const, text: "Non, les pouvoirs sont séparés" },
      { id: "b" as const, text: "Oui, il a tous les pouvoirs" },
      { id: "c" as const, text: "Oui, sauf le pouvoir judiciaire" },
      { id: "d" as const, text: "Oui, en période de crise" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q36: Qui est le préfet ? (CSP, CR) ──────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Qui est le préfet ?",
    explanationFr:
      "Le préfet est le représentant de l'État dans le département. Il est nommé par le président de la République en Conseil des ministres.",
    choicesFr: [
      { id: "a" as const, text: "Le représentant de l'État dans le département" },
      { id: "b" as const, text: "Le chef de la police municipale" },
      { id: "c" as const, text: "Un élu local" },
      { id: "d" as const, text: "Le directeur de l'hôpital public" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q37: Quel est le rôle du Parlement ? (CSP) ──────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel est le rôle du Parlement ?",
    explanationFr:
      "Le Parlement vote les lois et contrôle l'action du Gouvernement. Il exerce le pouvoir législatif en France.",
    choicesFr: [
      { id: "a" as const, text: "Voter les lois et contrôler l'action du Gouvernement" },
      { id: "b" as const, text: "Diriger l'armée" },
      { id: "c" as const, text: "Nommer les juges" },
      { id: "d" as const, text: "Gérer les impôts locaux" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q38: Quel est le régime politique de la France ? (CSP, CR) ──────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Quel est le régime politique de la France aujourd'hui ?",
    explanationFr:
      "La France est une république démocratique. Son régime est une démocratie représentative où les citoyens élisent leurs représentants.",
    choicesFr: [
      { id: "a" as const, text: "Une république démocratique" },
      { id: "b" as const, text: "Une monarchie constitutionnelle" },
      { id: "c" as const, text: "Une dictature" },
      { id: "d" as const, text: "Un empire" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q39: Combien d'États dans l'UE au 1er janvier 2025 ? (CSP, NAT) ─
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Combien d'États font partie de l'Union européenne au 1er janvier 2025 ?",
    explanationFr:
      "L'Union européenne compte 27 États membres au 1er janvier 2025, depuis le départ du Royaume-Uni en 2020.",
    choicesFr: [
      { id: "a" as const, text: "27" },
      { id: "b" as const, text: "28" },
      { id: "c" as const, text: "25" },
      { id: "d" as const, text: "30" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q40: Quel État n'est pas membre de l'UE ? (CSP, CR) ─────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Quel État n'est pas membre de l'Union européenne ?",
    explanationFr:
      "La Suisse n'est pas membre de l'Union européenne. Elle a choisi de rester en dehors de l'UE tout en maintenant des accords bilatéraux.",
    choicesFr: [
      { id: "a" as const, text: "La Suisse" },
      { id: "b" as const, text: "L'Allemagne" },
      { id: "c" as const, text: "L'Italie" },
      { id: "d" as const, text: "L'Espagne" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q41: Condition pour voter aux européennes (CSP, CR) ─────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Quelle condition est nécessaire pour voter aux élections européennes ?",
    explanationFr:
      "Pour voter aux élections européennes, il faut être citoyen d'un État membre de l'Union européenne et être inscrit sur les listes électorales.",
    choicesFr: [
      { id: "a" as const, text: "Être citoyen d'un État membre de l'Union européenne" },
      { id: "b" as const, text: "Être citoyen français uniquement" },
      { id: "c" as const, text: "Résider en France depuis plus de 10 ans" },
      { id: "d" as const, text: "Avoir plus de 21 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q42: Fréquence des élections européennes (CSP, CR) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "À quelle fréquence les élections européennes sont-elles organisées ?",
    explanationFr:
      "Les élections européennes sont organisées tous les 5 ans. Les citoyens de l'UE élisent les députés européens qui siègent au Parlement européen.",
    choicesFr: [
      { id: "a" as const, text: "Tous les 5 ans" },
      { id: "b" as const, text: "Tous les 4 ans" },
      { id: "c" as const, text: "Tous les 6 ans" },
      { id: "d" as const, text: "Tous les 3 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q43: Pays fondateur de l'UE (CSP, CR) ──────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr: "Quel pays est un pays fondateur de l'Union européenne ?",
    explanationFr:
      "La France est l'un des six pays fondateurs de la construction européenne (avec l'Allemagne, l'Italie, la Belgique, les Pays-Bas et le Luxembourg), signataires du traité de Rome en 1957.",
    choicesFr: [
      { id: "a" as const, text: "La France" },
      { id: "b" as const, text: "L'Espagne" },
      { id: "c" as const, text: "Le Royaume-Uni" },
      { id: "d" as const, text: "La Pologne" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q44: Monnaie utilisée en France (CSP) ───────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle est la monnaie utilisée en France ?",
    explanationFr:
      "L'euro est la monnaie utilisée en France depuis le 1er janvier 2002. C'est la monnaie commune à de nombreux pays de l'Union européenne.",
    choicesFr: [
      { id: "a" as const, text: "L'euro" },
      { id: "b" as const, text: "Le franc" },
      { id: "c" as const, text: "La livre" },
      { id: "d" as const, text: "Le dollar" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q45: Qui élit les députés européens ? (CSP, NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui élit les députés européens ?",
    explanationFr:
      "Les députés européens sont élus par les citoyens des États membres de l'Union européenne au suffrage universel direct.",
    choicesFr: [
      { id: "a" as const, text: "Les citoyens des États membres de l'Union européenne" },
      { id: "b" as const, text: "Les chefs d'État des pays membres" },
      { id: "c" as const, text: "La Commission européenne" },
      { id: "d" as const, text: "Les parlements nationaux" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q46: Journée de l'Europe (CSP, CR, NAT) ─────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr: "Quand célèbre-t-on la journée de l'Europe ?",
    explanationFr:
      "La journée de l'Europe est célébrée le 9 mai. Elle commémore la déclaration de Robert Schuman du 9 mai 1950, considérée comme l'acte fondateur de la construction européenne.",
    choicesFr: [
      { id: "a" as const, text: "Le 9 mai" },
      { id: "b" as const, text: "Le 14 juillet" },
      { id: "c" as const, text: "Le 1er janvier" },
      { id: "d" as const, text: "Le 25 mars" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q47: Qu'est-ce que l'État de droit ? (CR, NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qu'est-ce que l'État de droit ?",
    explanationFr:
      "L'État de droit est un système dans lequel les pouvoirs publics sont soumis au respect du droit. Toute personne, y compris l'État, doit respecter les lois.",
    choicesFr: [
      { id: "a" as const, text: "Un État dans lequel les pouvoirs publics sont soumis au respect du droit" },
      { id: "b" as const, text: "Un État où seul le président décide des lois" },
      { id: "c" as const, text: "Un État sans Constitution" },
      { id: "d" as const, text: "Un État où les juges font les lois" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q48: Le président a commis un crime (CR) ────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Le président de la République a commis un crime. Quelle proposition est correcte ?",
    explanationFr:
      "Le président de la République peut être jugé après la fin de son mandat. Pendant son mandat, il bénéficie d'une immunité temporaire, mais il n'est pas au-dessus des lois.",
    choicesFr: [
      { id: "a" as const, text: "Il peut être jugé après la fin de son mandat" },
      { id: "b" as const, text: "Il ne peut jamais être jugé" },
      { id: "c" as const, text: "Il est immédiatement arrêté" },
      { id: "d" as const, text: "Il est jugé par le Parlement uniquement" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q49: La loi est l'expression de : (CR) ──────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "La loi est l'expression de :",
    explanationFr:
      "La loi est l'expression de la volonté générale, comme l'énonce l'article 6 de la Déclaration des droits de l'homme et du citoyen de 1789.",
    choicesFr: [
      { id: "a" as const, text: "La volonté générale" },
      { id: "b" as const, text: "La volonté du président" },
      { id: "c" as const, text: "La volonté des juges" },
      { id: "d" as const, text: "La volonté du Gouvernement" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q50: Durée du mandat du conseil municipal et du maire (CR, NAT) ─
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle est la durée du mandat du conseil municipal et du maire ?",
    explanationFr:
      "Le conseil municipal et le maire sont élus pour un mandat de 6 ans. Les élections municipales ont lieu tous les 6 ans.",
    choicesFr: [
      { id: "a" as const, text: "6 ans" },
      { id: "b" as const, text: "5 ans" },
      { id: "c" as const, text: "4 ans" },
      { id: "d" as const, text: "7 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q51: Que garantit l'État de droit ? (CR) ────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Que garantit l'État de droit ?",
    explanationFr:
      "L'État de droit garantit le respect des droits fondamentaux et des libertés individuelles. Il assure que personne, pas même l'État, n'est au-dessus des lois.",
    choicesFr: [
      { id: "a" as const, text: "Le respect des droits fondamentaux et des libertés individuelles" },
      { id: "b" as const, text: "Un emploi pour tous les citoyens" },
      { id: "c" as const, text: "La gratuité de tous les services publics" },
      { id: "d" as const, text: "L'absence totale d'impôts" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q52: Voter à la place d'une autre personne ? (CR) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Une personne peut-elle voter à la place d'une autre ?",
    explanationFr:
      "Oui, il est possible de voter par procuration. Un électeur empêché peut donner procuration à un autre électeur inscrit dans la même commune pour voter à sa place.",
    choicesFr: [
      { id: "a" as const, text: "Oui, par procuration" },
      { id: "b" as const, text: "Non, jamais" },
      { id: "c" as const, text: "Oui, sans aucune formalité" },
      { id: "d" as const, text: "Oui, uniquement pour les membres de sa famille" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q53: Le vote est-il obligatoire ? (CR) ─────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Est-ce que le vote est obligatoire ?",
    explanationFr:
      "Non, le vote n'est pas obligatoire en France. C'est un droit et non une obligation légale, mais c'est un devoir civique.",
    choicesFr: [
      { id: "a" as const, text: "Non, ce n'est pas obligatoire mais c'est un devoir civique" },
      { id: "b" as const, text: "Oui, c'est obligatoire pour tous" },
      { id: "c" as const, text: "Oui, sous peine d'amende" },
      { id: "d" as const, text: "Oui, sauf pour les personnes âgées" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q54: Le président peut-il rester au pouvoir après son mandat ? (CR) ─
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "À la fin de son mandat, le président de la République peut-il décider de rester au pouvoir ?",
    explanationFr:
      "Non, le président ne peut pas décider de rester au pouvoir à la fin de son mandat. Il doit se représenter aux élections ou quitter ses fonctions. C'est un principe fondamental de la démocratie.",
    choicesFr: [
      { id: "a" as const, text: "Non, il doit se représenter aux élections ou quitter ses fonctions" },
      { id: "b" as const, text: "Oui, s'il le décide" },
      { id: "c" as const, text: "Oui, avec l'accord du Parlement" },
      { id: "d" as const, text: "Oui, en cas de crise nationale" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q55: Qui dirige l'action du Gouvernement ? (CR, NAT) ───────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qui dirige l'action du Gouvernement ?",
    explanationFr:
      "Le Premier ministre dirige l'action du Gouvernement, conformément à l'article 21 de la Constitution. Il coordonne l'action des ministres.",
    choicesFr: [
      { id: "a" as const, text: "Le Premier ministre" },
      { id: "b" as const, text: "Le président de la République" },
      { id: "c" as const, text: "Le président de l'Assemblée nationale" },
      { id: "d" as const, text: "Le ministre de l'Intérieur" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q56: Organisation administrative de la France (CR) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle est l'organisation administrative de la France ?",
    explanationFr:
      "La France est organisée en communes, départements et régions. Ce sont les trois niveaux de collectivités territoriales prévus par la Constitution.",
    choicesFr: [
      { id: "a" as const, text: "Communes, départements et régions" },
      { id: "b" as const, text: "Provinces, cantons et districts" },
      { id: "c" as const, text: "Villes, comtés et États" },
      { id: "d" as const, text: "Arrondissements, préfectures et métropoles" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q57: Qu'est-ce que le pouvoir législatif ? (CR) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Qu'est-ce que le pouvoir législatif ? Le pouvoir :",
    explanationFr:
      "Le pouvoir législatif est le pouvoir de faire les lois. En France, il est exercé par le Parlement (Assemblée nationale et Sénat).",
    choicesFr: [
      { id: "a" as const, text: "De faire les lois" },
      { id: "b" as const, text: "De faire appliquer les lois" },
      { id: "c" as const, text: "De juger les infractions" },
      { id: "d" as const, text: "De nommer les ministres" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q58: Pourquoi séparer les trois pouvoirs ? (CR) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Pourquoi séparer les trois pouvoirs dans une démocratie ?",
    explanationFr:
      "La séparation des pouvoirs permet d'éviter qu'une seule personne ou institution concentre tous les pouvoirs. C'est une garantie contre l'abus de pouvoir et la tyrannie.",
    choicesFr: [
      { id: "a" as const, text: "Pour éviter la concentration des pouvoirs et protéger les libertés" },
      { id: "b" as const, text: "Pour créer plus d'emplois publics" },
      { id: "c" as const, text: "Pour que les décisions soient plus lentes" },
      { id: "d" as const, text: "Pour augmenter le nombre d'élections" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q59: Rôle du gouvernement (CR) ──────────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel est le rôle du gouvernement ?",
    explanationFr:
      "Le Gouvernement détermine et conduit la politique de la nation. Il dispose de l'administration et de la force armée (article 20 de la Constitution).",
    choicesFr: [
      { id: "a" as const, text: "Déterminer et conduire la politique de la nation" },
      { id: "b" as const, text: "Voter les lois" },
      { id: "c" as const, text: "Juger les criminels" },
      { id: "d" as const, text: "Élire le président de la République" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q60: Qu'est-ce que l'Hôtel de Matignon ? (CR) ──────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Qu'est-ce que l'Hôtel de Matignon ?",
    explanationFr:
      "L'Hôtel de Matignon est la résidence officielle et le lieu de travail du Premier ministre, situé à Paris dans le 7e arrondissement.",
    choicesFr: [
      { id: "a" as const, text: "La résidence officielle du Premier ministre" },
      { id: "b" as const, text: "La résidence du président de la République" },
      { id: "c" as const, text: "Le siège de l'Assemblée nationale" },
      { id: "d" as const, text: "Le siège du Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q61: Rôle du président de la République (CR, NAT) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel est le rôle du président de la République ?",
    explanationFr:
      "Le président de la République veille au respect de la Constitution, assure le fonctionnement des pouvoirs publics et la continuité de l'État. Il est le garant de l'indépendance nationale.",
    choicesFr: [
      { id: "a" as const, text: "Veiller au respect de la Constitution et garantir l'indépendance nationale" },
      { id: "b" as const, text: "Voter les lois au Parlement" },
      { id: "c" as const, text: "Diriger les tribunaux" },
      { id: "d" as const, text: "Gérer les communes" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q62: Rôle du Premier ministre (CR, NAT) ────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel est le rôle du Premier ministre ?",
    explanationFr:
      "Le Premier ministre dirige l'action du Gouvernement. Il est responsable devant l'Assemblée nationale et assure l'exécution des lois.",
    choicesFr: [
      { id: "a" as const, text: "Diriger l'action du Gouvernement" },
      { id: "b" as const, text: "Présider le Conseil constitutionnel" },
      { id: "c" as const, text: "Voter les lois" },
      { id: "d" as const, text: "Commander les armées" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q63: Qui est le chef du Gouvernement ? (CR) ─────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Qui est le chef du Gouvernement ?",
    explanationFr:
      "Le Premier ministre est le chef du Gouvernement. Il dirige l'action du Gouvernement et coordonne le travail des ministres.",
    choicesFr: [
      { id: "a" as const, text: "Le Premier ministre" },
      { id: "b" as const, text: "Le président de la République" },
      { id: "c" as const, text: "Le président de l'Assemblée nationale" },
      { id: "d" as const, text: "Le ministre de l'Intérieur" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q64: Combien de régions en France ? (CR) ────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Combien y a-t-il de régions en France ?",
    explanationFr:
      "La France compte 18 régions : 13 régions métropolitaines (dont la Corse) et 5 régions d'outre-mer.",
    choicesFr: [
      { id: "a" as const, text: "18" },
      { id: "b" as const, text: "13" },
      { id: "c" as const, text: "22" },
      { id: "d" as const, text: "15" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q65: Rôle du Défenseur des droits (CR, NAT) ────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel est le rôle du Défenseur des droits ?",
    explanationFr:
      "Le Défenseur des droits est une autorité indépendante chargée de veiller au respect des droits et libertés. Il peut être saisi par toute personne s'estimant lésée par un service public.",
    choicesFr: [
      { id: "a" as const, text: "Veiller au respect des droits et libertés des citoyens" },
      { id: "b" as const, text: "Voter les lois" },
      { id: "c" as const, text: "Commander l'armée" },
      { id: "d" as const, text: "Gérer le budget de l'État" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q66: Depuis quand l'euro est-il la monnaie unique ? (CR) ────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Depuis quand l'euro est-il la monnaie unique ?",
    explanationFr:
      "L'euro est devenu la monnaie unique en circulation le 1er janvier 2002. Il avait été introduit comme monnaie scripturale en 1999.",
    choicesFr: [
      { id: "a" as const, text: "Le 1er janvier 2002" },
      { id: "b" as const, text: "Le 1er janvier 1999" },
      { id: "c" as const, text: "Le 1er janvier 1992" },
      { id: "d" as const, text: "Le 1er janvier 2005" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q67: Rôle principal du département (CR) ─────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel est le rôle principal du département ?",
    explanationFr:
      "Le département a pour rôle principal l'action sociale et la solidarité (aide sociale, RSA, protection de l'enfance). Il gère aussi les collèges et les routes départementales.",
    choicesFr: [
      { id: "a" as const, text: "L'action sociale et la solidarité" },
      { id: "b" as const, text: "La défense nationale" },
      { id: "c" as const, text: "La politique étrangère" },
      { id: "d" as const, text: "La gestion des universités" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q68: Rôle principal des communes (CR) ───────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel est le rôle principal des communes ?",
    explanationFr:
      "Les communes gèrent les services de proximité : état civil, écoles maternelles et primaires, urbanisme, voirie communale, eau et assainissement.",
    choicesFr: [
      { id: "a" as const, text: "Gérer les services de proximité (état civil, écoles, urbanisme)" },
      { id: "b" as const, text: "Organiser la défense nationale" },
      { id: "c" as const, text: "Gérer les hôpitaux" },
      { id: "d" as const, text: "Collecter les impôts nationaux" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q69: Combien de communes en France ? (CR) ───────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Combien de communes environ existe-t-il en France ?",
    explanationFr:
      "La France compte environ 35 000 communes, ce qui en fait le pays d'Europe ayant le plus grand nombre de communes.",
    choicesFr: [
      { id: "a" as const, text: "Environ 35 000" },
      { id: "b" as const, text: "Environ 10 000" },
      { id: "c" as const, text: "Environ 5 000" },
      { id: "d" as const, text: "Environ 50 000" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q70: Traité de la construction de l'UE (CR, NAT) ───────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel traité concerne la construction de l'Union européenne ?",
    explanationFr:
      "Le traité de Maastricht (1992) est le traité fondateur de l'Union européenne. Il a institué la citoyenneté européenne et posé les bases de la monnaie unique.",
    choicesFr: [
      { id: "a" as const, text: "Le traité de Maastricht" },
      { id: "b" as const, text: "Le traité de Versailles" },
      { id: "c" as const, text: "Le traité de Westphalie" },
      { id: "d" as const, text: "Le traité de Vienne" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q71: État ayant quitté l'UE en 2020 (CR, NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel État a quitté l'Union européenne en 2020 ?",
    explanationFr:
      "Le Royaume-Uni a quitté l'Union européenne le 31 janvier 2020, à la suite du référendum sur le Brexit de 2016.",
    choicesFr: [
      { id: "a" as const, text: "Le Royaume-Uni" },
      { id: "b" as const, text: "La Norvège" },
      { id: "c" as const, text: "La Suisse" },
      { id: "d" as const, text: "L'Islande" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q72: Devise de l'UE (CR) ────────────────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle est la devise de l'Union européenne ?",
    explanationFr:
      "La devise de l'Union européenne est « Unie dans la diversité ». Elle symbolise l'unité des peuples européens dans le respect de leurs différences culturelles.",
    choicesFr: [
      { id: "a" as const, text: "Unie dans la diversité" },
      { id: "b" as const, text: "Liberté, Égalité, Fraternité" },
      { id: "c" as const, text: "Paix et prospérité" },
      { id: "d" as const, text: "L'union fait la force" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q73: Hymne de l'UE (CR, NAT) ───────────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel est l'hymne de l'Union européenne ?",
    explanationFr:
      "L'hymne de l'Union européenne est l'Ode à la joie, extrait de la 9e symphonie de Ludwig van Beethoven. Il a été adopté par le Conseil de l'Europe en 1972.",
    choicesFr: [
      { id: "a" as const, text: "L'Ode à la joie de Beethoven" },
      { id: "b" as const, text: "La Marseillaise" },
      { id: "c" as const, text: "Le Boléro de Ravel" },
      { id: "d" as const, text: "Les Quatre Saisons de Vivaldi" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q74: Composition du drapeau européen (CR, NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "De quoi est composé le drapeau européen ?",
    explanationFr:
      "Le drapeau européen est composé de 12 étoiles dorées disposées en cercle sur fond bleu. Le nombre 12 symbolise la perfection et l'unité, il ne correspond pas au nombre d'États membres.",
    choicesFr: [
      { id: "a" as const, text: "De 12 étoiles dorées disposées en cercle sur fond bleu" },
      { id: "b" as const, text: "De 27 étoiles sur fond bleu" },
      { id: "c" as const, text: "De bandes horizontales bleues et blanches" },
      { id: "d" as const, text: "De 15 étoiles dorées sur fond rouge" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q75: Couleur du drapeau européen (CR) ──────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "De quelle couleur est le drapeau européen ?",
    explanationFr:
      "Le drapeau européen est bleu avec des étoiles dorées (jaunes). Le fond bleu représente le ciel et les étoiles symbolisent l'unité des peuples d'Europe.",
    choicesFr: [
      { id: "a" as const, text: "Bleu avec des étoiles dorées" },
      { id: "b" as const, text: "Rouge avec des étoiles blanches" },
      { id: "c" as const, text: "Vert avec des étoiles dorées" },
      { id: "d" as const, text: "Blanc avec des étoiles bleues" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q76: Année du traité de Maastricht (CR, NAT) ──────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "En quelle année le traité de Maastricht a-t-il été signé ?",
    explanationFr:
      "Le traité de Maastricht a été signé le 7 février 1992. Il a créé l'Union européenne et posé les bases de la monnaie unique (l'euro).",
    choicesFr: [
      { id: "a" as const, text: "1992" },
      { id: "b" as const, text: "1957" },
      { id: "c" as const, text: "1989" },
      { id: "d" as const, text: "2000" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q77: Siège du Parlement européen (CR, NAT) ─────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Où est le siège du Parlement européen ?",
    explanationFr:
      "Le siège du Parlement européen est à Strasbourg (France). Des sessions ont également lieu à Bruxelles (Belgique).",
    choicesFr: [
      { id: "a" as const, text: "À Strasbourg" },
      { id: "b" as const, text: "À Bruxelles" },
      { id: "c" as const, text: "À Luxembourg" },
      { id: "d" as const, text: "À Berlin" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q78: Siège de la Commission européenne (CR, NAT) ───────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Où est le siège de la Commission européenne ?",
    explanationFr:
      "Le siège de la Commission européenne est à Bruxelles (Belgique). La Commission est l'organe exécutif de l'Union européenne.",
    choicesFr: [
      { id: "a" as const, text: "À Bruxelles" },
      { id: "b" as const, text: "À Strasbourg" },
      { id: "c" as const, text: "À Luxembourg" },
      { id: "d" as const, text: "À Paris" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q79: Comment est désigné le Premier ministre ? (NAT) ───────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Comment est désigné le Premier ministre ?",
    explanationFr:
      "Le Premier ministre est nommé par le président de la République. Il n'est pas élu directement par les citoyens.",
    choicesFr: [
      { id: "a" as const, text: "Il est nommé par le président de la République" },
      { id: "b" as const, text: "Il est élu au suffrage universel direct" },
      { id: "c" as const, text: "Il est élu par les députés" },
      { id: "d" as const, text: "Il est désigné par le Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q80: Qui peut se présenter aux présidentielles ? (NAT) ─────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui peut se présenter aux élections présidentielles ?",
    explanationFr:
      "Tout citoyen français âgé d'au moins 18 ans et jouissant de ses droits civils et politiques peut se présenter, à condition d'obtenir 500 parrainages d'élus.",
    choicesFr: [
      { id: "a" as const, text: "Tout citoyen français ayant obtenu 500 parrainages d'élus" },
      { id: "b" as const, text: "Uniquement les membres d'un parti politique" },
      { id: "c" as const, text: "Uniquement les anciens ministres" },
      { id: "d" as const, text: "Uniquement les personnes de plus de 40 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q81: À qui appartient la souveraineté nationale ? (NAT) ────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "À qui appartient la souveraineté nationale ?",
    explanationFr:
      "La souveraineté nationale appartient au peuple, qui l'exerce par ses représentants et par la voie du référendum (article 3 de la Constitution).",
    choicesFr: [
      { id: "a" as const, text: "Au peuple" },
      { id: "b" as const, text: "Au président de la République" },
      { id: "c" as const, text: "Au Parlement" },
      { id: "d" as const, text: "Au Gouvernement" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q82: L'inscription sur les listes électorales est : (NAT) ─────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "L'inscription sur les listes électorales est :",
    explanationFr:
      "L'inscription sur les listes électorales est obligatoire pour tout citoyen français majeur. Depuis 2019, l'inscription est automatique à 18 ans.",
    choicesFr: [
      { id: "a" as const, text: "Obligatoire" },
      { id: "b" as const, text: "Facultative" },
      { id: "c" as const, text: "Automatique uniquement pour les hommes" },
      { id: "d" as const, text: "Réservée aux personnes de plus de 21 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q83: Condition pour voter aux présidentielles (NAT) ────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle condition est nécessaire pour voter aux élections présidentielles ?",
    explanationFr:
      "Pour voter aux élections présidentielles, il faut être de nationalité française, avoir 18 ans révolus, jouir de ses droits civils et politiques, et être inscrit sur les listes électorales.",
    choicesFr: [
      { id: "a" as const, text: "Être de nationalité française, majeur et inscrit sur les listes électorales" },
      { id: "b" as const, text: "Être résident en France depuis au moins 5 ans" },
      { id: "c" as const, text: "Avoir un casier judiciaire vierge" },
      { id: "d" as const, text: "Être titulaire d'un diplôme" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q84: Condition pour être candidat aux municipales (NAT) ────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle condition faut-il remplir pour être candidat aux élections municipales ?",
    explanationFr:
      "Pour être candidat aux élections municipales, il faut avoir 18 ans révolus, être de nationalité française ou citoyen de l'UE, et être inscrit sur les listes électorales de la commune ou y payer des impôts.",
    choicesFr: [
      { id: "a" as const, text: "Avoir 18 ans et être inscrit sur les listes électorales de la commune" },
      { id: "b" as const, text: "Avoir 25 ans et résider dans la commune depuis 10 ans" },
      { id: "c" as const, text: "Être fonctionnaire" },
      { id: "d" as const, text: "Être propriétaire dans la commune" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q85: Parmi ces autorités, laquelle est élue ? (NAT) ───────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Parmi ces autorités, laquelle est élue ?",
    explanationFr:
      "Le maire est élu par les conseillers municipaux. Le préfet est nommé, le procureur est un magistrat, et le directeur d'école est un fonctionnaire.",
    choicesFr: [
      { id: "a" as const, text: "Le maire" },
      { id: "b" as const, text: "Le préfet" },
      { id: "c" as const, text: "Le procureur de la République" },
      { id: "d" as const, text: "Le directeur d'école" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q86: Fonctions du maire (NAT) ──────────────────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelles sont les fonctions du maire ?",
    explanationFr:
      "Le maire est à la fois officier d'état civil, représentant de l'État dans la commune et chef de l'administration communale. Il célèbre les mariages et délivre les permis de construire.",
    choicesFr: [
      { id: "a" as const, text: "Officier d'état civil, représentant de l'État et chef de l'administration communale" },
      { id: "b" as const, text: "Chef de la police nationale et des pompiers" },
      { id: "c" as const, text: "Président du tribunal de la commune" },
      { id: "d" as const, text: "Responsable de l'éducation nationale dans la commune" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q87: S'inscrire sur les listes électorales sans internet (NAT) ─
  {
    themeId: 2 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Une personne n'ayant pas d'accès à internet veut s'inscrire sur les listes électorales. Où peut-elle s'inscrire ?",
    explanationFr:
      "Une personne peut s'inscrire sur les listes électorales en se rendant à la mairie de son domicile. L'inscription en ligne n'est pas la seule option.",
    choicesFr: [
      { id: "a" as const, text: "À la mairie de son domicile" },
      { id: "b" as const, text: "À la préfecture uniquement" },
      { id: "c" as const, text: "Au commissariat de police" },
      { id: "d" as const, text: "Au tribunal judiciaire" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q88: À quel âge peut-on devenir électeur ? (NAT) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "À quel âge peut-on devenir électeur ?",
    explanationFr:
      "On peut devenir électeur à 18 ans en France. C'est l'âge de la majorité civile et politique depuis 1974.",
    choicesFr: [
      { id: "a" as const, text: "18 ans" },
      { id: "b" as const, text: "16 ans" },
      { id: "c" as const, text: "21 ans" },
      { id: "d" as const, text: "25 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q89: Est-ce obligatoire de voter en France ? (NAT) ─────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "En France, est-ce obligatoire de voter ?",
    explanationFr:
      "Non, le vote n'est pas obligatoire en France. C'est un droit et un devoir civique, mais il n'y a pas de sanction en cas d'abstention.",
    choicesFr: [
      { id: "a" as const, text: "Non, le vote est un droit mais pas une obligation légale" },
      { id: "b" as const, text: "Oui, sous peine d'amende" },
      { id: "c" as const, text: "Oui, sous peine de prison" },
      { id: "d" as const, text: "Oui, sauf pour les personnes de plus de 70 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q90: Comment sont désignés les députés ? (NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Comment sont désignés les députés ?",
    explanationFr:
      "Les députés sont élus au suffrage universel direct par les citoyens français. Chaque député représente une circonscription législative.",
    choicesFr: [
      { id: "a" as const, text: "Ils sont élus au suffrage universel direct" },
      { id: "b" as const, text: "Ils sont nommés par le président de la République" },
      { id: "c" as const, text: "Ils sont élus par les sénateurs" },
      { id: "d" as const, text: "Ils sont désignés par les partis politiques" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q91: Adhérer à un parti politique en France ? (NAT) ────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "En France, est-ce possible d'adhérer à un parti politique ?",
    explanationFr:
      "Oui, en France, toute personne peut librement adhérer au parti politique de son choix. La liberté d'association et le pluralisme politique sont garantis par la Constitution.",
    choicesFr: [
      { id: "a" as const, text: "Oui, on peut librement adhérer au parti de son choix" },
      { id: "b" as const, text: "Non, les partis politiques sont interdits" },
      { id: "c" as const, text: "Oui, mais uniquement si on est citoyen français" },
      { id: "d" as const, text: "Non, seuls les élus peuvent adhérer à un parti" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q92: Qui gère les collèges publics ? (NAT) ────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui gère les collèges publics ?",
    explanationFr:
      "Les collèges publics sont gérés par le département. La construction, l'entretien et le fonctionnement des collèges relèvent de la compétence du conseil départemental.",
    choicesFr: [
      { id: "a" as const, text: "Le département" },
      { id: "b" as const, text: "La commune" },
      { id: "c" as const, text: "La région" },
      { id: "d" as const, text: "L'État directement" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q93: Qui gère les écoles primaires et maternelles ? (NAT) ─────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui gère les écoles primaires et maternelles publiques ?",
    explanationFr:
      "Les écoles primaires et maternelles publiques sont gérées par la commune. La commune assure la construction, l'entretien et le fonctionnement des bâtiments scolaires.",
    choicesFr: [
      { id: "a" as const, text: "La commune" },
      { id: "b" as const, text: "Le département" },
      { id: "c" as const, text: "La région" },
      { id: "d" as const, text: "Le ministère de l'Éducation nationale" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q94: Comment sont désignés les maires ? (NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Comment sont désignés les maires ?",
    explanationFr:
      "Les maires sont élus par les conseillers municipaux lors de la première séance du nouveau conseil municipal, après les élections municipales.",
    choicesFr: [
      { id: "a" as const, text: "Ils sont élus par les conseillers municipaux" },
      { id: "b" as const, text: "Ils sont élus directement par les citoyens" },
      { id: "c" as const, text: "Ils sont nommés par le préfet" },
      { id: "d" as const, text: "Ils sont désignés par le président de la République" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q95: Collectivité responsable des transports régionaux (NAT) ──
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle collectivité territoriale est responsable des transports régionaux ?",
    explanationFr:
      "La région est responsable des transports régionaux (TER). Elle organise et finance les services de transport ferroviaire régional de voyageurs.",
    choicesFr: [
      { id: "a" as const, text: "La région" },
      { id: "b" as const, text: "Le département" },
      { id: "c" as const, text: "La commune" },
      { id: "d" as const, text: "L'État" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q96: Voie pour modifier la Constitution (NAT) ─────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle est l'une des voies possibles pour modifier la Constitution ?",
    explanationFr:
      "La Constitution peut être modifiée par référendum ou par le Congrès (réunion de l'Assemblée nationale et du Sénat) à la majorité des 3/5 des suffrages exprimés.",
    choicesFr: [
      { id: "a" as const, text: "Par référendum ou par le Congrès (Assemblée nationale + Sénat)" },
      { id: "b" as const, text: "Par décision du président de la République seul" },
      { id: "c" as const, text: "Par un vote des maires de France" },
      { id: "d" as const, text: "Par une décision du Conseil constitutionnel" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q97: Intérim du président en cas de décès (NAT) ───────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui assure l'intérim du président de la République en cas de décès ?",
    explanationFr:
      "Le président du Sénat assure l'intérim du président de la République en cas de vacance (décès, démission). C'est prévu par l'article 7 de la Constitution.",
    choicesFr: [
      { id: "a" as const, text: "Le président du Sénat" },
      { id: "b" as const, text: "Le Premier ministre" },
      { id: "c" as const, text: "Le président de l'Assemblée nationale" },
      { id: "d" as const, text: "Le ministre de l'Intérieur" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q98: Rôle du Conseil constitutionnel (NAT) ────────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le rôle du Conseil constitutionnel ?",
    explanationFr:
      "Le Conseil constitutionnel vérifie la conformité des lois à la Constitution. Il veille aussi à la régularité des élections présidentielles et des référendums.",
    choicesFr: [
      { id: "a" as const, text: "Vérifier la conformité des lois à la Constitution" },
      { id: "b" as const, text: "Voter les lois" },
      { id: "c" as const, text: "Diriger le Gouvernement" },
      { id: "d" as const, text: "Juger les affaires pénales" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q99: Condition pour se présenter à la présidentielle (NAT) ────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle condition est obligatoire pour se présenter à l'élection présidentielle ?",
    explanationFr:
      "Pour se présenter à l'élection présidentielle, il faut obtenir 500 signatures (parrainages) d'élus venant d'au moins 30 départements ou collectivités d'outre-mer différents.",
    choicesFr: [
      { id: "a" as const, text: "Obtenir 500 parrainages d'élus" },
      { id: "b" as const, text: "Être membre d'un parti politique" },
      { id: "c" as const, text: "Avoir été député ou sénateur" },
      { id: "d" as const, text: "Avoir plus de 40 ans" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q100: Découpage administratif de la France (NAT) ──────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Comment est organisé le découpage administratif de la France ?",
    explanationFr:
      "Le découpage administratif de la France est organisé en communes, départements et régions. Ces trois niveaux de collectivités territoriales s'administrent librement.",
    choicesFr: [
      { id: "a" as const, text: "En communes, départements et régions" },
      { id: "b" as const, text: "En provinces, cantons et districts" },
      { id: "c" as const, text: "En villes, comtés et États fédérés" },
      { id: "d" as const, text: "En arrondissements et préfectures uniquement" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q101: Année de création de la citoyenneté européenne (NAT) ────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "En quelle année la citoyenneté européenne a-t-elle été créée ?",
    explanationFr:
      "La citoyenneté européenne a été créée par le traité de Maastricht en 1992. Elle confère aux citoyens de l'UE des droits comme la libre circulation et le droit de vote aux élections municipales et européennes dans tout État membre.",
    choicesFr: [
      { id: "a" as const, text: "1992" },
      { id: "b" as const, text: "1957" },
      { id: "c" as const, text: "2000" },
      { id: "d" as const, text: "1985" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q102: Qui a composé l'hymne de l'UE ? (NAT) ──────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui a composé l'hymne de l'Union européenne ?",
    explanationFr:
      "L'hymne européen est l'Ode à la joie, composée par Ludwig van Beethoven. C'est le dernier mouvement de sa 9e symphonie.",
    choicesFr: [
      { id: "a" as const, text: "Ludwig van Beethoven" },
      { id: "b" as const, text: "Wolfgang Amadeus Mozart" },
      { id: "c" as const, text: "Johann Sebastian Bach" },
      { id: "d" as const, text: "Claude Debussy" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q103: Siège de la Banque centrale européenne (NAT) ────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Où est le siège de la Banque centrale européenne ?",
    explanationFr:
      "Le siège de la Banque centrale européenne (BCE) se trouve à Francfort-sur-le-Main, en Allemagne. La BCE est responsable de la politique monétaire de la zone euro.",
    choicesFr: [
      { id: "a" as const, text: "À Francfort (Allemagne)" },
      { id: "b" as const, text: "À Bruxelles (Belgique)" },
      { id: "c" as const, text: "À Luxembourg" },
      { id: "d" as const, text: "À Paris (France)" },
    ],
    correctChoice: "a" as const,
  },
  // ─── Q104: Qui siège au Parlement européen ? (NAT) ────────────────
  {
    themeId: 2 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui siège au Parlement européen ?",
    explanationFr:
      "Les députés européens siègent au Parlement européen. Ils sont élus au suffrage universel direct par les citoyens des États membres de l'UE.",
    choicesFr: [
      { id: "a" as const, text: "Les députés européens élus par les citoyens de l'UE" },
      { id: "b" as const, text: "Les chefs d'État des pays membres" },
      { id: "c" as const, text: "Les ministres des Affaires étrangères" },
      { id: "d" as const, text: "Les ambassadeurs des pays membres" },
    ],
    correctChoice: "a" as const,
  },
];
