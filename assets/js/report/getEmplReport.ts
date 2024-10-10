/**
 * Формирование отчета для выгрузки в excel
 * @param {*} period
 * @param {*} api
 * @param {*} iddb
 * @param {*} id
 */
const getEmplReport = (period, api, iddb, id) => {
  const startDate = period[0];
  const endDate = period[1];
  const { srvv, getreportFormodule, GetExcelforCalc } = api;

  const formData = new FormData();

  formData.append('ID', id.toString());
  formData.append('Params[0][id]', '1');
  formData.append('Params[0][val]', iddb);
  formData.append('Params[0][MultiFile]', '0');
  formData.append('Params[1][id]', '2');
  formData.append('Params[1][val]', startDate.trim());
  formData.append('Params[1][MultiFile]', '0');
  formData.append('Params[2][id]', '3');
  formData.append('Params[2][val]', endDate.trim());
  formData.append('Params[2][MultiFile]', '0');

  const res = fetch(srvv + getreportFormodule, {
    credentials: 'include',
    method: 'post',
    body: formData,
  })
    .then((response) => {
      let r = response.json();
      return r;
    })
    .then((data) => {
      const ident = '/' + data.ident;
      const URL = srvv + GetExcelforCalc + ident;
      fetch(URL, {
        credentials: 'include',
        method: 'get',
        dataType: 'binary',
      })
        .then((response) => {
          let r = response;
          return r.blob();
        })
        .then((data) => {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(data);
          a.download = `Отчет о занятости за период ${startDate}-${endDate}.xlsx`;
          a.click();
        });
    })
    .catch(function (error) {
      console.log('error', error);
    });
};

export default getEmplReport;
