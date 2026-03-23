<script>
    import UserForm from "$lib/ui/userForm.svelte";
</script>


<div class="columns mt-6 pt-6">
<div class="column is-6 is-offset-3">
    <div class="box">
    <h1 class="title is-4"> Please enter your Password</h1>
        <form method="post" action="?/login">
        <UserForm setPassword={false}/>
        <button class="button is-success">login</button>
        </form>
    </div>
</div>
</div>