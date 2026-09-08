import { NextResponse } from "next/server";

interface GenerateRequest {
  productName?: string;
  category?: string;
}

interface ProductDetailsAI {
  shortDescription: string;
  description: string;
  nutritionalBenefits: string[];
  nutritionalBenefitsText: string;
  storage: string;
  shelfLife: string;
  certifications: string;
}

// Fallback intelligent domain-specific content generator
function generateIntelligentFallback(productName: string, category?: string): ProductDetailsAI {
  const name = productName.trim();
  const lower = name.toLowerCase();

  let shortDesc = "";
  let fullDesc = "";
  let benefits: string[] = [];
  let storage = "";
  let shelfLife = "5 – 7 Days";
  let certifications = "100% Certified Organic • Non-GMO Verified";

  // Category & keyword matching
  if (
    lower.includes("apple") ||
    lower.includes("mango") ||
    lower.includes("banana") ||
    lower.includes("orange") ||
    lower.includes("berry") ||
    lower.includes("strawberry") ||
    lower.includes("grape") ||
    lower.includes("avocado") ||
    lower.includes("watermelon") ||
    lower.includes("papaya") ||
    lower.includes("pineapple") ||
    lower.includes("lemon") ||
    lower.includes("guava") ||
    lower.includes("fruit")
  ) {
    shortDesc = `Hand-picked, 100% certified organic ${name} packed with natural sweetness, vibrant color, and daily immune-boosting vitamins.`;
    fullDesc = `Sourced directly from certified organic orchard estates committed to sustainable agroforestry and chemical-free cultivation. Every batch of ${name} is allowed to ripen naturally on the branch to capture its authentic peak sweetness, succulent texture, and rich aromatic essence.\n\nIdeal for enjoying fresh as a wholesome snack, blending into energizing morning smoothies, crafting artisan desserts, or tossing into crisp gourmet salads. Free from synthetic waxes, ripening hormones, or chemical preservatives.`;
    benefits = [
      "Rich in Vitamin C & Immune Boosters – Provides essential ascorbic acid that fortifies the body's natural defenses and supports collagen synthesis.",
      "High in Natural Dietary Fibre – Promotes optimal digestion, prevents gut inflammation, and supports steady blood sugar levels.",
      "Abundant in Polyphenol Antioxidants – Helps neutralize free radicals, defending cells from oxidative stress and promoting youthful skin health.",
      "Hydration & Vital Electrolytes – Naturally loaded with potassium and cellular electrolytes to support cardiovascular health and athletic recovery."
    ];
    storage = "Store at room temperature until fully ripe. Once ripe, refrigerate at 4°C to 7°C in a perforated crisper drawer for up to 7 days.";
    shelfLife = "5 – 8 Days";
  } else if (
    lower.includes("spinach") ||
    lower.includes("lettuce") ||
    lower.includes("kale") ||
    lower.includes("herb") ||
    lower.includes("coriander") ||
    lower.includes("mint") ||
    lower.includes("leaf") ||
    lower.includes("greens") ||
    lower.includes("cabbage") ||
    lower.includes("broccoli") ||
    lower.includes("cauliflower")
  ) {
    shortDesc = `Crisp, morning-harvested organic ${name} with rich green chlorophyl, wholesome minerals, and refreshing garden-crisp tenderness.`;
    fullDesc = `Cultivated in nutrient-dense organic soils under clean sunshine and natural groundwater irrigation. Harvested at daybreak to lock in maximum hydration, crispness, and vital enzymes.\n\nDelicious raw in farm salads, lightly steamed, wok-tossed with cold-pressed oils, or blended into revitalizing green wellness juices. Delivers uncompromised pure garden taste straight from fertile eco-farms to your kitchen table.`;
    benefits = [
      "Packed with Folate & Vitamin K – Essential for healthy bone density, optimal blood circulation, and vital cellular renewal.",
      "Chlorophyll & Liver Detox Support – Natural plant pigments assist the body in eliminating cellular metabolic toxins and fostering internal balance.",
      "High Dietary Fibre Content – Supports beneficial gut microbiome bacteria, improving nutrient absorption and digestion.",
      "Rich in Bioavailable Iron – Helps prevent fatigue by supporting healthy hemoglobin formation and sustained daytime energy."
    ];
    storage = "Wrap loosely in a breathable damp paper towel inside a sealed container. Keep in the refrigerator vegetable crisper at 2°C to 5°C.";
    shelfLife = "4 – 6 Days";
  } else if (
    lower.includes("tomato") ||
    lower.includes("potato") ||
    lower.includes("onion") ||
    lower.includes("garlic") ||
    lower.includes("ginger") ||
    lower.includes("carrot") ||
    lower.includes("cucumber") ||
    lower.includes("pepper") ||
    lower.includes("chili") ||
    lower.includes("eggplant") ||
    lower.includes("beet") ||
    lower.includes("vegetable") ||
    lower.includes("root")
  ) {
    shortDesc = `Farm-fresh, organically cultivated ${name} with robust natural flavor, deep earthy sweetness, and superior culinary versatility.`;
    fullDesc = `Grown by passionate organic farmers utilizing compost-enriched living soil and traditional regenerative methods. Free from chemical pesticides, artificial growth stimulants, or soil pollutants.\n\nA vital foundation for everyday savory dishes, fragrant curries, hearty soups, roasted vegetable medleys, or freshly sliced side salads. Offers unbeatable farm-to-table freshness and nutrition in every bite.`;
    benefits = [
      "High in Essential Phytonutrients – Supplies vital carotenoids and flavonoids that help lower chronic systemic inflammation.",
      "Digestive Health Support – Contains gentle complex carbohydrates and prebiotics that nourish a balanced gastrointestinal tract.",
      "Natural Blood Pressure Regulation – Abundant in potassium, aiding proper sodium balance and healthy vascular relaxation.",
      "Cellular Protection & Vitality – Fortified with natural micronutrients that nourish connective tissues and support general well-being."
    ];
    storage = "Store in a cool, dark, well-ventilated dry pantry (15°C – 18°C) away from direct sunlight. Do not freeze.";
    shelfLife = "7 – 14 Days";
  } else if (
    lower.includes("milk") ||
    lower.includes("cheese") ||
    lower.includes("butter") ||
    lower.includes("yogurt") ||
    lower.includes("ghee") ||
    lower.includes("paneer") ||
    lower.includes("egg") ||
    lower.includes("dairy")
  ) {
    shortDesc = `Pure, 100% pasture-raised organic ${name} sourced from grass-fed family herds with rich natural creaminess and protein.`;
    fullDesc = `Produced with the utmost care from ethically raised, free-ranging herds grazing on chemical-free open pastures. Naturally wholesome and free from synthetic bovine growth hormones (rBGH), routine antibiotics, or artificial stabilizers.\n\nCelebrated for its velvety texture, clean traditional flavor, and superior culinary performance in morning breakfasts, wholesome baking, and daily nutrition.`;
    benefits = [
      "Superior High-Biological Value Protein – Supplies complete amino acid profiles crucial for muscle repair, recovery, and lean strength.",
      "Bioavailable Calcium & Vitamin D3 – Promotes strong teeth and optimal bone mineral density across all stages of life.",
      "Natural Probiotics & Healthy Fats – Supports balanced digestive flora and provides fat-soluble vitamins (A, D, E, K2).",
      "Sustained Satiety & Focus – Wholesome natural fats and proteins maintain long-lasting energy and curb midday cravings."
    ];
    storage = "Keep continuously refrigerated at 1°C to 4°C. Ensure the container cap is tightly sealed to preserve pure dairy aroma.";
    shelfLife = "5 – 10 Days";
  } else if (
    lower.includes("oil") ||
    lower.includes("honey") ||
    lower.includes("ghee") ||
    lower.includes("vinegar") ||
    lower.includes("syrup")
  ) {
    shortDesc = `Cold-pressed, unrefined raw organic ${name} maintaining 100% pure aroma, culinary depth, and active natural enzymes.`;
    fullDesc = `Extracted through traditional slow mechanical cold-pressing methods without high heat, chemical solvents, or deodorizing bleaches. Preserves the whole, unadulterated botanical profile and delicate bioactive compounds of pristine raw ingredients.\n\nBrings irresistible depth and gourmet warmth to salad dressings, daily cooking, marinades, or warm soothing herbal beverages.`;
    benefits = [
      "Rich in Healthy Monounsaturated Fatty Acids – Supports optimal cardiovascular function and balanced HDL cholesterol ratios.",
      "Naturally Active Bioactive Enzymes – Raw and unheated processing ensures vital enzymes and micronutrients remain fully active.",
      "High in Natural Vitamin E – A potent fat-soluble antioxidant that shields cell membranes from lipid peroxidation.",
      "Anti-Inflammatory Properties – Contains plant polyphenols that help soothe joint inflammation and maintain vascular integrity."
    ];
    storage = "Store in an airtight dark glass bottle in a cool, dry pantry away from direct sunlight and stovetop heat.";
    shelfLife = "6 – 12 Months";
  } else if (
    lower.includes("rice") ||
    lower.includes("dal") ||
    lower.includes("lentil") ||
    lower.includes("grain") ||
    lower.includes("oat") ||
    lower.includes("quinoa") ||
    lower.includes("flour") ||
    lower.includes("seed") ||
    lower.includes("chia")
  ) {
    shortDesc = `Whole-grain, unpolished certified organic ${name} rich in complex carbohydrates, plant protein, and natural vitality.`;
    fullDesc = `Milled carefully to retain the wholesome bran, germ, and nutrient-dense outer layers. Grown under certified organic crop rotation practices that regenerate topsoil biodiversity without artificial nitrogen fertilizers.\n\nCooks to a delightful texture with deep nutty aroma. Perfect for wholesome family meals, nourishing grain bowls, hearty stews, and clean dietary regimens.`;
    benefits = [
      "Slow-Burning Complex Carbohydrates – Provides steady, sustained glycemic energy release without sharp glucose spikes.",
      "High Dietary Fibre & Beta-Glucans – Promotes long-term gut microbiome diversity and assists healthy lipid metabolism.",
      "Plant-Based Protein & Essential Minerals – Rich in magnesium, phosphorus, and zinc for cellular enzymatic processes.",
      "Naturally Low in Sodium & Saturated Fat – A heart-healthy staple recommended for balanced daily nutritional plans."
    ];
    storage = "Store in an airtight dry container or glass jar in a cool, dry, pest-free pantry. Keep protected from moisture.";
    shelfLife = "6 – 12 Months";
  } else {
    // Universal organic e-commerce template tailored to product name
    shortDesc = `Premium quality, 100% certified organic ${name} carefully sourced from sustainable local farms for supreme taste and freshness.`;
    fullDesc = `Cultivated with dedication on certified eco-friendly organic farms where natural biodiversity and soil health are paramount. Every portion of ${name} is hand-selected at prime maturity to deliver maximum nutritional value, appetizing aroma, and pristine clean taste.\n\nFree from synthetic chemicals, artificial preservatives, or genetic modifications. Perfect for healthy conscious households seeking genuine, whole-food excellence.`;
    benefits = [
      "Rich in Essential Vitamins & Nutrients – Fortifies your body's daily metabolic functions and strengthens overall immunity.",
      "High in Natural Dietary Fibre – Encourages smooth digestion, helps maintain healthy cholesterol, and supports gut balance.",
      "Abundant in Natural Antioxidants – Shields cells against oxidative stress, supporting sustained cardiovascular and skin health.",
      "100% Clean Farm Origin – Grown without synthetic fertilizers, synthetic pesticides, or artificial additives."
    ];
    storage = "Keep in a cool, dry, well-ventilated area away from direct heat and sunlight. Refrigerate if fresh produce.";
    shelfLife = "5 – 7 Days";
  }

  return {
    shortDescription: shortDesc,
    description: fullDesc,
    nutritionalBenefits: benefits,
    nutritionalBenefitsText: benefits.join("\n"),
    storage,
    shelfLife,
    certifications,
  };
}

