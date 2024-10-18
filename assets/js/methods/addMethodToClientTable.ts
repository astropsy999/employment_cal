import { Methods } from '../enums/methods';
import { MethStringObj } from '../types/methods';
import { wooTimeIsOver } from '../utils/mainGlobFunctions';
import { updateMethodSelectOptions } from '../utils/methodsUtils';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';

/**
 * Массив методов, добавленных пользователем
 */
export let wooMethodsArray: MethStringObj[] = [];

/**
 * Добавление методов в таблицу на клиенте
 */
const addMethodToClientTable = () => {
  const wooMethodSelect = document.querySelector(
    '#wooMethod',
  ) as HTMLSelectElement;
  const wooTimeInput = document.querySelector('#wooTime') as HTMLInputElement;
  const wooObjectsInput = document.querySelector(
    '#wooObjects',
  ) as HTMLInputElement;
  const wooZonesInput = document.querySelector('#wooZones') as HTMLInputElement;
  const methodsTable = document.querySelector(
    '.methods-table',
  ) as HTMLTableElement;
  const methodsTbody = methodsTable.querySelector(
    '.methods-tbody',
  ) as HTMLTableSectionElement;


  if (!validateInputs(wooMethodSelect, wooTimeInput)) {
    return;
  }

  // Создаем заголовок таблицы, если его еще нет
  createTableHeader(methodsTable);

  // Создаем объект метода
  const methodObj: MethStringObj = {
    wooMethod: wooMethodSelect.value,
    wooTime: wooTimeInput.value,
    wooObjects: wooObjectsInput?.value || '',
    wooZones: wooZonesInput?.value || '',
  };

  // Добавляем метод в массив
  wooMethodsArray.push(methodObj);

  // Обновляем селектор методов
  updateMethodSelectOptions(wooMethodSelect);

  // Добавляем строку в таблицу
  const newRow = createMethodRow(methodObj);
  methodsTbody.appendChild(newRow);

  // Очищаем поля ввода
  resetInputs(wooMethodSelect, wooTimeInput, wooObjectsInput, wooZonesInput);

  // Добавляем обработчики событий
  addRowEventListeners(newRow);
};

/**
 * Валидация входных данных
 */
const validateInputs = (
  wooMethodSelect: HTMLSelectElement,
  wooTimeInput: HTMLInputElement,
): boolean => {
  let isValid = true;
    const eventEditSpentTime = document.querySelector(
      '#eventEditSpentTime',
    ) as HTMLInputElement;

  if (
    !wooMethodSelect.value ||
    wooMethodSelect.value === Methods.NOT_SELECTED
  ) {
    isInvalidElem(wooMethodSelect);
    wooMethodSelect.addEventListener('change', () => {
      if (wooMethodSelect.value !== Methods.NOT_SELECTED) {
        isValidElem(wooMethodSelect);
      }
    });
    isValid = false;
  }

  if (!wooTimeInput.value || wooTimeIsOver()) {
    isInvalidElem(wooTimeInput);
    isInvalidElem(eventEditSpentTime);

    wooTimeInput.addEventListener('focus', () => {
      isValidElem(wooTimeInput);
      isValidElem(eventEditSpentTime);
    });
    isValid = false;
  }

  return isValid;
};

/**
 * Создание заголовка таблицы методов
 */
const createTableHeader = (methodsTable: HTMLTableElement) => {
  const existingHeader = methodsTable.querySelector('thead');
  if (!existingHeader) {
    const tHead = methodsTable.createTHead();
    tHead.classList.add('thead-dark');
    tHead.innerHTML = `<tr>
      <th scope="col" style="width: 20%">Метод</th>
      <th class="timeHeaderMeth" scope="col" style="width: 25%">Время, ч</th>
      <th scope="col" style="width: 25%">Объек&shy;тов, шт</th>
      <th scope="col" style="width: 21%">Зон/Стыков, шт</th>
      <th scope="col" style="width: 9%"></th>
    </tr>`;
  }
};

/**
 * Создание строки таблицы для метода
 */
const createMethodRow = (methodObj: MethStringObj): HTMLTableRowElement => {
  const trElem = document.createElement('tr');
  trElem.classList.add('hover-actions-trigger', 'justadded');

  trElem.innerHTML = `
    <td class="align-middle text-center text-nowrap ed methods-select">
      <div class="d-flex align-items-center">
        <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${methodObj.wooMethod}</div>
      </div>
    </td>
    <td class="align-middle text-nowrap ed wootime">${methodObj.wooTime}</td>
    <td class="align-middle text-nowrap w-auto ed">${methodObj.wooObjects}</td>
    <td class="align-middle text-nowrap ed">${methodObj.wooZones}</td>
    <td class="align-middle text-nowrap">
      <div class="btn-group btn-group hover-actions methods-table-hover">
        <button class="btn btn-light pe-2 edit-string" type="button" title="Редактировать">
          <span class="fas fa-edit" style="color: green;"></span>
        </button>
        <button class="btn btn-light ps-2 delete-string" type="button" title="Удалить">
          <span class="fas fa-trash-alt" style="color: red;"></span>
        </button>
      </div>
    </td>
  `;

  return trElem;
};

