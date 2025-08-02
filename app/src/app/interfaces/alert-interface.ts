export interface AlertInterface {
  show: boolean;
  message: string;
  type: AlertTypes;
}

export enum AlertTypes {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  WARNING = "WARNING",
}
