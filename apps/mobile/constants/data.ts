import { RawProduct, IngredientCategory, RawShop } from "./types";
import { transformRawProduct } from "./transform";

const rawProducts: RawProduct[] = [
  {
    id: 1,
    title: "Abeille Royale SÉRUM HUILE-EN-EAU JEUNESSE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-serum-huile-en-eau-jeunesse-P062033.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw15709ea5/01-ProductsViewer/P062033/P062033_G062033_E01_hi-res.jpg?sw=655&sh=655&sfrm=png",
    price: 57,
    customerRating: 5,
    numberOfReviews: 3,
    collection: "Abeille Royale",
    typeOfCare: "Huile visage"
  },
  {
    id: 2,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME RICHE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-P061849.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw477cb18a/primary_packshot_3/2025/SK/AR/G061849_3346470618497_AB-ROY_24_RICH-CR_50ML_JAR.jpg?sw=655&sh=655&sfrm=png",
    price: 14,
    customerRating: 5,
    numberOfReviews: 3,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 3,
    title: "ABEILLE ROYALE SOIN-EN-MOUSSE NETTOYANT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-soin-en-mousse-nettoyant-P061989.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9e857bd4/primary_packshot_3/2024/Skincare/AR/ABEILLE%20ROYALE%20SOIN-EN-MOUSSE%20175ml%20.jpg?sw=655&sh=655&sfrm=png",
    price: 59,
    customerRating: 6,
    numberOfReviews: 9,
    collection: "Abeille Royale",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 4,
    title: "Abeille Royale DOUBLE R RENEW & REPAIR ADVANCED SERUM",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-r-renew-repair-advanced-serum-P061683.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwad25e632/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_SERUM_DOUBLE_R_50ML_-_FORMAT_WEB%20(2).jpg?sw=655&sh=655&sfrm=png",
    price: 15,
    customerRating: 5,
    numberOfReviews: 141,
    collection: "Abeille Royale",
    typeOfCare: "Serum"
  },
  {
    id: 5,
    title: "ABEILLE ROYALE CLARIFY & REPAIR CRÈME",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-clarify-repair-creme-P061846.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw3664b13e/primary_packshot_3/2024/Skincare/AR/G061846_3346470618466_AB-ROY-24-CR-BRIGHT-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 15,
    customerRating: 34,
    numberOfReviews: 58,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 6,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME JOUR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-jour-P061845.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb0e438da/primary_packshot_3/2023/Skincare/AR/CREAMS/G061845_3346470618459_AB-ROY-23-DAY-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    price: 14,
    customerRating: 5,
    numberOfReviews: 143,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 7,
    title: "Abeille Royale SÉRUM YEUX DOUBLE R RENEW & REPAIR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-serum-yeux-double-r-renew-repair-P061797.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2a2c9e15/primary_packshot_3/2023/Skincare/AR/AR_DOUBLE_R_EYE_SERUM_20ML_.jpg?sw=655&sh=655&sfrm=png",
    price: 12,
    customerRating: 5,
    numberOfReviews: 121,
    collection: "Abeille Royale",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 8,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME NUIT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-nuit-P061850.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb70760fb/primary_packshot_3/2023/Skincare/AR/CREAMS/G061850_3346470618503_AB-ROY-23-NIGHT-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    price: 16,
    customerRating: 49,
    numberOfReviews: 131,
    collection: "Abeille Royale",
    typeOfCare: "Soin de nuit"
  },
  {
    id: 9,
    title: "Abeille Royale Huile-en-Baume Jeunesse Réparation Intense",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-huile-en-baume-jeunesse-reparation-intense-P061609.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwa505f2a4/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_BAUME_CICA_80ML.jpg?sw=655&sh=655&sfrm=png",
    price: 23,
    customerRating: 31,
    numberOfReviews: 116,
    collection: "Abeille Royale",
    typeOfCare: "Huile visage"
  },
  {
    id: 10,
    title: "ABEILLE ROYALE LOTION FORTIFIANTE À LA GELÉE ROYALE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-lotion-fortifiante-a-la-gelee-royale-P061555.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwc5e19c29/primary_packshot_3/2024/Skincare/AR/G061555_3346470615557_AB-ROY-20-LOT-150ML-BTL.jpg?sw=655&sh=655&sfrm=png",
    price: 81,
    customerRating: 31,
    numberOfReviews: 72,
    collection: "Abeille Royale",
    typeOfCare: "Lotion"
  },
  {
    id: 11,
    title: "ABEILLE ROYALE DOUBLE ESSENCE CLARIFY & REPAIR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-essence-clarify-repair-P061732.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw10380591/primary_packshot_3/2024/Skincare/AR/G061732_3346470617322_AB-ROY-24-ESS-FL-150ML.jpg?sw=655&sh=655&sfrm=png",
    price: 12,
    customerRating: 38,
    numberOfReviews: 4,
    collection: "Abeille Royale",
    typeOfCare: "Serum"
  },
  {
    id: 12,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME RICHE – LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-la-recharge-P061857.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb5c23a6a/primary_packshot_3/2024/Skincare/AR/ABEILLE%20ROYALE%20CRÈME%20RICHE%2050ml%20-%20RECHARGE.jpg?sw=655&sh=655&sfrm=png",
    price: 12,
    customerRating: 9,
    numberOfReviews: 60,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 13,
    title: "ABEILLE ROYALE CLARIFY & REPAIR CRÈME - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-clarify-repair-creme---la-recharge-P061856.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwd8157ee1/primary_packshot_3/2024/Skincare/AR/G061856_%203346470618565_AB-BOY-24-CR-BRIGHT-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 13,
    customerRating: 45,
    numberOfReviews: 2,
    collection: "Abeille Royale",   
    typeOfCare: "Soin de jour"
  },
  {
    id: 14,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME JOUR – LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-jour-la-recharge-P061855.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwafbf1210/primary_packshot_3/2023/Skincare/AR/CREAMS/G061855_3346470618558_AB-ROY-23-CR-JR-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 12,
    customerRating: 34,
    numberOfReviews: 18,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 15,
    title: "ABEILLE ROYALE HONEY TREATMENT CRÈME NUIT – LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-nuit-la-recharge-P061858.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf8fc9361/primary_packshot_3/2023/Skincare/AR/CREAMS/G061858_3346470618589_AB-ROY-23-CR-NUIT-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 14,
    customerRating: 37,
    numberOfReviews: 7,
    collection: "Abeille Royale",
    typeOfCare: "Soin de nuit"
  },
  {
    id: 16,
    title: "ABEILLE ROYALE CRÈME YEUX",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-creme-yeux-P061536.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw4afe6705/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_CREME_YEUX.jpg?sw=655&sh=655&sfrm=png",
    price: 10,
    customerRating: 5,
    numberOfReviews: 14,
    collection: "Abeille Royale",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 17,
    title: "Abeille Royale UV SKIN DEFENSE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-uv-skin-defense-P061733.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf9645542/primary_packshot_3/2023/Skincare/AR/ABEILLE_ROYALE_-_FLUIDE_UV_SKIN_DEFENSE_50ml.jpg?sw=655&sh=655&sfrm=png",
    price: 80,
    customerRating: 49,
    numberOfReviews: 72,
    collection: "Abeille Royale",
    typeOfCare: "Protection UV"
  },
  {
    id: 18,
    title: "ABEILLE ROYALE BEE GLOW",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-bee-glow-P061394.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb57ee86b/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_BEE_GLOW_30ML.jpg?sw=655&sh=655&sfrm=png",
    price: 97,
    customerRating: 42,
    numberOfReviews: 24,
    collection: "Abeille Royale",
    typeOfCare: "Soin de jour"
  },
  {
    id: 19,
    title: "ORCHIDÉE IMPÉRIALE LA GELÉE D’HUILE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-la-gelee-dhuile-P061904.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbbf05749/01-ProductsViewer/P061904/P061904_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 11,
    customerRating: 50,
    numberOfReviews: 63,
    collection: "Orchidée Impériale",
    typeOfCare: "Huile visage"
  },
  {
    id: 20,
    title: "ORCHIDÉE IMPÉRIALE LA MOUSSE EN CRÈME",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-la-mousse-en-creme-P061885.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb1983d98/01-ProductsViewer/P061885/P061885_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 11,
    customerRating: 50,
    numberOfReviews: 56,
    collection: "Orchidée Impériale",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 21,
    title: "ORCHIDÉE IMPÉRIALE L'HUILE FONDAMENTALE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-lhuile-fondamentale-P062010.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwef25deb3/primary_packshot_3/2025/SK/OI-BLUE/FUNDAMENTAL_OIL/ORCHIDEE_IMPERIALE_-_L_HUILE_FONDAMENTALE_30ml.jpg?sw=655&sh=655&sfrm=jpg",
    price: 33,
    customerRating: 50,
    numberOfReviews: 32,
    collection: "Orchidée Impériale",
    typeOfCare: "Huile visage"
  },
  {
    id: 22,
    title: "ORCHIDÉE IMPÉRIALE LE MASQUE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-masque-P062011.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw4e24bf74/primary_packshot_3/2024/Skincare/OI_BLUE/G062011_3346470620117_OI-24-MASK-JAR-75ML.jpg?sw=655&sh=655&sfrm=jpg",
    price: 39,
    customerRating: 50,
    numberOfReviews: 36,
    collection: "Orchidée Impériale",
    typeOfCare: "Masque"
  },
  {
    id: 23,
    title: "ORCHIDÉE IMPÉRIALE LA CRÈME COU ET DÉCOLLETÉ",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-la-creme-cou-et-decollete-P062012.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2510ede1/primary_packshot_3/2024/Skincare/OI_BLUE/G062012_3346470620124_OI-24-NECK&LOW-NECK-JAR-75ML.jpg?sw=655&sh=655&sfrm=jpg",
    price: 39,
    customerRating: 50,
    numberOfReviews: 36,
    collection: "Orchidée Impériale",
    typeOfCare: "Soin cou et décolleté"
  },
  {
    id: 24,
    title: "ORCHIDÉE IMPÉRIALE LE CONCENTRÉ LOTION-ESSENCE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-concentre-lotion-essence-P061894.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw4cb7c6d5/primary_packshot_3/2023/Skincare/OI%20BLUE/G061894_3346470618947_O1-23-LOT-140ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 18,
    customerRating: 37,
    numberOfReviews: 43,
    collection: "Orchidée Impériale",
    typeOfCare: "Lotion"
  },
  {
    id: 25,
    title: "ORCHIDÉE IMPÉRIALE LE SÉRUM DE NUIT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-serum-de-nuit-P061957.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb0796a2a/primary_packshot_3/2023/Skincare/OI%20BLUE/G061520_3346470615205_OI-20-NIGHT-SER-30ML-PUMP-BTL_2.jpg?sw=655&sh=655&sfrm=jpg",
    price: 49,
    customerRating: 50,
    numberOfReviews: 85,
    collection: "Orchidée Impériale",
    typeOfCare: "Serum"
  },
  {
    id: 26,
    title: "ORCHIDÉE IMPÉRIALE LE CONCENTRÉ DE TEINT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-concentre-de-teint-P061951.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6a3c3429/primary_packshot_3/2023/Skincare/OI%20BLUE/G061550_3346470615502_OI-21-FDT-T01N-30ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 19,
    customerRating: 31,
    numberOfReviews: 1,
    collection: "Orchidée Impériale",
    typeOfCare: "Base de teint et fond de teint"
  },
  {
    id: 27,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LE SOIN CONCENTRÉ REGARD",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-le-soin-concentre-regard-P062158.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9706f627/01-ProductsViewer/P062158/P062158_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 46,
    customerRating: 50,
    numberOfReviews: 98,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 28,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LE SOIN CONCENTRÉ REGARD - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-le-soin-concentre-regard---la-recharge-P062159.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6e0a6950/primary_packshot_3/2025/SK/OI-GOLD/P062159_G062159_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 39,
    customerRating: 50,
    numberOfReviews: 36,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 29,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LA CRÈME",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-la-creme-P061801.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw1f71f2b7/primary_packshot_3/2025/SK/OI-GOLD/OI-GOLD_PRIMARY-VISUAL_PDP_CREAM.jpg?sw=655&sh=655&sfrm=jpg",
    price: 65,
    customerRating: 35,
    numberOfReviews: 40,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin de jour"
  },
  {
    id: 24,
    title: "ORCHIDÉE IMPÉRIALE LE CONCENTRÉ LOTION-ESSENCE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-concentre-lotion-essence-P061894.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw4cb7c6d5/primary_packshot_3/2023/Skincare/OI%20BLUE/G061894_3346470618947_O1-23-LOT-140ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 18,
    customerRating: 37,
    numberOfReviews: 43,
    collection: "Orchidée Impériale",
    typeOfCare: "Lotion"
  },
  {
    id: 25,
    title: "ORCHIDÉE IMPÉRIALE LE SÉRUM DE NUIT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-serum-de-nuit-P061957.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb0796a2a/primary_packshot_3/2023/Skincare/OI%20BLUE/G061520_3346470615205_OI-20-NIGHT-SER-30ML-PUMP-BTL_2.jpg?sw=655&sh=655&sfrm=jpg",
    price: 49,
    customerRating: 50,
    numberOfReviews: 52,
    collection: "Orchidée Impériale",
    typeOfCare: "Serum"
  },
  {
    id: 26,
    title: "ORCHIDÉE IMPÉRIALE LE CONCENTRÉ DE TEINT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-concentre-de-teint-P061951.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6a3c3429/primary_packshot_3/2023/Skincare/OI%20BLUE/G061550_3346470615502_OI-21-FDT-T01N-30ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 19,
    customerRating: 31,
    numberOfReviews: 1,
    collection: "Orchidée Impériale",
    typeOfCare: "Base de teint et fond de teint"
  },
  {
    id: 27,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LE SOIN CONCENTRÉ REGARD",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-le-soin-concentre-regard-P062158.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9706f627/01-ProductsViewer/P062158/P062158_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 46,
    customerRating: 50,
    numberOfReviews: 6,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 28,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LE SOIN CONCENTRÉ REGARD - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-le-soin-concentre-regard---la-recharge-P062159.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6e0a6950/primary_packshot_3/2025/SK/OI-GOLD/P062159_G062159_E01_hi-res.jpg?sw=655&sh=655&sfrm=jpg",
    price: 39,
    customerRating: 50,
    numberOfReviews: 74,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 29,
    title: "ORCHIDÉE IMPÉRIALE GOLD NOBILE LA CRÈME",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-gold-nobile-la-creme-P061801.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw1f71f2b7/primary_packshot_3/2025/SK/OI-GOLD/OI-GOLD_PRIMARY-VISUAL_PDP_CREAM.jpg?sw=655&sh=655&sfrm=jpg",
    price: 65,
    customerRating: 35,
    numberOfReviews: 40,
    collection: "Orchidée Impériale Gold Nobile",
    typeOfCare: "Soin de jour"
  },
  {
    id: 30,
    title: "ORCHIDÉE IMPÉRIALE BLACK LE SYMBIOSÉRUM",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-le-symbioserum-P061597.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-le-symbioserum-P061597.html",
    price: 140,
    customerRating: 37,
    numberOfReviews: 3,
    collection: "Orchidée Impériale Black",
    typeOfCare: "Serum"
  },
  {
    id: 31,
    title: "ORCHIDÉE IMPÉRIALE BLACK LA CRÈME CONTOUR YEUX ET LÈVRES",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-la-creme-contour-yeux-et-levres-P061965.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-la-creme-contour-yeux-et-levres-P061965.html",
    price: 70,
    customerRating: 50,
    numberOfReviews: 10,
    collection: "Orchidée Impériale Black",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 32,
    title: "ORCHIDÉE IMPÉRIALE BLACK LA LOTION n-FUSION - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-la-lotion-n-fusion---la-recharge-P061921.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw83ee85d4/primary_packshot_3/2024/Skincare/OI_BLACK/OI-BLACK-LOTION_PRIMARY-VISUAL_PDP_140ML-REFILL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 55,
    customerRating: 50,
    numberOfReviews: 58,
    collection: "Orchidée Impériale Black",
    typeOfCare: "Lotion"
  },
  {
    id: 33,
    title: "ORCHIDÉE IMPÉRIALE BLACK LE SYMBIOSÉRUM - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-le-symbioserum---la-recharge-P061598.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbd96e40c/primary_packshot_3/2022/Skincare/OI_BLACK/G061598-OI-BLACK0-SERUM_REFILL-ouvert-V4.jpg?sw=655&sh=655&sfrm=jpg",
    price: 110,
    customerRating: 50,
    numberOfReviews: 32,
    collection: "Orchidée Impériale Black",
    typeOfCare: "Serum"
  },
  {
    id: 34,
    title: "ORCHIDÉE IMPÉRIALE BLACK LA CRÈME CONTOUR YEUX ET LÈVRES - LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-black-la-creme-contour-yeux-et-levres---la-recharge-P061964.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw179b15e7/primary_packshot_3/2022/Skincare/OI_BLACK/G061512-OI-Black-la-creme-50ml-EYE-AND-LIP-CREAM-REFILL--20ml-V5.jpg?sw=655&sh=655&sfrm=jpg",
    price: 47,
    customerRating: 6,
    numberOfReviews: 3,
    collection: "Orchidée Impériale Black",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 35,
    title: "ORCHIDÉE IMPÉRIALE BRIGHTENING LE CONCENTRÉ DE LUMIÈRE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-brightening-le-concentre-de-lumiere-P061968.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbc21b0f6/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061533_3346470615335_OI-BRIGHT-20-SER-30ML-BTL.jpg?sw=655&sh=655&sfrm=png",
    price: 49,
    customerRating: 5,
    numberOfReviews: 1,
    collection: "Orchidée Impériale Brightening",
    typeOfCare: "Soin éclaircissant"
  },
  {
    id: 36,
    title: "Orchidée Impériale Brightening Le Protecteur UV Global",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-brightening-le-protecteur-uv-global-P061667.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwd46dc9e7/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061667_3346470616677_OI-BRIGHT-22-UV-SHIELD-30ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=png",
    price: 15,
    customerRating: 45,
    numberOfReviews: 34,
    collection: "Orchidée Impériale Brightening",
    typeOfCare: "Protection UV"
  },
  {
    id: 37,
    title: "ORCHIDÉE IMPÉRIALE LE CONCENTRÉ DE TEINT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/orchidee-imperiale-le-concentre-de-teint-P061951.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6a3c3429/primary_packshot_3/2023/Skincare/OI%20BLUE/G061550_3346470615502_OI-21-FDT-T01N-30ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=jpg",
    price: 19,
    customerRating: 31,
    numberOfReviews: 1,
    collection: "Orchidée Impériale Brightening",
    typeOfCare: "Base de teint et fond de teint"
  },
  {
    id: 38,
    title: "SUPER AQUA-EMULSION ÉMULSION UNIVERSELLE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-emulsion-emulsion-universelle-P061543.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw1be2aec7/primary_packshot_3/2022/Skincare/Revamp%20Packshot/SUPER_AQUA-EMULSION_UNIVERSELLE_50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 13,
    customerRating: 38,
    numberOfReviews: 7,
    collection: "Super Aqua-Serum",
    typeOfCare: "Soin de jour"
  },
  {
    id: 39,
    title: "SUPER AQUA-EMULSION ÉMULSION LÉGÈRE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-emulsion-emulsion-legere-P061542.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6b6f006a/primary_packshot_3/2022/Skincare/Revamp%20Packshot/SUPER_AQUA-EMULSION_LEGERE_50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 13,
    customerRating: 5,
    numberOfReviews: 4,
    collection: "Super Aqua-Serum",
    typeOfCare: "Soin de jour"
  },
  {
    id: 40,
    title: "SUPER AQUA-EMULSION ÉMULSION RICHE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-emulsion-emulsion-riche-P061544.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw5e040104/primary_packshot_3/2022/Skincare/Revamp%20Packshot/SUPER_AQUA-EMULSION_RICHE_50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 13,
    customerRating: 49,
    numberOfReviews: 7,
    collection: "Super Aqua-Serum",
    typeOfCare: "Soin de jour"
  },
  {
    id: 41,
    title: "SUPER AQUA-SERUM SÉRUM",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-serum-serum-P061494.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-serum-serum-P061494.html",
    price: 17,
    customerRating: 5,
    numberOfReviews: 5,
    collection: "Super Aqua-Serum",
    typeOfCare: "Serum"
  },
  {
    id: 42,
    title: "SUPER AQUA-LOTION LOTION",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-lotion-lotion-P061495.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-lotion-lotion-P061495.html",
    price: 59,
    customerRating: 34,
    numberOfReviews: 11,
    collection: "Super Aqua-Serum",
    typeOfCare: "Lotion"
  },
  {
    id: 43,
    title: "SUPER AQUA-MASK MASQUE HYDRATATION INTENSE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-mask-masque-hydratation-intense-P061545.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-mask-masque-hydratation-intense-P061545.html",
    price: 13,
    customerRating: 5,
    numberOfReviews: 10,
    collection: "Super Aqua-Serum",
    typeOfCare: "Masque"
  },
  {
    id: 44,
    title: "SUPER AQUA-EYE SERUM SÉRUM YEUX",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-eye-serum-serum-yeux-P060971.html",
    image_url: "https://www.guerlain.com/fr/fr-fr/p/super-aqua-eye-serum-serum-yeux-P060971.html",
    price: 98,
    customerRating: 42,
    numberOfReviews: 2,
    collection: "Super Aqua-Serum",
    typeOfCare: "Soin yeux et lèvres"
  },
  {
    id: 45,
    title: "Blanc de perle Essence éclaircissante",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/blanc-de-perle-essence-eclaircissante-P061448.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwdf416ed1/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061448_3346470614482_BDP_19_ESS_FL_POMPE_30ML.jpg?sw=655&sh=655&sfrm=png",
    price: 14,
    customerRating: 42,
    numberOfReviews: 5,
    collection: "Blanc de Perle",
    typeOfCare: "Soin éclaircissant"
  },
  {
    id: 46,
    title: "Blanc de Perle Lotion Anti-Tache",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/blanc-de-perle-lotion-anti-tache-P061195.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf4974281/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061195_3346470611955_BDP_16_LOT_FL_POMPE_200ML.jpg?sw=655&sh=655&sfrm=png",
    price: 70,
    customerRating: 31,
    numberOfReviews: 3,
    collection: "Blanc de Perle",
    typeOfCare: "Lotion"
  },
  {
    id: 47,
    title: "Blanc de Perle Mousse Eclaircissante",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/blanc-de-perle-mousse-eclaircissante-P061186.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw6b2d3062/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061186_3346470611863_BDP_16_GEL_MOUS_TB_150ML.jpg?sw=655&sh=655&sfrm=png",
    price: 61,
    customerRating: 31,
    numberOfReviews: 8,
    collection: "Blanc de Perle",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 48,
    title: "Blanc de Perle Base UV Lumière IP 30",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/blanc-de-perle-base-uv-lumiere-ip-30-P061111.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwd7095c2c/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061111_3346470611115_BDP_15_BASE_UV_LUMIERE_TB_30ML.jpg?sw=655&sh=655&sfrm=png",
    price: 72,
    customerRating: 39,
    numberOfReviews: 2,
    collection: "Blanc de Perle",
    typeOfCare: "Protection UV"
  },
  {
    id: 49,
    title: "MIDNIGHT SECRET SOIN RÉCUPÉRATION NUIT BRÈVE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/midnight-secret-soin-recuperation-nuit-breve-P061221.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw1e462685/primary_packshot_3/2022/Skincare/Revamp%20Packshot/MY_SUPERTIPS_MIDNIGHT_SECRET.jpg?sw=655&sh=655&sfrm=png",
    price: 35,
    customerRating: 5,
    numberOfReviews: 18,
    collection: "Midnight Secret",
    typeOfCare: "Soin de nuit"
  },
  {
    id: 50,
    title: "Lait de Beauté Lait démaquillant",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/lait-de-beaute-lait-demaquillant-P061120.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw20f3f75d/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061120_3346470611207_NETTOYER_15_DEMAQ_LAIT_200ML_IL13272.jpg?sw=655&sh=655&sfrm=png",
    price: 58,
    customerRating: 39,
    numberOfReviews: 4, 
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 51,
    title: "Crème de Beauté Crème démaquillante",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/creme-de-beaute-creme-demaquillante-P061121.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw014f72a5/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061121_3346470611214_NETTOYER_15_DEMAQ_CR_200ML.jpg?sw=655&sh=655&sfrm=png",
    price: 76,
    customerRating: 5,
    numberOfReviews: 5,
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 52,
    title: "Mousse de Beauté Mousse nettoyante",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/mousse-de-beaute-mousse-nettoyante-P061122.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb3709022/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061122_3346470611221_NETTOYER_15_DEMAQ_MOUSSE_150ML.jpg?sw=655&sh=655&sfrm=png",
    price: 58,
    customerRating: 5,
    numberOfReviews: 9,
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 53,
    title: "Eau de Beauté Eau micellaire",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/eau-de-beaute-eau-micellaire-P061124.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw14488ceb/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061124_3346470611245_NETTOYER_15_DEMAQ_EAU_200ML.jpg?sw=655&sh=655&sfrm=png",
    price: 58,
    customerRating: 43,
    numberOfReviews: 10,
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 54,
    title: "Beauté des Yeux Démaquillant yeux biphase",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/beaute-des-yeux-demaquillant-yeux-biphase-P061119.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf453d58a/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061119_3346470611191_NETTOYER_15_DEMAQ_BIPH_YEUX_FL_125ML.jpg?sw=655&sh=655&sfrm=png",
    price: 52,
    customerRating: 5,
    numberOfReviews: 8 ,
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  },
  {
    id: 55,
    title: "Le Gommage de Beauté Exfoliant resurfaçant",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/le-gommage-de-beaute-exfoliant-resurfacant-P061294.html",
    image_url: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw47083168/primary_packshot_3/2022/Skincare/Revamp%20Packshot/G061294_3346470612945_NETTOYER_16_PEELING_TB_75ML.jpg?sw=655&sh=655&sfrm=png",
    price: 68,
    customerRating: 3.1,
    numberOfReviews: 11,
    collection: "Les Démaquillants de Beauté",
    typeOfCare: "Démaquillant et nettoyant"
  }
];

