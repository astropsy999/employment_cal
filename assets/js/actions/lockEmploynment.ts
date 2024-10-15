import * as C from '../config';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from '../ui/checkBlockedDays';
import { formatDate } from '../utils/mainGlobFunctions';
import { Modal, Popover, Tooltip } from 'bootstrap';
import { fullCalendar } from '../utils/fullcalendar';
import { Calendar } from '@fullcalendar/core';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtils';
import { convertToISODate, parseDateString } from '../utils/datesUtils';
import { approveEventsApi } from '../api/approveEvents';
import { lockingActionApi } from '../api/lockingActionApi';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';

    /**
     * Собирает все выбранные даты из чекбоксов внутри контейнера.
     * @param container - HTML-элемент контейнера с чекбоксами.
     * @returns Массив выбранных дат в формате 'DD.MM.YYYY'.
     */
  const getSelectedDates = (container: HTMLElement): string[] => {
    const checkboxes = container?.querySelectorAll<HTMLInputElement>('.form-check-input');
    checkboxes.forEach((cb, index) => {
      console.log(`Checkbox ${index}: value=${cb.value}, checked=${cb.checked}`);
    });
    const selectedDates = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    return selectedDates;
  };

  /**
     * Возвращает массив дат текущей недели, начиная с startDate.
     * @param startDate - Строка начальной даты в формате 'DD.MM.YYYY'.
     * @returns Массив строковых дат в формате 'DD.MM.YYYY'.
     */
  const getCurrentWeekDates = (startDate: string): string[] => {
    const currentWeekDatesArr: string[] = [];

    const start = parseDateString(startDate);
    if (!start) {
      console.error('Некорректный формат startDate:', startDate);
      return currentWeekDatesArr; // Возвращаем пустой массив при некорректной дате
    }

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i); // Добавляем дни

      // Форматируем дату и добавляем в массив
      currentWeekDatesArr.push(formatDate(currentDate));
    }

    return currentWeekDatesArr;
  };


export const lockEmploynment = (calendar: Calendar) => {
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

    /**
     * Фильтрует выбранные даты и возвращает соответствующие ключи.
     * @param selectedDates - Массив выбранных дат в формате 'DD.MM.YYYY'.
     * @param arr - Массив объектов с ключами и датами.
     * @returns Объект с массивами lockingDatesArr и weekToBlockIDs.
     */
    const getKeysForSelectedDates = (selectedDates: string[], arr: Array<{ [key: string]: string }>) => {
      const lockingDatesArr: string[] = [];
      const weekToBlockIDsArr: string[] = [];

      for (const obj of arr) {
        const key = Object.keys(obj)[0];
        const date = obj[key];
        
        if (selectedDates.includes(date)) {
          weekToBlockIDsArr.push(key);
          lockingDatesArr.push(date);
        }
      }

      console.log('lockingDatesArr: ', lockingDatesArr);
      console.log('weekToBlockIDs: ', weekToBlockIDsArr);

      return { lockingDatesArr, weekToBlockIDs: weekToBlockIDsArr };
    };
    modal.show();
  
    if (
      modal &&
      //@ts-ignore
      modal._element.id === 'LockEmplModal' &&
      //@ts-ignore
      modal._isShown &&
      hasUnsubmittedEvents
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
    const lockActionBtn = document.querySelector('.lock-action');
    const unlockActionBtn = document.querySelector('.unlock-action');
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

    const selectedDatesArr = getSelectedDates(dailyBlockContainer);
    console.log('selectedDatesArr: ', selectedDatesArr);

    const { lockingDatesArr, weekToBlockIDs } = getKeysForSelectedDates(
      selectedDatesArr,
      parentIdDataArr,
    );


      await lockingActionApi(weekToBlockIDs, isLocked);
      
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
