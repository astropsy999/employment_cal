import * as C from '../config';
import { stretchViewDepEvents } from '../ui/stretchViewDepEvents';
import {
  addZeroBefore,
  refreshBtnAction,
  transformToMethods,
} from '../utils/mainGlobFunctions';
/**
 * Сохранение отредактированных данных в таблице методов
 * @param {*} eventEditObj
 */
const saveEditedTasks = (
  eventEditObj,
  editedEvent,
  updatedMethods,
  justRemovedMethods,
) => {
  const {
    delID,
    dataObjID,
    dataObjVal,
    fourthCol,
    fifthCol,
    dataGroupID,
    kindOfEditTasksID,
    kindOfSubEditTaskID,
    kindOfSubEditTaskVal,
    titleEditVal,
    longEditDeskVal,
    ninthCol,
    spentEditTimeVal,
    tenthCol,
    taskEditCreatorID,
    taskEditCreatorVal,
    eleventhCol,
    eventEditSourceVal,
    eventEditNotesVal,
    thirteenthCol,
    startEditDate,
    endEditDate,
    fourteenthCol,
    locationVal,
    fifteenthCol,
    idDB,
    dataInterfaceID,
    addValueObjTrue,
    srvv,
    calendar,
    krBase,
    emplEditVal,
    methodsFromServer,
    savedTaskFromServer,
    kindOfEditTasksVal,
  } = eventEditObj;

  // Минимальное и максимальное время которое отображает календарь в данный момент
  let minViewTime = calendar.getOption('slotMinTime');
  let maxViewTime = calendar.getOption('slotMaxTime');

  const isMethodsAvailable =
    kindOfEditTasksVal === 'Техническое диагностирование';

  /**
   * Удаление всех методов если был изменен Вид работ при редактировании
   * @param {*} methodsFromServer
   */

  const deleteAllMethodsIfChangedType = (methodsFromServer) => {
    const methDelIDArr = [];
    methodsFromServer.forEach((delId) => {
      methDelIDArr.push(Object.values(delId)[0]['editID']);
    });

    methDelIDArr.forEach((methDelID) => {
      fetch(
        srvv + C.deleteNodeURL + `?ID=${methDelID}&TypeID=1149&TabID=1685`,
        {
          credentials: 'include',
          method: 'GET',
        },
      )
        .then((response) => {
          console.log('Метод удален');
          return response;
        })
        .catch(function (error) {
          console.log('Ошибка отправки удаления метода', error);
        });
    });
  };

  if (savedTaskFromServer !== kindOfEditTasksVal && methodsFromServer) {
    deleteAllMethodsIfChangedType(methodsFromServer);
  }

  // return

  let formDataSaveEdited = new FormData();

  formDataSaveEdited.append('ID', delID);
  formDataSaveEdited.append('TypeID', '1094');
  formDataSaveEdited.append('Data[0][name]', fifthCol);
  formDataSaveEdited.append('Data[0][value]', dataObjID);
  formDataSaveEdited.append('Data[0][isName]', 'false');
  formDataSaveEdited.append('Data[0][maninp]', 'false');
  formDataSaveEdited.append('Data[0][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[1][name]', '9043');
  formDataSaveEdited.append('Data[1][value]', kindOfEditTasksID);
  formDataSaveEdited.append('Data[1][isName]', 'false');
  formDataSaveEdited.append('Data[1][maninp]', 'false');
  formDataSaveEdited.append('Data[1][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[2][name]', '9044');
  formDataSaveEdited.append('Data[2][value]', kindOfSubEditTaskID);
  formDataSaveEdited.append('Data[2][isName]', 'false');
  formDataSaveEdited.append('Data[2][maninp]', 'false');
  formDataSaveEdited.append('Data[2][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[3][name]', fourthCol);
  formDataSaveEdited.append('Data[3][value]', titleEditVal);
  formDataSaveEdited.append('Data[3][isName]', 'false');
  formDataSaveEdited.append('Data[3][maninp]', 'false');
  formDataSaveEdited.append('Data[3][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[4][name]', 't8106');
  formDataSaveEdited.append('Data[4][value]', longEditDeskVal);
  formDataSaveEdited.append('Data[4][isName]', 'false');
  formDataSaveEdited.append('Data[4][maninp]', 'false');
  formDataSaveEdited.append('Data[4][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[5][name]', ninthCol);
  formDataSaveEdited.append('Data[5][value]', spentEditTimeVal);
  formDataSaveEdited.append('Data[5][isName]', 'false');
  formDataSaveEdited.append('Data[5][maninp]', 'false');
  formDataSaveEdited.append('Data[5][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[6][name]', tenthCol);
  formDataSaveEdited.append('Data[6][value]', taskEditCreatorID);
  formDataSaveEdited.append('Data[6][isName]', 'false');
  formDataSaveEdited.append('Data[6][maninp]', 'false');
  formDataSaveEdited.append('Data[6][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[7][name]', eleventhCol);
  formDataSaveEdited.append('Data[7][value]', eventEditSourceVal);
  formDataSaveEdited.append('Data[7][isName]', 'false');
  formDataSaveEdited.append('Data[7][maninp]', 'false');
  formDataSaveEdited.append('Data[7][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[8][name]', 't8107');
  formDataSaveEdited.append('Data[8][value]', eventEditNotesVal);
  formDataSaveEdited.append('Data[8][isName]', 'false');
  formDataSaveEdited.append('Data[8][maninp]', 'false');
  formDataSaveEdited.append('Data[8][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[9][name]', thirteenthCol);
  formDataSaveEdited.append('Data[9][value]', startEditDate);
  formDataSaveEdited.append('Data[9][isName]', 'false');
  formDataSaveEdited.append('Data[9][maninp]', 'false');
  formDataSaveEdited.append('Data[9][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[10][name]', fourteenthCol);
  formDataSaveEdited.append('Data[10][value]', endEditDate);
  formDataSaveEdited.append('Data[10][isName]', 'false');
  formDataSaveEdited.append('Data[10][maninp]', 'false');
  formDataSaveEdited.append('Data[10][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[11][name]', fifteenthCol);
  formDataSaveEdited.append('Data[11][value]', locationVal);
  formDataSaveEdited.append('Data[11][isName]', 'false');
  formDataSaveEdited.append('Data[11][maninp]', 'false');
  formDataSaveEdited.append('Data[11][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[12][name]', '8852');
  formDataSaveEdited.append('Data[12][value]', krBase);
  formDataSaveEdited.append('Data[12][isName]', 'false');
  formDataSaveEdited.append('Data[12][maninp]', 'false');
  formDataSaveEdited.append('Data[12][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[13][value]', emplEditVal);
  formDataSaveEdited.append('Data[13][isName]', 'false');
  formDataSaveEdited.append('Data[13][maninp]', 'false');
  formDataSaveEdited.append('Data[13][GroupID]', dataGroupID);
  formDataSaveEdited.append('Data[13][name]', '9042');
  formDataSaveEdited.append('ParentObjID', idDB);
  formDataSaveEdited.append('CalcParamID', '-1');
  formDataSaveEdited.append('InterfaceID', dataInterfaceID);
  formDataSaveEdited.append('ImportantInterfaceID', '');
  formDataSaveEdited.append('templ_mode', 'false');
  formDataSaveEdited.append('Ignor39', '0');

  fetch(srvv + addValueObjTrue, {
    credentials: 'include',
    method: 'post',
    body: formDataSaveEdited,
  }).then((response) => {
    // Обновление отредактированного события без перезагрузки

    if (editedEvent) {
      editedEvent?.setProp('title', titleEditVal);
      editedEvent?.setExtendedProp('delID', delID);
      editedEvent?.setExtendedProp('location', locationVal);
      editedEvent?.setExtendedProp('director', taskEditCreatorVal);
      editedEvent?.setExtendedProp('employment', emplEditVal);
      editedEvent?.setExtendedProp('factTime', spentEditTimeVal);
      editedEvent?.setExtendedProp('fullDescription', longEditDeskVal);
      editedEvent?.setExtendedProp('notes', eventEditNotesVal);
      editedEvent?.setExtendedProp('object', dataObjVal);
      editedEvent?.setExtendedProp('source', eventEditSourceVal);
      editedEvent?.setExtendedProp(
        'subTaskTypeNew',
        kindOfSubEditTaskVal != 'Не выбрано' ? kindOfSubEditTaskVal : '',
      );
      editedEvent?.setExtendedProp('taskTypeNew', kindOfEditTasksVal);

      if (updatedMethods && isMethodsAvailable) {
        methodsFromServer
          ? editedEvent?.setExtendedProp('methods', [
              ...methodsFromServer,
              ...transformToMethods(updatedMethods, delID),
            ])
          : editedEvent?.setExtendedProp('methods', [
              ...transformToMethods(updatedMethods, delID),
            ]);
        editedEvent.setProp('classNames', 'bg-soft-secondary skeleton');
        refreshBtnAction(calendar);
      } else {
        editedEvent?.setExtendedProp('methods', methodsFromServer);
        // editedEvent.setProp('classNames', 'bg-soft-secondary skeleton');
        // refreshBtnAction(calendar);
      }

      if (justRemovedMethods && isMethodsAvailable) {
        const currentMethods = editedEvent._def.extendedProps.methods;
        const updateCurrentMethods = currentMethods?.filter((meth) => {
          const methName = Object.keys(meth)[0];
          return !justRemovedMethods.some(
            (removedMeth) => removedMeth.method === methName,
          );
        });

        editedEvent?.setExtendedProp('methods', updateCurrentMethods);
        editedEvent.setProp('classNames', 'bg-soft-secondary skeleton');
        refreshBtnAction(calendar);
      }

      if (
        !updatedMethods &&
        justRemovedMethods.length === 0 &&
        methodsFromServer &&
        isMethodsAvailable
      ) {
        editedEvent.setProp('classNames', 'bg-soft-secondary skeleton');
        refreshBtnAction(calendar);
      }

      // Функция для преобразования даты в формат, подходящий для создания объекта Date
      function convertDate(dateString) {
        let parts = dateString.split(' ');
        let dateParts = parts[0].split('.');
        let timeParts = parts[1].split(':');
        return new Date(
          dateParts[2],
          dateParts[1] - 1,
          dateParts[0],
          timeParts[0],
          timeParts[1],
        );
      }
      let newStartDate = convertDate(startEditDate);
      let newStartDateHours = newStartDate.getHours();
      if (newStartDateHours < parseInt(minViewTime)) {
        calendar.setOption('slotMinTime', `${newStartDateHours}:00:00`);
      }
      let newEndDate = convertDate(endEditDate);
      let newEndDateHours = newEndDate.getHours();
      if (newEndDateHours > parseInt(maxViewTime)) {
        calendar.setOption('slotMaxTime', `${newEndDateHours}:59:00`);
      }

      editedEvent?.setStart(newStartDate);
      editedEvent?.setEnd(newEndDate);
    }

    calendar.render();
  });
};

export default saveEditedTasks;
