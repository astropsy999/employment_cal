/**
 * Функция добавления и удаления лоадера на кнопку
 * @param {HTMLElement} button - элемент кнопки
 * @param {boolean} flag - флаг включения-отключения
 */
export const buttonLoader = (button, flag) => {
  if (flag) {
    button.disabled = true;
    button.classList.add('loadingBtn');
  } else {
    button.disabled = false;
    button.classList.remove('loadingBtn');
  }
};
