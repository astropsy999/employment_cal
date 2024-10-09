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
