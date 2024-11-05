// 'https://telegram.giapdc.ru:8443'- для теста билда локально подставляем вместо <? ''>

const srvv =
  process.env.NODE_ENV === 'production'
    ? ''
    : 'https://telegram.giapdc.ru:8443';
const verifyLogin = '/index.php/VerifyLogin';
const createNodeUrl = '/index.php/ObjectController/CreateNode';
const getTableData = '/index.php/ObjectController/GetTableData';
const addValueObject = '/index.php/ObjectController/AddValueObject/true';
const getInheritParamsForTableUrl =
  '/index.php/UIController/GetInheritParamsForTable';
const addDopParamsUrl = '/index.php/Cache/cache_add_table';
const calcforObjecttoTable = '/index.php/ObjectController/CalcforObjecttoTable';
const calcContextValuesBTN = '/index.php/CalcsController/CalcContextValuesBTN';
const deleteNodeURL = '/index.php/ObjectController/DeleteNode';
const getEnumsData = '/index.php/ObjectController/GetEnumsData';
const delObjMassUrl = '/index.php/ObjectController/DeleteObjMass';
const addValueObjTrue = '/index.php/ObjectController/AddValueObject/true';
const getDataColumnTableForInterface =
  '/index.php/ObjectController/GetDataColumnTableForInterface';
const getReports = '/index.php/UISettingsController/GetReports';
const getreportFormodule = '/index.php/RepCalcController/GetReportForModule';
const GetExcelforCalc = '/index.php/RepCalcController/GetExcelforCalc';
const BuildWindowForm = '/index.php/UIController/BuildWindowForm';
const cacheAddTable = '/index.php/Cache/cache_add_table';
const cacheSaveTable = '/index.php/Cache/cache_save_table';

//Конфиг FormData
const GroupID = '2442';
const GroupID2 = '2432';
const setInterfaceIDAdd = '1286';
const setInterfaceIDEdit = '1286';
const viewSelect = '';
const InterfaceID = '1592';
const ParentTabID = '1588';
const ParentGroupID = '2435';
const idxID = '№';
const dateID = '7416';
const secondCol = '7459';
const thirdCol = '7445';
const fourthCol = '8102';
const fifthCol = '8105';
const sixthCol = '8568';
const seventhCol = '8570';
const eighthCol = '8106';
const ninthCol = '8103';
const tenthCol = '8104';
const eleventhCol = '8108';
const twelfthCol = '8107';
const thirteenthCol = '8627';
const fourteenthCol = '8651';
const fifteenthCol = '8673';
const FullText = '1';
const startFD = '1';
const dataGroupID = '2443';
const dataInterfaceID = '1593';
const addZeroName = '8121';
const addCalcParamID = '8121';
const delTabID = '1592';
const userCol = '8572';
const METHODS_DROPDOWN_PARAMID = '8764';
const OBJTYPEID = '1094';
const ObjTypeID = '871';
const BRIGADE_PARAM = '9488';
const OBJECT_TYPE_ID = '1149';
const BRIGADE_COL_NAME = 'Бригада';
const DATA_TYPE = 'Строка';

// Объект изменяемых параметров

let paramEditIDs = {
  taskEditObj: fifthCol,
  kindOfEditTasks: sixthCol,
  kindOfSubEditTask: seventhCol,
  eventEditTitle: fourthCol,
  longEditDesc: 't8106',
  taskEditCreator: eleventhCol,
  eventEditSource: twelfthCol,
  eventEditNotes: 't8107',
  eventEditStartDate: thirteenthCol,
  eventEditEndDate: fourteenthCol,
  eventEditSpentTime: ninthCol,
  locEditObj: fifteenthCol,
};

// DOM Objects

