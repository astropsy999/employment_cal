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
  editID?: string,
  teamList?: string,
  isBrigadier?: string
}

export interface MethodObj {
  [method: string]: MethodParams
}

export interface MethodData {
  editID: string,
  methVal: string,
  durVal: string,
  objqVal: string,
  zonesVal: string,
  teamList?: string,
  isBrigadier?: string
}

export interface MethodsArr {
  delID: string,
  method: string,
  params: MethodParams,
  teamList?: string,
  isBrigadier?: string
}



export interface MethodDetails {
  objQuant?: number;
  zones?: number;
  duration?: number;
  teamList?: string;
  isBrigadier?: boolean;
}
