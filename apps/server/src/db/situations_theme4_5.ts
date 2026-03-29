export const situationsTheme4 = [
  // ─── Commémorations et fêtes nationales (5 questions) ─────────────────────

  // S1: 14 juillet
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous venez d'arriver en France et votre voisin vous invite à regarder un défilé militaire et un feu d'artifice le 14 juillet. Que célèbre-t-on ce jour-là ?",
    explanationFr:
      "Le 14 juillet est la fête nationale française. Elle commémore la prise de la Bastille en 1789, symbole de la fin de l'absolutisme royal et du début de la Révolution française. Des défilés militaires, des bals populaires et des feux d'artifice sont organisés dans toute la France.",
    choicesFr: [
      { id: "a" as const, text: "La fête nationale, commémorant la prise de la Bastille" },
      { id: "b" as const, text: "La fin de la Seconde Guerre mondiale" },
      { id: "c" as const, text: "L'anniversaire de la Constitution de la Ve République" },
      { id: "d" as const, text: "La fête de l'Europe" },
    ],
    correctChoice: "a" as const,
  },

  // S2: 11 novembre
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Le 11 novembre, votre employeur vous informe que l'entreprise est fermée. Des cérémonies ont lieu devant le monument aux morts de votre commune. Que commémore cette journée ?",
    explanationFr:
      "Le 11 novembre est un jour férié qui commémore l'armistice de 1918, marquant la fin de la Première Guerre mondiale. Des cérémonies sont organisées devant les monuments aux morts pour rendre hommage aux soldats tombés au combat.",
    choicesFr: [
      { id: "a" as const, text: "La fin de la Seconde Guerre mondiale" },
      { id: "b" as const, text: "La Journée internationale de la paix" },
      { id: "c" as const, text: "L'armistice de la Première Guerre mondiale" },
      { id: "d" as const, text: "La Journée nationale du souvenir" },
    ],
    correctChoice: "c" as const,
  },

  // S3: Drapeau tricolore
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous passez devant la mairie de votre commune et vous remarquez un drapeau bleu, blanc, rouge accroché à la façade. Votre enfant vous demande ce qu'il représente. Que lui répondez-vous ?",
    explanationFr:
      "Le drapeau tricolore bleu, blanc, rouge est l'emblème national de la France, inscrit dans la Constitution. Le bleu et le rouge représentent les couleurs de Paris, et le blanc la monarchie. Il symbolise les valeurs de la République française.",
    choicesFr: [
      { id: "a" as const, text: "C'est le drapeau national de la France, symbole de la République" },
      { id: "b" as const, text: "C'est un drapeau décoratif pour la fête du village" },
      { id: "c" as const, text: "C'est le drapeau de la région" },
      { id: "d" as const, text: "C'est le drapeau de l'Union européenne" },
    ],
    correctChoice: "a" as const,
  },

  // S4: 8 mai
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Le 8 mai, vous constatez que les commerces sont fermés et que des gerbes de fleurs sont déposées au pied du monument aux morts. Un voisin vous invite à la cérémonie. Que commémore le 8 mai ?",
    explanationFr:
      "Le 8 mai 1945 marque la fin de la Seconde Guerre mondiale en Europe, avec la capitulation de l'Allemagne nazie. Ce jour férié est l'occasion de rendre hommage à tous ceux qui ont combattu et souffert durant ce conflit.",
    choicesFr: [
      { id: "a" as const, text: "La victoire de 1945 et la fin de la Seconde Guerre mondiale en Europe" },
      { id: "b" as const, text: "La signature du traité de Rome" },
      { id: "c" as const, text: "La Journée de l'Europe" },
      { id: "d" as const, text: "L'anniversaire de la Libération de Paris" },
    ],
    correctChoice: "a" as const,
  },

  // S5: Marseillaise
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Lors d'une cérémonie officielle dans votre mairie, tout le monde se lève quand un hymne est joué. On vous explique que c'est La Marseillaise. Quel est le statut de ce chant ?",
    explanationFr:
      "La Marseillaise est l'hymne national de la France, inscrit dans la Constitution (article 2). Composé par Rouget de Lisle en 1792, il est joué lors des cérémonies officielles, des événements sportifs internationaux et des commémorations.",
    choicesFr: [
      { id: "a" as const, text: "C'est un chant régional populaire" },
      { id: "b" as const, text: "C'est un chant militaire réservé à l'armée" },
      { id: "c" as const, text: "C'est l'hymne de l'Union européenne" },
      { id: "d" as const, text: "C'est l'hymne national de la France, inscrit dans la Constitution" },
    ],
    correctChoice: "d" as const,
  },

  // ─── Vie culturelle (5 questions) ─────────────────────────────────────────

  // S6: Musée gratuit
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous souhaitez visiter un musée national à Paris mais vous avez un budget limité. Un ami vous dit que certains jours l'entrée est gratuite. Quelle information est correcte ?",
    explanationFr:
      "Les musées nationaux en France, comme le Louvre ou le musée d'Orsay, sont gratuits le premier dimanche de chaque mois. De plus, l'entrée est généralement gratuite pour les moins de 26 ans résidant dans l'Union européenne.",
    choicesFr: [
      { id: "a" as const, text: "Les musées nationaux sont gratuits le premier dimanche du mois" },
      { id: "b" as const, text: "Les musées sont toujours payants, sans exception" },
      { id: "c" as const, text: "Seuls les citoyens français peuvent entrer gratuitement" },
      { id: "d" as const, text: "Les musées sont gratuits uniquement le 14 juillet" },
    ],
    correctChoice: "a" as const,
  },

  // S7: Patrimoine UNESCO
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous visitez le Mont-Saint-Michel avec des amis et vous voyez un panneau indiquant que c'est un site classé au patrimoine mondial de l'UNESCO. Que signifie cette distinction ?",
    explanationFr:
      "Le classement au patrimoine mondial de l'UNESCO reconnaît la valeur universelle exceptionnelle d'un site culturel ou naturel. La France compte plus de 50 sites classés. Cette distinction implique une protection et une préservation renforcées du site.",
    choicesFr: [
      { id: "a" as const, text: "Le site est reconnu pour sa valeur universelle exceptionnelle et bénéficie d'une protection spéciale" },
      { id: "b" as const, text: "Le site appartient à l'Organisation des Nations Unies" },
      { id: "c" as const, text: "Le site est réservé aux touristes étrangers" },
      { id: "d" as const, text: "Le site est interdit au public pour le préserver" },
    ],
    correctChoice: "a" as const,
  },

  // S8: Gastronomie
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous êtes invité à dîner chez des voisins français qui vous proposent un repas typique avec entrée, plat, fromage et dessert. Quelle affirmation est vraie concernant la gastronomie française ?",
    explanationFr:
      "Le repas gastronomique des Français est inscrit au patrimoine culturel immatériel de l'UNESCO depuis 2010. La tradition du repas structuré (apéritif, entrée, plat, fromage, dessert) est un élément important de la culture et du lien social en France.",
    choicesFr: [
      { id: "a" as const, text: "La gastronomie française n'a aucune reconnaissance internationale" },
      { id: "b" as const, text: "La cuisine française est uniquement une tradition parisienne" },
      { id: "c" as const, text: "Le repas français traditionnel ne comporte qu'un seul plat" },
      { id: "d" as const, text: "Le repas gastronomique des Français est inscrit au patrimoine immatériel de l'UNESCO" },
    ],
    correctChoice: "d" as const,
  },

  // S9: Journées du patrimoine
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "En septembre, vous voyez des affiches annonçant les Journées européennes du patrimoine. Des bâtiments habituellement fermés au public ouvrent leurs portes. De quoi s'agit-il ?",
    explanationFr:
      "Les Journées européennes du patrimoine ont lieu chaque année en septembre. Elles permettent de visiter gratuitement des lieux habituellement fermés au public : ministères, palais, bâtiments historiques. C'est un événement culturel majeur en France et en Europe.",
    choicesFr: [
      { id: "a" as const, text: "Un événement commercial pour vendre des produits régionaux" },
      { id: "b" as const, text: "Une fête religieuse européenne" },
      { id: "c" as const, text: "Un événement annuel permettant de visiter gratuitement des lieux patrimoniaux habituellement fermés" },
      { id: "d" as const, text: "Une journée de travaux de rénovation des bâtiments publics" },
    ],
    correctChoice: "c" as const,
  },

  // S10: École et culture
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Votre enfant revient de l'école en vous parlant d'une sortie scolaire organisée au musée et d'un cours d'éducation musicale. Pourquoi l'école française inclut-elle ces activités culturelles ?",
    explanationFr:
      "L'éducation artistique et culturelle est une mission fondamentale de l'école en France. Elle vise à permettre à tous les élèves, quel que soit leur milieu social, d'accéder à la culture et de développer leur sensibilité artistique. C'est un pilier de l'égalité républicaine.",
    choicesFr: [
      { id: "a" as const, text: "L'éducation artistique et culturelle est une mission de l'école pour garantir l'accès de tous à la culture" },
      { id: "b" as const, text: "C'est uniquement pour divertir les enfants" },
      { id: "c" as const, text: "C'est une activité payante réservée aux familles aisées" },
      { id: "d" as const, text: "Ces activités sont facultatives et dépendent du bon vouloir de l'enseignant" },
    ],
    correctChoice: "a" as const,
  },

  // ─── Géographie au quotidien (5 questions) ────────────────────────────────

  // S11: Régions
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous cherchez un emploi et vous consultez des offres dans différentes régions de France. Combien de régions métropolitaines la France compte-t-elle depuis la réforme de 2015 ?",
    explanationFr:
      "Depuis la réforme territoriale de 2015, la France métropolitaine compte 13 régions (au lieu de 22 auparavant). Les régions sont dirigées par un conseil régional élu. Elles gèrent notamment les transports régionaux, les lycées et le développement économique.",
    choicesFr: [
      { id: "a" as const, text: "22 régions" },
      { id: "b" as const, text: "13 régions" },
      { id: "c" as const, text: "18 régions" },
      { id: "d" as const, text: "26 régions" },
    ],
    correctChoice: "b" as const,
  },

  // S12: DROM-COM
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Un collègue originaire de la Guadeloupe vous explique qu'il est français. Vous êtes surpris car la Guadeloupe est loin de la métropole. Quelle est la situation juridique des territoires d'outre-mer ?",
    explanationFr:
      "Les départements et régions d'outre-mer (DROM) comme la Guadeloupe, la Martinique, la Guyane, La Réunion et Mayotte font partie intégrante de la République française. Leurs habitants sont des citoyens français à part entière, avec les mêmes droits et devoirs.",
    choicesFr: [
      { id: "a" as const, text: "Ce sont des pays indépendants alliés à la France" },
      { id: "b" as const, text: "Leurs habitants ne sont pas citoyens français" },
      { id: "c" as const, text: "Ce sont des territoires de la République française dont les habitants sont citoyens français" },
      { id: "d" as const, text: "Ce sont des colonies sans droits politiques" },
    ],
    correctChoice: "c" as const,
  },

  // S13: Union européenne
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous souhaitez voyager en Espagne pour les vacances. Un ami vous dit que vous n'avez pas besoin de passeport si vous avez un titre de séjour français. Pourquoi est-ce possible ?",
    explanationFr:
      "La France est membre de l'Union européenne et de l'espace Schengen, qui permet la libre circulation des personnes entre les pays membres sans contrôle aux frontières intérieures. Un titre de séjour français valide permet de voyager dans l'espace Schengen.",
    choicesFr: [
      { id: "a" as const, text: "L'Espagne et la France ont un accord bilatéral spécial" },
      { id: "b" as const, text: "Grâce à l'espace Schengen qui permet la libre circulation entre pays membres" },
      { id: "c" as const, text: "Il n'y a jamais de contrôle aux frontières en Europe" },
      { id: "d" as const, text: "Ce n'est pas vrai, un passeport est toujours obligatoire" },
    ],
    correctChoice: "b" as const,
  },

  // S14: Euro
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous venez d'arriver en France et vous devez changer votre argent. Quelle est la monnaie utilisée en France et depuis quand ?",
    explanationFr:
      "La France utilise l'euro (€) comme monnaie depuis le 1er janvier 2002 (mise en circulation des pièces et billets). L'euro est la monnaie commune de la zone euro, qui regroupe 20 pays de l'Union européenne. Il a remplacé le franc français.",
    choicesFr: [
      { id: "a" as const, text: "Le franc français, depuis toujours" },
      { id: "b" as const, text: "Le dollar européen, depuis 2010" },
      { id: "c" as const, text: "L'euro, en circulation depuis 2002" },
      { id: "d" as const, text: "La livre, depuis le Brexit" },
    ],
    correctChoice: "c" as const,
  },

  // S15: Commune et département
  {
    themeId: 4 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous recevez un courrier officiel qui mentionne votre commune et votre département. Vous ne comprenez pas la différence entre ces deux niveaux administratifs. Quelle explication est correcte ?",
    explanationFr:
      "La France est organisée en trois niveaux de collectivités territoriales : la commune (gérée par le maire), le département (géré par le conseil départemental) et la région (gérée par le conseil régional). La commune est l'échelon le plus proche des citoyens.",
    choicesFr: [
      { id: "a" as const, text: "La commune et le département sont la même chose" },
      { id: "b" as const, text: "Le département est un regroupement de plusieurs communes, c'est un niveau administratif supérieur" },
      { id: "c" as const, text: "Le département n'existe plus depuis la réforme de 2015" },
      { id: "d" as const, text: "La commune est plus grande que le département" },
    ],
    correctChoice: "b" as const,
  },
];

