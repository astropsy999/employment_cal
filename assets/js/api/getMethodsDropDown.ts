import * as c from '../config';

/**
 * Функция получает данные о методах из базы и заполняет селект элемент.
 * @param {HTMLSelectElement} element - Селект элемент, который нужно заполнить опциями.
 * @returns {Promise<void>} - Промис, который резолвится после загрузки данных.
 */
const getMethodsDropDown = async (element: HTMLSelectElement): Promise<void> => {
    const parentID = '';
  
    const formDataMethods = new FormData();
  
    formDataMethods.append('ParamID', c.METHODS_DROPDOWN_PARAMID);
    formDataMethods.append('ObjID', '');
    formDataMethods.append('Limiter', '');
    formDataMethods.append('ShowAll', '0');
    formDataMethods.append('ParentID', parentID);
    formDataMethods.append('LoadFullHbColumn', '0');
    formDataMethods.append('LoadFullType', '0');
    formDataMethods.append('ExactSearch', '0');
    formDataMethods.append('SkipCalc', '0');
  
    try {
      const response = await fetch(c.srvv + c.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataMethods,
      });
  
      const data = await response.json();
      const methodsDropArray = data.data;
  
      if (element.options.length <= 1) {
        methodsDropArray.forEach((dataline: any) => {
          const optionElem = document.createElement('option');
          const datalineid = dataline.ID;
          optionElem.setAttribute('value', `${dataline.Name}`);
          optionElem.setAttribute('methodid', `${datalineid}`);
          optionElem.innerText = `${dataline.Name}`;
          element.append(optionElem);
        });
      }
    } catch (error) {
      console.error('Не получилось загрузить список Методов', error);
    }
  };
  
  export default getMethodsDropDown;