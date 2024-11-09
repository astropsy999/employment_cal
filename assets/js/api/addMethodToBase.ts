import { Methods } from "../enums/methods";
import { MethodsArr } from "../types/methods";
import { addTeamToMethod } from "./addTeamToMethod";

/**
 * Добавление методов в базу данных
 * @param {*} methodsArr
 * @param {*} delID
 * @param {*} api
 */
export const addMethodToBase = (methodsArr: MethodsArr[], delID: string, api: {[key: string]: string}) => {
console.log("🚀 ~ addMethodToBase ~ methodsArr:", methodsArr)

  const { srvv, createNodeUrl } = api;

  methodsArr.forEach((element, idx) => {
    const { method, params } = element;
    const { duration, objects, zones, teamList, isBrigadier } = params;

    const isRK = method === Methods.RK_CRG_NAME || method === Methods.RK_CLASSIC_NAME;

    let formDataaddMet = new FormData();

    formDataaddMet.append('ObjTypeID', '1149');
    formDataaddMet.append('ParentID', delID);
    formDataaddMet.append('Data[0][name]', '8764');
    formDataaddMet.append('Data[0][value]', method);
    formDataaddMet.append('Data[0][isName]', 'true');
    formDataaddMet.append('Data[0][maninp]', 'false');
    formDataaddMet.append('Data[0][GroupID]', '2549');
    formDataaddMet.append('Data[1][name]', '8767');
    formDataaddMet.append('Data[1][value]', duration);
    formDataaddMet.append('Data[1][isName]', 'false');
    formDataaddMet.append('Data[1][maninp]', 'false');
    formDataaddMet.append('Data[1][GroupID]', '2549');
    formDataaddMet.append('Data[2][name]', '8766');
    formDataaddMet.append('Data[2][value]', objects || '');
    formDataaddMet.append('Data[2][isName]', 'false');
    formDataaddMet.append('Data[2][maninp]', 'false');
    formDataaddMet.append('Data[2][GroupID]', '2549');
    formDataaddMet.append('Data[3][name]', '8765');
    formDataaddMet.append('Data[3][value]', zones);
    formDataaddMet.append('Data[3][isName]', 'false');
    formDataaddMet.append('Data[3][maninp]', 'false');
    formDataaddMet.append('Data[3][GroupID]', '2549');
    formDataaddMet.append('InterfaceID', '1685');
    formDataaddMet.append('CalcParamID', '-1');
    formDataaddMet.append('isGetForm', '0');
    formDataaddMet.append('ImportantInterfaceID', '');
    formDataaddMet.append('Ignor39', '1');
    formDataaddMet.append('templ_mode', '0');

    fetch(srvv + createNodeUrl, {
      credentials: 'include',
      method: 'post',
      body: formDataaddMet,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (isRK && teamList!.length > 0) {
          addTeamToMethod(teamList!, isBrigadier, data.results[0]);
        }

        // const { object, parent } = data.results[0];

        // if (idx == methodsArr.length - 1) {
        //   location.reload();
        // }
      });
  });
};

export default addMethodToBase;
