import React from "react";
export default function TopAppBar({ page }) {
  return React.createElement("header", { className: "fixed top-0 w-full z-50 h-nav-bar-height bg-surface border-b border-outline-variant flex justify-between items-center px-container-margin" },
    React.createElement("div", { className: "flex items-center gap-2" },
      React.createElement("span", { className: "material-symbols-outlined text-on-surface" }, "menu"),
      React.createElement("h1", { className: "text-nav-title font-nav-title text-primary" }, "TMS Driver")
    ),
    React.createElement("div", { className: "flex items-center gap-4" },
      React.createElement("div", { className: "relative" },
        React.createElement("span", { className: "material-symbols-outlined text-on-surface" }, "notifications"),
        React.createElement("span", { className: "absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface" })
      )
    )
  );
}
