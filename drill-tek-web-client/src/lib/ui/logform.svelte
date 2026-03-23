<script lang="ts">

/*
props for component. Log represents array of log objects to be bound to associated state
so that log list updates as user fills in fields below. Logtype used to conditionally render
formfields based on the type of log passed in (lith, alt, struc or min). Logdelete represents
delete function passed in for deleting record of specified type.
*/
let {log = $bindable(), logtype, logDelete} = $props()


</script>




{#each log as record (record.index) }
{#if logtype === 'lithological'}
    <div class="field is-horizontal">
<div class="field-body">
<input bind:value={record.start} class="input" type="number" placeholder="from">
<input bind:value={record.end} class="input" type="number" placeholder="to">
<div class="control">
    <select class="select" bind:value={record.lithcode}>
  <option value="W_Bm">W_Bm</option>
  <option value="W_Dol">W_Dol</option>
  <option value="W_WL">W_WL</option>
  <option value="W_LTU">W_LTU</option>
  <option value="W_Lll">W_Lll</option>
  <option value="ABL_Nm">ABL_Nm</option>
  <option value="ABL_En">ABL_En</option>
  <option value="ABL">ABL</option>
  <option value="ABL_Uppr">ABL_Uppr</option>
  <option value="ABL_Lwr">ABL_Lwr</option>
  <option value="OOL">OOL</option>
  <option value="OOL_Uppr">OOL_Uppr</option>
  <option value="OOL_Mid">OOL_Mid</option>
  <option value="OOL_Lwr">OOL_Lwr</option>
  <option value="SLT">SLT</option>
  <option value="MU">MU</option>
  <option value="ARG">ARG</option>
  <option value="GSTN">GSTN</option>
  <option value="DOL">DOL</option>
  <option value="BDOL">BDOL</option>
  <option value="LST">LST</option>
    </select>
</div>
<input bind:value={record.comment} class="input" type="text" placeholder="comment">
<input bind:value={record.holeid} class="input" type="hidden">
<input bind:value={record.userid} class="input" type="hidden">
<button type="button" class="button is-danger" aria-label="delete" onclick={() => logDelete(record.index)}>
<span>
<i class=" fas fa-solid fa-trash"></i>
</span>
</button>
</div>
</div>
{/if}
    {#if logtype === "alteration"}
    <div class="field is-horizontal">
        <div class="field-body">
        <input bind:value={record.start} class="input" type="number" placeholder="from">
        <input bind:value={record.end} class="input" type="number" placeholder="to">
        <div class="control">
    <select class="select" bind:value={record.alterationcode}>
  <option value="BMB_I">BMB_I</option>
  <option value="BMB_W">BMB_W</option>
  <option value="BMB">BMB</option>
  <option value="BMB_S">BMB_S</option>
  <option value="WMB_I">WMB_I</option>
  <option value="WMB_W">WMB_W</option>
  <option value="WMB">WMB</option>
  <option value="WMB_S">WMB_S</option>
  <option value="FE_Ox">FE_Ox</option>
  <option value="MN_OX">MN_OX</option>
  <option value="LE_W">LE_W</option>
  <option value="LE">LE</option>
  <option value="LE_S">LE_S</option>
  <option value="WTD_W">WTD_W</option>
  <option value="WTD">WTD</option>
  <option value="WTD_S">WTD_S</option>
  <option value="BHY_Dol">BHY_Dol</option>
  <option value="WHY_Dol">WHY_Dol</option>
    </select>
</div>
<input bind:value={record.comment} class="input" type="text" placeholder="comment">
<input bind:value={record.holeid} class="input" type="hidden">
<input bind:value={record.userid} class="input" type="hidden">
<button type="button" class="button is-danger" aria-label="delete" onclick={() => logDelete(record.index)}>
<span>
<i class=" fas fa-solid fa-trash"></i>
</span>
</button>
        </div>
    </div>
{/if}
    {#if logtype === "structure"}
    <div class="field is-horizontal">
        <div class="field-body">
        <input bind:value={record.start} class="input" type="number" placeholder="from">
        <input bind:value={record.end} class="input" type="number" placeholder="to">
        <input bind:value={record.dip} class="input" type="number" placeholder="dip">
        <div class="control">
    <select class="select" bind:value={record.structurecode}>
 <option value="F1">F1</option>
  <option value="F2">F2</option>
  <option value="F3">F3</option>
  <option value="F4">F4</option>
  <option value="FLT">FLT</option>
  <option value="GOU">GOU</option>
  <option value="HY_BX">HY_BX</option>
  <option value="BX">BX</option>
  <option value="VCAL">VCAL</option>
  <option value="VDOL">VDOL</option>
  <option value="VPDOL">VPDOL</option>
  <option value="VQTZ">VQTZ</option>
  <option value="VHAEM">VHAEM</option>
  <option value="J1">J1</option>
  <option value="J2">J2</option>
  <option value="J3">J3</option>
  <option value="J4">J4</option>
  <option value="S1">S1</option>
  <option value="S2">S2</option>
  <option value="S3">S3</option>
  <option value="S4">S4</option>
  <option value="FLD">FLD</option>
  <option value="B">B</option>
    </select>
</div>
<input bind:value={record.comment} class="input" type="text" placeholder="comment">
<input bind:value={record.holeid} class="input" type="hidden">
<input bind:value={record.userid} class="input" type="hidden">
<button type="button" class="button is-danger" aria-label="delete" onclick={() => logDelete(record.index)}>
<span>
<i class=" fas fa-solid fa-trash"></i>
</span>
</button>
        </div>
    </div>
{/if}
{/each}




