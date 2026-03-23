import axios from "axios";
import { drilltekService } from "./services/drilltek-service";
import type { Session } from "./types/drilltek-types";

const api = axios.create({
    baseURL:"http://localhost:8000/api/",
});

// Abandoned axios interceptor not used for refreshing token as app is SSR focused. Would be
// To use if requests done in client pages so remaining in

if (typeof window !== 'undefined') {
api.interceptors.response.use(
    (reponse) => reponse,
    async (error) => {
        if(error.reponse.status === 401) {
            try {
                const cookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('drilltekUser='))
                ?.split('=')[1];
                if(cookie) {
                    const cookiestr = JSON.parse(decodeURIComponent(cookie))
                    if(cookiestr.refreshToken) {
                        const data  = await drilltekService.refreshToken(cookiestr.refreshToken)
                        if (data !== null) {
                            const session: Session = {
                            email: cookiestr.email,
                            accessToken: data,
                            refreshToken: cookiestr.refresh,
                            userid: cookiestr.userid
                             };
                             const newCookieStr = JSON.stringify(session)
                             const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000).toUTCString();
                             const secureFlag = import.meta.env.DEV ? '' : 'secure; ';
                             document.cookie =`drilltekUser=${encodeURIComponent(newCookieStr)}; ` +
                             `path=/; ` +
                             `expires=${expires}; ` +
                             `SameSite=strict; ` +
                             `${secureFlag}}` +
                             `max-age=${60 * 60 * 24 * 7}`;
                             error.config.headers.Authorization = `Bearer ${data}`;
                             return api(error.config);
                            }
                        }
                    }
                    else {
                        window.location.href= '/logout'
                    }

                }
                catch(refreshError) {
                    console.log(refreshError)
                    window.location.href='/logout'
                }
            }
            return Promise.reject(error);
        }
)
}

export default api;