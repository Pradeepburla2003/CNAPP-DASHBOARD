import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

/**
 * Header with search-autocomplete for widgets.
 * - onSearch(query) is called when the form is submitted or a suggestion is clicked.
 */
export default function Header({ onSearch = () => {} }) {
  const widgets = useSelector((s) => s.dashboard.widgets || []);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced filtering of widgets
  useEffect(() => {
    clearTimeout(debounceRef.current);

    const q = (query || "").trim();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const lower = q.toLowerCase();
      const matches = widgets
        .filter(
          (w) =>
            (w.name && w.name.toLowerCase().includes(lower)) ||
            (w.text && w.text.toLowerCase().includes(lower))
        )
        .slice(0, 10); // limit suggestions
      setSuggestions(matches);
      setShowSuggestions(true);
      setActiveIndex(matches.length ? 0 : -1);
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, widgets]);

  // Click outside to close suggestions
  useEffect(() => {
    const onDocClick = (ev) => {
      if (containerRef.current && !containerRef.current.contains(ev.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // helper to highlight match (returns JSX)
  const highlight = (text = "", q = "") => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1 || !q) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + q.length);
    const after = text.slice(idx + q.length);
    return (
      <>
        {before}
        <mark className="suggest-mark">{match}</mark>
        {after}
      </>
    );
  };

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIndex(-1);
    onSearch(item.name);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);
    onSearch(query.trim());
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <nav className="header__breadcrumb text-gray-600 text-sm">
          Home <span className="mx-1">›</span>{" "}
          <span className="mx-2 breadcrumb-current">Dashboard V2</span>
        </nav>
      </div>

      <div className="header__middle">
        <form
          className="header__search"
          role="search"
          aria-label="Search widgets"
          onSubmit={handleSubmit}
          ref={containerRef}
        >
          <label htmlFor="site-search" className="visually-hidden">
            Search
          </label>

          <input
            id="site-search"
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            className="header__searchInput"
            placeholder="Search anything..."
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
          />

          <button className="header__searchBtn" type="submit" aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {showSuggestions && (
            <ul
              id="search-suggestions"
              className="search-suggestions"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestions.length === 0 ? (
                <li className="no-results">No widgets available with that name</li>
              ) : (
                suggestions.map((s, idx) => (
                  <li
                    key={s.id}
                    role="option"
                    aria-selected={activeIndex === idx}
                    className={`suggestion-item ${activeIndex === idx ? "active" : ""}`}
                    onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                    onClick={() => handleSelect(s)}
                  >
                    <div className="suggestion-main">{highlight(s.name, query)}</div>
                    {s.text && <div className="suggestion-sub">{s.text}</div>}
                  </li>
                ))
              )}
            </ul>
          )}
        </form>
      </div>

      <div className="header__right">
        <button className="iconBtn" aria-label="Notifications">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="badge" aria-hidden="true">
            3
          </span>
        </button>

        <button className="iconBtn" aria-label="Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="7.5" r="3.5" />
            <path d="M4 20a8 8 0 0116 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
