import * as C from '../config';
/**
 * Сохранение отредактированных данных в таблице методов
 * @param {*} eventEditObj
 */
const saveEditedTasks = (eventEditObj) => {
  const {
    delID,
    dataObjID,
    fourthCol,
    fifthCol,
    dataGroupID,
    kindOfEditTasksID,
    kindOfSubEditTaskID,
    titleEditVal,
    longEditDeskVal,
    ninthCol,
    spentEditTimeVal,
    tenthCol,
    taskEditCreatorID,
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
    setViewAndDateToLS,
    calendar,
    krBase,
    emplEditVal,
    methodsFromServer,
    savedTaskFromServer,
    kindOfEditTasksVal,
  } = eventEditObj;

  /**
   * Удаление всех методов если был изменен Вид работ при редактировании
   * @param {*} methodsFromServer
   */

  const deleteAllMethodsIfChangedType = (methodsFromServer) => {
    const methDelIDArr = [];
    methodsFromServer.forEach((delId) => {
      methDelIDArr.push(Object.values(delId)[0]['editID']);
    });
    console.log('methDelIDArr: ', methDelIDArr);

    console.log('deleteAllMethodsIfChangedType СТАРТ! ');

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
  })
    .then((response) => {
      // return
    })
    .then((data) => {
      // Добавляем Методы
      setViewAndDateToLS(calendar);

      location.reload();
    });
};

export default saveEditedTasks;
