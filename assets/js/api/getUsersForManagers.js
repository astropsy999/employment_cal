/**
 * Функция выполняет запрос для получения данных сотрудников, возвращает объект вида {ФИО: ID сотрудника}
 */

let usersIDsDepthsArr;
export const getUsersForManagers = async (userID, manName) => {
  /**
   * Создание нового элемента (Селектора) куда будут помещены Сотрудники
   */

  const otherUsers = document.querySelector('#otherUsers');
  const otherUsersDepths = document.querySelector('#otherUsersDepths');

  // Создание элемента для подр

  let getUsersFD = new FormData();

  getUsersFD.append('TableID', 'm-t-800526');
  getUsersFD.append('FilterRelationType', '-1');
  getUsersFD.append('LvNeedOpen', '1');
  getUsersFD.append('ObjTypeID', '871');
  getUsersFD.append('iddb', '-1');
  getUsersFD.append('InterfaceID', '1749');
  getUsersFD.append('ParrentTabIDSideFilter', '1749');
  getUsersFD.append('GroupID', '2662');
  getUsersFD.append('UserTabID', '');
  getUsersFD.append('Criteria2', '');
  getUsersFD.append('newXP', '1');
  getUsersFD.append('columns[0][name]', '№');
  getUsersFD.append('columns[1][name]', '6183');
  getUsersFD.append('columns[2][name]', '5608');
  getUsersFD.append('columns[3][name]', '7319');
  getUsersFD.append('columns[4][name]', '5614');
  getUsersFD.append('columns[5][name]', '6122');
  getUsersFD.append('columns[6][name]', '7416');
  getUsersFD.append('columns[7][name]', '7459');
  getUsersFD.append('columns[8][name]', '7445');
  getUsersFD.append('columns[9][name]', '8102');
  getUsersFD.append('columns[10][name]', '8105');
  getUsersFD.append('columns[11][name]', '8568');
  getUsersFD.append('columns[12][name]', '8570');
  getUsersFD.append('columns[13][name]', '8106');
  getUsersFD.append('columns[14][name]', '8103');
  getUsersFD.append('columns[15][name]', '8104');
  getUsersFD.append('columns[16][name]', '8108');
  getUsersFD.append('columns[17][name]', '8107');
  getUsersFD.append('columns[18][name]', '8627');
  getUsersFD.append('columns[19][name]', '8651');
  getUsersFD.append('columns[20][name]', '8673');
  getUsersFD.append('columns[21][name]', '8764');
  getUsersFD.append('columns[22][name]', '8767');
  getUsersFD.append('columns[23][name]', '8766');
  getUsersFD.append('columns[24][name]', '8765');
  getUsersFD.append('columns[25][name]', '8852');
  getUsersFD.append('FullText', '1');
  getUsersFD.append('kirkinator', '0');
  getUsersFD.append('horizontal', '0');
  getUsersFD.append('draw', '1');
  getUsersFD.append('order[columnIndex]', '7416');
  getUsersFD.append('order[Order]', '0');
  getUsersFD.append('start', '0');
  getUsersFD.append('length', '200');
  getUsersFD.append('search[value]', '');
  getUsersFD.append('isFirst', '0');
  getUsersFD.append('isLoadTotal', '0');
  getUsersFD.append('getOnlyTotal', '0');

  if (!sessionStorage.getItem('usersIDsObj')) {
    const res = await fetch(c.srvv + c.getTableData, {
      credentials: 'include',
      method: 'POST',
      body: getUsersFD,
    })
      .then((response) => {
        let r = response.json();
        return r;
      })
      .catch(function (error) {
        console.log(
          'Не удалось получить данные о пользователях для руководителей',
          error,
        );
      });
    let usersIDsDepthsArr = [];

    res.data.forEach((item) => {
      //   for (let key in item) {
      //     usersIDsDepthsArr.push( {name: item[2].Value, iddbId: item[2].ObjID}, dep: item[5].Value});
      //   }
    });

    usersIDsObj = { ...usersIDsObj, [manName]: userID };
    // Сохраняем данные в сессии

    sessionStorage.setItem('usersIDsObj', JSON.stringify(usersIDsObj));
    const usersLength = Object.keys(usersIDsObj).length;
    /**
     * Сортировка объекта usersObj в алфавитном порядке
     */

    let sortedUsersObj = Object.keys(usersIDsObj)
      .sort()
      .reduce((obj, key) => {
        obj[key] = usersIDsObj[key];
        return obj;
      }, {});

    /**
     * Перебор объекта сотрудников и создание опций для селектора, добавление их в сам селектор
     */

    for (let user in sortedUsersObj) {
      const option = document.createElement('option');
      option.setAttribute('value', `${sortedUsersObj[user]}`);
      option.innerText = `${user}`;
      otherUsers.append(option);
      if (sortedUsersObj[user] == userID) {
        option.setAttribute('selected', 'selected');
        option.style.background = '#f7fcff';
        option.style.color = 'darkblue';
      }
    }

    document.querySelector('.skeleton-loader').remove();
  } else {
    /**
     * Перебор объекта сотрудников и создание опций для селектора, добавление их в сам селектор
     */

    const usersIDsObj = JSON.parse(sessionStorage.getItem('usersIDsObj'));

    /**
     * Сортировка объекта usersObj в алфавитном порядке
     */

    let sortedUsersObj = Object.keys(usersIDsObj)
      .sort()
      .reduce((obj, key) => {
        obj[key] = usersIDsObj[key];
        return obj;
      }, {});

    for (let user in sortedUsersObj) {
      const option = document.createElement('option');
      option.setAttribute('value', `${sortedUsersObj[user]}`);
      option.innerText = `${user}`;
      otherUsers.append(option);
      if (sortedUsersObj[user] == userID) {
        option.setAttribute('selected', 'selected');
        option.style.background = '#f7fcff';
        option.style.color = 'darkblue';
      }
    }

    document.querySelector('.skeleton-loader').remove();
  }
};
