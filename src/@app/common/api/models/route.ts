import { APIRouter, APIMiddleware, APIEndpoint, RouteType } from "../interfaces";

export class BaseAPIRoute {

	protected router: APIRouter;
	protected middlewares: APIMiddleware[];

	public constructor ( router: APIRouter, middlewares: APIMiddleware[] = [] ) {
		this.router = router;
		this.middlewares = middlewares;
	}

	public attach ( middleware: APIMiddleware ): BaseAPIRoute {
		this.middlewares.push( middleware );
		return this;
	}

	public resource ( route: RouteType ): APIEndpoint {
		return this.router.route( route );
	}

	public configure (): void {
		if ( this.middlewares.length ) {
			this.router.use( this.middlewares.map( middleware => middleware.middleware ) );
		}
	}
}