<script lang="ts">
	import { getContext } from 'svelte';

	// Component Props
	let { handleHeightChange }: { handleHeightChange: (height: number) => void } = $props();

	// Get user info from the context
	const userInfo = getContext('userInfo');

	let componentHeight = $state(50);
	let showUserMenu = $state(false);

	$effect(() => {
		handleHeightChange(componentHeight);
	});
</script>

<header class="slds-global-header_container" bind:clientHeight={componentHeight}>
	<div class="slds-global-header slds-grid slds-grid_align-spread">
		<div class="slds-global-header__item logoWrapper">
			Built with ❤️ by...
			<a href="https://appexchange.salesforce.com/appxListingDetail?listingId=a0N4V00000Gg3WFUAZ" target="_blank">
				<div class="slds-global-header__logo logoOverride">
					<span class="slds-assistive-text">Salesforce</span>
				</div>
			</a>
		</div>
		<div class="slds-global-header__item headerTitle">Async Apex Inspector</div>

		<div class="slds-global-header__item">
			<ul class="slds-global-actions slds-float_right">
				<li class="slds-global-actions__item">
					<a href="https://github.com/FlowPackPro/async-apex-inspector" target="_blank">
						<img alt="Github" src="/images/github-mark.png" title="Github" style="width: 32px; height: 32px;" />
					</a>
				</li>

				{#if userInfo}
					<li class="slds-global-actions__item">
						<div class="slds-dropdown-trigger slds-dropdown-trigger_click" class:slds-is-open={showUserMenu}>
							<button
								on:click={() => (showUserMenu = !showUserMenu)}
								class="slds-button slds-global-actions__avatar slds-global-actions__item-action"
								title="person name"
								aria-haspopup="true"
							>
								<span class="slds-avatar slds-avatar_circle slds-avatar_medium">
									<img alt={userInfo.name} src={userInfo.photos.picture} title={userInfo.name} />
								</span>
							</button>

							<div class="slds-dropdown slds-dropdown_right slds-nubbin_top-right userMenu" style="right:-1rem">
								<a href="/logout" class="slds-dropdown__item" data-sveltekit-preload-data="off" data-sveltekit-reload>
									<center>Logout</center>
								</a>
							</div>
						</div>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</header>

<style>
	.headerTitle {
		text-align: center;
		font-size: 2em;
		white-space: nowrap;
	}

	.slds-global-header__item {
		flex-grow: 1;
		flex-basis: 0;
	}

	.userMenu {
		margin-right: 0.5em;
		top: 40px;
	}

	.logoOverride {
		background-image: url('/images/logo.png');
		height: 29px;
	}

	.logoWrapper {
		font-size: 12px;
		top: -2px;
		position: relative;
	}
</style>
