import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { Magic } from '@magic-sdk/admin';

import { ErrorCodesService } from "@/types";
import { ERROR_OBJ_SERVICE } from "@/constants";
import { verifyToken } from "@/utils/indext";

export const magicServer = new Magic(process.env.MAGIC_SERVER_KEY);

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw ErrorCodesService.WRONG_HTTP_METHOD;
    }
    if (!req.cookies.token) {
      throw ErrorCodesService.UNAUTHORIZED;
    }

    const userId = await verifyToken(req.cookies.token);
    const val = cookie.serialize('token', "", {
      maxAge: -1,
      path: '/',
    });
    await magicServer.users.logoutByIssuer(userId);

    res.setHeader('Set-Cookie', val);
    res.writeHead(302, { Location: '/login' });
    res.end();
  } catch (err) {
    console.error("error getting data -> ", err);
    
    let errors;
    if (ERROR_OBJ_SERVICE[err as ErrorCodesService]) {
      errors = ERROR_OBJ_SERVICE[err as ErrorCodesService];
    } else {
      errors = ERROR_OBJ_SERVICE[ErrorCodesService.GENERAL_ERROR];
    }
    res.status(errors.httpCode);
    res.json({
      message: errors.message,
      err,
    });
  }
}

export default logout;