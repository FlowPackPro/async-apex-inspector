import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	// Check if the user is logged in by call user info endpoint
	const instanceUrl = cookies.get('instance_url');
	const accessToken = cookies.get('access_token');

	let userInfo: SalesforceUserInfo | undefined;

	if (instanceUrl && accessToken) {
		// Get user info
		const userInfoUrl = `${instanceUrl}/services/oauth2/userinfo?access_token=${accessToken}`;

		const response = await fetch(userInfoUrl);

		// access_token is probably invalid/expired, logout
		if (!response.ok) {
			throw redirect(307, '/logout');
		} else {
			userInfo = await response.json();
		}
	}

	return {
		authDomain: cookies.get('auth_domain'),
		myDomain: cookies.get('my_domain'),
		userInfo,
		accessToken,
		instanceUrl
	};
};
