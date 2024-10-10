/**
 * Модальное окно для настроек отчета для выгрузки в excel
 * @param {*} name
 * @returns
 */
const repModalTemplate = (name) => {
  return `<div class="modal-header bg-light ps-card border-bottom-0" tabindex="-1"><div>
    <div class="modal-title mb-0"><b>${name}</b></div>
</div><button type="button" class="btn-close ml-2" data-bs-dismiss="modal" aria-label="Close"></button></div>
<div class="modal-body px-card pb-card pt-1 fs--1">
<div class="row">
<div class="col mb-2">
    <label class="fs-0 d-flex">Период</label>
    <input class="form-control datetimepicker" id="reportPeriod" type="text" required="required" placeholder="Выберите период для отчета" />
</div>

</div>
</div>
<div class="modal-footer d-flex justify-content-end bg-light px-card border-top-0">
<button class="btn btn-falcon-default btn-sm" data-bs-dismiss="modal">
<i class="bi bi-x-lg"></i>Отмена</button>
<button class="btn btn-falcon-primary btn-sm" id="getReport"><i class="bi bi-download"></i>Выгрузить отчет</button></div>`;
};
export default repModalTemplate;
