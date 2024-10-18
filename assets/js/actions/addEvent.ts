import { Calendar } from '@fullcalendar/core';
import { selValidation } from '../utils/mainGlobFunctions';
import { addEventToUser } from './addEventToUser';
import * as GDD from '../api/getDropDownData';

/**
 * Добавление задачи в календарь с помощью обычного выделения или кнопки Добавить
 * @param {Object} calendar - объект календаря
 * @returns
 */
export const addEventToCal = (calendar: Calendar) => {
  const iddb = localStorage.getItem('iddb');

  const eventTaskModalBtn = document.querySelector('#addTaskToCalBtn');

  // Получаем элементы формы добавления событий

  const kindOfTasks = document.querySelector('#kindOfTasks');
  const kindOfSubTask = document.querySelector('#kindOfSubTask');
  const multiKindOfTasks = document.querySelector('#multiKindOfTasks');
  const multiKindOfSubTask = document.querySelector('#multiKindOfSubTask');
  const taskObj = document.querySelector('#taskObj');
  const taskCreator = document.querySelector('#taskCreator');
  const locations = document.querySelector('#locObj');
  const employment = document.querySelector('#employment');
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
