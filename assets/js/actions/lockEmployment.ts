import { Modal, Popover } from 'bootstrap';
import * as C from '../config';
import {
  addBlockOverlays,
  removeOverlays,
  toggleIcon,
} from '../ui/checkBlockedDays';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '../utils/localStorageUtils';
import {
  convertToISODate,
  formatDate,
  formatDayNameDate,
} from '../utils/mainGlobFunctions';
import { Calendar, EventApi } from '@fullcalendar/core';
import { generateDaysCheckboxes } from './generateDaysCheckboxes';
import { getDatesInRange } from '../utils/datesUtils';
import { approveAndLockAction } from './approveAndLockAction';

/**
 * Интерфейс для уникальных дат с возможными событиями.
 */
interface UniqueDate {
  date: Date;
  events?: EventApi[];
}

/**
 * Интерфейс для хранения уникальных дат.
 */
interface UniqueDates {
  [key: string]: UniqueDate;
}

/**
 * Функция для получения ObjID по дате.
 * Необходимо реализовать в соответствии с вашей логикой.
 * @param date - Дата, для которой нужно получить ObjID.
 * @returns ObjID или undefined, если не найден.
 */
function getObjIDByDate(date: Date): string | undefined {
  const formattedDate = formatDate(date);
  const parentIdDataArr =
    getLocalStorageItem('parentIdDataArr') || [];

  for (const obj of parentIdDataArr) {
    const key = Object.keys(obj)[0];
    const objDate = obj[key];
    if (objDate === formattedDate) {
      return key;
    }
  }
  return undefined;
}

/**
 * Получает массив выбранных дат из чекбоксов.
 * @returns Массив строковых представлений выбранных дат (формат YYYY-MM-DD).
 */
const getSelectedDates = (): string[] => {
  const checkboxes = document.querySelectorAll<HTMLInputElement>(
    '.dailyBlockContainer input[type="checkbox"]:checked',
  );
  const selectedDates: string[] = [];
  checkboxes.forEach((checkbox) => {
    selectedDates.push(checkbox.value);
  });
  return selectedDates;
};

/**
 * Получает массив ObjID для выбранных дат.
 * @param selectedDates - Массив строковых представлений выбранных дат (формат YYYY-MM-DD).
 * @returns Массив ObjID.
 */
const getSelectedObjIDs = (selectedDates: string[]): string[] => {
  const parentIdDataArr =
    getLocalStorageItem('parentIdDataArr') || [];
  const selectedObjIDs: string[] = [];

  selectedDates.forEach((dateStr) => {
    const obj = parentIdDataArr.find(
      (obj: { [key: string]: string }) => obj[Object.keys(obj)[0]] === dateStr,
    );
    if (obj) {
      const ObjID = Object.keys(obj)[0];
      selectedObjIDs.push(ObjID);
    }
  });

  return selectedObjIDs;
};

/**
 * Проверяет наличие несогласованных событий в текущей неделе.
 * @param calendar - Экземпляр календаря FullCalendar.
 * @param currentDays - Массив дат текущей недели.
 * @returns true, если есть несогласованные события, иначе false.
 */
const checkUnsubmittedEvents = async (
  calendar: Calendar,
  currentDays: Date[],
): Promise<boolean> => {
  let hasUnsubmitted = false;

  const events = calendar.getEvents();

  for (const day of currentDays) {
    const eventsForDay = events.filter((event: EventApi) => {
      const eventDate = new Date(event.start!);
      return (
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getDate() === day.getDate()
      );
    });

    for (const event of eventsForDay) {
      const isApproved = event.extendedProps.isApproved;
      if (isApproved === '') {
        hasUnsubmitted = true;
        break;
      }
    }

    if (hasUnsubmitted) break;
  }

  return hasUnsubmitted;
};

/**
 * Обновляет отображение дат блокировки в UI.
 * @param startDate - Начальная дата недели.
 * @param endDate - Конечная дата недели.
 */
const updateLockDatesUI = (startDate: Date, endDate: Date) => {
  endDate.setDate(endDate.getDate() - 1); // Корректировка конечной даты

  const startLockDate = document.querySelector('.startLockDate') as HTMLElement;
  const startUnlockDate = document.querySelector(
    '.startUnlockDate',
  ) as HTMLElement;
  const endLockDate = document.querySelector('.endLockDate') as HTMLElement;
  const endUnlockDate = document.querySelector('.endUnlockDate') as HTMLElement;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  startLockDate.innerText = startUnlockDate.innerText = formattedStartDate;
  endLockDate.innerText = endUnlockDate.innerText = formattedEndDate;
};

