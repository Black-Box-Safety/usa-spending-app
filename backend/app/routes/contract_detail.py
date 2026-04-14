"""Contract detail endpoint — enriches USASpending results with SAM.gov data."""

import logging
import os

from fastapi import APIRouter, HTTPException, Query

from ..sam_client import SAMClient

logger = logging.getLogger(__name__)

router = APIRouter()
sam = SAMClient()


@router.get("/api/contract-detail")
def contract_detail(
    piid: str = Query(..., min_length=1, max_length=50, description="Award ID / PIID to look up on SAM.gov"),
):
    api_key = sam.api_key or os.environ.get("SAM_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=500, detail="SAM_API_KEY not configured")
    sam.api_key = api_key

    try:
        result = sam.search_by_piid(piid)
    except RuntimeError as e:
        # Rate limit or known client error — safe to forward
        raise HTTPException(status_code=429, detail=str(e))
    except Exception as e:
        logger.exception("SAM.gov API call failed for PIID=%s", piid)
        raise HTTPException(status_code=502, detail="SAM.gov API is temporarily unavailable")

    if result is None:
        raise HTTPException(status_code=404, detail=f"No SAM.gov record found for PIID: {piid}")

    return result
