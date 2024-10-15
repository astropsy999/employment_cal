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