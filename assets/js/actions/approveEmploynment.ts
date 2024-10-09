import { Calendar } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import { Modal } from 'bootstrap';
import * as C from '../config';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import { blockBtnAddTitle } from '../utils/mainGlobFunctions';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';
import { formatDate } from '../utils/datesUtils';


export const approveEmploynment = (calendar: Calendar) => {
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

    const eventsInCurrentWeek = currentEvents.filter((event: EventImpl) => {
      const eventStart = event.start;
      return eventStart! >= startDate && eventStart! <= endDate;
    });

    // После фильтрации событий в текущей неделе
    const lastEvent = eventsInCurrentWeek.reduce(
      (latestEvent: EventImpl, currentEvent: EventImpl) => {
        const latestEventDate = latestEvent ? latestEvent.start : null;
        const currentEventDate = currentEvent.start;

        if (!latestEventDate || currentEventDate! > latestEventDate) {
          return currentEvent;
        } else {
          return latestEvent;
        }
      },
      eventsInCurrentWeek[0] as EventImpl,
    );

    // Если есть последнее событие, получаем его дату
    eventsInCurrentWeek.sort(
      (a: EventImpl, b: EventImpl) =>
        (a.start as Date).getTime() - (b.start as Date).getTime(),
    );

    const firstEventDate = eventsInCurrentWeek[0].start;
    const lastEventDate = lastEvent.start;

    endApproveDate!.textContent = formatDate(lastEventDate!);
    startApproveDate!.textContent = formatDate(firstEventDate!);

     // Генерация списка дат с чекбоксами
    generateDaysCheckboxes(dailyApproveContainer, eventsInCurrentWeek);

    // Подтверждение согласования события

    const approveAction = () => {
      approveActionBtn.removeEventListener('click', approveAction);

      // Собираем выбранные даты
      const selectedCheckboxes = dailyApproveContainer.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
      const selectedDates = Array.from(selectedCheckboxes).map(cb => cb.value);

       // Фильтруем события по выбранным датам
       const eventsToApprove = eventsInCurrentWeek.filter((event: EventImpl) => {
        const eventDateStr = formatDate(event.start as Date);
        return selectedDates.includes(eventDateStr);
      });


      eventsToApprove.forEach((e: EventImpl) => {

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
          changedCalendarEvents.forEach((event: EventImpl) => {

            if (event._def.defId === e._def.defId) {
              event.setExtendedProp('isApproved', managerName);
              // event.dropable = false;
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
