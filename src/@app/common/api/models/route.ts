import { APIRouter, APIMiddleware, APIEndpoint, RouteType } from "../interfaces";

export class BaseAPIRoute {

	protected router: APIRouter;
	protected middlewares: APIMiddleware[];

	protected constructor ( router: APIRouter, middlewares: APIMiddleware[] = [] ) {
		this.router = router;
		this.middlewares = middlewares;
	}

	protected attach ( middleware: APIMiddleware ): BaseAPIRoute {
		this.middlewares.push( middleware );
		return this;
	}

	protected resource ( route: RouteType ): APIEndpoint {
		return this.router.route( route );
	}

	protected configure (): void {
		if ( this.middlewares.length ) {
			this.router.use( this.middlewares.map( middleware => middleware.middleware ) );
		}
	}
}