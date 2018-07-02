import { Observable } from "rxjs/Observable";

import { App } from "@sap/loyalty/api-directory/app";

import { ServiceClient, ApplicationClient, ClientService, Config, Credentials, ClientErrorFactory, ClientErrors } from "@sap/loyalty/api-directory/client";
import { ICatalog, Catalog, CatalogPlan } from "../catalog";

export class BrokerDelegate {

	private appInstance: App.Type;
	private catalog: Catalog;

	public constructor ( appInstance: App.Type ) {
		this.appInstance = appInstance;
		this.catalog = new Catalog( this.appInstance.getBrokerCatalog() );
	}


	public getCatalogItems (): ICatalog {
		return this.catalog.items();
	}

	public createServiceInstance ( serviceInstanceId: string, orgId: string, planId: string, config: Config ): Observable<Credentials> {

		const clientService: ClientService = new ClientService(
			this.appInstance
		);

		const plan: CatalogPlan = this.catalog.whichPlan( planId );

		if ( plan === CatalogPlan.Service ) {
			return clientService.createServiceClient( serviceInstanceId, orgId, config )
				.map( ( client: ServiceClient ) => {
					return client.generateCredentials();
				})
			;
		} else {
			return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
		}
	}

	public updateServiceInstance ( serviceInstanceId: string, config: Config ): Observable<Credentials> {

		const clientService: ClientService = new ClientService( this.appInstance );

		return clientService.isServiceClient( serviceInstanceId )
			.catch( () => {
				return clientService.isApplicationClient( serviceInstanceId );
			})
			.flatMap( ( clientType: string ) => {
				if ( clientType === ClientService.IsService ) {
					return clientService.updateServiceClient( serviceInstanceId, config );
				} else if ( clientType === ClientService.IsAppliaction ) {
					return clientService.updateApplicationClient( serviceInstanceId, config );
				} else {
					return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
				}
			})
			.map( ( client: ServiceClient | ApplicationClient ) => {
				return client.generateCredentials();
			})
		;
	}

	public deleteServiceInstance ( serviceInstanceId: string ): Observable<boolean> {

		const clientService: ClientService = new ClientService(
			this.appInstance
		);

		return clientService.isServiceClient( serviceInstanceId )
			.catch( () => {
				return clientService.isApplicationClient( serviceInstanceId );
			})
			.flatMap( ( clientType: string ) => {
				if ( clientType === ClientService.IsService ) {
					return clientService.removeServiceClientById( serviceInstanceId );
				} else if ( clientType === ClientService.IsAppliaction ) {
					return clientService.removeApplicationClientById( serviceInstanceId );
				} else {
					return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
				}
			})
		;
	}


	public getServiceBinding ( serviceInstanceId: string ): Observable<Credentials> {

		const clientService: ClientService = new ClientService(
			this.appInstance
		);

		return clientService.isServiceClient( serviceInstanceId )
			.catch( () => {
				return clientService.isApplicationClient( serviceInstanceId );
			})
			.flatMap( ( clientType: string ) => {
				if ( clientType === ClientService.IsService ) {
					return clientService.getServiceClientById( serviceInstanceId )
						.map( ( client: ServiceClient ) => {
							return client.generateCredentials();
						})
					;
				} else if ( clientType === ClientService.IsAppliaction ) {
					return clientService.getApplicationClientById( serviceInstanceId )
						.map( ( client: ApplicationClient ) => {
							return client.generateCredentials();
						})
					;
				} else {
					return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
				}
			})
		;
	}

	public deleteServiceBinding ( serviceInstanceId: string ): Observable<boolean> {

		const clientService: ClientService = new ClientService(
			this.appInstance
		);

		return clientService.isServiceClient( serviceInstanceId )
			.catch( () => {
				return clientService.isApplicationClient( serviceInstanceId );
			})
			.flatMap( ( clientType: string ) => {
				if ( clientType === ClientService.IsService ) {
					return Observable.of( !!( serviceInstanceId ) );
				} else if ( clientType === ClientService.IsAppliaction ) {
					return Observable.of( !!( serviceInstanceId ) );
				} else {
					return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
				}
			})
		;
	}

}