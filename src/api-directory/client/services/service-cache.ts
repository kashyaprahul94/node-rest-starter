import * as CacheManager from "node-cache";
import { Observable } from "rxjs/Observable";

import { Logger } from "@sap/loyalty/common/logger";

import { ClientEventManager, ClientEventsType, IServiceClientSubject } from "./events";
import { ClientErrorFactory, ClientErrors } from "./error";
import { ServiceClient } from "../models/service-client";


export class ServiceCacheManager {

	private cacheManager: CacheManager;
	private static DelimiterKey: string = "_client_service_";

	private static _Instance: ServiceCacheManager = null;

	private constructor () {

		this.cacheManager = new CacheManager({
			checkperiod: 0,
			stdTTL: 0
		});

		ClientEventManager.ServiceClientObserver.subscribe( this.onClientChanged );
	}

	public static Instance (): ServiceCacheManager {
		if ( ! ServiceCacheManager._Instance ) {
			ServiceCacheManager._Instance = new ServiceCacheManager();
		}
		return ServiceCacheManager._Instance;
	}




	private static GetCacheKey ( path: string, version: string ): string {
		return [ path, version ].join( ServiceCacheManager.DelimiterKey );
	}


	public getClient ( path: string, version: string ): Observable<ServiceClient> {
		Logger.Info( "Trying to Serve Service Client from Cache" );
		const result: ServiceClient | undefined = this.cacheManager.get( ServiceCacheManager.GetCacheKey( path, version ) );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
	}

	private createClient ( path: string, version: string, client: ServiceClient ): Observable<boolean> {
		Logger.Info( "Trying to Creating Service Client to Cache" );
		const result: boolean = this.cacheManager.set( ServiceCacheManager.GetCacheKey( path, version ), client );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.Unknown ) );
	}

	private updateClient ( path: string, version: string, client: ServiceClient ): Observable<boolean> {
		Logger.Info( "Trying to Update Service Client to Cache" );
		const result: boolean = this.cacheManager.set( ServiceCacheManager.GetCacheKey( path, version ), client );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.Unknown ) );
	}

	private deleteClient ( path: string, version: string ): Observable<number> {
		Logger.Info( "Deleting Service Client from Cache" );
		const result: number = this.cacheManager.del( ServiceCacheManager.GetCacheKey( path, version ) );
		return result ? Observable.of( result ): Observable.throw( ClientErrorFactory.Get( ClientErrors.NotFound ) );
	}



	private onClientCreated = ( client: ServiceClient ) => {
		this.createClient( client.getURI().getPath(), client.getURI().getVersion(), client );
	};
	private onClientUpdated = ( client: ServiceClient ) => {
		this.updateClient( client.getURI().getPath(), client.getURI().getVersion(), client );
	};
	private onClientDeleted = ( client: ServiceClient ) => {
		this.deleteClient( client.getURI().getPath(), client.getURI().getVersion() );
	};


	private onClientChanged = ( source: IServiceClientSubject ) => {
		if ( source.type === ClientEventsType.Created ) {
			this.onClientCreated( source.client );
		} else if ( source.type === ClientEventsType.Updated ) {
			this.onClientUpdated( source.client );
		} else if ( source.type === ClientEventsType.Deleted ) {
			this.onClientDeleted( source.client );
		}
	};
}