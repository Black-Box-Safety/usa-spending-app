import { useState, useEffect } from 'react';
import { getReferenceData } from '../api/client';

export default function SearchFilters({ onSearch, loading }) {
  const [refData, setRefData] = useState(null);
  const [agency, setAgency] = useState('');
  const [pscCategory, setPscCategory] = useState('');
  const [recipient, setRecipient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    getReferenceData().then(setRefData).catch(console.error);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const pscCodes = pscCategory && refData
      ? refData.psc_categories.find(c => c.category === pscCategory)?.codes.map(c => c.code).join(',')
      : '';
    onSearch({ agency, psc: pscCodes, recipient, startDate, endDate });
  }

  function handleReset() {
    setAgency('');
    setPscCategory('');
    setRecipient('');
    setStartDate('');
    setEndDate('');
    onSearch({});
  }

  return (
    <form onSubmit={handleSubmit} className="filters">
      <h2>Search Filters</h2>

      <label>
        Agency
        <select value={agency} onChange={e => setAgency(e.target.value)}>
          <option value="">All BBS Target Agencies</option>
          {refData?.agencies.map(a => (
            <option key={a.code} value={a.code}>{a.code} — {a.name}</option>
          ))}
        </select>
      </label>

      <label>
        Product Category
        <select value={pscCategory} onChange={e => setPscCategory(e.target.value)}>
          <option value="">All BBS Product Categories</option>
          {refData?.psc_categories.map(c => (
            <option key={c.category} value={c.category}>
              {c.category} ({c.codes.map(x => x.code).join(', ')})
            </option>
          ))}
        </select>
      </label>

      <label>
        Vendor / Recipient Name
        <input
          type="text"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          placeholder="e.g. Grainger, Bound Tree..."
        />
      </label>

      <label>
        Start Date
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </label>

      <label>
        End Date
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </label>

      <div className="filter-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" onClick={handleReset} className="secondary">
          Reset
        </button>
      </div>
    </form>
  );
}
