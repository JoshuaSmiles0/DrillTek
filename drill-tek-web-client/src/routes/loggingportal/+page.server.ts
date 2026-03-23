import { drilltekService } from "$lib/services/drilltek-service";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";



export const load: PageServerLoad = async ({ parent }) => {
const { session } = await parent();
  if (session) {
    try {
    const programs = await drilltekService.getPrograms(session.accessToken)
    console.log(programs)
    return {
      programs,
      session
  }}
  catch(error) {
    console.log(error)
  }
}
  else {
    redirect(302,"/logout")
  }}