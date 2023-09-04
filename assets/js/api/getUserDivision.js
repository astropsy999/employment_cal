// Определяем подразделение текущего пользователя

const getUserDivision = async () => {
  // Нужно знать фамилию текущего пользователя
  // Сделать запрос в таблицу Подразделения
  let formDataUser = new FormData();

  formDataUser.append(' TableID', 'm-t-207519');
  formDataUser.append(' FilterRelationType', '-1');
  formDataUser.append(' LvNeedOpen', '1');
  formDataUser.append(' ObjTypeID', '871');
  formDataUser.append(' iddb', '-1');
  formDataUser.append(' InterfaceID', '1756');
  formDataUser.append(' ParrentTabIDSideFilter', '1756');
  formDataUser.append(' GroupID', '2670');
  formDataUser.append(' UserTabID', '');
  formDataUser.append(' Criteria2', '');
  formDataUser.append(' newXP', '1');
  formDataUser.append(' columns[0][name]', '№');
  formDataUser.append(' columns[1][name]', '5608');
  formDataUser.append(' columns[2][name]', '5609');
  formDataUser.append(' columns[3][name]', '5610');
  formDataUser.append(' columns[4][name]', '5614');
  formDataUser.append(' FullText', '0');
  formDataUser.append(' kirkinator', '0');
  formDataUser.append(' horizontal', '0');
  formDataUser.append(' draw', '1');
  formDataUser.append(' order[columnIndex]', '5608');
  formDataUser.append(' order[Order]', '1');
  formDataUser.append(' start', '0');
  formDataUser.append(' length', '200');
  formDataUser.append(' search[value]', '');
  formDataUser.append(' isFirst', '1');
  formDataUser.append(' isLoadTotal', '0');
  formDataUser.append(' getOnlyTotal', '0');
  formDataUser.append(' startAssociation', '');
  formDataUser.append(' allCountAssociation', '0');

  const res = await fetch(srvv + getTableData, {
    credentials: 'include',
    method: 'post',
    body: formDataUser,
  })
    .then((response) => {
      let r = response.json();
      return r;
    })
    .catch(function (error) {
      console.log('Не удалось получить ID пользователя', error);
    });

  const data0 = res.data;

  // Определить подразделение

  const family = userName.split(' ')[0];
  const name = userName.split(' ')[1];

  const divisionStr = data0?.find(
    (user) => user[2].Value.includes(family) && user[3].Value.includes(name),
  );
  const division = divisionStr[5].Value;

  if (division && division === 'Отдел оформления документации') {
    selValidation(kindOfSubTask);
  }
};
