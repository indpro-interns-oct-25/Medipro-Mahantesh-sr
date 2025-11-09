import { useEffect } from 'react';

export function Notification({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in`}>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 font-bold text-lg leading-none"
        aria-label="Close"
      >
        ×
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

