import { BRIGADE_COL_NAME, BRIGADE_PARAM, cacheAddTable, cacheSaveTable, DATA_TYPE, GroupID, InterfaceID, OBJECT_TYPE_ID, srvv } from "../config";
import { getLocalStorageItem } from "../utils/localStorageUtils";
import { showToast } from "../utils/toastifyUtil";
import { isBrigadierApi } from "./isBrigadierApi";


export const cleanBregadeDataApi = (methodID: string) => {
    
        let formData = new FormData();

        const dataObject = {
            "Value": '',
            "rv":'',
            "rid": '',
            "UserTabID":null,
            "UnitID":"",
            "UnitName":"",
            "isOnlyYear":false,
            "OrigValue":"",
            "ParamID": Number(BRIGADE_PARAM),
            "ObjID": methodID,
            "InterfaceID": InterfaceID,
            "GroupID":Number(GroupID),
            "ObjTypeID": Number(OBJECT_TYPE_ID),
            "ParrentObjHighTab": getLocalStorageItem('iddb'),
            "ParamID_TH":null,
            "Name_TH": BRIGADE_COL_NAME,
            "Array":1,
            "DataType": DATA_TYPE,
        }

        formData.append('data', JSON.stringify(dataObject));

        fetch(srvv + cacheAddTable, {
            credentials: 'include',
            method: 'POST',
            body: formData
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.result === 1) {
                let formData = new FormData();

                formData.append('InterfaceID', InterfaceID);
                formData.append('ParrentObjHighTab', getLocalStorageItem('iddb'));
                formData.append('RapidCalc', '0');
                formData.append('Ignore39', '0');

                fetch(srvv + cacheSaveTable, {
                    credentials: 'include',
                    method: 'POST',
                    body: formData
                })
                .then((response) => response.json())
                .then((data) => {
                    showToast("Список работников успешно очищен", "success");
                    
                        isBrigadierApi('false', methodID);
                    
                })
            }
        })
}