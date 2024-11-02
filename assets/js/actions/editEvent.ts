import { Calendar, EventClickArg } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import { Modal } from 'bootstrap';
import flatpickr from 'flatpickr';
import * as GDD from '../api/getDropDownData';
import { settings } from '../api/settings';
import * as C from '../config';
import { Employment } from '../enums/employment';
import { Locations } from '../enums/locations';
import { TaskType } from '../enums/taskTypes';
import addMethodToBase from '../methods/addMethodToBase';
import { grabJustAddedArray } from '../methods/grabMethodsDataTable';
import saveEditedTasks from '../methods/saveEditedTasks';
import showMethodsTable from '../methods/showMethodsTable';
import { setViewAndDateToLS } from '../ui/setViewAndDateToLS';
import { tempLoader } from '../ui/tempLoader';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import {
  changeDirectZero,
  checkAndForbiddenOutOfDay,
  cleanAndDefaultKindOfSubTaskSelector,
  convertDateTime,
  minusThreeHours,
  notChoosenCleaning,
  selValidation,
  timeInputsValidation,
  transformDateTime,
  validateTotalTimeOnObject
} from '../utils/mainGlobFunctions';
import { isInvalidElem } from '../utils/toggleElem';
import { findParentID } from './eventsActions';
import { Russian } from "flatpickr/dist/l10n/ru.js"


/**
 * Редактирование задачи
 * @param {*} info
 * @param {*} calendar
 * @param {*} modal
 */

const api = {
  srvv: C.srvv,
  addValueObjTrue: C.addValueObjTrue,
  deleteNodeURL: C.deleteNodeURL,
  createNodeUrl: C.createNodeUrl,
  getreportFormodule: C.getreportFormodule,
  GetExcelforCalc: C.GetExcelforCalc,
};

