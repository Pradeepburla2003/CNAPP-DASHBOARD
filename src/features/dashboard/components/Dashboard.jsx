import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../dashboardSlice';
import CategorySection from './CategorySection.jsx';
import WidgetCatalog from './WidgetCatalog.jsx';
import '../styles/dashboard.css';

export default function Dashboard() {
    const dispatch = useDispatch();
    const { categories, searchQuery } = useSelector(s => s.dashboard);

    return (
        <div className="dashboard">
            
            <div className="categories">
                {categories.map(cat => (
                    <CategorySection key={cat.id} category={cat} />
                ))}
            </div>

            <WidgetCatalog />
        </div>
    );
}