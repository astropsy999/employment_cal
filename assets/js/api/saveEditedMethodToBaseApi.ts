import { addValueObjTrue, srvv } from '../config';
import { MethodData } from '../types/methods';
import { sumUneditedMethodsTime } from '../utils/methodsUtils';
import { isInvalidElem } from '../utils/toggleElem';

interface SaveEditedMethodApiParams {
  methData: MethodData;
  editSaveTaskBtn: HTMLButtonElement | null;
  editedSpentTime: HTMLInputElement;
}

const saveEditedMethodToBaseApi = ({
  methData,
  editSaveTaskBtn,
  editedSpentTime,
}: SaveEditedMethodApiParams): void => {
  const { methVal, durVal, objqVal, zonesVal, editID } = methData;

  const editEventModal = document.querySelector('#editEventModal');
  const delID = editEventModal?.getAttribute('delID') as string;

  const methodsTbody = editEventModal?.querySelector('.methods-tbody') as HTMLElement;

  const allMethodsTimeSum = sumUneditedMethodsTime(methodsTbody);
  const editedSpentTimeValue = parseFloat(editedSpentTime.value);

  if (allMethodsTimeSum > editedSpentTimeValue) {
    isInvalidElem(editedSpentTime);

    const timeHeader = document.querySelector(
      'th[scope="col"]:nth-of-type(2)',
    ) as HTMLTableCellElement;
    timeHeader.textContent = `Время методов не может быть > ${editedSpentTimeValue}ч`;
    timeHeader.style.border = '2px solid red';
    timeHeader.style.color = 'red';
    editSaveTaskBtn?.setAttribute('disabled', 'disabled');

    return;
  }

  let formDataEdMeth = new FormData();

  formDataEdMeth.append('ID', editID);
  formDataEdMeth.append('TypeID', '1149');
  formDataEdMeth.append('Data[0][name]', '8764');
  formDataEdMeth.append('Data[0][value]', methVal);
  formDataEdMeth.append('Data[0][isName]', 'true');
  formDataEdMeth.append('Data[0][maninp]', 'false');
  formDataEdMeth.append('Data[0][GroupID]', '2549');
  formDataEdMeth.append('Data[1][name]', '8767');
  formDataEdMeth.append('Data[1][value]', durVal);
  formDataEdMeth.append('Data[1][isName]', 'false');
  formDataEdMeth.append('Data[1][maninp]', 'false');
  formDataEdMeth.append('Data[1][GroupID]', '2549');
  formDataEdMeth.append('Data[2][name]', '8766');
  formDataEdMeth.append('Data[2][value]', objqVal);
  formDataEdMeth.append('Data[2][isName]', 'false');
  formDataEdMeth.append('Data[2][maninp]', 'false');
  formDataEdMeth.append('Data[2][GroupID]', '2549');
  formDataEdMeth.append('Data[3][name]', '8765');
  formDataEdMeth.append('Data[3][value]', zonesVal);
  formDataEdMeth.append('Data[3][isName]', 'false');
  formDataEdMeth.append('Data[3][maninp]', 'false');
  formDataEdMeth.append('Data[3][GroupID]', '2549');
  formDataEdMeth.append('ParentObjID', delID);
  formDataEdMeth.append('CalcParamID', '-1');
  formDataEdMeth.append('InterfaceID', '1685');
  formDataEdMeth.append('ImportantInterfaceID', '');
  formDataEdMeth.append('templ_mode', 'false');
  formDataEdMeth.append('Ignor39', '1');

  fetch(srvv + addValueObjTrue, {
    credentials: 'include',
    method: 'post',
    body: formDataEdMeth,
  })
    .then((response) => {
      console.log('Данные метода сохранены');
      return response.json();
    })
    .catch((error) => {
      console.error('Ошибка отправки данных по методу', error);
    });
};

export default saveEditedMethodToBaseApi;


