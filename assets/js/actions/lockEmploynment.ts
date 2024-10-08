import * as C from '../config';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from '../ui/checkBlockedDays';
import { fullCalendar } from '../utils/fullcalendar';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtils';
import { convertToISODate, formatDate } from '../utils/mainGlobFunctions';
import { Modal, Popover, Tooltip } from 'bootstrap';

interface ICalendar { 
  view: { 
    currentStart: string | number | Date; 
    currentEnd: string | number | Date; 
    }; 
    getEvents: () => any; 
  }

export const lockEmploynment = (calendar: ICalendar ) => {
  const lockBtn = document.querySelector('.lockBtn');

  const lockAction = () => {
    const isLocked = getLocalStorageItem('isWeekLocked') ?? 'false';
    // Получаем текущий вид календаря
    // const currentView = calendar.view;

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector('#otherUsers') as HTMLSelectElement;
    const selectedUser = otherUsersSelector?.selectedOptions[0].textContent;
    const selectedUserId = otherUsersSelector?.value;

    let hasUnsubmittedEvents = false;

    const lockedUserSurname = document.querySelector('.lockedUserSurname');
    const unLockedUserSurname = document.querySelector('.unLockedUserSurname');
    lockedUserSurname!.textContent = selectedUser;
    unLockedUserSurname!.textContent = selectedUser;

    const lockEmplmodal = document.querySelector('#LockEmplModal');
    const unlockEmplmodal = document.querySelector('#unLockEmplModal');

    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    const currentEvents = calendar.getEvents();

    const eventsInCurrentWeek = currentEvents.filter((event: { start: any; }) => {
      const eventStart = event.start;
      return eventStart >= startDate && eventStart <= endDate;
    });

    console.log('eventsInCurrentWeek: ', eventsInCurrentWeek);

    if (eventsInCurrentWeek.length > 0) {
      eventsInCurrentWeek.forEach((ev: { _def: { extendedProps: { isApproved: any; }; }; }) => {
        const isApproved = ev._def.extendedProps.isApproved;
        if (isApproved === '') {
          hasUnsubmittedEvents = true;
          return;
        }
      });
    }

    const lastEvent = eventsInCurrentWeek.reduce(
      (latestEvent: { start: any; }, currentEvent: { start: any; }) => {
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

    eventsInCurrentWeek.sort((a: { start: number; }, b: { start: number; }) => a.start - b.start);

    const approveAndLockAction = () => {
      const yesOnPopover = document.querySelector('.yesOnPopover');
      eventsInCurrentWeek.forEach((e: { _def: { extendedProps: { delID: any; }; defId: any; }; }) => {
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
        formDataApproved.append('ParentObjID', getLocalStorageItem('iddb')!);
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
          yesOnPopover!.textContent = 'Согласовано';
          const changedCalendarEvents = calendar.getEvents();
          changedCalendarEvents.forEach((event: { _def: { defId: any; }; setExtendedProp: (arg0: string, arg1: string) => void; dropable: boolean; }) => {
            if (event._def.defId === e._def.defId) {
              event.setExtendedProp('isApproved', managerName);
              event.dropable = false;
              // fullCalendar.fullCalendarInit();
            }
          });

          lockingAction();
        });
      });
    };

    let modal: Modal;

    if (isLocked) {
      modal = new Modal(unlockEmplmodal!);
    } else {
      modal = new Modal(lockEmplmodal!);
    }

    // Получаем все objID соответствующие датам текущей недели для блокировки

    const getKeysForWeek = (startDate: string, arr: string[]) => {
      const lockingDatesArr = [];
      const weekToBlockIDsArr = [];
      let weekToBlockIDs;

      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 1 неделя в миллисекундах

      const startDateTime = new Date(convertToISODate(startDate)).getTime();
      const endDateTime = startDateTime + oneWeekInMilliseconds;

      for (const obj of arr) {
        const key = Object.keys(obj)[0] as keyof typeof obj;
        const date = obj[key];
        const dateTime = new Date(convertToISODate(date as string)).getTime();

        if (dateTime >= startDateTime && dateTime < endDateTime) {
          weekToBlockIDsArr.push(key);
          lockingDatesArr.push(date);
        }
      }
      //   weekToBlockIDs = [...new Set(weekToBlockIDsArr)];
      weekToBlockIDs = weekToBlockIDsArr;

      return { lockingDatesArr, weekToBlockIDs };
    };
    modal.show();
    if (
      modal &&
      // @ts-ignore
      modal._element.id === 'LockEmplModal' &&
      // @ts-ignore
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

        cancelButton!.addEventListener('click', function () {
          modal.hide();
          popover.disable();
        });

        noOnPopover!.addEventListener('click', lockingAction);
        yesOnPopover!.addEventListener('click', approveAndLockAction);
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
    const parentIdDataArr = JSON.parse(localStorage.getItem('parentIdDataArr')!);

    startLockDate.innerText = startUnlockDate!.innerText = formattedStartDate;
    endLockDate.innerText = endUnlockDate.innerText = formattedEndDate;

    const { lockingDatesArr, weekToBlockIDs } = getKeysForWeek(
      formattedStartDate,
      parentIdDataArr,
    );

    // Подтверждение блокировки/разблокировки

    function lockingAction() {
      lockActionBtn!.removeEventListener('click', lockingAction);
      unlockActionBtn!.removeEventListener('click', lockingAction);
      weekToBlockIDs.forEach((ObjID) => {
        const managerName = getLocalStorageItem('managerName');

        let formDataLocked = new FormData();

        const requestBody = JSON.stringify({
          Value: !isLocked ? managerName : '',
          UserTabID: null,
          UnitID: '',
          UnitName: '',
          isOnlyYear: false,
          OrigValue: '',
          ParamID: 9249,
          ObjID,
          InterfaceID: 1792,
          GroupID: 2720,
          ObjTypeID: 1040,
          ParrentObjHighTab: -1,
          ParamID_TH: null,
          Name_TH: 'Блокировка для календаря',
          Array: 0,
        });

        formDataLocked.append('data', requestBody);

        fetch(C.srvv + C.cacheAddTable, {
          credentials: 'include',
          method: 'post',
          body: formDataLocked,
        }).then((response) => {
          if (response) {
            const formDataSaveCache = new FormData();

            formDataSaveCache.append('InterfaceID', '1792');
            formDataSaveCache.append('ParrentObjHighTab', '-1');
            formDataSaveCache.append('RapidCalc', '0');
            formDataSaveCache.append('Ignore39', '0');

            fetch(C.srvv + C.cacheSaveTable, {
              credentials: 'include',
              method: 'post',
              body: formDataSaveCache,
            }).then((response) => {});
          }
        });
      });

      let currentLockedDatesArr = getLocalStorageItem('lockedDatesArray')!
  
      //   const lockingDatesArrUn = [...new Set(lockingDatesArr)];
      const lockingDatesArrUn = lockingDatesArr;
      let mergedLockedDatesArr;

      if (!isLocked) {
        mergedLockedDatesArr = [...currentLockedDatesArr, ...lockingDatesArrUn];
      } else {
        mergedLockedDatesArr = currentLockedDatesArr.filter(
          (date: DateConstructor) => !lockingDatesArrUn.includes(date),
        );
      }

      // Записываем новые данные о датах блокировки в массив и localstorage
      setLocalStorageItem('lockedDatesArray', mergedLockedDatesArr);

      if (!isLocked) {
        lockActionBtn!.textContent = 'Заблокировано';
        toggleIcon('unlock');
        addBlockOverlays();
        setLocalStorageItem('isWeekLocked', 'true');
      } else {
        unlockActionBtn!.textContent = 'Разблокировано';
        toggleIcon('lock');
        removeOverlays();
        setLocalStorageItem('isWeekLocked', 'false');
      }

      setTimeout(() => {
        modal.hide();
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
