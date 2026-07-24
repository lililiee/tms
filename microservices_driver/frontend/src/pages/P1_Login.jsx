import React from "react";
export default function P1_Login({ onNavigate }) {
  const [tab, setTab] = React.useState("sms");
  const e = React.createElement;

  return e("div", { className: "w-full max-w-md mx-auto px-container-margin pt-[80px] pb-10 flex flex-col min-h-screen items-center" },
    e("div", { className: "w-full flex flex-col items-center mb-10 mt-6" },
      e("div", { className: "w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden" },
        e("span", { className: "material-symbols-outlined text-primary text-5xl relative z-10", style: { fontVariationSettings: "'FILL' 1" } }, "ac_unit")
      ),
      e("h2", { className: "text-data-display font-data-display text-on-surface" }, "欢迎回来"),
      e("p", { className: "text-caption font-caption text-on-surface-variant mt-1" }, "请选择您的登录方式")
    ),
    e("div", { className: "w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-6" },
      e("div", { className: "flex w-full mb-8 border-b border-outline-variant" },
        e("button", { className: "flex-1 py-3 text-section-title font-section-title " + (tab === "sms" ? "active-tab" : "text-on-surface-variant"), onClick: () => setTab("sms") }, "验证码登录"),
        e("button", { className: "flex-1 py-3 text-section-title font-section-title " + (tab === "pw" ? "active-tab" : "text-on-surface-variant"), onClick: () => setTab("pw") }, "密码登录")
      ),
      tab === "sms" ? e("div", { className: "space-y-stack-gap" },
        e("div", null,
          e("label", { className: "text-caption font-caption text-outline mb-1 block" }, "手机号"),
          e("div", { className: "flex items-center border border-outline-variant rounded-lg bg-surface-container-low px-4 h-touch-target-min focus-within:border-primary transition-colors" },
            e("span", { className: "text-body-main mr-2" }, "+86"),
            e("input", { className: "bg-transparent border-none focus:ring-0 w-full text-body-main placeholder:text-outline/50 outline-none", placeholder: "请输入手机号码", type: "tel" })
          )
        ),
        e("div", null,
          e("label", { className: "text-caption font-caption text-outline mb-1 block" }, "验证码"),
          e("div", { className: "flex items-center gap-2" },
            e("div", { className: "flex flex-1 items-center border border-outline-variant rounded-lg bg-surface-container-low px-4 h-touch-target-min focus-within:border-primary transition-colors" },
              e("input", { className: "bg-transparent border-none focus:ring-0 w-full text-body-main placeholder:text-outline/50 outline-none", placeholder: "6位验证码" })
            ),
            e("button", { className: "h-touch-target-min px-4 text-primary font-body-bold text-caption border border-primary/20 rounded-lg whitespace-nowrap active:opacity-60 transition-opacity" }, "获取验证码")
          )
        )
      ) : e("div", { className: "space-y-stack-gap" },
        e("div", null,
          e("label", { className: "text-caption font-caption text-outline mb-1 block" }, "司机ID / 手机号"),
          e("div", { className: "flex items-center border border-outline-variant rounded-lg bg-surface-container-low px-4 h-touch-target-min focus-within:border-primary transition-colors" },
            e("input", { className: "bg-transparent border-none focus:ring-0 w-full text-body-main placeholder:text-outline/50 outline-none", placeholder: "请输入司机ID" })
          )
        ),
        e("div", null,
          e("label", { className: "text-caption font-caption text-outline mb-1 block" }, "密码"),
          e("div", { className: "flex items-center border border-outline-variant rounded-lg bg-surface-container-low px-4 h-touch-target-min focus-within:border-primary transition-colors" },
            e("input", { className: "bg-transparent border-none focus:ring-0 w-full text-body-main placeholder:text-outline/50 outline-none", placeholder: "请输入登录密码", type: "password" }),
            e("span", { className: "material-symbols-outlined text-outline cursor-pointer" }, "visibility")
          )
        )
      ),
      e("div", { className: "mt-10 space-y-4" },
        e("button", { onClick: () => onNavigate("dashboard"), className: "w-full h-touch-target-min bg-primary text-on-primary font-body-bold rounded-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2" }, "登录"),
        e("div", { className: "flex justify-between px-1" },
          e("label", { className: "flex items-center gap-2 cursor-pointer" },
            e("input", { className: "rounded border-outline-variant text-primary focus:ring-primary w-4 h-4", type: "checkbox" }),
            e("span", { className: "text-caption text-on-surface-variant" }, "记住我")
          ),
          e("a", { className: "text-caption text-primary font-body-bold cursor-pointer" }, "遇到问题?")
        )
      )
    ),
    e("footer", { className: "mt-auto py-8 flex flex-col items-center gap-4" },
      e("div", { className: "flex items-center gap-2 text-outline/30" },
        e("div", { className: "h-[1px] w-12 bg-outline-variant" }),
        e("span", { className: "text-caption font-caption" }, "仅司机师傅使用"),
        e("div", { className: "h-[1px] w-12 bg-outline-variant" })
      ),
      e("p", { className: "text-[12px] text-outline text-center leading-relaxed" }, "登录即代表您已阅读并同意", e("br"), e("a", { className: "text-on-surface-variant underline cursor-pointer" }, "《司机服务协议》"), " 与 ", e("a", { className: "text-on-surface-variant underline cursor-pointer" }, "《隐私权政策》"))
    ),
    e("div", { className: "fixed bottom-[-100px] left-[-100px] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" }),
    e("div", { className: "fixed top-[10%] right-[-50px] w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl -z-10" })
  );
}
