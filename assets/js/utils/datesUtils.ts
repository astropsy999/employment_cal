/**
 * Возвращает массив всех дат между startDate (включительно) и endDate (исключительно).
 * @param startDate Начальная дата.
 * @param endDate Конечная дата.
 * @returns Массив объектов Date.
 */
export function getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);
  
    // Убедитесь, что endDate исключается из диапазона
    while (current < endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  
    return dates;
  }
  
  /**
   * Форматирует объект Date в строку формата 'dd.mm.yyyy'.
   * @param date - Объект Date для форматирования.
   * @returns Строка, представляющая отформатированную дату.
   */
  export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
  
    return `${day}.${month}.${year}`;
  }
  
  /**
   * Форматирует объект Date в строку с кратким названием дня недели и номером дня.
   * Пример: 'Пн 01' (для понедельника, первого числа месяца).
   * @param date - Объект Date для форматирования.
   * @returns Строка в формате 'Ддд дд', где 'Ддд' - краткое название дня недели на русском.
   */
  export function formatDayNameDate(date: Date): string {
    // Получаем краткое название дня недели на русском языке
    const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
  
    // Получаем номер дня месяца с ведущим нулем
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${dayName} ${day}`;
  }
  
  /**
   * Конвертирует строку даты из формата 'dd.mm.yyyy' в 'yyyy-mm-dd' (ISO формат).
   * @param dateString - Строка, представляющая дату в формате 'dd.mm.yyyy'.
   * @returns Строка, представляющая дату в формате 'yyyy-mm-dd'.
   */
  export function convertToISODate(dateString: string): string {
    const parts = dateString.split('.');
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
  
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Вычитает три часа из заданной даты.
   * @param date - Объект Date, таймстамп или строка даты.
   * @returns Новый объект Date, представляющий дату минус три часа.
   */
  export const minusThreeHours = (date: string | number | Date): Date => {
    const d = new Date(date);
    return new Date(d.getTime() - 3 * 60 * 60 * 1000);
  };
  
  /**
   * Добавляет ведущий ноль к числу, если оно меньше 10.
   * @param datePart - Число для форматирования.
   * @returns Строка с ведущим нулем, если число меньше 10.
   */
  export const addZeroBefore = (datePart: number): string => {
    return String(datePart).padStart(2, '0');
  };
  
  /**
   * Преобразует объект Date в строку формата 'dd.mm.yyyy hh:mm', подходящую для сохранения в базу данных.
   * @param dateTime - Объект Date для преобразования.
   * @returns Строка, представляющая отформатированные дату и время.
   */
  export const transformDateTime = (dateTime: Date): string => {
    const day = addZeroBefore(dateTime.getDate());
    const month = addZeroBefore(dateTime.getMonth() + 1);
    const year = dateTime.getFullYear(); // Год не требует ведущего нуля
    const hours = addZeroBefore(dateTime.getHours());
    const mins = addZeroBefore(dateTime.getMinutes());
  
    return `${day}.${month}.${year} ${hours}:${mins}`;
  };
  
  
  // Функция для преобразования даты в формат, подходящий для создания объекта Date
  export function convertDate(dateString: string) {
    let parts = dateString.split(' ');
    let dateParts = parts[0].split('.');
    let timeParts = parts[1].split(':');
    return new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0]),
      parseInt(timeParts[0]),
      parseInt(timeParts[1]),
    );
  }

/**
 * Парсит строку даты в формате 'DD.MM.YYYY' и возвращает объект Date.
 * @param dateStr - Строка даты в формате 'DD.MM.YYYY'.
 * @returns Объект Date или null, если строка некорректна.
 */
export function parseDateString(dateStr: string): Date | null {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Месяцы в Date начинаются с 0
  const year = parseInt(parts[2], 10);

  if (
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 0 ||
    month > 11
  ) {
    return null;
  }

  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? null : date;
}

  /**
     * Возвращает массив дат текущей недели, начиная с startDate.
     * @param startDate - Строка начальной даты в формате 'DD.MM.YYYY'.
     * @returns Массив строковых дат в формате 'DD.MM.YYYY'.
     */
  export const getCurrentWeekDates = (startDate: string): string[] => {
    const currentWeekDatesArr: string[] = [];

    const start = parseDateString(startDate);
    if (!start) {
      console.error('Некорректный формат startDate:', startDate);
      return currentWeekDatesArr; // Возвращаем пустой массив при некорректной дате
    }

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i); // Добавляем дни

      // Форматируем дату и добавляем в массив
      currentWeekDatesArr.push(formatDate(currentDate));
    }

    return currentWeekDatesArr;
  };