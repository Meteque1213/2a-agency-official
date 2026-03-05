const registryData = [
    // --- ZONE ALERTE (Moat Delta Élevé / Red Flags) ---
    { name: "Goyard", category: "Trunkmaking", score: 42, hash: "0x2A_GOY_ERR_99", moatDelta: "38.2%" },
    { name: "Balenciaga", category: "Luxury Fashion", score: 54, hash: "0x2A_BAL_REK_09", moatDelta: "31.2%" },
    { name: "Zara (Inditex)", category: "Fast Fashion", score: 61, hash: "0x2A_ZAR_RED_11", moatDelta: "24.8%" },
    { name: "Tesla", category: "Automotive", score: 68, hash: "0x2A_TSL_DRIFT", moatDelta: "18.5%" },
    { name: "Amazon", category: "Logistics", score: 71, hash: "0x2A_AMZ_PROX", moatDelta: "16.4%" },
    { name: "Gucci", category: "Luxury Fashion", score: 76, hash: "0x2A_GUC_8211", moatDelta: "12.1%" },

    // --- GOLD STANDARDS (Excellence & Faible Moat Delta) ---
    { name: "Patek Philippe", category: "Watchmaking", score: 98, hash: "0x2A_PAT_9800", moatDelta: "0.5%" },
    { name: "Hermès", category: "Leather Goods", score: 96, hash: "0x2A_HER_9644", moatDelta: "1.2%" },
    { name: "Brunello Cucinelli", category: "Quiet Luxury", score: 97, hash: "0x2A_BRU_9788", moatDelta: "0.9%" },
    { name: "Ferrari", category: "Automotive Heritage", score: 95, hash: "0x2A_FER_9588", moatDelta: "1.8%" },
    { name: "Patagonia", category: "Ethical Apparel", score: 97, hash: "0x2A_PATG_9722", moatDelta: "0.8%" },
    { name: "Stripe", category: "Fintech Infrastructure", score: 94, hash: "0x2A_STR_9488", moatDelta: "1.4%" },

    // --- SECTEUR TECH & IA (Audit en cours / Drift Modéré) ---
    { name: "Apple", category: "Consumer Ecosystem", score: 91, hash: "0x2A_AAPL_9322", moatDelta: "2.3%" },
    { name: "OpenAI", category: "AI Frontier", score: 79, hash: "0x2A_OPN_AI_79", moatDelta: "12.4%" },
    { name: "NVIDIA", category: "Compute Infrastructure", score: 91, hash: "0x2A_NVDA_9102", moatDelta: "2.8%" },
    { name: "Anthropic", category: "AI Safety", score: 88, hash: "0x2A_ANTH_8811", moatDelta: "4.1%" },
    { name: "Microsoft", category: "Enterprise Cloud", score: 87, hash: "0x2A_MSFT_8755", moatDelta: "5.2%" },

    // --- RESTE DU TOP 100 (Restauré avec scores d'origine) ---
    { name: "Rolex", category: "Watchmaking", score: 92, hash: "0x2A_ROL_9211", moatDelta: "2.5%" },
    { name: "Vacheron Constantin", category: "Watchmaking", score: 96, hash: "0x2A_VAC_9611", moatDelta: "1.1%" },
    { name: "Audemars Piguet", category: "Watchmaking", score: 93, hash: "0x2A_AUD_9344", moatDelta: "2.5%" },
    { name: "LVMH Group", category: "Conglomerate", score: 85, hash: "0x2A_LVMH_8501", moatDelta: "6.5%" },
    { name: "Cartier", category: "Jewelry", score: 91, hash: "0x2A_CAR_9122", moatDelta: "2.9%" },
    { name: "Dior", category: "Luxury Fashion", score: 81, hash: "0x2A_DIO_8122", moatDelta: "8.4%" },
    { name: "Breguet", category: "Watchmaking", score: 94, hash: "0x2A_BRE_9422", moatDelta: "1.9%" },
    { name: "Loewe", category: "Leather Goods", score: 88, hash: "0x2A_LOE_8833", moatDelta: "4.2%" },
    { name: "Prada", category: "Luxury Fashion", score: 85, hash: "0x2A_PRA_8544", moatDelta: "6.3%" },
    { name: "Bottega Veneta", category: "Luxury Fashion", score: 93, hash: "0x2A_BOT_9321", moatDelta: "2.2%" },
    { name: "Chanel", category: "Haute Couture", score: 92, hash: "0x2A_CHA_9233", moatDelta: "3.2%" },
    { name: "Celine", category: "Luxury Fashion", score: 89, hash: "0x2A_CEL_8955", moatDelta: "3.8%" },
    { name: "Saint Laurent", category: "Luxury Fashion", score: 86, hash: "0x2A_YSL_8622", moatDelta: "5.4%" },
    { name: "A. Lange & Söhne", category: "Watchmaking", score: 97, hash: "0x2A_LAN_9711", moatDelta: "0.7%" },
    { name: "Van Cleef & Arpels", category: "Jewelry", score: 95, hash: "0x2A_VCA_9522", moatDelta: "1.5%" },
    { name: "Berluti", category: "Shoemaking", score: 92, hash: "0x2A_BER_9233", moatDelta: "2.4%" },
    { name: "Steinway & Sons", category: "Instruments", score: 98, hash: "0x2A_STE_9855", moatDelta: "0.3%" },
    { name: "Feadship", category: "Yachting", score: 96, hash: "0x2A_FEA_9622", moatDelta: "1.3%" },
    { name: "Rolls-Royce", category: "Automotive", score: 95, hash: "0x2A_RR_9501", moatDelta: "1.6%" },
    { name: "Dom Pérignon", category: "Champagne", score: 93, hash: "0x2A_DOM_9322", moatDelta: "2.3%" },
    { name: "Romanée-Conti", category: "Wine", score: 99, hash: "0x2A_DRC_9901", moatDelta: "0.1%" },
    { name: "Aman Resorts", category: "Hospitality", score: 96, hash: "0x2A_AMA_9611", moatDelta: "1.2%" },
    { name: "Leica", category: "Photography", score: 96, hash: "0x2A_LEI_9655", moatDelta: "1.0%" },
    { name: "SpaceX", category: "Aerospace", score: 92, hash: "0x2A_SPX_9288", moatDelta: "3.1%" },
    { name: "Palantir", category: "Data Analytics", score: 86, hash: "0x2A_PLTR_8633", moatDelta: "5.9%" },
    { name: "BlackRock", category: "Asset Management", score: 72, hash: "0x2A_BLK_7211", moatDelta: "14.2%" },
    { name: "Goldman Sachs", category: "Banking", score: 78, hash: "0x2A_GS_7833", moatDelta: "11.5%" }
];