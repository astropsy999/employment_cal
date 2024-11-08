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
    }
  
    // Если метод не требует бригаду или валидация пройдена
    return true;
  }
  