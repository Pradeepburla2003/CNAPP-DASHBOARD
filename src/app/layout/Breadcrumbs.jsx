import React, { useState } from 'react';

export default function Breadcrumbs({ onAddWidget }) {
  const [range, setRange] = useState('Last 2 days');
  const [open, setOpen] = useState(false);

  const ranges = ['Last 1 day', 'Last 2 days', 'Last 3 days', 'Last 4 days','Last 5 days','Last 6 days','Last 7 days'];

  return (
    <div className="breadcrumbs-bar">
      {/* Left side */}
      <div className="breadcrumbs-left">CNAPP Dashboard</div>

      {/* Right side */}
      <div className="breadcrumbs-right">
        <button className="btn primary" onClick={onAddWidget}>
          + Add Widget
        </button>

        <button className="iconBtn" aria-label="Refresh">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4.93 4.93a10 10 0 1014.14 0M9 9v6h6" />
          </svg>
        </button>

        <button className="iconBtn" aria-label="More options">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        {/* Dropdown for date range */}
        <div className="dropdown">
          <button
            className="btn"
            onClick={() => setOpen(!open)}
          >
            {range}
          </button>
          {open && (
            <ul className="dropdown-menu">
              {ranges.map(r => (
                <li key={r}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setRange(r);
                      setOpen(false);
                    }}
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
