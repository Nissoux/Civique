# Kit démarchage partenaires — Civique

Objectif : construire l'acquisition hors-SEO par les prescripteurs
naturels de nos utilisateurs (associations, écoles FLE, avocats,
plateformes publiques), en obtenant à chaque fois tout ou partie de :
un **backlink** (page « ressources »), du **bouche-à-oreille** auprès
des bénéficiaires, et — pour les associations communautaires — des
**relecteurs natifs** pour les traductions bengali/ourdou.

## La méthode (résumé)

1. Choisir une cible dans [cibles.md](cibles.md) — commencer par les
   « fort » en pertinence backlink.
2. Vérifier sa page ressources et son actualité (2 min sur leur site).
3. Copier le modèle adapté depuis [emails.md](emails.md), personnaliser
   les 3 champs entre crochets, envoyer depuis contact@integrafle.fr.
4. Noter la date d'envoi dans la colonne « Statut » de cibles.md.
5. **Une seule relance** à J+7 (modèle en bas d'emails.md). Sans
   réponse à J+14 : cible suivante, sans états d'âme.

## Le rythme qui marche

**3 envois par semaine, chaque semaine.** Pas de rafale de 30 d'un
coup : la personnalisation réelle de chaque email est précisément ce
qui les fait répondre, et 5-8 partenariats obtenus sur 2 mois est une
excellente vélocité (naturelle aussi aux yeux de Google).

## Les codes promo partenaires

Un code par organisation = traçabilité de qui amène qui. Codes actifs
(premium 365 jours, 100 utilisations, valables jusqu'à fin 2027) :

`CIMADE` · `FTDA` · `SECOURS` · `CROIXROUGE` · `GISTI` · `EMMAUS` ·
`REFINFO` · `ADATE` · `FLE2026` · `AVOCAT` · `ASSO2026` (générique,
200 utilisations, pour toute cible sans code dédié)

Suivi des utilisations (depuis le VPS) :

```bash
ssh root@api.integrafle.fr "PGPASSWORD=postgres psql -h localhost -U postgres -d civique -c \"SELECT pc.code, pc.current_uses, pc.max_uses, MAX(pr.redeemed_at)::date AS derniere FROM promo_codes pc LEFT JOIN promo_redemptions pr ON pr.code_id = pc.id GROUP BY pc.id ORDER BY pc.current_uses DESC;\""
```

## Les règles (non négociables)

- **Donner avant de demander** : l'email ouvre sur ce qu'on offre à
  LEURS bénéficiaires, jamais sur ce qu'on veut.
- La demande de lien arrive en dernier, formulée comme une option.
- Jamais deux relances. Jamais d'achat de lien. Jamais d'annuaire spam.
- Pointer les liens vers les **guides** (utiles sans inscription)
  plutôt que vers la home commerciale quand c'est pertinent.
- Toute promesse faite à un partenaire (code actif, durée) doit être
  vraie en base **avant** l'envoi.

## Suivi des backlinks obtenus

Google Search Console → Liens (2-4 semaines de délai de détection).
Croiser avec les redemptions de codes : un partenaire dont le code
tourne mais sans lien posé mérite un merci + une relance douce sur le
lien, pas l'inverse.
