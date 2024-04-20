import type { RequestHandler } from './$types';
import { faker } from '@faker-js/faker/locale/en'; // en locale only to keep the bundle size small, cloudflare workers have a 1MB limit

const capitalize = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

export const GET: RequestHandler = async ({ cookies, url }) => {
	const instanceUrl = cookies.get('instance_url');
	const accessToken = cookies.get('access_token');
	const daysToQuery = url.searchParams.get('days') ?? 1;

	let records: AsyncApexJob[] = [];

	const query = `SELECT ApexClassId, 
			ApexClass.Name, 
			ApexClass.NamespacePrefix, 
			CompletedDate, 
			CreatedById, 
			CreatedBy.Name, 
			CreatedDate, 
			CronTriggerId, 
			ExtendedStatus, 
			Id, 
			JobItemsProcessed, 
			JobType, 
			LastProcessed, 
			LastProcessedOffset, 
			MethodName, 
			NumberOfErrors, 
			ParentJobId, 
			Status, 
			TotalJobItems 
		FROM 
			AsyncApexJob 
		WHERE 
			JobType = 'BatchApex' AND 
			CreatedDate = LAST_N_DAYS:${daysToQuery} AND 
			CompletedDate != NULL AND 
			ApexClass.NamespacePrefix = NULL 
		ORDER BY 
			ApexClass.Name
	`;

	let response = await fetch(instanceUrl + '/services/data/v60.0/query?q=' + query, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	let queryResponse = await response.json();

	if (!response.ok) {
		return new Response(JSON.stringify(queryResponse), { status: 500 });
	}

	let done = queryResponse.done;
	records = queryResponse.records || [];

	while (!done) {
		response = await fetch(instanceUrl + queryResponse.nextRecordsUrl, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});

		queryResponse = await response.json();

		records.push(...queryResponse.records);
		done = queryResponse.done;
	}

	// Prepend the namespace prefix to the class name
	records.forEach((record) => {		
		if (record.ApexClass.NamespacePrefix) {
			record.ApexClass.Name = record.ApexClass.NamespacePrefix + '.' + record.ApexClass.Name;
		}
	});

	// Obfuscate class names if obfuscate url param is present
	if (url.searchParams.get('obfuscate') == 'true') {
		const apexClassNames = [...new Set(records.map((record: AsyncApexJob) => record.ApexClass.Name))];
		const createdByNames = [...new Set(records.map((record: AsyncApexJob) => record.CreatedBy.Name))];

		// Generate fake names
		const fakeClassNameMap: { [key: string]: string } = {};
		const fakePersonNameMap: { [key: string]: string } = {};

		apexClassNames.forEach((className) => {
			fakeClassNameMap[className] = (
				capitalize(faker.hacker.noun()) +
				capitalize(faker.hacker.verb()) +
				'Batch'
			).replace(' ', '');
		});

		createdByNames.forEach((name) => {
			fakePersonNameMap[name] = faker.person.firstName() + ' ' + faker.person.lastName();
		});

		records.forEach((record) => {
			record.ApexClass.Name = fakeClassNameMap[record.ApexClass.Name];
			record.CreatedBy.Name = fakePersonNameMap[record.CreatedBy.Name];
		});
	}

	return new Response(JSON.stringify(records));
};
