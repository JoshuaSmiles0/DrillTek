<script lang="ts">
	import { page } from '$app/state';
	import ErrorMessage from '$lib/ui/errorMessage.svelte';
</script>


<ErrorMessage status={page.error?.status} message={page.error?.message} />
<a class="button is-success" href="/drillhole/{page.error?.holeid}">Return To Drillhole</a>