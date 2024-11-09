import { Methods } from '../enums/methods';
import { MethStringObj } from '../types/methods';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import { wooTimeIsOver } from '../utils/mainGlobFunctions';
import { generateTeamListTitle } from '../utils/textsUtils';
import { showToast } from '../utils/toastifyUtil';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';

export let wooMethodsArray: MethStringObj[] = [];
/**
 * Добавление методов в таблицу на клиенте
 */
const addMethodToClientTable = (selectedTeam: string | string[] | undefined, isBrigadier: boolean) => {

  const isRK = getLocalStorageItem('isRK');

  let isEditMode = false;

  const wooMethod = document.querySelector('#wooMethod') as HTMLSelectElement;
  const wooTime = document.querySelector('#wooTime') as HTMLInputElement;
  const wooObjects = document.querySelector('#wooObjects') as HTMLInputElement;
  const wooZones = document.querySelector('#wooZones') as HTMLInputElement;
  const tHead = document.querySelector('.thead-dark') as HTMLElement;
  const eventEditSpentTime = document.querySelector('#eventEditSpentTime') as HTMLInputElement;

  /**
   * Удаление строки в таблице методов
   * @param {*} ev
   */
  const deleteStringOfTable = (ev: Event) => {
    const delStr = (ev.target as HTMLElement)?.closest('tr');
    delStr?.remove();
  };
  /**
   * Создание шапки таблицы методов
   */
  const addHeaderOfTable = () => {
    const metTable = document.querySelector('.methods-table');
    const tBody = metTable?.querySelector('tbody');
    const tHead = metTable?.querySelector('thead');
    if (!tHead) {
      const addTHead = document.createElement('thead');
      addTHead.classList.add('thead-dark');
      addTHead.innerHTML = `
              <tr>
                <th scope="col" style="width: 20%">Метод</th>
                <th class="timeHeaderMeth" scope="col" style="width: 25%">Время, ч</th>
                <th scope="col" style="width: 25%">Объек&shy;тов, шт</th>
                <th scope="col" style="width: 21%">Зон/Стыков, шт</th>
                <th scope="col" style="width: 9%"></th>
              </tr>
              `;
      tBody?.before(addTHead);
    }
  };

  if (
    wooMethod?.value &&
    wooMethod.value !== Methods.NOT_SELECTED &&
    wooTime?.value &&
    !wooTimeIsOver()
  ) {
    if (!tHead) {
      addHeaderOfTable();
    }

    let methStringObj = {
      wooMethod: wooMethod.value,
      wooTime: wooTime.value,
      wooObjects: wooObjects?.value,
      wooZones: wooZones.value,
    };

    wooMethodsArray.push(methStringObj);

    let tBody = document.querySelector('.methods-tbody');

    const trElem = document.createElement('tr');
    trElem.classList.add('hover-actions-trigger');
    trElem.classList.add('justadded');

    const title = isRK && generateTeamListTitle(selectedTeam as string[]);

    trElem.innerHTML = `
      <td class="align-middle text-center text-nowrap ed methods-select" ${isRK ? `data-team='${JSON.stringify(selectedTeam)}' data-brigadir='${isBrigadier}'` : ''}>
        <div class="d-flex align-items-center">
          ${isBrigadier ? `<i class="fa fa-user color-white" aria-hidden="true"></i>`: ``}
          <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${wooMethod.value}</div>
          ${isRK ? `<button class="brigade-btn ms-2 border-0 radius-lg color-white" type="button" title="${title}">
            <i class="fa fa-users color-white" aria-hidden="true"></i>
          </button>`: ``}
        </div>
      </td>
      <td class="align-middle text-nowrap ed wootime">${wooTime.value}</td>
      <td class="align-middle text-nowrap ed">
        ${wooObjects.value}
      </td>
      <td class="align-middle text-nowrap ed">${wooZones.value}</td>
      <td class="align-middle text-nowrap">
        <div class="btn-group btn-group hover-actions methods-table-hover">
          <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать">
            <span class="fas fa-edit" style="color: green;"></span>
          </button>
          <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить">
            <span class="fas fa-trash-alt" style="color: red;"></span>
          </button>
        </div>
      </td>
    `;

    tBody?.append(trElem);

    wooMethod.value =  Methods.NOT_SELECTED;
    wooTime.value = '';
    wooObjects.value = '';
    wooZones.value = '';
    wooMethod.classList.remove('is-invalid');
    wooTime.classList.remove('is-invalid');
  } else if (!wooMethod.value || wooMethod.value === Methods.NOT_SELECTED) {
    isInvalidElem(wooMethod);
    showToast('Выберите метод', 'error');
    wooMethod.addEventListener('change', () => {
      if (wooMethod.value !== Methods.NOT_SELECTED) {
        isValidElem(wooMethod);
      }
    });
  } else if (!wooTime.value || wooTimeIsOver()) {
    isInvalidElem(wooTime);
    isInvalidElem(eventEditSpentTime);

    wooTime.addEventListener('focus', () => {
      isValidElem(wooTime);
      isValidElem(eventEditSpentTime);
    });
  }

  const strEditBtnArr = Array.from(document.querySelectorAll('.edit-string'));
  const delStrBtnArr = Array.from(document.querySelectorAll('.delete-string'));

  strEditBtnArr.forEach((item) => {
    item.addEventListener('click', (e) => {
      editStringOfTable(e);
    });
  });

  delStrBtnArr.forEach((item) => {
    item.addEventListener('click', (e) => {
      deleteStringOfTable(e);
    });
  });

  const editStringOfTable = (ev: Event) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = (ev.target as HTMLElement).closest('tr');
      let tdArr: HTMLElement[] = [];
      if (edString) {
        tdArr = Array.from(edString.querySelectorAll('td'));
      }
      tdArr.forEach((td) => {
        if (td.classList.contains('ed')) {
          if (!td.classList.contains('methods-select')) {
            td.innerHTML = `<input class="form-control" type="number" min="1" value="${td.innerText}" onkeyup="if(this.value<0){this.value = this.value * -1}"></input>`;
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
        const editedString = (e.target as HTMLElement)?.closest('tr');
        const metSelTd = editedString?.querySelector('.methods-select');
        const selMetSel = metSelTd?.querySelector('select');

        if (selMetSel && selMetSel.value !== Methods.NOT_SELECTED) {
          switchOffEditMode(e);
        } else {
          // selMetSel?.classList.add('is-invalid');
          isInvalidElem(selMetSel!);
          selMetSel?.addEventListener('change', () => {
            if (selMetSel && selMetSel.value !== Methods.NOT_SELECTED) {
              isValidElem(selMetSel);
            } else {
              isInvalidElem(selMetSel);
            }
          });
        }
      });
      /**
       * Выключение режима редактирования строки таблицы методов
       * @param {*} ev
       */
      const switchOffEditMode = (ev: Event) => {
        const editedString = (ev.target as HTMLElement)?.closest('tr');
        let tdArray: HTMLTableCellElement[] = [];

        if (editedString) {
          tdArray = Array.from(editedString.querySelectorAll('td'));
        }

        tdArray.forEach((tdItem) => {
          if (tdItem.classList.contains('ed')) {
            if (tdItem.classList.contains('methods-select')) {
              const selectElement = tdItem.children[0] as HTMLSelectElement;
              tdItem.innerHTML = `<div class="d-flex align-items-center">
                            <div class="ms-2">${selectElement.value}</div></div>`;
            } else {
              const inputElement = tdItem.children[0] as HTMLInputElement;
              tdItem.innerText = inputElement.value;
            }
          } else {
            tdItem.innerHTML = `<div class="btn-group btn-group hover-actions methods-table-hover">
                <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
                <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
                </div>`;
          }
        });

        const editStringBtnArr = Array.from(document.querySelectorAll('.edit-string'));
        const delStrBtnArr = Array.from(document.querySelectorAll('.delete-string'));

        editStringBtnArr.forEach((item) => {
          item.addEventListener('click', (e) => {
            editStringOfTable(e);
          });
        });
        delStrBtnArr.forEach((item) => {
          item.addEventListener('click', (e) => {
            deleteStringOfTable(e);
          });
        });
        isEditMode = false;
      };
    }

    delStrBtnArr.forEach((item) => {
      item.addEventListener('click', (e) => {
        deleteStringOfTable(e);
      });
    });
  };
};

export default addMethodToClientTable;
