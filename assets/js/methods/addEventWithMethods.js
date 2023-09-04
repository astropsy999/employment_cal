import { Modal } from 'bootstrap';
/**
 * Функция для добавлиния события при наличии в задаче метода или таблицы методов
 * @param {*} firstEventObj
 * @param {*} methodsArray
 * @param {*} setViewAndDateToLS
 */
const addEventWithMethods = (
  firstEventObj,
  methodsArray,
  setViewAndDateToLS,
) => {
  const {
    OBJTYPEID,
    addCalcParamID,
    addZeroName,
    cleanTodayDate,
    dataGroupID,
    dataInterfaceID,
    eleventhCol,
    endDate,
    eventNotesVal,
    eventSourceVal,
    fifteenthCol,
    fifthCol,
    fourteenthCol,
    fourthCol,
    idDB,
    kindOfSubTaskID,
    kindOfTasksID,
    locationVal,
    longDeskVal,
    ninthCol,
    parentID,
    spentTimeVal,
    startDate,
    taskCreatorID,
    taskObjAttr,
    tenthCol,
    thirteenthCol,
    titleVal,
    userCol,
    srvv,
    createNodeUrl,
    employmentVal,
    calendar,
    krBase,
  } = firstEventObj;

  let formDataMet = new FormData();

  formDataMet.append('ObjTypeID', OBJTYPEID);
  formDataMet.append('ParentID', parentID);
  formDataMet.append('Data[0][name]', addZeroName);
  formDataMet.append('Data[0][value]', cleanTodayDate);
  formDataMet.append('Data[0][isName]', 'false');
  formDataMet.append('Data[0][maninp]', 'false');
  formDataMet.append('Data[0][GroupID]', dataGroupID);
  formDataMet.append('Data[1][name]', fifthCol);
  formDataMet.append('Data[1][value]', taskObjAttr);
  formDataMet.append('Data[1][isName]', 'false');
  formDataMet.append('Data[1][maninp]', 'false');
  formDataMet.append('Data[1][GroupID]', dataGroupID);
  formDataMet.append('Data[4][name]', fourthCol);
  formDataMet.append('Data[4][value]', titleVal);
  formDataMet.append('Data[4][isName]', 'false');
  formDataMet.append('Data[4][maninp]', 'false');
  formDataMet.append('Data[4][GroupID]', dataGroupID);
  formDataMet.append('Data[5][name]', 't8106');
  formDataMet.append('Data[5][value]', longDeskVal);
  formDataMet.append('Data[5][isName]', 'false');
  formDataMet.append('Data[5][maninp]', 'false');
  formDataMet.append('Data[5][GroupID]', dataGroupID);
  formDataMet.append('Data[6][name]', ninthCol);
  formDataMet.append('Data[6][value]', spentTimeVal);
  formDataMet.append('Data[6][isName]', 'false');
  formDataMet.append('Data[6][maninp]', 'false');
  formDataMet.append('Data[6][GroupID]', dataGroupID);
  formDataMet.append('Data[7][name]', tenthCol);
  formDataMet.append('Data[7][value]', taskCreatorID);
  formDataMet.append('Data[7][isName]', 'false');
  formDataMet.append('Data[7][maninp]', 'false');
  formDataMet.append('Data[7][GroupID]', dataGroupID);
  formDataMet.append('Data[8][name]', eleventhCol);
  formDataMet.append('Data[8][value]', eventSourceVal);
  formDataMet.append('Data[8][isName]', 'false');
  formDataMet.append('Data[8][maninp]', 'false');
  formDataMet.append('Data[8][GroupID]', dataGroupID);
  formDataMet.append('Data[9][name]', 't8107');
  formDataMet.append('Data[9][value]', eventNotesVal);
  formDataMet.append('Data[9][isName]', 'false');
  formDataMet.append('Data[9][maninp]', 'false');
  formDataMet.append('Data[9][GroupID]', dataGroupID);
  formDataMet.append('Data[10][name]', userCol);
  formDataMet.append('Data[10][value]', idDB);
  formDataMet.append('Data[10][isName]', 'false');
  formDataMet.append('Data[10][maninp]', 'false');
  formDataMet.append('Data[10][GroupID]', dataGroupID);
  formDataMet.append('Data[11][name]', thirteenthCol);
  formDataMet.append('Data[11][value]', startDate);
  formDataMet.append('Data[11][isName]', 'false');
  formDataMet.append('Data[11][maninp]', 'false');
  formDataMet.append('Data[11][GroupID]', dataGroupID);
  formDataMet.append('Data[12][name]', fourteenthCol);
  formDataMet.append('Data[12][value]', endDate);
  formDataMet.append('Data[12][isName]', 'false');
  formDataMet.append('Data[12][maninp]', 'false');
  formDataMet.append('Data[12][GroupID]', dataGroupID);
  formDataMet.append('Data[13][name]', fifteenthCol);
  formDataMet.append('Data[13][value]', locationVal);
  formDataMet.append('Data[13][isName]', 'false');
  formDataMet.append('Data[13][maninp]', 'false');
  formDataMet.append('Data[13][GroupID]', dataGroupID);
  formDataMet.append('Data[17][name]', '8852');
  formDataMet.append('Data[17][value]', krBase);
  formDataMet.append('Data[17][isName]', 'false');
  formDataMet.append('Data[17][maninp]', 'false');
  formDataMet.append('Data[17][GroupID]', dataGroupID);
  formDataMet.append('Data[14][name]', '9042');
  formDataMet.append('Data[14][isName]', 'false');
  formDataMet.append('Data[14][maninp]', 'false');
  formDataMet.append('Data[14][GroupID]', dataGroupID);
  formDataMet.append('Data[14][value]', employmentVal);
  formDataMet.append('Data[15][name]', '9043');
  formDataMet.append('Data[15][isName]', 'false');
  formDataMet.append('Data[15][maninp]', 'false');
  formDataMet.append('Data[15][GroupID]', dataGroupID);
  formDataMet.append('Data[15][value]', kindOfTasksID);
  formDataMet.append('Data[16][name]', '9044');
  formDataMet.append('Data[16][isName]', 'false');
  formDataMet.append('Data[16][maninp]', 'false');
  formDataMet.append('Data[16][GroupID]', dataGroupID);
  formDataMet.append('Data[16][value]', kindOfSubTaskID);
  formDataMet.append('InterfaceID', dataInterfaceID);
  formDataMet.append('CalcParamID', addCalcParamID);
  formDataMet.append('isGetForm', '0');
  formDataMet.append('ImportantInterfaceID', '');
  formDataMet.append('Ignor39', '0');
  formDataMet.append('templ_mode', '0');

  fetch(srvv + createNodeUrl, {
    credentials: 'include',
    method: 'post',
    body: formDataMet,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('data: ', data);

      const { object, parent } = data.results[0];

      Modal.getInstance(addEventModal).hide();

      // Добавляем Методы

      methodsArray.forEach((element) => {
        const { method, params } = element;

        const { duration, objects, zones } = params;

        let formDataaddMet = new FormData();

        formDataaddMet.append('ObjTypeID', '1149');
        formDataaddMet.append('ParentID', object);
        formDataaddMet.append('Data[0][name]', '8764');
        formDataaddMet.append('Data[0][value]', method);
        formDataaddMet.append('Data[0][isName]', 'true');
        formDataaddMet.append('Data[0][maninp]', 'false');
        formDataaddMet.append('Data[0][GroupID]', '2549');
        formDataaddMet.append('Data[1][name]', '8767');
        formDataaddMet.append('Data[1][value]', duration);
        formDataaddMet.append('Data[1][isName]', 'false');
        formDataaddMet.append('Data[1][maninp]', 'false');
        formDataaddMet.append('Data[1][GroupID]', '2549');
        formDataaddMet.append('Data[2][name]', '8766');
        formDataaddMet.append('Data[2][value]', objects);
        formDataaddMet.append('Data[2][isName]', 'false');
        formDataaddMet.append('Data[2][maninp]', 'false');
        formDataaddMet.append('Data[2][GroupID]', '2549');
        formDataaddMet.append('Data[3][name]', '8765');
        formDataaddMet.append('Data[3][value]', zones);
        formDataaddMet.append('Data[3][isName]', 'false');
        formDataaddMet.append('Data[3][maninp]', 'false');
        formDataaddMet.append('Data[3][GroupID]', '2549');
        formDataaddMet.append('InterfaceID', '1685');
        formDataaddMet.append('CalcParamID', '-1');
        formDataaddMet.append('isGetForm', '0');
        formDataaddMet.append('ImportantInterfaceID', '');
        formDataaddMet.append('Ignor39', '1');
        formDataaddMet.append('templ_mode', '0');

        if (method !== 'Не выбрано' && duration !== '') {
          fetch(srvv + createNodeUrl, {
            credentials: 'include',
            method: 'post',
            body: formDataaddMet,
          })
            .then((response) => {
              location.reload();
              return response.json();
            })
            .then((data) => {
              const { object, parent } = data.results[0];
              setViewAndDateToLS(calendar);
            });
        } else {
          setViewAndDateToLS(calendar);
        }
      });
    });
};

export default addEventWithMethods;
