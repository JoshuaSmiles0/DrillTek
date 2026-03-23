import { dev } from "$app/environment";
import axios from "axios";
import { drilltekService } from "./drilltek-service"
import type { Cookies } from "@sveltejs/kit"
import type { AddAlterationLog, AddLithLog,  AddStructureLog,  Session } from "$lib/types/drilltek-types";


/**
 * Utility function for refreshing access token if expired using users refresh token
 * Takes a refresh token and passed down Sveltekit cookie object. If refresh successful
 * using drilltek service method , resets the sessions cookie with new access token and 
 * also returns the new session for use in retry attempts. If any other outcome returns null
 * @param token 
 * @param cookies 
 * @returns Session || null
 */
export async function refresh(token:string|null, cookies:Cookies) {
try {
   const newAccess = await drilltekService.refreshToken(token)
   if(newAccess !== null) {
    const cookieVal = cookies.get('drilltekUser') as string
    if(cookieVal) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + newAccess;
        const cookieDetails = JSON.parse(cookieVal);
        cookieDetails['accessToken'] = newAccess
        cookies.set('drilltekUser', JSON.stringify(cookieDetails), {
                             path: "/",
                  httpOnly: true,
                  sameSite: "strict",
                  secure: !dev,
                  maxAge: 60 * 60 * 24 * 7 // one week
                        });
        return cookieDetails as Session
    }
    else {
        return null
    }}
    else {
        return null
    }}
    catch(error) {
        console.log(error)
        return null
    }}

/**
 * Utility function for assigning lithtype to objects in an array of lithlogs containing
 * lithcodes only. takes lithlog array as param and iterates over this. Switch statement
 * assigns code to each object based on value of lithcode and then returns altered array
 * @param lithlog 
 * @returns AddLithLog[]
 */
export function setLithType(lithlog:AddLithLog[]) {
    lithlog.forEach(log => {
        const code = log.lithcode
        switch(code) {
            case "W_Bm":
                log.lithology = "waulsortian biomicrite";
                break;
            case "W_Dol":
                log.lithology = "Dolomitised Reef";
                break;
            case "W_WL":
                log.lithology = "Wavy Laminated Facies";
                break;
            case "W_LTU":
                log.lithology = "Lower Transition Unit";
                break;
            case "W_Lll":
                log.lithology = "Lower Limestone Lens";
                break;
            case "ABL_Nm":
                log.lithology = "Nodular Micrite Unit";
                break;
            case "ABL_En":
                log.lithology = "ABL Encrinite";
                break;
            case "ABL":
                log.lithology = "Undifferentiated ABL";
                break;
            case "ABL_Uppr":
                log.lithology = "Upper ABL";
                break;
            case "ABL_Lwr":
                log.lithology = "ABL Lower";
                break;
            case "OOL":
                log.lithology = "Lisduff oolite undiff";
                break;
            case "OOL_Uppr":
                log.lithology = "Upper Lisduff Ool";
                break;
            case "OOL_Mid":
                log.lithology = "Middle Lisduff Ool";
                break;
            case "OOL_Lwr":
                log.lithology = "Lower Lisduff Ool";
                break;
            case "SLT":
                log.lithology = "Undifferentiated Siltite";
                break;
            case "MU":
                log.lithology = "Undifferenciated Micrite";
                break;
            case "ARG":
                log.lithology = "Undifferenciated Argillite";
                break;
            case "GSTN":
                log.lithology = "Undifferenciated Grainstone";
                break;
            case "DOL":
                log.lithology = "Undifferenciated Dolomite";
                break;
            case "BDOL":
                log.lithology = "Undifferenciated Black Dolomite";
                break;
            case "LST":
                log.lithology = "Undifferenciated Limestone";
                break;
        }
    })
    return lithlog as AddLithLog[]
}

/**
 * Utility function for assigning alterationtype to objects in an array of altlogs containing
 * altcodes only. takes altlog array as param and iterates over this. Switch statement
 * assigns code to each object based on value of altcode and then returns altered array
 * @param alterationlog
 * @returns AddAlterationLog[]
 */
