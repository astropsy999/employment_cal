import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

/**
 * Функция для отображения Toast уведомлений
 * @param message - текст сообщения
 * @param type - тип сообщения ('error', 'success', и т.д.)
 */
export const showToast = (message: string, type: 'error' | 'success' = 'error') => {
  
    Toastify({
      text: message,
      duration: 3000, 
      close: true, 
      gravity: "bottom", 
      position: "center",
      style: {
        background: type === 'error' ? 'var(--falcon-danger)' : 'var(--falcon-success)',
      }, 
      stopOnFocus: true, // Останавливать таймер при наведении
    }).showToast();
  };