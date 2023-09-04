import { minusThreeHours } from '../utils/mainGlobFunctions';
/**
 * Расширение и сужение границ календаря в соответствии с длительностью отображаемых событий
 * @param {*} calendar
 * @param {*} viewStart
 * @param {*} viewEnd
 * @param {*} slotmintime
 * @param {*} slotmaxtime
 * @returns
 */
export const stretchViewDepEvents = (
  calendar,
  viewStart,
  viewEnd,
  slotmintime,
  slotmaxtime,
) => {
  // Все эвенты

  const allEvents = calendar.getEventSources()[0].internalEventSource.meta;

  // Получаем только эвенты между видимыми датами
  const viewEvents = [];

  allEvents.forEach((ev) => {
    if (
      new Date(ev.start) > minusThreeHours(viewStart) &&
      new Date(ev.start) < minusThreeHours(viewEnd)
    ) {
      viewEvents.push(ev);
    }
  });

  let minViewTimeArr = [];
  let maxViewTimeArr = [];
  let minViewTime;
  let maxViewTime;

  viewEvents.forEach((el) => {
    minViewTimeArr.push(new Date(el.start).getHours());
    maxViewTimeArr.push(new Date(el.end).getHours());
  });

  minViewTime = Math.min(Math.min(...minViewTimeArr), +slotmintime.slice(0, 2));
  maxViewTime = Math.max(
    Math.max(...maxViewTimeArr),
    +slotmaxtime.slice(0, 2) - 1,
  );

  return [minViewTime, maxViewTime];
};
