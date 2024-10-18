import { Methods } from '../enums/methods';
import { EventInfo } from '../types/events';
import { MethodData } from '../types/methods';
import { wooTimeIsOver } from '../utils/mainGlobFunctions';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';

/**
 * Показ/скрытие таблицы с методами
 * @param {*} eventInfo
 * @param {*} wooElem
 * @param {*} api
 */
const showMethodsTable = (eventInfo: EventInfo, wooElem: HTMLElement, api: {[key: string]: string}) => {
  const { srvv, addValueObjTrue, deleteNodeURL } = api;
  let isEditMode = false;
  const editSaveTaskBtn = document.querySelector('#editSaveTaskBtn');

  const methodsArray = eventInfo.extendedProps.methods;
  const taskTypeNew = eventInfo.extendedProps.taskTypeNew;
  const subTaskTypeNew = eventInfo.extendedProps.subTaskTypeNew;
  if (
    methodsArray &&
    (taskTypeNew === 'Техническое диагностирование' ||
      subTaskTypeNew === 'Проведение контроля в лаборатории')
  ) {
    const tableElemHeader = document.createElement('div');
    tableElemHeader.innerHTML = `<div class="table-responsive scrollbar">
          <table class="table table-hover table-sm table-bordered">
            <thead class="thead-dark">
              <tr class="rounded-2">
                <th scope="col" style="width: 20%">Метод</th>
                <th scope="col" style="width: 25%">Время, ч</th>
                <th scope="col" style="width: 25%">Объек&shy;тов, шт</th>
                <th scope="col" style="width: 21%">Зон/Стыков, шт</th>
                <th scope="col" style="width: 9%"></th>
              </tr>
            </thead>
            <tbody class="methods-tbody">
            </tbody>
         </table>
    </div>
    `;
    wooElem.after(tableElemHeader);
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
        trElem.innerHTML = `<td class="align-middle text-center text-nowrap ed methods-select">
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
                     <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
                     <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
                     </div>
                     </td>
                     `;

        tBody.append(trElem);
      });
    }
  }
  /**
   * Отправка отредактированных методов в базу данных
   * @param {*} methData
   */
  const sendEditedMethodToBase = (methData: MethodData) => {
    const { methVal, durVal, objqVal, zonesVal, editID } = methData;

    const editEventModal = document.querySelector('#editEventModal');
    const delID = editEventModal?.getAttribute('delID');

    const methodsTbody = editEventModal?.querySelector('.methods-tbody');

    function sumUneditedMethodsTime() {
      let tableRows = methodsTbody?.querySelectorAll('tr.hover-actions-trigger');
      let sum = 0;
      tableRows?.forEach((row) => {
        let secondColumnValue = parseInt(row.children[1].textContent!);
        if (!isNaN(secondColumnValue)) {
          sum += secondColumnValue;
        }
      });
      return sum;
    }

    const allMethodsTimeSum = sumUneditedMethodsTime();
    const editedSpentTime = document.querySelector('#eventEditSpentTime') as HTMLInputElement;

    const editedSpentTimeValue = (document.querySelector(
      '#eventEditSpentTime',
    ) as HTMLInputElement)?.value;

    if (allMethodsTimeSum > +editedSpentTimeValue) {
      isInvalidElem(editedSpentTime);

      editedSpentTime.addEventListener('change', () => {});

      const timeHeader = document.querySelector(
        'th[scope="col"]:nth-of-type(2)',
      ) as HTMLTableCellElement;
      timeHeader.textContent = `Время методов не может быть > ${editedSpentTimeValue}ч`;
      timeHeader.style.border = '2px solid red';
      timeHeader.style.color = 'red';
      editSaveTaskBtn?.setAttribute('disabled', 'disabled');

      return;
    }

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
    formDataEdMeth.append('ParentObjID', delID!);
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
        const tdItemChildren=tdItem.children[0] as HTMLInputElement

        if (tdItem.classList.contains('methods-select')) {
          tdItem.innerHTML = `<div class="d-flex align-items-center">
                        <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItemChildren.value}</div></div>`;
        } else {
          tdItem.innerText = tdItemChildren.value;
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

    const editStringBtnArr = Array.from(document.querySelectorAll('.edit-string'));
    const delStrBtnArr = Array.from(document.querySelectorAll('.delete-string'));

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
  const editStringOfTableBase = (ev: Event) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = (ev.target as HTMLElement)?.closest('tr');
      let tdArr: HTMLTableCellElement[] = [];
      if (edString) {
        tdArr =Array.from(edString.querySelectorAll('td'));
      }
      tdArr.forEach((td) => {
        if (td.classList.contains('ed')) {
          // td.append(wooMetod)

          if (!td.classList.contains('methods-select')) {
            td.innerHTML = `<input class="form-control" type="number" min="1" value =${td.innerText} onkeyup="if(this.value<0){this.value = this.value * -1}"></input>`;
          } else {
            const newVal = td.innerText;
            const selectElem = wooMethod.innerHTML;
            td.innerHTML = `<select class="form-select" id="wooMethodEdit">${selectElem}</select>`;
            const editSelMeth = document.querySelector('#wooMethodEdit') as HTMLSelectElement;
            editSelMeth.value = newVal;
          }
        } else {
          td.innerHTML = `<div class="btn-group btn-group">
                <button class="btn btn-light pe-2 save-edited" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Сохранить"><i class="fa fa-check" style="color: green;"></i></button>
                </div>`;
        }
      });

      const saveEditedBtn = document.querySelector('.save-edited') as HTMLButtonElement;
      saveEditedBtn.addEventListener('click', (e) => {
        const editedSpentTime = document.querySelector('#eventEditSpentTime') as HTMLInputElement;
        const editedString = (e.target as HTMLElement)?.closest('tr');

        const metSelTd = editedString?.querySelector('.methods-select');
        const selMetSel = metSelTd?.querySelector('select');

        if (selMetSel?.value !== Methods.NOT_SELECTED) {
          const wooTimes = document.querySelectorAll('.wootime');
          let totalWooTime = 0;

          wooTimes.forEach((time) => {
            let content = time.innerHTML;
            if (content.includes('<input')) {
              let value = time.querySelector('input')?.value;
              totalWooTime += +value!;
            } else {
              totalWooTime += +content;
            }
          });
          if (totalWooTime <= +editedSpentTime?.value) {
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
  const deleteStringOfTableBase = (ev: Event) => {
    const delStr = (ev.target as HTMLElement)?.closest('tr');
    const methDelID = delStr?.getAttribute('editid');
    delStr?.remove();

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
