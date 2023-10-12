import {
  getTemplate,
  getTemplateNoFooterNoDelete,
  getTemplateNoFooter,
} from './templates';
import { Modal } from 'bootstrap';
import { Selectors } from '../utils/selectors';
import { delEvent } from '../actions/delEvent';
import { editEvent } from '../actions/editEvent';

export const eventClick = (info, calendar) => {
  const checkUserIDBySelector = () => {
    const userSelector = document.querySelector('#otherUsers');

    if (userSelector && userSelector.value !== localStorage.getItem('iddb')) {
      return false;
    }

    return true;
  };
  const isRootUser = checkUserIDBySelector();
  const selectedUserLevel = Number(localStorage.getItem('managerLevel'));
  const currentUserLevel = Number(localStorage.getItem('currentManagerLevel'));
  if (info.event.url) {
    window.open(info.event.url, '_blank');
    info.jsEvent.preventDefault();
  } else {
    if (isRootUser) {
      var template = getTemplate(info.event);
      document.querySelector(Selectors.EVENT_DETAILS_MODAL_CONTENT).innerHTML =
        template;
      var modal = new Modal(eventDetailsModal);
    } else {
      if (selectedUserLevel && currentUserLevel >= selectedUserLevel) {
        template = getTemplateNoFooterNoDelete(info.event);
      } else {
        template = getTemplateNoFooter(info.event);
      }

      document.querySelector(Selectors.EVENT_DETAILS_MODAL_CONTENT).innerHTML =
        template;
      var modal = new Modal(eventDetailsModal);
    }
    modal.show();

    const delEventBtn = document.querySelector('#delEventBtn');
    let delID = info.event._def.extendedProps.delID;
    const editEventBtn = document.querySelector('#editEventBtn');
    let typeID;
    let idx;

    typeID = delEventBtn?.getAttribute('data-typeID');
    idx = editEventBtn && editEventBtn.getAttribute('data-idx');

    // Преводим ID объекты к адекватному виду
    let dataObjectKeys = [];
    let dataObjectValues = [];
    let dataObjectsID = {};
    let dataCreatorKeys = [];
    let dataCreatorValues = [];
    let dataCreatorsID = {};
    let dataTaskListKeys = [];
    let dataTaskListValues = [];
    let dataTasksID = {};

    const dataObj = JSON.parse(sessionStorage.getItem('dataObj'));
    const dataCreator = JSON.parse(sessionStorage.getItem('dataCreator'));

    // Объекты

    dataObj.forEach((objectStr) => {
      dataObjectKeys.push(objectStr.Name.replaceAll('&quot;', '"'));
      dataObjectValues.push(objectStr.ID);
    });

    for (let i = 0; i < dataObjectKeys.length; i++) {
      let key = dataObjectKeys[i];
      let value = dataObjectValues[i];

      dataObjectsID[key] = value;
    }

    localStorage.setItem('dataObjectsID', JSON.stringify(dataObjectsID));

    // Постановщик

    dataCreator.forEach((creator) => {
      dataCreatorKeys.push(creator.Name);
      dataCreatorValues.push(creator.ID);
    });

    for (let i = 0; i < dataCreatorKeys.length; i++) {
      let key = dataCreatorKeys[i];
      let value = dataCreatorValues[i];

      dataCreatorsID[key] = value;
    }

    localStorage.setItem('dataCreatorsID', JSON.stringify(dataCreatorsID));

    // Вид работ

    JSON.parse(localStorage.getItem('globalTasksTypes')).forEach((task) => {
      dataTaskListKeys.push(task.Name);
      dataTaskListValues.push(task.ID);
    });

    for (let i = 0; i < dataTaskListKeys.length; i++) {
      let key = dataTaskListKeys[i];
      let value = dataTaskListValues[i];

      dataTasksID[key] = value;
    }
    localStorage.setItem('dataTasksID', JSON.stringify(dataTasksID));

    // ПОДВИД РАБОТ

    let dataSubTaskListKeys = [];
    let dataSubTaskListValues = [];

    // Удаление задачи
    delEvent(info, delID, isMultiMode, modal, shiftKeyUp);
    // Редактирование задачи
    editEvent(info, calendar, modal);
  }
};
