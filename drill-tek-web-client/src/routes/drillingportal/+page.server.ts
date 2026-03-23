import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { drilltekService } from "$lib/services/drilltek-service";
import type { Session } from "$lib/types/drilltek-types.js";
import { refresh } from "$lib/services/drilltek-utils.js";



/*
Page load function. Attempts to derive session from parent layout. If successful
attemptes to retrieve programs from api. Returns programs and session to view
*/
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

  export const actions = {

    /*
    Add program server action. checks if session present. If so constructs a program
    object from passed form data then attempts to call API endpoint. If successful returns
    to page. If unsuccessful but 401 code returned, attempts to refresh and try again. If other 
    error, throws error to redirect user to error page to try again
    */
    addProgram: async({request, cookies}) => {
      const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
          const program = {
            programid:form.get("programid") as string,
            orebody:form.get("orebody") as string,
            location:form.get("location") as string,
            target:form.get("target") as string,
            totalholes:0 as number,
            totalmeters:0.00 as number, 
            userid:session.userid as number
          }
          const response = await drilltekService.createDrillProgram(session.accessToken,program)
          if(response === 201) {
            return
          }
          else if (response === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.createDrillProgram(refreshtry.accessToken,program)
               if(res === 201) {
                return
               }
               else {
                redirect(302,"/logout")
               }
            }
          }
          else {
             throw error(400,{
                                message:"unable to Add program at this time ",
                                status:400
                            })
          }
        }
      }
    }
  }
  
