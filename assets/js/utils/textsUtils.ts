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
 * Преобразует строку с полными ФИО, разделёнными запятыми, в строку с инициалами.
 * @param str Строка с ФИО, разделёнными запятыми (например, "Иванов Иван Иванович, Петров Петр Петрович")
 * @returns Строка с ФИО в формате "Иванов И.И., Петров П.П."
 */
export function initialsStr(str: string): string {
  // Разбиваем строку на отдельные ФИО по запятым
  return str.split(',')
      .map(fullName => {
          // Убираем лишние пробелы в начале и конце
          const nameParts = fullName.trim().split(/\s+/);

          // Проверяем, что есть хотя бы фамилия и имя
          if (nameParts.length < 2) {
              // Если недостаточно частей, возвращаем как есть
              return fullName.trim();
          }

          const [surname, name, patronymic] = nameParts;

          // Формируем инициалы
          let initials = `${surname} ${name.charAt(0).toUpperCase()}.`;
          if (patronymic) {
              initials += `${patronymic.charAt(0).toUpperCase()}.`;
          }

          return initials;
      })
      .join(', ');
}


/**
 * Генерирует строку с именами из массива строк формата "{id:Имя Фамилия Отчество}"
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

/**
 * Генерирует строку с ID-шниками из массива строк формата "{id:Имя Фамилия Отчество}"
 *  
 * @param {string[]} teamArray - Массив строк с данными команды
 * @returns {string} - Строка с ID-шниками, разделёнными \n
 */

export function generateTeamListId(teamArray: string[]): string {
  return teamArray
    .map(item => {
      // Разделяем строку по символу ':'
      const parts = item.split(':');
      // Проверяем, есть ли в результате разделения хотя бы два элемента
      if (parts.length >= 2) {
        // Возвращаем первую часть (ID)
        return parts[0].replace("{", "").trim();
      }
      // Если формат строки неверный, возвращаем пустую строку
      return '';
    })
    // Фильтруем пустые строки (в случае неверного формата)
    .filter(name => name !== '')
    // Объединяем имена через запятую и пробел
    .join('\n');
}