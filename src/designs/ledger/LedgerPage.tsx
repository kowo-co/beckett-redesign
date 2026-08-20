import { useState } from 'react'
import './receipt.css'

const filings = [
  { id: 'LDG-8841', client: 'North Sea Freight', status: 'CLEARED', days: 3 },
  { id: 'LDG-8842', client: 'Maas Container', status: 'PENDING', days: 1 },
]

export function LedgerPage() {
  const [filed, setFiled] = useState(false)

  return (
    <div className="receipt">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="rc-header">
        <h1 className="rc-title">[CUSTOMS IN THREE DAYS]</h1>
        <p className="rc-subtitle">[LEDGER TERMINAL · ROTTERDAM · 1987]</p>
      </header>

      <main id="main" className="rc-main">
        <section className="rc-block" aria-labelledby="rc-hero">
          <div className="rc-block-header">
            <span>[§001]</span>
            <h2 id="rc-hero">[STATEMENT]</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field">
              Ledger Terminal clears import-export paperwork for shippers who cannot wait.
            </p>
            <p className="rc-field rc-field-muted">
              Maasvlakte manifest review, Feb 2026. Forty containers. Same day.
            </p>
            <img
              src="/assets/ledger/port.jpg"
              alt="Black and white Rotterdam port with shipping containers"
              className="rc-img"
            />
          </div>
        </section>

        <section className="rc-block" aria-labelledby="rc-active">
          <div className="rc-block-header">
            <span>[§002]</span>
            <h2 id="rc-active">[ACTIVE FILINGS]</h2>
          </div>
          <div className="rc-block-body">
            <table className="rc-table">
              <caption className="sr-only">Current customs filings</caption>
              <thead>
                <tr>
                  <th scope="col">[REF]</th>
                  <th scope="col">[CLIENT]</th>
                  <th scope="col">[STATUS]</th>
                  <th scope="col">[DAYS]</th>
                </tr>
              </thead>
              <tbody>
                {filings.map((f) => (
                  <tr key={f.id}>
                    <td>{f.id}</td>
                    <td>{f.client}</td>
                    <td>{f.status}</td>
                    <td>{f.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <img
              src="/assets/ledger/form.jpg"
              alt="Vintage customs declaration form with stamps"
              className="rc-img"
              loading="lazy"
            />
          </div>
        </section>

        <section className="rc-block" aria-labelledby="rc-submit">
          <div className="rc-block-header">
            <span>[§003]</span>
            <h2 id="rc-submit">[SUBMIT MANIFEST]</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field">[ONE ACTION REQUIRED]</p>
            <img
              src="/assets/ledger/ledger.jpg"
              alt="Cargo manifest ledger with ruled lines"
              className="rc-img"
              loading="lazy"
            />
            <button
              type="button"
              className={`rc-action ${filed ? 'rc-action--done' : ''}`}
              onClick={() => setFiled(true)}
              disabled={filed}
            >
              {filed ? '[MANIFEST RECEIVED · REF LDG-NEW]' : '[FILE MANIFEST]'}
            </button>
          </div>
        </section>
      </main>

      <footer className="rc-footer">
        <div className="rc-total-row">
          <span>[CLIENTS THIS QUARTER]</span>
          <span>14</span>
        </div>
        <p className="rc-field-muted" style={{ margin: '0.5rem 0 0' }}>
          [+31 10 123 4567] · ledgerterminal.nl
        </p>
      </footer>
    </div>
  )
}
