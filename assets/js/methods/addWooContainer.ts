import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';
import getBrigadeWorkers from '../api/getBrigadeWorkers';
import { getMethodsDropDown } from '../api/getDropDownData';
import { settings } from '../api/settings';
import { Locations } from '../enums/locations';
import { Methods } from '../enums/methods';
import { TaskType } from '../enums/taskTypes';
import { setLocalStorageItem } from '../utils/localStorageUtils';
import { selRemoveValidation, wooTimeIsOver } from '../utils/mainGlobFunctions';
import { initials } from '../utils/textsUtils';
import addMethodToClientTable from './addMethodToClientTable';
import { showToast } from '../utils/toastifyUtil';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';

/**
 * Добавление контейнера для монтажа таблицы методов в модальное окно
 * @param {*} etarget
 */
const addWooContainer = (etarget: HTMLElement) => {
  const findTaskSubtaskRegion = etarget.querySelector('.tasksubtaskregion');
  const findTypeOfTasks = etarget.querySelector('.typeoftasks') as HTMLSelectElement;
  const findTypeOfSubTask = etarget.querySelector('.typeofsubtask') as HTMLSelectElement;
  const wooElem = etarget.querySelector('.woo') as HTMLDivElement;
  const location = etarget.querySelector('.location') as HTMLInputElement;
  

  // Хранение ссылок на динамически добавленные элементы
  let brigadirCheckbox: HTMLDivElement | null = null;
  let brigadeSelect: HTMLDivElement | null = null;

  // Глобальная переменная для хранения экземпляра Choices.js
  let brigadeChoicesInstance: Choices | null = null;


  /**
   * Показ галочки КР
   */
  const showCheckMark = () => {
    const checkMarkRow = etarget.querySelector('.check-mark');
    const checkElem = checkMarkRow?.querySelector('.check-elem');

    if (!checkElem && settings.isKRChekboxAvailable) {
      // Добавляем галочку
      const checkMarkElem = document.createElement('div');
      checkMarkElem.classList.add('col-md-1', 'check-elem');
      checkMarkElem.innerHTML = `
        <div class="">
          <label class="fs-0 check-label" for="flexCheckDefault">КР</label>
          <input class="form-control form-check-input" type="checkbox" value="" id="flexCheckDefault">
        </div>`;
      checkMarkRow?.append(checkMarkElem);
    }
  };

  /**
   * Показ таблицы методов в зависимости от наличия их в базе данных
   */
  const showWooElem = () => {
    // Проверяем, чтобы элементы не добавлялись повторно
    if (wooElem?.innerHTML.trim() !== '') return;

    const wooElemDiv = document.createElement('div') as HTMLDivElement;
    wooElemDiv.innerHTML = `
      <h5 class="modal-title woo-title">Методы контроля</h5>
      <div class="row work-on-object m-1">
        <div class="col-md-2 mb-2 p-0 pr-1">
          <select class="form-select" id="wooMethod" role="tooltip" title="Метод контроля" data-placement="bottom">
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
            <span class="fas fa-plus"></span>
          </button>
        </div>
      </div>
    `;
    wooElem?.append(wooElemDiv);

    const wooMethod = etarget.querySelector('#wooMethod') as HTMLSelectElement;

    getMethodsDropDown(wooMethod);

    const wooTitle = wooElem?.querySelector('.woo-title');

    const tableElemHeader = document.createElement('div');
    tableElemHeader.innerHTML = `
      <div class="table-responsive scrollbar">
        <table class="table table-hover table-sm methods-table table-bordered">
          <tbody class="methods-tbody"></tbody>
        </table>
      </div>
    `;
    wooTitle?.after(tableElemHeader);

    document.addEventListener(
      'hidden.bs.modal',
      () => {
        wooElem!.innerHTML = '';
      },
      { once: true },
    );


    const addWooMetBtn = wooElem?.querySelector('#addWooMet');

    addWooMetBtn?.addEventListener('click', (e) => {
        e.preventDefault();

        const wooTime = etarget.querySelector('#wooTime') as HTMLInputElement;
        const wooMethod = etarget.querySelector('#wooMethod') as HTMLSelectElement;

          // Получение выбранного метода контроля
          const selectedOption = wooMethod.options[wooMethod.selectedIndex];
          const methodID = selectedOption.getAttribute('methodid');
          const isRK = methodID === Methods.RK_CLASSIC || methodID === Methods.RK_CRG;

          // Валидация формы
          let isValid = true;

          // Валидация метода контроля
          if (!wooMethod.value || wooMethod.value === Methods.NOT_SELECTED) {
            isInvalidElem(wooMethod);
            showToast('Выберите метод контроля', 'error');
            isValid = false;
          } else {
            isValidElem(wooMethod);
          }

         // Валидация времени
          if (!wooTime.value || wooTimeIsOver()) {
            isInvalidElem(wooTime);
            showToast('Некорректное время', 'error');
            isValid = false;
            return;
          } else {
            isValidElem(wooTime);
          }

        
        if (brigadeChoicesInstance) {
          const selectedValues = brigadeChoicesInstance.getValue(true);
          const isEmptyBrigade = selectedValues.length === 0
          
          if (isEmptyBrigade) {
            showToast('Выберите работников бригады', 'error');
            return;
          } else {
            isValid = true
          }
          
        }

        addMethodToClientTable();
        isValid && isRK && removeBrigadirElements();

    });

    // Добавляем слушатель изменения для wooMethod после его создания
    wooMethod?.addEventListener('change', handleChangeEvent);
  };

  /**
   * Обработчик события изменения элементов внутри wooElem
   */
  const handleChangeEvent = (e: Event) => {
    const target = e.target as HTMLElement;

    // Обработка изменения элемента 'location'
    if (location?.value === Locations.CLIENT) {
      showCheckMark();
    } else {
      const relCheckEl = etarget.querySelector('.check-elem');
      if (relCheckEl) {
        relCheckEl.remove();
      }
    }

    // Проверяем, изменился ли элемент с id 'wooMethod'
    if (target.id === 'wooMethod') {
      const wooMethodSelect = target as HTMLSelectElement;
      const selectedOption = wooMethodSelect.options[wooMethodSelect.selectedIndex];
      const methodID = selectedOption.getAttribute('methodid');
      const isRK = methodID === Methods.RK_CLASSIC || methodID === Methods.RK_CRG;

      // Проверяем значение methodID и выполняем соответствующие действия
      if (isRK) {
        addBrigadirElements();
      } else {
        removeBrigadirElements();
      }
    }
  };

  /**
   * Добавление чекбокса "Я бригадир" и селектора "бригада"
   */
  const addBrigadirElements = async () => {
    // Данные о выбранном методе в сторе
    setLocalStorageItem('isRK', true);
    // Проверяем, не добавлены ли уже элементы
    if (brigadirCheckbox || brigadeSelect) return;

    const workOnObjectRow = wooElem?.querySelector('.work-on-object');
    console.log('workOnObjectRow: ', workOnObjectRow);
    if (!workOnObjectRow) return;

    // Создание чекбокса "Я бригадир"
    brigadirCheckbox = document.createElement('div');
    brigadirCheckbox.classList.add('col-md-2', 'mb-2', 'p-0', 'pr-1');
    brigadirCheckbox.innerHTML = `
      <div class="">
        <label class="form-check-label" for="brigadirCheckbox">Я бригадир</label>
        <input class="form-check-input" type="checkbox" id="brigadirCheckbox">
      </div>

    `;

    // Создание селектора "бригада"
    brigadeSelect = document.createElement('div');
    brigadeSelect.classList.add('col-md-6', 'mb-2', 'pr-1');
    brigadeSelect.innerHTML = `
      <select class="form-select" id="brigadeSelect" multiple>
        <!-- Опции будут динамически добавлены через TypeScript -->
      </select>
    `;

     // Получаем список работников бригады
  const brigadeWorkers = await getBrigadeWorkers();

  const brigadeSelectElement = brigadeSelect?.querySelector('#brigadeSelect') as HTMLSelectElement;

   // Заполняем селектор работниками бригады
   brigadeWorkers?.forEach((worker) => {
    const {ID: id, Name: name} = worker;
    const option = document.createElement('option');
    option.value = id;
    option.text = initials(name);
    brigadeSelectElement.appendChild(option);
  });

  // Инициализируем Choices.js на селекторе "бригада"
  brigadeChoicesInstance = new Choices(brigadeSelectElement, {
    removeItemButton: true,
    searchResultLimit: 100,
    renderChoiceLimit: 100,
    shouldSort: false,
    placeholderValue: 'Выберите работников бригады',
    noResultsText: 'Ничего не найдено',
    itemSelectText: '',
  });

  // Хранение экземпляра Choices для последующей очистки при удалении
  brigadeSelect.dataset.choices = 'true'; // Маркируем, что Choices инициализирован

    // Вставляем элементы после селектора 'wooMethod' (первый дочерний элемент строки)
    const children = Array.from(workOnObjectRow.children);
    if (children.length >= 1) {
      workOnObjectRow.insertBefore(brigadeSelect, children[1]);
      workOnObjectRow.insertBefore(brigadirCheckbox, children[1]);
    }
  };

  /**
   * Удаление чекбокса "Я бригадир" и селектора "бригада"
   */
  const removeBrigadirElements = () => {
    setLocalStorageItem('isRK', false);
    if (brigadirCheckbox) {
      brigadirCheckbox.remove();
      brigadirCheckbox = null;
    }
    if (brigadeSelect) {
      brigadeSelect.remove();
      brigadeSelect = null;
    }
  };

  /**
   * Отслеживание изменений селектора Локация
   */
  const watchForLocationChange = () => {
    // Удаляем предыдущий слушатель, чтобы избежать дублирования
    findTaskSubtaskRegion?.removeEventListener('change', watchForLocationChange);
    findTaskSubtaskRegion?.addEventListener('change', watchForLocationChange);

    if (
      findTypeOfTasks?.value === TaskType.TECHNICAL_DIAGNOSTIC ||
      (findTypeOfTasks?.value === TaskType.LABORATORY_WORK &&
        findTypeOfSubTask?.value === TaskType.LABORATORY_CONTROL)
    ) {
      showWooElem();
      wooElem!.style.display = 'block';
    } else {
      wooElem!.style.display = 'none';
      removeBrigadirElements();
      const relCheckEl = etarget.querySelector('.check-elem');
      if (relCheckEl) {
        relCheckEl.remove();
      }
    }

    if (location?.value === Locations.ON_ROAD) {
      selRemoveValidation(findTypeOfTasks);
    }
  };

  if (findTypeOfTasks) {
    const initialFLValue =
      findTypeOfTasks?.options[findTypeOfTasks.selectedIndex]?.value;
    if (initialFLValue !== TaskType.TECHNICAL_DIAGNOSTIC) {
      watchForLocationChange();
    } else if (initialFLValue === TaskType.TECHNICAL_DIAGNOSTIC) {
      showWooElem();
      watchForLocationChange();
    }
  }

  if (location?.value === Locations.CLIENT) {
    showCheckMark();
  }

  if (location?.value === Locations.ON_ROAD) {
    selRemoveValidation(findTypeOfTasks);
  }

  /**
   * Основной обработчик события изменения
   * Добавляем его только после создания элементов
   */
  etarget.addEventListener('change', handleChangeEvent);
};

export default addWooContainer;
