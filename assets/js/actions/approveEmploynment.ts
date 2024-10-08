import * as C from '../config';
import { fullCalendar } from '../utils/fullcalendar';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import { formatDate, blockBtnAddTitle, formatDayNameDate } from '../utils/mainGlobFunctions';
import { Modal } from 'bootstrap';

export const approveEmploynment = (calendar: { view: { currentStart: string | number | Date; currentEnd: string | number | Date; }; getEvents: () => any; }) => {
  const approveBtn = document.querySelector('.approveBtn');

  const approveAction = () => {
    // Получаем текущий вид календаря
    const currentView = calendar.view;

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector('#otherUsers') as HTMLSelectElement;
    const selectedUser = otherUsersSelector?.selectedOptions[0].textContent;
    const selectedUserId = otherUsersSelector?.value;

    const userSurname = document.querySelector('.userSurname') as HTMLElement;
    userSurname.textContent = selectedUser;

    const approveEmplmodal = document.querySelector('#approveEmplModal');
    const modal = new Modal(approveEmplmodal!);

    // Использование функции для преобразования дат
    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    modal.show();

    const startApproveDate = document.querySelector('.startApproveDate');
    const endApproveDate = document.querySelector('.endApproveDate');
    const approveActionBtn = document.querySelector('.approve-action') as HTMLElement;
    const dailyApproveContainer = document.querySelector('.dailyApprove') as HTMLElement;

    // Получаем все события на странице

    const currentEvents = calendar.getEvents();

    const eventsInCurrentWeek = currentEvents.filter((event: { start: any; }) => {
      const eventStart = event.start;
      return eventStart >= startDate && eventStart <= endDate;
    });

    // После фильтрации событий в текущей неделе
    const lastEvent = eventsInCurrentWeek.reduce(
      (latestEvent: { start: any; }, currentEvent: { start: any; }) => {
        const latestEventDate = latestEvent ? latestEvent.start : null;
        const currentEventDate = currentEvent.start;

        if (!latestEventDate || currentEventDate > latestEventDate) {
          return currentEvent;
        } else {
          return latestEvent;
        }
      },
      null,
    );

    // Если есть последнее событие, получаем его дату
    eventsInCurrentWeek.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);
    const firstEventDate = eventsInCurrentWeek[0].start;
    const lastEventDate = lastEvent.start;

    endApproveDate!.textContent = formatDate(lastEventDate);
    startApproveDate!.textContent = formatDate(firstEventDate);

     // Генерация списка дат с чекбоксами
     const generateDateList = () => {
      dailyApproveContainer!.innerHTML = ''; // Очищаем контейнер

      // Создаем объект для хранения уникальных дат
      const uniqueDates = {};
      console.log('uniqueDates: ', uniqueDates);

      eventsInCurrentWeek.forEach((event: { start: string | number | Date; }) => {
        const dateStr = formatDate(event.start as Date);
        if (!uniqueDates[dateStr]) {
          uniqueDates[dateStr] = {
            date: new Date(event.start),
            events: [],
          };
        }
        uniqueDates[dateStr].events.push(event);
      });

      // Создаем чекбоксы для каждой уникальной даты
      Object.keys(uniqueDates).forEach((dateStr) => {
        const dateObj = uniqueDates[dateStr].date;
        const formattedDate = formatDayNameDate(dateObj);

        const div = document.createElement('div');
        div.classList.add('form-check');

        const checkbox = document.createElement('input');
        checkbox.classList.add('form-check-input');
        checkbox.type = 'checkbox';
        checkbox.value = dateStr;
        checkbox.id = `checkbox-${dateStr}`;
        checkbox.checked = true; // По умолчанию все даты выбраны

        const label = document.createElement('label');
        label.classList.add('form-check-label');
        label.htmlFor = `checkbox-${dateStr}`;
        label.textContent = formattedDate;

        div.appendChild(checkbox);
        div.appendChild(label);

        dailyApproveContainer.appendChild(div);
      });
    };

    generateDateList();

    // Подтверждение согласования события

    const approveAction = () => {
      approveActionBtn.removeEventListener('click', approveAction);

      // Собираем выбранные даты
      const selectedCheckboxes = dailyApproveContainer.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
      const selectedDates = Array.from(selectedCheckboxes).map(cb => cb.value);

       // Фильтруем события по выбранным датам
       const eventsToApprove = eventsInCurrentWeek.filter((event: { start: Date; }) => {
        const eventDateStr = formatDate(event.start as Date);
        return selectedDates.includes(eventDateStr);
      });


      eventsToApprove.forEach((e) => {
        const delID = e._def.extendedProps.delID;

        const managerName = getLocalStorageItem('managerName');

        let formDataApproved = new FormData();

        formDataApproved.append('ID', delID);
        formDataApproved.append('TypeID', '1094');
        formDataApproved.append('Data[0][name]', '9245');
        formDataApproved.append('Data[0][value]', managerName);
        formDataApproved.append('Data[0][isName]', 'false');
        formDataApproved.append('Data[0][maninp]', 'false');
        formDataApproved.append('Data[0][GroupID]', '2443');
        formDataApproved.append('ParentObjID', getLocalStorageItem('iddb'));
        formDataApproved.append('CalcParamID', '-1');
        formDataApproved.append('InterfaceID', '1593');
        formDataApproved.append('ImportantInterfaceID', '');
        formDataApproved.append('templ_mode', 'false');
        formDataApproved.append('Ignor39', '0');

        fetch(C.srvv + C.addValueObjTrue, {
          credentials: 'include',
          method: 'post',
          body: formDataApproved,
        }).then((response) => {
          const changedCalendarEvents = calendar.getEvents();
          changedCalendarEvents.forEach((event) => {
            if (event._def.defId === e._def.defId) {
              event.setExtendedProp('isApproved', managerName);
              event.dropable = false;
              // fullCalendar.fullCalendarInit();
            }
          });
        });
      });
      approveActionBtn.textContent = 'Согласовано';
      setTimeout(() => {
        modal.hide();
        blockBtnAddTitle(approveBtn);
        approveActionBtn.textContent = 'Да';
      }, 800);
    };

    approveActionBtn.addEventListener('click', approveAction);
  };
  approveBtn?.addEventListener('click', approveAction);
};
