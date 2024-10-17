import { findParentID } from '../actions/eventsActions';
import * as c from '../config';
import { getLocalStorageItem } from '../utils/localStorageUtils';
import { notChoosenCleaning } from '../utils/mainGlobFunctions';

interface AddEventParams {
  eventStartDate: HTMLInputElement;
  eventEndDate: HTMLInputElement;
  eventTitle: HTMLInputElement;
  longDesc: HTMLTextAreaElement;
  taskObj: HTMLSelectElement;
  taskCreator: HTMLSelectElement;
  eventSpentTime: HTMLInputElement;
  eventSource: HTMLSelectElement;
  eventNotes: HTMLTextAreaElement;
  locations: HTMLSelectElement;
  employment: HTMLSelectElement;
  kr: HTMLInputElement;
  iddb: string;
  krState: (krelem: HTMLInputElement) => string;
  kindOfTasks: HTMLSelectElement;
  kindOfSubTask: HTMLSelectElement;
}

interface ApiResponse {
  results: Array<{
    object: string;
  }>;
}

export const addEventToUserApi = async ({
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
  kr,
  iddb,
  krState,
  kindOfTasks,
  kindOfSubTask,
}: AddEventParams): Promise<string> => {
  const parentIdDataArr = getLocalStorageItem('parentIdDataArr');
  const parentID = findParentID(parentIdDataArr, eventStartDate.value);
  const cleanTodayDate = eventStartDate.value.slice(0, 10);

  const formDataEv2 = new FormData();

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
    taskObj.options[taskObj.selectedIndex].getAttribute('objidattr') || '',
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
    taskCreator.options[taskCreator.selectedIndex].getAttribute('objidattr') || '',
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
    notChoosenCleaning(locations.value),
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
    kindOfTasks.options[kindOfTasks.selectedIndex].getAttribute('taskid') || '',
  );
  formDataEv2.append('Data[15][isName]', 'false');
  formDataEv2.append('Data[15][maninp]', 'false');
  formDataEv2.append('Data[15][GroupID]', c.dataGroupID);
  formDataEv2.append('Data[16][name]', '9044');
  formDataEv2.append(
    'Data[16][value]',
    kindOfSubTask.options[kindOfSubTask.selectedIndex].getAttribute('subtaskid') || '',
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

  try {
    const response = await fetch(c.srvv + c.createNodeUrl, {
      credentials: 'include',
      method: 'post',
      body: formDataEv2,
    });

    if (!response.ok) {
      throw new Error(`Ошибка сети: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    const objID = data.results[0].object;
    return objID;
  } catch (error) {
    console.error('Ошибка при отправке события в API:', error);
    throw error;
  }
};
