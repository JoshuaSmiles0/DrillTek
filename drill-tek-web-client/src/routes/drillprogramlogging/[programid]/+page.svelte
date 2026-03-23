<script lang="ts">
	import Banner from "$lib/ui/banner.svelte";
	import ListItem from "$lib/ui/listItem.svelte";
	import SearchBar from "$lib/ui/searchBar.svelte";



 let { data }: any = $props();
 // State linked to searchbar value
   let search = $state()

// Derived state representing holes filtered down by search. When search changes 
// hole data passed by server filtered down to those that include the search value 
// In their holeid. If search does not match, whole set displayed with no filtering
let filteredHoles = $derived(
  search
    ? data.holes.filter(hole => 
        hole.holeid === search
      )
    : data.holes
);

// Clears search state
function clearSearch() {
	search = ""
}

</script>


<Banner title={data.program} buttonName="Logging Portal" link="/loggingportal" email={data.session.email} />

<h1 class="title is-3 mt-2">Drillholes:</h1>
<SearchBar bind:search={search}  clear={clearSearch} type="hole" />
<ListItem type="holes" subtype="logging" data={filteredHoles} />