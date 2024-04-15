<script lang="ts">
	import { onMount } from 'svelte';
	import { NoAccess } from '$lib/components/illustrations';

	// Data from the server
	const { data } = $props();

	onMount(async () => {
		// If the status code is not 200 log the error and don't redirect.
		if (data.statusCode !== 200) {
			console.error(data);
		} else {
			window.location.href = '/';
		}
	});
</script>

{#if data.statusCode !== 200}
	<div class="noaccess">
		<NoAccess message={data.response.error_description} />
	</div>
{/if}

<style>
	.noaccess {
		margin-top: 26px;
	}
</style>
