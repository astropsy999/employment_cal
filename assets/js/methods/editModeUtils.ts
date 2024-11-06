import Choices from "choices.js";
import getBrigadeWorkers from "../api/getBrigadeWorkers";
import { initials } from "../utils/textsUtils";

export function createBrigadeEditTD(selectedTeamList?: string, isBrigadier?: string) {
    const brigadeEditTD = document.createElement('td');
    brigadeEditTD.classList.add('brigade-edit-td');
  
    // Создаем общий контейнер для чекбокса и селектора бригады
    const brigadeContainer = document.createElement('div');
    brigadeContainer.classList.add('brigade-container', 'd-flex', 'align-items-center', 'mb-2', 'p-1', 'w-90');
  
    // Создаем контейнер для чекбокса "Я бригадир"
    const isBrigadierContainer = document.createElement('div');
    isBrigadierContainer.classList.add('form-check', 'mr-2', 'd-flex', 'align-items-center', 'flex-column', 'p-1');
  
    isBrigadierContainer.innerHTML = `
      <label class="form-check-label fs-small" for="brigadirEditCheckbox">Я бригадир</label>
      <input class="form-check-input" type="checkbox" id="brigadirEditCheckbox">
    `;
  
    // Устанавливаем состояние чекбокса на основе isBrigadier
    const brigadirEditCheckbox = isBrigadierContainer.querySelector('#brigadirEditCheckbox') as HTMLInputElement;
    brigadirEditCheckbox.checked = isBrigadier === 'Да';
  
    // Создаем контейнер для селектора бригады
    const brigadeSelectContainer = document.createElement('div');
    brigadeSelectContainer.classList.add('w-100'); // Занимает всю оставшуюся ширину
  
    brigadeSelectContainer.innerHTML = `
      <select class="form-select" id="brigadeSelectEdit" multiple>
        <!-- Опции будут динамически добавлены через TypeScript -->
      </select>
    `;
  
    // Добавляем чекбокс и селектор в общий контейнер
    brigadeContainer.appendChild(isBrigadierContainer);
    brigadeContainer.appendChild(brigadeSelectContainer);
  
    brigadeEditTD.append(brigadeContainer);
  
    const selectElement = brigadeSelectContainer.querySelector('select') as HTMLSelectElement;
  
    // Получаем список работников бригады и добавляем их в селектор
    getBrigadeWorkers().then((brigadeWorkersList) => {
      if (brigadeWorkersList) {
        // Создаем карту соответствия имен и ID
        const nameToIDMap = new Map<string, string>();
  
        // Заполняем селектор опциями
        brigadeWorkersList.forEach((worker) => {
          const { ID: id, Name: name } = worker;
          nameToIDMap.set(name, id);
  
          const option = document.createElement('option');
          option.value = id;
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
          // Разбиваем selectedTeamList на массив имен
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
  
    return brigadeEditTD;
  }
  

export function showBrigadeColumn(
    edHeaderRow: HTMLTableRowElement,
    methodsTD: HTMLTableCellElement,
    edString: HTMLTableRowElement,
    selectedTeamList?: string,
    isBrigadier?: string
  ) {
    // Добавляем заголовок "Бригада" в шапку таблицы, если его нет
    let existingBrigadeHeader = edHeaderRow.querySelector('.brigade-header');
    if (!existingBrigadeHeader) {
      const brigadeHeaderTH = document.createElement('th');
      brigadeHeaderTH.scope = 'col';
      brigadeHeaderTH.style.width = '15%';
      brigadeHeaderTH.classList.add('brigade-header');
      brigadeHeaderTH.textContent = 'Бригада';
  
      // Вставляем новый <th> после первого <th>
      const methodTH = edHeaderRow.querySelector('th:first-child');
      methodTH?.insertAdjacentElement('afterend', brigadeHeaderTH);
    }
  
    // Добавляем колонку "Бригада" в строку редактирования, если её нет
    let brigadeEditTD = edString.querySelector('.brigade-edit-td') as HTMLTableCellElement;
    if (!brigadeEditTD) {
      brigadeEditTD = createBrigadeEditTD(selectedTeamList, isBrigadier);
  
      // Вставляем новый <td> после первого <td>
      methodsTD.insertAdjacentElement('afterend', brigadeEditTD);
    }
  }


  export function hideBrigadeColumn(edHeaderRow: HTMLTableRowElement, edString: HTMLTableRowElement) {
    // Удаляем заголовок "Бригада" из шапки таблицы
    const existingBrigadeHeader = edHeaderRow.querySelector('.brigade-header');
    existingBrigadeHeader?.remove();
  
    // Удаляем колонку "Бригада" из строки редактирования
    const brigadeEditTD = edString.querySelector('.brigade-edit-td') as HTMLTableCellElement;
    brigadeEditTD?.remove();
  }
  