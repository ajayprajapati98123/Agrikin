import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message = "",
      history = [],
      image,
      context = {},
      customApiKey,
    } = body;

    if (!message.trim() && !image) {
      return NextResponse.json(
        { error: "Please provide a question or an image for Dharti Maa." },
        { status: 400 }
      );
    }

    // Resolve AI keys across supported providers (Groq / xAI Grok / OpenAI)
    const groqKey =
      (customApiKey && customApiKey.startsWith("gsk_") ? customApiKey : null) ||
      process.env.GROK_API_KEY ||
      process.env.GROQ_API_KEY ||
      process.env.GROK_AI ||
      process.env.Grok_AI ||
      (process.env.AI_API_KEY && process.env.AI_API_KEY.startsWith("gsk_") ? process.env.AI_API_KEY : null);

    const xaiKey =
      (customApiKey && customApiKey.startsWith("xai-") ? customApiKey : null) ||
      process.env.XAI_API_KEY ||
      (process.env.AI_API_KEY && process.env.AI_API_KEY.startsWith("xai-") ? process.env.AI_API_KEY : null);

    const openAiKey =
      (customApiKey && customApiKey.startsWith("sk-") ? customApiKey : null) ||
      process.env.OPENAI_API_KEY ||
      (process.env.AI_API_KEY && process.env.AI_API_KEY.startsWith("sk-") ? process.env.AI_API_KEY : null);

    const userLang = context.language === "hi" || /[\u0900-\u097F]/.test(message) ? "hi" : "en";
    const userCrop = context.userCrop || "General Crops";
    const userDistrict = context.district || "Local Region";
    const userState = context.state || "India";

    const systemPrompt = `You are 🌱 Dharti Maa (धरती माँ), the revered, motherly, and scientifically rigorous agricultural AI companion and mentor of ȺցɾìҠìղ (AgriKin), dedicated to empowering Indian farmers (Annadata).

FARMER CONTEXT:
- State & District: ${userDistrict}, ${userState}
- Primary Crop: ${userCrop}
- Requested Language: ${userLang === "hi" ? "Hindi (हिंदी)" : "English"}

CORE PERSONA & TONE:
- Address the farmer with profound warmth, dignity, and cultural respect (e.g., "नमस्ते किसान भाई", "राम राम किसान साथी", or "Namaste Kisan Bhai / Dear Farmer").
- Language: If the user asks in Hindi or requested language is 'hi', respond in clear, fluent, natural Hindi (Devanagari script) with technical terms explained in simple terms. If English, respond in professional, friendly English with common Indian agricultural terms.
- Act as both a caring maternal guide and a senior agronomist / plant pathologist from the Indian Council of Agricultural Research (ICAR) & State Agricultural Universities.

SCIENTIFIC ACCURACY & VERIFIED INDIAN AGRONOMY:
- PEST & DISEASE DIAGNOSIS & REMEDIES (CIBRC Approved):
  * Early/Late Blight: Mancozeb 75% WP @ 2.0-2.5 g/L or Metalaxyl 8% + Mancozeb 64% WP @ 2.5 g/L or Azoxystrobin 23% SC @ 1.0 ml/L.
  * Powdery Mildew: Wettable Sulphur 80% WP @ 2.0-3.0 g/L or Hexaconazole 5% SC @ 1.0 ml/L.
  * Sucking Pests (Aphids, Jassids, Whiteflies, Thrips): Imidacloprid 17.8% SL @ 0.3-0.5 ml/L or Thiamethoxam 25% WG @ 0.5 g/L or Neem Oil (10,000 ppm) @ 3.0-5.0 ml/L.
  * Termites / White Grubs: Chlorpyrifos 20% EC @ 3-4 ml/L drenching or Fipronil 0.3% GR @ 8-10 kg/acre soil application.
  * Biological Control: Trichoderma viride or Pseudomonas fluorescens @ 2.5 kg/acre mixed with 100 kg Farmyard Manure (FYM).
- FERTILIZERS & NUTRITION:
  * Emphasize split doses (basal application vs top dressing).
  * For yellowing: Check if it is Nitrogen (lower leaves first) or Zinc/Iron chlorosis (interveinal on young leaves). Recommend 2% Urea foliar spray or Zinc Sulphate (21%) @ 0.5% + 0.25% lime.
- IRRIGATION:
  * Wheat critical stage: CRI (Crown Root Initiation) at 20-25 days after sowing is vital.
  * Drip & Sprinkler: 50-70% water saving, up to 55% subsidy for small/marginal farmers under PMKSY 'Per Drop More Crop'.
- GOVERNMENT SCHEMES:
  * PM-Kisan Samman Nidhi: ₹6,000/year (₹2,000 in 3 installments) via DBT. Highlight mandatory eKYC at pmkisan.gov.in.
  * PMFBY (Fasal Bima): Subsidized premiums: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural. Crucial 72-hour loss intimation rule via PMFBY portal/app or toll-free 14447.
  * Kisan Credit Card (KCC): 7% nominal interest reduced to 4% effective interest with prompt repayment up to ₹3 Lakh limit.
  * PMKSY: 55% micro-irrigation subsidy for small/marginal farmers.
  * AIF (Agri Infra Fund): 3% interest subvention for loans up to ₹2 Crore for cold storage, sorting, packing facilities.

MANDATORY SCIENTIFIC GUARDRAILS:
1. Never guarantee 100% crop yield or eliminate all risk.
2. For severe, spreading infestations (>20% plot affected), urge the farmer to visit their local Krishi Vigyan Kendra (KVK) or contact the Kisan Call Centre (Toll-Free 1800-180-1551).
3. If soil query is asked, remind that visual observations cannot replace laboratory soil testing (NPK, pH, EC) and encourage using their Soil Health Card (soilhealth.dac.gov.in).
4. Structure the response clearly with bullet points, bold key chemicals/dosages, and step-by-step actions.`;

    // Format conversational history (last 6 messages for context)
    const formattedHistory = (history || []).slice(-6).map((h: any) => ({
      role: h.sender === "user" || h.role === "user" ? "user" : "assistant",
      content: h.text || h.content || "",
    }));

    // 1. Try Groq (Ultra-fast inference: openai/gpt-oss-20b or qwen/qwen3.8-27b)
    if (groqKey) {
      const groqModels = ["openai/gpt-oss-20b", "qwen/qwen3.8-27b", "allam-2-7b"];
      const textContent = image
        ? `${message.trim()}\n\n[Farmer attached a crop photograph for visual inspection]`
        : message.trim();

      for (const model of groqModels) {
        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                ...formattedHistory,
                { role: "user", content: textContent },
              ],
              max_tokens: 800,
              temperature: 0.3,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply && reply.trim()) {
              return NextResponse.json({
                success: true,
                provider: `Grok AI (${model.split("/")[1] || model} • Realtime)`,
                reply: reply.trim(),
              });
            }
          } else {
            const errText = await groqRes.text();
            console.warn(`Groq error with ${model}:`, groqRes.status, errText);
          }
        } catch (gErr) {
          console.warn(`Groq fetch failed for ${model}:`, gErr);
        }
      }
    }

    // 2. Try xAI Grok (grok-2-latest / grok-2-vision-1212)
    if (xaiKey) {
      try {
        let userContent: any = message.trim();
        if (image && typeof image === "string" && image.startsWith("data:image")) {
          userContent = [
            { type: "text", text: message.trim() || "Please diagnose this crop photo." },
            { type: "image_url", image_url: { url: image, detail: "auto" } },
          ];
        }

        const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${xaiKey}`,
          },
          body: JSON.stringify({
            model: image ? "grok-2-vision-1212" : "grok-2-latest",
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedHistory,
              { role: "user", content: userContent },
            ],
            max_tokens: 1200,
            temperature: 0.3,
          }),
        });

        if (xaiRes.ok) {
          const data = await xaiRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return NextResponse.json({
              success: true,
              provider: image ? "xAI Grok Vision" : "xAI Grok 2",
              reply: reply.trim(),
            });
          }
        } else {
          const errText = await xaiRes.text();
          console.warn("xAI API error, attempting next provider:", xaiRes.status, errText);
        }
      } catch (xErr) {
        console.warn("xAI fetch failed:", xErr);
      }
    }

    // 3. Try OpenAI (GPT-4o)
    if (openAiKey) {
      try {
        let userContent: any = message.trim();
        if (image && typeof image === "string" && image.startsWith("data:image")) {
          userContent = [
            { type: "text", text: message.trim() || "Please diagnose this crop photo." },
            { type: "image_url", image_url: { url: image, detail: "auto" } },
          ];
        }

        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: systemPrompt },
              ...formattedHistory,
              { role: "user", content: userContent },
            ],
            max_tokens: 1200,
            temperature: 0.3,
          }),
        });

        if (openAiResponse.ok) {
          const data = await openAiResponse.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && reply.trim()) {
            return NextResponse.json({
              success: true,
              provider: "OpenAI GPT-4o",
              reply: reply.trim(),
            });
          }
        } else {
          const errText = await openAiResponse.text();
          console.warn("OpenAI Chat API error, using domain-expert agronomic engine:", openAiResponse.status, errText);
        }
      } catch (err) {
        console.warn("OpenAI Chat fetch failed, falling back to agronomy engine:", err);
      }
    }

    // 4. High-Fidelity Domain-Expert Agricultural Fallback Engine
    const fallbackReply = generateDomainExpertAgronomyResponse(message, userLang, userDistrict, userState, userCrop);

    return NextResponse.json({
      success: true,
      provider: "Dharti Maa Agricultural Intelligence Engine (Offline Fallback)",
      reply: fallbackReply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error during chat." },
      { status: 500 }
    );
  }
}

function generateDomainExpertAgronomyResponse(
  message: string,
  lang: "hi" | "en",
  district: string,
  state: string,
  crop: string
): string {
  const q = (message || "").toLowerCase();
  const isHindi = lang === "hi" || /[\u0900-\u097F]/.test(message);

  // Yellow leaves / Disease symptoms
  if (
    q.includes("yellow") ||
    q.includes("पीले") ||
    q.includes("पीला") ||
    q.includes("पत्ता") ||
    q.includes("leaf") ||
    q.includes("blight") ||
    q.includes("धब्बे") ||
    q.includes("रोग") ||
    q.includes("disease")
  ) {
    if (isHindi) {
      return `नमस्ते किसान साथी! पत्तियों का पीला पड़ना फसल में किसी तनाव का प्राथमिक लक्षण है। आइए इसके वैज्ञानिक कारणों और सटीक उपायों को समझें:

1. **पोषक तत्वों का असंतुलन (Nutrient Deficiency)**:
   • **नाइट्रोजन की कमी**: यदि पुरानी (निचली) पत्तियां पहले हल्की हरी फिर पीली हो रही हैं, तो यह नाइट्रोजन की कमी है।
     → **उपाय**: 2% यूरिया (20 ग्राम यूरिया प्रति लीटर पानी) का पत्तियों पर छिड़काव करें।
   • **जिंक (Zinc) या आयरन की कमी**: यदि नई ऊपरी पत्तियों में नसें हरी हैं और बीच का भाग पीला है।
     → **उपाय**: जिंक सल्फेट (21%) @ 5 ग्राम + बुझा हुआ चूना 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।

2. **फफूंद रोग (Early/Late Blight या Alternaria)**:
   • यदि पत्तियों पर पीले घेरे वाले भूरे-काले गोल छल्ले (concentric rings) दिखाई दे रहे हैं।
     → **उपाय**: मैंकोजेब (Mancozeb 75% WP) @ 2.5 ग्राम/लीटर या सिस्टेमिक फफूंदनाशी डिफेनोकोनाज़ोल (Difenoconazole 25% EC) @ 0.5 मिली/लीटर पानी में घोलकर सुबह के समय छिड़कें।

3. **जलभराव या नमी तनाव**:
   • खेत में अतिरिक्त पानी जमा होने से जड़ों का दम घुटता है और पोषक तत्व नहीं पहुंच पाते। खेत से तुरंत जलनिकासी सुनिश्चित करें।

🌱 **धरती माँ की विशेष सलाह**: आप ȺցɾìҠìղ के **AI Detections** टैब में प्रभावित पत्ते की फोटो अपलोड कर सकते हैं। यदि रोग 20% से अधिक फसल में फैल चुका हो, तो तुरंत अपने नजदीकी **कृषि विज्ञान केंद्र (KVK)** या किसान कॉल सेंटर (**1800-180-1551**) से संपर्क करें।`;
    }

    return `Namaste Kisan Friend! Leaf yellowing (chlorosis) in ${crop} across ${district}, ${state} typically points to one of three agronomic triggers:

1. **Nutritional Imbalances**:
   • **Nitrogen (N) Deficiency**: Yellowing initiates uniformly on older lower leaves while upper leaves stay green.
     → **Remedy**: Foliar spray of 2% Urea (20g Urea per liter water) during mild sunlight.
   • **Zinc (Zn) / Iron (Fe) Deficiency**: Interveinal chlorosis (veins remain distinctly green while the lamina turns yellow) on tender young leaves.
     → **Remedy**: Spray Zinc Sulphate (Heptahydrate 21%) @ 5g/L + slaked lime @ 2.5g/L, or Chelated Zinc (Zn-EDTA 12%) @ 1g/L.

2. **Fungal Pathogens (Alternaria / Blight / Cercospora)**:
   • Look closely for dark brown necrotic lesions encircled by a conspicuous yellow halo.
     → **Remedy**: Apply contact fungicide **Mancozeb 75% WP** @ 2.0-2.5 g/L. For systemic arrest, apply **Difenoconazole 25% EC** @ 0.5 ml/L or **Azoxystrobin 23% SC** @ 1.0 ml/L.

3. **Waterlogging & Root Asphyxiation**:
   • Saturated soils displace root zone oxygen, inhibiting nitrogen and potassium uptake. Ensure prompt field drainage.

🌱 **Dharti Maa Advisory**: Take a close-up photo and upload it into our **AI Detections** module for instant multi-spectral verification. If over 20% of your field is affected, consult your block Agricultural Officer or local **Krishi Vigyan Kendra (KVK)** immediately.`;
  }

  // Termites / Pests / Insects
  if (
    q.includes("termite") ||
    q.includes("दीमक") ||
    q.includes("कीड़ा") ||
    
    q.includes("कीड़े") ||
    q.includes("pest") ||
    q.includes("insect") ||
    q.includes("sucking") ||
    q.includes("aphid") ||
    q.includes("माहू") ||
    q.includes("sundi") ||
    q.includes("इल्ली")
  ) {
    if (isHindi) {
      return `राम राम किसान भाई! कीट और दीमक प्रबंधन के लिए समय पर सही वैज्ञानिक उपचार अत्यंत आवश्यक है:

1. **दीमक (Termite) का नियंत्रण**:
   • **खड़ी फसल में**: यदि फसल में दीमक का प्रकोप दिखे, तो क्लोरपायरीफॉस (Chlorpyrifos 20% EC) @ 3-4 मिली प्रति लीटर पानी के हिसाब से सिंचाई जल के साथ या ड्रेंचिंग द्वारा दें।
   • **बुवाई से पहले**: फिप्रोनिल (Fipronil 0.3% GR) @ 8-10 किग्रा प्रति एकड़ मिट्टी में मिलाएं। कच्चा गोबर कभी न डालें, सड़ी हुई कंपोस्ट ही प्रयोग करें।

2. **रस चूसक कीट (Aphids, Jassids, Whiteflies)**:
   • पत्तियों का मुड़ना या रस चूसना रोकने के लिए:
     - **जैविक**: नीम का तेल (Neem Oil 10,000 ppm) @ 3 से 5 मिली प्रति लीटर पानी + थोड़ा शैम्पू मिलाकर छिड़कें।
     - **रासायनिक**: इमिडाक्लोप्रिड (Imidacloprid 17.8% SL) @ 0.5 मिली/लीटर या थायमेथॉक्सम (Thiamethoxam 25% WG) @ 0.5 ग्राम/लीटर का छिड़काव करें।

3. **इल्ली / सुंडी (Borer / Caterpillars)**:
   • एमामेक्टिन बेंजोएट (Emamectin Benzoate 5% SG) @ 0.5 ग्राम/लीटर या क्लोरेंट्रानिलिप्रोल (Coragen 18.5% SC) @ 0.3 मिली/लीटर पानी में मिलाकर छिड़कें।

🌱 **सावधानी**: कीटनाशक का छिड़काव हमेशा हवा की दिशा में करें और सुरक्षात्मक दस्ताने व मास्क अवश्य पहनें।`;
    }

    return `Namaste Dear Farmer! Here is the CIBRC-verified protocol for managing pests and termites in ${crop}:

1. **Termite & Soil Pest Control**:
   • **Standing Crop Rescue**: Apply **Chlorpyrifos 20% EC** @ 3.0-4.0 ml/L via irrigation water or direct root drenching.
   • **Preventive Soil Application**: Broadcast **Fipronil 0.3% GR** @ 8-10 kg/acre prior to sowing. Ensure Farmyard Manure is fully decomposed, as raw dung attracts termites.

2. **Sucking Pest Complex (Aphids, Jassids, Whiteflies, Thrips)**:
   • **Organic Bio-Control**: Spray Neem Seed Kernel Extract (NSKE 5%) or cold-pressed Neem Oil (10,000 ppm) @ 3.0-5.0 ml/L.
   • **Chemical Intervention**: Apply **Imidacloprid 17.8% SL** @ 0.3-0.5 ml/L, or **Thiamethoxam 25% WG** @ 0.5 g/L during early morning hours.

3. **Caterpillars & Pod Borers (*Helicoverpa / Spodoptera*)**:
   • Use pheromone traps @ 5 traps/acre for pest monitoring.
   • Spray **Emamectin Benzoate 5% SG** @ 0.5 g/L or **Chlorantraniliprole 18.5% SC** @ 0.3 ml/L.

🌱 **Dharti Maa Safety Rule**: Maintain an appropriate Pre-Harvest Interval (PHI) of 7-14 days between chemical spraying and harvesting for food safety.`;
  }

  // Irrigation & Water / Micro-irrigation / PMKSY
  if (
    q.includes("irrigation") ||
    q.includes("सिंचाई") ||
    q.includes("पानी") ||
    q.includes("water") ||
    q.includes("drip") ||
    q.includes("ड्रिप") ||
    q.includes("sprinkler") ||
    q.includes("फव्वारा")
  ) {
    if (isHindi) {
      return `नमस्ते किसान साथी! कुशल जल प्रबंधन से पानी की बचत के साथ पैदावार में 25-35% तक वृद्धि होती है:

1. **ड्रिप सिंचाई (टपक सिंचाई)**:
   • फलदार बागों, सब्जियों (टमाटर, मिर्च, प्याज), गन्ने और कपास के लिए सर्वश्रेष्ठ तकनीक।
   • 60-70% पानी की बचत होती है और खाद को सीधे जड़ों में (फर्टिगेशन) दिया जा सकता है।

2. **स्प्रिंकलर (फव्वारा सिंचाई)**:
   • गेहूं, चना, सरसों, मूंगफली और असमतल (ऊबड़-खाबड़) रेतीली जमीन के लिए सर्वोत्तम।
   • पारंपरिक बहाव सिंचाई की तुलना में 35-45% पानी बचाता है।

3. **सरकारी सब्सिडी (PMKSY - 'प्रति बूंद अधिक फसल')**:
   • **छोटे एवं सीमांत किसानों (2 हेक्टेयर तक)**: ड्रिप व स्प्रिंकलर लगाने पर **55% तक सरकारी अनुदान** मिलता है।
   • **अन्य बड़े किसानों**: **45% तक अनुदान** उपलब्ध है।
   • आवेदन के लिए अपनी राज्य बागवानी या कृषि विभाग की वेबसाइट पर जाएं या जिला उद्यान अधिकारी (DHO) से संपर्क करें।

4. **गेहूं की फसल की महत्वपूर्ण सिंचाई अवस्था**:
   • पहली और सबसे जरूरी सिंचाई: **सीआरआई अवस्था (ताज जड़ निकलने के समय)** - बुवाई के 20 से 25 दिन बाद। यह सिंचाई कभी न छोड़ें!`;
    }

    return `Namaste! Precision irrigation is the single highest return-on-investment practice for Indian agriculture:

1. **Drip Micro-Irrigation**:
   • **Best Suited For**: Orchards, cotton, sugarcane, and high-value vegetables (tomatoes, chilies, capsicum).
   • **Efficiency**: Delivers 90-95% water application efficiency directly to the rhizosphere and enables precise fertigation, reducing fertilizer leaching by 30%.

2. **Sprinkler Irrigation**:
   • **Best Suited For**: Wheat, pulses, mustard, and undulating terrain where leveling is uneconomic. Saves 35-45% water compared to flood irrigation.

3. **Government Financial Assistance (PMKSY - 'Per Drop More Crop')**:
   • **Small & Marginal Farmers (<= 2 Hectares)**: Eligible for up to **55% financial subsidy** on the indicative unit cost.
   • **General/Other Farmers**: Eligible for **45% financial subsidy**.
   • Check the **Govt Schemes** section in ȺցɾìҠìղ for step-by-step documentation requirements.

4. **Critical Phenological Stages (Wheat)**:
   • The **Crown Root Initiation (CRI)** stage at 20-25 days after sowing is critical; moisture deficit here can irreversibly drop yield by 20-30%.`;
  }

  // Government Schemes / PM-Kisan / KCC / PMFBY
  if (
    q.includes("scheme") ||
    q.includes("योजना") ||
    q.includes("सब्सिडी") ||
    q.includes("subsidy") ||
    q.includes("pm-kisan") ||
    q.includes("pm kisan") ||
    q.includes("किसान") ||
    q.includes("kcc") ||
    q.includes("bima") ||
    q.includes("बीमा") ||
    q.includes("insurance") ||
    q.includes("loan") ||
    q.includes("ऋण")
  ) {
    if (isHindi) {
      return `नमस्ते किसान भाई! भारत सरकार द्वारा संचालित प्रमुख कल्याणकारी योजनाओं के आधिकारिक नियम इस प्रकार हैं:

1. **पीएम-किसान सम्मान निधि (PM-Kisan)**:
   • **लाभ**: सभी पात्र भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष (₹2,000 की 3 किस्तों में सीधे बैंक खाते में)।
   • **अनिवार्य शर्त**: किस्त प्राप्त करने के लिए आधार से जुड़ा बैंक खाता (DBT) और **eKYC** अनिवार्य है।
   • **आधिकारिक पोर्टल**: [pmkisan.gov.in](https://pmkisan.gov.in) पर जाकर 'Farmers Corner' से स्थिति जांचें।

2. **किसान क्रेडिट कार्ड (KCC)**:
   • **ब्याज दर**: मूल ब्याज दर 7% है, किंतु समय पर ऋण चुकता करने पर 3% का ब्याज अनुदान (Interest Subvention) मिलता है, जिससे **प्रभावी ब्याज दर मात्र 4%** रह जाती है।
   • बिना किसी जमानत (कोलैटरल) के ₹1.60 लाख तक और कुल ₹3.00 लाख तक का रियायती ऋण प्राप्त किया जा सकता है।

3. **प्रधानमंत्री फसल बीमा योजना (PMFBY)**:
   • **किसान प्रीमियम**: खरीफ फसलों के लिए मात्र 2%, रबी फसलों के लिए 1.5%, और बागवानी/वाणिज्यिक फसलों के लिए 5%।
   • **महत्वपूर्ण 72 घंटे का नियम**: ओलावृष्टि, जलभराव या चक्रवात से नुकसान होने पर **72 घंटे के भीतर** 'Crop Insurance' ऐप पर या टोल-फ्री 14447 पर सूचना देना अनिवार्य है।

4. **एग्रीकल्चर इंफ्रास्ट्रक्चर फंड (AIF)**:
   • खेत के पास कोल्ड स्टोरेज, प्राथमिक प्रसंस्करण या गोदाम बनाने के लिए ₹2 करोड़ तक के ऋण पर **3% ब्याज छूट**।

🌱 इन सभी योजनाओं के विस्तृत चेकलिस्ट के लिए ȺցɾìҠìղ के **'सरकारी योजनाएं' (Govt Schemes)** पेज को देखें।`;
    }

    return `Namaste! Here are verified particulars of central agricultural initiatives designed for your farm:

1. **PM-Kisan Samman Nidhi**:
   • **Entitlement**: ₹6,000 annually paid in three equal tranches of ₹2,000 directly via Direct Benefit Transfer (DBT).
   • **Key Requirement**: Active Aadhaar-seeded bank account and completed biometric/OTP **eKYC** at the official portal [pmkisan.gov.in](https://pmkisan.gov.in).

2. **Kisan Credit Card (KCC)**:
   • **Concessional Interest**: Standard interest is 7%, with a 3% prompt repayment incentive resulting in an **effective 4% annual interest rate** for loans up to ₹3 Lakh.
   • Collateral-free limit is available up to ₹1.60 Lakh.

3. **Pradhan Mantri Fasal Bima Yojana (PMFBY)**:
   • **Subsidized Premiums**: Capped at 2.0% for Kharif crops, 1.5% for Rabi crops, and 5.0% for annual commercial/horticultural crops.
   • **Critical 72-Hour Rule**: In the event of localized calamities (hailstorms, flash floods, unseasonal rain), you MUST lodge a loss intimation within **72 hours** via the PMFBY Crop Insurance app or toll-free helpline **14447**.

4. **Agriculture Infrastructure Fund (AIF)**:
   • Provides a 3% interest subvention on post-harvest infrastructure loans up to ₹2 Crore for up to 7 years.

🌱 Visit our **Govt Schemes** portal in the navigation bar for verified links to official portals.`;
  }

  // Weather advisories
  if (
    q.includes("weather") ||
    q.includes("मौसम") ||
    q.includes("बारिश") ||
    q.includes("rain") ||
    q.includes("तापमान") ||
    q.includes("temperature") ||
    q.includes("wind") ||
    q.includes("हवा")
  ) {
    if (isHindi) {
      return `नमस्ते किसान साथी! मौसम की सटीक जानकारी कृषि निर्णयों में लागत बचाती है:

• **छिड़काव खिड़की (Spray Window)**: कीटनाशक या खाद का छिड़काव हमेशा सुबह 6 से 9 बजे के बीच करें जब हवा शांत (< 10 किमी/घंटा) हो और धूप हल्की हो।
• **वर्षा चेतावनी**: यदि आगामी 24 से 48 घंटों में बारिश की संभावना 50% से अधिक हो, तो किसी भी प्रकार का रासायनिक छिड़काव या अतिरिक्त सिंचाई स्थगित रखें।
• **तेज धूप और लू (Heat Stress)**: उच्च तापमान में फसलों की जड़ों को ठंडा रखने के लिए शाम के समय हल्की सिंचाई करें या पुआल की मल्चिंग करें।

🌱 आप ȺցɾìҠìղ के **'मौसम' (Weather)** टैब में अपने जिले का 7 दिनों का लाइव सैटेलाइट पूर्वानुमान देख सकते हैं।`;
    }

    return `Namaste Kisan Friend! Practical meteorological guidance for ${district}, ${state}:

• **Optimal Spray Window**: Perform foliar spraying between 6:00 AM and 9:00 AM when wind speed is below 10 km/h and leaf temperature is moderate.
• **Precipitation Safeguard**: If precipitation probability exceeds 50% over the next 48 hours, suspend all chemical applications and planned irrigation to avoid chemical runoff and waterlogging.
• **High Temperature / Heat Wave**: Apply light evening irrigation or spread organic straw mulch to keep root zone soil temperatures moderated.

🌱 Check ȺցɾìҠìղ's **Weather** station for real-time 7-day satellite data and agronomy advisories.`;
  }

  // Fertilizers & Soil health
  if (
    q.includes("fertilizer") ||
    q.includes("खाद") ||
    q.includes("यूरिया") ||
    q.includes("urea") ||
    q.includes("dap") ||
    q.includes("मिट्टी") ||
    q.includes("soil") ||
    q.includes("npk") ||
    q.includes("organic") ||
    q.includes("जैविक")
  ) {
    if (isHindi) {
      return `नमस्ते किसान भाई! संतुलित उर्वरक प्रबंधन फसल की गुणवत्ता और मिट्टी की उर्वरता दोनों को बढ़ाता है:

1. **संतुलित NPK अनुपात**:
   • अनाज फसलों (गेहूं, धान) के लिए आदर्श N:P:K अनुपात **4:2:1** माना जाता है।
   • केवल यूरिया पर निर्भर न रहें। फास्फोरस (DAP/SSP) और पोटाश (MOP) जड़ विकास और दाने की चमक के लिए अनिवार्य हैं।

2. **उर्वरक देने का सही समय**:
   • **बुवाई के समय (Basal)**: फास्फोरस और पोटाश की पूरी मात्रा + नाइट्रोजन की एक तिहाई मात्रा।
   • **टॉप ड्रेसिंग**: शेष नाइट्रोजन को पहली सिंचाई और कल्ले फूटने के समय दो बराबर किस्तों में दें।

3. **जैविक एवं सूक्ष्म पोषक तत्व**:
   • प्रति एकड़ 4-5 टन सड़ी हुई गोबर की खाद (FYM) या 2 टन केंचुआ खाद (Vermicompost) डालें।
   • मिट्टी जनित रोगों से सुरक्षा के लिए गोबर की खाद में 2.5 किग्रा **ट्राइकोडर्मा विरिडी (Trichoderma viride)** मिलाकर खेत में बिखेरें।

🌱 **मिट्टी स्वास्थ्य कार्ड**: मिट्टी की प्रयोगशाला जांच (NPK, pH, EC) के बिना अंधाधुंध खाद न डालें। अपने नजदीकी कृषि कार्यालय में मिट्टी का नमूना देकर 'मृदा स्वास्थ्य कार्ड' (Soil Health Card) अवश्य बनवाएं।`;
    }

    return `Namaste Dear Farmer! Balanced plant nutrition is essential for sustained soil fertility and crop vigor in ${crop}:

1. **Balanced N:P:K Nutrition**:
   • Maintain the scientifically recommended **4:2:1** ratio for cereal crops.
   • Never apply Nitrogen (Urea) in excess; excessive vegetative lushness attracts aphids, stem borers, and fungal blights.
   • Ensure adequate Potassium (MOP) to build cellular resistance against drought, lodging, and cold snaps.

2. **Application Timing**:
   • **Basal Dose**: 100% of Phosphorus (DAP/SSP) and Potassium (MOP), alongside 33-50% of Nitrogen at sowing.
   • **Top Dressing**: Split the remaining Nitrogen across critical vegetative phases (e.g. tillering and panicle/booting stages).

3. **Biological Soil Enrichment**:
   • Incorporate 4-5 tonnes/acre of well-rotted Farmyard Manure (FYM) or 2 tonnes of Vermicompost.
   • Enrich FYM with **Trichoderma viride** @ 2.5 kg/acre to naturally eliminate soil-borne *Fusarium* and *Rhizoctonia* wilt pathogens.

🌱 **Soil Health Card Notice**: Visual inspection cannot quantify chemical NPK or pH. Always obtain an authentic soil test via [soilhealth.dac.gov.in](https://soilhealth.dac.gov.in) before finalizing fertilizer inputs.`;
  }

  // Default Welcoming & Guiding Response
  if (isHindi) {
    return `नमस्ते किसान साथी! मैं **धरती माँ** हूँ, ȺցɾìҠìղ में आपकी व्यक्तिगत डिजिटल कृषि मार्गदर्शक। 

मैं आपकी सहायता के लिए सदैव तत्पर हूँ। आप मुझसे किसी भी विषय पर पूछ सकते हैं:
• **फसल रोग व कीट**: पत्तियों का पीला पड़ना, दीमक, फफूंद या सुंडी का सटीक CIBRC अनुमोदित उपचार।
• **उर्वरक व खाद**: यूरिया, डीएपी, पोटाश और ट्राइकोडर्मा जैविक खाद की सही मात्रा।
• **सिंचाई प्रबंधन**: ड्रिप व स्प्रिंकलर तकनीक तथा 55% PMKSY सरकारी सब्सिडी।
• **सरकारी योजनाएं**: PM-Kisan eKYC, किसान क्रेडिट कार्ड (4% ब्याज), और फसल बीमा (PMFBY)।
• **मौसम व मंडी**: लाइव बारिश की चेतावनी व कीटनाशक छिड़काव की सही खिड़की।

बताइए आज आपके खेत या फसल के संबंध में आपका क्या प्रश्न है?`;
  }

  return `Namaste Farmer Friend! I am **🌱 Dharti Maa**, your agricultural AI guide at ȺցɾìҠìղ.

I am equipped with verified Indian Council of Agricultural Research (ICAR) agronomic intelligence and real-time field insights to assist you with:
• **Pest & Disease Diagnosis**: Accurate active chemical formulations, dosages per liter, and bio-controls (Neem oil, *Trichoderma*).
• **Balanced Crop Nutrition**: Split-dose fertilizer schedules for Nitrogen, DAP, Potash, and micronutrients.
• **Modern Irrigation**: Drip/sprinkler efficiency calculations and 55% PMKSY government subsidy guidelines.
• **Government Welfare**: Step-by-step guidance for PM-Kisan Samman Nidhi, KCC concessional credit (4%), and PMFBY crop insurance claims.
• **Agri-Meteorology**: Rain forecasts, soil moisture indicators, and calm spray windows.

Please feel free to ask any specific question about your field in ${district}, ${state}, or attach a crop photograph for diagnosis!`;
}
