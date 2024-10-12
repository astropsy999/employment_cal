/* -------------------------------------------------------------------------- */

/*                                FullCalendar                                */

/* -------------------------------------------------------------------------- */
import { sendNewEndDateTimeToBase } from './mainGlobFunctions';
import merge from 'lodash/merge';
import { Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { toggleElem } from './toggleElem';
import { getLocalStorageItem } from './localStorageUtils';
import { EventImpl } from '@fullcalendar/core/internal';
import { Modal } from 'bootstrap';


// let merge = window._.merge;

export let renderCalendar = function renderCalendar(el: HTMLElement | Element, option: any) {
  let _document$querySelect;

  let options = merge(
    {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView:
        localStorage.getItem('fcDefaultView') !== null
          ? localStorage.getItem('fcDefaultView')
          : 'timeGridWeek',
      // editable: true,
      selectable: true,
      // select: function (info: EventImpl) {

      //   // Проверяем, является ли выбранная дата или интервал дат заблокированным
      //   const isDateLocked = (date: Date) => {
      //     const lockedDatesArr = getLocalStorageItem('lockedDatesArray');

      //     const day = date.getDate().toString().padStart(2, '0');
      //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
      //     const year = date.getFullYear().toString();
      //     const formattedDate = `${day}.${month}.${year}`;

      //     return lockedDatesArr?.includes(formattedDate);
      //   };
      //   // Если выбранная дата или интервал дат заблокирован, отменяем добавление события
      //   if (isDateLocked(info.start!) || (info.end && isDateLocked(info.end))) {
      //     const lockInfo = document.querySelector('#LockInfo');
      //     const modal = new Modal(lockInfo!);
      //     const lockUser = document.querySelector('.lockUser');
      //     // lockUser.textContent = info.event.extendedProps;
      //     modal.show();

      //     setTimeout(() => {
      //       modal.hide();
      //     }, 5000);

      //     calendar.unselect(); // Отменяем выделение даты или интервала
      //   } else {
      //     const employmentSelEl = document.querySelector('.employment select');

      //     // Разница между датами начала и окончания

      //     const rangeHoursBetweenDates = () => {
      //       const start = eventStartDate.value;
      //       const end = eventEndDate.value;

      //       const convStrt = convertDateTime(start);
      //       const convEnd = convertDateTime(end);

      //       const parsedStart = new Date(convStrt);
      //       const parsedEnd = new Date(convEnd);

      //       const diffDates = Math.abs(parsedEnd - parsedStart);
      //       const diffHours = diffDates / (1000 * 60 * 60);

      //       eventSpentTime.value = diffHours;
      //       checkAndForbiddenOutOfDay(
      //         eventStartDate,
      //         eventEndDate,
      //         eventSpentTime,
      //       );
      //       timeInputsValidation(eventEndDate, eventSpentTime);
      //     };

      //     // Убираем красные рамки с селекторов при начале внесения изменений

      //     const formSel = document.querySelectorAll('.form-select');

      //     formSel.forEach((fs) => {
      //       fs.addEventListener('change', () => {
      //         fs.classList.remove('is-invalid');
      //       });
      //     });

      //     // Включение возможности выделения нескольких дней, при нажатой клавише Shift

      //     document.addEventListener(
      //       'keydown',
      //       (e) => {
      //         if (e.key === 'Shift') {
      //           isMultiMode = true;
      //           e.preventDefault();
      //           return isMultiMode;
      //         }
      //       },
      //       { once: true },
      //     );

      //     // Запрет выделения нескольких дней за один раз

      //     if (
      //       info.start.getDate() !== info.end.getDate() &&
      //       calendar.view.type !== 'dayGridMonth'
      //     ) {
      //       calendar.unselect();
      //       return;
      //     }

      //     // Массив всех дней, показанных на экране

      //     const fcTimegridCol = [
      //       ...document.querySelectorAll('.fc-timegrid-col'),
      //     ];

      //     if (!isMultiMode && calendar.view.type !== 'dayGridMonth') {
      //       var modal = new Modal(addEventModal);
      //       modal.show();

      //       let flatpickrStart;
      //       let flatpickrEnd;

      //       noEditPartOfInput('eventStartDate', 11);
      //       noEditPartOfInput('eventEndDate', 11);

      //       if (window.innerWidth > 1024) {
      //         flatpickrStart = flatpickr('#eventStartDate', {
      //           noCalendar: false,
      //           dateFormat: 'd.m.Y H:i',
      //           enableTime: true,
      //           position: 'above',
      //           allowInput: true,
      //           locale: 'ru',
      //           minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
      //           maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
      //         });

      //         flatpickrEnd = flatpickr('#eventEndDate', {
      //           dateFormat: 'd.m.Y H:i',
      //           noCalendar: false,
      //           enableTime: true,
      //           position: 'above',
      //           allowInput: true,
      //           locale: 'ru',
      //           minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
      //           maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
      //         });
      //       } else {
      //         flatpickrStart = flatpickr('#eventStartDate', {
      //           static: true,
      //           noCalendar: false,
      //           dateFormat: 'd.m.Y H:i',
      //           enableTime: true,
      //           position: 'above',
      //           allowInput: true,
      //           locale: 'ru',
      //           minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
      //           maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
      //         });
      //         flatpickrEnd = flatpickr('#eventEndDate', {
      //           static: true,
      //           noCalendar: false,
      //           dateFormat: 'd.m.Y H:i',
      //           enableTime: true,
      //           position: 'above',
      //           allowInput: true,
      //           locale: 'ru',
      //           minDate: transformDateTime(info.start).slice(0, -5) + '00:00',
      //           maxDate: transformDateTime(info.start).slice(0, -5) + '23:59',
      //         });
      //       }
      //       flatpickrStart.setDate(transformDateTime(info.start));
      //       flatpickrEnd.setDate(transformDateTime(info.end));

      //       if (employmentSelEl?.value === 'Работа') {
      //         rangeHoursBetweenDates();
      //       }

      //       eventStartDate.addEventListener('change', () =>
      //         rangeHoursBetweenDates(),
      //       );
      //       eventEndDate.addEventListener('change', () =>
      //         rangeHoursBetweenDates(),
      //       );

      //       // Синхронизация Времени начала и Окончания при изменении Затраченного времени

      //       eventSpentTime.addEventListener('change', () => {
      //         if (calendar.view.type === 'dayGridMonth') {
      //         } else {
      //           // Значения Начала и Окончания
      //           const start = eventStartDate.value;
      //           const end = eventEndDate.value;

      //           // Переводим в нужный формат

      //           const convStrt = convertDateTime(start);
      //           const convEnd = convertDateTime(end);

      //           // Находим время старта и финиша в миллисекундах

      //           const parsedStart = new Date(convStrt).getTime();
      //           const parsedEnd = new Date(convEnd).getTime();

      //           // Переводим часы из инпута Время в миллисекунды

      //           const milliSpentTime = eventSpentTime.value * (60000 * 60);

      //           // Складываем время начала в миллисек и фактическое время в миллисек, получаем время окончания в миллисек

      //           const msEndTime = parsedStart + milliSpentTime;

      //           // Преобразовываем миллисекунды в дату окончания в нужном формате

      //           const convertMillisecToEndDateValue = (endMilliSecondsDate) => {
      //             const endDate = new Date(endMilliSecondsDate);
      //             return endDate;
      //           };

      //           const endDate = convertMillisecToEndDateValue(msEndTime);

      //           // Преобразовываем объект Data в правильный вид для подстановки в окно Окончание

      //           const endDateValue = transformDateTime(endDate);

      //           eventEndDate.value = endDateValue;
      //         }
      //         checkAndForbiddenOutOfDay(
      //           eventStartDate,
      //           eventEndDate,
      //           eventSpentTime,
      //         );
      //         timeInputsValidation(eventEndDate, eventSpentTime);
      //         changeDirectZero(eventEndDate, eventSpentTime);
      //       });
      //     } else {
      //       // Дата начала и окончания при выделении
      //       const startDate = info.start;
      //       const endDate = info.end;

      //       // РАБОТА С ВЫДЕЛЕНИЕМ

      //       let hlElStyle, hlElAttrDate;

      //       // Находим какой элемент выделен

      //       fcTimegridCol.forEach((el) => {
      //         // Получаем выделенный элемент
      //         const hlEl = el.querySelector('.fc-timegrid-bg-harness');

      //         // Работаем с элементом, который выделяем

      //         if (hlEl) {
      //           // Получаем стили
      //           hlElStyle = hlEl.getAttribute('style');

      //           // Получаем дату
      //           hlElAttrDate = el.getAttribute('data-date');
      //         }
      //       });

      //       // При множественном выделении (при нажатом Shift) собираем даты время начала и окончания выделенного события, дату и стили в массив

      //       multipleEventsArray.push({
      //         start: startDate,
      //         end: endDate,
      //         hlElStyle,
      //         hlElAttrDate,
      //       });
      //     }

      //     // Массовое добавление в месячном виде

      //     massMonthAddEvent(calendar, info);

      //     // После каждого выделения проверяем наличие выделенного участка и отмечаем его заново

      //     if (calendar.view.type === 'timeGridWeek') {
      //       saveHighlightedReg(multipleEventsArray, fcTimegridCol);

      //       // Очищаем выделенное при закрытии окна (отмене)
      //       document.addEventListener('hide.bs.modal', () => {
      //         multipleEventsArray = [];
      //         fcTimegridCol.forEach((el) => {
      //           const fcTimegridBgHarness = el.querySelectorAll(
      //             '.fc-timegrid-bg-harness',
      //           );
      //           fcTimegridBgHarness.forEach((ell) => {
      //             if (ell !== null && ell.firstChild) {
      //               ell.style = '';
      //               calendar.render();
      //             }
      //           });
      //         });
      //         calendar.destroy();
      //         calendar.render();
      //         isMultiMode = false;
      //         document.addEventListener('keyup', shiftKeyUp);
      //       });
      //     }
      //   }
      // },
      viewDidMount: function (view) {
        const approveBtn = document.querySelector('.approveBtn');
        const lockBtn = document.querySelector('.lockBtn');
        if (approveBtn && lockBtn) {
          if (view.view.type === 'timeGridWeek') {
            toggleElem(approveBtn, true);
            toggleElem(lockBtn, true);
          } else {
            toggleElem(approveBtn, false);
            toggleElem(lockBtn, false);
          }
        }
      },
      eventResizableFromStart: true,
      droppable: false,
      eventDurationEditable: true,
      locale: 'ru',
      firstDay: 1,
      direction: document.querySelector('html').getAttribute('dir'),

      buttonText: {
        month: 'Месяц',
        week: 'Неделя',
        day: 'День',
      },
    },

    option,
  );
  let calendar = new Calendar(el, options);

  // Правильное отображение кнопки и выпадающего списка

  const btnInView = options.initialView;

  const btnViewObject = {
    dayGridMonth: 'Месяц',
    timeGridWeek: 'Неделя',
    timeGridDay: 'День',
    listWeek: 'Список',
    listYear: 'Год',
  };

  const dataViewTitle = document.querySelector('.data-view-title');
  dataViewTitle.innerText = btnViewObject[btnInView];

  calendar.render();

  (_document$querySelect = document.querySelector(
    '.navbar-vertical-toggle',
  )) === null || _document$querySelect === void 0
    ? void 0
    : _document$querySelect.addEventListener(
        'navbar.vertical.toggle',
        function () {
          return calendar.updateSize();
        },
      );
  return calendar;
};

export let fullCalendarInit = async function fullCalendarInit() {
  let calendars = document.querySelectorAll('[data-calendar]');
  calendars.forEach(function (item) {
    let options = utils.getData(item, 'options');
    renderCalendar(item, options);
  });
};

export let fullCalendar = {
  renderCalendar: renderCalendar,
  fullCalendarInit: fullCalendarInit,
};

export const forceCalendarRecalculate = (cal) => {
  cal.prev();
  cal.next();
  cal.next();
  cal.prev();
};