export const editEvent = (info: EventClickArg, calendar: Calendar, modal: Modal, editedEvent: EventImpl | string) => {
  const eventEditTitle = document.querySelector('#eventEditTitle') as HTMLInputElement;
  const taskEditCreator = document.querySelector('#taskEditCreator') as HTMLInputElement;
  const taskEditObj = document.querySelector('#taskEditObj') as HTMLSelectElement;
  const longEditDesc = document.querySelector('#longEditDesc') as HTMLTextAreaElement;
  const kindOfEditTasks = document.querySelector('#kindOfEditTasks') as HTMLSelectElement;
  const kindOfSubEditTask = document.querySelector('#kindOfSubEditTask') as HTMLSelectElement;
  const eventEditStartDate = document.querySelector('#eventEditStartDate') as HTMLInputElement;
  const eventEditEndDate = document.querySelector('#eventEditEndDate') as HTMLInputElement;
  const eventEditSpentTime = document.querySelector('#eventEditSpentTime') as HTMLInputElement;
  const eventEditSource = document.querySelector('#eventEditSource') as HTMLSelectElement;
  const eventEditNotes = document.querySelector('#eventEditNotes') as HTMLTextAreaElement;
  const editSaveTaskBtn = document.querySelector('#editSaveTaskBtn') as HTMLButtonElement;
  const locEditObj = document.querySelector('#locEditObj') as HTMLSelectElement;
  const employmentEdit = document.querySelector('#employmentEdit') as HTMLSelectElement;
  const editEventBtn = document.querySelector('#editEventBtn') as HTMLButtonElement;
  const kindOfSubTask = document.querySelector('#kindOfSubTask') as HTMLSelectElement;
  let kindOfSubTaskList = [];
  const dataObj = JSON.parse(sessionStorage.getItem('dataObj')!);
  const dataCreator = JSON.parse(sessionStorage.getItem('dataCreator')!);
  const locObj = JSON.parse(sessionStorage.getItem('locObj')!);
  const emplObj = JSON.parse(sessionStorage.getItem('emplObj')!);
  const globalTasksTypes = JSON.parse(localStorage.getItem('globalTasksTypes')!);
  const methodsFromServer = info.event._def.extendedProps.methods;
  const savedTaskFromServer = info.event._def.extendedProps.taskTypeNew;
  const taskTypeNew = info.event._def.extendedProps.taskTypeNew;
  const locObject = info.event._def.extendedProps.location;
  const eventEditModal = document.querySelector('#editEventModal') as HTMLDivElement;

  selValidation(locEditObj);
  selValidation(kindOfEditTasks);

  GDD.addDataToSelector(employmentEdit, emplObj);
  GDD.addDataToSelector(taskEditObj, dataObj);
  GDD.addDataToSelector(taskEditCreator, dataCreator);
  GDD.addDataToSelector(locEditObj, locObj);
  GDD.getTypesOfWorkOptions(
    kindOfEditTasks,
    kindOfSubEditTask,
    localStorage.getItem('iddb'),
  );

  /**
   * Проверяет условия для показа галочки КР и показывает или скрывает ее в нужном состоянии
   */
  const checkAndShowCheckMark = () => {
    if (locObject === 'Заказчик' && settings.isKRChekboxAvailable) {
      const checkMarkRow = eventEditModal?.querySelector('.check-mark');
      const checkElem = checkMarkRow?.querySelector('.check-elem');

      if (!checkElem) {
        // Add check mark
        const checkMarkElem = document.createElement('div');
        checkMarkElem.classList.add('col-md-1', 'check-elem');
        checkMarkElem.innerHTML = `<div class="">
        <label class="fs-0 check-label" for="flexCheckDefault">КР</label>
        <input class="form-control form-check-input" type="checkbox" value="" id="flexCheckDefault">
        </div>`;

        checkMarkRow?.append(checkMarkElem);
      }
    }
  };

  checkAndShowCheckMark();

  const startDateTime = info?.event?._instance?.range.start;
  const endDateTime = info?.event?._instance?.range.end;

  const startTime = startDateTime?.getTime();
  const endTime = endDateTime?.getTime();

  eventEditTitle.value = info.event._def.title;
  longEditDesc.value = info.event._def.extendedProps.fullDescription;
  let flatpickrStart;
  let flatpickrEnd;

  if (window.innerWidth > 1280) {
    flatpickrStart = flatpickr('#eventEditStartDate', {
      // static: true,
      dateFormat: 'd.m.Y H:i',
      enableTime: true,
      allowInput: false,
      position: 'above',
      noCalendar: true,
      locale: Russian,
    });

    flatpickrEnd = flatpickr('#eventEditEndDate', {
      dateFormat: 'd.m.Y H:i',
      enableTime: true,
      position: 'above',
      allowInput: false,
      noCalendar: true,
      locale: Russian,
    });
  } else {
    flatpickrStart = flatpickr('#eventEditStartDate', {
      static: true,
      dateFormat: 'd.m.Y H:i',
      enableTime: true,
      position: 'above',
      allowInput: false,
      noCalendar: true,
      locale: Russian,
    });
    flatpickrEnd = flatpickr('#eventEditEndDate', {
      static: true,
      dateFormat: 'd.m.Y H:i',
      enableTime: true,
      allowInput: false,
      position: 'above',
      noCalendar: true,
      locale: Russian,
    });
  }

  if (Array.isArray(flatpickrStart)) {
    flatpickrStart[0].setDate(minusThreeHours(info.event._instance?.range.start));
  } else {
    flatpickrStart.setDate(minusThreeHours(info.event._instance?.range.start));
  }

  if (Array.isArray(flatpickrEnd)) {
    flatpickrEnd[0].setDate(minusThreeHours(info.event._instance?.range.end));
  } else {
    flatpickrEnd.setDate(minusThreeHours(info.event._instance?.range.end));
  }

  eventEditSpentTime.value = (((endTime ?? 0) - (startTime ?? 0)) / (1000 * 60 * 60)).toString();
  eventEditSource.value = info.event._def.extendedProps.source;
  eventEditNotes.value = info.event._def.extendedProps.notes;
  locEditObj.value = info.event._def.extendedProps.location || Locations.NOT_SELECTED;
  taskEditObj.value = info.event._def.extendedProps.object || TaskType.NOT_SELECTED;
  taskEditCreator.value =
    info.event._def.extendedProps.director || TaskType.NOT_SELECTED;

  /**
   * При изменении Вида Работ подгружает соответствующие Подвиды работ
   */
  const updateKindOfEditSubtaskListOnChange = () => {
    const kindOfEditTasks = document.querySelector('#kindOfEditTasks') as HTMLSelectElement;
    const kindOfSubEditTask = document.querySelector('#kindOfSubEditTask') as HTMLSelectElement;
    const dataTasksID = getLocalStorageItem('dataTasksID');

    if (
      kindOfEditTasks &&
      info.event._def.extendedProps.taskTypeNew !== 'Не выбрано'
    ) {
      let taskID = dataTasksID[info.event._def.extendedProps.taskTypeNew];

      let formDataSubTask = new FormData();

      formDataSubTask.append('ParamID', '9043');
      formDataSubTask.append('ObjID', '');
      formDataSubTask.append('Filter[0][isOnForm]', '1');
      formDataSubTask.append('Filter[0][value]', taskID);
      formDataSubTask.append('Filter[0][param]', C.sixthCol);
      formDataSubTask.append('Filter[0][isParentFilter]', '0');
      formDataSubTask.append('ShowAll', '0');
      formDataSubTask.append('ParentID', '');
      formDataSubTask.append('Limiter', '');
      formDataSubTask.append('LoadFullHbColumn', '0');
      formDataSubTask.append('LoadFullType', '0');
      formDataSubTask.append('SkipCalc', '0');
      formDataSubTask.append('ExactSearch', '0');
      formDataSubTask.append('Page', '1');

      fetch(C.srvv + C.getEnumsData, {
        credentials: 'include',
        method: 'post',
        body: formDataSubTask,
      })
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          kindOfSubTaskList = response.data;

          if (kindOfSubTaskList.length > 0) {
            cleanAndDefaultKindOfSubTaskSelector(kindOfSubEditTask);

            kindOfSubTaskList.forEach((subtask: { Name: { replaceAll: (arg0: string, arg1: string) => any; }; ID: any; }) => {
              const subTaskOption = document.createElement('option');
              const noQuoteSubTaskName = subtask.Name.replaceAll('&quot;', '"');
              const subtaskid = subtask.ID;
              subTaskOption.setAttribute('value', `${noQuoteSubTaskName}`);
              subTaskOption.setAttribute('subtaskid', `${subtaskid}`);
              subTaskOption.innerText = `${noQuoteSubTaskName}`;
              kindOfSubEditTask?.append(subTaskOption);
            });
            kindOfSubEditTask.value =
              TaskType.NOT_SELECTED || info.event._def.extendedProps.subTaskTypeNew;
            kindOfSubEditTask.value = TaskType.NOT_SELECTED;
          }
        })
        .catch(function (error) {
          console.log('error', error);
        });
    } else {
      kindOfSubTask.options.length = 0;
      const subTaskOption = document.createElement('option');
      subTaskOption.setAttribute('value', `Не выбрано`);
      subTaskOption.innerText = `Не выбрано`;
      kindOfSubTask.append(subTaskOption);
      kindOfSubTask.value = 'Не выбрано';
    }
  };

  if (editEventBtn) {
    editEventBtn.addEventListener('click', (e) => {
      tempLoader(true);
      let delID = info.event._def.extendedProps.delID;

      kindOfEditTasks.addEventListener('change', () => {
        updateKindOfEditSubtaskListOnChange();
      });

      modal.hide();
      updateKindOfEditSubtaskListOnChange();
      let jAmethodsTable: HTMLTableElement;
      let justRemovedMethods: any = [];

      document.addEventListener('shown.bs.modal', (e) => {
        const openedModal = e.target;

        const woo = (openedModal as HTMLElement)?.querySelector('.woo');

        woo?.addEventListener('click', (e) => {
          const isDeleteBtnClicked =
            (e.target as HTMLElement).classList.contains('delete-string');

          if (isDeleteBtnClicked) {
            const deletedString = (e.target as HTMLElement).closest('tr');
            const methName = (deletedString?.querySelector('.bg-info') as HTMLElement)?.innerText;
            const duration = (deletedString?.children[1] as HTMLElement)?.innerText;
            const objects = (deletedString?.children[2] as HTMLElement)?.innerText.trim();
            const zones = (deletedString?.children[3] as HTMLElement)?.innerText;
            const deletedMethodObj = {
              method: methName,
              params: { duration, objects, zones },
            };

            justRemovedMethods.push(deletedMethodObj);
          }
        });

        const addWooMetBtn = document.querySelector('#addWooMet');

        if (
          addWooMetBtn &&
          (kindOfEditTasks.value === TaskType.TECHNICAL_DIAGNOSTIC ||
            kindOfSubEditTask.value === TaskType.LABORATORY_CONTROL)
        ) {
          addWooMetBtn.addEventListener('click', () => {
            jAmethodsTable = document.querySelector('.methods-tbody') as HTMLTableElement;
          });
        }
      });

      // let selectedTaskID;

      const editEventModal = document.querySelector('#editEventModal') as HTMLDivElement;

      modal = new Modal(editEventModal);
      editEventModal.setAttribute('delID', delID);

      const dataTasksID = getLocalStorageItem('dataTasksID');

      const handleKindOfEditTasksChange = (selectedTaskID: string | Blob) => {
        kindOfEditTasks.value =
          info.event._def.extendedProps.taskTypeNew || 'Не выбрано';

        const foundString = globalTasksTypes.find(
          (str: { Name: string; }) => str.Name === info.event._def.extendedProps.taskTypeNew,
        );
        if (taskTypeNew !== '') {
          selectedTaskID = foundString.ID;
        }

        tempLoader(true);

        let kindOfEditSubTaskList = [];

        let formDataSubTask = new FormData();

        formDataSubTask.append('ParamID', '9044');
        formDataSubTask.append('ObjID', '');
        formDataSubTask.append('Filter[0][isOnForm]', '1');
        formDataSubTask.append('Filter[0][value]', selectedTaskID);
        formDataSubTask.append('Filter[0][param]', C.sixthCol);
        formDataSubTask.append('Filter[0][isParentFilter]', '0');
        formDataSubTask.append('ShowAll', '0');
        formDataSubTask.append('ParentID', '');
        formDataSubTask.append('Limiter', '');
        formDataSubTask.append('LoadFullHbColumn', '0');
        formDataSubTask.append('LoadFullType', '0');
        formDataSubTask.append('SkipCalc', '0');
        formDataSubTask.append('ExactSearch', '0');
        formDataSubTask.append('Page', '1');

        fetch(C.srvv + C.getEnumsData, {
          credentials: 'include',
          method: 'post',
          body: formDataSubTask,
        })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            kindOfEditSubTaskList = response.data;
            tempLoader(false);
            cleanAndDefaultKindOfSubTaskSelector(kindOfSubEditTask);
            kindOfEditSubTaskList.forEach((subtask: { Name: { replaceAll: (arg0: string, arg1: string) => any; }; ID: any; }) => {
              const subTaskOption = document.createElement('option');
              const noQuoteSubTaskName = subtask.Name.replaceAll('&quot;', '"');
              const subtaskid = subtask.ID;
              subTaskOption.setAttribute('value', `${noQuoteSubTaskName}`);
              subTaskOption.setAttribute('subtaskid', `${subtaskid}`);
              subTaskOption.innerText = `${noQuoteSubTaskName}`;
              kindOfSubEditTask.append(subTaskOption);
            });

            kindOfSubEditTask.value =
              (kindOfSubEditTask &&
                info.event._def.extendedProps.subTaskTypeNew) ||
              'Не выбрано';
            modal.show();
          })
          .catch(function (error) {
            console.log('error', error);
          });
      };
      if (kindOfEditTasks.length <= 1) {
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (kindOfEditTasks.length > 1) {
              const selectedTaskID = '';
              handleKindOfEditTasksChange(selectedTaskID);
              observer.disconnect();
            }
          });
        });
        observer.observe(kindOfEditTasks, {
          attributes: true,
          childList: true,
          characterData: true,
        });
      } else {
        let selectedTaskID = '';
        handleKindOfEditTasksChange(selectedTaskID);
      }

      const showTableOnModal = () => {
        const wooElem = document.querySelector('.woo-title') as HTMLDivElement;
        const wooTableElem = document.querySelector('.woo');

        showMethodsTable(info.event._def, wooElem, api);
      };

      if (
        info.event._def.extendedProps.taskTypeNew ===
          TaskType.TECHNICAL_DIAGNOSTIC ||
        info.event._def.extendedProps.subTaskTypeNew ===
          TaskType.LABORATORY_CONTROL
      ) {
        document.addEventListener('shown.bs.modal', showTableOnModal, {
          once: true,
        });
      }
      document.removeEventListener('hidden.bs.modal', showTableOnModal);

      document.addEventListener('shown.bs.modal', (e) => {
        let krCheck = document.querySelector('#flexCheckDefault') as HTMLInputElement;
        if (krCheck) {
          krCheck.checked = false;
        }

        let krBase = info?.event?._def?.extendedProps?.kr;

        if (krCheck && krBase === 'Да') {
          krCheck.checked = true;
        }

        document.addEventListener('hidden.bs.modal', () => {
          if (krCheck) {
            krCheck.checked = false;
          }
          krBase = '';
        });
      });

      const rangeHoursBetweenDates = () => {
        const start = eventEditStartDate.value;
        const end = eventEditEndDate.value;

        const convStrt = convertDateTime(start);
        const convEnd = convertDateTime(end);

        const parsedStart = new Date(convStrt);
        const parsedEnd = new Date(convEnd);

        const diffDates = parsedEnd.getTime() - parsedStart.getTime();
        const diffDays = Math.ceil(diffDates / (1000 * 60 * 60 * 24));
        const diffHours = diffDates / (1000 * 60 * 60);

        if (diffHours.toString().length > 4) {
          eventEditSpentTime.value = Math.ceil(diffHours).toString();
        } else {
          eventEditSpentTime.value = diffHours.toString();
        }

        checkAndForbiddenOutOfDay(
          eventEditStartDate,
          eventEditEndDate,
          eventEditSpentTime,
        );
        timeInputsValidation(eventEditEndDate, eventEditSpentTime);
      };

      rangeHoursBetweenDates();

      eventEditStartDate.addEventListener('change', () =>
        rangeHoursBetweenDates(),
      );
      eventEditEndDate.addEventListener('change', () =>
        rangeHoursBetweenDates(),
      );

      // Синхронизация Времени начала и Окончания при изменении Затраченного времени

      eventEditSpentTime.addEventListener('change', () => {
        changeDirectZero(eventEditEndDate, eventEditSpentTime);

        // Значения Начала и Окончания
        const start = eventEditStartDate.value;
        const end = eventEditEndDate.value;

        // Переводим в нужный формат

        const convStrt = convertDateTime(start);
        const convEnd = convertDateTime(end);

        // Находим время старта и финиша в миллисекундах

        const parsedStart = new Date(convStrt).getTime();
        const parsedEnd = new Date(convEnd).getTime();

        // Переводим часы из инпута Время в миллисекунды

        const milliSpentTime = +eventEditSpentTime.value * (60000 * 60);

        // Складываем время начала в миллисек и фактическое время в миллисек, получаем время окончания в миллисек

        const msEndTime = parsedStart + milliSpentTime;

        // Преобразовываем миллисекунды в дату окончания в нужном формате

        const convertMillisecToEndDateValue = (endMilliSecondsDate: string | number | Date) => {
          const endDate = new Date(endMilliSecondsDate);
          return endDate;
        };

        const endDate = convertMillisecToEndDateValue(msEndTime);

        // Преобразовываем объект Data в правильный вид для подстановки в окно Окончание

        const endDateValue = transformDateTime(endDate);

        eventEditEndDate.value = endDateValue;

        checkAndForbiddenOutOfDay(
          eventEditStartDate,
          eventEditEndDate,
          eventEditSpentTime,
        );
        timeInputsValidation(eventEditEndDate, eventEditSpentTime);
        changeDirectZero(eventEditEndDate, eventEditSpentTime);
      });

      editSaveTaskBtn.addEventListener('click', (e) => {
        if (!validateTotalTimeOnObject(false)) {
          e.preventDefault();
          isInvalidElem(eventEditSpentTime);
          return;
        }
        if (
          (locEditObj.value === Locations.NOT_SELECTED ||
            kindOfEditTasks.value === TaskType.NOT_SELECTED ||
            eventEditSpentTime.classList.contains('is-invalid')) &&
          employmentEdit.value === Employment.WORK
        ) {
          if (locEditObj.value === Locations.NOT_SELECTED) {
            locEditObj.classList.add('is-invalid');
          }

          if (kindOfEditTasks.value === TaskType.NOT_SELECTED) {
            kindOfEditTasks.classList.add('is-invalid');
          }
          e.preventDefault();
        } else {
          e.preventDefault();

          // Формируем объект для передачи данных на сервер

          const parentID = findParentID(
            getLocalStorageItem('parentIdDataArr'),
            eventEditStartDate.value,
          );
          const cleanTodayDate = eventEditStartDate.value.slice(0, 10);

          const dataObjectsID = getLocalStorageItem('dataObjectsID');
          const dataCreatorsID = getLocalStorageItem('dataCreatorsID');
          const dataTasksID = getLocalStorageItem('dataTasksID');
          const dataSubTasksID = getLocalStorageItem('dataSubTasksID');

          const neededIDsObj = {
            ...dataObjectsID,
            ...dataCreatorsID,
            ...dataTasksID,
            ...dataSubTasksID,
          };

          const kr = document.querySelector('#flexCheckDefault') as HTMLInputElement;
          const krCheckBase = info.event._def.extendedProps.kr;
          const krState = (krelem: HTMLInputElement) => {
            if (krelem && krelem.checked) {
              return 'Да';
            } else if (krCheckBase !== 'Нет') {
              return '';
            } else {
              return 'Нет';
            }
          };

          const mainEventEditObject = {
            delID,
            parentID,
            OBJTYPEID: C.OBJTYPEID,
            addZeroName: C.addZeroName,
            cleanTodayDate,
            dataGroupID: C.dataGroupID,
            fourthCol: C.fourthCol,
            fifthCol: C.fifthCol,
            dataObjID: neededIDsObj[taskEditObj.value] || '',
            dataObjVal: taskEditObj.value,
            sixthCol: C.sixthCol,
            kindOfEditTasksID:
              neededIDsObj[kindOfEditTasks.value] ||
              kindOfEditTasks[
                kindOfEditTasks.options.selectedIndex
              ].getAttribute('taskid') ||
              '',
            seventhCol: C.seventhCol,
            kindOfSubEditTaskID:
              neededIDsObj[kindOfSubEditTask.value] ||
              kindOfSubEditTask[
                kindOfSubEditTask.options.selectedIndex
              ].getAttribute('subtaskid') ||
              '',
            kindOfSubEditTaskVal: kindOfSubEditTask.value,
            titleEditVal: eventEditTitle.value,
            longEditDeskVal: longEditDesc.value,
            ninthCol: C.ninthCol,
            spentEditTimeVal: eventEditSpentTime.value,
            tenthCol: C.tenthCol,
            taskEditCreatorID: neededIDsObj[taskEditCreator.value] || '',
            taskEditCreatorVal: taskEditCreator.value,
            eleventhCol: C.eleventhCol,
            eventEditSourceVal: eventEditSource.value,
            eventEditNotesVal: eventEditNotes.value,
            userCol: C.userCol,
            idDB: getLocalStorageItem('iddb') ?? '',
            thirteenthCol: C.thirteenthCol,
            startEditDate: eventEditStartDate.value,
            fourteenthCol: C.fourteenthCol,
            endEditDate: eventEditEndDate.value,
            fifteenthCol: C.fifteenthCol,
            locationVal: notChoosenCleaning(locEditObj.value),
            emplEditVal: employmentEdit.value,
            dataInterfaceID: C.dataInterfaceID,
            addCalcParamID: C.addCalcParamID,
            srvv: C.srvv,
            addValueObjTrue: C.addValueObjTrue,
            calendar,
            createNodeUrl: C.createNodeUrl,
            convertDateTime,
            setViewAndDateToLS,
            krBase: krState(kr),
            methodsFromServer,
            savedTaskFromServer,
            kindOfEditTasksVal: kindOfEditTasks.value,
          };

          // return
          let updatedMethods;
          if (jAmethodsTable) {
            addMethodToBase(grabJustAddedArray(jAmethodsTable), delID, api);
            updatedMethods = grabJustAddedArray(jAmethodsTable);
          }

          saveEditedTasks(
            mainEventEditObject,
            editedEvent as EventImpl,
            updatedMethods,
            justRemovedMethods,
          );
        }

        modal.hide();
      });
      editEventModal.addEventListener('hide.bs.modal', () => {
        delID = '';
        editedEvent = '';
        editSaveTaskBtn.removeAttribute('disabled');
      });
    });
  }
};
