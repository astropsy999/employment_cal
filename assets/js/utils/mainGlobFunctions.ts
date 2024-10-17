import {
  srvv,
  addValueObjTrue,
  InterfaceID,
  ninthCol,
  thirteenthCol,
  fourteenthCol,
  dataGroupID,
  dataInterfaceID,
} from '../config';

import { getSelectedUserData } from '../api/getSlectedUserData';
import { parseResievedDataToCal } from '../ui/parseResievedDataToCal';
import { tempLoader } from '../ui/tempLoader';
import { isInvalidElem, isValidElem } from './toggleElem';
import { buttonLoader } from '../ui/buttonLoader';

//  Функция форматирования даты из объекта даты в привычный вид дд.мм.гггг
export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${day}.${month}.${year}`;
}

export function formatDayNameDate(date) {
  // Получаем сокращенное название дня недели на русском
  const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });

  // Получаем номер дня месяца с ведущим нулем
  const day = String(date.getDate()).padStart(2, '0');

  return `${dayName} ${day}`;
}

// Функция перевода времени на 3 часа назад

export const minusThreeHours = (date) => {
  const d = new Date(date);
  const newD = new Date(d.setHours(d.getHours() - 3));

  return newD;
};

// Добавляем 0 перед числом день, месяц, время

export const addZeroBefore = (datePart) => {
  const datePartStr = datePart.toString();

  if (datePartStr.length == 1) {
    return `0${datePartStr}`;
  } else return datePartStr;
};

// Изменяем формат даты-времени c объекта Data на подходящий для базы данных => dd.mm.yyyy hh:mm

export const transformDateTime = (clickedDateAndTime) => {
  // Достаем нужные параметры из ячейки на которую кликнули

  const day = addZeroBefore(clickedDateAndTime.getDate());
  const month = addZeroBefore(clickedDateAndTime.getMonth() + 1);
  const year = addZeroBefore(clickedDateAndTime.getFullYear());
  const hours = addZeroBefore(clickedDateAndTime.getHours());
  const mins = addZeroBefore(clickedDateAndTime.getMinutes());

  return `${day}.${month}.${year} ${hours}:${mins}`;
};

// Функция, которая меняет даты и время начала и окончания события

export const changeEventStartEndDateTime = (id, start, end, iddb) => {
  const formDataEventStartEndDateTime = new FormData();

  formDataEventStartEndDateTime.append('ID', id);
  formDataEventStartEndDateTime.append('TypeID', '1094');
  formDataEventStartEndDateTime.append('Data[0][name]', thirteenthCol);
  formDataEventStartEndDateTime.append('Data[0][value]', start);
  formDataEventStartEndDateTime.append('Data[0][isName]', 'false');
  formDataEventStartEndDateTime.append('Data[0][maninp]', 'false');
  formDataEventStartEndDateTime.append('Data[1][GroupID]', dataGroupID);
  formDataEventStartEndDateTime.append('Data[1][name]', fourteenthCol);
  formDataEventStartEndDateTime.append('Data[1][value]', end);
  formDataEventStartEndDateTime.append('Data[1][isName]', 'false');
  formDataEventStartEndDateTime.append('Data[1][maninp]', 'false');
  formDataEventStartEndDateTime.append('Data[1][GroupID]', dataGroupID);
  formDataEventStartEndDateTime.append('ParentObjID', iddb);
  formDataEventStartEndDateTime.append('CalcParamID', '-1');
  formDataEventStartEndDateTime.append('InterfaceID', InterfaceID);
  formDataEventStartEndDateTime.append('ImportantInterfaceID', '');
  formDataEventStartEndDateTime.append('templ_mode', 'false');
  formDataEventStartEndDateTime.append('Ignor39', '0');

  fetch(srvv + addValueObjTrue, {
    credentials: 'include',
    method: 'post',
    body: formDataEventStartEndDateTime,
  })
    .then((response) => {
      console.log('Отправлено-сохранено');
      return response.json();
    })
    .catch(function (error) {
      console.log('Ошибка отправки данных', error);
    });
};

// Функция, которая отправляет вместо значения "Не выбрано" - пустую строку

export const notChoosenCleaning = (value) => {
  if (value === 'Не выбрано' || value === undefined) {
    return '';
  } else return value;
};

// Определяем открыто или закрыто окно массового добавления события

export const isAddEventModalOpen = (eventModalID) => {
  const openedModal = document.querySelector(`#${eventModalID}`);
  if (openedModal.classList.contains('show')) {
    return true;
  } else return false;
};

