import React from "react";
export default function P4_TaskDetail({ onNavigate }) {
  const e = React.createElement;
  return e("div", { className: "flex-grow safe-top flex flex-col min-h-screen pb-[260px]" },
    e("section", { className: "relative w-full h-[353px] overflow-hidden bg-surface-container-high border-b border-outline-variant" },
      e("div", { className: "w-full h-full bg-surface-container-low flex items-center justify-center" },
        e("span", { className: "material-symbols-outlined text-outline/30 text-6xl" }, "map")
      ),
      e("div", { className: "absolute top-4 left-4 right-4 flex justify-between pointer-events-none" },
        e("div", { className: "bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-outline-variant flex flex-col" },
          e("span", { className: "text-caption font-caption text-outline" }, "剩余距离"),
          e("span", { className: "text-section-title font-section-title text-primary" }, "12.5 km")
        ),
        e("div", { className: "bg-white/90 backdrop-blur px-4 py-2 rounded-xl border border-outline-variant flex flex-col" },
          e("span", { className: "text-caption font-caption text-outline" }, "预计用时"),
          e("span", { className: "text-section-title font-section-title text-primary" }, "24 min")
        )
      ),
      e("div", { className: "absolute bottom-4 left-4 right-4" },
        e("div", { className: "bg-primary px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-white animate-pulse" },
          e("span", { className: "material-symbols-outlined text-[20px]" }, "location_on"),
          e("span", { className: "text-body-bold font-body-bold" }, "已进入围栏，系统自动签到中")
        )
      )
    ),
    e("div", { className: "px-container-margin -mt-6 relative z-10 space-y-3" },
      e("div", { className: "bg-white p-4 rounded-xl border border-outline-variant grid grid-cols-2 gap-4" },
        e("div", { className: "space-y-1" },
          e("p", { className: "text-caption font-caption text-outline" }, "货物摘要"),
          e("p", { className: "text-body-bold font-body-bold text-on-surface" }, "200kg / 1.5m³ / 50件")
        ),
        e("div", { className: "space-y-1" },
          e("p", { className: "text-caption font-caption text-outline" }, "温控要求"),
          e("div", { className: "inline-flex items-center px-2 py-0.5 rounded-full bg-primary-container/10 border border-primary-container/20" },
            e("span", { className: "material-symbols-outlined text-[16px] text-primary mr-1" }, "thermostat"),
            e("span", { className: "text-caption font-caption text-primary" }, "2°C - 8°C (冷藏)")
          )
        )
      ),
      e("div", { className: "bg-white rounded-xl border border-outline-variant overflow-hidden" },
        e("div", { className: "bg-surface-container px-4 py-2 flex items-center gap-2 border-b border-outline-variant" },
          e("span", { className: "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold" }, "提"),
          e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "上海嘉定冷链仓"),
          e("span", { className: "ml-auto text-caption font-caption text-primary" }, "09:00 - 10:30")
        ),
        e("div", { className: "p-4 space-y-3" },
          e("div", { className: "flex justify-between items-start" },
            e("p", { className: "text-body-main font-body-main text-on-surface-variant flex-grow" }, "上海市嘉定区兴贤路1200号3号仓库"),
            e("span", { className: "material-symbols-outlined text-primary ml-2" }, "near_me")
          ),
          e("div", { className: "h-[1px] bg-outline-variant/30" }),
          e("div", { className: "flex items-center justify-between" },
            e("div", { className: "flex items-center gap-3" },
              e("div", { className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center" },
                e("span", { className: "material-symbols-outlined text-on-surface-variant" }, "person")
              ),
              e("div", null, e("p", { className: "text-body-bold font-body-bold" }, "张经理"), e("p", { className: "text-caption font-caption text-outline" }, "138-xxxx-8888"))
            ),
            e("button", { className: "w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-primary" },
              e("span", { className: "material-symbols-outlined" }, "call")
            )
          )
        )
      ),
      e("div", { className: "bg-white rounded-xl border border-outline-variant overflow-hidden" },
        e("div", { className: "bg-surface-container px-4 py-2 flex items-center gap-2 border-b border-outline-variant" },
          e("span", { className: "w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-[12px] font-bold" }, "卸"),
          e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "虹桥医药物流中心"),
          e("span", { className: "ml-auto text-caption font-caption text-secondary" }, "13:00 截止")
        ),
        e("div", { className: "p-4 space-y-3" },
          e("div", { className: "flex justify-between items-start" },
            e("p", { className: "text-body-main font-body-main text-on-surface-variant flex-grow" }, "上海市闵行区申长路1588号中骏广场"),
            e("span", { className: "material-symbols-outlined text-secondary ml-2" }, "near_me")
          ),
          e("div", { className: "h-[1px] bg-outline-variant/30" }),
          e("div", { className: "flex items-center justify-between" },
            e("div", { className: "flex items-center gap-3" },
              e("div", { className: "w-10 h-10 rounded-full bg-surface-container flex items-center justify-center" },
                e("span", { className: "material-symbols-outlined text-on-surface-variant" }, "person")
              ),
              e("div", null, e("p", { className: "text-body-bold font-body-bold" }, "李主管"), e("p", { className: "text-caption font-caption text-outline" }, "139-xxxx-9999"))
            ),
            e("button", { className: "w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-secondary" },
              e("span", { className: "material-symbols-outlined" }, "call")
            )
          )
        )
      )
    ),
    e("div", { className: "fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant" },
      e("div", { className: "absolute -top-16 right-4" },
        e("button", { className: "w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform" },
          e("span", { className: "material-symbols-outlined", style: { fontVariationSettings: "'FILL' 1" } }, "explore")
        )
      ),
      e("div", { className: "grid grid-cols-2 border-b border-outline-variant" },
        e("button", { onClick: () => onNavigate("exception"), className: "h-12 flex items-center justify-center gap-2 text-on-surface-variant border-r border-outline-variant active:bg-surface-container-low" },
          e("span", { className: "material-symbols-outlined text-[20px]" }, "report_problem"),
          e("span", { className: "text-caption font-caption" }, "异常上报")
        ),
        e("button", { className: "h-12 flex items-center justify-center gap-2 text-on-surface-variant active:bg-surface-container-low" },
          e("span", { className: "material-symbols-outlined text-[20px]" }, "refresh"),
          e("span", { className: "text-caption font-caption" }, "刷新状态")
        )
      ),
      e("div", { className: "p-4" },
        e("button", { onClick: () => onNavigate("signature"), className: "w-full h-[54px] bg-primary-container text-white rounded-xl flex items-center justify-center gap-2 font-body-bold text-body-bold active:scale-95 transition-transform" },
          e("span", { className: "material-symbols-outlined" }, "edit_square"), "完成签收 (待签)"
        )
      )
    )
  );
}
