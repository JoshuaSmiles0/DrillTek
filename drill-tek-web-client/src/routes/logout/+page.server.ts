import { drilltekService } from '$lib/services/drilltek-service.js';
import axios from 'axios';
import type { PageServerLoad } from '../$types';
import { redirect } from '@sveltejs/kit';

/*
on load returns session from parent. First attempts to blacklist api token using 
associated endpoint. If blacklist successful removes token from axios auth headers
and deletes cookie, redirecting to landing page. If unsuccessful redirects to main portal
for user to try again
*/
export const load: PageServerLoad = async ({ parent, cookies }) => {
    const { session } = await parent();
  if (session) {
    const response = await drilltekService.backlistToken(session.accessToken, session.refreshToken)
    if(response === 200) {
    delete axios.defaults.headers.common['Authorization'];
    cookies.delete("drilltekUser",{path:"/"});
    }
    else {
        redirect(302,"/mainportal")
    }
};
}