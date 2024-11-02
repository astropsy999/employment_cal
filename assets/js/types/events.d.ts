import { Calendar } from "@fullcalendar/core";
import { MethodObj, MethodParams } from "./methods";

export interface MainEventMethods {
    parentID: string;
    OBJTYPEID: string;
    addZeroName: string;
    cleanTodayDate: string;
    dataGroupID: string;
    fifthCol: string;
    taskObjAttr: string;
    sixthCol: string;
    kindOfTasksID:string;
    seventhCol: string;
    kindOfSubTaskID: string;
    fourthCol: string;
    titleVal: string;
    longDeskVal: string
    ninthCol: string;
    spentTimeVal: string;
    tenthCol: string;
    taskCreatorID:string;
    eleventhCol: string;
    eventSourceVal: string;
    eventNotesVal: string;
    userCol: string;
    idDB: string;
    thirteenthCol: string;
    startDate: string;
    fourteenthCol: string;
    endDate: string;
    fifteenthCol: string;
    locationVal: string;
    employmentVal: string;
    dataInterfaceID: string;
    addCalcParamID: string;
    srvv: string;
    createNodeUrl: string;
    taskCreatorVal: string;
    taskObjVal: string;
    kindOfSubTaskVal: string;
    kindOfTasksVal: string;
    calendar: Calendar;
    convertDateTime: (param: string)=>string;
    krBase: string,
}

export interface EditEventMethods extends MainEventMethods {
  methodsFromServer: MethodObj[],
  addValueObjTrue: string,
  dataObjID: number,
  dataObjVal: string,
  emplEditVal: string,
  endEditDate: string,
  eventEditNotesVal: string,
  eventEditSourceVal: string,
  kindOfEditTasksID: string,
  kindOfEditTasksVal: string,
  kindOfSubEditTaskID: string,
  kindOfSubEditTaskVal: string,
  longEditDeskVal: string,
  savedTaskFromServer: string,
  setViewAndDateToLS: (calendar: Calendar) => void;
  spentEditTimeVal: string,
  startEditDate: string,
  taskEditCreatorID: string,
  taskEditCreatorVal: string,
  titleEditVal: string,
  delID: string,
}


type MethodsParams = {
  duration: string;
  objects: string;
  zones: string;
}

export interface MethodsArr {
  method: string;
  params: MethodsParams;
}

export interface EventInfo 
  {
    title: string,
    start?: Date | string,
    end?: Date | string,
    eventInteractive?: boolean,
    classNames: string,
    groupId?: string,
    publicId?: string,
    url?: string,
    recurringDef?: any,
    defId?: string,
    sourceId?: string,
    allDay: boolean,
    hasEnd?: boolean,
    ui?: EventInfoUI ,
    extendedProps: ExtendedProps,
    methods?: MethodsArr[]
}

export interface EventInfoUI {
  display: any,
  constraints: any[],
  overlap: any,
  allows: any[],
  backgroundColor: string,
  borderColor: string,
  textColor: string,
  classNames: string[]
}

interface JsonObjAllWkk {
  [key: string]: number
}

interface ExtendedProps {
  jsonObjAllWkk: JsonObjAllWkk,
  idx: number,
  wkkKeys: string[],
  wkkVals: number[],
  delID: string,
  typeID: string,
  object: string,
  taskType: string,
  subTaskType: string,
  fullDescription: string,
  factTime: string,
  director: string,
  source: string,
  notes: string,
  location: string,
  kr: string,
  employment: string,
  taskTypeNew: string,
  subTaskTypeNew: string,
  isApproved: string,
  isLocked: string,
  eventInteractive?: boolean,
  methods?: MethodObj[],
}