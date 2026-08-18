import { useEffect } from 'react';

export function Toast({ message, show, onHide, duration = 3000 }) {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onHide]);

  return (
    <div
      role="status"
      className={`fixed bottom-5 left-1/2 z-[70] w-[min(92%,440px)] -translate-x-1/2 rounded-xl bg-[#29231f] px-5 py-4 text-center text-sm text-white shadow-xl transition-transform duration-250 ${
        show ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
    >
      {message}
    </div>
  );
}
