import { EventClickArg } from "@fullcalendar/core";
import { MethodDetails, MethodParams } from "../types/methods";
import { initialsStr } from "../utils/textsUtils";

export const eventContent = function (info: EventClickArg) {

  const {
    methods, 
    object, 
    taskType, 
    taskTypeNew, 
    subTaskType, 
    subTaskTypeNew,
    fullDescription: fullDesc,
    location: loc,
    factTime,
    isApproved
  } = info.event._def.extendedProps;
  const { title } = info.event._def;

  const elements = {
    contentLayoutHeader: document.createElement('div'),
    location: document.createElement('div'),
    eventObject: document.createElement('div'),
    eventTimeNameWrapper: document.createElement('div'),
    eventTaskType: document.createElement('div'),
    eventTaskSubType: document.createElement('div'),
    eventMethodsWrapper: document.createElement('div'),
    fullDescription: document.createElement('div'),
    
  };
  
type MethodParams = Record<string, MethodDetails>;

/**
 * Форматирует массив методов в HTML строку с отображением деталей.
 * Добавляет иконку бригадира и делает список команды серым, если isBrigadier === true.
 * @param methodsArr Массив методов с их параметрами.
 * @returns Отформатированная HTML строка.
 */
const formatEventMethods = (methodsArr: MethodParams[]): string => {
  if (!methodsArr || methodsArr.length === 0) return '';

  return methodsArr.map(method => {
      const methodName = Object.keys(method)[0];
      const details = method[methodName];

      const { objQuant, zones, duration, teamList, isBrigadier } = details;

      // Формирование текста метода
      const methodText = `${methodName}-${duration}ч`;

      // Формирование текста списка команды с инициалами
      let teamListText = '';
      if (teamList) {
          const initials = initialsStr(teamList);
          if (isBrigadier) {
              // Иконка бригадира (используем fa-star из FontAwesome 4) и серый цвет для списка
              teamListText = `<i class="fa fa-star" aria-hidden="true"></i> [${initials}]`;
          } else {
              teamListText = `[${initials}]`;
          }
      }

      // Формирование текста зон и объектов
      let zonesText = '(-)';
      const zonesParts: string[] = [];
      if (objQuant) zonesParts.push(`об-${objQuant}`);
      if (zones) zonesParts.push(`зон-${zones}`);
      if (zonesParts.length > 0) zonesText = `(${zonesParts.join(',')})`;

      // Проверка на выбор "Не выбрано"
      const isUnselected = methodText.startsWith('Не выбрано');

      // Формирование окончательного HTML блока
      return `<span>
                  ${isUnselected ? '' : methodText} 
                  <span style="font-size: 10px;">
                      ${zonesText !== '(-)' ? zonesText : ''} 
                      <span style="color: grey;">${teamListText}</span>
                  </span>
              </span>`;
  }).join('<br>');
};


  // Добавляем классы к элементам для отображения
  elements.eventTimeNameWrapper.classList.add('eventTimeNameWrapper');
  elements.eventTaskType.classList.add('eventTaskType');
  elements.eventTaskSubType.classList.add('eventTaskSubType');
  elements.eventMethodsWrapper.classList.add('eventMethodsWrapper');


  const addObjectClass = object && object !== 'Не выбрано';

  if (addObjectClass) {
    elements.eventObject.classList.add('eventObject');
  }
  elements.fullDescription.classList.add('fullDescription');

  // Помещаем данные для отображения

  elements.eventMethodsWrapper.innerHTML = `<div>${formatEventMethods(
    methods,
  )}</div>`;

  elements.eventObject.innerHTML = addObjectClass ? object : '';
  elements.eventTaskType.innerHTML = taskType || taskTypeNew;
  elements.eventTaskSubType.innerHTML = subTaskType || subTaskTypeNew;
  elements.fullDescription.innerHTML = fullDesc;
  elements.location.innerHTML = loc !== 'Не выбрано' ? loc : '';

  elements.contentLayoutHeader.innerHTML = `<div class="contentLayoutHeader">
  <div class="factTime"><b>${factTime}</b>ч</div><div class="title mb-1">${title}</div>
  <div class="approvedMark">${isApproved ? `<i class="bi bi-check2-square text-success text-xl" title="${isApproved}"></i>` : ''}</div>
  </div>`;


  return { domNodes: Object.values(elements) };
};
