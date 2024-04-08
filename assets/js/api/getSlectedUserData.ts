/* -------------------------------------------------------------------------- */

/*                 ПОЛУЧЕНИЕ ДАННЫХ ДЛЯ КАЛЕНДАРЯ                             */

/* -------------------------------------------------------------------------- */
import { getTableData, srvv } from '../config';

/**
 * Подгрузка данных выбранного пользователя
 * @param {string} userID
 * @returns
 */
export const getSelectedUserData = async (userID, start, end) => {
  let data = [];
  let startFD_New = '1';
  let lengthFD = 10000;

  for (let i = 1; ; i++) {
    let formData1 = new FormData();

    formData1.append('GroupID', '2442');
    formData1.append('Name', 'Перечень');
    formData1.append('Preview', '');
    formData1.append('Formula', '0');
    formData1.append('Table', '0');
    formData1.append('ViewMode', '');
    formData1.append('TypeID', '0');
    formData1.append('ExternalInterfaceID', '');
    formData1.append('ExternalTabID', '');
    formData1.append('Horizontal', '');
    formData1.append('InterfaceIDAdd', '');
    formData1.append('TypesForSideFilter', '');
    formData1.append('ParamsForSideFilter', '');
    formData1.append('DisplayModeForSideFilter', '');
    formData1.append('TypeForSideFilterParam', '');
    formData1.append('HaveNotOnlyEditParam0', '1');
    formData1.append('HaveParams', '0');
    formData1.append('ObjTypeID', '1040');
    formData1.append('ParamID', '');
    formData1.append('ObjTypeIDViewSelect', '');
    formData1.append('TabType', '1');
    formData1.append('HasChild', '0');
    formData1.append('FilterByUserID', '');
    formData1.append('isDiagram', 'false');
    formData1.append('FilterRelationType', '');
    formData1.append('UserTabID', '');
    formData1.append('TableID', 'm-t-780936');
    formData1.append('IsHeavyInterface', '0');
    formData1.append('iddb', userID);
    formData1.append('InterfaceID', '1592');
    formData1.append('CheckOnlyDirectParrent', '0');
    formData1.append('ParrentTabID', '1588');
    formData1.append('ParamLink', '');
    formData1.append('FilterTabs', '');
    formData1.append('FromParam', '0');
    formData1.append('TableParamID', 'null');
    formData1.append('templ_mode_prev', '0');
    formData1.append('templ_mode', '0');
    formData1.append('ParrentGroupID', '2435');
    formData1.append('node[ID]', 'm-t-780936');
    formData1.append('node[DisplayPasteCopyBtn]', '0');
    formData1.append('newXP', '1');
    formData1.append('columns[0][data]', '1');
    formData1.append('columns[0][name]', '№');
    // formData1.append('columns[1][search][value][0][sign]', '>=');
    // formData1.append('columns[1][search][value][0][value]', start);
    // formData1.append('columns[1][search][value][1][sign]', '<=');
    // formData1.append('columns[1][search][value][1][value]', end);
    formData1.append('columns[1][name]', '7416');
    formData1.append('columns[2][name]', '7459');
    formData1.append('columns[3][name]', '7445');
    formData1.append('columns[4][name]', '8102');
    formData1.append('columns[5][name]', '8105');
    formData1.append('columns[6][name]', '8568');
    formData1.append('columns[7][name]', '8570');
    formData1.append('columns[8][name]', '8106');
    formData1.append('columns[9][name]', '8103');
    formData1.append('columns[10][name]', '8104');
    formData1.append('columns[11][name]', '8108');
    formData1.append('columns[12][name]', '8107');
    formData1.append('columns[13][name]', '8627');
    formData1.append('columns[14][name]', '8651');
    formData1.append('columns[15][name]', '8673');
    formData1.append('columns[16][name]', '8764');
    formData1.append('columns[17][name]', '8767');
    formData1.append('columns[18][name]', '8766');
    formData1.append('columns[19][name]', '8765');
    formData1.append('columns[20][name]', '8852');
    formData1.append('columns[21][name]', '9042');
    formData1.append('columns[22][name]', '9043');
    formData1.append('columns[23][name]', '9044');
    formData1.append('columns[24][name]', '9245');
    formData1.append('columns[25][name]', '9249');
    formData1.append('FullText', '1');
    formData1.append('kirkinator', '1');
    formData1.append('horizontal', '0');
    formData1.append('draw', '1');
    formData1.append('order[columnIndex]', '7416');
    formData1.append('order[Order]', '0');
    formData1.append('start', startFD_New);
    formData1.append('length', lengthFD.toString());
    formData1.append('search[value]', '');
    formData1.append('isFirst', '1');
    formData1.append('isLoadTotal', '0');
    formData1.append('getOnlyTotal', '0');

    const res1 = await fetch(srvv + getTableData, {
      credentials: 'include',
      method: 'post',
      body: formData1,
    })
      .then((response) => {
        let r = response.json();
        return r;
      })
      .catch(function (error) {
        console.log(
          'Не удалось загрузить данные выбранного пользователя с сервера',
          error,
        );
      });

    const dataFD = res1?.data;

    if (dataFD && typeof dataFD[Symbol.iterator] === 'function') {
      if (dataFD?.length < lengthFD) {
        data = [...data, ...dataFD];
        break;
      } else {
        data = [...data, ...dataFD];
        startFD_New = lengthFD.toString();
      }
    } else {
      data = [];
      break;
    }
  }
  return data;
};
