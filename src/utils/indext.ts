import { jwtVerify } from "jose";

export const verifyToken = async (token: string): Promise<string> => {
  try {
    if (token) {
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.HASURA_GRAPHQL_JWT_SECRET)
      );
      return verified.payload?.issuer as string;
    }
    return '';
  } catch (err) {
    console.log("verify token: ", err);
    return '';
  }
}