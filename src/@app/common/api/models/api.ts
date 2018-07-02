import { App } from "@app/app";

import { APIRouter, APIRouterOptions, APIRoute, RouteType } from "../interfaces";

export abstract class API {

	protected appInstance: App.Type;
	protected router: APIRouter;

	protected mountPoint: string;

	protected constructor ( mountPoint: string, options?: APIRouterOptions ) {

		this.appInstance = App.Instance;
		this.router = APIRouter( options );

		this.mountPoint = mountPoint;
	}

	private assignMount ( path: RouteType ): Partial<APIRoute> {
		return { path: this.mountPoint + path };
	}

	public decorateRoutes ( routes: APIRoute[] ): APIRoute[] {
		return routes.map( ( route: APIRoute ) => {
			return Object.assign( route, this.assignMount( route.path ) );
		});
	}

	public abstract routes (): APIRoute[];
}