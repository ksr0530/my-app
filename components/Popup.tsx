import type { ReactNode } from "react";

type PopupProps = {
  title: string;
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
};

export default function Popup({
  title,
  children,
  open = true,
  onClose,
  footer,
}: PopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-8" role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <section className="w-full max-w-[360px] rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="popup-title" className="text-[17px] font-bold tracking-tight text-slate-900">{title}</h2>
          {onClose && (
            <button type="button" onClick={onClose} className="-mr-1 -mt-1 rounded-full p-1 text-3xl font-light leading-none text-slate-400 hover:bg-slate-100" aria-label="팝업 닫기">
              ×
            </button>
          )}
        </div>
        <div className="text-sm leading-6 text-slate-600">{children}</div>
        {footer && <div className="mt-5">{footer}</div>}
      </section>
    </div>
  );
}
