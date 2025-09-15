import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExistingWidgetToCategory,
  removeWidgetFromCategory,
  deleteWidget
} from "../dashboardSlice";

export default function AddWidgetModal({ onClose }) {
  const dispatch = useDispatch();

  const categories = useSelector((s) => s.dashboard.categories);
  const widgets = useSelector((s) => s.dashboard.widgets);

  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [localWidgetIds, setLocalWidgetIds] = useState([]);

  useEffect(() => {
    const currentCategory = categories.find((c) => c.id === selectedCategory);
    setLocalWidgetIds([...currentCategory.widgetIds]);
  }, [selectedCategory, categories]);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const toggleWidget = (widgetId, checked) => {
    setLocalWidgetIds((prev) =>
      checked ? [...prev, widgetId] : prev.filter((id) => id !== widgetId)
    );
  };

  const handleConfirm = () => {
    const prevIds = currentCategory.widgetIds;

    // Add new
    localWidgetIds.forEach((id) => {
      if (!prevIds.includes(id)) {
        dispatch(addExistingWidgetToCategory({ categoryId: currentCategory.id, widgetId: id }));
      }
    });

    // Remove old
    prevIds.forEach((id) => {
      if (!localWidgetIds.includes(id)) {
        dispatch(removeWidgetFromCategory({ categoryId: currentCategory.id, widgetId: id }));
        dispatch(deleteWidget(id));
      }
    });

    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h1 className="drawer-title">Add Widget</h1>
          <button className="iconBtn white-text" onClick={onClose}>✕</button>
        </div>

        {/* Sub-title */}
        <p className="drawer-subtitle">
          Personalise your dashboard by adding/removing widgets from categories
        </p>

        {/* Tabs */}
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`tab-link ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Widgets */}
        <div className="widget-list">
          {widgets.map((widget) => {
            const isChecked = localWidgetIds.includes(widget.id);
            return (
              <label key={widget.id} className="widget-item">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => toggleWidget(widget.id, e.target.checked)}
                />
                {widget.name} — <small>{widget.text}</small>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