// Функция изменения времени начала, окончания и общего времени события в базе

export const sendNewEndDateTimeToBase = (
  changeId,
  newFacttime,
  newStartDatetime,
  newEndDatetime,
  iddb,
) => {
  let newEndDateTimeFormData = new FormData();

  newEndDateTimeFormData.append('ID', changeId);
  newEndDateTimeFormData.append('TypeID', '1094');
  newEndDateTimeFormData.append('Data[0][name]', ninthCol);
  newEndDateTimeFormData.append('Data[0][value]', newFacttime);
  newEndDateTimeFormData.append('Data[0][isName]', 'false');
  newEndDateTimeFormData.append('Data[0][maninp]', 'false');
  newEndDateTimeFormData.append('Data[0][GroupID]', dataGroupID);
  newEndDateTimeFormData.append('Data[1][name]', thirteenthCol);
  newEndDateTimeFormData.append(
    'Data[1][value]',
    transformDateTime(minusThreeHours(newStartDatetime)),
  );
  newEndDateTimeFormData.append('Data[1][isName]', 'false');
  newEndDateTimeFormData.append('Data[1][maninp]', 'false');
  newEndDateTimeFormData.append('Data[1][GroupID]', dataGroupID);
  newEndDateTimeFormData.append('Data[2][name]', fourteenthCol);
  newEndDateTimeFormData.append(
    'Data[2][value]',
    transformDateTime(minusThreeHours(newEndDatetime)),
  );
  newEndDateTimeFormData.append('Data[2][isName]', 'false');
  newEndDateTimeFormData.append('Data[2][maninp]', 'false');
  newEndDateTimeFormData.append('Data[2][GroupID]', dataGroupID);
  newEndDateTimeFormData.append('ParentObjID', iddb);
  newEndDateTimeFormData.append('CalcParamID', '-1');
  newEndDateTimeFormData.append('InterfaceID', dataInterfaceID);
  newEndDateTimeFormData.append('ImportantInterfaceID', '');
  newEndDateTimeFormData.append('templ_mode', 'false');
  newEndDateTimeFormData.append('Ignor39', '0');

  fetch(srvv + addValueObjTrue, {
    credentials: 'include',
    method: 'post',
    body: newEndDateTimeFormData,
  })
    .then((response) => {
      console.log('Отправлено-сохранено');
      return response.json();
    })
    .catch(function (error) {
      console.log('Ошибка отправки данных', error);
    });
};

// Функция отметки обязательности заполнения поля для валидации

export const selValidation = (elem) => {
  // Находим название элемента
  const selLabel = elem?.previousElementSibling;
  selLabel?.classList.add('val-selector');
};

// Функция снятия отметки обязательности заполнения поля для валидации

export const selRemoveValidation = (elem) => {
  // Находим название элемента
  const selLabel = elem?.previousElementSibling;
  selLabel.classList.remove('val-selector');
};

// Функция добавления текста на кнопках для десктопной версии

export const changeTextToIconForMobile = () => {
  const getAllBtns = document.querySelectorAll('.mobile-hide-text');
  getAllBtns.forEach((btnText) => {
    btnText.style.display = 'inline';
  });
};

// Преобразование дд.мм.гггг чч:мм в гггг-мм-дд чч:мм:сс

