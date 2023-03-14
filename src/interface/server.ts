export interface ILoginResponse {
  message: string;
  err?: any;
  data?: {
    cookie: string;
  }
}

export interface IStatsResponse {
  message: string;
  err?: any;
  data?: any
}