import * as C from '../config';

export const approveEmployment = async (delID: string, managerName: string, iddb: string) => {
  const formDataApproved = new FormData();
  formDataApproved.append('ID', delID);
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

  const response = await fetch(`${C.srvv}${C.addValueObjTrue}`, {
    credentials: 'include',
    method: 'POST',
    body: formDataApproved,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response;
};

export const lockOrUnlockEmployment = async (data: any) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  const response = await fetch(`${C.srvv}${C.cacheAddTable}`, {
    credentials: 'include',
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to lock/unlock employment');
  }

  return response;
};

export const saveCache = async () => {
  const formDataSaveCache = new FormData();
  formDataSaveCache.append('InterfaceID', '1792');
  formDataSaveCache.append('ParrentObjHighTab', '-1');
  formDataSaveCache.append('RapidCalc', '0');
  formDataSaveCache.append('Ignore39', '0');

  const response = await fetch(`${C.srvv}${C.cacheSaveTable}`, {
    credentials: 'include',
    method: 'POST',
    body: formDataSaveCache,
  });

  if (!response.ok) {
    throw new Error('Failed to save cache');
  }

  return response;
};
