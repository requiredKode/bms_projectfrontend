import React from 'react';

const DivTab = ({ title, activeTab, onTabClick, children }) => {
  const tabClassName = activeTab === title ? 'active' : '';

  return (
    <div
      className={`tab-pane ${tabClassName}`}
      onClick={() => onTabClick(title)}
    >
      {children}
    </div>
  );
};

export default DivTab;
