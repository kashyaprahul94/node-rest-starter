import { IBasicAuth, IOAuth2Binding } from "@sap/loyalty/api-directory/auth";

import { IAuthRule } from "./auth-rule";

export interface IAuth {
	basic: IBasicAuth;
	oauth2: IOAuth2Binding;
	rules: IAuthRule;
}