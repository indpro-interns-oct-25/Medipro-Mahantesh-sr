import { useEffect } from 'react';

export function Notification({ message, type = 'success', onClose, duration = 1500 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-gradient-to-r from-green-500 to-green-600 border-green-400',
    error: 'bg-gradient-to-r from-red-500 to-red-600 border-red-400',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400',
  };

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`fixed top-6 right-6 z-50 ${styles[type] || styles.info} text-white px-5 py-4 rounded-xl shadow-large border flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in-right`}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[type] || icons.info}
      </div>
      <span className="flex-1 text-sm font-medium leading-relaxed">{message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/90 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all duration-200"
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function useNotification(setNotification) {
  return (message, type = 'success', duration = 3000) => {
    setNotification({ message, type, duration });
    setTimeout(() => setNotification(null), duration + 100);
  };
}

