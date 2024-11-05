import { EventClickArg } from "@fullcalendar/core";
import { MethodParams } from "../types/methods";

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
  const formatEventMethods = (methodsArr: MethodParams[]) => {
    if (!methodsArr) return '';
  
    return methodsArr.map((meth) => {
      const { objQuant, zones, duration } = Object.values(meth)[0];
      const methodText = `${Object.keys(meth)[0]}-${duration}ч`;
      const zonesText = objQuant && zones ? `(об-${objQuant},зон-${zones})` :
                        objQuant ? `(об-${objQuant})` :
                        zones ? `(зон-${zones})` : '(-)';
      const isUnselected = methodText === 'Не выбрано-ч';
      const noZones = zonesText === '(-)';
      return `<span>${isUnselected ? '' : methodText} <span style="font-size: 10px;">${noZones ? '' : zonesText}</span></span>`;
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
