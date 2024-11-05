//{ 
// "Value":"Абужаков+Динислам+Керимович,Воронин+Петр+Михайлович",
// "rv":"Абужаков+Динислам+Керимович\nВоронин+Петр+Михайлович",
// "rid":"6660831\n3870886",
// "UserTabID":null,
// "UnitID":"",
// "UnitName":"",
// "isOnlyYear":false,
// "OrigValue":"",
// "ParamID":9488,
// "ObjID":"7047213",
// "InterfaceID":"1592",
// "GroupID":2442,
// "ObjTypeID":1149,
// "ParrentObjHighTab":"235986",
// "ParamID_TH":null,
// "Name_TH":"Бригада",
// "Array":1,
// "DataType":"Строка"
//}

type AnswerParams = {
    result: number,
    idparam: string
}

interface AddedMethodAnswer {
    calcs: any[],
    name: string,
    params: AnswerParams[],
    parent: string,
    result: 1
}

export const addTeamToMethod = async (teamList: string, isBrigadier: string, addedMethodAnswer:AddedMethodAnswer) => {
        console.log("🚀 ~ addTeamToMethod ~ addedMethodAnswer:", addedMethodAnswer)
        console.log("🚀 ~ addTeamToMethod ~ isBrigadier:", isBrigadier)
        console.log("🚀 ~ addTeamToMethod ~ teamList:", teamList)

}