interface SalesforceUserInfo {
	zoneinfo?: string;
	name?: string;
	email?: string;
}

interface SalesforceUserInfo {
	zoneinfo?: string;
	name?: string;
	email?: string;
}

interface AsyncApexJob {
	ApexClassId: string;
	ApexClass: {
		Name: string;
	};
	CompletedDate: string;
	CreatedById: string;
	CreatedBy: {
		Name: string;
	};
	CreatedDate: string;
	CronTriggerId: string;
	ExtendedStatus: string;
	Id: string;
	JobItemsProcessed: number;
	JobType: string;
	LastProcessed: string;
	LastProcessedOffset: number;
	MethodName: string;
	NumberOfErrors: number;
	ParentJobId: string;
	Status: string;
	TotalJobItems: number;
}
