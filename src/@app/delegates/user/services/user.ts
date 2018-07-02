import { HttpClient, Request, Response } from "@app/common/networking";

import { User } from "../interfaces";

export class UserService {

	private httpDelegate: HttpClient;

	public constructor () {
		this.httpDelegate = new HttpClient();
	}

	public get ( user: User ): Promise<any> {
		return this.httpDelegate.get(
			new Request()
				.setURL( "https://www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new" )
		)
			.then( ( response: Response<number> ) => {
				return response.data();
			})
			.then( ( data: number ) => {
				return { ...user, data };
			})
		;
	}
}