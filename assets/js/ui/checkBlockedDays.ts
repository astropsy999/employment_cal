// import locking
/**
 * В недельном отображении при переключении диапазона дат,
 * функция проверяет наличие заблокированных событий на странице и меняет функционал кнопки блокировки
 * @param {*} calendar
 */

import { Calendar } from "@fullcalendar/core";
import { getLocalStorageItem } from "../utils/localStorageUtils";

export const addBlockOverlays = () => {

  // Remove existing overlays to prevent duplicates
  const existingOverlays = document.querySelectorAll('.locked-day-overlay');
  existingOverlays.forEach((overlay) => {
    overlay.remove();
  });

  const dayCells = [...document.querySelectorAll('.fc-timegrid-col-frame')];

  const lockedDatesArray = getLocalStorageItem('lockedDatesArray')?.map((date: string) => {
    return date.split('.').reverse().join('-');
  });


  dayCells.forEach((el) => {
    // Get the parent td element
    const tdElement = el.closest('td[role="gridcell"]');

    // Get the date from data-date attribute
    const dateStr = tdElement?.getAttribute('data-date');

    if (dateStr && lockedDatesArray?.includes(dateStr)) {
      // Add overlay to this day
      const overlay = document.createElement('div');
      overlay.classList.add('locked-day-overlay');

      const label = document.createElement('span');
      label.textContent = 'Заблокировано';
      label.classList.add('overlay-label');

      overlay.appendChild(label);

      el.insertAdjacentElement('afterbegin', overlay);
    }
  });
  
  const lockBtn = document.querySelector('.lockBtn');
  lockBtn?.removeAttribute('title');
  lockBtn?.setAttribute('title', 'Разблокировать занятость');
};


// export const removeOverlays = () => {
//   const dayCells = [...document.querySelectorAll('.fc-timegrid-col-frame')];
//   const lockBtn = document.querySelector('.lockBtn');

//   dayCells.forEach((el) => {
//     const idx = dayCells.indexOf(el);
//     const overlayToRemove = el.querySelector('.locked-day-overlay');
//     const labelToRemove = overlayToRemove?.querySelector('.overlay-label');
//     if (idx !== 0) {
//       overlayToRemove?.classList.remove('locked-day-overlay');
//       labelToRemove?.remove();
//     }
//   });

//   lockBtn?.removeAttribute('title');
//   lockBtn?.setAttribute('title', 'Заблокировать неделю');
// };

export const removeOverlays = () => {
  const overlays = document.querySelectorAll('.locked-day-overlay');

  overlays.forEach((overlay) => {
    overlay.remove();
  });

  const lockBtn = document.querySelector('.lockBtn');

  lockBtn?.removeAttribute('title');
  lockBtn?.setAttribute('title', 'Блокировать занятость');
};

export function toggleIcon(action: 'lock' | 'unlock') {
  const button = document.getElementById('lockBtn');
  const addTaskBtn = document.querySelector('#addTaskBtn');
  if (button) {
    const icon = button.querySelector('i');
    if (icon) {
      // Удаляем текущую иконку
      icon.remove();

      // Создаем новую иконку
      const newIcon = document.createElement('i');

      // Определяем нужную иконку и цвет в зависимости от значения параметра "action"
      if (action === 'unlock') {
        newIcon.classList.add('bi', 'bi-lock-fill', 'text-danger');
        addTaskBtn!.setAttribute('disabled', 'disabled');
      } else {
        newIcon.classList.add('bi', 'bi-unlock-fill', 'text-success');
        // Добавляем красный цвет для состояния "lock"
        addTaskBtn!.removeAttribute('disabled');
      }

      // Добавляем новую иконку на кнопку
      button.appendChild(newIcon);
    }
  }
}
