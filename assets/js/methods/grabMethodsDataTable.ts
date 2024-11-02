/**
 * Сбор методов из таблицы методов, при наличии и подготовка для отправки в базу
 * @param {*} tbody
 * @returns
 */
const grabMethodsDataTable = (tbody: HTMLTableSectionElement) => {
  let grabMethodsArray = [];
  const methodsArr = Array.from(tbody.querySelectorAll('tr'));

  if (methodsArr && methodsArr.length > 0) {
    methodsArr.forEach((item) => {
      const metDataArr = Array.from(item.cells);
      const method = metDataArr[0].innerText;
      const duration = metDataArr[1].innerText;
      const objects = metDataArr[2].innerText;
      const zones = metDataArr[3].innerText;
      const teamList = metDataArr[0].getAttribute('data-team')
      const isBrigadier = metDataArr[0].getAttribute('data-brigadir')
      grabMethodsArray.push({ method, params: { duration, objects, zones, teamList, isBrigadier } });
    });
  } else {
    const wooMethod = document.querySelector('#wooMethod') as HTMLSelectElement;
    const wooTime = document.querySelector('#wooTime') as HTMLInputElement;
    const wooObjects = document.querySelector('#wooObjects') as HTMLInputElement;
    const wooZones = document.querySelector('#wooZones') as HTMLInputElement;
    const teamList = wooMethod?.getAttribute('data-team')
    const isBrigadier = wooMethod?.getAttribute('data-brigadir')
    grabMethodsArray.push({
      method: wooMethod?.value,
      params: {
        duration: wooTime?.value,
        objects: wooObjects?.value,
        zones: wooZones?.value,
        teamList,
        isBrigadier
      },
    });
  }
  return grabMethodsArray;
};
/**
 * Сбор методов из таблицы методов при наличии, если методы добавляются в первый раз
 * @param {*} tbody
 * @returns
 */
const grabJustAddedArray = (tbody: HTMLTableSectionElement) => {
  let grabJAMethodsArray: any = [];
  const methodsArr = Array.from(tbody.querySelectorAll('.justadded'));
  methodsArr.forEach((item) => {
    const metDataArr = Array.from((item as HTMLTableRowElement).cells);
    const method = metDataArr[0].innerText;
    const duration = metDataArr[1].innerText;
    const objects = metDataArr[2].innerText;
    const zones = metDataArr[3].innerText;
    const teamList = metDataArr[0].getAttribute('data-team')
    const isBrigadier = metDataArr[0].getAttribute('data-brigadir')
    grabJAMethodsArray.push({ method, params: { duration, objects, zones, teamList, isBrigadier } });
  });

  return grabJAMethodsArray;
};

export default grabMethodsDataTable;
export { grabJustAddedArray };
