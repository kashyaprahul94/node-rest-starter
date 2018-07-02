import { API, APIRoute } from "@app/common/api";

import { UserRoute } from "./user";

export class UserAPI extends API {

	private static MountPoint: string = "/user";

	public constructor () {
		super( UserAPI.MountPoint, {
			mergeParams: true
		});
	}

	public routes (): APIRoute[] {

		const user: UserRoute = new UserRoute( this.router );

		return super.decorateRoutes([
			user
		]);
	}
}
