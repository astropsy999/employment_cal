import * as c from '../config';
import { cleanAndDefaultKindOfSubTaskSelector } from '../utils/mainGlobFunctions';
import _ from 'lodash';

/**
 * Функция для вставки данных в селектор
 * @param {Node} elem - элемент селектора, в который нужно вставить данные
 * @param {Object} datObj - объект с данными которые нужно поместить в селектор
 */
export const addDataToSelector = (elem, datObj) => {
  if (elem.options.length <= 1) {
    datObj.forEach((obj) => {
      const taskObjOption = document.createElement('option');
      const noQuoteObjName = obj.Name.replaceAll('&quot;', '"');
      const objid = obj.ID;
      taskObjOption.setAttribute('value', `${noQuoteObjName}`);
      taskObjOption.setAttribute('objIDAttr', `${objid}`);
      taskObjOption.innerText = `${noQuoteObjName}`;
      elem.append(taskObjOption);
    });
  }
};

// ПОЛУЧАЕМ ДАННЫЕ ДЛЯ ВЫПАДАЮЩИХ СПИСКОВ

/**
 * Функция  получает данные об Объектах работ из базы и помещает их в LocalStorage
 */
const getObjectsOptions = async () => {
  if (!sessionStorage.getItem('dataObj')) {
    let formDataObjects = new FormData();

    formDataObjects.append('ParamID', c.fifthCol);
    formDataObjects.append('ObjID', '');
    formDataObjects.append('ShowAll', '0');
    formDataObjects.append('ParentID', '');
    formDataObjects.append('Limiter', '');
    formDataObjects.append('LoadFullHbColumn', '0');
    formDataObjects.append('LoadFullType', '0');
    formDataObjects.append('SkipCalc', '0');
    formDataObjects.append('ExactSearch', '0');
    formDataObjects.append('Page', '1');

    // if(element && element.length <= 1 ) {
    await fetch(c.srvv + c.getEnumsData, {
      credentials: 'include',
      method: 'post',
      body: formDataObjects,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const dataObj = response.data;
        sessionStorage.setItem('dataObj', JSON.stringify(dataObj));
      })
      .catch(function (error) {
        console.log('Не удалось загрузить список объектов из базы', error);
      });
  } else {
    const dataObj = JSON.parse(sessionStorage.getItem('dataObj'));
  }
};

/**
 * Функция  получает данные о Постановщиках из базы и помещает их в LocalStorage
 */

const getDirectorOptions = async () => {
  let dataCreator = [];

  if (!sessionStorage.getItem('dataCreator')) {
    for (let i = 1; ; i++) {
      let formDataDirector = new FormData();

      formDataDirector.append('ParamID', c.tenthCol);
      formDataDirector.append('ObjID', '');
      formDataDirector.append('ShowAll', '');
      formDataDirector.append('ParentID', '');
      formDataDirector.append('Limiter', '');
      formDataDirector.append('LoadFullHbColumn', '');
      formDataDirector.append('LoadFullType', '');
      formDataDirector.append('SkipCalc', '');
      formDataDirector.append('ExactSearch', '0');
      formDataDirector.append('Page', `${i}`);

      let listFromFetch = '';
      await fetch(c.srvv + c.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataDirector,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          listFromFetch = response.data;
        })
        .catch(function (error) {
          console.log('Не получилось загрузить список постановщиков', error);
        });

      if (listFromFetch.length > 0) {
        dataCreator = [...dataCreator, ...listFromFetch];
        dataCreator = _.uniqBy(dataCreator, 'ID');
        // ЧАСТО ИСПОЛЬЗУЕМЫЕ ЗНАЧЕНИЯ В СПИСКАХ
        sessionStorage.setItem('dataCreator', JSON.stringify(dataCreator));
      } else {
        break;
      }
    }
  } else {
    dataCreator = JSON.parse(sessionStorage.getItem('dataCreator'));
  }
};

/**
 * Функция  получает данные о Локациях из базы и помещает их в LocalStorage
 */

