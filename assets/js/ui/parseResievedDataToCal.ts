import _ from 'lodash';
import { EventInfo } from '../types/events';
import { MethodsArr } from '../types/methods';
/**
 * Парсинг и отображение полученных данных в календаре
 * @param {*} data
 * @returns
 */
export const parseResievedDataToCal = (data: string[]) => {
  const events: EventInfo[] = [];
  const parentIdDataArr: {[key: string]: string}[] = [];
  let methodsArr: MethodsArr[] = [];
  let eventMethodsArr: EventInfo[] = [];
  const isLockedArray: string[] = [];

  data.forEach((item, idx) => {
    // Обходим полученный массив данных, превращаем строки в таблицу и парсим нужные значения в соответствующих ячейках

    const parser = new DOMParser();
    const htmItem = parser.parseFromString(
      `<table>${item}</table>`,
      'text/html',
    );

    //ParentID
    const parID = htmItem?.querySelector('.c_i-1')?.getAttribute('o');
    // Дата
    const date = htmItem?.querySelector('.c_i-1')?.textContent;
    // Краткое описание
    const shortDescription = htmItem?.querySelector('.c_i-4')?.textContent;
    // Объект
    const object = htmItem?.querySelector('.c_i-5')?.textContent;
    // Вид работ
    const taskType = htmItem?.querySelector('.c_i-6')?.textContent;
    // Подвид работ
    const subTaskType = htmItem?.querySelector('.c_i-7')?.textContent;
    // Полное описание
    const fullDescription = htmItem?.querySelector('.c_i-8')?.textContent;
    // Фактически затраченное время
    const factTime = htmItem?.querySelector('.c_i-9')?.textContent;
    // Постановщик
    const director = htmItem?.querySelector('.c_i-10')?.textContent;
    // Источник
    const source = htmItem?.querySelector('.c_i-11')?.textContent;
    // Примечания
    const notes = htmItem?.querySelector('.c_i-12')?.textContent;
    // Дата и время начала
    const startDateTime = htmItem?.querySelector('.c_i-13')?.textContent;
    // Дата и время окончания
    const endDateTime = htmItem?.querySelector('.c_i-14')?.textContent;
    // Локация
    const location = htmItem?.querySelector('.c_i-15')?.textContent;
    // Метод
    const method = htmItem?.querySelector('.c_i-16')?.textContent;
    // Продолжительность
    const duration = htmItem?.querySelector('.c_i-17')?.textContent;
    // Количество объектов
    const objQuant = htmItem?.querySelector('.c_i-18')?.textContent;
    // Количество зон
    const zones = htmItem?.querySelector('.c_i-19')?.textContent;
    // КР
    const kr = htmItem?.querySelector('.c_i-20')?.textContent;
    // Занятость
    const employment = htmItem?.querySelector('.c_i-21')?.textContent;
    // Новый Вид работ
    const taskTypeNew = htmItem?.querySelector('.c_i-22')?.textContent;
    // Новый подвид работ
    const subTaskTypeNew = htmItem?.querySelector('.c_i-23')?.textContent;
    // Согласование
    const isApproved = htmItem?.querySelector('.c_i-24')?.textContent;
    // Блокировка
    const isLocked = htmItem?.querySelector('.c_i-25')?.textContent;
    const isLockedElem = htmItem?.querySelector('.c_i-25');
    const lockedID = isLockedElem?.getAttribute('o');
    // Список сотрудников в бригаде
    const teamList = htmItem?.querySelector('.c_i-26')?.textContent;
    // Бригадир
    const isBrigadier = htmItem?.querySelector('.c_i-27')?.textContent;

    // Method editID
    const editID = htmItem?.querySelector('.c_i-16')?.getAttribute('o');

    const objAllWkk = htmItem?.querySelector('.c_i-0')?.getAttribute('ObjAllwkk');

    if (isLocked !== '') {
      isLockedArray.push(lockedID!);
    }

    // ObjAllWkk

    const jsonObjAllWkk = JSON.parse(objAllWkk!);

    const wkkKeys = Object.keys(jsonObjAllWkk);
    const wkkVals = Object.values(jsonObjAllWkk) as number[];

    const delID = wkkKeys[1];
    const typeID = wkkVals[0]?.toString();

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
      [parID as string]: date!,
    });

    const splitDate = date?.split('.') ?? [];
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
        title: shortDescription ?? '',
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
          object: object ?? '',
          taskType: taskType ?? '',
          subTaskType: subTaskType ?? '',
          fullDescription: fullDescription ?? '',
          factTime: factTime ?? '',
          director: director ?? '',
          source: source ?? '',
          notes: notes ?? '',
          location: location ?? '',
          kr: kr ?? '',
          employment: employment ?? '',
          taskTypeNew: taskTypeNew ?? '',
          subTaskTypeNew: subTaskTypeNew ?? '',
          isApproved: isApproved ?? '',
          isLocked: isLocked ?? '',
        }
      });
    } else if (delID && method) {
      eventMethodsArr.push({
        title: shortDescription ?? '',
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
          object: object ?? '',
          taskType: taskType ?? '',
          subTaskType: subTaskType ?? '',
          fullDescription: fullDescription ?? '',
          factTime: factTime ?? '',
          director: director ?? '',
          source: source ?? '',
          notes: notes ?? '',
          location: location ?? '',
          kr: kr ?? '',
          employment: employment ?? '',
          taskTypeNew: taskTypeNew ?? '',
          subTaskTypeNew: subTaskTypeNew ?? '',
          isApproved: isApproved ?? '',
          isLocked: isLocked ?? '',
        },
      });

      methodsArr.push({
        delID,
        method,
        params: { duration: duration ?? '', objQuant: objQuant ?? '', zones: zones ?? '', editID: editID ?? '' },
        teamList: teamList ?? '', 
        isBrigadier: isBrigadier ?? ''
      });
    }
  });

  // Функция для получения массива заблокированных дат
  function getLockedDatesArray(parentIDsDatesArr: { [key: string]: string }[], isLockedArr: string[]) {
   
    const lockedDatesArray:string[] = [];

    parentIDsDatesArr.forEach((parentObj) => {
      const key = Object.keys(parentObj)[0];
      if (isLockedArr.includes(key)) {
        lockedDatesArray.push(parentObj[key]);
      }
    });
    console.log("🚀 ~ getLockedDatesArray ~ lockedDatesArray:", lockedDatesArray)

    return lockedDatesArray;
  }

  let groupedData = methodsArr.reduce((results, item) => {
    results[item.delID] = results[item.delID] || [];
    results[item.delID].push({
      [item.method]: item.params,
    });

    return results;
  }, {} as { [key: string]: any });

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
