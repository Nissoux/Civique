export const questionsTheme5 = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SANTÉ, ÉDUCATION, EMPLOI & VIE QUOTIDIENNE
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Q1 ── CSP + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Quel numéro d'urgence permet d'appeler le SAMU ?",
    explanationFr:
      "Le 15 est le numéro d'urgence du SAMU (Service d'Aide Médicale Urgente). Il permet de joindre un médecin régulateur qui évalue la situation et envoie les secours adaptés.",
    choicesFr: [
      { id: 'a' as const, text: 'Le 15' },
      { id: 'b' as const, text: 'Le 17' },
      { id: 'c' as const, text: 'Le 18' },
      { id: 'd' as const, text: 'Le 112' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q2 ── CSP only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Quel numéro d'urgence permet d'appeler les pompiers ?",
    explanationFr:
      "Le 18 est le numéro des sapeurs-pompiers. Il permet de signaler un incendie, un accident ou toute situation nécessitant une intervention d'urgence.",
    choicesFr: [
      { id: 'a' as const, text: 'Le 18' },
      { id: 'b' as const, text: 'Le 15' },
      { id: 'c' as const, text: 'Le 17' },
      { id: 'd' as const, text: 'Le 114' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q3 ── CSP only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Après avoir obtenu le permis de conduire, que faut-il faire pour pouvoir conduire sa voiture ?",
    explanationFr:
      "Pour conduire légalement, il faut assurer son véhicule auprès d'une compagnie d'assurance. L'assurance automobile est obligatoire en France pour couvrir les dommages causés à des tiers.",
    choicesFr: [
      { id: 'a' as const, text: "Assurer son véhicule auprès d'une compagnie d'assurance" },
      { id: 'b' as const, text: "S'inscrire à la préfecture de police" },
      { id: 'c' as const, text: 'Passer une visite médicale obligatoire' },
      { id: 'd' as const, text: 'Obtenir une autorisation spéciale de la mairie' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q4 ── CSP only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "À quelles conditions un mariage est-il reconnu juridiquement ?",
    explanationFr:
      "En France, seul le mariage civil célébré en mairie est reconnu juridiquement. Le mariage religieux n'a pas de valeur légale s'il n'est pas précédé d'un mariage civil.",
    choicesFr: [
      { id: 'a' as const, text: "S'il est célébré en mairie (mariage civil)" },
      { id: 'b' as const, text: "S'il est célébré dans un lieu de culte" },
      { id: 'c' as const, text: "S'il est reconnu par la famille des époux" },
      { id: 'd' as const, text: "S'il est organisé par un notaire" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q5 ── CSP + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr:
      "Quand faut-il déclarer son enfant au service d'état civil de la mairie ?",
    explanationFr:
      "La déclaration de naissance doit être faite dans les 5 jours suivant la naissance auprès de la mairie du lieu de naissance. Ce délai est fixé par la loi.",
    choicesFr: [
      { id: 'a' as const, text: 'Dans les 5 jours suivant la naissance' },
      { id: 'b' as const, text: 'Dans les 30 jours suivant la naissance' },
      { id: 'c' as const, text: 'Dans les 3 mois suivant la naissance' },
      { id: 'd' as const, text: "Avant la sortie de l'hôpital" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q6 ── CSP + CR + NAT ──────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr: "Le travail non déclaré est :",
    explanationFr:
      "Le travail non déclaré (travail au noir) est interdit par la loi. Il prive le salarié de protection sociale et expose l'employeur et le salarié à des sanctions pénales et financières.",
    choicesFr: [
      { id: 'a' as const, text: 'Interdit par la loi' },
      { id: 'b' as const, text: 'Autorisé pour les petits travaux' },
      { id: 'c' as const, text: "Toléré si le salarié est d'accord" },
      { id: 'd' as const, text: 'Autorisé pour les travailleurs étrangers' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q7 ── CSP only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Que doit faire un employeur pour fixer un salaire ?",
    explanationFr:
      "L'employeur doit respecter le SMIC (Salaire Minimum Interprofessionnel de Croissance) et les conventions collectives applicables. Il ne peut pas fixer un salaire inférieur au minimum légal.",
    choicesFr: [
      { id: 'a' as const, text: 'Respecter au minimum le SMIC et la convention collective' },
      { id: 'b' as const, text: 'Fixer librement le montant sans aucune contrainte' },
      { id: 'c' as const, text: "Demander l'autorisation de la mairie" },
      { id: 'd' as const, text: 'Consulter les autres employeurs du quartier' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q8 ── CSP + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Qu'est-ce que le SMIC ?",
    explanationFr:
      "Le SMIC est le Salaire Minimum Interprofessionnel de Croissance. C'est le salaire horaire minimum légal en dessous duquel aucun salarié ne peut être rémunéré en France.",
    choicesFr: [
      { id: 'a' as const, text: 'Le salaire minimum légal en dessous duquel un salarié ne peut pas être payé' },
      { id: 'b' as const, text: 'Le salaire moyen des Français' },
      { id: 'c' as const, text: "Une aide financière versée par l'État aux chômeurs" },
      { id: 'd' as const, text: 'Le salaire maximum autorisé par la loi' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q9 ── CSP + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Quelle est la première démarche à réaliser pour chercher un emploi ?",
    explanationFr:
      "La première démarche pour chercher un emploi est de s'inscrire à France Travail (anciennement Pôle emploi). Cet organisme accompagne les demandeurs d'emploi dans leurs recherches et peut leur verser des allocations.",
    choicesFr: [
      { id: 'a' as const, text: "S'inscrire à France Travail (anciennement Pôle emploi)" },
      { id: 'b' as const, text: 'Écrire directement au président de la République' },
      { id: 'c' as const, text: "S'inscrire à la mairie de son domicile" },
      { id: 'd' as const, text: 'Publier une annonce dans un journal' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q10 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Quelle est la durée légale du temps de travail par semaine ?",
    explanationFr:
      "La durée légale du travail en France est de 35 heures par semaine. Au-delà, les heures supplémentaires donnent lieu à une majoration de salaire ou à un repos compensateur.",
    choicesFr: [
      { id: 'a' as const, text: '35 heures' },
      { id: 'b' as const, text: '39 heures' },
      { id: 'c' as const, text: '40 heures' },
      { id: 'd' as const, text: '32 heures' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q11 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Qui est aidé par France Travail ?",
    explanationFr:
      "France Travail (anciennement Pôle emploi) aide les personnes qui cherchent un emploi. Il propose un accompagnement personnalisé, des formations et le versement d'allocations chômage.",
    choicesFr: [
      { id: 'a' as const, text: "Les personnes qui cherchent un emploi" },
      { id: 'b' as const, text: 'Les personnes retraitées uniquement' },
      { id: 'c' as const, text: 'Les employeurs exclusivement' },
      { id: 'd' as const, text: 'Les étudiants en formation initiale' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q12 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr:
      "Une personne étrangère en situation régulière peut créer son entreprise :",
    explanationFr:
      "En France, une personne étrangère en situation régulière a le droit de créer son entreprise, comme tout citoyen français. Il n'y a pas de restriction de nationalité pour l'entrepreneuriat si le titre de séjour le permet.",
    choicesFr: [
      { id: 'a' as const, text: 'Oui, comme toute autre personne' },
      { id: 'b' as const, text: 'Non, seuls les Français le peuvent' },
      { id: 'c' as const, text: 'Uniquement avec une autorisation spéciale du préfet' },
      { id: 'd' as const, text: 'Seulement après 10 ans de résidence en France' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q13 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Une femme peut-elle créer son entreprise ?",
    explanationFr:
      "Oui, une femme peut créer son entreprise en France. L'égalité entre les femmes et les hommes est un principe fondamental de la République, y compris dans le domaine économique et professionnel.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, dans les mêmes conditions qu'un homme" },
      { id: 'b' as const, text: "Non, elle doit obtenir l'accord de son mari" },
      { id: 'c' as const, text: "Seulement dans certains secteurs d'activité" },
      { id: 'd' as const, text: 'Uniquement si elle est de nationalité française' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q14 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "À partir de quel âge un mineur peut-il travailler ?",
    explanationFr:
      "En France, un mineur peut travailler à partir de 16 ans, avec l'autorisation de ses parents. Des dérogations existent pour l'apprentissage dès 15 ans sous certaines conditions.",
    choicesFr: [
      { id: 'a' as const, text: '16 ans' },
      { id: 'b' as const, text: '14 ans' },
      { id: 'c' as const, text: '18 ans' },
      { id: 'd' as const, text: '12 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q15 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr:
      "Auprès de quel organisme faut-il demander le remboursement des frais de santé ?",
    explanationFr:
      "C'est auprès de la Sécurité sociale (Assurance maladie / CPAM) qu'il faut demander le remboursement des frais de santé. Elle prend en charge une partie des dépenses médicales.",
    choicesFr: [
      { id: 'a' as const, text: "La Sécurité sociale (Assurance maladie)" },
      { id: 'b' as const, text: 'La mairie' },
      { id: 'c' as const, text: 'France Travail' },
      { id: 'd' as const, text: 'La Banque de France' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q16 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Qu'est-ce qu'un numéro d'urgence ?",
    explanationFr:
      "Un numéro d'urgence est un numéro de téléphone gratuit, accessible 24 heures sur 24, qui permet de joindre les services de secours (SAMU, pompiers, police) en cas de situation d'urgence.",
    choicesFr: [
      { id: 'a' as const, text: 'Un numéro gratuit pour joindre les services de secours à tout moment' },
      { id: 'b' as const, text: 'Un numéro payant réservé aux médecins' },
      { id: 'c' as const, text: 'Un numéro disponible uniquement en journée' },
      { id: 'd' as const, text: 'Un numéro pour contacter sa mutuelle' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q17 ── CSP + CR ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr: "Concernant l'accès aux soins, quelle proposition est correcte ?",
    explanationFr:
      "En France, toute personne a le droit d'être soignée, quelle que soit sa nationalité ou sa situation financière. L'accès aux soins est un droit fondamental garanti par la loi.",
    choicesFr: [
      { id: 'a' as const, text: "Toute personne a le droit d'être soignée" },
      { id: 'b' as const, text: 'Seuls les citoyens français ont accès aux soins' },
      { id: 'c' as const, text: "L'accès aux soins dépend du niveau de revenu" },
      { id: 'd' as const, text: "Il faut une autorisation préfectorale pour consulter un médecin" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q18 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'situational' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "En cas de problème de santé non urgent, à qui faut-il s'adresser en premier ?",
    explanationFr:
      "En cas de problème de santé non urgent, il faut consulter son médecin traitant en premier. Il coordonne les soins et oriente vers un spécialiste si nécessaire. Cela évite l'engorgement des urgences hospitalières.",
    choicesFr: [
      { id: 'a' as const, text: 'À son médecin traitant' },
      { id: 'b' as const, text: "Aux urgences de l'hôpital" },
      { id: 'c' as const, text: 'À la pharmacie' },
      { id: 'd' as const, text: 'Au SAMU en appelant le 15' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q19 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Quel est le rôle du médecin traitant ?",
    explanationFr:
      "Le médecin traitant assure le suivi médical global du patient. Il coordonne les soins, oriente vers des spécialistes si besoin et tient à jour le dossier médical. Il est le premier interlocuteur pour les questions de santé.",
    choicesFr: [
      { id: 'a' as const, text: 'Assurer le suivi médical et coordonner les soins du patient' },
      { id: 'b' as const, text: 'Prescrire uniquement des médicaments génériques' },
      { id: 'c' as const, text: 'Gérer les urgences hospitalières' },
      { id: 'd' as const, text: 'Rembourser les frais de santé' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q20 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'situational' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Dans quelles situations doit-on se rendre aux urgences de l'hôpital ?",
    explanationFr:
      "Les urgences de l'hôpital sont réservées aux situations graves nécessitant une prise en charge immédiate : accident grave, douleur intense, difficulté respiratoire, etc. Pour les problèmes non urgents, il faut consulter son médecin traitant.",
    choicesFr: [
      { id: 'a' as const, text: "En cas d'accident grave ou de situation mettant la vie en danger" },
      { id: 'b' as const, text: 'Pour un simple rhume ou une grippe légère' },
      { id: 'c' as const, text: 'Pour renouveler une ordonnance' },
      { id: 'd' as const, text: "Pour obtenir un certificat médical de sport" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q21 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Quel est l'objectif des vaccinations obligatoires ?",
    explanationFr:
      "Les vaccinations obligatoires ont pour objectif de protéger la santé de chacun et de la collectivité en empêchant la propagation de maladies graves. C'est le principe de la protection collective.",
    choicesFr: [
      { id: 'a' as const, text: 'Protéger la santé individuelle et collective contre les maladies graves' },
      { id: 'b' as const, text: 'Permettre aux laboratoires pharmaceutiques de faire des bénéfices' },
      { id: 'c' as const, text: 'Contrôler la population' },
      { id: 'd' as const, text: 'Remplacer les consultations chez le médecin' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q22 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "À quoi sert la carte Vitale ?",
    explanationFr:
      "La carte Vitale est la carte d'assurance maladie. Elle permet d'être remboursé plus rapidement de ses frais de santé par la Sécurité sociale. Elle contient les informations administratives de l'assuré.",
    choicesFr: [
      { id: 'a' as const, text: "À être remboursé de ses frais de santé par la Sécurité sociale" },
      { id: 'b' as const, text: 'À obtenir des réductions dans les pharmacies' },
      { id: 'c' as const, text: 'À prouver son identité' },
      { id: 'd' as const, text: 'À payer ses impôts' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q23 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "À quoi sert une mutuelle santé ?",
    explanationFr:
      "Une mutuelle santé (complémentaire santé) sert à compléter les remboursements de la Sécurité sociale. Elle prend en charge tout ou partie des frais de santé restant à la charge de l'assuré.",
    choicesFr: [
      { id: 'a' as const, text: 'À compléter les remboursements de la Sécurité sociale' },
      { id: 'b' as const, text: 'À remplacer la Sécurité sociale' },
      { id: 'c' as const, text: "À obtenir un emploi" },
      { id: 'd' as const, text: 'À financer sa retraite' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q24 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Jusqu'à quel âge l'école est-elle obligatoire ?",
    explanationFr:
      "L'instruction est obligatoire en France pour tous les enfants de 3 à 16 ans. Depuis la loi de 2019, l'obligation d'instruction commence à 3 ans et se poursuit jusqu'à 16 ans.",
    choicesFr: [
      { id: 'a' as const, text: '16 ans' },
      { id: 'b' as const, text: '14 ans' },
      { id: 'c' as const, text: '18 ans' },
      { id: 'd' as const, text: '12 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q25 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "L'autorité parentale prévoit l'obligation :",
    explanationFr:
      "L'autorité parentale prévoit l'obligation de protéger l'enfant, d'assurer son éducation et de permettre son développement. Les parents doivent veiller à sa santé, sa sécurité et sa moralité.",
    choicesFr: [
      { id: 'a' as const, text: "De protéger, éduquer et assurer le développement de l'enfant" },
      { id: 'b' as const, text: "De laisser l'enfant décider seul de son avenir dès 10 ans" },
      { id: 'c' as const, text: "De confier l'enfant à l'État dès sa naissance" },
      { id: 'd' as const, text: "D'inscrire l'enfant dans une école privée" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q26 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Pour qui l'école est-elle obligatoire ?",
    explanationFr:
      "L'école (l'instruction) est obligatoire pour tous les enfants résidant en France, de 3 à 16 ans, quelle que soit leur nationalité ou leur situation administrative.",
    choicesFr: [
      { id: 'a' as const, text: 'Pour tous les enfants résidant en France, de 3 à 16 ans' },
      { id: 'b' as const, text: 'Uniquement pour les enfants de nationalité française' },
      { id: 'c' as const, text: 'Uniquement pour les garçons' },
      { id: 'd' as const, text: 'Pour les enfants de 6 à 18 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q27 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Quel diplôme obtient-on à la fin du lycée ?",
    explanationFr:
      "Le baccalauréat (le bac) est le diplôme obtenu à la fin du lycée. Il sanctionne la fin des études secondaires et permet l'accès à l'enseignement supérieur.",
    choicesFr: [
      { id: 'a' as const, text: 'Le baccalauréat' },
      { id: 'b' as const, text: 'Le brevet des collèges' },
      { id: 'c' as const, text: 'Le CAP' },
      { id: 'd' as const, text: 'La licence' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q28 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr:
      "Dans quels établissements scolaires vont les élèves après l'école élémentaire ?",
    explanationFr:
      "Après l'école élémentaire (primaire), les élèves vont au collège. Le collège accueille les élèves de la 6e à la 3e, généralement de 11 à 15 ans.",
    choicesFr: [
      { id: 'a' as const, text: 'Au collège' },
      { id: 'b' as const, text: 'Au lycée' },
      { id: 'c' as const, text: "À l'université" },
      { id: 'd' as const, text: "À l'école maternelle" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q29 ── CSP only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr: "Un enfant inscrit à l'école :",
    explanationFr:
      "Un enfant inscrit à l'école doit la fréquenter régulièrement. L'assiduité scolaire est une obligation légale. Les absences non justifiées peuvent entraîner des sanctions pour les parents.",
    choicesFr: [
      { id: 'a' as const, text: "Doit fréquenter l'école régulièrement (obligation d'assiduité)" },
      { id: 'b' as const, text: "Peut s'absenter quand il le souhaite" },
      { id: 'c' as const, text: "N'est pas obligé de suivre tous les cours" },
      { id: 'd' as const, text: "Peut quitter l'école à tout moment de la journée" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q30 ── CSP + NAT ──────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ['csp', 'nat'] as const,
    textFr: "Les enfants qui ne parlent pas français :",
    explanationFr:
      "Les enfants qui ne parlent pas français bénéficient d'un enseignement adapté pour apprendre le français. Des dispositifs spécifiques (UPE2A) existent dans les écoles pour les accompagner dans l'apprentissage de la langue.",
    choicesFr: [
      { id: 'a' as const, text: "Bénéficient d'un enseignement adapté pour apprendre le français à l'école" },
      { id: 'b' as const, text: "Ne peuvent pas être inscrits à l'école publique" },
      { id: 'c' as const, text: "Doivent d'abord apprendre le français avant d'aller à l'école" },
      { id: 'd' as const, text: 'Sont orientés vers des écoles spéciales privées' },
    ],
    correctChoice: 'a' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CR QUESTIONS (difficulty 2 if not already in CSP)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Q31 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Quel mariage est reconnu par l'État ?",
    explanationFr:
      "Seul le mariage civil, célébré en mairie devant un officier d'état civil, est reconnu par l'État français. Le mariage religieux n'a aucune valeur juridique en France.",
    choicesFr: [
      { id: 'a' as const, text: 'Le mariage civil célébré en mairie' },
      { id: 'b' as const, text: 'Le mariage religieux célébré dans un lieu de culte' },
      { id: 'c' as const, text: 'Le mariage coutumier célébré en famille' },
      { id: 'd' as const, text: "Tout type de mariage est reconnu par l'État" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q32 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr:
      "Auprès de quelle institution les parents peuvent-ils inscrire leur enfant à l'école publique ?",
    explanationFr:
      "Les parents doivent inscrire leur enfant à l'école publique auprès de la mairie de leur commune de résidence. La mairie leur indique l'école de rattachement en fonction du lieu d'habitation.",
    choicesFr: [
      { id: 'a' as const, text: 'La mairie de leur commune' },
      { id: 'b' as const, text: 'La préfecture' },
      { id: 'c' as const, text: 'Le rectorat' },
      { id: 'd' as const, text: "Le ministère de l'Éducation nationale" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q33 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "En cas de divorce, qui exerce l'autorité parentale ?",
    explanationFr:
      "En cas de divorce, les deux parents continuent d'exercer conjointement l'autorité parentale, sauf décision contraire du juge. L'intérêt de l'enfant prime dans toutes les décisions.",
    choicesFr: [
      { id: 'a' as const, text: 'Les deux parents conjointement' },
      { id: 'b' as const, text: 'Uniquement la mère' },
      { id: 'c' as const, text: 'Uniquement le père' },
      { id: 'd' as const, text: "L'État prend en charge l'enfant" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q34 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr:
      "Quelle aide permet aux personnes qui ont des difficultés financières d'avoir un avocat ?",
    explanationFr:
      "L'aide juridictionnelle permet aux personnes ayant de faibles revenus de bénéficier d'un avocat pris en charge totalement ou partiellement par l'État. Elle garantit l'accès à la justice pour tous.",
    choicesFr: [
      { id: 'a' as const, text: "L'aide juridictionnelle" },
      { id: 'b' as const, text: 'Le RSA (Revenu de Solidarité Active)' },
      { id: 'c' as const, text: "L'allocation logement" },
      { id: 'd' as const, text: 'La CMU (Couverture Maladie Universelle)' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q35 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Où faut-il déclarer la naissance d'un enfant ?",
    explanationFr:
      "La naissance d'un enfant doit être déclarée à la mairie du lieu de naissance, dans les 5 jours suivant l'accouchement. L'officier d'état civil établit alors l'acte de naissance.",
    choicesFr: [
      { id: 'a' as const, text: 'À la mairie du lieu de naissance' },
      { id: 'b' as const, text: 'À la préfecture du département' },
      { id: 'c' as const, text: 'Au commissariat de police' },
      { id: 'd' as const, text: 'Au tribunal judiciaire' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q36 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr:
      "Quelle est l'une des conditions pour passer l'examen du permis de conduire ?",
    explanationFr:
      "Pour passer l'examen du permis de conduire en France, il faut avoir au moins 17 ans (ou 15 ans pour la conduite accompagnée). Il faut également avoir obtenu le code de la route.",
    choicesFr: [
      { id: 'a' as const, text: 'Avoir au moins 17 ans' },
      { id: 'b' as const, text: 'Avoir au moins 21 ans' },
      { id: 'c' as const, text: 'Être de nationalité française' },
      { id: 'd' as const, text: 'Posséder son propre véhicule' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q37 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Un bail locatif est valide s'il est :",
    explanationFr:
      "Un bail locatif (contrat de location) est valide s'il est signé par le propriétaire et le locataire. Il doit être écrit et comporter certaines mentions obligatoires comme la description du logement, le montant du loyer et la durée.",
    choicesFr: [
      { id: 'a' as const, text: 'Signé par le propriétaire et le locataire' },
      { id: 'b' as const, text: 'Validé par la mairie' },
      { id: 'c' as const, text: 'Enregistré au tribunal' },
      { id: 'd' as const, text: 'Approuvé par un notaire obligatoirement' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q38 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'situational' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Où peut-on déposer un lave-vaisselle cassé ?",
    explanationFr:
      "Un lave-vaisselle cassé est un déchet d'équipement électrique et électronique (DEEE). Il peut être déposé en déchetterie ou repris gratuitement par le magasin lors de l'achat d'un nouvel appareil équivalent.",
    choicesFr: [
      { id: 'a' as const, text: 'À la déchetterie ou le faire reprendre par un magasin' },
      { id: 'b' as const, text: 'Sur le trottoir devant chez soi' },
      { id: 'c' as const, text: 'Dans la poubelle des ordures ménagères' },
      { id: 'd' as const, text: 'Dans un conteneur de recyclage du verre' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q39 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Quel numéro d'urgence permet d'appeler la police ?",
    explanationFr:
      "Le 17 est le numéro d'urgence pour joindre la police ou la gendarmerie. Il permet de signaler une situation d'urgence nécessitant l'intervention des forces de l'ordre.",
    choicesFr: [
      { id: 'a' as const, text: 'Le 17' },
      { id: 'b' as const, text: 'Le 15' },
      { id: 'c' as const, text: 'Le 18' },
      { id: 'd' as const, text: 'Le 119' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q40 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "À qui est accessible la contraception ?",
    explanationFr:
      "La contraception est accessible à toute personne, y compris les mineurs. Les mineures peuvent obtenir une contraception gratuitement et de manière confidentielle, sans autorisation parentale.",
    choicesFr: [
      { id: 'a' as const, text: 'À toute personne, y compris les mineurs' },
      { id: 'b' as const, text: 'Uniquement aux personnes majeures' },
      { id: 'c' as const, text: 'Uniquement aux femmes mariées' },
      { id: 'd' as const, text: "Uniquement sur ordonnance d'un spécialiste" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q41 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr:
      "Qu'est-ce que le principe de confidentialité dans le domaine de la santé ?",
    explanationFr:
      "Le principe de confidentialité (secret médical) signifie que le médecin ne peut pas divulguer les informations sur la santé de son patient à des tiers sans son accord. C'est un droit fondamental du patient.",
    choicesFr: [
      { id: 'a' as const, text: 'Le médecin ne peut pas révéler les informations médicales du patient sans son accord' },
      { id: 'b' as const, text: 'Le patient ne peut pas connaître son propre diagnostic' },
      { id: 'c' as const, text: 'Les résultats médicaux sont publiés pour la recherche' },
      { id: 'd' as const, text: "L'employeur a accès au dossier médical du salarié" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q42 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "L'inscription à l'Assurance maladie est :",
    explanationFr:
      "L'inscription à l'Assurance maladie est obligatoire. Toute personne qui travaille ou réside en France de manière stable et régulière a droit à la prise en charge de ses frais de santé.",
    choicesFr: [
      { id: 'a' as const, text: 'Obligatoire' },
      { id: 'b' as const, text: 'Facultative' },
      { id: 'c' as const, text: 'Réservée aux salariés' },
      { id: 'd' as const, text: 'Payante et optionnelle' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q43 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Qui peut demander un congé parental d'éducation ?",
    explanationFr:
      "Le congé parental d'éducation peut être demandé par le père ou la mère, sans distinction. Il permet de cesser ou réduire son activité professionnelle pour s'occuper de son enfant.",
    choicesFr: [
      { id: 'a' as const, text: 'Le père ou la mère' },
      { id: 'b' as const, text: 'Uniquement la mère' },
      { id: 'c' as const, text: 'Uniquement le père' },
      { id: 'd' as const, text: "Aucun des deux, c'est automatique" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q44 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Quelles sont les affaires traitées par le conseil de prud'hommes ?",
    explanationFr:
      "Le conseil de prud'hommes traite les litiges entre salariés et employeurs liés au contrat de travail : licenciement abusif, non-paiement de salaire, harcèlement au travail, etc.",
    choicesFr: [
      { id: 'a' as const, text: 'Les litiges entre salariés et employeurs liés au contrat de travail' },
      { id: 'b' as const, text: 'Les affaires de divorce' },
      { id: 'c' as const, text: 'Les infractions pénales' },
      { id: 'd' as const, text: 'Les litiges entre voisins' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q45 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr:
      "Lorsqu'un employeur veut qu'un salarié travaille plus longtemps que la durée prévue dans le contrat de travail :",
    explanationFr:
      "Les heures supplémentaires doivent être rémunérées avec une majoration de salaire ou compensées par un repos. L'employeur ne peut pas imposer des heures supplémentaires sans respecter les règles légales.",
    choicesFr: [
      { id: 'a' as const, text: 'Il doit rémunérer les heures supplémentaires avec une majoration' },
      { id: 'b' as const, text: "Il peut l'exiger sans compensation" },
      { id: 'c' as const, text: 'Le salarié doit toujours refuser' },
      { id: 'd' as const, text: "C'est illégal dans tous les cas" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q46 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Quelle est la mission de France Travail ?",
    explanationFr:
      "France Travail (anciennement Pôle emploi) a pour mission d'accompagner les demandeurs d'emploi dans leur recherche de travail, d'indemniser les chômeurs et d'aider les entreprises dans leurs recrutements.",
    choicesFr: [
      { id: 'a' as const, text: "Accompagner les demandeurs d'emploi et indemniser les chômeurs" },
      { id: 'b' as const, text: 'Fixer les salaires dans les entreprises' },
      { id: 'c' as const, text: 'Contrôler les conditions de travail dans les entreprises' },
      { id: 'd' as const, text: 'Gérer les retraites des salariés' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q47 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Dans une entreprise, le droit syndical permet :",
    explanationFr:
      "Le droit syndical permet aux salariés de se regrouper pour défendre leurs intérêts professionnels. Les syndicats négocient les conditions de travail et les salaires avec l'employeur.",
    choicesFr: [
      { id: 'a' as const, text: 'Aux salariés de se regrouper pour défendre leurs intérêts professionnels' },
      { id: 'b' as const, text: "À l'employeur de licencier librement" },
      { id: 'c' as const, text: "Aux salariés de ne pas travailler quand ils le souhaitent" },
      { id: 'd' as const, text: "À l'État de contrôler l'entreprise" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q48 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Dans une entreprise, le droit de grève autorise :",
    explanationFr:
      "Le droit de grève, reconnu par la Constitution, autorise les salariés à cesser collectivement le travail pour défendre leurs revendications professionnelles. C'est un droit fondamental en France.",
    choicesFr: [
      { id: 'a' as const, text: 'Les salariés à cesser collectivement le travail pour défendre leurs revendications' },
      { id: 'b' as const, text: "L'employeur à fermer l'entreprise sans préavis" },
      { id: 'c' as const, text: "Les salariés à détruire le matériel de l'entreprise" },
      { id: 'd' as const, text: 'Les salariés à ne plus jamais revenir travailler' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q49 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Quelles sont les conditions pour toucher les allocations chômage ?",
    explanationFr:
      "Pour toucher les allocations chômage, il faut avoir travaillé suffisamment longtemps (au moins 6 mois sur les 24 derniers mois), être inscrit à France Travail et rechercher activement un emploi.",
    choicesFr: [
      { id: 'a' as const, text: "Avoir suffisamment travaillé, être inscrit à France Travail et chercher activement un emploi" },
      { id: 'b' as const, text: "Il suffit de ne pas avoir d'emploi" },
      { id: 'c' as const, text: 'Avoir la nationalité française' },
      { id: 'd' as const, text: 'Avoir plus de 25 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q50 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Qu'est-ce que l'école maternelle ?",
    explanationFr:
      "L'école maternelle accueille les enfants de 3 à 6 ans. Elle constitue la première étape de la scolarité et prépare les enfants aux apprentissages fondamentaux de l'école élémentaire.",
    choicesFr: [
      { id: 'a' as const, text: "L'école qui accueille les enfants de 3 à 6 ans" },
      { id: 'b' as const, text: 'Une école réservée aux filles' },
      { id: 'c' as const, text: 'Un établissement pour les enfants de 6 à 11 ans' },
      { id: 'd' as const, text: "Une crèche gérée par l'État" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q51 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr:
      "Comment s'appelle le diplôme passé par les élèves à la fin du collège ?",
    explanationFr:
      "Le diplôme national du brevet (DNB), communément appelé brevet des collèges, est passé à la fin de la classe de 3e. Il évalue les connaissances acquises au cours de la scolarité au collège.",
    choicesFr: [
      { id: 'a' as const, text: 'Le diplôme national du brevet (brevet des collèges)' },
      { id: 'b' as const, text: 'Le baccalauréat' },
      { id: 'c' as const, text: "Le certificat d'études primaires" },
      { id: 'd' as const, text: 'Le CAP' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q52 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Les parents d'élève ont le droit de :",
    explanationFr:
      "Les parents d'élève ont le droit de participer à la vie de l'école, notamment en élisant des représentants de parents d'élèves et en participant aux conseils d'école ou de classe.",
    choicesFr: [
      { id: 'a' as const, text: "Participer à la vie de l'école et élire des représentants de parents" },
      { id: 'b' as const, text: 'Choisir les enseignants de leur enfant' },
      { id: 'c' as const, text: 'Modifier le programme scolaire' },
      { id: 'd' as const, text: 'Décider des horaires de cours' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q53 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Qui peut manger à la cantine scolaire ?",
    explanationFr:
      "Tous les élèves inscrits dans l'établissement peuvent manger à la cantine scolaire. L'accès à la restauration scolaire est un droit pour tous les enfants scolarisés, sans discrimination.",
    choicesFr: [
      { id: 'a' as const, text: "Tous les élèves inscrits dans l'établissement" },
      { id: 'b' as const, text: 'Uniquement les élèves dont les parents travaillent' },
      { id: 'c' as const, text: "Uniquement les élèves qui habitent loin de l'école" },
      { id: 'd' as const, text: 'Uniquement les élèves boursiers' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q54 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "À quel âge commence l'instruction obligatoire des enfants ?",
    explanationFr:
      "Depuis la loi du 26 juillet 2019, l'instruction est obligatoire dès l'âge de 3 ans en France. Cela correspond à l'entrée en école maternelle.",
    choicesFr: [
      { id: 'a' as const, text: '3 ans' },
      { id: 'b' as const, text: '5 ans' },
      { id: 'c' as const, text: '6 ans' },
      { id: 'd' as const, text: '4 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q55 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Quel est l'âge de la majorité ?",
    explanationFr:
      "L'âge de la majorité en France est 18 ans. À cet âge, une personne acquiert la pleine capacité juridique : elle peut voter, signer des contrats, se marier sans autorisation parentale, etc.",
    choicesFr: [
      { id: 'a' as const, text: '18 ans' },
      { id: 'b' as const, text: '16 ans' },
      { id: 'c' as const, text: '21 ans' },
      { id: 'd' as const, text: '17 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q56 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "À l'école, il est interdit aux parents de :",
    explanationFr:
      "À l'école, les parents ne peuvent pas s'opposer à l'enseignement de certaines matières obligatoires du programme scolaire. Le contenu pédagogique est défini par l'Éducation nationale et s'impose à tous.",
    choicesFr: [
      { id: 'a' as const, text: "S'opposer à l'enseignement de certaines matières obligatoires" },
      { id: 'b' as const, text: 'Participer aux réunions parents-professeurs' },
      { id: 'c' as const, text: 'Consulter le cahier de textes de leur enfant' },
      { id: 'd' as const, text: 'Rencontrer les enseignants de leur enfant' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q57 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "Quel motif d'absence est accepté par l'école ?",
    explanationFr:
      "La maladie de l'enfant (avec certificat médical) est un motif d'absence légitime accepté par l'école. Les autres motifs acceptés incluent les obligations familiales impérieuses ou les fêtes religieuses.",
    choicesFr: [
      { id: 'a' as const, text: "La maladie de l'enfant" },
      { id: 'b' as const, text: 'Un voyage de vacances en famille' },
      { id: 'c' as const, text: 'Les soldes dans les magasins' },
      { id: 'd' as const, text: "La fatigue de l'enfant" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q58 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr:
      "Des parents ne respectent pas l'obligation d'instruction pour leurs enfants. Quelle sanction maximale risquent-ils ?",
    explanationFr:
      "Les parents qui ne respectent pas l'obligation d'instruction de leurs enfants risquent jusqu'à 2 ans d'emprisonnement et 30 000 euros d'amende. L'instruction est une obligation légale en France.",
    choicesFr: [
      { id: 'a' as const, text: "2 ans d'emprisonnement et 30 000 euros d'amende" },
      { id: 'b' as const, text: 'Un simple avertissement de la mairie' },
      { id: 'c' as const, text: 'Une amende de 150 euros' },
      { id: 'd' as const, text: "Aucune sanction n'est prévue" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q59 ── CR only ────────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr'] as const,
    textFr: "Quand ont lieu les vacances scolaires de Noël ?",
    explanationFr:
      "Les vacances scolaires de Noël ont lieu en décembre-janvier, généralement pendant deux semaines autour du 25 décembre et du 1er janvier. Elles sont communes à toutes les zones scolaires.",
    choicesFr: [
      { id: 'a' as const, text: 'En décembre-janvier, pendant environ deux semaines' },
      { id: 'b' as const, text: 'En novembre, pendant une semaine' },
      { id: 'c' as const, text: 'En février, pendant deux semaines' },
      { id: 'd' as const, text: 'En octobre, pendant une semaine' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q60 ── CR + NAT ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ['cr', 'nat'] as const,
    textFr: "À l'école, un enfant en situation de handicap :",
    explanationFr:
      "En France, un enfant en situation de handicap a le droit d'être inscrit dans l'école la plus proche de son domicile. L'école inclusive est un principe fondamental : chaque enfant a droit à une scolarisation adaptée.",
    choicesFr: [
      { id: 'a' as const, text: "A le droit d'être inscrit dans l'école la plus proche de son domicile" },
      { id: 'b' as const, text: 'Doit obligatoirement aller dans un établissement spécialisé' },
      { id: 'c' as const, text: 'Ne peut pas être scolarisé' },
      { id: 'd' as const, text: 'Doit rester à la maison avec un enseignant privé' },
    ],
    correctChoice: 'a' as const,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NAT-ONLY QUESTIONS (difficulty 3)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Q61 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'situational' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Quelle action peut réaliser le locataire d'un logement sans l'autorisation du propriétaire ?",
    explanationFr:
      "Le locataire peut réaliser des petits aménagements (décoration, peinture, petits travaux) sans demander l'autorisation du propriétaire, à condition de ne pas transformer le logement de manière structurelle.",
    choicesFr: [
      { id: 'a' as const, text: 'Faire de petits aménagements comme peindre les murs ou poser des étagères' },
      { id: 'b' as const, text: 'Abattre une cloison' },
      { id: 'c' as const, text: 'Sous-louer le logement à une autre personne' },
      { id: 'd' as const, text: "Changer les fenêtres et la porte d'entrée" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q62 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Le stationnement sur une place réservée aux personnes handicapées :",
    explanationFr:
      "Le stationnement sur une place réservée aux personnes handicapées est interdit sans la carte mobilité inclusion (CMI). Les contrevenants s'exposent à une amende de 135 euros et à la mise en fourrière de leur véhicule.",
    choicesFr: [
      { id: 'a' as const, text: "Est interdit sans carte mobilité inclusion et passible d'une amende" },
      { id: 'b' as const, text: 'Est autorisé pour tout le monde le dimanche' },
      { id: 'c' as const, text: "Est autorisé si c'est pour une courte durée" },
      { id: 'd' as const, text: "N'est pas réglementé par la loi" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q63 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'situational' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Si une machine à laver est cassée, il est possible de :",
    explanationFr:
      "Un appareil électroménager cassé peut être déposé en déchetterie ou repris par le magasin lors de l'achat d'un nouvel appareil (obligation de reprise 1 pour 1). Il ne faut pas le jeter avec les ordures ménagères.",
    choicesFr: [
      { id: 'a' as const, text: 'La déposer en déchetterie ou la faire reprendre par un magasin' },
      { id: 'b' as const, text: 'La jeter dans la poubelle des ordures ménagères' },
      { id: 'c' as const, text: 'La laisser sur le trottoir' },
      { id: 'd' as const, text: 'La jeter dans un conteneur de recyclage' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q64 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Dans quel cas faut-il déclarer son enfant au service d'état civil ?",
    explanationFr:
      "Il faut déclarer son enfant au service d'état civil de la mairie à chaque naissance. Cette déclaration est obligatoire dans les 5 jours suivant la naissance et permet d'établir l'acte de naissance.",
    choicesFr: [
      { id: 'a' as const, text: "À chaque naissance d'un enfant" },
      { id: 'b' as const, text: 'Uniquement pour le premier enfant' },
      { id: 'c' as const, text: "Quand l'enfant entre à l'école" },
      { id: 'd' as const, text: "Quand l'enfant atteint l'âge de 18 ans" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q65 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Qui peut demander le divorce de personnes mariées ?",
    explanationFr:
      "Le divorce peut être demandé par l'un des époux ou par les deux époux ensemble (divorce par consentement mutuel). La demande de divorce est un droit reconnu à chacun des conjoints.",
    choicesFr: [
      { id: 'a' as const, text: "L'un des époux ou les deux ensemble" },
      { id: 'b' as const, text: 'Uniquement le mari' },
      { id: 'c' as const, text: 'Uniquement la famille des époux' },
      { id: 'd' as const, text: 'Le maire de la commune' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q66 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "La contraception :",
    explanationFr:
      "La contraception est un droit en France. Elle est accessible à tous, y compris aux mineurs, et peut être obtenue gratuitement pour les moins de 26 ans. Le choix de la contraception est libre.",
    choicesFr: [
      { id: 'a' as const, text: 'Est un droit accessible à tous, y compris aux mineurs' },
      { id: 'b' as const, text: 'Est interdite en France' },
      { id: 'c' as const, text: "Nécessite l'autorisation du conjoint" },
      { id: 'd' as const, text: 'Est réservée aux personnes mariées' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q67 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Qu'est-ce que le tiers payant ?",
    explanationFr:
      "Le tiers payant est un système qui dispense le patient d'avancer les frais de santé. Le professionnel de santé est directement payé par l'Assurance maladie et/ou la mutuelle.",
    choicesFr: [
      { id: 'a' as const, text: "Un système qui dispense le patient d'avancer les frais de santé" },
      { id: 'b' as const, text: 'Une taxe sur les médicaments' },
      { id: 'c' as const, text: "Un supplément à payer lors d'une consultation" },
      { id: 'd' as const, text: 'Une assurance obligatoire pour les médecins' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q68 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "L'avortement est-il possible en France ?",
    explanationFr:
      "Oui, l'avortement (IVG - Interruption Volontaire de Grossesse) est légal en France. Depuis 2022, il peut être pratiqué jusqu'à 14 semaines de grossesse. C'est un droit constitutionnel depuis 2024.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, c'est un droit garanti par la loi" },
      { id: 'b' as const, text: 'Non, il est totalement interdit' },
      { id: 'c' as const, text: 'Uniquement en cas de danger pour la mère' },
      { id: 'd' as const, text: "Seulement avec l'accord du conjoint" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q69 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Quels sont les textes qui définissent les règles au travail ?",
    explanationFr:
      "Les règles au travail sont définies par le Code du travail, les conventions collectives et le contrat de travail. Le Code du travail fixe le cadre légal minimum que tout employeur doit respecter.",
    choicesFr: [
      { id: 'a' as const, text: 'Le Code du travail, les conventions collectives et le contrat de travail' },
      { id: 'b' as const, text: "Uniquement le règlement intérieur de l'entreprise" },
      { id: 'c' as const, text: 'Les décisions du maire de la commune' },
      { id: 'd' as const, text: 'Les accords verbaux entre collègues' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q70 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Qui a le droit de se syndiquer ?",
    explanationFr:
      "Tout salarié a le droit de se syndiquer, quelle que soit sa nationalité. La liberté syndicale est un droit fondamental reconnu par la Constitution française et les conventions internationales.",
    choicesFr: [
      { id: 'a' as const, text: 'Tout salarié, quelle que soit sa nationalité' },
      { id: 'b' as const, text: 'Uniquement les salariés français' },
      { id: 'c' as const, text: 'Uniquement les cadres' },
      { id: 'd' as const, text: 'Uniquement les fonctionnaires' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q71 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Est-il possible de licencier une femme enceinte ou en congé maternité, en raison de sa grossesse ?",
    explanationFr:
      "Non, il est interdit de licencier une femme en raison de sa grossesse ou pendant son congé maternité. La loi protège les femmes enceintes contre toute discrimination liée à la maternité.",
    choicesFr: [
      { id: 'a' as const, text: "Non, c'est interdit par la loi" },
      { id: 'b' as const, text: "Oui, l'employeur est libre de licencier qui il veut" },
      { id: 'c' as const, text: 'Oui, mais avec un préavis de 3 mois' },
      { id: 'd' as const, text: "Oui, si l'entreprise a des difficultés économiques" },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q72 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "L'instruction des enfants est obligatoire de :",
    explanationFr:
      "L'instruction des enfants est obligatoire de 3 ans à 16 ans en France. Cette obligation s'applique à tous les enfants résidant sur le territoire français, quelle que soit leur nationalité.",
    choicesFr: [
      { id: 'a' as const, text: '3 ans à 16 ans' },
      { id: 'b' as const, text: '6 ans à 16 ans' },
      { id: 'c' as const, text: '3 ans à 18 ans' },
      { id: 'd' as const, text: '5 ans à 14 ans' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q73 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Quelle est la définition de l'autorité parentale ?",
    explanationFr:
      "L'autorité parentale est l'ensemble des droits et devoirs des parents envers leur enfant mineur. Elle a pour finalité l'intérêt de l'enfant : sa protection, sa santé, sa sécurité, son éducation et son développement.",
    choicesFr: [
      { id: 'a' as const, text: "L'ensemble des droits et devoirs des parents pour protéger et éduquer leur enfant" },
      { id: 'b' as const, text: 'Le droit des parents de punir librement leur enfant' },
      { id: 'c' as const, text: "Le pouvoir de l'État sur les familles" },
      { id: 'd' as const, text: 'Le droit des grands-parents sur leurs petits-enfants' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q74 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "En tant que parent d'élève, il est possible de :",
    explanationFr:
      "En tant que parent d'élève, il est possible de participer aux instances de l'école (conseil d'école, conseil de classe) et d'être élu représentant des parents d'élèves pour faire entendre sa voix.",
    choicesFr: [
      { id: 'a' as const, text: "Participer aux instances de l'école et être élu représentant des parents" },
      { id: 'b' as const, text: 'Choisir les matières enseignées à son enfant' },
      { id: 'c' as const, text: 'Décider du passage en classe supérieure de son enfant' },
      { id: 'd' as const, text: 'Remplacer un enseignant absent' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q75 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Quelle instruction est prévue pour les enfants qui ne parlent pas français ?",
    explanationFr:
      "Les enfants allophones (qui ne parlent pas français) bénéficient d'un enseignement spécifique du français dans des unités pédagogiques (UPE2A) tout en étant inscrits dans une classe ordinaire correspondant à leur âge.",
    choicesFr: [
      { id: 'a' as const, text: "Un enseignement spécifique du français (UPE2A) en parallèle d'une classe ordinaire" },
      { id: 'b' as const, text: 'Aucune, ils doivent apprendre seuls' },
      { id: 'c' as const, text: "Ils sont renvoyés dans leur pays d'origine" },
      { id: 'd' as const, text: 'Ils sont placés dans des écoles spécialisées séparées' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q76 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "S'agissant de l'accueil des enfants en situation de handicap à l'école, laquelle des propositions est vraie ?",
    explanationFr:
      "L'école inclusive est un droit en France. Tout enfant en situation de handicap peut être scolarisé dans l'école de son quartier avec des aménagements adaptés (AESH, matériel spécialisé, etc.).",
    choicesFr: [
      { id: 'a' as const, text: "Tout enfant handicapé a le droit d'être scolarisé en milieu ordinaire avec des aménagements" },
      { id: 'b' as const, text: "Les enfants handicapés ne peuvent pas aller à l'école" },
      { id: 'c' as const, text: "Seuls les enfants avec un handicap léger peuvent aller à l'école" },
      { id: 'd' as const, text: 'Les enfants handicapés doivent aller dans un autre département' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q77 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr:
      "Depuis le 1er juillet 2021, quelle est la durée du congé paternité ?",
    explanationFr:
      "Depuis le 1er juillet 2021, le congé paternité est de 25 jours calendaires (32 jours en cas de naissances multiples). Cette réforme a doublé la durée précédente de 11 jours.",
    choicesFr: [
      { id: 'a' as const, text: '25 jours calendaires' },
      { id: 'b' as const, text: '11 jours calendaires' },
      { id: 'c' as const, text: '14 jours calendaires' },
      { id: 'd' as const, text: '30 jours calendaires' },
    ],
    correctChoice: 'a' as const,
  },

  // ── Q78 ── NAT only ───────────────────────────────────────────────────────
  {
    themeId: 5 as const,
    type: 'knowledge' as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ['nat'] as const,
    textFr: "Est-ce possible de punir physiquement ses enfants ?",
    explanationFr:
      "Non, les violences physiques envers les enfants sont interdites en France. Depuis la loi du 10 juillet 2019, toute violence éducative ordinaire (fessée, gifle, etc.) est prohibée. L'autorité parentale s'exerce sans violence.",
    choicesFr: [
      { id: 'a' as const, text: 'Non, toute violence physique envers les enfants est interdite' },
      { id: 'b' as const, text: "Oui, si c'est pour des raisons éducatives" },
      { id: 'c' as const, text: 'Oui, tant que cela ne laisse pas de traces' },
      { id: 'd' as const, text: "Oui, c'est un droit des parents" },
    ],
    correctChoice: 'a' as const,
  },
];
