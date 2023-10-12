//константы конфига
import { addEventToCal } from './actions/addEvent';
import { approveEmploynment } from './actions/approveEmploynment';
import { delEvent } from './actions/delEvent';
import { editEvent } from './actions/editEvent';
import { lockEmploynment } from './actions/lockEmploynment';
import { massMonthAddEvent } from './actions/massMonthAddEvent';
import { multipleAddEventsToBase } from './actions/multiAddEvents';
import * as GDD from './api/getDropDownData';
import { getSelectedUserData } from './api/getSlectedUserData';
import { getUserID } from './api/getUserID';
import { fullCalendarInit } from './utils/fullcalendar';
import {
  addValueObjTrue,
  createNodeUrl,
  deleteNodeURL,
  GetExcelforCalc,
  getreportFormodule,
  getReports,
  ParentGroupID,
  srvv,
} from './config';
import addWooContainer from './methods/addWooContainer';
import getEmplReport from './report/getEmplReport';
import repModalTemplate from './report/repModalTemplate';
import { usersForManagersSelector } from './ui/calendarHeader';
import { changeUserData } from './ui/changeUserData';
import { Modal } from 'bootstrap';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from './ui/checkBlockedDays.js';
import { checkCurrentEventsAndBlockApproveBtn } from './ui/checkCurrentEvents.js';
import { eventContent } from './ui/eventContent.js';
import { eventDrop } from './ui/eventDrop.js';
import { parseResievedDataToCal } from './ui/parseResievedDataToCal.js';
import { saveHighlightedReg } from './ui/saveHighlightedReg.js';
import { setViewAndDateToLS } from './ui/setViewAndDateToLS.js';
import { stretchViewDepEvents } from './ui/stretchViewDepEvents.js';
import {
  getTemplate,
  getTemplateNoFooter,
  getTemplateNoFooterNoDelete,
} from './ui/templates.js';
import { tempLoader } from './ui/tempLoader.js';
import { docReady, utils } from './utils/docReady.js';
import { renderCalendar } from './utils/fullcalendar.js';
import {
  addZeroBefore,
  changeDirectZero,
  checkAndForbiddenOutOfDay,
  checkEmploymentStatus,
  convertDateTime,
  getMonthRange,
  isOutOfRange,
  noEditPartOfInput,
  removeAlarmFromSelectorsInModals,
  selValidation,
  timeInputsValidation,
  transformDateTime,
  blockBtnAddTitle,
  sendNewEndDateTimeToBase,
} from './utils/mainGlobFunctions.js';
import { toggleElem } from './utils/toggleElem.js';

export const api = {
  srvv,
  addValueObjTrue,
  deleteNodeURL,
  createNodeUrl,
  getreportFormodule,
  GetExcelforCalc,
};

