import { Methods } from "../enums/methods";

export const validateCondition = (
    valC: boolean | 'onRoad',
    locations: HTMLSelectElement,
    kindOfTasks: HTMLSelectElement,
    eventEndDate: HTMLInputElement
  ): boolean => {
    switch (valC) {
      case false:
        return false;
      case true:
        return (
          locations.value === 'Не выбрано' ||
          kindOfTasks.value === 'Не выбрано' ||
          eventEndDate.classList.contains('is-invalid')
        );
      case 'onRoad':
        return eventEndDate.classList.contains('is-invalid');
      default:
        return false;
    }
  };

 /**
     * Проверка рабочего режима при добавлении задачи
     * @returns boolean
     */
 export const checkEmploymentMode = (locations: HTMLSelectElement): boolean | 'onRoad' => {
    const emplMode = document.querySelector('#employment') as HTMLSelectElement;
    if (emplMode.value === 'Работа' && locations.value !== 'В дороге') {
      return true;
    } else if (
      emplMode.value === 'Работа' &&
      locations.value === 'В дороге'
    ) {
      return 'onRoad';
    }
    return false;
  };

  /**
   * Функция валидации и добавления вспомогательного сообщения в селектор выбора работников бригады
   * @param brigadeSelect 
   * @returns 
   */
  export function validateBrigadeSelect(brigadeSelect: HTMLSelectElement): boolean {
    if (brigadeSelect) {
      const selectedOptions = brigadeSelect.selectedOptions;
  
      if (selectedOptions.length === 0) {
        // Если не выбрано ни одного работника бригады, показываем ошибку
        brigadeSelect.classList.add('is-invalid');
  
        // Проверяем, существует ли уже сообщение об ошибке
        let errorElem = brigadeSelect.parentElement?.querySelector('.invalid-feedback');
        if (!errorElem) {
          // Создаем элемент для сообщения об ошибке
          errorElem = document.createElement('div');
          errorElem.classList.add('invalid-feedback');
          errorElem.textContent = 'Необходимо выбрать хотя бы одного работника бригады.';
          brigadeSelect.parentElement?.appendChild(errorElem);
        }
  
        // Добавляем обработчик изменения селектора для удаления ошибки при выборе
        brigadeSelect.addEventListener('change', () => {
          if (brigadeSelect.selectedOptions.length > 0) {
            brigadeSelect.classList.remove('is-invalid');
            const errorElem = brigadeSelect.parentElement?.querySelector('.invalid-feedback');
            if (errorElem) {
              errorElem.remove();
            }
          }
        });
  
        return false; // Валидация не пройдена
      } else {
        // Если выбраны работники бригады, убираем сообщение об ошибке
        brigadeSelect.classList.remove('is-invalid');
        const errorElem = brigadeSelect.parentElement?.querySelector('.invalid-feedback');
        if (errorElem) {
          errorElem.remove();
        }
      }
    }
  
    return true; // Валидация пройдена
  }

  /**
   * Валидация селектора бригады при редактировании
   * @param editedString 
   * @param editedMethodName 
   * @returns 
   */
export function validateBrigadeSelectionOnEdit(editedString: HTMLTableRowElement, editedMethodName: string): boolean {
    const isRK =
      editedMethodName === Methods.RK_CRG_NAME || editedMethodName === Methods.RK_CLASSIC_NAME;
  
    if (isRK) {
      // Получаем селектор бригады
      const brigadeSelect = editedString.querySelector('#brigadeSelectEdit') as HTMLSelectElement;
  
      if (brigadeSelect) {
        validateBrigadeSelect(brigadeSelect);
      }
    }
  
    // Если метод не требует бригаду или валидация пройдена
    return true;
  }
  /**
   * Валидация времени в режиме редактирования
   * @param editedString 
   * @returns 
   */
  export function validateTimeFieldOnEdit(editedString: HTMLTableRowElement): boolean {
    // Находим ячейку с полем времени
    const timeTd = editedString.querySelector('.wootime') as HTMLTableCellElement;
    if (!timeTd) {
      // Если ячейка не найдена, считаем, что валидация не пройдена
      return false;
    }
  
    // Получаем значение из поля ввода
    const timeInput = timeTd.querySelector('input') as HTMLInputElement;
    if (!timeInput) {
      // Если поле ввода не найдено, считаем, что валидация не пройдена
      return false;
    }
  
    const timeValue = timeInput.value.trim();
  
    // Проверяем, что время не пустое и не равно нулю
    if (timeValue === '' || parseFloat(timeValue) <= 0) {
      // Добавляем класс валидации к полю ввода
      timeInput.classList.add('is-invalid');
  
      // Проверяем, существует ли уже сообщение об ошибке
      let errorElem = timeTd.querySelector('.invalid-feedback');
      if (!errorElem) {
        // Создаем элемент для сообщения об ошибке
        errorElem = document.createElement('div');
        errorElem.classList.add('invalid-feedback');
        errorElem.textContent = 'Время не может быть пустым или равным нулю.';
        timeTd.appendChild(errorElem);
      }
  
      // Добавляем обработчик изменения значения поля, чтобы убрать ошибку при корректировке
      timeInput.addEventListener('input', () => {
        if (timeInput.value.trim() !== '' && parseFloat(timeInput.value.trim()) > 0) {
          timeInput.classList.remove('is-invalid');
          if (errorElem) {
            errorElem.remove();
          }
        }
      });
  
      return false; // Валидация не пройдена
    } else {
      // Убираем класс валидации и сообщение об ошибке, если они были
      timeInput.classList.remove('is-invalid');
      const errorElem = timeTd.querySelector('.invalid-feedback');
      if (errorElem) {
        errorElem.remove();
      }
    }
  
    return true; // Валидация пройдена
  }
  
  