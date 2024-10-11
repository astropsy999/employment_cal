import { EventApi } from '@fullcalendar/core';
import * as C from '../config'; 
import { getLocalStorageItem } from '../utils/localStirageUtils';

/**
 * Согласовывает список событий, отправляя запросы к API.
 * @param eventsToApprove - Массив событий для согласования
 * @returns Promise, который разрешается после обработки всех согласований
 */
export const approveEventsApi = (
  eventsToApprove: EventApi[],
): Promise<void[]> => {
  const managerName = getLocalStorageItem('managerName') || 'Неизвестный руководитель';
  const iddb = getLocalStorageItem('iddb') || '';

  const approvalPromises = eventsToApprove.map(async (event) => {
    const formDataApproved = new FormData();

    formDataApproved.append('ID', event.extendedProps.delID);
    formDataApproved.append('TypeID', '1094');
    formDataApproved.append('Data[0][name]', '9245');
    formDataApproved.append('Data[0][value]', managerName);
    formDataApproved.append('Data[0][isName]', 'false');
    formDataApproved.append('Data[0][maninp]', 'false');
    formDataApproved.append('Data[0][GroupID]', '2443');
    formDataApproved.append('ParentObjID', iddb);
    formDataApproved.append('CalcParamID', '-1');
    formDataApproved.append('InterfaceID', '1593');
    formDataApproved.append('ImportantInterfaceID', '');
    formDataApproved.append('templ_mode', 'false');
    formDataApproved.append('Ignor39', '0');

    try {
      const response = await fetch(`${C.srvv}${C.addValueObjTrue}`, {
        credentials: 'include',
        method: 'POST',
        body: formDataApproved,
      });
      if (!response.ok) {
        throw new Error(`Не удалось согласовать событие с ID: ${event.id}`);
      }
      // Обновляем расширенные свойства события после успешного согласования
      event.setExtendedProp('isApproved', managerName);
    } catch (error) {
      console.error('Ошибка при согласовании события:', error);
    }
  });

  // Возвращаем Promise, который разрешается после завершения всех запросов на согласование
  return Promise.all(approvalPromises);
};
