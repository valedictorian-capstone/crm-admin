
export interface FormControlVM {
  readonly id: string;
  readonly name: string;
  readonly placeHolder: string;
  readonly fontSize: string;
  readonly label: string;
  readonly size: string;
  readonly options: { value: string, label: string }[] | any;
  readonly type: string;
  readonly subType: string;
  readonly position: number;
  readonly width: string;
  readonly xs: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
  readonly xxl: number;
  readonly height: string;
  readonly isCapitialize: boolean;
  readonly tooltip: string;
  readonly color: string;
  readonly validator: any;
  readonly isDelete: boolean;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FormControlCM {
  id: string;
  name: string;
  placeHolder: string;
  fontSize: string;
  label: string;
  size: string;
  options: { value: string, label: string }[] | any;
  type: string;
  subType: string;
  width: string;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  position: number;
  height: string;
  isCapitialize: boolean;
  tooltip: string;
  color: string;
  isDelete: boolean;
}

export interface FormControlUM {
  id: string;
  name: string;
  placeHolder: string;
  fontSize: string;
  label: string;
  size: string;
  options: { value: string, label: string }[] | any;
  type: string;
  subType: string;
  width: string;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  position: number;
  height: string;
  isCapitialize: boolean;
  tooltip: string;
  color: string;
  isDelete: boolean;
}
