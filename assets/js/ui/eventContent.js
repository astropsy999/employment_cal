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

        const formattedMethod = `<span>${methodText} <span style="font-size: 10px;">${zonesText}</span></span>`;
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

  if (
    info.event._def.extendedProps.object &&
    info.event._def.extendedProps.object !== 'Не выбрано'
  ) {
    eventObject.classList.add('eventObject');
  }
  fullDescription.classList.add('fullDescription');

  // Помещаем данные для отображения

  eventMethodsWrapper.innerHTML = `<div>${addMethodsToEventUI(
    info.event._def.extendedProps.methods,
  )}</div>`;

  if (info.event._def.extendedProps.object !== 'Не выбрано') {
    eventObject.innerHTML = `${info.event._def.extendedProps.object}`;
  }
  eventTaskType.innerHTML = `${
    info.event._def.extendedProps.taskType ||
    info.event._def.extendedProps.taskTypeNew
  }`;
  eventTaskSubType.innerHTML = `${
    info.event._def.extendedProps.subTaskType ||
    info.event._def.extendedProps.subTaskTypeNew
  }`;
  fullDescription.innerHTML = `${info.event._def.extendedProps.fullDescription}`;
  if (info.event._def.extendedProps.location !== 'Не выбрано') {
    location.innerHTML = `${info.event._def.extendedProps.location}`;
  }

  contentLayoutHeader.innerHTML = `<div class="contentLayoutHeader">
  <div class="factTime"><b>${
    info.event._def.extendedProps.factTime
  }</b>ч</div><div class="title mb-1">${info.event._def.title}</div>
   <div class="approvedMark">${
     info.event._def.extendedProps.isApproved
       ? `<i class="bi bi-check2-square text-success text-xl" title="${info.event._def.extendedProps.isApproved}"></i>`
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