const employmentCalendar = async () => {
  tempLoader(true);

  /* -------------------------------------------------------------------------- */
  /*                                    Utils                                   */
  /* -------------------------------------------------------------------------- */

  docReady();

  /* -------------------------------------------------------------------------- */
  /*                                FullCalendar                                */
  /* -------------------------------------------------------------------------- */

  removeAlarmFromSelectorsInModals();

  /* -------------------------------------------------------------------------- */

  /*                  ОПРЕДЕЛЕНИЕ ID ПОЛЬЗОВАТЕЛЯ                               */

  /* -------------------------------------------------------------------------- */

  const iddbName = await getUserID();
  let idDB;
  let userName;
  idDB = iddbName[0].ObjID.toString();
  console.log('idDB: ', idDB);

  localStorage.setItem('iddb', idDB);

  usersForManagersSelector(idDB);
  GDD.getObjectsOptions();
  GDD.getDirectorOptions();
  GDD.getLocationOptions();
  GDD.getEmplOptions();
  localStorage.getItem('iddb') &&
    GDD.getGlobalTasksTypes(localStorage.getItem('iddb'));
  /* -------------------------------------------------------------------------- */

  /*                 ПОЛУЧЕНИЕ ДАННЫХ ДЛЯ КАЛЕНДАРЯ                             */

  /* -------------------------------------------------------------------------- */

  // Определяем текущий месяц

  const currentMonthRange = getMonthRange();

  let data = await getSelectedUserData(
    idDB,
    currentMonthRange.start,
    currentMonthRange.end,
  );

  /* -------------------------------------------------------------------------- */

  /*                  ПАРСИНГ ПОЛУЧЕННЫХ ДАННЫХ                                 */

  /* -------------------------------------------------------------------------- */
  let { events, parentIdDataArr, lockedDatesArray } =
    parseResievedDataToCal(data);

  sessionStorage.setItem('events', JSON.stringify(events));
  localStorage.setItem('lockedDatesArray', JSON.stringify(lockedDatesArray));
  localStorage.setItem('parentIdDataArr', JSON.stringify(parentIdDataArr));
  tempLoader(false);

  /*-----------------------------------------------
|   Calendar
-----------------------------------------------*/

  var appCalendarInit = function appCalendarInit() {
    var Selectors = {
      ACTIVE: '.active',
      ADD_EVENT_FORM: '#addEventForm',
      ADD_EVENT_MODAL: '#addEventModal',
      MULTI_ADD_EVENT_MODAL: '#miltiAddEventModal',
      EDIT_EVENT_MODAL: '#editEventModal',
      CALENDAR: '#appCalendar',
      CALENDAR_TITLE: '.calendar-title',
      DATA_CALENDAR_VIEW: '[data-fc-view]',
      DATA_EVENT: '[data-event]',
      DATA_VIEW_TITLE: '[data-view-title]',
      EVENT_DETAILS_MODAL: '#eventDetailsModal',
      EVENT_DETAILS_MODAL_CONTENT: '#eventDetailsModal .modal-content',
      EVENT_START_DATE: '#addEventModal [name="startDate"]',
      EVENT_END_DATE: '#addEventModal [name="endDate"]',
      INPUT_TITLE: '[name="title"]',
    };
    var Events = {
      CLICK: 'click',
      SHOWN_BS_MODAL: 'shown.bs.modal',
      SUBMIT: 'submit',
    };
    var DataKeys = {
      EVENT: 'event',
      FC_VIEW: 'fc-view',
    };
    var ClassNames = {
      ACTIVE: 'active',
    };
    var eventList = events.reduce(function (acc, val) {
      return val.schedules
        ? acc.concat(val.schedules.concat(val))
        : acc.concat(val);
    }, []);

    var updateTitle = function updateTitle(title) {
      document.querySelector(Selectors.CALENDAR_TITLE).textContent = title;
    };

    var appCalendar = document.querySelector(Selectors.CALENDAR);
    const addEventModal = document.querySelector(Selectors.ADD_EVENT_MODAL);
    const multiAddEventModal = document.querySelector(
      Selectors.MULTI_ADD_EVENT_MODAL,
    );
    const editEventModal = document.querySelector(Selectors.EDIT_EVENT_MODAL);
    const eventDetailsModal = document.querySelector(
      Selectors.EVENT_DETAILS_MODAL,
    );

    let shiftKeyUp;
    // Флаг необходим для избежания двойного запуска функции подгрузки данных, которая происходит в результате двойной
    // инициализации объекта datesSet, которая происходит из-за повторного запуска определения или изменения интервала
    // времени
    let additionalRangeLoaded = false;
    let dayCellContentLoaded = false;

    /* -------------------------------------------------------------------------- */
    /*                  ОСНОВНЫЕ НАСТРОЙКИ КАЛЕНДАРЯ                              */
    /* -------------------------------------------------------------------------- */

    if (appCalendar) {
      var calendar = renderCalendar(appCalendar, {
        headerToolbar: false,
        nowIndicator: true,
        dayMaxEvents: 3,
        allDaySlot: true,
        // views: {
        //   dayGridMonth: {
        //     allDaySlot: false,
        //   },
        //   timeGridWeek: {
        //     allDaySlot: true,
        //   },
        //   timeGridDay: {
        //     allDaySlot: true,
        //   },
        // },

        allDayContent: function (info) {
          return 'Σ';
        },
        selectable: true,
        eventDrop,
        eventAdd: function () {
          calendar.render();
        },
        eventRemove: function () {
          calendar.render();
        },

        eventContent,
        contentHeight: 'auto',
        stickyHeaderDates: true,
        slotMinTime: '08:00:00',
        slotMaxTime: '19:00:00',
        eventTimeFormat: {
          hour: 'numeric',
          // minute: false,
          omitZeroMinute: true,
          meridiem: true,
        },

        events: eventList,
        eventSources: eventList,
        eventTextColor: '#2B3643',
        eventColor: '#CEE2F2',
        eventDisplay: 'block',
        eventBackgroundColor: '#CEE2F2',
        eventClick: function eventClick(info) {
          const isRootUser = checkUserIDBySelector();

          const selectedUserLevel = Number(
            localStorage.getItem('managerLevel'),
          );
          const currentUserLevel = Number(
            localStorage.getItem('currentManagerLevel'),
          );
          if (info.event.url) {
            window.open(info.event.url, '_blank');
            info.jsEvent.preventDefault();
          } else {
            if (isRootUser) {
              var template = getTemplate(info.event);

              document.querySelector(
                Selectors.EVENT_DETAILS_MODAL_CONTENT,
              ).innerHTML = template;
              var modal = new Modal(eventDetailsModal);
            } else {
              console.log('isRootUserELSE: ', isRootUser);
              if (selectedUserLevel && currentUserLevel >= selectedUserLevel) {
                template = getTemplateNoFooterNoDelete(info.event);
              } else {
                template = getTemplateNoFooter(info.event);
              }

              document.querySelector(
                Selectors.EVENT_DETAILS_MODAL_CONTENT,
              ).innerHTML = template;
              var modal = new Modal(eventDetailsModal);
            }
            modal.show();

            const delEventBtn = document.querySelector('#delEventBtn');
            let delID = info.event._def.extendedProps.delID;
            const editEventBtn = document.querySelector('#editEventBtn');
            let typeID;
            let idx;

            typeID = delEventBtn?.getAttribute('data-typeID');
            idx = editEventBtn && editEventBtn.getAttribute('data-idx');

            // Преводим ID объекты к адекватному виду
            let dataObjectKeys = [];
            let dataObjectValues = [];
            let dataObjectsID = {};
            let dataCreatorKeys = [];
            let dataCreatorValues = [];
            let dataCreatorsID = {};
            let dataTaskListKeys = [];
            let dataTaskListValues = [];
            let dataTasksID = {};

            const dataObj = JSON.parse(sessionStorage.getItem('dataObj'));
            const dataCreator = JSON.parse(
              sessionStorage.getItem('dataCreator'),
            );

            // Объекты

            dataObj.forEach((objectStr) => {
              dataObjectKeys.push(objectStr.Name.replaceAll('&quot;', '"'));
              dataObjectValues.push(objectStr.ID);
            });

            for (let i = 0; i < dataObjectKeys.length; i++) {
              let key = dataObjectKeys[i];
              let value = dataObjectValues[i];

              dataObjectsID[key] = value;
            }

            localStorage.setItem(
              'dataObjectsID',
              JSON.stringify(dataObjectsID),
            );

            // Постановщик

            dataCreator.forEach((creator) => {
              dataCreatorKeys.push(creator.Name);
              dataCreatorValues.push(creator.ID);
            });

            for (let i = 0; i < dataCreatorKeys.length; i++) {
              let key = dataCreatorKeys[i];
              let value = dataCreatorValues[i];

              dataCreatorsID[key] = value;
            }

            localStorage.setItem(
              'dataCreatorsID',
              JSON.stringify(dataCreatorsID),
            );

            // Вид работ

            JSON.parse(localStorage.getItem('globalTasksTypes')).forEach(
              (task) => {
                dataTaskListKeys.push(task.Name);
                dataTaskListValues.push(task.ID);
              },
            );

            for (let i = 0; i < dataTaskListKeys.length; i++) {
              let key = dataTaskListKeys[i];
              let value = dataTaskListValues[i];

              dataTasksID[key] = value;
            }
            localStorage.setItem('dataTasksID', JSON.stringify(dataTasksID));

            // ПОДВИД РАБОТ

            let dataSubTaskListKeys = [];
            let dataSubTaskListValues = [];

            // Удаление задачи
            delEvent(info, delID, isMultiMode, modal, shiftKeyUp, calendar);

            const clickedEvent = info.event;
            console.log('clickedEvent: ', clickedEvent);
            // Редактирование задачи
            editEvent(info, calendar, modal, clickedEvent);
          }
        },
        dayCellContent: function (info) {
          function calculateTotalHours(date) {
            let totalHours = 0;
            let currentDate = null;

            let updatedEvents = calendar
              ?.getEvents()
              ?.map((event) => event.toPlainObject());

            updatedEvents?.forEach((event) => {
              const eventDate = new Date(event.start);
              const factTime = Number(event.extendedProps.factTime);

              // Если currentDate еще не установлена, установите ее и начните счет для выбранной даты
              if (!currentDate) {
                currentDate = new Date(eventDate);
              }

              // Если дата события совпадает с currentDate, добавьте factTime к totalHours
              if (
                date.getDate() === eventDate.getDate() &&
                date.getMonth() === eventDate.getMonth() &&
                date.getFullYear() === eventDate.getFullYear()
              ) {
                totalHours += factTime;
              } else {
                // Если дата события больше не совпадает, верните totalHours и начните новый счет
                currentDate = new Date(eventDate);
              }
            });
            return totalHours;
          }

          return calculateTotalHours(info.date);
        },
        datesSet: function (dateInfo) {
          console.log('datesSet: ');
          // Дата начала недели после переключения на новую неделю
          const findStartDate = dateInfo.startStr.slice(0, 10);
          // Дата конца недели после переключения на новую неделю
          const findEndtDate = dateInfo.endStr.slice(0, 10);

          // Преобразование массива {id: дата} в массив дат
          // const loadedDates = () => {
          //   const currentParentIdDataArr = JSON.parse(
          //     localStorage.getItem('parentIdDataArr'),
          //   );
          //   return currentParentIdDataArr.map((dt) => Object.values(dt)[0]);
          // };

          // const savedLoadedDates = loadedDates();

          // // Конвертация даты чч:мм:гггг => гггг-мм-чч
          // function convertDateFormat(inputDate) {
          //   // Разбиваем входную дату на день, месяц и год
          //   const [day, month, year] = inputDate.split('.');

          //   // Создаем новый объект даты с полученными значениями
          //   const newDate = new Date(`${year}-${month}-${day}`);

          //   // Преобразуем новую дату в строку в формате 'YYYY-MM-DD'
          //   const formattedDate = newDate.toISOString().slice(0, 10);

          //   return formattedDate;
          // }
          // // Поиск дата начала новой недели в сохраненном массиве загруженных дат
          // const isStartDateFound = savedLoadedDates.find(
          //   (fndate) => convertDateFormat(fndate) === findStartDate,
          // );
          // // Поиск дата конца новой недели в сохраненном массиве загруженных дат
          // const isEndDateFound = savedLoadedDates.find(
          //   (fndate) => convertDateFormat(fndate) === findEndtDate,
          // );

          // // Если дата не найдена, тогда запускаем логику подгрузки нового интервала дат
          // if (
          //   (!isStartDateFound || !isEndDateFound) &&
          // !additionalRangeLoaded
          // ) {
          //   tempLoader(true);
          //   // Поиск нового интервала для подгрузки
          //   let newRangeDate, newRangeToLoad;
          //   if (!isStartDateFound) {
          //     newRangeDate = dateInfo.start;
          //     newRangeToLoad = getMonthRange(newRangeDate);
          //   } else if (!isEndDateFound) {
          //     newRangeDate = dateInfo.end;
          //     newRangeToLoad = getMonthRange(newRangeDate);
          //   }

          //   const loadAdditionalRange = async () => {
          //     // Запускаем функцию подгрузки

          //     await getSelectedUserData(
          //       localStorage.getItem('iddb'),
          //       newRangeToLoad.start,
          //       newRangeToLoad.end,
          //     ).then((res) => {
          //       let {
          //         events: addedEvents,
          //         parentIdDataArr: loadedParentIdDataArr,
          //         lockedDatesArray: loadedLockedDatesArray,
          //       } = parseResievedDataToCal(res);
          //       // Обновляем массив {id: дата}
          //       const updateParentIdDataArr = (loadedParentIdDataArr) => {
          //         const savedParentIdDataArr = JSON.parse(
          //           localStorage.getItem('parentIdDataArr'),
          //         );

          //         const updatedParentIdDataArr = savedParentIdDataArr.concat(
          //           loadedParentIdDataArr,
          //         );

          //         localStorage.setItem(
          //           'parentIdDataArr',
          //           JSON.stringify(updatedParentIdDataArr),
          //         );
          //       };

          //       updateParentIdDataArr(loadedParentIdDataArr);
          //       // Берем из сессии текущие объекты событий
          //       const currentEvents = JSON.parse(
          //         sessionStorage.getItem('events'),
          //       );
          //       //Дополняем массив событий новыми полученными событиями и сохраняем в сессии
          //       const updatedEvents = currentEvents.concat(addedEvents);
          //       sessionStorage.setItem('events', JSON.stringify(updatedEvents));

          //       // Обновляем календарь новым массивом
          //       calendar.setOption('events', updatedEvents);
          //       if (updatedEvents && updatedEvents.length !== 0) {
          //         tempLoader(false);
          //       }

          //       additionalRangeLoaded = false;

          //       // Обновляем массив заблокированных дат
          //       function updateLockedDatesArray(loadedLockedDatesArray) {
          //         const savedLockedDatesArray = JSON.parse(
          //           localStorage.getItem('lockedDatesArray'),
          //         );

          //         const updatedLockedDatesArray = savedLockedDatesArray.concat(
          //           loadedLockedDatesArray,
          //         );

          //         localStorage.setItem(
          //           'lockedDatesArray',
          //           JSON.stringify(updatedLockedDatesArray),
          //         );
          //       }

          //       updateLockedDatesArray(loadedLockedDatesArray);
          //     });
          //   };

          //   loadAdditionalRange();
          //   additionalRangeLoaded = true;
          //   // tempLoader(false);
          // }

          const lockedDatesArr = JSON.parse(
            localStorage.getItem('lockedDatesArray'),
          );

          const isWeekLocked = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();
            const formattedDate = `${day}.${month}.${year}`;
            if (lockedDatesArr?.includes(formattedDate)) {
              localStorage.setItem('isWeekLocked', true);
              return true;
            }
            localStorage.setItem('isWeekLocked', false);
            return false;
          };

          if (isWeekLocked(dateInfo.start)) {
            addBlockOverlays();
            toggleIcon('unlock');
          } else {
            removeOverlays();
            toggleIcon('lock');
          }
        },
        select: function (info) {
          // Проверяем, является ли выбранная дата или интервал дат заблокированным
          const isDateLocked = (date) => {
            const lockedDatesArr = JSON.parse(
              localStorage.getItem('lockedDatesArray'),
            );
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();
            const formattedDate = `${day}.${month}.${year}`;

            return lockedDatesArr?.includes(formattedDate);
          };
          // Если выбранная дата или интервал дат заблокирован, отменяем добавление события
          if (
            isDateLocked(info.start) ||
            (info.end && isDateLocked(info.end))
          ) {
            const lockInfo = document.querySelector('#LockInfo');
            const modal = new Modal(lockInfo);
            const lockUser = document.querySelector('.lockUser');
            // lockUser.textContent = info.event.extendedProps;
            modal.show();

            setTimeout(() => {
              modal.hide();
            }, 5000);

            calendar.unselect(); // Отменяем выделение даты или интервала
          } else {
            const employmentSelEl =
              document.querySelector('.employment select');

            // Разница между датами начала и окончания

            const rangeHoursBetweenDates = () => {
              const start = eventStartDate.value;
              const end = eventEndDate.value;

              const convStrt = convertDateTime(start);
              const convEnd = convertDateTime(end);

              const parsedStart = new Date(convStrt);
              const parsedEnd = new Date(convEnd);

              const diffDates = Math.abs(parsedEnd - parsedStart);
              const diffHours = diffDates / (1000 * 60 * 60);

              eventSpentTime.value = diffHours;
              checkAndForbiddenOutOfDay(
                eventStartDate,
                eventEndDate,
                eventSpentTime,
              );
              timeInputsValidation(eventEndDate, eventSpentTime);
            };

            // Убираем красные рамки с селекторов при начале внесения изменений

            const formSel = document.querySelectorAll('.form-select');

            formSel.forEach((fs) => {
              fs.addEventListener('change', () => {
                fs.classList.remove('is-invalid');
              });
            });

            // Включение возможности выделения нескольких дней, при нажатой клавише Shift

            document.addEventListener(
              'keydown',
              (e) => {
                if (e.key === 'Shift') {
                  isMultiMode = true;
                  e.preventDefault();
                  return isMultiMode;
                }
              },
              { once: true },
            );

            // Запрет выделения нескольких дней за один раз

            if (
              info.start.getDate() !== info.end.getDate() &&
              calendar.view.type !== 'dayGridMonth'
            ) {
              calendar.unselect();
              return;
            }

            // Массив всех дней, показанных на экране

            const fcTimegridCol = [
              ...document.querySelectorAll('.fc-timegrid-col'),
            ];

            if (!isMultiMode && calendar.view.type !== 'dayGridMonth') {
              var modal = new Modal(addEventModal);
              modal.show();

              let flatpickrStart;
              let flatpickrEnd;

              noEditPartOfInput('eventStartDate', 11);
              noEditPartOfInput('eventEndDate', 11);

              if (window.innerWidth > 1024) {
                flatpickrStart = flatpickr('#eventStartDate', {
                  noCalendar: false,
                  dateFormat: 'd.m.Y H:i',
                  enableTime: true,
                  position: 'above',
                  allowInput: true,
                  locale: 'ru',
                  minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
                  maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
                });

                flatpickrEnd = flatpickr('#eventEndDate', {
                  dateFormat: 'd.m.Y H:i',
                  noCalendar: false,
                  enableTime: true,
                  position: 'above',
                  allowInput: true,
                  locale: 'ru',
                  minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
                  maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
                });

                console.log('flatpickrStart: ', flatpickrStart);
                console.log('flatpickrEnd: ', flatpickrEnd);
              } else {
                flatpickrStart = flatpickr('#eventStartDate', {
                  static: true,
                  noCalendar: false,
                  dateFormat: 'd.m.Y H:i',
                  enableTime: true,
                  position: 'above',
                  allowInput: true,
                  locale: 'ru',
                  minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
                  maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
                });
                flatpickrEnd = flatpickr('#eventEndDate', {
                  static: true,
                  noCalendar: false,
                  dateFormat: 'd.m.Y H:i',
                  enableTime: true,
                  position: 'above',
                  allowInput: true,
                  locale: 'ru',
                  minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
                  maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
                });
              }
              flatpickrStart.setDate(transformDateTime(info.start));
              flatpickrEnd.setDate(transformDateTime(info.end));

              if (employmentSelEl?.value === 'Работа') {
                rangeHoursBetweenDates();
              }

              eventStartDate.addEventListener('change', () =>
                rangeHoursBetweenDates(),
              );
              eventEndDate.addEventListener('change', () =>
                rangeHoursBetweenDates(),
              );

              // Синхронизация Времени начала и Окончания при изменении Затраченного времени

              eventSpentTime.addEventListener('change', () => {
                if (calendar.view.type === 'dayGridMonth') {
                } else {
                  // Значения Начала и Окончания
                  const start = eventStartDate.value;
                  const end = eventEndDate.value;

                  // Переводим в нужный формат

                  const convStrt = convertDateTime(start);
                  const convEnd = convertDateTime(end);

                  // Находим время старта и финиша в миллисекундах

                  const parsedStart = new Date(convStrt).getTime();
                  const parsedEnd = new Date(convEnd).getTime();

                  // Переводим часы из инпута Время в миллисекунды

                  const milliSpentTime = eventSpentTime.value * (60000 * 60);

                  // Складываем время начала в миллисек и фактическое время в миллисек, получаем время окончания в миллисек

                  const msEndTime = parsedStart + milliSpentTime;

                  // Преобразовываем миллисекунды в дату окончания в нужном формате

                  const convertMillisecToEndDateValue = (
                    endMilliSecondsDate,
                  ) => {
                    const endDate = new Date(endMilliSecondsDate);
                    return endDate;
                  };

                  const endDate = convertMillisecToEndDateValue(msEndTime);

                  // Преобразовываем объект Data в правильный вид для подстановки в окно Окончание

                  const endDateValue = transformDateTime(endDate);

                  eventEndDate.value = endDateValue;
                }
                checkAndForbiddenOutOfDay(
                  eventStartDate,
                  eventEndDate,
                  eventSpentTime,
                );
                timeInputsValidation(eventEndDate, eventSpentTime);
                changeDirectZero(eventEndDate, eventSpentTime);
              });
            } else {
              // calendar.setOption('allDaySlot', false);
              // calendar.render();
              // Дата начала и окончания при выделении
              const startDate = info.start;
              const endDate = info.end;

              // РАБОТА С ВЫДЕЛЕНИЕМ

              let hlElStyle, hlElAttrDate;

              // Находим какой элемент выделен

              fcTimegridCol.forEach((el) => {
                // Получаем выделенный элемент
                const hlEl = el.querySelector('.fc-timegrid-bg-harness');

                // Работаем с элементом, который выделяем

                if (hlEl) {
                  // Получаем стили
                  hlElStyle = hlEl.getAttribute('style');

                  // Получаем дату
                  hlElAttrDate = el.getAttribute('data-date');
                }
              });

              // При множественном выделении (при нажатом Shift) собираем даты время начала и окончания выделенного события, дату и стили в массив

              multipleEventsArray.push({
                start: startDate,
                end: endDate,
                hlElStyle,
                hlElAttrDate,
              });
            }

            // Массовое добавление в месячном виде

            massMonthAddEvent(calendar, info);

            // После каждого выделения проверяем наличие выделенного участка и отмечаем его заново

            if (calendar.view.type === 'timeGridWeek') {
              saveHighlightedReg(multipleEventsArray, fcTimegridCol);

              // Очищаем выделенное при закрытии окна (отмене)
              document.addEventListener('hide.bs.modal', () => {
                multipleEventsArray = [];
                fcTimegridCol.forEach((el) => {
                  const fcTimegridBgHarness = el.querySelectorAll(
                    '.fc-timegrid-bg-harness',
                  );
                  fcTimegridBgHarness.forEach((ell) => {
                    if (ell !== null && ell.firstChild) {
                      ell.style = '';
                      calendar.render();
                    }
                  });
                });
                calendar.destroy();
                calendar.render();
                isMultiMode = false;
                document.addEventListener('keyup', shiftKeyUp);
              });
            }
          }
        },
        eventResize: function (info) {
          const isApproved = info.event.extendedProps.isApproved;

          if (isApproved !== undefined && isApproved !== '') {
            info.revert(); // Запретить изменение размера события
          } else {
            const slotmintime = calendar.getOption('slotMinTime');
            const slotmaxtime = calendar.getOption('slotMaxTime');

            // При изменении размера события отправляем данные в базу о новом времени окончания события

            // Получаем delID события из объекта info

            const changeTimeId = info.oldEvent._def.extendedProps.delID;

            // Получаем factTime

            const oldFactTime = +info.oldEvent._def.extendedProps.factTime;

            // Дата начала текущего события
            const oldEventStartDate = info.oldEvent._instance.range.start;

            // Дата окончания текущего события
            const oldEventEndDate = info.oldEvent._instance.range.end;
            const millioldStartDate = oldEventStartDate.getTime();
            const millioldEndDate = oldEventEndDate.getTime();

            // Определяем величину изменения
            const milliSecDeltaStart = info.startDelta.milliseconds;
            const milliSecDelta = info.endDelta.milliseconds;
            const hoursDeltaStart = milliSecDeltaStart / 3600000;
            const hoursDeltaEnd = milliSecDelta / 3600000;

            // Новая дата начала
            const newMsStartDateTime = millioldStartDate + milliSecDeltaStart;
            const newStartDateTime = new Date(newMsStartDateTime);
            // Новая дата окончания
            const newMsEndDateTime = millioldEndDate + milliSecDelta;
            const newEndDateTime = new Date(newMsEndDateTime);

            const eventEmploymentValue =
              info.event._def.extendedProps.employment;
            const oldEventFactTime = info.oldEvent._def.extendedProps.factTime;
            let newFactTime;
            // Новое фактическое время события
            if (oldEventFactTime != 0) {
              newFactTime = oldFactTime - hoursDeltaStart + hoursDeltaEnd;
            } else {
              newFactTime = 0;
            }

            // Устанавливаем новое

            const theEvent = info.event;

            theEvent.setExtendedProp('factTime', newFactTime.toString());

            sendNewEndDateTimeToBase(
              changeTimeId,
              newFactTime,
              newStartDateTime,
              newEndDateTime,
            );

            calendar.render();
          }
        },
      });

      // Блокировка дат

      // Добавление задачи в календарь
      addEventToCal(calendar);

      // Изменение пользователя
      changeUserData(calendar, idDB);
      const checkUserIDBySelector = () => {
        const userSelector = document.querySelector('#otherUsers');

        if (userSelector && userSelector.value !== idDB) {
          return false;
        }

        return true;
      };

      // Минимальное и максимальное время которое отображает календарь в данный момент
      let minViewTime = calendar.getOption('slotMinTime');
      let maxViewTime = calendar.getOption('slotMaxTime');

      // Минимальная и максимальная дата текущего вида календаря

      let currentViewDataStart =
        calendar.currentData.dateProfile.activeRange.start;
      let currentViewDataEnd = calendar.currentData.dateProfile.activeRange.end;

      // Элементы окна Мультидобавления задачи

      const multiKindOfTasks = document.querySelector('#multiKindOfTasks');
      const multiTaskObj = document.querySelector('#multiTaskObj');
      const multiTaskCreator = document.querySelector('#multiTaskCreator');
      const multiLocations = document.querySelector('#multiLocObj');
      const multiAddTaskToCalBtn = document.querySelector(
        '#multiAddTaskToCalBtn',
      );
      const multiEmployment = document.querySelector('#multiEmployment');
      const dataObj = JSON.parse(sessionStorage.getItem('dataObj'));
      const dataCreator = JSON.parse(sessionStorage.getItem('dataCreator'));
      const locObj = JSON.parse(sessionStorage.getItem('locObj'));
      const emplObj = JSON.parse(sessionStorage.getItem('emplObj'));

      selValidation(multiKindOfTasks);
      selValidation(multiLocations);

      // getEmplOptions(multiEmployment);
      GDD.addDataToSelector(multiTaskObj, dataObj);
      GDD.addDataToSelector(multiTaskCreator, dataCreator);
      GDD.addDataToSelector(multiLocations, locObj);
      GDD.addDataToSelector(multiEmployment, emplObj);

      var modal = new Modal(multiAddEventModal);
      shiftKeyUp = (e) => {
        // Отпускаем кнопку Shift
        if (
          e.key === 'Shift' &&
          calendar.select &&
          multipleEventsArray.length > 0
        ) {
          modal.show();
          return;
        }
      };

      document.addEventListener('keyup', shiftKeyUp);

      // МАССОВОЕ ДОБАВЛЕНИЕ ЗАДАЧ С КЛАВИШЕЙ SHIFT

      multiAddTaskToCalBtn.addEventListener('click', (e) => {
        const checkEmploymentMode = () => {
          const emplMode = document.querySelector('#multiEmployment');
          if (
            emplMode.value === 'Работа' &&
            multiLocations.value !== 'В дороге'
          ) {
            return true;
          } else if (
            emplMode.value === 'Работа' &&
            multiLocations.value === 'В дороге'
          ) {
            return 'onRoad';
          }
          return false;
        };

        const isEmpl = checkEmploymentMode();

        if (
          isEmpl === true &&
          (multiLocations.value === 'Не выбрано' ||
            multiKindOfTasks.value === 'Не выбрано')
        ) {
          if (multiLocations.value === 'Не выбрано') {
            multiLocations.classList.add('is-invalid');
          }

          if (multiKindOfTasks.value === 'Не выбрано') {
            multiKindOfTasks.classList.add('is-invalid');
          }
          e.preventDefault();
        } else if (
          isEmpl === 'onRoad' &&
          multiKindOfTasks.value === 'Не выбрано'
        ) {
          // multiLocations.classList.add("is-invalid");
          e.preventDefault();
          multipleAddEventsToBase(multipleEventsArray, calendar);
          localStorage.setItem('fcDefaultView', calendar.view.type);
          modal.hide();
        } else {
          e.preventDefault();
          multipleAddEventsToBase(multipleEventsArray, calendar);
          localStorage.setItem('fcDefaultView', calendar.view.type);
          modal.hide();
        }
      });

      // Отлавливаем мультирежим

      let isMultiMode = false;

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
          isMultiMode = true;
          return;
        }
      });

      // Выделение проверяем

      let multipleEventsArray = [];

      // Добавление задачи по кнопке

      const addTaskBtn = document.querySelector('#addTaskBtn');

      addTaskBtn.addEventListener('click', () => {
        noEditPartOfInput('eventStartDate', 11);
        noEditPartOfInput('eventEndDate', 11);
        const modal = new Modal(addEventModal);

        modal.show();

        const today = new Date();

        const lockedDates = JSON.parse(
          localStorage.getItem('lockedDatesArray'),
        );

        const flatpickrStart = flatpickr('#eventStartDate', {
          dateFormat: 'd.m.Y H:i',
          enableTime: true,
          position: 'above',
          allowInput: true,
          locale: 'ru',
          disable: lockedDates,
        });

        const flatpickrEnd = flatpickr('#eventEndDate', {
          dateFormat: 'd.m.Y H:i',
          enableTime: true,
          position: 'above',
          allowInput: true,
          locale: 'ru',
          disable: lockedDates,
        });

        const startOfDayTime = `${transformDateTime(today).slice(0, 10)} 09:00`;
        const endOfDayTime = `${transformDateTime(today).slice(0, 10)} 17:00`;

        flatpickrStart.setDate(startOfDayTime);
        flatpickrEnd.setDate(endOfDayTime);

        // Разница между датами начала и окончания

        const rangeHoursBetweenDates = () => {
          const start = eventStartDate.value;
          const end = eventEndDate.value;

          const convStrt = convertDateTime(start);
          const convEnd = convertDateTime(end);

          const parsedStart = new Date(convStrt);
          const parsedEnd = new Date(convEnd);

          const diffDates = parsedEnd - parsedStart;
          const diffHours = diffDates / (1000 * 60 * 60);

          eventSpentTime.value = diffHours;

          checkAndForbiddenOutOfDay(
            eventStartDate,
            eventEndDate,
            eventSpentTime,
          );
          timeInputsValidation(eventEndDate, eventSpentTime);
        };

        rangeHoursBetweenDates();

        eventStartDate.addEventListener('change', () =>
          rangeHoursBetweenDates(),
        );
        eventEndDate.addEventListener('change', () => rangeHoursBetweenDates());

        // Синхронизация Времени начала и Окончания при изменении Затраченного времени

        eventSpentTime.addEventListener('change', () => {
          // Значения Начала и Окончания
          const start = eventStartDate.value;
          const end = eventEndDate.value;

          // Переводим в нужный формат

          const convStrt = convertDateTime(start);
          const convEnd = convertDateTime(end);

          // Находим время старта и финиша в миллисекундах

          const parsedStart = new Date(convStrt).getTime();
          const parsedEnd = new Date(convEnd).getTime();

          // Разрешаем добавление задачи только в пределах 1 суток

          // Сравниваем значение дня начала и окончания

          // Переводим часы из инпута Время в миллисекунды

          const milliSpentTime = eventSpentTime.value * (60000 * 60);

          // Складываем время начала в миллисек и фактическое время в миллисек, получаем время окончания в миллисек

          const msEndTime = parsedStart + milliSpentTime;

          // Преобразовываем миллисекунды в дату окончания в нужном формате

          const convertMillisecToEndDateValue = (endMilliSecondsDate) => {
            const endDate = new Date(endMilliSecondsDate);
            return endDate;
          };

          const endDate = convertMillisecToEndDateValue(msEndTime);
          // Преобразовываем объект Data в правильный вид для подстановки в окно Окончание

          const endDateValue = transformDateTime(endDate);

          eventEndDate.value = endDateValue;

          checkAndForbiddenOutOfDay(
            eventStartDate,
            eventEndDate,
            eventSpentTime,
          );

          if (isOutOfRange) {
            eventEndDate.classList.add('is-invalid');
            eventEndDate.style.color = 'red';
            eventSpentTime.classList.add('is-invalid');
            eventSpentTime.style.color = 'red';
          } else if (!isOutOfRange) {
            eventEndDate.classList.remove('is-invalid');
            eventEndDate.style.color = 'black';
            eventSpentTime.classList.remove('is-invalid');
            eventSpentTime.style.color = 'black';
          }

          changeDirectZero(eventEndDate, eventSpentTime);
        });
      });

      const cutTimeViewBtn = document.querySelector('#cutTimeView');

      let stretchView;

      updateTitle(calendar.currentData.viewTitle);
      document
        .querySelectorAll(Selectors.DATA_EVENT)
        .forEach(function (button) {
          button.addEventListener(Events.CLICK, function (e) {
            // let isMinTrue
            var el = e.currentTarget;
            var type = utils.getData(el, DataKeys.EVENT);

            switch (type) {
              case 'prev':
                calendar.prev();
                updateTitle(calendar.currentData.viewTitle);

                currentViewDataStart =
                  calendar.currentData.dateProfile.currentRange.start;
                currentViewDataEnd =
                  calendar.currentData.dateProfile.activeRange.end;
                stretchView = stretchViewDepEvents(
                  calendar,
                  currentViewDataStart,
                  currentViewDataEnd,
                  minViewTime,
                  maxViewTime,
                );
                if (
                  localStorage.getItem('cutTimeView') === 'false' ||
                  localStorage.getItem('cutTimeView') === null
                ) {
                  calendar.setOption(
                    'slotMinTime',
                    `${addZeroBefore(stretchView[0])}:00:00`,
                  );
                  calendar.setOption(
                    'slotMaxTime',
                    `${addZeroBefore(stretchView[1])}:59:00`,
                  );

                  return;
                }

                break;

              case 'next':
                calendar.next();
                updateTitle(calendar.currentData.viewTitle);

                currentViewDataStart =
                  calendar.currentData.dateProfile.currentRange.start;
                currentViewDataEnd =
                  calendar.currentData.dateProfile.activeRange.end;

                stretchView = stretchViewDepEvents(
                  calendar,
                  currentViewDataStart,
                  currentViewDataEnd,
                  minViewTime,
                  maxViewTime,
                );
                if (
                  localStorage.getItem('cutTimeView') === 'false' ||
                  localStorage.getItem('cutTimeView') === null
                ) {
                  calendar.setOption(
                    'slotMinTime',
                    `${addZeroBefore(stretchView[0])}:00:00`,
                  );
                  calendar.setOption(
                    'slotMaxTime',
                    `${addZeroBefore(stretchView[1])}:59:00`,
                  );

                  return;
                }

                break;

              case 'today':
                calendar.today();
                updateTitle(calendar.currentData.viewTitle);
                break;

              case 'refresh':
                const refreshBtnAction = async () => {
                  tempLoader(true);

                  calendar.removeAllEvents();
                  const newUserData = await getSelectedUserData(
                    localStorage.getItem('iddb'),
                  );

                  let { events, parentIdDataArr, lockedDatesArray } =
                    parseResievedDataToCal(newUserData);

                  localStorage.setItem(
                    'parentIdDataArr',
                    JSON.stringify(parentIdDataArr),
                  );
                  localStorage.setItem(
                    'lockedDatesArray',
                    JSON.stringify(lockedDatesArray),
                  );

                  sessionStorage.setItem('events', JSON.stringify(events));

                  tempLoader(false);

                  calendar.addEventSource(events);
                  calendar.render();
                };

                refreshBtnAction();

                break;
              case 'cutTimeView':
                calendar.setOption('slotMinTime', '00:00:00');
                calendar.setOption('slotMaxTime', '23:59:59');

                cutTimeViewBtn.classList.toggle('active');

                localStorage.setItem('cutTimeView', 'true');

                break;

              case 'report':
                const btnReport = document.querySelector('.btn-report');
                btnReport.classList.add('active');

                const getRepData = async () => {
                  let repName;
                  let repID;

                  let formData = new FormData();

                  formData.append('GroupID', ParentGroupID);

                  // 1) Открыть модальное окно с выбором даты начала и окончания отчета и пользователя
                  const res = await fetch(srvv + getReports, {
                    credentials: 'include',
                    method: 'post',
                    body: formData,
                  })
                    .then((response) => {
                      let r = response.json();
                      return r;
                    })
                    .then((data) => {
                      const d = { data };

                      repName = d.data.newReport[0].Name;
                      repID = d.data.newReport[0].ReportID;

                      const template = repModalTemplate(repName);
                      document.querySelector(
                        Selectors.EVENT_DETAILS_MODAL_CONTENT,
                      ).innerHTML = template;
                      const modal = new Modal(eventDetailsModal);
                      modal.show();

                      document.addEventListener('shown.bs.modal', () => {
                        const reportPeriodInput =
                          document.querySelector('#reportPeriod');
                        let period;

                        flatpickr(reportPeriodInput, {
                          locale: 'ru',
                          mode: 'range',
                          dateFormat: 'd.m.Y',
                          enableTime: false,
                          locale: 'ru',
                          onClose: function (selectedDates, dateStr) {
                            period = dateStr?.split('—');
                          },
                        });

                        const getReport = document.querySelector('#getReport');

                        getReport.addEventListener('click', () => {
                          getEmplReport(period, api, idDB, repID);
                          modal.hide();
                        });
                      });

                      document.addEventListener('hidden.bs.modal', () => {
                        btnReport.classList.remove('active');
                      });
                    })
                    .catch(function (error) {
                      console.log('error', error);
                    });
                };

                getRepData();

                break;

              default:
                calendar.today();
                updateTitle(calendar.currentData.viewTitle);
                break;
            }

            if (!cutTimeViewBtn.classList.contains('active')) {
              calendar.setOption('slotMinTime', '08:00:00');
              calendar.setOption('slotMaxTime', '18:59:59');
              localStorage.setItem('cutTimeView', 'false');
            }
          });
        });
      document
        .querySelectorAll(Selectors.DATA_CALENDAR_VIEW)
        .forEach(function (link) {
          link.addEventListener(Events.CLICK, function (e) {
            e.preventDefault();
            var el = e.currentTarget;
            var text = el.textContent;
            el.parentElement
              .querySelector(Selectors.ACTIVE)
              .classList.remove(ClassNames.ACTIVE);
            el.classList.add(ClassNames.ACTIVE);
            document.querySelector(Selectors.DATA_VIEW_TITLE).textContent =
              text;
            calendar.changeView(utils.getData(el, DataKeys.FC_VIEW));
            updateTitle(calendar.currentData.viewTitle);
          });
        });

      // Отображение времени, названия, описания в событиях
      const allEventsStyling = document.querySelectorAll(
        '.fc-timegrid-event-harness',
      );

      allEventsStyling.forEach((event) => {
        const factTime = event.querySelector('.factTime');
        const title = event.querySelector('.title');

        factTime.style.whiteSpace = 'nowrap';
        event.style.overflow = 'hidden';
      });

      // Согласование

      approveEmploynment(calendar);

      // Блокировка добавления
      lockEmploynment(calendar);

      checkCurrentEventsAndBlockApproveBtn(calendar);
      // checkBlockedDays(calendar);

      // Вешаем на все таймпикеры событие закрытия по нажатию Enter при ручном вводе

      const allDatePickers = [...document.querySelectorAll('.datetimepicker')];

      allDatePickers.forEach((el) => {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const flatpickrCalendarArr = [
              ...document.querySelectorAll('.flatpickr-calendar'),
            ];
            flatpickrCalendarArr.forEach((el) => {
              if (el.classList.contains('open')) {
                el.classList.remove('open');
              }
            });
          }
        });
      });

      if (localStorage.getItem('cutTimeView') !== null) {
        switch (localStorage.getItem('cutTimeView')) {
          case 'true':
            calendar.setOption('slotMinTime', '00:00:00');
            calendar.setOption('slotMaxTime', '23:59:59');
            cutTimeViewBtn.classList.add('active');

            break;
          case 'false':
            calendar.setOption(
              'slotMinTime',
              `${addZeroBefore(
                stretchViewDepEvents(
                  calendar,
                  currentViewDataStart,
                  currentViewDataEnd,
                  minViewTime,
                  maxViewTime,
                )[0],
              )}:00:00`,
            );
            calendar.setOption(
              'slotMaxTime',
              `${addZeroBefore(
                stretchViewDepEvents(
                  calendar,
                  currentViewDataStart,
                  currentViewDataEnd,
                  minViewTime,
                  maxViewTime,
                )[1],
              )}:59:00`,
            );

            break;
        }
      }

      /**
       * Режимы отображения календаря
       */
      const approveBtn = document.querySelector('.approveBtn');
      const lockBtn = document.querySelector('.lockBtn');
      const currentUserLevel = Number(
        localStorage.getItem('currentManagerLevel'),
      );

      if (currentUserLevel !== 1) {
        blockBtnAddTitle(lockBtn, approveBtn);
      }
      switch (calendar.view.type) {
        case 'timeGridWeek':
          if (approveBtn && lockBtn) {
            toggleElem(approveBtn, true);
            toggleElem(lockBtn, true);
          }
          if (localStorage?.getItem('startWeekDateMs') ?? '') {
            calendar.gotoDate(+localStorage.getItem('startWeekDateMs'));
            updateTitle(calendar.currentData.viewTitle);

            currentViewDataStart =
              calendar.currentData.dateProfile.currentRange.start;
            currentViewDataEnd =
              calendar.currentData.dateProfile.activeRange.end;
            stretchView = stretchViewDepEvents(
              calendar,
              currentViewDataStart,
              currentViewDataEnd,
              minViewTime,
              maxViewTime,
            );
            if (
              localStorage.getItem('cutTimeView') === 'false' ||
              localStorage.getItem('cutTimeView') === null
            ) {
              calendar.setOption(
                'slotMinTime',
                `${addZeroBefore(stretchView[0])}:00:00`,
              );
              calendar.setOption(
                'slotMaxTime',
                `${addZeroBefore(stretchView[1])}:59:00`,
              );
            }
          }

          localStorage.setItem('startWeekDateMs', '');

          break;

        case 'dayGridMonth':
          // calendar.setOption('dayCellContent', false);
          if (approveBtn && lockBtn) {
            toggleElem(approveBtn, false);
            toggleElem(lockBtn, false);
          }
          if (localStorage?.getItem('startMonthDateMs') ?? '') {
            calendar.gotoDate(+localStorage.getItem('startMonthDateMs'));
            updateTitle(calendar.currentData.viewTitle);
          }
          localStorage.setItem('startMonthDateMs', '');
          localStorage.setItem('fcDefaultView', 'timeGridWeek');

          break;

        case 'timeGridDay':
          if (approveBtn && lockBtn) {
            toggleElem(approveBtn, false);
          }
          if (localStorage?.getItem('startDayDateMs') ?? '') {
            calendar.gotoDate(+localStorage.getItem('startDayDateMs'));
            updateTitle(calendar.currentData.viewTitle);
          }
          localStorage.setItem('startDayDateMs', '');
          localStorage.setItem('fcDefaultView', 'timeGridWeek');

          break;
        case 'listWeek':
          if (approveBtn && lockBtn) {
            toggleElem(approveBtn, false);
            toggleElem(lockBtn, false);
          }

          if (localStorage?.getItem('startListWeekDateMs') ?? '') {
            calendar.gotoDate(+localStorage.getItem('startListWeekDateMs'));
            updateTitle(calendar.currentData.viewTitle);
          }
          localStorage.setItem('startListWeekDateMs', '');
          localStorage.setItem('fcDefaultView', 'timeGridWeek');

          break;
        case 'listYear':
          if (approveBtn && lockBtn) {
            toggleElem(approveBtn, false);
            toggleElem(lockBtn, false);
          }

          if (localStorage?.getItem('startlistYearDateMs') ?? '') {
            calendar.gotoDate(+localStorage.getItem('startlistYearDateMs'));
            updateTitle(calendar.currentData.viewTitle);
          }
          localStorage.setItem('startlistYearDateMs', '');
          localStorage.setItem('fcDefaultView', 'timeGridWeek');

          break;
      }
    }

    // Фокусировка на первой строке для работы кнопки Shift

    const getFirstStr = document.querySelector('.fc-timegrid-slot-lane');

    if (getFirstStr) {
      getFirstStr.setAttribute('tabindex', '1');
    }
    document.addEventListener('show.bs.modal', (e) => {
      document.removeEventListener('keyup', shiftKeyUp);
    });

    document.addEventListener('shown.bs.modal', (e) => {
      addWooContainer(e.target);
      checkEmploymentStatus(e.target);
    });
  };

  // Инициализация календарей

  docReady(fullCalendarInit);
  docReady(appCalendarInit);
};

employmentCalendar();
