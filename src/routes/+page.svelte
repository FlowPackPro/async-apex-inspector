<script lang="ts">
	import { Login } from '$lib/components';
	import { AsyncViewer } from '$lib/components';

	// Data from the server, mainly cookies and user info
	let { data } = $props();
</script>

{#if !data.accessToken}
	<div id="login">
		<Login {data} />
	</div>
{:else}
	<AsyncViewer />
{/if}

<style>
	#login {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 16px;
	}
</style>
