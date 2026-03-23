<script>
    import UserForm from "$lib/ui/userForm.svelte";
</script>


<div class="columns mt-6 pt-6">
<div class="column is-6 is-offset-3">
    <div class="box">
    <h1 class="title is-4"> Please enter your current and new Password</h1>
        <form method="post" action="?/changePassword">
            <div class="field">
                            <label class="label" for="oldPassword">Current Password</label>
                            <div class="control has-icons-left">
                                <input id="oldPassword" class="input" name="oldPassword" type="text" placeholder="current password" >
                                <span class="icon is-small is-left">
                                  <i class=" fas fa-solid fa-key"></i>
                                </span>
                                </div>
                            </div>
        <UserForm setPassword={true}/>
        <button class="button is-success">Reset Password</button>
        </form>
    </div>
</div>
</div>