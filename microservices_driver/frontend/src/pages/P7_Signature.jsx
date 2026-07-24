import React from "react";
export default function P7_Signature() {
  const canvasRef = React.useRef(null);
  const drawingRef = React.useRef(false);
  const e = React.createElement;

  const getPos = (evt, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return { x: (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left, y: (evt.touches ? evt.touches[0].clientY : evt.clientY) - rect.top };
  };
  const start = (evt) => { const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d"); ctx.beginPath(); ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#000318"; const p = getPos(evt, c); ctx.moveTo(p.x, p.y); drawingRef.current = true; };
  const draw = (evt) => { if (!drawingRef.current) return; const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d"); const p = getPos(evt, c); ctx.lineTo(p.x, p.y); ctx.stroke(); };
  const stop = () => { drawingRef.current = false; };
  const clear = () => { const c = canvasRef.current; if (!c) return; c.getContext("2d").clearRect(0, 0, c.width, c.height); };

  return e("div", { className: "safe-top safe-bottom px-container-margin max-w-lg mx-auto" },
    e("div", { className: "mb-6" },
      e("h2", { className: "text-section-title font-section-title mb-1" }, "签收确认 (POD)"),
      e("p", { className: "text-caption font-caption text-outline" }, "订单编号: TM-20231024-0092")
    ),
    e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-stack-gap" },
      e("div", { className: "flex justify-between items-start mb-3" },
        e("div", null, e("p", { className: "text-body-bold font-body-bold" }, "冷链冷藏货品"), e("p", { className: "text-caption font-caption text-on-surface-variant" }, "24 托盘 / 1,200kg")),
        e("div", { className: "px-3 py-1 bg-primary-container/10 rounded-full" }, e("span", { className: "text-caption font-caption text-primary" }, "Chilled"))
      ),
      e("div", { className: "flex items-center gap-2 text-primary font-body-bold" },
        e("span", { className: "material-symbols-outlined text-[18px]" }, "thermostat"),
        e("span", { className: "text-body-main font-body-main" }, "实时温度: 4.2°C")
      )
    ),
    e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-stack-gap" },
      e("div", { className: "flex items-center justify-between mb-4" },
        e("div", { className: "flex items-center gap-2" }, e("span", { className: "material-symbols-outlined text-primary" }, "photo_camera"), e("span", { className: "text-body-bold font-body-bold" }, "Site Photo Required")),
        e("span", { className: "text-caption font-caption text-error" }, "必填")
      ),
      e("div", { className: "grid grid-cols-2 gap-3" },
        e("button", { className: "aspect-square bg-surface-container border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center gap-2 active:scale-[0.98]" },
          e("span", { className: "material-symbols-outlined text-outline" }, "add_a_photo"),
          e("span", { className: "text-caption font-caption text-outline" }, "全景拍摄")
        ),
        e("div", { className: "aspect-square relative rounded-lg overflow-hidden border border-outline-variant" },
          e("div", { className: "absolute inset-0 bg-surface-container-high flex items-center justify-center" }, e("span", { className: "material-symbols-outlined text-outline/30 text-4xl" }, "image")),
          e("div", { className: "absolute bottom-0 w-full bg-primary/80 py-1 text-center" }, e("span", { className: "text-[10px] text-white font-caption" }, "货物入库照"))
        )
      )
    ),
    e("div", { className: "bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-stack-gap" },
      e("div", { className: "flex items-center justify-between mb-4" },
        e("div", { className: "flex items-center gap-2" }, e("span", { className: "material-symbols-outlined text-primary" }, "edit"), e("span", { className: "text-body-bold font-body-bold" }, "收货人签名")),
        e("button", { onClick: clear, className: "text-caption font-caption text-primary" }, "清除重签")
      ),
      e("div", { className: "signature-pad w-full h-[200px] border border-outline-variant rounded-lg flex items-center justify-center relative overflow-hidden bg-white" },
        e("p", { className: "text-surface-dim font-data-display select-none pointer-events-none opacity-40 absolute" }, "请在此区域手写签名"),
        e("canvas", { ref: canvasRef, className: "absolute inset-0 w-full h-full cursor-crosshair touch-none",
          onMouseDown: start, onMouseMove: draw, onMouseUp: stop, onMouseLeave: stop,
          onTouchStart: start, onTouchMove: draw, onTouchEnd: stop })
      ),
      e("div", { className: "mt-3 flex items-center gap-2 text-outline" },
        e("span", { className: "material-symbols-outlined text-[16px]" }, "info"),
        e("span", { className: "text-caption font-caption italic" }, "签名即代表确认货物及单据已核对无误")
      )
    ),
    e("label", { className: "flex items-center gap-3 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl mb-8 cursor-pointer active:bg-surface-container transition-colors" },
      e("input", { className: "h-6 w-6 rounded border-outline-variant text-primary focus:ring-primary", type: "checkbox" }),
      e("span", { className: "text-body-main font-body-main select-none" }, "Goods intact and quantity correct (货物完好且数量正确)")
    ),
    e("div", { className: "px-2 pb-8" },
      e("button", { className: "w-full h-touch-target-min bg-primary text-on-primary font-body-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform" },
        e("span", { className: "material-symbols-outlined" }, "check_circle"), "完成签收"
      )
    )
  );
}
