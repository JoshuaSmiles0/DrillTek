<script>

/*
data prop represents data to be rendered in list component. Type defines 
if data passed is a program or drillhole. Subtype defines buttons rendered 
with each object as link different depending on if in the logging portal area
or drilling portal area 
*/
   let {type, subtype, data} = $props()

</script>
{#if  type === "program"}
       {#each data as program (program.programid) }
    <div class="columns mt-2">
    
        <div class="column is-11">
        <div class="box">
                <h1 class="title is-3">{program.programid}</h1>
                <p class="subtitle">
                    Location - {program.location} <br>
                    Orebody - {program.orebody} <br>
                    Target - {program.target}
                </p>
            </div>
    </div>
    {#if subtype === "drilling"}        
    <div class="column is-1">
            <a href="/drillprogram/{program.programid}" class="button is-success">Open</a>
        </div>
           {/if}
    {#if subtype === "logging"}
         <div class="column is-1">
            <a href="/drillprogramlogging/{program.programid}" class="button is-success">Open</a>
        </div>
    {/if}
    </div>
 
{/each}
{/if}

{#if type === "holes"}
{#each data as drillhole (drillhole.holeid) }
    <div class="columns mt-2">
        <div class="column is-11">
        <div class="box">
                <h1 class="title is-3">DDH-{drillhole.holeid}</h1>
                <p class="subtitle">
                    Dip: {drillhole.dip} <br>
                    Azimuth: {drillhole.azimuth} <br>
                    Length: {drillhole.length}
                </p>
            </div>
    </div>
    {#if subtype === "drilling"}        
    <div class="column is-1">
            <a href="/drillhole/{drillhole.holeid}"  class="button is-success">Open</a>
        </div>
            {/if}
    {#if subtype === "logging"}
        <div class="column is-1">
            <a href="/drillholelithlogging/{drillhole.holeid}"  class="button is-success">Open</a>
        </div>
    {/if}
    </div>
{/each}   
{/if}
