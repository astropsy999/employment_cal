import { Calendar } from "@fullcalendar/core";
import { blockBtnAddTitle, unblockBtnAddTitle } from "../utils/mainGlobFunctions";

export const checkCurrentEventsAndBlockApproveBtn = (calendar: Calendar) => {
  console.log("🚀 ~ checkCurrentEventsAndBlockApproveBtn ~ Вызов функции");

  const approveBtn = document.querySelector('.approveBtn');
  const lockBtn = document.querySelector('.lockBtn');

  if (!approveBtn || !lockBtn) {
    console.error('Кнопки .approveBtn или .lockBtn не найдены в DOM.');
    return;
  }

  // Удаляем предыдущие обработчики, чтобы избежать дублирования
  calendar.off('datesSet', ()=>{});

  // Добавляем обработчик события 'datesSet'
  calendar.on('datesSet', function (info) {
    console.log("Событие 'datesSet' сработало:", info);
    console.log("Текущий вид календаря:", info.view.type);

    if (info.view.type === 'timeGridWeek') {
      const startDate = info.start;
      const endDate = info.end;

      const selectedUserName = localStorage.getItem('selectedUserName');
      const managerName = localStorage.getItem('managerName');
      const selectedUserLevel = Number(localStorage.getItem('managerLevel'));
      const currentUserLevel = Number(localStorage.getItem('currentManagerLevel'));

      console.log("selectedUserName:", selectedUserName);
      console.log("managerName:", managerName);
      console.log("selectedUserLevel:", selectedUserLevel);
      console.log("currentUserLevel:", currentUserLevel);

      // Получаем события в текущем диапазоне дат
      const eventsInCurrentRange = calendar
        .getEvents()
        .filter(function (event) {
          return event.start! >= startDate && event.start! < endDate;
        });

      console.log("События в текущем диапазоне:", eventsInCurrentRange);

      const hasApproved = eventsInCurrentRange.filter(
        (e) => e.extendedProps.isApproved,
      );

      console.log("Согласованные события:", hasApproved);

      if (!selectedUserLevel || selectedUserLevel > currentUserLevel) {
        if (
          eventsInCurrentRange.length > 0 &&
          (hasApproved.length === 0 ||
            hasApproved.length < eventsInCurrentRange.length)
        ) {
          console.log("Разблокируем кнопку approveBtn");
          unblockBtnAddTitle(approveBtn);
        } else {
          console.log("Блокируем кнопку approveBtn");
          blockBtnAddTitle(approveBtn);
        }
      } else if (selectedUserName === managerName && currentUserLevel === 1) {
        if (
          eventsInCurrentRange.length > 0 &&
          (hasApproved.length === 0 ||
            hasApproved.length < eventsInCurrentRange.length)
        ) {
          console.log("Разблокируем кнопку approveBtn для менеджера");
          unblockBtnAddTitle(approveBtn);
        } else {
          console.log("Блокируем кнопку approveBtn для менеджера");
          blockBtnAddTitle(approveBtn);
        }
      } else {
        console.log("Блокируем кнопку approveBtn по умолчанию");
        blockBtnAddTitle(approveBtn);
      }
    }
  });
};
