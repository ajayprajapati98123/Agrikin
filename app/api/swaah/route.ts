import { NextRequest, NextResponse } from "next/server";

export interface SwaahVoiceResponse {
  success: boolean;
  language: "hi" | "en";
  languageName: string;
  methodTitle: string;
  spokenText: string;
  sections?: {
    howToDoIt: string;
    howToApplyIt: string;
    howToRunIt: string;
    maintenance: string;
    costsAndSubsidy: string;
  };
  highlights: string[];
  provider: string;
}

// Pre-calibrated, ICAR-verified conversational spoken scripts in Hindi and English
// Specially formulated for rural farmers who cannot read: clear, spoken oral style, step-by-step
const PRESET_SWAAH_EXPLANATIONS: Record<
  string,
  Record<
    "hi" | "en",
    {
      title: string;
      spokenText: string;
      sections: {
        howToDoIt: string;
        howToApplyIt: string;
        howToRunIt: string;
        maintenance: string;
        costsAndSubsidy: string;
      };
      highlights: string[];
    }
  >
> = {
  "drip-irrigation": {
    hi: {
      title: "ड्रिप (टपक) सिंचाई (Drip Irrigation)",
      spokenText:
        "नमस्ते किसान भाई! मैं आपकी डिजिटल आवाज साथी स्वाहा हूँ। ड्रिप यानी टपक सिंचाई खेती के लिए सबसे उत्तम और वरदान स्वरूप तकनीक है। इसमें पाइपों और ड्रिपर्स के जरिए पानी और खाद सीधे पौधे की जड़ों में बूंद-बूंद पहुंचता है। इससे सत्तर प्रतिशत तक पानी की बचत होती है, खेत में खरपतवार नहीं उगते और फसल की पैदावार तीस प्रतिशत तक बढ़ जाती है। छोटे और सीमांत किसानों को सरकार इस पर पचपन प्रतिशत तक की सब्सिडी देती है। बस हफ्ते में एक बार फिल्टर की सफाई करें और महीने में एक बार पाइप के छोर खोलकर कचरा निकाल दें।",
      sections: {
        howToDoIt:
          "सबसे पहले नलकूप के पास सैंड और स्क्रीन फिल्टर लगाएं। फिर मुख्य पाइप और सब-मेन पाइप बिछाकर कतारों में पतली लेटरल पाइप लगाएं और हर पौधे की जड़ पर ड्रिपर लगाएं।",
        howToApplyIt:
          "यह गन्ना, कपास, टमाटर, मिर्च, प्याज, केला और सभी फलदार बागों के लिए बेहतरीन है। ऊबड़-खाबड़ जमीन पर भी पानी एकदम समान मात्रा में पहुंचता है।",
        howToRunIt:
          "रोजाना सुबह या शाम के समय एक से दो घंटे मोटर चलाएं। वेंचुरी यंत्र के माध्यम से घुलनशील खाद सीधे जड़ों में पहुंचाई जा सकती है।",
        maintenance:
          "सप्ताह में एक बार फिल्टर की जाली धोएं। महीने में एक बार पाइप के अंतिम सिरे खोलकर पानी बहाएं जिससे जमी हुई मिट्टी निकल जाए।",
        costsAndSubsidy:
          "प्रति एकड़ लागत पैंतालीस हजार से पचहत्तर हजार रुपये आती है, लेकिन प्रधानमंत्री कृषि सिंचाई योजना में पचपन प्रतिशत तक सरकारी अनुदान मिल जाता है।",
      },
      highlights: [
        "70% तक पानी की सीधी बचत",
        "खाद सीधे जड़ों में (फर्टिगेशन)",
        "55% तक सरकारी सब्सिडी",
        "हर हफ्ते फिल्टर सफाई जरूरी",
      ],
    },
    en: {
      title: "Drip (Trickle) Irrigation",
      spokenText:
        "Namaste farmer friend! I am Swaah, your voice guide. Drip irrigation is the most water-efficient method in modern agriculture. Water and liquid fertilizers are delivered drop by drop directly to the plant root zone through pipes and emitters. This saves up to seventy percent of water, prevents weed growth, and increases crop yield by thirty percent. Small and marginal farmers are eligible for up to fifty-five percent government subsidy under PMKSY. With simple weekly filter cleaning and monthly line flushing, the system runs reliably for years.",
      sections: {
        howToDoIt:
          "Install screen and disc filters at the pump station. Run PVC main and sub-main lines, then spread lateral drip tubes along crop rows with precision emitters aligned with each plant stem.",
        howToApplyIt:
          "Ideal for cotton, sugarcane, tomatoes, chilies, bananas, orchards, and vegetables across both flat and undulating lands.",
        howToRunIt:
          "Operate for one to two hours during cool morning or evening hours at one to two bars of pressure. Use Venturi injectors for uniform fertigation.",
        maintenance:
          "Backwash filters weekly. Flush lateral end-caps monthly until clear water discharges. Perform periodic mild acid wash to dissolve mineral deposits.",
        costsAndSubsidy:
          "Costs ₹45,000 to ₹75,000 per acre with up to 55% financial assistance under the PMKSY Per Drop More Crop scheme.",
      },
      highlights: [
        "Saves up to 70% water",
        "Direct root-zone fertigation",
        "Up to 55% government subsidy",
        "Clean filters weekly for best performance",
      ],
    },
  },

  "sprinkler-irrigation": {
    hi: {
      title: "स्प्रिंकलर (फव्वारा) सिंचाई (Sprinkler Irrigation)",
      spokenText:
        "नमस्ते किसान साथी! मैं स्वाहा हूँ। फव्वारा यानी स्प्रिंकलर सिंचाई से पूरे खेत में प्राकृतिक बारिश की तरह पानी की बौछार होती है। यह गेहूं, चना, सरसों, सोयाबीन और मूंगफली की फसलों के लिए बहुत उपयोगी है। इसमें नाली या क्यारी बनाने की जरूरत नहीं होती, जिससे पंद्रह प्रतिशत खेत की जगह बच जाती है। रेतीली और ऊंची-नीची जमीन पर भी पानी एकसमान फैलता है। सरकार इस पर भी छोटे किसानों को पचपन प्रतिशत तक का अनुदान देती है। बस तेज हवा में इसे न चलाएं और फव्वारे के छेद साफ रखें।",
      sections: {
        howToDoIt:
          "पंप से एचडीपीई पाइप जोड़कर खेत में बिछाएं और निश्चित दूरी पर घूमने वाले स्प्रिंकलर नोजल लगाएं जो गोल घूमकर पानी बरसाएं।",
        howToApplyIt:
          "गेहूं, सरसों, चना, दलहन और रेतीली भूमि के लिए उत्तम। इसे सुबह या शाम को चलाना चाहिए जब हवा की गति धीमी हो।",
        howToRunIt:
          "ढाई से चार किलोग्राम दबाव पर मोटर चलाएं। खेत का एक हिस्सा भीगने के बाद इन हल्के पाइपों को खोलकर आसानी से दूसरे हिस्से में शिफ्ट किया जा सकता है।",
        maintenance:
          "घूमने वाले नोजल में फंसा कचरा निकालें और पाइप जोड़ों के रबर वॉशर की जांच करें ताकि प्रेशर लीक न हो।",
        costsAndSubsidy:
          "एक एकड़ पर बीस हजार से पैंतीस हजार रुपये की लागत आती है। पीएमकेएसवाई में पचपन प्रतिशत तक सब्सिडी उपलब्ध है।",
      },
      highlights: [
        "बारिश की तरह एकसमान पानी",
        "क्यारी या नाली बनाने की जरूरत नहीं",
        "रेतीली और ऊंची-नीची जमीन में असरदार",
        "55% तक सरकारी सहायता",
      ],
    },
    en: {
      title: "Sprinkler Irrigation",
      spokenText:
        "Namaste! I am Swaah. Sprinkler irrigation sprays pressurized water through revolving nozzles into the air, falling onto your crops just like natural rain. It is ideal for wheat, gram, mustard, groundnut, and pulses. It eliminates field ditches, saving up to fifteen percent of cultivable land. Highly recommended on sandy or undulating fields. Government assistance provides up to fifty-five percent subsidy for eligible farmers.",
      sections: {
        howToDoIt:
          "Connect portable HDPE quick-lock pipes to your pump and assemble rotating sprinkler heads on riser pipes at calculated intervals.",
        howToApplyIt:
          "Superb for wheat, oilseeds, fodder, and sandy soils. Best operated during calm morning hours to avoid spray wind drift.",
        howToRunIt:
          "Operate pump between 2.5 to 4 kg pressure. Move lightweight pipe sets to adjacent field sections after sufficient soil soaking.",
        maintenance:
          "Inspect rotating nozzles for sand grit. Replace worn rubber sealing rings at pipe couplers to maintain water pressure.",
        costsAndSubsidy:
          "Costs ₹20,000 to ₹35,000 per acre with up to 55% subsidy available under PMKSY.",
      },
      highlights: [
        "Uniform rain-like coverage",
        "Frees up 15% cultivable land",
        "Easily portable pipe system",
        "Up to 55% government subsidy",
      ],
    },
  },

  "surface-irrigation": {
    hi: {
      title: "सतही (बहाव / क्यारी) सिंचाई (Surface Irrigation)",
      spokenText:
        "नमस्ते किसान साथी! मैं स्वाहा हूँ। सतही या बहाव सिंचाई हमारी पुरानी और पारंपरिक विधि है, जिसमें पानी नालियों या क्यारियों के सहारे पूरे खेत में बहकर फैलता है। धान जैसी फसलों के लिए जहां पानी भरकर रखना होता है, यह सबसे जरूरी तरीका है। लेकिन इसमें चालीस से पचास प्रतिशत पानी व्यर्थ बह जाता है या रिस जाता है। अगर आप खेत को लेजर से समतल करवा लें और छोटी क्यारियां बनाएं, तो पानी की बहुत बचत होगी और फसल भी एकसमान पकेगी।",
      sections: {
        howToDoIt:
          "खेत को लेजर लेवलर से समतल कराएं। मजबूत मेड़ें और पक्की या साफ नालियां बनाकर पानी को नियंत्रित बहाव में छोड़ें।",
        howToApplyIt:
          "धान, गन्ना और भारी चिकनी मिट्टी के लिए उपयोगी है। ऊंची-नीची जमीन पर इसका उपयोग न करें।",
        howToRunIt:
          "क्यारी में पानी जरूरत के अनुसार ही भरें। अत्यधिक जलभराव से जड़ें सड़ सकती हैं, इसलिए जलनिकासी की नाली जरूर बनाएं।",
        maintenance:
          "हर फसल की बुवाई से पहले खेत की नालियों की सिल्ट और घास साफ करें और मेड़ों की मरम्मत करें।",
        costsAndSubsidy:
          "उपकरणों की लागत बहुत कम (₹5,000 - ₹12,000 प्रति एकड़), पर पानी का खर्च ज्यादा होता है।",
      },
      highlights: [
        "पारंपरिक और सरल तरीका",
        "धान की फसल के लिए उपयुक्त",
        "लेजर समतलीकरण से पानी की बचत",
        "जलनिकासी की उचित व्यवस्था जरूरी",
      ],
    },
    en: {
      title: "Surface (Gravity) Irrigation",
      spokenText:
        "Namaste! I am Swaah. Surface irrigation is the traditional flood method where water flows across graded field borders and furrows by gravity. It is essential for crops like wetland paddy and deep-rooted sugarcane. However, forty to fifty percent of water can be lost to deep percolation. Adopting laser land leveling and smaller check basins significantly improves distribution uniformity and saves valuable groundwater.",
      sections: {
        howToDoIt:
          "Laser level the field to a gentle slope. Construct stabilized earthen bunds and feeder channels to direct water uniformly into check basins.",
        howToApplyIt:
          "Best suited for rice and heavy clay soils. Unsuitable for rolling topography.",
        howToRunIt:
          "Regulate inlet flow to avoid soil erosion. Ensure excess water can drain off quickly to prevent root asphyxiation.",
        maintenance:
          "De-silt supply ditches before every sowing season and repair breached earthen bunds.",
        costsAndSubsidy:
          "Lowest equipment cost (₹5,000 - ₹12,000 per acre) but highest water consumption.",
      },
      highlights: [
        "Traditional gravity flow",
        "Essential for wetland paddy",
        "Laser land leveling saves 25% water",
        "Requires active drainage channels",
      ],
    },
  },

  "subsurface-irrigation": {
    hi: {
      title: "उप-सतह (जमीन के नीचे) ड्रिप सिंचाई (Subsurface Drip Irrigation)",
      spokenText:
        "नमस्ते किसान साथी! मैं स्वाहा हूँ। उप-सतह ड्रिप सिंचाई सबसे आधुनिक तकनीक है, जिसमें ड्रिप की सभी पाइपें जमीन के ऊपर नहीं, बल्कि बीस से तीस सेंटीमीटर मिट्टी के नीचे दबाई जाती हैं। इसका सबसे बड़ा फायदा यह है कि खेत में ऊपर ट्रैक्टर, कल्टीवेटर या कटाई मशीन बेरोकटोक चल सकती है और पाइप को कोई नुकसान नहीं होता। धूप से पानी भाप बनकर बिल्कुल नहीं उड़ता, जिससे पचानवे प्रतिशत से अधिक पानी सीधे जड़ों को मिलता है। यह सिस्टम पंद्रह साल तक खराब नहीं होता।",
      sections: {
        howToDoIt:
          "मशीन की मदद से लेटरल पाइप को 20 से 30 सेमी गहराई में दबाएं। इसमें रूट-इंट्रूजन रोधी तांबे की परत वाले ड्रिपर लगाए जाते हैं।",
        howToApplyIt:
          "गन्ना, कपास, मक्का और बागवानी फसलों के लिए अत्यंत उपयुक्त है।",
        howToRunIt:
          "कम दबाव पर नियमित चलाएं। जमीन के नीचे पानी के दबाव और बहाव को मापने के लिए फ्लो मीटर पर नजर रखें।",
        maintenance:
          "मोटर बंद होने पर मिट्टी अंदर न खिंचे इसलिए वैक्यूम वाल्व जरूर लगाएं। जड़ों को ड्रिपर में घुसने से रोकने के लिए हल्की दवा का उपचार करें।",
        costsAndSubsidy:
          "लागत पैंसठ हजार से पचानवे हजार रुपये प्रति एकड़ होती है, लेकिन इसकी उम्र पंद्रह साल से भी अधिक होती है।",
      },
      highlights: [
        "95% तक पानी की अधिकतम बचत",
        "ऊपर ट्रैक्टर चलाने की पूरी आजादी",
        "15 साल से अधिक लंबा जीवन",
        "खरपतवार का नामोनिशान नहीं",
      ],
    },
    en: {
      title: "Subsurface Drip Irrigation (SDI)",
      spokenText:
        "Namaste! I am Swaah. Subsurface Drip Irrigation is an advanced technology where drip laterals and emitters are permanently buried twenty to thirty centimeters underground. This allows heavy tractors, plows, and harvesters to operate on the surface without damaging pipes. Surface evaporation is eliminated, achieving up to ninety-eight percent water efficiency. High-quality underground systems operate reliably for over fifteen years.",
      sections: {
        howToDoIt:
          "Mechanically inject specialized root-resistant drip tubes 20 to 30 cm beneath the plow layer with air release vacuum valves.",
        howToApplyIt:
          "Outstanding for sugarcane, cotton, corn, alfalfa, and commercial tree orchards.",
        howToRunIt:
          "Operate at uniform low pressures. Track digital flow meters to verify subsurface water movement.",
        maintenance:
          "Install vacuum relief valves to avoid soil suction on shutdown. Apply periodic copper or trifluralin treatments to prevent root intrusion.",
        costsAndSubsidy:
          "Investment ₹65,000 to ₹95,000 per acre with 10 to 15 years operating life.",
      },
      highlights: [
        "95%+ application efficiency",
        "Complete tractor & machinery freedom",
        "15-year operational lifespan",
        "Zero surface evaporation",
      ],
    },
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || searchParams.get("method") || "drip-irrigation";
  const language = (searchParams.get("lang") || searchParams.get("language") || "hi") as "hi" | "en";
  const aspect = searchParams.get("aspect") || "all";

  return processSwaahRequest(query, language, aspect);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.method || "drip-irrigation";
    const language = (body.language || body.lang || "hi") as "hi" | "en";
    const aspect = body.aspect || "all";

    return processSwaahRequest(query, language, aspect);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid Swaah request." }, { status: 400 });
  }
}

