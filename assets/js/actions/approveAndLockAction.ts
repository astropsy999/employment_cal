import * as C from '../config';
import { Calendar } from '@fullcalendar/core';
import { getLocalStorageItem } from '../utils/localStorageUtils';

/**
 * Обрабатывает согласование и блокировку выбранных дат.
 * @param selectedObjIDs - Массив ObjID для согласования и блокировки.
 * @param calendar - Экземпляр календаря FullCalendar.
 */
export const approveAndLockAction = async (
  selectedObjIDs: string[],
  calendar: Calendar,
) => {
  const yesOnPopover = document.querySelector('.yesOnPopover') as HTMLElement;
  const managerName = getLocalStorageItem('managerName') || 'Unknown Manager';

  try {
    for (const ObjID of selectedObjIDs) {
      const formDataApproved = new FormData();
      formDataApproved.append('ID', ObjID);
      formDataApproved.append('TypeID', '1094');
      formDataApproved.append('Data[0][name]', '9245');
      formDataApproved.append('Data[0][value]', managerName);
      formDataApproved.append('Data[0][isName]', 'false');
      formDataApproved.append('Data[0][maninp]', 'false');
      formDataApproved.append('Data[0][GroupID]', '2443');
      formDataApproved.append('ParentObjID', getLocalStorageItem('iddb')!);
      formDataApproved.append('CalcParamID', '-1');
      formDataApproved.append('InterfaceID', '1593');
      formDataApproved.append('ImportantInterfaceID', '');
      formDataApproved.append('templ_mode', 'false');
      formDataApproved.append('Ignor39', '0');

      const response = await fetch(C.srvv + C.addValueObjTrue, {
        credentials: 'include',
        method: 'post',
        body: formDataApproved,
      });

      if (!response.ok) {
        throw new Error(`Failed to approve ObjID: ${ObjID}`);
      }

      yesOnPopover.textContent = 'Согласовано';

      // Обновление календаря
      const event = calendar.getEventById(ObjID);
      if (event) {
        event.setExtendedProp('isApproved', managerName);
        // event.dropable = false; // Если необходимо
      }
    }

    // После согласования выполняем блокировку
    const lockBtn = document.querySelector('.lockBtn') as HTMLButtonElement;
    if (lockBtn) {
      lockBtn.click();
    }
  } catch (error) {
    console.error('Ошибка при согласовании:', error);
    alert('Произошла ошибка при согласовании. Пожалуйста, попробуйте снова.');
  }
};
