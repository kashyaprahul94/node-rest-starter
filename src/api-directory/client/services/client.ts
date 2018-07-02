import { Observable } from "rxjs/Observable";

import { App } from "@sap/loyalty/api-directory/app";

import { Config } from "../interfaces";
import { ServiceClient, ApplicationClient } from "../models";
import { ServiceClientProvider } from "./service-provider";
import { ApplicationClientProvider } from "./application-provider";


export class ClientService {

	public static IsService: string = "SERVICE";
	public static IsAppliaction: string = "APPLICATION";

	private appInstance: App.Type;

	public constructor ( appInstance: App.Type ) {
		this.appInstance = appInstance;
	}



	public isServiceClient ( id: string ): Observable<string> {
		return new ServiceClientProvider( this.appInstance, id ).clientExists().mapTo( ClientService.IsService );
	}

	public getServiceClientById ( id: string ): Observable<ServiceClient> {
		return new ServiceClientProvider( this.appInstance, id ).getClient();
	}

	public getServiceClientByPath ( path: string, version: string ): Observable<ServiceClient> {
		return new ServiceClientProvider( this.appInstance ).getClientByPath( path, version );
	}

	public createServiceClient ( id: string, orgId: string, config: Config ): Observable<ServiceClient> {
		return new ServiceClientProvider( this.appInstance, id, orgId, config ).createClient();
	}

	public updateServiceClient ( id: string, config: Config ): Observable<ServiceClient> {
		return new ServiceClientProvider( this.appInstance, id, "", config ).updateClient();
	}

	public removeServiceClientById ( id: string ): Observable<boolean> {
		return new ServiceClientProvider( this.appInstance, id ).removeClient();
	}




	public isApplicationClient ( id: string ): Observable<string> {
		return new ApplicationClientProvider( this.appInstance, id ).clientExists().mapTo( ClientService.IsAppliaction );
	}

	public getApplicationClientById ( id: string ): Observable<ApplicationClient> {
		return new ApplicationClientProvider( this.appInstance, id ).getClient();
	}

	public getApplicationClientByAppName ( appName: string ): Observable<ApplicationClient> {
		return new ApplicationClientProvider( this.appInstance ).getClientByAppName( appName );
	}

	public createApplicationClient ( id: string, config: Config ): Observable<ApplicationClient> {
		return new ApplicationClientProvider( this.appInstance, id, config ).createClient();
	}

	public updateApplicationClient ( id: string, config: Config ): Observable<ApplicationClient> {
		return new ApplicationClientProvider( this.appInstance, id, config ).updateClient();
	}

	public removeApplicationClientById ( id: string ): Observable<boolean> {
		return new ApplicationClientProvider( this.appInstance, id ).removeClient();
	}

}