const getLocationOptions = () => {
  let locObj = [];
  if (!sessionStorage.getItem('locObj')) {
    let formDataLocations = new FormData();

    formDataLocations.append('ParamID', c.fifteenthCol);
    formDataLocations.append('ObjID', '');
    formDataLocations.append('Limiter', '');
    formDataLocations.append('ShowAll', '0');
    formDataLocations.append('ParentID', '');
    formDataLocations.append('LoadFullHbColumn', '0');
    formDataLocations.append('LoadFullType', '0');
    formDataLocations.append('ExactSearch', '0');
    formDataLocations.append('SkipCalc', '0');

    fetch(c.srvv + c.getEnumsData, {
      credentials: 'include',
      method: 'post',
      body: formDataLocations,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        locObj = response.data;
        sessionStorage.setItem('locObj', JSON.stringify(locObj));
      })
      .catch(function (error) {
        console.log('Не получилось загрузить список локаций', error);
      });
  } else {
    locObj = JSON.parse(sessionStorage.getItem('locObj'));
  }
};

/**
 * Функция  получает данные о Занятости из базы и помещает их в LocalStorage
 */

const getEmplOptions = () => {
  let emplObj = [];
  if (!sessionStorage.getItem('emplObj')) {
    let formDataEmpl = new FormData();

    formDataEmpl.append('ParamID', '9042');
    formDataEmpl.append('ObjID', '');
    formDataEmpl.append('Limiter', '');
    formDataEmpl.append('ShowAll', '0');
    formDataEmpl.append('ParentID', '');
    formDataEmpl.append('LoadFullHbColumn', '0');
    formDataEmpl.append('LoadFullType', '0');
    formDataEmpl.append('ExactSearch', '0');
    formDataEmpl.append('SkipCalc', '0');

    fetch(c.srvv + c.getEnumsData, {
      credentials: 'include',
      method: 'post',
      body: formDataEmpl,
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        emplObj = response.data;
        sessionStorage.setItem('emplObj', JSON.stringify(emplObj));
      })
      .catch(function (error) {
        console.log('Не получилось загрузить список занятости', error);
      });
  } else {
    emplObj = JSON.parse(sessionStorage.getItem('emplObj'));
  }
};

// Формируем общий массив ID для видов
let globalTasksTypesArray = [];

export const getGlobalTasksTypes = (iddb) => {
  let formDataKindOfTask = new FormData();

  formDataKindOfTask.append('ParamID', '9043');
  formDataKindOfTask.append('ObjID', '');
  formDataKindOfTask.append('Filter[0][isOnForm]', '1');
  formDataKindOfTask.append('Filter[0][value]', iddb);
  formDataKindOfTask.append('Filter[0][param]', c.userCol);
  formDataKindOfTask.append('Filter[0][isParentFilter]', '0');
  formDataKindOfTask.append('ShowAll', '0');
  formDataKindOfTask.append('ParentID', '');
  formDataKindOfTask.append('Limiter', '');
  formDataKindOfTask.append('LoadFullHbColumn', '0');
  formDataKindOfTask.append('LoadFullType', '0');
  formDataKindOfTask.append('SkipCalc', '0');
  formDataKindOfTask.append('ExactSearch', '0');
  formDataKindOfTask.append('Page', '1');

  fetch(c.srvv + c.getEnumsData, {
    credentials: 'include',
    method: 'post',
    body: formDataKindOfTask,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      globalTasksTypesArray = response.data;
      localStorage.setItem(
        'globalTasksTypes',
        JSON.stringify(globalTasksTypesArray),
      );
    })
    .catch(function (error) {
      console.log('Не удалось загрузить виды работ с сервера', error);
    });
};

// Генерация объекта видов-подвидов

export const generateSubtasksObj = (tasksArr) => {
  tasksArr.forEach((task, index) => {
    const taskID = task.ID;

    let formDataSubTask = new FormData();

    formDataSubTask.append('ParamID', '9044');
    formDataSubTask.append('ObjID', '');
    formDataSubTask.append('Filter[0][isOnForm]', '1');
    formDataSubTask.append('Filter[0][value]', taskID);
    formDataSubTask.append('Filter[0][param]', '9043');
    formDataSubTask.append('Filter[0][isParentFilter]', '0');
    formDataSubTask.append('ShowAll', '0');
    formDataSubTask.append('ParentID', '');
    formDataSubTask.append('Limiter', '');
    formDataSubTask.append('LoadFullHbColumn', '0');
    formDataSubTask.append('LoadFullType', '0');
    formDataSubTask.append('SkipCalc', '0');
    formDataSubTask.append('ExactSearch', '0');
    formDataSubTask.append('Page', '1');

    setTimeout(() => {
      fetch(c.srvv + c.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataSubTask,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          console.log('response: ', response);

          kindOfSubTaskList = response && response.data;
        })
        .catch(function (error) {
          console.log('error', error);
        });
    }, index * 2000); // Определяем задержку, умножая индекс на 500 миллисекунд
  });
};

