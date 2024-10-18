export interface MethStringObj {
  wooMethod: string;
  wooTime: string;
  wooObjects: string;
  wooZones: string;
}

export interface MethodParams {
  duration: string,
  objQuant: string,
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