export const rawIngredient: IngredientCategory[] = [
  {
    category: "Huiles végétales",
    ingredients: [
      {
        id: 1,
        name: "Huile d’argan",
        description: "Huile riche en vitamine E, nourrissante et régénérante.",
        image: "https://media1.propos-bio.com/4367-thickbox_default/argan-bio-huile-vegetale-vierge-100-ml.jpg"
      },
      {
        id: 2,
        name: "Huile de figue de barbarie",
        description: "Précieuse pour ses propriétés anti-âge et raffermissantes.",
        image: "https://www.bionoble.co/cdn/shop/products/Bionoble-huile-vegetale-huile-de-pepins-de-figue-de-barbarie-bio-gamme-fiche-produit_750x.jpg?v=1666601790"
      },
      {
        id: 3,
        name: "Huile de coco",
        description: "Hydratante, adoucissante et légèrement parfumée.",
        image: "https://www.fitnessboutique.fr/cdn/shop/files/inshape-nutrition-huile-coco-Detail.jpg?v=1737734695&width=536"
      }
    ]
  },
  {
    category: "Beurres",
    ingredients: [
      {
        id: 4,
        name: "Beurre de karité",
        description: "Beurre nourrissant, réparateur et protecteur.",
        image: "https://comptoirdeshuiles.com/cdn/shop/files/beurre_karite_bois.webp?v=1732186701"
      }
    ]
  },
  {
    category: "Produits de la ruche",
    ingredients: [
      {
        id: 5,
        name: "Cire d’abeille jaune",
        description: "Utilisée pour épaissir et protéger la peau.",
        image: "https://m.media-amazon.com/images/I/91Uymnpo-gL._UF1000,1000_QL80_.jpg"
      },
      {
        id: 6,
        name: "Gelée royale en poudre",
        description: "Riche en nutriments, revitalisante pour la peau.",
        image: "https://divinebox.fr/wp-content/uploads/2022/02/Gele%CC%81e-Royale-Bio-Abbaye-Notre-Dame-de-Sept-Fons-Divine-Box.jpeg"
      },
      {
        id: 7,
        name: "Miel de jebel",
        description: "Miel naturel de montagne, hydratant et antiseptique.",
        image: "https://www.melilot.fr/1-large_default/miel-montagne.jpg"
      },
      {
        id: 8,
        name: "Miel de sidir",
        description: "Miel rare, nourrissant et cicatrisant.",
        image: "https://m.media-amazon.com/images/I/51FHeYsumSL._UF350,350_QL80_.jpg"
      },
      {
        id: 9,
        name: "Miel de zaatar",
        description: "Miel aromatique aux propriétés purifiantes.",
        image: "https://www.nicolebernard.fr/9335-large_default/miel-de-thym-origine-espagne.jpg"
      }
    ]
  },
  {
    category: "Huiles essentielles",
    ingredients: [
      {
        id: 10,
        name: "HE Rose de Damas",
        description: "Huile précieuse, tonifiante et apaisante.",
        image: "https://www.essenciagua.fr/pim2/main/main-rose-de-damas-1.jpg"
      },
      {
        id: 11,
        name: "HE Néroli",
        description: "Huile relaxante et régénérante pour la peau.",
        image: "https://img.passeportsante.net/1200x675/2024-06-19/huile-essentielle-neroli.jpg"
      }
    ]
  },
  {
    category: "Absolue",
    ingredients: [
      {
        id: 12,
        name: "Jasmin Sambac",
        description: "Extrait floral très parfumé, relaxant et harmonisant.",
        image: "https://static.aujardin.info/cache/th/par/jasminum-sambac-600x450.webp"
      }
    ]
  },
  {
    category: "Extraits",
    ingredients: [
      {
        id: 13,
        name: "Gel d’aloe vera natif",
        description: "Hydratant, apaisant et réparateur naturel.",
        image: "https://www.green-shop.ch/img/styles/blog/cms/Blog/blog_comment-utiliser-le-gel-d-aloe-vera.webp?p=ec13bf6d"
      }
    ]
  },
  {
    category: "Conservateurs & antioxydants",
    ingredients: [
      {
        id: 14,
        name: "Cosgard",
        description: "Conservateur doux pour les préparations cosmétiques.",
        image: "https://www.slolie.fr/cdn/shop/articles/quest-ce-que-le-cosgard-et-comment-utiliser-ce-conservateur-214839.jpg?v=1681496845&width=900"
      },
      {
        id: 15,
        name: "Vitamine E",
        description: "Antioxydant naturel qui prolonge la durée de vie des huiles.",
        image: "https://www.ericfavre.com/lifestyle/wp-content/uploads/2020/03/VITAMINE-E.jpg"
      }
    ]
  },
  {
    category: "Autres ingrédients naturels",
    ingredients: [
      {
        id: 16,
        name: "Avoine",
        description: "Apaisant et adoucissant pour les peaux sensibles.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdg4wmbLMLzIJPq88mbP6DxSNCJ28QjIaohQ&s"
      },
      {
        id: 17,
        name: "Citron (frais)",
        description: "Astringent, purifiant et éclaircissant naturel.",
        image: "https://media.istockphoto.com/id/471141162/fr/photo/lemons-sur-gris-fond-en-bois.jpg?s=612x612&w=0&k=20&c=64TMiAtNtd3cbTeJho9VEB4ut17Z5sWKgY6D4iwmpdI="
      },
      {
        id: 18,
        name: "Café",
        description: "Tonifiant, exfoliant naturel pour la peau.",
        image: "https://www.le-guide-sante.org/sites/default/files/styles/full_size_10_cols/public/resources/news/cafe-bienfaits-mefaits-sante.jpg?itok=uozPwnJv"
      },
      {
        id: 19,
        name: "Cerise",
        description: "Riche en antioxydants et vitamines, apporte éclat.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS6A0hPUC43fiNcz-8uP15Rj4yW9RPaziFXscbHurjFGvMo0clahnncLLngVF4gMO2OVw&usqp=CAU"
      }
    ]
  }
];

