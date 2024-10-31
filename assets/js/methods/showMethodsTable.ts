import saveEditedMethodToBaseApi from '../api/saveEditedMethodToBaseApi';
import { TaskType } from '../enums/taskTypes';
import { EventInfo } from '../types/events';
import { MethodData } from '../types/methods';
import { wooTimeIsOver } from '../utils/mainGlobFunctions';
import { createMethodsTableBody, createMethodsTableHead, sumUneditedMethodsTime } from '../utils/methodsUtils';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';

/**
 * Показ/скрытие таблицы с методами
 * @param {*} eventInfo
 * @param {*} wooElem
 * @param {*} api
 */
const showMethodsTable = (eventInfo: EventInfo, wooElem: HTMLElement, api:{[key:string]: string}) => {
  const { srvv, addValueObjTrue, deleteNodeURL } = api;
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
  createMethodsTableBody(methodsArray, tBody);


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

    tdArray.forEach((tdItem, idx) => {
      if (tdItem.classList.contains('ed')) {
        const tdItemChildren = tdItem.children[0] as HTMLInputElement | HTMLSelectElement;

        if (tdItem.classList.contains('methods-select')) {
          tdItem.innerHTML = `<div class="d-flex align-items-center">
                        <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItemChildren.value}</div></div>`;
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
  const editStringOfTableBase = (ev) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = ev.target.closest('tr');
      let tdArr = [];
      if (edString) {
        tdArr = [...edString.querySelectorAll('td')];
      }
      tdArr.forEach((td) => {
        if (td.classList.contains('ed')) {
          // td.append(wooMetod)

          if (!td.classList.contains('methods-select')) {
            td.innerHTML = `<input class="form-control" type="number" min="1" value =${td.innerText} onkeyup="if(this.value<0){this.value = this.value * -1}"></input>`;
          } else {
            const newVal = td.innerText;
            const selectElem = wooMetod.innerHTML;
            td.innerHTML = `<select class="form-select" id="wooMetodEdit">${selectElem}</select>`;
            const editSelMeth = document.querySelector('#wooMetodEdit');
            editSelMeth.value = newVal;
          }
        } else {
          td.innerHTML = `<div class="btn-group btn-group">
                <button class="btn btn-light pe-2 save-edited" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Сохранить"><i class="fa fa-check" style="color: green;"></i></button>
                </div>`;
        }
      });

      const saveEditedBtn = document.querySelector('.save-edited');
      saveEditedBtn.addEventListener('click', (e) => {
        const editedSpentTime = document.querySelector('#eventEditSpentTime');
        const editedString = e.target.closest('tr');

        const metSelTd = editedString.querySelector('.methods-select');
        const selMetSel = metSelTd.querySelector('select');

        if (selMetSel.value !== 'Не выбрано') {
          const wooTimes = document.querySelectorAll('.wootime');
          let totalWooTime = 0;

          wooTimes.forEach((time) => {
            let content = time.innerHTML;
            if (content.includes('<input')) {
              let value = time.querySelector('input').value;
              totalWooTime += +value;
            } else {
              totalWooTime += +content;
            }
          });
          if (totalWooTime <= editedSpentTime.value) {
            switchOffEditModeBase(e);
            isValidElem(editedSpentTime);
          } else {
            isInvalidElem(editedSpentTime);
          }
        } else {
          isInvalidElem(selMetSel);
          selMetSel.addEventListener('change', () => {
            if (selMetSel.value !== 'Не выбрано') {
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
   * Удаление строки из таблицы методов
   * @param {*} ev
   */
  const deleteStringOfTableBase = (ev) => {
    const delStr = ev.target.closest('tr');
    const methDelID = delStr.getAttribute('editid');
    delStr.remove();

    fetch(srvv + deleteNodeURL + `?ID=${methDelID}&TypeID=1149&TabID=1685`, {
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('Метод удален');
      })

      .catch(function (error) {
        console.log('Ошибка отправки удаления метода', error);
      });
  };

  const strEditBtnArr = [...document.querySelectorAll('.edit-string')];
  const delStrBtnArr = [...document.querySelectorAll('.delete-string')];

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
