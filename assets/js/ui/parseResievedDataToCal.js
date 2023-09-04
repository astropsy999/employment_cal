import _ from 'lodash';
/**
 * Парсинг и отображение полученных данных в календаре
 * @param {*} data
 * @returns
 */
export const parseResievedDataToCal = (data) => {
  const events = [];
  const parentIdDataArr = [];
  let methodsArr = [];
  let eventMethodsArr = [];
  const isLockedArray = [];

  data.forEach((item, idx) => {
    // Обходим полученный массив данных, превращаем строки в таблицу и парсим нужные значения в соответствующих ячейках

    const parser = new DOMParser();
    const htmItem = parser.parseFromString(
      `<table>${item}</table>`,
      'text/html',
    );

    //ParentID
    const parID = htmItem.querySelector('.c_i-1').getAttribute('o');
    // Дата
    const date = htmItem.querySelector('.c_i-1').innerText;
    // Краткое описание
    const shortDescription = htmItem.querySelector('.c_i-4').innerText;
    // Объект
    const object = htmItem.querySelector('.c_i-5').innerText;
    // Вид работ
    const taskType = htmItem.querySelector('.c_i-6').innerText;
    // Подвид работ
    const subTaskType = htmItem.querySelector('.c_i-7').innerText;
    // Полное описание
    const fullDescription = htmItem.querySelector('.c_i-8').innerText;
    // Фактически затраченное время
    const factTime = htmItem.querySelector('.c_i-9').innerText;
    // Постановщик
    const director = htmItem.querySelector('.c_i-10').innerText;
    // Источник
    const source = htmItem.querySelector('.c_i-11').innerText;
    // Примечания
    const notes = htmItem.querySelector('.c_i-12').innerText;
    // Дата и время начала
    const startDateTime = htmItem.querySelector('.c_i-13').innerText;
    // Дата и время окончания
    const endDateTime = htmItem.querySelector('.c_i-14').innerText;
    // Локация
    const location = htmItem.querySelector('.c_i-15').innerText;
    // Метод
    const method = htmItem.querySelector('.c_i-16').innerText;
    // Продолжительность
    const duration = htmItem.querySelector('.c_i-17').innerText;
    // Количество объектов
    const objQuant = htmItem.querySelector('.c_i-18').innerText;
    // Количество зон
    const zones = htmItem.querySelector('.c_i-19').innerText;
    // КР
    const kr = htmItem.querySelector('.c_i-20').innerText;
    // Занятость
    const employment = htmItem.querySelector('.c_i-21').innerText;
    // Новый Вид работ
    const taskTypeNew = htmItem.querySelector('.c_i-22').innerText;
    // Новый подвид работ
    const subTaskTypeNew = htmItem.querySelector('.c_i-23').innerText;
    // Согласование
    const isApproved = htmItem.querySelector('.c_i-24').innerText;
    // Блокировка
    const isLocked = htmItem.querySelector('.c_i-25').innerText;
    const isLockedElem = htmItem.querySelector('.c_i-25');
    const lockedID = isLockedElem.getAttribute('o');

    // Method editID
    const editID = htmItem.querySelector('.c_i-16').getAttribute('o');

    const objAllWkk = htmItem.querySelector('.c_i-0').getAttribute('ObjAllwkk');

    if (isLocked !== '') {
      isLockedArray.push(lockedID);
    }

    // ObjAllWkk

    const jsonObjAllWkk = JSON.parse(objAllWkk);

    const wkkKeys = Object.keys(jsonObjAllWkk);
    const wkkVals = Object.values(jsonObjAllWkk);

    const delID = wkkKeys[1];
    const typeID = wkkVals[0].toString();

    let startDate = '';
    let startTime = '';
    let endDate = '';
    let endTime = '';

    if (startDateTime) {
      startDate = startDateTime.slice(0, 10);
      startTime = startDateTime.slice(11, 16);
    }
    if (endDateTime) {
      endDate = endDateTime.slice(0, 10);
      endTime = endDateTime.slice(11, 16);
    }

    parentIdDataArr.push({
      [parID]: date,
    });

    const splitDate = date.split('.');
    const convertStart = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    const convertStartDate = startDateTime
      ? `${startDate.slice(6, 10)}-${startDate.slice(3, 5)}-${startDate.slice(
          0,
          2,
        )} ${startTime}:00`
      : `${convertStart} 08:00:00`;
    const convertEndDate = `${endDate.slice(6, 10)}-${endDate.slice(
      3,
      5,
    )}-${endDate.slice(0, 2)} ${endTime}:00`;

    if (delID && !method) {
      // Объект события

      events.push({
        title: shortDescription,
        start: convertStartDate,
        end: convertEndDate,
        classNames: 'bg-soft-primary',
        allDay: false,
        eventInteractive: true,
        extendedProps: {
          idx,
          jsonObjAllWkk,
          wkkKeys,
          wkkVals,
          delID,
          typeID,
          object,
          taskType,
          subTaskType,
          fullDescription,
          factTime,
          director,
          source,
          notes,
          location,
          kr,
          employment,
          taskTypeNew,
          subTaskTypeNew,
          isApproved,
          isLocked,
        },
      });
    } else if (delID && method) {
      eventMethodsArr.push({
        title: shortDescription,
        start: convertStartDate,
        end: convertEndDate,
        classNames: 'bg-soft-primary',
        allDay: false,
        eventInteractive: true,
        extendedProps: {
          jsonObjAllWkk,
          idx,
          wkkKeys,
          wkkVals,
          delID,
          typeID,
          object,
          taskType,
          subTaskType,
          fullDescription,
          factTime,
          director,
          source,
          notes,
          location,
          kr,
          employment,
          taskTypeNew,
          subTaskTypeNew,
          isApproved,
          isLocked,
        },
      });

      methodsArr.push({
        delID,
        method,
        params: { duration, objQuant, zones, editID },
      });
    }
  });

  // Функция для получения массива заблокированных дат
  function getLockedDatesArray(parentIDsDatesArr, isLockedArr) {
    const lockedDatesArray = [];

    parentIDsDatesArr.forEach((parentObj) => {
      const key = Object.keys(parentObj)[0];
      if (isLockedArr.includes(key)) {
        lockedDatesArray.push(parentObj[key]);
      }
    });

    return lockedDatesArray;
  }

  let groupedData = methodsArr.reduce((results, item) => {
    results[item.delID] = results[item.delID] || [];
    results[item.delID].push({
      [item.method]: item.params,
    });

    return results;
  }, {});

  const uniEventsArray = _.uniqBy(eventMethodsArr, 'extendedProps.delID');

  for (let key in groupedData) {
    uniEventsArray.forEach((nEvent) => {
      if (nEvent.extendedProps.delID === key) {
        events.push({ ...nEvent, methods: groupedData[key] });
      }
    });
  }
  // Получаем массив заблокированных дат
  const lockedDatesArray = getLockedDatesArray(parentIdDataArr, isLockedArray);
  // tempLoader(false);
  return { events, parentIdDataArr, lockedDatesArray };
};
