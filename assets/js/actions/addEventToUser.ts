import { Calendar } from '@fullcalendar/core';
import { Modal } from 'bootstrap';
import { addEventToUserApi } from '../api/addEventToUserApi';
import * as c from '../config';
import { Locations } from '../enums/locations';
import { TaskType } from '../enums/taskTypes';
import addEventWithMethods from './addEventWithMethods';
import grabMethodsDataTable from '../methods/grabMethodsDataTable';
import { buttonLoader } from '../ui/buttonLoader';
import { showError } from '../ui/notification';
import { oftenSelectedCollectInLS } from '../ui/oftenSelectedCollectInLS';
import { setViewAndDateToLS } from '../ui/setViewAndDateToLS';
import { updateCalendarTimeBounds } from '../utils/calendarUtils';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import * as mainFunc from '../utils/mainGlobFunctions';
import { convertDateTime, handleWooTime, notChoosenCleaning } from '../utils/mainGlobFunctions';
import { getFormElements, getKrState } from '../utils/uiUtils';
import { checkEmploymentMode, validateBrigadeSelect, validateCondition } from '../utils/validationUtils';
import { findParentID } from './eventsActions';


/**
 * Добавление задачи в календарь другого пользователя(сотрудника)
 * @param {Object} calendar - объект календаря
 * @returns
 */

