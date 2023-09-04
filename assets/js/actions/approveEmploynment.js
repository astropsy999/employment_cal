import * as C from '../config';
import { fullCalendar } from '../utils/fullcalendar';
import { formatDate, blockBtnAddTitle } from '../utils/mainGlobFunctions';
import { Modal } from 'bootstrap';

export const approveEmploynment = (calendar) => {
  const approveBtn = document.querySelector('.approveBtn');

  const approveAction = () => {
    // Получаем текущий вид календаря
    const currentView = calendar.view;

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector('#otherUsers');
    const selectedUser = otherUsers?.selectedOptions[0].textContent;
    const selectedUserId = otherUsers?.value;

    const userSurname = document.querySelector('.userSurname');
    userSurname.textContent = selectedUser;

    const approveEmplmodal = document.querySelector('#approveEmplModal');
    const modal = new Modal(approveEmplmodal);

    // Использование функции для преобразования дат
    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    modal.show();

    const startApproveDate = document.querySelector('.startApproveDate');
    const endApproveDate = document.querySelector('.endApproveDate');
    const approveActionBtn = document.querySelector('.approve-action');

    // Получаем все события на странице

    const currentEvents = calendar.getEvents();

    const eventsInCurrentWeek = currentEvents.filter((event) => {
      const eventStart = event.start;
      return eventStart >= startDate && eventStart <= endDate;
    });

    // После фильтрации событий в текущей неделе
    const lastEvent = eventsInCurrentWeek.reduce(
      (latestEvent, currentEvent) => {
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
    eventsInCurrentWeek.sort((a, b) => a.start - b.start);
    const firstEventDate = eventsInCurrentWeek[0].start;
    const lastEventDate = lastEvent.start;

    endApproveDate.textContent = formatDate(lastEventDate);
    startApproveDate.textContent = formatDate(firstEventDate);

    // Подтверждение согласования события

    const approveAction = () => {
      approveActionBtn.removeEventListener('click', approveAction);
      eventsInCurrentWeek.forEach((e) => {
        const delID = e._def.extendedProps.delID;

        const managerName = localStorage.getItem('managerName');

        let formDataApproved = new FormData();

        formDataApproved.append('ID', delID);
        formDataApproved.append('TypeID', '1094');
        formDataApproved.append('Data[0][name]', '9245');
        formDataApproved.append('Data[0][value]', managerName);
        formDataApproved.append('Data[0][isName]', 'false');
        formDataApproved.append('Data[0][maninp]', 'false');
        formDataApproved.append('Data[0][GroupID]', '2443');
        formDataApproved.append('ParentObjID', localStorage.getItem('iddb'));
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
              fullCalendar.fullCalendarInit();
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
