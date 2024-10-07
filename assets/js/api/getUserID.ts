// @ts-ignore
import { srvv, getTableData } from '../config';

/**
 * Получение ID пользователя
 * @returns 
 */
export const getUserID = async () => {
  
    let formData = new FormData();

    formData.append('columns[0][name]', '№');
    formData.append('search[value]', '');
    formData.append('start', '0');
    formData.append('length', '9999');
    formData.append('GetTypes', '1');
    formData.append('iddb', '-1');
    formData.append('InterfaceID', '986');
    formData.append('GroupID', '1499');

    const res = await fetch(srvv + getTableData, {
      credentials: 'include',
      method: 'post',
      body: formData,
    }).then((response) => response.json());

    const data0 = res.data

    return data0[0][0].ObjID.toString();

};
