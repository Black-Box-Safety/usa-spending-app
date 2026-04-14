"""Reference data endpoint for populating filter dropdowns."""

from fastapi import APIRouter

from ..config import AGENCIES, PSC_CODES, PSC_DESCRIPTIONS

SET_ASIDE_TYPES = [
    {"code": "SDVOSB", "name": "Service-Disabled Veteran-Owned Small Business"},
    {"code": "WOSB", "name": "Women-Owned Small Business"},
    {"code": "8A", "name": "8(a) Program"},
    {"code": "HUBZONE", "name": "HUBZone"},
    {"code": "SB", "name": "Small Business"},
]

router = APIRouter()


@router.get("/api/reference-data")
def reference_data():
    agencies = [
        {"code": code, "name": name}
        for code, name in AGENCIES.items()
    ]

    psc_categories = []
    for category, codes in PSC_CODES.items():
        psc_categories.append({
            "category": category.replace("_", " ").title(),
            "codes": [
                {"code": c, "description": PSC_DESCRIPTIONS.get(c, c)}
                for c in codes
            ],
        })

    return {
        "agencies": agencies,
        "psc_categories": psc_categories,
        "set_aside_types": SET_ASIDE_TYPES,
    }
