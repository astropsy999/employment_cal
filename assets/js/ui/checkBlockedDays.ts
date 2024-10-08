// import locking
/**
 * В недельном отображении при переключении диапазона дат,
 * функция проверяет наличие заблокированных событий на странице и меняет функционал кнопки блокировки
 * @param {*} calendar
 */

export const addBlockOverlays = () => {
  const dayCells = [...document.querySelectorAll('.fc-timegrid-col-frame')];
  // toggleIcon('unlock');

  const calendarGrid = document.querySelector('.fc-daygrid-body'); // Выберите контейнер сетки месяца
  // if (!calendarGrid) return; // Проверка наличия сетки

  // Добавляем слой для заблокированных дней

  dayCells.forEach((el) => {
    const hasLockedClass = el.querySelector('.locked-day-overlay');
    const lockBtn = document.querySelector('.lockBtn');
    if (!hasLockedClass) {
      const idx = dayCells.indexOf(el);
      if (idx !== 0) {
        const overlay = document.createElement('div');
        overlay.classList.add('locked-day-overlay');

        const label = document.createElement('span');
        label.textContent = 'Заблокировано';
        label.classList.add('overlay-label');

        overlay.appendChild(label);

        el.insertAdjacentElement('afterbegin', overlay);
      }

      lockBtn?.removeAttribute('title');
      lockBtn?.setAttribute('title', 'Разблокировать неделю');
    }
  });
};

export const removeOverlays = () => {
  const dayCells = [...document.querySelectorAll('.fc-timegrid-col-frame')];
  const lockBtn = document.querySelector('.lockBtn');

  dayCells.forEach((el) => {
    const idx = dayCells.indexOf(el);
    const overlayToRemove = el.querySelector('.locked-day-overlay');
    const labelToRemove = overlayToRemove?.querySelector('.overlay-label');
    if (idx !== 0) {
      overlayToRemove?.classList.remove('locked-day-overlay');
      labelToRemove?.remove();
    }
  });

  lockBtn?.removeAttribute('title');
  lockBtn?.setAttribute('title', 'Заблокировать неделю');
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
