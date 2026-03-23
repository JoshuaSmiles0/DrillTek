import { drilltekService } from "$lib/services/drilltek-service";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Session } from "$lib/types/drilltek-types";
import { refresh } from "$lib/services/drilltek-utils";




/*
Page load function. Attempts to retrieve session object from parent layout
If session object not present redirects to logout. If session present attempts to 
retrieve drillhole from api using access token and holeid parsed as number. 
Also makes call to api to retrieve user email by userid in session as this is 
used in drillhole display. returns drillhole, session and email to page for use
*/
export const load: PageServerLoad = async ({ parent , params }) => {
const { session } = await parent();
  if (session) {
    try {
    const drillhole = await drilltekService.getDrillholeById(session.accessToken, parseInt(params.holeid))
    let email = ""
    if('userid' in drillhole){
      const id = drillhole.userid as string
      email = await drilltekService.getUserEmailById(session.accessToken,parseInt(id))
    }
    console.log(drillhole)
    return {
      drillhole,
      session,
      email
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
    Edit drillhole server action. identifies if cookie, therefore session is present.
    if present, extracts form data. Has to parse most fields as ints or floats as form
    data is returned as string (data cleaning). Constructs new drillhole object for posting 
    via service and attempts to do so. If successful empty return passed returning user to 
    page. If 401 error returned by service function, attempts to refresh access token using 
    refresh token and then retries service. If retry fails, user redirected to logout. If other
    error occurs, error thrown and user redirected to error page
    */
    editDrillhole: async({request, params, cookies}) => {
          const cookiestr = cookies.get("drilltekUser")
          if(cookiestr) {
            const session = JSON.parse(cookiestr) as Session
            if(session){
              const form = await request.formData();
              const currentID = parseInt(params.holeid)
              const xcoordstr = form.get("xcoord") as string | null
              const xcoord = xcoordstr ? parseFloat(xcoordstr).toFixed(2) : 0.00
              const ycoordstr = form.get("ycoord") as string | null
              const ycoord = ycoordstr ? parseFloat(ycoordstr).toFixed(2) : 0.00
              const zcoordstr = form.get("zcoord") as string | null
              const zcoord = zcoordstr ? parseFloat(zcoordstr).toFixed(2) : 0.00
              const dipstr = form.get("dip") as string | null
              const dip = dipstr ? parseFloat(dipstr).toFixed(2) : 0.00
              const azimuthstr = form.get("azimuth") as string | null
              const azimuth = azimuthstr ? parseFloat(azimuthstr).toFixed(2) : 0.00
              const lengthstr = form.get("length") as string | null
              const length = lengthstr ? parseFloat(lengthstr).toFixed(2) : 0.00
              const typestr = form.get("type") as string | null
              const type = typestr ? parseInt(typestr) : 1
              const drillhole = {
                xcoord: xcoord as number,
                ycoord:ycoord as number,
                zcoord:zcoord as number,
                dip:dip as number,
                azimuth: azimuth as number,
                length: length as number, 
                type:type as number,
              }
              const response = await drilltekService.editDrillhole(session.accessToken,drillhole,currentID)
              if(response === 200) {
                return
              }
              else if (response === 401) {
                const refreshtry = await refresh(session.refreshToken,cookies)
                if(refreshtry) {
                   const res = await drilltekService.editDrillhole(refreshtry.accessToken,drillhole,parseInt(params.holeid))
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
                    message:"unable to update drillhole ",
                    holeid: currentID,
                    status:400
                })
              }
            }
          }
        },

    /*
    Server action for deleting drillhole. First checks if cookie present and wraps into 
    session object for use in API call. obtains holeid from params and programid from 
    form data. Attempts api request to delete hole using access token from session and 
    holeid. If successful redirects user to associated program page. If unsuccessful but
    404 response, tries again and logs out if refresh fails, else throws 400 error and redirects
    user to error page
    */
    deleteDrillhole: async({request,cookies, params}) => {
        const cookiestr = cookies.get("drilltekUser")
        if(cookiestr){
          const session = JSON.parse(cookiestr) as Session
          if(session){
            const id = parseInt(params.holeid)
            const form = await request.formData();
            const programid = form.get('deleteDrillhole') as string
            console.log(id)
            const response = await drilltekService.deleteDrillhole(session.accessToken, id)
              if(response === 200) {
              redirect(302,`/drillprogram/${programid}`)
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
              if(refreshtry) {
                 const res = await drilltekService.deleteDrillhole(session.accessToken, id)
                 if(res === 200) {
                  redirect(302,`/drillprogram/${programid}`)
                 }
                 else {
                  redirect(302,"/logout")
                 }
              }
            }
            else {
              throw error(400,{
                  message:"unable to delete drillhole at this time ",
                  status:400,
                  holeid:id
              })
            }
          }
        }
      },
  }
