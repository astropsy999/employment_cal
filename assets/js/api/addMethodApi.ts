// addMethodApi.ts
import { MethodsArr } from '../types/events';
import * as c from '../config';
import { addTeamToMethod } from './addTeamToMethod';

/**
 * Функция для добавления метода через API.
 * @param {string} parentObject - Идентификатор родительского объекта.
 * @param {MethodsArr} element - Объект метода с параметрами.
 * @returns {Promise<void>} - Промис без возвращаемого значения.
 */
const addMethodApi = (
  parentObject: string,
  element: MethodsArr,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { method, params } = element;
    const { duration, objects, zones, teamList, isBrigadier } = params;
    console.log("🚀 ~ returnnewPromise ~ teamList:", teamList)

    if (method !== 'Не выбрано' && duration !== '') {
      let formDataaddMet = new FormData();

      formDataaddMet.append('ObjTypeID', '1149');
      formDataaddMet.append('ParentID', parentObject);
      formDataaddMet.append('Data[0][name]', '8764');
      formDataaddMet.append('Data[0][value]', method.trim());
      formDataaddMet.append('Data[0][isName]', 'true');
      formDataaddMet.append('Data[0][maninp]', 'false');
      formDataaddMet.append('Data[0][GroupID]', '2549');
      formDataaddMet.append('Data[1][name]', '8767');
      formDataaddMet.append('Data[1][value]', duration);
      formDataaddMet.append('Data[1][isName]', 'false');
      formDataaddMet.append('Data[1][maninp]', 'false');
      formDataaddMet.append('Data[1][GroupID]', '2549');
      formDataaddMet.append('Data[2][name]', '8766');
      formDataaddMet.append('Data[2][value]', objects);
      formDataaddMet.append('Data[2][isName]', 'false');
      formDataaddMet.append('Data[2][maninp]', 'false');
      formDataaddMet.append('Data[2][GroupID]', '2549');
      formDataaddMet.append('Data[3][name]', '8765');
      formDataaddMet.append('Data[3][value]', zones);
      formDataaddMet.append('Data[3][isName]', 'false');
      formDataaddMet.append('Data[3][maninp]', 'false');
      formDataaddMet.append('Data[3][GroupID]', '2549');
      formDataaddMet.append('InterfaceID', '1685');
      formDataaddMet.append('CalcParamID', '-1');
      formDataaddMet.append('isGetForm', '0');
      formDataaddMet.append('ImportantInterfaceID', '');
      formDataaddMet.append('Ignor39', '1');
      formDataaddMet.append('templ_mode', '0');

      fetch(c.srvv + c.createNodeUrl, {
        credentials: 'include',
        method: 'post',
        body: formDataaddMet,
      })
        .then((response) => response.json())
        .then((data) => {

          if (teamList) {
            addTeamToMethod(teamList, isBrigadier, data.results[0]);
          }
          resolve();
        })
        .catch((error) => {
          console.error('Ошибка при добавлении метода:', error);
          reject(error);
        });
    } else {
      resolve();
    }
  });
};

export default addMethodApi;
