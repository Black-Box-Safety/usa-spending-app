"""Award search endpoint."""

from fastapi import APIRouter, Query

from ..client import USASpendingClient
from ..config import ALL_AGENCY_NAMES, ALL_PSCS, AGENCIES

router = APIRouter()
client = USASpendingClient()


@router.get("/api/search")
def search_awards(
    agency: str | None = Query(None, description="Agency short name (VA, DHS, DOD, etc.) or omit for all"),
    psc: str | None = Query(None, description="Comma-separated PSC codes, or omit for all BBS codes"),
    recipient: str | None = Query(None, description="Recipient/vendor name search text"),
    start_date: str | None = Query(None, description="Start date YYYY-MM-DD"),
    end_date: str | None = Query(None, description="End date YYYY-MM-DD"),
    set_aside: str | None = Query(None, description="Set-aside filter, e.g. SDVOSB"),
    sort: str = Query("Award Amount", description="Sort field"),
    order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
):
    # Resolve agency short name to full name
    agency_names = None
    if agency:
        names = []
        for a in agency.split(","):
            a = a.strip().upper()
            if a in AGENCIES:
                names.append(AGENCIES[a])
            else:
                names.append(a)
        agency_names = names
    else:
        agency_names = ALL_AGENCY_NAMES

    # Resolve PSC codes
    psc_codes = None
    if psc:
        psc_codes = [p.strip() for p in psc.split(",")]
    else:
        psc_codes = ALL_PSCS

    # Resolve set-aside
    set_aside_types = None
    if set_aside:
        mapping = {
            "SDVOSB": ["small_disadvantaged_business"],
            "8A": ["8a_program_participant"],
            "WOSB": ["women_owned_small_business"],
            "HUBZONE": ["historically_underutilized_business_zone"],
        }
        set_aside_types = mapping.get(set_aside.upper())

    data = client.search_awards(
        psc_codes=psc_codes,
        agencies=agency_names,
        recipient_text=recipient or None,
        start_date=start_date,
        end_date=end_date,
        set_aside_types=set_aside_types,
        limit=limit,
        page=page,
        sort=sort,
        order=order,
    )

    results = data.get("results", [])
    page_meta = data.get("page_metadata", {})
    has_next = page_meta.get("hasNext", False)

    return {
        "results": results,
        "count": len(results),
        "has_next": has_next,
        "page": page,
        "limit": limit,
    }
