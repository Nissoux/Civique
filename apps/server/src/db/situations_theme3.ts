export const situationsTheme3 = [
  // ─── DROITS FONDAMENTAUX EN PRATIQUE (8 questions) ────────────────────────
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous souhaitez inscrire votre enfant de 7 ans à l'école publique de votre quartier. Le directeur vous demande votre titre de séjour avant d'accepter l'inscription. Que faites-vous ?",
    explanationFr:
      "En France, le droit à l'éducation est garanti pour tous les enfants résidant sur le territoire, quel que soit le statut administratif de leurs parents. L'école ne peut pas refuser l'inscription d'un enfant au motif que ses parents n'ont pas de titre de séjour.",
    choicesFr: [
      { id: "a" as const, text: "Vous acceptez de revenir avec votre titre de séjour car c'est obligatoire" },
      { id: "b" as const, text: "Vous rappelez que le droit à l'éducation s'applique à tous les enfants et que le titre de séjour n'est pas exigible pour l'inscription scolaire" },
      { id: "c" as const, text: "Vous renoncez à inscrire votre enfant dans cette école" },
      { id: "d" as const, text: "Vous inscrivez votre enfant dans une école privée à la place" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre voisin ouvre régulièrement votre boîte aux lettres et lit votre courrier. Lorsque vous lui en parlez, il répond que ce n'est pas grave car il n'y a rien de secret. Quelle est la bonne réaction ?",
    explanationFr:
      "Le droit au respect de la vie privée est garanti par l'article 9 du Code civil. L'ouverture du courrier d'autrui est un délit pénal puni par l'article 226-15 du Code pénal, même si le contenu n'est pas confidentiel.",
    choicesFr: [
      { id: "a" as const, text: "Il a raison, ce n'est pas grave si le courrier ne contient rien de secret" },
      { id: "b" as const, text: "Vous lui demandez simplement d'arrêter mais sans recours possible" },
      { id: "c" as const, text: "Vous pouvez porter plainte car l'ouverture du courrier d'autrui est un délit, quel que soit le contenu" },
      { id: "d" as const, text: "Vous changez de boîte aux lettres car la loi ne protège pas le courrier" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous êtes contrôlé par la police dans la rue. Les agents vous demandent de présenter une pièce d'identité. Vous n'en avez pas sur vous. Que se passe-t-il ?",
    explanationFr:
      "En France, il n'est pas obligatoire de porter une pièce d'identité sur soi en permanence. Toutefois, en cas de contrôle d'identité légal, les forces de l'ordre peuvent vous retenir jusqu'à 4 heures pour vérifier votre identité si vous ne pouvez pas la justifier sur place.",
    choicesFr: [
      { id: "a" as const, text: "Vous êtes immédiatement arrêté et placé en garde à vue" },
      { id: "b" as const, text: "Les agents peuvent vous retenir le temps de vérifier votre identité, dans la limite de 4 heures" },
      { id: "c" as const, text: "Le contrôle est illégal car vous êtes dans la rue" },
      { id: "d" as const, text: "Vous recevez automatiquement une amende pour défaut de papiers" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Votre employeur vous interdit de quitter le territoire français pendant vos congés payés. A-t-il le droit de vous imposer cette restriction ?",
    explanationFr:
      "La liberté d'aller et venir est un droit fondamental garanti par la Constitution. Un employeur ne peut pas restreindre la liberté de déplacement d'un salarié pendant ses congés payés, sauf clause de mobilité spécifique liée à l'exercice du travail.",
    choicesFr: [
      { id: "a" as const, text: "Oui, l'employeur peut décider où ses salariés passent leurs vacances" },
      { id: "b" as const, text: "Oui, mais uniquement pour les salariés étrangers" },
      { id: "c" as const, text: "Non, la liberté d'aller et venir est un droit fondamental, y compris pendant les congés" },
      { id: "d" as const, text: "Oui, si c'est écrit dans le règlement intérieur de l'entreprise" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre fils de 16 ans est soupçonné d'un vol dans un magasin. Le gérant du magasin affirme devant d'autres clients que votre fils est un voleur. Comment réagissez-vous ?",
    explanationFr:
      "En France, toute personne est présumée innocente jusqu'à ce qu'elle soit déclarée coupable par un tribunal. Le gérant n'a pas le droit d'affirmer publiquement que votre fils est coupable. Il peut porter plainte, mais la présomption d'innocence doit être respectée.",
    choicesFr: [
      { id: "a" as const, text: "Le gérant a le droit de dire cela puisqu'il est victime du vol" },
      { id: "b" as const, text: "Vous acceptez la situation car votre fils est mineur" },
      { id: "c" as const, text: "Vous demandez au gérant de ne pas appeler la police" },
      { id: "d" as const, text: "Vous rappelez au gérant que votre fils bénéficie de la présomption d'innocence et qu'il ne peut pas l'accuser publiquement sans jugement" },
    ],
    correctChoice: "d" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous découvrez qu'un site internet a publié des photos de vous prises à votre insu dans un lieu privé. Quel droit pouvez-vous invoquer ?",
    explanationFr:
      "Le droit à l'image fait partie du droit au respect de la vie privée (article 9 du Code civil). Toute personne peut s'opposer à la diffusion de son image prise sans son consentement, surtout dans un lieu privé. Vous pouvez exiger le retrait et demander des dommages et intérêts.",
    choicesFr: [
      { id: "a" as const, text: "Vous invoquez votre droit à l'image et au respect de la vie privée pour exiger le retrait des photos" },
      { id: "b" as const, text: "Vous ne pouvez rien faire car les photos sont déjà publiées sur internet" },
      { id: "c" as const, text: "Vous devez d'abord prouver que les photos vous portent préjudice" },
      { id: "d" as const, text: "Ce n'est illégal que si les photos sont utilisées à des fins commerciales" },
    ],
    correctChoice: "a" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous souhaitez organiser une réunion publique dans votre quartier pour discuter d'un projet de construction. Devez-vous obtenir une autorisation préalable ?",
    explanationFr:
      "En France, la liberté de réunion est garantie. Les réunions publiques sont libres et ne nécessitent pas d'autorisation préalable, contrairement aux manifestations sur la voie publique qui doivent faire l'objet d'une déclaration en préfecture.",
    choicesFr: [
      { id: "a" as const, text: "Oui, vous devez obtenir une autorisation du maire" },
      { id: "b" as const, text: "Non, les réunions publiques sont libres et ne nécessitent pas d'autorisation préalable" },
      { id: "c" as const, text: "Oui, vous devez obtenir l'autorisation de la préfecture" },
      { id: "d" as const, text: "Non, mais uniquement si vous êtes citoyen français" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Votre propriétaire vous annonce qu'il veut installer une caméra de surveillance dans le couloir de votre appartement pour des raisons de sécurité. Quelle est votre position ?",
    explanationFr:
      "Le domicile est inviolable et le droit au respect de la vie privée s'applique dans l'espace privé du locataire. Le propriétaire ne peut pas installer de caméra dans les parties privatives du logement sans le consentement du locataire, même pour des raisons de sécurité.",
    choicesFr: [
      { id: "a" as const, text: "Vous acceptez car le propriétaire a tous les droits sur son bien" },
      { id: "b" as const, text: "Vous acceptez à condition que les images ne soient pas conservées" },
      { id: "c" as const, text: "Vous refusez car cela porte atteinte à votre vie privée dans votre domicile" },
      { id: "d" as const, text: "Vous devez accepter si c'est prévu dans le bail" },
    ],
    correctChoice: "c" as const,
  },

  // ─── ÉGALITÉ FEMMES-HOMMES (7 questions) ──────────────────────────────────
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Lors d'un entretien d'embauche, le recruteur demande à une candidate si elle prévoit d'avoir des enfants prochainement. Cette question est-elle légale ?",
    explanationFr:
      "Les questions portant sur la situation familiale ou les projets de maternité sont interdites lors d'un entretien d'embauche. Le Code du travail (article L1132-1) interdit toute discrimination fondée sur la grossesse ou la situation de famille.",
    choicesFr: [
      { id: "a" as const, text: "Oui, le recruteur a le droit de poser toutes les questions qu'il souhaite" },
      { id: "b" as const, text: "Non, cette question constitue une discrimination interdite par la loi" },
      { id: "c" as const, text: "Oui, mais uniquement pour les postes à responsabilité" },
      { id: "d" as const, text: "Oui, si l'entreprise emploie moins de 50 salariés" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre collègue femme découvre qu'elle est payée 15 % de moins qu'un collègue homme occupant le même poste avec la même ancienneté et les mêmes qualifications. Que peut-elle faire ?",
    explanationFr:
      "Le principe « à travail égal, salaire égal » est inscrit dans le Code du travail (article L3221-2). L'employeur est tenu de garantir l'égalité de rémunération entre les femmes et les hommes pour un même travail ou un travail de valeur égale. La salariée peut saisir le conseil de prud'hommes.",
    choicesFr: [
      { id: "a" as const, text: "Elle ne peut rien faire car les salaires sont fixés librement par l'employeur" },
      { id: "b" as const, text: "Elle doit d'abord prouver qu'elle travaille plus que son collègue" },
      { id: "c" as const, text: "Elle peut seulement en parler à son syndicat sans recours juridique" },
      { id: "d" as const, text: "Elle peut saisir le conseil de prud'hommes car la loi impose l'égalité salariale à travail égal" },
    ],
    correctChoice: "d" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Dans votre quartier, un père refuse d'envoyer sa fille au collège car il considère que les études ne sont pas nécessaires pour les filles. Cette attitude est-elle acceptable en France ?",
    explanationFr:
      "L'instruction est obligatoire pour tous les enfants de 3 à 16 ans en France, sans distinction de sexe. Le refus de scolariser un enfant peut entraîner des poursuites pénales. L'égalité d'accès à l'éducation entre filles et garçons est un principe fondamental.",
    choicesFr: [
      { id: "a" as const, text: "Oui, les parents sont libres de décider de la scolarisation de leurs enfants" },
      { id: "b" as const, text: "Non, l'instruction est obligatoire pour tous les enfants, filles et garçons, et ce refus est contraire à la loi" },
      { id: "c" as const, text: "Oui, si c'est conforme aux convictions culturelles de la famille" },
      { id: "d" as const, text: "Non, mais uniquement si la fille a moins de 12 ans" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Votre amie vous confie que son mari lui interdit de travailler et contrôle toutes ses dépenses. Que pouvez-vous lui dire ?",
    explanationFr:
      "En France, chaque époux a le droit d'exercer une profession librement, même sans le consentement de l'autre (article 223 du Code civil). Le contrôle économique exercé par un conjoint peut constituer une violence conjugale au sens de la loi.",
    choicesFr: [
      { id: "a" as const, text: "C'est normal, le mari est le chef de famille en France" },
      { id: "b" as const, text: "Elle doit obéir tant qu'elle vit sous son toit" },
      { id: "c" as const, text: "En France, chaque époux a le droit de travailler librement et le contrôle économique peut être considéré comme une violence conjugale" },
      { id: "d" as const, text: "Elle doit demander l'autorisation du juge pour pouvoir travailler" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Lors d'une réunion de parents d'élèves, un père affirme que les garçons devraient avoir priorité pour les activités sportives à l'école. Quelle est la position de la loi française ?",
    explanationFr:
      "Le principe d'égalité entre les filles et les garçons est inscrit dans le Code de l'éducation. L'école doit garantir un accès égal à toutes les activités, y compris sportives, sans discrimination fondée sur le sexe.",
    choicesFr: [
      { id: "a" as const, text: "La loi garantit un accès égal aux activités sportives pour les filles et les garçons à l'école" },
      { id: "b" as const, text: "Les garçons ont effectivement la priorité dans les sports de compétition" },
      { id: "c" as const, text: "L'école peut décider librement de la répartition des activités sportives" },
      { id: "d" as const, text: "C'est aux parents de décider quelles activités conviennent à leurs enfants" },
    ],
    correctChoice: "a" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Un couple de votre entourage souhaite se marier. La future épouse a 17 ans et ses parents sont d'accord. Le mariage peut-il avoir lieu en France ?",
    explanationFr:
      "Depuis 2006, l'âge minimum légal du mariage est fixé à 18 ans pour les femmes comme pour les hommes en France. Une dispense exceptionnelle peut être accordée par le procureur de la République pour motifs graves, mais le consentement des parents seul ne suffit pas.",
    choicesFr: [
      { id: "a" as const, text: "Oui, car les parents donnent leur consentement" },
      { id: "b" as const, text: "Non, l'âge légal du mariage est 18 ans pour tous, sauf dispense exceptionnelle du procureur de la République" },
      { id: "c" as const, text: "Oui, car l'âge minimum est de 16 ans pour les filles en France" },
      { id: "d" as const, text: "Oui, si le futur époux a plus de 18 ans" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Votre employeur refuse de vous accorder un congé paternité à la naissance de votre enfant en disant que « c'est un congé pour les mères ». A-t-il raison ?",
    explanationFr:
      "Le congé de paternité et d'accueil de l'enfant est un droit pour tous les pères salariés depuis 2002, étendu à 25 jours depuis 2021. L'employeur ne peut pas refuser ce congé. C'est un droit lié à l'égalité entre les femmes et les hommes dans la parentalité.",
    choicesFr: [
      { id: "a" as const, text: "Oui, seules les mères ont droit à un congé à la naissance" },
      { id: "b" as const, text: "Non, le congé de paternité est un droit pour tous les pères salariés et l'employeur ne peut pas le refuser" },
      { id: "c" as const, text: "Le congé de paternité n'existe que dans la fonction publique" },
      { id: "d" as const, text: "Oui, sauf si l'entreprise compte plus de 250 salariés" },
    ],
    correctChoice: "b" as const,
  },

  // ─── DEVOIRS DU CITOYEN (8 questions) ─────────────────────────────────────
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr:
      "Vous travaillez en France depuis un an et vous n'avez jamais déclaré vos revenus aux impôts. Un ami vous dit que ce n'est pas obligatoire pour les étrangers. A-t-il raison ?",
    explanationFr:
      "Toute personne résidant en France et percevant des revenus doit les déclarer à l'administration fiscale, quelle que soit sa nationalité. Le paiement de l'impôt est un devoir qui s'applique à tous les résidents fiscaux français.",
    choicesFr: [
      { id: "a" as const, text: "Oui, seuls les citoyens français doivent déclarer leurs revenus" },
      { id: "b" as const, text: "Oui, les étrangers ne paient pas d'impôts en France" },
      { id: "c" as const, text: "Non, il a tort : toute personne résidant en France doit déclarer ses revenus, quelle que soit sa nationalité" },
      { id: "d" as const, text: "Oui, sauf si vous gagnez plus de 30 000 euros par an" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous recevez une convocation pour être juré d'assises. Vous ne souhaitez pas y participer car cela perturbe votre emploi du temps. Pouvez-vous refuser ?",
    explanationFr:
      "La participation au jury d'assises est un devoir civique obligatoire pour tout citoyen français inscrit sur les listes électorales. Refuser sans motif légitime est passible d'une amende de 3 750 euros. Seuls certains motifs comme l'âge (plus de 70 ans) ou une maladie grave permettent d'être dispensé.",
    choicesFr: [
      { id: "a" as const, text: "Oui, la participation au jury est facultative" },
      { id: "b" as const, text: "Oui, si votre employeur refuse de vous libérer" },
      { id: "c" as const, text: "Oui, en payant une cotisation de remplacement" },
      { id: "d" as const, text: "Non, c'est un devoir civique obligatoire et un refus sans motif légitime est passible d'une amende" },
    ],
    correctChoice: "d" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous êtes témoin d'un accident de la route. La victime est blessée et allongée sur le sol. Que devez-vous faire en priorité ?",
    explanationFr:
      "En France, toute personne témoin d'un accident a l'obligation légale de porter assistance à une personne en danger (article 223-6 du Code pénal). Ne pas porter secours est un délit de non-assistance à personne en danger. Vous devez au minimum appeler les secours (15, 18 ou 112).",
    choicesFr: [
      { id: "a" as const, text: "Vous pouvez continuer votre chemin, ce n'est pas votre responsabilité" },
      { id: "b" as const, text: "Vous devez appeler les secours et, si possible, porter assistance à la victime" },
      { id: "c" as const, text: "Vous devez uniquement prévenir la police, pas les secours" },
      { id: "d" as const, text: "Vous attendez que quelqu'un d'autre intervienne" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Dans votre immeuble, un voisin stationne systématiquement sa voiture devant la sortie de secours, bloquant l'accès. Que faites-vous ?",
    explanationFr:
      "Le respect des règles de sécurité est un devoir de chaque citoyen. Bloquer une sortie de secours met en danger la vie des occupants de l'immeuble. Vous pouvez signaler cette infraction au syndic, à la mairie ou aux forces de l'ordre.",
    choicesFr: [
      { id: "a" as const, text: "Vous ne faites rien car c'est un problème privé entre voisins" },
      { id: "b" as const, text: "Vous déplacez vous-même la voiture de votre voisin" },
      { id: "c" as const, text: "Vous signalez la situation au syndic de l'immeuble et, si nécessaire, aux autorités compétentes" },
      { id: "d" as const, text: "Vous bloquez également la sortie de secours avec votre véhicule en représailles" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous découvrez que votre employeur fait travailler des personnes sans papiers dans des conditions indignes et sans les déclarer. Que devez-vous faire ?",
    explanationFr:
      "Le travail dissimulé et l'exploitation de personnes vulnérables sont des délits graves en France. Tout citoyen a le devoir de signaler des infractions graves dont il a connaissance. Vous pouvez alerter l'inspection du travail, la police ou le procureur de la République.",
    choicesFr: [
      { id: "a" as const, text: "Vous ne faites rien car cela ne vous concerne pas directement" },
      { id: "b" as const, text: "Vous en parlez uniquement à vos collègues" },
      { id: "c" as const, text: "Vous aidez votre employeur à cacher la situation" },
      { id: "d" as const, text: "Vous signalez la situation à l'inspection du travail ou aux autorités compétentes" },
    ],
    correctChoice: "d" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous êtes citoyen français et les élections municipales approchent. Vous pensez que voter ne sert à rien. Quelle est la réalité concernant le vote en France ?",
    explanationFr:
      "En France, le vote n'est pas légalement obligatoire (contrairement à d'autres pays), mais il est considéré comme un devoir civique fondamental. C'est le moyen principal pour les citoyens de participer à la vie démocratique et d'influencer les décisions qui les concernent.",
    choicesFr: [
      { id: "a" as const, text: "Le vote est obligatoire et vous risquez une amende si vous ne votez pas" },
      { id: "b" as const, text: "Le vote n'est pas obligatoire en France mais c'est un devoir civique essentiel à la démocratie" },
      { id: "c" as const, text: "Le vote est réservé aux personnes nées en France" },
      { id: "d" as const, text: "Seules les élections présidentielles sont importantes, les municipales sont facultatives" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Votre fils de 17 ans a été convoqué pour la Journée Défense et Citoyenneté (JDC). Il vous dit qu'il ne veut pas y aller. Que lui répondez-vous ?",
    explanationFr:
      "La Journée Défense et Citoyenneté est obligatoire pour tous les jeunes Français, filles et garçons, entre 16 et 25 ans. L'attestation de participation est nécessaire pour s'inscrire aux examens et concours publics (baccalauréat, permis de conduire, etc.).",
    choicesFr: [
      { id: "a" as const, text: "Il peut refuser car le service militaire n'existe plus" },
      { id: "b" as const, text: "La JDC est obligatoire et l'attestation est nécessaire pour passer des examens comme le baccalauréat ou le permis de conduire" },
      { id: "c" as const, text: "La JDC est uniquement obligatoire pour les garçons" },
      { id: "d" as const, text: "Il peut la reporter indéfiniment sans conséquence" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous constatez qu'un enfant de votre voisinage présente régulièrement des traces de coups et semble effrayé par ses parents. Quelle est votre responsabilité ?",
    explanationFr:
      "En France, toute personne qui a connaissance de mauvais traitements infligés à un mineur a l'obligation légale de les signaler aux autorités (article 434-3 du Code pénal). Vous pouvez appeler le 119 (numéro national de l'enfance en danger) ou alerter les services sociaux ou la police.",
    choicesFr: [
      { id: "a" as const, text: "Vous ne faites rien car c'est une affaire de famille et vous ne devez pas vous en mêler" },
      { id: "b" as const, text: "Vous en parlez aux autres voisins pour avoir leur avis" },
      { id: "c" as const, text: "Vous avez l'obligation légale de signaler la situation aux autorités, par exemple en appelant le 119" },
      { id: "d" as const, text: "Vous attendez d'avoir des preuves formelles avant de réagir" },
    ],
    correctChoice: "c" as const,
  },

  // ─── LIMITES DES DROITS (7 questions) ─────────────────────────────────────
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Lors d'un débat en ligne, un internaute publie des propos haineux contre une communauté religieuse en invoquant la liberté d'expression. A-t-il raison de se défendre ainsi ?",
    explanationFr:
      "La liberté d'expression est un droit fondamental mais elle a des limites. L'incitation à la haine raciale ou religieuse est un délit puni par la loi (loi du 29 juillet 1881 et article 24). La liberté d'expression ne protège pas les propos discriminatoires, diffamatoires ou incitant à la haine.",
    choicesFr: [
      { id: "a" as const, text: "Oui, la liberté d'expression est absolue en France et protège tous les propos" },
      { id: "b" as const, text: "Non, la liberté d'expression a des limites et l'incitation à la haine religieuse est un délit" },
      { id: "c" as const, text: "Oui, car sur internet les lois françaises ne s'appliquent pas" },
      { id: "d" as const, text: "Oui, à condition de ne pas citer de noms précis" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Votre voisin organise une fête avec de la musique très forte tous les samedis soir jusqu'à 4 heures du matin. Vous lui demandez de baisser le volume, mais il vous répond qu'il est chez lui et qu'il fait ce qu'il veut. A-t-il raison ?",
    explanationFr:
      "Le droit de propriété et la liberté de jouir de son domicile ne sont pas absolus. Les nuisances sonores excessives, surtout la nuit (entre 22h et 7h), constituent un trouble anormal du voisinage sanctionné par la loi. Vous pouvez appeler la police qui peut dresser un procès-verbal.",
    choicesFr: [
      { id: "a" as const, text: "Oui, il est libre de faire ce qu'il veut chez lui à toute heure" },
      { id: "b" as const, text: "Non, les nuisances sonores nocturnes sont interdites et vous pouvez appeler la police" },
      { id: "c" as const, text: "Oui, mais uniquement le week-end" },
      { id: "d" as const, text: "Non, mais seulement si le bruit dépasse 100 décibels" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "La mairie souhaite construire une route qui passerait par votre terrain. On vous propose une indemnisation mais vous refusez de vendre. La mairie peut-elle vous y contraindre ?",
    explanationFr:
      "Le droit de propriété est un droit fondamental, mais il peut être limité pour cause d'utilité publique. La procédure d'expropriation permet à l'État ou aux collectivités de contraindre un propriétaire à céder son bien moyennant une juste et préalable indemnité, conformément à la Déclaration des droits de l'homme (article 17).",
    choicesFr: [
      { id: "a" as const, text: "Non, le droit de propriété est absolu et personne ne peut vous forcer à vendre" },
      { id: "b" as const, text: "Oui, la mairie peut prendre votre terrain sans aucune compensation" },
      { id: "c" as const, text: "Oui, par la procédure d'expropriation pour utilité publique, avec une juste indemnisation" },
      { id: "d" as const, text: "Non, sauf si vous êtes locataire et non propriétaire" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 2 as const,
    isPremium: true,
    examTypes: ["csp", "cr"] as const,
    textFr:
      "Vous souhaitez manifester dans la rue contre une loi que vous jugez injuste. Pouvez-vous organiser cette manifestation librement ?",
    explanationFr:
      "Le droit de manifester est garanti en France, mais il est encadré. Toute manifestation sur la voie publique doit faire l'objet d'une déclaration préalable en préfecture au moins 3 jours avant. Le préfet peut l'interdire s'il estime qu'elle risque de troubler gravement l'ordre public.",
    choicesFr: [
      { id: "a" as const, text: "Oui, le droit de manifester est totalement libre et sans condition" },
      { id: "b" as const, text: "Non, les manifestations sont interdites en France" },
      { id: "c" as const, text: "Oui, mais vous devez faire une déclaration préalable en préfecture" },
      { id: "d" as const, text: "Oui, mais uniquement si vous avez la nationalité française" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Vous êtes propriétaire d'un appartement et vous refusez de le louer à une famille en raison de son origine ethnique. Votre agent immobilier vous soutient dans cette démarche. Que dit la loi ?",
    explanationFr:
      "La discrimination au logement fondée sur l'origine ethnique est un délit puni par la loi (article 225-1 du Code pénal). Le propriétaire et l'agent immobilier s'exposent tous deux à des poursuites pénales pouvant aller jusqu'à 3 ans d'emprisonnement et 45 000 euros d'amende.",
    choicesFr: [
      { id: "a" as const, text: "Le propriétaire est libre de choisir son locataire selon tous les critères qu'il souhaite" },
      { id: "b" as const, text: "C'est légal si l'agent immobilier est d'accord" },
      { id: "c" as const, text: "C'est une discrimination illégale passible de poursuites pénales pour le propriétaire et l'agent immobilier" },
      { id: "d" as const, text: "C'est interdit uniquement pour les logements sociaux" },
    ],
    correctChoice: "c" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 1 as const,
    isPremium: true,
    examTypes: ["csp"] as const,
    textFr:
      "Vous filmez un policier pendant un contrôle dans la rue et il vous demande d'arrêter en disant que c'est interdit. A-t-il raison ?",
    explanationFr:
      "En France, il est légal de filmer des policiers dans l'exercice de leurs fonctions dans l'espace public, à condition de ne pas entraver leur action. La loi pour une sécurité globale ne remet pas en cause ce droit. Cependant, la diffusion d'images dans le but de nuire à l'intégrité physique ou psychique d'un agent est interdite.",
    choicesFr: [
      { id: "a" as const, text: "Oui, il est totalement interdit de filmer la police en France" },
      { id: "b" as const, text: "Non, vous avez le droit de filmer des policiers dans l'espace public tant que vous n'entravez pas leur action" },
      { id: "c" as const, text: "Oui, sauf si vous êtes journaliste accrédité" },
      { id: "d" as const, text: "Non, mais vous devez obtenir leur autorisation écrite avant de diffuser les images" },
    ],
    correctChoice: "b" as const,
  },
  {
    themeId: 3 as const,
    type: "situational" as const,
    difficulty: 3 as const,
    isPremium: true,
    examTypes: ["csp", "cr", "nat"] as const,
    textFr:
      "Votre association religieuse souhaite organiser une prière dans un parc public. Le maire s'y oppose en invoquant la laïcité. Cette interdiction est-elle justifiée ?",
    explanationFr:
      "La laïcité impose la neutralité de l'État, pas l'interdiction de toute expression religieuse dans l'espace public. Les citoyens sont libres de pratiquer leur religion, y compris dans l'espace public, tant qu'ils ne troublent pas l'ordre public. Le maire ne peut interdire une prière dans un parc que si elle menace réellement l'ordre public.",
    choicesFr: [
      { id: "a" as const, text: "Oui, la laïcité interdit toute expression religieuse dans l'espace public" },
      { id: "b" as const, text: "Oui, seules les églises peuvent accueillir des prières" },
      { id: "c" as const, text: "Non, la laïcité impose la neutralité de l'État mais n'interdit pas la pratique religieuse dans l'espace public, sauf trouble à l'ordre public" },
      { id: "d" as const, text: "Non, mais uniquement si l'association est officiellement reconnue par l'État" },
    ],
    correctChoice: "c" as const,
  },
];
