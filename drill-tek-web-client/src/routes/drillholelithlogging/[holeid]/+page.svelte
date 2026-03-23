<script lang="ts">
	import type { Lithlog } from "$lib/types/drilltek-types";
	import Banner from "$lib/ui/banner.svelte";
	import HoleDetailsTable from "$lib/ui/holeDetailsTable.svelte";
	import Logform from "$lib/ui/logform.svelte";
	import LogTable from "$lib/ui/logTable.svelte";
	import axios from "axios";
	import Papa from "papaparse";
    import Chart from 'svelte-frappe-charts'


    let { data }: any = $props();
    let lith = $state(true);
    let structure = $state(false);
    let alteration = $state(false);
    let mineral = $state(false);
    let overview = $state(false);
    //states controlling message display
    let success = $state(false);
    let error = $state(false);
    // states controlling message to be displayed
    let successMessage = $state("");
    let errorMessage = $state("")
    // states controlling what is initially displayed in log forms, either data retrieved or if this does not yet exist contains a blank row for display. state used for rendering list
    // svelte-ignore state_referenced_locally
        let lithlog = $state(data.lithlog || [{index:Math.random(), start:0, end:0, lithcode:"", comment:"", holeid:data.hole.holeid, userid:data.session.userid}])
    // svelte-ignore state_referenced_locally
        let altlog = $state(data.alterationlog || [{index:Math.random(), start:0, end:0, alterationcode:"", comment:"", holeid:data.hole.holeid, userid:data.session.userid}])
    // svelte-ignore state_referenced_locally
        let struclog = $state(data.structurelog || [{index:Math.random(), start:0, end:0, structurecode:"", comment:"", dip:0, holeid:data.hole.holeid, userid:data.session.userid}])
    // svelte-ignore state_referenced_locally
        let minlog = $state(data.minerallog || [{sampleid:Math.random().toString(), start:0, end:0, estimate:0,comment:"", sampletype:"SAMPLE", texture:"D", holeid:data.hole.holeid, userid:data.session.userid }])
    // Controls active button on navbar, lith as default
    let active = $state("Lith")

    // Graph values for frappe chart displayed on overview page. 
    // name represents lithcode. Thickness of bar represents length of 
    // log interval obtained by subtracting start depth from end depth for interval
    // svelte-ignore state_referenced_locally
        const graphVals = lithlog.map((log) => ({
        name: log.lithcode,
        values: [log.end - log.start]
    }))

    // constructred data for graph
   const graphD = {
    // eslint-disable-next-line svelte/no-unused-svelte-ignore
    // svelte-ignore state_referenced_locally
        labels:[data.hole.holeid],
    datasets:graphVals
   }

   /* Functions controlling display of the different tabs on the page. Sets the desired 
   page state to true so that it is the only one displayed. Sets the active attribute to the
   corresponding page so button on navbar renders active. Purges any errors or successes so 
   these disappear from prev tab
   */
    const showOverview = () => {
    overview = true
    lith = false
    structure = false
    alteration = false
    mineral = false
    active = "Overview"
    success = false
    error = false
    errorMessage = ""
    successMessage = ""
}

    const showLith = () => {
    lith = true
    structure = false
    alteration = false
    mineral = false
    overview = false
    active = "Lith"
       success = false
    error = false
    errorMessage = ""
    successMessage = ""
}

    const showAlt = () => {
    lith = false
    structure = false
    alteration = true
    mineral = false
    overview = false
    active = "Alt"
       success = false
    error = false
    errorMessage = ""
    successMessage = ""
}

    const showStruc = () => {
    lith = false
    structure = true
    alteration = false
    mineral = false
    overview = false
    active = "Struc"
       success = false
    error = false
    errorMessage = ""
    successMessage = ""
}

    const showMin = () => {
    lith = false
    structure = false
    alteration = false
    mineral = true
    overview = false
    active = "Min"
       success = false
    error = false
    errorMessage = ""
    successMessage = ""
}


/*
functions for adding new rows to form display which input is then bound to. Adds a new record
to log state which forms are bound to so rerenders component
*/

