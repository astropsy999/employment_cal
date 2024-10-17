/**
 * Сохранение даты и вида отображения календаря при нажатии на кнопку Обновить
 * @param {*} calendar
 */
export const setViewAndDateToLS = (calendar) => {
  switch (calendar.view.type) {
    case 'timeGridWeek':
      const startWeekDateMs = calendar
        .getEventSources()[0]
        .context.currentDate.getTime();
      localStorage.setItem('startWeekDateMs', startWeekDateMs);
      localStorage.setItem('fcDefaultView', 'timeGridWeek');
      // location.reload();
      break;

    case 'dayGridMonth':
      const startMonthDateMs = calendar
        .getEventSources()[0]
        .context.currentDate.getTime();

      localStorage.setItem('startMonthDateMs', startMonthDateMs);
      localStorage.setItem('fcDefaultView', 'dayGridMonth');
      // location.reload();
      break;

    case 'timeGridDay':
      const startDayDateMs = calendar
        .getEventSources()[0]
        .context.currentDate.getTime();
      localStorage.setItem('startDayDateMs', startDayDateMs);
      localStorage.setItem('fcDefaultView', 'timeGridDay');
      // location.reload();

      break;

    case 'listWeek':
      const startListWeekDateMs = calendar
        .getEventSources()[0]
        .context.currentDate.getTime();
      localStorage.setItem('startListWeekDateMs', startListWeekDateMs);
      localStorage.setItem('fcDefaultView', 'listWeek');
      // location.reload();

      break;

    case 'listYear':
      const startlistYearDateMs = calendar
        .getEventSources()[0]
        .context.dateProfile.renderRange.start.getTime();
      localStorage.setItem('startlistYearDateMs', startlistYearDateMs);
      localStorage.setItem('fcDefaultView', 'listYear');
      // location.reload();

      break;
  }
};
