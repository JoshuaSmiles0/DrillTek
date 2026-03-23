<script lang="ts">
	import Banner from "$lib/ui/banner.svelte";
	import ListItem from "$lib/ui/listItem.svelte";
	import SearchBar from "$lib/ui/searchBar.svelte";



let { data }: any = $props();
// State for searchbar
let search = $state("")
// Derived state representing programs filtered down by search. When search changes 
// program data passed by server filtered down to those that include the search value 
// In their programid. If search does not match, whole set displayed with no filtering
let filteredPrograms = $derived(
  search
    ? data.programs.filter(program => 
        program.programid.toLowerCase().includes(search.toLowerCase())
      )
    : data.programs
);

// Clears search state
function clearSearch() {
	search = ""
}
</script>

<Banner title="Logging Portal" buttonName="Back" link="/mainportal" email={data.session.email} />
<SearchBar bind:search={search}  clear={clearSearch} type="program" />
<ListItem type="program" subtype="logging" data={filteredPrograms} />