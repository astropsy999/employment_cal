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

