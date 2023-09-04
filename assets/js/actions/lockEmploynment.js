import * as C from '../config';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from '../ui/checkBlockedDays';
import { formatDate } from '../utils/mainGlobFunctions';
import { Modal } from 'bootstrap';

export function convertToISODate(dateString) {
  const parts = dateString.split('.');
  const day = parts[0].padStart(2, '0'); // Добавляем ведущий ноль, если день однозначный
  const month = parts[1].padStart(2, '0'); // Добавляем ведущий ноль, если месяц однозначный
  const year = parts[2];

  return `${year}-${month}-${day}`;
}

export const lockEmploynment = (calendar) => {
  const lockBtn = document.querySelector('.lockBtn');

  const lockAction = () => {
    const isLocked = JSON.parse(localStorage.getItem('isWeekLocked'));
    // Получаем текущий вид календаря
    const currentView = calendar.view;

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector('#otherUsers');
    const selectedUser = otherUsers?.selectedOptions[0].textContent;
    const selectedUserId = otherUsers?.value;

    const lockedUserSurname = document.querySelector('.lockedUserSurname');
    const unLockedUserSurname = document.querySelector('.unLockedUserSurname');
    lockedUserSurname.textContent = selectedUser;
    unLockedUserSurname.textContent = selectedUser;

    const lockEmplmodal = document.querySelector('#LockEmplModal');
    const unlockEmplmodal = document.querySelector('#unLockEmplModal');

    let modal;

    if (isLocked) {
      modal = new Modal(unlockEmplmodal);
    } else {
      modal = new Modal(lockEmplmodal);
    }

    // Получаем все objID соответствующие датам текущей недели для блокировки

    const getKeysForWeek = (startDate, arr) => {
      const lockingDatesArr = [];
      const weekToBlockIDsArr = [];
      let weekToBlockIDs;

      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 1 неделя в миллисекундах

      const startDateTime = new Date(convertToISODate(startDate)).getTime();
      const endDateTime = startDateTime + oneWeekInMilliseconds;

      for (const obj of arr) {
        const key = Object.keys(obj)[0];
        const date = obj[key];
        const dateTime = new Date(convertToISODate(date)).getTime();

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

    // Использование функции для преобразования дат
    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);
    endDate.setDate(endDate.getDate() - 1);

    const startLockDate = document.querySelector('.startLockDate');
    const startUnlockDate = document.querySelector('.startUnlockDate');
    const endLockDate = document.querySelector('.endLockDate');
    const endUnlockDate = document.querySelector('.endUnlockDate');
    const lockActionBtn = document.querySelector('.lock-action');
    const unlockActionBtn = document.querySelector('.unlock-action');
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const parentIdDataArr = JSON.parse(localStorage.getItem('parentIdDataArr'));

    startLockDate.innerText = startUnlockDate.innerText = formattedStartDate;
    endLockDate.innerText = endUnlockDate.innerText = formattedEndDate;

    const { lockingDatesArr, weekToBlockIDs } = getKeysForWeek(
      formattedStartDate,
      parentIdDataArr,
    );

    // Подтверждение блокировки/разблокировки

    const lockingAction = () => {
      lockActionBtn.removeEventListener('click', lockingAction);
      unlockActionBtn.removeEventListener('click', lockingAction);
      weekToBlockIDs.forEach((ObjID) => {
        const managerName = localStorage.getItem('managerName');

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

      let currentLockedDatesArr = JSON.parse(
        localStorage.getItem('lockedDatesArray'),
      );
      //   const lockingDatesArrUn = [...new Set(lockingDatesArr)];
      const lockingDatesArrUn = lockingDatesArr;
      let mergedLockedDatesArr;

      if (!isLocked) {
        mergedLockedDatesArr = [...currentLockedDatesArr, ...lockingDatesArrUn];
      } else {
        mergedLockedDatesArr = currentLockedDatesArr.filter(
          (date) => !lockingDatesArrUn.includes(date),
        );
      }

      // Записываем новые данные о датах блокировки в массив и localstorage
      localStorage.setItem(
        'lockedDatesArray',
        JSON.stringify(mergedLockedDatesArr),
      );

      if (!isLocked) {
        lockActionBtn.textContent = 'Заблокировано';
        toggleIcon('unlock');
        addBlockOverlays();
        localStorage.setItem('isWeekLocked', true);
      } else {
        unlockActionBtn.textContent = 'Разблокировано';
        toggleIcon('lock');
        removeOverlays();
        localStorage.setItem('isWeekLocked', false);
      }

      setTimeout(() => {
        modal.hide();
        lockActionBtn.textContent = 'Да';
        unlockActionBtn.textContent = 'Да';
      }, 800);
    };

    lockActionBtn?.addEventListener('click', lockingAction);
    unlockActionBtn?.addEventListener('click', lockingAction);
  };

  lockBtn?.addEventListener('click', lockAction);
};
