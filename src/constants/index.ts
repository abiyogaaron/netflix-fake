import { ErrorCodesService } from "@/types";

export const ENV = process.env.NODE_ENV || 'production';

export const ROUTE_PATH = {
  HOME: '/',
  MY_LIST: '/browse/my-list',
};

const YOUTUBE_BASE = 'https://youtube.googleapis.com';
export const END_POINTS = {
  GET_VIDEOS: `${YOUTUBE_BASE}/youtube/v3/search?part=snippet&maxResults={maxResults}&q={q}&type={type}&key={key}`,
  GET_POPULAR_VIDEOS: `${YOUTUBE_BASE}/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults={maxResults}&key={key}`,
  GET_VIDEO_DETAILS: `${YOUTUBE_BASE}/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id={id}&key={key}`,
  VERIFICATION_USER: '/api/login',
  TOGGLE_LIKE: 'api/stats',
  LOGOUT: 'api/logout',
}
export const MAX_RESULTS = 10;

export const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80';

export const COOKIE_MAX_AGE = 24 * 60 * 60;

export const ERROR_OBJ_SERVICE: Record<ErrorCodesService, { message: string, httpCode: number }> = {
  [ErrorCodesService.GENERAL_ERROR]: {
    message: 'There are something wrong with the server',
    httpCode: 500,
  },
  [ErrorCodesService.NO_QUERY_PARAMS]: {
    message: 'There is no query param !',
    httpCode: 400,
  },
  [ErrorCodesService.WRONG_HTTP_METHOD]: {
    message: 'Wrong http method !',
    httpCode: 400,
  },
  [ErrorCodesService.MISSING_SOME_REQ_BODY]: {
    message: 'Some request body are missing',
    httpCode: 400,
  },
  [ErrorCodesService.RESOURCE_NOT_FOUND]: {
    message: 'Resource not found',
    httpCode: 404,
  },
  [ErrorCodesService.UNAUTHORIZED]: {
    message: 'You do not have authorization to access',
    httpCode: 401,
  }
}
