import { Calendar, EventApi, EventClickArg } from "@fullcalendar/core";
import { formatDate, getCurrentWeekDates } from "./datesUtils";
import { setLocalStorageItem } from "./localStorageUtils";

    /***
    * Проверяет блокировку для всех дней недели.
    * @param startDate Начальная дата недели.
    * @param lockedDatesArr Массив заблокированных дат в формате 'DD.MM.YYYY'.
    * @returns Объект, где ключи - даты, а значения - статус блокировки (true/false).
    */
export const checkWeekLockStatus = (startDate: Date, lockedDatesArr: string[]): boolean => {
    const weekDates = getCurrentWeekDates(formatDate(startDate));
    const lockStatus: Record<string, boolean> = {};

    weekDates.forEach(dateStr => {
      lockStatus[dateStr] = lockedDatesArr.includes(dateStr);
    });

    // Опционально: обновляем общее состояние недели в localStorage
    const isAnyDayLocked = weekDates.some(date => lockedDatesArr.includes(date));
    setLocalStorageItem('isWeekLocked', isAnyDayLocked);

    // return {lockStatus, isAnyDayLocked};
    return isAnyDayLocked;
  };

     /**
     * Собирает все выбранные даты из чекбоксов внутри контейнера.
     * @param container - HTML-элемент контейнера с чекбоксами.
     * @returns Массив выбранных дат в формате 'DD.MM.YYYY'.
     */
  export const getSelectedDates = (container: HTMLElement): string[] => {
        const checkboxes = container?.querySelectorAll<HTMLInputElement>('.form-check-input');
        checkboxes.forEach((cb, index) => {
          console.log(`Checkbox ${index}: value=${cb.value}, checked=${cb.checked}`);
        });
        const selectedDates = Array.from(checkboxes)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => checkbox.value);

        return selectedDates;
      };

/**
     * Фильтрует выбранные даты и возвращает соответствующие ключи.
     * @param selectedDates - Массив выбранных дат в формате 'DD.MM.YYYY'.
     * @param arr - Массив объектов с ключами и датами.
     * @returns Объект с массивами lockingDatesArr и weekToBlockIDs.
     */
export const getKeysForSelectedDates = (selectedDates: string[], arr: Array<{ [key: string]: string }>) => {
    console.log('selectedDates: ', selectedDates);
    const lockingDatesArr: string[] = [];
    const weekToBlockIDsArr: string[] = [];

    for (const obj of arr) {
      const key = Object.keys(obj)[0];
      const date = obj[key];

      if (selectedDates.includes(date)) {
        weekToBlockIDsArr.push(key);
        lockingDatesArr.push(date);
      }
    }

    return { lockingDatesArr, weekToBlockIDs: weekToBlockIDsArr };
  };

/**
 * Получает события, попадающие в выбранные даты.
 * @param calendar Экземпляр календаря.
 * @param selectedDatesArr Массив выбранных дат в формате 'YYYY-MM-DD'.
 * @returns Массив событий, попадающих в выбранные даты.
 */
export function getEventsInSelectedDates(
  calendar: Calendar,
  selectedDatesArr: string[]
): EventApi[] {
  if (selectedDatesArr.length === 0) return [];

  // Получаем все события из календаря
  const allEvents: EventApi[] = calendar.getEvents();

  // Фильтруем события, которые попадают в выбранные даты
  const eventsInSelectedDates: EventApi[] = allEvents.filter((event) => {
    if (!event.start) return false;
    const eventDateStr = formatDate(event.start); // Преобразуем дату события в 'YYYY-MM-DD'
    return selectedDatesArr.includes(eventDateStr);
  });

  return eventsInSelectedDates;
}

/**
 * Проверяет, есть ли несогласованные события в выбранном интервале дат.
 * @param calendar Экземпляр календаря.
 * @param selectedDatesArr Массив выбранных дат в формате 'YYYY-MM-DD'.
 * @returns Возвращает true, если есть хотя бы одно несогласованное событие, иначе false.
 */
export function hasUnSubmittedEvents(
  calendar: Calendar,
  selectedDatesArr: string[]
): boolean {
  const eventsInSelectedDates = getEventsInSelectedDates(calendar, selectedDatesArr);

  // Проверяем, есть ли среди отфильтрованных событий несогласованные
  const hasUnsubmitted = eventsInSelectedDates.some(
    (event) => event.extendedProps.isApproved === ''
  );

  return hasUnsubmitted;
}

export function toggleYesNoButtonsState(disable: boolean) {
  const lockActionBtn = document.querySelector(
    '.lock-action',
  ) as HTMLButtonElement | null;
  const unlockActionBtn = document.querySelector(
    '.unlock-action',
  ) as HTMLButtonElement | null;
  const cancelActionBtn = document.querySelector(
    '.cancel-action',
  ) as HTMLButtonElement | null;

  if (disable) {
    lockActionBtn && lockActionBtn.setAttribute('disabled', 'disabled');
    unlockActionBtn && unlockActionBtn.setAttribute('disabled', 'disabled');
    cancelActionBtn && cancelActionBtn.setAttribute('disabled', 'disabled');
  } else {
    lockActionBtn && lockActionBtn.removeAttribute('disabled');
    unlockActionBtn && unlockActionBtn.removeAttribute('disabled');
    cancelActionBtn && cancelActionBtn.removeAttribute('disabled');
  }
}


export function lockCheckboxesState(state: boolean) {
  const dailyUnBlockContainer = document.querySelector('.dailyUnBlockContainer') as HTMLElement;
  if (!dailyUnBlockContainer) return;

  const checkboxes = dailyUnBlockContainer.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    const checkboxElement = checkbox as HTMLInputElement;
   
    if (state) {
      // Если дата чекбокса меньше или равна сегодняшней, блокируем его
      checkboxElement.disabled = true;
    } else {
      // Иначе разблокируем
      checkboxElement.disabled = false;
    }
  });
}