/**
 * Функция  получает данные о Методах из базы и помещает их в LocalStorage
 */

let methodsDropArray = [];

const getMethodsDropDown = (element) => {
  const parentID = '';

  let formDataMethods = new FormData();

  formDataMethods.append('ParamID', c.METHODS_DROPDOWN_PARAMID);
  formDataMethods.append('ObjID', '');
  formDataMethods.append('Limiter', '');
  formDataMethods.append('ShowAll', '0');
  formDataMethods.append('ParentID', parentID);
  formDataMethods.append('LoadFullHbColumn', '0');
  formDataMethods.append('LoadFullType', '0');
  formDataMethods.append('ExactSearch', '0');
  formDataMethods.append('SkipCalc', '0');

  fetch(c.srvv + c.getEnumsData, {
    credentials: 'include',
    method: 'post',
    body: formDataMethods,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      methodsDropArray = response.data;

      if (element.options.length <= 1) {
        methodsDropArray.forEach((dataline) => {
          const elemCreation = document.createElement('option');
          const datalineid = dataline.ID;
          elemCreation.setAttribute('value', `${dataline.Name}`);
          elemCreation.setAttribute('methodid', `${datalineid}`);
          elemCreation.innerText = `${dataline.Name}`;
          element.append(elemCreation);
        });
      }
    })
    .catch(function (error) {
      console.log('Не получилось загрузить список Методов', error);
    });
};

/**
 * Функция выполняет запрос для получения данных сотрудников, возвращает объект вида {ФИО: ID сотрудника}
 */

