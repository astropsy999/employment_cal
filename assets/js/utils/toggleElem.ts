/**
 * Функция которая скрывает/показывает элементы
 * @param {Element} elem - HTML элемент, который нужно скрыть/показать
 * @param {boolean} onOff - Флаг, указывающий, нужно ли показать (true) или скрыть (false) элемент
 */
export const toggleElem = (elem: HTMLElement, onOff: boolean) => {
  // Проверяем, существует ли элемент
  if (elem) {
    if (onOff) {
      // Если флаг onOff равен true, показываем элемент
      elem.style.display = 'block'; // Или другое значение стиля для показа элемента (например, 'flex', 'grid', 'inline-block' и т.д.)
    } else {
      // Если флаг onOff равен false, скрываем элемент
      elem.style.display = 'none';
    }
  }
};

// Включает отключает состояние при валидации

export const isInvalidElem = (elem: HTMLElement) => {
  elem?.classList.add('is-invalid');
  elem.style.color = 'red';
};
export const isValidElem = (elem: HTMLElement) => {
  elem?.classList.remove('is-invalid');
  elem.style.color = 'unset';
};
