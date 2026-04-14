const BASE = '/api';

export async function searchAwards(params) {
  const qs = new URLSearchParams();
  if (params.agency) qs.set('agency', params.agency);
  if (params.psc) qs.set('psc', params.psc);
  if (params.recipient) qs.set('recipient', params.recipient);
  if (params.startDate) qs.set('start_date', params.startDate);
  if (params.endDate) qs.set('end_date', params.endDate);
  if (params.setAside) qs.set('set_aside', params.setAside);
  if (params.sort) qs.set('sort', params.sort);
  if (params.order) qs.set('order', params.order);
  if (params.page) qs.set('page', params.page);
  if (params.limit) qs.set('limit', params.limit);

  const res = await fetch(`${BASE}/search?${qs}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function getSpendingSummary(params) {
  const qs = new URLSearchParams();
  if (params.groupBy) qs.set('group_by', params.groupBy);
  if (params.agency) qs.set('agency', params.agency);
  if (params.psc) qs.set('psc', params.psc);
  if (params.startDate) qs.set('start_date', params.startDate);
  if (params.endDate) qs.set('end_date', params.endDate);

  const res = await fetch(`${BASE}/spending-summary?${qs}`);
  if (!res.ok) throw new Error(`Summary failed: ${res.status}`);
  return res.json();
}

export async function getReferenceData() {
  const res = await fetch(`${BASE}/reference-data`);
  if (!res.ok) throw new Error(`Reference data failed: ${res.status}`);
  return res.json();
}