export const rawHairCare: RawShop[] = [
  {
    id: 1,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY BOND TREATMENT SOIN SANS RINÇAGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale--honey-bond-treatment-soin-sans-rincage-P062076.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbc3ff127/01-ProductsViewer/P062076/P062076_E01_hi-res.jpg?sw=655&sh=655&sfrm=png",
    price: 84,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 2,
    Subtitle: "Abeille Royale",
    Name: "Huile-en-Sérum Jeunesse Cuir Chevelu et Cheveux",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-huile-en-serum-jeunesse-cuir-chevelu-et-cheveux-P061665.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw526e7de1/primary_packshot_3/2022/Skincare/AR/G061665_3346470616653_AB-ROY-22-SCALP-SER-50ML-BTL-1.jpg?sw=655&sh=655&sfrm=png",
    price: 140,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 3,
    Subtitle: "ABEILLE ROYALE",
    Name: "SOIN LAVANT REVITALISANT & FORTIFIANT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-soin-lavant-revitalisant-fortifiant-P061886.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/fr_FR/dw9576846f/primary_packshot_3/2023/Skincare/AR/HAIRCARE/G061886_3346470618862_AB-ROY-23-HAIR-SHAMP-FL-PPE-290ML-1.jpg?sw=655&sh=655&sfrm=png",
    price: 75,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 4,
    Subtitle: "ABEILLE ROYALE",
    Name: "DOUBLE R RADIANCE & REPAIR MASK",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-r-radiance-repair-mask-P061888.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/fr_FR/dw2756037f/primary_packshot_3/2023/Skincare/AR/HAIRCARE/G061888_3346470618886_AB-ROY-23-HAIR-MASQUE-TB-200ML-1.jpg?sw=655&sh=655&sfrm=png",
    price: 87,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 5,
    Subtitle: "ABEILLE ROYALE",
    Name: "SOIN DÉMÊLANT RÉPARATEUR & REPULPANT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-soin-demelant-reparateur-repulpant-P061887.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/fr_FR/dw08489373/primary_packshot_3/2023/Skincare/AR/HAIRCARE/G061887_3346470618879_AB-ROY-23-HAIR-APR-SHAMP-FL-PPE-290ML-1.jpg?sw=655&sh=655&sfrm=png",
    price: 75,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 6,
    Subtitle: "ABEILLE ROYALE",
    Name: "BROSSE DE SOIN CUIR CHEVEAU ET CHEVEUX",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-brosse-de-soin-cuir-chevelu-et-cheveux-P061892.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw0c8f3b4b/primary_packshot_3/2023/Skincare/AR/HAIRCARE/G061892_3346470618923_AB-ROY-23-HAIR-BROSSE.jpg?sw=655&sh=655&sfrm=png",
    price: 150,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 7,
    Subtitle: "ABEILLE ROYALE",
    Name: "RITUEL JEUNESSE DU CUIR CHEVELU ET DU CHEVEU",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-rituel-jeunesse-du-cuir-chevelu-et-du-cheveu-P100017.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9e3bfb12/primary_packshot_3/2024/Skincare/SETS/G062016_ 3346470620162_AB-ROY-24-HAIR-SET_1.jpg?sw=655&sh=655&sfrm=jpg",
    price: 140,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 8,
    Subtitle: "ABEILLE ROYALE",
    Name: "RITUEL JEUNESSE DU CUIR CHEVELU ET DU CHEVEU",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-rituel-jeunesse-du-cuir-chevelu-et-du-cheveu-P062016.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw0c7a3db0/primary_packshot_3/2025/SK/AR/G100017_3346471000178_AB-ROY-25-HAIR-SET.jpg?sw=655&sh=655&sfrm=jpg",
    price: 180,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 9,
    Subtitle: "ABEILLE ROYALE",
    Name: "CRÈME YEUX",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-creme-yeux-P061536.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2a2c9e15/primary_packshot_3/2023/Skincare/AR/AR_DOUBLE_R_EYE_SERUM_20ML_.jpg?sw=655&sh=655&sfrm=png",
    price: 100,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 10,
    Subtitle: "Abeille Royale",
    Name: "UV SKIN DEFENSE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-uv-skin-defense-P061733.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf9645542/primary_packshot_3/2023/Skincare/AR/ABEILLE_ROYALE_-_FLUIDE_UV_SKIN_DEFENSE_50ml.jpg?sw=655&sh=655&sfrm=png",
    price: 80,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 11,
    Subtitle: "ABEILLE ROYALE",
    Name: "BEE GLOW",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-bee-glow-P061394.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb57ee86b/primary_packshot_3/2022/Skincare/Revamp Packshot/ABEILLE_ROYALE_BEE_GLOW_30ML.jpg?sw=655&sh=655&sfrm=png",
    price: 97,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 12,
    Subtitle: "Abeille Royale",
    Name: "SÉRUM HUILE-EN-EAU JEUNESSE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-serum-huile-en-eau-jeunesse-P062033.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw15709ea5/01-ProductsViewer/P062033/P062033_G062033_E01_hi-res.jpg?sw=655&sh=655&sfrm=png",
    price: 57,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 13,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME RICHE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-P061849.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb5c23a6a/primary_packshot_3/2024/Skincare/AR/ABEILLE ROYALE CRÈME RICHE 50ml - RECHARGE.jpg?sw=655&sh=655&sfrm=png",
    price: 140,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 14,
    Subtitle: "ABEILLE ROYALE",
    Name: "SOIN-EN-MOUSSE NETTOYANT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-soin-en-mousse-nettoyant-P061989.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9e857bd4/primary_packshot_3/2024/Skincare/AR/ABEILLE ROYALE SOIN-EN-MOUSSE 175ml .jpg?sw=655&sh=655&sfrm=png",
    price: 59,
    Arrivals: "NOUVEAU",
    category: "Hair"
  },
  {
    id: 15,
    Subtitle: "Abeille Royale",
    Name: "DOUBLE R RENEW & REPAIR ADVANCED SERUM",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-r-renew-repair-advanced-serum-P061683.html",
    Image: "[\"https://www.guerlain.com/...png\"]",
    price: 150,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 16,
    Subtitle: "ABEILLE ROYALE",
    Name: "CLARIFY & REPAIR CRÈME",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-clarify-repair-creme-P061846.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw3664b13e/primary_packshot_3/2024/Skincare/AR/G061846_3346470618466_AB-ROY-24-CR-BRIGHT-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    price: 150,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 17,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME JOUR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-jour-P061845.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb0e438da/primary_packshot_3/2023/Skincare/AR/CREAMS/G061845_3346470618459_AB-ROY-23-DAY-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    price: 140,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 18,
    Subtitle: "Abeille Royale",
    Name: "SÉRUM YEUX DOUBLE R RENEW & REPAIR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-serum-yeux-double-r-renew-repair-P061797.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2a2c9e15/primary_packshot_3/2023/Skincare/AR/AR_DOUBLE_R_EYE_SERUM_20ML_.jpg?sw=655&sh=655&sfrm=png",
    price: 120,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 19,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME NUIT",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-nuit-P061850.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb70760fb/primary_packshot_3/2023/Skincare/AR/CREAMS/G061850_3346470618503_AB-ROY-23-NIGHT-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    price: 160,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 20,
    Subtitle: "Abeille Royale",
    Name: "Huile-en-Baume Jeunesse Réparation Intense",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-huile-en-baume-jeunesse-reparation-intense-P061609.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/fr_FR/dw2756037f/primary_packshot_3/2023/Skincare/AR/HAIRCARE/G061888_3346470618886_AB-ROY-23-HAIR-MASQUE-TB-200ML-1.jpg?sw=655&sh=655&sfrm=png",
    price: 230,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 21,
    Subtitle: "ABEILLE ROYALE",
    Name: "LOTION FORTIFIANTE À LA GELÉE ROYALE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-lotion-fortifiante-a-la-gelee-royale-P061555.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwc5e19c29/primary_packshot_3/2024/Skincare/AR/G061555_3346470615557_AB-ROY-20-LOT-150ML-BTL.jpg?sw=655&sh=655&sfrm=png",
    price: 81,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 22,
    Subtitle: "ABEILLE ROYALE",
    Name: "DOUBLE ESSENCE CLARIFY & REPAIR",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-essence-clarify-repair-P061732.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw10380591/primary_packshot_3/2024/Skincare/AR/G061732_3346470617322_AB-ROY-24-ESS-FL-150ML.jpg?sw=655&sh=655&sfrm=png",
    price: 120,
    Arrivals: "Non",
    category: "Hair"
  },
  {
    id: 23,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME RICHE -- LA RECHARGE",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-la-recharge-P061857.html",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw477cb18a/primary_packshot_3/2025/SK/AR/G061849_3346470618497_AB-ROY_24_RICH-CR_50ML_JAR.jpg?sw=655&sh=655&sfrm=png",
    price: 120,
    Arrivals: "Non",
    category: "Hair"
  }
];



