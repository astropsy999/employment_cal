/**
 * Проверяет, готов ли DOM к использованию, и если да, то выполняет переданную функцию.
 * Если же DOM еще не готов, функция добавляет обработчик события DOMContentLoaded
 * и выполняет переданную функцию после его возникновения.
 * @param fn Функция, которая будет вызвана после готовности DOM.
 */
export let docReady = function docReady(fn: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    setTimeout(fn, 1);
  }
};

/**
 * Преобразует строку с разделителями (дефис, подчеркивание, пробел или точка) в строку в формате camelCase.
 * @param str Строка для преобразования.
 * @returns Строка в формате camelCase.
 */
export let camelize = function camelize(str: string): string {
  let text = str.replace(/[-_\s.]+(.)?/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return ''.concat(text.substr(0, 1).toLowerCase()).concat(text.substr(1));
};

/**
 * Возвращает значение атрибута data элемента в формате JSON, если это возможно, или в виде строки.
 * @param el HTML-элемент, из которого будет извлечен атрибут data.
 * @param data Название атрибута data.
 * @returns Значение атрибута в формате JSON или строки.
 */
export let getData = function getData(el: HTMLElement, data: string): unknown {
  try {
    return JSON.parse(el.dataset[camelize(data)] || '');
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/**
 * Содержит эти три функции в качестве своих методов и может быть использован для удобного доступа к ним.
 */
export let utils = {
  docReady,
  camelize,
  getData,
};
