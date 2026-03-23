import { drilltekService } from "$lib/services/drilltek-service";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { Alterationlog, Lithlog, Minerallog, Session, Structurelog } from "$lib/types/drilltek-types";
import { refresh, setAlterationType, setLithType, setStructureType } from "$lib/services/drilltek-utils.js";




/*
Page load for logging page. Not just lithology logging as this functions like a semi 
SPA. On load checks if layout passes session. If session present attempts to load 
hole details and all associated logs from api to return these to page. if no session present
redirects to logout 
*/
export const load: PageServerLoad = async ({ parent, params }) => {
const { session } = await parent();
  if (session) {
    try {
    const holeid = parseInt(params.holeid)
    const hole = await drilltekService.getDrillholeById(session.accessToken, holeid )
    const lithlog = await drilltekService.getLithLog(session.accessToken, holeid)
    const alterationlog = await drilltekService.getAlterationLog(session.accessToken, holeid)
    const structurelog = await drilltekService.getStructureLog(session.accessToken, holeid)
    const minerallog = await drilltekService.getMineralLog(session.accessToken, holeid)
    console.log(lithlog)
    console.log(alterationlog)
    console.log(structurelog)
    console.log(minerallog)
    return {
      hole,
      lithlog,
      alterationlog,
      structurelog,
      minerallog,
      session,
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
    Similar pattern for all uploading of logs functions below. first retrieves session from 
    cookie. Once extracted, retrieves log as string from form posted using axios. log string
    then parsed as log[]. Log passed through associated logtype utility to append logtype to 
    each item on the array. Retrieves holeid from page params for api requests. First attempts
    to delete the existing log, if successful attempts to add the new log using the api. Code 
    length here related to having to reattempt these functions after a token refresh if they 
    fail with a 401. success messages returned at each opportunity to control display of messages
    on page. 
    */
        uploadLith:async({request, cookies, params}) => {
          const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
          const data = form.get('lithLog') as string
          const log = JSON.parse(data) as Lithlog[]
          const updatedLog = setLithType(log)
          const hole = params.holeid
          const holeInt = parseInt(hole)
          const res = await drilltekService.deleteLithLogByHoleid(session.accessToken, holeInt)
          if(res === 200) {
            const response = await drilltekService.addLithLog(session.accessToken, updatedLog )
            if(response === 201){
              return {success: "y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addLithLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success: "y"} 
               }
               else {
                return {success: "n"}
               }
            }
            }
          }
          else if (res === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.deleteLithLogByHoleid(refreshtry.accessToken, holeInt)
               if(res === 200) {
                const response = await drilltekService.addLithLog(refreshtry.accessToken, updatedLog )
                 if(response === 201){
              return {success:"y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addLithLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success:"y"}
               }
               else {
                return {success:"n"}
               }
              }
               }
               else {
                return {success:"n"}
               }
            }
          }
        }
          else {
            return {success:"n"}
          }
        }
        return {success:"n"}
      }
      
    },

        uploadAlt:async({request, cookies, params}) => {
          const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
          const data = form.get('altLog') as string
          const log = JSON.parse(data) as Alterationlog[]
          const updatedLog = setAlterationType(log)
          const hole = params.holeid
          const holeInt = parseInt(hole)
          const res = await drilltekService.deleteAlterationLogByHoleid(session.accessToken, holeInt)
          if(res === 200) {
            const response = await drilltekService.addAlterationLog(session.accessToken, updatedLog )
            if(response === 201){
              return {success: "y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addAlterationLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success: "y"} 
               }
               else {
                return {success: "n"}
               }
            }
            }
          }
          else if (res === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.deleteAlterationLogByHoleid(refreshtry.accessToken, holeInt)
               if(res === 200) {
                const response = await drilltekService.addAlterationLog(refreshtry.accessToken, updatedLog )
                 if(response === 201){
              return {success:"y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addAlterationLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success:"y"}
               }
               else {
                return {success:"n"}
               }
              }
               }
               else {
                return {success:"n"}
               }
            }
          }
        }
          else {
            return {success:"n"}
          }
        }
        return {success:"n"}
      }
      
    },

            uploadStruc:async({request, cookies, params}) => {
          const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
          const data = form.get('strucLog') as string
          const log = JSON.parse(data) as Structurelog[]
          const updatedLog = setStructureType(log)
          const hole = params.holeid
          const holeInt = parseInt(hole)
          const res = await drilltekService.deleteStructureLogByHoleid(session.accessToken, holeInt)
          if(res === 200) {
            const response = await drilltekService.addStructureLog(session.accessToken, updatedLog )
            if(response === 201){
              return {success: "y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addStructureLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success: "y"} 
               }
               else {
                return {success: "n"}
               }
            }
            }
          }
          else if (res === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.deleteStructureLogByHoleid(refreshtry.accessToken, holeInt)
               if(res === 200) {
                const response = await drilltekService.addStructureLog(refreshtry.accessToken, updatedLog )
                 if(response === 201){
              return {success:"y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addStructureLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success:"y"}
               }
               else {
                return {success:"n"}
               }
              }
               }
               else {
                return {success:"n"}
               }
            }
          }
        }
          else {
            return {success:"n"}
          }
        }
        return {success:"n"}
      }
      
    },

            uploadMin:async({request, cookies, params}) => {
          const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
          const data = form.get('minLog') as string
          const updatedLog = JSON.parse(data) as Minerallog[]
          const hole = params.holeid
          const holeInt = parseInt(hole)
          const res = await drilltekService.deleteMineralLogByHoleid(session.accessToken, holeInt)
          if(res === 200) {
            const response = await drilltekService.addMineralLog(session.accessToken, updatedLog )
            if(response === 201){
              return {success: "y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addMineralLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success: "y"} 
               }
               else {
                return {success: "n"}
               }
            }
            }
          }
          else if (res === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.deleteMineralLogByHoleid(refreshtry.accessToken, holeInt)
               if(res === 200) {
                const response = await drilltekService.addMineralLog(refreshtry.accessToken, updatedLog )
                 if(response === 201){
              return {success:"y"}
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
                          if(refreshtry) {
               const response = await drilltekService.addMineralLog(refreshtry.accessToken, updatedLog )
               if(response === 201) {
                return {success:"y"}
               }
               else {
                return {success:"n"}
               }
              }
               }
               else {
                return {success:"n"}
               }
            }
          }
        }
          else {
            return {success:"n"}
          }
        }
        return {success:"n"}
      }
      
    },
  }
   
     





  