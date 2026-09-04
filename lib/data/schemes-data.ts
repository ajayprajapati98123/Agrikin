import { GovernmentScheme } from "../types";

export const governmentSchemes: GovernmentScheme[] = [
  {
    id: "pm-kisan",
    slug: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    fullName: "Pradhan Mantri Kisan Samman Nidhi Yojana",
    theme: "Direct Income Support for Cultivator Families",
    tagline: "₹6,000 annual direct cash support in three equal installments",
    icon: "🌱",
    summary: "A central sector scheme providing income support to all landholding farmers' families in the country to supplement their financial needs for procuring agricultural inputs and domestic requirements.",
    financialSupport: "₹6,000 per year transferred directly to Aadhaar-seeded bank accounts in 3 equal quarterly installments of ₹2,000.",
    eligibility: [
      "All landholder farmer families with cultivable landholding in their names.",
      "Valid Aadhaar card linked with active bank account and eKYC completed.",
      "Land records must be verified in state revenue database.",
      "Exclusions: Institutional landholders, constitutional post holders, serving/retired government employees, and income tax payees."
    ],
    documentsRequired: [
      "Aadhaar Card with mobile linkage for OTP authentication",
      "Land Ownership Documents (Khata / Khasra / Khatoni records)",
      "Bank Account Passbook (IFSC & Account Number)",
      "Active Mobile Number registered with Aadhaar"
    ],
    stepByStepProcess: [
      "Visit the official PM-Kisan portal (pmkisan.gov.in).",
      "Navigate to the 'Farmers Corner' on the homepage.",
      "Click on 'New Farmer Registration' and choose Rural or Urban Farmer Registration.",
      "Enter your Aadhaar Number, Mobile Number, and select your State.",
      "Fill in your personal details, bank IFSC, land registration ID, and Khasra/Khata numbers.",
      "Upload land certificate copy and submit the application.",
      "Complete eKYC via OTP or biometric authentication at nearby CSC center."
    ],
    officialUrl: "https://pmkisan.gov.in/",
    applicationMode: "Online via Portal / CSC / State Agri Department",
    keyBenefits: [
      "Direct DBT transfer without middlemen",
      "Financial assistance before major sowing seasons",
      "Comprehensive digital grievance redressal",
      "Linked to Kisan Credit Card for seamless loan access"
    ],
    monitoringDetails: "Farmers can track payment status, beneficiary list, and eKYC status through the PM-Kisan mobile app or web portal."
  },
  {
    id: "aif",
    slug: "aif",
    name: "Agricultural Infrastructure Fund",
    fullName: "Agriculture Infrastructure Fund (AIF)",
    theme: "Financing Facility for Post-Harvest Infrastructure & Community Farming",
    tagline: "Medium-long term debt financing facility with 3% interest subvention",
    icon: "🏗️",
    summary: "A central scheme designed to mobilize medium-long term debt financing for post-harvest management infrastructure and community farming assets such as cold storages, warehouses, grading and sorting units.",
    financialSupport: "Loans up to ₹2 Crore per project with 3% interest subvention per annum for a maximum period of 7 years, along with CGTMSE credit guarantee coverage.",
    eligibility: [
      "Primary Agricultural Credit Societies (PACS) and Marketing Cooperative Societies",
      "Farmer Producer Organizations (FPOs) and Self Help Groups (SHGs)",
      "Individual Farmers, Joint Liability Groups (JLGs), and Agri-entrepreneurs",
      "Startups engaged in post-harvest technology and aggregation infrastructure"
    ],
    documentsRequired: [
      "Detailed Project Report (DPR) highlighting project feasibility",
      "Land Ownership or Registered Lease Agreement (minimum 10-15 years)",
      "Bank Statement (Last 6 months) & Audited Financials if applicable",
      "KYC documents of applicant/promoters and firm registration certificates"
    ],
    stepByStepProcess: [
      "Register on the Agriculture Infrastructure Fund portal (agriinfra.dac.gov.in).",
      "Log in as 'Beneficiary' and fill the online registration form.",
      "Select desired eligible lending institution (Scheduled Commercial Bank / Cooperative Bank).",
      "Upload Detailed Project Report (DPR), land documents, and quotations.",
      "Project undergoes initial appraisal by PMU (Project Management Unit) within 7 days.",
      "Once validated, the application reaches the lending bank for credit evaluation and loan sanction."
    ],
    officialUrl: "https://agriinfra.dac.gov.in/",
    applicationMode: "Centralized Online Portal with Single Window Clearance",
    keyBenefits: [
      "3% interest subvention up to ₹2 Crore",
      "Credit guarantee fee paid by Government under CGTMSE",
      "Moratorium period for repayment from 6 to 24 months",
      "Reduces post-harvest losses and enables direct market linkages"
    ],
    monitoringDetails: "Projects are tracked via the AIF management information system with geotagged asset verification."
  },
  {
    id: "kcc",
    slug: "kcc",
    name: "Kisan Credit Card (KCC)",
    fullName: "Kisan Credit Card Scheme",
    theme: "Timely & Affordable Short-Term Institutional Credit",
    tagline: "Short-term crop credit at an effective 4% interest rate",
    icon: "💳",
    summary: "Ensures that farmers receive timely and adequate credit from the banking system to meet their short-term cultivation expenses, post-harvest expenses, maintenance of farm assets, and working capital for allied activities.",
    financialSupport: "Credit limit based on crop cultivation scale and landholding. Effective interest rate of 4% per annum (7% standard rate minus 3% prompt repayment incentive for loans up to ₹3 Lakh).",
    eligibility: [
      "All farmers - individual or joint borrowers who are owner cultivators.",
      "Tenant farmers, oral lessees, and sharecroppers.",
      "SHGs or Joint Liability Groups (JLGs) of farmers.",
      "Fisheries and Animal Husbandry farmers are also eligible up to ₹2 Lakh without collateral."
    ],
    documentsRequired: [
      "Filled KCC application form from bank",
      "Identity and Address Proof (Aadhaar Card, Voter ID, PAN)",
      "Land title records (Pahani / Khasra-Khatauni / Patta copy)",
      "Cropping pattern and declaration of crops sown"
    ],
    stepByStepProcess: [
      "Download the simplified one-page KCC application form or visit nearest bank branch.",
      "Attach verified land records, cropping details, and Aadhaar copy.",
      "Submit application to Commercial Bank, Regional Rural Bank (RRB), or Cooperative Bank.",
      "Bank verifies land records and sanctions card within 14 working days.",
      "Receive KCC Rupay card with smart chip for ATM and PoS transactions."
    ],
    officialUrl: "https://pmkisan.gov.in/",
    applicationMode: "Bank Branch / Online banking / CSCs",
    keyBenefits: [
      "Flexible revolving cash credit facility",
      "No collateral required for loans up to ₹1.60 Lakh (extendable to ₹3 Lakh)",
      "Free ATM-cum-debit card (RuPay Kisan Card)",
      "Personal accident insurance coverage included"
    ],
    monitoringDetails: "Monitored jointly by NABARD, RBI, and Department of Financial Services."
  },
  {
    id: "pmksy",
    slug: "pmksy",
    name: "PMKSY (Har Khet Ko Pani)",
    fullName: "Pradhan Mantri Krishi Sinchayi Yojana",
    theme: "Har Khet Ko Pani & Per Drop More Crop",
    tagline: "Comprehensive water efficiency, micro-irrigation, and watershed development",
    icon: "💧",
    summary: "Conceived with the vision of extending coverage of irrigation 'Har Khet Ko Pani' and improving water use efficiency 'More Crop Per Drop' in a focused manner with end-to-end solutions on source creation, distribution, and on-farm water management.",
    financialSupport: "Up to 55% subsidy for Small & Marginal farmers and 45% for other farmers for installing Drip and Sprinkler irrigation systems under Per Drop More Crop.",
    eligibility: [
      "All farmers with cultivable land and an assured water source (borewell, open well, or canal).",
      "Members of registered Water User Associations (WUAs) or FPOs.",
      "Preference given to drought-prone and water-stressed blocks."
    ],
    documentsRequired: [
      "Land ownership documents (7/12 extract / RTC / Khatauni)",
      "Aadhaar card and bank passbook copy",
      "Electricity connection bill or proof of water source (well/borewell)",
      "Quotation / Farm survey map from empanelled micro-irrigation vendor"
    ],
    stepByStepProcess: [
      "Visit state Horticulture / Agriculture Department micro-irrigation portal or PMKSY portal.",
      "Register with Aadhaar and upload land records along with water source proof.",
      "Select approved empanelled manufacturer for Drip / Sprinkler system.",
      "Field inspection and GPS survey conducted by technical officer.",
      "Work order issued, manufacturer installs equipment at farm site.",
      "Post-installation verification and subsidy released directly via DBT."
    ],
    officialUrl: "https://www.pmksy.gov.in/",
    applicationMode: "State Agri/Horticulture Portals & PMKSY National System",
    keyBenefits: [
      "Up to 55% direct financial subsidy on Drip and Sprinkler systems",
      "40-50% reduction in water consumption with 30-40% yield increase",
      "Enables fertigation to deliver nutrients directly to root zones",
      "Saves labor and prevents soil erosion"
    ],
    monitoringDetails: "Geotagged micro-irrigation assets verified through the Bhuvan PMKSY portal by ISRO."
  },
  {
    id: "pmfby",
    slug: "pmfby",
    name: "PMFBY (Crop Insurance)",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    theme: "Comprehensive Risk Coverage from Sowing to Post-Harvest",
    tagline: "Affordable premium crop insurance against natural calamities and pest attacks",
    icon: "🛡️",
    summary: "Provides comprehensive insurance cover against failure of notified crops, helping stabilize farmer income and encouraging adoption of innovative agricultural techniques through minimal farmer premium share.",
    financialSupport: "Maximum premium payable by farmers is only 2% for Kharif crops, 1.5% for Rabi food/oilseed crops, and 5% for annual commercial/horticultural crops. Balance premium subsidized equally by Central and State Governments.",
    eligibility: [
      "All farmers growing notified crops in notified areas (both loanee and non-loanee farmers).",
      "Sharecroppers and tenant farmers with sowing certificates from local revenue officer.",
      "Mandatory insurance for loanee farmers can be opted-out within stipulated cutoff date."
    ],
    documentsRequired: [
      "Aadhaar Card and active bank account details",
      "Land Record Documents (Khasra/Khatauni/ROR)",
      "Sowing Certificate or Sowing Declaration issued by Patwari / Village Accountant",
      "Rental/Tenancy Agreement for tenant farmers"
    ],
    stepByStepProcess: [
      "Visit the PMFBY National Crop Insurance Portal (pmfby.gov.in).",
      "Click on 'Farmer Corner' and select 'Apply for Crop Insurance by Yourself'.",
      "Register with Mobile Number and Aadhaar verification.",
      "Enter residential details, bank details, and select Scheme, Season, and Year.",
      "Add crop details, survey number, area insured, and upload sowing certificate.",
      "Pay the nominal subsidized premium online via Net Banking/UPI/CSC wallet.",
      "Receive policy acknowledgement number for tracking claims."
    ],
    officialUrl: "https://www.pmfby.gov.in/",
    applicationMode: "Online Portal / CSC / Bank Branch / Agriculture Insurance Companies",
    keyBenefits: [
      "Lowest farmer premium rates in Indian agricultural history",
      "Coverage for Prevented Sowing, Mid-season Adversity, Localized Calamities, and Post-Harvest losses",
      "Direct claim payment to bank account without state intermediary delays",
      "Crop loss assessment using satellite imagery and drone technology"
    ],
    monitoringDetails: "Claims tracked digitally through the Crop Insurance App with 72-hour window for loss intimation."
  }
];
