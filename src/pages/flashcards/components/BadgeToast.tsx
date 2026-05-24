import { useEffect, useState } from 'react';
import type { Badge } from '@/hooks/useBadges';

interface BadgeToastProps {
  badge: Badge | null;
  onDismiss: () => void;
}

export default function BadgeToast({ badge, onDismiss }: BadgeToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (badge) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDismiss, 400);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [badge, onDismiss]);

  if (!badge) return null;

  return (
    <div
      className={`fixed top-24 right-4 md:right-8 z-[60] transition-all duration-500 ${
        show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className={`flex items-start gap-4 px-5 py-4 rounded-2xl border-2 ${badge.bgColor} ${badge.borderColor} max-w-sm`}>
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white border ${badge.borderColor} flex-shrink-0`}>
          <i className={`${badge.icon} ${badge.iconColor} text-2xl`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Conquista Desbloqueada</p>
          <h4 className={`text-sm font-bold ${badge.color}`}>{badge.name}</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
        </div>
        <button
          onClick={() => { setShow(false); setTimeout(onDismiss, 400); }}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex-shrink-0"
        >
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>
    </div>
  );
}