<script lang="ts">
	import SLDS_UTIL_ICON_URL from '@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg';

	import Cookies from 'js-cookie';

	interface LoginProps {
		data: {
			myDomain?: string;
		};
	}

	let { data }: LoginProps = $props();

	let myDomain = $state(data.myDomain);
	let showMyDomain = $state(false);

	// Derive the login URL based on the custom domain
	let loginUrlDisplay = $derived.by(() => {
		let loginUrl = 'https://login.salesforce.com';

		if (myDomain) {
			loginUrl = 'https://' + myDomain + '.my.salesforce.com';
		}

		return loginUrl;
	});

	let handleEnter = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			login();
		}
	};

	let login = () => {
		let loginUrl = 'login.salesforce.com';

		if (myDomain) {
			loginUrl = myDomain + '.my.salesforce.com';
		}

		let clientId = '3MVG9cHH2bfKACZZMM.D0RyeJmOD26uJ7YIkFjfIPTkSza0rUBpPalWsUotdiLWavxlFLa9JdnR99FHFF_OFv';
		let redirect_uri = window.location.origin + '/oauth/callback';

		if (loginUrl) Cookies.set('auth_domain', loginUrl);
		if (myDomain) Cookies.set('my_domain', myDomain);

		window.location.href = `https://${loginUrl}/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code&immediate=false`;
	};
</script>

<div class="slds-button-group" role="group">
	<button id="login" class="slds-button slds-button_neutral" onclick={login}>
		<svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
			<use xlink:href="{SLDS_UTIL_ICON_URL}#salesforce1"></use>
		</svg>Login with Salesforce
	</button>
	<div
		class="slds-dropdown-trigger slds-dropdown-trigger_click slds-button_last myDomainDropdown"
		class:slds-is-open={showMyDomain}
	>
		<button
			onclick={() => (showMyDomain = !showMyDomain)}
			class="slds-button slds-button_icon slds-button_icon-border-filled"
			aria-haspopup="true"
			title="More Actions"
		>
			<svg class="slds-button__icon" aria-hidden="true">
				<use xlink:href="{SLDS_UTIL_ICON_URL}#settings"></use>
			</svg>
			<span class="slds-assistive-text">More Actions</span>
		</button>
		<div class="slds-dropdown slds-dropdown_right slds-dropdown_actions dropdown">
			<div class="slds-form-element">
				<label class="slds-form-element__label" for="text-input-id-47">Custom Domain</label>
				<div class="slds-form-element__control">
					<input type="text" bind:value={myDomain} class="slds-input myDomain" onkeydown={handleEnter} />
				</div>
				<div class="loginUrl" style="padding: 1px 2px ">
					{loginUrlDisplay}
				</div>
			</div>
		</div>
	</div>
</div>

<div class="loginUrl" class:hidden={showMyDomain}>
	{loginUrlDisplay}
</div>

<div class="description">
	Async Apex Inspector is a small application to view Salesforce Async Apex Jobs in a visual timeline chart to help
	better understand when, how often, and for how long background Apex jobs are running. With this view, Salesforce
	admins, developers, and architects can easily identify areas for optimization and improvement with background Apex
	jobs. Additionally, it can be used to find available times to schedule batch jobs.

	<br /><br />

	<img class="overviewImg" alt="overview" src="/images/overview.png" />
</div>

<div class="disclaimer">
	Async Apex Inspector is free to use. It is not a Salesforce.com product. Support requests for Async Apex Inspector
	should be an Issue on the Github page. Source code can be found at
	<a href="https://github.com/FlowPackPro/async-apex-inspector" target="_blank"
		>https://github.com/FlowPackPro/async-apex-inspector</a
	>.
</div>

<style>
	.loginUrl {
		margin-top: 2px;
		color: #8f8f8f;
	}
	.dropdown {
		min-width: 214px;
		padding: 0px 6px 5px 6px;
		left: -184px;
		right: auto;
	}
	.disclaimer {
		color: grey;
		position: fixed;
		bottom: 0px;
		text-align: center;
		margin-bottom: 15px;
	}
	.description {
		max-width: 800px;
		margin-top: 12px;
	}
	.overviewImg {
		margin-top: 12px;
		box-shadow: 0px 9px 20px grey;
	}
	.hidden {
		visibility: hidden;
	}
</style>
