# Rapport de Certification - Protocole 2A v2.1
**Date :** 15 Mars 2026  
**Réseau :** Base Sepolia (L2)  
**Statut :** SYNCHRONISÉ & ANCRÉ

## 1. Preuve d'Ancrage Blockchain
- **Contrat Notaire :** `0xCB7436FeB68D673c9252C312d5b4263000fcD616`
- **Transaction Hash :** `0xfd559a35f5e56149da90c740c54aff5e4639b4c001b483c6bc277d83a26d9a86`
- **Méthode :** Décodage ABI du Log Event `Notarized`.

## 2. Vérification de l'Intégrité (Match Confirmé)
| Source | Valeur du Merkle Root |
| :--- | :--- |
| **Dépôt GitHub** | `0x1b6427a3710e0bb41d48125a57408f284b74d95c674e41f43a28115b46b0cedc` |
| **Blockchain (Decoded)** | `0x1b6427a3710e0bb41d48125a57408f284b74d95c674e41f43a28115b46b0cedc` |

**Verdict :** La correspondance est strictement identique au bit près. L'état du registre off-chain est certifié par l'infrastructure On-chain.

## 3. Méthodologie de Vérification Tierce
Pour reproduire cette vérification :
1. Extraire le champ `Data` du log de la transaction.
2. Appliquer un décodage hex-to-ASCII (Standard Solidity String).
3. Comparer avec le fichier `registry.json` du dépôt officiel.