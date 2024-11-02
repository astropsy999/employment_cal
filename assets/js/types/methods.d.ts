export interface MethStringObj {
  wooMethod: string;
  wooTime: string;
  wooObjects: string;
  wooZones: string;
}

export interface MethodParams {
  duration: string,
  objQuant: string,
  objects?: string,
  zones: string,
  editID: string
}

export interface MethodObj {
  [method: string]: MethodParams
}

export interface MethodData {
  editID: string,
  methVal: string,
  durVal: string,
  objqVal: string,
  zonesVal: string
}

export interface MethodsArr {
  delID: string,
  method: string,
  params: MethodParams
}