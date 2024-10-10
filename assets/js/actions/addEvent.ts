
import { Calendar } from '@fullcalendar/core';
import * as GDD from '../api/getDropDownData';
import { selValidation } from '../utils/mainGlobFunctions';
import { addEventToUser } from './addEventToUser';
import { getLocalStorageItem } from '../utils/localStorageUtils';

/**
 * Добавление задачи в календарь с помощью обычного выделения или кнопки Добавить
 * @param {Object} calendar - объект календаря
 * @returns
 */
export const addEventToCal = (calendar: Calendar) => {
  const iddb = getLocalStorageItem('iddb');

  const eventTaskModalBtn = document.querySelector('#addTaskToCalBtn') as HTMLButtonElement;

  // Получаем элементы формы добавления событий

  const kindOfTasks = document.querySelector('#kindOfTasks') as HTMLSelectElement;
  const kindOfSubTask = document.querySelector('#kindOfSubTask') as HTMLSelectElement;
  const multiKindOfTasks = document.querySelector('#multiKindOfTasks') as HTMLSelectElement;
  const multiKindOfSubTask = document.querySelector('#multiKindOfSubTask') as HTMLSelectElement;
  const taskObj = document.querySelector('#taskObj') as HTMLSelectElement;
  const taskCreator = document.querySelector('#taskCreator') as HTMLSelectElement;
  const locations = document.querySelector('#locObj') as HTMLSelectElement;
  const employment = document.querySelector('#employment') as HTMLSelectElement;
  const dataObj = JSON.parse(sessionStorage.getItem('dataObj')!);
  const dataCreator = JSON.parse(sessionStorage.getItem('dataCreator')!);
  const locObj = JSON.parse(sessionStorage.getItem('locObj')!);
  const emplObj = JSON.parse(sessionStorage.getItem('emplObj')!);

  // Помечаем обязательные элементы формы

  selValidation(locations);
  selValidation(kindOfTasks);

  // Занятость

  GDD.addDataToSelector(employment, emplObj);

  // Объекты

  GDD.addDataToSelector(taskObj, dataObj);

  // Постановщик

  GDD.addDataToSelector(taskCreator, dataCreator);

  // Локации

  GDD.addDataToSelector(locations, locObj);

  // Список видов

  GDD.getTypesOfWorkOptions(kindOfTasks, kindOfSubTask, iddb);
  GDD.getTypesOfWorkOptions(multiKindOfTasks, multiKindOfSubTask, iddb);

  eventTaskModalBtn?.removeEventListener('click', addEventToUser(calendar));
  eventTaskModalBtn?.addEventListener('click', addEventToUser(calendar));

  return;
};
