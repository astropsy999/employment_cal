import { getTypesOfWorkOptions } from '../api/getDropDownData';
import { addEventToUser } from '../actions/addEventToUser';

import { getSelectedUserData } from '../api/getSlectedUserData';
import { isManager } from '../api/isManager';
import { parseResievedDataToCal } from './parseResievedDataToCal';
import { tempLoader } from './tempLoader';
import { forceCalendarRecalculate } from '../utils/fullcalendar';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import {
  formatDate,
  getMonthRange,
  blockBtnAddTitle,
  unblockBtnAddTitle,
  clearMonthCells,
} from '../utils/mainGlobFunctions';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from './checkBlockedDays';
import { Calendar } from '@fullcalendar/core';

/**
 * Изменение отображаемых данных с помощью селектора для выбора пользователе(для руководителей)
 * @param {*} calendar
 * @param {*} userID
 */
export const changeUserData = (calendar: Calendar, userID: string) => {
  const eventTaskModalBtn = document.querySelector('#addTaskToCalBtn');
  eventTaskModalBtn!.removeEventListener('click', addEventToUser);
  const userSelector = document.querySelector('#otherUsers');
  const addEventBtn = document.querySelector('#addTaskBtn');
  const multiKindOfTasks = document.querySelector('#multiKindOfTasks');
  const multiKindOfSubTask = document.querySelector('#multiKindOfSubTask');
  const kindOfTasksMassMonth = document.querySelector('#kindOfTasksMassMonth');
  const kindOfSubTaskMassMonth = document.querySelector(
    '#kindOfSubTaskMassMonth',
  );

  if (userSelector) {
    userSelector.addEventListener('change', async (e) => {
      const calendarSelectable = calendar.getOption('selectable');
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable:", calendarSelectable)
      kindOfTasks.innerHTML =
        '<option selected value="Не выбрано">Не выбрано</option>';
      multiKindOfTasks.innerHTML =
        '<option selected value="Не выбрано">Не выбрано</option>';
      kindOfTasksMassMonth.innerHTML =
        '<option selected value="Не выбрано">Не выбрано</option>';
      const approveBtn = document.querySelector('.approveBtn');
      const lockBtn = document.querySelector('.lockBtn');
      const currentUserLevel = Number(
        localStorage.getItem('currentManagerLevel'),
      );

      unblockBtnAddTitle(lockBtn);

      calendar.removeAllEvents();

      sessionStorage.setItem('events', JSON.stringify([]));
      // Получаем дату начала текущей недели
      const currentDateStart = calendar.currentData.currentDate;

      removeOverlays();
      // clearMonthCells();

      if (calendar.view.type === 'dayGridMonth') {
        clearMonthCells();
      }
      calendar?.removeAllEvents();
      tempLoader(true);

      localStorage.removeItem('managerLevel');
      // Проверяем является ли выбранный пользователь руководителем
      const isSelectedMan = await isManager(userSelector.value);
      const selectedUser = e.target.value.toString();
      const selectedUserName = e.target.selectedOptions[0].textContent;
      localStorage.setItem('selectedUserName', selectedUserName);
      const managerName = getLocalStorageItem('managerName');
      localStorage.setItem('iddb', selectedUser);

      // Если на стыке месяцев, то интервал расширяем до 2х месяцев
      // if()

      // Получаем интервал для загрузки данных пользователя
      const currentUserRange = getMonthRange();
      const newUserData = await getSelectedUserData(
        selectedUser,
        currentUserRange.start,
        currentUserRange.end,
      );

      let { events, parentIdDataArr, lockedDatesArray } =
        parseResievedDataToCal(newUserData);

      localStorage.setItem('parentIdDataArr', JSON.stringify(parentIdDataArr));
      localStorage.setItem(
        'lockedDatesArray',
        JSON.stringify(lockedDatesArray),
      );
      calendar.gotoDate(currentDateStart);
      sessionStorage.setItem('events', JSON.stringify(events));

      // tempLoader(false);
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable106:", calendarSelectable)

      const selectedUserLevel = Number(isSelectedMan.managerLevel);
      if (isSelectedMan && selectedUserLevel <= currentUserLevel) {
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable110:", calendarSelectable)

        calendar.setOption('selectable', false);
      } else {
        calendar.setOption('selectable', true);
      }

      if (selectedUser !== userID) {
        addEventBtn.style.display = 'none';
        // calendar.setOption('selectable', false)
        calendar.setOption('editable', false);
        calendar.setOption('eventResizableFromStart', false);
        calendar.setOption('eventDurationEditable', false);
        console.log('currentUserLevel: ', currentUserLevel);
        console.log('selectedUserLevel: ', selectedUserLevel);
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable125:", calendarSelectable)


      } else {
        addEventBtn.style.display = 'flex';
        calendar.setOption('selectable', true);
        calendar.setOption('editable', true);
        calendar.setOption('eventResizableFromStart', true);
        calendar.setOption('eventDurationEditable', true);
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable134:", calendarSelectable)

      }

      let eventSources = calendar.getEventSources();
      let len = eventSources.length;
      for (let i = 0; i < len; i++) {
        eventSources[i].remove();
      }

      calendar.addEventSource(events);

      tempLoader(false);
      forceCalendarRecalculate(calendar);
      calendar.render();

      // Проверяем наличие событий в текущем диапазоне дат
      const activeStart = calendar.view.activeStart;
      const activeEnd = calendar.view.activeEnd;
      const allEvents = calendar.getEvents();

      /**
       * Условие для повторного запуска лодера только если месяц в дате начала недели отличается от текущего месяца
       * (в этом случае требуется дозагрузка данных за новый месяц и нужен дополнительный лодер)
       */
      const activeStartMonth = activeStart.getMonth();
      const currentMonth = new Date().getMonth();
      // if (activeStartMonth != currentMonth) {
      //   tempLoader(true);
      // }

      const currentEvents = allEvents.filter(function (event) {
        return event.start >= activeStart && event.start < activeEnd;
      });

      const hasApproved = currentEvents.filter(
        (e) => e._def.extendedProps.isApproved,
      );

      if (!isSelectedMan || selectedUserLevel > currentUserLevel) {
        unblockBtnAddTitle(lockBtn);

        if (
          currentEvents.length > 0 &&
          (hasApproved.length === 0 ||
            hasApproved.length < currentEvents.length)
        ) {
          unblockBtnAddTitle(approveBtn);
        } else {
          blockBtnAddTitle(approveBtn);
        }
      } else {
        if (selectedUserName !== managerName) {
          blockBtnAddTitle(approveBtn, lockBtn);
        } else if (currentUserLevel > 1) {
          blockBtnAddTitle(lockBtn);
        }
      }

      if (
        lockedDatesArray.length > 0 &&
        lockedDatesArray.includes(formatDate(activeStart))
      ) {
        localStorage.setItem('isWeekLocked', true);
        toggleIcon('unlock');
        addBlockOverlays();
      } else {
        toggleIcon('lock');
        localStorage.setItem('isWeekLocked', false);
      }

      getTypesOfWorkOptions(kindOfTasks, kindOfSubTask, selectedUser);
      getTypesOfWorkOptions(multiKindOfTasks, multiKindOfSubTask, selectedUser);
      getTypesOfWorkOptions(
        kindOfTasksMassMonth,
        kindOfSubTaskMassMonth,
        selectedUser,
      );
      console.log("🚀 ~ userSelector.addEventListener ~ calendarSelectable212:", calendarSelectable)

      return;
    });
  }
};
