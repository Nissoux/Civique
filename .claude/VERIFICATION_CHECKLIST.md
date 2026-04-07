# Checklist de vérification obligatoire

## Avant CHAQUE commit, vérifier :

### Données affichées
- [ ] Les textes affichés correspondent aux bonnes données (pas de mismatch)
- [ ] Les traductions sont alignées avec le texte principal
- [ ] Si un shuffle/tri est appliqué, TOUTES les données liées suivent le même ordre

### Tests API
- [ ] Tester l'endpoint avec curl et vérifier la réponse
- [ ] Tester avec chaque langue si les traductions sont impliquées

### Tests visuels
- [ ] Vérifier le rendu sur un vrai écran (pas juste le code)
- [ ] Vérifier le mode clair ET sombre
- [ ] Vérifier avec du texte long

### Avant un BUILD
- [ ] Relire CHAQUE fichier modifié depuis le dernier build
- [ ] Tester le flow complet : inscription → vérification → login → navigation → fonctionnalité
- [ ] Tester les traductions avec au moins 1 langue non-française
- [ ] Vérifier qu'il n'y a AUCUN TODO/bug connu non résolu
- [ ] Ne JAMAIS lancer un build tant qu'un fix est en attente
