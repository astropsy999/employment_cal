import { getMethodsDropDown } from '../api/getDropDownData';
import addMethodToClientTable from './addMethodToClientTable';
import { selRemoveValidation } from '../utils/mainGlobFunctions';
import { settings } from '../api/settings';

/**
 * Добавление контейнера для монтажа таблицы методов в модальное окно
 * @param {*} etarget
 */
const addWooContainer = (etarget) => {
  const findTaskSubtaskRegion = etarget.querySelector('.tasksubtaskregion');
  const findTypeOfTasks = etarget.querySelector('.typeoftasks');
  const findTypeOfSubTask = etarget.querySelector('.typeofsubtask');
  const wooElem = etarget.querySelector('.woo');
  const location = etarget.querySelector('.location');
  /**
   * Показ галочки КР
   */
  const showCheckMark = () => {
    const checkMarkRow = etarget.querySelector('.check-mark');
    const checkElem = checkMarkRow.querySelector('.check-elem');

    if (!checkElem && settings.isKRChekboxAvailable) {
      // Add check mark
      const checkMarkElem = document.createElement('div');
      checkMarkElem.classList.add('col-md-1', 'check-elem');
      checkMarkElem.innerHTML = `<div class="">
        <label class="fs-0 check-label" for="flexCheckDefault">КР</label>
        <input class="form-control form-check-input" type="checkbox" value="" id="flexCheckDefault">
        </div>`;

      checkMarkRow.append(checkMarkElem);
    }
  };
  /**
   * Показ таблицы методов в зависимости от наличия их в базе данных
   */
  const showWooElem = () => {
    const wooElemDiv = document.createElement('div');
    wooElem.innerHTML = `
        <h5 class="modal-title woo-title">Методы контроля</h5>
        <div class="row work-on-object m-1">
            <div class="col-md-2 mb-2 p-0 pr-1">
                <select class="form-select" id="wooMetod" role="tooltip" title="Метод контроля" data-placement="bottom" >
                        <option value="Не выбрано" selected="selected">Не выбрано</option>
                </select>
            </div>
            <div class="col-md-3 mb-2 pr-0">
                <input class="form-control" id="wooTime" type="number" placeholder="Продолжительность, ч" step="0.5" min="0.5" max="24" onkeyup="if(this.value<0){this.value = this.value * -1}" />
            </div>
            <div class="col mb-2 pr-1">
                <input class="form-control" id="wooObjects" type="number"  min="1" placeholder="Кол-во объектов" onkeyup="if(this.value<0){this.value = this.value * -1}" />
            </div>
            <div class="col mb-2 p-0">
                <input class="form-control" id="wooZones" type="number" min="1" placeholder="Кол-во зон/стыков" onkeyup="if(this.value<0){this.value = this.value * -1}" />
            </div>
            <div class="col-md-1 mb-2">
                <button class="btn btn-success" type="button" id="addWooMet">
                <span class="fas fa-plus"></span></button>
            </div>
        </div>
        `;
    wooElem.append(wooElemDiv);

    const wooMetod = etarget.querySelector('#wooMetod');

    getMethodsDropDown(wooMetod);

    const wooTitle = document.querySelector('.woo-title');

    const tableElemHeader = document.createElement('div');
    tableElemHeader.innerHTML = `<div class="table-responsive scrollbar">
              <table class="table table-hover table-sm methods-table table-bordered">
                <tbody class="methods-tbody">
                </tbody>
             </table>
        </div>
        `;
    wooTitle.after(tableElemHeader);

    document.addEventListener(
      'hidden.bs.modal',
      () => {
        wooElem.innerHTML = '';
      },
      { ones: true },
    );

    const addWooMetBtn = document.querySelector('#addWooMet');

    addWooMetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addMethodToClientTable();
    });
  };

  etarget.addEventListener('change', () => {
    if (location?.value === 'Заказчик') {
      showCheckMark();
    } else {
      const relCheckEl = document.querySelector('.check-elem');
      if (relCheckEl) {
        relCheckEl.remove();
      }
    }
  });
  /**
   * Отслеживание изменений селектора Локация
   */
  const watchForLocationChange = () => {
    findTaskSubtaskRegion.removeEventListener('change', watchForLocationChange);
    findTaskSubtaskRegion.addEventListener('change', watchForLocationChange);
    if (
      findTypeOfTasks.value === 'Техническое диагностирование' ||
      (findTypeOfTasks.value === 'Общелабораторные работы' &&
        findTypeOfSubTask.value === 'Проведение контроля в лаборатории')
    ) {
      showWooElem();
      wooElem.style.display = 'block';
    } else {
      wooElem.style.display = 'none';
      const relCheckEl = document.querySelector('.check-elem');
      if (relCheckEl) {
        relCheckEl.remove();
      }
    }

    if (location?.value === 'В дороге') {
      selRemoveValidation(findTypeOfTasks);
    }
  };

  if (findTypeOfTasks) {
    const initialFLValue =
      findTypeOfTasks?.options[findTypeOfTasks.selectedIndex]?.value;
    if (initialFLValue !== 'Техническое диагностирование') {
      watchForLocationChange();
    } else if (initialFLValue === 'Техническое диагностирование') {
      showWooElem();
      watchForLocationChange();
    }
  }

  if (location?.value === 'Заказчик') {
    showCheckMark();
  }

  if (location?.value === 'В дороге') {
    selRemoveValidation(findTypeOfTasks);
  }
};

export default addWooContainer;
