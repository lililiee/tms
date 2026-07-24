import React from "react";
export default function P2_Dashboard({ onNavigate }) {
  const e = React.createElement;
  return e("div", { className: "safe-top safe-bottom px-container-margin py-4 max-w-lg mx-auto space-y-6" },
    e("section", { className: "space-y-1" },
      e("div", { className: "flex justify-between items-end" },
        e("div", null,
          e("h2", { className: "font-section-title text-section-title text-on-surface" }, "师傅好，今天 5 单待配送"),
          e("p", { className: "font-caption text-caption text-outline" }, "2023年10月24日 星期二")
        ),
        e("div", { className: "bg-primary/10 rounded-full px-3 py-1 flex items-center gap-1" },
          e("span", { className: "material-symbols-outlined text-[16px] text-primary", style: { fontVariationSettings: "'FILL' 1" } }, "stars"),
          e("span", { className: "text-caption font-body-bold text-primary" }, "金牌司机")
        )
      )
    ),
    e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 space-y-3" },
      e("div", { className: "flex justify-between items-center" },
        e("span", { className: "font-body-bold text-body-bold text-on-surface" }, "当前进度"),
        e("span", { className: "font-body-bold text-body-bold text-primary" }, "第 2 / 5 单")
      ),
      e("div", { className: "w-full bg-surface-container-high rounded-full h-3 overflow-hidden" },
        e("div", { className: "bg-primary h-full rounded-full transition-all duration-1000 ease-out", style: { width: "40%" } })
      ),
      e("div", { className: "flex justify-between text-caption font-caption text-outline" },
        e("span", null, "起点: 华东物流中心"),
        e("span", null, "下一站: 浦东新区张江")
      )
    ),
    e("section", { className: "grid grid-cols-2 gap-3" },
      e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between min-h-[100px] cursor-pointer", onClick: () => onNavigate("tasklist") },
        e("span", { className: "text-outline font-caption text-caption" }, "待取货"),
        e("span", { className: "text-data-display font-data-display text-on-surface" }, "3")
      ),
      e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between min-h-[100px] cursor-pointer", onClick: () => onNavigate("tasklist") },
        e("span", { className: "text-outline font-caption text-caption" }, "运输中"),
        e("span", { className: "text-data-display font-data-display text-on-surface" }, "2")
      ),
      e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col justify-between min-h-[100px] cursor-pointer" },
        e("span", { className: "text-outline font-caption text-caption" }, "已完成"),
        e("span", { className: "text-data-display font-data-display text-secondary" }, "18")
      ),
      e("div", { className: "bg-surface-container-lowest border border-error/30 rounded-xl p-4 flex flex-col justify-between min-h-[100px] relative cursor-pointer overflow-hidden" },
        e("div", { className: "absolute top-4 right-4" },
          e("span", { className: "flex h-3 w-3" },
            e("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" }),
            e("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-error" })
          )
        ),
        e("span", { className: "text-error font-caption text-caption" }, "异常订单"),
        e("span", { className: "text-data-display font-data-display text-error" }, "1")
      )
    ),
    e("section", { className: "grid grid-cols-2 gap-3" },
      e("button", { className: "flex flex-col items-center justify-center gap-2 bg-primary text-on-primary h-[96px] rounded-xl active:scale-95 transition-transform" },
        e("span", { className: "material-symbols-outlined text-[32px]" }, "qr_code_scanner"),
        e("span", { className: "font-body-bold text-body-bold" }, "扫码签到")
      ),
      e("button", { onClick: () => onNavigate("exception"), className: "flex flex-col items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface h-[96px] rounded-xl active:scale-95 transition-transform" },
        e("span", { className: "material-symbols-outlined text-[32px] text-tertiary" }, "report_problem"),
        e("span", { className: "font-body-bold text-body-bold" }, "异常上报")
      ),
      e("button", { className: "flex flex-col items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface h-[96px] rounded-xl active:scale-95 transition-transform" },
        e("span", { className: "material-symbols-outlined text-[32px] text-primary" }, "near_me"),
        e("span", { className: "font-body-bold text-body-bold" }, "一键导航")
      ),
      e("button", { className: "flex flex-col items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface h-[96px] rounded-xl active:scale-95 transition-transform" },
        e("span", { className: "material-symbols-outlined text-[32px] text-secondary" }, "support_agent"),
        e("span", { className: "font-body-bold text-body-bold" }, "联系调度")
      )
    ),
    e("section", { className: "space-y-3" },
      e("div", { className: "flex justify-between items-center" },
        e("h3", { className: "font-section-title text-section-title text-on-surface" }, "实时预警"),
        e("span", { className: "text-caption font-caption text-primary cursor-pointer" }, "全部记录")
      ),
      e("div", { className: "space-y-3" },
        e("div", { className: "bg-error-container/30 border border-error/20 rounded-xl p-4 flex items-start gap-4" },
          e("div", { className: "p-2 bg-error-container rounded-lg" }, e("span", { className: "material-symbols-outlined text-error" }, "thermostat_auto")),
          e("div", { className: "flex-1" },
            e("div", { className: "flex justify-between" }, e("span", { className: "font-body-bold text-body-bold text-error" }, "温度过高预警"), e("span", { className: "text-caption font-caption text-outline" }, "10:24")),
            e("p", { className: "text-caption font-caption text-on-surface-variant mt-1" }, "车厢 A03 当前温度 8.2°C，已超过设定阈值 (5.0°C)。请检查温控设备。"),
            e("div", { className: "mt-2" }, e("span", { className: "inline-flex items-center px-2 py-1 rounded-md bg-error text-white text-[11px] font-bold" }, "紧急处理"))
          )
        ),
        e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-start gap-4" },
          e("div", { className: "p-2 bg-surface-container-high rounded-lg" }, e("span", { className: "material-symbols-outlined text-on-surface-variant" }, "wrong_location")),
          e("div", { className: "flex-1" },
            e("div", { className: "flex justify-between" }, e("span", { className: "font-body-bold text-body-bold text-on-surface" }, "偏离路线提醒"), e("span", { className: "text-caption font-caption text-outline" }, "09:45")),
            e("p", { className: "text-caption font-caption text-on-surface-variant mt-1" }, "当前车辆已偏离预设路线 2km，请确认行驶路径或申请变更。")
          )
        )
      )
    ),
    e("section", { className: "relative h-32 rounded-xl overflow-hidden border border-outline-variant group cursor-pointer" },
      e("div", { className: "absolute inset-0 bg-surface-container-high flex items-center justify-center" },
        e("span", { className: "material-symbols-outlined text-outline/40 text-5xl" }, "map")
      ),
      e("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
      e("div", { className: "absolute bottom-3 left-3 text-white" },
        e("p", { className: "text-caption font-caption opacity-80" }, "当前位置"),
        e("p", { className: "font-body-bold text-body-bold" }, "上海市 浦东新区 龙阳路")
      ),
      e("div", { className: "absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-on-surface" }, "实时地图")
    )
  );
}
