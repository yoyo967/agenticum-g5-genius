import { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface ExportOption {
  label: string;
  format: string;
  onClick: () => void | Promise<void>;
}

/**
 * Reusable dropdown export button for OS modules.
 * Pass an array of { label, format, onClick } options.
 */
export function ExportMenu({ options, label = 'Export' }: { options: ExportOption[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (opt: ExportOption) => {
    setExporting(opt.format);
    try {
      await opt.onClick();
    } finally {
      setExporting(null);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-outline text-[10px] py-1.5 px-3 flex items-center gap-1.5"
      >
        <Download size={11} />
        {label}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[140px] glass rounded-lg border border-white/10 py-1 shadow-xl">
          {options.map(opt => (
            <button
              key={opt.format}
              onClick={() => handleClick(opt)}
              disabled={exporting !== null}
              className="w-full text-left px-3 py-2 font-mono text-[10px] text-white/70 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
            >
              {exporting === opt.format ? (
                <span className="animate-spin w-3 h-3 border border-accent border-t-transparent rounded-full" />
              ) : (
                <span className="text-accent text-[8px] font-black uppercase tracking-widest">{opt.format}</span>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
