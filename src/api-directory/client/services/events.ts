import { Subject } from "rxjs";

import { ServiceClient, ApplicationClient } from "../models";


export const enum ClientEventsType {
	Created,
	Updated,
	Deleted
}

export interface IServiceClientSubject {
	type: ClientEventsType;
	client: ServiceClient;
}

export interface IApplicationClientSubject {
	type: ClientEventsType;
	client: ApplicationClient;
}


export class ClientEventManager {

	public static ServiceClientObserver: Subject<IServiceClientSubject> = new Subject<IServiceClientSubject>();
	public static ApplicationClientObserver: Subject<IApplicationClientSubject> = new Subject<IApplicationClientSubject>();

	private constructor () {

	}

	public static ServiceClientCreated ( client: ServiceClient ): void {
		ClientEventManager.ServiceClientObserver.next( {
			type: ClientEventsType.Created,
			client: client
		});
	}

	public static ServiceClientUpdated ( client: ServiceClient ): void {
		ClientEventManager.ServiceClientObserver.next( {
			type: ClientEventsType.Updated,
			client: client
		});
	}

	public static ServiceClientDeleted ( client: ServiceClient ): void {
		ClientEventManager.ServiceClientObserver.next( {
			type: ClientEventsType.Deleted,
			client: client
		});
	}



	public static ApplicationClientCreated ( client: ApplicationClient ): void {
		ClientEventManager.ApplicationClientObserver.next( {
			type: ClientEventsType.Created,
			client: client
		});
	}

	public static ApplicationClientUpdated ( client: ApplicationClient ): void {
		ClientEventManager.ApplicationClientObserver.next( {
			type: ClientEventsType.Updated,
			client: client
		});
	}

	public static ApplicationClientDeleted ( client: ApplicationClient ): void {
		ClientEventManager.ApplicationClientObserver.next( {
			type: ClientEventsType.Deleted,
			client: client
		});
	}


}
