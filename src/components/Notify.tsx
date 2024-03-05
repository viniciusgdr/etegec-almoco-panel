import { toast } from 'react-toastify';

export const Notify = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
  toast[type](message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    className: 'z-[999999]',
  });
};