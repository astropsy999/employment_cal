// addEventWithMethods.ts
import { Modal } from 'bootstrap';
import { buttonLoader } from '../ui/buttonLoader';
import { tempLoader } from '../ui/tempLoader';
import {
  convertDateTime,
  refreshBtnAction,
  transformToMethods,
} from '../utils/mainGlobFunctions';
import { MainEventMethods, MethodsArr } from '../types/events';
import addMethodApi from '../api/addMethodApi';


/**
 * Функция для добавления события при наличии в задаче метода или таблицы методов
 * @param {MainEventMethods} firstEventObj - Объект с основными данными события.
 * @param {MethodsArr[]} methodsArray - Массив методов для добавления.
 * @param {(calendar: any) => void} setViewAndDateToLS - Функция для установки вида и даты в localStorage.
 */
const addEventWithMethods = (
  firstEventObj: MainEventMethods,
  methodsArray: MethodsArr[],
  setViewAndDateToLS: (calendar: any) => void,
) => {
  const {
    OBJTYPEID,
    addCalcParamID,
    addZeroName,
    cleanTodayDate,
    dataGroupID,
    dataInterfaceID,
    eleventhCol,
    endDate,
    eventNotesVal,
    eventSourceVal,
    fifteenthCol,
    fifthCol,
    fourteenthCol,
    fourthCol,
    idDB,
    kindOfSubTaskID,
    kindOfTasksID,
    locationVal,
    longDeskVal,
    ninthCol,
    parentID,
    spentTimeVal,
    startDate,
    taskCreatorID,
    taskObjAttr,
    tenthCol,
    thirteenthCol,
    titleVal,
    userCol,
    srvv,
    createNodeUrl,
    employmentVal,
    calendar,
    krBase,
    taskCreatorVal,
    taskObjVal,
    kindOfTasksVal,
    kindOfSubTaskVal,
  } = firstEventObj;

  const eventTaskModalBtn = document.querySelector(
    '#addTaskToCalBtn',
  ) as HTMLButtonElement;
  const addEventModal = document.querySelector(
    '#addEventModal',
  ) as HTMLFormElement;

  let formDataMet = new FormData();
  // Добавление данных в formDataMet (остается без изменений)

  formDataMet.append('ObjTypeID', OBJTYPEID);
  formDataMet.append('ParentID', parentID);
  formDataMet.append('Data[0][name]', addZeroName);
  formDataMet.append('Data[0][value]', cleanTodayDate);
  formDataMet.append('Data[0][isName]', 'false');
  formDataMet.append('Data[0][maninp]', 'false');
  formDataMet.append('Data[0][GroupID]', dataGroupID);
  formDataMet.append('Data[1][name]', fifthCol);
  formDataMet.append('Data[1][value]', taskObjAttr);
  formDataMet.append('Data[1][isName]', 'false');
  formDataMet.append('Data[1][maninp]', 'false');
  formDataMet.append('Data[1][GroupID]', dataGroupID);
  formDataMet.append('Data[4][name]', fourthCol);
  formDataMet.append('Data[4][value]', titleVal);
  formDataMet.append('Data[4][isName]', 'false');
  formDataMet.append('Data[4][maninp]', 'false');
  formDataMet.append('Data[4][GroupID]', dataGroupID);
  formDataMet.append('Data[5][name]', 't8106');
  formDataMet.append('Data[5][value]', longDeskVal);
  formDataMet.append('Data[5][isName]', 'false');
  formDataMet.append('Data[5][maninp]', 'false');
  formDataMet.append('Data[5][GroupID]', dataGroupID);
  formDataMet.append('Data[6][name]', ninthCol);
  formDataMet.append('Data[6][value]', spentTimeVal);
  formDataMet.append('Data[6][isName]', 'false');
  formDataMet.append('Data[6][maninp]', 'false');
  formDataMet.append('Data[6][GroupID]', dataGroupID);
  formDataMet.append('Data[7][name]', tenthCol);
  formDataMet.append('Data[7][value]', taskCreatorID);
  formDataMet.append('Data[7][isName]', 'false');
  formDataMet.append('Data[7][maninp]', 'false');
  formDataMet.append('Data[7][GroupID]', dataGroupID);
  formDataMet.append('Data[8][name]', eleventhCol);
  formDataMet.append('Data[8][value]', eventSourceVal);
  formDataMet.append('Data[8][isName]', 'false');
  formDataMet.append('Data[8][maninp]', 'false');
  formDataMet.append('Data[8][GroupID]', dataGroupID);
  formDataMet.append('Data[9][name]', 't8107');
  formDataMet.append('Data[9][value]', eventNotesVal);
  formDataMet.append('Data[9][isName]', 'false');
  formDataMet.append('Data[9][maninp]', 'false');
  formDataMet.append('Data[9][GroupID]', dataGroupID);
  formDataMet.append('Data[10][name]', userCol);
  formDataMet.append('Data[10][value]', idDB);
  formDataMet.append('Data[10][isName]', 'false');
  formDataMet.append('Data[10][maninp]', 'false');
  formDataMet.append('Data[10][GroupID]', dataGroupID);
  formDataMet.append('Data[11][name]', thirteenthCol);
  formDataMet.append('Data[11][value]', startDate);
  formDataMet.append('Data[11][isName]', 'false');
  formDataMet.append('Data[11][maninp]', 'false');
  formDataMet.append('Data[11][GroupID]', dataGroupID);
  formDataMet.append('Data[12][name]', fourteenthCol);
  formDataMet.append('Data[12][value]', endDate);
  formDataMet.append('Data[12][isName]', 'false');
  formDataMet.append('Data[12][maninp]', 'false');
  formDataMet.append('Data[12][GroupID]', dataGroupID);
  formDataMet.append('Data[13][name]', fifteenthCol);
  formDataMet.append('Data[13][value]', locationVal);
  formDataMet.append('Data[13][isName]', 'false');
  formDataMet.append('Data[13][maninp]', 'false');
  formDataMet.append('Data[13][GroupID]', dataGroupID);
  formDataMet.append('Data[17][name]', '8852');
  formDataMet.append('Data[17][value]', krBase);
  formDataMet.append('Data[17][isName]', 'false');
  formDataMet.append('Data[17][maninp]', 'false');
  formDataMet.append('Data[17][GroupID]', dataGroupID);
  formDataMet.append('Data[14][name]', '9042');
  formDataMet.append('Data[14][isName]', 'false');
  formDataMet.append('Data[14][maninp]', 'false');
  formDataMet.append('Data[14][GroupID]', dataGroupID);
  formDataMet.append('Data[14][value]', employmentVal);
  formDataMet.append('Data[15][name]', '9043');
  formDataMet.append('Data[15][isName]', 'false');
  formDataMet.append('Data[15][maninp]', 'false');
  formDataMet.append('Data[15][GroupID]', dataGroupID);
  formDataMet.append('Data[15][value]', kindOfTasksID);
  formDataMet.append('Data[16][name]', '9044');
  formDataMet.append('Data[16][isName]', 'false');
  formDataMet.append('Data[16][maninp]', 'false');
  formDataMet.append('Data[16][GroupID]', dataGroupID);
  formDataMet.append('Data[16][value]', kindOfSubTaskID);
  formDataMet.append('InterfaceID', dataInterfaceID);
  formDataMet.append('CalcParamID', addCalcParamID);
  formDataMet.append('isGetForm', '0');
  formDataMet.append('ImportantInterfaceID', '');
  formDataMet.append('Ignor39', '0');
  formDataMet.append('templ_mode', '0');

  fetch(srvv + createNodeUrl, {
    credentials: 'include',
    method: 'post',
    body: formDataMet,
  })
    .then((response) => response.json())
    .then((data) => {
      const { object } = data.results[0];
      buttonLoader(eventTaskModalBtn, true);
      Modal.getInstance(addEventModal)!.hide();

      // Создаем массив промисов для добавления методов
      const methodPromises = methodsArray.map((element) =>
        addMethodApi(object, element),
      );

      // Ждем, пока все методы будут добавлены
      Promise.all(methodPromises)
        .then(() => {
          const isRootUser =
            localStorage.getItem('managerName') ===
            localStorage.getItem('selectedUserName');

          // Добавляем событие в календарь без перезагрузки
          calendar.addEvent({
            title: titleVal,
            allDay: false,
            classNames: isRootUser
              ? 'bg-soft-secondary skeleton'
              : 'bg-soft-primary',
            start: convertDateTime(startDate),
            end: convertDateTime(endDate),
            extendedProps: {
              delID: object,
              director: taskCreatorVal,
              factTime: spentTimeVal,
              fullDescription: longDeskVal,
              notes: eventNotesVal,
              object: taskObjVal,
              source: eventSourceVal,
              location: locationVal,
              employment: employmentVal,
              taskTypeNew:
                kindOfTasksVal === 'Не выбрано' ? '' : kindOfTasksVal,
              subTaskTypeNew:
                kindOfSubTaskVal === 'Не выбрано' ? '' : kindOfSubTaskVal,
              isApproved: '',
              methods: transformToMethods(methodsArray, object),
            },
          });

          if (isRootUser) {
            tempLoader(true);
            setTimeout(() => {
              buttonLoader(eventTaskModalBtn, false);
              refreshBtnAction(calendar);
            }, 999);
          }
        })
        .catch((error) => {
          console.error('Ошибка при добавлении методов:', error);
          // Обработка ошибки, если необходимо
        });
    })
    .catch((error) => {
      console.error('Ошибка при создании события:', error);
      // Обработка ошибки, если необходимо
    });
};

export default addEventWithMethods;
