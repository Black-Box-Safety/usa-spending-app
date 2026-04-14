"""BBS company constants and target market configuration."""

BBS_UEI = "FRK5MJD35GN5"
BBS_CAGE = "7UY00"
BBS_GSA_SCHEDULE = "47QSWA23D000Y"
BBS_PRIMARY_NAICS = "339113"

# Product Service Codes grouped by BBS product category
PSC_CODES = {
    "medical_aeds": ["6515", "6545"],
    "germicidal_supplies": ["6530", "6840"],
    "protective_clothing": ["8415", "8420"],
    "individual_equipment": ["8465"],
    "body_armor": ["8470"],
    "fire_equipment": ["4210", "4215"],
    "safety_rescue": ["4240", "4230"],
    "chemical_specialties": ["6850", "6810"],
}

ALL_PSCS = sorted({psc for codes in PSC_CODES.values() for psc in codes})

PSC_DESCRIPTIONS = {
    "6515": "Medical & Surgical Instruments/Supplies",
    "6530": "Hospital Furniture & Equipment",
    "6545": "Medical Sets & Kits",
    "6840": "Pest Control/Disinfectants",
    "6850": "Misc Chemical Specialties",
    "6810": "Chemicals & Chemical Products",
    "8415": "Clothing, Special Purpose",
    "8420": "Footwear, Work",
    "8465": "Individual Equipment",
    "8470": "Armor, Personal",
    "4210": "Fire Fighting Equipment",
    "4215": "Fire Fighting Accessories",
    "4240": "Safety & Rescue Equipment",
    "4230": "Decontamination/Hazmat Equipment",
}

# Target federal agencies (short name -> USASpending display name)
AGENCIES = {
    "VA": "Department of Veterans Affairs",
    "DHS": "Department of Homeland Security",
    "DOD": "Department of Defense",
    "DOJ": "Department of Justice",
    "HHS": "Department of Health and Human Services",
    "USDA": "Department of Agriculture",
    "DOI": "Department of the Interior",
    "GSA": "General Services Administration",
}

ALL_AGENCY_NAMES = list(AGENCIES.values())

SDVOSB_SET_ASIDE_CODES = ["SDVOSBC", "SDVOSBS"]
