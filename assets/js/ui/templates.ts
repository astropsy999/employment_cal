import { EventInfo } from "../types/events";
import { MethodDetails } from "../types/methods";


/**
 * Добавление методов в модальное окно описания задачи
 * @param {*} methodsArr
 * @returns
 */


const addMethodsToEventUI = (methodsArr: MethodDetails[]) => {
  const methNamesArr: string[] = [];
  if (methodsArr) {
    methodsArr.forEach((meth, index) => {
      const objQuant = Object.values(meth)[0].objQuant;
      const zones = Object.values(meth)[0].zones;
      const time = Object.values(meth)[0]['duration'];
      const objZones = (objQuant: string, zones: string) => {
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

      const formattedMethod = `<span>${methodText} <span style="font-size: 12px;">${zonesText}</span></span>`;
      methNamesArr.push(formattedMethod);
    });
  }

  return methNamesArr.join(', ');
};

/**
 * Возвращает строку с HTML-кодом иконки Font Awesome, обернутой в элемент <span> с классом fa-stack и с некоторыми
 * дополнительными стилями. Иконка состоит из двух элементов <i>, один из которых представляет собой круг с помощью
 * класса fas fa-circle, а второй отображает саму иконку, задавая ее класс и указывая дополнительный
 * атрибут data-fa-transform со значением, переданным вторым аргументом функции getStackIcon.
 * @param {*} icon
 * @param {*} transform
 * @returns
 */
let getStackIcon = function getStackIcon(icon: string, transform?: string ) {
  return '\n  <span class="fa-stack ms-n1 me-3">\n    <i class="fas fa-circle fa-stack-2x text-200"></i>\n    <i class="'
    .concat(icon, ' fa-stack-1x text-primary" data-fa-transform=')
    .concat(transform || '', '></i>\n  </span>\n');
};

/**
 * Внешний вид модального окна описания задачи по клику на нее с возможностью редактирования
 * @param {*} event
 * @returns
 */
export function getTemplate(event: EventInfo) {
  const KR = event.extendedProps.kr === 'Да' ? ` (КР)` : '';
  const methods = event.extendedProps.methods
    ? `<div style="margin-left:5px;"><span style="font-weight:600; ">методы: </span>${addMethodsToEventUI(
        event.extendedProps.methods,
      )}</div>`
    : '';

  const editDeleteAvilable =
    event.extendedProps.isApproved === '' || process.env.NODE_ENV === 'development'
      ? `<div class="modal-footer d-flex justify-content-end bg-light px-card border-top-0">
      <button class="btn btn-falcon-default btn-sm" id="editEventBtn" data-idx="${event.extendedProps.idx}">
      <span class="fas fa-pencil-alt fs--2 mr-2"></span> Редактировать</button>
      <button class="btn btn-falcon-primary btn-sm" id="delEventBtn" data-delID="${event.extendedProps.delID}" data-typeID="${event.extendedProps.typeID}"><i class="bi bi-trash-fill align-content-center"></i>Удалить <span class="fas fa-angle-right fs--2 ml-1"></span></button>
      </div>`
      : '';

  return `<div class="modal-header bg-light ps-card pe-5 border-bottom-0" tabindex="-1"><div>
    <h5 class="modal-title mb-0 ms-4" >${event.title}</h5>
    <p class="mb-0 fs--1 mt-1 ms-4"><b>Занятость: </b>${
      event.extendedProps.employment
    }</p>
</div>
<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
<div class="modal-body px-card pb-card pt-1 fs--1"><div class="d-flex mt-3">${
    getStackIcon('fas fa-user') +
    '<div class="flex-1"><b>Постановщик: </b><span class="mb-1">' +
    event.extendedProps.director
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-align-left') +
      '<div class="flex-1 description-container"><b>Описание:</b><div class="mb-0">' +
      event.extendedProps.fullDescription || ''
  }</div></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-clock') +
    '<div class="flex-1"><b>Затраченное время: </b><span class="mb-1">' +
    event.extendedProps.factTime +
    ' ч'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-map-marker-alt') +
      '<div class="flex-1"><b>Объект: </b><span class="mb-0">' +
      event.extendedProps.object || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-location-arrow') +
      '<div class="flex-1"><b>Локация: </b><span class="mb-0">' +
      event.extendedProps.location +
      KR || ''
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check') +
      '<div class="flex-1"><b>Вид работ: </b><span class="mb-0">' +
      event.extendedProps.taskTypeNew +
      methods || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check-square') +
      '<div class="flex-1"><b>Подвид работ: </b><span class="mb-0">' +
      event.extendedProps.subTaskTypeNew || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-fire') +
      '<div class="flex-1"><b>Источник: </b><span class="mb-0">' +
      event.extendedProps.source || ''
  }</span></div>
</div><div class="d-flex mt-3 mb-1">${
    getStackIcon('fas fa-sticky-note') +
      '<div class="flex-1"><b>Примечания: </b><p class="mb-1">' +
      event.extendedProps.notes || ''
  }</p></div></div></div> ${editDeleteAvilable}`;
}

/**
 * Внешний вид модального окна описания задачи по клику на нее
 * без возможности редактирования (для другого сотрудника)
 * @param {*} event
 * @returns
 */
export function getTemplateNoFooter(event: EventInfo) {
  const KR = event.extendedProps.kr === 'Да' ? ` (КР)` : '';
  const methods = event.extendedProps.methods
    ? `<div style="margin-left:5px;"><span style="font-weight:600;">методы: </span>${addMethodsToEventUI(
        event.extendedProps.methods,
      )}</div>`
    : '';

  const deleteAvailable =
    event.extendedProps.isApproved === '' || process.env.NODE_ENV === 'development'
      ? `<div class="modal-footer d-flex justify-content-end bg-light px-card border-top-0">
<button class="btn btn-falcon-primary btn-sm" id="delEventBtn" data-delID="${event.extendedProps.delID}" data-typeID="${event.extendedProps.typeID}"><i class="bi bi-trash-fill align-content-center"></i>Удалить <span class="fas fa-angle-right fs--2 ml-1">
  </span>
  </button>
  </div>`
      : '';

  return `<div class="modal-header bg-light ps-card pe-5 border-bottom-0" tabindex="-1"><div>
    <h5 class="modal-title mb-0 ms-4" >${event.title}</h5>
    <p class="mb-0 fs--1 mt-1 ms-4"><b>Занятость: </b>${
      event.extendedProps.employment
    }</p>
</div><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
<div class="modal-body px-card pb-card pt-1 fs--1"><div class="modal-body px-card pb-card pt-1 fs--1"><div class="d-flex mt-3">${
    getStackIcon('fas fa-user') +
    '<div class="flex-1"><b>Постановщик: </b><span class="mb-1">' +
    event.extendedProps.director
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-align-left') +
      '<div class="flex-1 description-container"><b>Описание:</b><div class="mb-0">' +
      event.extendedProps.fullDescription || ''
  }</div></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-clock') +
    '<div class="flex-1"><b>Затраченное время: </b><span class="mb-1">' +
    event.extendedProps.factTime +
    ' ч'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-map-marker-alt') +
      '<div class="flex-1"><b>Объект: </b><span class="mb-0">' +
      event.extendedProps.object || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-location-arrow') +
      '<div class="flex-1"><b>Локация: </b><span class="mb-0">' +
      event.extendedProps.location +
      KR || ''
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check') +
      '<div class="flex-1"><b>Вид работ: </b><span class="mb-0">' +
      event.extendedProps.taskTypeNew +
      methods || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check-square') +
      '<div class="flex-1"><b>Подвид работ: </b><span class="mb-0">' +
      event.extendedProps.subTaskTypeNew || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-fire') +
      '<div class="flex-1"><b>Источник: </b><span class="mb-0">' +
      event.extendedProps.source || ''
  }</span></div>
</div><div class="d-flex mt-3 mb-1">${
    getStackIcon('fas fa-sticky-note') +
      '<div class="flex-1"><b>Примечания: </b><p class="mb-1">' +
      event.extendedProps.notes || ''
  }</p></div></div></div>${deleteAvailable}
`;
}

/**
 * Внешний вид модального окна описания задачи по клику на нее
 * без возможности редактирования и удаления
 * @param {*} event
 * @returns
 */
export function getTemplateNoFooterNoDelete(event: EventInfo) {
  const KR = event.extendedProps.kr === 'Да' ? ` (КР)` : '';
  const methods = event.extendedProps.methods
    ? `<div style="margin-left:5px;"><span style="font-weight:600;">методы: </span>${addMethodsToEventUI(
        event.extendedProps.methods,
      )}</div>`
    : '';

  return `<div class="modal-header bg-light ps-card pe-5 border-bottom-0" tabindex="-1"><div>
    <h5 class="modal-title mb-0 ms-4" >${event.title}</h5>
    <p class="mb-0 fs--1 mt-1 ms-4"><b>Занятость: </b>${
      event.extendedProps.employment
    }</p>
</div><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
<div class="modal-body px-card pb-card pt-1 fs--1"><div class="modal-body px-card pb-card pt-1 fs--1"><div class="d-flex mt-3">${
    getStackIcon('fas fa-user') +
    '<div class="flex-1"><b>Постановщик: </b><span class="mb-1">' +
    event.extendedProps.director
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-align-left') +
      '<div class="flex-1 description-container"><b>Описание:</b><div class="mb-0">' +
      event.extendedProps.fullDescription || ''
  }</div></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-clock') +
    '<div class="flex-1"><b>Затраченное время: </b><span class="mb-1">' +
    event.extendedProps.factTime +
    ' ч'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-map-marker-alt') +
      '<div class="flex-1"><b>Объект: </b><span class="mb-0">' +
      event.extendedProps.object || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-location-arrow') +
      '<div class="flex-1"><b>Локация: </b><span class="mb-0">' +
      event.extendedProps.location +
      KR || ''
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check') +
      '<div class="flex-1"><b>Вид работ: </b><span class="mb-0">' +
      event.extendedProps.taskTypeNew +
      methods || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-check-square') +
      '<div class="flex-1"><b>Подвид работ: </b><span class="mb-0">' +
      event.extendedProps.subTaskTypeNew || 'Не выбрано'
  }</span></div>
</div><div class="d-flex mt-3">${
    getStackIcon('fas fa-fire') +
      '<div class="flex-1"><b>Источник: </b><span class="mb-0">' +
      event.extendedProps.source || ''
  }</span></div>
</div><div class="d-flex mt-3 mb-1">${
    getStackIcon('fas fa-sticky-note') +
      '<div class="flex-1"><b>Примечания: </b><p class="mb-1">' +
      event.extendedProps.notes || ''
  }</p></div></div></div>
`;
}
