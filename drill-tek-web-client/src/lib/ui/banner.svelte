
<script lang="ts">

    /* Props for banner title, return link for previous page, button name for text on button
     And email for change password link on hero nav*/
    let {title, link, buttonName, email} = $props()
    
</script>


<section class="hero is-success">
<div class="hero-head">
    <nav class="navbar-end">
        <a href="/changepassword/{email}" class="button is-link m-2">Manage Password</a>
        <a href="/logout" class="button is-link m-2">Logout</a>
    </nav>
</div>
    <div class="hero-body has-text-centered">
        <p class="title">{title}</p>
    </div>
</section>
<a class="button is-success mt-2" href="{link}"> {buttonName}</a>