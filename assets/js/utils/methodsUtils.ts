import { method } from "lodash";
import { MethodObj } from "../types/methods";
import Choices from "choices.js";
import { getLocalStorageItem } from "./localStorageUtils";

/**
 * Функция создает шапку для таблицы с методами
 * @param {HTMLElement} wooElem - Элемент после которого будет вставлена таблица
 */
export const createMethodsTableHead = (wooElem: HTMLElement): void => {
    const tableElemHeader = document.createElement('div');
    tableElemHeader.classList.add('table-responsive', 'scrollbar');
    
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-sm', 'table-bordered');
    
    const thead = document.createElement('thead');
    thead.classList.add('thead-dark');
    
    const tr = document.createElement('tr');
    tr.classList.add('rounded-2');
    
    const headers = [
        { text: 'Метод', width: '20%' },
        { text: 'Время, ч', width: '25%' },
        { text: 'Объек­тов, шт', width: '25%' },
        { text: 'Зон/Стыков, шт', width: '21%' },
        { text: '', width: '9%' },
    ];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.style.width = header.width;
        th.innerHTML = header.text;
        tr.appendChild(th);
    });
    
    thead.appendChild(tr);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    tbody.classList.add('methods-tbody');
    table.appendChild(tbody);
    
    tableElemHeader.appendChild(table);
    
    wooElem.after(tableElemHeader);
};

/**
 * Создает тело таблицы методов, добавляя строки для каждого метода.
 * @param {MethodObject[]} methodsArray - Массив методов.
 * @param {HTMLElement} tBody - Элемент tbody, в который будут добавлены строки.
 */
export const createMethodsTableBody = (
    methodsArray: MethodObj[],
    tBody: HTMLElement,
) => {
    console.log("🚀 ~ methodsArray:", methodsArray)
    if (tBody && methodsArray) {
        methodsArray.forEach((methodObj) => {
            const methodName = Object.keys(methodObj)[0];
            const methodParams = methodObj[methodName];

            const {isBrigadier, teamList} = methodParams

            // Создаем строку таблицы
            const trElem = document.createElement('tr');
            trElem.setAttribute('editid', methodParams.editID!);
            trElem.classList.add('hover-actions-trigger');

            // Создаем ячейки таблицы
            const methodCell = document.createElement('td');
            methodCell.classList.add(
                'align-middle',
                'text-center',
                'text-nowrap',
                'ed',
                'methods-select',
        );

        const methodDiv = document.createElement('div');
        methodDiv.classList.add('d-flex', 'align-items-center');

        const methodBadge = document.createElement('div');
        methodBadge.classList.add(
            'ms-2',
            'fw-bold',
            'badge',
            'bg-info',
            'text-wrap',
            'p-2',
            'shadow-sm',
        );
        methodBadge.textContent = methodName;

        const teamBadge = document.createElement('button');
        teamBadge.classList.add(
            'brigade-btn',
            'ms-2',
            'border-0',
            'radius-sm',
            'color-white',
        )
        teamBadge.setAttribute('type', 'button')



        const teamIcon = document.createElement('i');
        teamIcon.classList.add('fa', 'fa-users', 'color-white');
        const brigadeColorSpan = document.createElement('span');
        brigadeColorSpan.style.color = 'blue';
        const brigadierIcon = document.createElement('i');

        brigadierIcon.classList.add('fa', 'fa-user', 'pr-1');


        teamIcon.setAttribute('aria-hidden', 'true');
        brigadierIcon.setAttribute('aria-hidden', 'true');
        brigadeColorSpan.appendChild(brigadierIcon)

        isBrigadier === 'Да' && teamBadge.appendChild(brigadeColorSpan);
        teamBadge.appendChild(teamIcon);
        
        teamBadge.setAttribute('title', `${teamList}`)
        teamBadge.setAttribute('data-is-brigadier', `${isBrigadier}`)

        

        methodDiv.appendChild(methodBadge);
        
        if(teamList) {
            methodDiv.appendChild(teamBadge);
        }
        methodCell.appendChild(methodDiv);

        const durationCell = document.createElement('td');
        durationCell.classList.add('align-middle', 'text-nowrap', 'ed', 'wootime');
        durationCell.textContent = methodParams.duration.toString();

        const objQuantCell = document.createElement('td');
        objQuantCell.classList.add('align-middle', 'ed');
        objQuantCell.textContent = methodParams.objQuant.toString();

        const zonesCell = document.createElement('td');
        zonesCell.classList.add('align-middle', 'text-nowrap', 'ed');
        zonesCell.textContent = methodParams.zones.toString();

        const actionsCell = document.createElement('td');
        actionsCell.classList.add('align-middle', 'text-nowrap');

        // Создаем группу кнопок для редактирования и удаления строки
        const btnGroupDiv = document.createElement('div');
        btnGroupDiv.classList.add(
            'btn-group',
            'btn-group',
            'hover-actions',
            'methods-table-hover',
            );

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-light', 'pe-2', 'edit-string');
        editButton.type = 'button';
        editButton.title = 'Редактировать';

        const editIcon = document.createElement('span');
        editIcon.classList.add('fas', 'fa-edit');
        editIcon.style.color = 'green';

        editButton.appendChild(editIcon);

        // Добавляем кнопки в группу
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-light', 'ps-2', 'delete-string');
        deleteButton.type = 'button';
        deleteButton.title = 'Удалить';

        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('fas', 'fa-trash-alt');
        deleteIcon.style.color = 'red';

        deleteButton.appendChild(deleteIcon);

        btnGroupDiv.appendChild(editButton);
        btnGroupDiv.appendChild(deleteButton);

        actionsCell.appendChild(btnGroupDiv);

        // Добавляем ячейки в строку
        trElem.appendChild(methodCell);
        trElem.appendChild(durationCell);
        trElem.appendChild(objQuantCell);
        trElem.appendChild(zonesCell);
        trElem.appendChild(actionsCell);

        // Добавляем строку в tbody
        tBody.appendChild(trElem);
    });
    }
};


