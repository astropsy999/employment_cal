import * as config from "../config";
import { getLocalStorageItem } from "../utils/localStorageUtils";

export const isBrigadierApi = async (isBrigadierStr: string, objID: string) => {

    const isBrigadierValue = (isBrigadierStr === "true") ? "Да" : "";

    const dataObject = {
        "Value": isBrigadierValue,
        "rv":isBrigadierValue,
        "rid": isBrigadierValue,
        "UserTabID":null,
        "UnitID":"",
        "UnitName":"",
        "isOnlyYear":false,
        "OrigValue":"",
        "ParamID": Number(config.IS_BRIGADIER_PARAM),
        "ObjID": objID,
        "InterfaceID": config.InterfaceID,
        "GroupID":Number(config.GroupID),
        "ObjTypeID": Number(config.OBJECT_TYPE_ID),
        "ParrentObjHighTab": getLocalStorageItem('iddb'),
        "ParamID_TH":null,
        "Name_TH": config.IS_BRIGADIER_COL_NAME,
        "Array":0
    }

    console.log("🚀 ~ isBrigadierApi ~ dataObject:", dataObject)


    const formData = new FormData();

    formData.append('data', JSON.stringify(dataObject));

    fetch(config.srvv + config.cacheAddTable, {
        credentials: 'include',
        method: 'post',
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("🚀 ~ .then ~ data:", data)

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
                console.log("🚀 ~ .then ~ data:", data)
                
            })
        }

    });
}