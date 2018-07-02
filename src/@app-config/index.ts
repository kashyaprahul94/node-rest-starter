import { env } from "process";

export class Config {

	private static _Instance: Config;

	public appPort: number;
	public appHost: string;
	public mountPoint: string;

	private constructor () {

		this.appPort = parseInt( env.PORT ) || 3010;
		this.appHost = env.HOST || "localhost";
		this.mountPoint = "/";
	}

	public static Instance (): Config {
		if ( ! Config._Instance ) {
			Config._Instance = new Config();
		}
		return Config._Instance;
	}
}