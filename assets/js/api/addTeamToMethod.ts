import * as config from "../config";

import { getLocalStorageItem } from "../utils/localStorageUtils"
import { generateTeamListId, generateTeamListTitle } from "../utils/textsUtils"

type AnswerParams = {
    result: number,
    idparam: string
}

interface AddedMethodAnswer {
    calcs: any[],
    name: string,
    object: string,
    params: AnswerParams[],
    parent: string,
    result: 1
}

export const addTeamToMethod = async (teamList: string, addedMethodAnswer: AddedMethodAnswer) => {

        const teamListArr = JSON.parse(teamList);
        const value = generateTeamListTitle(teamListArr);
        
        let formData = new FormData();

        const dataObject = {
            "Value": value.replace(", ", ","),
            "rv":value.replace(", ", "\n"),
            "rid": generateTeamListId(teamListArr),
            "UserTabID":null,
            "UnitID":"",
            "UnitName":"",
            "isOnlyYear":false,
            "OrigValue":"",
            "ParamID": Number(config.BRIGADE_PARAM),
            "ObjID": addedMethodAnswer.object,
            "InterfaceID": config.InterfaceID,
            "GroupID":Number(config.GroupID),
            "ObjTypeID": Number(config.OBJECT_TYPE_ID),
            "ParrentObjHighTab": getLocalStorageItem('iddb'),
            "ParamID_TH":null,
            "Name_TH": config.BRIGADE_COL_NAME,
            "Array":1,
            "DataType": config.DATA_TYPE,
        }

        console.log("🚀 ~ addTeamToMethod ~ dataObject:", dataObject)

}