import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Revoke the access token from salesforce
	const instanceUrl = cookies.get('instance_url');
	const accessToken = cookies.get('access_token');

	if (instanceUrl && accessToken) {
		const response = await fetch(`${instanceUrl}/services/oauth2/revoke?token=${accessToken}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		if (response.status !== 200) {
			const responseText = await response.text();
			console.error('Failed to revoke access token', response.status, responseText);
		}
	}

	// Delete cookies
	cookies.delete('access_token', { path: '/' });
	cookies.delete('instance_url', { path: '/' });
	cookies.delete('auth_domain', { path: '/' });

	throw redirect(302, '/');
};
