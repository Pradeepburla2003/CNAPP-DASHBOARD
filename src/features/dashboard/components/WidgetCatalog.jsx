import React from 'react';
import { useSelector } from 'react-redux';

export default function WidgetCatalog() {
    const { widgets, searchQuery } = useSelector(s => s.dashboard);
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
        ? widgets.filter(w => w.name.toLowerCase().includes(q) || w.text.toLowerCase().includes(q))
        : widgets;

    return (
        <section className="catalog">
            <h3>All Widgets</h3>
            <ul className="catalog-list">
                {filtered.map(w => (
                    <li key={w.id} className="catalog-item">
                        <span className="catalog-name">{w.name}</span>
                        <span className="catalog-text">— {w.text}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}