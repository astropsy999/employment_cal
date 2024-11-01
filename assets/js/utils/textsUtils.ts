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