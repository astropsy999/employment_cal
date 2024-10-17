import * as c from '../config';
import { findParentID } from './eventsActions';
import * as mainFunc from '../utils/mainGlobFunctions';
import { oftenSelectedCollectInLS } from '../ui/oftenSelectedCollectInLS';
import addEventWithMethods from '../methods/addEventWithMethods';
import grabMethodsDataTable from '../methods/grabMethodsDataTable';
import { Modal } from 'bootstrap';
import { buttonLoader } from '../ui/buttonLoader';
import { handleWooTime, unblockBtnAddTitle } from '../utils/mainGlobFunctions';
import { setViewAndDateToLS } from '../ui/setViewAndDateToLS';
import { Calendar } from '@fullcalendar/core';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import { updateCalendarTimeBounds } from '../utils/calendarUtils';
import { addEventToUserApi } from '../api/addEventToUserApi';
import { getFormElements, getKrState } from '../utils/uiUtils';
import { checkEmploymentMode, validateCondition } from '../utils/validationUtils';


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

    eventTaskModalBtn?.addEventListener('hidden.bs.modal', function (event) {
      buttonLoader(eventTaskModalBtn, false);
    });

    buttonLoader(eventTaskModalBtn, true);

    const isMethodsAvailableMode =
      kindOfTasks.value === 'Техническое диагностирование' ||
      kindOfSubTask.value === 'Проведение контроля в лаборатории';

    const isRootUser =
      localStorage.getItem('managerName') ===
      localStorage.getItem('selectedUserName');

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
      if (locations.value === 'Не выбрано') {
        locations.classList.add('is-invalid');
      }

      if (kindOfTasks.value === 'Не выбрано') {
        kindOfTasks.classList.add('is-invalid');
      }

      e.preventDefault();
      buttonLoader(eventTaskModalBtn, false);
    } else {
      if (
        kindOfTasks.value !== 'Техническое диагностирование' &&
        kindOfSubTask.value !== 'Проведение контроля в лаборатории'
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
                kindOfTasks.value === 'Не выбрано' ? '' : kindOfTasks.value,
              subTaskTypeNew:
                kindOfSubTask.value === 'Не выбрано'
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
          console.log(error);
        }

      } else {
        e.preventDefault();

        const validateTotalTime = mainFunc.validateTotalTimeOnObject('single');

        if (validateTotalTime === true) {
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
            locationVal: mainFunc.notChoosenCleaning(locations.value),
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
            convertDateTime: mainFunc.convertDateTime,
            krBase: krStateValue,
          };

          // Формируем объект методов, для передачи со вторым запросом

          const methodsTable = document.querySelector('.methods-tbody');
          addEventWithMethods(
            mainEventObject,
            grabMethodsDataTable(methodsTable),
            setViewAndDateToLS,
          );
        } else {
          handleWooTime('single');
        }
      }
    }
    calendar.render();
  };
};


