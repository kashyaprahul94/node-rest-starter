export interface IOAuth2CloneBinding {
	url: string;
	clientid: string;
	clientsecret: string;
	identityzone: string;
	identityzoneid: string;
	xsappname: string;
	uaadomain: string;
}

export interface IOAuth2Binding {
	tokenURI: string;
	clientId: string;
	clientSecret: string;
	grantType: string;
	scopes: string[];
	identityZone: string;
	xsApp: string;
	uaaDomain: string;
}