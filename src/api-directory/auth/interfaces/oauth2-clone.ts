export interface IOAuth2Clone {
	xsappname: string;
	appid: string;
	clientid: string;
	serviceinstanceid: string;
	planId: string;
	planName: string;
	orgId: string;
	spaceId: string,
	userName: string,
	description: string,
	scopeList: string[],
	authorities: string[],
	foreignScopes: string[],
	attributeList: string[],
	roleTemplateList: string[],
	tenantMode: string;
	masterAppId: string;
}