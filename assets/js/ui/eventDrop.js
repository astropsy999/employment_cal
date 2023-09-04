import { sendNewEndDateTimeToBase } from '../utils/mainGlobFunctions';

export const eventDrop = function (info) {
  if (
    info.delta.days !== 0 ||
    (info.event.extendedProps.isApproved !== undefined &&
      info.event.extendedProps.isApproved !== '')
  ) {
    info.revert();
  } else {
    // Получаем delID события из объекта info

    const changeTimeId = info.oldEvent._def.extendedProps.delID;

    // Получаем factTime

    const newFactTime = +info.oldEvent._def.extendedProps.factTime;

    // Новая дата начала
    const newMsStartDateTime = info.event._instance.range.start;
    const newStartDateTime = new Date(newMsStartDateTime);
    // Новая дата окончания
    const newMsEndDateTime = info.event._instance.range.end;
    const newEndDateTime = new Date(newMsEndDateTime);
    const idDB = localStorage.getItem('iddb');

    sendNewEndDateTimeToBase(
      changeTimeId,
      newFactTime,
      newStartDateTime,
      newEndDateTime,
      idDB,
    );
  }
};
