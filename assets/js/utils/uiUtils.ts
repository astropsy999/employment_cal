import { settings } from "../api/settings";

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

  /**
   * Набор селекторов для формы добавления задачи в режиме недели
   */
  export const getFormElements = () => {
    return {
      kindOfTasks: document.querySelector('#kindOfTasks') as HTMLSelectElement,
      kindOfSubTask: document.querySelector('#kindOfSubTask') as HTMLSelectElement,
      eventTitle: document.querySelector('#eventTitle') as HTMLInputElement,
      longDesc: document.querySelector('#longDesc') as HTMLTextAreaElement,
      taskObj: document.querySelector('#taskObj') as HTMLSelectElement,
      taskCreator: document.querySelector('#taskCreator') as HTMLSelectElement,
      eventStartDate: document.querySelector('#eventStartDate') as HTMLInputElement,
      eventEndDate: document.querySelector('#eventEndDate') as HTMLInputElement,
      eventSpentTime: document.querySelector('#eventSpentTime') as HTMLInputElement,
      eventSource: document.querySelector('#eventSource') as HTMLSelectElement,
      eventNotes: document.querySelector('#eventNotes') as HTMLTextAreaElement,
      locations: document.querySelector('#locObj') as HTMLSelectElement,
      employment: document.querySelector('#employment') as HTMLSelectElement,
      addEventModal: document.querySelector('#addEventModal') as HTMLElement,
      eventTaskModalBtn: document.querySelector('#addTaskToCalBtn') as HTMLButtonElement,
      approveBtn: document.querySelector('#approveBtn') as HTMLButtonElement,
      kr: document.querySelector('#flexCheckDefault') as HTMLInputElement,
      methodsTable: document.querySelector('.methods-tbody') as HTMLElement,
    };
  };

    /**
   * Показ галочки КР
   */
  export const showCheckMark = (etarget: HTMLElement) => {
    const checkMarkRow = etarget.querySelector('.check-mark');
    const checkElem = checkMarkRow?.querySelector('.check-elem');

    if (!checkElem && settings.isKRChekboxAvailable) {
      const checkMarkElem = document.createElement('div');
      checkMarkElem.classList.add('col-md-1', 'check-elem');
      checkMarkElem.innerHTML = `
        <div>
          <label class="fs-0 check-label" for="krCheckbox">КР</label>
          <input class="form-check-input" type="checkbox" id="krCheckbox">
        </div>`;
      checkMarkRow?.append(checkMarkElem);
    }
  };

    /**
   * Удаление галочки КР
   */
  export const removeCheckMark = (etarget: HTMLElement) => {
    const checkElem = etarget.querySelector('.check-elem');
    checkElem?.remove();
  };