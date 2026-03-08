# InfinitePush - SaaS Live Update pour Capacitor

## 🚀 Vision du Produit
Offrir une alternative robuste, illimitée et abordable à Ionic Appflow. 
**Prix unique : 29€/mois par projet, mises à jour et utilisateurs illimités.**

---

## 🏗️ Architecture "BYOS" (Bring Your Own Supabase)
Contrairement aux concurrents, **InfinitePush** n'héberge pas les fichiers des clients. 
1. **InfinitePush Dashboard (Vercel)** : Gère la logique de déploiement, l'authentification et le paiement.
2. **Client Supabase** : Stocke les fichiers ZIP (Storage) et l'historique des versions (Database).
3. **InfinitePush SDK** : Un wrapper autour de `capacitor-updater` qui se connecte à InfinitePush pour savoir quoi faire.

---

## 🛠️ Configuration du Client (Test sur K-Syndic)

### 1. Base de données (Supabase du Client)
Le client doit exécuter ce script sur son propre Supabase pour préparer le terrain :

```sql
CREATE TABLE IF NOT EXISTS public.infinite_push_deployments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    version TEXT NOT NULL,
    build_number INT NOT NULL,
    zip_url TEXT NOT NULL,
    channel TEXT DEFAULT 'production',
    status TEXT DEFAULT 'pending', -- 'active', 'rolled_back'
    metadata JSONB
);

-- Créer un bucket 'infinite-push' dans le Storage en mode Public
```

### 2. Intégration SDK (Dans l'App mobile)
Installation du moteur :
`npm install @capgo/capacitor-updater`

Service de synchronisation :
```typescript
// InfinitePushService.ts
import { CapacitorUpdater } from '@capgo/capacitor-updater';

export const syncUpdates = async (projectId: string) => {
  // L'app appelle l'API centrale d'InfinitePush
  const response = await fetch(`https://api.infinitepush.com/v1/check/${projectId}`);
  const latestUpdate = await response.json();

  if (latestUpdate && latestUpdate.should_install) {
    await CapacitorUpdater.download({
      url: latestUpdate.zip_url,
      version: latestUpdate.version
    });
  }
}
```

### 3. Automatisation (GitHub Actions du Client)
Ajouter cette étape au build existant :
```yaml
- name: InfinitePush Upload
  run: |
    zip -r update.zip dist/
    # Appel à l'API InfinitePush pour uploader sur le Supabase du client
    curl -X POST https://api.infinitepush.com/v1/deploy \
      -H "Authorization: Bearer ${{ secrets.INFINITE_PUSH_KEY }}" \
      -F "file=@update.zip" \
      -F "version=${{ github.ref_name }}"
```

---

## 💰 Plans de Monétisation

| Plan | Prix | Cible | Caractéristiques |
| :--- | :--- | :--- | :--- |
| **Solo** | **29€/mois** | Indépendant | 1 Projet, Updates Illimitées |
| **Agency** | **99€/mois** | Agences | Jusqu'à 10 projets, Gestion d'équipe |
| **Enterprise**| **249€/mois**| Grands comptes | Projets illimités, SSO, Audit Logs |
| **Lifetime** | **199€ (Unique)**| Early Adopters | 1 Projet à vie (Offre limitée) |

**Killer Feature** : Auto-rollback intelligent si un crash est détecté immédiatement après une mise à jour.

---

## 🧪 Phase de Test (K-Syndic)
1. **Étape A** : Créer manuellement la table `infinite_push_deployments` sur le Supabase de K-Syndic.
2. **Étape B** : Implémenter le `syncUpdates` dans K-Syndic.
3. **Étape C** : Simuler l'API InfinitePush via une Edge Function Supabase pour valider le flux avant de coder le dashboard Vercel.
