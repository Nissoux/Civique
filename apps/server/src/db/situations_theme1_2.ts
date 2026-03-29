export const situationsTheme1 = [
  // ═══════════════════════════════════════════════════════════
  //  LAÏCITÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S1: Port de signes religieux à l'école publique
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Vous êtes parent d'élève. Votre fille de 14 ans souhaite porter un voile islamique au collège public. Le directeur vous informe que c'est interdit. Quelle est la bonne attitude ?",
    explanationFr:
      "La loi du 15 mars 2004 interdit le port de signes religieux ostensibles dans les écoles, collèges et lycées publics. Cette loi s'applique à tous les élèves et à toutes les religions.",
    choicesFr: [
      { id: 'a' as const, text: "Vous acceptez la règle car la loi interdit les signes religieux ostensibles à l'école publique" },
      { id: 'b' as const, text: "Vous portez plainte contre le directeur pour discrimination religieuse" },
      { id: 'c' as const, text: "Vous inscrivez votre fille dans un autre collège public où ce sera autorisé" },
      { id: 'd' as const, text: "Vous demandez une dérogation au rectorat pour motif religieux" },
    ],
    correctChoice: 'a' as const,
  },

  // ── S2: Prière sur le lieu de travail (service public)
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Au travail, vous êtes agent d'accueil dans une mairie. Un collègue vous demande de le remplacer pendant 15 minutes pour qu'il puisse faire sa prière dans un bureau vide. Que faites-vous ?",
    explanationFr:
      "Les agents du service public sont soumis à une obligation de neutralité religieuse. La pratique religieuse ne peut pas s'exercer pendant le temps de service. Votre collègue doit attendre sa pause personnelle.",
    choicesFr: [
      { id: 'a' as const, text: "Vous acceptez par solidarité entre collègues, c'est normal" },
      { id: 'b' as const, text: "Vous refusez car cela perturbe le service, mais vous lui rappelez qu'il peut prier pendant sa pause" },
      { id: 'c' as const, text: "Vous acceptez à condition qu'il fasse vite" },
      { id: 'd' as const, text: "Vous signalez immédiatement votre collègue à la police" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S3: Refus de soin par un patient
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous accompagnez votre mère aux urgences d'un hôpital public. Elle refuse d'être examinée par un médecin homme pour des raisons religieuses. Que devez-vous comprendre ?",
    explanationFr:
      "Dans un service public hospitalier, le patient ne peut pas exiger un médecin d'un sexe particulier pour des motifs religieux. L'hôpital s'organise selon ses moyens et l'urgence médicale prime sur les convictions personnelles.",
    choicesFr: [
      { id: 'a' as const, text: "L'hôpital doit obligatoirement fournir un médecin femme si la patiente le demande" },
      { id: 'b' as const, text: "Votre mère a le droit absolu de refuser tout soin" },
      { id: 'c' as const, text: "L'hôpital n'est pas tenu d'accéder à cette demande ; le soin prime sur les convictions personnelles" },
      { id: 'd' as const, text: "Vous pouvez porter plainte contre l'hôpital pour non-respect de la liberté religieuse" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S4: Menu de la cantine scolaire
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "À la cantine de l'école publique de votre enfant, vous demandez qu'un menu halal soit systématiquement proposé. Le directeur refuse. A-t-il le droit ?",
    explanationFr:
      "La cantine scolaire publique n'a aucune obligation légale de proposer des menus confessionnels. Le principe de laïcité implique que le service public ne s'adapte pas aux prescriptions religieuses, même si certaines communes proposent des menus de substitution par choix.",
    choicesFr: [
      { id: 'a' as const, text: "Non, c'est une discrimination envers votre religion" },
      { id: 'b' as const, text: "Non, l'école doit respecter toutes les religions en proposant tous les menus" },
      { id: 'c' as const, text: "Oui, mais uniquement si l'école propose déjà un menu végétarien" },
      { id: 'd' as const, text: "Oui, la cantine publique n'a pas l'obligation de proposer des menus confessionnels" },
    ],
    correctChoice: 'd' as const,
  },

  // ── S5: Crèche de Noël dans une mairie
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous êtes employé municipal. Le maire souhaite installer une crèche de Noël dans le hall de la mairie. Un administré proteste. Que dit la loi ?",
    explanationFr:
      "Selon la jurisprudence du Conseil d'État (2016), une crèche de Noël peut être installée dans un bâtiment public à condition qu'elle présente un caractère culturel, artistique ou festif, et non un acte de prosélytisme religieux. Le contexte local est déterminant.",
    choicesFr: [
      { id: 'a' as const, text: "C'est toujours interdit car cela viole la laïcité" },
      { id: 'b' as const, text: "C'est toujours autorisé car Noël fait partie de la culture française" },
      { id: 'c' as const, text: "C'est possible si la crèche a un caractère culturel ou festif et ne constitue pas un acte de prosélytisme" },
      { id: 'd' as const, text: "C'est autorisé uniquement si toutes les religions sont également représentées" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S6: Accompagnatrice scolaire voilée
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous êtes mère d'élève et vous portez le voile. Vous souhaitez accompagner la classe de votre fils lors d'une sortie scolaire. L'école peut-elle vous refuser ?",
    explanationFr:
      "Les parents accompagnateurs de sorties scolaires ne sont pas des agents du service public. Le Conseil d'État a précisé que le port du voile par une accompagnatrice n'est pas en soi un motif de refus, sauf si cela perturbe l'ordre public ou le bon déroulement de l'activité.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, la loi de 2004 interdit tout signe religieux dans le cadre scolaire, y compris pour les parents" },
      { id: 'b' as const, text: "Non, car en tant que parent accompagnateur, vous n'êtes pas soumise à l'obligation de neutralité des agents publics" },
      { id: 'c' as const, text: "Oui, car vous représentez l'école pendant la sortie" },
      { id: 'd' as const, text: "Non, car la liberté religieuse est absolue et sans aucune limite en France" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S7: Fonctionnaire et signe religieux
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Vous venez d'être recruté comme fonctionnaire dans un service des impôts. Vous portez habituellement une grande croix autour du cou. Votre supérieur vous demande de la retirer pendant le service. A-t-il raison ?",
    explanationFr:
      "Les agents du service public sont tenus à une stricte neutralité religieuse. Ils ne doivent porter aucun signe religieux ostensible pendant l'exercice de leurs fonctions, quelle que soit leur religion.",
    choicesFr: [
      { id: 'a' as const, text: "Non, c'est une atteinte à votre liberté religieuse" },
      { id: 'b' as const, text: "Oui, mais uniquement si des usagers se plaignent" },
      { id: 'c' as const, text: "Non, car la croix est un symbole culturel et non religieux" },
      { id: 'd' as const, text: "Oui, les agents publics doivent respecter le principe de neutralité religieuse" },
    ],
    correctChoice: 'd' as const,
  },

  // ── S8: Demande d'horaires aménagés pour fête religieuse
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous travaillez dans une entreprise privée. Vous souhaitez prendre un jour de congé pour une fête religieuse qui n'est pas un jour férié officiel. Votre employeur refuse. Est-ce légal ?",
    explanationFr:
      "Dans le secteur privé, l'employeur peut autoriser une absence pour motif religieux, mais n'y est pas obligé sauf si la convention collective le prévoit. Le refus n'est pas discriminatoire s'il est fondé sur les nécessités du service.",
    choicesFr: [
      { id: 'a' as const, text: "Non, c'est une discrimination religieuse interdite par la loi" },
      { id: 'b' as const, text: "Oui, l'employeur peut refuser si c'est justifié par les nécessités du service" },
      { id: 'c' as const, text: "Non, l'employeur doit obligatoirement accepter toutes les fêtes religieuses" },
      { id: 'd' as const, text: "Oui, mais uniquement si l'entreprise est une institution publique" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S9: Salle de prière en entreprise
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Plusieurs salariés de votre entreprise demandent à la direction d'aménager une salle de prière dans les locaux. La direction refuse. Les salariés estiment que c'est discriminatoire. Qui a raison ?",
    explanationFr:
      "L'employeur privé n'a aucune obligation d'aménager un lieu de culte dans l'entreprise. Il peut le faire s'il le souhaite, mais son refus ne constitue pas une discrimination. La liberté religieuse du salarié s'exerce en dehors du temps de travail.",
    choicesFr: [
      { id: 'a' as const, text: "Les salariés, car l'employeur doit respecter la liberté religieuse" },
      { id: 'b' as const, text: "La direction, car rien n'oblige un employeur à fournir un lieu de culte" },
      { id: 'c' as const, text: "Les salariés, s'ils sont suffisamment nombreux à le demander" },
      { id: 'd' as const, text: "La direction, mais elle doit proposer une alternative à l'extérieur" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S10: Enseignement et laïcité
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Votre enfant revient de l'école et vous dit que son professeur a expliqué en classe l'histoire des grandes religions. Vous estimez que cela viole la laïcité. Avez-vous raison ?",
    explanationFr:
      "La laïcité n'interdit pas l'enseignement du fait religieux à l'école. Enseigner l'histoire des religions dans une démarche de connaissance et de culture est parfaitement compatible avec le principe de laïcité. Ce qui est interdit, c'est le prosélytisme.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, l'école publique ne doit jamais parler de religion" },
      { id: 'b' as const, text: "Oui, sauf si le professeur parle de toutes les religions de manière égale" },
      { id: 'c' as const, text: "Non, enseigner l'histoire des religions est une démarche de connaissance, pas du prosélytisme" },
      { id: 'd' as const, text: "Oui, seuls les parents peuvent évoquer les religions avec leurs enfants" },
    ],
    correctChoice: 'c' as const,
  },

  // ═══════════════════════════════════════════════════════════
  //  ÉGALITÉ & FRATERNITÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S11: Discrimination à l'embauche
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Vous postulez à un emploi de serveur. Lors de l'entretien, le recruteur vous dit : « Nous ne recrutons pas de personnes d'origine étrangère dans notre établissement. » Que pouvez-vous faire ?",
    explanationFr:
      "Il s'agit d'une discrimination à l'embauche fondée sur l'origine, interdite par le Code du travail et le Code pénal. Vous pouvez saisir le Défenseur des droits ou porter plainte.",
    choicesFr: [
      { id: 'a' as const, text: "Rien, c'est le droit de l'employeur de choisir ses salariés librement" },
      { id: 'b' as const, text: "Vous pouvez saisir le Défenseur des droits ou porter plainte car c'est une discrimination interdite" },
      { id: 'c' as const, text: "Vous pouvez uniquement écrire un avis négatif sur Internet" },
      { id: 'd' as const, text: "Vous devez d'abord obtenir la nationalité française pour pouvoir agir" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S12: Refus de location pour motif familial
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous cherchez un appartement. Un propriétaire refuse de vous louer son bien en apprenant que vous êtes une mère célibataire avec trois enfants. Est-ce légal ?",
    explanationFr:
      "Refuser une location en raison de la situation familiale constitue une discrimination interdite par la loi. La situation familiale fait partie des critères de discrimination proscrits par le Code pénal (article 225-1).",
    choicesFr: [
      { id: 'a' as const, text: "Oui, le propriétaire est libre de choisir son locataire selon ses critères" },
      { id: 'b' as const, text: "Oui, car il a le droit de protéger son bien" },
      { id: 'c' as const, text: "Non, c'est une discrimination fondée sur la situation familiale, interdite par la loi" },
      { id: 'd' as const, text: "Non, mais uniquement si vous avez la nationalité française" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S13: Solidarité de voisinage
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Votre voisine âgée est isolée et a du mal à faire ses courses, surtout en hiver. Quelle attitude illustre le mieux la valeur de fraternité républicaine ?",
    explanationFr:
      "La fraternité, inscrite dans la devise de la République, implique la solidarité entre citoyens. Proposer son aide à une personne vulnérable est un acte concret de fraternité.",
    choicesFr: [
      { id: 'a' as const, text: "Vous ne faites rien car ce n'est pas votre responsabilité" },
      { id: 'b' as const, text: "Vous lui proposez de l'accompagner ou de faire ses courses de temps en temps" },
      { id: 'c' as const, text: "Vous appelez les services sociaux pour qu'ils s'en occupent à votre place" },
      { id: 'd' as const, text: "Vous lui conseillez de déménager dans une maison de retraite" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S14: Égalité femmes-hommes au travail
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Au travail, vous découvrez qu'une collègue femme occupant le même poste que vous, avec la même ancienneté et les mêmes qualifications, gagne 15 % de moins que vous. Que dit la loi ?",
    explanationFr:
      "Le principe « à travail égal, salaire égal » est inscrit dans le Code du travail. L'écart de rémunération entre femmes et hommes pour un même poste et des qualifications équivalentes est illégal.",
    choicesFr: [
      { id: 'a' as const, text: "C'est normal, l'employeur est libre de fixer les salaires comme il veut" },
      { id: 'b' as const, text: "C'est illégal uniquement si l'écart dépasse 20 %" },
      { id: 'c' as const, text: "La loi impose l'égalité de rémunération pour un même travail, cet écart est illégal" },
      { id: 'd' as const, text: "C'est légal si l'employeur peut prouver que l'homme est plus productif" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S15: Accès aux droits pour un étranger en situation régulière
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Votre ami, étranger en situation régulière en France, se voit refuser l'inscription de son enfant à l'école publique par le directeur qui dit « qu'il faut être français ». Que devez-vous savoir ?",
    explanationFr:
      "L'instruction est obligatoire pour tous les enfants résidant en France, quelle que soit leur nationalité ou celle de leurs parents. Le refus d'inscription est illégal.",
    choicesFr: [
      { id: 'a' as const, text: "Le directeur a raison, l'école publique est réservée aux enfants français" },
      { id: 'b' as const, text: "Le directeur a tort, tout enfant résidant en France a droit à l'instruction, quelle que soit sa nationalité" },
      { id: 'c' as const, text: "Le directeur a raison, mais l'enfant peut aller dans une école privée" },
      { id: 'd' as const, text: "L'enfant doit d'abord obtenir un titre de séjour personnel" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S16: Handicap et accessibilité
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous êtes en fauteuil roulant. Un restaurant refuse de vous accueillir en prétextant qu'il n'a pas de rampe d'accès et que « ce serait compliqué ». Que dit la loi ?",
    explanationFr:
      "La loi du 11 février 2005 impose l'accessibilité des établissements recevant du public. Refuser l'accès à une personne handicapée constitue une discrimination punie par la loi.",
    choicesFr: [
      { id: 'a' as const, text: "Le restaurateur est dans son droit, il n'a pas l'obligation de s'adapter" },
      { id: 'b' as const, text: "Le restaurateur commet une discrimination ; la loi impose l'accessibilité des lieux recevant du public" },
      { id: 'c' as const, text: "Le restaurateur est dans son droit si le bâtiment est ancien" },
      { id: 'd' as const, text: "Vous ne pouvez rien faire car il n'existe aucune loi sur l'accessibilité" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S17: Discrimination liée à l'orientation sexuelle
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Votre collègue est licencié après que son employeur a appris son homosexualité. Votre collègue peut-il contester ce licenciement ?",
    explanationFr:
      "Le licenciement fondé sur l'orientation sexuelle est une discrimination interdite par le Code du travail et le Code pénal. Ce licenciement est nul et le salarié peut saisir les prud'hommes.",
    choicesFr: [
      { id: 'a' as const, text: "Non, l'employeur peut licencier pour le motif de son choix" },
      { id: 'b' as const, text: "Oui, mais uniquement s'il a plus de deux ans d'ancienneté" },
      { id: 'c' as const, text: "Non, l'orientation sexuelle n'est pas un critère protégé par la loi" },
      { id: 'd' as const, text: "Oui, c'est un licenciement discriminatoire interdit par la loi, il peut saisir les prud'hommes" },
    ],
    correctChoice: 'd' as const,
  },

  // ── S18: Aide aux personnes en difficulté
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: true,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Dans la rue, vous voyez une personne qui fait un malaise. Des passants l'ignorent. Quelle est votre obligation légale ?",
    explanationFr:
      "En France, la non-assistance à personne en danger est un délit puni par le Code pénal (article 223-6). Tout citoyen a l'obligation de porter assistance ou au minimum d'appeler les secours.",
    choicesFr: [
      { id: 'a' as const, text: "Vous n'avez aucune obligation, c'est un choix personnel" },
      { id: 'b' as const, text: "Vous devez intervenir uniquement si vous êtes médecin" },
      { id: 'c' as const, text: "Vous avez l'obligation de porter assistance ou d'appeler les secours (15 ou 112)" },
      { id: 'd' as const, text: "Vous devez attendre que quelqu'un d'autre intervienne d'abord" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S19: Service civique et engagement citoyen
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Votre fils de 19 ans souhaite s'engager dans une mission d'intérêt général pour aider les autres. Il hésite entre plusieurs dispositifs. Quel dispositif correspond le mieux à la valeur de fraternité républicaine ?",
    explanationFr:
      "Le Service Civique permet aux jeunes de 16 à 25 ans de s'engager dans des missions d'intérêt général (solidarité, éducation, environnement). C'est une forme concrète d'engagement citoyen liée à la fraternité.",
    choicesFr: [
      { id: 'a' as const, text: "Le Service Civique, qui permet de réaliser des missions d'intérêt général" },
      { id: 'b' as const, text: "Un emploi dans une entreprise privée, car travailler c'est être solidaire" },
      { id: 'c' as const, text: "Un voyage à l'étranger pour découvrir d'autres cultures" },
      { id: 'd' as const, text: "Une inscription dans un parti politique" },
    ],
    correctChoice: 'a' as const,
  },

  // ── S20: Égalité devant la justice
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Vous êtes convoqué au tribunal mais vous n'avez pas les moyens de payer un avocat. Que prévoit la République pour garantir l'égalité devant la justice ?",
    explanationFr:
      "L'aide juridictionnelle permet aux personnes à faibles revenus de bénéficier d'une prise en charge totale ou partielle des frais de justice, y compris les honoraires d'avocat. C'est une application concrète du principe d'égalité.",
    choicesFr: [
      { id: 'a' as const, text: "Rien, il faut payer un avocat ou se défendre seul" },
      { id: 'b' as const, text: "L'aide juridictionnelle permet aux personnes à faibles revenus d'avoir un avocat gratuit" },
      { id: 'c' as const, text: "Vous pouvez demander au juge d'annuler l'affaire" },
      { id: 'd' as const, text: "Seuls les citoyens français peuvent bénéficier d'un avocat gratuit" },
    ],
    correctChoice: 'b' as const,
  },

  // ═══════════════════════════════════════════════════════════
  //  LIBERTÉ (10 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S21: Limites de la liberté d'expression
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Sur les réseaux sociaux, un internaute publie un message insultant et menaçant envers une communauté religieuse. Il se défend en invoquant la liberté d'expression. A-t-il raison ?",
    explanationFr:
      "La liberté d'expression a des limites en France. L'incitation à la haine, les menaces et les injures à caractère racial ou religieux sont des délits punis par la loi (loi du 29 juillet 1881 et Code pénal).",
    choicesFr: [
      { id: 'a' as const, text: "Oui, la liberté d'expression est absolue en France" },
      { id: 'b' as const, text: "Oui, car sur Internet on peut dire ce que l'on veut" },
      { id: 'c' as const, text: "Non, la liberté d'expression ne protège pas l'incitation à la haine ni les menaces" },
      { id: 'd' as const, text: "Non, mais uniquement si la victime porte plainte" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S22: Droit de manifester
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous souhaitez participer à une manifestation pacifique contre une réforme du gouvernement. Votre employeur menace de vous licencier si vous y allez pendant votre jour de repos. A-t-il le droit ?",
    explanationFr:
      "Le droit de manifester pacifiquement est une liberté fondamentale en France. L'employeur ne peut pas sanctionner un salarié pour sa participation à une manifestation en dehors du temps de travail.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, l'employeur peut interdire à ses salariés de manifester" },
      { id: 'b' as const, text: "Non, le droit de manifester est une liberté fondamentale et votre employeur ne peut pas vous sanctionner pour cela" },
      { id: 'c' as const, text: "Oui, si la manifestation est contre le gouvernement" },
      { id: 'd' as const, text: "Non, mais uniquement si la manifestation est déclarée en préfecture" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S23: Liberté de la presse
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Un journal publie un article critique envers le président de la République. Un ami vous dit que le journal devrait être interdit pour irrespect. Que répondez-vous ?",
    explanationFr:
      "La liberté de la presse, garantie par la loi du 29 juillet 1881, permet de critiquer les personnalités politiques et les institutions. C'est un pilier de la démocratie, tant que cela ne relève pas de la diffamation.",
    choicesFr: [
      { id: 'a' as const, text: "Votre ami a raison, on ne doit pas critiquer le président" },
      { id: 'b' as const, text: "Le journal peut être poursuivi pour offense au chef de l'État" },
      { id: 'c' as const, text: "La presse est libre de critiquer les responsables politiques, c'est un droit fondamental de la démocratie" },
      { id: 'd' as const, text: "Le journal peut critiquer, mais uniquement avec l'accord du gouvernement" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S24: Diffamation vs critique
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Votre voisin écrit sur les réseaux sociaux que le boulanger du quartier « vend de la nourriture empoisonnée » sans aucune preuve. Le boulanger veut porter plainte. A-t-il des motifs ?",
    explanationFr:
      "Affirmer publiquement des faits faux qui portent atteinte à l'honneur d'une personne constitue de la diffamation, un délit prévu par la loi de 1881. Ce n'est pas protégé par la liberté d'expression.",
    choicesFr: [
      { id: 'a' as const, text: "Non, c'est la liberté d'expression de votre voisin" },
      { id: 'b' as const, text: "Oui, c'est de la diffamation car il affirme des faits faux portant atteinte à l'honneur du boulanger" },
      { id: 'c' as const, text: "Non, car les réseaux sociaux ne sont pas soumis à la loi" },
      { id: 'd' as const, text: "Oui, mais uniquement si le boulanger peut prouver que sa nourriture est bonne" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S25: Liberté d'association
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous souhaitez créer une association culturelle dans votre quartier pour organiser des événements. Quelles sont les conditions en France ?",
    explanationFr:
      "La liberté d'association est garantie par la loi du 1er juillet 1901. Toute personne peut créer une association en déposant une déclaration en préfecture. Il suffit d'au moins deux personnes et les statuts doivent être rédigés.",
    choicesFr: [
      { id: 'a' as const, text: "Il faut obtenir une autorisation préalable du maire" },
      { id: 'b' as const, text: "Il suffit de faire une déclaration en préfecture, la création est libre" },
      { id: 'c' as const, text: "Il faut avoir la nationalité française pour créer une association" },
      { id: 'd' as const, text: "Il faut réunir au moins dix personnes et obtenir l'accord du préfet" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S26: Liberté de circulation
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Lors d'un contrôle de police dans la rue, un agent vous demande vos papiers d'identité. Vous n'avez aucun document sur vous. Que se passe-t-il ?",
    explanationFr:
      "En France, il n'est pas obligatoire de porter en permanence une pièce d'identité. Cependant, lors d'un contrôle, si vous ne pouvez pas justifier de votre identité, vous pouvez être retenu jusqu'à 4 heures pour vérification.",
    choicesFr: [
      { id: 'a' as const, text: "Vous êtes immédiatement arrêté et placé en garde à vue" },
      { id: 'b' as const, text: "Vous recevez automatiquement une amende" },
      { id: 'c' as const, text: "Vous pouvez être retenu pour une vérification d'identité, mais ne pas avoir ses papiers n'est pas un délit" },
      { id: 'd' as const, text: "Le policier n'a pas le droit de vous contrôler sans motif" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S27: Droit de grève
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Les salariés de votre entreprise décident de faire grève pour protester contre des conditions de travail dangereuses. Votre employeur menace de licencier tous les grévistes. Est-ce légal ?",
    explanationFr:
      "Le droit de grève est un droit constitutionnel en France. Un employeur ne peut pas licencier un salarié pour avoir fait grève, sauf en cas de faute lourde commise pendant la grève (violences, dégradations).",
    choicesFr: [
      { id: 'a' as const, text: "Oui, l'employeur peut licencier les grévistes car ils ne travaillent pas" },
      { id: 'b' as const, text: "Non, le droit de grève est constitutionnel et le licenciement pour fait de grève est interdit" },
      { id: 'c' as const, text: "Oui, si la grève dure plus de 48 heures" },
      { id: 'd' as const, text: "Non, mais il peut réduire définitivement leur salaire" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S28: Respect de la vie privée
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Votre voisin installe une caméra de surveillance qui filme directement l'entrée de votre appartement et votre palier. Avez-vous un recours ?",
    explanationFr:
      "Le droit au respect de la vie privée est garanti par l'article 9 du Code civil. Filmer des espaces communs ou l'entrée du domicile d'autrui sans consentement est une atteinte à la vie privée. Vous pouvez demander le retrait de la caméra et saisir la justice.",
    choicesFr: [
      { id: 'a' as const, text: "Non, votre voisin a le droit de filmer les parties communes" },
      { id: 'b' as const, text: "Non, car la caméra est sur sa propriété" },
      { id: 'c' as const, text: "Oui, mais uniquement si vous êtes propriétaire et non locataire" },
      { id: 'd' as const, text: "Oui, c'est une atteinte à votre vie privée et vous pouvez exiger le retrait de la caméra" },
    ],
    correctChoice: 'd' as const,
  },

  // ── S29: Liberté de conscience et objection
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous êtes invité à un repas entre collègues. Un collègue vous reproche de ne pas boire d'alcool en disant que « en France, on trinque ensemble ». Que répondez-vous ?",
    explanationFr:
      "La liberté de conscience, protégée par la Constitution, inclut le droit de ne pas consommer d'alcool, que ce soit pour des raisons personnelles, religieuses ou de santé. Personne ne peut être contraint de boire de l'alcool.",
    choicesFr: [
      { id: 'a' as const, text: "Il a raison, il faut s'adapter aux traditions françaises" },
      { id: 'b' as const, text: "Vous êtes libre de ne pas boire d'alcool, c'est un choix personnel protégé par la liberté de conscience" },
      { id: 'c' as const, text: "Vous devez boire un peu par politesse pour ne pas offenser vos collègues" },
      { id: 'd' as const, text: "Vous devez expliquer vos raisons religieuses pour être dispensé" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S30: Négationnisme et liberté d'expression
  {
    themeId: 1 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Lors d'un débat, une personne affirme publiquement que la Shoah n'a jamais existé, en invoquant sa liberté d'expression. Que dit la loi française ?",
    explanationFr:
      "La loi Gayssot de 1990 interdit le négationnisme, c'est-à-dire la contestation de l'existence des crimes contre l'humanité. Ce n'est pas couvert par la liberté d'expression et constitue un délit pénal.",
    choicesFr: [
      { id: 'a' as const, text: "C'est couvert par la liberté d'expression, même si c'est choquant" },
      { id: 'b' as const, text: "C'est interdit uniquement dans les médias, pas dans une discussion privée" },
      { id: 'c' as const, text: "Le négationnisme est un délit pénal en France, ce n'est pas protégé par la liberté d'expression" },
      { id: 'd' as const, text: "C'est autorisé si la personne présente cela comme une opinion et non comme un fait" },
    ],
    correctChoice: 'c' as const,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  THEME 2 — Système institutionnel (15 questions)
// ═══════════════════════════════════════════════════════════════════════════════

export const situationsTheme2 = [
  // ═══════════════════════════════════════════════════════════
  //  VOTE (5 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S31: Carte électorale perdue
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "C'est le jour des élections municipales et vous ne retrouvez plus votre carte électorale. Pouvez-vous quand même voter ?",
    explanationFr:
      "La carte électorale n'est pas obligatoire pour voter. Dans les communes de plus de 1 000 habitants, une pièce d'identité suffit. Dans les communes de moins de 1 000 habitants, aucun document n'est exigé.",
    choicesFr: [
      { id: 'a' as const, text: "Non, la carte électorale est indispensable pour voter" },
      { id: 'b' as const, text: "Oui, une pièce d'identité suffit dans les communes de plus de 1 000 habitants" },
      { id: 'c' as const, text: "Oui, mais uniquement si vous faites une déclaration sur l'honneur" },
      { id: 'd' as const, text: "Non, vous devez demander un duplicata en mairie avant de voter" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S32: Procuration de vote
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous devez partir en déplacement professionnel le jour du second tour de l'élection présidentielle. Vous ne voulez pas manquer le vote. Que pouvez-vous faire ?",
    explanationFr:
      "Vous pouvez donner une procuration à un électeur inscrit dans la même commune. La démarche se fait au commissariat, en gendarmerie, au tribunal judiciaire, ou en ligne via le site maprocuration.gouv.fr.",
    choicesFr: [
      { id: 'a' as const, text: "Vous pouvez voter par correspondance en envoyant votre bulletin par courrier" },
      { id: 'b' as const, text: "Vous ne pouvez rien faire, il faut être présent physiquement" },
      { id: 'c' as const, text: "Vous pouvez établir une procuration pour qu'un autre électeur vote à votre place" },
      { id: 'd' as const, text: "Vous pouvez voter en ligne sur le site du gouvernement" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S33: Inscription sur les listes électorales
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous venez d'obtenir la nationalité française et souhaitez voter aux prochaines élections. Quelle est la première démarche obligatoire ?",
    explanationFr:
      "Pour pouvoir voter en France, il faut être inscrit sur les listes électorales. L'inscription peut se faire en mairie, en ligne, ou est automatique à 18 ans pour les personnes nées en France. Les nouveaux citoyens doivent s'inscrire.",
    choicesFr: [
      { id: 'a' as const, text: "Vous êtes automatiquement inscrit en obtenant la nationalité" },
      { id: 'b' as const, text: "Vous devez vous inscrire sur les listes électorales de votre commune" },
      { id: 'c' as const, text: "Vous devez attendre cinq ans après la naturalisation pour pouvoir voter" },
      { id: 'd' as const, text: "Vous devez obtenir une autorisation spéciale du préfet" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S34: Vote et secret du scrutin
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Dans le bureau de vote, vous remarquez qu'un électeur prend directement un seul bulletin sans passer par l'isoloir. L'assesseur lui demande de passer par l'isoloir. L'assesseur a-t-il raison ?",
    explanationFr:
      "Le passage par l'isoloir est obligatoire pour garantir le secret du vote. Même si l'électeur ne souhaite pas cacher son choix, l'isoloir est une étape obligatoire du processus de vote en France.",
    choicesFr: [
      { id: 'a' as const, text: "Non, le passage par l'isoloir est facultatif" },
      { id: 'b' as const, text: "Oui, le passage par l'isoloir est obligatoire pour garantir le secret du scrutin" },
      { id: 'c' as const, text: "Non, seule l'enveloppe fermée garantit le secret du vote" },
      { id: 'd' as const, text: "Oui, mais uniquement pour les élections présidentielles" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S35: Droit de vote des ressortissants européens
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Votre voisin est de nationalité portugaise et vit en France depuis 10 ans. Il souhaite voter aux élections. À quelles élections peut-il participer ?",
    explanationFr:
      "Les citoyens de l'Union européenne résidant en France peuvent voter aux élections municipales et aux élections européennes, mais pas aux élections présidentielles, législatives ou régionales.",
    choicesFr: [
      { id: 'a' as const, text: "À toutes les élections, car il vit en France depuis plus de 5 ans" },
      { id: 'b' as const, text: "À aucune élection, car il n'a pas la nationalité française" },
      { id: 'c' as const, text: "Aux élections municipales et européennes uniquement" },
      { id: 'd' as const, text: "Uniquement aux élections européennes" },
    ],
    correctChoice: 'c' as const,
  },

  // ═══════════════════════════════════════════════════════════
  //  COLLECTIVITÉS LOCALES (5 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S36: Rôle du maire — état civil
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Vous souhaitez vous marier civilement en France. Vers qui devez-vous vous tourner pour célébrer le mariage ?",
    explanationFr:
      "En France, seul le mariage civil a une valeur juridique. Il est célébré à la mairie par le maire ou un adjoint. Le mariage religieux n'a aucune valeur légale s'il n'est pas précédé du mariage civil.",
    choicesFr: [
      { id: 'a' as const, text: "Vers un notaire qui officialise le mariage" },
      { id: 'b' as const, text: "Vers le maire ou un adjoint de votre commune, à la mairie" },
      { id: 'c' as const, text: "Vers le tribunal judiciaire de votre ville" },
      { id: 'd' as const, text: "Vers le préfet du département" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S37: Urbanisme et permis de construire
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Vous souhaitez construire une extension de votre maison. Votre voisin vous dit qu'il faut demander un permis de construire. À qui devez-vous vous adresser ?",
    explanationFr:
      "Les demandes de permis de construire doivent être déposées à la mairie de la commune où se situe le terrain. C'est le maire qui délivre les autorisations d'urbanisme au nom de la commune.",
    choicesFr: [
      { id: 'a' as const, text: "À la préfecture du département" },
      { id: 'b' as const, text: "À la mairie de votre commune" },
      { id: 'c' as const, text: "Au conseil régional" },
      { id: 'd' as const, text: "Directement au ministère du Logement" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S38: Inscription à l'école maternelle
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Votre enfant a 3 ans et vous souhaitez l'inscrire à l'école maternelle publique. Quelle est votre première démarche ?",
    explanationFr:
      "L'inscription à l'école maternelle publique se fait d'abord à la mairie de votre commune. La mairie vous indique l'école de votre secteur, puis vous finalisez l'inscription auprès du directeur de l'école.",
    choicesFr: [
      { id: 'a' as const, text: "Vous allez directement à l'école de votre choix pour inscrire votre enfant" },
      { id: 'b' as const, text: "Vous faites d'abord l'inscription en mairie, qui vous attribue une école de secteur" },
      { id: 'c' as const, text: "Vous contactez le rectorat de votre académie" },
      { id: 'd' as const, text: "Vous attendez un courrier automatique de l'Éducation nationale" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S39: Conseil municipal et démocratie locale
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Vous souhaitez assister à une séance du conseil municipal de votre commune pour savoir comment le budget est dépensé. En avez-vous le droit ?",
    explanationFr:
      "Les séances du conseil municipal sont publiques (sauf cas exceptionnels de huis clos). Tout citoyen peut y assister. Les délibérations sont également consultables en mairie. C'est un principe de transparence démocratique.",
    choicesFr: [
      { id: 'a' as const, text: "Non, seuls les élus et les journalistes peuvent assister aux séances" },
      { id: 'b' as const, text: "Oui, les séances du conseil municipal sont publiques et ouvertes à tous" },
      { id: 'c' as const, text: "Oui, mais uniquement si vous faites une demande écrite au maire" },
      { id: 'd' as const, text: "Non, le budget est un document confidentiel" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S40: Compétences du département
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: true,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Votre grand-père âgé a besoin de l'Allocation Personnalisée d'Autonomie (APA) pour financer son aide à domicile. À quelle collectivité devez-vous vous adresser ?",
    explanationFr:
      "L'action sociale, notamment l'APA (Allocation Personnalisée d'Autonomie) et le RSA, relève de la compétence du département (conseil départemental). C'est l'une des principales missions des départements.",
    choicesFr: [
      { id: 'a' as const, text: "À la mairie de votre commune" },
      { id: 'b' as const, text: "Au conseil départemental, car l'action sociale est une compétence du département" },
      { id: 'c' as const, text: "À la caisse d'allocations familiales (CAF)" },
      { id: 'd' as const, text: "Au conseil régional" },
    ],
    correctChoice: 'b' as const,
  },

  // ═══════════════════════════════════════════════════════════
  //  INSTITUTIONS (5 questions)
  // ═══════════════════════════════════════════════════════════

  // ── S41: Séparation des pouvoirs en pratique
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp'] as const,
    textFr:
      "Le gouvernement souhaite augmenter les impôts. Un ami vous dit que le Premier ministre peut le faire seul par décret. Est-ce exact ?",
    explanationFr:
      "En France, seul le Parlement (Assemblée nationale et Sénat) a le pouvoir de voter les lois, y compris celles relatives aux impôts. C'est le principe de séparation des pouvoirs : le gouvernement propose, le Parlement dispose.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, le Premier ministre peut modifier les impôts par décret" },
      { id: 'b' as const, text: "Non, seul le président de la République peut augmenter les impôts" },
      { id: 'c' as const, text: "Non, seul le Parlement peut voter les lois fiscales, c'est la séparation des pouvoirs" },
      { id: 'd' as const, text: "Oui, si le Conseil constitutionnel donne son accord" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S42: Rôle du Conseil constitutionnel
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 3,
    isPremium: false,
    examTypes: ['csp', 'cr'] as const,
    textFr:
      "Le Parlement vote une loi qui, selon des citoyens, porte atteinte à la liberté d'expression. Les citoyens peuvent-ils contester cette loi et comment ?",
    explanationFr:
      "Depuis 2010, tout justiciable peut soulever une Question Prioritaire de Constitutionnalité (QPC) devant un tribunal. Le Conseil constitutionnel vérifie alors que la loi respecte les droits et libertés garantis par la Constitution.",
    choicesFr: [
      { id: 'a' as const, text: "Non, une loi votée par le Parlement ne peut jamais être contestée" },
      { id: 'b' as const, text: "Oui, en adressant une pétition au président de la République" },
      { id: 'c' as const, text: "Oui, en soulevant une Question Prioritaire de Constitutionnalité (QPC) devant un tribunal" },
      { id: 'd' as const, text: "Oui, en organisant un référendum citoyen" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S43: Rôle du président de la République
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: false,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "À la télévision, vous apprenez que le président de la République a dissous l'Assemblée nationale et convoqué de nouvelles élections. Un ami dit que c'est un coup d'État. A-t-il raison ?",
    explanationFr:
      "Le droit de dissolution de l'Assemblée nationale est un pouvoir propre du président de la République, prévu par l'article 12 de la Constitution. C'est un acte constitutionnel, pas un coup d'État.",
    choicesFr: [
      { id: 'a' as const, text: "Oui, le président n'a pas le droit de dissoudre l'Assemblée" },
      { id: 'b' as const, text: "Non, la dissolution est un pouvoir constitutionnel du président prévu par l'article 12" },
      { id: 'c' as const, text: "Oui, sauf si le Premier ministre a donné son accord" },
      { id: 'd' as const, text: "Non, mais cela nécessite un vote favorable du Sénat" },
    ],
    correctChoice: 'b' as const,
  },

  // ── S44: Démarches à la préfecture
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 1,
    isPremium: true,
    examTypes: ['csp'] as const,
    textFr:
      "Vous êtes étranger en situation régulière et votre titre de séjour arrive à expiration dans deux mois. Où devez-vous faire votre demande de renouvellement ?",
    explanationFr:
      "Le renouvellement des titres de séjour se fait auprès de la préfecture ou sous-préfecture du département de résidence. La demande doit être déposée avant l'expiration du titre en cours.",
    choicesFr: [
      { id: 'a' as const, text: "À la mairie de votre commune" },
      { id: 'b' as const, text: "Au consulat de votre pays d'origine" },
      { id: 'c' as const, text: "À la préfecture ou sous-préfecture de votre département de résidence" },
      { id: 'd' as const, text: "Au ministère de l'Intérieur à Paris" },
    ],
    correctChoice: 'c' as const,
  },

  // ── S45: Le Défenseur des droits
  {
    themeId: 2 as const,
    type: 'situational' as const,
    difficulty: 2,
    isPremium: true,
    examTypes: ['csp', 'cr', 'nat'] as const,
    textFr:
      "Vous estimez être victime d'une discrimination de la part d'un service public et vous ne savez pas vers qui vous tourner. Quelle institution indépendante peut vous aider gratuitement ?",
    explanationFr:
      "Le Défenseur des droits est une autorité constitutionnelle indépendante chargée de lutter contre les discriminations, de défendre les droits des usagers des services publics et de protéger les droits des enfants. Sa saisine est gratuite.",
    choicesFr: [
      { id: 'a' as const, text: "Le médiateur de votre banque" },
      { id: 'b' as const, text: "Le Défenseur des droits, autorité indépendante qui lutte contre les discriminations" },
      { id: 'c' as const, text: "Le député de votre circonscription" },
      { id: 'd' as const, text: "Le procureur de la République, qui est le seul compétent" },
    ],
    correctChoice: 'b' as const,
  },
];