/**
 * Расчитывает сумму продолжительности всех нередактируемых в данный момент методов.
 * @param {HTMLElement} methodsTbody - Элемент тела таблицы
 * @returns {number} Сумма всех нередактируемых в данный момент методов
 */
export function sumUneditedMethodsTime(methodsTbody: HTMLElement): number {
    let tableRows = methodsTbody?.querySelectorAll('tr.hover-actions-trigger');
    let sum = 0;
    tableRows?.forEach((row) => {
        let secondColumnValue = parseInt(row?.children[1]?.textContent!);
        if (!isNaN(secondColumnValue)) {
        sum += secondColumnValue;
        }
    });
    return sum;
}

/**
 * Автоматическая подстановка текущего сотрудника в селектор бригады
 */
export function addCurrentUserToBrigadeselector(brigadeChoicesInstance: Choices , brigadeSelectElement: HTMLSelectElement){

    const currentUserName = getLocalStorageItem('currentUserName');
    const selectedUserName = getLocalStorageItem('selectedUserName');
    const isMan = getLocalStorageItem('isMan');
    const userName = (!isMan && currentUserName) ? currentUserName : (isMan && selectedUserName) ? selectedUserName : '';
    // Найдём опцию с текстом, совпадающим с userName
    const matchingOption = Array.from(brigadeSelectElement.options).find(
        option => option?.textContent?.trim() === userName.trim()
    );
    
    if (matchingOption) {
        console.log(`Найдено совпадение: value="${matchingOption.value}"`);
        brigadeChoicesInstance.setChoiceByValue(matchingOption.value);
    } else {
        console.warn(`Значение "${userName}" не найдено в селекторе бригады.`);
    }
}