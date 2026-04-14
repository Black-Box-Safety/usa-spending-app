import { useState, useCallback } from 'react';
import SearchFilters from './components/SearchFilters';
import ResultsTable from './components/ResultsTable';
import SpendingSummary from './components/SpendingSummary';
import { searchAwards } from './api/client';
import './App.css';

export default function App() {
  const [results, setResults] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState(null);

  const doSearch = useCallback(async (params, pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchAwards({ ...params, page: pg, limit: 50 });
      setResults(data.results);
      setHasNext(data.has_next);
      setPage(pg);
      setFilters(params);
    } catch (err) {
      setError(err.message);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearch(params) {
    doSearch(params, 1);
  }

  function handlePageChange(newPage) {
    doSearch(filters, newPage);
  }

  return (
    <div className="app">
      <header>
        <h1>BBS Federal Spending Search</h1>
        <p className="subtitle">Find who's buying what in Black Box Safety's target markets</p>
      </header>

      <div className="layout">
        <aside>
          <SearchFilters onSearch={handleSearch} loading={loading} />
        </aside>

        <main>
          <SpendingSummary filters={filters} />

          {error && <div className="error">{error}</div>}

          {results !== null && (
            <ResultsTable
              data={results}
              hasNext={hasNext}
              page={page}
              onPageChange={handlePageChange}
            />
          )}

          {results === null && !loading && (
            <div className="placeholder">
              <p>Select filters and click <strong>Search</strong> to find federal contracts in BBS product categories.</p>
              <p>All results are pre-filtered to BBS's target agencies and product codes (PSCs).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
