import * as config from "../config";

import { getLocalStorageItem } from "../utils/localStorageUtils"
import { generateTeamListId, generateTeamListTitle } from "../utils/textsUtils"
import { showToast } from "../utils/toastifyUtil";
import { isBrigadierApi } from "./isBrigadierApi";

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

export const addTeamToMethod = async (teamList: string, isBrigadier: string | null | undefined, addedMethodAnswer: AddedMethodAnswer) => {

        const teamListArr = JSON.parse(teamList);
        const value = generateTeamListTitle(teamListArr);
        
        let formData = new FormData();

        const dataObject = {
            "Value": value.replaceAll(", ", ","),
            "rv":value.replaceAll(", ", "\n"),
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

        formData.append('data', JSON.stringify(dataObject));

        fetch(config.srvv + config.cacheAddTable, {
            credentials: 'include',
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.result === 1) {
                let formData = new FormData();

                formData.append('InterfaceID', config.InterfaceID);
                formData.append('ParrentObjHighTab', getLocalStorageItem('iddb'));
                formData.append('RapidCalc', '0');
                formData.append('Ignore39', '0');

                fetch(config.srvv + config.cacheSaveTable, {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                })
                .then((response) => response.json())
                .then((data) => {
                    showToast("Список работников успешно сохранен", "success");
                    if(isBrigadier) {
                        isBrigadierApi(isBrigadier, addedMethodAnswer.object);
                    }
                })
            }
        })
}

