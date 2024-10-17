
/**
 * Получение состояния чекбокса и возврат соответствующего значения.
 * @param selector - CSS селектор для поиска чекбокса.
 * @returns Возвращает 'Да' если чекбокс отмечен, иначе пустую строку.
 */
export const getKrState = (selector: string): string => {
    const krElement = document.querySelector(selector) as HTMLInputElement | null;
    if (krElement && krElement.checked) {
      return 'Да';
    }
    return '';
  };