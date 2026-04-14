import { useState, useEffect } from 'react';
import { getContractDetail } from '../api/client';

function formatDollars(amount) {
  if (amount == null) return 'N/A';
  const n = Number(amount);
  if (isNaN(n)) return 'N/A';
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ContractDetail({ piid, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!piid) return;
    setLoading(true);
    setError(null);
    getContractDetail(piid)
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [piid]);

  if (loading) {
    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h3>Contract Detail</h3>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
        <div className="detail-loading">Loading SAM.gov data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h3>Contract Detail</h3>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="detail-panel">
        <div className="detail-header">
          <h3>Contract Detail</h3>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
        <div className="detail-empty">No SAM.gov record found for {piid}</div>
      </div>
    );
  }

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h3>Contract Detail — {data.piid}</h3>
        <button className="secondary" onClick={onClose}>Close</button>
      </div>

      <div className="detail-grid">
        <section className="detail-section">
          <h4>Contracting Office</h4>
          <dl>
            <dt>Department</dt>
            <dd>{data.department_name || '\u2014'}</dd>
            <dt>Sub-Tier Agency</dt>
            <dd>{data.subtier_name || '\u2014'}</dd>
            <dt>Office</dt>
            <dd>{data.office_name || '\u2014'}</dd>
            <dt>Office Code</dt>
            <dd>{data.office_code || '\u2014'}</dd>
          </dl>
        </section>

        <section className="detail-section">
          <h4>Contracting Personnel</h4>
          <dl>
            <dt>Created By</dt>
            <dd className="co-email">{data.created_by || '\u2014'}</dd>
            <dt>Approved By</dt>
            <dd className="co-email">{data.approved_by || '\u2014'}</dd>
            {data.last_modified_by && data.last_modified_by !== data.approved_by && <>
              <dt>Last Modified By</dt>
              <dd className="co-email">{data.last_modified_by}</dd>
            </>}
          </dl>
        </section>

        <section className="detail-section">
          <h4>Awardee</h4>
          <dl>
            <dt>Name</dt>
            <dd>{data.awardee_name || '\u2014'}</dd>
            {data.awardee_parent_name && data.awardee_parent_name !== data.awardee_name && <>
              <dt>Parent</dt>
              <dd>{data.awardee_parent_name}</dd>
            </>}
            <dt>UEI</dt>
            <dd>{data.awardee_uei || '\u2014'}</dd>
            <dt>CAGE</dt>
            <dd>{data.awardee_cage || '\u2014'}</dd>
            <dt>Address</dt>
            <dd>
              {[data.awardee_address, data.awardee_city, data.awardee_state, data.awardee_zip]
                .filter(Boolean).join(', ') || '\u2014'}
            </dd>
            {data.awardee_phone && <>
              <dt>Phone</dt>
              <dd>{data.awardee_phone}</dd>
            </>}
          </dl>
        </section>

        <section className="detail-section">
          <h4>Financials</h4>
          <dl>
            <dt>Action Obligation</dt>
            <dd className="amount">{formatDollars(data.action_obligation)}</dd>
            <dt>Base & Options Value</dt>
            <dd className="amount">{formatDollars(data.base_and_options_value)}</dd>
            <dt>Total Obligation</dt>
            <dd className="amount">{formatDollars(data.total_obligation)}</dd>
            <dt>Total Base & Options</dt>
            <dd className="amount">{formatDollars(data.total_base_and_options)}</dd>
          </dl>
        </section>

        <section className="detail-section">
          <h4>Product / Service</h4>
          <dl>
            <dt>PSC</dt>
            <dd>{data.psc_code ? `${data.psc_code} \u2014 ${data.psc_description || ''}` : '\u2014'}</dd>
            <dt>NAICS</dt>
            <dd>{data.naics_code ? `${data.naics_code} \u2014 ${data.naics_description || ''}` : '\u2014'}</dd>
            {data.description && <>
              <dt>Description</dt>
              <dd>{data.description}</dd>
            </>}
          </dl>
        </section>

        <section className="detail-section">
          <h4>Competition</h4>
          <dl>
            <dt>Set-Aside</dt>
            <dd>{data.set_aside_type || '\u2014'}</dd>
            <dt>Extent Competed</dt>
            <dd>{data.extent_competed || '\u2014'}</dd>
            <dt>Solicitation Procedures</dt>
            <dd>{data.solicitation_procedures || '\u2014'}</dd>
          </dl>
        </section>

        <section className="detail-section">
          <h4>Dates</h4>
          <dl>
            <dt>Signed</dt>
            <dd>{data.signed_date || '\u2014'}</dd>
            <dt>Period of Performance</dt>
            <dd>{data.effective_date || '\u2014'}</dd>
            <dt>Completion</dt>
            <dd>{data.completion_date || '\u2014'}</dd>
          </dl>
        </section>

        {(data.pop_city || data.pop_state) && (
          <section className="detail-section">
            <h4>Place of Performance</h4>
            <dl>
              <dt>Location</dt>
              <dd>{[data.pop_city, data.pop_state].filter(Boolean).join(', ')}</dd>
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