export const rawSkinCare: RawShop[] = [
  {
    id: 1,
    Subtitle: "Abeille Royale",
    Name: "SÉRUM HUILE-EN-EAU JEUNESSE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw15709ea5/01-ProductsViewer/P062033/P062033_G062033_E01_hi-res.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-serum-huile-en-eau-jeunesse-P062033.html",
    price: 57.00,
    Arrivals: "NOUVEAU",
    category: "Face"
  },
  {
    id: 2,
    Subtitle: "Abeille Royale",
    Name: "DOUBLE R RENEW & REPAIR ADVANCED SERUM",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwad25e632/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_SERUM_DOUBLE_R_50ML_-_FORMAT_WEB%20(2).jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-double-r-renew-repair-advanced-serum-P061683.html",
    price: 150.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 3,
    Subtitle: "ABEILLE ROYALE",
    Name: "DAILY REPAIR SERUM",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw3ff92f71/primary_packshot_3/2022/Skincare/AR/Refonte/G061094__3346470610941_AB-ROY-15-SER-G2-30ML-PUMP-BTL.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-daily-repair-serum-P061094.html",
    price: 150.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 4,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME RICHE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb5c23a6a/primary_packshot_3/2024/Skincare/AR/ABEILLE ROYALE CRÈME RICHE 50ml - RECHARGE.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-P061849.html",
    price: 143.00,
    Arrivals: "NOUVEAU",
    category: "Face"
  },
  {
    id: 5,
    Subtitle: "ABEILLE ROYALE",
    Name: "CLARIFY & REPAIR CRÈME",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw3664b13e/primary_packshot_3/2024/Skincare/AR/G061846_3346470618466_AB-ROY-24-CR-BRIGHT-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-clarify-repair-creme-P061846.html",
    price: 157.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 6,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME JOUR",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb0e438da/primary_packshot_3/2023/Skincare/AR/CREAMS/G061845_3346470618459_AB-ROY-23-DAY-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-jour-P061845.html",
    price: 143.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 7,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME NUIT",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb70760fb/primary_packshot_3/2023/Skincare/AR/CREAMS/G061850_3346470618503_AB-ROY-23-NIGHT-CR-50ML-JAR-1.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-nuit-P061850.html",
    price: 169.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 8,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME RICHE – LA RECHARGE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb5c23a6a/primary_packshot_3/2024/Skincare/AR/ABEILLE ROYALE CRÈME RICHE 50ml - RECHARGE.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-riche-la-recharge-P061857.html",
    price: 121.00,
    Arrivals: "NOUVEAU",
    category: "Face"
  },
  {
    id: 9,
    Subtitle: "ABEILLE ROYALE",
    Name: "CLARIFY & REPAIR CRÈME - LA RECHARGE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwd8157ee1/primary_packshot_3/2024/Skincare/AR/G061856_%203346470618565_AB-BOY-24-CR-BRIGHT-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-clarify-repair-creme---la-recharge-P061856.html",
    price: 133.00,
    Arrivals: "NOUVEAU",
    category: "Face"
  },
  {
    id: 10,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME JOUR – LA RECHARGE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwafbf1210/primary_packshot_3/2023/Skincare/AR/CREAMS/G061855_3346470618558_AB-ROY-23-CR-JR-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-jour-la-recharge-P061855.html",
    price: 121.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 11,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT CRÈME NUIT – LA RECHARGE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf8fc9361/primary_packshot_3/2023/Skincare/AR/CREAMS/G061858_3346470618589_AB-ROY-23-CR-NUIT-RECH-POT-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-creme-nuit-la-recharge-P061858.html",
    price: 144.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 12,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT EYE CREAM",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2a2c9e15/primary_packshot_3/2023/Skincare/AR/AR_DOUBLE_R_EYE_SERUM_20ML_.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-eye-cream-P061857.html",
    price: 88.00,
    Arrivals: "Non",
    category: "Face"
  },
  {
    id: 13,
    Subtitle: "ABEILLE ROYALE",
    Name: "HONEY TREATMENT REPAIR CREAM",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbc3ff127/01-ProductsViewer/P062076/P062076_E01_hi-res.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-honey-treatment-repair-cream-P061844.html",
    price: 121.00,
    Arrivals: "Non",
    category: "Face"
  }
];



