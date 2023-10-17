import React, { useState } from "react";

const DivTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState("");

  const handleTabClick = (tabTitle) => {
    setActiveTab(tabTitle);
  };

  return (
    <div className="div-tabs">
      <ul className="nav nav-tabs" role="tablist">
        {children.map((tab, index) => {
          const { title } = tab.props;
          const isActive = activeTab === title;

          return (
            <li key={index} className="nav-item">
              <button
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleTabClick(title)}
              >
                {title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="tab-content">
        {children.map((tab, index) => {
          return React.cloneElement(tab, {
            activeTab: activeTab,
            onTabClick: handleTabClick,
            key: index,
          });
        })}
      </div>
    </div>
  );
};

export default DivTabs;

