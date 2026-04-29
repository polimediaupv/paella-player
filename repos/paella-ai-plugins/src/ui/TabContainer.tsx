import { toChildArray, type ComponentChildren, type VNode } from "preact";
import { useState } from "preact/hooks";

import "./TabContainer.css";

interface TabItemProps {
    label: string;
    children?: ComponentChildren;
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
    children?: ComponentChildren;
    activeTabIndex?: number;
}

const TabContainer = ({ children, activeTabIndex = 0 }: TabContainerProps) => {
    const [activeTab, setActiveTab] = useState(activeTabIndex);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const tabs = toChildArray(children)
        .filter((child) => {
            if (typeof child !== "object" || child === null) {
                return false;
            }
            const vnode = child as VNode<TabItemProps>;
            return vnode.type === TabItem && (vnode.props.enabled ?? true);
        }) as VNode<TabItemProps>[];

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