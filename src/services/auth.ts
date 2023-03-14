import { END_POINTS } from '@/constants';
import { ILoginResponse } from '@/interface/server';
import httpReq, { IHttpReqConfig } from '@/utils/httpReq';
import { Magic, MagicUserMetadata } from 'magic-sdk';

const initMagic = () => {
  if (typeof window !== 'undefined') {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY || '');
  }
}

export const signinByEmail = async (email: string): Promise<string | null> => {
  try {
    const magic = initMagic();
    if (!magic) {
      return null;
    }

    const didToken = await magic.auth.loginWithMagicLink({
      email,
    });
    return didToken;
  } catch (err) {
    console.error("signin process got an error: ", err);
    return null;
  }
}

export const getUserData = async (): Promise<MagicUserMetadata | null> => {
  try {
    const magic = initMagic();
    if (!magic) {
      return null;
    }

    const userData = await magic.user.getMetadata();
    return userData;
  } catch (err) {
    console.error("get user meta data got an error: ", err);
    return null;
  }
}

export const signout = async (): Promise<boolean> => {
  try {
    const magic = initMagic();
    if (!magic) {
      return false;
    }
    return await magic.user.logout();
  } catch (err) {
    console.error("Error on signout process: ", err);
    return false;
  }
}

export const checkisLoggedIn = async (): Promise<boolean> => {
  try {
    const magic = initMagic();
    if (!magic) {
      return false;
    }
    return await magic.user.isLoggedIn();
  } catch (err) {
    console.error("check user logged in: ", err);
    return false;
  }
}

export const signinServer = async (didToken: string): Promise<boolean> => {
  try {
    const config: IHttpReqConfig = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${didToken}`,
        "Content-Type": "application/json",
      },
    }
    const response = await httpReq<ILoginResponse>(
      END_POINTS.VERIFICATION_USER,
      config,
    );
    return !!response.data?.cookie || false;
  } catch (err) {
    console.error("verification user: ", err);
    return false;
  }
}
