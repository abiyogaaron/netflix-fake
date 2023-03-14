import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

type TBody = object | string | undefined;
type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface IHttpReqConfig extends AxiosRequestConfig {
  data?: TBody;
  method: TMethod;
}

function httpReq<IResponseObj = any>(url: string, config: IHttpReqConfig): Promise<IResponseObj> {
  return new Promise<IResponseObj>((resolve, reject) => {
    axios(url, config)
      .then((r: AxiosResponse<IResponseObj>) => {
        resolve(r.data);
      })
      .catch((e: AxiosError<any>) => {
        console.error(
          '[httpReq] Request failed: ',
          url,
          '\n',
          e,
        );
        reject(e);
      });
  });
}

export default httpReq;
