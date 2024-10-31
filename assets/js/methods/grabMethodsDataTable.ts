/**
 * Сбор методов из таблицы методов, при наличии и подготовка для отправки в базу
 * @param {*} tbody
 * @returns
 */
const grabMethodsDataTable = (tbody) => {
  let grabMethodsArray = [];
  const methodsArr = [...tbody.querySelectorAll('tr')];

  if (methodsArr && methodsArr.length > 0) {
    methodsArr.forEach((item) => {
      const metDataArr = [...item.cells];
      const method = metDataArr[0].innerText;
      const duration = metDataArr[1].innerText;
      const objects = metDataArr[2].innerText;
      const zones = metDataArr[3].innerText;
      grabMethodsArray.push({ method, params: { duration, objects, zones } });
    });
  } else {
    const wooMethod = document.querySelector('#wooMethod') as HTMLSelectElement;
    const wooTime = document.querySelector('#wooTime') as HTMLInputElement;
    const wooObjects = document.querySelector('#wooObjects') as HTMLInputElement;
    const wooZones = document.querySelector('#wooZones') as HTMLInputElement;
    grabMethodsArray.push({
      method: wooMethod?.value,
      params: {
        duration: wooTime?.value,
        objects: wooObjects?.value,
        zones: wooZones?.value,
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
const grabJustAddedArray = (tbody) => {
  let grabJAMethodsArray = [];
  const methodsArr = [...tbody.querySelectorAll('.justadded')];
  methodsArr.forEach((item) => {
    const metDataArr = [...item.cells];
    const method = metDataArr[0].innerText;
    const duration = metDataArr[1].innerText;
    const objects = metDataArr[2].innerText;
    const zones = metDataArr[3].innerText;
    grabJAMethodsArray.push({ method, params: { duration, objects, zones } });
  });

  return grabJAMethodsArray;
};

export default grabMethodsDataTable;
export { grabJustAddedArray };
