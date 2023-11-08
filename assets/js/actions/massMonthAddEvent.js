import {
  selValidation,
  transformDateTime,
  addZeroBefore,
  getParentIDfromDate,
  notChoosenCleaning,
  convertDateTime,
  refreshBtnAction,
  validateTotalTimeOnObject,
  handleWooTime,
  calculateTotalHours,
  transformToMethods,
} from '../utils/mainGlobFunctions';
import * as GDD from '../api/getDropDownData';
import * as C from '../config';
import { setViewAndDateToLS } from '../ui/setViewAndDateToLS';
import addMethodToBase from '../methods/addMethodToBase';
import grabMethodsDataTable from '../methods/grabMethodsDataTable';
import { Modal } from 'bootstrap';
import { tempLoader } from '../ui/tempLoader';
import { buttonLoader } from '../ui/buttonLoader';
import { forceCalendarRecalculate } from '../utils/fullcalendar';

const api = {
  srvv: C.srvv,
  addValueObjTrue: C.addValueObjTrue,
  deleteNodeURL: C.deleteNodeURL,
  createNodeUrl: C.createNodeUrl,
  getreportFormodule: C.getreportFormodule,
  GetExcelforCalc: C.GetExcelforCalc,
};

/**
 * Массовое добавление задач в календарь в месячном виде
 * @param {Object} calendar
 * @param {Object} info
 */
