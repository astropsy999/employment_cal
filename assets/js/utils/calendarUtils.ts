import { Calendar } from '@fullcalendar/core';
import * as mainFunc from '../utils/mainGlobFunctions';
import { buttonLoader } from '../ui/buttonLoader';

interface UpdateTimeBoundsParams {
  calendar: Calendar;
  eventStartDate: HTMLInputElement;
  eventEndDate: HTMLInputElement;
  isMethodsAvailableMode: boolean;
  eventTaskModalBtn: HTMLButtonElement;
}

export const updateCalendarTimeBounds = ({
  calendar,
  eventStartDate,
  eventEndDate,
  isMethodsAvailableMode,
  eventTaskModalBtn,
}: UpdateTimeBoundsParams) => {
  const slotMinTime = calendar.getOption('slotMinTime');
  const slotMaxTime = calendar.getOption('slotMaxTime');

  const minTimeHours =
    slotMinTime instanceof Date
      ? slotMinTime.getHours()
      : typeof slotMinTime === 'string'
      ? +slotMinTime.slice(0, 2)
      : null;

  const maxTimeHours =
    slotMaxTime instanceof Date
      ? slotMaxTime.getHours()
      : typeof slotMaxTime === 'string'
      ? +slotMaxTime.slice(0, 2)
      : null;

  const startHours = new Date(mainFunc.convertDateTime(eventStartDate.value)).getHours();
  const endHours = new Date(mainFunc.convertDateTime(eventEndDate.value)).getHours();

  const setStartHours = Math.min(minTimeHours!, startHours);
  const setEndHours = Math.max(maxTimeHours!, endHours);

  calendar.setOption('slotMinTime', `${mainFunc.addZeroBefore(setStartHours)}:00:00`);
  calendar.setOption('slotMaxTime', `${mainFunc.addZeroBefore(setEndHours)}:59:59`);

  if (!isMethodsAvailableMode) {
    buttonLoader(eventTaskModalBtn, false);
  }
};
