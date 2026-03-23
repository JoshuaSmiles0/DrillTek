import type { Session, DrillProgram, AddProgram, editProgram, Drillhole, AddDrillhole, EditDrillhole, Lithlog, Alterationlog, Structurelog, Minerallog, AddLithLog, AddAlterationLog, AddStructureLog, AddMineralLog } from "$lib/types/drilltek-types"
import axios from "axios";
import {BASE_API_URL} from '$env/static/private';

// Service object containing all methods for working with Drilltek Backend
export const drilltekService = {
    //To be replaced before deployment
    baseUrl:BASE_API_URL,

    /**
     * For checking if user is logging in to api for the 
     * first time and requires the password change or has already
     * logged in and can proceed to login
     * 
     * @param email 
     * 
     * @returns login || null
     */
    async checkUser(email:string) : Promise<boolean | null> {
        let login = false
        try {
            const response = await axios.post(`${this.baseUrl}user/checkUser`,
                {"email":email}
            );
            if (response.data.message === "Proceed to login" ) {
                login = true 
                return login
            }
            else if (response.data.message === "Proceed to password change") {
                login = false
                return login 
            }
            else {
                return null
            }
        } catch(error) {
            console.log(error)
            return null
        }
    },


    /**
     * Function for setting and also resetting password through api
     * takes the users email, old password and new password. If passes or fails
     * on api end passes back a boolean representing success of failure. If error
     * occurs, passes back a null
     * 
     * @param email 
     * @param oldPassword 
     * @param password 
     * @returns boolean || null
     */
    async setPassword(email:string, oldPassword:string, password:string) : Promise<boolean | null> {
        let passwordSet = false
        try {
            const response = await axios.patch(`${this.baseUrl}user/setPassword`, {
                "email":email, 
                "password":password, 
                "oldPassword":oldPassword
            });
            if (response.status === 200) {
                passwordSet = true
                console.log("this did work")
                return passwordSet
            } 
            else {
                passwordSet = false
                console.log("this didnt work")
                return passwordSet
            }
        }
        catch(error) {
            console.log(error)
            return null
        }
    },


    /**
     * Function for logging in through API. Takes an email and password. If login successful
     * passes back a new session object for setting cookie or null if unsuccessful
     * 
     * 
     * @param email 
     * @param password 
     * @returns session || null
     */
    async login(email:string | null, password:string): Promise<Session | null> {
        try {
        const response = await axios.post(`${this.baseUrl}user/login`, {"email":email, "password":password})
        if (response.status === 200) {
             axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.access;
             const session: Session = {
                email: email,
                accessToken: response.data.access,
                refreshToken: response.data.refresh,
                userid: response.data.userid
             };
             return session
        }
        else {
            return null
        }
    }
        catch (error) {
            console.log(error)
            return null
        }

    },

    /**
     * method for requesting a new access token from API when access token expires 
     * after 15 mins. Takes a refresh token string as parameter, returns the new 
     * access token as a string if refresh successful or null if unsuccessful
     * @param token 
     * @returns string || null
     */
    async refreshToken(token:string|null): Promise<string|null> {
        try {
            const response = await axios.post(`${this.baseUrl}token/refresh`, {"refresh":token})
            if (response.status ===200) {
                return response.data.access
            }
            else {
                return null
            }
        }
        catch(error){
            console.log(error)
            return null
        }

    },

    /**
     * method for retrieving a user email by userid from api.
     * Protected method so requires token (access token) to access
     * takes id to include in parameterised API request. Returns user email 
     * if success or blank string if not successful
     * @param token 
     * @param id 
     * @returns string
     */
    async getUserEmailById(token:string, id:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}user/getEmail`,{
                params:{userid:id}
            })
            console.log(response.data.email)
            return(response.data.email)
        }
        catch (error) {
            console.log(error)
            return ""
        } 
    },

    /**
     * API method for retrieving all drill programs. Takes access token as 
     * param as protected api route. Returns an array of drill program objects
     * if successful or an empty array
     * @param token 
     * @returns DrillProgram[] || []
     */
    async getPrograms(token:string): Promise<DrillProgram[]> {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}drillProgram/getPrograms`)
            return response.data.data as DrillProgram[]
        }
        catch(error){
            console.log(error)
            return []
        }
    },

    /**
     * Api Method for creating drillhole. Takes access token as param as protected
     * route in api. Takes an addProgram object representing the drill program to be
     * created. If successful or axios returns an error, returns the status. If error
     * cannot be resolved returns 500 as status.
     * @param token 
     * @param program 
     * @returns number
     */
    async createDrillProgram(token:string, program:AddProgram) {
        try {
             axios.defaults.headers.common["Authorization"] = "Bearer " +token;
             const response = await axios.post(`${this.baseUrl}drillProgram/createProgram`,{
                 "programid":program.programid,
                 "orebody":program.orebody,
                 "location":program.location,
                 "target":program.target,
                 "totalholes":program.totalholes,
                 "totalmeters":program.totalmeters,
                 "userid":program.userid
             })
             console.log(`${program.programid} added`)
             return response.status
        }   
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * Api method for retrieving a drill program by its id. Takes an access token
     * as parameter as this is a protected route. Takes program id string for use 
     * as param in api request as required. Returns the drill program object if successful
     * or an empty object if unsuccessful
     * 
     * @param token 
     * @param id 
     * @returns DrillProgram || {} 
     */
    async getProgramById(token:string, id:string) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}drillProgram/getProgramById`,{
                params: {programid:id}
            })
            console.log(`${id} returned`)
            return response.data.data as DrillProgram
        }
        catch(error){
            console.log(error)
            return {}
        }
    },

    /**
     * Api method for editing a drill program. Takes a an access token as param as 
     * api route is protected. Takes new program details and the original ID for the program
     * to locate the program for editing in the api. Returns api call status if successful
     * or unsuccessful or a 500 for uncaught errors
     * @param token 
     * @param newDetails 
     * @param originalId 
     * @returns number
     */
    async editProgram(token:string, newDetails:editProgram, originalId:string) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.patch(`${this.baseUrl}drillProgram/editProgram`, {
                "originalid":originalId,
                "program":{
                  "orebody":newDetails.orebody,
                  "location":newDetails.location,
                  "target":newDetails.target
                }
            })
            return response.status
        }     
            catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for deleting drill program by id. Takes access token as param as protected
     * api route. Takes program id as param to be used as param in api call. Returns status
     * if successful or caught error. Returns 500 for uncaught error. 
     * @param token 
     * @param id 
     * @returns number
     */
    async deleteProgram(token:string, programid:string) {
               try {
             axios.defaults.headers.common["Authorization"] = "Bearer " +token;
             const response = await axios.delete(`${this.baseUrl}drillProgram/deleteProgram`,
                {
                    params:{programid:programid}
                }
            )
             return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for retrieving drillholes by programid. Takes an access token as 
     * parameter as protected API route. Takes programid for use as param in api call.
     * Returns an array of drillhole objects if successful or an empty array if not
     * @param token 
     * @param programid 
     * @returns Drillhole[] || []
     */
    async getDrillholeByProgramId(token:string, programid:string) {
         try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}drillhole/getDrillholesByProgramId`,{
                params: {programid:programid}
            })
            console.log(`drillholes for ${programid} returned`)
            return response.data.data as Drillhole[]
        }
        catch(error){
            console.log(error)
            return []
        } 
    },

    /**
     * Api Method for creating a drillhole. Takes an access token as param as protected
     * API route. Takes drillhole object to be uploaded. If API call successful or unsuccessful
     * returns axios respose status. If uncaught error, returns 500 code
     * @param token 
     * @param drillhole 
     * @returns number
     */
    async createDrillhole(token:string, drillhole: AddDrillhole) {
        try {
             axios.defaults.headers.common["Authorization"] = "Bearer " +token;
             const response = await axios.post(`${this.baseUrl}drillhole/addDrillhole`,{
                 "xcoord":drillhole.xcoord,
                 "ycoord":drillhole.ycoord,
                 "zcoord":drillhole.zcoord,
                 "dip":drillhole.dip,
                 "azimuth":drillhole.azimuth,
                 "length":drillhole.length,
                 "type":drillhole.type,
                 "programid": drillhole.programid,
                 "userid": drillhole.userid
             })
             console.log(`drillhole added`)
             return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for uploading multiple drillholes designed to be used in conjunction 
     * with .csv upload. Takes access token as param due to protected api route. takes 
     * array of drillhole details for upload. If successful or caught error, returns status
     * code. If uncaught, returns 500 status code
     * @param token 
     * @param holes 
     * @returns number
     */
    async uploadHoles(token:string, holes: AddDrillhole[]) {
        try {
             axios.defaults.headers.common["Authorization"] = "Bearer " +token;
             const response = await axios.post(`${this.baseUrl}drillhole/addMultipleDrillholes`, holes)
             return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for returning a drillhole by its id. Takes access token as param due
     * to protected api route. Takes drillhole Id as param. If api call successful returns
     * drillhole object or an empty object if unsuccessful.
     * @param token 
     * @param id 
     * @returns Drillhole || {}
     */
    async getDrillholeById(token:string, id:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}drillhole/getDrillholeById`,
                {
                    params:{holeid:id}
                }
            )
            console.log(`${id} returned`)
            return response.data.data as Drillhole
        }
        catch(error){
        console.log(error)
        return {}
        }
    },

    /**
     * API method for editing a drillhole. Takes access token as param as protected
     * API route. Takes new drillhole details and drillhole ID as param for locating
     * then editing drillhole in backend. Returns api call status if successful or 
     * unsuccessful. returns 500 if uncaught error
     * @param token 
     * @param newDetails 
     * @param originalId 
     * @returns number
     */
    async editDrillhole(token:string, newDetails:EditDrillhole, originalId: number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.patch(`${this.baseUrl}drillhole/editDrillhole`, {
                "originalid":originalId,
                "drillhole":{
                 "xcoord":newDetails.xcoord,
                 "ycoord":newDetails.ycoord,
                 "zcoord":newDetails.zcoord,
                 "dip":newDetails.dip,
                 "azimuth":newDetails.azimuth,
                 "length":newDetails.length,
                 "type":newDetails.type
                }
            })
            return response.status
        }
            catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for deleting drillhole by id. Takes access token as param as protected
     * api route. Takes hole id as param to be used as param in api call. Returns status
     * if successful or caught error. Returns 500 for uncaught error. 
     * @param token 
     * @param id 
     * @returns number
     */
    async deleteDrillhole(token:string, id:number) {
               try {
             axios.defaults.headers.common["Authorization"] = "Bearer " +token;
             const response = await axios.delete(`${this.baseUrl}drillhole/deleteDrillhole`,
                {
                    params:{holeid:id}
                }
            )
             return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for retrieving lithlog for a drillhole. Takes token as parameter as 
     * protected api route. Takes holeid to be used as param in api request. If successful
     * returns an array of lithlogs, if not or array is empty returns null
     * @param token 
     * @param holeid 
     * @returns Lithlog[] || null
     */
    async getLithLog(token:string, holeid:number) {
        try{
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}lithlog/getlithlogbyholeid`, {
                params:{holeid}
            })
            console.log(`lith logs for ${holeid} returned`)
            if(response.data.data.length !== 0) {
            return response.data.data as Lithlog[]
            }
            else {
                return null
            }
        }
        catch(error) {
            console.log(error)
            return null
        }
    },

    /**
     * API method for deleting lithlogs by holeid designed to be used before uploading
     * logs as clear function. Takes access token as route protected. Takes a holeid to 
     * be used as param in api call. If successful or error returned, returns status. If
     * uncaught, returns 500 code
     * 
     * @param token 
     * @param holeid 
     * @returns number
     */
    async deleteLithLogByHoleid(token:string, holeid:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.delete(`${this.baseUrl}lithlog/deleteLithLog`, {
                params:{holeid:holeid}
            })
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * Api method for adding lithlog. Takes access token as parameter due to protected
     * api route. takes an array of lithlogs to be posted with request. If successful or 
     * caught unsuccessful returns api response status. If uncaught returns 500 code
     * @param token 
     * @param logs 
     * @returns number
     */
    async addLithLog(token:string, logs:AddLithLog[]) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.post(`${this.baseUrl}lithlog/addLithLog`, logs)
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for retrieving alterationlog for a drillhole. Takes token as parameter as 
     * protected api route. Takes holeid to be used as param in api request. If successful
     * returns an array of alteration logs, if not or array is empty returns null
     * @param token 
     * @param holeid 
     * @returns Alterationlog[] || null
     */
    async getAlterationLog(token:string, holeid:number) {
        try{
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}altlog/getAlterationlogByHoleid`, {
                params:{holeid}
            })
            console.log(`Alteration logs for ${holeid} returned`)
            if(response.data.data.length !== 0) {
            return response.data.data as Alterationlog[]
            }
            else {
                return null
            }
        }
        catch(error) {
            console.log(error)
            return null
        }
    },

    /**
     * API method for deleting alteration logs by holeid designed to be used before uploading
     * logs as clear function. Takes access token as route protected. Takes a holeid to 
     * be used as param in api call. If successful or error returned, returns status. If
     * uncaught, returns 500 code
     * 
     * @param token 
     * @param holeid 
     * @returns number
     */
     async deleteAlterationLogByHoleid(token:string, holeid:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.delete(`${this.baseUrl}altlog/deleteAlterationLog`, {
                params:{holeid:holeid}
            })
            return response.status
        }
         
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * Api method for adding alterationlog. Takes access token as parameter due to protected
     * api route. takes an array of alteration logs to be posted with request. If successful or 
     * caught unsuccessful returns api response status. If uncaught returns 500 code
     * @param token 
     * @param logs 
     * @returns number
     */
    async addAlterationLog(token:string, logs:AddAlterationLog[]) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.post(`${this.baseUrl}altlog/addAlterationLog`, logs)
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for retrieving structurelog for a drillhole. Takes token as parameter as 
     * protected api route. Takes holeid to be used as param in api request. If successful
     * returns an array of structure logs, if not or array is empty returns null
     * @param token 
     * @param holeid 
     * @returns Structurelog[] || null
     */
    async getStructureLog(token:string, holeid:number) {
        try{
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}struclog/getStructurelogByHoleid`, {
                params:{holeid}
            })
            console.log(`structure logs for ${holeid} returned`)
            if(response.data.data.length !== 0) {
            return response.data.data as Structurelog[]
            }
            else {
                return null
            }
        }
        catch(error) {
            console.log(error)
            return null
        }
    },

    /**
     * API method for deleting structure logs by holeid designed to be used before uploading
     * logs as clear function. Takes access token as route protected. Takes a holeid to 
     * be used as param in api call. If successful or error returned, returns status. If
     * uncaught, returns 500 code
     * 
     * @param token 
     * @param holeid 
     * @returns number
     */
    async deleteStructureLogByHoleid(token:string, holeid:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.delete(`${this.baseUrl}struclog/deleteStructureLog`, {
                params:{holeid:holeid}
            })
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * Api method for adding structurelog. Takes access token as parameter due to protected
     * api route. takes an array of alteration logs to be posted with request. If successful or 
     * caught unsuccessful returns api response status. If uncaught returns 500 code
     * @param token 
     * @param logs 
     * @returns number
     */
    async addStructureLog(token:string, logs:AddStructureLog[]) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.post(`${this.baseUrl}struclog/addStructureLog`, logs)
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API method for retrieving minerallog for a drillhole. Takes token as parameter as 
     * protected api route. Takes holeid to be used as param in api request. If successful
     * returns an array of structure logs, if not or array is empty returns null
     * @param token 
     * @param holeid 
     * @returns Minerallog[] || null
     */
    async getMineralLog(token:string, holeid:number) {
        try{
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.get(`${this.baseUrl}minlog/getMinerallogByHoleid`, {
                params:{holeid}
            })
            console.log(`mineral logs for ${holeid} returned`)
            if(response.data.data.length !== 0) {
              return response.data.data as Minerallog[]
            }
            else {
                return null
            }
        }
        catch(error) {
            console.log(error)
            return null
        }
    },

    /**
     * API method for deleting mineral logs by holeid designed to be used before uploading
     * logs as clear function. Takes access token as route protected. Takes a holeid to 
     * be used as param in api call. If successful or error returned, returns status. If
     * uncaught, returns 500 code
     * 
     * @param token 
     * @param holeid 
     * @returns number
     */
    async deleteMineralLogByHoleid(token:string, holeid:number) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.delete(`${this.baseUrl}minlog/deleteMineralLog`, {
                params:{holeid:holeid}
            })
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * Api method for adding minerallog. Takes access token as parameter due to protected
     * api route. takes an array of alteration logs to be posted with request. If successful or 
     * caught unsuccessful returns api response status. If uncaught returns 500 code
     * @param token 
     * @param logs 
     * @returns number
     */
    async addMineralLog(token:string, logs:AddMineralLog[]) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.post(`${this.baseUrl}minlog/addMineralLog`, logs)
            return response.status
        }
        catch(error: any) {
            console.log(error)
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    },

    /**
     * API Method for blacklisting api tokens on logout. Takes an access token as param
     * as protected route. Takes a refresh token as string to be passed to the api route 
     * for blacklisting. If successful or caught unsuccessful code returns status code
     * if uncaught returns 500 code
     * 
     * @param token 
     * @param refreshToken 
     * @returns number
     */
    async backlistToken(token:string, refreshToken:string) {
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " +token;
            const response = await axios.post(`${this.baseUrl}user/logout`, {
                refresh: refreshToken
            })
            return response.status
        }
        catch(error:any) {
            if(error.response.status) {
            return error.response.status
            }
            else {
                return 500
            }
        }
    }
}