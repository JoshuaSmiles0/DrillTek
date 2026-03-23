import { drilltekService } from "$lib/services/drilltek-service";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { AddDrillhole, Session } from "$lib/types/drilltek-types";
import { refresh } from "$lib/services/drilltek-utils";
import Papa from 'papaparse'


/*
Page load function. Retrieves session from parent layout. retrieves drillprogram from 
api and user email passing userid from session. Returns these as data to page
*/
export const load: PageServerLoad = async ({ parent, params }) => {
const { session } = await parent();
  if (session) {
    try {
    const program = await drilltekService.getProgramById(session.accessToken, params.programid)
    let email = ""
    if('userid' in program){
      const id = program.userid as string
      email = await drilltekService.getUserEmailById(session.accessToken,parseInt(id))
    }
    const holes = await drilltekService.getDrillholeByProgramId(session.accessToken, params.programid)
    console.log(program)
    return {
      program,
      holes,
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
    Editprogram server action. See drillhole/holeid route for explaination, similar 
    logic and structure
    */
      editProgram: async({request, cookies, params}) => {
        const cookiestr = cookies.get("drilltekUser")
        if(cookiestr) {
          const session = JSON.parse(cookiestr) as Session
          if(session){
            const form = await request.formData();
            const currentProgram = params.programid as string
            console.log(currentProgram)
            const program = {
              orebody:form.get("orebody") as string,
              location:form.get("location") as string,
              target:form.get("target") as string,
            }
            const response = await drilltekService.editProgram(session.accessToken,program,currentProgram)
            if(response === 200) {
              return
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
              if(refreshtry) {
                 const res = await drilltekService.editProgram(refreshtry.accessToken,program,currentProgram)
                 if(res === 200) {
                  return
                 }
                 else {
                  redirect(302,"/logout")
                 }
              }
            }
            else {
              throw error(400,{
                  message:"unable to Edit program at this time ",
                  status:400,
                  programid:params.programid
              })
            }
          }
        }
      },

    /*
    deleteprogram server action. See drillhole/holeid route for explaination, similar 
    logic and structure
    */
      deleteProgram: async({request,cookies, params}) => {
        const cookiestr = cookies.get("drilltekUser")
        if(cookiestr){
          const session = JSON.parse(cookiestr) as Session
          if(session){
            const id = params.programid
            console.log(id)
            const response = await drilltekService.deleteProgram(session.accessToken, id)
              if(response === 200) {
              redirect(302,"/drillingportal")
            }
            else if (response === 401) {
              const refreshtry = await refresh(session.refreshToken,cookies)
              if(refreshtry) {
                 const res = await drilltekService.deleteProgram(session.accessToken, id)
                 if(res === 200) {
                  redirect(302,"/drillingportal")
                 }
                 else {
                  redirect(302,"/logout")
                 }
              }
            }
            else {
              throw error(400,{
                  message:"unable to delete program at this time ",
                  status:400,
                  programid:params.programid
              })
            }
          }
        }
      },

    /*
    AddDrillhole server action. See drilling portal route for explaination, similar 
    logic and structure
    */
      addDrillhole: async({request, params, cookies}) => {
      const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const form = await request.formData();
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
            programid:params.programid as string,
            userid: session.userid as number
          }
          const response = await drilltekService.createDrillhole(session.accessToken,drillhole)
          if(response === 201) {
            return
          }
          else if (response === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.createDrillhole(refreshtry.accessToken,drillhole)
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
                  message:"unable to add drillhole at this time ",
                  status:400,
                  programid:params.programid
              })
          }
        }
      }
    },

    /*
    server action for uploading holes as .csv. retrieves session from cookie
    retrieves file submitted in from from formdata as file. uses file.arraybuffer
    to convert the contents of the file to binary data then uses a text decoder to 
    convert the binary to a csv string. Papa.parse then used to convert csv string
    into array of objects. Array of objects iterated over to append program and user
    id to each object required for committing data. Then attempts to upload array of 
    holes over api. If successful returns to page, if unsuccessful but 404 returned, 
    retries request. If retry fails, redirects user to logout. If other errors produced
    errors thrown and user redirected to error page
    */
    uploadHoles: async({request, params, cookies}) => {
      const cookiestr = cookies.get("drilltekUser")
      if(cookiestr) {
        const session = JSON.parse(cookiestr) as Session
        if(session){
          const formData = await request.formData()
          const file = formData.get('fileUpload') as File
          if(file){
          const rawCsv = await file.arrayBuffer();
          console.log(rawCsv)
          const csvText = new TextDecoder().decode(rawCsv);
          console.log(csvText)
          const d = Papa.parse(csvText, {
            header:true,
            skipEmptyLines:true
          })
          const holes = d.data as AddDrillhole[]
          holes.forEach(hole => {
            hole.programid = params.programid
            hole.userid = session.userid
          });
          const response = await drilltekService.uploadHoles(session.accessToken, holes);
          if(response === 201) {
            return
          }
          else if (response === 401) {
            const refreshtry = await refresh(session.refreshToken,cookies)
            if(refreshtry) {
               const res = await drilltekService.uploadHoles(session.accessToken, holes);
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
                  message:"unable to upload holes at this time ",
                  status:400,
                  programid:params.programid
              })
          }
        }
        else {
                  throw error(400,{
                  message:"unable to upload holes at this time ",
                  status:400,
                  programid:params.programid
              })
        }
    }
    }
  }
}