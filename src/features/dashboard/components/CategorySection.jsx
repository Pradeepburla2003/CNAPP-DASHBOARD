import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWidgetToCategory,
  removeWidgetFromCategory,
  deleteWidget, // ✅ new action
} from "../dashboardSlice.js";
import WidgetCard from "./WidgetCard.jsx";

export default function CategorySection({ category }) {
  const dispatch = useDispatch();
  const { widgets, categories } = useSelector((s) => s.dashboard);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const mapped = category.widgetIds
    .map((id) => widgets.find((w) => w.id === id))
    .filter(Boolean);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(addWidgetToCategory({ categoryId: category.id, name, text }));
    setName("");
    setText("");
    setShowForm(false);
  };

  const handleRemove = (widgetId) => {
    // 1. Remove from this category
    dispatch(removeWidgetFromCategory({ categoryId: category.id, widgetId }));

    // 2. Check if widget is used anywhere else
    const usedSomewhereElse = categories.some(
      (cat) => cat.widgetIds.includes(widgetId) && cat.id !== category.id
    );

    // 3. If not used anywhere else → delete globally
    if (!usedSomewhereElse) {
      dispatch(deleteWidget(widgetId));
    }
  };

  return (
    <section className="category">
      <div className="category-header">
        <h3>{category.name}</h3>
      </div>

      {showForm && (
        <form className="add-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Widget name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Widget text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="form-actions">
            <button className="btn primary" type="submit">
              Add
            </button>
            <button className="btn" type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="widget-grid">
        {mapped.map((w) => (
          <WidgetCard
            key={w.id}
            widget={w}
            onRemove={() => handleRemove(w.id)} // ✅ new remove logic
          />
        ))}

        {/* Add Widget "Card" */}
        <div className="widget-card add-widget-card">
          <button className="btn" onClick={() => setShowForm(true)}>
            + Add Widget
          </button>
        </div>
      </div>
    </section>
  );
}
