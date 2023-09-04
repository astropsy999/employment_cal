import { srvv, getTableData } from '../config';

/**
 * Получение ID пользователя
 * @returns
 */
export const getUserID = async () => {
  if (!sessionStorage.getItem('data0')) {
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
    })
      .then((response) => {
        let r = response.json();
        return r;
      })
      .catch(function (error) {
        console.log('Не удалось получить ID пользователя с сервера', error);
      });

    const data0 = res !== undefined ? res.data : [{ objID: '235986' }];
    sessionStorage.setItem('data0', JSON.stringify(data0));
    console.log('data0[0]: ', data0[0]);

    return data0[0];
  } else {
    const data0 = await JSON.parse(sessionStorage.getItem('data0'));

    return data0[0];
  }
};
