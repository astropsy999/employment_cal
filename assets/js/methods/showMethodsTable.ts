import { EventDef } from '@fullcalendar/core/internal';
import deleteMethodFromTableApi from '../api/deleteMethodFromTableApi';
import getMethodsDropDown from '../api/getMethodsDropDown';
import saveEditedMethodToBaseApi from '../api/saveEditedMethodToBaseApi';
import { Methods } from '../enums/methods';
import { TaskType } from '../enums/taskTypes';
import { MethodData } from '../types/methods';
import { createMethodsTableBody, createMethodsTableHead } from '../utils/methodsUtils';
import { isInvalidElem, isValidElem } from '../utils/toggleElem';
import getBrigadeWorkers from '../api/getBrigadeWorkers';
import { populateBrigadeSelect } from '../utils/populateBrigadeSelect';
import Choices from 'choices.js';
import { initials, initialsStr } from '../utils/textsUtils';

/**
 * Показ/скрытие таблицы с методами
 * @param {*} eventInfo
 * @param {*} wooElem
 * @param {*} api
 */
const showMethodsTable = (eventInfo: EventDef, wooElem: HTMLElement, api:{[key:string]: string}) => {

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
  createMethodsTableBody(methodsArray!, tBody);


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
          tdItem.innerHTML = `
            <div class="d-flex align-items-center">
              <div class="ms-2 fw-bold badge bg-info text-wrap p-2 shadow-sm">${tdItemChildren.value}</div>
            </div>
            `;
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
  const editStringOfTableBase = (ev: Event) => {

    if (!isEditMode) {
      isEditMode = true;
      const edString = (ev.target as HTMLElement)?.closest('tr');
      let tdArr: HTMLTableCellElement[] = [];
      if (edString) {
        tdArr = Array.from(edString.querySelectorAll('td'));
        const methodsTD = tdArr[0];
        const selectedTeamList = methodsTD.querySelector('button')?.getAttribute('title');
    
        if (selectedTeamList?.length) {
          const brigadeEditTD = document.createElement('td');
    
          // Создаём контейнер для селектора бригады
          const brigadeSelectContainer = document.createElement('div');
          brigadeSelectContainer.classList.add('mb-2', 'pr-1', 'w-100');
    
          // Создаём селектор "бригада"
          brigadeSelectContainer.innerHTML = `
            <select class="form-select" id="brigadeSelectEdit" multiple>
              <!-- Опции будут динамически добавлены через TypeScript -->
            </select>
          `;
    
          brigadeEditTD.append(brigadeSelectContainer);
    
          // Вставляем новый <td> после первого <td>
          methodsTD.insertAdjacentElement('afterend', brigadeEditTD);
    
          const selectElement = brigadeSelectContainer.querySelector('select') as HTMLSelectElement;
    
          // Получаем список работников бригады и добавляем их в селектор
          getBrigadeWorkers().then((brigadeWorkersList) => {
            console.log("🚀 ~ editStringOfTableBase ~ brigadeWorkersList:", brigadeWorkersList);
    
            if (brigadeWorkersList) {
              // Создаём карту соответствия имён и ID
              const nameToIDMap = new Map<string, string>();
    
              // Заполняем селектор опциями
              brigadeWorkersList.forEach((worker) => {
                const { ID: id, Name: name } = worker;
                nameToIDMap.set(name, id);
    
                const option = document.createElement('option');
                option.value = id; // Используем ID в качестве value
                option.text = initials(name); // Отображаем инициалы имени
                selectElement.appendChild(option);
              });
    
              // Инициализируем Choices.js на селекторе "бригада"
              const brigadeChoicesInstanceEdit = new Choices(selectElement, {
                removeItemButton: true,
                searchResultLimit: 100,
                renderChoiceLimit: 100,
                shouldSort: false,
                placeholderValue: 'Отредактируйте список работников бригады',
                noResultsText: 'Ничего не найдено',
                itemSelectText: '',
              });
    
              // Предварительно выбираем уже выбранные значения
              if (selectedTeamList) {
                // Разбиваем selectedTeamList на массив имён
                const selectedNames = selectedTeamList.split(',').map((name) => name.trim());
    
                // Получаем соответствующие ID выбранных пользователей
                const selectedIDs: string[] = selectedNames
                  .map((name) => nameToIDMap.get(name))
                  .filter((id): id is string => id !== undefined);
    
                // Устанавливаем выбранные значения в Choices.js
                brigadeChoicesInstanceEdit.setChoiceByValue(selectedIDs);
              }
            }
          });
        }
      }
    
    
      tdArr.forEach(async(td) => {
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
          td.innerHTML = `
            <div class="btn-group btn-group">
              <button class="btn btn-light pe-2 save-edited" type="button" title="Сохранить">
                <i class="fa fa-check" style="color: green;"></i>
              </button>
            </div>
            `;
        }
      });

      const saveEditedBtn = edString?.querySelector('.save-edited') as HTMLButtonElement;
      
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
   * Удаление строки из таблицы методов
   * @param {*} ev
   */
  const deleteStringOfTableBase = (ev: Event) => {
    const delStr = (ev.target as HTMLElement)?.closest('tr');
    const methDelID = delStr?.getAttribute('editid');
    if (!methDelID) {
      console.error('Не найден ID метода для удаления');
      return;
    }
  
    // Удаляем строку из таблицы
    delStr?.remove();

    // Удаляем метод из базы данных
    deleteMethodFromTableApi(methDelID);
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
