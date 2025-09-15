import React from 'react';

export default function WidgetCard({ widget, onRemove }) {
    return (
        <article className="widget-card">
            <div className="widget-card-header">
                <span className="widget-title">{widget.name}</span>
                <button className="icon-btn" aria-label="remove" onClick={onRemove}>×</button>
            </div>
            <p className="widget-text">{widget.text}</p>
        </article>
    );
}