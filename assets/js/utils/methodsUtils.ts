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