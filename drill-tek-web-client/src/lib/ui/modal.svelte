<script>
	import AddDrillholeForm from "./addDrillholeForm.svelte";
	import EditDrillholeForm from "./editDrillholeForm.svelte";
	import EditProgramForm from "./editProgramForm.svelte";
	import ProgramForm from "./programForm.svelte";
	import UploadFile from "./uploadFile.svelte";

    /*
    props required for function. Boolean passed in from parent and bound to functions 
    below for turning the modal on and off. Type used as condition for what to render
    inside the modal. verb used for what is displayed on button on the parent page
    that is the only visible expression of this component when it is off. formData used 
    for conditional rendered sub components that require data to be passed to them (edit 
    components for prepopulating fields). Title used for title on modal and action used for 
    action button required in some modals conditionally rendered. 
    */
    let {boolean=$bindable(), type, verb, formData, title, action} = $props()

    // Function for toggling modal on controlled by boolean value
    const showModal = () => {
 boolean = true
}

// Function for toggling modal off, controlled by boolean value
const hideModal = () => {
    boolean = false
}

</script>

<button class="button is-success" onclick={()=>showModal()}>{verb}</button>

<div class="modal {boolean ? 'is-active' : ''}">
              <div class="modal-background"></div>
                <div class="modal-card">
                    <div class="modal-card-head">
                        <div class="modal-card-title has-text-centered">
                            <h1 class="title is-4">{title} <button class="delete" aria-label="close" onclick={() => hideModal()}></button></h1>
                        </div>
                    </div>
                    <div class="modal-card-body">
                    {#if type === "addDrillhole"}
                                            <form method="post" action="?/addDrillhole">
                           <AddDrillholeForm />
                            <button class="button is-success">{action}</button>
                        </form>  
                    {/if}
                    {#if type === "editDrillhole"}
                    <form method="post" action="?/editDrillhole">
                             <EditDrillholeForm drillhole={formData} />
                            <button class="button is-success">{action}</button>
                        </form>
                    {/if}
                    {#if type === "addProgram"}
                      <form method="post" action="?/addProgram">
                           <ProgramForm />
                            <button class="button is-success">{action}</button>
                        </form>
                    {/if}
                    {#if type === "editProgram"}
                            <form method="post" action="?/editProgram">
                             <EditProgramForm program={formData} />
                            <button class="button is-success">{action}</button>
                        </form>
                    {/if}
                    {#if type === "checkUser"}
                                            <form method="post" action="?/checkUser">
                            <div class="field">
                            <label class="label" for="email">Email</label>
                            <div class="control has-icons-left">
                                <input id="email" class="input" name="email" type="text" placeholder="email" >
                                <span class="icon is-small is-left">
                                  <i class=" fas fa-solid fa-envelope"></i>
                                </span>
                                </div>
                            </div>
                            <button class="button is-success">login</button>
                        </form>
                    {/if}
                    {#if type === "uploadHoles"}
                    <form method="post" action="?/uploadHoles" enctype="multipart/form-data">
                    <UploadFile/>
                    <button class="button is-success"> {action} </button>
                    </form>
                    {/if}
                    {#if type === "deleteProgram"}
                    <form method="post" action="?/deleteProgram">
                       <input type="hidden" value={formData} name="deleteProgram"/>
                       <div class="columns">
                        <div class="column is-1 is-offset-5">
                           <button class="button is-danger">{action}</button>
                        </div>
                       </div>
                    </form>
                    {/if}
                    {#if type === "deleteDrillhole"}
                    <form method="post" action="?/deleteDrillhole">
                       <input type="hidden" value={formData} name="deleteDrillhole"/>
                       <div class="columns">
                        <div class="column is-1 is-offset-5">
                           <button class="button is-danger">{action}</button>
                        </div>
                       </div>
                    </form>
                    {/if}
                    </div>
                    <div class="modal-card-foot"></div>
                </div>
                <button class="modal-close is-large" aria-label="close" onclick={() => hideModal()}></button>
                 </div>
