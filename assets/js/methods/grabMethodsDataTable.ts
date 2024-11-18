import { Methods } from "../enums/methods";
import { MethodsArr } from "../types/events";
import { getLocalStorageItem } from "../utils/localStorageUtils";

/**
 * Сбор методов из таблицы методов, при наличии и подготовка для отправки в базу
 * @param {*} tbody
 * @returns
 */
const grabMethodsDataTable = (tbody: HTMLTableSectionElement): MethodsArr[] => {
  let grabMethodsArray: MethodsArr[] = [];
  const methodsArr = Array.from(tbody.querySelectorAll('tr'));

  // Функция для проверки, является ли метод методом РК
  function isRKMethod(methodName: string): boolean {
    return methodName === Methods.RK_CRG_NAME || methodName === Methods.RK_CLASSIC_NAME;
  }

  if (methodsArr && methodsArr.length > 0) {
    methodsArr.forEach((item) => {
      const metDataArr = Array.from(item.cells);
      const method = metDataArr[0].innerText;
      const duration = metDataArr[1].innerText;
      const objects = metDataArr[2].innerText;
      const zones = metDataArr[3].innerText;
      const teamList = metDataArr[0].getAttribute('data-team');
      const isBrigadier = metDataArr[0].getAttribute('data-brigadir');

      grabMethodsArray.push({
        method,
        params: { duration, objects, zones, teamList, isBrigadier },
      });
    });
  } else {
    const wooMethod = document.querySelector('#wooMethod') as HTMLSelectElement;
    const wooTime = document.querySelector('#wooTime') as HTMLInputElement;
    const wooObjects = document.querySelector('#wooObjects') as HTMLInputElement;
    const wooZones = document.querySelector('#wooZones') as HTMLInputElement;

    if(isRKMethod(wooMethod?.value)) {

      // Получение значения чекбокса "Я бригадир"
      const isBrigadierCheckbox = document.querySelector('#brigadirCheckbox') as HTMLInputElement;
      const isBrigadier = isBrigadierCheckbox?.checked ? 'true' : 'false';

      // Получение списка работников бригады
      const brigadeSelect = document.querySelector('#brigadeSelect') as HTMLSelectElement;
      const selectedOptions = Array.from(brigadeSelect?.selectedOptions) as HTMLOptionElement[];

      // Функция для извлечения ID из значения опции
      function extractIdFromOptionValue(value: string): string | null {
        const regex = /\{+(\d+):/;
        const match = value.match(regex);
        return match ? match[1] : null;
      }

      // Извлекаем ID из значений опций
      const selectedIds = selectedOptions
        .map(option => {
          const id = extractIdFromOptionValue(option.value);
          return id;
        })
        .filter(id => id !== null) as string[];

      // Получаем данные работников из localStorage
      const workersData = getLocalStorageItem('brigadeWorkers') as { ID: string; Name: string }[];

      // Проверяем, что все ID существуют в workersData
      const allIdsExist = selectedIds.every(id => workersData.some(worker => worker.ID === id));

      if (!allIdsExist) {
        console.warn('Некоторые выбранные ID не найдены в данных работников');
      }

      // Формируем teamList, используя значения опций напрямую
      const teamList = selectedOptions.map(option => option.value);

      grabMethodsArray.push({
        method: wooMethod?.value,
        params: {
          duration: wooTime?.value,
          objects: wooObjects?.value,
          zones: wooZones?.value,
          teamList: JSON.stringify(teamList),
          isBrigadier,
        },
      });
    } else {
      grabMethodsArray.push({
        method: wooMethod?.value,
        params: {
          duration: wooTime?.value,
          objects: wooObjects?.value,
          zones: wooZones?.value,
        },
      });
    }

    
  }

  console.log("🚀 ~ grabMethodsDataTable ~ grabMethodsArray:", grabMethodsArray);

  return grabMethodsArray;
};
/**
 * Сбор методов из таблицы методов при наличии, если методы добавляются в первый раз
 * @param {*} tbody
 * @returns
 */
const grabJustAddedArray = (tbody: HTMLTableSectionElement | HTMLTableElement) => {
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
