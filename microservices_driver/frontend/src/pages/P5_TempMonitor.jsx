import React from "react";
export default function P5_TempMonitor() {
  const e = React.createElement;
  return e("div", { className: "safe-top safe-bottom px-container-margin py-6 flex flex-col gap-6 max-w-lg mx-auto" },
    e("section", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-5 relative overflow-hidden" },
      e("div", { className: "absolute top-0 right-0 p-4" },
        e("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 text-primary font-body-bold text-caption" },
          e("span", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }), "实时监测"
        )
      ),
      e("div", { className: "flex flex-col gap-1" },
        e("span", { className: "text-caption font-caption text-on-surface-variant" }, "冷藏箱 (Cold Storage)"),
        e("div", { className: "flex items-baseline gap-2" },
          e("span", { className: "text-[64px] font-bold tracking-tight text-on-surface leading-none" }, "4.5"),
          e("span", { className: "text-data-display font-data-display text-on-surface-variant" }, "°C")
        ),
        e("div", { className: "mt-2 flex gap-3" },
          e("div", { className: "bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/50" },
            e("span", { className: "text-caption font-caption text-on-surface-variant block" }, "标准范围"),
            e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "2°C - 8°C")
          ),
          e("div", { className: "bg-secondary-container/20 px-3 py-1.5 rounded-lg border border-secondary-container/50" },
            e("span", { className: "text-caption font-caption text-on-secondary-container block" }, "当前状态"),
            e("span", { className: "text-body-bold font-body-bold text-secondary" }, "安全正常")
          )
        )
      )
    ),
    e("section", { className: "bg-white border border-outline-variant rounded-xl p-5" },
      e("div", { className: "flex justify-between items-center mb-4" },
        e("h3", { className: "text-section-title font-section-title text-on-surface" }, "温度趋势 (Trend)"),
        e("span", { className: "text-caption font-caption text-outline" }, "最近 2 小时")
      ),
      e("div", { className: "h-[180px] bg-surface-container-low rounded-lg relative px-2" },
        e("div", { className: "absolute inset-0 flex flex-col justify-between py-6 opacity-20 pointer-events-none" },
          e("div", { className: "border-t border-outline" }), e("div", { className: "border-t border-outline" }), e("div", { className: "border-t border-outline" })
        ),
        e("div", { className: "absolute top-[20%] w-full border-t-2 border-dashed border-error/50 z-10" },
          e("span", { className: "absolute -top-5 right-2 text-[10px] font-bold text-error" }, "阈值 8°C")
        ),
        e("svg", { className: "w-full h-full drop-shadow-sm", viewBox: "0 0 400 140" },
          e("path", { d: "M0,100 Q50,90 100,110 T200,80 T300,95 T400,85", fill: "none", stroke: "#2F6BFF", strokeWidth: "3" }),
          e("circle", { cx: "400", cy: "85", fill: "#2F6BFF", r: "4" }),
          e("circle", { cx: "400", cy: "85", fill: "#2F6BFF", fillOpacity: "0.2", r: "8", className: "animate-pulse" })
        ),
        e("div", { className: "flex justify-between mt-2 px-1" },
          e("span", { className: "text-[10px] text-outline" }, "14:30"),
          e("span", { className: "text-[10px] text-outline" }, "15:00"),
          e("span", { className: "text-[10px] text-outline" }, "15:30"),
          e("span", { className: "text-[10px] text-outline" }, "16:00")
        )
      )
    ),
    e("section", { className: "flex flex-col gap-3" },
      e("div", { className: "flex justify-between items-center" },
        e("h3", { className: "text-section-title font-section-title text-on-surface" }, "告警记录 (Alarms)"),
        e("button", { className: "text-primary font-body-bold text-caption" }, "查看全部")
      ),
      e("div", { className: "flex flex-col gap-2" },
        e("div", { className: "bg-white border border-outline-variant rounded-xl p-4 flex items-center gap-4" },
          e("div", { className: "w-12 h-12 rounded-full bg-error-container/30 flex items-center justify-center text-error" },
            e("span", { className: "material-symbols-outlined", style: { fontVariationSettings: "'FILL' 1" } }, "warning")
          ),
          e("div", { className: "flex-1" },
            e("div", { className: "flex justify-between items-start" },
              e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "仓储 A 区温度异常"),
              e("span", { className: "px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold" }, "待处理")
            ),
            e("p", { className: "text-caption font-caption text-on-surface-variant mt-0.5" },
              "当前: ", e("span", { className: "text-error font-bold" }, "9.2°C"), " (超温 +1.2°C)"
            ),
            e("span", { className: "text-caption font-caption text-outline mt-1 block" }, "今天 15:42")
          )
        ),
        ...[["前部冷机离线","已恢复正常连接","今天 12:15"],["门磁开启过久","门已关闭，温度回落中","昨天 18:30"]].map(([t,d,time]) =>
          e("div", { key: t, className: "bg-white border border-outline-variant rounded-xl p-4 flex items-center gap-4 opacity-75" },
            e("div", { className: "w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline" },
              e("span", { className: "material-symbols-outlined" }, "check_circle")
            ),
            e("div", { className: "flex-1" },
              e("div", { className: "flex justify-between items-start" },
                e("span", { className: "text-body-bold font-body-bold text-on-surface" }, t),
                e("span", { className: "px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold" }, "已处理")
              ),
              e("p", { className: "text-caption font-caption text-on-surface-variant mt-0.5" }, d),
              e("span", { className: "text-caption font-caption text-outline mt-1 block" }, time)
            )
          )
        )
      )
    ),
    e("button", { className: "w-full h-touch-target-min bg-primary text-on-primary font-body-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform" },
      e("span", { className: "material-symbols-outlined" }, "device_thermostat"), "立即校准传感器"
    )
  );
}
