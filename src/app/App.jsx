import React from 'react';
import Header from './layout/Header.jsx';
import Breadcrumbs from './layout/Breadcrumbs.jsx';
import Dashboard from '../features/dashboard/components/Dashboard.jsx';
import AddWidgetModal from '../features/dashboard/components/AddWidgetModal.jsx';
import { useState } from 'react';
import dashboardData from '../data/dashboard.json'
export default function App() {
  const [showAddWidget, setShowAddWidget] = useState(false)
  return (
    <div className="app-shell">
      <Header />
      <div className="container">
        <Breadcrumbs onAddWidget={() => setShowAddWidget(true)}/>
        <Dashboard />
        {showAddWidget && (
        <AddWidgetModal data={dashboardData} onClose={() => setShowAddWidget(false)} />
      )}
  
      </div>
    </div>
  );
}