/**
 * Получает ObjID и даты для блокировки текущей недели.
 * @param startDate - Форматированная начальная дата.
 * @param arr - Массив объектов с ObjID и датами.
 * @returns Объект с массивами дат для блокировки и ObjID.
 */
const getKeysForWeek = (
  startDate: string,
  arr: { [key: string]: string }[],
): { lockingDatesArr: string[]; weekToBlockIDs: string[] } => {
  const lockingDatesArr: string[] = [];
  const weekToBlockIDsArr: string[] = [];

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

  return { lockingDatesArr, weekToBlockIDs: weekToBlockIDsArr };
};

/**
 * Обрабатывает блокировку/разблокировку выбранных дат.
 * @param selectedObjIDs - Массив ObjID для блокировки.
 * @param isLocked - Текущее состояние блокировки.
 * @param modal - Экземпляр модального окна.
 */
const lockingAction = async (
  selectedObjIDs: string[],
  isLocked: boolean,
  modal: Modal,
) => {
  const managerName =
    getLocalStorageItem('managerName') || 'Unknown Manager';

  try {
    for (const ObjID of selectedObjIDs) {
      const formDataLocked = new FormData();
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

      const response = await fetch(C.srvv + C.cacheAddTable, {
        credentials: 'include',
        method: 'post',
        body: formDataLocked,
      });

      if (!response.ok) {
        throw new Error(`Failed to lock ObjID: ${ObjID}`);
      }

      // Сохранение в cache
      const formDataSaveCache = new FormData();
      formDataSaveCache.append('InterfaceID', '1792');
      formDataSaveCache.append('ParrentObjHighTab', '-1');
      formDataSaveCache.append('RapidCalc', '0');
      formDataSaveCache.append('Ignore39', '0');

      const cacheResponse = await fetch(C.srvv + C.cacheSaveTable, {
        credentials: 'include',
        method: 'post',
        body: formDataSaveCache,
      });

      if (!cacheResponse.ok) {
        throw new Error(`Failed to save cache for ObjID: ${ObjID}`);
      }
    }

    // Обновление локального хранилища
    let currentLockedDatesArr =
      getLocalStorageItem('lockedDatesArray') || [];
    let mergedLockedDatesArr: string[];

    if (!isLocked) {
      mergedLockedDatesArr = [...currentLockedDatesArr, ...selectedObjIDs];
    } else {
      mergedLockedDatesArr = currentLockedDatesArr.filter(
        (date: string) => !selectedObjIDs.includes(date),
      );
    }

    setLocalStorageItem('lockedDatesArray', mergedLockedDatesArr);
    setLocalStorageItem('isWeekLocked', !isLocked);

    // Обновление UI
    if (!isLocked) {
      toggleIcon('unlock');
      addBlockOverlays();
    } else {
      toggleIcon('lock');
      removeOverlays();
    }

    // Обновление текста кнопок
    const lockActionBtn = document.querySelector(
      '.lock-action',
    ) as HTMLButtonElement;
    const unlockActionBtn = document.querySelector(
      '.unlock-action',
    ) as HTMLButtonElement;

    if (!isLocked) {
      lockActionBtn.textContent = 'Заблокировано';
      unlockActionBtn.textContent = 'Да';
    } else {
      unlockActionBtn.textContent = 'Разблокировано';
      lockActionBtn.textContent = 'Да';
    }

    // Закрытие модального окна после задержки
    setTimeout(() => {
      modal.hide();
    }, 800);
  } catch (error) {
    console.error('Ошибка при блокировке/разблокировке:', error);
    alert(
      'Произошла ошибка при блокировке/разблокировке. Пожалуйста, попробуйте снова.',
    );
  }
};



/**
 * Настраивает popover для согласования перед блокировкой.
 * @param selector - Селектор элемента, на который навешивается popover.
 * @param modal - Экземпляр модального окна.
 * @param currentDays - Массив дат текущей недели.
 * @param calendar - Экземпляр календаря FullCalendar.
 */
