import React, { useState, type ReactNode } from "react";

import "./TabContainer.css";

interface TabItemProps {
    label: string;
    children?: ReactNode;
    enabled?: boolean;
}

export const TabItem = ({ label, children }: TabItemProps) => (
    <div
        className="tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${label}`}
    >
        {children}
    </div>
);


interface TabContainerProps {
    children?: ReactNode;
    activeTabIndex?: number;
}

const TabContainer = ({ children, activeTabIndex = 0 }: TabContainerProps) => {
    const [activeTab, setActiveTab] = useState(activeTabIndex);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const tabs = React.Children.toArray(children)
        .filter((child): child is React.ReactElement<TabItemProps> => 
            React.isValidElement(child) && child.type === TabItem && ((child.props as TabItemProps).enabled ?? true)
        );

    return (
        <div className="tab-container">
            <nav>
                <ul>
                    {tabs.map((tab, index) => (
                        <li key={`tab-${index}`}>
                            <button
                                className={`tab-btn ${activeTab === index ? "tab-btn-active" : ""}`}
                                onClick={() => handleTabClick(index)}
                            >
                                {tab.props.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                {tabs[activeTab]}
            </div>
        </div>
    );
};

export default TabContainer;