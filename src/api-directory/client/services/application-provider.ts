import { Observable } from "rxjs/Observable";

import { App } from "@sap/loyalty/api-directory/app";

import { Config } from "../interfaces";
import { ApplicationClient, URI, Auth } from "../models";
import { ApplicationRepository } from "./application-repository";
import { ClientErrorFactory, ClientErrors } from "./error";
import { ApplicationCacheManager } from "./application-cache";
import { ClientEventManager } from "./events";

export class ApplicationClientProvider {

	protected appInstance: App.Type;
	protected serviceInstanceId: string;
	protected config: Config;

	private repository: ApplicationRepository;
	private cacheManager: ApplicationCacheManager;


	public constructor ( appInstance: App.Type, serviceInstanceId: string = "", config: Config = null ) {

		this.appInstance = appInstance;
		this.serviceInstanceId = serviceInstanceId;
		this.config = config;

		this.serviceInstanceId = serviceInstanceId;
		this.repository = new ApplicationRepository( appInstance.getPersistence() );
		this.cacheManager = ApplicationCacheManager.Instance();
	}




	private static GetCurrentURI ( appInstance: App.Type ): string {
		return appInstance.getConfig().env.url;
	}
	private static GetBaseURI ( config: Config ): string {
		return config.uri.base;
	}



	private doGetClientById ( clientId: string ): Observable<ApplicationClient> {
		return Observable.fromPromise(
			this.repository.getClientById( clientId )
		);
	}
	private doGetClientByAppName ( appName: string ): Observable<ApplicationClient> {
		return this.cacheManager.getClient( appName ).catch( () => {
			return Observable.fromPromise(
				this.repository.getClientByAppName( appName )
			)
		});
	}


	public getClient (): Observable<ApplicationClient> {
		return this.doGetClientById( this.serviceInstanceId )
			.catch( () => {
				return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
			})
			.do( ( client: ApplicationClient ) => {
				ClientEventManager.ApplicationClientUpdated( client );
			})
		;
	}

	public getClientByAppName ( appName: string ): Observable<ApplicationClient> {
		return this.doGetClientByAppName( appName )
			.catch( () => {
				return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
			})
			.do( ( client: ApplicationClient ) => {
				ClientEventManager.ApplicationClientUpdated( client );
			})
		;
	}




	public clientExists (): Observable<boolean> {
		return Observable.fromPromise(
			this.repository.clientExists( this.serviceInstanceId )
		);
	}

	private isUniqueClient (): Observable<boolean> {
		return Observable.fromPromise(
			Promise.resolve( !!( this.serviceInstanceId ) )
			//this.repository.isUniqueClient( clientId )
		);
	}




	private doCreateClient (): Observable<ApplicationClient> {

		const applicationClient: ApplicationClient = new ApplicationClient();

		return Observable.of( applicationClient )
			.map( ( applicationClient: ApplicationClient ) => {
				return applicationClient
					.setURI( new URI(
							null,
							null,
							ApplicationClientProvider.GetBaseURI( this.config ),
							null
						)
					)
				;
			})
			.map( (  ) => {
				return applicationClient
					.setId( this.serviceInstanceId )
				;
			})
			.do( ( applicationClient: ApplicationClient ) => {
				return Observable.fromPromise(
					this.repository.createClient( applicationClient )
				);
			})
			.do( () => {
				ClientEventManager.ApplicationClientCreated( applicationClient );
			})
			.map( (  ) => {
				return applicationClient;
			})
		;
	}


	public createClient (): Observable<ApplicationClient> {
		return this.isUniqueClient()
			.flatMap( () => {
				return this.doCreateClient();
			})
		;
	}




	private doUpdateClient ( input: ApplicationClient ): Observable<ApplicationClient> {
		let result: ApplicationClient = input;
		return Observable.of( input )
			.flatMap( ( client: ApplicationClient ) => {
				result = client;
				return Observable.fromPromise( this.repository.updateClient( client ) );
			})
			.do( () => {
				ClientEventManager.ApplicationClientUpdated( result );
			})
			.map( () => {
				return result;
			})
		;
	}


	public updateClient (): Observable<ApplicationClient> {
		return this.doGetClientById( this.serviceInstanceId )
			.flatMap( ( client: ApplicationClient ) => {
				return this.doUpdateClient( client );
			})
		;
	}





	private doRemoveClient ( client: ApplicationClient ): Observable<boolean> {
		return Observable.fromPromise(
			this.repository.deleteClient( client.getId(), client )
		)
			.do( () => {
				ClientEventManager.ApplicationClientDeleted( client );
			})
			.map( () => {
				return true;
			})
		;
	}

	public removeClient (): Observable<boolean> {
		return this.getClient()
			.flatMap( ( client: ApplicationClient ) => {
				return this.doRemoveClient( client );
			})
		;
	}
}