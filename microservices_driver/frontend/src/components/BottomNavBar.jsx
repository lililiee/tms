import React from "react";
const tabs = [
  { id: "dashboard", icon: "dashboard", label: "工作台" },
  { id: "tasklist", icon: "assignment", label: "任务" },
  { id: "tempmonitor", icon: "thermostat", label: "温控" },
  { id: "profile", icon: "person", label: "我的" },
];
const activeTabMap = { taskdetail: "tasklist", signature: "tasklist" };

export default function BottomNavBar({ currentPage, onNavigate }) {
  const activeTab = activeTabMap[currentPage] || currentPage;
  return React.createElement("nav", { className: "fixed bottom-0 w-full z-50 h-tab-bar-height bg-surface border-t border-outline-variant flex justify-around items-center px-4" },
    ...tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return React.createElement("button", {
        key: tab.id,
        onClick: () => onNavigate(tab.id),
        className: "flex flex-col items-center justify-center px-4 py-1 transition-colors " + (isActive ? "text-primary bg-primary-container/10 rounded-xl scale-95" : "text-on-surface-variant hover:bg-surface-container"),
      },
        React.createElement("span", {
          className: "material-symbols-outlined",
          style: isActive ? { fontVariationSettings: "'FILL' 1" } : undefined,
        }, tab.icon),
        React.createElement("span", { className: "text-caption font-caption" }, tab.label)
      );
    })
  );
}
