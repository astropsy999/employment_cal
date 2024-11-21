// @ts-ignore
import * as c from '../config';
import { initials } from '../utils/textsUtils';

/**
 * Проверка на Руководителя, параметром подставляется ID пользователя
 */

export const isManager = async (userID: string): Promise<{ isMan: boolean, managerName: string, managerLevel: string } | boolean> => {
  let isManagerFD = new FormData();

  isManagerFD.append('InterfaceID', c.ParentTabID);
  isManagerFD.append('iddb', userID);
  isManagerFD.append('GroupID', '2432');
  isManagerFD.append('ObjTypeID', '871');
  isManagerFD.append('ParentID', '-1');
  isManagerFD.append('ModalName', '0');
  isManagerFD.append('iddbParentModal', '');
  isManagerFD.append('ImportantInterfaceID', '');
  isManagerFD.append('GlobalInterfaceID', c.ParentTabID);
  isManagerFD.append('templ_mode', 'false');

  const res = await fetch(c.srvv + c.BuildWindowForm, {
    credentials: 'include',
    method: 'post',
    body: isManagerFD,
  })
    .then((response) => {
      let r = response.json();
      return r;
    })
    .catch(function (error) {
      console.log('Не удалось получить данные / Mo Miracle', error);
    });

  const isMyEmpl =
    res?.TreeContent.find((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
      Object.values(item).includes('Моя занятость'),
    ) ?? '';


  const managerLevel = isMyEmpl.ParamsDATA.find((item: { [s: string]: unknown; } | ArrayLike<unknown>) =>
    Object.values(item).includes('Уровень рук-ля'),
  ).Value;



  const managerName = res?.Name !== undefined ? initials(res.Name) : '';

  const isUserManager = isMyEmpl?.ParamsDATA[0]?.Value;

  if (isUserManager === 'Да') {
    localStorage.setItem('managerLevel', managerLevel);
    sessionStorage.setItem('isMan', JSON.stringify(true));
  
    return { isMan: true, managerName, managerLevel };
  } else {
    return false;
  }
};
