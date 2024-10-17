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