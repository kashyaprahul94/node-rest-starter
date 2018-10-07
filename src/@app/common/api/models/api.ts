import { APIRouter, APIRouterOptions, APIRoute, RouteType } from "../interfaces";

export abstract class API {

	protected router: APIRouter;

	protected mountPoint: string;

	protected constructor ( mountPoint: string, options?: APIRouterOptions ) {

		this.router = APIRouter( options );

		this.mountPoint = mountPoint;
	}

	private assignMount ( path: RouteType ): Partial<APIRoute> {
		return { path: this.mountPoint + path };
	}

	protected decorateRoutes ( routes: APIRoute[] ): APIRoute[] {
		return routes.map( ( route: APIRoute ) => {
			return Object.assign( route, this.assignMount( route.path ) );
		});
	}

	protected abstract routes (): APIRoute[];
}