export const rawBodyCare: RawShop[] = [
  {
    id: 1,
    Name: "LES DÉLICES DE BAIN LAIT PARFUMÉ POUR LE CORPS",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw12ab3fc3/primary_packshot_3/2023/Fragrances/REFONTE/LES_DELICES_DE_BAIN_LAIT_CORPS_200ml-202984.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-delices-de-bain-lait-parfume-pour-le-corps-P013137.html",
    price: 66.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 2,
    Name: "LES DÉLICES DE BAIN GEL PARFUMÉ POUR LA DOUCHE",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw12483685/primary_packshot_3/2023/Fragrances/REFONTE/LES_DELICES_DE_BAIN_GEL_PARFUME_POUR_LA_DOUCHE-202978.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-delices-de-bain-gel-parfume-pour-la-douche-P013136.html",
    price: 55.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 3,
    Name: "SHALIMAR Crème Majestueuse pour le Corps",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwd9e13832/primary_packshot_3/2022/Fragrance/Shalimar/G062223_3346470622234_SHAL-02-CR-CORPS-POT-200ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/shalimar-creme-majestueuse-pour-le-corps-P062223.html",
    price: 94.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 4,
    Name: "SHALIMAR LAIT DIVIN POUR LE CORPS",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwda197b88/primary_packshot_3/2022/Fragrance/Shalimar/G064202_3346470642027_SHAL-05-L-C-HYDR-FL-200ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/shalimar-lait-divin-pour-le-corps-P064202.html",
    price: 66.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 5,
    Name: "SHALIMAR GEL SOYEUX POUR LA DOUCHE",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwa243663f/primary_packshot_3/2022/Fragrance/Shalimar/G064203_3346470642034_SHAL-05-GBD-FL-200ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/shalimar-gel-soyeux-pour-la-douche-P064203.html",
    price: 55.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 6,
    Name: "MON GUERLAIN LAIT CORPS",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw5a509e3d/primary_packshot_3/2022/Fragrance/Mon_Guerlain/G013142_3346470131422_MON-G-17-B-LOT-200ML-BTL.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/mon-guerlain-lait-corps-P013142.html",
    price: 66.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 7,
    Name: "LA PETITE ROBE NOIRE GEL DOUCHE",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwae73e13e/primary_packshot_3/2022/Fragrance/LPRN/G011480-3346470114807-LA_PETITE_ROBE_NOIRE_BAI__SATIN_200ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/la-petite-robe-noire-gel-douche-P011480.html",
    price: 55.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 8,
    Name: "HABIT ROUGE DE GUERLAIN PARIS GEL DOUCHE INTÉGRAL",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw2df0f276/primary_packshot_3/2022/Fragrance/Men_Repack/G023557_3346470235571_GEL-DOUCHE-HR.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/habit-rouge-de-guerlain-paris-gel-douche-integral-P023557.html",
    price: 45.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 9,
    Name: "LA PETITE ROBE NOIRE LAIT CORPS",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwf3a12c14/primary_packshot_3/2022/Fragrance/LPRN/G011479-3346470114791-LA_PETITE_ROBE_NOIRE_LAIT_CORPS_VELOURS-200ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/la-petite-robe-noire-lait-corps-P011479.html",
    price: 66.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 10,
    Name: "AQUA ALLEGORIA Rosa Rossa - Crème Mains",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw4584b4b6/primary_packshot_3/2025/FRAGRANCE/AA/G014865_3346470148659_AQUA-25-R-ROS-CR-MAINS-TB-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/aqua-allegoria-rosa-rossa---creme-mains-P014865.html",
    price: 56.00,
    category: "Body",
    Arrivals: "NOUVEAU"
  },
  {
    id: 11,
    Name: "AQUA ALLEGORIA Rosa Verde - Crème Mains",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw1c424049/primary_packshot_3/2025/FRAGRANCE/AA/G014867_3346470148673_AQUA-25-ROSA-VERDE-CR-MAINS-TB-50ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/aqua-allegoria-rosa-verde---creme-mains-P014867.html",
    price: 56.00,
    category: "Body",
    Arrivals: "NOUVEAU"
  },
  {
    id: 12,
    Name: "LES LAITS PARFUMÉS NÉROLI OUTRENOIR",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw62411c15/primary_packshot_3/2022/Fragrance/A&M/Laits/XMAS-22-AM_PRIMARY-VISUAL_PDP_LAIT_NEROLI_OUTRENOIR_C.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-laits-parfumes-neroli-outrenoir-P014468.html",
    price: 105.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 13,
    Name: "LES LAITS PARFUMÉS MUSC OUTREBLANC",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw77cd0940/primary_packshot_3/2023/Fragrances/A&M/220622_PACK_LAIT_MUSC_E.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-laits-parfumes-musc-outreblanc-P014702.html",
    price: 105.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 14,
    Name: "LES LAITS PARFUMÉS ROSE CHÉRIE",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwe7d4ef29/primary_packshot_3/2022/Fragrance/A&M/Laits/XMAS-22-AM_PRIMARY-VISUAL_PDP_LAIT_ROSE_CHERIE_C.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-laits-parfumes-rose-cherie-P014489.html",
    price: 105.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 15,
    Name: "LES LAITS PARFUMÉS HERBES TROUBLANTES",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw8ebc7e0c/primary_packshot_3/2022/Fragrance/A&M/Laits/XMAS-22-AM_PRIMARY-VISUAL_PDP_LAIT_HERBES_TROUBLANTES_C.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-laits-parfumes-herbes-troublantes-P014466.html",
    price: 105.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 16,
    Name: "Aqua Allegoria Gel Douche à la Bergamote",
    Subtitle: "ABEILLE ROYALE",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwb76cdce4/primary_packshot_3/2022/Fragrance/Aqua_Allegoria/Bath&Body/G013732_3346470137332_AQUA-19-BERGA-CAL-B-LOT-200ML-BTL.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/aqua-allegoria-gel-douche-a-la-bergamote-P013732.html",
    price: 55.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 17,
    Name: "ABEILLE ROYALE BAUME RÉPARATEUR JEUNESSE DES MAINS",
    Subtitle: "",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwca063853/primary_packshot_3/2022/Skincare/Revamp%20Packshot/ABEILLE_ROYALE_BAUME_MAIN_40ML.jpg?sw=655&sh=655&sfrm=png",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/abeille-royale-baume-reparateur-jeunesse-des-mains-P061655.html",
    price: 57.00,
    category: "Body",
    Arrivals: ""
  },
  {
    id: 18,
    Name: "LES LAITS PARFUMÉS ROSE CHÉRIE - LA RECHARGE",
    Subtitle: "Intensité low",
    Image: "https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dwbc4bd0b3/primary_packshot_3/2022/Fragrance/A&M/Laits/XMAS-22-AM_SECONDARY-VISUAL_PDP_RECHARGE_LAIT_ROSE_CHERIE_F.jpg?sw=655&sh=655&sfrm=jpg",
    product_url: "https://www.guerlain.com/fr/fr-fr/p/les-laits-parfumes-rose-cherie---la-recharge-P014549.html",
    price: 84.00,
    category: "Body",
    Arrivals: ""
  }
];