const addLith = () => {
    const last = lithlog.at(-1)
    lithlog = [... lithlog,{index:Math.random(), start:last.end, end:null, lithcode:"", comment:"", holeid:data.hole.holeid, userid:data.session.userid}]
    console.log(lithlog)
}

const addAlt = () => {
    const last = altlog.at(-1)
    altlog = [... altlog,{index:Math.random(), start:last.end, end:null, alterationcode:"", comment:"", holeid:data.hole.holeid, userid:data.session.userid}]
}

const addStruc = () => {
    const last = struclog.at(-1)
    struclog = [... struclog,{index:Math.random(), start:last.end, end:null, structurecode:"", comment:"", dip:null, holeid:data.hole.holeid, userid:data.session.userid}]
}

const addMin = () => {
    const last = minlog.at(-1)
    const lastID = last.sampleid
    let lastArr = lastID.split("")
    const newNum = parseInt(lastArr[lastArr.length -1]) + 1
    const newChar = newNum.toString()
    lastArr.pop()
    lastArr.push(newChar)
    const newId = lastArr.join("")
    minlog = [... minlog,{sampleid:newId, start:last.end, end:null, estimate:null,comment:"", sampletype:"SAMPLE", texture:"D", holeid:data.hole.holeid, userid:data.session.userid }]
}

// Functions for removing a row from from display. Works as above but filters out deleted index

const deleteMin = (sampleid: string) => {
    minlog = minlog.filter((min) => min.sampleid !== sampleid)
}

const deleteLith = (index: number) => {
    lithlog = lithlog.filter((lith) => lith.index !== index)
}

const deleteStruc = (index: number) => {
    struclog = struclog.filter((struc) => struc.index !== index)
}

const deleteAlt = (index : number) => {
    altlog = altlog.filter((alt) => alt.index !== index)
}


/* Does not work as intended, always displays lithlog uploaded. Error with sveltekit
to be fixed. Triggers server upload by assembling new form data from desired log state
and sends request to server action using axios 
*/ 
async function uploadLith () {
    const formData = new FormData()
    formData.append('lithLog', JSON.stringify(lithlog))
    const response = await axios.post('?/uploadLith', formData)
    error = false
    success = false
    if(response.status === 200) {
        success = true
        successMessage = "Lithlog upload successful"
    }
    else {
        console.log(response.data.success)
        error = true
        errorMessage = "Upload Unsuccessful, please try again"
    }
}

async function uploadAlt () {
    const formData = new FormData()
    formData.append('altLog', JSON.stringify(altlog))
    const response = await axios.post('?/uploadAlt', formData)
    console.log(response.status)
    error = false
    success = false
    if(response.status === 200) {
        success = true
        successMessage = "Alteration log upload successful"
    }
    else {
        console.log(response.data.success)
        error = true
        errorMessage = "Upload Unsuccessful, please try again"
    }
}

async function uploadStruc () {
    const formData = new FormData()
    formData.append('strucLog', JSON.stringify(struclog))
    const response = await axios.post('?/uploadStruc', formData)
    console.log(response.status)
    error = false
    success = false
    if(response.status === 200) {
        success = true
        successMessage = "Structure log upload successful"
    }
    else {
        console.log(response.data.success)
        error = true
        errorMessage = "Upload Unsuccessful, please try again"
    }
}

async function uploadMin () {
    const formData = new FormData()
    formData.append('minLog', JSON.stringify(minlog))
    const response = await axios.post('?/uploadMin', formData)
    console.log(response.status)
    error = false
    success = false
    if(response.status === 200) {
        success = true
        successMessage = "Mineral log upload successful"
    }
    else {
        console.log(response.data.success)
        error = true
        errorMessage = "Upload Unsuccessful, please try again"
    }
}

