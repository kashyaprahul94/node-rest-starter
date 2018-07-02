import { Observable } from "rxjs/Observable";

import { App } from "@sap/loyalty/api-directory/app";
import { BasicAuth, BasicAuthProvider, OAuth2Clone, OAuth2Binding, OAuth2Provider } from "@sap/loyalty/api-directory/auth";

import { Config } from "../interfaces";
import { ServiceClient, URI, Auth } from "../models";
import { ServiceRepository } from "./service-repository";
import { ClientErrorFactory, ClientErrors } from "./error";
import { ClientEventManager } from "./events";
import { ServiceCacheManager } from "./service-cache";


export class ServiceClientProvider {

	protected appInstance: App.Type;
	protected serviceInstanceId: string;
	protected orgId: string;
	protected config: Config;

	private basicAuthProvider: BasicAuthProvider;
	private oAuth2Provider: OAuth2Provider;
	private repository: ServiceRepository;
	private cacheManager: ServiceCacheManager;

	public constructor ( appInstance: App.Type, serviceInstanceId: string = "", orgId: string = "", config: Config = null ) {

		this.appInstance = appInstance;
		this.serviceInstanceId = serviceInstanceId;
		this.orgId = orgId;
		this.config = config;

		this.basicAuthProvider = new BasicAuthProvider();
		this.oAuth2Provider = new OAuth2Provider( appInstance.getXSUAAInstance(), serviceInstanceId, orgId );
		this.repository = new ServiceRepository( appInstance.getPersistence() );
		this.cacheManager = ServiceCacheManager.Instance();
	}


	private static GetBaseURI ( config: Config ): string {
		return config.uri.base;
	}






	private doGetClientById ( clientId: string ): Observable<ServiceClient> {
		return Observable.fromPromise(
			this.repository.getClientById( clientId )
		);
	}
	private doGetClientByPath ( path: string, version: string ): Observable<ServiceClient> {
		return this.cacheManager.getClient( path, version ).catch( () => {
			return Observable.fromPromise(
				this.repository.getClientByPath( path, version )
			)
		});
	}


	public getClient (): Observable<ServiceClient> {
		return this.doGetClientById( this.serviceInstanceId )
			.catch( () => {
				return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
			})
			.do( ( client: ServiceClient ) => {
				ClientEventManager.ServiceClientUpdated( client );
			})
		;
	}

	public getClientByPath ( path: string, version: string ): Observable<ServiceClient> {
		return this.doGetClientByPath( path, version )
			.catch( () => {
				return Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
			})
			.do( ( client: ServiceClient ) => {
				ClientEventManager.ServiceClientUpdated( client );
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




	private doCreateClient (): Observable<ServiceClient> {

		const serviceClient: ServiceClient = new ServiceClient();

		return Observable.zip(
			Observable.of( this.basicAuthProvider.generate() ),
			Observable.from( this.oAuth2Provider.generate() )
		)
			.map( ( authProviders: any[] ) => {
				const basicCredentials: BasicAuth = <BasicAuth>authProviders[ 0 ];
				const oauth2Credentials: OAuth2Binding = <OAuth2Binding>authProviders[ 1 ];
				serviceClient.setAuth(
					new Auth()
						.setBasic( basicCredentials )
						.setOAuth2( oauth2Credentials.setScopes( this.oAuth2Provider.decorateScopes() ) )
				);
				return serviceClient;
			})
			.map( (  ) => {
				return serviceClient
					.setURI(
						new URI(
							null,
							null,
							ServiceClientProvider.GetBaseURI( this.config ),
							ServiceClientProvider.GetBaseURI( this.config )
						)
					)
				;
			})
			.map( (  ) => {
				return serviceClient
					.setId( this.serviceInstanceId )
					.setOrgId( this.orgId )
				;
			})
			.do( ( serviceClient: ServiceClient ) => {
				return Observable.fromPromise(
					this.repository.createClient( serviceClient )
				);
			})
			.do( () => {
				ClientEventManager.ServiceClientCreated( serviceClient );
			})
			.map( (  ) => {
				return serviceClient;
			})
		;
	}


	public createClient (): Observable<ServiceClient> {
		return this.isUniqueClient()
			.flatMap( () => {
				return this.doCreateClient();
			})
		;
	}





	private doUpdateClient ( input: ServiceClient ): Observable<ServiceClient> {
		let result: ServiceClient = input;
		return Observable.of( input )
			.map( ( client: ServiceClient ) => {
				return client.setAuth( client.getAuth().setOAuth2( client.getAuth().getOAuth2().setScopes( this.oAuth2Provider.decorateScopes() ) ) );
			})
			.flatMap( ( client: ServiceClient ) => {
				result = client;
				return Observable.fromPromise( this.repository.updateClient( client ) );
			})
			.do( () => {
				ClientEventManager.ServiceClientUpdated( result );
			})
			.map( () => {
				return result;
			})
		;
	}


	public updateClient (): Observable<ServiceClient> {
		return this.doGetClientById( this.serviceInstanceId )
			.flatMap( ( client: ServiceClient ) => {
				return this.doUpdateClient( client );
			})
		;
	}








	private doRemoveClient ( client: ServiceClient ): Observable<boolean> {
		return Observable.forkJoin(
			this.oAuth2Provider.remove( client.getId() ),
			Observable.fromPromise(
				this.repository.deleteClient( client.getId(), client )
			)
		)
			.do( () => {
				ClientEventManager.ServiceClientDeleted( client );
			})
			.map( () => {
				return true;
			})
		;
	}

	public removeClient (): Observable<boolean> {
		return this.getClient()
			.flatMap( ( client: ServiceClient ) => {
				return this.doRemoveClient( client );
			})
		;
	}
}