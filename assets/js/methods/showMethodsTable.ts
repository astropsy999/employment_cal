import { TaskType } from '../enums/taskTypes';
import { EventInfo } from '../types/events';
import { wooTimeIsOver } from '../utils/mainGlobFunctions';
import { createMethodsTableHead } from '../utils/methodsUtils';
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
  const editSaveTaskBtn = document.querySelector('#editSaveTaskBtn');

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

  let tBody = document.querySelector('.methods-tbody');
  if (tBody) {
    if (methodsArray) {
      methodsArray.forEach((tablelem) => {
        const method = Object.keys(tablelem)[0];
        const methodParams = Object.values(tablelem)[0];

        const trElem = document.createElement('tr');
        trElem.setAttribute('editid', methodParams['editID']);
        trElem.classList.add('hover-actions-trigger');
        trElem.innerHTML = `
          <td class="align-middle text-center text-nowrap ed methods-select">
            <div class="d-flex align-items-center">
              <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${method}</div>
            </div>
          </td>
          <td class="align-middle text-nowrap ed wootime">${methodParams['duration']}</td>
          <td class="w-auto ed">
            ${methodParams['objQuant']}
          </td>
          <td class="align-middle text-nowrap ed">${methodParams['zones']}</td>
          <td class="align-middle text-nowrap">
            <div class="btn-group btn-group hover-actions methods-table-hover">
              <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать">
                <span class="fas fa-edit" style="color: green;"></span>
              </button>
              <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить">
                <span class="fas fa-trash-alt" style="color: red;"></span>
              </button>
            </div>
          </td>`;

        tBody.append(trElem);
      });
    }
  }
  /**
   * Отправка отредактированных методов в базу данных
   * @param {*} methData
   */
  const sendEditedMethodToBase = (methData) => {
    const { methVal, durVal, objqVal, zonesVal, editID } = methData;

    const editEventModal = document.querySelector('#editEventModal');
    const delID = editEventModal.getAttribute('delID');

    const methodsTbody = editEventModal.querySelector('.methods-tbody');

    function sumUneditedMethodsTime() {
      let tableRows = methodsTbody.querySelectorAll('tr.hover-actions-trigger');
      let sum = 0;
      tableRows.forEach((row) => {
        let secondColumnValue = parseInt(row.children[1].textContent);
        if (!isNaN(secondColumnValue)) {
          sum += secondColumnValue;
        }
      });
      return sum;
    }

    const allMethodsTimeSum = sumUneditedMethodsTime();
    const editedSpentTime = document.querySelector('#eventEditSpentTime');

    const editedSpentTimeValue = document.querySelector(
      '#eventEditSpentTime',
    ).value;

    if (allMethodsTimeSum > editedSpentTimeValue) {
      isInvalidElem(editedSpentTime);

      editedSpentTime.addEventListener('change', () => {});

      const timeHeader = document.querySelector(
        'th[scope="col"]:nth-of-type(2)',
      );
      timeHeader.textContent = `Время методов не может быть > ${editedSpentTimeValue}ч`;
      timeHeader.style.border = '2px solid red';
      timeHeader.style.color = 'red';
      editSaveTaskBtn.setAttribute('disabled', 'disabled');

      return;
    }

    // return;

    let formDataEdMeth = new FormData();

    formDataEdMeth.append('ID', editID);
    formDataEdMeth.append('TypeID', '1149');
    formDataEdMeth.append('Data[0][name]', '8764');
    formDataEdMeth.append('Data[0][value]', methVal);
    formDataEdMeth.append('Data[0][isName]', 'true');
    formDataEdMeth.append('Data[0][maninp]', 'false');
    formDataEdMeth.append('Data[0][GroupID]', '2549');
    formDataEdMeth.append('Data[1][name]', '8767');
    formDataEdMeth.append('Data[1][value]', durVal);
    formDataEdMeth.append('Data[1][isName]', 'false');
    formDataEdMeth.append('Data[1][maninp]', 'false');
    formDataEdMeth.append('Data[1][GroupID]', '2549');
    formDataEdMeth.append('Data[2][name]', '8766');
    formDataEdMeth.append('Data[2][value]', objqVal);
    formDataEdMeth.append('Data[2][isName]', 'false');
    formDataEdMeth.append('Data[2][maninp]', 'false');
    formDataEdMeth.append('Data[2][GroupID]', '2549');
    formDataEdMeth.append('Data[3][name]', '8765');
    formDataEdMeth.append('Data[3][value]', zonesVal);
    formDataEdMeth.append('Data[3][isName]', 'false');
    formDataEdMeth.append('Data[3][maninp]', 'false');
    formDataEdMeth.append('Data[3][GroupID]', '2549');
    formDataEdMeth.append('ParentObjID', delID);
    formDataEdMeth.append('CalcParamID', '-1');
    formDataEdMeth.append('InterfaceID', '1685');
    formDataEdMeth.append('ImportantInterfaceID', '');
    formDataEdMeth.append('templ_mode', 'false');
    formDataEdMeth.append('Ignor39', '1');

    fetch(srvv + addValueObjTrue, {
      credentials: 'include',
      method: 'post',
      body: formDataEdMeth,
    })
      .then((response) => {
        console.log('Данные метода-сохранены');

        return response.json();
      })
      .catch(function (error) {
        console.log('Ошибка отправки данных по методу', error);
      });
  };
  /**
   * Отправка отредактированной строки в таблице методов в базу данных
   * @param {*} ev
   */
  const switchOffEditModeBase = (ev) => {
    let edMetDataObj = {};

    const editedString = ev.target.closest('tr');
    const editID = editedString.getAttribute('editid');
    edMetDataObj['editID'] = editID;
    let tdArray = [];

    if (editedString) {
      tdArray = [...editedString.querySelectorAll('td')];
    }

    tdArray.forEach((tdItem, idx) => {
      if (tdItem.classList.contains('ed')) {
        if (tdItem.classList.contains('methods-select')) {
          tdItem.innerHTML = `<div class="d-flex align-items-center">
                        <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItem.children[0].value}</div></div>`;
        } else {
          tdItem.innerText = tdItem.children[0].value;
        }
      } else {
        tdItem.innerHTML = `<div class="btn-group btn-group hover-actions methods-table-hover">
                <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
                <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
                </div>`;
      }
      edMetDataObj['methVal'] = tdArray[0].innerText;
      edMetDataObj['durVal'] = tdArray[1].innerText;
      edMetDataObj['objqVal'] = tdArray[2].innerText;
      edMetDataObj['zonesVal'] = tdArray[3].innerText;
    });

    const editStringBtnArr = [...document.querySelectorAll('.edit-string')];
    const delStrBtnArr = [...document.querySelectorAll('.delete-string')];

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
    sendEditedMethodToBase(edMetDataObj);
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
