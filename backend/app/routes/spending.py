"""Spending summary/aggregation endpoint."""

from fastapi import APIRouter, Query

from ..client import USASpendingClient
from ..config import ALL_AGENCY_NAMES, ALL_PSCS, AGENCIES

router = APIRouter()
client = USASpendingClient()


@router.get("/api/spending-summary")
def spending_summary(
    group_by: str = Query("psc", description="Group by: psc, recipient, or awarding_agency"),
    agency: str | None = Query(None, description="Agency short name filter"),
    psc: str | None = Query(None, description="Comma-separated PSC codes"),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    limit: int = Query(25, ge=1, le=100),
):
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

    psc_codes = [p.strip() for p in psc.split(",")] if psc else ALL_PSCS

    data = client.spending_by_category(
        category=group_by,
        psc_codes=psc_codes,
        agencies=agency_names,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
    )

    return {
        "group_by": group_by,
        "results": data.get("results", []),
        "total": data.get("total", 0),
    }