/*
 Functions for downloading logs as csvs triggered with buttons on tables in overview tab
 uses papa to create a csv string from array of log objects. Creates new csv blob from this
 with an associated object url pointing to this. False anchor created on dom tree with object
 url appended and download attribute appended. Anchor then clicked programatically to trigger
 download of csv object with file name 
*/
async function downloadLith() {
     const lith = data.lithlog
     const csvData = Papa.unparse(lith)
     const file = new Blob([csvData], {type:'text/csv'})
     const download = URL.createObjectURL(file)

     const a = document.createElement('a');
     a.href = download
     a.download = `${data.hole.holeid}_Lith_Log`
     a.click()
}

async function downloadAlt() {
     const alt = data.alterationlog
     const csvData = Papa.unparse(alt)
     const file = new Blob([csvData], {type:'text/csv'})
     const download = URL.createObjectURL(file)

     const a = document.createElement('a');
     a.href = download
     a.download = `${data.hole.holeid}_Alt_Log`
     a.click()
}

async function downloadStruc() {
     const struc = data.structurelog
     const csvData = Papa.unparse(struc)
     const file = new Blob([csvData], {type:'text/csv'})
     const download = URL.createObjectURL(file)

     const a = document.createElement('a');
     a.href = download
     a.download = `${data.hole.holeid}_struc_Log`
     a.click()
}

async function downloadMin() {
     const min = data.minerallog
     const csvData = Papa.unparse(min)
     const file = new Blob([csvData], {type:'text/csv'})
     const download = URL.createObjectURL(file)

     const a = document.createElement('a');
     a.href = download
     a.download = `${data.hole.holeid}_Min_Log`
     a.click()
}


</script>

<style>
    .is-active {
        background-color: black;
        color: white;
    }
    .table-container {
        height: 25vh;
        overflow-y: auto;
    }
</style>