export const convertDateTime = (olddatetime: string): string => {
  const nessDate = olddatetime.slice(0, 10);
  const nessTime = olddatetime.slice(11, 16);

  const splitDate = nessDate.split('.');
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]} ${nessTime}:00`;
};

// Функция проверки правильности ввода данных при добавлении\редактирования события и запрета выхода за пределы суток
let isOutOfRange;
export const checkAndForbiddenOutOfDay = (startElem, endElem, timeElem) => {
  const convStrt = convertDateTime(startElem.value);
  const convEnd = convertDateTime(endElem.value);
  const startDay = new Date(convStrt).getDate();
  const endDay = new Date(convEnd).getDate();
  if (startDay !== endDay) {
    isOutOfRange = true;
  } else {
    isOutOfRange = false;
  }

  if (+timeElem.value < 0) {
    endElem.classList.add('is-invalid');
    endElem.style.color = 'red';
    timeElem.classList.add('is-invalid');
    timeElem.style.color = 'red';
  } else {
    endElem.classList.remove('is-invalid');
    endElem.style.color = 'black';
    timeElem.classList.remove('is-invalid');
    timeElem.style.color = 'black';
  }
};

// Валидация временных инпутов

export const timeInputsValidation = (endTimeEl, TimeEl) => {
  if (isOutOfRange) {
    endTimeEl.classList.add('is-invalid');
    endTimeEl.style.color = 'red';
    TimeEl.classList.add('is-invalid');
    TimeEl.style.color = 'red';
  } else if (!isOutOfRange) {
    endTimeEl.classList.remove('is-invalid');
    endTimeEl.style.color = 'black';
    TimeEl.classList.remove('is-invalid');
    TimeEl.style.color = 'black';
  }
};

// Заменяем ровные 0000 на 2359

export const changeDirectZero = (elemEnd, elemTime) => {
  // const date = elemEnd.value.slice(0, 10)
  const changeTime = elemEnd.value.slice(11, 16);

  if (changeTime === '00:00') {
    elemEnd.classList.remove('is-invalid');
    elemEnd.style.color = 'black';
    elemTime.classList.remove('is-invalid');
    elemTime.style.color = 'black';
    const day = +elemEnd.value.slice(0, 2) - 1;
    let correctDateTime = elemEnd.value.replace(
      elemEnd.value.slice(0, 2),
      addZeroBefore(day),
    );
    let newCorrectDateTime = correctDateTime.replace('00:00', '23:59');
    elemEnd.value = newCorrectDateTime;
  }
};

// Добавление\удаление предупреждений с селекторов при изменении значений

export const removeAlarmFromSelectorsInModals = () => {
  const getAllModals = [...document.querySelectorAll('.modal form')];

  getAllModals.forEach((modal) => {
    const getAllSelectors = [...modal.querySelectorAll('select')];
    getAllSelectors.forEach((selector) => {
      selector.addEventListener('change', () => {
        if (
          selector.classList.contains('is-invalid') &&
          selector.value !== 'Не выбрано'
        ) {
          selector.classList.remove('is-invalid');
        }
      });
    });
  });
};

export const cleanAndDefaultKindOfSubTaskSelector = (subtaskEl) => {
  if (subtaskEl) {
    subtaskEl.options.length = 0;
    const subTaskOption = document.createElement('option');
    subTaskOption.setAttribute('value', `Не выбрано`);
    subTaskOption.innerText = `Не выбрано`;
    subtaskEl.append(subTaskOption);
    subtaskEl.value = 'Не выбрано';
  }
};

// Разница между датами начала и окончания

export const rangeHoursBetweenDates = () => {
  const start = eventStartDate.value;
  const end = eventEndDate.value;

  const convStrt = convertDateTime(start);
  const convEnd = convertDateTime(end);

  const parsedStart = new Date(convStrt);
  const parsedEnd = new Date(convEnd);

  const diffDates = parsedEnd - parsedStart;
  const diffHours = diffDates / (1000 * 60 * 60);

  eventSpentTime.value = diffHours;

  checkAndForbiddenOutOfDay(eventStartDate, eventEndDate, eventSpentTime);
  timeInputsValidation(eventEndDate, eventSpentTime);
};

// Если Отпуск или Больничный => Затраченное время равно 0 + блокировка возможности изменения поля

export const checkEmploymentStatus = (etarget) => {
  const modalContentForm = etarget.querySelector('.modal-content form');
  const eventName = etarget.querySelector('.eventName');

  const openedModalValues = [...etarget.querySelectorAll('.modalValue')];

  const modalSelectorsArray = modalContentForm && [
    ...modalContentForm.querySelectorAll('select'),
  ];

  const checkEmploymentTimeAndValidation = () => {
    const employment = etarget.querySelector('.employment select');
    const spentTime = etarget.querySelector('.spentTime input');
    const location = etarget.querySelector('.location');
    const typeoftasks = etarget.querySelector('.typeoftasks');

    const modValuesArr = [];

    openedModalValues.forEach((modvalue) => {
      modValuesArr.push(modvalue.value);
    });

    function isWorked(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '' && arr[i] !== 'Не выбрано') {
          localStorage.setItem('isWorked', '1');
          return true;
        }
      }
      localStorage.setItem('isWorked', '0');
      return false;
    }

    const worked = isWorked(modValuesArr);

    /**
     * Функция проверяет наличие сохраненных значений в полях формы
     */

    const checkSavedValues = () => {
      if (
        employment.value === 'Отпуск' ||
        employment.value === 'Больничный' ||
        employment.value === 'Выходной'
      ) {
        openedModalValues.forEach((elem) => {
          const elemType = elem.tagName.toLowerCase();
          switch (elemType) {
            case 'select':
              elem.value = 'Не выбрано';
              break;
            case 'textarea':
              elem.value = '';
              break;
            case 'input':
              elem.value = '';
              break;
          }
        });
      }
    };

    employment?.removeEventListener('change', checkSavedValues);
    employment?.addEventListener('change', checkSavedValues);

    if (
      (employment?.value === 'Отпуск' ||
        employment?.value === 'Больничный' ||
        employment?.value === 'Выходной') &&
      !worked
    ) {
      eventName.value = employment.value;
      selRemoveValidation(location);
      selRemoveValidation(typeoftasks);
      eventName.setAttribute('disabled', 'disabled');
      spentTime ? (spentTime.value = 0) : null;
      spentTime ? spentTime.setAttribute('disabled', 'disabled') : null;
    } else {
      localStorage.setItem('isWorked', '1');
      //   eventName.value = "";
      eventName?.removeAttribute('disabled');
      spentTime ? spentTime.removeAttribute('disabled') : null;
      selValidation(location);
      selValidation(typeoftasks);
      rangeHoursBetweenDates();
    }

    if (location?.value === 'В дороге') {
      selRemoveValidation(typeoftasks);
    }
  };
  localStorage.removeItem('isWorked');
  etarget.removeEventListener('change', checkEmploymentTimeAndValidation);
  etarget.addEventListener('change', checkEmploymentTimeAndValidation);
};

// Функция получения parentID по дате

export const getParentIDfromDate = (date) => {
  const eventD = transformDateTime(date).slice(0, 10);
  const nessDParentID = JSON.parse(
    localStorage.getItem('parentIdDataArr'),
  ).find((el) => Object.values(el)[0] === eventD);
  const massparID = Object.keys(nessDParentID)[0];

  return massparID;
};

/**
 * Функция запрещает редактирование определенного количества символов инпута начиная с 1го
 * @param {string} inputID - ID редактируемого инпута
 * @param {number} noEditSymbols - количество символов начиная от начала, которые запрещено редактировать
 */
export const noEditPartOfInput = (inputID, noEditSymbols) => {
  let noEditPart = document.querySelector(`#${inputID}`);

  const handleNoEditSelection = (e) => {
    if (noEditPart.selectionStart < noEditSymbols) {
      e.preventDefault();
      noEditPart.setSelectionRange(noEditSymbols, noEditSymbols);
    }
  };

  const mousedownHandler = (e) => {
    handleNoEditSelection(e);
  };

  const mouseupHandler = (e) => {
    handleNoEditSelection(e);
  };

  const clickHandler = (e) => {
    handleNoEditSelection(e);
  };

  const keydownHandler = (e) => {
    if (
      noEditPart.selectionStart < noEditSymbols &&
      (e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'Backspace' ||
        e.key === 'Delete')
    ) {
      handleNoEditSelection(e);
    }
  };

  // Удаляем старые обработчики событий
  noEditPart.removeEventListener('mousedown', mousedownHandler);
  noEditPart.removeEventListener('mouseup', mouseupHandler);
  noEditPart.removeEventListener('click', clickHandler);
  noEditPart.removeEventListener('keydown', keydownHandler);

  // Добавляем новые обработчики событий
  noEditPart.addEventListener('mousedown', mousedownHandler);
  noEditPart.addEventListener('mouseup', mouseupHandler);
  noEditPart.addEventListener('click', clickHandler);
  noEditPart.addEventListener('keydown', keydownHandler);
};

