import { isManager } from '../api/isManager';
// @ts-ignore
import { getUsersForManagers } from '../api/getDropDownData';
// @ts-ignore
import { filterUsersFormanagers } from './filterUsersFormanagers';
import { setLocalStorageItem } from '../utils/localStorageUtils';

/**
 * Функция проверяет статус пользователя (Руководитель или Нет) и добавляет для руководителя
 * селектор в шапке календаря, подгружая из базы Фамилию И.О. сотрудников, сортируя их по алфавиту
 * Если не руководитель, то ничего не делает
 */

export const usersForManagersSelector = async (userID: string) => {
  /**
   * Проверка на Руководителя
   */

  let { isMan, managerName, managerLevel } =  await isManager(userID);

  sessionStorage.setItem('isMan', JSON.stringify(isMan));
  sessionStorage.setItem('managerName', JSON.stringify(managerName));
  sessionStorage.setItem('managerLevel', JSON.stringify(managerLevel));

  if (isMan) {
    // Уровень текущего руководителя
    localStorage.setItem('currentManagerLevel', managerLevel!);
    setLocalStorageItem('managerName', managerName!);
    setLocalStorageItem('selectedUserName', managerName!);
    localStorage.setItem('isMan', isMan);
    /**
     * Получения элемента , куда будет помещен новый селектор сотрудников и добавление в него селектора
     */
    let usersSelectorEl = document.createElement('div');
    usersSelectorEl?.classList.add('otherUsersWrapper');
    usersSelectorEl.innerHTML = `<span class="skeleton-loader"></span><select class="form-select" id="otherUsers" name="director">
    <option value="Не выбрано" hidden>Не выбрано</option></select>`;

    /**
     * Селектор подразделений
     */
    let depSelectorEl = document.createElement('div');
    depSelectorEl.classList.add('depWrapper');
    depSelectorEl.innerHTML = `<span class="skeleton-loader"></span><select class="form-select" id="otherUsersDepths" name="director">
    <option value="Все отделы">Все отделы</option></select>`;

    const otherUsersWrapperID = document.querySelector('#otherUsersWrapperID');
    otherUsersWrapperID!.insertAdjacentElement('afterbegin', usersSelectorEl);
    otherUsersWrapperID!.insertAdjacentElement('afterbegin', depSelectorEl);
    const skeletonLoader = document.querySelector('.skeleton-loader');

    const userSelectorWidth = usersSelectorEl.offsetWidth; // Получаем ширину элемента userSelectorEl

    (skeletonLoader! as HTMLElement).style.width = `${
      userSelectorWidth + depSelectorEl.offsetWidth
    }px`; // Присваиваем ширину элементу skeletonLoader
    getUsersForManagers(userID, managerName);
    depSelectorEl.removeEventListener('change', filterUsersFormanagers);
    depSelectorEl.addEventListener('change', filterUsersFormanagers);

    /**
     * Кнопка согласования
     */

    const approveBtn = document.createElement('div');
    approveBtn.innerHTML = `<button class="btn btn-falcon-success btn-sm btn-report m-1 approveBtn" id="approveBtn" type="button" title="Согласовать фактическую занятость">
              <i class="bi bi-check2-square"></i><span class="mobile-hide-text"></span>
            </button>`;
    otherUsersWrapperID!.insertAdjacentElement('afterbegin', approveBtn);

    /**
     * Кнопка блокировки
     */

    const lockBtn = document.createElement('div');
    lockBtn.innerHTML = `<button class="btn btn-falcon-danger btn-sm btn-report m-1 lockBtn blockedApprove" id="lockBtn" type="button" data-toggle="modal" data-target="#approveEmplModal" title="Заблокировать неделю">
              <i class="bi bi-unlock-fill text-success"></i><span class="mobile-hide-text"></span>
            </button>`;
    otherUsersWrapperID!.insertAdjacentElement('afterbegin', lockBtn);
  }
};
