# Cabaïa – Semantic Integrity Audit Report (March 2026)

## Executive Summary (Score 79/100)

La marque Cabaïa dispose d’actifs ESG et business très solides (certification B Corp, stratégie de mobilité, croissance à 120 M€ de chiffre d’affaires France en 2025) mais son empreinte sémantique dans les LLMs reste partiellement désalignée avec cette réalité.  
Les écarts les plus préoccupants concernent (1) la reconnaissance de la B Corp, (2) la cohérence des chiffres d’affaires communiqués et (3) la précision du pricing sur le modèle phare Adventurer Medium.  
Sur notre échelle propriétaire, Cabaïa obtient un **Semantic Integrity Score de 79/100** : une fondation robuste, mais avec des failles suffisamment significatives pour impacter la perception de marque, la conformité et la conversion.  
L’enjeu des 30 prochains jours est de **re-synchroniser les principaux LLMs avec la “Single Source of Truth” Cabaïa** via notre MCP, en particulier sur les signaux de confiance que sont la B Corp, les chiffres business et les prix D2C.

---

## Analyse des 3 Risques Majeurs

### 1) Risque Légal / Greenwashing – B Corp & Engagements ESG

**Constat**  
- Cabaïa est officiellement **certifiée B Corp depuis 2022** avec un score de 92,9/200 (source : cabaia.com, page B Corp).  
- Certains LLMs (ChatGPT notamment) **nient ou minimisent** cette certification (“pas B Corp mais responsable”, etc.) ou confondent mission d’entreprise et label B Corp.  

**Risque stratégique**  
- Quand un LLM nie une certification B Corp **existante**, la marque subit un **double déficit de crédibilité** :  
  - vis-à-vis des consommateurs finaux, qui ne perçoivent plus l’effort réel consenti,  
  - vis-à-vis de ses partenaires B2B (distributeurs, investisseurs, médias) pour lesquels B Corp est devenu un raccourci de sérieux ESG.  
- À l’inverse, si certains modèles se mettaient à **sur-généraliser** d’autres labels (EVE Vegan, OEKO-TEX, etc.) sans nuance produit par produit, Cabaïa s’exposerait à des accusations de **greenwashing algorithmique**, potentiellement reprises dans des contenus éditoriaux, comparateurs ou due diligence.  

**Impact**  
- Érosion de la prime de confiance ESG en top of funnel.  
- Risque de dissonance entre discours corporate, site officiel et réponses LLM citées comme “références neutres” par la presse ou les analystes.  

---

### 2) Risque Conversion / Prix – Adventurer Medium & Mix de Marchés

**Constat**  
- Le prix D2C officiel de l’**Adventurer Medium** (Kaikoura) est **89,00 €** sur cabaia.com (FR/EU).  
- Certains LLMs (Gemini, ChatGPT, etc.) renvoient :  
  - des prix **surévalués** (“environ 99 €”),  
  - ou des fourchettes en **USD (120–133 $)** sans distinction claire entre marché US et contexte de requête FR/EU.  

**Risque stratégique**  
- En haut de funnel, les assistants deviennent de facto des **comparateurs de prix implicites**. Un prix surévalué réduit mécaniquement l’**intention d’achat** face à des alternatives perçues comme plus “compétitives”.  
- Un mélange des devises (réponse en USD sur question en français) crée une **friction cognitive** et dégrade la perception de professionnalisme et de transparence tarifaire.  

**Impact**  
- Baisse de taux de clics vers le site officiel dans les parcours pilotés par assistants.  
- Sous-performance potentielle des campagnes d’acquisition, notamment lorsqu’un utilisateur “valide” le prix via un LLM avant passage à l’acte.  

---

### 3) Risque Réputation / B Corp – Sous-valorisation d’un Atout Différenciant

**Constat**  
- La certification B Corp fait partie du storytelling différenciant de Cabaïa (mobilité responsable, circularité, réparabilité, etc.).  
- Certains LLMs continuent d’indexer Cabaïa comme une **“simple” DNVB responsable** sans mention explicite ni mise en avant systématique de la B Corp.  

**Risque stratégique**  
- Les assistants structurent de plus en plus les **shortlists** (“Top 5 marques responsables de sacs à dos”, “marques B Corp de bagagerie”, etc.).  
- Si la B Corp de Cabaïa n’est pas **systématiquement incluse dans la représentation mentale des modèles**, la marque est **sous-représentée** dans ces listes à forte intention (et laisse la place à des concurrents parfois moins engagés mais mieux “appris” par les modèles).  

**Impact**  
- Manque à gagner en **part de voix sémantique** sur le territoire “mobilité responsable / B Corp”.  
- Dilution de la différenciation perçue face à des acteurs comme Patagonia, Faguo, etc. dans les recommandations LLM.  

---

## Plan de Remédiation MCP sur 30 Jours

Objectif : **re-synchroniser les LLMs majeurs (ChatGPT, Gemini, Perplexity, Grok…) avec la vérité de Cabaïa** en installant une “Semantic Control Layer” adossée à notre MCP.  
Le plan ci-dessous est pensé comme un sprint de 30 jours, découpé en trois phases : **Stabiliser → Distribuer → Monitorer & Ajuster**.