/**
 * Функция находит начало и конец текущего месяца и возвращает их в нужном формате для подстановки в запрос для получения данных
 * Может принимать параметр - дату, или по-умолчанию отрабатывает для текущей даты
 */
export function getMonthRange(date) {
  if (!date) {
    date = new Date(); // Если дата не передана, используем текущую дату
  }

  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${formattedMonth}.${year}`;
  };

  return {
    start: formatDate(startOfMonth),
    end: formatDate(endOfMonth),
  };
}

// export function getMonthRange(date, interval = 'current') {
//   if (!date) {
//     date = new Date(); // Если дата не передана, используем текущую дату
//   }

//   const year = date.getFullYear();
//   const month = date.getMonth();

//   let startDate, endDate;

//   if (interval === 'previous') {
//     startDate = new Date(year, month - 1, 1);
//     endDate = new Date(year, month, 0);
//   } else if (interval === 'next') {
//     startDate = new Date(year, month, 1);
//     endDate = new Date(year, month + 1, 0);
//   } else if (interval === '3months') {
//     startDate = new Date(year, month - 1, 1);
//     endDate = new Date(year, month + 2, 0);
//   } else {
//     // По умолчанию, интервал текущего месяца
//     startDate = new Date(year, month, 1);
//     endDate = new Date(year, month + 1, 0);
//   }

//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, '0');
//     const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}.${formattedMonth}.${year}`;
//   };

//   return {
//     start: formatDate(startDate),
//     end: formatDate(endDate),
//   };
// }

/**
 * Блокировка/ разблокировка кнопок Согласование и Блокировка и замена тайтла на соответствующий необходимому действию
 */

export const blockBtnAddTitle = (...btns) => {
  if (btns.length !== 0) {
    btns.forEach((btn) => {
      if (btn) {
        btn.setAttribute('disabled', 'disabled');
        btn.removeAttribute('title');

        if (btn === lockBtn) {
          btn.setAttribute('title', 'Блокирование недоступно');
        } else if (btn === approveBtn) {
          btn.setAttribute('title', 'Согласование недоступно');
        }
      }
    });
  }
};

export const unblockBtnAddTitle = (...btns) => {
console.log("🚀 ~ unblockBtnAddTitle ~ unblockBtnAddTitle:")

  if (btns.length !== 0) {
    btns.forEach((btn) => {
      if (btn) {
        btn?.removeAttribute('disabled');
        btn?.removeAttribute('title');

        if (btn === lockBtn) {
          btn?.setAttribute('title', 'Заблокировать неделю');
        } else if (btn === approveBtn) {
          btn?.setAttribute('title', 'Согласовать занятость');
        }
      }
    });
  }
};

/**
 * Функция преобразует массив методов в массив объектов, где каждый объект содержит информацию о методе и его параметрах.
 * @param {Array} methodsArr - Массив методов, которые нужно преобразовать.
 * @returns {Array} Возвращает массив объектов, где каждый объект содержит информацию о методе и его параметрах.
 */
export const transformToMethods = (methodsArr, editID) => {
  const eventMeths = [];
  methodsArr?.forEach((meth, i) => {
    const { method, params } = meth;

    const { duration, objects, zones } = params;

    eventMeths.push({
      [method]: {
        duration,
        objQuant: objects,
        zones,
        editID: editID + (i + 1),
      },
    });
  });

  return eventMeths;
};

// Расчет общего времени за день
export function calculateTotalHours(date, calendar) {
  let totalHours = 0;
  let currentDate = null;

  let updatedEvents = calendar
    ?.getEvents()
    ?.map((event) => event.toPlainObject());

  updatedEvents?.forEach((event) => {
    const eventDate = new Date(event.start);
    const factTime = Number(event.extendedProps.factTime);

    // Если currentDate еще не установлена, устанавливаем и начинаем счет для выбранной даты
    if (!currentDate) {
      currentDate = new Date(eventDate);
    }

    // Если дата события совпадает с currentDate, добавляем factTime к totalHours
    if (
      date.getDate() === eventDate.getDate() &&
      date.getMonth() === eventDate.getMonth() &&
      date.getFullYear() === eventDate.getFullYear()
    ) {
      totalHours += factTime;
    } else {
      // Если дата события больше не совпадает, вернем totalHours и начнем новый счет
      currentDate = new Date(eventDate);
    }
  });
  return totalHours;
}

// Обновление данных календаря без полной перезагрузки

export const refreshBtnAction = async (calendar) => {
  if (calendar?.view.type === 'dayGridMonth') {
    clearMonthCells();
  }
  tempLoader(true);
  const newUserData = await getSelectedUserData(localStorage.getItem('iddb'));

  let { events, parentIdDataArr, lockedDatesArray } =
    parseResievedDataToCal(newUserData);

  localStorage.setItem('parentIdDataArr', JSON.stringify(parentIdDataArr));
  localStorage.setItem('lockedDatesArray', JSON.stringify(lockedDatesArray));

  sessionStorage.setItem('events', JSON.stringify(events));

  tempLoader(false);
  calendar?.removeAllEvents();
  calendar?.addEventSource(events);
  calendar?.render();
  if (calendar?.view.type === 'dayGridMonth') {
    addTotalTimeToMonthCells(calendar);
  }
};

// Функция для очистки ячеек в режиме Месяца
export function clearMonthCells() {
  const monthView = document.querySelector('.fc-dayGridMonth-view');
  const getAllCells = monthView.querySelectorAll('td[role="gridcell"]');

  getAllCells.forEach((cell) => {
    const hoursElement = cell.querySelector('.hours');
    if (hoursElement) {
      hoursElement.remove();
    }
  });
}

// Добавление общего времени в ячейки в режиме месяца

export const addTotalTimeToMonthCells = (calendar) => {
  setTimeout(function () {
    const monthView = document.querySelector('.fc-dayGridMonth-view');
    const getAllCells = monthView.querySelectorAll('td[role="gridcell"]');

    getAllCells.forEach((cell) => {
      const cellDate = cell.getAttribute('data-date');
      const totalHours = calculateTotalHours(new Date(cellDate), calendar);
      const hoursElement = document.createElement('div');
      hoursElement.classList.add('hours');

      hoursElement.innerHTML = '';
      if (Number.isInteger(totalHours)) {
        hoursElement.textContent = `${totalHours}ч`;
      } else {
        hoursElement.textContent = `${totalHours.toFixed(1)}ч`;
        hoursElement.style.fontSize = '10px';
      }
      if (totalHours < 8) {
        hoursElement.style.backgroundColor = `var(--falcon-red)`;
      }
      const topWrapper = cell.querySelector('.fc-daygrid-day-top');
      if (totalHours > 0) {
        topWrapper.append(hoursElement);
      }
    });
  }, 0);
};

// Назначение селектора в зависимости от режима отображения

const spentTimeMode = (mode) => {
  let eventSpentTime;
  switch (mode) {
    case 'single':
      eventSpentTime = document.querySelector('#eventSpentTime');
      break;
    case 'month':
      eventSpentTime = document.querySelector('#eventSpentTimeMassMonth');
      break;
  }

  return eventSpentTime;
};

// Валидация общего времени за день vs общего времени затраченного на методы

export const validateTotalTimeOnObject = (mode) => {
  let eventSpentTime;

  if (mode) {
    eventSpentTime = spentTimeMode(mode);
  } else {
    eventSpentTime = document.querySelector('#eventEditSpentTime');
  }

  const eventSpentTimeVal = Number(eventSpentTime.value);
  const wooTimeArr = [...document.querySelectorAll('.wootime')];
  const wooTimeinput = document.querySelector('#wooTime');
  const startValue = Number(wooTimeinput?.value) || 0;

  const wooTimeTotal = wooTimeArr.reduce((acc, arr) => {
    return acc + Number(arr.innerText);
  }, startValue);

  if (wooTimeTotal > eventSpentTimeVal) {
    eventSpentTime.classList.add('is-invalid');
    eventSpentTime.style.color = 'red';
    return false;
  }

  return true;
};

// Подсветка ячеек при неудачной валидации времени методов

export function handleWooTime(mode) {
  const cell = document.querySelector('.timeHeaderMeth');
  const wooTimeArr = [...document.querySelectorAll('.wootime')];
  const wooTimeinput = document.querySelector('#wooTime');
  const startValue = Number(wooTimeinput?.value) || 0;
  const addEventBtn = document.querySelector('#addTaskToCalBtn');

  wooTimeinput.addEventListener('change', () => {
    // wooTimeinput.classList.remove('is-invalid');
    // wooTimeinput.style.color = '';
    isValidElem(wooTimeinput);
  });

  const wooTimeTotal = wooTimeArr.reduce((acc, arr) => {
    return acc + Number(arr.innerText);
  }, startValue);

  const eventSpentTime = spentTimeMode(mode);

  eventSpentTime.addEventListener('change', () => {
    // eventSpentTime.classList.remove('is-invalid');
    // eventSpentTime.style.color = '';
    isValidElem(eventSpentTime);
  });

  if (cell) {
    cell.innerText = `!Время, ${wooTimeTotal}ч!`;
    cell.style.color = 'red';
    cell.style.border = '2px solid red';

    isInvalidElem(wooTimeinput);
    isInvalidElem(wooTimeinput);

    buttonLoader(addEventBtn);

    // eventSpentTime.classList.add('is-invalid');
    // eventSpentTime.style.color = 'red';
    // wooTimeinput.classList.add('is-invalid');
    // wooTimeinput.style.color = 'red';
  } else {
    isInvalidElem(wooTimeinput);
    isInvalidElem(eventSpentTime);
    buttonLoader(addEventBtn);
    // wooTimeinput.classList.add('is-invalid');
    // wooTimeinput.style.color = 'red';
    // eventSpentTime.classList.add('is-invalid');
    // eventSpentTime.style.color = 'red';
  }

  function updateWooTime(mode) {
    const cell = document.querySelector('.timeHeaderMeth');
    const wooTimeArr = [...document.querySelectorAll('.wootime')];
    const wooTimeTotal = wooTimeArr.reduce((acc, arr) => {
      return acc + Number(arr.innerText);
    }, startValue);
    const eventSpentTime = spentTimeMode(mode);
    cell.innerText = `Время, ${wooTimeTotal}ч`;
    if (wooTimeTotal <= Number(eventSpentTime.value)) {
      // eventSpentTime.classList.remove('is-invalid');
      // eventSpentTime.style.color = '';
      isValidElem(eventSpentTime);
      cell.style.color = '';
      cell.style.border = '';
    }
  }

  const methodsTbody = document.querySelector('.methods-tbody');
  const observer = new MutationObserver(function (mutations) {
    updateWooTime(mode);
  });

  const config = { childList: true };

  observer.observe(methodsTbody, config);

  return;
}

/**
 * Проверяет общую сумму часов методов, сравнивается с затраченным временем за день и возвращает true если перебор
 */

export const wooTimeIsOver = () => {
  const eventSpentTime = document.querySelector('#eventSpentTime');
  const eventEditSpentTime = document.querySelector('#eventEditSpentTime');
  // Находим сумму часов методов
  const wooTimes = document.querySelectorAll('.wootime');
  const wooTime = document.querySelector('#wooTime');
  let totalWooTime = 0;

  wooTimes.forEach((time) => {
    totalWooTime += +time.innerHTML;
  });

  // Находим общее время завтраченное за день
  let dayTime = +eventEditSpentTime.value || +eventSpentTime.value;

  // Время добавляемого/редактируемого метода
  let addingTime = +wooTime.value;

  // Сравниваем
  if (dayTime !== 0 && totalWooTime + addingTime > dayTime) {
    return true;
  }

  return false;
};

export { isOutOfRange };
