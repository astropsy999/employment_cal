import { toggleIcon } from './checkBlockedDays';

export function updateDayCell(info, lockedDatesArr) {
  const date = info.date;

  const isDateLocked = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const formattedDate = `${day}.${month}.${year}`;
    return lockedDatesArr?.includes(formattedDate);
  };

  if (isDateLocked(date)) {
    const dayCell = info.el.querySelector('.fc-timegrid-col-frame');
    toggleIcon('unlock');

    const overlay = document.createElement('div');
    overlay.classList.add('locked-day-overlay');
    dayCell.insertAdjacentElement('afterBegin', overlay);
  } else {
    toggleIcon('lock');
  }
}

// Обработчик изменения lockedDatesArr

export function onLockedDatesArrChanged() {
  const lockedDatesArr = JSON.parse(localStorage.getItem('lockedDatesArray'));

  // Получаем все ячейки дней на календаре
  const dayCells = document.querySelectorAll('.fc-timegrid-col.fc-day');

  // Проходим по каждой ячейке и обновляем ее с помощью функции updateDayCell
  dayCells.forEach((el) => {
    // const info = /* Получить объект info для данной ячейки */;
    updateDayCell(info, lockedDatesArr);
  });
}

export function setDayCellDidMount(lockedDatesArr) {
  calendar?.setOption('dayCellDidMount', function (info) {
    const date = info.date;

    const isDateLocked = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      const formattedDate = `${day}.${month}.${year}`;
      return lockedDatesArr?.includes(formattedDate);
    };

    if (isDateLocked(date)) {
      const dayCell = info.el.querySelector('.fc-timegrid-col-frame');
      toggleIcon('unlock');

      const overlay = document.createElement('div');
      overlay.classList.add('locked-day-overlay');
      dayCell.insertAdjacentElement('afterBegin', overlay);
    } else {
      toggleIcon('lock');
    }
  });
}