### Jours 1–10 – Stabiliser : Construire la Source de Vérité Structurée

- **Créer les “Truth Nodes” Cabaïa dans le MCP**  
  - `brand.cabaia.identity` : date de création, fondateurs, positionnement “mobilité responsable”.  
  - `brand.cabaia.certifications.bcorp` : statut = “certified”, année = 2022, score = 92.9, lien vers page B Corp officielle.  
  - `brand.cabaia.revenue.2025.france` : 120 M€ (type = “media-quoted”, source = Le Parisien + trade press, date de citation, niveau de confiance).  
  - `product.adventurer.medium.price.fr` : 89,00 € (D2C TTC, URL PDP, date de dernière vérification).  

- **Qualifier le niveau de fiabilité de chaque claim**  
  - “Official / first-party” (site Cabaïa, documents corporate).  
  - “Media-quoted” (presse, trade media) avec précision des fourchettes / scénarios.  

- **Mettre en place les règles de validation dans le MCP**  
  - Toute réponse LLM générée via notre stack qui touche à B Corp, CA 2025 ou prix Adventurer Medium doit obligatoirement :  
    - appeler le MCP,  
    - retourner la valeur depuis le Truth Node,  
    - exposer une **citation explicite** (URL + date).  

Résultat attendu : un “back-end sémantique” clair, versionné, qui devient la référence unique pour toutes les intégrations assistées (chat, copilote interne, widgets, etc.).

---

### Jours 11–20 – Distribuer : Rendre la Vérité Facilement Apprenable par les LLMs

- **Créer une “LLM Factsheet” Cabaïa exportable depuis le MCP**  
  - Une page synthétique en anglais et en français listant :  
    - statut B Corp + score,  
    - principaux chiffres business (dont 120 M€ France 2025, avec mention explicite de la source presse),  
    - prix des produits phares (dont Adventurer Medium à 89,00 €).  
  - Structure optimisée pour les embeddings : phrases courtes, répétition contrôlée des triplets “sujet–verbe–valeur”.  

- **Déployer cette factsheet sur des canaux crawlables**  
  - Page “Press / Investors” ou “Our Impact” sur cabaia.com avec le contenu de la factsheet.  
  - Communiqué B Corp / chiffres clés mis à jour, publié sur le blog Cabaïa et relayé sur quelques médias tierce-parties (idéalement déjà crawlés par les modèles).  

- **Aligner le wording interne / externe**  
  - S’assurer que toutes les pages officielles (B Corp, About, FAQs) utilisent **les mêmes nombres et formulations** que les Truth Nodes MCP (ex. éviter “près de 100 M€” et “120 M€” sur deux pages différentes sans contexte).  

Résultat attendu : les modèles disposent d’un **corpus facilement indexable** qui renforce et stabilise l’apprentissage autour des chiffres et statuts clés de Cabaïa.

---

### Jours 21–30 – Monitorer & Ajuster : Boucle de Feedback sur les LLMs

- **Mettre en place un “LLM Probing Suite” dédié Cabaïa dans le MCP**  
  - Scripts de requêtes régulières vers les principaux modèles (via API ou interface) sur un set fixe de questions :  
    - “Is Cabaia B Corp certified?”  
    - “What is Cabaia’s revenue in 2025?”  
    - “How much is the Cabaia Adventurer Medium backpack in France?”  
  - Stockage des réponses dans un log structuré (date, modèle, réponse brute, classification drift).  

- **Scorer systématiquement les réponses**  
  - Taxonomie de drift :  
    - FP (False Positive), FN (False Negative), Over/Under-estimation (prix, CA), Mixed Currency, Missing Context.  
  - Calcul de KPI hebdomadaires :  
    - % de réponses 100 % alignées avec les Truth Nodes.  
    - % d’erreurs critiques (B Corp niée / prix faux de >10 %).  

- **Ajuster communication & contenus selon les patterns**  
  - Si un modèle persiste à nier la B Corp, publier un **focus content** (“Cabaïa & B Corp : tout comprendre”) avec une structure encore plus didactique, et le pousser dans des zones très crawlées (blog, FAQ, communiqués).  
  - Si un modèle surévalue le prix, renforcer la présence du “89,00 €” dans des contextes variés (guide des tailles, fiches comparatives, Q&A produit).  

- **Boucler la remontée d’insights au COMEX**  
  - Rapport de fin de sprint 30 jours avec :  
    - évolution des scores par modèle (avant/après),  
    - liste des hallucinations critiques restantes,  
    - recommandations pour le sprint 2 (étendre au reste de la gamme et aux pays).  

Résultat attendu : un dispositif **vivant**, où les LLMs sont traités comme un **nouvel environnement de distribution et de réputation** que Cabaïa pilote activement, plutôt que comme une boîte noire subie.

---

### Conclusion

En 30 jours, Cabaïa peut passer d’une posture passive (“les LLMs parlent de nous comme ils veulent”) à une posture de **pilotage stratégique de son empreinte sémantique**.  
Le levier clé n’est pas de “corriger un modèle” en particulier, mais de **structurer, diffuser et monitorer la vérité de marque** via le MCP — en commençant par les trois zones où la valeur à risque est la plus élevée : B Corp, prix Adventurer Medium, et chiffres d’affaires 2025.