export const questionsTheme4 = [
  // ─── CSP questions (difficulty 1) ───────────────────────────────────────────

  // Q1: "En quelle année a débuté la Révolution française ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "En quelle année a débuté la Révolution française ?",
    explanationFr:
      "La Révolution française a débuté en 1789 avec la prise de la Bastille le 14 juillet. Cet événement marque la fin de l'Ancien Régime et le début d'une ère de profonds changements politiques et sociaux en France.",
    choicesFr: [
      { id: "a" as const, text: "1789" },
      { id: "b" as const, text: "1799" },
      { id: "c" as const, text: "1776" },
      { id: "d" as const, text: "1815" },
    ],
    correctChoice: "a" as const,
  },

  // Q2: "Qui était Napoléon Ier ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était Napoléon Ier ?",
    explanationFr:
      "Napoléon Ier était empereur des Français de 1804 à 1814 puis brièvement en 1815. Il a modernisé l'administration française et instauré le Code civil, encore en vigueur aujourd'hui.",
    choicesFr: [
      { id: "a" as const, text: "Le premier empereur des Français" },
      { id: "b" as const, text: "Le dernier roi de France" },
      { id: "c" as const, text: "Le fondateur de la Ve République" },
      { id: "d" as const, text: "Un général de la Première Guerre mondiale" },
    ],
    correctChoice: "a" as const,
  },

  // Q3: "Lequel de ces personnages historiques est français ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Lequel de ces personnages historiques est français ?",
    explanationFr:
      "Jeanne d'Arc est une figure emblématique de l'histoire de France. Elle a mené les armées françaises contre les Anglais pendant la guerre de Cent Ans au XVe siècle.",
    choicesFr: [
      { id: "a" as const, text: "Jeanne d'Arc" },
      { id: "b" as const, text: "Christophe Colomb" },
      { id: "c" as const, text: "Winston Churchill" },
      { id: "d" as const, text: "Léonard de Vinci" },
    ],
    correctChoice: "a" as const,
  },

  // Q4: "Dans quelle République est-on aujourd'hui ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Dans quelle République est-on aujourd'hui ?",
    explanationFr:
      "La France est actuellement sous la Ve République, instaurée en 1958 par le général de Gaulle. Elle a renforcé le pouvoir du président de la République.",
    choicesFr: [
      { id: "a" as const, text: "La Ve République" },
      { id: "b" as const, text: "La IVe République" },
      { id: "c" as const, text: "La IIIe République" },
      { id: "d" as const, text: "La VIe République" },
    ],
    correctChoice: "a" as const,
  },

  // Q5: "Qu'est-ce que la Shoah ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qu'est-ce que la Shoah ?",
    explanationFr:
      "La Shoah désigne le génocide des Juifs d'Europe par l'Allemagne nazie pendant la Seconde Guerre mondiale. Environ six millions de Juifs ont été exterminés entre 1941 et 1945.",
    choicesFr: [
      { id: "a" as const, text: "Le génocide des Juifs pendant la Seconde Guerre mondiale" },
      { id: "b" as const, text: "Une bataille de la Première Guerre mondiale" },
      { id: "c" as const, text: "Un traité de paix européen" },
      { id: "d" as const, text: "La résistance française contre l'occupation" },
    ],
    correctChoice: "a" as const,
  },

  // Q6: "Quel pays ou région du monde a été colonisé par la France ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel pays ou région du monde a été colonisé par la France ?",
    explanationFr:
      "L'Algérie a été colonisée par la France de 1830 à 1962. C'était la plus importante colonie française en Afrique du Nord et son indépendance a été obtenue après une longue guerre.",
    choicesFr: [
      { id: "a" as const, text: "L'Algérie" },
      { id: "b" as const, text: "Le Brésil" },
      { id: "c" as const, text: "L'Inde" },
      { id: "d" as const, text: "L'Australie" },
    ],
    correctChoice: "a" as const,
  },

  // Q7: "Qui a rendu l'école gratuite, laïque et obligatoire ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui a rendu l'école gratuite, laïque et obligatoire ?",
    explanationFr:
      "Jules Ferry, ministre de l'Instruction publique, a fait voter les lois de 1881-1882 rendant l'école primaire gratuite, laïque et obligatoire. Ces lois sont un pilier de la République française.",
    choicesFr: [
      { id: "a" as const, text: "Jules Ferry" },
      { id: "b" as const, text: "Victor Hugo" },
      { id: "c" as const, text: "Napoléon Bonaparte" },
      { id: "d" as const, text: "Charles de Gaulle" },
    ],
    correctChoice: "a" as const,
  },

  // Q8: "Quand a eu lieu la Seconde Guerre mondiale ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Quand a eu lieu la Seconde Guerre mondiale ?",
    explanationFr:
      "La Seconde Guerre mondiale s'est déroulée de 1939 à 1945. Ce conflit mondial a impliqué la plupart des nations et a causé des millions de victimes.",
    choicesFr: [
      { id: "a" as const, text: "1939-1945" },
      { id: "b" as const, text: "1914-1918" },
      { id: "c" as const, text: "1870-1871" },
      { id: "d" as const, text: "1950-1953" },
    ],
    correctChoice: "a" as const,
  },

  // Q9: "Quand a eu lieu la Première Guerre mondiale ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Quand a eu lieu la Première Guerre mondiale ?",
    explanationFr:
      "La Première Guerre mondiale a eu lieu de 1914 à 1918. Ce conflit a opposé principalement les puissances de la Triple-Entente aux Empires centraux.",
    choicesFr: [
      { id: "a" as const, text: "1914-1918" },
      { id: "b" as const, text: "1939-1945" },
      { id: "c" as const, text: "1870-1871" },
      { id: "d" as const, text: "1899-1902" },
    ],
    correctChoice: "a" as const,
  },

  // Q10: "En quelle année a été créée la Communauté Économique Européenne (CEE) ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "En quelle année a été créée la Communauté Économique Européenne (CEE) ?",
    explanationFr:
      "La CEE a été créée en 1957 par le traité de Rome, signé par six pays fondateurs dont la France. Elle est l'ancêtre de l'Union européenne actuelle.",
    choicesFr: [
      { id: "a" as const, text: "1957" },
      { id: "b" as const, text: "1945" },
      { id: "c" as const, text: "1962" },
      { id: "d" as const, text: "1951" },
    ],
    correctChoice: "a" as const,
  },

  // Q11: "Le 11 novembre est un jour férié. À quoi correspond cette date ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Le 11 novembre est un jour férié. À quoi correspond cette date ?",
    explanationFr:
      "Le 11 novembre 1918 marque l'armistice de la Première Guerre mondiale. Ce jour férié commémore la fin des combats et rend hommage aux soldats morts pour la France.",
    choicesFr: [
      { id: "a" as const, text: "L'armistice de la Première Guerre mondiale" },
      { id: "b" as const, text: "La fin de la Seconde Guerre mondiale" },
      { id: "c" as const, text: "La fête nationale française" },
      { id: "d" as const, text: "La proclamation de la République" },
    ],
    correctChoice: "a" as const,
  },

  // Q12: "Qui a été le premier Président élu sous la Ve République ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui a été le premier Président élu sous la Ve République ?",
    explanationFr:
      "Charles de Gaulle a été le premier Président de la Ve République, élu en 1958. Il est le fondateur de ce régime et a exercé deux mandats présidentiels.",
    choicesFr: [
      { id: "a" as const, text: "Charles de Gaulle" },
      { id: "b" as const, text: "François Mitterrand" },
      { id: "c" as const, text: "Georges Pompidou" },
      { id: "d" as const, text: "René Coty" },
    ],
    correctChoice: "a" as const,
  },

  // Q13: "En quelle année l'esclavage a-t-il été aboli définitivement en France ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "En quelle année l'esclavage a-t-il été aboli définitivement en France ?",
    explanationFr:
      "L'esclavage a été aboli définitivement en France en 1848, sous l'impulsion de Victor Schœlcher. Un premier décret d'abolition avait été pris en 1794 mais Napoléon l'avait rétabli en 1802.",
    choicesFr: [
      { id: "a" as const, text: "1848" },
      { id: "b" as const, text: "1789" },
      { id: "c" as const, text: "1865" },
      { id: "d" as const, text: "1794" },
    ],
    correctChoice: "a" as const,
  },

  // Q14: "Depuis quelle année l'école publique est-elle gratuite ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Depuis quelle année l'école publique est-elle gratuite ?",
    explanationFr:
      "L'école publique est gratuite depuis 1881, grâce aux lois de Jules Ferry. Ces lois ont aussi rendu l'enseignement primaire obligatoire et laïque.",
    choicesFr: [
      { id: "a" as const, text: "1881" },
      { id: "b" as const, text: "1789" },
      { id: "c" as const, text: "1905" },
      { id: "d" as const, text: "1848" },
    ],
    correctChoice: "a" as const,
  },

  // Q15: "Combien y a-t-il eu de républiques en France ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Combien y a-t-il eu de républiques en France ?",
    explanationFr:
      "La France a connu cinq républiques. La Ire République a été proclamée en 1792 et la Ve République, instaurée en 1958, est le régime actuel.",
    choicesFr: [
      { id: "a" as const, text: "Cinq" },
      { id: "b" as const, text: "Trois" },
      { id: "c" as const, text: "Quatre" },
      { id: "d" as const, text: "Six" },
    ],
    correctChoice: "a" as const,
  },

  // Q16: "Qui était le roi de France au moment de la Révolution française ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était le roi de France au moment de la Révolution française ?",
    explanationFr:
      "Louis XVI était roi de France lors de la Révolution française de 1789. Il a été renversé puis guillotiné en 1793.",
    choicesFr: [
      { id: "a" as const, text: "Louis XVI" },
      { id: "b" as const, text: "Louis XIV" },
      { id: "c" as const, text: "Louis XV" },
      { id: "d" as const, text: "Henri IV" },
    ],
    correctChoice: "a" as const,
  },

  // Q17: "Qui a fondé la Ve République ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui a fondé la Ve République ?",
    explanationFr:
      "Le général Charles de Gaulle a fondé la Ve République en 1958. Il en a été le premier Président et a instauré une Constitution renforçant le pouvoir exécutif.",
    choicesFr: [
      { id: "a" as const, text: "Le général de Gaulle" },
      { id: "b" as const, text: "François Mitterrand" },
      { id: "c" as const, text: "Napoléon III" },
      { id: "d" as const, text: "Léon Blum" },
    ],
    correctChoice: "a" as const,
  },

  // Q18: "Que célèbre-t-on le 14 juillet ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Que célèbre-t-on le 14 juillet ?",
    explanationFr:
      "Le 14 juillet est la fête nationale française. Elle commémore la prise de la Bastille en 1789 et la Fête de la Fédération de 1790, symboles de la liberté et de l'unité nationale.",
    choicesFr: [
      { id: "a" as const, text: "La fête nationale, anniversaire de la prise de la Bastille" },
      { id: "b" as const, text: "L'armistice de 1918" },
      { id: "c" as const, text: "La fin de la Seconde Guerre mondiale" },
      { id: "d" as const, text: "L'abolition de l'esclavage" },
    ],
    correctChoice: "a" as const,
  },

  // Q19: "Quelle guerre a eu lieu entre 1914 et 1918 ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle guerre a eu lieu entre 1914 et 1918 ?",
    explanationFr:
      "La Première Guerre mondiale a eu lieu de 1914 à 1918. Elle a opposé les Alliés aux Empires centraux et a fait des millions de morts.",
    choicesFr: [
      { id: "a" as const, text: "La Première Guerre mondiale" },
      { id: "b" as const, text: "La Seconde Guerre mondiale" },
      { id: "c" as const, text: "La guerre franco-prussienne" },
      { id: "d" as const, text: "La guerre d'Algérie" },
    ],
    correctChoice: "a" as const,
  },

  // Q20: "Pourquoi l'année 1958 est importante pour la France ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Pourquoi l'année 1958 est importante pour la France ?",
    explanationFr:
      "L'année 1958 marque la création de la Ve République par le général de Gaulle. Une nouvelle Constitution a été adoptée, établissant le régime politique actuel de la France.",
    choicesFr: [
      { id: "a" as const, text: "C'est l'année de la création de la Ve République" },
      { id: "b" as const, text: "C'est l'année de la fin de la Seconde Guerre mondiale" },
      { id: "c" as const, text: "C'est l'année de l'abolition de l'esclavage" },
      { id: "d" as const, text: "C'est l'année de la Révolution française" },
    ],
    correctChoice: "a" as const,
  },

  // Q21: "Quel fleuve coule en France ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel fleuve coule en France ?",
    explanationFr:
      "La Loire est le plus long fleuve de France avec environ 1 012 km. Elle traverse le centre de la France du Massif central à l'océan Atlantique.",
    choicesFr: [
      { id: "a" as const, text: "La Loire" },
      { id: "b" as const, text: "Le Danube" },
      { id: "c" as const, text: "Le Nil" },
      { id: "d" as const, text: "L'Amazone" },
    ],
    correctChoice: "a" as const,
  },

  // Q22: "Quelle ville est française ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle ville est française ?",
    explanationFr:
      "Lyon est une grande ville française, chef-lieu de la région Auvergne-Rhône-Alpes. C'est la troisième plus grande ville de France après Paris et Marseille.",
    choicesFr: [
      { id: "a" as const, text: "Lyon" },
      { id: "b" as const, text: "Genève" },
      { id: "c" as const, text: "Bruxelles" },
      { id: "d" as const, text: "Barcelone" },
    ],
    correctChoice: "a" as const,
  },

  // Q23: "Quel océan borde la côte ouest française ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel océan borde la côte ouest française ?",
    explanationFr:
      "L'océan Atlantique borde la côte ouest de la France métropolitaine. De la Bretagne au Pays basque, cette façade maritime s'étend sur des centaines de kilomètres.",
    choicesFr: [
      { id: "a" as const, text: "L'océan Atlantique" },
      { id: "b" as const, text: "L'océan Pacifique" },
      { id: "c" as const, text: "L'océan Indien" },
      { id: "d" as const, text: "L'océan Arctique" },
    ],
    correctChoice: "a" as const,
  },

  // Q24: "Qu'est-ce que Paris ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qu'est-ce que Paris ?",
    explanationFr:
      "Paris est la capitale de la France et son centre politique, économique et culturel. C'est aussi la ville la plus peuplée du pays.",
    choicesFr: [
      { id: "a" as const, text: "La capitale de la France" },
      { id: "b" as const, text: "Une région de France" },
      { id: "c" as const, text: "Un département d'outre-mer" },
      { id: "d" as const, text: "La capitale de l'Europe" },
    ],
    correctChoice: "a" as const,
  },

  // Q25: "Quelle est la capitale de la France ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle est la capitale de la France ?",
    explanationFr:
      "Paris est la capitale de la France depuis des siècles. Elle abrite les principales institutions de l'État, dont le palais de l'Élysée et l'Assemblée nationale.",
    choicesFr: [
      { id: "a" as const, text: "Paris" },
      { id: "b" as const, text: "Lyon" },
      { id: "c" as const, text: "Marseille" },
      { id: "d" as const, text: "Strasbourg" },
    ],
    correctChoice: "a" as const,
  },

  // Q26: "Sur quel continent se situe la France métropolitaine ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Sur quel continent se situe la France métropolitaine ?",
    explanationFr:
      "La France métropolitaine se situe sur le continent européen. Elle est bordée par l'océan Atlantique à l'ouest, la mer Méditerranée au sud et la Manche au nord.",
    choicesFr: [
      { id: "a" as const, text: "L'Europe" },
      { id: "b" as const, text: "L'Afrique" },
      { id: "c" as const, text: "L'Amérique" },
      { id: "d" as const, text: "L'Asie" },
    ],
    correctChoice: "a" as const,
  },

  // Q27: "Quelle île est un département d'outre-mer français ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Quelle île est un département d'outre-mer français ?",
    explanationFr:
      "La Martinique est un département et une région d'outre-mer français situé dans les Antilles. Elle fait partie intégrante de la République française.",
    choicesFr: [
      { id: "a" as const, text: "La Martinique" },
      { id: "b" as const, text: "Cuba" },
      { id: "c" as const, text: "La Jamaïque" },
      { id: "d" as const, text: "Haïti" },
    ],
    correctChoice: "a" as const,
  },

  // Q28: "Combien y a-t-il de régions en France métropolitaine ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Combien y a-t-il de régions en France métropolitaine ?",
    explanationFr:
      "Depuis la réforme territoriale de 2016, la France métropolitaine compte 13 régions. Ce nombre a été réduit de 22 à 13 pour renforcer l'efficacité des collectivités territoriales.",
    choicesFr: [
      { id: "a" as const, text: "13" },
      { id: "b" as const, text: "18" },
      { id: "c" as const, text: "22" },
      { id: "d" as const, text: "10" },
    ],
    correctChoice: "a" as const,
  },

  // Q29: "Quelle ville est un grand port maritime ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle ville est un grand port maritime ?",
    explanationFr:
      "Marseille est le plus grand port maritime de France et l'un des plus importants de la Méditerranée. C'est aussi la deuxième plus grande ville de France.",
    choicesFr: [
      { id: "a" as const, text: "Marseille" },
      { id: "b" as const, text: "Clermont-Ferrand" },
      { id: "c" as const, text: "Grenoble" },
      { id: "d" as const, text: "Limoges" },
    ],
    correctChoice: "a" as const,
  },

  // Q30: "Quelle est la mer au sud de la France métropolitaine ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle est la mer au sud de la France métropolitaine ?",
    explanationFr:
      "La mer Méditerranée borde le sud de la France métropolitaine. Elle s'étend de la frontière espagnole à la frontière italienne, longeant la côte d'Azur et le Languedoc.",
    choicesFr: [
      { id: "a" as const, text: "La mer Méditerranée" },
      { id: "b" as const, text: "La mer du Nord" },
      { id: "c" as const, text: "La mer Baltique" },
      { id: "d" as const, text: "La Manche" },
    ],
    correctChoice: "a" as const,
  },

  // Q31: "Quelle ville est située au bord de la mer Méditerranée ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quelle ville est située au bord de la mer Méditerranée ?",
    explanationFr:
      "Nice est une ville située sur la côte d'Azur, au bord de la mer Méditerranée. C'est l'une des principales destinations touristiques du sud de la France.",
    choicesFr: [
      { id: "a" as const, text: "Nice" },
      { id: "b" as const, text: "Lille" },
      { id: "c" as const, text: "Strasbourg" },
      { id: "d" as const, text: "Rennes" },
    ],
    correctChoice: "a" as const,
  },

  // Q32: "Où se situe la Corse ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Où se situe la Corse ?",
    explanationFr:
      "La Corse est une île située dans la mer Méditerranée, au sud-est de la France métropolitaine. C'est une collectivité territoriale unique qui possède un statut particulier.",
    choicesFr: [
      { id: "a" as const, text: "Dans la mer Méditerranée" },
      { id: "b" as const, text: "Dans l'océan Atlantique" },
      { id: "c" as const, text: "Dans la Manche" },
      { id: "d" as const, text: "Dans la mer du Nord" },
    ],
    correctChoice: "a" as const,
  },

  // Q33: "Quelle chaîne de montagnes est située entre la France et l'Italie ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Quelle chaîne de montagnes est située entre la France et l'Italie ?",
    explanationFr:
      "Les Alpes forment une frontière naturelle entre la France et l'Italie. Le mont Blanc, situé dans les Alpes, est le plus haut sommet d'Europe occidentale avec 4 809 mètres.",
    choicesFr: [
      { id: "a" as const, text: "Les Alpes" },
      { id: "b" as const, text: "Les Pyrénées" },
      { id: "c" as const, text: "Le Jura" },
      { id: "d" as const, text: "Les Vosges" },
    ],
    correctChoice: "a" as const,
  },

  // Q34: "Qui était Molière ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était Molière ?",
    explanationFr:
      "Molière (1622-1673) était un dramaturge et comédien français du XVIIe siècle. Il est l'auteur de célèbres comédies comme Le Malade imaginaire et Le Misanthrope.",
    choicesFr: [
      { id: "a" as const, text: "Un dramaturge et comédien français du XVIIe siècle" },
      { id: "b" as const, text: "Un peintre de la Renaissance" },
      { id: "c" as const, text: "Un compositeur de musique classique" },
      { id: "d" as const, text: "Un philosophe des Lumières" },
    ],
    correctChoice: "a" as const,
  },

  // Q35: "Qui était Charles Baudelaire ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était Charles Baudelaire ?",
    explanationFr:
      "Charles Baudelaire (1821-1867) était un poète français, auteur du célèbre recueil Les Fleurs du mal. Il est considéré comme l'un des précurseurs de la poésie moderne.",
    choicesFr: [
      { id: "a" as const, text: "Un poète français, auteur des Fleurs du mal" },
      { id: "b" as const, text: "Un romancier auteur des Misérables" },
      { id: "c" as const, text: "Un sculpteur du XIXe siècle" },
      { id: "d" as const, text: "Un musicien romantique" },
    ],
    correctChoice: "a" as const,
  },

  // Q36: "Qui était George Sand ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était George Sand ?",
    explanationFr:
      "George Sand (1804-1876) était une romancière française, de son vrai nom Amantine Lucile Aurore Dupin. Elle est connue pour ses romans champêtres et son engagement pour les droits des femmes.",
    choicesFr: [
      { id: "a" as const, text: "Une romancière française du XIXe siècle" },
      { id: "b" as const, text: "Une reine de France" },
      { id: "c" as const, text: "Une scientifique Prix Nobel" },
      { id: "d" as const, text: "Une chanteuse d'opéra" },
    ],
    correctChoice: "a" as const,
  },

  // Q37: "Qui était Simone de Beauvoir ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était Simone de Beauvoir ?",
    explanationFr:
      "Simone de Beauvoir (1908-1986) était une philosophe et écrivaine française, figure majeure du féminisme. Elle est notamment l'auteure du Deuxième Sexe, ouvrage fondateur du féminisme moderne.",
    choicesFr: [
      { id: "a" as const, text: "Une philosophe et écrivaine féministe française" },
      { id: "b" as const, text: "Une résistante de la Seconde Guerre mondiale" },
      { id: "c" as const, text: "Une physicienne française" },
      { id: "d" as const, text: "Une actrice de cinéma française" },
    ],
    correctChoice: "a" as const,
  },

  // Q38: "Qui était Albert Camus ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était Albert Camus ?",
    explanationFr:
      "Albert Camus (1913-1960) était un écrivain et philosophe français, prix Nobel de littérature en 1957. Il est l'auteur de L'Étranger et de La Peste.",
    choicesFr: [
      { id: "a" as const, text: "Un écrivain et philosophe français, prix Nobel de littérature" },
      { id: "b" as const, text: "Un peintre impressionniste" },
      { id: "c" as const, text: "Un homme politique de la IIIe République" },
      { id: "d" as const, text: "Un compositeur de musique classique" },
    ],
    correctChoice: "a" as const,
  },

  // Q39: "Qui était Paul Cézanne ?" — CSP + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp", "nat"] as const,
    textFr: "Qui était Paul Cézanne ?",
    explanationFr:
      "Paul Cézanne (1839-1906) était un peintre français, considéré comme le père de l'art moderne. Ses œuvres ont influencé le cubisme et de nombreux mouvements artistiques du XXe siècle.",
    choicesFr: [
      { id: "a" as const, text: "Un peintre français, précurseur de l'art moderne" },
      { id: "b" as const, text: "Un écrivain naturaliste" },
      { id: "c" as const, text: "Un sculpteur du XVIIIe siècle" },
      { id: "d" as const, text: "Un architecte de la Renaissance" },
    ],
    correctChoice: "a" as const,
  },

  // Q40: "Qui était Marc Chagall ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était Marc Chagall ?",
    explanationFr:
      "Marc Chagall (1887-1985) était un peintre et graveur d'origine russe naturalisé français. Il est célèbre pour ses œuvres colorées mêlant fantaisie et symbolisme, notamment les vitraux de l'opéra de Paris.",
    choicesFr: [
      { id: "a" as const, text: "Un peintre d'origine russe naturalisé français" },
      { id: "b" as const, text: "Un philosophe français des Lumières" },
      { id: "c" as const, text: "Un musicien classique autrichien" },
      { id: "d" as const, text: "Un réalisateur de cinéma italien" },
    ],
    correctChoice: "a" as const,
  },

  // Q41: "Qui était Joséphine Baker ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était Joséphine Baker ?",
    explanationFr:
      "Joséphine Baker (1906-1975) était une artiste franco-américaine, chanteuse et danseuse, résistante pendant la Seconde Guerre mondiale. Elle a été panthéonisée en 2021 pour son engagement.",
    choicesFr: [
      { id: "a" as const, text: "Une artiste franco-américaine, chanteuse, danseuse et résistante" },
      { id: "b" as const, text: "Une scientifique franco-polonaise" },
      { id: "c" as const, text: "Une femme politique française" },
      { id: "d" as const, text: "Une romancière du XIXe siècle" },
    ],
    correctChoice: "a" as const,
  },

  // Q42: "Qui était une chanteuse française célèbre ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était une chanteuse française célèbre ?",
    explanationFr:
      "Édith Piaf (1915-1963) est l'une des chanteuses françaises les plus célèbres au monde. Elle est connue pour des chansons comme La Vie en rose et Non, je ne regrette rien.",
    choicesFr: [
      { id: "a" as const, text: "Édith Piaf" },
      { id: "b" as const, text: "Madonna" },
      { id: "c" as const, text: "Beyoncé" },
      { id: "d" as const, text: "Adele" },
    ],
    correctChoice: "a" as const,
  },

  // Q43: "Qu'est-ce que le Louvre ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qu'est-ce que le Louvre ?",
    explanationFr:
      "Le Louvre est le plus grand musée d'art du monde, situé à Paris. Ancien palais royal, il abrite des œuvres célèbres comme La Joconde de Léonard de Vinci.",
    choicesFr: [
      { id: "a" as const, text: "Le plus grand musée d'art du monde, situé à Paris" },
      { id: "b" as const, text: "Un château de la Loire" },
      { id: "c" as const, text: "Une cathédrale gothique" },
      { id: "d" as const, text: "Un théâtre national" },
    ],
    correctChoice: "a" as const,
  },

  // Q44: "Qui était Jean de la Fontaine ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Qui était Jean de la Fontaine ?",
    explanationFr:
      "Jean de la Fontaine (1621-1695) était un poète français célèbre pour ses Fables. Ses œuvres, comme Le Corbeau et le Renard, sont encore enseignées dans les écoles françaises.",
    choicesFr: [
      { id: "a" as const, text: "Un poète français célèbre pour ses Fables" },
      { id: "b" as const, text: "Un roi de France" },
      { id: "c" as const, text: "Un peintre de la Renaissance" },
      { id: "d" as const, text: "Un explorateur du Nouveau Monde" },
    ],
    correctChoice: "a" as const,
  },

  // Q45: "Quel écrivain est français ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quel écrivain est français ?",
    explanationFr:
      "Victor Hugo (1802-1885) est l'un des plus grands écrivains français. Il est l'auteur de chefs-d'œuvre comme Les Misérables et Notre-Dame de Paris.",
    choicesFr: [
      { id: "a" as const, text: "Victor Hugo" },
      { id: "b" as const, text: "Charles Dickens" },
      { id: "c" as const, text: "Miguel de Cervantes" },
      { id: "d" as const, text: "William Shakespeare" },
    ],
    correctChoice: "a" as const,
  },

  // Q46: "Dans quelle ville se trouve la tour Eiffel ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Dans quelle ville se trouve la tour Eiffel ?",
    explanationFr:
      "La tour Eiffel se trouve à Paris. Construite par Gustave Eiffel pour l'Exposition universelle de 1889, elle est devenue le symbole le plus emblématique de la France.",
    choicesFr: [
      { id: "a" as const, text: "Paris" },
      { id: "b" as const, text: "Lyon" },
      { id: "c" as const, text: "Marseille" },
      { id: "d" as const, text: "Bordeaux" },
    ],
    correctChoice: "a" as const,
  },

  // Q47: "Quand célèbre-t-on Noël ?" — CSP
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 1 as const,
    isPremium: false,
    examTypes: ["csp"] as const,
    textFr: "Quand célèbre-t-on Noël ?",
    explanationFr:
      "Noël est célébré le 25 décembre. C'est un jour férié en France, fête chrétienne devenue aussi une tradition culturelle marquée par les repas en famille et les échanges de cadeaux.",
    choicesFr: [
      { id: "a" as const, text: "Le 25 décembre" },
      { id: "b" as const, text: "Le 1er janvier" },
      { id: "c" as const, text: "Le 14 juillet" },
      { id: "d" as const, text: "Le 1er novembre" },
    ],
    correctChoice: "a" as const,
  },

  // ─── CR-only questions (difficulty 2) ───────────────────────────────────────

  // Q48: "Quel était le surnom de Louis XIV ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel était le surnom de Louis XIV ?",
    explanationFr:
      "Louis XIV était surnommé le Roi-Soleil. Il a régné de 1643 à 1715, soit 72 ans, le plus long règne de l'histoire de France, et a fait construire le château de Versailles.",
    choicesFr: [
      { id: "a" as const, text: "Le Roi-Soleil" },
      { id: "b" as const, text: "Le Roi des rois" },
      { id: "c" as const, text: "Le Bien-Aimé" },
      { id: "d" as const, text: "Le Grand" },
    ],
    correctChoice: "a" as const,
  },

  // Q49: "Quel roi de France a été exécuté pendant la Révolution française ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel roi de France a été exécuté pendant la Révolution française ?",
    explanationFr:
      "Louis XVI a été guillotiné le 21 janvier 1793 place de la Révolution à Paris. Il avait été jugé et condamné à mort par la Convention nationale pour trahison.",
    choicesFr: [
      { id: "a" as const, text: "Louis XVI" },
      { id: "b" as const, text: "Louis XIV" },
      { id: "c" as const, text: "Louis XV" },
      { id: "d" as const, text: "Charles X" },
    ],
    correctChoice: "a" as const,
  },

  // Q50: "En quelle année Napoléon Ier est-il devenu empereur ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "En quelle année Napoléon Ier est-il devenu empereur ?",
    explanationFr:
      "Napoléon Ier est devenu empereur des Français en 1804. Son sacre a eu lieu le 2 décembre 1804 à la cathédrale Notre-Dame de Paris.",
    choicesFr: [
      { id: "a" as const, text: "1804" },
      { id: "b" as const, text: "1789" },
      { id: "c" as const, text: "1799" },
      { id: "d" as const, text: "1815" },
    ],
    correctChoice: "a" as const,
  },

  // Q51: "Lequel de ces personnages a un lien avec la République française ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Lequel de ces personnages a un lien avec la République française ?",
    explanationFr:
      "Marianne est le symbole allégorique de la République française. Elle représente les valeurs de liberté, d'égalité et de fraternité, et son buste est présent dans toutes les mairies.",
    choicesFr: [
      { id: "a" as const, text: "Marianne" },
      { id: "b" as const, text: "Britannia" },
      { id: "c" as const, text: "Uncle Sam" },
      { id: "d" as const, text: "John Bull" },
    ],
    correctChoice: "a" as const,
  },

  // Q52: "De quand date l'appel à la résistance du général de Gaulle ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "De quand date l'appel à la résistance du général de Gaulle ?",
    explanationFr:
      "L'appel du général de Gaulle date du 18 juin 1940. Depuis Londres, il a appelé les Français à résister contre l'occupation allemande via la BBC.",
    choicesFr: [
      { id: "a" as const, text: "Le 18 juin 1940" },
      { id: "b" as const, text: "Le 8 mai 1945" },
      { id: "c" as const, text: "Le 14 juillet 1940" },
      { id: "d" as const, text: "Le 25 août 1944" },
    ],
    correctChoice: "a" as const,
  },

  // Q53: "Pourquoi la Shoah est-elle étudiée à l'école ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Pourquoi la Shoah est-elle étudiée à l'école ?",
    explanationFr:
      "La Shoah est étudiée à l'école pour transmettre la mémoire de ce génocide et sensibiliser les élèves au devoir de mémoire. Cela permet de lutter contre le racisme, l'antisémitisme et toute forme de discrimination.",
    choicesFr: [
      { id: "a" as const, text: "Pour le devoir de mémoire et lutter contre le racisme et l'antisémitisme" },
      { id: "b" as const, text: "Pour préparer les élèves aux examens d'histoire" },
      { id: "c" as const, text: "Pour enseigner la géographie de l'Europe" },
      { id: "d" as const, text: "Pour étudier l'économie de guerre" },
    ],
    correctChoice: "a" as const,
  },

  // Q54: "Quel pays a été colonisé par la France ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel pays a été colonisé par la France ?",
    explanationFr:
      "Le Sénégal a été une colonie française d'Afrique occidentale. Il a obtenu son indépendance en 1960, comme de nombreux pays africains francophones.",
    choicesFr: [
      { id: "a" as const, text: "Le Sénégal" },
      { id: "b" as const, text: "Le Nigeria" },
      { id: "c" as const, text: "L'Afrique du Sud" },
      { id: "d" as const, text: "L'Éthiopie" },
    ],
    correctChoice: "a" as const,
  },

  // Q55: "Depuis quand les Français élisent-ils le président de la République au suffrage universel direct ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Depuis quand les Français élisent-ils le président de la République au suffrage universel direct ?",
    explanationFr:
      "Depuis 1962, les Français élisent le président de la République au suffrage universel direct, suite au référendum voulu par le général de Gaulle. Avant cette date, le président était élu par un collège électoral.",
    choicesFr: [
      { id: "a" as const, text: "1962" },
      { id: "b" as const, text: "1958" },
      { id: "c" as const, text: "1945" },
      { id: "d" as const, text: "1981" },
    ],
    correctChoice: "a" as const,
  },

  // Q56: "Quelle est la première étape de la construction européenne en 1951 ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle est la première étape de la construction européenne en 1951 ?",
    explanationFr:
      "La Communauté européenne du charbon et de l'acier (CECA), créée en 1951, est la première étape de la construction européenne. Elle a été fondée par six pays pour mettre en commun leurs productions de charbon et d'acier.",
    choicesFr: [
      { id: "a" as const, text: "La création de la Communauté européenne du charbon et de l'acier (CECA)" },
      { id: "b" as const, text: "La création de l'Union européenne" },
      { id: "c" as const, text: "La signature du traité de Maastricht" },
      { id: "d" as const, text: "L'adoption de l'euro" },
    ],
    correctChoice: "a" as const,
  },

  // Q57: "Durant le mandat de quel président la peine de mort a-t-elle été abolie ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Durant le mandat de quel président la peine de mort a-t-elle été abolie ?",
    explanationFr:
      "La peine de mort a été abolie en 1981 sous la présidence de François Mitterrand, grâce à l'action du garde des Sceaux Robert Badinter. La France a été l'un des derniers pays d'Europe occidentale à l'abolir.",
    choicesFr: [
      { id: "a" as const, text: "François Mitterrand" },
      { id: "b" as const, text: "Valéry Giscard d'Estaing" },
      { id: "c" as const, text: "Jacques Chirac" },
      { id: "d" as const, text: "Charles de Gaulle" },
    ],
    correctChoice: "a" as const,
  },

  // Q58: "Quel régime politique a été mis en place pendant la Révolution française en 1792 ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel régime politique a été mis en place pendant la Révolution française en 1792 ?",
    explanationFr:
      "La Ire République a été proclamée le 21 septembre 1792, après l'abolition de la monarchie. C'est le premier régime républicain de l'histoire de France.",
    choicesFr: [
      { id: "a" as const, text: "La République (Ire République)" },
      { id: "b" as const, text: "L'Empire" },
      { id: "c" as const, text: "La monarchie constitutionnelle" },
      { id: "d" as const, text: "La dictature militaire" },
    ],
    correctChoice: "a" as const,
  },

  // Q59: "Qui était une figure de la Résistance française pendant la Seconde Guerre mondiale ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qui était une figure de la Résistance française pendant la Seconde Guerre mondiale ?",
    explanationFr:
      "Jean Moulin (1899-1943) était un haut fonctionnaire et résistant français. Il a unifié les mouvements de résistance sous l'autorité du général de Gaulle avant d'être arrêté et tué par la Gestapo.",
    choicesFr: [
      { id: "a" as const, text: "Jean Moulin" },
      { id: "b" as const, text: "Philippe Pétain" },
      { id: "c" as const, text: "Pierre Laval" },
      { id: "d" as const, text: "Adolphe Thiers" },
    ],
    correctChoice: "a" as const,
  },

  // Q60: "En 1944, qu'est-ce qui a changé pour les femmes ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "En 1944, qu'est-ce qui a changé pour les femmes ?",
    explanationFr:
      "En 1944, les femmes ont obtenu le droit de vote en France. Elles ont voté pour la première fois lors des élections municipales du 29 avril 1945.",
    choicesFr: [
      { id: "a" as const, text: "Elles ont obtenu le droit de vote" },
      { id: "b" as const, text: "Elles ont obtenu le droit de travailler" },
      { id: "c" as const, text: "Elles ont obtenu le droit de divorcer" },
      { id: "d" as const, text: "Elles ont obtenu le droit d'ouvrir un compte en banque" },
    ],
    correctChoice: "a" as const,
  },

  // Q61: "Quelle organisation internationale a été créée en 1945 après la Seconde Guerre mondiale ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle organisation internationale a été créée en 1945 après la Seconde Guerre mondiale ?",
    explanationFr:
      "L'Organisation des Nations unies (ONU) a été créée en 1945 pour maintenir la paix et la sécurité internationales. La France en est l'un des cinq membres permanents du Conseil de sécurité.",
    choicesFr: [
      { id: "a" as const, text: "L'Organisation des Nations unies (ONU)" },
      { id: "b" as const, text: "L'Union européenne" },
      { id: "c" as const, text: "L'OTAN" },
      { id: "d" as const, text: "La Croix-Rouge" },
    ],
    correctChoice: "a" as const,
  },

  // Q62: "Quelle peine a été supprimée en 1981 ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle peine a été supprimée en 1981 ?",
    explanationFr:
      "La peine de mort a été abolie en France le 9 octobre 1981 par la loi portée par Robert Badinter. La France rejoint ainsi les pays européens ayant supprimé la peine capitale.",
    choicesFr: [
      { id: "a" as const, text: "La peine de mort" },
      { id: "b" as const, text: "La peine de prison à vie" },
      { id: "c" as const, text: "Les travaux forcés" },
      { id: "d" as const, text: "Le bannissement" },
    ],
    correctChoice: "a" as const,
  },

  // Q63: "En quelle année l'euro est-il devenu la monnaie utilisée en France ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "En quelle année l'euro est-il devenu la monnaie utilisée en France ?",
    explanationFr:
      "L'euro est devenu la monnaie utilisée en France le 1er janvier 2002, remplaçant le franc français. L'euro est aujourd'hui la monnaie commune de 20 pays de la zone euro.",
    choicesFr: [
      { id: "a" as const, text: "2002" },
      { id: "b" as const, text: "1999" },
      { id: "c" as const, text: "1992" },
      { id: "d" as const, text: "2005" },
    ],
    correctChoice: "a" as const,
  },

  // Q64: "En quelle année a commencé la Première Guerre mondiale ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "En quelle année a commencé la Première Guerre mondiale ?",
    explanationFr:
      "La Première Guerre mondiale a commencé en 1914, déclenchée par l'assassinat de l'archiduc François-Ferdinand d'Autriche. La France s'est engagée dans le conflit dès le début.",
    choicesFr: [
      { id: "a" as const, text: "1914" },
      { id: "b" as const, text: "1916" },
      { id: "c" as const, text: "1912" },
      { id: "d" as const, text: "1939" },
    ],
    correctChoice: "a" as const,
  },

  // Q65: "Où a eu lieu le débarquement en 1944 ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Où a eu lieu le débarquement en 1944 ?",
    explanationFr:
      "Le débarquement du 6 juin 1944 (jour J) a eu lieu sur les plages de Normandie. Cette opération militaire alliée a marqué le début de la libération de la France de l'occupation nazie.",
    choicesFr: [
      { id: "a" as const, text: "En Normandie" },
      { id: "b" as const, text: "En Bretagne" },
      { id: "c" as const, text: "En Provence" },
      { id: "d" as const, text: "En Picardie" },
    ],
    correctChoice: "a" as const,
  },

  // Q66: "Quel continent a été le plus concerné par la décolonisation française après la Seconde Guerre mondiale ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel continent a été le plus concerné par la décolonisation française après la Seconde Guerre mondiale ?",
    explanationFr:
      "L'Afrique a été le continent le plus concerné par la décolonisation française. La majorité des colonies françaises d'Afrique ont obtenu leur indépendance dans les années 1960.",
    choicesFr: [
      { id: "a" as const, text: "L'Afrique" },
      { id: "b" as const, text: "L'Asie" },
      { id: "c" as const, text: "L'Amérique du Sud" },
      { id: "d" as const, text: "L'Océanie" },
    ],
    correctChoice: "a" as const,
  },

  // Q67: "Que fête-t-on le 8 mai ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Que fête-t-on le 8 mai ?",
    explanationFr:
      "Le 8 mai commémore la fin de la Seconde Guerre mondiale en Europe (victoire des Alliés sur l'Allemagne nazie en 1945). C'est un jour férié en France.",
    choicesFr: [
      { id: "a" as const, text: "La fin de la Seconde Guerre mondiale en Europe" },
      { id: "b" as const, text: "La fête du Travail" },
      { id: "c" as const, text: "L'armistice de la Première Guerre mondiale" },
      { id: "d" as const, text: "La fête nationale" },
    ],
    correctChoice: "a" as const,
  },

  // Q68: "Quelle mer ou océan borde la France métropolitaine ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle mer ou océan borde la France métropolitaine ?",
    explanationFr:
      "La mer Méditerranée borde le sud de la France métropolitaine. La France est aussi bordée par l'océan Atlantique à l'ouest et la Manche au nord.",
    choicesFr: [
      { id: "a" as const, text: "La mer Méditerranée" },
      { id: "b" as const, text: "La mer Caspienne" },
      { id: "c" as const, text: "La mer Noire" },
      { id: "d" as const, text: "La mer Rouge" },
    ],
    correctChoice: "a" as const,
  },

  // Q69: "Quel pays a une frontière terrestre avec la France métropolitaine ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel pays a une frontière terrestre avec la France métropolitaine ?",
    explanationFr:
      "L'Espagne partage une frontière terrestre avec la France au sud, le long des Pyrénées. La France métropolitaine a aussi des frontières avec la Belgique, le Luxembourg, l'Allemagne, la Suisse, l'Italie et Monaco.",
    choicesFr: [
      { id: "a" as const, text: "L'Espagne" },
      { id: "b" as const, text: "Le Portugal" },
      { id: "c" as const, text: "L'Angleterre" },
      { id: "d" as const, text: "La Pologne" },
    ],
    correctChoice: "a" as const,
  },

  // Q70: "Quelle ville française est un port maritime ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle ville française est un port maritime ?",
    explanationFr:
      "Le Havre est un grand port maritime français situé en Normandie, à l'embouchure de la Seine. C'est l'un des plus importants ports de commerce de France.",
    choicesFr: [
      { id: "a" as const, text: "Le Havre" },
      { id: "b" as const, text: "Toulouse" },
      { id: "c" as const, text: "Clermont-Ferrand" },
      { id: "d" as const, text: "Strasbourg" },
    ],
    correctChoice: "a" as const,
  },

  // Q71: "Quelle mer se situe entre la France et l'Angleterre ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle mer se situe entre la France et l'Angleterre ?",
    explanationFr:
      "La Manche sépare la France de l'Angleterre. Elle relie l'océan Atlantique à la mer du Nord et est traversée par le tunnel sous la Manche depuis 1994.",
    choicesFr: [
      { id: "a" as const, text: "La Manche" },
      { id: "b" as const, text: "La mer du Nord" },
      { id: "c" as const, text: "La mer Méditerranée" },
      { id: "d" as const, text: "La mer Baltique" },
    ],
    correctChoice: "a" as const,
  },

  // Q72: "Qu'est-ce que la France d'outre-mer ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qu'est-ce que la France d'outre-mer ?",
    explanationFr:
      "La France d'outre-mer désigne l'ensemble des territoires français situés hors de l'Europe. Elle comprend des départements (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte) et des collectivités d'outre-mer.",
    choicesFr: [
      { id: "a" as const, text: "L'ensemble des territoires français situés hors de l'Europe" },
      { id: "b" as const, text: "Les régions du sud de la France" },
      { id: "c" as const, text: "Les anciennes colonies françaises indépendantes" },
      { id: "d" as const, text: "Les pays francophones d'Afrique" },
    ],
    correctChoice: "a" as const,
  },

  // Q73: "Quelle chaîne de montagnes est située entre la France et l'Espagne ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle chaîne de montagnes est située entre la France et l'Espagne ?",
    explanationFr:
      "Les Pyrénées forment une frontière naturelle entre la France et l'Espagne sur environ 430 km. Leur point culminant est le pic d'Aneto (3 404 m) côté espagnol.",
    choicesFr: [
      { id: "a" as const, text: "Les Pyrénées" },
      { id: "b" as const, text: "Les Alpes" },
      { id: "c" as const, text: "Le Jura" },
      { id: "d" as const, text: "Les Vosges" },
    ],
    correctChoice: "a" as const,
  },

  // Q74: "Quelle île française se trouve dans l'océan Indien ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle île française se trouve dans l'océan Indien ?",
    explanationFr:
      "La Réunion est un département français d'outre-mer situé dans l'océan Indien, à l'est de Madagascar. C'est une île volcanique d'environ 900 000 habitants.",
    choicesFr: [
      { id: "a" as const, text: "La Réunion" },
      { id: "b" as const, text: "La Martinique" },
      { id: "c" as const, text: "La Guadeloupe" },
      { id: "d" as const, text: "La Corse" },
    ],
    correctChoice: "a" as const,
  },

  // Q75: "Quelle est la population approximative de la France en 2025 ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle est la population approximative de la France en 2025 ?",
    explanationFr:
      "La France compte environ 68 millions d'habitants en 2025, en incluant les territoires d'outre-mer. C'est le deuxième pays le plus peuplé de l'Union européenne après l'Allemagne.",
    choicesFr: [
      { id: "a" as const, text: "68 millions d'habitants" },
      { id: "b" as const, text: "50 millions d'habitants" },
      { id: "c" as const, text: "80 millions d'habitants" },
      { id: "d" as const, text: "45 millions d'habitants" },
    ],
    correctChoice: "a" as const,
  },

  // Q76: "Quel fleuve traverse Paris ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel fleuve traverse Paris ?",
    explanationFr:
      "La Seine traverse Paris d'est en ouest. Ce fleuve de 776 km prend sa source en Bourgogne et se jette dans la Manche au Havre.",
    choicesFr: [
      { id: "a" as const, text: "La Seine" },
      { id: "b" as const, text: "La Loire" },
      { id: "c" as const, text: "Le Rhône" },
      { id: "d" as const, text: "La Garonne" },
    ],
    correctChoice: "a" as const,
  },

  // Q77: "Lequel de ces pays partage des frontières terrestres avec la France ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Lequel de ces pays partage des frontières terrestres avec la France ?",
    explanationFr:
      "La Belgique partage une frontière terrestre avec la France au nord. Les deux pays sont voisins et partenaires au sein de l'Union européenne.",
    choicesFr: [
      { id: "a" as const, text: "La Belgique" },
      { id: "b" as const, text: "Les Pays-Bas" },
      { id: "c" as const, text: "Le Royaume-Uni" },
      { id: "d" as const, text: "Le Danemark" },
    ],
    correctChoice: "a" as const,
  },

  // Q78: "Quel pays a une frontière avec la France métropolitaine au nord-est ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel pays a une frontière avec la France métropolitaine au nord-est ?",
    explanationFr:
      "L'Allemagne partage une frontière avec la France au nord-est, le long du Rhin. Cette frontière a été le théâtre de nombreux conflits avant de devenir un symbole de la réconciliation franco-allemande.",
    choicesFr: [
      { id: "a" as const, text: "L'Allemagne" },
      { id: "b" as const, text: "La Pologne" },
      { id: "c" as const, text: "L'Autriche" },
      { id: "d" as const, text: "La République tchèque" },
    ],
    correctChoice: "a" as const,
  },

  // Q79: "Où se trouvent les principales activités économiques en France ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Où se trouvent les principales activités économiques en France ?",
    explanationFr:
      "Les principales activités économiques en France se concentrent dans les grandes métropoles, en particulier la région parisienne (Île-de-France). Lyon, Marseille et d'autres grandes villes sont aussi des pôles économiques majeurs.",
    choicesFr: [
      { id: "a" as const, text: "Dans les grandes métropoles et la région parisienne" },
      { id: "b" as const, text: "Uniquement dans le sud de la France" },
      { id: "c" as const, text: "Principalement dans les zones rurales" },
      { id: "d" as const, text: "Exclusivement sur les côtes" },
    ],
    correctChoice: "a" as const,
  },

  // Q80: "Parmi ces pays, lequel attire le plus de visiteurs chaque année ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Parmi ces pays, lequel attire le plus de visiteurs chaque année ?",
    explanationFr:
      "La France est la première destination touristique mondiale avec environ 90 millions de visiteurs étrangers par an. Son patrimoine culturel, sa gastronomie et ses paysages variés attirent des touristes du monde entier.",
    choicesFr: [
      { id: "a" as const, text: "La France" },
      { id: "b" as const, text: "L'Italie" },
      { id: "c" as const, text: "Les États-Unis" },
      { id: "d" as const, text: "L'Espagne" },
    ],
    correctChoice: "a" as const,
  },

  // Q81: "Où habite la majorité des Français ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Où habite la majorité des Français ?",
    explanationFr:
      "La majorité des Français habite en ville (environ 80 % de la population est urbaine). Les grandes agglomérations comme Paris, Lyon et Marseille concentrent une part importante de la population.",
    choicesFr: [
      { id: "a" as const, text: "En ville" },
      { id: "b" as const, text: "À la campagne" },
      { id: "c" as const, text: "En montagne" },
      { id: "d" as const, text: "Sur le littoral" },
    ],
    correctChoice: "a" as const,
  },

  // Q82: "Quelle région est la plus peuplée ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle région est la plus peuplée ?",
    explanationFr:
      "L'Île-de-France est la région la plus peuplée de France avec environ 12 millions d'habitants. Elle comprend Paris et sa banlieue, concentrant un cinquième de la population française.",
    choicesFr: [
      { id: "a" as const, text: "L'Île-de-France" },
      { id: "b" as const, text: "La Provence-Alpes-Côte d'Azur" },
      { id: "c" as const, text: "L'Occitanie" },
      { id: "d" as const, text: "La Nouvelle-Aquitaine" },
    ],
    correctChoice: "a" as const,
  },

  // Q83: "Quelle ville française fait partie des 10 plus grandes métropoles du pays ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quelle ville française fait partie des 10 plus grandes métropoles du pays ?",
    explanationFr:
      "Toulouse fait partie des 10 plus grandes métropoles de France. C'est la quatrième ville de France par sa population et un pôle majeur de l'industrie aéronautique.",
    choicesFr: [
      { id: "a" as const, text: "Toulouse" },
      { id: "b" as const, text: "Bâle" },
      { id: "c" as const, text: "Lausanne" },
      { id: "d" as const, text: "Charleroi" },
    ],
    correctChoice: "a" as const,
  },

  // Q84: "Lequel de ces départements de France est le plus touristique ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Lequel de ces départements de France est le plus touristique ?",
    explanationFr:
      "Paris (département 75) est le département le plus touristique de France. La capitale attire des millions de visiteurs chaque année grâce à ses monuments, musées et sa vie culturelle.",
    choicesFr: [
      { id: "a" as const, text: "Paris" },
      { id: "b" as const, text: "La Creuse" },
      { id: "c" as const, text: "Le Cantal" },
      { id: "d" as const, text: "La Lozère" },
    ],
    correctChoice: "a" as const,
  },

  // Q85: "Quand peut-on visiter gratuitement des lieux culturels en France ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quand peut-on visiter gratuitement des lieux culturels en France ?",
    explanationFr:
      "Les Journées européennes du patrimoine, organisées chaque année en septembre, permettent de visiter gratuitement de nombreux lieux culturels et monuments historiques en France.",
    choicesFr: [
      { id: "a" as const, text: "Pendant les Journées européennes du patrimoine" },
      { id: "b" as const, text: "Le 14 juillet uniquement" },
      { id: "c" as const, text: "Tous les dimanches de l'année" },
      { id: "d" as const, text: "Pendant les vacances scolaires" },
    ],
    correctChoice: "a" as const,
  },

  // Q86: "Combien de personnes parlent français dans le monde ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Combien de personnes parlent français dans le monde ?",
    explanationFr:
      "Environ 300 millions de personnes parlent français dans le monde. Le français est la cinquième langue la plus parlée et est langue officielle dans 29 pays.",
    choicesFr: [
      { id: "a" as const, text: "Environ 300 millions" },
      { id: "b" as const, text: "Environ 100 millions" },
      { id: "c" as const, text: "Environ 500 millions" },
      { id: "d" as const, text: "Environ 50 millions" },
    ],
    correctChoice: "a" as const,
  },

  // Q87: "Qui était Marguerite Yourcenar ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qui était Marguerite Yourcenar ?",
    explanationFr:
      "Marguerite Yourcenar (1903-1987) était une écrivaine française, première femme élue à l'Académie française en 1980. Elle est connue pour ses romans historiques comme Mémoires d'Hadrien.",
    choicesFr: [
      { id: "a" as const, text: "La première femme élue à l'Académie française" },
      { id: "b" as const, text: "Une scientifique Prix Nobel de physique" },
      { id: "c" as const, text: "Une exploratrice du XIXe siècle" },
      { id: "d" as const, text: "Une compositrice de musique baroque" },
    ],
    correctChoice: "a" as const,
  },

  // Q88: "Quel peintre est français ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel peintre est français ?",
    explanationFr:
      "Claude Monet (1840-1926) était un peintre français, fondateur du mouvement impressionniste. Il est célèbre pour ses séries de peintures des Nymphéas et de la cathédrale de Rouen.",
    choicesFr: [
      { id: "a" as const, text: "Claude Monet" },
      { id: "b" as const, text: "Pablo Picasso" },
      { id: "c" as const, text: "Vincent van Gogh" },
      { id: "d" as const, text: "Salvador Dalí" },
    ],
    correctChoice: "a" as const,
  },

  // Q89: "Quel musée est situé à Paris ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Quel musée est situé à Paris ?",
    explanationFr:
      "Le musée d'Orsay est situé à Paris, dans une ancienne gare ferroviaire. Il abrite la plus grande collection d'art impressionniste et post-impressionniste au monde.",
    choicesFr: [
      { id: "a" as const, text: "Le musée d'Orsay" },
      { id: "b" as const, text: "Le British Museum" },
      { id: "c" as const, text: "Le musée du Prado" },
      { id: "d" as const, text: "Le Metropolitan Museum" },
    ],
    correctChoice: "a" as const,
  },

  // Q90: "Qui était Auguste Rodin ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qui était Auguste Rodin ?",
    explanationFr:
      "Auguste Rodin (1840-1917) était un sculpteur français, considéré comme le père de la sculpture moderne. Il est l'auteur du Penseur et des Bourgeois de Calais.",
    choicesFr: [
      { id: "a" as const, text: "Un sculpteur français, auteur du Penseur" },
      { id: "b" as const, text: "Un peintre impressionniste" },
      { id: "c" as const, text: "Un architecte de la tour Eiffel" },
      { id: "d" as const, text: "Un écrivain romantique" },
    ],
    correctChoice: "a" as const,
  },

  // Q91: "Quel est le classement de la langue française parmi les langues les plus parlées dans le monde ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quel est le classement de la langue française parmi les langues les plus parlées dans le monde ?",
    explanationFr:
      "Le français est la cinquième langue la plus parlée dans le monde. Elle est langue officielle dans 29 pays et est parlée sur les cinq continents.",
    choicesFr: [
      { id: "a" as const, text: "5e langue la plus parlée" },
      { id: "b" as const, text: "2e langue la plus parlée" },
      { id: "c" as const, text: "10e langue la plus parlée" },
      { id: "d" as const, text: "1re langue la plus parlée" },
    ],
    correctChoice: "a" as const,
  },

  // Q92: "Quelle cathédrale célèbre a été en partie détruite par un incendie en 2019 ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle cathédrale célèbre a été en partie détruite par un incendie en 2019 ?",
    explanationFr:
      "La cathédrale Notre-Dame de Paris a été gravement endommagée par un incendie le 15 avril 2019. Sa flèche et une partie de la toiture se sont effondrées. Elle a été restaurée et rouverte en décembre 2024.",
    choicesFr: [
      { id: "a" as const, text: "Notre-Dame de Paris" },
      { id: "b" as const, text: "La cathédrale de Reims" },
      { id: "c" as const, text: "La cathédrale de Chartres" },
      { id: "d" as const, text: "La cathédrale de Strasbourg" },
    ],
    correctChoice: "a" as const,
  },

  // Q93: "Qui était une écrivaine française célèbre ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Qui était une écrivaine française célèbre ?",
    explanationFr:
      "Colette (1873-1954) était une romancière française célèbre, auteure de nombreux romans comme la série des Claudine. Elle a été la deuxième femme à recevoir des funérailles nationales en France.",
    choicesFr: [
      { id: "a" as const, text: "Colette" },
      { id: "b" as const, text: "Jane Austen" },
      { id: "c" as const, text: "Virginia Woolf" },
      { id: "d" as const, text: "Agatha Christie" },
    ],
    correctChoice: "a" as const,
  },

  // Q94: "Qui était un célèbre musicien français ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Qui était un célèbre musicien français ?",
    explanationFr:
      "Claude Debussy (1862-1918) était un compositeur français, figure majeure de la musique impressionniste. Il est notamment connu pour Clair de lune et La Mer.",
    choicesFr: [
      { id: "a" as const, text: "Claude Debussy" },
      { id: "b" as const, text: "Ludwig van Beethoven" },
      { id: "c" as const, text: "Wolfgang Amadeus Mozart" },
      { id: "d" as const, text: "Johann Sebastian Bach" },
    ],
    correctChoice: "a" as const,
  },

  // Q95: "Qui était Auguste Renoir ?" — CR + NAT
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr", "nat"] as const,
    textFr: "Qui était Auguste Renoir ?",
    explanationFr:
      "Auguste Renoir (1841-1919) était un peintre français, l'un des grands maîtres de l'impressionnisme. Il est célèbre pour ses scènes de la vie quotidienne et ses portraits lumineux.",
    choicesFr: [
      { id: "a" as const, text: "Un peintre impressionniste français" },
      { id: "b" as const, text: "Un sculpteur du XVIIIe siècle" },
      { id: "c" as const, text: "Un écrivain réaliste" },
      { id: "d" as const, text: "Un architecte de la Renaissance" },
    ],
    correctChoice: "a" as const,
  },

  // Q96: "Quelle fête est française ?" — CR only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 2 as const,
    isPremium: false,
    examTypes: ["cr"] as const,
    textFr: "Quelle fête est française ?",
    explanationFr:
      "La Fête de la musique, célébrée le 21 juin, est une fête d'origine française créée en 1982 par Jack Lang. Elle est aujourd'hui célébrée dans de nombreux pays du monde.",
    choicesFr: [
      { id: "a" as const, text: "La Fête de la musique" },
      { id: "b" as const, text: "Thanksgiving" },
      { id: "c" as const, text: "Halloween" },
      { id: "d" as const, text: "La Saint-Patrick" },
    ],
    correctChoice: "a" as const,
  },

  // ─── NAT-only questions (difficulty 3) ──────────────────────────────────────

  // Q97: "Parmi ces textes, lequel a été adopté sous Napoléon Ier ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Parmi ces textes, lequel a été adopté sous Napoléon Ier ?",
    explanationFr:
      "Le Code civil a été adopté en 1804 sous Napoléon Ier. Aussi appelé Code Napoléon, il a unifié le droit français et reste le fondement du droit civil en France.",
    choicesFr: [
      { id: "a" as const, text: "Le Code civil" },
      { id: "b" as const, text: "La Déclaration des droits de l'homme et du citoyen" },
      { id: "c" as const, text: "La loi de séparation des Églises et de l'État" },
      { id: "d" as const, text: "La Constitution de la Ve République" },
    ],
    correctChoice: "a" as const,
  },

  // Q98: "Qui a été président de la Ve République ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui a été président de la Ve République ?",
    explanationFr:
      "Jacques Chirac a été président de la Ve République de 1995 à 2007. Il a été le cinquième président de la Ve République, précédé par François Mitterrand.",
    choicesFr: [
      { id: "a" as const, text: "Jacques Chirac" },
      { id: "b" as const, text: "Winston Churchill" },
      { id: "c" as const, text: "Konrad Adenauer" },
      { id: "d" as const, text: "Benito Mussolini" },
    ],
    correctChoice: "a" as const,
  },

  // Q99: "Que signifie la date du 14 juillet pour les Français ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Que signifie la date du 14 juillet pour les Français ?",
    explanationFr:
      "Le 14 juillet est la fête nationale française. Elle commémore la prise de la Bastille en 1789, symbole de la fin de l'absolutisme, et la Fête de la Fédération de 1790.",
    choicesFr: [
      { id: "a" as const, text: "C'est la fête nationale, commémorant la prise de la Bastille" },
      { id: "b" as const, text: "C'est l'anniversaire de la Constitution" },
      { id: "c" as const, text: "C'est la fête de l'Europe" },
      { id: "d" as const, text: "C'est le jour de l'armistice" },
    ],
    correctChoice: "a" as const,
  },

  // Q100: "Lequel de ces pays est un pays fondateur de l'Union européenne ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Lequel de ces pays est un pays fondateur de l'Union européenne ?",
    explanationFr:
      "La France est l'un des six pays fondateurs de la construction européenne avec l'Allemagne, l'Italie, la Belgique, les Pays-Bas et le Luxembourg. La CECA a été créée en 1951.",
    choicesFr: [
      { id: "a" as const, text: "La France" },
      { id: "b" as const, text: "Le Royaume-Uni" },
      { id: "c" as const, text: "L'Espagne" },
      { id: "d" as const, text: "La Pologne" },
    ],
    correctChoice: "a" as const,
  },

  // Q101: "Dans quelle région est située une partie des plages du débarquement ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Dans quelle région est située une partie des plages du débarquement ?",
    explanationFr:
      "Les plages du débarquement du 6 juin 1944 sont situées en Normandie. Les cinq plages (Utah, Omaha, Gold, Juno, Sword) sont des lieux de mémoire majeurs.",
    choicesFr: [
      { id: "a" as const, text: "La Normandie" },
      { id: "b" as const, text: "La Bretagne" },
      { id: "c" as const, text: "La Picardie" },
      { id: "d" as const, text: "L'Aquitaine" },
    ],
    correctChoice: "a" as const,
  },

  // Q102: "Dans quelle ville les rois de France étaient-ils couronnés ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Dans quelle ville les rois de France étaient-ils couronnés ?",
    explanationFr:
      "Les rois de France étaient traditionnellement couronnés dans la cathédrale de Reims. Cette tradition remonte au baptême de Clovis vers 496 et a perduré pendant des siècles.",
    choicesFr: [
      { id: "a" as const, text: "Reims" },
      { id: "b" as const, text: "Paris" },
      { id: "c" as const, text: "Versailles" },
      { id: "d" as const, text: "Orléans" },
    ],
    correctChoice: "a" as const,
  },

  // Q103: "En quelle année l'Union européenne a-t-elle été fondée ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "En quelle année l'Union européenne a-t-elle été fondée ?",
    explanationFr:
      "L'Union européenne a été fondée en 1992 par le traité de Maastricht. Ce traité a transformé la Communauté économique européenne en Union européenne et a posé les bases de la monnaie unique.",
    choicesFr: [
      { id: "a" as const, text: "1992" },
      { id: "b" as const, text: "1957" },
      { id: "c" as const, text: "2002" },
      { id: "d" as const, text: "1951" },
    ],
    correctChoice: "a" as const,
  },

  // Q104: "Qui a aboli l'esclavage en France ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui a aboli l'esclavage en France ?",
    explanationFr:
      "Victor Schœlcher est à l'origine du décret d'abolition définitive de l'esclavage en France le 27 avril 1848. Il était alors sous-secrétaire d'État aux colonies sous la IIe République.",
    choicesFr: [
      { id: "a" as const, text: "Victor Schœlcher" },
      { id: "b" as const, text: "Napoléon Bonaparte" },
      { id: "c" as const, text: "Jules Ferry" },
      { id: "d" as const, text: "Léon Gambetta" },
    ],
    correctChoice: "a" as const,
  },

  // Q105: "Lors de la Seconde Guerre mondiale, à quelle date Paris a-t-elle été libérée ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Lors de la Seconde Guerre mondiale, à quelle date Paris a-t-elle été libérée ?",
    explanationFr:
      "Paris a été libérée le 25 août 1944 après une insurrection populaire et l'arrivée de la 2e division blindée du général Leclerc. Cet événement marque un tournant dans la libération de la France.",
    choicesFr: [
      { id: "a" as const, text: "Le 25 août 1944" },
      { id: "b" as const, text: "Le 6 juin 1944" },
      { id: "c" as const, text: "Le 8 mai 1945" },
      { id: "d" as const, text: "Le 18 juin 1940" },
    ],
    correctChoice: "a" as const,
  },

  // Q106: "Quel était le principal port français impliqué dans la traite négrière au XVIIIe siècle ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel était le principal port français impliqué dans la traite négrière au XVIIIe siècle ?",
    explanationFr:
      "Nantes était le principal port français impliqué dans la traite négrière au XVIIIe siècle. La ville a organisé le plus grand nombre d'expéditions négrières françaises et possède aujourd'hui un mémorial de l'abolition de l'esclavage.",
    choicesFr: [
      { id: "a" as const, text: "Nantes" },
      { id: "b" as const, text: "Marseille" },
      { id: "c" as const, text: "Le Havre" },
      { id: "d" as const, text: "Brest" },
    ],
    correctChoice: "a" as const,
  },

  // Q107: "Quel célèbre philosophe des Lumières a dénoncé l'esclavage ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel célèbre philosophe des Lumières a dénoncé l'esclavage ?",
    explanationFr:
      "Voltaire (1694-1778) était un philosophe des Lumières qui a dénoncé l'esclavage, notamment dans Candide. Les philosophes des Lumières ont joué un rôle majeur dans la remise en cause de cette pratique.",
    choicesFr: [
      { id: "a" as const, text: "Voltaire" },
      { id: "b" as const, text: "Napoléon Bonaparte" },
      { id: "c" as const, text: "Louis XIV" },
      { id: "d" as const, text: "Richelieu" },
    ],
    correctChoice: "a" as const,
  },

  // Q108: "Quel plat est une spécialité de la cuisine française ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel plat est une spécialité de la cuisine française ?",
    explanationFr:
      "Le coq au vin est un plat traditionnel de la cuisine française, à base de poulet mijoté dans du vin rouge avec des lardons et des champignons. La gastronomie française est inscrite au patrimoine immatériel de l'UNESCO.",
    choicesFr: [
      { id: "a" as const, text: "Le coq au vin" },
      { id: "b" as const, text: "La paella" },
      { id: "c" as const, text: "Les sushis" },
      { id: "d" as const, text: "Le fish and chips" },
    ],
    correctChoice: "a" as const,
  },

  // Q109: "Qui était Marie Curie ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui était Marie Curie ?",
    explanationFr:
      "Marie Curie (1867-1934) était une physicienne et chimiste franco-polonaise, première femme à recevoir un prix Nobel. Elle a obtenu deux prix Nobel (physique en 1903 et chimie en 1911) pour ses travaux sur la radioactivité.",
    choicesFr: [
      { id: "a" as const, text: "Une physicienne franco-polonaise, double prix Nobel" },
      { id: "b" as const, text: "Une romancière française du XIXe siècle" },
      { id: "c" as const, text: "Une résistante de la Seconde Guerre mondiale" },
      { id: "d" as const, text: "Une reine de France" },
    ],
    correctChoice: "a" as const,
  },

  // Q110: "Qui a peint « La Liberté guidant le peuple » ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui a peint « La Liberté guidant le peuple » ?",
    explanationFr:
      "Eugène Delacroix a peint La Liberté guidant le peuple en 1830. Ce tableau célèbre représente la révolution de Juillet 1830 et est exposé au musée du Louvre.",
    choicesFr: [
      { id: "a" as const, text: "Eugène Delacroix" },
      { id: "b" as const, text: "Claude Monet" },
      { id: "c" as const, text: "Paul Cézanne" },
      { id: "d" as const, text: "Auguste Renoir" },
    ],
    correctChoice: "a" as const,
  },

  // Q111: "Dans quel grand musée parisien est exposée la Joconde ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Dans quel grand musée parisien est exposée la Joconde ?",
    explanationFr:
      "La Joconde (ou Mona Lisa) de Léonard de Vinci est exposée au musée du Louvre à Paris. C'est le tableau le plus célèbre du monde et l'un des joyaux de la collection du musée.",
    choicesFr: [
      { id: "a" as const, text: "Le musée du Louvre" },
      { id: "b" as const, text: "Le musée d'Orsay" },
      { id: "c" as const, text: "Le Centre Pompidou" },
      { id: "d" as const, text: "Le musée Rodin" },
    ],
    correctChoice: "a" as const,
  },

  // Q112: "Quel château célèbre se trouve près de Paris et symbolise le pouvoir royal de Louis XIV ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel château célèbre se trouve près de Paris et symbolise le pouvoir royal de Louis XIV ?",
    explanationFr:
      "Le château de Versailles a été la résidence principale des rois de France de Louis XIV à Louis XVI. Construit au XVIIe siècle, il symbolise la puissance de la monarchie absolue.",
    choicesFr: [
      { id: "a" as const, text: "Le château de Versailles" },
      { id: "b" as const, text: "Le château de Chambord" },
      { id: "c" as const, text: "Le château de Fontainebleau" },
      { id: "d" as const, text: "Le château de Chenonceau" },
    ],
    correctChoice: "a" as const,
  },

  // Q113: "Où peut-on voir des peintures préhistoriques en France ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Où peut-on voir des peintures préhistoriques en France ?",
    explanationFr:
      "La grotte de Lascaux, en Dordogne, abrite des peintures préhistoriques datant d'environ 17 000 ans. Découverte en 1940, elle est surnommée la « chapelle Sixtine de la Préhistoire ».",
    choicesFr: [
      { id: "a" as const, text: "Dans la grotte de Lascaux" },
      { id: "b" as const, text: "Au château de Versailles" },
      { id: "c" as const, text: "Au musée du Louvre" },
      { id: "d" as const, text: "Dans la cathédrale de Chartres" },
    ],
    correctChoice: "a" as const,
  },

  // Q114: "Quel peintre célèbre a peint les Nymphéas ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel peintre célèbre a peint les Nymphéas ?",
    explanationFr:
      "Claude Monet a peint la célèbre série des Nymphéas dans son jardin de Giverny. Ces tableaux impressionnistes, peints entre 1895 et 1926, sont exposés au musée de l'Orangerie à Paris.",
    choicesFr: [
      { id: "a" as const, text: "Claude Monet" },
      { id: "b" as const, text: "Edgar Degas" },
      { id: "c" as const, text: "Paul Gauguin" },
      { id: "d" as const, text: "Édouard Manet" },
    ],
    correctChoice: "a" as const,
  },

  // Q115: "Que symbolise le 1er mai ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Que symbolise le 1er mai ?",
    explanationFr:
      "Le 1er mai est la fête du Travail en France, jour férié depuis 1947. C'est une journée de célébration des droits des travailleurs, traditionnellement marquée par l'offre de brins de muguet.",
    choicesFr: [
      { id: "a" as const, text: "La fête du Travail" },
      { id: "b" as const, text: "La fête nationale" },
      { id: "c" as const, text: "La fête de la musique" },
      { id: "d" as const, text: "La fête de la Victoire" },
    ],
    correctChoice: "a" as const,
  },

  // Q116: "Qui était Monsieur Rouget de Lisle ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui était Monsieur Rouget de Lisle ?",
    explanationFr:
      "Claude Joseph Rouget de Lisle (1760-1836) était un officier et compositeur français, auteur de La Marseillaise en 1792. Ce chant patriotique est devenu l'hymne national français.",
    choicesFr: [
      { id: "a" as const, text: "Le compositeur de La Marseillaise" },
      { id: "b" as const, text: "Le fondateur de la Ve République" },
      { id: "c" as const, text: "Un général de Napoléon" },
      { id: "d" as const, text: "Un philosophe des Lumières" },
    ],
    correctChoice: "a" as const,
  },

  // Q117: "À quelle occasion a été construite la tour Eiffel ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "À quelle occasion a été construite la tour Eiffel ?",
    explanationFr:
      "La tour Eiffel a été construite pour l'Exposition universelle de 1889, qui célébrait le centenaire de la Révolution française. Conçue par Gustave Eiffel, elle devait être démontée après l'exposition.",
    choicesFr: [
      { id: "a" as const, text: "L'Exposition universelle de 1889" },
      { id: "b" as const, text: "Les Jeux olympiques de 1900" },
      { id: "c" as const, text: "La victoire de 1918" },
      { id: "d" as const, text: "Le couronnement de Napoléon" },
    ],
    correctChoice: "a" as const,
  },

  // Q118: "Qui était un célèbre compositeur français ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Qui était un célèbre compositeur français ?",
    explanationFr:
      "Maurice Ravel (1875-1937) était un compositeur français, auteur du célèbre Boléro. Il est l'un des plus grands compositeurs français du XXe siècle avec Claude Debussy.",
    choicesFr: [
      { id: "a" as const, text: "Maurice Ravel" },
      { id: "b" as const, text: "Giuseppe Verdi" },
      { id: "c" as const, text: "Richard Wagner" },
      { id: "d" as const, text: "Piotr Tchaïkovski" },
    ],
    correctChoice: "a" as const,
  },

  // Q119: "Quel monument historique se trouve sur une île en Normandie ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel monument historique se trouve sur une île en Normandie ?",
    explanationFr:
      "Le Mont-Saint-Michel est une abbaye médiévale située sur un îlot rocheux en Normandie. C'est l'un des sites les plus visités de France et il est classé au patrimoine mondial de l'UNESCO.",
    choicesFr: [
      { id: "a" as const, text: "Le Mont-Saint-Michel" },
      { id: "b" as const, text: "Le château de Chambord" },
      { id: "c" as const, text: "Le pont du Gard" },
      { id: "d" as const, text: "La cité de Carcassonne" },
    ],
    correctChoice: "a" as const,
  },

  // Q120: "Quelle île fait partie des Antilles françaises ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle île fait partie des Antilles françaises ?",
    explanationFr:
      "La Guadeloupe fait partie des Antilles françaises, dans la mer des Caraïbes. C'est un département et une région d'outre-mer français composé de plusieurs îles.",
    choicesFr: [
      { id: "a" as const, text: "La Guadeloupe" },
      { id: "b" as const, text: "Cuba" },
      { id: "c" as const, text: "La Jamaïque" },
      { id: "d" as const, text: "Porto Rico" },
    ],
    correctChoice: "a" as const,
  },

  // Q121: "Quelle île est française ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle île est française ?",
    explanationFr:
      "La Nouvelle-Calédonie est un territoire français situé dans l'océan Pacifique. C'est une collectivité sui generis de la France avec un statut particulier au sein de la République.",
    choicesFr: [
      { id: "a" as const, text: "La Nouvelle-Calédonie" },
      { id: "b" as const, text: "Les Bahamas" },
      { id: "c" as const, text: "Les Maldives" },
      { id: "d" as const, text: "Bornéo" },
    ],
    correctChoice: "a" as const,
  },

  // Q122: "Quelle est la plus haute montagne de France ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle est la plus haute montagne de France ?",
    explanationFr:
      "Le mont Blanc, culminant à 4 809 mètres, est la plus haute montagne de France et d'Europe occidentale. Il est situé dans les Alpes, à la frontière entre la France et l'Italie.",
    choicesFr: [
      { id: "a" as const, text: "Le mont Blanc" },
      { id: "b" as const, text: "Le puy de Dôme" },
      { id: "c" as const, text: "Le pic du Midi" },
      { id: "d" as const, text: "Le mont Ventoux" },
    ],
    correctChoice: "a" as const,
  },

  // Q123: "Quelle île française est située au sud-est du continent africain ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle île française est située au sud-est du continent africain ?",
    explanationFr:
      "Mayotte est une île française située dans l'océan Indien, au sud-est du continent africain. Elle est devenue le 101e département français en 2011.",
    choicesFr: [
      { id: "a" as const, text: "Mayotte" },
      { id: "b" as const, text: "La Martinique" },
      { id: "c" as const, text: "La Guadeloupe" },
      { id: "d" as const, text: "Saint-Pierre-et-Miquelon" },
    ],
    correctChoice: "a" as const,
  },

  // Q124: "Quel département français a une frontière avec le Brésil ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel département français a une frontière avec le Brésil ?",
    explanationFr:
      "La Guyane française est un département d'outre-mer situé en Amérique du Sud, partageant une frontière avec le Brésil. C'est le plus grand département français par sa superficie.",
    choicesFr: [
      { id: "a" as const, text: "La Guyane" },
      { id: "b" as const, text: "La Martinique" },
      { id: "c" as const, text: "La Réunion" },
      { id: "d" as const, text: "Mayotte" },
    ],
    correctChoice: "a" as const,
  },

  // Q125: "De quelle ville française décolle la fusée Ariane ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "De quelle ville française décolle la fusée Ariane ?",
    explanationFr:
      "La fusée Ariane décolle de Kourou, en Guyane française. Le Centre spatial guyanais est la base de lancement de l'Agence spatiale européenne (ESA) depuis 1968.",
    choicesFr: [
      { id: "a" as const, text: "Kourou" },
      { id: "b" as const, text: "Toulouse" },
      { id: "c" as const, text: "Bordeaux" },
      { id: "d" as const, text: "Marseille" },
    ],
    correctChoice: "a" as const,
  },

  // Q126: "Quel est le principal port maritime de France ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le principal port maritime de France ?",
    explanationFr:
      "Marseille est le principal port maritime de France et le premier port de la Méditerranée. Le Grand Port Maritime de Marseille traite des millions de tonnes de marchandises chaque année.",
    choicesFr: [
      { id: "a" as const, text: "Marseille" },
      { id: "b" as const, text: "Nantes" },
      { id: "c" as const, text: "Brest" },
      { id: "d" as const, text: "Bordeaux" },
    ],
    correctChoice: "a" as const,
  },

  // Q127: "Quel est le chef-lieu de la région Auvergne-Rhône-Alpes ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le chef-lieu de la région Auvergne-Rhône-Alpes ?",
    explanationFr:
      "Lyon est le chef-lieu de la région Auvergne-Rhône-Alpes. C'est la troisième plus grande ville de France et un important centre économique et culturel.",
    choicesFr: [
      { id: "a" as const, text: "Lyon" },
      { id: "b" as const, text: "Clermont-Ferrand" },
      { id: "c" as const, text: "Grenoble" },
      { id: "d" as const, text: "Saint-Étienne" },
    ],
    correctChoice: "a" as const,
  },

  // Q128: "Quel est le chef-lieu de la région Bretagne ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le chef-lieu de la région Bretagne ?",
    explanationFr:
      "Rennes est le chef-lieu de la région Bretagne. C'est une ville dynamique et universitaire située dans l'ouest de la France.",
    choicesFr: [
      { id: "a" as const, text: "Rennes" },
      { id: "b" as const, text: "Brest" },
      { id: "c" as const, text: "Nantes" },
      { id: "d" as const, text: "Quimper" },
    ],
    correctChoice: "a" as const,
  },

  // Q129: "Quel est le chef-lieu de la région Provence-Alpes-Côte d'Azur ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le chef-lieu de la région Provence-Alpes-Côte d'Azur ?",
    explanationFr:
      "Marseille est le chef-lieu de la région Provence-Alpes-Côte d'Azur (PACA). C'est la deuxième plus grande ville de France et un port majeur de la Méditerranée.",
    choicesFr: [
      { id: "a" as const, text: "Marseille" },
      { id: "b" as const, text: "Nice" },
      { id: "c" as const, text: "Toulon" },
      { id: "d" as const, text: "Aix-en-Provence" },
    ],
    correctChoice: "a" as const,
  },

  // Q130: "Quel est le 101e département français depuis 2011 ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quel est le 101e département français depuis 2011 ?",
    explanationFr:
      "Mayotte est devenu le 101e département français le 31 mars 2011, suite au référendum de 2009. C'est le plus récent département d'outre-mer à avoir intégré la République française.",
    choicesFr: [
      { id: "a" as const, text: "Mayotte" },
      { id: "b" as const, text: "La Guyane" },
      { id: "c" as const, text: "La Nouvelle-Calédonie" },
      { id: "d" as const, text: "Saint-Martin" },
    ],
    correctChoice: "a" as const,
  },

  // Q131: "Quelle région française est réputée pour ses stations de ski ?" — NAT only
  {
    themeId: 4 as const,
    type: "knowledge" as const,
    difficulty: 3 as const,
    isPremium: false,
    examTypes: ["nat"] as const,
    textFr: "Quelle région française est réputée pour ses stations de ski ?",
    explanationFr:
      "La région Auvergne-Rhône-Alpes est la plus réputée pour ses stations de ski en France. Elle abrite de nombreuses stations alpines renommées comme Chamonix, Les Deux Alpes et Val-d'Isère.",
    choicesFr: [
      { id: "a" as const, text: "Auvergne-Rhône-Alpes" },
      { id: "b" as const, text: "L'Île-de-France" },
      { id: "c" as const, text: "La Nouvelle-Aquitaine" },
      { id: "d" as const, text: "La Bretagne" },
    ],
    correctChoice: "a" as const,
  },
];