export const situationsTheme5 = [
  // ─── Démarches administratives (8 questions) ──────────────────────────────

  // S1: Déclaration de naissance
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Votre femme vient d'accoucher à l'hôpital. On vous dit que vous devez déclarer la naissance. Où et dans quel délai devez-vous le faire ?",
    explanationFr:
      "La déclaration de naissance doit être faite à la mairie du lieu de naissance dans les 5 jours suivant l'accouchement. Elle est obligatoire et permet d'établir l'acte de naissance de l'enfant, indispensable pour toutes les démarches administratives.",
    choicesFr: [
      { id: "a" as const, text: "À la mairie du lieu de naissance, dans les 5 jours" },
      { id: "b" as const, text: "À la préfecture, dans les 30 jours" },
      { id: "c" as const, text: "À l'hôpital, le jour même" },
      { id: "d" as const, text: "Au consulat, dans les 15 jours" },
    ],
    correctChoice: "a" as const,
  },

  // S2: Carte Vitale
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous venez d'arriver en France et vous commencez à travailler. Votre employeur vous demande si vous avez une carte Vitale. À quoi sert cette carte ?",
    explanationFr:
      "La carte Vitale est la carte d'assurance maladie de la Sécurité sociale. Elle permet le remboursement des soins médicaux. Elle doit être présentée chez le médecin, à la pharmacie et à l'hôpital pour que les frais soient pris en charge.",
    choicesFr: [
      { id: "a" as const, text: "C'est une carte de transport en commun" },
      { id: "b" as const, text: "C'est une carte d'identité professionnelle" },
      { id: "c" as const, text: "C'est une carte bancaire pour les fonctionnaires" },
      { id: "d" as const, text: "C'est la carte d'assurance maladie qui permet le remboursement des soins" },
    ],
    correctChoice: "d" as const,
  },

  // S3: Inscription sur les listes électorales
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous venez d'obtenir la nationalité française et vous souhaitez voter aux prochaines élections. Quelle démarche devez-vous effectuer ?",
    explanationFr:
      "Pour voter en France, il faut être inscrit sur les listes électorales de sa commune. L'inscription peut se faire en mairie, en ligne sur service-public.fr, ou par courrier. Les nouveaux naturalisés sont normalement inscrits d'office, mais il est conseillé de vérifier.",
    choicesFr: [
      { id: "a" as const, text: "Aller à la préfecture le jour du vote" },
      { id: "b" as const, text: "Aucune démarche, les étrangers en situation régulière peuvent voter" },
      { id: "c" as const, text: "Vérifier votre inscription sur les listes électorales auprès de votre mairie" },
      { id: "d" as const, text: "Demander une autorisation spéciale au tribunal" },
    ],
    correctChoice: "c" as const,
  },

  // S4: Renouvellement titre de séjour
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Votre titre de séjour expire dans trois mois. Que devez-vous faire pour le renouveler ?",
    explanationFr:
      "Le renouvellement d'un titre de séjour doit être demandé 2 à 4 mois avant son expiration, auprès de la préfecture ou sous-préfecture de votre domicile. La demande se fait généralement en ligne sur le site de l'ANEF (Administration Numérique pour les Étrangers en France).",
    choicesFr: [
      { id: "a" as const, text: "Attendre que le titre expire pour faire la demande" },
      { id: "b" as const, text: "Contacter l'ambassade de France dans votre pays d'origine" },
      { id: "c" as const, text: "Demander à votre employeur de s'en occuper" },
      { id: "d" as const, text: "Faire la demande de renouvellement auprès de la préfecture avant l'expiration" },
    ],
    correctChoice: "d" as const,
  },

  // S5: Courrier de la préfecture
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous recevez un courrier de la préfecture vous demandant de fournir des documents supplémentaires pour votre dossier. Que devez-vous faire ?",
    explanationFr:
      "Lorsque la préfecture demande des pièces complémentaires, il est impératif de répondre dans les délais indiqués. Ne pas répondre peut entraîner le rejet de votre demande. En cas de difficulté, vous pouvez contacter la préfecture ou vous faire aider par une association.",
    choicesFr: [
      { id: "a" as const, text: "Ignorer le courrier, la préfecture reviendra vers vous" },
      { id: "b" as const, text: "Porter plainte car la préfecture vous harcèle" },
      { id: "c" as const, text: "Fournir les documents demandés dans les délais indiqués" },
      { id: "d" as const, text: "Attendre d'avoir un avocat pour répondre" },
    ],
    correctChoice: "c" as const,
  },

  // S6: Changement d'adresse
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous venez de déménager dans une nouvelle ville. Quels organismes devez-vous prévenir de votre changement d'adresse ?",
    explanationFr:
      "Lors d'un déménagement, vous devez prévenir de nombreux organismes : la préfecture (si vous avez un titre de séjour), la Sécurité sociale (CPAM), la CAF, les impôts, votre banque, et La Poste pour le suivi du courrier. Le site service-public.fr propose un service de changement d'adresse en ligne.",
    choicesFr: [
      { id: "a" as const, text: "Uniquement La Poste pour le suivi du courrier" },
      { id: "b" as const, text: "Aucun organisme, le changement est automatique" },
      { id: "c" as const, text: "Uniquement la mairie de votre nouvelle ville" },
      { id: "d" as const, text: "La préfecture, la Sécurité sociale, la CAF, les impôts et votre banque, entre autres" },
    ],
    correctChoice: "d" as const,
  },

  // S7: Service-public.fr
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous avez besoin de faire une démarche administrative mais vous ne savez pas où vous renseigner. Un ami vous conseille un site officiel du gouvernement. Lequel ?",
    explanationFr:
      "Le site service-public.fr est le site officiel de l'administration française. Il regroupe toutes les informations sur les démarches administratives, les droits et les obligations des usagers. Il permet aussi de réaliser certaines démarches en ligne.",
    choicesFr: [
      { id: "a" as const, text: "www.google.fr" },
      { id: "b" as const, text: "www.facebook.com" },
      { id: "c" as const, text: "www.service-public.fr" },
      { id: "d" as const, text: "www.wikipedia.org" },
    ],
    correctChoice: "c" as const,
  },

  // S8: Acte de naissance pour mariage
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous souhaitez vous marier en France et la mairie vous demande un acte de naissance de moins de 3 mois. Vous êtes né à l'étranger. Où devez-vous demander ce document ?",
    explanationFr:
      "Si vous êtes né à l'étranger et que votre naissance a été transcrite dans les registres français, vous pouvez demander votre acte de naissance au Service central d'état civil à Nantes (SCEC). Sinon, il faudra fournir l'acte de naissance étranger traduit et légalisé ou apostillé.",
    choicesFr: [
      { id: "a" as const, text: "À la mairie de votre domicile en France" },
      { id: "b" as const, text: "À la préfecture de police" },
      { id: "c" as const, text: "Au tribunal de grande instance" },
      { id: "d" as const, text: "Au Service central d'état civil à Nantes ou auprès des autorités de votre pays d'origine" },
    ],
    correctChoice: "d" as const,
  },

  // ─── Urgences et santé (7 questions) ──────────────────────────────────────

  // S9: SAMU - 15
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Votre voisin âgé se plaint de fortes douleurs dans la poitrine et a du mal à respirer. Vous pensez qu'il fait un malaise cardiaque. Quel numéro devez-vous appeler en urgence ?",
    explanationFr:
      "Le 15 est le numéro du SAMU (Service d'Aide Médicale Urgente). Il doit être appelé pour toute urgence médicale grave : malaise cardiaque, AVC, accident grave. Le SAMU envoie une équipe médicale sur place et peut déclencher l'intervention des pompiers.",
    choicesFr: [
      { id: "a" as const, text: "Le 17 (police)" },
      { id: "b" as const, text: "Le 15 (SAMU)" },
      { id: "c" as const, text: "Le 18 (pompiers)" },
      { id: "d" as const, text: "Le 3114 (prévention du suicide)" },
    ],
    correctChoice: "b" as const,
  },

  // S10: Police - 17
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "En rentrant chez vous le soir, vous constatez que la porte de votre appartement a été forcée et que des objets ont disparu. Quel numéro devez-vous appeler ?",
    explanationFr:
      "Le 17 est le numéro de la police secours (ou de la gendarmerie en zone rurale). Il doit être appelé en cas d'infraction en cours ou récente : cambriolage, agression, violence. Il ne faut toucher à rien sur les lieux et attendre l'arrivée des forces de l'ordre.",
    choicesFr: [
      { id: "a" as const, text: "Le 15 (SAMU)" },
      { id: "b" as const, text: "Le 17 (police secours)" },
      { id: "c" as const, text: "Le 18 (pompiers)" },
      { id: "d" as const, text: "Le 12 (renseignements téléphoniques)" },
    ],
    correctChoice: "b" as const,
  },

  // S11: Pompiers - 18
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous sentez une forte odeur de fumée dans votre immeuble et vous voyez de la fumée sortir d'un appartement voisin. Quel numéro appelez-vous en priorité ?",
    explanationFr:
      "Le 18 est le numéro des pompiers (sapeurs-pompiers). Il doit être appelé en cas d'incendie, d'accident de la route, d'inondation ou de toute situation nécessitant un secours. En cas de doute, le 112 (numéro d'urgence européen) fonctionne aussi.",
    choicesFr: [
      { id: "a" as const, text: "Le 18 (pompiers)" },
      { id: "b" as const, text: "Le 15 (SAMU)" },
      { id: "c" as const, text: "Le 17 (police)" },
      { id: "d" as const, text: "Le syndic de l'immeuble" },
    ],
    correctChoice: "a" as const,
  },

  // S12: 112
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous êtes témoin d'un accident de la route en France mais vous ne vous souvenez plus des numéros d'urgence français. Quel numéro unique pouvez-vous appeler qui fonctionne dans toute l'Europe ?",
    explanationFr:
      "Le 112 est le numéro d'urgence européen. Il fonctionne dans tous les pays de l'Union européenne, gratuitement et 24h/24. Il permet de joindre les services de secours (pompiers, SAMU, police) depuis n'importe quel téléphone, même sans carte SIM.",
    choicesFr: [
      { id: "a" as const, text: "Le 911" },
      { id: "b" as const, text: "Le 112" },
      { id: "c" as const, text: "Le 999" },
      { id: "d" as const, text: "Le 114" },
    ],
    correctChoice: "b" as const,
  },

  // S13: Médecin traitant
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous vous inscrivez à la Sécurité sociale et on vous demande de choisir un médecin traitant. Pourquoi est-ce important ?",
    explanationFr:
      "Le médecin traitant est le médecin que vous consultez en premier pour tout problème de santé. Il coordonne votre parcours de soins et vous oriente vers des spécialistes si nécessaire. Sans médecin traitant déclaré, le remboursement des soins par la Sécurité sociale est réduit.",
    choicesFr: [
      { id: "a" as const, text: "C'est obligatoire uniquement pour les enfants" },
      { id: "b" as const, text: "C'est facultatif et n'a aucun impact sur les remboursements" },
      { id: "c" as const, text: "Le médecin traitant est uniquement un spécialiste" },
      { id: "d" as const, text: "Le médecin traitant coordonne vos soins et permet un meilleur remboursement" },
    ],
    correctChoice: "d" as const,
  },

  // S14: Urgences hospitalières
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre enfant se casse le bras en tombant dans un parc le dimanche. Votre médecin traitant ne travaille pas le dimanche. Où devez-vous l'emmener ?",
    explanationFr:
      "En cas d'urgence médicale quand le médecin traitant n'est pas disponible, vous pouvez vous rendre aux urgences de l'hôpital le plus proche. En France, les urgences hospitalières fonctionnent 24h/24, 7j/7. Vous pouvez aussi appeler le 15 (SAMU) pour obtenir un conseil médical.",
    choicesFr: [
      { id: "a" as const, text: "Attendre lundi pour voir le médecin traitant" },
      { id: "b" as const, text: "Aller directement aux urgences de l'hôpital le plus proche" },
      { id: "c" as const, text: "Appeler la mairie pour obtenir un rendez-vous" },
      { id: "d" as const, text: "Se rendre à la pharmacie pour demander un plâtre" },
    ],
    correctChoice: "b" as const,
  },

  // S15: Pharmacie de garde
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Il est 23 heures et vous avez besoin d'un médicament urgent prescrit par le médecin. Toutes les pharmacies de votre quartier sont fermées. Que pouvez-vous faire ?",
    explanationFr:
      "En France, un système de pharmacies de garde assure la dispensation de médicaments la nuit, les dimanches et les jours fériés. Pour trouver la pharmacie de garde la plus proche, vous pouvez appeler le 3237 ou consulter le site de l'Ordre des pharmaciens.",
    choicesFr: [
      { id: "a" as const, text: "Attendre le lendemain matin" },
      { id: "b" as const, text: "Commander le médicament sur Internet" },
      { id: "c" as const, text: "Chercher la pharmacie de garde en appelant le 3237" },
      { id: "d" as const, text: "Aller aux urgences pour obtenir le médicament" },
    ],
    correctChoice: "c" as const,
  },

  // ─── École et enfants (8 questions) ───────────────────────────────────────

  // S16: Inscription scolaire
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous venez d'arriver en France avec votre enfant de 7 ans. Vous souhaitez l'inscrire à l'école. Où devez-vous vous rendre en premier ?",
    explanationFr:
      "Pour inscrire un enfant à l'école élémentaire, il faut d'abord se rendre à la mairie de votre domicile pour obtenir un certificat d'inscription, puis se présenter à l'école avec ce certificat. L'école est obligatoire en France de 3 à 16 ans, quelle que soit la nationalité de l'enfant.",
    choicesFr: [
      { id: "a" as const, text: "À la mairie de votre domicile pour obtenir un certificat d'inscription" },
      { id: "b" as const, text: "Directement à l'école la plus proche" },
      { id: "c" as const, text: "À la préfecture pour demander une autorisation" },
      { id: "d" as const, text: "Au rectorat de l'académie" },
    ],
    correctChoice: "a" as const,
  },

  // S17: Obligation scolaire
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Votre voisin vous dit que son enfant de 4 ans n'a pas besoin d'aller à l'école car il est trop petit. A-t-il raison ?",
    explanationFr:
      "Non. Depuis 2019, l'instruction est obligatoire en France dès l'âge de 3 ans (et jusqu'à 16 ans). Cela signifie que tout enfant résidant en France, quelle que soit sa nationalité, doit être inscrit dans un établissement scolaire ou recevoir une instruction à domicile.",
    choicesFr: [
      { id: "a" as const, text: "Oui, l'école n'est obligatoire qu'à partir de 6 ans" },
      { id: "b" as const, text: "Oui, l'école n'est obligatoire qu'à partir de 5 ans" },
      { id: "c" as const, text: "Non, l'instruction est obligatoire dès 3 ans en France" },
      { id: "d" as const, text: "Non, l'instruction est obligatoire dès 2 ans en France" },
    ],
    correctChoice: "c" as const,
  },

  // S18: Laïcité à l'école
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Votre fille de 14 ans veut porter un signe religieux visible à l'école publique. L'établissement lui dit que ce n'est pas autorisé. Est-ce légal ?",
    explanationFr:
      "Oui, c'est légal. La loi du 15 mars 2004 interdit le port de signes ou tenues manifestant ostensiblement une appartenance religieuse dans les écoles, collèges et lycées publics. Cette loi s'applique à toutes les religions et vise à préserver la laïcité dans l'espace scolaire.",
    choicesFr: [
      { id: "a" as const, text: "Non, c'est une discrimination religieuse" },
      { id: "b" as const, text: "Oui, la loi interdit les signes religieux ostensibles dans les écoles publiques" },
      { id: "c" as const, text: "Cela dépend de la religion concernée" },
      { id: "d" as const, text: "Cela ne concerne que les enseignants, pas les élèves" },
    ],
    correctChoice: "b" as const,
  },

  // S19: Réunion parents-professeurs
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "L'école de votre enfant vous invite à une réunion parents-professeurs. Vous ne parlez pas bien français et hésitez à y aller. Que devriez-vous faire ?",
    explanationFr:
      "Il est important d'assister aux réunions parents-professeurs pour suivre la scolarité de votre enfant. Si vous ne maîtrisez pas le français, vous pouvez vous faire accompagner par un proche qui traduit, ou demander à l'école s'il existe un dispositif d'interprétariat.",
    choicesFr: [
      { id: "a" as const, text: "Ne pas y aller car vous ne comprendrez rien" },
      { id: "b" as const, text: "Y aller accompagné d'une personne pouvant traduire pour vous" },
      { id: "c" as const, text: "Envoyer un courrier pour expliquer que vous ne pouvez pas venir" },
      { id: "d" as const, text: "Attendre que votre enfant vous transmette les informations" },
    ],
    correctChoice: "b" as const,
  },

  // S20: Harcèlement scolaire
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre enfant revient de l'école en pleurant et vous dit que des camarades le frappent et l'insultent régulièrement. Que devez-vous faire ?",
    explanationFr:
      "Le harcèlement scolaire est un délit en France. Vous devez en parler au directeur de l'école ou au chef d'établissement. Vous pouvez aussi appeler le 3020 (numéro national contre le harcèlement scolaire). L'école a l'obligation de protéger les élèves et de prendre des mesures.",
    choicesFr: [
      { id: "a" as const, text: "Dire à votre enfant de se défendre seul" },
      { id: "b" as const, text: "Contacter les parents des enfants concernés pour régler le problème" },
      { id: "c" as const, text: "Signaler la situation au directeur de l'école et appeler le 3020 si nécessaire" },
      { id: "d" as const, text: "Changer votre enfant d'école sans rien dire" },
    ],
    correctChoice: "c" as const,
  },

  // S21: Cantine scolaire
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous souhaitez inscrire votre enfant à la cantine de l'école mais vous avez des revenus modestes. Comment le tarif est-il calculé ?",
    explanationFr:
      "Dans la plupart des communes, le tarif de la cantine scolaire est calculé en fonction des revenus de la famille (quotient familial). Les familles aux revenus les plus modestes paient le tarif le plus bas. Aucun enfant ne peut être exclu de la cantine pour des raisons financières.",
    choicesFr: [
      { id: "a" as const, text: "Le tarif est le même pour tous, sans exception" },
      { id: "b" as const, text: "La cantine est toujours gratuite en France" },
      { id: "c" as const, text: "Le tarif est calculé en fonction des revenus de la famille" },
      { id: "d" as const, text: "Seuls les enfants de nationalité française peuvent y accéder" },
    ],
    correctChoice: "c" as const,
  },

  // S22: Absences scolaires
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre enfant est malade et ne peut pas aller à l'école pendant plusieurs jours. Quelle est votre obligation en tant que parent ?",
    explanationFr:
      "Les parents doivent prévenir l'école dès le premier jour d'absence et fournir un justificatif (certificat médical, mot d'excuse). Les absences non justifiées répétées peuvent entraîner un signalement aux autorités, car l'instruction est obligatoire en France.",
    choicesFr: [
      { id: "a" as const, text: "Rien, l'école comprendra" },
      { id: "b" as const, text: "Prévenir l'école dès le premier jour et fournir un justificatif" },
      { id: "c" as const, text: "Envoyer un courrier à l'académie" },
      { id: "d" as const, text: "Attendre que l'école vous contacte" },
    ],
    correctChoice: "b" as const,
  },

  // S23: Gratuité de l'école publique
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous venez d'arriver en France et vous vous demandez si l'inscription de votre enfant à l'école publique est payante. Quelle est la règle en France ?",
    explanationFr:
      "L'enseignement dans les écoles publiques est gratuit en France, de la maternelle au lycée. C'est un principe fondamental de l'école républicaine. Les manuels scolaires sont généralement fournis. Cependant, certaines fournitures scolaires restent à la charge des familles.",
    choicesFr: [
      { id: "a" as const, text: "L'école publique est gratuite pour tous les enfants résidant en France" },
      { id: "b" as const, text: "L'école publique est payante pour les familles étrangères" },
      { id: "c" as const, text: "L'école est gratuite uniquement à partir du collège" },
      { id: "d" as const, text: "Les frais de scolarité dépendent de la nationalité" },
    ],
    correctChoice: "a" as const,
  },

  // ─── Travail et emploi (7 questions) ──────────────────────────────────────

  // S24: France Travail
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous venez de perdre votre emploi en France. Un ami vous conseille de vous inscrire à France Travail (anciennement Pôle emploi). Pourquoi est-ce important ?",
    explanationFr:
      "France Travail est le service public de l'emploi en France. L'inscription permet de bénéficier d'un accompagnement dans la recherche d'emploi, de formations, et éventuellement d'une allocation chômage (ARE) si vous avez suffisamment cotisé.",
    choicesFr: [
      { id: "a" as const, text: "C'est obligatoire uniquement pour les citoyens français" },
      { id: "b" as const, text: "L'inscription permet d'être accompagné dans la recherche d'emploi et de percevoir des allocations chômage" },
      { id: "c" as const, text: "France Travail est une agence d'intérim privée" },
      { id: "d" as const, text: "L'inscription n'est utile que si vous cherchez un emploi dans la fonction publique" },
    ],
    correctChoice: "b" as const,
  },

  // S25: SMIC
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "On vous propose un emploi à temps plein mais le salaire proposé vous semble très bas. Existe-t-il un salaire minimum en France ?",
    explanationFr:
      "Oui, le SMIC (Salaire Minimum Interprofessionnel de Croissance) est le salaire horaire minimum légal en France. Aucun salarié majeur ne peut être payé en dessous du SMIC. Il est revalorisé chaque année. En cas de doute, vous pouvez vérifier le montant actuel sur service-public.fr.",
    choicesFr: [
      { id: "a" as const, text: "Non, il n'y a pas de salaire minimum en France" },
      { id: "b" as const, text: "Le salaire minimum existe mais ne s'applique qu'aux Français" },
      { id: "c" as const, text: "Oui, le SMIC est le salaire minimum légal applicable à tous les salariés" },
      { id: "d" as const, text: "Le salaire minimum est fixé par chaque entreprise" },
    ],
    correctChoice: "c" as const,
  },

  // S26: Contrat de travail
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous commencez un nouvel emploi et votre employeur vous remet un contrat de travail. Quels éléments essentiels doit-il contenir ?",
    explanationFr:
      "Un contrat de travail doit contenir au minimum : l'identité des parties, le poste occupé, la durée du travail, la rémunération, le lieu de travail, la date de début et la convention collective applicable. Pour un CDD, la durée et le motif du recours doivent aussi être précisés.",
    choicesFr: [
      { id: "a" as const, text: "Uniquement le salaire et les horaires" },
      { id: "b" as const, text: "Le contrat de travail n'est pas obligatoire en France" },
      { id: "c" as const, text: "Seulement le nom de l'entreprise et votre signature" },
      { id: "d" as const, text: "Le poste, la durée, le salaire, le lieu de travail et la convention collective, entre autres" },
    ],
    correctChoice: "d" as const,
  },

  // S27: Discrimination au travail
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Au travail, votre supérieur refuse de vous accorder une promotion en raison de votre origine. Que pouvez-vous faire ?",
    explanationFr:
      "La discrimination fondée sur l'origine est interdite par la loi en France (Code du travail et Code pénal). Vous pouvez saisir le Défenseur des droits, porter plainte auprès de la police ou du procureur, contacter les représentants du personnel ou un syndicat, et saisir le conseil de prud'hommes.",
    choicesFr: [
      { id: "a" as const, text: "Accepter la situation car l'employeur a toujours raison" },
      { id: "b" as const, text: "Démissionner immédiatement" },
      { id: "c" as const, text: "Ne rien faire car la loi ne protège pas contre ce type de discrimination" },
      { id: "d" as const, text: "Saisir le Défenseur des droits, porter plainte ou contacter un syndicat" },
    ],
    correctChoice: "d" as const,
  },

  // S28: Congés payés
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous travaillez depuis un an dans une entreprise et vous souhaitez prendre des vacances. Avez-vous droit à des congés payés ?",
    explanationFr:
      "En France, tout salarié a droit à 5 semaines de congés payés par an (soit 2,5 jours ouvrables par mois travaillé). Ce droit est garanti par le Code du travail. L'employeur ne peut pas refuser les congés payés, même s'il peut en fixer les dates en fonction des nécessités du service.",
    choicesFr: [
      { id: "a" as const, text: "Oui, tout salarié a droit à 5 semaines de congés payés par an" },
      { id: "b" as const, text: "Non, les congés payés ne sont accordés qu'après 5 ans d'ancienneté" },
      { id: "c" as const, text: "Les congés payés sont réservés aux cadres" },
      { id: "d" as const, text: "Les congés payés n'existent que dans la fonction publique" },
    ],
    correctChoice: "a" as const,
  },

  // S29: Syndicats
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Un collègue vous parle des syndicats et vous propose d'adhérer. Votre employeur peut-il vous interdire d'adhérer à un syndicat ?",
    explanationFr:
      "Non. La liberté syndicale est un droit fondamental inscrit dans la Constitution française et le Code du travail. Tout salarié est libre d'adhérer ou non à un syndicat. L'employeur ne peut pas sanctionner ou discriminer un salarié en raison de son appartenance syndicale.",
    choicesFr: [
      { id: "a" as const, text: "Oui, l'employeur peut interdire toute activité syndicale" },
      { id: "b" as const, text: "Les syndicats sont réservés aux salariés de nationalité française" },
      { id: "c" as const, text: "Non, la liberté syndicale est un droit constitutionnel, l'employeur ne peut pas l'interdire" },
      { id: "d" as const, text: "Seuls les fonctionnaires ont le droit d'adhérer à un syndicat" },
    ],
    correctChoice: "c" as const,
  },

  // S30: Droit de grève
  {
    themeId: 5 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Des collègues vous annoncent qu'ils vont faire grève pour demander une augmentation de salaire. Vous vous demandez si c'est légal en France. Que dit la loi ?",
    explanationFr:
      "Le droit de grève est un droit constitutionnel en France, reconnu par le préambule de la Constitution de 1946. Tout salarié peut participer à une grève pour défendre ses intérêts professionnels. L'employeur ne peut pas licencier un salarié pour avoir fait grève.",
    choicesFr: [
      { id: "a" as const, text: "La grève est illégale en France" },
      { id: "b" as const, text: "La grève n'est autorisée que dans le secteur public" },
      { id: "c" as const, text: "Seuls les syndicats peuvent décider d'une grève" },
      { id: "d" as const, text: "Le droit de grève est un droit constitutionnel pour tous les salariés" },
    ],
    correctChoice: "d" as const,
  },
];
