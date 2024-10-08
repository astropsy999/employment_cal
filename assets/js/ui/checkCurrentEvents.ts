import { getLocalStorageItem } from '../utils/localStorageUtils';
import {
  blockBtnAddTitle,
  unblockBtnAddTitle,
} from '../utils/mainGlobFunctions';

/**
 * В недельном отображении при переключении диапазона дат,
 * функция проверяет наличие событий на странице и блокирует/разблокирует кнопку Согласования
 * @param {*} calendar
 */

export const checkCurrentEventsAndBlockApproveBtn = (calendar: { on: (arg0: string, arg1: (info: any) => void) => void; getEvents: () => any[]; }) => {
  const approveBtn = document.querySelector('.approveBtn');
  const lockBtn = document.querySelector('.lockBtn');
  // Проверяем наличие событий при переключении дат и блокируем кнопку если не
  calendar.on('datesSet', function (info) {
    if (info.view.type === 'timeGridWeek') {
      const startDate = info.start;
      const endDate = info.end;

      const selectedUserName = localStorage.getItem('selectedUserName');
      const managerName = getLocalStorageItem('managerName');
      const selectedUserLevel = Number(localStorage.getItem('managerLevel'));
      const currentUserLevel = Number(
        localStorage.getItem('currentManagerLevel'),
      );

      // Проверяем наличие событий в текущем диапазоне дат
      const eventsInCurrentRange = calendar
        .getEvents()
        .filter(function (event) {
          return event.start >= startDate && event.start < endDate;
        });

      const hasApproved = eventsInCurrentRange.filter(
        (e) => e._def.extendedProps.isApproved,
      );

      if (!selectedUserLevel || selectedUserLevel > currentUserLevel) {
        if (
          eventsInCurrentRange.length > 0 &&
          (hasApproved.length === 0 ||
            hasApproved.length < eventsInCurrentRange.length)
        ) {
          unblockBtnAddTitle(approveBtn);
        } else {
          blockBtnAddTitle(approveBtn);
        }
      } else if (selectedUserName === managerName && currentUserLevel === 1) {
        if (
          eventsInCurrentRange.length > 0 &&
          (hasApproved.length === 0 ||
            hasApproved.length < eventsInCurrentRange.length)
        ) {
          unblockBtnAddTitle(approveBtn);
        } else {
          blockBtnAddTitle(approveBtn);
        }
      } else {
        blockBtnAddTitle(approveBtn);
      }
    }
  });
};
