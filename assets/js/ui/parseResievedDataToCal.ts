import _ from 'lodash';
/**
 * Парсинг и отображение полученных данных в календаре
 * @param {*} data
 * @returns
 */
export const parseResievedDataToCal = (data: HTMLElement[]) => {
  const events = [];
  const parentIdDataArr = [];
  let methodsArr = [];
  let eventMethodsArr = [];
  const isLockedArray = [];

  data.forEach((item: any, idx: any) => {
    // Обходим полученный массив данных, превращаем строки в таблицу и парсим нужные значения в соответствующих ячейках

    const parser = new DOMParser();
    const htmItem = parser.parseFromString(
      `<table>${item}</table>`,
      'text/html',
    );

    const getTextContent = (className: string): string | undefined => {
      const element = htmItem.querySelector(className) as HTMLElement;
      return element?.innerText;
  };

  const getAttribute = (className: string, attribute: string): string | null => {
    const element = htmItem.querySelector(className);
    return element?.getAttribute(attribute);
};

    //ParentID
    const parID = getAttribute('.c_i-1', 'o');
       // Дата
    const date = getTextContent('.c_i-1');

       // Краткое описание
      const shortDescription = getTextContent('.c_i-4');
       // Объект
      const object = getTextContent('.c_i-5');
       // Вид работ
      const taskType = getTextContent('.c_i-6');
   
       // Подвид работ
       const subTaskType = getTextContent('.c_i-7');
   
       // Полное описание
       const fullDescription = getTextContent('.c_i-8');
   
       // Фактически затраченное время
       const factTime = getTextContent('.c_i-9');
   
       // Постановщик
       const director = getTextContent('.c_i-10');
   
       // Источник
       const source = getTextContent('.c_i-11');
   
       // Примечания
       const notes = getTextContent('.c_i-12');
   
       // Дата и время начала
       const startDateTime = getTextContent('.c_i-13');
   
       // Дата и время окончания
       const endDateTime = getTextContent('.c_i-14');
   
       // Локация
       const location = getTextContent('.c_i-15');
   
       // Метод
       const method = getTextContent('.c_i-16');
   
       // Продолжительность
       const duration = getTextContent('.c_i-17');
   
       // Количество объектов
       const objQuant = getTextContent('.c_i-18');
   
       // Количество зон
       const zones = getTextContent('.c_i-19');
   
       // КР
       const kr = getTextContent('.c_i-20');
   
       // Занятость
       const employment = getTextContent('.c_i-21');
   
       // Новый Вид работ
       const taskTypeNew = getTextContent('.c_i-22');
   
       // Новый подвид работ
       const subTaskTypeNew = getTextContent('.c_i-23');
   
       // Согласование
       const isApproved = getTextContent('.c_i-24');
   
       // Блокировка
       const isLocked = getTextContent('.c_i-25');
   
       const isLockedElem = htmItem.querySelector('.c_i-25');
       const lockedID = isLockedElem?.getAttribute('o');

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
  function getLockedDatesArray(parentIDsDatesArr: any[], isLockedArr: string | any[]) {
    const lockedDatesArray = [];

    parentIDsDatesArr.forEach((parentObj: { [x: string]: any; }) => {
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
