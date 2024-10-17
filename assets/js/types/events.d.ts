import { Calendar } from "@fullcalendar/core";

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