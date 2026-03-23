<script lang="ts">
/*
Hole taken in as prop for details to be rendered in table
*/
let {hole} = $props()
/* headers array created from keys of hole object using object.keys(). Returns empty array
 If cannot*/
// svelte-ignore state_referenced_locally
const headers = hole ? Object.keys(hole) : []

</script>


     <table class="table is-bordered is-hoverable is-fullwidth">
        <thead >
        <tr class="is-success">
        {#each headers as header, index(header)  }
                <th>{header}</th>
            {/each}
        </tr>
        </thead>
        <tbody>
            <tr>
            {#each Object.entries(hole) as [key, value] (key) }
                <td>{value}</td>
            {/each}
            </tr>
        </tbody>
     </table>

