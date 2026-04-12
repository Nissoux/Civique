# Lessons Learned — Civique
## Guide méthodologique pour le déploiement d'une app React Native / Expo sur les stores

**Contexte** : Développement et déploiement de Civique, une app mobile de préparation à l'examen civique français. Expo SDK 54, React Native 0.81, Fastify backend, PostgreSQL, pnpm monorepo.

**Écrit après** : ~30 heures de développement, 2 rejets Apple, 15+ builds EAS, et beaucoup de leçons apprises à la dure.

---

## Table des matières

1. [Règle d'or : Documentation d'abord](#1-règle-dor--documentation-dabord)
2. [Google Sign-In : la bonne approche du premier coup](#2-google-sign-in--la-bonne-approche-du-premier-coup)
3. [Apple App Store : anticiper les rejets](#3-apple-app-store--anticiper-les-rejets)
4. [Google Play Store : le parcours du combattant](#4-google-play-store--le-parcours-du-combattant)
5. [RevenueCat / In-App Purchases](#5-revenuecat--in-app-purchases)
6. [EAS Build : pièges et bonnes pratiques](#6-eas-build--pièges-et-bonnes-pratiques)
7. [Expo SDK : compatibilité des packages](#7-expo-sdk--compatibilité-des-packages)
8. [Workflow de développement](#8-workflow-de-développement)
9. [Checklist pré-soumission stores](#9-checklist-pré-soumission-stores)

---

## 1. Règle d'or : Documentation d'abord

### ❌ Ce que j'ai fait (mal)
Essayé 5 approches différentes pour Google Sign-In en "guessant" ce qui allait marcher, sans lire la documentation officielle d'Expo ni de Google. Résultat : 5 builds ratés, des heures perdues.

### ✅ Ce qu'il faut faire
**TOUJOURS lire la doc officielle AVANT d'écrire la moindre ligne de code.**

Ordre de lecture :
1. **Documentation officielle de la librairie** (pas un article Medium, pas ChatGPT)
2. **Guide d'intégration spécifique à Expo** (si la lib en a un)
3. **Changelog / Migration guide** si upgrade de version
4. **Issues GitHub** ouvertes pour vérifier les bugs connus

### Règle concrète
> Si tu ne trouves pas la réponse dans la doc officielle en 10 minutes, c'est que tu cherches au mauvais endroit ou que tu poses la mauvaise question. Reformule.

---

## 2. Google Sign-In : la bonne approche du premier coup

### ❌ Approches qui ne marchent PAS en production

| Approche | Pourquoi ça échoue |
|---|---|
| `expo-auth-session` + browser flow | Google bloque les browser flows pour les mobile OAuth clients ("doesn't comply with OAuth 2.0 policy") |
| `expo-auth-session` + proxy `auth.expo.io` | Proxy déprécié depuis SDK 48, peut disparaître à tout moment |
| `expo-auth-session` + `ResponseType.IdToken` | Google a désactivé le flow implicite pour les clients natifs ("unsupported_response_type") |
| `expo-auth-session` + `ResponseType.Code` + PKCE | Fonctionne théoriquement mais le redirect URI est intercepté par Expo Router ("Unmatched Route") |
| Hardcoder le redirect URI manuellement | Format single-slash vs double-slash vs oauth2redirect — impossible de trouver le bon format qui satisfait à la fois Google ET expo-auth-session |

### ✅ LA bonne approche : `@react-native-google-signin/google-signin`

C'est la librairie **officiellement recommandée par Expo** (dans leur guide Google Authentication) et par Google.

#### Installation
```bash
npx expo install @react-native-google-signin/google-signin
```

#### Config plugin (app.json)
```json
"plugins": [
  ["@react-native-google-signin/google-signin", {
    "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
  }]
]
```

#### Code
```typescript
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

// Au niveau module (pas dans un useEffect)
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID', // requis pour obtenir idToken
  iosClientId: 'YOUR_IOS_CLIENT_ID',
  offlineAccess: false,
});

// Sign-in
async function signIn() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  // Envoyer idToken au backend
}
```

#### Google Cloud Console — 3 clients OAuth nécessaires

| Type | Quand c'est utilisé | Configuration |
|---|---|---|
| **iOS** | Google Sign-In sur iOS | Bundle ID = votre bundle identifier |
| **Android** | Google Play Services détecte auto | Package name + SHA-1 du keystore EAS production |
| **Web** | `webClientId` pour idToken | Redirect URI = pas nécessaire pour mobile |

#### ⚠️ SHA-1 Android critique
Le SHA-1 dans le client Android Google Cloud **DOIT** correspondre au keystore EAS production :
```bash
eas credentials --platform android
# → SHA1 Fingerprint: XX:XX:XX:...
```
Si ça ne matche pas → Google Sign-In échouera silencieusement sur Android.

#### Pourquoi ça marche (et pas les autres)
- Android : utilise **Google Play Services** nativement (pas de browser, pas de redirect URI)
- iOS : utilise le **SDK natif Google** (pas de SFAuthenticationSession, pas d'Expo Router intercept)
- Pas de redirect URI = pas de "Unmatched Route", pas de "invalid_request", pas de "unsupported_response_type"

---

## 3. Apple App Store : anticiper les rejets

### Les rejets qu'on a eus et comment les éviter

#### 3.1.1 — Codes promo bypassant l'IAP
**Règle Apple** : tout déblocage de contenu numérique sur iOS DOIT passer par StoreKit/IAP. Pas de codes promo maison, pas de Stripe, pas de "entrez un code".

**Fix** : masquer la section promo sur iOS :
```typescript
{Platform.OS !== 'ios' && (
  <PromoCodeSection />
)}
```

**Prévention** : dès la conception, décider que les codes promo sont Android-only ou utiliser les "Offer Codes" d'Apple (App Store Connect → Subscriptions → Offer Codes).

#### 2.3.10 — Références à des plateformes tierces dans le binaire
**Règle Apple** : le binaire iOS ne doit contenir AUCUNE mention de "Google Play", "Android", "Play Store", ou tout autre store concurrent.

**Piège subtil** : même dans un ternaire `Platform.OS === 'ios' ? "Apple" : "Google Play"`, la chaîne "Google Play" est **incluse dans le bundle JavaScript compilé**. Apple scanne le binaire statiquement.

**Fix** : utiliser les **platform extensions de Metro** :
```
constants/subscription-strings.ios.ts    → "compte iTunes"
constants/subscription-strings.android.ts → "compte Google Play"
```
Metro n'inclut que le fichier `.ios.ts` dans l'IPA et `.android.ts` dans l'AAB.

**Prévention** : ne JAMAIS hardcoder de texte platform-specific dans un ternaire. Toujours utiliser des fichiers `.ios.ts` / `.android.ts` pour les chaînes qui diffèrent entre iOS et Android.

#### 2.3.10 — IAP "Could not check" / offres pas disponibles
**Règle Apple** : les IAP sont reviewés EN MÊME TEMPS que le binaire lors de la première soumission.

**Conséquence** : les IAP ne sont pas visibles dans l'app avant approbation Apple. C'est normal. Le texte fallback doit être neutre ("Les offres sont en cours de chargement") et PAS mentionner de codes promo comme alternative.

### Checklist pré-soumission Apple

- [ ] Aucune mention de "Google", "Play Store", "Android" dans le binaire iOS
- [ ] Aucun mécanisme de paiement autre que StoreKit/IAP sur iOS
- [ ] Bouton "Restaurer les achats" présent et fonctionnel
- [ ] Suppression de compte disponible (DELETE /me)
- [ ] Apple Sign-In implémenté (obligatoire si Google Sign-In est proposé)
- [ ] Politique de confidentialité accessible depuis l'app
- [ ] CGU accessibles
- [ ] Screenshots aux bonnes dimensions (6.5" = 1284x2778 obligatoire)
- [ ] Pas d'alpha channel sur l'icône 1024x1024
- [ ] `ITSAppUsesNonExemptEncryption: false` si pas de crypto custom
- [ ] IAP créés dans App Store Connect avec nom d'affichage, description, prix, catégorie d'imposition, capture d'écran review
- [ ] IAP attachés à la version soumise
- [ ] Description App Store sans mention de stores concurrents
- [ ] Keywords sans "android", "google", "play"

### Répondre à un rejet Apple
- Être **factuel et technique** (pas d'excuses, pas de justifications longues)
- Expliquer **précisément** ce qui a été modifié, guideline par guideline
- Mentionner les **méthodes techniques** utilisées (ex: "Metro platform extensions")
- Confirmer que les IAP passent par StoreKit
- Fournir le **numéro du nouveau build**

---

## 4. Google Play Store : le parcours du combattant

### Chronologie type pour une première app
1. Créer le compte développeur Google Play (25$ one-time)
2. Configurer le service account pour les API (androidpublisher)
3. Inviter le service account dans Play Console → Users and permissions
4. Upload un premier AAB dans internal testing
5. Créer les abonnements (produits IAP) — **impossible avant d'avoir uploadé un AAB**
6. Configurer les license testers (Setup → License testing → ajouter Gmail)
7. Avoir 12 testeurs en tests fermés (ou 20 en internal) pendant 14 jours
8. Demander l'accès production

### Pièges Google Play

- **Abonnements non créables sans AAB** : il faut uploader au moins un binaire avant de pouvoir créer des produits
- **License tester obligatoire** : sans ça, les IAP demandent un vrai paiement même en test
- **Format product ID Google Play Billing v5** : `product_id:base_plan_id` (avec les deux-points), pas juste `product_id`
- **Propagation des IAP** : peut prendre jusqu'à 4 heures après création
- **SHA-1 keystore** : doit matcher entre EAS credentials et Google Cloud Console Android OAuth client

---

## 5. RevenueCat / In-App Purchases

### Configuration correcte

#### Identifiants importants
- **Entitlement** : nom exact, sensible à la casse (ex: `Civique Pro`, pas `civique_pro`)
- **Offering** : doit être marquée "Current" sinon `getOfferings().current` retourne `null`
- **Package identifiers** : RevenueCat utilise `$rc_weekly`, `$rc_monthly`, `$rc_six_month` (préfixe `$rc_`)
- **Product identifiers Android** : format `product_id:base_plan_id` (avec le plan de base)

#### Code qui matche les identifiers
```typescript
const labels: Record<string, string> = {
  $rc_weekly: 'Hebdomadaire',
  $rc_monthly: 'Mensuel',
  $rc_six_month: '6 mois',
};
```

#### Vérification RevenueCat dashboard
Avant de builder, vérifier dans le dashboard :
1. **Products** : tous en "Published" ✅ (pas "Could not check")
2. **Entitlements** : tous les produits attachés, pas de doublons parasites
3. **Offerings** : offering "default" en "Current", chaque package a les produits iOS + Android attachés

#### "Could not check" sur les produits iOS
C'est **normal** pour une première soumission — Apple n'a pas encore approuvé les IAP. Ça passe en vert automatiquement après approbation.

---

## 6. EAS Build : pièges et bonnes pratiques

### Versions de packages
**TOUJOURS** utiliser `npx expo install` (pas `npm install` ni `pnpm add`) pour installer des packages Expo. `expo install` choisit la version compatible avec le SDK actuel.

```bash
# ✅ Bon — installe la version compatible SDK 54
npx expo install expo-auth-session expo-crypto

# ❌ Mauvais — installe la dernière version (potentiellement SDK 55)
npm install expo-auth-session expo-crypto
```

**Vérifier** la version bundled :
```bash
cat node_modules/expo/bundledNativeModules.json | grep "package-name"
```

### Le crash au démarrage = mauvaise version de package natif
Si l'app crash immédiatement au lancement après un build EAS, c'est quasi toujours une **incompatibilité de version** entre un package natif et le SDK Expo. Vérifier :
1. `bundledNativeModules.json` pour les versions attendues
2. `package.json` pour les versions installées
3. Les `^` dans package.json qui peuvent tirer des majeures incompatibles

### Profils de build
```json
{
  "development": { "developmentClient": true, "distribution": "internal" },
  "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
  "production": { "autoIncrement": true }
}
```
- `preview` : APK installable directement (pas besoin du Play Store)
- `production` : AAB pour les stores (+ auto-increment du build number)

### Keystore Android
- EAS gère le keystore automatiquement
- **Ne jamais le perdre** — il est lié à l'identité de l'app sur Google Play
- Le SHA-1 du keystore doit être dans Google Cloud Console (OAuth Android client)
- Vérifier avec `eas credentials --platform android`

---

## 7. Expo SDK : compatibilité des packages

### Règle
Tous les packages `expo-*` doivent être à la version correspondant au SDK. Un package `expo-auth-session@55.x` sur un SDK 54 = **crash garanti**.

### Vérifier les versions
```bash
# Voir les versions attendues pour le SDK actuel
cat node_modules/expo/bundledNativeModules.json

# Vérifier la compatibilité de tous les packages installés
npx expo-doctor
```

### Installer correctement
```bash
# Installe la bonne version automatiquement
npx expo install package-name

# Si pnpm n'est pas installé globalement
npx --yes pnpm@9 install --filter mobile
```

---

## 8. Workflow de développement

### L'ordre qui marche

1. **Lire la doc** de ce qu'on va implémenter
2. **Coder** le feature
3. **Tester localement** (dev client si possible, sinon preview build)
4. **Committer** avec un message descriptif
5. **Builder preview** (Android APK pour test rapide)
6. **Tester sur device** réel
7. **Fixer** si nécessaire (retour à l'étape 2)
8. **Builder production** seulement quand preview est validé
9. **Soumettre** aux stores

### Ordre des soumissions stores
1. **Android d'abord** (review plus rapide, tests fermés flexibles)
2. **iOS ensuite** (review plus stricte, rejets fréquents sur les premières soumissions)

### Ne pas faire
- ❌ Builder iOS production avant d'avoir validé sur Android preview
- ❌ Soumettre à Apple sans avoir testé Google Sign-In sur un vrai device
- ❌ Committer + pusher sans avoir relu le code
- ❌ Ajouter des packages natifs sans vérifier la compatibilité SDK
- ❌ Modifier le SHA-1 dans Google Cloud sans vérifier `eas credentials`
- ❌ Essayer des fixes à l'aveugle sans lire la doc

---

## 9. Checklist pré-soumission stores

### Avant CHAQUE soumission

#### Code
- [ ] Tous les tests passent
- [ ] Pas de `console.log` de debug en production
- [ ] Pas de clés API en dur (utiliser des variables d'environnement)
- [ ] Pas de mentions de stores concurrents dans les strings du binaire (utiliser `.ios.ts` / `.android.ts`)

#### Google Cloud Console
- [ ] iOS OAuth client existe avec le bon Bundle ID
- [ ] Android OAuth client existe avec le bon package name + SHA-1 EAS
- [ ] Web OAuth client existe (pour `webClientId`)

#### RevenueCat
- [ ] Entitlement créé avec le nom exact attendu par le code
- [ ] Offering "default" en "Current"
- [ ] Chaque package a les produits iOS ET Android attachés
- [ ] Pas d'entitlements parasites/dupliqués

#### Apple App Store Connect
- [ ] IAP créés avec métadonnées complètes (nom, description, prix, catégorie, screenshot)
- [ ] IAP attachés à la version
- [ ] Description sans mention de Google/Android/Play Store
- [ ] Keywords propres
- [ ] Screenshots aux bonnes dimensions
- [ ] Politique de confidentialité URL renseignée
- [ ] Build uploadé et sélectionné

#### Google Play Console
- [ ] AAB uploadé dans le bon track
- [ ] Abonnements créés et "Active"
- [ ] License testers configurés
- [ ] Service account avec les bons droits
- [ ] Description et screenshots uploadés

#### Build EAS
- [ ] `package.json` : toutes les versions de packages compatibles avec le SDK
- [ ] `app.json` : config plugins à jour
- [ ] `pnpm-lock.yaml` : régénéré après chaque modification de package.json
- [ ] Build preview testé sur device réel AVANT le build production

---

## Résumé en une phrase

> **Lis la doc officielle, utilise les librairies officielles, teste sur un vrai device, et ne soumets aux stores que quand tout marche.**

---

*Document rédigé le 12 avril 2026 après le déploiement de Civique v1.0*
