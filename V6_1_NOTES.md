# BizManager V6.1

## Renouvellements commerciaux
- Demande de renouvellement côté entreprise, paiement en espèces.
- File d'attente Superadmin des demandes PENDING.
- Validation : paiement marqué PAID, abonnement prolongé d'un mois à partir de la fin actuelle ou de maintenant.
- Refus : demande marquée CANCELED avec motif facultatif.
- Notifications automatiques aux OWNER/ADMIN après validation ou refus.
- Historique des demandes traité visible au Superadmin.
- Audit des décisions de renouvellement.
- Tarifs : Basic 7 500 FCFA/mois, Avancé 10 000 FCFA/mois.
- Responsive mobile conservé depuis V5.8/V5.9.

## V6.1.1 - correctif déploiement / abonnement
- La page Mon abonnement ne fait plus `response.json()` directement : elle gère les réponses vides/non-JSON et affiche une erreur exploitable.
- `postinstall` exécute `prisma generate`.
- `build` exécute `prisma generate && next build`.
- `/api/health` vérifie réellement l'accès PostgreSQL et renvoie la version/runtime.
- Après déploiement, exécuter les migrations Prisma (`npx prisma migrate deploy`) sur la base de production avant d'utiliser les abonnements.