<Banner title={`DDH-${data.hole.holeid}`} buttonName={data.hole.programid} link={`/drillprogramlogging/${data.hole.programid}`} email={data.session.email} />
{#if !overview}
    <div class="container mt-2">
<HoleDetailsTable hole={{"holeid":data.hole.holeid, "dip":data.hole.dip, "azimuth":data.hole.azimuth, "length":data.hole.length}} />
</div>
{/if}
<div class="columns">
    <div class="column is-6">
        <div class="hero is-success mt-2">
            <div class="hero-foot">
                <div class="tabs is-boxed is-fullwidth">
                    <div class="container">
                        <ul>
                        <li>
                            <button class:is-active={"Lith" === active} class="button is-success" onclick={() => showLith()}>
                            Lithology </button>
                        </li>
                        <li>
                            <button class:is-active={"Struc" === active} class="button is-success" onclick={() => showStruc()}>
                             Structure
                            </button>
                        </li>
                        <li>
                            <button class:is-active={"Alt" === active} class="button is-success" onclick={() => showAlt()}> 
                              Alteration
                            </button>
                        </li>
                        <li>
                            <button class:is-active={"Min" === active} class="button is-success" onclick={() => showMin()}> 
                              Mineral
                            </button>
                        </li>
                        {#if data.lithlog !== null && data.alterationlog !== null && data.structurelog !== null && data.minerallog !== null}
                            <li>
                            <button class:is-active={"Overview" === active} class="button is-success" onclick={() => showOverview()}>
                              Overview
                              </button>
                        </li>
                        {/if}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        </div>
        </div>
        {#if success}
        <article class="message is-success">
            <div class="message-body">
                {successMessage}
            </div>
        </article>
        {/if}
        {#if error}
        <article class="message is-danger">
            {errorMessage}
        </article>
        {/if}
        {#if lith}
                 <button class="button mb-4 is-link" aria-label="save" onclick={() => uploadLith()}>
       Save Lith
        </button>
        <div class="box mt-2">
        <h1 class="title is-4">Lithology</h1>
        <Logform log={lithlog} logtype="lithological" logDelete={deleteLith}/>
        <button type="button" class="button is-success" onclick={() => addLith()}>Add</button>
        </div>
        {/if}
        {#if alteration}
                        <button class="button mb-4 is-link" aria-label="save" onclick={() => uploadAlt()}>
       Save Alteration
        </button>
        <div class="box mt-2">
        <h1 class="title is-4">Alteration</h1>
        <Logform log={altlog} logtype="alteration" logDelete={deleteAlt}/>
         <button class="button is-success" onclick={() => addAlt()}>Add</button>
        </div>
        {/if}
        {#if structure}
                        <button class="button mb-4 is-link" aria-label="save" onclick={() => uploadStruc()}>
       Save Structure
        </button>
        <div class="box mt-2">
        <h1 class="title is-4">Structure</h1>
        <Logform log={struclog} logtype="structure" logDelete={deleteStruc}/>
         <button class="button is-success" onclick={() => addStruc()}>Add</button>
        </div>
        {/if}
        {#if mineral}
                        <button class="button mb-4 is-link" aria-label="save" onclick={() => uploadMin()}>
       Save Mineral
        </button>
        <div class="box mt-2">
        <h1 class="title is-4">Mineral</h1>
        {#each minlog as record (record.sampleid) }
    <div class="field is-horizontal">
        <div class="field-body">
        <input bind:value={record.sampleid} class="input" type="text" placeholder="sample Id">
        <input bind:value={record.start} class="input" type="number" placeholder="from">
        <input bind:value={record.end} class="input" type="number" placeholder="to">
        <input bind:value={record.estimate} class="input" type="number" placeholder="est">
        <input bind:value={record.comment} class="input" type="text" placeholder="comment">
         <div class="control">
    <select class="select" bind:value={record.sampletype}>
 <option value="BLANK">BLANK</option>
  <option value="STD1">STD1</option>
  <option value="STD2">STD2</option>
  <option value="STD3">STD3</option>
  <option value="SAMPLE">SAMPLE</option>
    </select>
</div>
 <div class="control">
    <select class="select" bind:value={record.texture}>
 <option value="D">D</option>
  <option value="R">R</option>
  <option value="M">M</option>
  <option value="Sm">Sm</option>
  <option value="X">X</option>
  <option value="F">F</option>
  <option value="Rm">Rm</option>
  <option value="S">S</option>
  <option value="V">V</option>
  <option value="T">T</option>
  <option value="B">B</option>
    </select>
</div>
<input bind:value={record.holeid} class="input" type="hidden">
<input bind:value={record.userid} class="input" type="hidden">
<button type="button" class="button is-danger" aria-label="delete" onclick={() => deleteMin(record.sampleid)}>
<span>
<i class=" fas fa-solid fa-trash"></i>
</span>
</button>
        </div>
    </div>
{/each}

<button class="button is-success" onclick={() => addMin()}>Add</button>
        </div>
        {/if}

        {#if overview}
        <div class="columns">
        <div class="column is-7">
        <div class="box mt-2">
        <div class="table-container">
        <h1 class="title is-4">Lithology</h1>
        <LogTable log={data.lithlog} excludeHeader="index" />
        </div>
        <button class="button is-success" onclick={() => downloadLith()}>Download</button>
        </div>
        <div class="box mt-2">
        <div class="table-container">
        <h1 class="title is-4">Alteration</h1>
        <LogTable log={data.alterationlog} excludeHeader="index" />
        </div>
        <button class="button is-success" onclick={() => downloadAlt()}>Download</button>
        </div>
        <div class="box mt-2">
        <div class="table-container">
        <h1 class="title is-4">Structure</h1>
        <LogTable log={data.structurelog} excludeHeader="index" />
        </div>
        <button class="button is-success" onclick={() => downloadStruc()}>Download</button>
        </div>
        <div class="box mt-2">
        <div class="table-container">
        <h1 class="title is-4">Mineral</h1>
        <LogTable log={data.minerallog} excludeHeader="sampleid" />
        </div>
        <button class="button is-success" onclick={() => downloadMin()}>Download</button>
        </div>
        </div>
        <div class="column is-5">
        <div class="box">
          <Chart 
  data={graphD}
  type="bar"
  height={400}
  barOptions={{stacked: 1}}
/>
</div>
</div>
</div>
        {/if}


  


