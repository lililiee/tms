import React from "react";
export default function P3_TaskList({ onNavigate }) {
  const [activeTab, setActiveTab] = React.useState(1);
  const tabs = ["待提货", "运输中", "已完成", "异常"];
  const e = React.createElement;

  return e("div", { className: "safe-top safe-bottom max-w-lg mx-auto" },
    e("div", { className: "bg-surface sticky top-nav-bar-height z-40 border-b border-outline-variant/30 px-container-margin" },
      e("div", { className: "flex justify-between items-center h-[56px] overflow-x-auto hide-scrollbar gap-inline-gap" },
        ...tabs.map((label, i) => {
          const isActive = activeTab === i;
          return e("button", { key: i, onClick: () => setActiveTab(i), className: "relative h-full px-2 flex flex-col justify-center items-center group" },
            e("span", { className: (isActive ? "text-primary font-body-bold" : "text-on-surface-variant font-body-main") + " text-body-main" }, label),
            isActive ? e("div", { className: "absolute bottom-0 w-8 h-1 bg-primary rounded-full" }) : null,
            i === 3 ? e("span", { className: "absolute top-2 -right-1 flex h-2 w-2" },
              e("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" }),
              e("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-error" })
            ) : null
          );
        })
      )
    ),
    e("div", { className: "px-container-margin mt-4 pb-24 flex flex-col gap-stack-gap" },
      e("div", { className: "bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col gap-3", onClick: () => onNavigate("taskdetail") },
        e("div", { className: "flex justify-between items-start" },
          e("div", { className: "flex flex-col" },
            e("span", { className: "text-caption font-caption text-outline mb-1" }, "运单号: DD20231024001"),
            e("h2", { className: "text-section-title font-section-title text-on-surface" }, "沃尔玛 (Walmart) - 顺义店")
          ),
          e("div", { className: "bg-primary-container/10 text-primary px-3 py-1 rounded-full flex items-center gap-1 border border-primary-container/20" },
            e("span", { className: "material-symbols-outlined text-[16px]" }, "ac_unit"),
            e("span", { className: "text-caption font-caption font-semibold" }, "冷藏 (2-8°C)")
          )
        ),
        e("div", { className: "flex gap-4 items-stretch py-2" },
          e("div", { className: "flex flex-col items-center gap-1" },
            e("div", { className: "w-3 h-3 rounded-full border-2 border-primary bg-white" }),
            e("div", { className: "w-[1px] flex-grow border-l border-dashed border-outline-variant" }),
            e("div", { className: "w-3 h-3 rounded-full bg-primary" })
          ),
          e("div", { className: "flex flex-col justify-between flex-grow" },
            e("div", { className: "flex justify-between items-center" },
              e("span", { className: "text-body-main font-body-main text-on-surface-variant" }, "北京冷库"),
              e("span", { className: "text-caption font-caption text-outline" }, "提货")
            ),
            e("div", { className: "flex justify-between items-center mt-4" },
              e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "顺义金街"),
              e("span", { className: "text-caption font-caption text-outline" }, "送货")
            )
          )
        ),
        e("div", { className: "grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/30" },
          e("div", { className: "flex items-center gap-2" },
            e("span", { className: "material-symbols-outlined text-outline text-[20px]" }, "schedule"),
            e("div", { className: "flex flex-col" },
              e("span", { className: "text-[11px] uppercase tracking-wider text-outline" }, "配送窗口"),
              e("span", { className: "text-body-main font-body-main text-on-surface" }, "14:00 - 16:00")
            )
          ),
          e("div", { className: "flex items-center gap-2" },
            e("span", { className: "material-symbols-outlined text-outline text-[20px]" }, "route"),
            e("div", { className: "flex flex-col" },
              e("span", { className: "text-[11px] uppercase tracking-wider text-outline" }, "剩余距离"),
              e("span", { className: "text-body-main font-body-main text-on-surface" }, "15.2 km")
            )
          )
        ),
        e("div", { className: "mt-2 flex gap-2" },
          e("button", { className: "flex-1 bg-primary text-on-primary h-touch-target-min rounded-lg font-body-bold flex items-center justify-center gap-2" },
            e("span", { className: "material-symbols-outlined" }, "navigation"), "继续导航"
          ),
          e("button", { className: "w-[48px] bg-surface-container border border-outline-variant h-touch-target-min rounded-lg flex items-center justify-center" },
            e("span", { className: "material-symbols-outlined text-on-surface-variant" }, "call")
          )
        )
      ),
      e("div", { className: "bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex flex-col gap-3 opacity-90" },
        e("div", { className: "flex justify-between items-start" },
          e("div", { className: "flex flex-col" },
            e("span", { className: "text-caption font-caption text-outline mb-1" }, "运单号: DD20231024005"),
            e("h2", { className: "text-section-title font-section-title text-on-surface" }, "物美超市 - 通州北关店")
          ),
          e("div", { className: "bg-secondary-container/20 text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1 border border-secondary-container/40" },
            e("span", { className: "material-symbols-outlined text-[16px]" }, "kitchen"),
            e("span", { className: "text-caption font-caption font-semibold" }, "冷冻 (-18°C)")
          )
        ),
        e("div", { className: "grid grid-cols-2 gap-2 pt-3 border-t border-outline-variant/30" },
          e("div", { className: "flex items-center gap-2" },
            e("span", { className: "material-symbols-outlined text-outline text-[20px]" }, "schedule"),
            e("span", { className: "text-body-main font-body-main text-on-surface-variant" }, "16:30 - 18:30")
          ),
          e("div", { className: "flex items-center gap-2" },
            e("span", { className: "material-symbols-outlined text-outline text-[20px]" }, "inventory_2"),
            e("span", { className: "text-body-main font-body-main text-on-surface-variant" }, "24 箱 / 120kg")
          )
        )
      ),
      e("div", { className: "grid grid-cols-2 gap-stack-gap mt-2" },
        e("div", { className: "bg-surface-container-high rounded-xl p-4 flex flex-col" },
          e("span", { className: "material-symbols-outlined text-primary mb-2" }, "thermostat"),
          e("span", { className: "text-caption font-caption text-on-surface-variant" }, "货厢温度"),
          e("span", { className: "text-data-display font-data-display text-on-surface mt-1" }, "4.2°C"),
          e("div", { className: "mt-2 w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden" },
            e("div", { className: "bg-secondary h-full rounded-full", style: { width: "65%" } })
          )
        ),
        e("div", { className: "bg-primary/5 rounded-xl p-4 border border-primary/10 flex flex-col" },
          e("span", { className: "material-symbols-outlined text-primary mb-2" }, "local_gas_station"),
          e("span", { className: "text-caption font-caption text-on-surface-variant" }, "剩余电量"),
          e("span", { className: "text-data-display font-data-display text-primary mt-1" }, "78%"),
          e("span", { className: "text-caption font-caption text-outline mt-1" }, "预估可行驶 220km")
        )
      ),
      e("div", { className: "relative h-48 rounded-xl border border-outline-variant overflow-hidden" },
        e("div", { className: "absolute inset-0 bg-surface-container-low flex items-center justify-center" },
          e("span", { className: "material-symbols-outlined text-primary text-[40px]" }, "local_shipping")
        ),
        e("div", { className: "absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg border border-outline-variant text-[11px] font-bold" }, "实时交通: 畅通")
      )
    )
  );
}
