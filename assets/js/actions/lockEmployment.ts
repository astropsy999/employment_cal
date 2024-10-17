import { Calendar, EventApi } from '@fullcalendar/core';
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
import { getEventsInSelectedDates, getKeysForSelectedDates, getSelectedDates, hasUnSubmittedEvents, lockCheckboxesState, toggleYesNoButtonsState } from '../utils/lockUnlockUtils';
import { formatDate } from '../utils/mainGlobFunctions';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';

export const lockEmployment = (calendar: Calendar) => {
  const lockBtn = document.querySelector('.lockBtn');

  const lockAction = () => {
    const isLocked = getLocalStorageItem('isWeekLocked');
    const lockEmplModalElement = document.querySelector('#LockEmplModal') as HTMLElement;
    const unlockEmplModalElement = document.querySelector('#unLockEmplModal') as HTMLElement;
    const dailyBlockContainer = document.querySelector('.dailyBlockContainer') as HTMLElement;
    const dailyUnBlockContainer = document.querySelector('.dailyUnBlockContainer') as HTMLElement;
    const lockingName = document.querySelector(
      '.lockedUserSurname',
    ) as HTMLElement;
    const unlockingName = document.querySelector(
      '.unLockedUserSurname',
    ) as HTMLElement;

    const modalElement = isLocked ? unlockEmplModalElement : lockEmplModalElement;
    const modal = new Modal(modalElement);
    modal.show();

    unlockEmplModalElement.addEventListener('shown.bs.modal', () => {
      lockCheckboxesState(isLocked);
    });
   
    lockingName && (lockingName.textContent = getLocalStorageItem('selectedUserName'));
    unlockingName &&
      (unlockingName.textContent = getLocalStorageItem('selectedUserName'));
    toggleYesNoButtonsState(false);

    // Настраиваем даты и содержимое модального окна
    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);
    endDate.setDate(endDate.getDate() - 1);
    const formattedStartDate = formatDate(startDate);

    const parentIdDataArr = getLocalStorageItem('parentIdDataArr');
    const currentWeekDatesArr = getCurrentWeekDates(formattedStartDate);
    const { lockingDatesArr, weekToBlockIDs } = getKeysForSelectedDates(
      currentWeekDatesArr,
      parentIdDataArr,
    );

    const parsedLockedDatesArr = lockingDatesArr
      .map((date: string) => new Date(parseDateString(date)!))
      .reverse();

    if (!isLocked) {
      generateDaysCheckboxes(dailyBlockContainer, parsedLockedDatesArr);
    } else {
      generateDaysCheckboxes(dailyUnBlockContainer, parsedLockedDatesArr);
    }

    const lockActionBtn = modalElement.querySelector('.lock-action') as HTMLButtonElement;
    const unlockActionBtn = modalElement.querySelector('.unlock-action') as HTMLButtonElement;
    const cancelActionBtn = modalElement.querySelector('.cancel-action') as HTMLButtonElement;

   function updateUIAfterLocking(mergedLockedDatesArr: string[]) {
     // Записываем новые данные о датах блокировки в массив и localStorage
     setLocalStorageItem('lockedDatesArray', mergedLockedDatesArr);

     if (!isLocked) {
       addBlockOverlays();
       toggleIcon('unlock');
       setLocalStorageItem('isWeekLocked', true);

       if (lockActionBtn) {
         lockActionBtn.textContent = 'Заблокировано';
       }

       setTimeout(() => {
         if (lockActionBtn) {
           lockActionBtn.textContent = 'Да';
         }
        fullCalendar.fullCalendarInit();

       }, 500);
     } else {
       removeOverlays();
       toggleIcon('lock');
       setLocalStorageItem('isWeekLocked', false);

       if (unlockActionBtn) {
         unlockActionBtn.textContent = 'Разблокировано';
       }
     }

     setTimeout(() => {
       if (lockActionBtn) {
         lockActionBtn.textContent = 'Да';
       }
       if (unlockActionBtn) {
         unlockActionBtn.textContent = 'Да';
       }

       modal?.hide();
       fullCalendar.fullCalendarInit();

       // Если нужно, можно перезагрузить календарь
    }, 800);
  }
  let popoverShownHandler: (() => void) | null = null;
    const handleLockAction = async () => {

      lockActionBtn?.removeEventListener('click', handleLockAction);
      unlockActionBtn?.removeEventListener('click', handleLockAction);

      const selectedDatesArr = isLocked
        ? getSelectedDates(dailyUnBlockContainer)
        : getSelectedDates(dailyBlockContainer);

      const { lockingDatesArr, weekToBlockIDs } = getKeysForSelectedDates(
        selectedDatesArr,
        parentIdDataArr,
      );

      let currentLockedDatesArr = getLocalStorageItem('lockedDatesArray') || [];
      const lockingDatesArrUn = lockingDatesArr;
      let mergedLockedDatesArr: string[];

      if (!isLocked) {
        mergedLockedDatesArr = [...currentLockedDatesArr, ...lockingDatesArrUn];
      } else {
        mergedLockedDatesArr = currentLockedDatesArr.filter(
          (date: string) => !lockingDatesArrUn.includes(date),
        );
      }

      const hasUnsubmittedEvents = hasUnSubmittedEvents(calendar, selectedDatesArr);
      const eventsInSelectedDates = getEventsInSelectedDates(calendar, selectedDatesArr);


      if (!isLocked && hasUnsubmittedEvents) {
        const popoverTriggerEl = lockActionBtn;
        console.log('popoverTriggerEl: ', popoverTriggerEl);
        if (popoverTriggerEl) {
          if (popoverShownHandler) {
            popoverTriggerEl.removeEventListener('shown.bs.popover', popoverShownHandler);
          }
          const popover = new Popover(popoverTriggerEl, {
            placement: 'bottom',
            title: 'Согласовать перед блокировкой?',
            html: true,
            template: `
              <div class="popover" role="tooltip">
                <div class="popover-inner">
                  <div class="modal-body fs-0">
                    Есть несогласованные задачи!<br>
                    <b>Согласуете перед блокировкой?</b>
                  </div>
                  <div class="card-footer d-flex justify-content-center align-items-center bg-light p-0">
                    <button type='button' class='btn btn-success m-2 yesOnPopover'>Да</button>
                    <button type='button' class='btn btn-success m-2 noOnPopover'>Нет</button>
                    <button type='button' class='btn btn-warning m-2 cancelPopover'>Отмена</button>
                  </div>
                </div>
              </div>
            `,
            trigger: 'manual',
            sanitize: false,
          });

          popoverShownHandler = () => {
            const popoverElement = (popover as any).tip as HTMLElement;
            if (popoverElement) {
              console.log('popoverElement: ', popoverElement);
    
              const cancelButton = popoverElement.querySelector('.cancelPopover');
              const noOnPopover = popoverElement.querySelector('.noOnPopover');
              const yesOnPopover = popoverElement.querySelector('.yesOnPopover') as HTMLButtonElement;
    
              toggleYesNoButtonsState(true);
    
              const cancelHandler = () => {
                modal.hide();
                popover.hide();
                removePopoverEventListeners();
              };
    
              const noHandler = async () => {
                removePopoverEventListeners();
                popover.dispose();
                console.log('popover: ', popover);
                if (lockActionBtn) buttonLoader(lockActionBtn, true);
                if (unlockActionBtn) buttonLoader(unlockActionBtn, true);
    
                await lockingActionApi(weekToBlockIDs, isLocked);
    
                if (lockActionBtn) buttonLoader(lockActionBtn, false);
                if (unlockActionBtn) buttonLoader(unlockActionBtn, false);
    
                updateUIAfterLocking(mergedLockedDatesArr);
    
              };
    
              const yesHandler = async () => {
                buttonLoader(yesOnPopover, true);
                await approveEventsApi(eventsInSelectedDates);
                removePopoverEventListeners();
                buttonLoader(yesOnPopover, false);
                yesOnPopover.textContent = 'V';
                popover.disable();
                popover.hide();

                if (lockActionBtn) buttonLoader(lockActionBtn, true);
                if (unlockActionBtn) buttonLoader(unlockActionBtn, true);

                await lockingActionApi(weekToBlockIDs, isLocked);
    
                if (lockActionBtn) buttonLoader(lockActionBtn, false);
                if (unlockActionBtn) buttonLoader(unlockActionBtn, false);
    
                updateUIAfterLocking(mergedLockedDatesArr);
                removePopoverEventListeners();
              };
    
              cancelButton?.addEventListener('click', cancelHandler);
              noOnPopover?.addEventListener('click', noHandler);
              yesOnPopover?.addEventListener('click', yesHandler);
    
              function removePopoverEventListeners() {
                cancelButton?.removeEventListener('click', cancelHandler);
                noOnPopover?.removeEventListener('click', noHandler);
                yesOnPopover?.removeEventListener('click', yesHandler);
                popoverTriggerEl.removeEventListener('shown.bs.popover', popoverShownHandler!);
                popoverShownHandler = null;
              }
            }
          };
    
          // Добавляем обработчик события
          popoverTriggerEl.addEventListener('shown.bs.popover', popoverShownHandler);
    
          // Показываем Popover
          popover.show();
        }
      } else {
        lockActionBtn && buttonLoader(lockActionBtn, true);
        unlockActionBtn && buttonLoader(unlockActionBtn, true);

        await lockingActionApi(weekToBlockIDs, isLocked);

        lockActionBtn && buttonLoader(lockActionBtn, false);
        unlockActionBtn && buttonLoader(unlockActionBtn, false);

        updateUIAfterLocking(mergedLockedDatesArr);
      }
      fullCalendar.fullCalendarInit();
    };


    lockActionBtn?.addEventListener('click', handleLockAction);
    unlockActionBtn?.addEventListener('click', handleLockAction);
  };

  lockBtn?.addEventListener('click', lockAction);
};

