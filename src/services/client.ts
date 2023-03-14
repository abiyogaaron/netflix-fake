import { IGetPopularVideoListResponse, IGetVideoListResponse, IVideosData, IVideosDataDetail } from "@/interface";
import { TYoutubeVideo } from "@/types";
import { END_POINTS, MAX_RESULTS } from "@/constants";
import httpReq, { IHttpReqConfig } from "@/utils/httpReq";

export const getVideos = async (
  query: string, 
  type: TYoutubeVideo,
): Promise<IVideosData[]> => {
  try {
    const url = END_POINTS.GET_VIDEOS
      .replace('{maxResults}', MAX_RESULTS.toString())
      .replace('{q}', query)
      .replace('{type}', type)
      .replace('{key}', process.env.YOUTUBE_API_KEY || '');
    const config: IHttpReqConfig = {
      method: 'GET'
    }

    const data = await httpReq<IGetVideoListResponse>(url, config);
    return data.items.map((item) => {
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: item.id.videoId,
      }
    });
  } catch (err) {
    console.log("getVideos got an error: ", err);
    return [];
  }
}

export const getPopularVideos = async (): Promise<IVideosData[]> => {
  try {
    const url = END_POINTS.GET_POPULAR_VIDEOS
      .replace('{maxResults}', MAX_RESULTS.toString())
      .replace('{key}', process.env.YOUTUBE_API_KEY || '');
    const config: IHttpReqConfig = {
      method: 'GET'
    }

    const data = await httpReq<IGetPopularVideoListResponse>(url, config);
    return data.items.map((item) => {
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: item.id,
      }
    });
  } catch (err) {
    console.log("getPopularVideos got an error: ", err);
    return [];
  }
}

export const getVideoDetails = async (id: string): Promise<IVideosDataDetail[]> => {
  try {
    const url = END_POINTS.GET_VIDEO_DETAILS
      .replace('{id}', id)
      .replace('{key}', process.env.YOUTUBE_API_KEY || '');
    const config: IHttpReqConfig = {
      method: 'GET'
    }

    const data = await httpReq<IGetPopularVideoListResponse>(url, config);
    return data.items.map((item) => {
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id: item.id,
        description: item.snippet.description,
        publishTime: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        statistics: {
          viewCount: parseInt(item.statistics.viewCount),
        }
      }
    });
  } catch (err) {
    console.log("getVideoDetails got an error: ", err);
    return [];
  }
}

export const toggleLike = async (videoId: string, favorite: number) => {
  try {
    const url = END_POINTS.TOGGLE_LIKE;
    const config: IHttpReqConfig = {
      method: 'POST',
      data: JSON.stringify({
        videoId,
        favorite,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const data = await httpReq(`${window.location.origin}/${url}`, config);
    return data;
  } catch (err) {
    console.log("getVideoDetails got an error: ", err);
  }
}

export const logout = async () => {
  try {
    const url = END_POINTS.LOGOUT;
    const config: IHttpReqConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    await httpReq(`${window.location.origin}/${url}`, config);
  } catch (err) {
    console.log("logout got an error: ", err);
  }
}