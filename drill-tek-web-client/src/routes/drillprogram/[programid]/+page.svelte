<script lang="ts">
import Banner from "$lib/ui/banner.svelte";
	import ListItem from "$lib/ui/listItem.svelte";
	import Modal from "$lib/ui/modal.svelte";
	import SearchBar from "$lib/ui/searchBar.svelte";

    let { data }: any = $props();

    // States for controlling modal visibility
    let editProgramModal = $state(false)
    let addDrillholeModal = $state(false)
    let uploadDrillholeModal = $state(false)
    let deleteProgramModal = $state(false)
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

<Banner title={data.program.programid} buttonName="Drilling Portal" link="/drillingportal" email={data.email} />
<div class="box mt-4">
     <h1 class="title is-3">Details:</h1>
     <table class="table is-bordered is-hoverable is-fullwidth mb-6">
        <thead >
        <tr class="is-success">
            <th>Program ID</th>
            <th>Orebody</th>
            <th>Location</th>
            <th>Target</th>
            <th>Total Holes</th>
            <th>Total Meters</th>
            <th>Date Planned</th>
            <th>Date Updated</th>
            <th>Planned By</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td>{data.program.programid}</td>
                <td>{data.program.orebody}</td>
                <td>{data.program.location}</td>
                <td>{data.program.target}</td>
                <td>{data.program.totalholes}</td>
                <td>{data.program.totalmeters}</td>
                <td>{data.program.dateplanned}</td>
                <td>{data.program.dateupdated}</td>
                <td>{data.email}</td>
            </tr>
        </tbody>
     </table>
     <Modal boolean={editProgramModal} type="editProgram" verb="Edit" formData={data.program} title="Please edit then submit your program details" action="Submit" />
     <Modal boolean={deleteProgramModal} type="deleteProgram" verb="Delete" formData={data.program.programid} title="Are you sure you want to delete program" action="Delete" />
</div>

<h1 class="title is-3">Drillholes:</h1>
<SearchBar bind:search={search}  clear={clearSearch} type="hole" />
<ListItem type="holes" subtype="drilling" data={filteredHoles} />
<div class="columns">
    <div class="column is-1">
<Modal boolean={addDrillholeModal} type="addDrillhole" verb="add" formData="" title="Please enter your Drillhole details" action="add" />
    </div>
    <div class="column is-1">
        <Modal boolean={uploadDrillholeModal} type="uploadHoles" verb="Upload" formData="" title="Please select your drillhole file" action="Upload"/>
    </div>
    <div class="column is-1">
<a href="/files/drilltek_drillhole_upload_template.csv" download="drilltek_drillhole_upload_template.csv" class="button is-success">Download Template</a>
    </div>
</div>
