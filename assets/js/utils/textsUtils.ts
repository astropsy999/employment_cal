/**
 * Фамилия Имя Отчество преобразует в Фамилия И.О. 
 * @param str 
 * @returns 
 */

export function initials(str: string) {
    const firstInit = str
      .split(/\s+/)
      .map((w: string, i: any) => (i ? w.substring(0, 1).toUpperCase() + '.' : w))
      .join(' ');
    const secondInit = firstInit.split(' ');
    return `${secondInit[0]} ${secondInit[1]}${secondInit[2]}`;
  }

/**
 * Генерирует строку с именами из массива строк формата "{id:Имя Фамилия Отчество"
 *
 * @param {string[]} teamArray - Массив строк с данными команды
 * @returns {string} - Строка с именами, разделёнными запятыми
 */
export function generateTeamListTitle(teamArray: string[]): string {
  return teamArray
    .map(item => {
      // Разделяем строку по символу ':'
      const parts = item.split(':');
      // Проверяем, есть ли в результате разделения хотя бы два элемента
      if (parts.length >= 2) {
        // Возвращаем вторую часть (имя)
        return parts[1].replace('}', '').trim();
      }
      // Если формат строки неверный, возвращаем пустую строку
      return '';
    })
    // Фильтруем пустые строки (в случае неверного формата)
    .filter(name => name !== '')
    // Объединяем имена через запятую и пробел
    .join(', ');
}