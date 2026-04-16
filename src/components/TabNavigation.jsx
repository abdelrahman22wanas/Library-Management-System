import React from 'react';

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'browse', label: 'Browse Catalog', icon: '🔍' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'loans', label: 'Loans', icon: '📖' },
  ];

  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span>{tab.icon}</span> {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default TabNavigation;
