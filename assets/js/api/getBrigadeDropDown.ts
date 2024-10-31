import * as c from '../config';

/**
 * Функция получает данные о методах из базы и заполняет селект элемент.
 * @param {HTMLSelectElement} element - Селект элемент, который нужно заполнить опциями.
 * @returns {Promise<void>} - Промис, который резолвится после загрузки данных.
 */
const getBrigadeDropDown = async (element: HTMLSelectElement): Promise<void> => {
    const parentID = '';
  
    const formDataBrigade = new FormData();
  
    formDataBrigade.append('ParamID', c.BRIGADE_PARAM);
    formDataBrigade.append('ObjID', '');
    formDataBrigade.append('Limiter', '');
    formDataBrigade.append('ShowAll', '0');
    formDataBrigade.append('ParentID', parentID);
    formDataBrigade.append('LoadFullHbColumn', '0');
    formDataBrigade.append('LoadFullType', '0');
    formDataBrigade.append('ExactSearch', '0');
    formDataBrigade.append('SkipCalc', '0');
  
    try {
      const response = await fetch(c.srvv + c.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataBrigade,
      });
  
      const data = await response.json();
      const brigadeDropArray = data.data;
  
      if (element.options.length <= 1) {
        brigadeDropArray.forEach((dataline: any) => {
          const optionElem = document.createElement('option');
          const datalineid = dataline.ID;
          optionElem.setAttribute('value', `${dataline.Name}`);
          optionElem.setAttribute('brigadeid', `${datalineid}`);
          optionElem.innerText = `${dataline.Name}`;
          element.append(optionElem);
        });
      }
    } catch (error) {
      console.error('Не получилось загрузить список членов бригады', error);
    }
  };
  
  export default getBrigadeDropDown;