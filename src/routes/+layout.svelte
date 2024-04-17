<script lang="ts">
	import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css';

	import { setContext } from 'svelte';

	import Header from '$lib/components/Header.svelte';

	// data is returned from layout.server.ts
	let { data, children } = $props();

	setContext('userInfo', data.userInfo);

	// Default header height to 50px
	let headerHeight = $state(50);

	// Listen for header height changes
	let handleHeightChange = (height: number) => {
		headerHeight = height;
	};
</script>

<!-- Fixed header -->
<Header {handleHeightChange} />

<!-- Main body -->
<div id="body" style="position: relative; top: {headerHeight}px">
	{@render children()}
</div>
