# 💰 Stratégie de Monétisation - InfinitePush

Ce document détaille les options de paiement et la structure de coûts pour opérer InfinitePush depuis le Maroc.

---

## 🌍 Top 3 des Options de Paiement (Maroc)

Puisque Stripe standard n'est pas disponible, voici les alternatives pour encaisser en Euros/Dollars.

### 1. Lemon Squeezy (Recommandé)
Le choix n°1 pour les développeurs SaaS indépendants.
*   **Modèle** : Merchant of Record (Ils gèrent la TVA et les factures).
*   **Frais** : 5% + 0.50$ par transaction.
*   **Paiement vers Maroc** : Via Payoneer (Virement SEPA/SWIFT).
*   **Avantage** : Interface moderne, API robuste pour Vercel, pas de frais mensuels.

### 2. Paddle
L'alternative historique, très solide pour l'Europe.
*   **Modèle** : Merchant of Record.
*   **Frais** : 5% + 0.50$ par transaction.
*   **Paiement vers Maroc** : Via Payoneer ou Virement Bancaire Direct.
*   **Avantage** : Très bonne gestion des abonnements complexes (B2B).

### 3. Stripe Atlas (Pour passer au niveau supérieur)
Création d'une entreprise (LLC) aux USA depuis ton bureau au Maroc.
*   **Coût initial** : 500$ (Set up complet).
*   **Coûts annuels** : ~250$ - 500$ (Taxes, Agent enregistré).
*   **Frais transaction** : ~2.9% + 0.30$.
*   **Avantage** : Accès à l'écosystème Stripe complet et crédibilité US.

---

## 📊 Calcul de Rentabilité (Comparatif des Plans)

Calcul des gains réels (via Lemon Squeezy 5% + 0.50$ & Payoneer 1%) :

| Plan | Prix Client | Frais Plateforme | Net (Estimé) | Net (DH approx) |
| :--- | :--- | :--- | :--- | :--- |
| **Solo** | **29.00€** | -1.95€ | **26.76€** | **~285 DH** |
| **Agency** | **99.00€** | -5.45€ | **92.61€** | **~980 DH** |
| **Enterprise**| **249.00€**| -12.95€ | **233.69€** | **~2470 DH** |
| **Lifetime** | **199.00€**| -10.45€ | **186.66€** | **~1970 DH** |

*\*Note : Pour Stripe Atlas, le net serait légèrement supérieur mais nécessite des frais fixes annuels.*

---

## 🏦 Flux de Rapatriement de l'Argent

1. **Client** paye son abonnement (ex: 29€) sur ton site (via Lemon Squeezy).
2. **Lemon Squeezy** garde l'argent sur sa plateforme.
3. **Paiement bimensuel** : L'argent est envoyé sur ton compte **Payoneer** (Compte virtuel EUR/USD).
4. **Retrait vers Maroc** : Tu transfères de Payoneer vers ton compte bancaire marocain (Attijari, BMCE, etc.).
5. **Réception** : L'argent arrive en Dirhams sur ton compte après conversion.

---

## 🛠️ Intégration Technique (Next.js / Vercel)

Pour l'implémentation sur ton Dashboard Vercel :

1. **Webhook** : Configurer un webhook Lemon Squeezy pour écouter les événements `subscription_created` et `subscription_cancelled`.
2. **Supabase** : Mettre à jour une colonne `is_subscribed` et `plan_type` dans ta table `users`.
3. **API Middleware** : Bloquer les requêtes de déploiement si `is_subscribed` est `false`.

---

## 📝 Check-list de Lancement
- [ ] Créer un compte gratuit sur Lemon Squeezy.
- [ ] Créer un compte Payoneer et valider l'identité.
- [ ] Configurer les 4 produits (Solo, Agency, Enterprise, Lifetime) sur le dashboard LS.
- [ ] Intégrer les boutons "Checkout" sur ta landing page.
- [ ] Configurer le Webhook pour gérer les différents `plan_type` dans Supabase.
