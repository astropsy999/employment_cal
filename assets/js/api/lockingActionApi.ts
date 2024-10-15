import * as C from '../config';
  interface RequestBody {
    Value: string;
    UserTabID: number | null;
    UnitID: string;
    UnitName: string;
    isOnlyYear: boolean;
    OrigValue: string;
    ParamID: number;
    ObjID: string;
    InterfaceID: number;
    GroupID: number;
    ObjTypeID: number;
    ParrentObjHighTab: number;
    ParamID_TH: number | null;
    Name_TH: string;
    Array: number;
  }
  
  /**
   * Функция для выполнения API запросов при блокировке/разблокировке.
   * @param weekToBlockIDs Массив идентификаторов объектов для блокировки.
   * @param isLocked Флаг состояния блокировки.
   */
  export async function lockingActionApi(
    weekToBlockIDs: string[],
    isLocked: boolean,
  ): Promise<void> {
    const managerName = localStorage.getItem('managerName') || '';
    
    try {
      for (const ObjID of weekToBlockIDs) {
        const requestBody: RequestBody = {
          Value: !isLocked ? managerName : '',
          UserTabID: null,
          UnitID: '',
          UnitName: '',
          isOnlyYear: false,
          OrigValue: '',
          ParamID: 9249,
          ObjID,
          InterfaceID: 1792,
          GroupID: 2720,
          ObjTypeID: 1040,
          ParrentObjHighTab: -1,
          ParamID_TH: null,
          Name_TH: 'Блокировка для календаря',
          Array: 0,
        };
  
        const formDataLocked = new FormData();
        formDataLocked.append('data', JSON.stringify(requestBody));
  
        const addTableResponse = await fetch(`${C.srvv}${C.cacheAddTable}`, {
          credentials: 'include',
          method: 'POST',
          body: formDataLocked,
        });
  
        if (addTableResponse.ok) {
          const formDataSaveCache = new FormData();
          formDataSaveCache.append('InterfaceID', '1792');
          formDataSaveCache.append('ParrentObjHighTab', '-1');
          formDataSaveCache.append('RapidCalc', '0');
          formDataSaveCache.append('Ignore39', '0');
  
          const saveCacheResponse = await fetch(`${C.srvv}${C.cacheSaveTable}`, {
            credentials: 'include',
            method: 'POST',
            body: formDataSaveCache,
          });
  
          if (!saveCacheResponse.ok) {
            console.error(`Ошибка при сохранении кеша для ObjID: ${ObjID}`);
          }
        } else {
          console.error(`Ошибка при добавлении таблицы для ObjID: ${ObjID}`);
        }
      }
    } catch (error) {
      console.error('Ошибка в lockingActionApi:', error);
    }
  }
  