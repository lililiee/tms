import React from "react";
export default function P6_ExceptionReport({ onNavigate }) {
  const [selected, setSelected] = React.useState(null);
  const e = React.createElement;
  const types = [
    { id: "temp", icon: "thermostat", label: "温度过高", color: "text-error" },
    { id: "delay", icon: "schedule", label: "运输延迟", color: "text-tertiary" },
    { id: "damage", icon: "inventory_2", label: "货物破损", color: "text-primary" },
    { id: "geofence", icon: "fence", label: "电子围栏", color: "text-secondary" },
    { id: "other", icon: "more_horiz", label: "其他异常", color: "text-on-surface-variant" },
  ];

  return e("div", { className: "min-h-screen pb-[120px] max-w-lg mx-auto" },
    e("header", { className: "fixed top-0 w-full z-50 h-nav-bar-height bg-surface border-b border-outline-variant flex justify-between items-center px-container-margin" },
      e("div", { className: "flex items-center" },
        e("button", { onClick: () => onNavigate("dashboard"), className: "w-[48px] h-[48px] flex items-center justify-center text-on-surface" },
          e("span", { className: "material-symbols-outlined" }, "arrow_back")
        ),
        e("h1", { className: "text-nav-title font-nav-title text-primary ml-2" }, "异常上报")
      ),
      e("div", { className: "flex items-center" },
        e("span", { className: "material-symbols-outlined text-on-surface-variant" }, "history")
      )
    ),
    e("main", { className: "pt-[64px] px-container-margin space-y-6" },
      e("section", null,
        e("h2", { className: "text-section-title font-section-title mb-3" }, "异常类型"),
        e("div", { className: "grid grid-cols-2 gap-3" },
          ...types.map((type) => {
            const isSel = selected === type.id;
            const isFull = type.id === "other";
            return e("button", { key: type.id, onClick: () => setSelected(type.id),
              className: "flex flex-col items-center justify-center p-4 rounded-xl bg-white border transition-all active:scale-95 " +
                (isFull ? "col-span-2 flex-row gap-2" : "") + " " +
                (isSel ? "border-primary bg-primary-fixed/20" : "border-outline-variant") },
              e("span", { className: "material-symbols-outlined " + (isFull ? "mr-2" : "mb-2") + " text-3xl " + type.color }, type.icon),
              e("span", { className: "text-caption font-body-bold" }, type.label)
            );
          })
        )
      ),
      e("section", null,
        e("h2", { className: "text-section-title font-section-title mb-3" }, "详情描述"),
        e("div", { className: "relative bg-white border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary transition-colors" },
          e("textarea", { className: "w-full h-32 p-4 text-body-main border-none focus:ring-0 placeholder:text-outline bg-transparent outline-none resize-none", placeholder: "请详细描述异常情况，如：具体时间、地点及初步原因..." }),
          e("div", { className: "flex justify-between items-center px-4 py-2 border-t border-outline-variant/30" },
            e("span", { className: "text-caption text-outline" }, "0 / 200"),
            e("button", { className: "flex items-center text-primary active:opacity-60 transition-opacity" },
              e("span", { className: "material-symbols-outlined mr-1" }, "mic"),
              e("span", { className: "text-caption font-body-bold" }, "语音输入")
            )
          )
        )
      ),
      e("section", null,
        e("div", { className: "flex justify-between items-end mb-3" },
          e("h2", { className: "text-section-title font-section-title" }, "现场照片"),
          e("span", { className: "text-caption text-outline" }, "最多上传9张")
        ),
        e("div", { className: "grid grid-cols-3 gap-3" },
          e("button", { className: "aspect-square flex flex-col items-center justify-center bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl active:bg-surface-container-high transition-colors" },
            e("span", { className: "material-symbols-outlined text-outline text-3xl" }, "add_a_photo"),
            e("span", { className: "text-caption text-outline mt-1 font-caption" }, "拍照/上传")
          ),
          ...[1,2,3,4,5].map((i) =>
            e("div", { key: i, className: "aspect-square bg-surface-container-high rounded-xl flex items-center justify-center border border-outline-variant/20" },
              e("span", { className: "material-symbols-outlined text-outline/30 text-3xl" }, "image")
            )
          )
        )
      )
    ),
    e("div", { className: "fixed bottom-0 left-0 w-full p-4 bg-surface border-t border-outline-variant z-50" },
      e("div", { className: "max-w-lg mx-auto" },
        e("button", { className: "w-full h-[48px] bg-primary text-white font-body-bold rounded-xl active:scale-[0.98] transition-transform" }, "上报调度"),
        e("p", { className: "text-center text-caption text-on-surface-variant mt-3 flex items-center justify-center" },
          e("span", { className: "material-symbols-outlined text-[14px] mr-1" }, "info"), "异常上报后，调度中心将在5分钟内响应"
        )
      )
    )
  );
}
