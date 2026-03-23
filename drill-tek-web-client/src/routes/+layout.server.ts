import { drilltekService } from "$lib/services/drilltek-service";
import type { Session } from "$lib/types/drilltek-types";
import type { LayoutServerLoad } from "./$types";

/*
Layout server load for application. Obtains cookie for page load. 
Attempts to test the access token before returning to ascertain if an 
access token refresh is required. If test endpoint contacted successfully 
, returns cookie details as session, else will attempt to refresh the access
token and reset cookie with new access token.
*/
export const load: LayoutServerLoad = async ({ cookies, fetch }) => { 
  const cookieStr = cookies.get("drilltekUser") as string;
  
  if (cookieStr) {
    try {
      const session = JSON.parse(cookieStr) as Session;
      console.log(session);
      
      const test = await fetch('http://localhost:8000/api/user/testEndpoint', {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      
      if (test.ok) {
        return { session };
      }
      else if (test.status === 401 && session.refreshToken) {
        const newAccess = await drilltekService.refreshToken(session.refreshToken);
        if (newAccess) {
          session.accessToken = newAccess;
          cookies.set("drilltekUser", JSON.stringify(session), {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: import.meta.env.DEV ? false : true,
            maxAge: 60 * 60 * 24 * 7
          });
        }
        return { session };
      }
    } catch (error) {
      console.error('Session error:', error);
      cookies.delete("drilltekUser", { path: "/" });
    }
  }
  
  return { session: null };
};