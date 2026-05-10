# Civique — Explorations Design

Trois directions visuelles distinctes pour la version web. À ouvrir via :

```
http://localhost:3001/design-explorations/        ← page d'index comparative
http://localhost:3001/design-explorations/atelier/
http://localhost:3001/design-explorations/hexagone/
http://localhost:3001/design-explorations/tisserand/
```

Aucune ne réutilise le rendu actuel — chacune commit à fond à son identité.

---

## Direction 1 — L'Atelier

**Mood** : magazine intellectuel français. Préparation comme acte savant.
**Typographie** : Fraunces (display, italic chargé d'attitude) + Bricolage Grotesque (body)
**Palette** : papier crème `#F1ECE2`, encre `#1A1410`, oxblood `#7B2C28`, laiton `#A38860`
**Asset signature** : composition art déco gravée — soleil rayonnant + 12 étoiles + devise républicaine, animée stroke-by-stroke
**Animations** : rise stagger, dessin de soulignement italique, transitions de TOC où l'italique se révèle au survol

**Forces**
- Identité française extrêmement assumée (pas folklorique : intellectuelle)
- Typographie remarquable, sentiment d'objet précieux
- Référence aux livres anciens / périodiques savants → légitimité

**Faiblesses**
- Peut intimider les utilisateurs dont le français est L2 (ironie pour ce produit)
- Mode clair uniquement (le mobile est dark default)
- Le ton "édition collector" peut sembler distant pour quelqu'un en stress d'entretien

---

## Direction 2 — Hexagone

**Mood** : `beta.gouv.fr` croisé avec Linear. Administratif premium, pas administratif chiant.
**Typographie** : Instrument Serif (display, didone moderne) + Manrope (body) + JetBrains Mono (numériques)
**Palette** : navy profond `#0A1A2B`, perle `#F4F4F0`, terracotta `#D45D3F`, blueprint `#4A7BA8`
**Asset signature** : carte hexagonale stylisée de la France avec 5 nœuds reliés par lignes pointillées, tracées en SVG stroke-dashoffset
**Animations** : mask-in sur titres, draw stroke pour les lignes du SVG, pulse-node sur les hexagones, hover dossier-row avec barre terracotta animée

**Forces**
- Dark mode par défaut → cohérent avec le mobile
- Crédibilité administrative sans la lourdeur gov-fr (DSFR)
- Stats vivants ("12k+ candidats préparés", "94% taux de réussite") en preuve sociale chiffrée
- L'asset hexagonal est un véritable hero, pas du décoratif

**Faiblesses**
- Risque de paraître froid/clinique pour des utilisateurs vulnérables
- L'esthétique "dossier" peut rappeler la paperasse que l'app vise à dépasser

---

## Direction 3 — Tisserand

**Mood** : multiculturel chaleureux. Le produit te dit "on t'attendait".
**Typographie** : Newsreader (display + italics chaleureux) + Karla (body humaniste)
**Palette** : bone `#F4ECDD`, aubergine `#2D1B2E`, terracotta `#C7522A`, saffron `#E8A33D`, teal `#5D7A6B`, sienna `#8B5A3C`
**Asset signature** : 5 fils colorés (un par thème) qui s'entrelacent vers un nœud central marqué "vous"
**Animations** : weave-thread (fils dessinés un par un), float (carte témoignage qui flotte), bandeau supérieur défilant en 6 langues, hover avec rotation subtile (-0.5deg)

**Détails uniques**
- Bandeau d'accueil multilingue défilant en haut (مرحباً · Bienvenue · خوش آمدید · Bem-vindo · Bienvenidos · स्वागत है)
- Témoignage "« J'ai eu mon entretien la semaine dernière. » — Amina, Marseille" en sticker flottant
- Pills de langues dans le hero (cliquables potentiellement)
- Underline ondulée saffron sur "rythme"
- 6e card "+ 250 fiches" en aubergine pour casser la grille
- Wordmark avec icône SVG de tissage

**Forces**
- **De loin** la direction la plus différenciante visuellement
- L'identité française subtile (couleurs, motifs) sans aucun cliché
- Reconnaît explicitement la cible (multilingue, parcours d'intégration)
- Le ton rassure → critique pour des utilisateurs en stress d'entretien officiel
- 5 couleurs réelles → utilise vraiment la palette des 5 thèmes

**Faiblesses**
- Mode clair (le mobile est dark default — il faudrait décider si web suit ou diverge)
- Plus chargé visuellement → demande une discipline d'exécution sur les pages utilitaires (settings, paywall…)
- Le décalage tonal par rapport à l'examen officiel pourrait être perçu comme pas assez sérieux

---

## Recommandation finale : **Tisserand**

### Pourquoi

**1. L'argument décisif est le user.** Tes utilisateurs sont des adultes en cours de naturalisation, souvent stressés par l'entretien préfectoral, dont beaucoup ont le français comme L2. Les deux autres directions, bien qu'élégantes, parlent à un public déjà à l'aise avec les codes français. Tisserand parle à *l'utilisateur réel* du produit.

**2. Les 5 fils = les 5 thèmes.** L'asset signature porte le programme. Quand l'utilisateur arrive et voit les 5 fils convergeant vers "vous", il comprend immédiatement la promesse : ces 5 thèmes vont s'intégrer en lui. Aucune autre direction ne fait ça.

**3. Différenciation maximale.** Sur un marché de produits gov-tech / edtech qui convergent vers le minimalisme institutionnel, Tisserand est mémorable. C'est la seule des trois qu'on reconnaîtrait à 50m.

**4. La palette à 5 couleurs résout un vrai problème.** Tes 5 thèmes ont déjà des couleurs (bleu/rouge/jaune/bleu clair/vert) — Tisserand les retrouve naturellement (terracotta/saffron/teal/indigo/sienna), recolorées avec une cohérence chaleureuse au lieu d'une cohérence "drapeau".

**5. C'est une marque, pas un template.** Hexagone est sublime mais c'est un Linear pour gov-tech. L'Atelier est sublime mais c'est une revue savante. Tisserand n'a pas de jumeau évident — c'est une identité.

### Risques à mitiger

- **Le sérieux** : pour ne pas paraître Duolingo, garder Newsreader (serif) sur tous les titres importants, et limiter strictement les rotations à -0.5/-1 degré (pas Memphis joyeux)
- **Le dark mode** : pour rester cohérent avec le mobile, ajouter un dark variant (aubergine devient le fond, bone devient l'encre, terracotta/saffron restent les accents). Pas indispensable au v1
- **L'exécution** : les pages utilitaires (settings, paywall, erreurs) devront garder la même chaleur sans devenir baroques

### Plan d'implémentation si Tisserand est validé

1. Ajouter `Newsreader` + `Karla` via `next/font/google`
2. Réécrire `tailwind.config.ts` avec la palette Tisserand (bone, aubergine, terracotta, saffron, teal, sienna)
3. Réécrire `globals.css` avec les variables CSS et les classes utilitaires (.btn-warm, .card-warm, .theme-card)
4. Ajouter `framer-motion` pour les animations weave + float
5. Refondre `app/page.tsx` avec hero + 5 fils SVG + 6 cards thèmes (5 + 1 tease)
6. Refondre `AuthShell.tsx` : layout 2 colonnes, panneau gauche avec bandeau multilingue + stats, panneau droit avec card-warm
7. Ajouter le bandeau d'accueil défilant comme composant `WelcomeStrip.tsx`
8. Garder l'architecture auth Server Action (rien à changer côté logique)

Estimé : **3-4 heures de refonte propre** sur l'existant.

---

## Comment tester

```bash
cd C:\Users\Anis\Civique\.claude\worktrees\serene-mcnulty-ca87e7
pnpm --filter web dev
```

Puis visite :
- `http://localhost:3001/design-explorations/` (index comparatif)
- `http://localhost:3001/design-explorations/atelier/`
- `http://localhost:3001/design-explorations/hexagone/`
- `http://localhost:3001/design-explorations/tisserand/`
