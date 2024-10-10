/**
 * Проверяет, готов ли DOM к использованию, и если да, то выполняет переданную функцию. Если же DOM еще не готов,
 функция добавляет обработчик события DOMContentLoaded и выполняет переданную функцию после его возникновения.
 * @param {*} fn
 */
export let docReady = function docReady(fn: { (): void; (this: Document, ev: Event): any; (): void; } | undefined) {
  // see if DOM is already available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn!);
  } else {
    setTimeout(fn!, 1);
  }
};

/**
 * Преобразует строку с разделителями (дефис, подчеркивание, пробел или точка) в строку в формате camelCase.
 * @param {*} str
 * @returns
 */
export let camelize = function camelize(str) {
  let text = str.replace(/[-_\s.]+(.)?/g, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
  return ''.concat(text.substr(0, 1).toLowerCase()).concat(text.substr(1));
};

/**
 * Возвращает значение атрибута data элемента в формате JSON, если это возможно, или в виде строки.
 * @param {*} el
 * @param {*} data
 * @returns
 */
export let getData = function getData(el, data) {
  try {
    return JSON.parse(el.dataset[camelize(data)]);
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

/**
 * Cодержит эти три функции в качестве своих методов и может быть использован для удобного доступа к ним.
 */

export let utils = {
  docReady,
  camelize,
  getData,
};
