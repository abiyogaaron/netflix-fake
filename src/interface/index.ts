interface IVideoItems {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  },
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number;
      },
      high: {
        url: string;
        width: number;
        height: number;
      }
    },
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  }
}
export interface IGetVideoListResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  },
  items: IVideoItems[];
}

interface IPopularVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      },
      medium: {
        url: string;
        width: number;
        height: number;
      },
      high: {
        url: string;
        width: number;
        height: number;
      },
      standard: {
        url: string;
        width: number;
        height: number;
      },
      maxres: {
        url: string;
        width: number;
        height: number;
      }
    },
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    },
    defaultAudioLanguage: string;
  },
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean,
    regionRestriction: {
      blocked: string[];
    },
    contentRating: Object;
    projection: string;
  },
  statistics: {
    viewCount: string;
    likeCount: string;
    favoriteCount: string;
    commentCount: string;
  }
}
export interface IGetPopularVideoListResponse {
  kind: string;
  etag: string;
  items: IPopularVideoItem[];
}

export interface IVideosData {
  title: string;
  imgUrl: string;
  id: string;
}

export interface IVideosDataDetail extends IVideosData {
  description: string;
  publishTime: string;
  channelTitle: string;
  statistics: {
    viewCount: number;
  }
}

export interface IGraphQLResponse {
  errors?: any,
  data?: any;
}