import { Calendar, Duration, DurationInput } from "@fullcalendar/core";
import { minusThreeHours } from "../utils/datesUtils";


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
  calendar: Calendar,
  viewStart: string | number | Date,
  viewEnd: string | number | Date,
  slotmintime: DurationInput | Duration | null | undefined,
  slotmaxtime: DurationInput | Duration | null | undefined,
) => {
  // Все эвенты

  const allEvents = calendar.getEventSources()[0].internalEventSource.meta;

  // Получаем только эвенты между видимыми датами
  const viewEvents: any[] = [];

  allEvents.forEach((ev: { start: string | number | Date; }) => {
    if (
      new Date(ev.start) > minusThreeHours(viewStart) &&
      new Date(ev.start) < minusThreeHours(viewEnd)
    ) {
      viewEvents.push(ev);
    }
  });

  let minViewTimeArr: number[] = [];
  let maxViewTimeArr: number[] = [];
  let minViewTime;
  let maxViewTime;

  viewEvents.forEach((el) => {
    minViewTimeArr.push(new Date(el.start).getHours());
    maxViewTimeArr.push(new Date(el.end).getHours());
  });

  minViewTime = Math.min(Math.min(...minViewTimeArr), +(slotmintime as string)?.slice(0, 2));
  maxViewTime = Math.max(
    Math.max(...maxViewTimeArr),
    +(slotmaxtime as string)?.slice(0, 2) - 1,
  );

  return [minViewTime, maxViewTime];
};
