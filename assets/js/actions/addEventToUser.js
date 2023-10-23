import * as c from '../config';
import { findParentID } from './eventsActions';
import * as mainFunc from '../utils/mainGlobFunctions';
import { oftenSelectedCollectInLS } from '../ui/oftenSelectedCollectInLS';
import addEventWithMethods from '../methods/addEventWithMethods';
import grabMethodsDataTable from '../methods/grabMethodsDataTable';
import { setViewAndDateToLS } from '../ui/setViewAndDateToLS';
import { Modal } from 'bootstrap';
import { buttonLoader } from '../ui/buttonLoader';

/**
 * Добавление задачи в календарь другого пользователя(сотрудника)
 * @param {Object} calendar - объект календаря
 * @returns
 */

export const addEventToUser = (calendar) => {
  return function (e) {
    const kindOfTasks = document.querySelector('#kindOfTasks');
    const kindOfSubTask = document.querySelector('#kindOfSubTask');
    const eventTitle = document.querySelector('#eventTitle');
    const longDesc = document.querySelector('#longDesc');
    const taskObj = document.querySelector('#taskObj');
    const taskCreator = document.querySelector('#taskCreator');
    const eventStartDate = document.querySelector('#eventStartDate');
    const eventEndDate = document.querySelector('#eventEndDate');
    const eventSpentTime = document.querySelector('#eventSpentTime');
    const eventSource = document.querySelector('#eventSource');
    const eventNotes = document.querySelector('#eventNotes');
    const locations = document.querySelector('#locObj');
    const employment = document.querySelector('#employment');

    const addEventModal = document.querySelector('#addEventModal');
    const eventTaskModalBtn = document.querySelector('#addTaskToCalBtn');

    addEventModal.addEventListener('hidden.bs.modal', function (event) {
      buttonLoader(eventTaskModalBtn);
    });

    const isMethodsAvailableMode =
      kindOfTasks.value === 'Техническое диагностирование' ||
      kindOfSubTask.value === 'Проведение контроля в лаборатории';

    const isRootUser =
      localStorage.getItem('managerName') ===
      localStorage.getItem('selectedUserName');

    let justAddedDelID = '';
    const iddb = localStorage.getItem('iddb');

    /**
     * Проверка рабочего режима при добавлении задачи
     * @returns boolean
     */
    const checkEmploymentMode = () => {
      const emplMode = document.querySelector('#employment');
      if (emplMode.value === 'Работа' && locations.value !== 'В дороге') {
        return true;
      } else if (
        emplMode.value === 'Работа' &&
        locations.value === 'В дороге'
      ) {
        return 'onRoad';
      }
      return false;
    };
    const valCond = checkEmploymentMode();

    /**
     * Возвращает необходимое условие для валидации
     * @param {boolean} valC
     * @returns
     */

    const validateCondition = (valC) => {
      switch (valC) {
        case false:
          return null === undefined;
        case true:
          return (
            locations.value === 'Не выбрано' ||
            kindOfTasks.value === 'Не выбрано' ||
            eventEndDate.classList.contains('is-invalid')
          );
        case 'onRoad':
          return eventEndDate.classList.contains('is-invalid');
      }
    };

    const valCondition = validateCondition(valCond);

    if (valCondition) {
      if (locations.value === 'Не выбрано') {
        locations.classList.add('is-invalid');
      }

      if (kindOfTasks.value === 'Не выбрано') {
        kindOfTasks.classList.add('is-invalid');
      }

      e.preventDefault();
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

        // Преобразование даты добавления события из объекта new Data() в dd.mm.yyyy

        const cleanTodayDate = eventStartDate.value.slice(0, 10);

        const parentIdDataArr = JSON.parse(
          localStorage.getItem('parentIdDataArr'),
        );

        const kr = document.querySelector('#flexCheckDefault');
        const krState = (krelem) => {
          if (krelem && krelem.checked) {
            return 'Да';
          } else {
            return '';
          }
        };

        // Вычисляем дату на которую кликнул пользователь и ParentID

        // Находим ParentID

        const parentID = findParentID(parentIdDataArr, eventStartDate.value);

        // Отправляем новый event в базу

        buttonLoader(eventTaskModalBtn, true);

        let formDataEv2 = new FormData();

        formDataEv2.append('ObjTypeID', c.OBJTYPEID);
        formDataEv2.append('ParentID', parentID);
        formDataEv2.append('Data[0][name]', c.addZeroName);
        formDataEv2.append('Data[0][value]', cleanTodayDate);
        formDataEv2.append('Data[0][isName]', 'false');
        formDataEv2.append('Data[0][maninp]', 'false');
        formDataEv2.append('Data[0][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[1][name]', c.fifthCol);
        formDataEv2.append(
          'Data[1][value]',
          taskObj[taskObj.options.selectedIndex].getAttribute('objidattr') ||
            '',
        );
        formDataEv2.append('Data[1][isName]', 'false');
        formDataEv2.append('Data[1][maninp]', 'false');
        formDataEv2.append('Data[1][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[4][name]', c.fourthCol);
        formDataEv2.append('Data[4][value]', eventTitle.value);
        formDataEv2.append('Data[4][isName]', 'false');
        formDataEv2.append('Data[4][maninp]', 'false');
        formDataEv2.append('Data[4][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[5][name]', 't8106');
        formDataEv2.append('Data[5][value]', longDesc.value);
        formDataEv2.append('Data[5][isName]', 'false');
        formDataEv2.append('Data[5][maninp]', 'false');
        formDataEv2.append('Data[5][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[6][name]', c.ninthCol);
        formDataEv2.append('Data[6][value]', eventSpentTime.value);
        formDataEv2.append('Data[6][isName]', 'false');
        formDataEv2.append('Data[6][maninp]', 'false');
        formDataEv2.append('Data[6][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[7][name]', c.tenthCol);
        formDataEv2.append(
          'Data[7][value]',
          taskCreator[taskCreator.options.selectedIndex].getAttribute(
            'objidattr',
          ) || '',
        );
        formDataEv2.append('Data[7][isName]', 'false');
        formDataEv2.append('Data[7][maninp]', 'false');
        formDataEv2.append('Data[7][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[8][name]', c.eleventhCol);
        formDataEv2.append('Data[8][value]', eventSource.value);
        formDataEv2.append('Data[8][isName]', 'false');
        formDataEv2.append('Data[8][maninp]', 'false');
        formDataEv2.append('Data[8][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[9][name]', 't8107');
        formDataEv2.append('Data[9][value]', eventNotes.value);
        formDataEv2.append('Data[9][isName]', 'false');
        formDataEv2.append('Data[9][maninp]', 'false');
        formDataEv2.append('Data[9][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[10][name]', c.userCol);
        formDataEv2.append('Data[10][value]', iddb);
        formDataEv2.append('Data[10][isName]', 'false');
        formDataEv2.append('Data[10][maninp]', 'false');
        formDataEv2.append('Data[10][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[11][name]', c.thirteenthCol);
        formDataEv2.append('Data[11][value]', eventStartDate.value);
        formDataEv2.append('Data[11][isName]', 'false');
        formDataEv2.append('Data[11][maninp]', 'false');
        formDataEv2.append('Data[11][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[12][name]', c.fourteenthCol);
        formDataEv2.append('Data[12][value]', eventEndDate.value);
        formDataEv2.append('Data[12][isName]', 'false');
        formDataEv2.append('Data[12][maninp]', 'false');
        formDataEv2.append('Data[12][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[13][name]', c.fifteenthCol);
        formDataEv2.append(
          'Data[13][value]',
          mainFunc.notChoosenCleaning(locations.value),
        );
        formDataEv2.append('Data[13][isName]', 'false');
        formDataEv2.append('Data[13][maninp]', 'false');
        formDataEv2.append('Data[13][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[14][name]', '9042');
        formDataEv2.append('Data[14][value]', employment.value);
        formDataEv2.append('Data[14][isName]', 'false');
        formDataEv2.append('Data[14][maninp]', 'false');
        formDataEv2.append('Data[14][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[15][name]', '9043');
        formDataEv2.append(
          'Data[15][value]',
          kindOfTasks[kindOfTasks.options.selectedIndex].getAttribute(
            'taskid',
          ) || '',
        );
        formDataEv2.append('Data[15][isName]', 'false');
        formDataEv2.append('Data[15][maninp]', 'false');
        formDataEv2.append('Data[15][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[16][name]', '9044');
        formDataEv2.append(
          'Data[16][value]',
          kindOfSubTask[kindOfSubTask.options.selectedIndex].getAttribute(
            'subtaskid',
          ) || '',
        );
        formDataEv2.append('Data[16][isName]', 'false');
        formDataEv2.append('Data[16][maninp]', 'false');
        formDataEv2.append('Data[16][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[17][name]', '8852');
        formDataEv2.append('Data[17][isName]', 'false');
        formDataEv2.append('Data[17][maninp]', 'false');
        formDataEv2.append('Data[17][GroupID]', c.dataGroupID);
        formDataEv2.append('Data[17][value]', krState(kr));
        formDataEv2.append('InterfaceID', c.dataInterfaceID);
        formDataEv2.append('CalcParamID', c.addCalcParamID);
        formDataEv2.append('isGetForm', '0');
        formDataEv2.append('ImportantInterfaceID', '');
        formDataEv2.append('Ignor39', '0');
        formDataEv2.append('templ_mode', '0');

        fetch(c.srvv + c.createNodeUrl, {
          credentials: 'include',
          method: 'post',
          body: formDataEv2,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const objID = data.results[0].object;
            justAddedDelID = objID;

            eventTaskModalBtn.addEventListener('click', null);

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

            // Проверка и расширение границ времени при добавлении

            const slotmintime = calendar.getOption('slotMinTime');
            const slotmaxtime = calendar.getOption('slotMaxTime');

            const minTimeHours = +slotmintime.slice(0, 2);
            const maxTimeHours = +slotmaxtime.slice(0, 2);

            const startHours = new Date(
              mainFunc.convertDateTime(eventStartDate.value),
            ).getHours();
            const endHours = new Date(
              mainFunc.convertDateTime(eventEndDate.value),
            ).getHours();

            const setStartHours = Math.min(minTimeHours, startHours);
            const setEndHours = Math.max(maxTimeHours, endHours);

            calendar.setOption(
              'slotMinTime',
              `${mainFunc.addZeroBefore(setStartHours)}:00:00`,
            );
            calendar.setOption(
              'slotMaxTime',
              `${mainFunc.addZeroBefore(setEndHours)}:59:59`,
            );

            if (!isMethodsAvailableMode) {
              buttonLoader(eventTaskModalBtn);
            }
          });

        localStorage.setItem('fcDefaultView', calendar.view.type);
        Modal.getInstance(addEventModal).hide();
      } else {
        e.preventDefault();

        const validateTotalTime = mainFunc.validateTotalTimeOnObject('single');

        if (validateTotalTime === true) {
          const kr = document.querySelector('#flexCheckDefault');
          const krState = (krelem) => {
            if (krelem && krelem.checked) {
              return 'Да';
            } else {
              return '';
            }
          };

          // Формируем объект для передачи данных на сервер

          const parentID = findParentID(
            JSON.parse(localStorage.getItem('parentIdDataArr')),
            eventStartDate.value,
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
            krBase: krState(kr),
          };

          // Формируем объект методов, для передачи со вторым запросом

          const methodsTable = document.querySelector('.methods-tbody');
          addEventWithMethods(
            mainEventObject,
            grabMethodsDataTable(methodsTable),
            setViewAndDateToLS,
          );
        } else {
          mainFunc.handleWooTime('single');
        }
      }
    }
  };
};
