
// Auth details type for storage in cookie
export interface Session {
    email : string | null,
    accessToken : string,
    refreshToken: string,
    userid: number
}

// Type for editing program. Only required
export interface editProgram {
    orebody : string,
    location: string,
    target: string,
}

// Type for adding program. Extends editProgram with additional fields required for add
export interface AddProgram extends editProgram {
    programid : string,
    totalholes: number,
    totalmeters: number,
    userid: number,
}

// Type for displaying program. Contains fields missing from previous, extending them
export interface DrillProgram extends AddProgram {
    dateplanned: Date,
    dateupdated: Date
}

// Type for editing drillhole. Only required
export interface EditDrillhole {
    xcoord: number,
    ycoord: number,
    zcoord: number,
    dip: number,
    azimuth: number,
    length: number,
    type: number,
}

// Type for adding drillhole. Extends editDrillhole with additional fields required for add
export interface AddDrillhole extends EditDrillhole {
    programid: string,
    userid: number,
}

// Type for displaying drillhole. Contains fields missing from previous, extending them
export interface Drillhole extends AddDrillhole {
    holeid : number,
    dateplanned:Date,
    dateupdated:Date
}

// Type for adding lithlog. Only required
export interface AddLithLog {
    start:number,
    end:number,
    lithcode:string,
    comment:string,
    lithology:string,
    holeid:number,
    userid:number
}

// Type for displaying lithlog. Extends addlithlog with fields required for display
export interface Lithlog extends AddLithLog {
    index: number,
    dateLogged: Date
}

// Type for adding minerallog. Only required
export interface AddMineralLog {
    sampleid:string,
    start:number,
    end:number,
    estimate:number,
    comment:string,
    sampletype:string,
    texture:string,
    holeid:number,
    userid:number
}

// Type for displaying minerallog. Extends addMinerallog with fields required for display
export interface Minerallog extends AddMineralLog {
    zn:number,
    pb:number,
    fe:number,
    ag:number,
    assaysUploaded:boolean,
    dateLogged: Date
}

// Type for adding alterationlog. Only required
export interface AddAlterationLog {
    start:number,
    end:number,
    alterationcode:string,
    comment:string,
    alterationtype:string,
    holeid:number,
    userid:number
}

// Type for displaying alterationlog. Extends addAlterationlog with fields required for display
export interface Alterationlog extends AddAlterationLog {
    index: number,
    dateLogged: Date
}

// Type for adding structurelog. Only required
export interface AddStructureLog {
    start:number,
    end:number,
    structurecode:string,
    comment:string,
    structuretype:string,
    dip:number,
    holeid:number,
    userid:number
}

// Type for displaying structurelog. Extends addStructurelog with fields required for display
export interface Structurelog extends AddStructureLog {
    index: number,
    dateLogged: Date
}
