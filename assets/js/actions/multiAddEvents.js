import * as C from '../config';
import {
  notChoosenCleaning,
  transformDateTime,
  transformToMethods,
} from '../utils/mainGlobFunctions';
import addMethodToBase from '../methods/addMethodToBase';
import grabMethodsDataTable from '../methods/grabMethodsDataTable';

const api = {
  srvv: C.srvv,
  addValueObjTrue: C.addValueObjTrue,
  deleteNodeURL: C.deleteNodeURL,
  createNodeUrl: C.createNodeUrl,
  getreportFormodule: C.getreportFormodule,
  GetExcelforCalc: C.GetExcelforCalc,
};

let justAddedDelID = '';
/**
 * Добавление множества задач в календарь с использованием кнопки Shift
 * @param {Array} multipleEventsArray
 * @param {Object} calendar
 */

export const multipleAddEventsToBase = (multipleEventsArray, calendar) => {
  // Элементы окна Мультидобавления задачи

  const multiKindOfTasks = document.querySelector('#multiKindOfTasks');
  const multiKindOfSubTask = document.querySelector('#multiKindOfSubTask');
  const multiEventTitle = document.querySelector('#multiEventTitle');
  const multiLongDesc = document.querySelector('#multiLongDesc');
  const multiTaskObj = document.querySelector('#multiTaskObj');
  const multiTaskCreator = document.querySelector('#multiTaskCreator');
  const multiEventSource = document.querySelector('#multiEventSource');
  const multiEventNotes = document.querySelector('#multiEventNotes');
  const multiLocations = document.querySelector('#multiLocObj');
  const multiEmployment = document.querySelector('#multiEmployment');

  let methodsTable;
  if (
    multiKindOfTasks.value === 'Техническое диагностирование' ||
    multiKindOfSubTask.value === 'Проведение контроля в лаборатории'
  ) {
    methodsTable = document.querySelector('.methods-tbody');
    console.log('methodsTable: ', methodsTable);
  }

  multipleEventsArray.forEach((eventLength) => {
    let massMethTbl;
    if (methodsTable) {
      massMethTbl = grabMethodsDataTable(methodsTable);
    }

    const eventDate = transformDateTime(eventLength.start).slice(0, 10);

    // Находим ParentID соответствующий дате

    const nessDateParentID = JSON.parse(
      localStorage.getItem('parentIdDataArr'),
    ).find((el) => Object.values(el)[0] === eventDate);
    const massparentID = Object.keys(nessDateParentID)[0];

    // Преобразование даты добавления события из объекта new Data() в dd.mm.yyyy

    const cleanTodayDate = eventDate;

    // Расчитываем затраченное время для каждого дня события

    const calcEventSpentTime = () => {
      const start = eventLength.start;
      const end = eventLength.end;

      const parsedStart = new Date(start);
      const parsedEnd = new Date(end);

      const diffDates = Math.abs(parsedEnd - parsedStart);
      const diffHours = diffDates / (1000 * 60 * 60);

      const isWorkedFromLS =
        localStorage.getItem('isWorked') ?? localStorage.getItem('isWorked');

      if (isWorkedFromLS === '0') {
        return 0;
      }

      return diffHours;
    };

    const kr = document.querySelector('#flexCheckDefault');
    const krState = (krelem) => {
      if (krelem && krelem.checked) {
        return 'Да';
      } else {
        return '';
      }
    };

    // МАССОВО ОТПРАВЛЯЕМ ЗАДАЧИ В БАЗУ

    let formDataMass = new FormData();

    formDataMass.append('ObjTypeID', C.OBJTYPEID);
    formDataMass.append('ParentID', massparentID);
    formDataMass.append('Data[0][name]', C.addZeroName);
    formDataMass.append('Data[0][value]', cleanTodayDate);
    formDataMass.append('Data[0][isName]', 'false');
    formDataMass.append('Data[0][maninp]', 'false');
    formDataMass.append('Data[0][GroupID]', C.dataGroupID);
    formDataMass.append('Data[1][name]', C.fifthCol);
    formDataMass.append(
      'Data[1][value]',
      multiTaskObj[multiTaskObj.options.selectedIndex].getAttribute(
        'objidattr',
      ) || '',
    );
    formDataMass.append('Data[1][isName]', 'false');
    formDataMass.append('Data[1][maninp]', 'false');
    formDataMass.append('Data[1][GroupID]', C.dataGroupID);
    formDataMass.append('Data[4][name]', C.fourthCol);
    formDataMass.append('Data[4][value]', multiEventTitle.value);
    formDataMass.append('Data[4][isName]', 'false');
    formDataMass.append('Data[4][maninp]', 'false');
    formDataMass.append('Data[4][GroupID]', C.dataGroupID);
    formDataMass.append('Data[5][name]', 't8106');
    formDataMass.append('Data[5][value]', multiLongDesc.value);
    formDataMass.append('Data[5][isName]', 'false');
    formDataMass.append('Data[5][maninp]', 'false');
    formDataMass.append('Data[5][GroupID]', C.dataGroupID);
    formDataMass.append('Data[6][name]', C.ninthCol);
    formDataMass.append('Data[6][value]', calcEventSpentTime());
    formDataMass.append('Data[6][isName]', 'false');
    formDataMass.append('Data[6][maninp]', 'false');
    formDataMass.append('Data[6][GroupID]', C.dataGroupID);
    formDataMass.append('Data[7][name]', C.tenthCol);
    formDataMass.append(
      'Data[7][value]',
      multiTaskCreator[multiTaskCreator.options.selectedIndex].getAttribute(
        'objidattr',
      ) || '',
    );
    formDataMass.append('Data[7][isName]', 'false');
    formDataMass.append('Data[7][maninp]', 'false');
    formDataMass.append('Data[7][GroupID]', C.dataGroupID);
    formDataMass.append('Data[8][name]', C.eleventhCol);
    formDataMass.append('Data[8][value]', multiEventSource.value);
    formDataMass.append('Data[8][isName]', 'false');
    formDataMass.append('Data[8][maninp]', 'false');
    formDataMass.append('Data[8][GroupID]', C.dataGroupID);
    formDataMass.append('Data[9][name]', 't8107');
    formDataMass.append('Data[9][value]', multiEventNotes.value);
    formDataMass.append('Data[9][isName]', 'false');
    formDataMass.append('Data[9][maninp]', 'false');
    formDataMass.append('Data[9][GroupID]', C.dataGroupID);
    formDataMass.append('Data[10][name]', C.userCol);
    formDataMass.append('Data[10][value]', localStorage.getItem('iddb'));
    formDataMass.append('Data[10][isName]', 'false');
    formDataMass.append('Data[10][maninp]', 'false');
    formDataMass.append('Data[10][GroupID]', C.dataGroupID);
    formDataMass.append('Data[11][name]', C.thirteenthCol);
    formDataMass.append(
      'Data[11][value]',
      transformDateTime(eventLength.start),
    );
    formDataMass.append('Data[11][isName]', 'false');
    formDataMass.append('Data[11][maninp]', 'false');
    formDataMass.append('Data[11][GroupID]', C.dataGroupID);
    formDataMass.append('Data[12][name]', C.fourteenthCol);
    formDataMass.append('Data[12][value]', transformDateTime(eventLength.end));
    formDataMass.append('Data[12][isName]', 'false');
    formDataMass.append('Data[12][maninp]', 'false');
    formDataMass.append('Data[12][GroupID]', C.dataGroupID);
    formDataMass.append('Data[13][name]', C.fifteenthCol);
    formDataMass.append(
      'Data[13][value]',
      notChoosenCleaning(multiLocations.value),
    );
    formDataMass.append('Data[13][isName]', 'false');
    formDataMass.append('Data[13][maninp]', 'false');
    formDataMass.append('Data[13][GroupID]', C.dataGroupID);
    formDataMass.append('Data[14][name]', '8852');
    formDataMass.append('Data[14][value]', krState(kr));
    formDataMass.append('Data[14][isName]', 'false');
    formDataMass.append('Data[14][maninp]', 'false');
    formDataMass.append('Data[14][GroupID]', C.dataGroupID);
    formDataMass.append('Data[15][value]', multiEmployment.value);
    formDataMass.append('Data[15][isName]', 'false');
    formDataMass.append('Data[15][maninp]', 'false');
    formDataMass.append('Data[15][GroupID]', C.dataGroupID);
    formDataMass.append('Data[15][name]', '9042');
    formDataMass.append('Data[16][name]', '9043');
    formDataMass.append(
      'Data[16][value]',
      multiKindOfTasks[multiKindOfTasks.options.selectedIndex].getAttribute(
        'taskid',
      ) || '',
    );
    formDataMass.append('Data[16][isName]', 'false');
    formDataMass.append('Data[16][maninp]', 'false');
    formDataMass.append('Data[16][GroupID]', C.dataGroupID);
    formDataMass.append('Data[17][name]', '9044');
    formDataMass.append('Data[17][isName]', 'false');
    formDataMass.append('Data[17][maninp]', 'false');
    formDataMass.append('Data[17][GroupID]', C.dataGroupID);
    formDataMass.append(
      'Data[17][value]',
      multiKindOfSubTask[multiKindOfSubTask.options.selectedIndex].getAttribute(
        'subtaskid',
      ) || '',
    );
    formDataMass.append('InterfaceID', C.dataInterfaceID);
    formDataMass.append('CalcParamID', C.addCalcParamID);
    formDataMass.append('isGetForm', '0');
    formDataMass.append('ImportantInterfaceID', '');
    formDataMass.append('Ignor39', '0');
    formDataMass.append('templ_mode', '0');

    fetch(C.srvv + C.createNodeUrl, {
      credentials: 'include',
      method: 'post',
      body: formDataMass,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const objID = data.results[0].object;
        console.log('🚀 ~ file: multiAddEvents.js:228 ~ .then ~ objID:', objID);
        justAddedDelID = objID;

        if (
          multiKindOfTasks.value === 'Техническое диагностирование' ||
          multiKindOfSubTask.value === 'Проведение контроля в лаборатории'
        ) {
          addMethodToBase(massMethTbl, objID, api);
        }

        // Добавление события на клиенте (без перезагрузки)

        calendar.addEvent({
          title: multiEventTitle.value,
          allDay: false,
          classNames: 'bg-soft-primary',
          start: eventLength.start,
          end: eventLength.end,
          extendedProps: {
            delID: justAddedDelID,
            director: multiTaskCreator.value,
            factTime: calcEventSpentTime(),
            fullDescription: multiLongDesc.value,
            notes: multiEventNotes.value,
            object:
              multiTaskObj.value === 'Не выбрано' ? '' : multiTaskObj.value,
            source: multiEventSource.value,
            subTaskType:
              multiKindOfSubTask.value === 'Не выбрано'
                ? ''
                : multiKindOfSubTask.value,
            taskType:
              multiKindOfTasks.value === 'Не выбрано'
                ? ''
                : multiKindOfTasks.value,
            location: multiLocations.value,
            kr: krState(kr),
            employment: multiEmployment.value,
            subTaskTypeNew:
              multiKindOfSubTask.value === 'Не выбрано'
                ? ''
                : multiKindOfSubTask.value,
            taskTypeNew:
              multiKindOfTasks.value === 'Не выбрано'
                ? ''
                : multiKindOfTasks.value,
            isApproved: '',
            methods: transformToMethods(massMethTbl, objID),
          },
        });
      });
  });
};
