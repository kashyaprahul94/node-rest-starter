import * as Promise from "bluebird";

import { App } from "@app/app";

import { UserAPI } from "./delegates";

export const Instance = {

	Boot: ({

		   }): Promise<App.Type> => {

		const appInstance: App.Type = App.Instance;


		return appInstance.init()
			.then( appInstance.getServerInstance )
			.then( appServer => {

				appServer.addRoute( new UserAPI().routes() );
			})
			.then( () => {
				return appInstance.start();
			})
		;

	}
};