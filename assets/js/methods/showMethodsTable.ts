import { EventDef } from '@fullcalendar/core/internal';
import deleteMethodFromTableApi from '../api/deleteMethodFromTableApi';
import getMethodsDropDown from '../api/getMethodsDropDown';
import saveEditedMethodToBaseApi from '../api/saveEditedMethodToBaseApi';
import { Methods } from '../enums/methods';
import { TaskType } from '../enums/taskTypes';
import { MethodData } from '../types/methods';
import { createMethodsTableBody, createMethodsTableHead } from '../utils/methodsUtils';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';
import getBrigadeWorkers from '../api/getBrigadeWorkers';
import { populateBrigadeSelect } from '../utils/populateBrigadeSelect';
import Choices from 'choices.js';
import { initials, initialsStr } from '../utils/textsUtils';
import { hideBrigadeColumn, showBrigadeColumn } from './editModeUtils';

/**
 * Показ/скрытие таблицы с методами
 * @param {*} eventInfo
 * @param {*} wooElem
 * @param {*} api
 */
const showMethodsTable = (eventInfo: EventDef, wooElem: HTMLElement, api:{[key:string]: string}) => {

  let isEditMode = false;
  const editSaveTaskBtn = document.querySelector('#editSaveTaskBtn') as HTMLButtonElement;

  const methodsArray = eventInfo.extendedProps.methods;
  const taskTypeNew = eventInfo.extendedProps.taskTypeNew;
  const subTaskTypeNew = eventInfo.extendedProps.subTaskTypeNew;
  if (
    methodsArray &&
    (taskTypeNew === TaskType.TECHNICAL_DIAGNOSTIC ||
      subTaskTypeNew === TaskType.LABORATORY_CONTROL)
  ) {
    createMethodsTableHead(wooElem);
  }

  let tBody = document.querySelector('.methods-tbody') as HTMLElement;
  createMethodsTableBody(methodsArray!, tBody);


  /**
   * Отправка отредактированной строки в таблице методов в базу данных
   * @param {*} ev
   */
  const switchOffEditModeBase = (ev: Event) => {
    let edMetDataObj: MethodData = {} as MethodData;

    const editedString = (ev.target as HTMLElement)?.closest('tr');
    const editID = editedString?.getAttribute('editid');
    edMetDataObj['editID'] = editID!;
    let tdArray: HTMLTableCellElement[] = [];

    if (editedString) {
      tdArray = Array.from(editedString.querySelectorAll('td'));
    }

      // Reference to the table header row
      const edTableHead = document.querySelector('.thead-dark') as HTMLTableSectionElement;
      const edHeaderRow = edTableHead?.querySelector('tr') as HTMLTableRowElement;

       // Remove the brigade header if it exists
      const existingBrigadeHeader = edHeaderRow.querySelector('.brigade-header');
      if (existingBrigadeHeader) {
        existingBrigadeHeader.remove();
      }

    tdArray.forEach((tdItem, idx) => {
      if (tdItem.classList.contains('ed')) {
        const tdItemChildren = tdItem.children[0] as HTMLInputElement | HTMLSelectElement;

        if (tdItem.classList.contains('methods-select')) {
          tdItem.innerHTML = `
            <div class="d-flex align-items-center">
              <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItemChildren.value}</div>
            </div>
            `;
        } else {
          tdItem.innerText = tdItemChildren.value;
        }
      } else {
        tdItem.innerHTML = `
        <div class="btn-group btn-group hover-actions methods-table-hover">
          <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать">
            <span class="fas fa-edit" style="color: green;"></span>
          </button>
          <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить">
            <span class="fas fa-trash-alt" style="color: red;"></span>
          </button>
        </div>
        `;
      }
      edMetDataObj['methVal'] = tdArray[0].innerText.trim();
      edMetDataObj['durVal'] = tdArray[1].innerText.trim();
      edMetDataObj['objqVal'] = tdArray[2].innerText.trim();
      edMetDataObj['zonesVal'] = tdArray[3].innerText.trim();
    });

    const editStringBtnArr = Array.from(document.querySelectorAll('.edit-string'));
    const delStrBtnArr = Array.from(document.querySelectorAll('.delete-string'));

    // Добавляем обработчики событий заново
    editStringBtnArr.forEach((item) => {
      item.addEventListener('click', (e) => {
        editStringOfTableBase(e);
      });
    });
    delStrBtnArr.forEach((item) => {
      item.addEventListener('click', (e) => {
        deleteStringOfTableBase(e);
      });
    });
    isEditMode = false;
      const editedSpentTime = document.querySelector(
        '#eventEditSpentTime',
      ) as HTMLInputElement;
    saveEditedMethodToBaseApi({methData: edMetDataObj, editSaveTaskBtn, editedSpentTime});
  };

  /**
   * Редактирование строки методов в таблице методов
   * @param {*} ev
   */
  const editStringOfTableBase = (ev: Event) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = (ev.target as HTMLElement)?.closest('tr');
      // Получаем ссылку на <thead>
      const edTableHead = document?.querySelector('.thead-dark') as HTMLTableSectionElement;
      // Получаем ссылку на строку заголовков <tr>
      const edHeaderRow = edTableHead?.querySelector('tr') as HTMLTableRowElement;
  
      let tdArr: HTMLTableCellElement[] = [];
      if (edString) {
        tdArr = Array.from(edString.querySelectorAll('td'));
        const methodsTD = tdArr[0];
  
        // Получаем текущий метод
        const methodText = methodsTD.querySelector('.badge')?.textContent?.trim() || '';
        const selectedTeamList = methodsTD.querySelector('button')?.getAttribute('title');
        const isBrigadier = methodsTD.querySelector('button')?.getAttribute('data-is-brigadier');
  
        tdArr.forEach(async (td) => {
          if (td.classList.contains('ed')) {
            if (!td.classList.contains('methods-select')) {
              const value = td.innerText.trim();
              td.innerHTML = `<input class="form-control" type="number" min="1" value="${value}">`;
            } else {
              const newVal = methodText;
              const selectElem = document.createElement('select');
              selectElem.classList.add('form-select');
              selectElem.id = 'wooMethodEdit';
              await getMethodsDropDown(selectElem);
              td.innerHTML = '';
              td.appendChild(selectElem);
              // Устанавливаем выбранный метод
              selectElem.value = newVal;
              const selectedOption = selectElem.options[selectElem.selectedIndex];
              // Проверяем, требуется ли бригада для выбранного метода
              const selectedMethodID = selectedOption?.getAttribute('methodid')!;
              console.log("🚀 ~ tdArr.forEach ~ selectedMethodID:", selectedMethodID)

              const isRK = selectedMethodID === Methods.RK_CRG || selectedMethodID === Methods.RK_CLASSIC;

              console.log("🚀 ~ tdArr.forEach ~ isRK:", isRK)

  
              if (isRK) {
                showBrigadeColumn(edHeaderRow, methodsTD, edString, selectedTeamList!, isBrigadier!);
              }
  
              // Добавляем обработчик события изменения метода
              selectElem.addEventListener('change', async (e) => {
                const selectedOption = selectElem.options[selectElem.selectedIndex];
                const selectedMethodID = selectedOption?.getAttribute('methodid')!;
                const isRK = selectedMethodID === Methods.RK_CRG || selectedMethodID === Methods.RK_CLASSIC;
  
                if (isRK) {
                  showBrigadeColumn(edHeaderRow, methodsTD, edString);
                } else {
                  hideBrigadeColumn(edHeaderRow, edString);
                }
              });
            }
          } else {
            td.innerHTML = `
              <div class="btn-group btn-group">
                <button class="btn btn-light pe-2 save-edited" type="button" title="Сохранить">
                  <i class="fa fa-check" style="color: green;"></i>
                </button>
              </div>
            `;
          }
        });
  
        const saveEditedBtn = edString?.querySelector('.save-edited') as HTMLButtonElement;
  
        saveEditedBtn.addEventListener('click', (e) => {
          // Ваш существующий код сохранения
          switchOffEditModeBase(e);
        });
      }
    }
  };
  

  /**
   * Удаление строки из таблицы методов
   * @param {*} ev
   */
  const deleteStringOfTableBase = (ev: Event) => {
    const delStr = (ev.target as HTMLElement)?.closest('tr');
    const methDelID = delStr?.getAttribute('editid');
    if (!methDelID) {
      console.error('Не найден ID метода для удаления');
      return;
    }
  
    // Удаляем строку из таблицы
    delStr?.remove();

    // Удаляем метод из базы данных
    deleteMethodFromTableApi(methDelID);
  };

  // Добавление обработчиков событий к кнопкам редактирования и удаления
  const strEditBtnArr = Array.from(document.querySelectorAll('.edit-string'));
  const delStrBtnArr = Array.from(document.querySelectorAll('.delete-string'));

  strEditBtnArr.forEach((item) => {
    item.addEventListener('click', (e) => {
      editStringOfTableBase(e);
    });
  });

  delStrBtnArr.forEach((item) => {
    item.addEventListener('click', (e) => {
      deleteStringOfTableBase(e);
    });
  });
};

export default showMethodsTable;
