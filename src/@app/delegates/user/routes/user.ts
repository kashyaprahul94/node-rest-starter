import { APIRouter, APIRequest, APIResponse, APIRoute, BaseAPIRoute } from "@app/common/api";
import { StatusCode } from "@app/common/networking";

import { UserRequest, User } from "../interfaces";
import { UserService } from "../services";

export class UserRoute extends BaseAPIRoute implements APIRoute {

	public path: string;
	private delegate: UserService;

	public constructor ( router: APIRouter ) {

		super( router );
		this.path = "/";

		this.delegate = new UserService();
	}


	public middleware (): APIRouter {

		super.configure();

		this.resource( "/" )
			.get( this.getHealth )
		;

		this.resource( "/:id" )
			.get( this.getHealth )
		;

		return this.router;
	}

	private getHealth = ( req: APIRequest<UserRequest>, res: APIResponse ): void => {

		const user: User = { ...req.params, ...req.body };

		this.delegate.get( user )
			.then( ( data: any ) => {
				res.status( StatusCode.Okay ).json({
					user: data
				});
			})
		;
	};
}