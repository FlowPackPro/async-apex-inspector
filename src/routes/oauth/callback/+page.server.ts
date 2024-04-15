import type { PageServerLoad } from './$types';
import { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const loginUrl = cookies.get('auth_domain') ?? 'login.salesforce.com';

	const code = url.searchParams.get('code')!;

	const tokenUrl = `https://${loginUrl}/services/oauth2/token?\
		grant_type=authorization_code&code=${code}&\
		client_id=${OAUTH_CLIENT_ID}&\
		client_secret=${OAUTH_CLIENT_SECRET}&\
		redirect_uri=${url.origin}/oauth/callback`;

	const tokenResponse = await fetch(tokenUrl, {
		method: 'POST'
	});

	const tokenResponseData = await tokenResponse.json();

	let userInfoResponseJSON = {};

	if (tokenResponse.status == 200) {
		cookies.set('access_token', tokenResponseData.access_token, {
			path: '/',
			httpOnly: false
		});

		cookies.set('instance_url', tokenResponseData.instance_url, {
			path: '/',
			httpOnly: false
		});

		// Get user info
		const userInfoUrl = `${tokenResponseData.instance_url}/services/oauth2/userinfo?access_token=${tokenResponseData.access_token}`;

		const userInfoResponse = await fetch(userInfoUrl);
		userInfoResponseJSON = await userInfoResponse.json();
	}

	return {
		response: tokenResponseData,
		statusCode: tokenResponse.status,
		userInfo: userInfoResponseJSON
	};
};
