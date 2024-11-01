import * as c from '../config';

/**
 * Функция получает данные о методах из базы и заполняет селект элемент.
 * @returns {Promise<void>} - Промис, который резолвится после загрузки данных.
 */
const getBrigadeWorkers = async (): Promise<{ID: string, Name: string}[] | undefined> => {
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
      return data.data;
  
   
    } catch (error) {
      console.error('Не получилось загрузить список членов бригады', error);
    }
  };
  
  export default getBrigadeWorkers;