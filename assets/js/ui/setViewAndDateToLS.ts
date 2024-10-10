import { setLocalStorageItem } from './../utils/localStorageUtils';
import { Calendar } from "@fullcalendar/core";

/**
 * Сохранение даты и вида отображения календаря при нажатии на кнопку Обновить
 * @param calendar - экземпляр календаря FullCalendar
 */
export const setViewAndDateToLS = (calendar: Calendar): void => {
  const currentViewType = calendar.view.type;
  let dateMs: number;

  switch (currentViewType) {
    case 'timeGridWeek':
    case 'dayGridMonth':
    case 'timeGridDay':
    case 'listWeek':
    case 'listYear':
      // Получаем активную дату начала видимого диапазона
      dateMs = calendar.view.activeStart.getTime();

      // Определяем ключи для сохранения в зависимости от типа вида
      let dateKey: string;
      switch (currentViewType) {
        case 'timeGridWeek':
          dateKey = 'startWeekDateMs';
          break;
        case 'dayGridMonth':
          dateKey = 'startMonthDateMs';
          break;
        case 'timeGridDay':
          dateKey = 'startDayDateMs';
          break;
        case 'listWeek':
          dateKey = 'startListWeekDateMs';
          break;
        case 'listYear':
          dateKey = 'startListYearDateMs';
          break;
        default:
          dateKey = 'currentDateMs';
      }

      // Сохраняем данные в localStorage
      setLocalStorageItem(dateKey, dateMs.toString());
      setLocalStorageItem('fcDefaultView', currentViewType);

      // Перезагрузка страницы, если необходимо
      // location.reload();
      break;

    default:
      console.warn(`Неизвестный тип вида календаря: ${currentViewType}`);
  }
};