export type Order = {
  id: string;
  image: any;
  orderNumber: string;
  date: string;
  total: string;
};

export const ordersMock: Order[] = [
  {
    id: '1',
    image: { uri: 'https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw15709ea5/01-ProductsViewer/P062033/P062033_G062033_E01_hi-res.jpg?sw=655&sh=655&sfrm=png' },
    orderNumber: '123ABC',
    date: '03/15/24',
    total: '$57',
  },
  {
    id: '2',
    image: { uri: 'https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw477cb18a/primary_packshot_3/2025/SK/AR/G061849_3346470618497_AB-ROY_24_RICH-CR_50ML_JAR.jpg?sw=655&sh=655&sfrm=png' },
    orderNumber: '456GHT',
    date: '11/22/23',
    total: '$143',
  },
  {
    id: '3',
    image: { uri: 'https://www.guerlain.com/dw/image/v2/BDCZ_PRD/on/demandware.static/-/Sites-GSA_master_catalog/default/dw9e857bd4/primary_packshot_3/2024/Skincare/AR/ABEILLE%20ROYALE%20SOIN-EN-MOUSSE%20175ml%20.jpg?sw=655&sh=655&sfrm=png' },
    orderNumber: '789LMN',
    date: '07/10/23',
    total: '$59',
  },
];


export const products = rawProducts.map(transformRawProduct);
