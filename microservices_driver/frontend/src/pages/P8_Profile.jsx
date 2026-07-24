import React from "react";
export default function P8_Profile() {
  const e = React.createElement;
  return e("div", { className: "safe-top safe-bottom px-container-margin min-h-screen max-w-lg mx-auto" },
    e("section", { className: "mt-6 mb-8" },
      e("div", { className: "bg-white border border-outline-variant rounded-xl p-6 relative overflow-hidden" },
        e("div", { className: "absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" }),
        e("div", { className: "flex flex-col items-center gap-6 relative z-10" },
          e("div", { className: "relative" },
            e("div", { className: "w-24 h-24 rounded-full border-4 border-surface shadow-sm bg-surface-container flex items-center justify-center" },
              e("span", { className: "material-symbols-outlined text-primary text-5xl" }, "person")
            ),
            e("div", { className: "absolute bottom-1 right-1 w-6 h-6 bg-secondary rounded-full border-2 border-white flex items-center justify-center" },
              e("span", { className: "material-symbols-outlined text-[14px] text-white", style: { fontVariationSettings: "'FILL' 1" } }, "verified")
            )
          ),
          e("div", { className: "text-center flex-1" },
            e("h2", { className: "text-data-display font-data-display text-on-surface mb-1" }, "张师傅"),
            e("div", { className: "flex flex-wrap justify-center gap-2 mt-3" },
              e("span", { className: "px-3 py-1 bg-surface-container rounded-full text-caption font-caption text-on-surface-variant border border-outline-variant" }, "工号: D8829"),
              e("span", { className: "px-3 py-1 bg-primary-container/10 rounded-full text-caption font-caption text-primary border border-primary/20" }, "车牌: 京 A·88888")
            )
          )
        ),
        e("div", { className: "grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-outline-variant/50" },
          e("div", { className: "text-center" }, e("div", { className: "text-data-display font-data-display text-primary" }, "128"), e("div", { className: "text-caption font-caption text-outline" }, "本月运单")),
          e("div", { className: "text-center border-x border-outline-variant/50" }, e("div", { className: "text-data-display font-data-display text-primary" }, "4.9"), e("div", { className: "text-caption font-caption text-outline" }, "综合评分")),
          e("div", { className: "text-center" }, e("div", { className: "text-data-display font-data-display text-primary" }, "15k"), e("div", { className: "text-caption font-caption text-outline" }, "安全行驶(km)"))
        )
      )
    ),
    e("section", { className: "space-y-4" },
      e("h3", { className: "text-section-title font-section-title text-on-surface-variant px-1" }, "服务中心"),
      e("div", { className: "bg-white border border-outline-variant rounded-xl divide-y divide-outline-variant/30 overflow-hidden" },
        ...[
          ["assignment","我的任务","bg-primary-container/10","text-primary"],
          ["thermostat","温度记录","bg-secondary-container/20","text-secondary"],
          ["warning","异常历史","bg-tertiary-fixed-dim/30","text-tertiary"]
        ].map(([icon,label,bg,clr]) =>
          e("button", { key: label, className: "w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container" },
            e("div", { className: "flex items-center gap-4" },
              e("div", { className: "w-10 h-10 rounded-lg " + bg + " flex items-center justify-center " + clr }, e("span", { className: "material-symbols-outlined" }, icon)),
              e("span", { className: "text-body-bold font-body-bold text-on-surface" }, label)
            ),
            e("span", { className: "material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" }, "chevron_right")
          )
        )
      ),
      e("h3", { className: "text-section-title font-section-title text-on-surface-variant px-1 pt-4" }, "系统设置"),
      e("div", { className: "bg-white border border-outline-variant rounded-xl divide-y divide-outline-variant/30 overflow-hidden" },
        e("button", { className: "w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group active:bg-surface-container" },
          e("div", { className: "flex items-center gap-4" },
            e("div", { className: "w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant" }, e("span", { className: "material-symbols-outlined" }, "settings")),
            e("span", { className: "text-body-bold font-body-bold text-on-surface" }, "设置")
          ),
          e("span", { className: "material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" }, "chevron_right")
        ),
        e("button", { className: "w-full flex items-center justify-between p-4 hover:bg-error-container/10 transition-colors group active:bg-error-container/20" },
          e("div", { className: "flex items-center gap-4" },
            e("div", { className: "w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center text-error" }, e("span", { className: "material-symbols-outlined" }, "logout")),
            e("span", { className: "text-body-bold font-body-bold text-error" }, "退出登录")
          ),
          e("span", { className: "material-symbols-outlined text-error/40" }, "chevron_right")
        )
      )
    ),
    e("footer", { className: "mt-8 mb-4 text-center" },
      e("p", { className: "text-caption font-caption text-outline" }, "TMS Driver v2.4.1 (Stable Build)")
    )
  );
}
