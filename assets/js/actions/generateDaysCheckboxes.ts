import { EventApi } from '@fullcalendar/core';
import { formatDate, formatDayNameDate } from '../utils/datesUtils';
import { getLocalStorageItem } from '../utils/localStorageUtils';


interface UniqueDate {
  date: Date;
  events?: EventApi[];
}

interface UniqueDates {
  [key: string]: UniqueDate;
}

/**
 * Type Guard для определения, что массив содержит EventApi
 * @param source - Исходный массив.
 * @returns true, если массив содержит только объекты EventApi.
 */
function isEventApiArray(source: any[]): source is EventApi[] {
  return (
    source.length > 0 &&
    typeof source[0] === 'object' &&
    source[0] !== null &&
    'start' in source[0]
  );
}

// Type Guard для определения, что массив содержит Date
function isDateArray(source: any[]): source is Date[] {
  return source.length > 0 && source[0] instanceof Date;
}

/**
 * Генерирует чекбоксы для уникальных дат.
 * @param element - HTML-элемент контейнера для чекбоксов.
 * @param generateSource - Массив событий (EventApi[]) или дат (Date[]).
 */
export const generateDaysCheckboxes = (
  element: HTMLElement,
  generateSource: EventApi[] | Date[],
) => {
  element.innerHTML = ''; // Очищаем контейнер
  console.log('generateSource: ', generateSource);


  // Создаем объект для хранения уникальных дат
  const uniqueDates: UniqueDates = {};

  if (generateSource.length === 0) return;

  if (isEventApiArray(generateSource)) {
    // Обработка массива событий EventApi[]
    generateSource.forEach((event: EventApi) => {
      const eventStart = event.start; // Тип: Date | null
      if (!eventStart) return; // Пропустить, если нет даты начала

      const dateStr = formatDate(eventStart);
      if (!uniqueDates[dateStr]) {
        uniqueDates[dateStr] = {
          date: new Date(eventStart),
          events: [],
        };
      }
      uniqueDates[dateStr].events!.push(event);
    });
  } else if (isDateArray(generateSource)) {
    // Обработка массива дат Date[]
    generateSource.forEach((date: Date) => {
      const dateStr = formatDate(date);
      if (!uniqueDates[dateStr]) {
        uniqueDates[dateStr] = {
          date: date,
          // Нет событий
        };
      }
    });
  }

  const lockedDatesArray = getLocalStorageItem('lockedDatesArray')
  const isLocked = getLocalStorageItem('isWeekLocked');

  // Создаем чекбоксы для каждой уникальной даты
  Object.keys(uniqueDates).forEach((dateStr) => {
    console.log('dateStr: ', dateStr);
    const uniqueDate = uniqueDates[dateStr];
    const formattedDate = formatDayNameDate(uniqueDate.date);

    const div = document.createElement('div');
    div.classList.add('form-check');

    const checkbox = document.createElement('input');
    checkbox.classList.add('form-check-input');
    checkbox.type = 'checkbox';
    checkbox.value = dateStr;
    checkbox.id = `checkbox-${dateStr}`;
    isLocked ? checkbox.checked = lockedDatesArray?.includes(dateStr) : checkbox.checked = true;

    const label = document.createElement('label');
    label.classList.add('form-check-label');
    label.htmlFor = `checkbox-${dateStr}`;
    label.textContent = `${formattedDate}`;

    div.appendChild(checkbox);
    div.appendChild(label);

    element.appendChild(div);
  });
};
