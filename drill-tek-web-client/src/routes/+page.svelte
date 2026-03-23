<script>
	import Modal from "$lib/ui/modal.svelte";

// Controls modal visibility
let login = $state(false)

</script>



<div class="columns mt-6 pt-6">
<div class="column is-6 is-offset-3">
<div class="box ml-3 mr-3">
<section class="columns is-vcentered">
    <div class="column is-5">
    <h1 class="title is-1">Welcome to drilltek</h1>
    <h2 class="title is-4">All Things Diamond Drilling, All In One Place</h2>
    <Modal boolean={login} type="checkUser" verb="login" formData="" title="Please enter your email address" action="login" />
    </div>
    <div class="column is-1"></div>
    <div class="column is-6">
    <img class="is-fullwidth" style="border-radius: 5%;" src="../landingImage.jpg" alt="drill cores">
    </div>
</section>
    </div>
    </div>
    </div>