export async function POST(req: Request) {
  try {
    const body: GenerateRequest = await req.json();
    const { productName, category } = body;

    if (!productName || !productName.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const trimmedName = productName.trim();
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_AI_KEY;

    // If Gemini API Key is available, try generating live with Gemini
    if (apiKey) {
      try {
        const prompt = `You are a professional organic grocery copywriter for 'ShobPai', an authentic farm-fresh organic grocery store.
Generate product details for:
Product Name: "${trimmedName}"
Category: "${category || 'Organic Groceries'}"

Return ONLY valid JSON matching this exact structure:
{
  "shortDescription": "1-2 sentence punchy summary for product cards (approx 20-25 words)",
  "description": "Full narrative description in 2 paragraphs (approx 80-120 words) with farm origin, harvest, culinary uses, taste, and freshness",
  "nutritionalBenefits": [
    "Benefit 1 Title – Clear description of health impact",
    "Benefit 2 Title – Clear description of health impact",
    "Benefit 3 Title – Clear description of health impact",
    "Benefit 4 Title – Clear description of health impact"
  ],
  "storage": "Exact optimal storage instructions (temperature, container, sunlight guidelines)",
  "shelfLife": "e.g. 5 - 7 Days",
  "certifications": "e.g. 100% Certified Organic • Non-GMO Verified"
}
CRITICAL: Every item in 'nutritionalBenefits' MUST follow the exact format: 'Title – Description' separated by an en-dash (–) or hyphen (-).`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const benefitsArray: string[] = Array.isArray(parsed.nutritionalBenefits)
              ? parsed.nutritionalBenefits
              : [];

            return NextResponse.json({
              success: true,
              source: "gemini-ai",
              data: {
                shortDescription: parsed.shortDescription || "",
                description: parsed.description || "",
                nutritionalBenefits: benefitsArray,
                nutritionalBenefitsText: benefitsArray.join("\n"),
                storage: parsed.storage || "Store in a cool, dry place.",
                shelfLife: parsed.shelfLife || "5 – 7 Days",
                certifications: parsed.certifications || "100% Certified Organic",
              },
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to intelligent generator:", geminiError);
      }
    }

    // High-quality intelligent organic produce generator
    const fallbackData = generateIntelligentFallback(trimmedName, category);
    return NextResponse.json({
      success: true,
      source: "intelligent-engine",
      data: fallbackData,
    });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate product details" },
      { status: 500 }
    );
  }
}
