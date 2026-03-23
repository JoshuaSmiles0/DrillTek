<script lang="ts">

/*
Takes log as prop as data to be rendered. Exlude header used to exclude a specific header
from the log data. 
*/
    const {log, excludeHeader} = $props()
    // Isolating log row to construct log headers array
    // svelte-ignore state_referenced_locally
    const logheaders = log[0]
    // Constructing headers for table based on keys of log object input 
    const headers = logheaders ? Object.keys(logheaders) : []
    // svelte-ignore state_referenced_locally
        const exclude = excludeHeader

</script>

<style>
    table {
        overflow-y: auto;
    }
</style>


<table class="table is-fullwidth">
            <thead>
            <tr>
            {#each headers as header, index(header)  }
            {#if header !== exclude}
                <th>{header}</th>
            {/if}
            {/each}
            </tr>
            </thead>
                <tbody>
                    {#each log as record (record[excludeHeader]) }
                    <tr>
                    {#each headers as header, index(header) }
                    {#if header !== exclude}
                        <td>{record[header]}</td>
                    {/if}
                    {/each}
                    </tr>
                    {/each}
                </tbody>
        </table>