const objClass = document.querySelectorAll('#objClass');
const defTable = document.querySelector('.defTable');
const metodK = document.querySelectorAll('#metodK');
const formFillIcons = document.querySelectorAll('.forms-filling-icons');
const cardsHeaders = document.getElementsByClassName('card-header');
const fillIcon = document.getElementsByClassName('unit');
const cards = document.querySelectorAll('.card');
const dopDefBtn = document.querySelector('#checkDefBtn');
const ctrResContainer = document.querySelector('.control-results-container');
const contrZone = document.querySelector('.contrZone');
const vidDoc = document.querySelector('#vidDoc');
const mesto = document.querySelector('#mesto');
const defName = document.querySelector('#defNames');
const zavod = document.querySelector('#zavod');
const techIdx = document.querySelector('#poz');
const zavN = document.querySelector('#zavN');
const redN = document.querySelector('#redN');
const nazvan = document.querySelector('#nazvan');
const rezNtd = document.querySelector('#rezNtd');
const controlOrg = document.querySelector('#controlOrg');
const controlDate = document.querySelector('#controlDate');
const specFio = document.querySelector('#specFio');
const qualif = document.querySelector('#qualif');
const srokUdost = document.querySelector('#srokUdost');
const markaPribor = document.querySelector('#markaPribor');
const zavNumb = document.querySelector('#zavNumb');
const srokPoverki = document.querySelector('#srokPoverki');
let contrResContainer = document.querySelector('.control-results-container');
const generalForm = document.querySelector('.general-form');
const ctrObjectChoosing = document.querySelector('#collapseOne');
const deflngth = document.querySelector('#deflngth');
const defWide = document.querySelector('#defWide');
const defHeight = document.querySelector('#defHeight');
const defThick = document.querySelector('#defThick');
const defDev = document.querySelector('#defDev');
const defTxt = document.querySelector('#defTxt');
const defYesNo = document.querySelector('.def-plus-minus');
const contrZoneName = document.querySelector('#contrZone');
const ctrZoneOneContainerSel = document.querySelector('.ctrZoneSlctrs');

// Buttons

const addCtrZoneBtn = document.querySelector('#addCtrZone');

// ID's

const selectorIdsObj = {
  creatingDate: '11482',
  objClass: '11484',
  metodK: '11485',
  zavod: '11514',
  mesto: '11486',
  poz: '11487',
  zavN: '11488',
  redN: '11489',
  nazvan: '11490',
  rezNtd: '11491',
  vidDoc: '11480',
  contrZone: '11503',
  defNames: '11505',
  deflngth: '11507',
  defHeight: '11509',
  defWide: '11508',
  defThick: '11510',
  defDev: '11513',
  defTxt: '11511',
};

// Exports variables

export {
  objClass,
  defYesNo,
  addValueObject,
  defTxt,
  defDev,
  defThick,
  defHeight,
  defWide,
  deflngth,
  addCtrZoneBtn,
  ctrObjectChoosing,
  generalForm,
  contrResContainer,
  controlOrg,
  srokPoverki,
  srokUdost,
  zavNumb,
  markaPribor,
  qualif,
  specFio,
  controlDate,
  metodK,
  rezNtd,
  redN,
  nazvan,
  zavN,
  techIdx,
  zavod,
  formFillIcons,
  cardsHeaders,
  fillIcon,
  cards,
  dopDefBtn,
  ctrResContainer,
  contrZone,
  // srv,
  verifyLogin,
  createNodeUrl,
  getTableData,
  vidDoc,
  mesto,
  defName,
  selectorIdsObj,
  getInheritParamsForTableUrl,
  addDopParamsUrl,
  contrZoneName,
  ctrZoneOneContainerSel,
  calcforObjecttoTable,
  calcContextValuesBTN,
  defTable,
  deleteNodeURL,
  srvv,
  getEnumsData,
  delObjMassUrl,
  addValueObjTrue,
  getDataColumnTableForInterface,
  paramEditIDs,
  GroupID,
  setInterfaceIDAdd,
  setInterfaceIDEdit,
  viewSelect,
  InterfaceID,
  ParentTabID,
  ParentGroupID,
  idxID,
  dateID,
  secondCol,
  thirdCol,
  fourthCol,
  fifthCol,
  sixthCol,
  seventhCol,
  eighthCol,
  ninthCol,
  tenthCol,
  eleventhCol,
  twelfthCol,
  thirteenthCol,
  fourteenthCol,
  fifteenthCol,
  FullText,
  startFD,
  dataGroupID,
  dataInterfaceID,
  addZeroName,
  addCalcParamID,
  delTabID,
  userCol,
  METHODS_DROPDOWN_PARAMID,
  getReports,
  getreportFormodule,
  GetExcelforCalc,
  OBJTYPEID,
  GroupID2,
  ObjTypeID,
  BuildWindowForm,
  cacheAddTable,
  cacheSaveTable,
  BRIGADE_PARAM,
  OBJECT_TYPE_ID,
  BRIGADE_COL_NAME,
  DATA_TYPE
};