export const addEventToUser = (calendar: Calendar) => {
  return async function (e: Event) {
    const {
      kindOfTasks,
      kindOfSubTask,
      eventTitle,
      longDesc,
      taskObj,
      taskCreator,
      eventStartDate,
      eventEndDate,
      eventSpentTime,
      eventSource,
      eventNotes,
      locations,
      employment,
      addEventModal,
      eventTaskModalBtn,
    } = getFormElements();

    // Убираем лодер с кнопки "Добавить"
    eventTaskModalBtn?.addEventListener(
      'hidden.bs.modal',
      function (event) {
        buttonLoader(eventTaskModalBtn, false);
      },
      { once: true }
    );

    buttonLoader(eventTaskModalBtn, true);

    const isMethodsAvailableMode =
      kindOfTasks.value === TaskType.TECHNICAL_DIAGNOSTIC ||
      kindOfSubTask.value === TaskType.LABORATORY_CONTROL;

    let justAddedDelID = '';
    const iddb = getLocalStorageItem('iddb');

    const valCond = checkEmploymentMode(locations);

    /**
     * Возвращает необходимое условие для валидации
     * @param {boolean} valC
     * @returns
     */

    const valCondition = validateCondition(valCond, locations, kindOfTasks, eventEndDate);

    if (valCondition) {
      if (locations.value === Locations.NOT_SELECTED) {
        locations.classList.add('is-invalid');
      }

      if (kindOfTasks.value === TaskType.NOT_SELECTED) {
        kindOfTasks.classList.add('is-invalid');
      }

      e.preventDefault();
      buttonLoader(eventTaskModalBtn, false);
    } else {
      if (
        kindOfTasks.value !== TaskType.TECHNICAL_DIAGNOSTIC &&
        kindOfSubTask.value !== TaskType.LABORATORY_CONTROL
      ) {
        e.preventDefault();

        // Корректировка затраченного времени

        if (eventEndDate.value === '') {
          if (eventSpentTime.value === '') {
            eventEndDate.value = `${eventStartDate.value.slice(0, 10)} 19:00`;
          } else {
            const newTime = eventStartDate.value.slice(11, 16);
            const newTimeHours = +newTime.slice(0, 2);

            eventEndDate.value = `${eventStartDate.value.slice(0, 10)} ${
              +eventSpentTime.value + newTimeHours
            }:${eventStartDate.value.slice(14, 16)}`;
          }
        }

        try{
          const krStateValue = getKrState('#flexCheckDefault');

          // Отправляем новый event в базу через отдельную функцию API
            justAddedDelID = await addEventToUserApi({
              eventStartDate,
              eventEndDate,
              eventTitle,
              longDesc,
              taskObj,
              taskCreator,
              eventSpentTime,
              eventSource,
              eventNotes,
              locations,
              employment,
              iddb,
              krStateValue,
              kindOfTasks,
              kindOfSubTask,
            });

          // Добавление задачи на клиенте (без перезагрузки)

          calendar.addEvent({
            title: eventTitle.value,
            allDay: false,
            classNames: 'bg-soft-primary',
            start: mainFunc.convertDateTime(eventStartDate.value),
            end: mainFunc.convertDateTime(eventEndDate.value),
            extendedProps: {
              delID: justAddedDelID,
              director: taskCreator.value,
              factTime: eventSpentTime.value,
              fullDescription: longDesc.value,
              notes: eventNotes.value,
              object: taskObj.value,
              source: eventSource.value,
              location: locations.value,
              employment: employment.value,
              taskTypeNew:
                kindOfTasks.value === TaskType.NOT_SELECTED ? '' : kindOfTasks.value,
              subTaskTypeNew:
                kindOfSubTask.value === TaskType.NOT_SELECTED
                  ? ''
                  : kindOfSubTask.value,
              isApproved: '',
            },
          });
          calendar.render();
          oftenSelectedCollectInLS(taskCreator);

          // Обновление границ времени календаря
            updateCalendarTimeBounds({
              calendar,
              eventStartDate,
              eventEndDate,
              isMethodsAvailableMode,
              eventTaskModalBtn,
            });

          localStorage.setItem('fcDefaultView', calendar.view.type);
          Modal?.getInstance(addEventModal)?.hide();
        } catch (error) {
          console.error('Ошибка при добавлении задачи:', error);
          showError('Не удалось добавить задачу. Пожалуйста, попробуйте позже.');
        }

      } else {
        e.preventDefault();

        const validateTotalTime = mainFunc.validateTotalTimeOnObject('single');
        console.log("🚀 ~ validateTotalTime:", validateTotalTime)


        const brigadeSelect = addEventModal!.querySelector('#brigadeSelect') as HTMLSelectElement;
        const validateBrigade = validateBrigadeSelect(brigadeSelect);

        if (validateTotalTime && validateBrigade) {
          const krStateValue = getKrState('#flexCheckDefault');

          // Формируем объект для передачи данных на сервер

          const parentID = findParentID(
            getLocalStorageItem('parentIdDataArr'),
            eventStartDate?.value,
          );
          const cleanTodayDate = eventStartDate.value.slice(0, 10);

          const mainEventObject = {
            parentID,
            OBJTYPEID: c.OBJTYPEID,
            addZeroName: c.addZeroName,
            cleanTodayDate,
            dataGroupID: c.dataGroupID,
            fifthCol: c.fifthCol,
            taskObjAttr:
              taskObj[taskObj.options.selectedIndex].getAttribute(
                'objidattr',
              ) || '',
            sixthCol: c.sixthCol,
            kindOfTasksID:
              kindOfTasks[kindOfTasks.options.selectedIndex].getAttribute(
                'taskid',
              ) || '',
            seventhCol: c.seventhCol,
            kindOfSubTaskID:
              kindOfSubTask[kindOfSubTask.options.selectedIndex].getAttribute(
                'subtaskid',
              ) || '',
            fourthCol: c.fourthCol,
            titleVal: eventTitle.value,
            longDeskVal: longDesc.value,
            ninthCol: c.ninthCol,
            spentTimeVal: eventSpentTime.value,
            tenthCol: c.tenthCol,
            taskCreatorID:
              taskCreator[taskCreator.options.selectedIndex].getAttribute(
                'objidattr',
              ) || '',
            eleventhCol: c.eleventhCol,
            eventSourceVal: eventSource.value,
            eventNotesVal: eventNotes.value,
            userCol: c.userCol,
            idDB: iddb,
            thirteenthCol: c.thirteenthCol,
            startDate: eventStartDate.value,
            fourteenthCol: c.fourteenthCol,
            endDate: eventEndDate.value,
            fifteenthCol: c.fifteenthCol,
            locationVal: notChoosenCleaning(locations.value),
            employmentVal: employment.value,
            dataInterfaceID: c.dataInterfaceID,
            addCalcParamID: c.addCalcParamID,
            srvv: c.srvv,
            createNodeUrl: c.createNodeUrl,
            taskCreatorVal: taskCreator.value,
            taskObjVal: taskObj.value,
            kindOfSubTaskVal: kindOfSubTask.value,
            kindOfTasksVal: kindOfTasks.value,
            calendar,
            convertDateTime,
            krBase: krStateValue,
          };

          // Формируем объект методов, для передачи со вторым запросом

          const methodsTable = document.querySelector('.methods-tbody') as HTMLTableSectionElement;
          addEventWithMethods(
            mainEventObject,
            grabMethodsDataTable(methodsTable),
            setViewAndDateToLS,
          );
        } else {
          handleWooTime('single');
          buttonLoader(eventTaskModalBtn, false);
        }
      }
    }
    calendar.render();
  };
};


