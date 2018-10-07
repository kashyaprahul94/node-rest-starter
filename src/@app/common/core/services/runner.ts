import { AppType, IApp } from "@app/app";


export class ApplicationRunner {

	private constructor () {

	}

	public static Run ( instance: IApp ): Promise<AppType> {
		return instance.Boot();
	}
}