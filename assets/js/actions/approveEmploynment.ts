import { Calendar } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import { Modal } from 'bootstrap';
import { approveEventsApi } from '../api/approveEvents';
import { formatDate } from '../utils/datesUtils';
import { fullCalendar } from '../utils/fullcalendar';
import { blockBtnAddTitle } from '../utils/mainGlobFunctions';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';

export const approveEmploynment = (calendar: Calendar) => {
  const approveBtn = document.querySelector('.approveBtn');

  const approveAction = () => {

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector('#otherUsers') as HTMLSelectElement;
    const selectedUser = otherUsersSelector?.selectedOptions[0].textContent;

    const userSurname = document.querySelector('.userSurname');
    userSurname && (userSurname.textContent = selectedUser);
 

    const approveEmplmodal = document.querySelector('#approveEmplModal');
    const modal = approveEmplmodal ? new Modal(approveEmplmodal) : null;

    // Преобразуем даты в нужный формат
    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    modal?.show();

    const startApproveDate = document.querySelector('.startApproveDate');
    const endApproveDate = document.querySelector('.endApproveDate');
    const approveActionBtn = document.querySelector('.approve-action') as HTMLButtonElement;
    const dailyApproveContainer = document.querySelector('.dailyApprove') as HTMLDivElement;

    // Получаем все события на странице
    const currentEvents = calendar.getEvents();

    const isDate = (value: any): value is Date => value instanceof Date;

    const eventsInCurrentWeek = currentEvents.filter((event) => {
      const eventStart = event?.start;
      return isDate(eventStart) && eventStart >= startDate && eventStart <= endDate;
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

    endApproveDate && lastEventDate && (endApproveDate.textContent = formatDate(lastEventDate));
    startApproveDate && firstEventDate && (startApproveDate.textContent = formatDate(firstEventDate));

     // Генерация списка дат с чекбоксами
     generateDaysCheckboxes(dailyApproveContainer, eventsInCurrentWeek);
    
     // Подтверждение согласования события
     const approveAction = () => {
      // Удаляем обработчик события, чтобы предотвратить множественные отправки
      approveActionBtn?.removeEventListener('click', approveAction);
    
      // Собираем выбранные даты
      const selectedCheckboxes = dailyApproveContainer.querySelectorAll(
        'input[type="checkbox"]:checked'
      ) as NodeListOf<HTMLInputElement>;
    
      const selectedDates = Array.from(selectedCheckboxes).map((cb) => cb.value);
    
      // Фильтруем события по выбранным датам
      const eventsToApprove = eventsInCurrentWeek.filter((event) => {
        const eventDateStr = formatDate(event.start!);
        return selectedDates.includes(eventDateStr);
      });
    
      if (eventsToApprove.length === 0) {
        alert('Пожалуйста, выберите хотя бы одно событие для согласования.');
        return;
      }
    
      approveActionBtn!.disabled = true;
    
      approveEventsApi(eventsToApprove)
        .then(() => {
         
          approveActionBtn.textContent = 'Согласовано';

          setTimeout(() => {
            modal?.hide();
            blockBtnAddTitle(approveBtn);
            approveActionBtn.textContent = 'Да';
            approveActionBtn.disabled = false;
          }, 800);
           fullCalendar.fullCalendarInit();
           // Обновляем календарь после успешного согласования
           calendar.render();
        })
        .catch((error) => {
          console.error('Ошибка при согласовании событий:', error);
          alert('Произошла ошибка при согласовании событий. Пожалуйста, попробуйте снова.');
          approveActionBtn.disabled = false;
        });
    };

    approveActionBtn?.addEventListener('click', approveAction);
  };
  approveBtn?.addEventListener('click', approveAction);
};
