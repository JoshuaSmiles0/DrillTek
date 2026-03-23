<script lang="ts">
	import Banner from "$lib/ui/banner.svelte";
	import Modal from "$lib/ui/modal.svelte";

// Data passed from server for rendering
 let { data }: any = $props();

// State for controlling modals passed to modal
let editDrillholeModal = $state(false)
let deleteDrillholeModal = $state(false)

</script>

<Banner title="DDH-{data.drillhole.holeid}" buttonName={data.drillhole.programid} link="/drillprogram/{data.drillhole.programid}" email={data.email} />
<div class="box mt-4">
     <h1 class="title is-3">Details:</h1>
     <table class="table is-bordered is-hoverable is-fullwidth mb-6">
        <thead >
        <tr class="is-success">
            <th>Hole ID</th>
            <th>Easting</th>
            <th>Northing</th>
            <th>Elevation</th>
            <th>Dip</th>
            <th>Azimuth</th>
            <th>Length</th>
            <th>Type</th>
            <th>Drill Program</th>
            <th>Planned By</th>
            <th>Date Planned</th>
            <th>Date Updated</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td>DDH-{data.drillhole.holeid}</td>
                <td>{data.drillhole.xcoord}</td>
                <td>{data.drillhole.ycoord}</td>
                <td>{data.drillhole.zcoord}</td>
                <td>{data.drillhole.dip}</td>
                <td>{data.drillhole.azimuth}</td>
                <td>{data.drillhole.length}</td>
                {#if data.drillhole.type === 1}
                    <td>Exploration</td>
                {/if}
                {#if data.drillhole.type === 2}
                    <td>Infill</td>
                {/if}
                <td>{data.drillhole.programid}</td>
                <td>{data.email}</td>
                <td>{data.drillhole.dateplanned}</td>
                <td>{data.drillhole.dateupdated}</td>
            </tr>
        </tbody>
     </table>
    <Modal boolean={editDrillholeModal} type="editDrillhole" verb="Edit" formData={data.drillhole} title="Please edit then submit your drillhole details" action="submit" />
    <Modal boolean={deleteDrillholeModal} type="deleteDrillhole" verb="Delete" formData={data.drillhole.programid} title="Are you sure you want to delete Drillhole" action="Delete" />
</div>

