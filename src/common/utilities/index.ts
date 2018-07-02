import { env } from "process";

const ENV = env.NODE_ENV;

export class Utils {

	public static IsProduction (): boolean {
		return ( ENV === "production" );
	}
}