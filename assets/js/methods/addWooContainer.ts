import { selRemoveValidation } from '../utils/mainGlobFunctions';
import addMethodToClientTable from './addMethodToClientTable';
import { settings } from '../api/settings';
import { TaskType } from '../enums/taskTypes';
import { Locations } from '../enums/locations';
import { removeCheckMark, showCheckMark } from '../utils/uiUtils';
import getMethodsDropDown from '../api/getMethodsDropDown';

/**
 * Добавление контейнера для монтажа таблицы методов в модальное окно
 * @param {HTMLElement} etarget - Контейнер модального окна
 */
const addWooContainer = (etarget: HTMLElement) => {
  const findTaskSubtaskRegion = etarget.querySelector('.tasksubtaskregion');
  const findTypeOfTasks = etarget.querySelector(
    '.typeoftasks',
  ) as HTMLSelectElement;
  const findTypeOfSubTask = etarget.querySelector(
    '.typeofsubtask',
  ) as HTMLSelectElement;
  const wooElem = etarget.querySelector('.woo') as HTMLDivElement;
  const locationInput = etarget.querySelector('.location') as HTMLInputElement;



  /**
   * Добавление обработчиков для ввода числовых значений
   * @param {HTMLInputElement} input - элемент input
   */
  const addNumericInputHandler = (input: HTMLInputElement) => {
    input.addEventListener('input', () => {
      const value = parseFloat(input.value);
      if (isNaN(value) || value < 0) {
        input.value = '';
      }
    });
  };

  /**
   * Показ таблицы методов
   */
  const showWooElem = async () => {
    if (!wooElem) return;

    wooElem.innerHTML = `
      <h5 class="modal-title woo-title">Методы контроля</h5>
      <div class="row work-on-object m-1">
        <div class="col-md-2 mb-2 p-0 pr-1">
          <select class="form-select" id="wooMethod" title="Метод контроля">
            <option value="Не выбрано" selected>Не выбрано</option>
          </select>
        </div>
        <div class="col-md-3 mb-2 pr-0">
          <input class="form-control" id="wooTime" type="number" placeholder="Продолжительность, ч" step="0.5" min="0.5" max="24" />
        </div>
        <div class="col mb-2 pr-1">
          <input class="form-control" id="wooObjects" type="number" min="1" placeholder="Кол-во объектов" />
        </div>
        <div class="col mb-2 p-0">
          <input class="form-control" id="wooZones" type="number" min="1" placeholder="Кол-во зон/стыков" />
        </div>
        <div class="col-md-1 mb-2">
          <button class="btn btn-success" type="button" id="addWooMethod">
            <span class="fas fa-plus"></span>
          </button>
        </div>
      </div>
      <div class="table-responsive scrollbar">
        <table class="table table-hover table-sm methods-table table-bordered">
          <tbody class="methods-tbody"></tbody>
        </table>
      </div>
    `;

    const wooMethodSelect = wooElem.querySelector(
      '#wooMethod',
    ) as HTMLSelectElement;
    await getMethodsDropDown(wooMethodSelect);

    const wooTimeInput = wooElem.querySelector('#wooTime') as HTMLInputElement;
    const wooObjectsInput = wooElem.querySelector(
      '#wooObjects',
    ) as HTMLInputElement;
    const wooZonesInput = wooElem.querySelector(
      '#wooZones',
    ) as HTMLInputElement;

    addNumericInputHandler(wooTimeInput);
    addNumericInputHandler(wooObjectsInput);
    addNumericInputHandler(wooZonesInput);

    const addWooMethodBtn = wooElem.querySelector(
      '#addWooMethod',
    ) as HTMLButtonElement;
    addWooMethodBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      addMethodToClientTable();
    });

    const modalElement = etarget.closest('.modal');
    modalElement?.addEventListener(
      'hidden.bs.modal',
      () => {
        wooElem.innerHTML = '';
      },
      { once: true },
    );
  };

  /**
   * Обработчик изменения локации
   */
  const handleLocationChange = () => {
    if (locationInput?.value === Locations.CLIENT) {
      showCheckMark(etarget);
    } else {
      removeCheckMark(etarget);
    }

    if (locationInput?.value === Locations.ON_ROAD) {
      selRemoveValidation(findTypeOfTasks);
    }
  };

  /**
   * Обработчик изменения типа задачи
   */
  const handleTaskTypeChange = () => {
    if (
      findTypeOfTasks?.value === TaskType.TECHNICAL_DIAGNOSTIC ||
      (findTypeOfTasks?.value === TaskType.LABORATORY_WORK &&
        findTypeOfSubTask?.value === TaskType.LABORATORY_CONTROL)
    ) {
      showWooElem();
      wooElem?.style.setProperty('display', 'block');
    } else {
      wooElem?.style.setProperty('display', 'none');
      removeCheckMark(etarget);
    }
  };

  // Инициализация
  locationInput?.addEventListener('change', handleLocationChange);
  findTypeOfTasks?.addEventListener('change', handleTaskTypeChange);
  findTypeOfSubTask?.addEventListener('change', handleTaskTypeChange);

  // Начальная установка
  handleLocationChange();
  handleTaskTypeChange();
};

export default addWooContainer;
