import * as Promise from "bluebird";

import { App } from "@app/app";


export const Instance = {

	Boot: ({

		   }): Promise<App.Type> => {

		const appInstance: App.Type = App.Instance;

		return appInstance.init()
			.then( appInstance.getServerInstance )
			.then( appServer => {


				return appInstance.start();
			})
		;
	}
};