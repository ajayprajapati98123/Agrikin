export interface IrrigationMethod {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  type: "traditional_surface" | "pressurized_modern" | "micro_irrigation" | "advanced_subsurface";
  definition: string;
  howItWorks: string;
  suitableCrops: string[];
  suitableSoil: string[];
  suitableTerrain: string | string[];
  waterEfficiency: string;
  waterEfficiencyPercent: number;
  advantages: string[];
  limitations: string[];
  maintenanceGuidelines: string[];
  automationPossibilities: string[];
  installationCost: string;
}

export const irrigationMethods: IrrigationMethod[] = [
  {
    id: "drip-irrigation",
    name: "Drip (Trickle) Irrigation",
    hindiName: "ड्रिप (टपक) सिंचाई",
    icon: "💧",
    type: "micro_irrigation",
    definition: "A high-precision micro-irrigation method that delivers water and dissolved nutrients directly to the plant root zone drop-by-drop through a network of valves, pipes, tubing, and emitters.",
    howItWorks: "Water is filtered and pumped under low pressure (1-2 kg/cm²) through mainline and sub-main pipes to lateral tubes fitted with precision drippers positioned beside each plant stem.",
    suitableCrops: ["Cotton", "Sugarcane", "Banana", "Tomato", "Pomegranate", "Grapes", "Chilli", "Citrus", "Vegetables"],
    suitableSoil: ["All soil types including sandy, loam, and heavy clay soils with appropriate emitter discharge selection."],
    suitableTerrain: ["Undulating, hilly, steep slopes, and irregular plots where surface leveling is unfeasible."],
    waterEfficiency: "90% - 95% efficiency",
    waterEfficiencyPercent: 92,
    advantages: [
      "Saves 50-70% water compared to conventional flood methods.",
      "Allows fertigation (injecting fertilizers directly into irrigation water for 30-40% fertilizer savings).",
      "Suppresses weed germination between crop rows as inter-row soil stays dry.",
      "Operates efficiently on poor quality or saline water by preventing leaf contact.",
      "Reduces fungal and foliar diseases by keeping crop foliage dry."
    ],
    limitations: [
      "Higher initial capital cost compared to surface methods (offset by PMKSY subsidies).",
      "Risk of emitter clogging by suspended sand, algae, or mineral scale if filtration is neglected.",
      "Restricts deep root spread if drippers are improperly placed.",
      "Tubing susceptible to damage from rodents or sharp field tools."
    ],
    maintenanceGuidelines: [
      "Backwash sand and screen filters weekly during peak irrigation periods.",
      "Flush lateral lines monthly by opening end-caps until clear water flows.",
      "Conduct acid treatment (hydrochloric or phosphoric acid) once a season to dissolve carbonate scaling.",
      "Inspect emitters regularly for uniform discharge."
    ],
    automationPossibilities: [
      "Integration with soil moisture sensors (tensiometers) for automated valve opening.",
      "IoT solar-powered smart controllers with smartphone remote management.",
      "Automated Venturi injector fertigation based on crop phenological stage."
    ],
    installationCost: "₹45,000 - ₹75,000 per acre (subsidized up to 55% under PMKSY)"
  },
  {
    id: "sprinkler-irrigation",
    name: "Sprinkler Irrigation",
    hindiName: "स्प्रिंकलर (फव्वारा) सिंचाई",
    icon: "🌦️",
    type: "pressurized_modern",
    definition: "A modern method of applying water in a controlled rainfall-like pattern through pressurized rotating nozzles or spray heads distributed across the field.",
    howItWorks: "Pressurized water (2-4 kg/cm²) travels through aluminium or HDPE pipes and is discharged into the air through revolving sprinkler nozzles, breaking water into fine droplets that rain down on crops uniformly.",
    suitableCrops: ["Wheat", "Gram (Chana)", "Mustard", "Soybean", "Groundnut", "Tea", "Coffee", "Fodder grasses"],
    suitableSoil: ["Sandy soils, loams, and soils with high infiltration rates where surface irrigation causes excessive percolation."],
    suitableTerrain: ["Rolling topography, undulating terrain, and gentle slopes without requiring field grading."],
    waterEfficiency: "75% - 85% efficiency",
    waterEfficiencyPercent: 80,
    advantages: [
      "Eliminates water channels and furrows, freeing up 10-15% additional cultivable land area.",
      "Uniform water application across varied soil textures.",
      "Cools canopy temperature during heat stress and provides frost protection in winter.",
      "Highly portable HDPE pipes can be moved across different field sections."
    ],
    limitations: [
      "Higher wind speeds (>15 km/h) distort water spray uniformity.",
      "Higher energy requirements to maintain pumping pressure.",
      "Evaporative losses higher than drip during hot, dry afternoons.",
      "Wet foliage can aggravate fungal spore germination in susceptible crops."
    ],
    maintenanceGuidelines: [
      "Inspect rotating sprinkler heads for grit blockage and nozzle wear.",
      "Check rubber gaskets and couplers between HDPE pipe sections for pressure leaks.",
      "Flush lines before seasonal startup to expel rust or sediment.",
      "Lubricate sprinkler bearing washers per manufacturer guidelines."
    ],
    automationPossibilities: [
      "Center-pivot automated circular sprinkler systems for large acreage.",
      "Weather-station integrated timers that pause spraying during high wind speeds.",
      "Variable rate irrigation (VRI) to match varying soil moisture sectors."
    ],
    installationCost: "₹20,000 - ₹35,000 per acre (subsidized up to 55% under PMKSY)"
  },
  {
    id: "surface-irrigation",
    name: "Surface (Gravity) Irrigation",
    hindiName: "सतही (गुरुत्वाकर्षण) सिंचाई",
    icon: "🌊",
    type: "traditional_surface",
    definition: "The most widespread traditional method where water is introduced onto the land surface by gravity flow, spreading across border strips, furrows, or flat check basins.",
    howItWorks: "Water is released from open field channels or tube-well outlets into leveled field compartments. Gravity pushes the advancing water sheet across the soil surface while it simultaneously infiltrates downward.",
    suitableCrops: ["Paddy (Rice)", "Wheat", "Sugarcane", "Barley", "Jute", "Deep-rooted orchard trees"],
    suitableSoil: ["Medium to heavy clay soils with low to moderate infiltration rates that allow water to advance across the field."],
    suitableTerrain: ["Flat, graded fields with uniform slope (<0.1% to 0.5%). Unsuitable on rolling or undulating land."],
    waterEfficiency: "40% - 60% efficiency",
    waterEfficiencyPercent: 50,
    advantages: [
      "Lowest initial equipment cost and zero reliance on high-pressure pumps.",
      "Simple to operate with traditional agricultural knowledge.",
      "Beneficial for leaching salts deeper into subsoil under specific conditions.",
      "Essential for lowland wetland paddy cultivation."
    ],
    limitations: [
      "High deep-percolation and run-off water losses (40-50% wasted).",
      "Risk of waterlogging and secondary soil salinization without efficient drainage.",
      "Requires labor-intensive earthen bund maintenance and manual field shifting.",
      "Causes uneven water distribution between inlet and tail ends."
    ],
    maintenanceGuidelines: [
      "Laser land leveling every 2-3 years to ensure uniform slope and prevent puddling.",
      "De-silt and repair earthen irrigation bunds and field channels before every season.",
      "Install concrete control gates or syphon tubes to regulate inlet discharge."
    ],
    automationPossibilities: [
      "Automated surge flow irrigation valves that pulse water to increase advance rates.",
      "Cablegation automated pipe plug systems."
    ],
    installationCost: "₹5,000 - ₹12,000 per acre (primarily land preparation and channels)"
  },
  {
    id: "subsurface-irrigation",
    name: "Subsurface Drip Irrigation (SDI)",
    hindiName: "उप-सतह ड्रिप सिंचाई",
    icon: "🌱",
    type: "advanced_subsurface",
    definition: "An advanced irrigation technology where drip lines and emitters are permanently buried beneath the plow layer, directly watering root systems without any surface water presence.",
    howItWorks: "Specialized root-intrusion-resistant drip lines are mechanically buried at depths of 15 to 45 cm. Water is discharged at low pressure directly inside the root zone, creating continuous subterranean moisture bulbs.",
    suitableCrops: ["Sugarcane", "Cotton", "Maize", "Alfalfa", "Commercial Orchards", "Turf & Forage"],
    suitableSoil: ["Deep loams, sandy loams, and well-drained soils with good capillary suction."],
    suitableTerrain: ["Level to gently sloping agricultural fields; accommodates heavy machinery on surface."],
    waterEfficiency: "95% - 98% efficiency",
    waterEfficiencyPercent: 96,
    advantages: [
      "Zero surface evaporation losses and zero surface runoff.",
      "Complete freedom for tractors and mechanical harvesters without damaging drip tubing.",
      "Drastically reduces surface weed growth because topsoil stays dry.",
      "System lifespan can exceed 10-15 years when protected underground."
    ],
    limitations: [
      "Higher initial installation cost and specialized burial equipment required.",
      "Root intrusion into emitters if vacuum relief or copper-oxide emitters are not utilized.",
      "Visual leak detection is challenging without flow meter monitoring.",
      "Initial seed germination in dry soil may require supplementary surface wetting."
    ],
    maintenanceGuidelines: [
      "Install high-capacity vacuum relief valves at all high field points to prevent soil suction on shutdown.",
      "Periodic trifluralin / copper emitter treatment to prevent root intrusion.",
      "Continuously monitor flow meters to spot underground pipe fissures."
    ],
    automationPossibilities: [
      "Full digital closed-loop automated fertigation with capacitance moisture probes.",
      "Satellite-linked automated pressure control valves."
    ],
    installationCost: "₹65,000 - ₹95,000 per acre"
  }
];
