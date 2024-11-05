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
  teamList?: string | undefined | null;
  isBrigadier?: string | undefined| null;
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
    methods?: MethodsArr[],
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

export interface EventEditObj {
  OBJTYPEID: string,
  addCalcParamID: string,
  addValueObjTrue: string,
  addZeroName: string,
  calendar: Calendar,
  cleanTodayDate: string,
  convertDateTime: (param: string)=>string,
  createNodeUrl: string,
  dataGroupID: string,
  dataInterfaceID: string,
  dataObjID: string,
  dataObjVal: string,
  delID: string,
  eleventhCol: string,
  emplEditVal: string,
  endEditDate: string,
  eventEditNotesVal: string,
  eventEditSourceVal: string,
  fifteenthCol: string,
  fifthCol: string,
  fourteenthCol: string,
  fourthCol: string,
  idDB: string,
  kindOfEditTasksID: string,
  kindOfEditTasksVal: string,
  kindOfSubEditTaskID: string,
  kindOfSubEditTaskVal: string,
  krBase: string,
  locationVal: string,
  longEditDeskVal: string,
  methodsFromServer: MethodObj[],
  ninthCol: string,
  parentID: string,
  savedTaskFromServer: string,
  setViewAndDateToLS: (calendar: Calendar) => void,
  seventhCol: string,
  sixthCol: string,
  spentEditTimeVal: string,
  srvv: string,
  startEditDate: string,
  taskEditCreatorID: string,
  taskEditCreatorVal: string,
  tenthCol: string,
  thirteenthCol: string,
  titleEditVal: string,
  userCol: string,
}