export const massMonthAddEvent = (calendar, info) => {
  let justAddedDelID = '';
  const kindOfTasksMassMonth = document.querySelector('#kindOfTasksMassMonth');
  const kindOfSubTaskMassMonth = document.querySelector(
    '#kindOfSubTaskMassMonth',
  );
  const eventTitleMassMonth = document.querySelector('#eventTitleMassMonth');
  const longDescMassMonth = document.querySelector('#longDescMassMonth');
  const taskObjMassMonth = document.querySelector('#taskObjMassMonth');
  const taskCreatorMassMonth = document.querySelector('#taskCreatorMassMonth');
  const eventStartDateMassMonth = document.querySelector(
    '#eventStartDateMassMonth',
  );
  const eventEndDateMassMonth = document.querySelector(
    '#eventEndDateMassMonth',
  );
  const eventSpentTimeMassMonth = document.querySelector(
    '#eventSpentTimeMassMonth',
  );
  const eventSourceMassMonth = document.querySelector('#eventSourceMassMonth');
  const eventNotesMassMonth = document.querySelector('#eventNotesMassMonth');
  const locationsMassMonth = document.querySelector('#locObjMassMonth');
  const addTaskToCalBtnMassMonth = document.querySelector(
    '#addTaskToCalBtnMassMonth',
  );
  const employmentMassMonth = document.querySelector('#employmentMassMonth');

  // Помечаем обязательные

  selValidation(locationsMassMonth);
  selValidation(kindOfTasksMassMonth);

  const dataObj = JSON.parse(sessionStorage.getItem('dataObj'));
  const dataCreator = JSON.parse(sessionStorage.getItem('dataCreator'));
  const locObj = JSON.parse(sessionStorage.getItem('locObj'));
  const emplObj = JSON.parse(sessionStorage.getItem('emplObj'));

  const isRootUser =
    localStorage.getItem('managerName') ===
    localStorage.getItem('selectedUserName');

  // Выпадающие списки

  GDD.addDataToSelector(taskObjMassMonth, dataObj);
  GDD.addDataToSelector(taskCreatorMassMonth, dataCreator);
  GDD.addDataToSelector(locationsMassMonth, locObj);
  GDD.addDataToSelector(employmentMassMonth, emplObj);
  GDD.getTypesOfWorkOptions(
    kindOfTasksMassMonth,
    kindOfSubTaskMassMonth,
    localStorage.getItem('iddb'),
  );

  if (calendar.view.type === 'dayGridMonth') {
    const addEventModalMassMonth = document.querySelector(
      '#addEventModalMassMonth',
    );

    const modal = new Modal(addEventModalMassMonth);
    modal.show();

    const flatpickrStart = flatpickr('#eventStartDateMassMonth', {
      dateFormat: 'd.m.Y',
      enableTime: false,
      position: 'above',
      allowInput: true,
      locale: 'ru',
    });
    const flatpickrEnd = flatpickr('#eventEndDateMassMonth', {
      dateFormat: 'd.m.Y',
      enableTime: false,
      position: 'above',
      allowInput: true,
      locale: 'ru',
    });

    flatpickrStart.setDate(transformDateTime(info.start));
    flatpickrEnd.setDate(transformDateTime(info.end));

    // Находим массив дат между началом и окончанием

    const start = info.start;
    const end = info.end;

    const realStart = new Date(start.setDate(start.getDate() - 1));
    const realEnd = new Date(end.setDate(end.getDate() - 1));

    let dateArray = [];

    const datesArrayBetween = (startDate, endDate) => {
      let today = startDate;

      while (today < endDate) {
        dateArray.push(today);
        let tomorrow = new Date(today.setDate(today.getDate() + 1));
        today = tomorrow;
      }

      return dateArray;
    };

    let eventsDatesArr = datesArrayBetween(realStart, realEnd);

    // Количество рабочих часов в день по умолчанию
    if (employmentMassMonth?.value === 'Работа') {
      eventSpentTimeMassMonth.value = 8;
    }
    // Установка рабочих часов по умолчанию при смене Занятости
    employmentMassMonth.addEventListener('change', () => {
      if (employmentMassMonth?.value === 'Работа') {
        eventSpentTimeMassMonth.value = 8;
      }
    });
    eventStartDateMassMonth.value = eventStartDateMassMonth.value.slice(0, 10);
    eventEndDateMassMonth.value = transformDateTime(realEnd).slice(0, 10);

    addTaskToCalBtnMassMonth.addEventListener('click', (e) => {
      // e.preventDefault();
      // return;
      const isMethodsAvailableMode =
        kindOfTasksMassMonth.value === 'Техническое диагностирование' ||
        kindOfSubTaskMassMonth.value === 'Проведение контроля в лаборатории';

      buttonLoader(addEventModalMassMonth, true);
      const checkEmploymentMode = () => {
        const emplModeMass = document.querySelector('#employmentMassMonth');
        if (
          emplModeMass.value === 'Работа' &&
          locationsMassMonth.value !== 'В дороге'
        ) {
          return true;
        } else if (
          emplModeMass.value === 'Работа' &&
          locationsMassMonth.value === 'В дороге'
        ) {
          return 'onRoad';
        }
        return false;
      };
      const valCond = checkEmploymentMode();

      const validateCondition = (valC) => {
        switch (valC) {
          case false:
            return null === undefined;
          case true:
            return (
              locationsMassMonth.value === 'Не выбрано' ||
              kindOfTasksMassMonth.value === 'Не выбрано'
            );
          case 'onRoad':
            locationsMassMonth.value === 'Не выбрано';
        }
      };

      const valCondition = validateCondition(valCond);
      const validateTotalTime = validateTotalTimeOnObject('month');

      if (valCondition) {
        if (locationsMassMonth.value === 'Не выбрано') {
          locationsMassMonth.classList.add('is-invalid');
        }

        if (kindOfTasksMassMonth.value === 'Не выбрано') {
          kindOfTasksMassMonth.classList.add('is-invalid');
        }
        e.preventDefault();
      } else if (!validateTotalTime) {
        handleWooTime('month');
        e.preventDefault();
        return;
      } else {
        e.preventDefault();

        // return;
        let methodsTable;
        methodsTable = document.querySelector('.methods-tbody');

        // Создание событий по нажатию кнопки
        let massMethTbl;
        if (methodsTable) {
          tempLoader(true);
          massMethTbl = grabMethodsDataTable(methodsTable);
        }

        eventsDatesArr.forEach((mEvent) => {
          const startTime = 9;
          const endTime =
            eventSpentTimeMassMonth.value != 0
              ? startTime + +eventSpentTimeMassMonth.value
              : 17;

          const startDateTime = `${transformDateTime(mEvent).slice(
            0,
            10,
          )} ${addZeroBefore(startTime)}:00`;
          const endDateTime = `${transformDateTime(mEvent).slice(
            0,
            10,
          )} ${addZeroBefore(endTime)}:00`;

          // Преобразование даты добавления события из объекта new Data() в dd.mm.yyyy

          const cleanTodayDate = startDateTime.slice(0, 10);

          const kr = document.querySelector('#flexCheckDefault');
          const krState = (krelem) => {
            if (krelem && krelem.checked) {
              return 'Да';
            } else {
              return '';
            }
          };

          let formDataMassMonth = new FormData();

          formDataMassMonth.append('ObjTypeID', C.OBJTYPEID);
          formDataMassMonth.append('ParentID', getParentIDfromDate(mEvent));
          formDataMassMonth.append('Data[0][name]', C.addZeroName);
          formDataMassMonth.append('Data[0][value]', cleanTodayDate);
          formDataMassMonth.append('Data[0][isName]', 'false');
          formDataMassMonth.append('Data[0][maninp]', 'false');
          formDataMassMonth.append('Data[0][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[1][name]', C.fifthCol);
          formDataMassMonth.append(
            'Data[1][value]',
            taskObjMassMonth[
              taskObjMassMonth.options.selectedIndex
            ].getAttribute('objidattr') || '',
          );
          formDataMassMonth.append('Data[1][isName]', 'false');
          formDataMassMonth.append('Data[1][maninp]', 'false');
          formDataMassMonth.append('Data[1][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[4][name]', C.fourthCol);
          formDataMassMonth.append('Data[4][value]', eventTitleMassMonth.value);
          formDataMassMonth.append('Data[4][isName]', 'false');
          formDataMassMonth.append('Data[4][maninp]', 'false');
          formDataMassMonth.append('Data[4][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[5][name]', 't8106');
          formDataMassMonth.append('Data[5][value]', longDescMassMonth.value);
          formDataMassMonth.append('Data[5][isName]', 'false');
          formDataMassMonth.append('Data[5][maninp]', 'false');
          formDataMassMonth.append('Data[5][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[6][name]', C.ninthCol);
          formDataMassMonth.append(
            'Data[6][value]',
            eventSpentTimeMassMonth.value,
          );
          formDataMassMonth.append('Data[6][isName]', 'false');
          formDataMassMonth.append('Data[6][maninp]', 'false');
          formDataMassMonth.append('Data[6][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[7][name]', C.tenthCol);
          formDataMassMonth.append(
            'Data[7][value]',
            taskCreatorMassMonth[
              taskCreatorMassMonth.options.selectedIndex
            ].getAttribute('objidattr') || '',
          );
          formDataMassMonth.append('Data[7][isName]', 'false');
          formDataMassMonth.append('Data[7][maninp]', 'false');
          formDataMassMonth.append('Data[7][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[8][name]', C.eleventhCol);
          formDataMassMonth.append(
            'Data[8][value]',
            eventSourceMassMonth.value,
          );
          formDataMassMonth.append('Data[8][isName]', 'false');
          formDataMassMonth.append('Data[8][maninp]', 'false');
          formDataMassMonth.append('Data[8][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[9][name]', 't8107');
          formDataMassMonth.append('Data[9][value]', eventNotesMassMonth.value);
          formDataMassMonth.append('Data[9][isName]', 'false');
          formDataMassMonth.append('Data[9][maninp]', 'false');
          formDataMassMonth.append('Data[9][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[10][name]', C.userCol);
          formDataMassMonth.append(
            'Data[10][value]',
            localStorage.getItem('iddb'),
          );
          formDataMassMonth.append('Data[10][isName]', 'false');
          formDataMassMonth.append('Data[10][maninp]', 'false');
          formDataMassMonth.append('Data[10][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[11][name]', C.thirteenthCol);
          formDataMassMonth.append('Data[11][value]', startDateTime);
          formDataMassMonth.append('Data[11][isName]', 'false');
          formDataMassMonth.append('Data[11][maninp]', 'false');
          formDataMassMonth.append('Data[11][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[12][name]', '8651');
          formDataMassMonth.append('Data[12][value]', endDateTime);
          formDataMassMonth.append('Data[12][isName]', 'false');
          formDataMassMonth.append('Data[12][maninp]', 'false');
          formDataMassMonth.append('Data[12][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[13][name]', C.fifteenthCol);
          formDataMassMonth.append(
            'Data[13][value]',
            notChoosenCleaning(locationsMassMonth.value),
          );
          formDataMassMonth.append('Data[13][isName]', 'false');
          formDataMassMonth.append('Data[13][maninp]', 'false');
          formDataMassMonth.append('Data[13][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[14][name]', '8852');
          formDataMassMonth.append('Data[14][value]', krState(kr));
          formDataMassMonth.append('Data[14][isName]', 'false');
          formDataMassMonth.append('Data[14][maninp]', 'false');
          formDataMassMonth.append('Data[14][GroupID]', C.dataGroupID);
          formDataMassMonth.append(
            'Data[15][value]',
            employmentMassMonth.value,
          );
          formDataMassMonth.append('Data[15][isName]', 'false');
          formDataMassMonth.append('Data[15][maninp]', 'false');
          formDataMassMonth.append('Data[15][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[15][name]', '9042');
          formDataMassMonth.append('Data[16][name]', '9043');
          formDataMassMonth.append(
            'Data[16][value]',
            kindOfTasksMassMonth[
              kindOfTasksMassMonth.options.selectedIndex
            ].getAttribute('taskid') || '',
          );
          formDataMassMonth.append('Data[16][isName]', 'false');
          formDataMassMonth.append('Data[16][maninp]', 'false');
          formDataMassMonth.append('Data[16][GroupID]', C.dataGroupID);
          formDataMassMonth.append('Data[17][name]', '9044');
          formDataMassMonth.append('Data[17][isName]', 'false');
          formDataMassMonth.append('Data[17][maninp]', 'false');
          formDataMassMonth.append('Data[17][GroupID]', C.dataGroupID);
          formDataMassMonth.append(
            'Data[17][value]',
            kindOfSubTaskMassMonth[
              kindOfSubTaskMassMonth.options.selectedIndex
            ].getAttribute('subtaskid') || '',
          );
          formDataMassMonth.append('InterfaceID', C.dataInterfaceID);
          formDataMassMonth.append('CalcParamID', C.addCalcParamID);
          formDataMassMonth.append('isGetForm', '0');
          formDataMassMonth.append('ImportantInterfaceID', '');
          formDataMassMonth.append('Ignor39', '0');
          formDataMassMonth.append('templ_mode', '0');

          fetch(C.srvv + C.createNodeUrl, {
            credentials: 'include',
            method: 'post',
            body: formDataMassMonth,
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              const objID = data.results[0].object;
              justAddedDelID = objID;

              if (massMethTbl) {
                setViewAndDateToLS(calendar);
                addMethodToBase(massMethTbl, objID, api);
              }

              // Добавление события на клиенте (без перезагрузки)

              calendar.addEvent({
                title: eventTitleMassMonth.value,
                allDay: false,
                classNames:
                  isRootUser && isMethodsAvailableMode
                    ? 'bg-soft-secondary skeleton'
                    : 'bg-soft-primary',
                start: convertDateTime(startDateTime),
                end: convertDateTime(endDateTime),
                extendedProps: {
                  delID: justAddedDelID,
                  director: taskCreatorMassMonth.value,
                  factTime: eventSpentTimeMassMonth.value,
                  fullDescription: longDescMassMonth.value,
                  notes: eventNotesMassMonth.value,
                  object:
                    taskObjMassMonth.value === 'Не выбрано'
                      ? ''
                      : taskObjMassMonth.value,
                  source: eventSourceMassMonth.value,
                  subTaskType:
                    kindOfSubTaskMassMonth.value === 'Не выбрано'
                      ? ''
                      : kindOfSubTaskMassMonth.value,
                  taskType:
                    kindOfTasksMassMonth.value === 'Не выбрано'
                      ? ''
                      : kindOfTasksMassMonth.value,
                  location: locationsMassMonth.value,
                  kr: krState(kr),
                  employment: employmentMassMonth.value,
                  subTaskTypeNew:
                    kindOfSubTaskMassMonth.value === 'Не выбрано'
                      ? ''
                      : kindOfSubTaskMassMonth.value,
                  taskTypeNew:
                    kindOfTasksMassMonth.value === 'Не выбрано'
                      ? ''
                      : kindOfTasksMassMonth.value,
                  isApproved: '',
                  methods: transformToMethods(massMethTbl),
                },
              });

              if (isRootUser && isMethodsAvailableMode) {
                tempLoader(true);
                setTimeout(() => {
                  buttonLoader(addTaskToCalBtnMassMonth);
                  refreshBtnAction(calendar);
                }, 999);
              }

              if (!isMethodsAvailableMode) {
                buttonLoader(addTaskToCalBtnMassMonth);
                forceCalendarRecalculate(calendar);
              }
              tempLoader(false);
              forceCalendarRecalculate(calendar);
            });
        });
        localStorage.setItem('fcDefaultView', calendar.view.type);
        modal.hide();
        calendar.destroy();
        calendar.render();
        eventsDatesArr = [];
      }
    });

    document.addEventListener('hide.bs.modal', () => {
      eventsDatesArr = [];
      eventSpentTimeMassMonth.classList.remove('is-invalid');
      eventSpentTimeMassMonth.style.color = 'unset';
    });
  }
};