let usersIDsObj;
export const getUsersForManagers = async (userID, manName) => {
  /**
   * Создание нового элемента (Селектора) куда будут помещены Сотрудники
   */

  const otherUsers = document.querySelector('#otherUsers');
  const otherUsersDep = document.querySelector('#otherUsersDepths');

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
  getUsersFD.append('length', '110');
  getUsersFD.append('search[value]', '');
  getUsersFD.append('isFirst', '0');
  getUsersFD.append('isLoadTotal', '0');
  getUsersFD.append('getOnlyTotal', '0');

  if (!sessionStorage.getItem('usersIDsDepthsArrUn')) {
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
    let usersIDsObj = {};
    let usersIDsDepthsArr = [];

    res.data.forEach((item) => {
      for (let key in item) {
        usersIDsObj = {
          name: item[2].Value,
          id: item[2].ObjID,
          dep: item[5].Value,
        };

        usersIDsDepthsArr.push(usersIDsObj);
      }
    });

    // Создаем объект Set для отслеживания уникальных значений
    const uniqueIds = new Set();
    const usersIDsDepthsArrUn = [];

    // Итерируем по массиву объектов
    for (const obj of usersIDsDepthsArr) {
      if (!uniqueIds.has(obj.id)) {
        // Если id объекта не встречался ранее, добавляем его в уникальные объекты
        uniqueIds.add(obj.id);
        usersIDsDepthsArrUn.push(obj);
      }
    }

    /**
     * Сортировка массива  usersIDsDepthsArrUn в алфавитном порядке
     */

    usersIDsDepthsArrUn.sort((a, b) => a.name.localeCompare(b.name));

    sessionStorage.setItem(
      'usersIDsDepthsArrUn',
      JSON.stringify(usersIDsDepthsArrUn),
    );

    /**
     * Перебор массива сотрудников и создание опций для селектора, добавление их в сам селектор
     */

    const uniqueDepOptions = {};
    const optionDepElements = [];

    usersIDsDepthsArrUn.forEach((user) => {
      const option = document.createElement('option');
      const optionDep = document.createElement('option');

      option.setAttribute('value', `${user.id}`);
      optionDep.setAttribute('value', `${user.dep}`);
      option.setAttribute('dep', `${user.dep}`);
      option.innerText = `${user.name}`;
      optionDep.innerText = `${user.dep}`;

      otherUsers.append(option);

      // Проверяем, было ли уже добавлено данное dep в селектор otherUsersDep
      if (!uniqueDepOptions[user.dep] && user.dep != '') {
        otherUsersDep.append(optionDep);
        optionDepElements.push(optionDep);
        uniqueDepOptions[user.dep] = true; // Отмечаем, что данное dep уже добавлено
      }

      if (user.id == userID) {
        option.setAttribute('selected', 'selected');
        // optionDep.setAttribute('selected', 'selected');
        option.style.background = '#f7fcff';
        option.style.color = 'darkblue';
      }
    });

    // Очищаем otherUsersDep перед добавлением отсортированных элементов
    otherUsersDep.innerHTML = '';

    // Сортируем элементы optionDep по текстовому содержимому (значение)
    optionDepElements.sort((a, b) => a.innerText.localeCompare(b.innerText));

    // Добавляем отсортированные элементы в otherUsersDep
    optionDepElements.forEach((optionDep) => {
      otherUsersDep.appendChild(optionDep);
    });

    const allDepsOption = document.createElement('option');
    allDepsOption.setAttribute('value', 'Все отделы');
    allDepsOption.setAttribute('selected', 'selected');
    allDepsOption.innerText = 'Все отделы';

    otherUsersDep.insertAdjacentElement('afterbegin', allDepsOption);

    document.querySelector('.skeleton-loader').remove();
  } else {
    const optionDepElements = [];
    /**
     * Перебор объекта сотрудников и создание опций для селектора, добавление их в сам селектор
     */

    const usersIDsDepthsArrUn = JSON.parse(
      sessionStorage.getItem('usersIDsDepthsArrUn'),
    );

    usersIDsDepthsArrUn.sort((a, b) => a.name.localeCompare(b.name));

    /**
     * Сортировка объекта usersObj в алфавитном порядке
     */
    const uniqueDepOptions = {};

    usersIDsDepthsArrUn.forEach((user) => {
      const option = document.createElement('option');
      const optionDep = document.createElement('option');

      option.setAttribute('value', `${user.id}`);
      option.setAttribute('dep', `${user.dep}`);
      optionDep.setAttribute('value', `${user.dep}`);
      option.innerText = `${user.name}`;
      optionDep.innerText = `${user.dep}`;

      otherUsers.append(option);

      // Проверяем, было ли уже добавлено данное dep в селектор otherUsersDep
      if (!uniqueDepOptions[user.dep] && user.dep != '') {
        otherUsersDep.append(optionDep);
        optionDepElements.push(optionDep);
        uniqueDepOptions[user.dep] = true; // Отмечаем, что данное dep уже добавлено
      }

      if (user.id == userID) {
        option.setAttribute('selected', 'selected');
        // optionDep.setAttribute('selected', 'selected');
        option.style.background = '#f7fcff';
        option.style.color = 'darkblue';
      }
    });

    // Очищаем otherUsersDep перед добавлением отсортированных элементов
    otherUsersDep.innerHTML = '';

    // Сортируем элементы optionDep по текстовому содержимому (значение)
    optionDepElements.sort((a, b) => a.innerText.localeCompare(b.innerText));

    // Добавляем отсортированные элементы в otherUsersDep
    optionDepElements.forEach((optionDep) => {
      otherUsersDep.appendChild(optionDep);
    });

    const allDepsOption = document.createElement('option');
    allDepsOption.setAttribute('value', 'Все отделы');
    allDepsOption.setAttribute('selected', 'selected');
    allDepsOption.innerText = 'Все отделы';

    otherUsersDep.insertAdjacentElement('afterbegin', allDepsOption);

    document.querySelector('.skeleton-loader').remove();
  }
};

let kindOfTasksList = [];
let kindOfSubTaskList = [];

/**
 * Функция  получает данные о Видах и Подвидах из базы
 */

