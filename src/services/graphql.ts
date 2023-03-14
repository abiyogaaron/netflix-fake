import { IGraphQLResponse } from "@/interface";
import httpReq, { IHttpReqConfig } from "@/utils/httpReq";
import { MagicUserMetadata } from "@magic-sdk/admin";

const queryGraphQL = async (
  operationsDoc: string,
  operationName: string,
  variables: object = {},
  token: string,
): Promise<IGraphQLResponse | null> => {
  try {
    const config: IHttpReqConfig = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: operationsDoc,
        variables,
        operationName,
      })
    }
    const url = process.env.NEXT_PUBLIC_HASURA_ADMIN_URL || '';
    return await httpReq<IGraphQLResponse>(url, config);
  } catch (err) {
    console.log("Hasura GraphQL call error: ", err);
    return null;
  }
}

export const checkIsNewUser = async (token: string, issuer: string) => {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: {issuer: {_eq: $issuer }}) {
        id
        email
        issuer
      }
    }
  `;
  const response = await queryGraphQL(
    operationsDoc,
    'isNewUser',
    { issuer },
    token,
  );
  return response?.data?.users?.length === 0 || false;
}

export const createNewUser = async (token: string, metaData: MagicUserMetadata) => {
  const operationsDoc = `
    mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
        returning {
          email
          id
          issuer
        }
      }
    }
  `;
  const { issuer, email, publicAddress } = metaData;

  const response = await queryGraphQL(
    operationsDoc,
    'createNewUser',
    { issuer, email, publicAddress },
    token,
  );
  return response;
}

export const findVideoByUser = async (token: string, userId: string, videoId: string): Promise<IStatsData[]> => {
  const operationsDoc = `
    query findVideoByUser($userId: String!, $videoId: String!) {
      stats(where: { userId: {_eq: $userId }, videoId: {_eq: $videoId }}) {
        id
        userId
        videoId
        favorite
        watched
      }
    }
  `;

  const response = await queryGraphQL(
    operationsDoc,
    'findVideoByUser',
    {
      videoId,
      userId,
    },
    token,
  );
  return response?.data?.stats || false;
}

interface IStatsData {
  favorite: number;
  userId: string;
  watched: boolean;
  videoId: string;
}
export const updateStats = async (token: string, data: IStatsData) => {
  const operationsDoc = `
    mutation updateStats($favorite: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      update_stats(
        _set: { watched: $watched, favorite: $favorite },
        where: {
          userId: { _eq: $userId },
          videoId: { _eq: $videoId },
        }
      ) {
        returning {
          favorite,
          userId,
          watched,
          videoId,
        }
      }
    }
  `;
  const { favorite, userId, watched, videoId } = data;
  const response = await queryGraphQL(
    operationsDoc,
    'updateStats',
    { favorite, userId, watched, videoId },
    token,
  );
  return response;
}

export const insertStats = async (token: string, data: IStatsData) => {
  const operationsDoc = `
    mutation insertStats($favorite: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
      insert_stats_one(object: {favorite: $favorite, userId: $userId, watched: $watched, videoId: $videoId }) {
        favorite,
        id,
        userId,
      }
    }
  `;
  const { favorite, userId, watched, videoId } = data;
  const response = await queryGraphQL(
    operationsDoc,
    'insertStats',
    { favorite, userId, watched, videoId },
    token,
  );
  return response;
}

export const getWatchedVideos = async (token: string, userId: string): Promise<IStatsData[]> => {
  const operationsDoc = `
    query watchedVideos($userId: String!) {
      stats(where: {
        watched: {_eq: true},
        userId: {_eq: $userId},
      }) {
        videoId,
        userId,
        watched,
        favorite,
      }
    }
  `;
  const response = await queryGraphQL(
    operationsDoc,
    'watchedVideos',
    { userId },
    token,
  );
  return response?.data.stats;
}

export const getMyListVideos = async (token: string, userId: string): Promise<IStatsData[]> => {
  const operationsDoc = `
    query favoritedVideos($userId: String!) {
      stats(where: {
        userId: {_eq: $userId},
        favorite: {_eq: 1},
      }) {
        videoId,
        userId,
        watched,
        favorite,
      }
    }
  `;

  const response = await queryGraphQL(
    operationsDoc,
    'favoritedVideos',
    {
      userId,
    },
    token,
  );

  return response?.data.stats
}