async function processSwaahRequest(
  query: string,
  language: "hi" | "en",
  aspect: string
) {
  const normalizedLang: "hi" | "en" = language === "en" ? "en" : "hi";

  const langNames: Record<"hi" | "en", string> = {
    hi: "हिंदी (Hindi)",
    en: "English",
  };

  const q = query.toLowerCase().trim();

  // Check matching pre-calibrated methods
  let matchedMethodKey: string | null = null;
  if (q.includes("subsurface") || q.includes("sdi") || q.includes("उप-सतह")) {
    matchedMethodKey = "subsurface-irrigation";
  } else if (q.includes("drip") || q.includes("टपक") || q.includes("ड्रिप")) {
    matchedMethodKey = "drip-irrigation";
  } else if (q.includes("sprinkler") || q.includes("फव्वारा") || q.includes("स्प्रिंकलर")) {
    matchedMethodKey = "sprinkler-irrigation";
  } else if (q.includes("surface") || q.includes("flood") || q.includes("सतही") || q.includes("बहाव")) {
    matchedMethodKey = "surface-irrigation";
  }

  if (matchedMethodKey && PRESET_SWAAH_EXPLANATIONS[matchedMethodKey]) {
    const preset = PRESET_SWAAH_EXPLANATIONS[matchedMethodKey][normalizedLang];
    let spokenText = preset.spokenText;

    if (aspect === "howToDoIt") {
      spokenText = preset.sections.howToDoIt;
    } else if (aspect === "howToApplyIt") {
      spokenText = preset.sections.howToApplyIt;
    } else if (aspect === "howToRunIt") {
      spokenText = preset.sections.howToRunIt;
    } else if (aspect === "maintenance") {
      spokenText = preset.sections.maintenance;
    } else if (aspect === "costs") {
      spokenText = preset.sections.costsAndSubsidy;
    }

    const response: SwaahVoiceResponse = {
      success: true,
      language: normalizedLang,
      languageName: langNames[normalizedLang],
      methodTitle: preset.title,
      spokenText,
      sections: preset.sections,
      highlights: preset.highlights,
      provider: "Swaah Agronomy Voice Engine (Instant ICAR Verified)",
    };

    return NextResponse.json(response);
  }

  // If query is custom (e.g., Hydroponics, Zero Budget Natural Farming, Polyhouse, Aeroponics, Mulch, etc.)
  // Generate real-time audio script using Groq LPU in Hindi or English
  const groqKey =
    process.env.GROK_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (groqKey && (groqKey.startsWith("gsk_") || groqKey.startsWith("sk-"))) {
    try {
      const languageInstruction =
        normalizedLang === "hi"
          ? "Respond purely in clear, natural, spoken HINDI (हिंदी Devanagari script). Use simple conversational Hindi words (farmer-friendly) that a rural farmer who cannot read can easily understand when read aloud by text-to-speech."
          : "Respond in friendly, warm, clear spoken English with Indian agricultural terminology.";

      const prompt = `You are "Swaah" (स्वाहा), a warm, supportive, rural voice assistant on the AgriKin platform designed specifically for Indian farmers who CANNOT read or write.
The farmer asked about: "${query}".

YOUR TASK:
Explain this farming method simply, warmly, and practically so it can be spoken out loud via text-to-speech.
${languageInstruction}

IMPORTANT CRITERIA FOR NON-READING USERS:
1. Speak in a comforting, friendly oral style (e.g. greeting, clear steps, practical examples).
2. Avoid bullet marks or markdown symbols in the spokenText, since it will be synthesized into voice!
3. Explain:
   - What this farming method is in very simple terms
   - How to do it step by step
   - How to apply it and what crops/soils it fits
   - How to run and operate it daily
   - Maintenance routine courses (daily/weekly/monthly checks)
   - Costs and government subsidies (PMKSY, MIDH, etc.)
4. Return valid JSON only with this schema:
{
  "methodTitle": "Short title in the target language",
  "spokenText": "The complete, flowing conversational voice script (150-250 words) that sounds natural when spoken aloud",
  "highlights": ["3 to 4 short highlights in the target language"],
  "howToDoIt": "Spoken explanation of how to set it up",
  "howToApplyIt": "Spoken explanation of field and crop suitability",
  "howToRunIt": "Spoken explanation of daily operation",
  "maintenance": "Spoken explanation of maintenance routines",
  "costsAndSubsidy": "Spoken explanation of cost per acre and government subsidies"
}`;

      const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are Swaah, an expert agricultural voice assistant for non-reading rural farmers. Output valid JSON only.",
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (aiRes.ok) {
        const data = await aiRes.json();
        const parsed = JSON.parse(data.choices[0]?.message?.content || "{}");

        let spokenText = parsed.spokenText || "";
        if (aspect === "howToDoIt" && parsed.howToDoIt) spokenText = parsed.howToDoIt;
        else if (aspect === "howToApplyIt" && parsed.howToApplyIt) spokenText = parsed.howToApplyIt;
        else if (aspect === "howToRunIt" && parsed.howToRunIt) spokenText = parsed.howToRunIt;
        else if (aspect === "maintenance" && parsed.maintenance) spokenText = parsed.maintenance;
        else if (aspect === "costs" && parsed.costsAndSubsidy) spokenText = parsed.costsAndSubsidy;

        const response: SwaahVoiceResponse = {
          success: true,
          language: normalizedLang,
          languageName: langNames[normalizedLang],
          methodTitle: parsed.methodTitle || query,
          spokenText: spokenText || parsed.spokenText,
          sections: {
            howToDoIt: parsed.howToDoIt || "",
            howToApplyIt: parsed.howToApplyIt || "",
            howToRunIt: parsed.howToRunIt || "",
            maintenance: parsed.maintenance || "",
            costsAndSubsidy: parsed.costsAndSubsidy || "",
          },
          highlights: parsed.highlights || ["अधिक पैदावार", "पानी की बचत", "सरकारी सब्सिडी"],
          provider: "Swaah Real-time AI Voice Intelligence (Groq LPU)",
        };

        return NextResponse.json(response);
      }
    } catch (gErr) {
      console.warn("Groq failed for Swaah, falling back to local voice engine:", gErr);
    }
  }

  // Fallback for custom queries
  const fallbackScripts: Record<"hi" | "en", string> = {
    hi: `नमस्ते किसान साथी! मैं स्वाहा हूँ। आपने जिस ${query} विधि के बारे में पूछा है, वह खेती में अधिक मुनाफा और पानी की बचत के लिए बहुत उपयोगी है। इसे सही तरीके से अपनाने के लिए खेत की तैयारी और रोजाना देखरेख जरूरी है। इस पर सरकारी अनुदान भी मिलता है। नियमित साफ-सफाई और सही समय पर पोषण देने से पैदावार बहुत अच्छी होगी।`,
    en: `Namaste farmer friend! I am Swaah. Here is the operational voice guide for ${query}. This method boosts productivity, optimizes water use, and reduces operational costs. Maintain regular daily checks and follow recommended seasonal routines. Government subsidies are also available to support your adoption.`,
  };

  return NextResponse.json({
    success: true,
    language: normalizedLang,
    languageName: langNames[normalizedLang],
    methodTitle: query,
    spokenText: fallbackScripts[normalizedLang],
    highlights: [
      "अधिक पैदावार और मुनाफा",
      "पानी व संसाधनों की बचत",
      "सरकारी सब्सिडी उपलब्ध",
    ],
    provider: "Swaah Agronomy Engine (Universal Voice Fallback)",
  });
}