const setupApprovalPopover = (
  selector: string,
  modal: Modal,
  currentDays: Date[],
  calendar: Calendar,
) => {
  const popover = new Popover(selector, {
    placement: 'bottom',
    title: 'Согласовать перед блокировкой?',
    html: true,
    template: `
      <div style="max-width:fit-content;" class="popover" role="tooltip">
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
      </div>`,
    trigger: 'click',
    sanitize: false,
  });

  const element = document.querySelector(selector) as HTMLElement;

  element.addEventListener('shown.bs.popover', () => {
    const cancelButton = document.querySelector(
      '.cancelPopover',
    ) as HTMLButtonElement;
    const noOnPopover = document.querySelector(
      '.noOnPopover',
    ) as HTMLButtonElement;
    const yesOnPopover = document.querySelector(
      '.yesOnPopover',
    ) as HTMLButtonElement;

    cancelButton.addEventListener('click', () => {
      modal.hide();
      popover.dispose();
    });

    noOnPopover.addEventListener('click', async () => {
      modal.hide();
      popover.dispose();
      // Получаем выбранные даты и ObjID
      const selectedDates = getSelectedDates();
      const selectedObjIDs = getSelectedObjIDs(selectedDates);
      // Выполняем блокировку без согласования
      await lockingAction(
        selectedObjIDs,
        getLocalStorageItem('isWeekLocked') ?? false,
        modal,
      );
    });

    yesOnPopover.addEventListener('click', async () => {
      // Получаем выбранные даты и ObjID
      const selectedDates = getSelectedDates();
      const selectedObjIDs = getSelectedObjIDs(selectedDates);
      // Выполняем согласование и блокировку
      await approveAndLockAction(selectedObjIDs, calendar);
      popover.dispose();
    });
  });
};

/**
 * Обрабатывает блокировку/разблокировку выбранных дат.
 * @param calendar - Экземпляр календаря FullCalendar.
 */
export const lockEmploynment = async (calendar: Calendar) => {
  const lockBtn = document.querySelector('.lockBtn');

  const lockAction = async () => {
    const isLocked = getLocalStorageItem('isWeekLocked') ?? false;

    // Получаем фамилию выбранного пользователя
    const otherUsersSelector = document.querySelector(
      '#otherUsers',
    ) as HTMLSelectElement;
    const selectedUser =
      otherUsersSelector?.selectedOptions[0]?.textContent ||
      'Неизвестный пользователь';
    const selectedUserId = otherUsersSelector?.value || '';

    let hasUnsubmittedEvents = false;

    const lockedUserSurname = document.querySelector(
      '.lockedUserSurname',
    ) as HTMLElement;
    const unLockedUserSurname = document.querySelector(
      '.unLockedUserSurname',
    ) as HTMLElement;
    lockedUserSurname.textContent = selectedUser;
    unLockedUserSurname.textContent = selectedUser;

    const lockEmplModalEl = document.querySelector(
      '#LockEmplModal',
    ) as HTMLElement;
    const unlockEmplModalEl = document.querySelector(
      '#unLockEmplModal',
    ) as HTMLElement;
    const dailyBlockContainer = document.querySelector(
      '.dailyBlockContainer',
    ) as HTMLElement;

    const startDate = new Date(calendar.view.currentStart);
    const endDate = new Date(calendar.view.currentEnd);

    // Получаем все даты текущей недели
    const currentDays = getDatesInRange(startDate, endDate);

    // Проверка наличия несогласованных событий
    hasUnsubmittedEvents = await checkUnsubmittedEvents(calendar, currentDays);

    // Генерация списка дат с чекбоксами
    generateDaysCheckboxes(dailyBlockContainer, currentDays);

    // Определяем, какое модальное окно показать
    const modal = new Modal(isLocked ? unlockEmplModalEl : lockEmplModalEl);
    modal.show();

    // Если есть несогласованные события, показываем popover для согласования
    if (!isLocked && hasUnsubmittedEvents) {
      setupApprovalPopover('.lock-action', modal, currentDays, calendar);
    }

    // Обновление дат в UI
    updateLockDatesUI(startDate, endDate);

    // Получаем ObjID для блокировки
    const parentIdDataArr =
      getLocalStorageItem('parentIdDataArr') || [];
    const { lockingDatesArr, weekToBlockIDs } = getKeysForWeek(
      formatDate(startDate),
      parentIdDataArr,
    );

    /**
     * Функция для обработки блокировки/разблокировки.
     * @param lockingDatesArr - Массив дат для блокировки.
     * @param weekToBlockIDs - Массив ObjID для блокировки.
     * @param isLocked - Текущее состояние блокировки.
     * @param modal - Экземпляр модального окна.
     */
    const lockingActionHandler = async () => {
      // Получаем выбранные даты и ObjID
      const selectedDates = getSelectedDates();
      const selectedObjIDs = getSelectedObjIDs(selectedDates);
      // Выполняем блокировку
      await lockingAction(selectedObjIDs, isLocked, modal);
    };

    // Добавляем обработчики событий на кнопки блокировки/разблокировки
    const lockActionBtn = document.querySelector(
      '.lock-action',
    ) as HTMLButtonElement;
    const unlockActionBtn = document.querySelector(
      '.unlock-action',
    ) as HTMLButtonElement;

    if (!hasUnsubmittedEvents) {
      lockActionBtn?.addEventListener('click', lockingActionHandler);
    }
    unlockActionBtn?.addEventListener('click', lockingActionHandler);
  };

  lockBtn?.addEventListener('click', lockAction);
};
