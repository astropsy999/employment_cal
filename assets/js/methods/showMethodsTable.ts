import { Methods } from '../enums/methods';
import { EventInfo } from '../types/events';
import { MethodData } from '../types/methods';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';
import saveEditedMethodToBaseApi from '../api/saveEditedMethodToBaseApi';
import { TaskType } from '../enums/taskTypes';
import { createMethodsTableBody, createMethodsTableHead } from '../utils/methodsUtils';
import getMethodsDropDown from '../api/getMethodsDropDown';

/**
 * Показ/скрытие таблицы с методами
 * @param {EventInfo} eventInfo
 * @param {HTMLElement} wooElem
 * @param {object} api
 */
const showMethodsTable = (
  eventInfo: EventInfo,
  wooElem: HTMLElement,
  api: { [key: string]: string },
) => {
  const { srvv, addValueObjTrue, deleteNodeURL } = api;
  let isEditMode = false;
  const editSaveTaskBtn = document.querySelector(
    '#editSaveTaskBtn',
  ) as HTMLButtonElement | null;

  const methodsArray = eventInfo.extendedProps.methods;
  const taskTypeNew = eventInfo.extendedProps.taskTypeNew;
  const subTaskTypeNew = eventInfo.extendedProps.subTaskTypeNew;

  if (
    methodsArray &&
    (taskTypeNew === TaskType.TECHNICAL_DIAGNOSTIC ||
      subTaskTypeNew ===  TaskType.LABORATORY_CONTROL)
  ) {
    createMethodsTableHead(wooElem);
  }

  const tBody = document.querySelector('.methods-tbody') as HTMLElement;
  createMethodsTableBody(methodsArray, tBody);

  /**
   * Редактирование строки методов в таблице методов
   * @param {Event} ev
   */
  const editStringOfTableBase = (ev: Event) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = (ev.target as HTMLElement)?.closest('tr');
      console.log("🚀 ~ editStringOfTableBase ~ edString:", edString)
      let tdArr: HTMLTableCellElement[] = [];
      if (edString) {
        tdArr = Array.from(edString.querySelectorAll('td'));
      }
      tdArr.forEach(async (td) => {
        if (td.classList.contains('ed')) {
          if (!td.classList.contains('methods-select')) {
            const value = td.innerText.trim();
            td.innerHTML = `<input class="form-control" type="number" min="1" value="${value}">`;
          } else {
            const newVal = td.innerText.trim();
            const selectElem = document.createElement('select');
            selectElem.classList.add('form-select');
            selectElem.id = 'wooMethodEdit';
            await getMethodsDropDown(selectElem);
            td.innerHTML = '';
            td.appendChild(selectElem);
            selectElem.value = newVal;
          }
        } else {
          td.innerHTML = `<div class="btn-group btn-group">
                    <button class="btn btn-light pe-2 save-edited" type="button" title="Сохранить"><i class="fa fa-check" style="color: green;"></i></button>
                    </div>`;
        }
      });

      const saveEditedBtn = edString?.querySelector('.save-edited') as HTMLButtonElement;
      console.log("🚀 ~ editStringOfTableBase ~ edString:", edString)
      saveEditedBtn.addEventListener('click', (e) => {
        const editedSpentTime = document.querySelector(
          '#eventEditSpentTime',
        ) as HTMLInputElement;
        const editedString = (e.target as HTMLElement)?.closest('tr');
        console.log("🚀 ~ saveEditedBtn.addEventListener ~ edString:", edString)

        const metSelTd = editedString?.querySelector('.methods-select');
        console.log("🚀 ~ saveEditedBtn.addEventListener ~ edString:", edString)
        const selMetSel = metSelTd?.querySelector('select');

        if (selMetSel?.value !== Methods.NOT_SELECTED) {
          const wooTimes = document.querySelectorAll('.wootime');
          let totalWooTime = 0;

          wooTimes.forEach((time) => {
            let content = time.innerHTML;
            if (content.includes('<input')) {
              let value = (time.querySelector('input') as HTMLInputElement)?.value;
              totalWooTime += parseFloat(value || '0');
            } else {
              totalWooTime += parseFloat(content);
            }
          });
          if (totalWooTime <= parseFloat(editedSpentTime?.value)) {
            switchOffEditModeBase(e);
            isValidElem(editedSpentTime);
          } else {
            isInvalidElem(editedSpentTime);
          }
        } else {
          isInvalidElem(selMetSel);
          selMetSel.addEventListener('change', () => {
            if (selMetSel.value !== Methods.NOT_SELECTED) {
              isValidElem(selMetSel);
            } else {
              isInvalidElem(selMetSel);
            }
          });
        }
      });
    }
  };

  /**
   * Выход из режима редактирования и сохранение изменений
   * @param {Event} ev
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

    tdArray.forEach((tdItem) => {
      if (tdItem.classList.contains('ed')) {
        const tdItemChildren = tdItem.children[0] as HTMLInputElement | HTMLSelectElement;

        if (tdItem.classList.contains('methods-select')) {
          tdItem.innerHTML = `<div class="d-flex align-items-center">
                            <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItemChildren.value}</div></div>`;
        } else {
          tdItem.innerText = tdItemChildren.value;
        }
      } else {
        tdItem.innerHTML = `<div class="btn-group btn-group hover-actions methods-table-hover">
                    <button class="btn btn-light pe-2 edit-string" type="button" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
                    <button class="btn btn-light ps-2 delete-string" type="button" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
                    </div>`;
      }
    });

    edMetDataObj['methVal'] = tdArray[0].innerText.trim();
    edMetDataObj['durVal'] = tdArray[1].innerText.trim();
    edMetDataObj['objqVal'] = tdArray[2].innerText.trim();
    edMetDataObj['zonesVal'] = tdArray[3].innerText.trim();

    // Добавляем обработчики событий заново
    const editStringBtn = editedString?.querySelector('.edit-string') as HTMLButtonElement;
    const deleteStringBtn = editedString?.querySelector('.delete-string') as HTMLButtonElement;

    editStringBtn.addEventListener('click', (e) => {
      editStringOfTableBase(e);
    });

    deleteStringBtn.addEventListener('click', (e) => {
      deleteStringOfTableBase(e);
    });

    isEditMode = false;

    const editedSpentTime = document.querySelector(
      '#eventEditSpentTime',
    ) as HTMLInputElement;

    saveEditedMethodToBaseApi({
      methData: edMetDataObj,
      srvv,
      addValueObjTrue,
      editSaveTaskBtn,
      editedSpentTime,
    });
  };

  /**
   * Удаление строки из таблицы методов
   * @param {Event} ev
   */
  const deleteStringOfTableBase = (ev: Event) => {
    const delStr = (ev.target as HTMLElement)?.closest('tr');
    const methDelID = delStr?.getAttribute('editid');
    delStr?.remove();

    fetch(`${srvv}${deleteNodeURL}?ID=${methDelID}&TypeID=1149&TabID=1685`, {
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        console.log('Метод удален');
      })
      .catch((error) => {
        console.error('Ошибка отправки удаления метода', error);
      });
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
