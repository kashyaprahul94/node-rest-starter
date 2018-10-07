import { AppInstance, AppType, IApp } from "@app/app";

import { UserAPI } from "./delegates";




export const SampleApplicaiton: IApp = {

	Boot: (): Promise<AppType> => {

		const appInstance: AppType = AppInstance;

		return appInstance.init()
			.then( appInstance.getServerInstance )
			.then( ( appServer: any ) => {

				appServer.addRoute( new UserAPI().routes() );

				return appServer;
			})
			.then( () => {
				return appInstance.start();
			})
		;

	}
};