export const getTypesOfWorkOptions = (taskEl, subtaskEl, idDB) => {
  // Формирование запроса для вида работ

  let formDataKindOfTask = new FormData();

  formDataKindOfTask.append('ParamID', '9043');
  formDataKindOfTask.append('ObjID', '');
  formDataKindOfTask.append('Filter[0][isOnForm]', '1');
  formDataKindOfTask.append('Filter[0][value]', idDB);
  formDataKindOfTask.append('Filter[0][param]', c.userCol);
  formDataKindOfTask.append('Filter[0][isParentFilter]', '0');
  formDataKindOfTask.append('ShowAll', '0');
  formDataKindOfTask.append('ParentID', '2996632');
  formDataKindOfTask.append('Limiter', '');
  formDataKindOfTask.append('LoadFullHbColumn', '0');
  formDataKindOfTask.append('LoadFullType', '0');
  formDataKindOfTask.append('SkipCalc', '0');
  formDataKindOfTask.append('ExactSearch', '0');
  formDataKindOfTask.append('Page', '1');

  fetch(c.srvv + c.getEnumsData, {
    credentials: 'include',
    method: 'post',
    body: formDataKindOfTask,
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      kindOfTasksList = response.data;

      if (taskEl.options.length <= 1) {
        kindOfTasksList.forEach((task) => {
          const taskOption = document.createElement('option');
          const noQuoteTaskName = task.Name.replaceAll('&quot;', '"');
          const taskid = task.ID;
          taskOption.setAttribute('value', `${noQuoteTaskName}`);
          taskOption.setAttribute('taskid', `${taskid}`);
          taskOption.innerText = `${noQuoteTaskName}`;
          taskEl.append(taskOption);
        });
      }
    })
    .catch(function (error) {
      console.log('Не удалось получить виды работ с сервера', error);
    });

  // Подвид работ

  taskEl.addEventListener('change', () => {
    if (taskEl.value !== 'Не выбрано') {
      if (subtaskEl) {
        subtaskEl.removeAttribute('disabled');
      }

      cleanAndDefaultKindOfSubTaskSelector(subtaskEl);

      const taskID =
        taskEl[taskEl.options.selectedIndex].getAttribute('taskid');

      let formDataSubTask = new FormData();

      formDataSubTask.append('ParamID', '9044');
      formDataSubTask.append('ObjID', '');
      formDataSubTask.append('Filter[0][isOnForm]', '1');
      formDataSubTask.append('Filter[0][value]', taskID);
      formDataSubTask.append('Filter[0][param]', '9043');
      formDataSubTask.append('Filter[0][isParentFilter]', '0');
      formDataSubTask.append('ShowAll', '0');
      formDataSubTask.append('ParentID', '');
      formDataSubTask.append('Limiter', '');
      formDataSubTask.append('LoadFullHbColumn', '0');
      formDataSubTask.append('LoadFullType', '0');
      formDataSubTask.append('SkipCalc', '0');
      formDataSubTask.append('ExactSearch', '0');
      formDataSubTask.append('Page', '1');

      fetch(c.srvv + c.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataSubTask,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          kindOfSubTaskList = response.data;

          if (subtaskEl && subtaskEl.options.length <= 1) {
            kindOfSubTaskList.forEach((subtask) => {
              const subTaskOption = document.createElement('option');
              const noQuoteSubTaskName = subtask.Name.replaceAll('&quot;', '"');
              const subtaskid = subtask.ID;
              subTaskOption.setAttribute('value', `${noQuoteSubTaskName}`);
              subTaskOption.setAttribute('subtaskid', `${subtaskid}`);
              subTaskOption.innerText = `${noQuoteSubTaskName}`;
              subtaskEl.append(subTaskOption);
            });
          }
        })
        .catch(function (error) {
          console.log('error', error);
        });
    } else {
      if (subtaskEl) {
        subtaskEl.options.length = 0;
        const subTaskOption = document.createElement('option');
        subTaskOption.setAttribute('value', `Не выбрано`);
        subTaskOption.innerText = `Не выбрано`;
        subtaskEl.append(subTaskOption);
        subtaskEl.value = 'Не выбрано';
      }
    }
  });
};

export {
  getObjectsOptions,
  getDirectorOptions,
  getLocationOptions,
  getEmplOptions,
  getMethodsDropDown,
  methodsDropArray,
  usersIDsObj,
  kindOfTasksList,
};