export function setAlterationType(alterationlog:AddAlterationLog[]) {
    alterationlog.forEach(log => {
        const code = log.alterationcode
        switch(code) {
            case "BMB_I":
                log.alterationtype = "Incipient Black Matrix Breccia";
                break;
            case "BMB_W":
                log.alterationtype = "Weak Black Matrix Breccia";
                break;
            case "BMB":
                log.alterationtype = "Black Matrix Breccia";
                break;
            case "BMB_S":
                log.alterationtype = "Black Matrix Breccia";
                break;
            case "WMB_I":
                log.alterationtype = "Incipient White Matrix Breccia";
                break;
            case "WMB_W":
                log.alterationtype = "Weak White Matrix Breccia";
                break;
            case "WMB":
                log.alterationtype = "White Matrix Breccia";
                break;
            case "WMB_S":
                log.alterationtype = "Strong White Matrix Breccia";
                break;
            case "FE_Ox":
                log.alterationtype = "Fe Oxides";
                break;
            case "MN_OX":
                log.alterationtype = "Mn Oxides";
                break;
            case "LE_W":
                log.alterationtype = "Weak Leaching";
                break;
            case "LE":
                log.alterationtype = "Leaching";
                break;
            case "LE_S":
                log.alterationtype = "Strong Leaching";
                break;
            case "WTD_W":
                log.alterationtype = "Weak Weathering";
                break;
            case "WTD":
                log.alterationtype = "Weathering";
                break;
            case "WTD_S":
                log.alterationtype = "Strong Weathering";
                break;
            case "BHY_Dol":
                log.alterationtype = "Black Hydrothermal Dolomite";
                break;
            case "WHY_Dol":
                log.alterationtype = "White Hydrothermal Dolomite";
                break;
        }
    })
    return alterationlog as AddAlterationLog[]
}

/**
 * Utility function for assigning structuretype to objects in an array of struclogs containing
 * struccodes only. takes struclog array as param and iterates over this. Switch statement
 * assigns code to each object based on value of struccode and then returns altered array
 * @param structurelog
 * @returns AddStructureLog[]
 */
export function setStructureType(structurelog:AddStructureLog[]) {
    structurelog.forEach(log => {
        const code = log.structurecode
        switch(code) {
            case "F1":
                log.structuretype = "Weak Fault";
                break;
            case "F2":
                log.structuretype = "Moderate Fault";
                break;
            case "F3":
                log.structuretype = "Strong Fault";
                break;
            case "F4":
                log.structuretype = "Strongest Fault";
                break;
            case "FLT":
                log.structuretype = "Fault Zone";
                break;
            case "GOU":
                log.structuretype = "Fault Gouge";
                break;
            case "HY_BX":
                log.structuretype = "Hydrothermal Breccia";
                break;
            case "BX":
                log.structuretype = "Non Hydrothermal Breccia";
                break;
            case "VCAL":
                log.structuretype = "Calcite Vein";
                break;
            case "VDOL":
                log.structuretype = "Dolomite Vein";
                break;
            case "VPDOL":
                log.structuretype = "Pink Plug dolomite vein";
                break;
            case "VQTZ":
                log.structuretype = "Quartz Vein";
                break;
            case "VHAEM":
                log.structuretype = "Haematite Vein";
                break;
            case "J1":
                log.structuretype = "Weak Joint";
                break;
            case "J2":
                log.structuretype = "Moderate Joint";
                break;
            case "J3":
                log.structuretype = "Strong Joint";
                break;
            case "J4":
                log.structuretype = "Strongest Joint";
                break;
            case "S1":
                log.structuretype = "Weak Slip Plane";
                break;
            case "S2":
                log.structuretype = "Moderate Slip Plane";
                break;
            case "S3":
                log.structuretype = "Strong Slip Plane";
                break;
            case "S4":
                log.structuretype = "Strongest Slip Plane";
                break;
            case "FLD":
                log.structuretype = "Fold";
            break;
            case "B":
                log.structuretype = "Bedding";
            break;
        }
    })
    return structurelog as AddStructureLog[]
}


