export const eventContent = function (info) {
  // Создаем элементы для отображения
  const eventTimeNameWrapper = document.createElement('div');
  const eventMethodsWrapper = document.createElement('div');
  const eventTaskType = document.createElement('div');
  const eventTaskSubType = document.createElement('div');
  const eventObject = document.createElement('div');
  const fullDescription = document.createElement('div');
  const contentLayoutHeader = document.createElement('div');
  const location = document.createElement('div');

  // Отображение методов
  const addMethodsToEventUI = (methodsArr) => {
    const methNamesArr = [];
    if (methodsArr) {
      methodsArr.forEach((meth, index) => {
        const objQuant = Object.values(meth)[0].objQuant;
        const zones = Object.values(meth)[0].zones;
        const time = Object.values(meth)[0]['duration'];
        const objZones = (objQuant, zones) => {
          if (objQuant && zones) {
            return `(об-${objQuant},зон-${zones})`;
          } else if (objQuant && !zones) {
            return `(об-${objQuant})`;
          } else if (!objQuant && zones) {
            return `(зон-${zones})`;
          } else {
            return '(-)';
          }
        };
        const methodText = `${Object.keys(meth)[0]}-${time}ч`;
        const zonesText = objZones(objQuant, zones);

        const isUnselected = methodText === 'Не выбрано';
        const noZones = zonesText === '(-)';

        const formattedMethod = `<span>${isUnselected ? methodText: ''} <span style="font-size: 10px;">${noZones ? '' : zonesText}</span></span>`;
        methNamesArr.push(formattedMethod);
      });
    }

    return methNamesArr.join('<br>');
  };

  // Добавляем классы к элементам для отображения
  eventTimeNameWrapper.classList.add('eventTimeNameWrapper');
  eventTaskType.classList.add('eventTaskType');
  eventTaskSubType.classList.add('eventTaskSubType');
  eventMethodsWrapper.classList.add('eventMethodsWrapper');
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

  const {title} = info.event._def

  if (
    object &&
    object !== 'Не выбрано'
  ) {
    eventObject.classList.add('eventObject');
  }
  fullDescription.classList.add('fullDescription');

  // Помещаем данные для отображения

  eventMethodsWrapper.innerHTML = `<div>${addMethodsToEventUI(
    methods,
  )}</div>`;

  if (object !== 'Не выбрано') {
    eventObject.innerHTML = `${object}`;
  }
  eventTaskType.innerHTML = `${
    taskType ||
    taskTypeNew
  }`;
  eventTaskSubType.innerHTML = `${
    subTaskType ||
    subTaskTypeNew
  }`;
  fullDescription.innerHTML = `${fullDesc}`;
  if (loc !== 'Не выбрано') {
    location.innerHTML = `${loc}`;
  }

  contentLayoutHeader.innerHTML = `<div class="contentLayoutHeader">
  <div class="factTime"><b>${
    factTime
  }</b>ч</div><div class="title mb-1">${title}</div>
   <div class="approvedMark">${
     isApproved
       ? `<i class="bi bi-check2-square text-success text-xl" title="${isApproved}"></i>`
       : ''
   }</div>
  </div>`;

  let arrayOfDomNodes = [
    contentLayoutHeader,
    location,
    eventObject,
    eventTaskType,
    eventTaskSubType,
    eventMethodsWrapper,
    fullDescription,
  ];

  return { domNodes: arrayOfDomNodes };
};
