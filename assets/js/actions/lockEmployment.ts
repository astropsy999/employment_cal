import { Calendar } from '@fullcalendar/core';
import { Modal, Popover } from 'bootstrap';
import { approveEventsApi } from '../api/approveEvents';
import { lockingActionApi } from '../api/lockingActionApi';
import { buttonLoader } from '../ui/buttonLoader';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from '../ui/checkBlockedDays';
import { getCurrentWeekDates, parseDateString } from '../utils/datesUtils';
import { fullCalendar } from '../utils/fullcalendar';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtils';
import { getKeysForSelectedDates, getSelectedDates, hasUnSubmittedEvents } from '../utils/lockUnlockUtils';
import { formatDate } from '../utils/mainGlobFunctions';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';

export const lockEmployment = (calendar: Calendar) => {
  const lockBtn = document.querySelector('.lockBtn');

  const lockAction = () => {
    const isLocked = getLocalStorageItem('isWeekLocked');
    let hasUnsubmittedEvents = false;

    const lockEmplmodal = document.querySelector('#LockEmplModal') as HTMLElement;
    const unlockEmplmodal = document.querySelector('#unLockEmplModal') as HTMLElement;
    const dailyBlockContainer = document.querySelector('.dailyBlockContainer') as HTMLElement;
    const dailyUnBlockContainer = document.querySelector('.dailyUnBlockContainer') as HTMLElement;

    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    const currentEvents = calendar.getEvents();

    const eventsInCurrentWeek = currentEvents.filter((event) => {
      const eventStart = event.start;
      return eventStart! >= startDate && eventStart! <= endDate;
    });

    if (eventsInCurrentWeek.length > 0) {
      eventsInCurrentWeek.forEach((ev) => {
        const isApproved = ev._def.extendedProps.isApproved;
        if (isApproved === '') {
          hasUnsubmittedEvents = true;
          return;
        }
      });
    }

    // const lastEvent = eventsInCurrentWeek.reduce(
    //   (latestEvent, currentEvent) => {
    //     const latestEventDate = latestEvent ? latestEvent.start : null;
    //     const currentEventDate = currentEvent.start;

    //     if (!latestEventDate || currentEventDate > latestEventDate) {
    //       return currentEvent;
    //     } else {
    //       return latestEvent;
    //     }
    //   },
    //   null,
    // );

    // eventsInCurrentWeek.sort((a, b) => a.start - b.start);

    const approveAndLockAction = () => {
      const yesOnPopover = document.querySelector('.yesOnPopover');

      approveEventsApi(eventsInCurrentWeek)
      .then((response) => {
          yesOnPopover!.textContent = 'Согласовано';
          fullCalendar.fullCalendarInit();
          lockingAction();
        });
    };

    let modal: Modal;

    if (isLocked) {
      modal = new Modal(unlockEmplmodal);
    } else {
      modal = new Modal(lockEmplmodal);
    }


    modal.show();

    if (
      modal &&
      //@ts-ignore
      modal._element.id === 'LockEmplModal' &&
      //@ts-ignore
      modal._isShown && hasUnsubmittedEvents
    ) {
      let popover = new Popover('.lock-action', {
        // container: '.modal-body',
        placement: 'bottom',
        title: 'Согласовать перед блокировкой?',
        html: true,
        template: `<div style="max-width:fit-content;" class="popover" role="tooltip"><div class="popover-inner">
                <div class="modal-body fs-0">
                Есть несогласованные задачи!<br>
                <b>Согласуете перед блокировкой?</b></div>
                <div class="card-footer d-flex justify-content-center align-items-center bg-light p-0">
                <button type='button' class='btn btn-success m-2 yesOnPopover'>Да</button>
                <button type='button' class='btn btn-success m-2 noOnPopover'>Нет</button>
              <button type='button' class='btn btn-warning m-2 cancelPopover' >Отмена</button></div></div></div>`,
        trigger: 'click',
        sanitize: false,
      });

      // @ts-ignore
      popover._element.addEventListener('shown.bs.popover', () => {
        const cancelButton = document.querySelector('.cancelPopover');
        const noOnPopover = document.querySelector('.noOnPopover');
        const yesOnPopover = document.querySelector('.yesOnPopover');

        cancelButton?.addEventListener('click', function () {
          modal.hide();
          popover.disable();
        });

        noOnPopover?.addEventListener('click', lockingAction);
        yesOnPopover?.addEventListener('click', approveAndLockAction);
        popover.disable();
      });
    }

    // Использование функции для преобразования дат

    endDate.setDate(endDate.getDate() - 1);

    const startLockDate = document.querySelector('.startLockDate') as HTMLElement;
    const startUnlockDate = document.querySelector('.startUnlockDate') as HTMLElement;
    const endLockDate = document.querySelector('.endLockDate') as HTMLElement;
    const endUnlockDate = document.querySelector('.endUnlockDate') as HTMLElement;
    const lockActionBtn = document.querySelector('.lock-action') as HTMLButtonElement;
    const unlockActionBtn = document.querySelector('.unlock-action') as HTMLButtonElement;
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const parentIdDataArr = getLocalStorageItem('parentIdDataArr');

    const currentWeekDatesArr = getCurrentWeekDates(formattedStartDate);

    startLockDate.innerText = startUnlockDate.innerText = formattedStartDate;
    endLockDate.innerText = endUnlockDate.innerText = formattedEndDate;

    const { lockingDatesArr, weekToBlockIDs } = getKeysForSelectedDates(
      currentWeekDatesArr,
      parentIdDataArr,
    );

    console.log('🚀 ~ lockAction ~ lockingDatesArr:', lockingDatesArr);

    const parsedLockedDatesArr = lockingDatesArr.map((date: string) => {
      return new Date(parseDateString(date)!);
    }).reverse();


    if(!isLocked) {
      generateDaysCheckboxes(dailyBlockContainer, parsedLockedDatesArr)
    }
    else {
      generateDaysCheckboxes(dailyUnBlockContainer, parsedLockedDatesArr)
    }


    // Подтверждение блокировки/разблокировки

    async function lockingAction() {
      lockActionBtn?.removeEventListener('click', lockingAction);
      unlockActionBtn?.removeEventListener('click', lockingAction);

      const selectedDatesArr = isLocked ? getSelectedDates(dailyUnBlockContainer) : getSelectedDates(dailyBlockContainer);
      console.log('selectedDatesArr: ', selectedDatesArr);

      const { lockingDatesArr, weekToBlockIDs } = getKeysForSelectedDates(
        selectedDatesArr,
        parentIdDataArr,
      );

      let currentLockedDatesArr = getLocalStorageItem('lockedDatesArray');

      console.log('currentLockedDatesArr: ', currentLockedDatesArr);
      const lockingDatesArrUn = lockingDatesArr;
      let mergedLockedDatesArr;

      if (!isLocked) {
        mergedLockedDatesArr = [...currentLockedDatesArr, ...lockingDatesArrUn];
        console.log('mergedLockedDatesArr: ', mergedLockedDatesArr);
      } else {
        mergedLockedDatesArr = currentLockedDatesArr.filter(
          (date: string) => !lockingDatesArrUn.includes(date),
        );

        console.log('mergedLockedDatesArr: ', mergedLockedDatesArr);

      }

      const hasUmSubmittedEvents = hasUnSubmittedEvents(calendar, selectedDatesArr);
      console.log('hasUmSubmittedEvents: ', hasUmSubmittedEvents);


      lockActionBtn && buttonLoader(lockActionBtn, true);
      unlockActionBtn && buttonLoader(unlockActionBtn, true);

      await lockingActionApi(weekToBlockIDs, isLocked);

      lockActionBtn && buttonLoader(lockActionBtn, false);
      unlockActionBtn && buttonLoader(unlockActionBtn, false);

      // Записываем новые данные о датах блокировки в массив и localstorage
      setLocalStorageItem('lockedDatesArray', mergedLockedDatesArr);


      if (!isLocked) {
        addBlockOverlays();
        lockActionBtn!.textContent = 'Заблокировано';
        toggleIcon('unlock');
        setLocalStorageItem('isWeekLocked', true);
      } else {
        removeOverlays();
        unlockActionBtn!.textContent = 'Разблокировано';
        toggleIcon('lock');
        setLocalStorageItem('isWeekLocked', false);
      }

      setTimeout(() => {
        modal?.hide();
        lockActionBtn!.textContent = 'Да';
        unlockActionBtn!.textContent = 'Да';
      }, 800);
    }

    if (!hasUnsubmittedEvents) {
      lockActionBtn?.addEventListener('click', lockingAction);
    }
    unlockActionBtn?.addEventListener('click', lockingAction);
  };

  lockBtn?.addEventListener('click', lockAction);
};
