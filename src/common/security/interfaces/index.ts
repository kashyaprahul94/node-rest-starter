export interface UserInfo {
	logonName: string;
	givenName: string;
	familyName: string;
	email: string;
}

export interface SecurityContext {

	xsappname: string,
	isForeignMode: boolean,
	tokenContainsAttributes: boolean,
	tokenContainsAdditionalAuthAttributes: boolean,
	userInfo: UserInfo,
	scopes: string[],
	samlToken: string,
	identityZone: string,
	userAttributes: any,
	additionalAuthAttributes: any,
	grantType: string,
	serviceinstanceid: string,
	subdomain: string,


	getUserInfo(): UserInfo;
	getIdentityZone(): string;
	checkScope( scope: string ): boolean;
	checkLocalScope( scope: string ): boolean;
	getCloneServiceInstanceId(): string;
	getClientId(): string;
	getSubdomain(): string;
	getExpirationDate(): string;
}

export interface XSUAABinding {
	clientid: string;
	clientsecret: string;
	identityzone: string;
	identityzoneid: string;
	sburl?: string;
	tenantid: string;
	tenantmode: string;
	trustedclientidsuffix: string;
	uaadomain: string;
	url: string;
	verificationkey: string;
	xsappname: string;
}