/**
 * Сброс значений полей ввода
 */
const resetInputs = (
  wooMethodSelect: HTMLSelectElement,
  wooTimeInput: HTMLInputElement,
  wooObjectsInput: HTMLInputElement,
  wooZonesInput: HTMLInputElement,
) => {
  wooMethodSelect.value = Methods.NOT_SELECTED;
  wooTimeInput.value = '';
  wooObjectsInput.value = '';
  wooZonesInput.value = '';
  wooMethodSelect.classList.remove('is-invalid');
  wooTimeInput.classList.remove('is-invalid');
};

/**
 * Добавление обработчиков событий к строке таблицы
 */
const addRowEventListeners = (row: HTMLTableRowElement) => {
  const editButton = row.querySelector('.edit-string') as HTMLButtonElement;
  const deleteButton = row.querySelector('.delete-string') as HTMLButtonElement;

  editButton.addEventListener('click', (e) => {
    editMethodRow(e, row);
  });

  deleteButton.addEventListener('click', () => {
    deleteMethodRow(row);
  });
};

/**
 * Редактирование строки таблицы методов
 */
const editMethodRow = (e: Event, row: HTMLTableRowElement) => {
  const isEditMode = row.classList.contains('edit-mode');
  if (isEditMode) return;

  row.classList.add('edit-mode');

  const cells = row.querySelectorAll('td');
  cells.forEach((cell) => {
    if (cell.classList.contains('ed')) {
      if (cell.classList.contains('methods-select')) {
        const currentValue = cell.textContent?.trim() || '';
        const selectElement = createMethodSelect(currentValue);
        cell.innerHTML = '';
        cell.appendChild(selectElement);
      } else {
        const currentValue = cell.textContent?.trim() || '';
        const inputElement = document.createElement('input');
        inputElement.classList.add('form-control');
        inputElement.type = 'number';
        inputElement.min = '1';
        inputElement.value = currentValue;
        cell.innerHTML = '';
        cell.appendChild(inputElement);
      }
    } else {
      cell.innerHTML = `
        <div class="btn-group btn-group">
          <button class="btn btn-light pe-2 save-edited" type="button" title="Сохранить">
            <i class="fa fa-check" style="color: green;"></i>
          </button>
        </div>
      `;
    }
  });

  const saveButton = row.querySelector('.save-edited') as HTMLButtonElement;
  saveButton.addEventListener('click', () => {
    saveEditedRow(row);
  });
};

/**
 * Создание селекта для выбора метода при редактировании
 */
const createMethodSelect = (currentValue: string): HTMLSelectElement => {
  const wooMethodSelect = document.querySelector(
    '#wooMethod',
  ) as HTMLSelectElement;
  const selectElement = wooMethodSelect.cloneNode(true) as HTMLSelectElement;
  selectElement.value = currentValue;

  // Обработка валидации при изменении значения
  selectElement.addEventListener('change', () => {
    if (selectElement.value !== Methods.NOT_SELECTED) {
      isValidElem(selectElement);
    } else {
      isInvalidElem(selectElement);
    }
  });

  return selectElement;
};

/**
 * Сохранение отредактированной строки таблицы
 */
const saveEditedRow = (row: HTMLTableRowElement) => {
  const selectElement = row.querySelector(
    '.methods-select select',
  ) as HTMLSelectElement;
  const inputElements = row.querySelectorAll('input');

  if (selectElement.value === Methods.NOT_SELECTED) {
    isInvalidElem(selectElement);
    return;
  }

  row.classList.remove('edit-mode');

  // Обновляем значения в ячейках
  const cells = row.querySelectorAll('td');
  cells.forEach((cell) => {
    if (cell.classList.contains('ed')) {
      if (cell.classList.contains('methods-select')) {
        const methodValue = selectElement.value;
        cell.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${methodValue}</div>
          </div>
        `;
      } else {
        const inputElement = cell.querySelector('input') as HTMLInputElement;
        cell.textContent = inputElement.value;
      }
    } else {
      cell.innerHTML = `
        <div class="btn-group btn-group hover-actions methods-table-hover">
          <button class="btn btn-light pe-2 edit-string" type="button" title="Редактировать">
            <span class="fas fa-edit" style="color: green;"></span>
          </button>
          <button class="btn btn-light ps-2 delete-string" type="button" title="Удалить">
            <span class="fas fa-trash-alt" style="color: red;"></span>
          </button>
        </div>
      `;
    }
  });

  // Обновляем обработчики событий
  addRowEventListeners(row);
};

/**
 * Удаление строки таблицы методов
 */
const deleteMethodRow = (row: HTMLTableRowElement) => {
  row.remove();
  // Здесь можно добавить удаление элемента из массива wooMethodsArray, если требуется
};

export default addMethodToClientTable;

