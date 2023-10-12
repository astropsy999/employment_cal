export let wooMetodsArray = [];
/**
 * Добавление методов в таблицу на клиенте
 */
const addMethodToClientTable = () => {
  const wooMetod = document.querySelector('#wooMetod');
  const wooTime = document.querySelector('#wooTime');
  const wooObjects = document.querySelector('#wooObjects');
  const wooZones = document.querySelector('#wooZones');
  const tHead = document.querySelector('.thead-dark');
  let isEditMode = false;
  /**
   * Удаление строки в таблице методов
   * @param {*} ev
   */
  const deleteStringOfTable = (ev) => {
    const delStr = ev.target.closest('tr');
    delStr.remove();
  };
  /**
   * Создание шапки таблицы методов
   */
  const addHeaderOfTable = () => {
    const metTable = document.querySelector('.methods-table');
    const tBody = metTable.querySelector('tbody');
    const tHead = metTable.querySelector('thead');
    if (!tHead) {
      const addTHead = document.createElement('thead');
      addTHead.classList.add('thead-dark');
      addTHead.innerHTML = `<tr>
                <th scope="col" style="width: 20%">Метод</th>
                <th class="timeHeaderMeth" scope="col" style="width: 25%">Время, ч</th>
                <th scope="col" style="width: 25%">Объек&shy;тов, шт</th>
                <th scope="col" style="width: 21%">Зон/Стыков, шт</th>
                <th scope="col" style="width: 9%"></th>
              </tr>`;
      tBody.before(addTHead);
    }
  };

  if (wooMetod.value && wooMetod.value !== 'Не выбрано' && wooTime.value) {
    if (!tHead) {
      addHeaderOfTable();
    }

    let methStringObj = {
      wooMetod: wooMetod.value,
      wooTime: wooTime.value,
      wooObjects: wooObjects.value,
      wooZones: wooZones.value,
    };

    wooMetodsArray.push(methStringObj);
    console.log('wooMetodsArray: ', wooMetodsArray);

    let tBody = document.querySelector('.methods-tbody');

    const trElem = document.createElement('tr');
    trElem.classList.add('hover-actions-trigger');
    trElem.classList.add('justadded');

    trElem.innerHTML = `<td class="align-middle text-center text-nowrap ed methods-select">
    <div class="d-flex align-items-center">
    <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${wooMetod.value}</div>
    </div>
    </td>
    <td class="align-middle text-nowrap ed wootime">${wooTime.value}</td>
    <td class="align-middle text-nowrap w-auto ed">
    ${wooObjects.value}
    </td>
    <td class="align-middle text-nowrap ed">${wooZones.value}</td>
    <td class="align-middle text-nowrap">
    <div class="btn-group btn-group hover-actions methods-table-hover">
    <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
    <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
    </div>
    </td>
    `;

    tBody.append(trElem);

    wooMetod.value = 'Не выбрано';
    wooTime.value = '';
    wooObjects.value = '';
    wooZones.value = '';
    wooMetod.classList.remove('is-invalid');
    wooTime.classList.remove('is-invalid');
  } else if (!wooMetod.value || wooMetod.value === 'Не выбрано') {
    wooMetod.classList.add('is-invalid');
    wooMetod.addEventListener('change', () => {
      if (wooMetod.value !== 'Не выбрано') {
        wooMetod.classList.remove('is-invalid');
      }
    });
  } else if (!wooTime.value) {
    wooTime.classList.add('is-invalid');
    wooTime.addEventListener('focus', () => {
      wooTime.classList.remove('is-invalid');
    });
  }

  const strEditBtnArr = [...document.querySelectorAll('.edit-string')];
  const delStrBtnArr = [...document.querySelectorAll('.delete-string')];

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

  const editStringOfTable = (ev) => {
    if (!isEditMode) {
      isEditMode = true;
      const edString = ev.target.closest('tr');
      let tdArr = [];
      if (edString) {
        tdArr = [...edString.querySelectorAll('td')];
      }
      tdArr.forEach((td) => {
        if (td.classList.contains('ed')) {
          if (!td.classList.contains('methods-select')) {
            td.innerHTML = `<input class="form-control" type="number" min="1" value="${td.innerText}" onkeyup="if(this.value<0){this.value = this.value * -1}"></input>`;
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
        const editedString = e.target.closest('tr');
        const metSelTd = editedString.querySelector('.methods-select');
        const selMetSel = metSelTd.querySelector('select');

        if (selMetSel.value !== 'Не выбрано') {
          switchOffEditMode(e);
        } else {
          selMetSel.classList.add('is-invalid');
          selMetSel.addEventListener('change', () => {
            if (selMetSel.value !== 'Не выбрано') {
              selMetSel.classList.remove('is-invalid');
            } else {
              selMetSel.classList.add('is-invalid');
            }
          });
        }
      });
      /**
       * Выключение режима редактирования строки таблицы методов
       * @param {*} ev
       */
      const switchOffEditMode = (ev) => {
        const editedString = ev.target.closest('tr');
        let tdArray = [];

        if (editedString) {
          tdArray = [...editedString.querySelectorAll('td')];
        }

        tdArray.forEach((tdItem) => {
          if (tdItem.classList.contains('ed')) {
            if (tdItem.classList.contains('methods-select')) {
              tdItem.innerHTML = `<div class="d-flex align-items-center">
                            <div class="ms-2">${tdItem.children[0].value}</div></div>`;
            } else {
              tdItem.innerText = tdItem.children[0].value;
            }
          } else {
            tdItem.innerHTML = `<div class="btn-group btn-group hover-actions methods-table-hover">
                <button class="btn btn-light pe-2 edit-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Редактировать"><span class="fas fa-edit" style="color: green;"></span></button>
                <button class="btn btn-light ps-2 delete-string" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Удалить"><span class="fas fa-trash-alt" style="color: red;"></span></button>
                </div>`;
          }
        });

        const editStringBtnArr = [...document.querySelectorAll('.edit-string')];
        const delStrBtnArr = [...document.querySelectorAll('.delete-string')];

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
