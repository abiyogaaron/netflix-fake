import { NextApiRequest, NextApiResponse } from "next";
import { Magic } from '@magic-sdk/admin';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import { COOKIE_MAX_AGE, ENV, ERROR_OBJ_SERVICE } from "@/constants";
import { ErrorCodesService } from "@/types";
import { ILoginResponse } from "@/interface/server";

import { checkIsNewUser, createNewUser } from "@/services/graphql";

export const magicServer = new Magic(process.env.MAGIC_SERVER_KEY);

const login = async (req: NextApiRequest, res: NextApiResponse<ILoginResponse>) => {
  try {
    if (req.method !== 'POST') {
      throw ErrorCodesService.WRONG_HTTP_METHOD;
    }
    if (!req.headers.authorization) {
      throw ErrorCodesService.UNAUTHORIZED;
    }

    const didToken = req.headers.authorization.substring(7);
    const metadata = await magicServer.users.getMetadataByToken(didToken);

    const token = jwt.sign({
      ...metadata,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user", "admin"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": `${metadata.issuer}`,
      },
    }, process.env.HASURA_GRAPHQL_JWT_SECRET || '');

    /**
     * Set http cookie
     */
    const cookieData = cookie.serialize('token', token, {
      maxAge: COOKIE_MAX_AGE,
      expires: new Date(Date.now() + COOKIE_MAX_AGE * 1000),
      secure: ENV === 'production',
      path: '/',
    })
    const isNewUser = await checkIsNewUser(token, metadata.issuer || '');
    console.log("check is new user in hasura: ", isNewUser);
    if (isNewUser) {
      const createdUser = await createNewUser(token, metadata);
      console.log("created user in hasura: ", createdUser);
    }

    res.status(200); 
    res.setHeader('Set-Cookie', cookieData);
    res.json({
      message: 'Sign-in success',
      data: { cookie: cookieData },
    });
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

export default login;