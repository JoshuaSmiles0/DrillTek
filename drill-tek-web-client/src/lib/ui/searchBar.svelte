<script>

/*
props requried for component to work. Search represents typed searchbar value bound to a 
state in parent component which changes value of list array and therefore what is displayed
in list component on parent page. clear represents passed in clear function from parent which
clears the search value and resets the list. type differentiates between a program or hole list.
component this is controlling
*/
let {search = $bindable(),  clear, type} = $props()


</script>
<div class="columns">
    <div class="column is-2">
{#if type === "program"}
    <input bind:value={search} class="input is-success mt-4" type="text" placeholder="Search">
<button class="button is-success mt-2" onclick={clear}>Clear</button>
{/if}
{#if type === "hole"}
<input bind:value={search} class="input is-success mt-4" type="number" placeholder="Search">
<button class="button is-success mt-2" onclick={clear}>Clear</button>
{/if}
    </div>
</div>

