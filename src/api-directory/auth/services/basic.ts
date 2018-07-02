import * as Random from "randomstring";

import { BasicAuth } from "../models/basic";

export class BasicAuthProvider {

	private static CredentialsLength: number = 32;
	private credentials: BasicAuth;

	constructor () {
		this.credentials = BasicAuthProvider.generateCredentials();
	}

	public generate (): BasicAuth {
		return this.credentials;
	}

	public static Generate (): BasicAuth {
		return new BasicAuthProvider().generate();
	}

	private static generateCredentials (): BasicAuth {
		return new BasicAuth(
			Random.generate( BasicAuthProvider.CredentialsLength ),
			Random.generate( BasicAuthProvider.CredentialsLength )
		);
	}
}