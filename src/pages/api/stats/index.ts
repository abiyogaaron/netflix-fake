import { NextApiRequest, NextApiResponse } from "next";
import { ErrorCodesService } from "@/types";
import { ERROR_OBJ_SERVICE } from "@/constants";
import { 
  findVideoByUser,
  updateStats,
  insertStats,
} from "@/services/graphql";
import { IStatsResponse } from "@/interface/server";
import { verifyToken } from "@/utils/indext";

const getStatData = async (req: NextApiRequest, res: NextApiResponse<IStatsResponse>) => {
  try {
    if (!req.cookies.token) {
      throw ErrorCodesService.UNAUTHORIZED;
    }
    if (!req.query.videoId) {
      throw ErrorCodesService.NO_QUERY_PARAMS;
    }

    const { videoId } = req.query;
    const userId = await verifyToken(req.cookies.token);

    const stats = await findVideoByUser(req.cookies.token, userId, videoId as string);
    const isExists = stats.length > 0;
    if (!isExists) {
      throw ErrorCodesService.RESOURCE_NOT_FOUND;
    }

    return res.status(200).json({
      message: 'founded',
      data: stats,
    });
  } catch (err) {
    console.error("error getting data -> ", err);
    
    let errors;
    if (ERROR_OBJ_SERVICE[err as ErrorCodesService]) {
      errors = ERROR_OBJ_SERVICE[err as ErrorCodesService];
    } else {
      errors = ERROR_OBJ_SERVICE[ErrorCodesService.GENERAL_ERROR];
    }

    return res.status(errors.httpCode).json({
      message: errors.message,
      err,
    });
  }
}

const ratingVideo = async (req: NextApiRequest, res: NextApiResponse<IStatsResponse>) => {
  try {
    if (!req.cookies.token) {
      throw ErrorCodesService.UNAUTHORIZED;
    }

    const { videoId, favorite, watched = true } = req.body;
    const userId = await verifyToken(req.cookies.token);

    const isExists = await findVideoByUser(req.cookies.token, userId, videoId);
    console.log("isExists --> ", isExists);
    if (isExists) {
      const response = await updateStats(req.cookies.token, {
        watched,
        userId,
        videoId,
        favorite,
      });

      return res.status(200).json({
        message: 'updated stats',
        data: { response }
      });
    }

    const response = await insertStats(req.cookies.token, {
      watched,
      userId,
      videoId,
      favorite,
    });

    return res.status(200).json({
      message: 'inserted stats',
      data: { response }
    });
  } catch (err) {
    console.error("error getting data -> ", err);
    
    let errors;
    if (ERROR_OBJ_SERVICE[err as ErrorCodesService]) {
      errors = ERROR_OBJ_SERVICE[err as ErrorCodesService];
    } else {
      errors = ERROR_OBJ_SERVICE[ErrorCodesService.GENERAL_ERROR];
    }

    return res.status(errors.httpCode).json({
      message: errors.message,
      err,
    });
  }
}

const stats = async (req: NextApiRequest, res: NextApiResponse<IStatsResponse>) => {
  if (req.method === 'POST') {
    ratingVideo(req, res);
  } else if (req.method === 'GET') {
    getStatData(req, res);
  }
}

export default stats;